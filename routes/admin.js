
var express = require('express');
var router = express.Router();


const productHelpers = require('../helpers/product-helpers')
const adminHelpers = require('../helpers/admin-helpers')
const userHelpers = require('../helpers/user-helpers')

const verifyAdmin = (req, res, next) => {
  if (req.session.adminLoggedIn) {
    next()
  } else {
    res.render('admin/admin-login', { doLogout: true })
  }
}



/* GET users listing. */
router.get('/', verifyAdmin, function (req, res, next) {
  let admin = req.session.admin



  // Data added to Admin page from Database
  productHelpers.getAllProducts().then((products) => {
    res.render('admin/view-product', { admin, adminAccess: true, products })
  })

});
router.get('/add-product', verifyAdmin, (req, res) => {
  res.render('admin/add-product', { adminAccess: true })
});

// Add Product
router.post('/add-product', (req, res) => {

  productHelpers.addProduct(req.body, (id) => {

    // The name of the image has been changed to mongodb objectId
    var image = req.files.Image
    // console.log(id);

    image.mv('./public/images/product-images/' + id + '.jpg', (err) => {
      if (!err) {
        res.render('admin/add-product', { adminAccess: true })
      } else {
        console.log(err);
      }
    })

  })
})

// Delete Product
router.get('/delete-product/:id', verifyAdmin, (req, res) => {
  let proId = req.params.id
  productHelpers.deleteProduct(proId).then((response) => {

    res.redirect('/admin/')
  })
})

// Edit Product
router.get('/edit-product/:id', verifyAdmin, (req, res) => {
  let editProId = req.params.id
  productHelpers.getProductDetails(req.params.id).then((Product) => {
    res.render('admin/edit-product', { Product, adminAccess: true })
  })
})

router.post('/edit-product/:id', (req, res) => {
  var image = req.files.Image
  var id = req.params.id

  productHelpers.updateProduct(req.params.id, req.body).then(() => {
    res.redirect('/admin/')
    image.mv('./public/images/product-images/' + id + '.jpg')

  })
})

 
// Admin Login
router.get('/administrator', (req, res) => {
  if (req.session.adminLoggedIn) {
    res.redirect('/admin/')
  } else
    res.render('admin/admin-login', { doLogout: true })
})

router.post('/administrator', (req, res) => {
  adminHelpers.doLogin(req.body).then((response) => {
    // console.log(response);
    if (response.adminStatus) {
      req.session.adminLoggedIn = true;
      req.session.admin = response.admin;
      res.redirect('/admin/')

    } else {
      res.render('admin/admin-login', { loginErr: req.session.adminLoginErr, doLogout: true })
      req.session.adminLoginErr = 'Invalid Username or Password'
    }
  })
})

// Admin Logout
router.get('/admin-logout', (req, res) => {

    req.session.destroy()
    res.render('admin/admin-login', { doLogout: true })

})

// View Product
router.get('/view-users', verifyAdmin, (req, res) => {
  userHelpers.getUsers().then((users) => {
    res.render('admin/view-users', { users, adminAccess: true })
  }).catch((err) => {
    console.log(err);
  })

})

// remove User
router.get('/remove-user/:id',verifyAdmin,(req,res) => {
let userId = req.params.id
userHelpers.removeUser(userId).then((response) => {
  if(response){
    res.redirect('/admin/view-users')
  }
})
})




module.exports = router;