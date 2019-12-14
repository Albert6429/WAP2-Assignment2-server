let User = require("../models/user.model")
let express = require("express")
let router = express.Router()


router.findAll = function(req, res) {
  User.find(function(err, data) {
    if (err)
      res.send(err)
    else {
      res.json(data)
    }
  })
}

router.findOne = function(req, res) {
  User.findOne({ "username" : req.params.username },function(err, user) {
    if(err){
      res.send(err)
    }
    else if (user!= null){
      res.json(user)
    }
    else{
      res.json({message: "The user does not exist"})
    }
  })
}

router.register = function(req, res) {
  res.setHeader("Content-Type", "application/json")
  let user = new User()
  user.username = req.body.username
  user.password = req.body.password
  user.email = req.body.email
  user.upvotes = req.body.upvotes

  User.findOne({ "username" : req.body.username },function(err, data) {
    let correctEmail=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    if(err){
      res.send(err)
    }
    else if (data!= null){
      res.json({message: "The username already existed"})
    }
    else if (!correctEmail.test(user.email)){
      res.json({message: "Please enter a correct email address"})
    }
    else{
      user.save(function (err) {
        if (err) {
          res.send(err)
        }
        else {
          res.json({message: "Register successfully", data: user})
        }
      })
    }
  })
}

router.login = function(req, res) {
  let password = req.body.password
  User.findOne({"username":req.body.username},function(err,user){
    if(err){
      res.send(err)
    }
    else if(!user){
      res.json({message: "The username does not exist"})
    }
    else if(user.password != password){
      res.json({message: "The password is wrong"})
    }
    else{
      res.json({message: "Login successfully", data: user})
    }
  })
}

router.deleteUser = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err) {
    if (err){
      res.json({message: "The id does not exist", errmg: err})
    }
    else{
      User.find(function(err, data) {
        if (err)
          res.send(err)
        else {
          res.json({message: "The user is deleted", data: data})
        }
      })
    }
  })
}

router.incrementFollowed = function(req, res) {
  User.findOne({"username": req.params.username}, function(err,user) {
    if (err)
      res.send(err)
    else if(!user){
      res.json({message: "The username does not exist"})
    }
    else {
      user.followed += 1
      user.save(function (err) {
        if (err)
          res.send(err)
        else
          res.json({ message: "The user is followed successfully!", data: user })
      })
    }
  })
}


module.exports = router