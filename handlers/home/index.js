module.exports = {
    get: {
        home(req, res, next) {
            res.render('./home/home.hbs', {
                isLoggedIn: res.locals.user ? true : false,
                username: res.locals.user ? res.locals.user : null,
                avatar: res.locals.avatar
            })
        }
    }, 
    post: {

    }
}