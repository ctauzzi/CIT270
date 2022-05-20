const express = require('express'); //import the library
const bodyParser = require('body-parser'); //body parse is called middleware
const port = 3000;
const md5 = require('md5');
const app = express();//use the library
const {createClient} = require('redis');
const redisClient = createClient(
    {
        socket:{
            port:6379,
            host:"127.0.0.1",
        },
    }
);

app.use(bodyParser.json()); //use the middleware (calls it before anything else happens on each request)

app.listen(port, async()=>{
    await redisClient.connect();
    console.log("Listening on port: " + port)
});

const validatePassword = async(request, response)=>{
    const requestHashedPassword = md5(request.body.password);
    const redisHashedPassword = await redisClient.hmGet('passwords', request.body.userName); //use await here, if await is not used this line of code is only a promise

    //compare the hashed version of the password that was sent with the hashed version from the database
    if (requestHashedPassword == redisHashedPassword){
        response.status(200);//200 means OK
        response.send("Welcome");
    }
    else {
        response.status(401);//401 means unauthorized
        response.send("Unauthorized");
    }
};

const signup = (request, response)=>{
    await redisClient.connect();
    const requestUserName = (request.body.userName);
    const requestPassword = md5(request.body.password);
    const redisSignup = await redisClient.hSet('passwords', requestUserName, requestPassword);
};

app.get('/', (request, response)=>{ //everytime something calls your API that is a request
    response.send("Hello")//a response is when the API gives the information requested
});

app.post('/login', validatePassword);
