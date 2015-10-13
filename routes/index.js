var express = require('express');
var router = express.Router();
var models = require('../models');
var Post = models.Post;

router.route("/:_id")
    .get(function (req, res) {
        Post.findById(req.param("_id"), function (err, post) {
            res.json(post);
        })
    })
    .put(function(req, res){
        Post.findById(req.param("_id"), function (err, post) {
            post.title = req.param("title");
            post.contents = req.param("contents");
            post.save(function(err){
                if(err){
                    res.send(err);
                }
                res.send({
                    message: "success",
                    posted: post
                })
            });
        })
    });

router.route("/")
    .get(function (req, res) {
        Post.find(function (err, posts) {
            if (err) {
                res.send(err);
            }
            res.json(posts);
        });
    })
    .post(function (req, res) {
        var item = new Post();
        item.title = req.param("title");
        item.contents = req.param("contents");
        item.save(function (err) {
            if (err) {
                res.send(err);
            }
            res.json({
                message: "success",
                posted: item
            });
        });
    });

module.exports = router;
