import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab2.css';
// import { Storage } from '@capacitor/storage';

import { Component } from 'react';
import GCacheUtils from '../components/CacheUtils';
import tnl from '../tnl/tnl';

interface infStates {

  Name: string;
  Course: string;
  UserName: string
}

class Tab2 extends Component<{}, infStates> {

  constructor(props: any) {

    super(props);

    const LMe = this;

    LMe.state = {
      Name: '',
      Course: '',
      UserName: ''
    };
  }

  componentDidMount() {

    const LMe = this;

    GCacheUtils.GetLoggedInStudentObject().then((p_objStudent: any) => {

      p_objStudent = p_objStudent || {};

      if (tnl.isObjEmpty(p_objStudent)) {

        return;
      }//if..

      LMe.setState({
        Name: p_objStudent.Name,
        Course: p_objStudent.Course,
        UserName: p_objStudent.Username
      });
    });
  }

  async pvtOnLogoutBtnClick() {
    // const LMe = this;

    GCacheUtils?.LogOut();
  }

  render() {
    const LMe = this;

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <div style={{ margin: '50px 20px 0 20px' }}>
            <IonItem style={{ marginTop: 20 }}>
              <IonLabel position="floating">Name</IonLabel>
              <IonInput readonly={true} value={LMe.state.Name} ></IonInput>
            </IonItem>
            <IonItem style={{ marginTop: 20 }}>
              <IonLabel position="floating">Username</IonLabel>
              <IonInput readonly={true} value={LMe.state.UserName} ></IonInput>
            </IonItem>
            <IonItem style={{ marginTop: 20 }}>
              <IonLabel position="floating">Course</IonLabel>
              <IonInput readonly={true} value={LMe.state.Course} ></IonInput>
            </IonItem>
            <div style={{ textAlign: 'center' }}>
              <IonButton style={{ marginTop: 40 }} shape="round" color="danger" onClick={LMe.pvtOnLogoutBtnClick.bind(LMe)}>Logout</IonButton>
            </div>
          </div>
        </IonContent>
      </IonPage>
    )
  }
}

export default Tab2;
