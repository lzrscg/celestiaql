const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('modules', {
    module_name: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'modules',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "modules_pkey",
        unique: true,
        fields: [
          { name: "module_name" },
        ]
      },
    ]
  });
};
