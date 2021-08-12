const { response } = require('express');
var express = require('express');
var router = express.Router();


const productHelpers = require('../helpers/product-helpers')
const adminHelpers = require('../helpers/admin-helpers')

const verifyAdmin = (req,res,next) => {
  if(req.session.loggedIn){
    next()
  }else{
    res.render('admin/admin-login')
  }
}



/* GET users listing. */
router.get('/',verifyAdmin, function (req, res, next) {
  let admin = req.session.admin

  
  
  // Data added to Admin page from Database
  productHelpers.getAllProducts().then((products) => {
    res.render('admin/view-product', {admin ,products})
  })

});
router.get('/add-product',verifyAdmin, (req, res) => {
  res.render('admin/add-product', { admin :true })
});

// Add Product
router.post('/add-product', (req, res) => {

  productHelpers.addProduct(req.body, (id) => {

    // The name of the image has been changed to mongodb objectId
    var image = req.files.Image
    // console.log(id);

    image.mv('./public/images/product-images/' + id + '.jpg', (err) => {
      if (!err) {
        res.render('admin/add-product',{ admin :true})
      } else {
        console.log(err);
      }
    })

  })
})

// Delete Product

router.get('/delete-product/:id', (req,res) => {
  let proId = req.params.id
  productHelpers.deleteProduct(proId).then((response) =>{

    res.redirect('/admin/')
  })
})

// Edit Product
router.get('/edit-product/:id',(req,res) => {
  let editProId = req.params.id
 productHelpers.getProductDetails(req.params.id).then((Product) => {
    res.render('admin/edit-product',{Product,admin :true})
  })
})

router.post('/edit-product/:id',(req,res) => {
  var image = req.files.Image
  var id = req.params.id

  productHelpers.updateProduct(req.params.id,req.body).then(() => {
res.redirect('/admin/')
image.mv('./public/images/product-images/' + id + '.jpg')

  })
})

router.get('/administrator',(req,res) => {
if( req.session.loggedIn){
  res.redirect('/admin/')
}else
res.render('admin/admin-login',{admin :true })
})

router.post('/administrator', (req,res) => {
  adminHelpers.doLogin(req.body).then((response) => {
    // console.log(response);
    if (response.adminStatus){
      req.session.loggedIn = true;
      req.session.loginErr = false;
      req.session.admin= response.admin;
      res.redirect('/admin/')

    }else{
      res.render('admin/admin-login',{admin :true})
    }
  })
})




module.exports =router;