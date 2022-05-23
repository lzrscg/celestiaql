const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('proposal_deposit', {
    proposal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'proposal',
        key: 'id'
      },
      unique: "unique_deposit"
    },
    depositor_address: {
      type: DataTypes.TEXT,
      allowNull: true,
      references: {
        model: 'account',
        key: 'address'
      },
      unique: "unique_deposit"
    },
    amount: {
      type: DataTypes.ARRAY(null),
      allowNull: true
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
    tableName: 'proposal_deposit',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "proposal_deposit_depositor_address_index",
        fields: [
          { name: "depositor_address" },
        ]
      },
      {
        name: "proposal_deposit_depositor_height_index",
        fields: [
          { name: "height" },
        ]
      },
      {
        name: "proposal_deposit_proposal_id_index",
        fields: [
          { name: "proposal_id" },
        ]
      },
      {
        name: "unique_deposit",
        unique: true,
        fields: [
          { name: "proposal_id" },
          { name: "depositor_address" },
        ]
      },
    ]
  });
};
