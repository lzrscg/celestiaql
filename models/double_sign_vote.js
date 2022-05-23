const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('double_sign_vote', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    round: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    block_id: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: "double_sign_vote_block_id_validator_address_key"
    },
    validator_address: {
      type: DataTypes.TEXT,
      allowNull: false,
      references: {
        model: 'validator',
        key: 'consensus_address'
      },
      unique: "double_sign_vote_block_id_validator_address_key"
    },
    validator_index: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    signature: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'double_sign_vote',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "double_sign_vote_block_id_validator_address_key",
        unique: true,
        fields: [
          { name: "block_id" },
          { name: "validator_address" },
        ]
      },
      {
        name: "double_sign_vote_height_index",
        fields: [
          { name: "height" },
        ]
      },
      {
        name: "double_sign_vote_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "double_sign_vote_validator_address_index",
        fields: [
          { name: "validator_address" },
        ]
      },
    ]
  });
};
