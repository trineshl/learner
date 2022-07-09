import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab2.css';
import { Storage } from '@capacitor/storage';

import React, { Component } from 'react'

class Tab2 extends Component {

  async pvtOnLogoutBtnClick() {
    // const LMe = this;

    await Storage.set({
      key: 'studentobject',
      value: '',
    });

    window.location.href = '';
  }

  render() {
    const LMe = this;

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonButton style={{ marginTop: 20 }} shape="round" color="primary" expand="full" onClick={LMe.pvtOnLogoutBtnClick.bind(LMe)}>Logout</IonButton>
        </IonContent>
      </IonPage>
    )
  }
}

export default Tab2;
