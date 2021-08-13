const router = require('express').Router();
const isAuth = require('../utils/isAuth');
const handler = require('../handlers/trips');
const validations = require('../utils/validator')

router.get('/shared-trips', isAuth(), handler.get.sharedTrips);
router.get('/offer-trip', isAuth(), handler.get.offerTrip);
router.get('/trip-details/:id', isAuth(), handler.get.detailsTrip);
router.get('/join/:id', isAuth(), handler.get.join);
router.get('/leave/:id', isAuth(), handler.get.leave);

// router.post('/offer-trip', isAuth(), validations, handler.post.offerTrip)
router.post('/offer-trip', isAuth(), handler.post.offerTrip)

module.exports = router;