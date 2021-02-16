import config from '../config.json';
import { authHeader, handleResponse } from './helpers';

export const usersService = {
    getAll,
    getAverage
};

function getAll(page=1, per_page=20, order = 'asc', orderBy = 'name', extraFields = []) {
    let apiUrl = config.apiUrl + 'users?page=' + page + '&per_page=' + per_page + '&order=' + order + '&orderBy=' + orderBy;
    for(let fld of extraFields){
      apiUrl = apiUrl + '&' + fld.id + '_like=' +  fld.filter;
    }
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(apiUrl, requestOptions).then(handleResponse);
}
function getAverage(period) {
    let apiUrl = config.apiUrl + 'averages?period=' + period;
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(apiUrl, requestOptions).then(handleResponse);
}
