var express = require('express');
var router = express.Router();

var productHelpers = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/',function(req, res, next) {

  let Product = [
    {
      name : 'Iphone 11 ',
      category : 'Mobile',
      description : 'This is good phone',
      image : 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone11-green-select-2019_GEO_EMEA?wid=834&hei=1000&fmt=jpeg&qlt=95&.v=1567021766404'
    
    },
    {
      name : 'Samsung',
      category : 'Mobile',
      description : 'This is good phone',
      image : 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone11-green-select-2019_GEO_EMEA?wid=834&hei=1000&fmt=jpeg&qlt=95&.v=1567021766404'
    
    },
    {
      name : 'Honor',
      category : 'Mobile',
      description : 'This is good phone',
      image : 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone11-green-select-2019_GEO_EMEA?wid=834&hei=1000&fmt=jpeg&qlt=95&.v=1567021766404'
    
    },
    {
      name : 'MI Redmi',
      category : 'Mobile',
      description : 'This is good phone',
      image : 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone11-green-select-2019_GEO_EMEA?wid=834&hei=1000&fmt=jpeg&qlt=95&.v=1567021766404'
    
    }
    
    ]

  res.render('admin/view-product',{admin:true ,Product})
});
router.get('/add-product',(req,res) => {
  res.render('admin/add-product',{admin:true})
});
router.post('/add-product',(req,res) => {
  
  // console.log(req.body);
  // console.log(req.files.Image);
  productHelpers.addProduct(req.body,(id) => {
    var image = req.files.Image
    console.log(id);
    image.mv('./public/images/product-images/'+id+'.jpg',(err,done) => {
      if(!err){
        res.render('admin/add-product')
      }else{
        console.log(err);
      }
    })
    
  })
})

module.exports = router;
