import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from '../../components/title';
// import Link from '@material-ui/core/Link';
import { authenticationService, usersService } from '../../services';
import { withStyles } from "@material-ui/core";
import { styles } from "../../css-common";
import Moment from 'moment';
import TablePagination from '@material-ui/core/TablePagination';
import TableContainer from '@material-ui/core/TableContainer';
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {CanvasJSChart} from 'canvasjs-react-charts'


class Home extends Component {
    defaultPerPage = 20;
    constructor(props) {
        super(props);
        // add filter name , id , email
        this.state = {
            currentUser: authenticationService.currentUserValue,
            perpage: this.defaultPerPage,
            page: 0,
            total: 0,
            last_page: 1,
            dialogOpened: false,
            anchorEl: null,
            averagePeriod: '',
            users: [],
            graphOptions: null,
            order: 'asc',
            orderBy: 'name',
            headCells : [
              {  id: "id", label: "ID", filter: "" },
              {  id: "name", label: "Name", filter: "" },
              {  id: "email", label: "Email", filter: "" },
              {  id: "created_at", date: true, label: "Created Date", filter: "" }
            ]
        };
    }
    createData(id, created_at, name, email) {
      return { id, created_at, name, email };
    }
    componentDidMount() {
      this.seeMore(undefined, 0);
    }
    handleOpenDialog(status, period = undefined) {
      if(period){
        usersService.getAverage(period.value).then((data) => {
          if(data){
            // console.log('data', data);
            let options = {
        			animationEnabled: true,
        			exportEnabled: true,
        			theme: "light2", //"light1", "dark1", "dark2"
        			title:{
        				text: period.display
        			},
              axisY:{
        				includeZero: true,
                valueFormatString: "#,###,#0", //try properties here
              },
              axisX:{
                valueFormatString: "#"
              },
        			data: [{
        				type: "column", //change type to bar, line, area, pie, etc
        				//indexLabel: "{y}", //Shows y value on all Data Points
        				indexLabelFontColor: "#5A5757",
        				indexLabelPlacement: "outside",
        				dataPoints: [
        				]
        			}]
        		}
            let dataPoints = [];
            if(period.value === 'day'){
              for(let pt of data.data){
                dataPoints.push({ x: pt.hour, y: pt.count});
              }
            }else if (period.value === 'week'){
              for(let pt of data.data){
                dataPoints.push({ x: pt.day, y: pt.count});
              }
            }else if (period.value === 'month'){
              for(let pt of data.data){
                dataPoints.push({ x: pt.week, y: pt.count});
              }
            }else if (period.value === '3month'){
              for(let pt of data.data){
                dataPoints.push({ x: pt.month, y: pt.count});
              }
            }else if (period.value === 'year' || period.value === 'alltime'){
              for(let pt of data.data){
                dataPoints.push({ x: pt.year, y: pt.count});
              }
            }

            options.data[0].dataPoints = dataPoints;
            this.setState({ dialogOpened: status, averagePeriod: period.display, graphOptions : options });
          }else{
            this.setState({ dialogOpened: status, averagePeriod: period.display, graphOptions:  null});
          }
        });
      }else{
        this.setState({ dialogOpened: status, averagePeriod: '', graphOptions: null });
      }
    }
    handleOpenMenu(anchorEl) {
      if(anchorEl){
        this.setState({ anchorEl: anchorEl.currentTarget });
      }else{
        this.setState({ anchorEl: null });
      }

    }
    seeMore(event, page, perpage = this.defaultPerPage, order = 'asc', orderBy = 'name', headCells = this.state.headCells ) {
      if(page <= this.state.last_page){
        usersService.getAll(page+1, perpage, order, orderBy, headCells).then((users) => {
          this.setState({ users: users.data, page: page, perpage: perpage, order: order, orderBy: orderBy,last_page: users.last_page, total: users.total, headCells: headCells });
        });
      }
    }
    handleChangeRowsPerPage(perpage = this.defaultPerPage) {
      this.seeMore(undefined, 0, perpage, this.state.order, this.state.orderBy);
    }
    createSortHandler(e, orderBy) {
      let order = 'asc';
      if(this.state.order === 'asc'){
        order = 'desc';
      }else{
        order = 'asc';
      }
      this.seeMore(undefined, this.state.page, this.state.perpage, order, orderBy);
    }
    createFilterHandler(e,index, id) {
      let data = this.state.headCells;
      data[index].filter = e.target.value;
      this.seeMore(undefined, this.state.page, this.state.perpage, this.state.order, this.state.orderBy, data);
    }

    render() {
      const { classes}  = this.props;
      const { users, page, perpage, dialogOpened, anchorEl, averagePeriod, graphOptions, headCells, order, orderBy } = this.state;
      return (
        <React.Fragment>
          <Title>Customers</Title>
          <div  className="averagesBtn">
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => this.handleOpenMenu(e)}>
              Averages
            </Button>
          </div>

          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={(e) => this.handleOpenMenu(false)}
          >
            <MenuItem onClick={(e) => this.handleOpenDialog(true, {value: 'day', display: 'Last 24 Hours'})}>Last 24 Hours</MenuItem>
            <MenuItem onClick={(e) => this.handleOpenDialog(true, {value: 'week', display: 'Last Week'})}>Last Week</MenuItem>
            <MenuItem onClick={(e) => this.handleOpenDialog(true, {value: 'month', display: 'Last Month'})}>Last Month</MenuItem>
            <MenuItem onClick={(e) => this.handleOpenDialog(true, {value: '3month', display: 'Last 3 Months'})}>Last 3 Months</MenuItem>
            <MenuItem onClick={(e) => this.handleOpenDialog(true, {value: 'year', display: 'Last Year'})}>Last Year</MenuItem>
          </Menu>
          <TableContainer className={classes.container} style={{ maxHeight: '68vh' }}>
            <Table stickyHeader size="small" aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {headCells.map(headCell => (
                    <TableCell
                      key={headCell.id}
                      sortDirection={orderBy === headCell.id ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : "asc"}
                        onClick={(e) => this.createSortHandler(e, headCell.id)}
                      >
                        {headCell.label}

                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  {headCells.map((headCell, index) => (
                    <TableCell key={headCell.id} >
                    <TextField id={'outlined-basic-' + index} label={'Filter By ' + headCell.label} variant="filled" size="small" onChange={(e) => this.createFilterHandler(e,index, headCell.id)} value={headCell.filter}/>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                      <TableCell>{Moment(row.created_at).format('YYYY-MM-DD hh:mm a')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className={classes.root}>
          <TablePagination
              component="div"
              count={100}
              page={page}
              rowsPerPageOptions={[20, 40, 60]}
              onChangePage={(e, value) => this.seeMore(e, value)}
              rowsPerPage={perpage}
              onChangeRowsPerPage={(e) => this.handleChangeRowsPerPage(e.target.value)}
            />
          </div>
          <Dialog
           fullWidth={true}
           maxWidth="lg"
           open={dialogOpened}
           onClose={(e) => this.handleOpenDialog(false)}
           aria-labelledby="alert-dialog-title"
           aria-describedby="alert-dialog-description"
         >
           <DialogTitle id="alert-dialog-title">The average for the {averagePeriod}</DialogTitle>
           <DialogContent>
               {(graphOptions !== null ?
                  (
                   <CanvasJSChart options = {graphOptions}/>
                  )
                  : ('')
               )}

           </DialogContent>
           <DialogActions>
             <Button onClick={(e) => this.handleOpenDialog(false)} color="primary" autoFocus>
               Close
             </Button>
           </DialogActions>
         </Dialog>
        </React.Fragment>
      );
    }
}
// <Pagination
//   showFirstButton showLastButton
//   className="my-3"
//   count={last_page}
//   page={page}
//   siblingCount={1}
//   boundaryCount={1}
//   variant="outlined"
//   shape="rounded"
//   onChange={(e, value) => this.seeMore(e, value)}
// />
export default withStyles(styles)(Home)
