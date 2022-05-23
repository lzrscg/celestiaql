const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('proposal_staking_pool_snapshot', {
    proposal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'proposal',
        key: 'id'
      }
    },
    bonded_tokens: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    not_bonded_tokens: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'proposal_staking_pool_snapshot',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "proposal_staking_pool_snapshot_proposal_id_index",
        fields: [
          { name: "proposal_id" },
        ]
      },
      {
        name: "unique_staking_pool_snapshot",
        unique: true,
        fields: [
          { name: "proposal_id" },
        ]
      },
    ]
  });
};
