import Login from './Login.js';

function RouteMaps(p_expressApp) {

   p_expressApp.use('/login', Login);
}

export default RouteMaps;