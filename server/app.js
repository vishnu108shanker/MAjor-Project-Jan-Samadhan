const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors') ;
const helmet = require('helmet') ;
const morgan = require('morgan') ;
require('dotenv').config() ;
console.log("Checking environment variable:", process.env.MONGODB_URI);

const app = express() ;

// console.log(process.env.PORT) ;


// sabse pehle helmet lagao 
app.use(helmet()) ;

// phir morgan lagao jo saare logs record karega 
app.use(morgan('dev')) ;

// fir cors laga ke usme forntend wale website ko access do 
app.use(cors({origin:process.env.CLIENT_URL })) ;

app.use(express.json()) ;

// connect to the mongo db 
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Mongo db is connected 😁🤠'))
.catch(err => console.error('Db connection me error✂️ :' , err ))



// Routes Area 
// app.use('/api/auth', require('./routes/auth'));
app.use('/api/issues', require('./routes/issues'));
// app.use('/api/stats', require('./routes/stats'));
// Routes End here 



// either listen to the local host or to the frontend web access through morgan 
app.listen(process.env.PORT || 5000, () => {
  console.log(`😍 Server running on port ${process.env.PORT || 5000}😍`);
});