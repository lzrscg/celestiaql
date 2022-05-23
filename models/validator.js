const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('validator', {
    consensus_address: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    consensus_pubkey: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: "validator_consensus_pubkey_key"
    }
  }, {
    sequelize,
    tableName: 'validator',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "validator_consensus_pubkey_key",
        unique: true,
        fields: [
          { name: "consensus_pubkey" },
        ]
      },
      {
        name: "validator_pkey",
        unique: true,
        fields: [
          { name: "consensus_address" },
        ]
      },
    ]
  });
};
