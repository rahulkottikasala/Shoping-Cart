var db = require('../config/conection')
var collections = require('../config/collections')
const bcrypt = require('bcrypt')
const { response } = require('express')
const { ObjectId } = require('mongodb')




module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            // (const saltRounds = 10;)
            userData.password = await bcrypt.hash(userData.password, 10);
            // console.log(userData.password);
            db.get().collection(collections.USER_COLLECTION).insertOne(userData).then((data) => {
                // console.log(userData);
                resolve(userData)
            })
        })

    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {

            let loginStatus = false;
            let response = {}
            let user = await db.get().collection(collections.USER_COLLECTION).findOne({ email: userData.email })

            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log('login success');
                        response.user = user
                        response.userStatus = true
                        resolve(response)
                    } else {
                        console.log('login failed');
                        resolve({ userStatus: false })
                    }
                })
            }
            else {
                console.log('login failed');
                resolve({ userStatus: false })
            }
        })
    },
    getUsers: () => {
        return new Promise(async (resolve, reject) => {
            let users = await db.get().collection(collections.USER_COLLECTION).find().toArray()
            resolve(users)
            // console.log(users);
        })

    },
    removeUser: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.USER_COLLECTION).deleteOne({ _id: ObjectId(userId) }).then((response) => {
                resolve(response)
            })
        })
    },

    addToCart: (proId, userId) => {
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collections.CART_COLLECTION).findOne({ user: ObjectId(userId) })
            if (userCart) {
                db.get().collection(collections.CART_COLLECTION).updateOne({ user: ObjectId(userId) },
                    {
                        $push: { products: ObjectId(proId) }
                    }
                ).then((response) => {
                    resolve(response)
                })
            } else {
                let cartObj = {
                    user: ObjectId(userId),
                    products: [ObjectId(proId)]
                }
                db.get().collection(collections.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve(response)
                })
            }
        })
    },
    
}