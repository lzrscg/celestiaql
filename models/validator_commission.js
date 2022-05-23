const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('validator_commission', {
    validator_address: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'validator',
        key: 'consensus_address'
      }
    },
    commission: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    min_self_delegation: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'validator_commission',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "validator_commission_height_index",
        fields: [
          { name: "height" },
        ]
      },
      {
        name: "validator_commission_pkey",
        unique: true,
        fields: [
          { name: "validator_address" },
        ]
      },
    ]
  });
};
