const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('proposal', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    content: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    proposal_route: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    proposal_type: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    submit_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deposit_end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    voting_start_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    voting_end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    proposer_address: {
      type: DataTypes.TEXT,
      allowNull: false,
      references: {
        model: 'account',
        key: 'address'
      }
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'proposal',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "proposal_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "proposal_proposer_address_index",
        fields: [
          { name: "proposer_address" },
        ]
      },
    ]
  });
};
