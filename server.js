const express = require('express'); //import the library
const bodyParser = require('body-parser'); //body parse is called middleware
const port = 3000;
const app = express();//use the library

app.use(bodyParser.json());//use the middleware (call it before anything else happens on each request)

app.listen(port, ()=>{
    console.log("Listening on port: " + port)
});//listen

app.post('/login', (request, response)=>{//a post is when a client sends new information to an API
    const loginRequest = request.body;
    console.log("Request body", JSON.stringify(request.body)); //just to see what is contained in the body of the json file
    if (loginRequest.userName == "notrealemail@gmail.com" && loginRequest.password == "Passw0rd!"){
        response.status(200);//200 means OK
        response.send("Welcome");
    }
    else {
        response.status(401);//401 means unauthorized
        response.send("Unauthorized");
    }
})

app.get('/', (request, response)=>{ //everytime something calls your API that is a request
    response.send("Hello")//a response is when the API gives the information requested
});
