const {
    json
} = require('express');
const {
    validationResult
} = require('express-validator');
const {
    default: fetch
} = require('node-fetch');
let tripURL = "https://api.backendless.com/8437C1A8-6541-C39B-FF0B-6D084FB90F00/046A7A56-BEE0-43DA-AA88-BD4185E3DB7D/data/trips/";
let tripsURL = "https://api.backendless.com/8437C1A8-6541-C39B-FF0B-6D084FB90F00/046A7A56-BEE0-43DA-AA88-BD4185E3DB7D/data/trips";


module.exports = {
    get: {
        sharedTrips(req, res, next) {
            fetch(tripsURL).
            then(response => response.json()).
            then(trips => {

                res.render('trips/shared-trips.hbs', {
                    isLoggedIn: res.locals.user ? true : false,
                    username: res.locals.user ? res.locals.user : null,
                    trips
                })
            })
        },
        offerTrip(req, res, next) {
            res.render('trips/offer-trip.hbs', {
                isLoggedIn: res.locals.user ? true : false,
                username: res.locals.user ? res.locals.user : null
            })
        },
        detailsTrip(req, res, next) {
            const {
                id
            } = req.params;

            fetch(tripURL + id).
            then(x => x.json()).
            then(trip => {
                trip.isOwner = trip.driverName === res.locals.user;
                trip.isComing = trip.passengers.indexOf(res.locals.user) >= 0 ? true : false
                if(!trip.isOwner && !trip.isComing && trip.seats > 0) {
                    trip.hasSeats = true
                }
                if(!trip.isOwner && !trip.isComing && trip.seats <1 ) {
                    trip.noSeats = true
                }

                
                res.render('./trips/details-trip.hbs', {
                    isLoggedIn: res.locals.user ? true : false,
                    username: res.locals.user ? res.locals.user : null,
                    trip,
                    // isOwner: req.user.id == trip.isComingc
                })
            })

        },
        join(req, res, next) {
            const {
                id
            } = req.params;

            fetch(tripURL + id).
            then(x => x.json()).
            then(trip => {
                trip.passengers.push(res.locals.user)
                trip.seats = trip.seats - 1;


                fetch(tripURL+trip.objectId, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        passengers: JSON.stringify(trip.passengers),
                        seats: trip.seats
                    })
                }).then(x => {
                    res.redirect(`/trip/trip-details/${trip.objectId}`)
                })
        
            })

        },
        leave(req, res, next) {
            const {
                id
            } = req.params;

            fetch(tripURL + id).
            then(x => x.json()).
            then(trip => {
                const userIndex = trip.passengers.indexOf(res.locals.user);
                trip.passengers.splice(userIndex,1)
                trip.seats = trip.seats + 1;


                fetch(tripURL+trip.objectId, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        passengers: JSON.stringify(trip.passengers),
                        seats: trip.seats
                    })
                }).then(x => {
                    res.redirect(`/trip/trip-details/${trip.objectId}`)
                })
        
            })

        }
    },

    post: {
        offerTrip(req, res, next) {
            const {
                startPoint,
                endPoint,
                startDate,
                hours,
                minutes,
                description,
                seats
            } = req.body;

            console.log(minutes)
            fetch(tripsURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    startPoint,
                    endPoint,
                    startDate,
                    hours,
                    minutes,
                    description,
                    driverId: res.locals._id,
                    driverName: res.locals.user,
                    passengers: "[]",
                    seats: Number(seats)
                })
            }).
            then(resTrip => resTrip.json()).
            then(newTrip => {
                // console.log("created: ", newTrip)
                res.redirect('/trip/shared-trips')
            }).

            catch(e => console.log(e)) //TO DO - something went wrong


            // const errors = validationResult(req);
            // const msgs = errors.array().reduce((acc, curr)=>{
            //     acc.push(curr.msg)
            //     return acc
            // }, [])
            // const errFields = errors.array().reduce((acc, curr)=>{
            //     const i = `${curr.param}Error`
            //     acc[i] = 'errorInput'
            //     return acc
            // }, {})


        }
    }
}