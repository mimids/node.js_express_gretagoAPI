/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('message', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    create_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sentence_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: {
          tableName: 'sentence',
        },
        key: 'id'
      },
      unique: "fk_message_sentence1"
    },
    conversation_id: {
      type: DataTypes.INTEGER(8),
      allowNull: false,
      references: {
        model: {
          tableName: 'conversation',
        },
        key: 'id'
      },
      unique: "fk_message_conversation1"
    }
  }, {
    sequelize,
    tableName: 'message',
    schema: 'gretago'
  });
};
