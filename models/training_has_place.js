/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('training_has_place', {
    training_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: {
          tableName: 'training',
        },
        key: 'id'
      }
    },
    place_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: {
          tableName: 'place',
        },
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'training_has_place',
    schema: 'gretago'
  });
};
