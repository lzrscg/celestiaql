const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('staking_params', {
    one_row_id: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      primaryKey: true
    },
    params: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'staking_params',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "staking_params_height_index",
        fields: [
          { name: "height" },
        ]
      },
      {
        name: "staking_params_pkey",
        unique: true,
        fields: [
          { name: "one_row_id" },
        ]
      },
    ]
  });
};
