import express from 'express';
import cors from 'cors';
import RouteMap from './routes/routes.js';

const expressApp = express();

expressApp.use(cors());
expressApp.use(express.json());

RouteMap(expressApp);

expressApp.get("/", (p_objReq, p_objRes) => {

   p_objRes.send('This is the server page of learner app.');

});

var LPort = 9000;
expressApp.listen(LPort, console.log('Server running on port:' + LPort));