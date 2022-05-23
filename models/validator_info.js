const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('validator_info', {
    consensus_address: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'validator',
        key: 'consensus_address'
      }
    },
    operator_address: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: "validator_info_operator_address_key"
    },
    self_delegate_address: {
      type: DataTypes.TEXT,
      allowNull: true,
      references: {
        model: 'account',
        key: 'address'
      }
    },
    max_change_rate: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    max_rate: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'validator_info',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "validator_info_operator_address_index",
        fields: [
          { name: "operator_address" },
        ]
      },
      {
        name: "validator_info_operator_address_key",
        unique: true,
        fields: [
          { name: "operator_address" },
        ]
      },
      {
        name: "validator_info_pkey",
        unique: true,
        fields: [
          { name: "consensus_address" },
        ]
      },
      {
        name: "validator_info_self_delegate_address_index",
        fields: [
          { name: "self_delegate_address" },
        ]
      },
    ]
  });
};
