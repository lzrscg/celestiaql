const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('validator_voting_power', {
    validator_address: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'validator',
        key: 'consensus_address'
      }
    },
    voting_power: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'block',
        key: 'height'
      }
    }
  }, {
    sequelize,
    tableName: 'validator_voting_power',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "validator_voting_power_height_index",
        fields: [
          { name: "height" },
        ]
      },
      {
        name: "validator_voting_power_pkey",
        unique: true,
        fields: [
          { name: "validator_address" },
        ]
      },
    ]
  });
};
