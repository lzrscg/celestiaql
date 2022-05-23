const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vesting_account', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      references: {
        model: 'account',
        key: 'address'
      }
    },
    original_vesting: {
      type: DataTypes.ARRAY(null),
      allowNull: false,
      defaultValue: []
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'vesting_account',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "vesting_account_address_idx",
        unique: true,
        fields: [
          { name: "address" },
        ]
      },
      {
        name: "vesting_account_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
