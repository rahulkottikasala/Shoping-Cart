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
router.get('/', async function (req, res, next) {
  let user = req.session.user
  // cart count ;
  let cartCount = null;
  if (req.session.user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }

  // Data added to Admin page from Database
  productHelpers.getAllProducts().then((products) => {
    res.render('user/view-product', { products, user, cartCount })
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
  router.get('/cart', verifyLogin, async (req, res) => {
    let user = req.session.user
    let totalValue = 0;
    let products = await userHelpers.getCartItems(req.session.user._id)
    if(products.length > 0) {
      totalValue = await userHelpers.getTotalAmount(req.session.user._id)
    }
    
    res.render('user/cart', { products, user, totalValue })

  }),

  /*Create cart collection*/
  router.get('/add-to-cart/:id', verifyLogin, (req, res) => {
    // console.log('api call');
    userHelpers.addToCart(req.params.id, req.session.user._id).then((response) => {

      res.json({ status: true })
    })
  })

/* orders page */
router.get('/orders', verifyLogin, async (req, res) => {
  let user = req.session.user
  let orders = await userHelpers.getOrderProduct(user._id)
  // console.log(orders);

  res.render('user/orders', { user, orders, deliDetails: orders.deliveryDetails })
})

/* cart product change */
router.post('/change-product-quantity', (req, res) => {
  let user = req.body.user
  userHelpers.changeProductQuantity(req.body).then(async (response) => {
    response.total = await userHelpers.getTotalAmount(user)
    res.json(response)
  })
})
/* remove cart product  */
router.post('/remove-cart-product', (req, res) => {
  // console.log(req.body);
  userHelpers.removeCartProduct(req.body).then((response) => {
    res.json(response)
  })
})

/* place order */
router.get('/place-order', verifyLogin, async (req, res) => {
  let user = req.session.user
  let total = await userHelpers.getTotalAmount(user._id)
  res.render('user/place-order', { user, total })
})

router.post('/place-order', async (req, res) => {
  let product = await userHelpers.getCartProductList(req.body.user)
  let totalPrice = await userHelpers.getTotalAmount(req.body.user)
  userHelpers.placeOrder(req.body, product).then((orderId) => {
    if (req.body['payment'] === 'cod') {
      res.json({ codSuccess: true })

    } else {
      userHelpers.generateRazorpay(orderId, totalPrice).then((response) => {
        res.json(response)
      })
    }

  })
})

/* order Successfull */
router.get('/order-success', verifyLogin, (req, res) => {
  let user = req.session.user
  res.render('user/order-success', { user })
})


/* Order Product details */
router.get('/view-order-product/:id', async (req, res) => {
  orderId = req.params.id
  let orderList = await userHelpers.getOrderProductDetails(orderId)
  res.render('user/view-order-product', { orderList })
})

/* Razorpay peyment success */
router.post('/verifyPeyment', (req, res) => {
  console.log(req.body);
})


module.exports = router;
