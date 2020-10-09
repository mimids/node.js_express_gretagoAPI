const express = require('express')
require('dotenv').config()
var Sequelize = require("sequelize");
const sequelize = require('../db.config')

// CHARGEMENT DU MODEL 
const Message = require('../models/message')(sequelize, Sequelize.DataTypes);
const Conversation = require('../models/conversation')(sequelize, Sequelize.DataTypes);
const Sentence = require('../models/sentence')(sequelize, Sequelize.DataTypes);

Message.belongsTo(Sentence, {
  foreignKey: "sentence_id",
  keyType: Sequelize.INTEGER,
  sourceKey: "id",
});
Message.belongsTo(Conversation, {
  foreignKey: "conversation_id",
  keyType: Sequelize.INTEGER,
  sourceKey: "id",
});



// RECUPERATION DU ROUTER D EXPRESS
var router = express.Router()


//-------------------------------------------
// Show all [GET /message/]
//-------------------------------------------
router.get('', function (req, res) {

  Message.findAll({
    include: [
      {
        model: Sentence,
        keyType: Sequelize.INTEGER
      },
      {
        model: Conversation,
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
// Show by id [GET /message/:id]
//-------------------------------------------
router.get('/:id', function (req, res) {

  var id = req.params.id;
 // Vérifier si le champ id est présent
 if(!id){
  return res.status(400).json({ message: 'Informations manquantes'})
}

// Vérifier si il existe dans la table user
Message.findOne({ where: { id: id }, raw: true})
.then(data => {
  return res.json({ data: data})
})
.catch(err => res.json({ message: 'Database error', error: err}))
});

//-------------------------------------------
// Delete [DELETE /message/:id]
//-------------------------------------------
router.delete('/:id', function (req, res) {

  var id = req.params.id;

  Message.destroy({
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
// Update [PUT /message/:id]
//-------------------------------------------
router.put('/:id', function (req, res) {
  var id = req.params.id;
  if(!id){
      return res.status(400).json({ message: 'Informations manquantes'})
  }

  // Vérifier si il existe dans la table user
  Message.findOne({ where: { id: id }, raw: true})
      .then(data => {
          if(data === null){
              return res.status(400).json({ message: 'message introuvable'})
          }

          Message.update(req.body, {
              where: { id: id}
            })
            .then(data => res.json({ message: 'message updated', data: data}))
            .catch(err => res.json({ message: 'Database error', error: err}))
      })
      .catch(err => res.json({ message: 'Database error', error: err}))
})
//-------------------------------------------
// Insert  [Post /message/register] 
//-------------------------------------------
router.post('/register', (req, res) => {
  const { sentencen_id,conversation_id } = req.body;

  // Vérification des données en reçues
  if (!conversation_id) {
    return res.status(400).json({ message: 'Il manque un paramètre' })
  }
  req.body.created_at=new Date().toISOString().slice(0, 19).replace('T', ' ');;
      if (data !== null) {
        return res.status(400).json({ message: 'Ce compte existe déjà !' })
      } else {
        Message.create(req.body)
          .then(data => res.json({ message: 'message created', name: name }))
          .catch(err => res.json({ message: 'Database error', error: err }))
      }
    })
  

//-------------------------------------------
// Export
//-------------------------------------------
module.exports = router