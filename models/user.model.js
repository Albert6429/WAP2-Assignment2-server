var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog')

var UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    followed:{type:Number,
        default:0}
});

var User = mongoose.model('User', UserSchema);
module.exports = User;