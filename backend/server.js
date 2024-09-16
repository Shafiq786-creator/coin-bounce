const express = require('express');
const dbconnect = require('./database/index');
const {PORT} = require('./config/index');
const router = require('./routes/index');
const errorHandler = require('./middlewears/errorHandler');
const cookieParser = require('cookie-parser');  
const cors = require('cors')

const corsOption = {
    credentials : true,
    origin : ['http://localhost:3000']
}

const app = express();

app.use(cors(corsOption));

app.use(cookieParser());

// app.use(cors(corsOption));

app.use(express.json({limit: '50mb'})) ;
app.use(router);

dbconnect();
app.use('/storage',express.static('storage'));

app.use(errorHandler)
app.listen(PORT, () =>{
    console.log(`backend is running on port : ${PORT}`) 
});

