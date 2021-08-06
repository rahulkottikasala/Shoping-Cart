var db = require('../config/conection')
var collections = require('../config/collections')

module.exports = {
    addProduct: (product,callback) => {
      
        // Data (Product) added to database
        db.get().collection('product').insertOne(product).then((data) => {
            callback(data.insertedId)
        })
        
    },
    getAllProducts :  () => {

        // fetch data from database
        return new Promise(async(resolve,reject) => {
            let products = await db.get().collection(collections.PRODUCT_COLLECTION).find().toArray()
            
            // console.log(products);
            
            resolve(products)
        })
    }
}