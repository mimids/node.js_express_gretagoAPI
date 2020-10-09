/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('conversation', {
    id: {
      type: DataTypes.INTEGER(8),
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'conversation',
    schema: 'gretago'
  });
};
