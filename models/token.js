const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('token', {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: "token_name_key"
    }
  }, {
    sequelize,
    tableName: 'token',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "token_name_key",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
};
