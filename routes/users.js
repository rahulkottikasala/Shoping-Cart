const { response } = require('express');
var express = require('express');
const collections = require('../config/collections');
var router = express.Router();

const productHelpers = require('../helpers/product-helpers')
const userHelpers = require('../helpers/user-helpers')

// user login verifying
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {

    next()
  } else {
    res.render('user/login')
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user
  // console.log(user);


  // Data added to Admin page from Database
  productHelpers.getAllProducts().then((products) => {
    res.render('user/view-product', { products, user })
  })
});
/* GET login page. */
router.get('/login', verifyLogin, (req, res) => {


  if (req.session.loggedIn) {

    res.redirect('/')
  } else
    res.render('user/login')
});

router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {

    if (response.userStatus) {
      req.session.loggedIn = true;
      req.session.loginErr = false;
      req.session.user = response.user;
      res.redirect('/')
    } else {
      res.render('user/login', { loginErr: req.session.loginErr })
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
    req.session.loggedIn = true;
    req.session.user = response
    res.redirect('/')

  })
})

/* logout page */
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
}),

  /* cart page */
  router.get('/cart', verifyLogin, async(req, res) => {
    let user = req.session.user
    let product = await userHelpers.getCartItems(req.session.user._id)
console.log(product);

    res.render('user/cart', {products, user })

  }),

  /*Create cart collection*/
  router.get('/add-to-cart/:id', verifyLogin, (req, res) => {
    userHelpers.addToCart(req.params.id, req.session.user._id).then((response) => {
      res.redirect('/')
    })
  })

/* orders page */
router.get('/orders', verifyLogin, (req, res) => {
  let user = req.session.user
  res.render('user/orders', { user })
})






module.exports = router;
