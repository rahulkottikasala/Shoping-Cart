var db = require('../config/conection')
var collections = require('../config/collections')

const { ObjectId } = require('mongodb')

module.exports = {
    addProduct: (product,callback) => {
      
        // Data (Product) added to database
        db.get().collection('product').insertOne(product).then((data) => {
            callback(data.insertedId)
        })
        
    },
    getAllProducts :  () => {

        // fetch data (Product) from database
        return new Promise(async(resolve,reject) => {
            let products = await db.get().collection(collections.PRODUCT_COLLECTION).find().toArray()
            
           
            
            resolve(products)
        })
    },

    deleteProduct : (proId) => {
        return new Promise((resolve,reject) => {
            // console.log('proId:'+proId);
            db.get().collection(collections.PRODUCT_COLLECTION).deleteOne({_id : ObjectId(proId)}).then((response) =>{
resolve(response)
            })
        })
    },
    getProductDetails :  (proId) => {

        // fetch data (Product) from database
        return new Promise(async(resolve,reject) => {
            let editProduct = await db.get().collection(collections.PRODUCT_COLLECTION).find({_id : ObjectId(proId)}).toArray()
            
           resolve(editProduct)
        })
    },
    updateProduct : (proId,product) => {
return new Promise ((resolve,reject) => {
    console.log(proId);
    db.get().collection(collections.PRODUCT_COLLECTION).updateOne({_id : ObjectId(proId)},{
$set : { 
        Name : product.Name,
        Category : product.Category ,
        Description : product.Description,
        Price : product.Price
    }
    }).then((response) => {
        resolve()
    })
})
    }

}