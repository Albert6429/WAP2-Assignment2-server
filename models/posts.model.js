var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog')


var PostSchema = new mongoose.Schema({
    title:String,
    author:String,
    content:String,
    likes:{type:Number,
        default:0},
    view:{type:Number,
        default:0}
});


var Post = mongoose.model('Post', PostSchema);
module.exports = Post;