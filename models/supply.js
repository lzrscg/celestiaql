const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('supply', {
    one_row_id: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      primaryKey: true
    },
    coins: {
      type: DataTypes.ARRAY(null),
      allowNull: false
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'supply',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "supply_height_index",
        fields: [
          { name: "height" },
        ]
      },
      {
        name: "supply_pkey",
        unique: true,
        fields: [
          { name: "one_row_id" },
        ]
      },
    ]
  });
};
