const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('token_price_history', {
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
      unique: "unique_price_for_timestamp"
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
      allowNull: false,
      unique: "unique_price_for_timestamp"
    }
  }, {
    sequelize,
    tableName: 'token_price_history',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "token_price_history_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "token_price_history_timestamp_index",
        fields: [
          { name: "timestamp" },
        ]
      },
      {
        name: "unique_price_for_timestamp",
        unique: true,
        fields: [
          { name: "unit_name" },
          { name: "timestamp" },
        ]
      },
    ]
  });
};
