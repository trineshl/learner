import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSkeletonText,
  IonItem,
  IonAvatar,
  IonLabel,
  IonList,
  IonButtons,
  IonBackButton
} from '@ionic/react';
import './Tab1.css';
import { Component } from 'react';
import GCacheUtils from '../components/CacheUtils';
import MCQs from '../components/MCQs';

interface infProps {
  match: any;
}

interface infStates {

  CanShowErrorMsg: boolean;
  IsLoading: boolean;
}

class Tab1 extends Component<infProps, infStates> {

  private FErrorMessage: any;
  private FResponse: any;

  constructor(props: any) {

    super(props);

    const LMe = this;

    LMe.state = {
      CanShowErrorMsg: false,
      IsLoading: true
    };

    LMe.FErrorMessage = 'MCQs not found.';
  }

  componentDidMount() {

    const LMe = this;

    GCacheUtils.GetLoggedInStudentObject().then((p_objStudent: any) => {
      LMe.pvtLoadAllMCQs(p_objStudent.Course);
    });
  }

  pvtLoadAllMCQs(p_strCourse: string) {

    const LMe = this;

    let LUrl = GCacheUtils.BaseUrl() + 'mcqs/' + p_strCourse;

    const LRequestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
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

          if (responseJson.mcqTypes.length <= 0) {

            LMe.FErrorMessage = 'No MCQs were found for your course.';
            LMe.setState({
              IsLoading: false,
              CanShowErrorMsg: true
            });
            return;
          }//if..

          LMe.FResponse = responseJson;

          LMe.setState({
            IsLoading: false,
            CanShowErrorMsg: false
          });
        },
        (error) => {

          LMe.FErrorMessage = <span style={{ color: 'red' }}>You are not connected to the server. <br /> The MCQs are not yet downloaded.</span>;

          LMe.setState({
            CanShowErrorMsg: true,
            IsLoading: false
          });
        }
      );
  }

  pvtGetErrorMessage() {
    const LMe = this;
    return <div className="CenterAndMiddle">
      {LMe.FErrorMessage}
    </div>;
  }

  pvtGetLoadingComponent() {
    const LResult = [];

    for (var i = 0; i < 5; i++) {

      LResult.push(<IonItem key={'somekey-' + i}>
        <IonAvatar slot="start">
          <IonSkeletonText animated />
        </IonAvatar>
        <IonLabel>
          <h3>
            <IonSkeletonText animated style={{ width: '50%' }} />
          </h3>
          <p>
            <IonSkeletonText animated style={{ width: '80%' }} />
          </p>
          <p>
            <IonSkeletonText animated style={{ width: '60%' }} />
          </p>
        </IonLabel>
      </IonItem>);
    }

    return <IonContent fullscreen><IonList>{LResult}</IonList></IonContent>;
  }

  pvtGetPageContent() {
    const LMe = this;

    if (LMe.state.CanShowErrorMsg === true) {

      return LMe.pvtGetErrorMessage();
    }//if..

    if (LMe.state.IsLoading === true) {
      return LMe.pvtGetLoadingComponent();
    }

    return LMe.pvtGetMCQsComponent();
  }

  pvtGetMCQsComponent() {
    const LMe = this;

    // console.log(LMe.props);

    return <IonContent fullscreen>
      <MCQs
        Response={LMe.FResponse}
        OwnerProps={LMe.props}
      ></MCQs>
    </IonContent>;
  }

  render() {
    const LMe = this;

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
            <IonTitle>{LMe.props.match.params?.course || 'Syllabus'}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {LMe.pvtGetPageContent()}
      </IonPage>
    )
  }
}

export default Tab1;
