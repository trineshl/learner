import tnl from "../tnl/tnl";
import { Storage } from '@capacitor/storage';

class CacheUtils {

   private FStudentObj: any = null;
   private FMCQs: any = null;
   private FAnsQivenByStudent: any = null;
   private FServerURL: any;

   async GetLoggedInStudentObject() {

      const LMe = this;

      if (tnl.isObjEmpty(LMe.FStudentObj) === true) {

         LMe.FStudentObj = await Storage.get({ key: 'studentobject' });
         LMe.FStudentObj = JSON.parse(LMe.FStudentObj.value || '{}') || {};
      }//if..

      return LMe.FStudentObj;
   }

   async LogOut() {

      await Storage.set({
         key: 'studentobject',
         value: '',
      });
      await Storage.set({
         key: 'mcqsobject',
         value: '',
      });
      this.Invalidate();
      window.location.href = '';
   }

   async Login(p_objStudentObj: any) {

      if (tnl.isEmpty(this.FServerURL) === false) {
         p_objStudentObj.serverURL = this.FServerURL;
      }//if..

      await Storage.set({
         key: 'studentobject',
         value: JSON.stringify(p_objStudentObj),
      });
      window.location.href = '/tab1';
   }

   async SetMCQs(p_objMCQs: Object) {

      return await Storage.set({
         key: 'mcqsobject',
         value: JSON.stringify(p_objMCQs),
      });
   }

   async GetMCQs() {

      const LMe = this;

      if (tnl.isObjEmpty(LMe.FMCQs) === true) {

         LMe.FMCQs = await Storage.get({ key: 'mcqsobject' });
         LMe.FMCQs = JSON.parse(LMe.FMCQs.value || '{}') || {};
      }//if..

      return LMe.FMCQs;
   }

   Invalidate() {
      const LMe = this;

      LMe.FStudentObj = null;
      LMe.FMCQs = null;
   }

   SetBaseUrl(p_strURL: any) {
      if (tnl.isEmpty(p_strURL) === true) {
         return;
      }//if..

      this.FServerURL = p_strURL;
   }

   BaseUrl() {
      return this.FServerURL || this.FStudentObj?.serverURL || 'http://192.168.65.227:9000/';
      // return 'http://192.168.43.180:9000/';
   }

   GetSyllabusDispText(p_strActCode: any) {

      let LResult = '';

      switch (p_strActCode) {

         case 'askedQues':
            LResult = 'Previously asked questions';
            break;

         case 'internet':
            LResult = 'Internet';
            break;

         case 'word':
            LResult = 'Word';
            break;

         case 'powerpoint':
            LResult = 'Power Point';
            break;

         case 'excel':
            LResult = 'Excel';
            break;

         case 'os':
            LResult = 'Operating System';
            break;

         case 'computer':
            LResult = 'Computer';
            break;

         case 'impQues':
            LResult = 'Important ENG 30';
            break;

         case 'impQuesEng40':
            LResult = 'Important ENG 40';
            break;

         case 'oldImpQues':
            LResult = 'Old Important ENG 30';
            break;

         case 'oldImpQuesEng40':
            LResult = 'Old Important ENG 40';
            break;
      }

      return LResult;
   }

   GetSyllabusImage(p_strActCode: any) {

      let LResult = './mcqs/paper.jpg';

      switch (p_strActCode) {

         case 'askedQues':
            LResult = './mcqs/paper.jpg';
            break;

         case 'internet':
            LResult = './mcqs/ie.jpg';
            break;

         case 'word':
            LResult = './mcqs/word.jpg';
            break;

         case 'powerpoint':
            LResult = './mcqs/point.jpg';
            break;

         case 'excel':
            LResult = './mcqs/excel.jpg';
            break;

         case 'os':
            LResult = './mcqs/os.jpg';
            break;

         case 'computer':
            LResult = './mcqs/computer.png';
            break;
      }

      return LResult;
   }

   IsStudentGaveAns() {
      return this.FAnsQivenByStudent;
   }

   AnsQivenByStudent(p_boolAnsQivenByStudent: any) {
      this.FAnsQivenByStudent = p_boolAnsQivenByStudent;
   }
}

var GCacheUtils: any;

if (tnl.isEmpty(GCacheUtils) === true) {

   GCacheUtils = new CacheUtils();
}//if..

export default GCacheUtils;