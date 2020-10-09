/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('variable', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER(4).UNSIGNED,
      allowNull: false,
      primaryKey: true
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
      unique: "fk_valiable_sentence1"
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'variable',
    schema: 'gretago'
  });
};
