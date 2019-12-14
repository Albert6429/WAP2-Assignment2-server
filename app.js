/*eslint no-unused-vars: "off" */
let express = require("express")
let path = require("path")
let favicon = require("serve-favicon")
let logger = require("morgan")
let cookieParser = require("cookie-parser")
let bodyParser = require("body-parser")
let cors = require("cors")

let routes = require("./routes/index")
let users = require("./routes/users")
let posts = require("./routes/posts")


let app = express()
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
if (process.env.NODE_ENV !== "test") {
  app.use(logger("dev"))
}
app.use("/", routes)
app.use(cors())



//Our Custom Routes
app.get("/users", users.findAll)
app.get("/users/:username", users.findOne)
app.get("/posts", posts.findAllPosts)
app.get("/posts/:id", posts.findOnePost)
app.post("/reg", users.register)
app.post("/log", users.login)
app.post("/writeposts", posts.writePosts)
app.put("/users/:username/followed", users.incrementFollowed)
app.put("/posts/:id/likes", posts.incrementLikes)
app.delete("/deleteUser/:id", users.deleteUser)
app.delete("/deletePost/:id", posts.deletePost)




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error("Not Found")
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render("error", {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render("error", {
    message: err.message,
    error: {}
  })
})
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const uri = `${process.env.MONGO_URI}${process.env.MONGO_DB}`
console.log(uri)
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})


var db = mongoose.connection

db.on('error', (err) => {
  console.log('connection error', err)
})
db.once('open', function () {
  console.log('connected to database')
})
module.exports = app
