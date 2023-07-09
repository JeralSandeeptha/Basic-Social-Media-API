const express = require('express');
const PostSchema = require('../models/Post');
const UserSchema = require('../models/User');

const router = express.Router();

//create post
router.post('/', async (req, res) => {

    try {
        const newPost = await new PostSchema(req.body);
        const savedPost = await newPost.save();
        res.status(200).json({
            message: "New post added",
            data: savedPost
        });
    }catch (error){
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }

});

//update post
router.put('/:id', async (req, res) => {

    try {
        const post = await PostSchema.findById(req.params.id);
        if(post.userId === req.body.userId){
            const savedPost = await post.updateOne({$set: req.body});
            res.status(200).json({
                message: "Post has updated",
                data: savedPost
            });
        }else{
            res.status(403).json({
                message: "You can update only your posts"
            });
        }
    }catch (error){
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }

});

//delete post
router.delete('/:id', async (req, res) => {

    try {
        const post = await PostSchema.findById(req.params.id);
        if(post.userId === req.body.userId){
            const deletedPost = await post.deleteOne();
            res.status(200).json({
                message: "Post has deleted",
                data: deletedPost
            });
        }else{
            res.status(403).json({
                message: "You can delete only your posts"
            });
        }
    }catch (error){
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }

});

//like / dislike post
router.put('/:id/like', async (req, res) => {

    try {

        const post = await PostSchema.findById(req.params.id);

        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json({
                message: "Post like succesfully"
            });
        }else{
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json({
                message: "Post dislike successfully"
            });
        }

    }catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }

});

//get post
router.get('/:id', async (req, res) => {

    try {
        const post = await PostSchema.findById(req.params.id);
        res.status(200).json({
            message: "Post gets succesfully",
            data: post
        });
    }catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }

});

//get timeline posts
router.get('/timeline/all', async (req, res) => {

    try {

        const currentUser = await UserSchema.findById(req.body.userId);

        const userPosts = await PostSchema.find({ userId: currentUser._id });

        const friendPosts = await Promise.all(
            currentUser.followings.map(friendId => {
                return PostSchema.find({ userId: friendId });
            })
        );

        res.status(200).json({
            message: "Timeline post gets succesfully",
            data: userPosts.concat(...friendPosts)
        });
    }catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }

});

//get all posts related to single one

module.exports = router;