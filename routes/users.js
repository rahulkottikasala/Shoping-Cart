const { response } = require('express');
var express = require('express');
var router = express.Router();

var productHelpers = require('../helpers/product-helpers')
var userHelpers = require('../helpers/user-helpers')


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
router.get('/login', (req, res) => {
  
  
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
    req.session.loginErr = true
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
})


module.exports = router;
