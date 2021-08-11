var db = require('../config/conection')
var collections = require('../config/collections')
const { response } = require('express')
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
            
            // console.log(products);
            
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
    }
}