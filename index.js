//חיבורים לכל הסיפריות וכל התוכנות
const express = require("express");
const path = require("path");
const app = express();
const LogInCollection = require("./mongodb");
const { CLIENT_RENEG_LIMIT } = require("tls");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

//save paths and messages

const publicPath = path.join(__dirname, '../public');
console.log(publicPath);

// EJS
app.set('view engine', 'ejs');

app.use(express.static(publicPath));

// שהמשתמש מסיים עם סיומת סינאפ אז נציב לו את הקובץ signup.ejs
app.get('/signup', (req, res) => {
    res.render('signup');
});
// שהמשתמש מסיים עם סיומת רגילה- דיפולטיבית אז נציב לו את הקובץ login.ejs

app.get('/', (req, res) => {
    res.render('login');
});

//קבלת הפקודה אקטשיון מ signup.ejs והתמודדות איתה
app.post('/signup', async (req, res) => {
    const checking = await LogInCollection.find({});
    const data = {
        name: req.body.name,
        password: req.body.password,
        email:req.body.email,
        permission:0
    };
    const email = req.body.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailRegex.test(email)) {
      // Valid email address
      console.log("Email is valid");
    if(checking.length===0){
        await LogInCollection.insertMany([data]);
    }
    for(var i=0 ; i<checking.length ; i++){
        console.log('here we are');
    try {
        if (checking[i].name === req.body.name) {
            res.send("user details already exist");
        } else {
            console.log(data)
            await LogInCollection.insertMany([data]);
        }
    } catch {
        res.send("wrong inputs");
    }
}
    }
else {
    // Invalid email address
    console.log("Email is invalid");
    res.send("wrong mail");

  }

    res.status(201).render("home", {
        naming: req.body.name
    });

});

// קבלת אקטשיון מהלוגין.איגיס והתמודדות איתה
// בדיקה בבסיס נתונים שלנו האם קיין שם משתמש וסיסמא של אותו משתמש
app.post('/login', async (req, res) => {
    var flag =0;
        const check = await LogInCollection.find({});
        for(var i=0 ; i<check.length;i++){
        if (check[i].password === req.body.password && check[i].name === req.body.name) {
            res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` });
            flag=1;
            break;
        }
    }
    if(flag!=1){
        res.send('user details not exist.. please try again');
    }
});

// הפעלת השרת
app.listen(3000, () => {
    console.log('port connected');
});
