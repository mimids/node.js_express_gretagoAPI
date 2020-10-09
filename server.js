
const express = require('express')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const cors = require('cors')

var db = require('./db.config');
require('dotenv').config()

const app = express();
var main_router = require('./routers/main')
var alert_router = require('./routers/alert')
var auth_router = require('./routers/admin')
var training_router = require('./routers/training')
var user_router = require('./routers/user')
var place_router = require('./routers/place')
var lift_router = require('./routers/lift')
var bugreport_router = require('./routers/bug_report')
var variable_router = require('./routers/variable')
var conversation_router = require('./routers/conversation')
var message_router = require('./routers/message')
var sentence_router = require('./routers/sentence')
var variable_value_router = require('./routers/variable_value')

app.use(cors()).use(morgan('tiny'))
app.use(express())
app.use(express.urlencoded({ extended: true }))
// for parsing application/json
app.use(express.json()); 

app.use('/', main_router)
app.use('/alert', alert_router)
app.use('/auth', auth_router)
app.use('/training', training_router)
app.use('/user', user_router)
app.use('/place', place_router)
app.use('/lift', lift_router)
app.use('/bug_report', bugreport_router)
app.use('/variable', variable_router)
app.use('/conversation', conversation_router)
app.use('/message', message_router)
app.use('/sentence', sentence_router)
app.use('/variable_value', variable_value_router)

app.get('*', (req, res) => {
  return res.status(404).send('404')
})

// START SERVEUR
db.authenticate()
    .then(() => {
        console.log('connexion etabli avec la base de données Mysql/MariaDb')
    })
    .then (() => {
        app.listen(process.env.SERVER_PORT, () => {
        console.log('The serveur is running. Have fun !')
        })
    })
    .catch(err => {
        console.log('erreur de la connexion à la bdd :', err)
    })