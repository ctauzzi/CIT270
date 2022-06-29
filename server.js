const https = require('https');
const express = require('express'); //import the library
const bodyParser = require('body-parser'); //body parse is called middleware
const port = 443;
const md5 = require('md5');
const app = express();//use the library
const {createClient} = require('redis');
const fs = require('fs');
const redisClient = createClient({ url: 'redis://default:P@ssword@35.188.72.122:6379'});

app.use(bodyParser.json()); //use the middleware (calls it before anything else happens on each request)

https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert'),
    passphrase: "P@ssw0rd"
}, app).listen(port, async ()=>{
    await redisClient.connect();
    console.log("Listening on port: " + port)
})

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

const savePassword = async (request, response)=>{ //function that will have a user create and store a password into the redis database as a hashed password
    const clearTextPassword = request.body.password;
    const hashedTextPassword = md5(clearTextPassword);
    await redisClient.hSet('passwords', request.body.userName, hashedTextPassword);
    response.status(200);
    response.send({result:"Saved"});
};

app.get('/', (request, response)=>{ //everytime something calls your API that is a request
    response.send("Hello")//a response is when the API gives the information requested
});

app.post('/signup', savePassword);
app.post('/login', validatePassword);
