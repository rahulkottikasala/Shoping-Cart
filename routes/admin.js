const { response } = require('express');
var express = require('express');
var router = express.Router();

var productHelpers = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function (req, res, next) {
  
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
    if(response)

    res.redirect('/admin/')
  })
})
module.exports =router;