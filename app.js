// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv').config()

// ℹ️ Connects to the database
require('./db')

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express')

const app = express()

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require('./config')(app)
require("./config/session.config.js")(app);

// default value for title local
const capitalize = require('./utils/capitalize')
const projectName = 'BohunUpas'

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`
app.locals.session = undefined

/* app.get("/", (req, res, next) => {
    app.locals.session = req.session.user;
    console.log(app.locals.session)
})

console.log(app.locals.session); */

// 👇 Start handling routes here
const indexRoutes = require('./routes/index.routes')
app.use('/', indexRoutes)

const authRoutes = require('./routes/auth.routes')
app.use('/auth', authRoutes)

const userRoutes = require('./routes/user.routes')
app.use('/user', userRoutes)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app)

module.exports = app