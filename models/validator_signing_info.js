const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('validator_signing_info', {
    validator_address: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    start_height: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    index_offset: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    jailed_until: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tombstoned: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    missed_blocks_counter: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'validator_signing_info',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "validator_signing_info_height_index",
        fields: [
          { name: "height" },
        ]
      },
      {
        name: "validator_signing_info_pkey",
        unique: true,
        fields: [
          { name: "validator_address" },
        ]
      },
    ]
  });
};
