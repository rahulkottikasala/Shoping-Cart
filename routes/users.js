const { response } = require('express');
var express = require('express');
var router = express.Router();

const productHelpers = require('../helpers/product-helpers')
const userHelpers = require('../helpers/user-helpers')

// user login verifying
const verifyLogin = (req,res,next) => {
  if(req.session.loggedIn){
    next()
  }else{
    res.render('user/login')
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user
  console.log(user);


  // Data added to Admin page from Database
  productHelpers.getAllProducts().then((products) => {
    res.render('user/view-product', { products, user})
  })
});
/* GET login page. */
router.get('/login',verifyLogin, (req, res) => {
  
  
  if (req.session.loggedIn){

    res.redirect('/')
  }else
  res.render('user/login')
});

router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    let valid = {
      invalid: 'Email or Password is Incorrect'
    }
    if(response.userStatus){
      req.session.loggedIn = true;
      req.session.loginErr = false;
      req.session.user = response.user;
      res.redirect('/')
    }else if(response.adminStatus){
      // Data added to Admin page from Database
  productHelpers.getAllProducts().then((products) => {
    res.render('admin/view-product', { admin: true,products})
  })
      req.session.loggedIn = true;
      req.session.user = response.user
    }
     else{
    res.render('user/login',{'loginErr':req.session.loginErr})
    req.session.loginErr = 'Invalid Username or Password'
    }
  })

});

/* GET signup page. */
router.get('/signup', (req, res) => {
  res.render('user/signup')
});

router.post('/signup', (req, res) => {

  userHelpers.doSignup(req.body).then((response) => {
    // console.log(response);
    res.render('user/login')

  })
})

/* logout page */
router.get('/logout',(req,res) => {
  req.session.destroy()
  res.redirect('/')
}),

/* cart page */
router.get('/cart',verifyLogin, (req,res) => {
  
    res.render('user/cart')
  
}),

/* orders page */
router.get('/orders',verifyLogin, (req,res) => {
  res.render('user/orders')
})




module.exports = router;
