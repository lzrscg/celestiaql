const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('genesis', {
    one_row_id: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      primaryKey: true
    },
    chain_id: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    initial_height: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'genesis',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "genesis_pkey",
        unique: true,
        fields: [
          { name: "one_row_id" },
        ]
      },
    ]
  });
};
