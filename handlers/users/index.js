const fetch = require("node-fetch");
const jwt = require('../../utils/jwt')
const {
    cookie
} = require('../../config/config')
const bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

const urls = {
    users: 'https://api.backendless.com/8437C1A8-6541-C39B-FF0B-6D084FB90F00/046A7A56-BEE0-43DA-AA88-BD4185E3DB7D/data/user',
}

module.exports = {
    get: {
        login(req, res, next) {
            res.render('users/login.hbs')
        },

        register(req, res, next) {
            res.render('users/register.hbs')
        },
        logout(req, res, next) {
            res.locals.user = null;
            res.clearCookie(cookie).redirect('/home')
        }
    },
    post: {
        login(req, res) {
            const {
                username,
                password
            } = req.body;
            fetch(`https://api.backendless.com/8437C1A8-6541-C39B-FF0B-6D084FB90F00/046A7A56-BEE0-43DA-AA88-BD4185E3DB7D/data/user?where=username%20%3D%20%27${username}%27`).
            then(res => res.json()).
            then(json => {
               
                if (json.length == 0) {
                    return res.render('users/login.hbs', {
                        errorMessage: `Username "${username}" is not registered`
                    })
                }

                let hashed = json[0].password;

                bcrypt.compare(password, hashed, (err, result) => {
                    if (result) {
                        const token = jwt.crateToken(json[0]);

                        return res.status(201).cookie(cookie, token, {
                            maxAge: 360000000
                        }).redirect('/home/')

                    } else {
                        return res.render('users/login.hbs', {
                            username: username,
                            errorMessage: `Invalid password`
                        })
                    }

                })


            })

        },

        register: async function (req, res) {
            const {
                username,
                password,
                rePassword,
                avatar
            } = req.body

            if (password !== rePassword) {
                return res.render('users/register.hbs', {
                    username: username,
                    errorMessage: "Password and Re-password do not match"
                })
            }

            fetch(`https://api.backendless.com/8437C1A8-6541-C39B-FF0B-6D084FB90F00/046A7A56-BEE0-43DA-AA88-BD4185E3DB7D/data/user?where=username%20%3D%20%27${username}%27`).
            then(res => res.json())
                .then(userSearch => {

                    if (userSearch.length > 0) {
                        return res.render('users/register.hbs', {
                            errorMessage: `Username "${username}" is already used`
                        })
                    }


                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) {
                            return res.render('users/register.hbs', {
                                username: username,
                                errorMessage: err
                            })
                        }

                        const body = JSON.stringify({
                            username: username,
                            password: hash,
                            avatar
                        });


                        fetch(urls.users, {
                            method: 'POST',
                            body: body,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(() => res.redirect('/home'))



                    })

                })



            // User.create({username, password}).then((createdUser) => {
            //     res.redirect('/user/login')
            // }).catch((err)=>{
            //     let errMsg = err.code == 11000 ? "Username already exists" : err
            //     res.render('users/register.hbs', {
            //         errorMessage: errMsg
            //     })
            // }
            // )




        }
    }
}