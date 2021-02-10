using myCompany.hr.lms from '../db/Students';

//@(path: 'lms') can be used to change path - service mysrvdemo @(path: 'lms'){
service mysrvdemo {
    
    @readonly entity StudentsSRV as projection on lms.Students;
    @updateonly entity UpdateSRV as projection on lms.Students;
    @insertonly entity InsertSRV as projection on lms.Students;
    @deleteonly entity DeleteSRV as projection on lms.Students;
    function myfoobar(msg:String) returns String;
    

}


//Extend an existing service in non-disruptive way for production -- Next we will move it to seprate file
// extend service mysrvdemo with  {
//     @readonly entity CustomStudent as projection on lms.Students{
//         *,
//         first_name || ' ' || last_name as full_name : String
//     };
    

// }