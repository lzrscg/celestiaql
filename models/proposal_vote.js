const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('proposal_vote', {
    proposal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'proposal',
        key: 'id'
      },
      unique: "unique_vote"
    },
    voter_address: {
      type: DataTypes.TEXT,
      allowNull: false,
      references: {
        model: 'account',
        key: 'address'
      },
      unique: "unique_vote"
    },
    option: {
      type: DataTypes.TEXT,
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
    tableName: 'proposal_vote',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "proposal_vote_height_index",
        fields: [
          { name: "height" },
        ]
      },
      {
        name: "proposal_vote_proposal_id_index",
        fields: [
          { name: "proposal_id" },
        ]
      },
      {
        name: "proposal_vote_voter_address_index",
        fields: [
          { name: "voter_address" },
        ]
      },
      {
        name: "unique_vote",
        unique: true,
        fields: [
          { name: "proposal_id" },
          { name: "voter_address" },
        ]
      },
    ]
  });
};
