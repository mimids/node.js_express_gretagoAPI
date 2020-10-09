/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bug_report', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    description: {
      type: "LONGTEXT",
      allowNull: true
    },
    create_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    update_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      references: {
        model: {
          tableName: 'user',
        },
        key: 'id'
      },
      unique: "fk_bug_report_user1"
    }
  }, {
    sequelize,
    tableName: 'bug_report',
    schema: 'gretago'
  });
};
