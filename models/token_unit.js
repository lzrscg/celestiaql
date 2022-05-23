const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('token_unit', {
    token_name: {
      type: DataTypes.TEXT,
      allowNull: false,
      references: {
        model: 'token',
        key: 'name'
      }
    },
    denom: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: "token_unit_denom_key"
    },
    exponent: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    aliases: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true
    },
    price_id: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'token_unit',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "token_unit_denom_key",
        unique: true,
        fields: [
          { name: "denom" },
        ]
      },
    ]
  });
};
