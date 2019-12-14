let mongoose = require("mongoose")


let UserSchema = new mongoose.Schema({
  username:String,
  password:String,
  email:String,
  followed:{type:Number,
    default:0}
})

let User = mongoose.model("User", UserSchema)
module.exports = User