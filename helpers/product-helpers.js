var db = require('../config/conection')
var collections = require('../config/collections')

module.exports = {
    addProduct: (product,callback) => {
      

        db.get().collection('product').insertOne(product).then((data) => {
            callback(data.insertedId)
        })
        
    },
    getAllProducts :  () => {
        return new Promise(async(resolve,reject) => {
            let products = await db.get().collection(collections.PRODUCT_COLLECTION).find().toArray()
            console.log(products);
            resolve(products)
        })
    }
}