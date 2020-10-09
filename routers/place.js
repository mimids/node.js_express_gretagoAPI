const express = require('express')
require('dotenv').config()
var Sequelize = require("sequelize");
const sequelize = require('../db.config')

// CHARGEMENT DU MODEL 
const Training = require('../models/training')(sequelize, Sequelize.DataTypes);
const Place=  require('../models/place')(sequelize, Sequelize.DataTypes);
const Training_has_place=  require('../models/training_has_place')(sequelize, Sequelize.DataTypes);

Place.belongsToMany(Training, {
  through: Training_has_place,
  foreignKey: 'place_id',
  otherKey: 'training_id',
  as: 'training_place'
});

// RECUPERATION DU ROUTER D EXPRESS
var router = express.Router()


//-------------------------------------------
// Show all [GET /place/]
//-------------------------------------------
router.get('', function (req, res) {

  Place.findAll({
    include: [
      { model: Training, as: 'training_place' ,
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
// Show by id [GET /place/:id]
//-------------------------------------------
router.get('/:id', function (req, res) {

  var id = req.params.id;
 // Vérifier si le champ id est présent
 if(!id){
  return res.status(400).json({ message: 'Informations manquantes'})
}

// Vérifier si il existe dans la table user
Place.findOne({ where: { id: id }, raw: true})
.then(data => {
  return res.json({ data: data})
})
.catch(err => res.json({ message: 'Database error', error: err}))
});

//-------------------------------------------
// Delete [DELETE /place/:id]
//-------------------------------------------
router.delete('/:id', function (req, res) {

  var id = req.params.id;

  Place.destroy({
    where: {
      id: id //this will be your id that you want to delete
    }
  }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
    if (rowDeleted === 1) {
      console.log('Deleted successfully');
      return res.send('Deleted successfully')
    }
  }, function (err) {
    console.log(err);
  });
});
//-------------------------------------------
// Update [PUT /place/:id]
//-------------------------------------------
router.put('/:id', function (req, res) {
  var id = req.params.id;
  if(!id){
      return res.status(400).json({ message: 'Informations manquantes'})
  }

  // Vérifier si il existe dans la table user
  Place.findOne({ where: { id: id }, raw: true})
      .then(data => {
          if(data === null){
              return res.status(400).json({ message: 'place introuvable'})
          }

          Place.update(req.body, {
              where: { id: id}
            })
            .then(data => res.json({ message: 'place updated', data: data}))
            .catch(err => res.json({ message: 'Database error', error: err}))
      })
      .catch(err => res.json({ message: 'Database error', error: err}))
})
//-------------------------------------------
// Insert  [Post /place/register] 
//-------------------------------------------
router.post('/register', (req, res) => {
  const { name,lat, lng,address } = req.body;

  // Vérification des données en reçues
  if (!lat || !lng || !name) {
    return res.status(400).json({ message: 'Il manque un paramètre' })
  }

  // Verification si l'utilisateur existe déjà
  Place.findOne({ where: { name: name }, raw: true })
    .then(data => {
      if (data !== null) {
        return res.status(400).json({ message: 'Ce compte existe déjà !' })
      } else {
        Place.create(req.body)
          .then(data => res.json({ message: 'place created', name: name }))
          .catch(err => res.json({ message: 'Database error', error: err }))
      }
    })
    .catch(err => res.json({ message: 'Database error', error: err }))
})

//-------------------------------------------
// Export
//-------------------------------------------
module.exports = router