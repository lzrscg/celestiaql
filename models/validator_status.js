const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('validator_status', {
    validator_address: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'validator',
        key: 'consensus_address'
      }
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jailed: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    tombstoned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'validator_status',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "validator_status_height_index",
        fields: [
          { name: "height" },
        ]
      },
      {
        name: "validator_status_pkey",
        unique: true,
        fields: [
          { name: "validator_address" },
        ]
      },
    ]
  });
};
