const express = require("express");
const path = require("path");
const router = express.Router();
const cookieParser = require('cookie-parser');
const LogInCollection = require("../../mongodb");

// Middleware configuration
router.use(cookieParser());

const publicPath = path.join(__dirname, '../public');
console.log(publicPath);

router.get('/',(req,res)=>{
    console.log('rendering login');
    const username = req.cookies.username;
    if (username) {
        console.log(username);
      res.render('login', { naming: username });
    } else {
      res.render('login', { naming: 'Guest' });
    }})


router.post('/', async (req, res) => {
    var flag =0;
    const username = req.body.name;
    const password = req.body.password;
        const check = await LogInCollection.find({});
        for(var i=0 ; i<check.length;i++){
        if (check[i].password === req.body.password && check[i].name === req.body.name) {
            console.log(username);
            res.cookie('username', username);
            console.log(req.coockies);
            res.render("home", { naming: `${username}` });
            flag=1;
            break;
        }
    }
    //-------------NEED TO TO PAGE OF MISTAKES
    if(flag!=1){
        res.send('user details not exist.. please try again');
    }
});



module.exports = router;