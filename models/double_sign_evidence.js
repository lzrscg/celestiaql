const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('double_sign_evidence', {
    height: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    vote_a_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'double_sign_vote',
        key: 'id'
      }
    },
    vote_b_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'double_sign_vote',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'double_sign_evidence',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "double_sign_evidence_height_index",
        fields: [
          { name: "height" },
        ]
      },
    ]
  });
};
