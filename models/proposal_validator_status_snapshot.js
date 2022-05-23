const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('proposal_validator_status_snapshot', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    proposal_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'proposal',
        key: 'id'
      },
      unique: "unique_validator_status_snapshot"
    },
    validator_address: {
      type: DataTypes.TEXT,
      allowNull: false,
      references: {
        model: 'validator',
        key: 'consensus_address'
      },
      unique: "unique_validator_status_snapshot"
    },
    voting_power: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jailed: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'proposal_validator_status_snapshot',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "proposal_validator_status_snapshot_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "proposal_validator_status_snapshot_proposal_id_index",
        fields: [
          { name: "proposal_id" },
        ]
      },
      {
        name: "proposal_validator_status_snapshot_validator_address_index",
        fields: [
          { name: "validator_address" },
        ]
      },
      {
        name: "unique_validator_status_snapshot",
        unique: true,
        fields: [
          { name: "proposal_id" },
          { name: "validator_address" },
        ]
      },
    ]
  });
};
