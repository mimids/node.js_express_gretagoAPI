// CHARGEMENT DES MODULES
const express = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config()
var Sequelize = require("sequelize");
const sequelize = require('../db.config')
const bcrypt = require('bcrypt')
const checkTokenMiddleware = require('../jsonwebtoken/check')

// CHARGEMENT DU MODEL 
const Admin = require('../models/admin')(sequelize, Sequelize.DataTypes);
const User = require('../models/user')(sequelize, Sequelize.DataTypes);


// RECUPERATION DU ROUTER D EXPRESS
var router = express.Router()

// MIDLEWARE LOG
router.use(function timelog(req, res, next) {
  const event = new Date();
  console.log("Time Admin:", event.toString())
  next()
})



//-------------------------------------------
// login [Post /auth/login]
//-------------------------------------------
// ROUTAGE DU LOGIN
router.post('/login', (req, res) => {

  // if(!req.body.username || !req.body.password){
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: " Login ou mot de passe manquant", error: err })
  }


  Admin.findAll({ where: { email: req.body.email } })

    .then(result => {

      // Verification si l'utilisateur existe
      //----------------------------------------------
      if (result.length === 0) {

        User.findAll({ where: { email: req.body.email } })

        .then(result => {
    
          // Verification si l'utilisateur existe
  
          if (result.length === 0) {
    
            return res.status(401).json({ message: 'Compte inexistant' })
          }
    
          //MISE EN FORME DU RESULT
          var user = JSON.parse(JSON.stringify(result))[0]
    
    
          //VERIFICATION SI LE MOT DE PASSE EST BON
          if (!bcrypt.compareSync(req.body.password, user.password)) {
            // res.send("Mot de passe incorrect")
            return res.status(400).json({ message: "Mot de passe incorrect" })
          }
    
          // Création du token
          const token = jwt.sign({
            id: user.id,
            email: user.email,
    
          }, process.env.JWR_SECRET, { expiresIn: process.env.JWT_DIRING })
    
    
          return res.json({ access_token: token,login_user:'user' })
        })
    
    
          .catch(err => res.json({ message: 'Database error user', error: err }))
      
      }
      //----------------------------------------------

      //MISE EN FORME DU RESULT
      var admin = JSON.parse(JSON.stringify(result))[0]


      //VERIFICATION SI LE MOT DE PASSE EST BON
      if (!bcrypt.compareSync(req.body.password, admin.password)) {
        // res.send("Mot de passe incorrect")
        return res.status(400).json({ message: "Mot de passe incorrect" })
      }

      // Création du token
      const token = jwt.sign({
        id: admin.id,
        email: admin.email,

      }, process.env.JWR_SECRET, { expiresIn: process.env.JWT_DIRING })


      return res.json({ access_token: token,login_user:'admin' })
    })
     // .catch(err => res.json({ message: 'Database error admin', error: err }))
  
})

//-------------------------------------------
// Show all [GET /auth/]
//-------------------------------------------
// ROUTAGE RESSOURCE ADMIN
// router.get('/', checkTokenMiddleware, (req, res) => {
router.get('', (req, res) => {
  const datas = Admin.findAll()
    .then(datas => {
      console.log(datas)
      return res.json({ data: datas })
    })
    .catch(err => res.json({ message: 'DATABASE ERROR', error: err }))
})
//-------------------------------------------
// Insert  [Post /auth/register] 
//-------------------------------------------
router.post('/register', (req, res) => {
  const { firstname, lastname, email, password, status } = req.body

  // VERIFICATION DES DONNEES RECUES
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ message: "Il manque un paramètre" })
  }

  // VERIFICATION SI L'UTILISATEUR EXISTE DEJA
  Admin.findAll({ where: { firstname: firstname } })
    .then(data => {
      if (data.length === 0) {
        // TOUT VA BIEN, ajout de l'utilisateur dans la table admins
        Admin.create(req.boby)
          .then(data => res.json({ message: "Admin created" }))
          .catch(err => res.json({ message: 'Database error', error: err }))
        return res.json({ message: 'test OK' }) //ici vide car pas de correspondance
      } else {
        return res.json({ message: 'test OK' }) // Le username existe deja dans la table
      }
    })
    .catch(err => res.json({ message: 'Database error', error: err }))

})
//-------------------------------------------
// Update [PUT /auth/:id]
//-------------------------------------------
router.put('/:id', (req, res) => {

  // VERIFIER SI LE CHAMPS ID EST PRESENT
  if (!req.body.id) {
    return res.status(400).json({ message: "Informations manquantes, Laquelle ??" })
  }

  // Vérifier si il existe dans la table admin
  Admin.findAll({ where: { id: req.body.id } })
    .then(data => {
      if (data.length !== 0) {
        return res.json({ message: 'admin introuvable' }) // Le username existe deja dans la table
      }

      // TOUT VA BIEN, modification de l'utilisateur
      Admin.update(req.boby, {
        where: { id: req.body.id }
      })
        .then(data => res.json({ message: "admin update" }))
        .catch(err => res.json({ message: 'Database error', error: err }))
    })
    .catch(err => res.json({ message: 'Database error', error: err }))

})

//-------------------------------------------
// Delete [DELETE /auth/:id]
//-------------------------------------------
router.delete('/:id', (req, res) => {
  Admin.destroy({ where: { id: req.params._id } })
    .then(() => {
      return res.json({ data: 'admin deleted' })
    })
    .catch(err => res.json({ message: 'Database error', error: err }))

})
//-------------------------------------------
// Export
//-------------------------------------------
module.exports = router