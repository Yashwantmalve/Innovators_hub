const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const student = require("./model/student");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");



app.use(session({
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:Date.now()+7*24*60*60*1000,
        httpOnly:true
    }
}))



//database connection
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/student_track');
}


main().then(()=>{
    console.log("db connected")
}).catch((err)=>{
    console.log(err)
})



//middlewares

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine","ejs"),
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);
app.use(methodOverride("_method"));




//root
app.get("/",(req,res)=>{
    res.send("root page");
})


//showing all student
app.get("/students",async (req,res)=>{
    let allstudent = await student.find();
   res.render("student/allstudent",{ allstudent });
})


//create student
app.get("/students/new",(req, res) => {
    res.render("student/create");
})

app.post("/students/new",async(req,res)=>{
   let studentData = req.body;
   let newStudent = await student.insertOne(studentData);
   res.redirect("/students")
})

//read

app.get("/students/:id",async(req, res) => {
     let Student = await student.findById(req.params.id);
     res.render("student/show",{Student});
})


//update

app.get("/students/:id/edit",async(req,res)=>{
    let Student = await student.findById(req.params.id)
    res.render("student/edit",{ Student });
})

app.put("/students/:id",async(req, res) => {
    let id = req.params.id;
    console.log(id);
    let Student = await student.findByIdAndUpdate(id,req.body);
    res.redirect(`/students/${id}`)
})


//delete
app.delete("/students/:id",async(req,res)=>{
    console.log(req.params.id)
    await student.findByIdAndDelete(req.params.id)
    res.redirect("/students");
})


app.listen(8080,()=>{
    console.log("server listining to 8080");
})