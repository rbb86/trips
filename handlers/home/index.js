// const Tripps = require('../trips')

module.exports = {
    get: {
        home(req, res, next) {
            res.render('./home/home.hbs', {
                // isLoggedIn: req.user ? true : false,
                isLoggedIn: res.locals.user ? true : false,
                username: res.locals.user ? res.locals.user : null
            })
        }
    }, 
    post: {

    }
}