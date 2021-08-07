var db = require('../config/conection')
var collections = require('../config/collections')
const bcrypt = require('bcrypt')


module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            // (const saltRounds = 10;)
            userData.password = await bcrypt.hash(userData.password, 10);
            // console.log(userData.password);
            db.get().collection(collections.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data)
                // console.log(data);
            })
        })

    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false;
            let response = {}
            let user = await db.get().collection(collections.USER_COLLECTION).findOne({ email: userData.email })
            if (user){
                bcrypt.compare(userData.password,user.password).then((status) =>{
                    if(status){
                        console.log('login success');
                        response.user = true
                        response.status = true
                        resolve(response)
                    }else{
                        console.log('login failed');
                        resolve({status:false})
                    }
                })
            }else{
                console.log('login failed');
                resolve({status:false})
            }
        })
    }
}