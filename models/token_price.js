const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('token_price', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    unit_name: {
      type: DataTypes.TEXT,
      allowNull: false,
      references: {
        model: 'token_unit',
        key: 'denom'
      },
      unique: "token_price_unit_name_key"
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    market_cap: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'token_price',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "token_price_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "token_price_timestamp_index",
        fields: [
          { name: "timestamp" },
        ]
      },
      {
        name: "token_price_unit_name_key",
        unique: true,
        fields: [
          { name: "unit_name" },
        ]
      },
    ]
  });
};
