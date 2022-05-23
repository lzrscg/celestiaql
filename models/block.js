const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('block', {
    height: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    hash: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: "block_hash_key"
    },
    num_txs: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    total_gas: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    proposer_address: {
      type: DataTypes.TEXT,
      allowNull: true,
      references: {
        model: 'validator',
        key: 'consensus_address'
      }
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'block',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "block_hash_index",
        fields: [
          { name: "hash" },
        ]
      },
      {
        name: "block_hash_key",
        unique: true,
        fields: [
          { name: "hash" },
        ]
      },
      {
        name: "block_height_index",
        fields: [
          { name: "height" },
        ]
      },
      {
        name: "block_pkey",
        unique: true,
        fields: [
          { name: "height" },
        ]
      },
      {
        name: "block_proposer_address_index",
        fields: [
          { name: "proposer_address" },
        ]
      },
    ]
  });
};
