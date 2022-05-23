const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vesting_period', {
    vesting_account_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'vesting_account',
        key: 'id'
      }
    },
    period_order: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    length: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    amount: {
      type: DataTypes.ARRAY(null),
      allowNull: false,
      defaultValue: []
    }
  }, {
    sequelize,
    tableName: 'vesting_period',
    schema: 'public',
    timestamps: false
  });
};
