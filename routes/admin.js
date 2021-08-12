const { response } = require('express');
var express = require('express');
const { Admin } = require('mongodb');
var router = express.Router();

const productHelpers = require('../helpers/product-helpers')
const userHelpers = require('../helpers/user-helpers')


/* GET users listing. */
router.get('/', function (req, res, next) {
  
  adminStatus =  userHelpers.doLogin
  // Data added to Admin page from Database
  productHelpers.getAllProducts().then((products) => {
    res.render('admin/view-product', { admin: true,products})
  })

});
router.get('/add-product', (req, res) => {
  res.render('admin/add-product', { admin: true })
});

// Add Product
router.post('/add-product', (req, res) => {

  productHelpers.addProduct(req.body, (id) => {

    // The name of the image has been changed to mongodb objectId
    var image = req.files.Image
    // console.log(id);

    image.mv('./public/images/product-images/' + id + '.jpg', (err) => {
      if (!err) {
        res.render('admin/add-product',{ admin: true})
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
router.get('/edit-product/:id',async(req,res) => {
  let editProId = req.params.id
  let  Product = await productHelpers.getProductDetails(req.params.id).then((Product) => {
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





module.exports =router;