var express = require('express');
var router = express.Router();

var productHelpers = require('../helpers/product-helpers')


/* GET home page. */
router.get('/', function(req, res, next) {

  
  
    // Data added to Admin page from Database
    productHelpers.getAllProducts().then((products) => {
      res.render('user/view-product', {products})
    })
  
  
  });


module.exports = router;
