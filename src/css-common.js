export const styles = {
    appBar: {
        backgroundColor: "#343A40",
        height: "50px",
        '& .MuiToolbar-regular': {
            minHeight: "50px"
        }
    },
    name: {
        marginRight: "15px"
    },
    link: {
        textTransform: "unset",
        color: "#a5a5a5",
        margin: "0 20px",
        textDecoration: "unset"
    },
    form: {
        marginLeft: "50px",
        width: '100%', // Fix IE 11 issue.
    },
    textField: {
        margin: "15px 0"
    },
    search: {
        marginTop: "15px"
    },
    detail: {
        margin: "5px 0"
    },
    edit: {
        backgroundColor: "orange",
        border: "4px solid orange",
        borderRadius: "5px",
        textDecoration: "none",
        fontSize: "13px",
        fontWeight: "bold",
        color: "white"
    },
    publish: {
        backgroundColor: "#0062cc",
        "&:hover": {
            backgroundColor: "#0062cc",
            opacity: 0.8
        }
    },
    delete: {
        backgroundColor: "#DD4145",
        "&:hover": {
            backgroundColor: "#DD4145",
            opacity: 0.8
        }
    },
    update: {
        backgroundColor: "#64A845",
        "&:hover": {
            backgroundColor: "#64A845",
            opacity: 0.8
        }
    },
    buttonWrapper: {
        marginTop: "20px"
    },
    button: {
        marginRight: "15px",
        color: "white",
        fontSize: "13px",
        textTransform: "none",
        height: "25px"
    },
    removeAll: {
        marginTop: "20px"
    },
    tutorial: {
        marginLeft: "25px"
    },
    paper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      // margin: theme.spacing(1),
      // backgroundColor: theme.palette.secondary.main,
    },
    submit: {
      // margin: theme.spacing(3, 0, 2),
    },
    seeMore: {
      marginTop: "15px"
    }
};
