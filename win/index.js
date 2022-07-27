import express from 'express';
import cors from 'cors';
import RouteMap from './routes/routes.js';
import { networkInterfaces } from 'os';

const nets = networkInterfaces();

const expressApp = express();

expressApp.use(cors());
expressApp.use(express.json());

RouteMap(expressApp);

expressApp.get("/", (p_objReq, p_objRes) => {

   p_objRes.send('This is the server page of learner app.');

});

var LPort = 9000;
expressApp.listen(LPort, () => {

   const LWifi = nets['Wi-Fi'];
   let LIp = '',
      LObj;

   for (let LIndex = 0; LIndex < LWifi.length; LIndex++) {

      LObj = LWifi[LIndex];

      if (LObj.family === 'IPv4') {
         LIp = LObj.address;
         break;
      }//if..
   }

   console.log('----------------------------------------------------------');
   console.log('Server running on following information: ');
   console.log('\tIPV4: ' + LIp);
   console.log('\tServer running on Port: ' + LPort);
   console.log('\tServer URL: http://' + LIp + ':' + LPort + '/');
   console.log('----------------------------------------------------------');
});