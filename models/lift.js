/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('lift', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    place_max: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    date_departure: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    lat_departure: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    lng_departure: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    lat_arrival: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    lng_arrival: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    take: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
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
    conversation_id: {
      type: DataTypes.INTEGER(8),
      allowNull: false,
      references: {
        model: {
          tableName: 'conversation',
        },
        key: 'id'
      },
      unique: "fk_lift_conversation1"
    }
  }, {
    sequelize,
    tableName: 'lift',
    schema: 'gretago'
  });
};
