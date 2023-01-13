import express from "express";
import DbCon from '../DbCon.js';
import { ErrorObj, isEmpty, SuccessObj } from "../Utils.js";

const FRouter = express.Router();

FRouter.get('/', async (p_objReq, p_objRes) => {

   DbCon.all(`SELECT * FROM students ORDER BY id DESC`, (p_error, p_arrResponse) => {

      if (p_error) {
         return p_objRes.json(ErrorObj(p_error));
      }//if..

      if (isEmpty(p_arrResponse)) {
         return p_objRes.json(ErrorObj({ message: 'Students not found.' }));
      }

      //Success login
      return p_objRes.json(SuccessObj({
         students: p_arrResponse
      }));
   });//dbcon..
});

FRouter.put('/', async (p_objReq, p_objRes) => {

   let LParams = p_objReq.body;
   // update one row into the langs table
   DbCon.run(`UPDATE students SET Name='${LParams.name}', Course='${LParams.course}', Username='${LParams.username}',
   Password='${LParams.password}', Expiry='${LParams.expiry}' WHERE id=${LParams.id}`, [], function (p_error) {
      if (p_error) {

         return p_objRes.status(500).json(ErrorObj(p_error));
      }//if..

      //Success login
      return p_objRes.json(SuccessObj({
         id: LParams.id
      }));
   });
});

FRouter.post('/', async (p_objReq, p_objRes) => {

   let LParams = p_objReq.body;

   let LSql = `INSERT INTO students (Name, Course, Username, Password, Expiry) VALUES
    ('${LParams.name}', '${LParams.course}', '${LParams.username}', '${LParams.password}', '${LParams.expiry}')`;

   // update one row into the langs table
   DbCon.run(LSql, [], function (p_error) {
      if (p_error) {

         return p_objRes.status(500).json(ErrorObj(p_error));
      }//if..

      //Success login
      return p_objRes.json(SuccessObj({
         id: this.lastID
      }));
   });
});

FRouter.delete('/:id', async (p_req, p_res) => {

   let LStudentId = parseInt(p_req.params.id);
   // delete one row into the langs table
   DbCon.run(`DELETE FROM students WHERE id=${LStudentId}`, [], function (p_error) {

      if (p_error) {

         return p_res.status(500).json(ErrorObj(p_error));
      }//if..

      return p_res.json(SuccessObj({
         id: LStudentId
      }));
   });
});

export default FRouter;