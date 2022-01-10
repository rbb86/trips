const router = require('../routes')

module.exports = (app) => {

    app.use('/', router.home)
    
    app.use('/home', router.home)

    app.use('/user', router.users)

    app.use('/trip', router.trips)

    app.use('/test', router.test)
    
}