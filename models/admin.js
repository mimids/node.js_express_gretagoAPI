/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('admin', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    firstname: {
      type: DataTypes.STRING(51),
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING(51),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(51),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(51),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'admin',
    schema: 'gretago'
  });
};
