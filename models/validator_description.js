const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('validator_description', {
    validator_address: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'validator',
        key: 'consensus_address'
      }
    },
    moniker: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    identity: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    avatar_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    website: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    security_contact: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'validator_description',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "validator_description_height_index",
        fields: [
          { name: "height" },
        ]
      },
      {
        name: "validator_description_pkey",
        unique: true,
        fields: [
          { name: "validator_address" },
        ]
      },
    ]
  });
};
