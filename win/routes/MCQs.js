import express from "express";
import DbCon from '../DbCon.js';
import { ErrorObj, SuccessObj } from "../Utils.js";

const FRouter = express.Router();

FRouter.get('/:Course', async (p_objReq, p_objRes) => {

   p_objReq = p_objReq || {};

   var LCourse = p_objReq.params.Course;

   pvtGetAllMCQTypes(LCourse).then((p_arrMCQTypes) => {

      let LArrayPromise = [];

      p_arrMCQTypes.forEach((p_objRecord) => {

         LArrayPromise.push(pvtGetMCQsByCourseAndType(LCourse, p_objRecord.objtype));
      });

      Promise.all(LArrayPromise).then((p_arrResult) => {

         let LResult = {};

         p_arrResult.forEach((p_arrQuestions, p_intIndex) => {

            LResult[p_arrMCQTypes[p_intIndex].objtype] = p_arrQuestions;
         });

         //On Success
         return p_objRes.json(SuccessObj({
            mcqTypes: p_arrMCQTypes,
            mcqs: LResult
         }));
      }, (p_Error) => {
         //On Promise Reject
         return p_objRes.json(ErrorObj(p_Error));
      });

   }, (p_Error) => {
      //On Promise Reject
      return p_objRes.json(ErrorObj(p_Error));
   });
});

function pvtGetAllMCQTypes(p_strCourse) {

   const LPromiseAllMCQTypes = new Promise((resolve, reject) => {

      DbCon.all(`SELECT objtype FROM objective WHERE course='${p_strCourse}' GROUP BY objtype;`, (p_error, p_arrResponse) => {

         if (p_error) {
            reject(p_error);
         }//if..

         resolve(p_arrResponse);
      });//dbcon..
   });

   return LPromiseAllMCQTypes;
}

function pvtGetMCQsByCourseAndType(p_strCourse, p_strObjType) {
   const LPromise = new Promise((resolve, reject) => {

      DbCon.all(`SELECT * FROM objective WHERE course='${p_strCourse}' AND objType='${p_strObjType}' ORDER BY id;`, (p_error, p_arrResponse) => {

         if (p_error) {
            reject(p_error);
         }//if..

         resolve(p_arrResponse);
      });//dbcon..
   });

   return LPromise;
}

export default FRouter;