/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sentence', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(51),
      allowNull: true
    },
    sentence: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'sentence',
    schema: 'gretago'
  });
};
