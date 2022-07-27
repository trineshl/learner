import Login from './Login.js';
import MCQs from './MCQs.js';
import Students from './Students.js';

function RouteMaps(p_expressApp) {

   p_expressApp.use('/login', Login);
   p_expressApp.use('/mcqs', MCQs);
   p_expressApp.use('/students', Students);
}

export default RouteMaps;