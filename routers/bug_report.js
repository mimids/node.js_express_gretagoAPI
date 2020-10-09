const express = require('express')
require('dotenv').config()
var Sequelize = require("sequelize");
const sequelize = require('../db.config')

// CHARGEMENT DU MODEL 
const BugReport = require('../models/bug_report')(sequelize, Sequelize.DataTypes);
const User=  require('../models/User')(sequelize, Sequelize.DataTypes);
BugReport.belongsTo(User, {
  foreignKey: "user_id",
  keyType: Sequelize.INTEGER,
  sourceKey: "id",
});

// RECUPERATION DU ROUTER D EXPRESS
var router = express.Router()

//-------------------------------------------
// Show all [GET bugreport/]
//-------------------------------------------
router.get('', function (req, res) {

  BugReport.findAll({
    include: [
      { model: User,
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
// Show by id [GET bugreport/:id]
//-------------------------------------------
router.get('/:id', function (req, res) {

  var id = req.params.id;
 // Vérifier si le champ id est présent
 if(!id){
  return res.status(400).json({ message: 'Informations manquantes'})
}

// Vérifier si il existe dans la table user
BugReport.findOne({ where: { id: id }, raw: true})
.then(data => {
  return res.json({ data: data})
})
.catch(err => res.json({ message: 'Database error', error: err}))
});

//-------------------------------------------
// Delete [DELETE bugreport/:id]
//-------------------------------------------
router.delete('/:id', function (req, res) {

  var id = req.params.id;

  BugReport.destroy({
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
// Update [PUT bugreport/:id]
//-------------------------------------------
router.put('/:id', function (req, res) {
  var id = req.params.id;
  if(!id){
      return res.status(400).json({ message: 'Informations manquantes'})
  }

  // Vérifier si il existe dans la table user
  BugReport.findOne({ where: { id: id }, raw: true})
      .then(data => {
          if(data === null){
              return res.status(400).json({ message: 'bug report introuvable'})
          }
          req.body.updated_at=new Date().toISOString().slice(0, 19).replace('T', ' ');;
          BugReport.update(req.body, {
              where: { id: id}
            })
            .then(data => res.json({ message: 'bug report  updated', data: data}))
            .catch(err => res.json({ message: 'Database error', error: err}))
      })
      .catch(err => res.json({ message: 'Database error', error: err}))
})
//-------------------------------------------
// Insert  [Post bugreport/register] 
//-------------------------------------------
router.post('/register', (req, res) => {
  const { description, user_id } = req.body;

  // Vérification des données en reçues
  if (!description || !user_id) {
    return res.status(400).json({ message: 'Il manque un paramètre' })
  }

  // Verification si l'utilisateur existe déjà
  BugReport.findOne({ where: { name: name }, raw: true })
    .then(data => {
      if (data !== null) {
        return res.status(400).json({ message: 'Ce compte existe déjà !' })
      } else {
        req.body.created_at=new Date().toISOString().slice(0, 19).replace('T', ' ');;
        req.body.updated_at=new Date().toISOString().slice(0, 19).replace('T', ' ');;
        BugReport.create(req.body)
          .then(data => res.json({ message: 'bug report  created', name: name }))
          .catch(err => res.json({ message: 'Database error', error: err }))
      }
    })
    .catch(err => res.json({ message: 'Database error', error: err }))
})

//-------------------------------------------
// Export
//-------------------------------------------
module.exports = router