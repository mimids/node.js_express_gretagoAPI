const express = require('express')
require('dotenv').config()
var Sequelize = require("sequelize");
const sequelize = require('../db.config')

// CHARGEMENT DU MODEL 
const Conversation = require('../models/conversation')(sequelize, Sequelize.DataTypes);



// RECUPERATION DU ROUTER D EXPRESS
var router = express.Router()


//-------------------------------------------
// Show all [GET /conversation/]
//-------------------------------------------
router.get('', function (req, res) {

  Conversation.findAll({
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
// Show by id [GET /conversation/:id]
//-------------------------------------------
router.get('/:id', function (req, res) {

  var id = req.params.id;
 // Vérifier si le champ id est présent
 if(!id){
  return res.status(400).json({ message: 'Informations manquantes'})
}

// Vérifier si il existe dans la table user
Conversation.findOne({ where: { id: id }, raw: true})
.then(data => {
  return res.json({ data: data})
})
.catch(err => res.json({ message: 'Database error', error: err}))
});

//-------------------------------------------
// Delete [DELETE /conversation/:id]
//-------------------------------------------
router.delete('/:id', function (req, res) {

  var id = req.params.id;

  Conversation.destroy({
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
// Update [PUT /conversation/:id]
//-------------------------------------------
router.put('/:id', function (req, res) {
  var id = req.params.id;
  if(!id){
      return res.status(400).json({ message: 'Informations manquantes'})
  }

  // Vérifier si il existe dans la table user
  Conversation.findOne({ where: { id: id }, raw: true})
      .then(data => {
          if(data === null){
              return res.status(400).json({ message: 'conversation/ introuvable'})
          }

          Conversation.update(req.body, {
              where: { id: id}
            })
            .then(data => res.json({ message: 'conversation updated', data: data}))
            .catch(err => res.json({ message: 'Database error', error: err}))
      })
      .catch(err => res.json({ message: 'Database error', error: err}))
})
//-------------------------------------------
// Insert  [Post /conversation/register] 
//-------------------------------------------
router.post('/register', (req, res) => {
  const { message_id } = req.body;
 

  // Verification si l'utilisateur existe déjà

      if (data !== null) {
        return res.status(400).json({ message: 'Ce compte existe déjà !' })
      } else {
        Conversation.create(req.body)
          .then(data => res.json({ message: 'conversation created', name: name }))
          .catch(err => res.json({ message: 'Database error', error: err }))
      }
    })
    

//-------------------------------------------
// Export
//-------------------------------------------
module.exports = router