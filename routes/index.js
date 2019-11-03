let express = require("express")
let router = express.Router()

// eslint-disable-next-line no-unused-vars
router.get("/", function(req, res, next) {
  res.render("index", { title: "CreativeLand microblog" })
})

module.exports = router
