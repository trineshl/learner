import tnl from "../tnl/tnl";
import { Storage } from '@capacitor/storage';

class CacheUtils {

   private FStudentObj: any = null;

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
      this.Invalidate();
      window.location.href = '';
   }

   async Login(p_objStudentObj: Object) {

      await Storage.set({
         key: 'studentobject',
         value: JSON.stringify(p_objStudentObj),
      });
      window.location.href = '/tab1';
      // window.history.pushState('', '', '/tab1');
   }

   Invalidate() {
      const LMe = this;

      LMe.FStudentObj = null;
   }

   BaseUrl() {

      return 'http://192.168.43.180:9000/';
   }
}

var GCacheUtils: any;

if (tnl.isEmpty(GCacheUtils) === true) {

   GCacheUtils = new CacheUtils();
}//if..

export default GCacheUtils;