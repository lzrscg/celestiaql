const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fee_grant_allowance', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    grantee_address: {
      type: DataTypes.TEXT,
      allowNull: false,
      references: {
        model: 'account',
        key: 'address'
      },
      unique: "unique_fee_grant_allowance"
    },
    granter_address: {
      type: DataTypes.TEXT,
      allowNull: false,
      references: {
        model: 'account',
        key: 'address'
      },
      unique: "unique_fee_grant_allowance"
    },
    allowance: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'fee_grant_allowance',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "fee_grant_allowance_height_index",
        fields: [
          { name: "height" },
        ]
      },
      {
        name: "fee_grant_allowance_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "unique_fee_grant_allowance",
        unique: true,
        fields: [
          { name: "grantee_address" },
          { name: "granter_address" },
        ]
      },
    ]
  });
};
