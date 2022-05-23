const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('proposal_tally_result', {
    proposal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'proposal',
        key: 'id'
      }
    },
    yes: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    abstain: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    no: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    no_with_veto: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'proposal_tally_result',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "proposal_tally_result_height_index",
        fields: [
          { name: "height" },
        ]
      },
      {
        name: "proposal_tally_result_proposal_id_index",
        fields: [
          { name: "proposal_id" },
        ]
      },
      {
        name: "unique_tally_result",
        unique: true,
        fields: [
          { name: "proposal_id" },
        ]
      },
    ]
  });
};
