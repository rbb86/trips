const { body } = require('express-validator')

module.exports = [
    body('directions')
    .custom((value) => {
        if(!value.includes(' - ')){
            throw new Error ('The directions input field should includes " - " between the start and end points')
        }

        return true
    }),

    body('dateTime')
        .custom((value) => {
            if(!value.includes(' - ')){
                throw new Error ('The Date - Time input field shouldd include " - " between the date and time')
            }
    
            return true
        })
]