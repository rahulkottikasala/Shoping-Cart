const { response } = require("express");

module.exports = {



    doLogin: (adminInfo) => {
        let admin = {
            Name: 'Admin',
            Email: 'admin@gmail.com',
            Password: 'admin0'
        }

        let response = {}

        return new Promise((resolve, reject) => {
            // console.log(adminInfo);
            // console.log(admin);
            if (admin.Email === adminInfo.Email) {
                if (admin.Password === adminInfo.Password) {
                    response.admin = admin;
                    response.adminStatus = true
                    resolve(response)
                    console.log('success');
                } else {
                    resolve(response.adminStatus = false)
                    console.log('failed');
                }
            } else {
                resolve(response.adminStatus = false)
                console.log('failed');
            }
        })
    },

   
}