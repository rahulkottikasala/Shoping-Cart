var db = require('../config/conection')
var collections = require('../config/collections')
const bcrypt = require('bcrypt')


module.exports = {
    doSignup:(userData) => {
        return new Promise(async(resolve, reject) => {
            // (const saltRounds = 10;)
            userData.password = await bcrypt.hash(userData.password, 10);
            // console.log(userData.password);
            db.get().collection(collections.USER_COLLECTION).insertOne(userData).then((data) =>{
resolve(data)
// console.log(data);
            })
        })

    }
}