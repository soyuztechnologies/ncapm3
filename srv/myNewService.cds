using myCompany.hr.lms from '../db/Students';
using mysrvdemo as mysrvdemo from './mysimplesrv';

//Extend an existing service in non-disruptive way for production -- Next we will move it to seprate file
extend service mysrvdemo with  {
    @readonly entity CustomStudent as projection on lms.Students{
        *,
        first_name || ' ' || last_name as full_name : String
    }excluding{
        date_sign_up
    };
}