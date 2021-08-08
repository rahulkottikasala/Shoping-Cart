var db = require('../config/conection')
var collections = require('../config/collections')
const bcrypt = require('bcrypt')
const { getMaxListeners } = require('../app')
const { Admin } = require('mongodb')


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
            const admin = {
                fName:'Admin',
                email:'admin@gmail.com',
                password:'admin0'
            };
            let loginStatus = false;
            let response = {}
            let user = await db.get().collection(collections.USER_COLLECTION).findOne({ email: userData.email })

             if(userData.email === admin.email ){
                 if(userData.password === admin.password){
                    console.log('login success')
                    response.user = admin
                    response.adminStatus = true
                    resolve(response)
                 }

            }
            else if (user){
                bcrypt.compare(userData.password,user.password).then((status) =>{
                    if(status){
                        console.log('login success');
                        response.user = user
                        response.userStatus = true
                        resolve(response)
                    }else{
                        console.log('login failed');
                        resolve({userStatus:false})
                    }
                })
            } 
            else{
                console.log('login failed');
                resolve({userStatus:false})
            }
        })
    }
}