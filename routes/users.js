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
  res.render('user/login')
});

router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if(response.status){
      req.session.loggedIn = true;
      req.session.user = response.user
      res.redirect('/')
    }else{
      res.redirect('/login')
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
