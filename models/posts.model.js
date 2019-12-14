let mongoose = require("mongoose")



let PostSchema = new mongoose.Schema({
  title:String,
  author:String,
  content:String,
  likes:{type:Number,
    default:0},
  view:{type:Number,
    default:0}
})


let Post = mongoose.model("Post", PostSchema)
module.exports = Post