import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonLoading,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { person, book } from 'ionicons/icons';
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
import tnl from './tnl/tnl';
import './tnl/tnl.css';
import GCacheUtils from './components/CacheUtils';

setupIonicReact();

interface infStates {
  IsLoading: boolean;
  IsSessionExists: boolean;
}

export class App extends Component<{}, infStates> {

  constructor(props: any) {

    super(props);

    const LMe = this;

    LMe.state = {
      IsSessionExists: false,
      IsLoading: true
    };
  }

  componentDidMount() {
    const LMe = this;

    LMe.pvtCheckSession();
  }

  pvtCheckSession() {

    const LMe = this;

    const LStudentObj = GCacheUtils.GetLoggedInStudentObject();

    LStudentObj.then((p_objStudent: any) => {

      //Stop loading
      LMe.setState({ IsLoading: false });

      if (tnl.isObjEmpty(p_objStudent)) {

        return;//means user is not logged in
      }//if..

      //Check for expiry
      if (tnl.isEmpty(p_objStudent.Expiry)) {

        return;
      }//if..

      let LTodaysDate = new Date().setHours(0, 0, 0, 0),
        LExpiryDate = new Date(p_objStudent.Expiry).setHours(0, 0, 0, 0);

      //Date format is saved in DB is "YYYY-MM-DD"
      if (LTodaysDate > LExpiryDate) {

        return;
      }//if..

      //Here means, user is logged in
      LMe.setState({ IsSessionExists: true });
    });
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
              <Route exact path="/tab1" component={Tab1} />
              <Route exact path="/tab2">
                <Tab2 />
              </Route>

              <Route exact path="/tab1/:course" component={Tab1} />
              <Route exact path="/tab1/:course/:questionId" component={Tab1} />

              <Route exact path="/">
                <Redirect to="/tab1" />
              </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom" color="primary">
              <IonTabButton tab="tab1" href="/tab1">
                <IonIcon icon={book} />
                <IonLabel>Subjects</IonLabel>
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

    return <>
      <IonLoading
        isOpen={LMe.state.IsLoading}
        onDidDismiss={() => { LMe.setState({ IsLoading: false }) }}
        message={'Loading, please wait...'}
      />
      {LMe.state.IsSessionExists ? LMe.pvtGetTabPanel() : LMe.pvtGetLoginPage()}
    </>;
  }
}
export default App;
