/*eslint no-unused-vars: "off" */
let Post = require("../models/posts.model")
let express = require("express")
let router = express.Router()

router.findOnePost=function(req, res) {
  Post.findById(req.params.id, function(err,post){
    if (err){
      res.json({message: "The post does not exist", errmsg: err})
    }
    else {
      post.view += 1
      post.save(function (err) {
        if (err)
          res.send(err)
        else
          res.json({data: post })
      })
    }
  })
}

router.findAllPosts=function(req, res) {
  Post.find(function(err, post) {
    if (err)
      res.send(err)
    else {
      res.json(post)
    }
  })
}

router.writePosts = function(req, res){
  let post = new Post()
  post.title = req.body.title
  post.author = req.body.author
  post.content = req.body.content
  post.likes = req.body.likes
  post.view = req.body.view

  Post.findOne({ "title" : req.body.title },function(err, data) {
    if(err){
      res.send(err)
    }
    else{
      post.save(function (err) {
        if (err) {
          res.send(err)
        }
        else {
          res.json({message: "Post successfully", data: post})
        }
      })
    }
  })
}

router.incrementLikes = function(req, res) {
  Post.findById(req.params.id, function(err,post) {
    if (err){
      res.json({message: "The post does not exist", errmsg: err})
    }
    else {
      post.likes += 1
      post.save(function (err) {
        if (err)
          res.send(err)
        else
          res.json({ message: "The post is liked successfully!", data: post })
      })
    }
  })
}

router.deletePost = function(req, res) {
  Post.findByIdAndRemove(req.params.id, function(err) {
    if (err){
      res.json({message: "The id does not exist", errmg: err})
    }
    else{
      Post.find(function(err, data) {
        if (err)
          res.send(err)
        else {
          res.json({message: "The post is deleted", data: data})
        }
      })
    }
  })
}



module.exports = router