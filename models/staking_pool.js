const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('staking_pool', {
    one_row_id: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      primaryKey: true
    },
    bonded_tokens: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    not_bonded_tokens: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'staking_pool',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "staking_pool_height_index",
        fields: [
          { name: "height" },
        ]
      },
      {
        name: "staking_pool_pkey",
        unique: true,
        fields: [
          { name: "one_row_id" },
        ]
      },
    ]
  });
};
