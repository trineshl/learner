import React, { Component } from 'react'

import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar, IonLoading } from '@ionic/react';
import tnl from '../tnl/tnl';
import GCacheUtils from '../components/CacheUtils';

interface infStates {

   CanShowErrorMsg: boolean;
   UserName: string;
   Password: string;
   IsLoading: boolean;
   ShowServerURLBox: boolean;
   ServerURL: string;
}

export default class LoginPg extends Component<{}, infStates> {

   private FErrorMessage: any;

   constructor(props: any) {

      super(props);

      const LMe = this;

      LMe.state = {
         CanShowErrorMsg: false,
         UserName: '',
         Password: '',
         IsLoading: false,
         ShowServerURLBox: false,
         ServerURL: GCacheUtils.BaseUrl()
      };

      LMe.FErrorMessage = 'Email and Password must be entered!';
   }

   pvtOnLoginBtnClick() {

      const LMe = this;

      if (tnl.isEmpty(LMe.state.UserName)) {

         LMe.FErrorMessage = 'Email must be entered!';
         LMe.setState({ CanShowErrorMsg: true });
         return;
      }

      if (tnl.isEmpty(LMe.state.Password)) {

         LMe.FErrorMessage = 'Password must be entered!';
         LMe.setState({ CanShowErrorMsg: true });
         return;
      }

      if (LMe.state.ShowServerURLBox === true) {

         if (tnl.isEmpty(LMe.state.ServerURL)) {
            LMe.FErrorMessage = 'Server URL must be entered!';
            LMe.setState({ CanShowErrorMsg: true });
            return;
         }

         GCacheUtils.SetBaseUrl(LMe.state.ServerURL);
      }

      LMe.setState({ IsLoading: true });

      LMe.pvtFireLoginCmd({
         username: LMe.state.UserName,
         password: LMe.state.Password
      });
   }

   pvtFireLoginCmd(p_objParameters: Object) {
      /**
       * @method pvtFetchInvoiceTypes
       * This function will fetch the invoice types
       * and sets in genutils cache
       */
      p_objParameters = p_objParameters || {};

      var LMe = this,
         LRequestOptions,
         LUrl;

      LUrl = GCacheUtils.BaseUrl() + 'login';

      LRequestOptions = {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(p_objParameters)
      };

      // No need to check for session
      fetch(LUrl, LRequestOptions)
         .then((response) => response.json())
         .then(
            async (responseJson) => {

               if (responseJson.success === false) {
                  LMe.FErrorMessage = responseJson.message;

                  LMe.setState({
                     IsLoading: false,
                     CanShowErrorMsg: true
                  });
                  return;
               }

               GCacheUtils.Login(responseJson.studentObj);

               LMe.setState({
                  IsLoading: false,
                  CanShowErrorMsg: false
               });
            },
            (error) => {

               LMe.FErrorMessage = <span>You are not connected to the server.<br />
                  <span className="BlueLink" onClick={() => LMe.setState({ ShowServerURLBox: true })}>Do you want to change server URL?</span></span>;

               LMe.setState({
                  IsLoading: false,
                  CanShowErrorMsg: true
               });
            }
         );
   }

   render() {

      const LMe = this;

      return (
         <IonPage>
            <IonHeader>
               <IonToolbar color="primary">
                  <IonTitle>Login</IonTitle>
               </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>

               <div style={{ margin: '100px 20px 0 20px' }}>
                  <IonItem>
                     <IonLabel position="floating">Enter Username</IonLabel>
                     <IonInput value={LMe.state.UserName} onIonChange={e => LMe.setState({ UserName: e.detail.value! })} ></IonInput>
                  </IonItem>
                  <IonItem style={{ margin: '20px 0 0 0' }}>
                     <IonLabel position="floating">Enter Password</IonLabel>
                     <IonInput value={LMe.state.Password} onIonChange={e => LMe.setState({ Password: e.detail.value! })} type="password"></IonInput>
                  </IonItem>

                  <IonItem style={{ margin: '20px 0 0 0', display: LMe.state.ShowServerURLBox ? 'block' : 'none' }}>
                     <IonLabel position="floating">Server URL</IonLabel>
                     <IonInput value={LMe.state.ServerURL} onIonChange={e => LMe.setState({ ServerURL: e.detail.value! })} ></IonInput>
                  </IonItem>

                  <div style={{ margin: '20px 0 0 0' }}>
                     <span style={{ margin: '0 6px 5px 8px', color: 'red', fontSize: 'small', display: (LMe.state.CanShowErrorMsg ? 'inline-block' : 'none') }}
                        className="HelpText">{LMe.FErrorMessage}</span>

                     <IonButton shape="round" color="primary" expand="full" onClick={LMe.pvtOnLoginBtnClick.bind(LMe)}>Login</IonButton>
                  </div>
               </div>
               <IonLoading
                  isOpen={LMe.state.IsLoading}
                  onDidDismiss={() => { LMe.setState({ IsLoading: false }) }}
                  message={'Logging in, please wait...'}
               />
            </IonContent>
         </IonPage>
      )
   }
}
