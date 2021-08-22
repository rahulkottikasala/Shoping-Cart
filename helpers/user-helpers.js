var db = require('../config/conection')
var collections = require('../config/collections')
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')
const { response } = require('express')




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
        let proObj = {
            item: ObjectId(proId),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {


            let userCart = await db.get().collection(collections.CART_COLLECTION).findOne({ user: ObjectId(userId) })
            if (userCart) {
                let proExist = userCart.products.findIndex(Element => Element.item == proId)
                if (proExist != -1) {
                    db.get().collection(collections.CART_COLLECTION).updateOne({ 'products.item': ObjectId(proId) },
                        {
                            $inc: { 'products.$.quantity': 1 }
                        }).then(() => {
                            resolve()
                        })
                } else {
                    db.get().collection(collections.CART_COLLECTION).updateOne({ user: ObjectId(userId) },
                        {
                            $push: { products: proObj }
                        }
                    ).then((response) => {
                        resolve()
                    })
                }


            } else {
                let cartObj = {
                    user: ObjectId(userId),
                    products: [proObj]
                }
                db.get().collection(collections.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve(response)
                })
            }
        })
    },
    getCartItems: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collections.CART_COLLECTION).aggregate([
                {
                    $match: { user: ObjectId(userId) }
                }, {
                    $unwind: "$products"
                }, {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                }, {
                    $lookup: {
                        from: collections.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                }, {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                }

            ]).toArray()
            // console.log(cartItems);
            resolve(cartItems)
        })
    },
    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = 0;
            let cart = await db.get().collection(collections.CART_COLLECTION).findOne({ user: ObjectId(userId) })
            if (cart) {
                count = cart.products.length
            }
            resolve(count)


        })
    },
    changeProductQuantity: (details) => {
        details.count = parseInt(details.count)
        details.quantity = parseInt(details.quantity)
        return new Promise((resolve, reject) => {
            if (details.count == -1 && details.quantity == 1) {
                db.get().collection(collections.CART_COLLECTION)
                    .updateOne({ _id: ObjectId(details.cart) },
                        {
                            $pull: { products: { item: ObjectId(details.product) } }
                        }
                    ).then((response) => {
                        resolve({ removeProduct: true })
                    })
            } else {
                db.get().collection(collections.CART_COLLECTION)
                    .updateOne({ _id: ObjectId(details.cart), 'products.item': ObjectId(details.product) },
                        {
                            $inc: { 'products.$.quantity': details.count }
                        }).then((response) => {

                            resolve({ status: true })
                        })
            }
        })
    },
    removeCartProduct: (details) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CART_COLLECTION)
                .updateOne({ _id: ObjectId(details.cart) },
                    {
                        $pull: { products: { item: ObjectId(details.product) } }
                    }
                ).then((response) => {
                    resolve(true)
                })
        })

    },
    getTotalAmount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let total = await db.get().collection(collections.CART_COLLECTION).aggregate([
                {
                    $match: { user: ObjectId(userId) }
                }, {
                    $unwind: "$products"
                }, {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                }, {
                    $lookup: {
                        from: collections.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                }, {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: { $multiply: ['$quantity', { $toInt: '$product.Price' }] } }
                    }
                }

            ]).toArray()
            // console.log(total[0].total);
            resolve(total[0].total)
        })
    },
    placeOrder: (details, product) => {
        return new Promise((resolve, reject) => {

            let status = details['payment'] === 'cod' ? 'placed' : 'pending'
            let orderObject = {
                deliverydetails: {
                    mobile: details.mobile,
                    addressn: details.address,
                    pincode: details.zipcode
                },
                userId: ObjectId(details.user),
                paymentMethod: details['payment'],
                products: product,
                totalAmount: details.totalPrice,
                status: status,
                date: new Date()
            }
            db.get().collection(collections.ORDER_COLLECTION).insertOne(orderObject).then((response) => {
                db.get().collection(collections.CART_COLLECTION).deleteOne({ user: ObjectId(details.user) })
                resolve()
            })
        })

    },
    getCartProductList: (userId) => {
        return new Promise(async (resolve, reject) => {
            // let user = userId.toString()
            let cart = await db.get().collection(collections.CART_COLLECTION).findOne({ user: ObjectId(userId) })
            resolve(cart.products)
        })
    },
}