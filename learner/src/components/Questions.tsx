import { Component } from 'react';
import { IonFabButton, IonIcon, IonItem, IonItemDivider, IonLabel, IonList, IonListHeader, IonRadio, IonRadioGroup } from '@ionic/react';
import tnl from '../tnl/tnl';
import { arrowBackCircle, arrowForwardCircle } from 'ionicons/icons';

interface infProps {
   QuestionObj: any;
   OwnerProps: any;
   QuestionNo: any;
   HandleOnNextClick: any;
   HandleOnPrevClick: any;
}

interface infStates {
   InMarathi: boolean;
   MarkedAnswer: string;
}

export default class Questions extends Component<infProps, infStates> {

   constructor(props: any) {

      super(props);

      const LMe = this;

      LMe.state = {
         MarkedAnswer: '',
         InMarathi: false
      };
   }

   pvtGetColor(p_intIndex: Number) {

      const LMe = this,
         LQuestionObj = LMe.props.QuestionObj,
         LMarkedAns = parseInt(LMe.state.MarkedAnswer),
         LAnswer = parseInt(LQuestionObj.answer);

      if (LMarkedAns !== p_intIndex) {
         return;
      }//if..

      return LMarkedAns === LAnswer ? 'success' : 'danger';
   }

   pvtGetOptions(p_objQuestion: any, p_boolInMarathi: boolean) {

      const LMe = this;

      let LEnglishOptionProperty = ['optionA', 'optionB', 'optionC', 'optionD'],
         LMarathiOptionProperty = ['optionAMar', 'optionBMar', 'optionCMar', 'optionDMar'],
         LOptionProperties = p_boolInMarathi === true ? LMarathiOptionProperty : LEnglishOptionProperty,
         LOption,
         LResult = [];

      for (let LIndex = 0; LIndex < LEnglishOptionProperty.length; LIndex++) {

         LOption = p_objQuestion[LOptionProperties[LIndex]];

         if (tnl.isEmpty(LOption)) {
            continue;
         }

         LResult.push(
            <IonItem key={'option' + LIndex} color={LMe.pvtGetColor(LIndex)} >
               <IonLabel>{LOption}</IonLabel>
               <IonRadio slot="start" value={LIndex} />
            </IonItem>
         );
      }

      return <div style={{ marginTop: 20 }}>{LResult}</div>;
   }

   pvtRadioChange(event: any) {

      const LMe = this;

      LMe.setState({ MarkedAnswer: event.detail.value });
   }

   render() {
      const LMe = this,
         LQuestionObj = LMe.props.QuestionObj;

      return (
         <div className="Flex1 VBox">
            <IonList>
               <IonItemDivider>
                  <div className="HBox Flex1" >
                     <div>Question No. {LMe.props.QuestionNo}</div>
                     <span className="Flex1"></span>
                     <span style={{ marginRight: 10 }} className="BlueLink" onClick={() => LMe.setState({ InMarathi: !LMe.state.InMarathi })}>{LMe.state.InMarathi ? 'In English' : 'In Marathi'}</span>
                  </div>
               </IonItemDivider>

               <div style={{ margin: 10 }}>
                  <IonRadioGroup value={LMe.state.MarkedAnswer} onIonChange={e => LMe.pvtRadioChange(e)}>
                     <IonListHeader>
                        <IonLabel>{LMe.state.InMarathi === false ? LQuestionObj.question : LQuestionObj.questionMar}</IonLabel>
                     </IonListHeader>

                     {LMe.pvtGetOptions(LQuestionObj, LMe.state.InMarathi)}
                  </IonRadioGroup>
               </div>
            </IonList>

            <div className="Flex1"></div>

            <div className="HBox" style={{ padding: '0 10px 20px 10px' }}>
               <IonFabButton onClick={() => {
                  LMe.props.HandleOnPrevClick();
                  LMe.setState({ MarkedAnswer: '' });
               }}>
                  <IonIcon icon={arrowBackCircle} />
               </IonFabButton>
               <div className="Flex1"></div>
               <IonFabButton onClick={() => {
                  LMe.props.HandleOnNextClick();
                  LMe.setState({ MarkedAnswer: '' });
               }}>
                  <IonIcon icon={arrowForwardCircle} />
               </IonFabButton>
            </div>
         </div>
      )
   }
}
