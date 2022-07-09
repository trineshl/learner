import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { person, home } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import LoginPg from './pages/LoginPg';
import { Component } from 'react';
import { Storage } from '@capacitor/storage';
import tnl from './tnl/tnl';
import './tnl/tnl.css';

setupIonicReact();

interface infStates {

  IsSessionExists: boolean;
}

interface infStorage {
  Expiry: string;
}

export class App extends Component<{}, infStates> {

  constructor(props: any) {

    super(props);

    const LMe = this;

    LMe.state = {
      IsSessionExists: false
    };
  }

  componentDidMount() {
    const LMe = this;

    LMe.pvtCheckSession();
  }

  async pvtCheckSession() {

    const LMe = this;

    let LStudentObj = await Storage.get({ key: 'studentobject' });

    LStudentObj = JSON.parse(LStudentObj.value || '{}') || {};

    if (tnl.isObjEmpty(LStudentObj)) {

      return;//means user is not logged in
    }//if..

    var LStudent: any = LStudentObj;

    //Check for expiry
    if (tnl.isEmpty(LStudent.Expiry)) {

      return;
    }//if..

    if (new Date() > new Date(LStudent.Expiry)) {

      return;
    }//if..

    //Here means, user is logged in
    LMe.setState({ IsSessionExists: true });
  }

  pvtGetLoginPage() {

    return (
      <LoginPg />
    );
  }

  pvtGetTabPanel() {

    return (
      <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/tab1">
                <Tab1 />
              </Route>
              <Route exact path="/tab2">
                <Tab2 />
              </Route>
              <Route exact path="/">
                <Redirect to="/tab1" />
              </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="tab1" href="/tab1">
                <IonIcon icon={home} />
                <IonLabel>Home</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab2" href="/tab2">
                <IonIcon icon={person} />
                <IonLabel>Profile</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
    )
  }

  render() {
    const LMe = this;

    if (LMe.state.IsSessionExists === false) {

      return LMe.pvtGetLoginPage();
    }//if..

    return LMe.pvtGetTabPanel();
  }
}
export default App;
