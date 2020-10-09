const express = require('express')
require('dotenv').config()
var Sequelize = require("sequelize");
const sequelize = require('../db.config')
var router = express.Router()

// CHARGEMENT DU MODEL 
const Lift = require('../models/lift')(sequelize, Sequelize.DataTypes);
const Conversation = require('../models/conversation')(sequelize, Sequelize.DataTypes);
const User_has_lift=  require('../models/user_has_lift')(sequelize, Sequelize.DataTypes);
const User=  require('../models/User')(sequelize, Sequelize.DataTypes);
Conversation.belongsTo(Conversation, {
  foreignKey: "conversation_id",
  keyType: Sequelize.INTEGER,
  sourceKey: "id",
});
User.belongsToMany(User, {
  through: User_has_lift,
  foreignKey: 'lift_id',
  otherKey: 'user_id',
  as: 'user_lift'
});

//-------------------------------------------
// Show all [GET /lift/]
//-------------------------------------------
router.get('', function (req, res) {

  Lift.findAll({
    include: [
      { model: Conversation,
        keyType: Sequelize.INTEGER
      },
      { model: User, as: 'user_lift' ,
      keyType: Sequelize.INTEGER
      },
    ]
  }) 
  .then(data => {
    return res.json({ data: data})
  })
  .catch(err => res.json({ message: 'Database error', error: err}))
});

//-------------------------------------------
// Show by id [GET /lift/:id]
//-------------------------------------------
router.get('/:id', function (req, res) {

  var id = req.params.id;
 // Vérifier si le champ id est présent
 if(!id){
  return res.status(400).json({ message: 'Informations manquantes'})
}

// Vérifier si il existe dans la table user
Lift.findOne({ where: { id: id }, raw: true})
.then(data => {
  return res.json({ data: data})
})
.catch(err => res.json({ message: 'Database error', error: err}))
});

//-------------------------------------------
// Delete [DELETE /lift/:id]
//-------------------------------------------
router.delete('/:id', function (req, res) {

  var id = req.params.id;

  Lift.destroy({
    where: {
      id: id //this will be your id that you want to delete
    }
  }).then(() => {
    return res.json({ message: 'Lift deleted'})
})
.catch(err => res.json({ message: 'Database error', error: err}))
})

//-------------------------------------------
// Update [PUT /lift/:id]
//-------------------------------------------
router.put('/:id', (req, res) => {
  var id = req.params.id;
  if(!id){
      return res.status(400).json({ message: 'Informations manquantes'})
  }

  // Vérifier si il existe dans la table user
  Lift.findOne({ where: { id: id }, raw: true})
      .then(data => {
          if(data === null){
              return res.status(400).json({ message: 'Lift introuvable'})
          }
          req.body.updated_at=new Date().toISOString().slice(0, 19).replace('T', ' ');;
          Lift.update(req.body, {
              where: { id: id}
            })
            .then(data => res.json({ message: 'Lift updated', data: data}))
            .catch(err => res.json({ message: 'Database error', error: err}))
      })
      .catch(err => res.json({ message: 'Database error', error: err}))
})
//-------------------------------------------
// Insert  [Post /lift/register] 
//-------------------------------------------
router.post('/register', (req, res) => {
  const { pace_max, date_departure, lat_departure, lng_departure,lat_arrival,lng_arrival,take,status } = req.body;

  // Vérification des données en reçues
  if (!date_departude || !lat_departure || !lng_departure|| !lat_arrival || !lng_arrival) {
    return res.status(400).json({ message: 'Il manque un paramètre' })
  }

  req.body.created_at=new Date().toISOString().slice(0, 19).replace('T', ' ');;
  req.body.updated_at=new Date().toISOString().slice(0, 19).replace('T', ' ');;

  Lift.create(req.body)
    .then(data => res.json({ message: 'Lift created', name: name }))
    .catch(err => res.json({ message: 'Database error', error: err }))
})

//-------------------------------------------
// Export
//-------------------------------------------
module.exports = router