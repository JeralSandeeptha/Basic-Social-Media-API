const express = require('express');
const UserSchema = require('../models/User');
const bcrypt = require('bcrypt');

const router = express.Router();

//register user
router.post('/register', async (req, res) => {

    try {

        //create a salt
        const salt = await  bcrypt.genSalt(10);
        //create a hash password using generated salt and user password
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        //create new user with details
        const newUser = new UserSchema({
            username: req.body.username,
            email: req.body.email,
            password: hashPassword
        });

        //save user and return response
        const user = await newUser.save();
        res.status(200).json({
            message: "User registered succesfully",
            data: user
        });

    }catch (error){
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }

});

router.post('/login', async (req, res) => {

    try {

        //get user details related to this email
        const user = await UserSchema.findOne({ email: req.body.email });
        if (!user){
            res.status(404).json({
                message: "Email not found"
            });
        }

        //check password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword){
            res.status(400).json({
                message: "Password is incorrect"
            });
        }

        res.status(200).json({
            message: "User login successfully",
            data: user
        });

    }catch (error){
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }

})

module.exports = router;