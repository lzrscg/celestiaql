const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('community_pool', {
    one_row_id: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      primaryKey: true
    },
    coins: {
      type: DataTypes.ARRAY(null),
      allowNull: false
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'community_pool',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "community_pool_height_index",
        fields: [
          { name: "height" },
        ]
      },
      {
        name: "community_pool_pkey",
        unique: true,
        fields: [
          { name: "one_row_id" },
        ]
      },
    ]
  });
};
