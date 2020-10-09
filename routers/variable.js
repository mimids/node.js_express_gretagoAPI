const express = require('express')
require('dotenv').config()
var Sequelize = require("sequelize");
const sequelize = require('../db.config')

// CHARGEMENT DU MODEL 
const Variable = require('../models/variable')(sequelize, Sequelize.DataTypes);
const Sentence = require('../models/Sentence')(sequelize, Sequelize.DataTypes);

Variable.belongsTo(Sentence, {
  foreignKey: "sentence_id",
  keyType: Sequelize.INTEGER,
  sourceKey: "id",
});

// RECUPERATION DU ROUTER D EXPRESS
var router = express.Router()


//-------------------------------------------
// Show all [GET /valiable/]
//-------------------------------------------
router.get('', function (req, res) {

  Variable.findAll({
    include: [
      {
        model: Sentence,
        keyType: Sequelize.INTEGER
      }
    ]
  })
    .then(data => {
      return res.json({ data: data })
    })
    .catch(err => res.json({ message: 'Database error', error: err }))
});

//-------------------------------------------
// Show by id [GET /valiable/:id]
//-------------------------------------------
router.get('/:id', function (req, res) {

  var id = req.params.id;
  // Vérifier si le champ id est présent
  if (!id) {
    return res.status(400).json({ message: 'Informations manquantes' })
  }

  // Vérifier si il existe dans la table user
  Variable.findOne({ where: { id: id }, raw: true })
    .then(data => {
      return res.json({ data: data })
    })
    .catch(err => res.json({ message: 'Database error', error: err }))
});

//-------------------------------------------
// Delete [DELETE /valiable/:id]
//-------------------------------------------
router.delete('/:id', function (req, res) {

  var id = req.params.id;

  Variable.destroy({
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
// Update [PUT /valiable/:id]
//-------------------------------------------
router.put('/:id', function (req, res) {
  var id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: 'Informations manquantes' })
  }

  // Vérifier si il existe dans la table user
  Variable.findOne({ where: { id: id }, raw: true })
    .then(data => {
      if (data === null) {
        return res.status(400).json({ message: 'valiable introuvable' })
      }

      Variable.update(req.body, {
        where: { id: id }
      })
        .then(data => res.json({ message: 'valiable updated', data: data }))
        .catch(err => res.json({ message: 'Database error', error: err }))
    })
    .catch(err => res.json({ message: 'Database error', error: err }))
})
//-------------------------------------------
// Insert  [Post /valiable/register] 
//-------------------------------------------
router.post('/register', (req, res) => {
  const { name, sentence } = req.body;


  if (data !== null) {
    return res.status(400).json({ message: 'Ce compte existe déjà !' })
  } else {
    Variable.create(req.body)
      .then(data => res.json({ message: 'valiable created', name: name }))
      .catch(err => res.json({ message: 'Database error', error: err }))
  }

})
  //-------------------------------------------
  // Export
  //-------------------------------------------
  module.exports = router