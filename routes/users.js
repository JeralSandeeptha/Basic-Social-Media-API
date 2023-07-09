const express = require('express');
const bcrypt = require('bcrypt');
const UserSchema = require('../models/User');

const router = express.Router();

//update user
router.put("/:id", async (req, res) => {

    try {

        if (req.body.userId == req.params.id || req.body.isAdmin){

            if (req.body.password){
                try {
                    const salt = await bcrypt.genSalt(10);
                    req.body.password = await bcrypt.hash(req.body.password, salt);
                }catch (error){
                    res.status(500).json({
                        message: "Internal Server Error",
                        error: error
                    });
                }
            }

            try {

                const user = await UserSchema.findByIdAndUpdate(req.params.id, { $set: req.body });

                res.status(200).json({
                    message: "Account has been updated"
                });

            }catch (error){
                res.status(500).json({
                    message: "Internal Server Error",
                    error: error
                });
            }

        }else{
            return res.status(403).json({
               message: "You can update only your account"
            });
        }

    } catch (error){
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }

});

//delete user
router.delete("/:id", async (req, res) => {

        try {

            if (req.body.userId == req.params.id || req.body.isAdmin){

                try {

                    await UserSchema.findByIdAndDelete(req.params.id);

                    res.status(200).json({
                        message: "Account has been Deleted"
                    });

                }catch (error){
                    res.status(500).json({
                        message: "Internal Server Error",
                        error: error
                    });
                }

            }else{
                return res.status(403).json({
                    message: "You can delete only your account"
                });
            }

        } catch (error){
            res.status(500).json({
                message: "Internal Server Error",
                error: error
            });
        }

});

//get a user
router.get('/:id', async (req, res) => {

    try {

        const user = await UserSchema.findById(req.params.id);

        //get user without password and updatedAt
        const { password, updatedAt, ...other } = user._doc;

        res.status(200).json(other);

    }catch (error){
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }

});

//follow user
router.put('/:id/follow', async (req, res) => {

    try {

        if (req.body.userId !== req.params.id){

            try {

                const user = await UserSchema.findById(req.params.id);
                const currentUser = await UserSchema.findById(req.body.userId);

                if (!user.followers.includes(req.body.userId)){
                    //push user id to the followings array
                    await user.updateOne({ $push: { followers: req.body.userId } });
                    await currentUser.updateOne({ $push: { followings: req.params.id } });
                    res.status(200).json({
                        message: "User has been followed"
                    });
                }else{
                    res.status(403).json("You already followed");
                }

            }catch (error) {
                res.status(500).json({
                    message: "Internal Server Error",
                    error: error
                });
            }

        }else{
            res.status(403).json({
                message: "You can't follow yourself"
            });
        }

    }catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }

});

//unfollow user
router.put('/:id/unfollow', async (req, res) => {

    try {

        if (req.body.userId !== req.params.id){

            try {

                const user = await UserSchema.findById(req.params.id);
                const currentUser = await UserSchema.findById(req.body.userId);

                if (user.followers.includes(req.body.userId)){
                    //push user id to the followings array
                    await user.updateOne({ $pull: { followers: req.body.userId } });
                    await currentUser.updateOne({ $pull: { followings: req.params.id } });
                    res.status(200).json({
                        message: "User has been unfollowed"
                    });
                }else{
                    res.status(403).json("You already unfollowed");
                }

            }catch (error) {
                res.status(500).json({
                    message: "Internal Server Error",
                    error: error
                });
            }

        }else{
            res.status(403).json({
                message: "You can't unfollow yourself"
            });
        }

    }catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }

});

module.exports = router;