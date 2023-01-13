const FUrl = 'http://localhost:9000/';

var FGridOptions;
var FNameField;
var FUserNameField;
var FPasswordField;
var FCourse;
var FDate;
var FGridDiv;
var FStudentId;
var FModel;

function init() {

   FNameField = document.getElementById('name');
   FUserNameField = document.getElementById('username');
   FPasswordField = document.getElementById('password');
   FCourseField = document.getElementById('course');
   FExpDateField = document.getElementById('expiry');
   FGridDiv = document.getElementById('Grid');
   FModel = new bootstrap.Modal('#exampleModal', {
      keyboard: false
   });

   pvtFetchStudents();
}

function pvtFetchStudents() {

   const LRequestOptions = {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json'
      }
   };

   fetch(FUrl + 'students', LRequestOptions)
      .then((response) => response.json())
      .then((responseJson) => {

         if (responseJson.success === false) {
            alert('Not connected with server');
            return;
         }

         const columnDefs = [
            { field: "Name", flex: 1 },
            { field: "Course" },
            { field: "Username" },
            { field: "Password" },
            { headerName: "App Expiry Date", field: "Expiry" }
         ];

         // let the grid know which columns and what data to use
         FGridOptions = {
            columnDefs: columnDefs,
            rowData: responseJson.students,
            // enable sorting on all columns by default
            defaultColDef: {
               sortable: true
            },

            rowSelection: 'single',
            // onSelectionChanged: onSelectionChanged,
         };

         new agGrid.Grid(FGridDiv, FGridOptions);
      },
         (error) => {

            //  LMe.FErrorMessage = <span style={{ color: 'red' }}>You are not connected to the server. <br /> The MCQs are not yet downloaded.</span>;
         }
      );
}

function pvtNew() {

   FStudentId = null;

   FNameField.value = null;
   FUserNameField.value = null;
   FPasswordField.value = null;
   FCourseField.value = null;
   FExpDateField.value = null;

   FModel.show();
}

function pvtEdit() {

   const LSelectedRows = FGridOptions.api.getSelectedRows()[0] || {};

   if (!LSelectedRows.id) {
      // If id not selected
      alert('Select a record and try again.');
      return;
   }//if..

   FModel.show();

   FStudentId = LSelectedRows.id;

   FNameField.value = LSelectedRows.Name;
   FUserNameField.value = LSelectedRows.Username;
   FPasswordField.value = LSelectedRows.Password;
   FCourseField.value = LSelectedRows.Course;
   FExpDateField.value = LSelectedRows.Expiry;
}

function pvtGetRequestJSON() {

   let LRequestObj = {};

   LRequestObj.id = FStudentId;
   LRequestObj.name = FNameField.value
   LRequestObj.username = FUserNameField.value
   LRequestObj.password = FPasswordField.value
   LRequestObj.course = FCourseField.value
   LRequestObj.expiry = FExpDateField.value

   return LRequestObj;
}

function pvtSaveStudent(e) {

   let LRequestJSON = pvtGetRequestJSON();

   const LRequestOptions = {
      method: LRequestJSON.id ? 'PUT' : 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(LRequestJSON)
   };

   fetch(FUrl + 'students', LRequestOptions)
      .then((response) => response.json())
      .then((responseJson) => {

         if (responseJson.success === false) {
            alert(` Error Code: ${responseJson.code}. \n Error Number: ${responseJson.errno} \n Message: ${responseJson.message || 'Error occurred on server.'} \n Possible Reason: Username must be unique.`);
            return;
         }

         alert('Student\'s record saved successfully.');
         // pvtFetchStudents();
         pvtRefresh();
      },
         (error) => {

            //  LMe.FErrorMessage = <span style={{ color: 'red' }}>You are not connected to the server. <br /> The MCQs are not yet downloaded.</span>;
         }
      );
}

const pvtRefresh = () => window.location.reload();