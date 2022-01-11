const jwt = require ('./jwt')
const { cookie } = require('../config/config')
const { default: fetch } = require('node-fetch')

module.exports = (justContinue = false) => {
    return function (req, res, next) {
        const token = req.cookies[cookie] || '';

        

        jwt.verifyToken(token)
        .then(result => {
            fetch(`https://api.backendless.com/8437C1A8-6541-C39B-FF0B-6D084FB90F00/046A7A56-BEE0-43DA-AA88-BD4185E3DB7D/data/user/${result._id}`).
            then(userdata => {
                if(userdata.status !== 200){
                    throw new Error('user not logged');
                }

                res.locals.user = result.username;
                res.locals._id = result._id;
                res.locals.avatar = result.avatar
                next()
                
                })
        })
            .catch((err) => {
                if(justContinue) {
                    next()
                    return;
                }
                res.redirect('/user/login')
            })
    }
}