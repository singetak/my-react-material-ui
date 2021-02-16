import { BehaviorSubject } from 'rxjs';

import config from '../config.json';
import { authHeader, handleResponse } from './helpers';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    logout,
    DBlogout,
    register,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

function login(email, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password})
    };
    return fetch(`${config.apiUrl}auth/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            let userStore = user.user;
            userStore['token'] = user.access_token;
            localStorage.setItem('currentUser', JSON.stringify(userStore));
            currentUserSubject.next(userStore);

            return user;
        })
}

function register(currentRegisteredUser) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentRegisteredUser)
    };
    return fetch(`${config.apiUrl}auth/register`, requestOptions)
        .then(handleResponse)
        .then(user => {

            let userStore = user.user;
            localStorage.setItem('registeredUser', JSON.stringify(userStore));
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            return user;
        })
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}
function DBlogout() {
  const requestOptions = {
      method: 'POST',
      headers: authHeader(),
  };
  return fetch(`${config.apiUrl}auth/logout`, requestOptions)
      .then(handleResponse)
      .then(message => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          // remove user from local storage to log user out
          localStorage.removeItem('currentUser');
          currentUserSubject.next(null);

          return message;
      })
}
