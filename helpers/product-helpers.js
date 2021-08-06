var db = require('../config/conection')

module.exports = {
    addProduct: (product,callback) => {
        // console.log(product);

        db.get().collection('product').insertOne(product).then((data) => {
            // console.log(data.insertedId);
            callback(data.insertedId)
        })
        
    }
}