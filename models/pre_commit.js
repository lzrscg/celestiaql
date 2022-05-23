const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pre_commit', {
    validator_address: {
      type: DataTypes.TEXT,
      allowNull: false,
      references: {
        model: 'validator',
        key: 'consensus_address'
      },
      unique: "pre_commit_validator_address_timestamp_key"
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: "pre_commit_validator_address_timestamp_key"
    },
    voting_power: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    proposer_priority: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'pre_commit',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pre_commit_height_index",
        fields: [
          { name: "height" },
        ]
      },
      {
        name: "pre_commit_validator_address_index",
        fields: [
          { name: "validator_address" },
        ]
      },
      {
        name: "pre_commit_validator_address_timestamp_key",
        unique: true,
        fields: [
          { name: "validator_address" },
          { name: "timestamp" },
        ]
      },
    ]
  });
};
