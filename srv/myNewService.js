const cds = require("@sap/cds")
const { Students } = cds.entities("myCompany.hr.lms");

module.exports = srv => {
    srv.before("CREATE", "InsertStudent" , (req, res) => {
        //check if email id is a valid format - get code from google
        console.log("Before Create hook called");
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(myForm.emailAddr.value))
        {
            //ok looks good
        }else{
            req.error(500, "The email id is not valid one");
        }

    });
}