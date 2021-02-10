this.anubhav = "Anubhav Trainings";
const cds = require("@sap/cds");
const { Students } = cds.entities("myCompany.hr.lms");

const mysrvdemo = srv => {
  srv.on("myfoobar", function(req, res) {
    return "Hello" + req.data.msg;
  });
  //Anubhav Trainings.com - when we implement the hook method, CAPM will only call our EXIT Code
  //It will never call Standard DB Table, The Entity will reference as output Skeleton
  //In this example we take full control and manage CURDQ ourself
  srv.on("READ", "StudentsSRV", async (req, res) => {
    //check if hook is called
    console.log("Welcome");

    //-----------------1. send sample response
    // var results = [];
    // results.push({
    //   "email":"contact@anubhvatrainings.com"
    // });

    //----------------2.get standard CDS dependency - https://cap.cloud.sap/docs/node.js/services
    //GET All
    var results   = await  cds.tx(req).run(SELECT.from(Students));  //deprecated cds.ql(req) - DO NOT USE
    
    //----------------3. GET Where
    results   = await  cds.tx(req).run(SELECT.from(Students).where({email: "anubhav.abap@gmail.com"}));

    ///----------------4.Read data by key /StudentsSRV(email='anubhav.abap@gmail.com') and also limit records
    
    var whereCon = req.data; //
    console.log("-------------");
    console.log(whereCon);
    console.log("-------------");
    if(whereCon.hasOwnProperty("email")){
      results   = await  cds.tx(req).run(SELECT.from(Students).where(whereCon));
    }else{
      results   = await  cds.tx(req).run(SELECT.from(Students)); //.limit(2));
    }
    
    return results;  //after this we can debug with debug configuration

    //send sample demo data   
    //return {email: this.anubhav};    

  });

  //-----------------5. After Read Hook method - it will call our READ implementation, gets all data
  srv.after("READ", "StudentsSRV", (data) => { 
    
    //--------6. Changing Data @ runtime
    // return data.map(record => {
    //   record.first_name = record.first_name + " " + record.last_name;
    // });

    //--------7. Filter data on top of existing value - No effect, we cannot filter data at all
    return data.filter(d => d.first_name === "anubhav");


  });

  //------------------8. Implementing Update request
  // srv.on("CREATE", "UpdateSRV", async (req, res) => { 
  //   console.log(req.data);
  //   //update by key
  //   const updatedData = await UPDATE(Students).set({
  //     first_name: req.data.first_name
  //   }) 
  //   .where({ email : req.data.email });
  //   console.log(updatedData);
  //   return req.data;
  //   //return updatedData;
    

  // });

   //------------------9. Managing Transaction - ACIDity - Multiple Updates in a Row
   srv.on("CREATE", "UpdateSRV", async (req, res) => { 
    console.log(req.data);
    //update by key
    let returnData = await cds.transaction(req).run([

      UPDATE(Students).set({
        first_name: req.data.first_name
      }).where({ email : req.data.email }),

      UPDATE(Students).set({
        last_name: req.data.last_name
      }).where({ email : req.data.email })
      
    ]).then( (resolve, reject) => {
      if(typeof(resolve) !== "undefined"){
        return req.data;
      }else{
        req.error(500, "Internal error occurred");
      }
    }).catch( err => {
      req.error(500, "Internal error occurred :" + err.toString());
    });
    
    console.log(returnData);
    
    return returnData;

  });
  

  srv.on("CREATE", "InsertSRV", async (req, res) => { 
    console.log(req.data);
    //update by key
    let returnData = await cds.transaction(req).run([

      INSERT.into(Students).entries([req.data])

    ]).then( (resolve, reject) => {
      if(typeof(resolve) !== "undefined"){
        return req.data;
      }else{
        req.error(500, "Internal error occurred");
      }
    }).catch( err => {
      req.error(500, "Internal error occurred :" + err.toString());
    });
    
    console.log(returnData);
    
    return returnData;

  });


  srv.on("DELETE", "DeleteSRV", async (req, res) => { 
    console.log(req.data);
    //update by key
    let returnData = await cds.transaction(req).run([

      DELETE.from(Students).where({email: req.data.email})
      
    ]).then( (resolve, reject) => {
      if(typeof(resolve) !== "undefined"){
        return req.data;
      }else{
        req.error(500, "Internal error occurred");
      }
    }).catch( err => {
      req.error(500, "Internal error occurred :" + err.toString());
    });
    
    console.log(returnData);
    
    return returnData;

  });



};



module.exports = mysrvdemo;
