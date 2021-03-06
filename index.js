// create express server variables
var express = require('express');
var app = express();

// create file system variables
var fs = require('fs');
const path = require('path');

var bodyParser = require('body-parser');

const cors = require("cors");

app.use(express.json());
app.use(bodyParser.json());
// https://focused-raman-c5ce86.netlify.app/
/*
{
    origin: "https://focused-raman-c5ce86.netlify.app",
    methods: ["GET","POST","PUT"]
}
*/
app.use(cors());

app.get('/', function (req, res) {
    res.json('Hello From Heroku !');
})


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mongoDbUser:3TQSsmEEfTQdnbd@cluster0-mte9s.gcp.mongodb.net?retryWrites=true&w=majority";

// Endpoint to create a mentor
// Type = POST
app.post('/createMentor', async function (req, res) {

    let mentorName = req.body.mentorName;

    try {
        let client = await MongoClient.connect(uri);
        let db = client.db("assignmentor");
        let insertedStudent = await db.collection("mentors").insertOne({
            "name": mentorName,
            "students": []
        });
        client.close();
        console.log("successfully inserted mentor");
        res.send("successfully inserted mentor");
    } catch (err) {
        console.log(err);
        res.send(err);
    }

})

// Endpoint to create a student
// Type = POST
app.post('/createStudent', async function (req, res) {

    let student = req.body.studentName;

    try {
        let client = await MongoClient.connect(uri);
        let db = client.db("assignmentor");
        let insertedStudent = await db.collection("students").insertOne({
            "name": student,
            "mentor": ""
        });
        client.close();
        console.log("successfully inserted student");
        res.send("successfully inserted student");
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})

// Endpoint to assign a student to a mentor
// Type = PUT
app.put("/assignStudentsToMentor", async function (req, res) {

    let mentorName = req.body.mentorName;
    let students = req.body.students;

    try {
        let client = await MongoClient.connect(uri);
        let db = client.db("assignmentor");
        /*
        let mentor = await db.collection("mentors").findOneAndUpdate(
            { "name": mentorName },
            { $set: { "students": students } }
        );
        */
        students.forEach(eachStudent => {
            let eachStudentMentor = db.collection("students").findOneAndUpdate(
                { "name": eachStudent },
                { $set: { "mentor": mentorName } }
            );
        });
        let student = await db.collection("mentors").findOneAndUpdate(
            { "name": mentorName },
            { $push: { "students": { $each: students } } }
        );
        client.close();
        console.log("Updated students for mentor");
        //res.setHeader('Access-Control-Allow-Origin', '*');
        //res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH');
        res.json("Updated students for mentor")
    } catch (error) {
        console.log(error)
        res.json(error);
    }
})

// Endpoint to change mentor for a student
// Type = PUT
app.put("/changeMentorForStudent", async function (req, res) {

    let studentName = req.body.studentName;
    let newMentorName = req.body.newMentorName;

    try {
        let client = await MongoClient.connect(uri);
        let db = client.db("assignmentor");
        let oldMentorName = await db.collection("students").findOne(
            { "name": studentName },
            { "mentor": 1 }
        );
        let oldMentor = await db.collection("mentors").findOneAndUpdate(
            { "name": oldMentorName },
            { $pull: { "students": studentName } }
        );
        let student = await db.collection("students").findOneAndUpdate(
            { "name": studentName },
            { $set: { "mentor": newMentorName } }
        );
        let newMentor = await db.collection("mentors").findOneAndUpdate(
            { "name": newMentorName },
            { $push: { "students": studentName } }
        );
        client.close();
        console.log("Updated mentor");
        //res.setHeader('Access-Control-Allow-Origin', '*');
        //res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH');
        res.json("Updated mentor");
    } catch (error) {
        console.log(error)
        res.json(error);
    }
})

// Endpoint to get all students for a particular mentor
// Type = GET
app.get("/showAllStudentsForMentor/:mentorName", async function (req, res) {

    let mentorName = req.params.mentorName;

    try {
        let client = await MongoClient.connect(uri);
        let db = client.db("assignmentor");
        let students = await db.collection("mentors").find({ "name": mentorName }).toArray();
        client.close();
        res.send(students[0].students);
    } catch (error) {
        console.log(error)
        res.send(error);
    }
})

// Endpoint to get all student names
// Type = GET
app.get("/showAllStudents", async function (req, res) {

    let students = [];
    try {
        let client = await MongoClient.connect(uri);
        let db = client.db("assignmentor");
        let studentsData = await db.collection("students").find().toArray();
        studentsData.forEach(element => students.push(element.name));
        client.close();
        res.send(students);
    } catch (error) {
        console.log(error)
        res.send(error);
    }
})

// Endpoint to get all mentor names
// Type = GET
app.get("/showAllMentors", async function (req, res) {

    let mentors = [];
    try {
        let client = await MongoClient.connect(uri);
        let db = client.db("assignmentor");
        let mentorsData = await db.collection("mentors").find().toArray();
        mentorsData.forEach(mentor => mentors.push(mentor.name));
        client.close();
        res.send(mentors);
    } catch (error) {
        console.log(error)
        res.send(error);
    }
})

// Endpoint to get all students without a mentor
// Type = GET
app.get("/showAllUnassignedStudents", async function (req, res) {

    let unassignedStudents = [];
    try {
        let client = await MongoClient.connect(uri);
        let db = client.db("assignmentor");
        let studentsData = await db.collection("students").find().toArray();
        studentsData.forEach(student => {
            if (student.mentor == "") {
                unassignedStudents.push(student.name)
            }
        });
        client.close();
        res.send(unassignedStudents);
    } catch (error) {
        console.log(error)
        res.send(error);
    }
})



// start the server with specified port
// handle dynamic port binding by heroku using process.env.PORT
var server = app.listen(process.env.PORT || 8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})