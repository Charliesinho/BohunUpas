
// Hello I will be gone

const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});


module.exports = router;
>>>>>>> 36c51b8a4fd5ccc7c927538877f27eb615619981
