const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('inflation', {
    one_row_id: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      primaryKey: true
    },
    value: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'inflation',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "inflation_height_index",
        fields: [
          { name: "height" },
        ]
      },
      {
        name: "inflation_pkey",
        unique: true,
        fields: [
          { name: "one_row_id" },
        ]
      },
    ]
  });
};
