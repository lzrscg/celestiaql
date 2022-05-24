const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('gov_params', {
    one_row_id: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      primaryKey: true
    },
    deposit_params: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    voting_params: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    tally_params: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'gov_params',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "gov_params_pkey",
        unique: true,
        fields: [
          { name: "one_row_id" },
        ]
      },
    ]
  });
};