const jwt = require('jsonwebtoken')
const { secret } = require('../config/config')


module.exports = {
    crateToken(data) {
        console.log('From jwt.js: ', data)
        return jwt.sign({_id: data.objectId, username:data.username, avatar: data.avatar}, secret, {expiresIn: '350h'})
    },
    verifyToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err,data) => {
                if(err){
                    reject(err)
                    return
                }
        
                resolve(data)
            })

        })
    }
}