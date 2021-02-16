import { authenticationService } from '../';

export function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                authenticationService.logout();
                // console.log('pass');
                window.location.href = "/login";
                // location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}
export function handleError(response) {
  console.log(response);
  authenticationService.logout();
  window.location.href = "/login";
  // return Promise.reject(response);
}
