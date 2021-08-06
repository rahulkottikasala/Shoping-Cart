var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

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

module.exports = router;
