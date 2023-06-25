const express = require("express");
const path = require("path");
const router = express.Router();
const cookieParser = require('cookie-parser');
const LogInCollection = require("../../mongodb");

// Middleware configuration
router.use(cookieParser());
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const publicPath = path.join(__dirname, '../public');
console.log(publicPath);

router.use(express.static(publicPath));

router.get('/', (req, res) => {
    console.log('Got To sign up');
    res.render('signup');
});

router.post('/', async (req, res) => {
    console.log('Got To sign up VS');
    const checking = await LogInCollection.find({});
    const data = {
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      permission: 0
    };
    const email = req.body.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (emailRegex.test(email)) {
      // Valid email address
      console.log("Email is valid");
      let userExists = false;
      for (var i = 0; i < checking.length; i++) {
        if (checking[i].name === req.body.name) {
          userExists = true;
          break;
        }
      }
      if (userExists) {
        res.send("User details already exist");
      } else {
        console.log(data);
        await LogInCollection.insertMany([data]);
        res.status(201).render("home", { naming: req.body.name , permission:0});
      }
    } else {
      // Invalid email address
      console.log("Email is invalid");
      res.send("Invalid email address");
    }
  });
  
module.exports = router;
