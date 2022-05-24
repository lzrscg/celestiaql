const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('average_block_time_from_genesis', {
    one_row_id: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      primaryKey: true
    },
    average_time: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'average_block_time_from_genesis',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "average_block_time_from_genesis_height_index",
        fields: [
          { name: "height" },
        ]
      },
      {
        name: "average_block_time_from_genesis_pkey",
        unique: true,
        fields: [
          { name: "one_row_id" },
        ]
      },
    ]
  });
};