import Login from './Login.js';
import MCQs from './MCQs.js';

function RouteMaps(p_expressApp) {

   p_expressApp.use('/login', Login);
   p_expressApp.use('/mcqs', MCQs);
}

export default RouteMaps;