const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('message', {
    transaction_hash: {
      type: DataTypes.TEXT,
      allowNull: false,
      references: {
        model: 'transaction',
        key: 'partition_id'
      },
      unique: "unique_message_per_tx"
    },
    index: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: "unique_message_per_tx"
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    value: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    involved_accounts_addresses: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false
    },
    partition_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      references: {
        model: 'transaction',
        key: 'partition_id'
      },
      unique: "unique_message_per_tx"
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'message',
    schema: 'public',
    timestamps: false
  });
};
