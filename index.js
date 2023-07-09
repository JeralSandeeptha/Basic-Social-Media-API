//modules
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');

//import files
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');

//initialize express
const app = express();

//middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);

//connect database
mongoose.connect('mongodb://localhost:27017/socialmediaapp')
    .then( () => {
        console.log("Database connection succesfully!")
    })
    .catch( (error) => {
        console.log(error)
    });

//start server
app.listen(8800, () => {
    console.log("Server is running at port 8800");
});

