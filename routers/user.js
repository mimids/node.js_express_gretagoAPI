const express = require('express')
require('dotenv').config()
var Sequelize = require("sequelize");
const sequelize = require('../db.config')
var router = express.Router()
// for token
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const checkTokenMiddleware = require('../jsonwebtoken/check')

// CHARGEMENT DU MODEL 
const User=  require('../models/user')(sequelize, Sequelize.DataTypes);
const Training=  require('../models/training')(sequelize, Sequelize.DataTypes);
const User_has_lift=  require('../models/user_has_lift')(sequelize, Sequelize.DataTypes);
const Lift=  require('../models/lift')(sequelize, Sequelize.DataTypes);
const Place=  require('../models/place')(sequelize, Sequelize.DataTypes);
const User_has_place=  require('../models/user_has_place')(sequelize, Sequelize.DataTypes);

User.belongsTo(Training, {
  foreignKey: "training_id",
  keyType: Sequelize.INTEGER,
  sourceKey: "id",
});
User.belongsToMany(Lift, {
  through: User_has_lift,
  foreignKey: 'user_id',
  otherKey: 'lift_id',
  as: 'user_lift'
});
User.belongsToMany(Place, {
  through: User_has_place,
  foreignKey: 'user_id',
  otherKey: 'place_id',
  as: 'user_place'
});

/*** Un middleware pour logger la date sur les requêtes */
router.use(function timeLog(req, res, next){
  const event = new Date()
  console.log('USER Time :', event.toString())
  next()
})

//-------------------------------------------
// Show all [GET /user/]
//-------------------------------------------
router.get('', function (req, res) {
  User.findAll({
    include: [
      { model: Training,
        keyType: Sequelize.INTEGER
      },
      { model: Lift, as: 'user_lift' ,
      keyType: Sequelize.INTEGER
      },
      { model: Place, as: 'user_place' ,
      keyType: Sequelize.INTEGER
      }
    ]
  }) 
  .then(data => {
    return res.json({ data: data})
  })
  .catch(err => res.json({ message: 'Database error', error: err}))
});

//-------------------------------------------
// Show by id [GET /user/:id]
//-------------------------------------------
router.get('/:id', function (req, res) {

  var id = req.params.id;
 // Vérifier si le champ id est présent
 if(!id){
  return res.status(400).json({ message: 'Informations manquantes'})
}

// Vérifier si il existe dans la table user
User.findOne({ where: { id: id }, raw: true})
.then(data => {
  return res.json({ data: data})
})
.catch(err => res.json({ message: 'Database error', error: err}))
});
//-------------------------------------------
// Delete [DELETE /user/:id]
//-------------------------------------------
router.delete('/:id', function (req, res) {

  var id = req.params.id;

  User.destroy({
    where: {
      id: id //this will be your id that you want to delete
    }
  }) .then(() => {
    return res.json({ message: 'User deleted'})
})
.catch(err => res.json({ message: 'Database error', error: err}))
})

//-------------------------------------------
// Update [PUT /user/:id]
//-------------------------------------------
router.put('/:id', function (req, res) {
  var id = req.params.id;
// Vérifier si il existe dans la table user
User.findOne({ where: { id: id }, raw: true})
.then(data => {
    if(data === null){
        return res.status(400).json({ message: 'Utilisateur introuvable'})
    }
    req.body.updated_at=new Date().toISOString().slice(0, 19).replace('T', ' ');;

    User.update(req.body, {
        where: { id: req.body.id}
      })
      .then(user => res.json({ message: 'User updated', data: user}))
      .catch(err => res.json({ message: 'Database error', error: err}))
})
.catch(err => res.json({ message: 'Database error', error: err}))
})
//-------------------------------------------
// Insert  [Post /user/register] 
//-------------------------------------------
router.post('/register', (req, res) => {

  const {firstname, lastname, address, birthday, phone,password,email,status,lng,lat,terms_use,training_id,immatriculation} = req.body

  // Vérification des données en reçues
  if(!firstname || !password || !training_id || !email){
      return res.status(400).json({ message: 'Il manque un paramètre'})
  }

  // Verification si l'utilisateur existe déjà
  User.findOne({ where: { email: email }, raw: true })
      .then(data => {
          if(data !== null){
              return res.status(400).json({ message: 'Ce compte existe déjà !'})
          }

          // Hashage du mot de passe
          bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT_ROUND))
          .then(hash => {
              // On a reçu le mot de passe hashé on peut enregistrer le nouveau compte
              req.body.password = hash
              req.body.created_at=new Date().toISOString().slice(0, 19).replace('T', ' ');;
              req.body.updated_at=new Date().toISOString().slice(0, 19).replace('T', ' ');;

              User.create(req.body)
              .then(data => res.json({ message: 'User created', data: data}))
              .catch(err => res.json({ message: 'Database create error', error: err}))
          })
          .catch(err => res.json({ message: 'Password hash error', error: err }))
      })        
      .catch(err => res.json({ message: 'Database error', error: err}))
})

//-------------------------------------------
// Export
//-------------------------------------------
module.exports = router