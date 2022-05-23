const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transaction', {
    hash: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: "unique_tx"
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'block',
        key: 'height'
      }
    },
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    messages: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    signatures: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false
    },
    signer_infos: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    fee: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    },
    gas_wanted: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    gas_used: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    raw_log: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    logs: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    partition_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      unique: "unique_tx"
    }
  }, {
    sequelize,
    tableName: 'transaction',
    schema: 'public',
    timestamps: false
  });
};
