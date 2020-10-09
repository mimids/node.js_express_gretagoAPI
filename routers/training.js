const express = require('express')
require('dotenv').config()
var Sequelize = require("sequelize");
const sequelize = require('../db.config')
var router = express.Router()

// CHARGEMENT DU MODEL 
const Training = require('../models/training')(sequelize, Sequelize.DataTypes);
const Place=  require('../models/place')(sequelize, Sequelize.DataTypes);
const Training_has_place=  require('../models/training_has_place')(sequelize, Sequelize.DataTypes);

Training.belongsToMany(Place, {
  through: Training_has_place,
  foreignKey: 'training_id',
  otherKey: 'place_id',
  as: 'training_place'
});

//-------------------------------------------
// Show all [GET /training/]
//-------------------------------------------
router.get('', function (req, res) {

  Training.findAll({
    include: [
      { model: Place, as: 'training_place' ,
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
// Show by id [GET /training/:id]
//-------------------------------------------
router.get('/:id', function (req, res) {

  var id = req.params.id;
 // Vérifier si le champ id est présent
 if(!id){
  return res.status(400).json({ message: 'Informations manquantes'})
}

// Vérifier si il existe dans la table user
Training.findOne({ where: { id: id }, raw: true})
.then(data => {
  return res.json({ data: data})
})
.catch(err => res.json({ message: 'Database error', error: err}))
});

//-------------------------------------------
// Delete [DELETE /training/:id]
//-------------------------------------------
router.delete('/:id', function (req, res) {

  var id = req.params.id;

  Training.destroy({
    where: {
      id: id //this will be your id that you want to delete
    }
  }).then(() => {
    return res.json({ message: 'Training deleted'})
})
.catch(err => res.json({ message: 'Database error', error: err}))
})

//-------------------------------------------
// Update [PUT /training/:id]
//-------------------------------------------
router.put('/:id', (req, res) => {
  var id = req.params.id;
  if(!id){
      return res.status(400).json({ message: 'Informations manquantes'})
  }

  // Vérifier si il existe dans la table user
  Training.findOne({ where: { id: id }, raw: true})
      .then(data => {
          if(data === null){
              return res.status(400).json({ message: 'training introuvable'})
          }

          Training.update(req.body, {
              where: { id: id}
            })
            .then(data => res.json({ message: 'training updated', data: data}))
            .catch(err => res.json({ message: 'Database error', error: err}))
      })
      .catch(err => res.json({ message: 'Database error', error: err}))
})
//-------------------------------------------
// Insert  [Post /training/register] 
//-------------------------------------------
router.post('/register', (req, res) => {

  const { name, start_date, end_date, status } = req.body;


  // Vérification des données en reçues
  if (!name || !start_date || !end_date) {
    return res.status(400).json({ message: 'Il manque un paramètre' })
  }

  // Verification si l'utilisateur existe déjà
  Training.findOne({ where: { name: name }, raw: true })
    .then(data => {
      if (data !== null) {
        return res.status(400).json({ message: 'Ce compte existe déjà !' })
      } else {
        Training.create(req.body)
          .then(data => res.json({ message: 'training created', name: name }))
          .catch(err => res.json({ message: 'Database error', error: err }))
      }
    })
    .catch(err => res.json({ message: 'Database error', error: err }))
})

//-------------------------------------------
// Export
//-------------------------------------------
module.exports = router