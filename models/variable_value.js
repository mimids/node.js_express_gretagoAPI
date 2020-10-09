/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('variable_value', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    value: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    message_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: {
          tableName: 'message',
        },
        key: 'id'
      },
      unique: "fk_parameter_message1"
    },
    variable_id: {
      type: DataTypes.INTEGER(4).UNSIGNED,
      allowNull: false,
      references: {
        model: {
          tableName: 'variable',
        },
        key: 'id'
      },
      unique: "fk_variable_value_variable1"
    }
  }, {
    sequelize,
    tableName: 'variable_value',
    schema: 'gretago'
  });
};
