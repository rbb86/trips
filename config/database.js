const mongoose = require('mongoose')
const dbString = "mongodb+srv://user:123123a@cluster0.svwvd.mongodb.net/sharedTrips?retryWrites=true&w=majority"
const rdyString = `${'*'.repeat(10)}Database is ready${'*'.repeat(10)}`;

module.exports = () => {
    return mongoose.connect(dbString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
        console.log(rdyString)
    )
}