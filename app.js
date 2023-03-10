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

app.locals.appTitle = `${capitalize(projectName)}`
app.locals.session = undefined

// 👇 Start handling routes here
const indexRoutes = require('./routes/index.routes')
app.use('/', indexRoutes)

const authRoutes = require('./routes/auth.routes')
app.use('/auth', authRoutes)

const userRoutes = require('./routes/user.routes')
app.use('/user', userRoutes)

const equipmentRoutes = require('./routes/equipment.routes')
app.use('/equipment', equipmentRoutes)

const marketplaceRoutes = require('./routes/marketplace.routes')
app.use('/', marketplaceRoutes)

const friendRoutes = require('./routes/friends.routes')
app.use('/', friendRoutes)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app)

module.exports = app