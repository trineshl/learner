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
import tnl from '../tnl/tnl';

interface infProps {
  match: any;
}

interface infStates {

  CanShowErrorMsg: boolean;
  IsLoading: boolean;
  Response: any;
}

class Tab1 extends Component<infProps, infStates> {

  private FErrorMessage: any;

  constructor(props: any) {

    super(props);

    const LMe = this;

    LMe.state = {
      CanShowErrorMsg: false,
      IsLoading: true,
      Response: {}
    };

    LMe.FErrorMessage = 'MCQs not found.';
  }

  componentDidMount() {

    const LMe = this;

    GCacheUtils.GetLoggedInStudentObject().then((p_objStudent: any) => {
      LMe.pvtLoadAllMCQs(p_objStudent.Course);
    });
  }

  componentWillUnmount() {
    // Getting paramas
    const LMe = this,
      LParams = LMe.props.match.params;
    // Save correct & wrong answer
    if (tnl.isEmpty(LParams.questionId) === false) {
      // Here means question no exists means this is destory of Questions.tsx - Single Question destoryed
      return;
    }//if..

    if (tnl.isEmpty(LParams.course) === true) {
      // Here means this is not an destory of single question page nor question list page
      return;
    }//if..

    if (GCacheUtils.IsStudentGaveAns() === true) {
      // Here means Answered given by student
      GCacheUtils.SetMCQs(LMe.state.Response);
    }
    else {
      // Here means Answered NOT given by student
    }

    GCacheUtils.AnsQivenByStudent(false);
  }

  pvtLoadAllMCQs(p_strCourse: string) {
    /**
     * @method pvtLoadAllMCQs
     * This method will loads the MCQs from Local-Storage, if not found then fire the command and loads the cache
     */
    const LMe = this;

    GCacheUtils.GetMCQs().then((p_responseJson: any) => {

      if (tnl.isObjEmpty(p_responseJson)) {
        //Here means, MCQs are not in cache
        LMe.pvtFetchMCQs(p_strCourse);
        return;
      }//if..

      LMe.pvtOnMCQsLoad(p_responseJson);
    });
  }

  pvtFetchMCQs(p_strCourse: string) {

    const LMe = this;

    let LUrl = GCacheUtils.BaseUrl() + 'mcqs/' + p_strCourse;

    const LRequestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    fetch(LUrl, LRequestOptions)
      .then((response) => response.json())
      .then(
        async (responseJson) => {

          GCacheUtils.SetMCQs(responseJson).then(() => {
            LMe.pvtOnMCQsLoad(responseJson);
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

  pvtOnMCQsLoad(responseJson: any) {

    const LMe = this;

    if (tnl.isObjEmpty(responseJson)) {
      return;
    }

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

    LMe.setState({
      Response: responseJson,
      IsLoading: false,
      CanShowErrorMsg: false
    });
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
        Response={LMe.state.Response}
        OwnerProps={LMe.props}
      ></MCQs>
    </IonContent>;
  }

  pvtGetHeader() {

    const LMe = this;

    return GCacheUtils.GetSyllabusDispText(LMe.props.match.params?.course) || 'Syllabus';
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
            <IonTitle>{LMe.pvtGetHeader()}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {LMe.pvtGetPageContent()}
      </IonPage>
    )
  }
}

export default Tab1;
