import express from "express";
import DbCon from '../DbCon.js';
import { ErrorObj, isEmpty, SuccessObj } from "../Utils.js";

const FRouter = express.Router();

FRouter.put('/', async (p_objReq, p_objRes) => {

   p_objReq = p_objReq || {};

   var LUsername = p_objReq.body.username,
      LPassword = p_objReq.body.password;

   if (isEmpty(LUsername) || isEmpty(LPassword)) {

      return p_objRes.json(ErrorObj({ message: '"Username and Password" both properties are mandatory.' }));
   }//if..

   DbCon.all(`SELECT * FROM students WHERE Username='${LUsername}' AND Password='${LPassword}'`, (p_error, p_response) => {

      if (p_error) {
         return p_objRes.json(ErrorObj(p_error));
      }//if..

      if (isEmpty(p_response)) {
         return p_objRes.json(ErrorObj({ message: '"Username or Password" is incorrect.' }));
      }

      const LStudentObj = p_response[0];

      let LTodaysDate = new Date().setHours(0, 0, 0, 0),
         LExpiryDate = new Date(LStudentObj.Expiry).setHours(0, 0, 0, 0);

      //Date format is saved in DB is "YYYY-MM-DD"
      if (LTodaysDate > LExpiryDate) {
         //Expiry
         return p_objRes.json(ErrorObj({
            message: 'Your app validity is expired, kindly contact your Institute.',
            studentObj: LStudentObj
         }));
      }

      //Success login
      return p_objRes.json(SuccessObj({
         studentObj: LStudentObj
      }));
   });//dbcon..
});

export default FRouter;