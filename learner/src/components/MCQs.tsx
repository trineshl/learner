import { IonAvatar, IonButton, IonItem, IonLabel, IonList } from '@ionic/react';
import { Component } from 'react';
import tnl from '../tnl/tnl';
import GCacheUtils from './CacheUtils';
import Questions from './Questions';

interface infProps {
   OwnerProps: any;
   Response: any;
}

interface infStates {
   QuestionNo: any;
}

export default class MCQs extends Component<infProps, infStates> {

   private FResponseObj: any;

   constructor(props: any) {

      super(props);

      const LMe = this;

      LMe.state = {
         QuestionNo: -1
      };
   }

   pvtGetResponseObj() {
      const LMe = this;

      return LMe.props.Response;
   }

   pvtGetSubjectsList() {
      const LMe = this,
         LMCQTypes = LMe.pvtGetResponseObj()?.mcqTypes,
         LResult: any = [];

      if (tnl.isEmpty(LMCQTypes) === true) {

         return null;
      }//if..

      LMCQTypes.forEach((p_objRecord: { objtype: any; }, p_index: BigInteger) => {

         LResult.push(
            <IonItem
               key={'key' + p_index}
               button
               routerLink={'/tab1/' + p_objRecord.objtype} detail>
               <IonAvatar slot="start">
                  <img src={require(GCacheUtils.GetSyllabusImage(p_objRecord.objtype) + '')} alt="" />
               </IonAvatar>
               <IonLabel>
                  {GCacheUtils.GetSyllabusDispText(p_objRecord.objtype)}
               </IonLabel>
            </IonItem>
         );
      });

      return <IonList>{LResult}</IonList>;
   }

   pvtGetQuestionsSelectionList(p_strCourse: string) {

      const LMe = this,
         LMCQs = LMe.pvtGetResponseObj()?.mcqs,
         LResult = [];

      if (tnl.isEmpty(LMCQs) === true) {

         return null;
      }//if..

      let LSyllabusMCQs = LMCQs[p_strCourse],
         LAllMCQsLength = LSyllabusMCQs.length,
         LRecord,
         LColor;

      for (let LIndex = 0; LIndex < LAllMCQsLength; LIndex++) {

         LRecord = LSyllabusMCQs[LIndex];

         LColor = 'light';

         if (LRecord.isSolved === true) {
            LColor = 'success';
         }//if..

         LResult.push(<IonButton
            key={'que' + LIndex}
            routerLink={'/tab1/' + p_strCourse + '/' + LIndex}
            color={LColor}>
            {LMe.pad(LIndex + 1, 3)}
         </IonButton>);
      }//for..

      return <div style={{ padding: '20px 15px 100px 15px', textAlign: 'center' }}>{LResult}</div>;
   }

   pad(n: any, length: any) {
      var len = length - ('' + n).length;
      return (len > 0 ? new Array(++len).join('0') : '') + n
   }

   pvtGetQuestions(p_strCourse: string, p_intQuestionNo: string) {

      const LMe = this,
         LMCQs = LMe.pvtGetResponseObj()?.mcqs,
         LQuestionNo = LMe.state.QuestionNo === -1 ? parseInt(p_intQuestionNo) : LMe.state.QuestionNo;

      if (tnl.isEmpty(LMCQs) === true) {

         return null;
      }//if..

      let LSyllabusMCQ = LMCQs[p_strCourse],
         LQueAnsObj = LSyllabusMCQ[LQuestionNo],
         LSyllabusLen = LSyllabusMCQ.length - 1;

      return <Questions
         QuestionObj={LQueAnsObj}
         QuestionNo={LMe.pad(LQuestionNo + 1, 3)}
         OwnerProps={LMe.props.OwnerProps}
         HandleOnNextClick={() => {

            LQueAnsObj.isSolved = true;

            let LNextQuestionNo = LQuestionNo + 1;

            if (LNextQuestionNo > LSyllabusLen) {
               LNextQuestionNo = 0;
            }

            LMe.setState({ QuestionNo: LNextQuestionNo });
            return '';
         }}
         HandleOnPrevClick={() => {

            let LPrevQuestionNo = LQuestionNo - 1;

            if (LPrevQuestionNo < 0) {
               LPrevQuestionNo = LSyllabusLen;
            }

            LMe.setState({ QuestionNo: LPrevQuestionNo });
            return '';
         }}
      ></Questions>
   }

   pvtGetUI() {

      const LMe = this,
         LOwnerProps = LMe.props?.OwnerProps || {};

      let LParam = LOwnerProps?.match?.params || {};

      if (tnl.isEmpty(LParam.course) === true) {

         //Here means the URL not contains any param
         return LMe.pvtGetSubjectsList();
      }//if..

      //Here means the URL contains the param

      if (tnl.isEmpty(LParam.questionId)) {
         //Here means the URL not contains the question no
         return LMe.pvtGetQuestionsSelectionList(LParam.course);
      }

      //Here means the URL contains both params
      return LMe.pvtGetQuestions(LParam.course, LParam.questionId);
   }

   render() {

      const LMe = this;

      return (
         <div style={{ height: '100%' }} className="VBox">
            {LMe.pvtGetUI()}
         </div>
      );
   }
}