const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const student = require("./model/student");
const teacher = require("./model/teacher");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");

const passport = require("passport");
const LocalStatergy = require("passport-local");




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


app.use(passport.initialize());
app.use((passport.session()));
passport.use(new LocalStatergy(teacher.authenticate()))


passport.serializeUser(teacher.serializeUser());
passport.deserializeUser(teacher.deserializeUser());



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
    if(!req.isAuthenticated()){
        res.redirect("/login")
    }

    res.render("student/create");
})

app.post("/students/new",async(req,res)=>{

    console.log(req.user);

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






//teacher

//signin


app.get("/signup",(req,res)=>{
    res.render("teacher/signup")
})

app.post("/signup",async(req,res)=>{
    const {email,username,password} = req.body
    const newTeacher = new teacher({
        email,username

    })
    let regesterTeacher = await teacher.register(newTeacher,password);
    res.redirect("/students")
})



app.get("/login",(req,res)=>{
    res.render("teacher/login")
})


app.post("/login",passport.authenticate("local",{failureRedirect:"/login"}),async(req,res)=>{
     res.redirect("/students");
})

app.get("/logout",(req,res)=>{
    req.logOut((err)=>{
        if(err){
           res.redirect("/signup")
        }
        res.redirect("/students");
    })
})


app.use((err,req,res,next)=>{
     res.send(err);
     next(err)
})





app.listen(8080,()=>{
    console.log("server listining to 8080");
})