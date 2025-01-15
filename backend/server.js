const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = 3005;
const url = 'mongodb://localhost:27017/tododb';


mongoose.connect(url)
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Database connection error:', err));

const con = mongoose.connection;


const loginRoute = require('./api/login');
const tasksRoute = require('./api/todo');

const { cookieJwtAuth } = require('./middleware/cookieJwtAuth');

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type','token']
}));

app.use(
    express.urlencoded({
        extended: true,
    })  
);

app.use(cookieParser());

app.use(express.json());

// Define routes

app.use('/user', loginRoute);
app.use('/task', tasksRoute);




app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


