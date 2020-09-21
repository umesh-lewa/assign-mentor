# assign-mentor

************************************************************************

Deployed Heroku URL :

https://assign-mentor-umesh.herokuapp.com/


************************************************************************

Endpoint 1 : Create a mentor

Type = POST

https://assign-mentor-umesh.herokuapp.com/createMentor

Sample Request Body :

{
    "mentorName":"Pugazh"
}


************************************************************************

Endpoint 2 : Create student

Type = POST

https://assign-mentor-umesh.herokuapp.com/createStudent


************************************************************************

Endpoint 3 : Assign studentsto a mentor

Type = PUT

https://assign-mentor-umesh.herokuapp.com/assignStudentsToMentor

Sample Request Body :

{
    "mentorName":"RV",
    "students":["Sid","Max","Niel"]
}

************************************************************************

Endpoint 4 : Change the mentor for a student

Type = PUT

https://assign-mentor-umesh.herokuapp.com/changeMentorForStudent

Sample Request Body :

{
    "studentName":"Umesh",
    "newMentorName":"SS"
}


************************************************************************