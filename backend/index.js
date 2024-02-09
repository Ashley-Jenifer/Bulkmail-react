const express = require("express")
const cors = require ("cors")
const app = express()
app.use(express.json())
app.use(cors());

const mongoose = require("mongoose")
"use strict";
const nodemailer = require("nodemailer");


mongoose.connect("mongodb+srv://AshleyjeniferJ:Ronel@cluster0.eqlttex.mongodb.net/passkey?retryWrites=true&w=majority").then(function()
{
  console.log("success, connected to db")
})
.catch(function()
{
  console.log("error in connecting db")
})
const credential = mongoose.model("credential",{},"bulkmail")
app.post("/sendmail",function(req,res)

{
    var msg = req.body.msg
    var emailList = req.body.emailList

    credential.find().then
    (function(data)
    {
      const transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
         
          user: data[0].toJSON().user,
          pass: data[0].toJSON().pass,
        },
      });
    
      new Promise(async function(response,reject)
        {
          try{
            for(var i=0;i<emailList.length;i++)
            {
            await transporter.sendMail({
                  from:"ashleyjeyaseelan@gmail.com",
                  to:emailList[i],
                  subject:"testing of bulkmail",
                  text:msg
            },
            )
        }
        resolve("Success")
          }
          catch(error)
          {
          reject("failed")
          }
        })
        .then(function()
        {
          res.send(false)
        })
        .catch(function()
        {
          res.send(true)
        })
    })
    .catch
    (function(error)
    {console.log(error)
    })
    
})










app.listen(5000,function()
{
    console.log("server started...")
})