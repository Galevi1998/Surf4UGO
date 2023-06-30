//חיבורים לכל הסיפריות וכל התוכנות
const express = require("express");
const path = require("path");
const app = express();
const LogInCollection = require("./mongodb");
const { CLIENT_RENEG_LIMIT } = require("tls");
const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cookieParser());


//save paths and messages

const publicPath = path.join(__dirname, '../public');
console.log(publicPath);

// EJS
app.set('view engine', 'ejs');

app.use(express.static(publicPath));

//------------------Routers----------------------
//Creating Route for login page
const LoginRouter = require('./Routers/routes/login');
//Activate Route for sign up page
app.use('/login',LoginRouter);
//----------------------------------------

//Creating Route for Sign Up page
const SignUpRouter = require('./Routers/routes/signup');
//Activate Route for sign up page
app.use('/signup',SignUpRouter);
//---------------------------------------

//Creating Route for AddProduct page
const AddProducts = require('./Routers/routes/Addproduct');
//Activate Route for sign up page
app.use('/Addproduct',AddProducts);
//----------------------------------------

//Creating Route for Update page
const UpdateProducts = require('./Routers/routes/updateproducts');
//Activate Route for Update page
app.use('/updateproducts',UpdateProducts);
//----------------------------------------

//Creating Route for surfboard page
const Surfboards = require('./Routers/routes/surfboard');
//Activate Route for surfboard page
app.use('/surfboard',Surfboards);
//----------------------------------------

//Creating Route for sunglasses page
const sunglasses1 = require('./Routers/routes/sunglasses');
//Activate Route for sunglasses page
app.use('/sunglasses',sunglasses1);
//----------------------------------------

//Creating Route for clothing page
const clothing1 = require('./Routers/routes/clothing');
//Activate Route for clothing page
app.use('/clothing',clothing1);

//----------------------------------------

//Creating Route for boardshorts page
const boardshorts = require('./Routers/routes/boardshorts');
//Activate Route for boardshorts page
app.use('/boardshorts',boardshorts);
//----------------------------------------

//Creating Route for surfingequipment page
const SurfEQ = require('./Routers/routes/surfingequipment');
//Activate Route for surfingequipment page
app.use('/surfingequipment',SurfEQ);
//----------------------------------------

//Creating Route for allproducts page
const AllP = require('./Routers/routes/allproducts');
//Activate Route for allproducts page
app.use('/allproducts',AllP);

//----------------------------------------

//Creating Route for outofstock page
const AllO = require('./Routers/routes/outofstock');
//Activate Route for outofstock page
app.use('/outofstock',AllO);
//----------------------------------------

//Creating Route for ShowSingleProduct page
const showS = require('./Routers/routes/show1product');
//Activate Route for ShowSingleProduct page
app.use('/show1product',showS);
//----------------------------------------

//Creating Route for SupplierPage page
const showSup = require('./Routers/routes/SupplierPage');
//Activate Route for SupplierPage page
app.use('/SupplierPage',showSup);
//----------------------------------------

//Creating Route for manager page
const manager = require('./Routers/routes/manager');
//Activate Route for manager page
app.use('/manager',manager);
//----------------------------------------

//Creating Route for serach page
const searchRouter  = require('./Routers/routes/search');
//Activate Route for boardshorts page
app.use('/search',searchRouter);

//------------------------------------------
//Creating Route for myorders page
const myOrders = require('./Routers/routes/myorders');
//Activate Route for myordres page
app.use('/myorders', myOrders);
//------------------------------------------
//Creating Route for Cart page
const Cart = require('./Routers/routes/Cart');
//Activate Route for myordres page
app.use('/Cart', Cart);
//------------------------------------------
//Creating Route for WishList page
const WishList = require('./Routers/routes/WishList');
//Activate Route for WishList page
app.use('/WishList', WishList);

//--------------End_Of_Routing--------------------------

// Define a route for the learnaboutus page
app.get('/learnaboutus', (req, res) => {
  res.render('learnaboutus');
});

app.get('/', (req, res) => {
    const username = req.cookies.username;
    const permission = req.cookies.Permission;
    if (username) {
        console.log(username);
      res.render('home', { naming: username,permission:permission });
    } else {
      res.render('home', { naming: 'Guest' ,permission:0 });
    }
});


//Deleting the Data from coockies
app.post('/delCoocike',async(req,res)=>{
  console.log('Got in');
  var cookies = req.cookies;
  for (var cookieName in cookies) {
    res.clearCookie(cookieName);
  }

  res.render('home',{naming:'Guest',permission:0});
})


// Activate Server
app.listen(3000, () => {
    console.log('port connected');
});


























//קבלת הפקודה אקטשיון מ signup.ejs והתמודדות איתה
// app.post('/signup', async (req, res) => {
//     const checking = await LogInCollection.find({});
//     const data = {
//         name: req.body.name,
//         password: req.body.password,
//         email:req.body.email,
//         permission:0
//     };
//     const email = req.body.email;
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
//     if (emailRegex.test(email)) {
//       // Valid email address
//       console.log("Email is valid");
//     if(checking.length===0){
//         await LogInCollection.insertMany([data]);
//     }
//     for(var i=0 ; i<checking.length ; i++){
//         console.log('here we are');
//     try {
//         if (checking[i].name === req.body.name) {
//             res.send("user details already exist");
//         } else {
//             console.log(data)
//             await LogInCollection.insertMany([data]);
//         }
//     } catch {
//         res.send("wrong inputs");
//     }
// }
//     }
// else {
//     // Invalid email address
//     console.log("Email is invalid");
//     res.send("wrong mail");

//   }

//     res.status(201).render("home", {
//         naming: req.body.name
//     });

// });

// קבלת אקטשיון מהלוגין.איגיס והתמודדות איתה
// בדיקה בבסיס נתונים שלנו האם קיין שם משתמש וסיסמא של אותו משתמש
/*app.post('/login', async (req, res) => {
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
    if(flag!=1){
        res.send('user details not exist.. please try again');
    }
});*/









//--------------NEED TO SEND TO THE ROUTER OF LOGIN

/*app.get('/login' ,(req,res)=>{
    const username = req.cookies.username;
    if (username) {
        console.log(username);
      res.render('login', { naming: username });
    } else {
      res.render('login', { naming: 'Guest' });
    }
})*/









// שהמשתמש מסיים עם סיומת סינאפ אז נציב לו את הקובץ signup.ejs
// app.get('/signup', (req, res) => {
//     res.render('signup');
// });
// שהמשתמש מסיים עם סיומת רגילה- דיפולטיבית אז נציב לו את הקובץ login.ejs