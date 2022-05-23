var DataTypes = require("sequelize").DataTypes;
var _account = require("./account");
var _average_block_time_from_genesis = require("./average_block_time_from_genesis");
var _average_block_time_per_day = require("./average_block_time_per_day");
var _average_block_time_per_hour = require("./average_block_time_per_hour");
var _average_block_time_per_minute = require("./average_block_time_per_minute");
var _block = require("./block");
var _community_pool = require("./community_pool");
var _distribution_params = require("./distribution_params");
var _double_sign_evidence = require("./double_sign_evidence");
var _double_sign_vote = require("./double_sign_vote");
var _fee_grant_allowance = require("./fee_grant_allowance");
var _genesis = require("./genesis");
var _gov_params = require("./gov_params");
var _inflation = require("./inflation");
var _message = require("./message");
var _mint_params = require("./mint_params");
var _modules = require("./modules");
var _pre_commit = require("./pre_commit");
var _proposal = require("./proposal");
var _proposal_deposit = require("./proposal_deposit");
var _proposal_staking_pool_snapshot = require("./proposal_staking_pool_snapshot");
var _proposal_tally_result = require("./proposal_tally_result");
var _proposal_validator_status_snapshot = require("./proposal_validator_status_snapshot");
var _proposal_vote = require("./proposal_vote");
var _pruning = require("./pruning");
var _slashing_params = require("./slashing_params");
var _staking_params = require("./staking_params");
var _staking_pool = require("./staking_pool");
var _supply = require("./supply");
var _token = require("./token");
var _token_price = require("./token_price");
var _token_price_history = require("./token_price_history");
var _token_unit = require("./token_unit");
var _transaction = require("./transaction");
var _validator = require("./validator");
var _validator_commission = require("./validator_commission");
var _validator_description = require("./validator_description");
var _validator_info = require("./validator_info");
var _validator_signing_info = require("./validator_signing_info");
var _validator_status = require("./validator_status");
var _validator_voting_power = require("./validator_voting_power");
var _vesting_account = require("./vesting_account");
var _vesting_period = require("./vesting_period");

function initModels(sequelize) {
  var account = _account(sequelize, DataTypes);
  var average_block_time_from_genesis = _average_block_time_from_genesis(sequelize, DataTypes);
  var average_block_time_per_day = _average_block_time_per_day(sequelize, DataTypes);
  var average_block_time_per_hour = _average_block_time_per_hour(sequelize, DataTypes);
  var average_block_time_per_minute = _average_block_time_per_minute(sequelize, DataTypes);
  var block = _block(sequelize, DataTypes);
  var community_pool = _community_pool(sequelize, DataTypes);
  var distribution_params = _distribution_params(sequelize, DataTypes);
  var double_sign_evidence = _double_sign_evidence(sequelize, DataTypes);
  var double_sign_vote = _double_sign_vote(sequelize, DataTypes);
  var fee_grant_allowance = _fee_grant_allowance(sequelize, DataTypes);
  var genesis = _genesis(sequelize, DataTypes);
  var gov_params = _gov_params(sequelize, DataTypes);
  var inflation = _inflation(sequelize, DataTypes);
  var message = _message(sequelize, DataTypes);
  var mint_params = _mint_params(sequelize, DataTypes);
  var modules = _modules(sequelize, DataTypes);
  var pre_commit = _pre_commit(sequelize, DataTypes);
  var proposal = _proposal(sequelize, DataTypes);
  var proposal_deposit = _proposal_deposit(sequelize, DataTypes);
  var proposal_staking_pool_snapshot = _proposal_staking_pool_snapshot(sequelize, DataTypes);
  var proposal_tally_result = _proposal_tally_result(sequelize, DataTypes);
  var proposal_validator_status_snapshot = _proposal_validator_status_snapshot(sequelize, DataTypes);
  var proposal_vote = _proposal_vote(sequelize, DataTypes);
  var pruning = _pruning(sequelize, DataTypes);
  var slashing_params = _slashing_params(sequelize, DataTypes);
  var staking_params = _staking_params(sequelize, DataTypes);
  var staking_pool = _staking_pool(sequelize, DataTypes);
  var supply = _supply(sequelize, DataTypes);
  var token = _token(sequelize, DataTypes);
  var token_price = _token_price(sequelize, DataTypes);
  var token_price_history = _token_price_history(sequelize, DataTypes);
  var token_unit = _token_unit(sequelize, DataTypes);
  var transaction = _transaction(sequelize, DataTypes);
  var validator = _validator(sequelize, DataTypes);
  var validator_commission = _validator_commission(sequelize, DataTypes);
  var validator_description = _validator_description(sequelize, DataTypes);
  var validator_info = _validator_info(sequelize, DataTypes);
  var validator_signing_info = _validator_signing_info(sequelize, DataTypes);
  var validator_status = _validator_status(sequelize, DataTypes);
  var validator_voting_power = _validator_voting_power(sequelize, DataTypes);
  var vesting_account = _vesting_account(sequelize, DataTypes);
  var vesting_period = _vesting_period(sequelize, DataTypes);

  fee_grant_allowance.belongsTo(account, { as: "grantee_address_account", foreignKey: "grantee_address"});
  account.hasMany(fee_grant_allowance, { as: "fee_grant_allowances", foreignKey: "grantee_address"});
  fee_grant_allowance.belongsTo(account, { as: "granter_address_account", foreignKey: "granter_address"});
  account.hasMany(fee_grant_allowance, { as: "granter_address_fee_grant_allowances", foreignKey: "granter_address"});
  proposal.belongsTo(account, { as: "proposer_address_account", foreignKey: "proposer_address"});
  account.hasMany(proposal, { as: "proposals", foreignKey: "proposer_address"});
  proposal_deposit.belongsTo(account, { as: "depositor_address_account", foreignKey: "depositor_address"});
  account.hasMany(proposal_deposit, { as: "proposal_deposits", foreignKey: "depositor_address"});
  proposal_vote.belongsTo(account, { as: "voter_address_account", foreignKey: "voter_address"});
  account.hasMany(proposal_vote, { as: "proposal_votes", foreignKey: "voter_address"});
  validator_info.belongsTo(account, { as: "self_delegate_address_account", foreignKey: "self_delegate_address"});
  account.hasMany(validator_info, { as: "validator_infos", foreignKey: "self_delegate_address"});
  vesting_account.belongsTo(account, { as: "address_account", foreignKey: "address"});
  account.hasMany(vesting_account, { as: "vesting_accounts", foreignKey: "address"});
  proposal_deposit.belongsTo(block, { as: "height_block", foreignKey: "height"});
  block.hasMany(proposal_deposit, { as: "proposal_deposits", foreignKey: "height"});
  proposal_vote.belongsTo(block, { as: "height_block", foreignKey: "height"});
  block.hasMany(proposal_vote, { as: "proposal_votes", foreignKey: "height"});
  transaction.belongsTo(block, { as: "height_block", foreignKey: "height"});
  block.hasMany(transaction, { as: "transactions", foreignKey: "height"});
  validator_voting_power.belongsTo(block, { as: "height_block", foreignKey: "height"});
  block.hasMany(validator_voting_power, { as: "validator_voting_powers", foreignKey: "height"});
  double_sign_evidence.belongsTo(double_sign_vote, { as: "vote_a", foreignKey: "vote_a_id"});
  double_sign_vote.hasMany(double_sign_evidence, { as: "double_sign_evidences", foreignKey: "vote_a_id"});
  double_sign_evidence.belongsTo(double_sign_vote, { as: "vote_b", foreignKey: "vote_b_id"});
  double_sign_vote.hasMany(double_sign_evidence, { as: "vote_b_double_sign_evidences", foreignKey: "vote_b_id"});
  proposal_deposit.belongsTo(proposal, { as: "proposal", foreignKey: "proposal_id"});
  proposal.hasMany(proposal_deposit, { as: "proposal_deposits", foreignKey: "proposal_id"});
  proposal_staking_pool_snapshot.belongsTo(proposal, { as: "proposal", foreignKey: "proposal_id"});
  proposal.hasOne(proposal_staking_pool_snapshot, { as: "proposal_staking_pool_snapshot", foreignKey: "proposal_id"});
  proposal_tally_result.belongsTo(proposal, { as: "proposal", foreignKey: "proposal_id"});
  proposal.hasOne(proposal_tally_result, { as: "proposal_tally_result", foreignKey: "proposal_id"});
  proposal_validator_status_snapshot.belongsTo(proposal, { as: "proposal", foreignKey: "proposal_id"});
  proposal.hasMany(proposal_validator_status_snapshot, { as: "proposal_validator_status_snapshots", foreignKey: "proposal_id"});
  proposal_vote.belongsTo(proposal, { as: "proposal", foreignKey: "proposal_id"});
  proposal.hasMany(proposal_vote, { as: "proposal_votes", foreignKey: "proposal_id"});
  token_unit.belongsTo(token, { as: "token_name_token", foreignKey: "token_name"});
  token.hasMany(token_unit, { as: "token_units", foreignKey: "token_name"});
  token_price.belongsTo(token_unit, { as: "unit_name_token_unit", foreignKey: "unit_name"});
  token_unit.hasOne(token_price, { as: "token_price", foreignKey: "unit_name"});
  token_price_history.belongsTo(token_unit, { as: "unit_name_token_unit", foreignKey: "unit_name"});
  token_unit.hasMany(token_price_history, { as: "token_price_histories", foreignKey: "unit_name"});
  message.belongsTo(transaction, { as: "partition", foreignKey: "partition_id"});
  transaction.hasMany(message, { as: "messages", foreignKey: "partition_id"});
  message.belongsTo(transaction, { as: "transaction_hash_transaction", foreignKey: "transaction_hash"});
  transaction.hasMany(message, { as: "transaction_hash_messages", foreignKey: "transaction_hash"});
  block.belongsTo(validator, { as: "proposer_address_validator", foreignKey: "proposer_address"});
  validator.hasMany(block, { as: "blocks", foreignKey: "proposer_address"});
  double_sign_vote.belongsTo(validator, { as: "validator_address_validator", foreignKey: "validator_address"});
  validator.hasMany(double_sign_vote, { as: "double_sign_votes", foreignKey: "validator_address"});
  pre_commit.belongsTo(validator, { as: "validator_address_validator", foreignKey: "validator_address"});
  validator.hasMany(pre_commit, { as: "pre_commits", foreignKey: "validator_address"});
  proposal_validator_status_snapshot.belongsTo(validator, { as: "validator_address_validator", foreignKey: "validator_address"});
  validator.hasMany(proposal_validator_status_snapshot, { as: "proposal_validator_status_snapshots", foreignKey: "validator_address"});
  validator_commission.belongsTo(validator, { as: "validator_address_validator", foreignKey: "validator_address"});
  validator.hasOne(validator_commission, { as: "validator_commission", foreignKey: "validator_address"});
  validator_description.belongsTo(validator, { as: "validator_address_validator", foreignKey: "validator_address"});
  validator.hasOne(validator_description, { as: "validator_description", foreignKey: "validator_address"});
  validator_info.belongsTo(validator, { as: "consensus_address_validator", foreignKey: "consensus_address"});
  validator.hasOne(validator_info, { as: "validator_info", foreignKey: "consensus_address"});
  validator_status.belongsTo(validator, { as: "validator_address_validator", foreignKey: "validator_address"});
  validator.hasOne(validator_status, { as: "validator_status", foreignKey: "validator_address"});
  validator_voting_power.belongsTo(validator, { as: "validator_address_validator", foreignKey: "validator_address"});
  validator.hasOne(validator_voting_power, { as: "validator_voting_power", foreignKey: "validator_address"});
  vesting_period.belongsTo(vesting_account, { as: "vesting_account", foreignKey: "vesting_account_id"});
  vesting_account.hasMany(vesting_period, { as: "vesting_periods", foreignKey: "vesting_account_id"});

  return {
    account,
    average_block_time_from_genesis,
    average_block_time_per_day,
    average_block_time_per_hour,
    average_block_time_per_minute,
    block,
    community_pool,
    distribution_params,
    double_sign_evidence,
    double_sign_vote,
    fee_grant_allowance,
    genesis,
    gov_params,
    inflation,
    message,
    mint_params,
    modules,
    pre_commit,
    proposal,
    proposal_deposit,
    proposal_staking_pool_snapshot,
    proposal_tally_result,
    proposal_validator_status_snapshot,
    proposal_vote,
    pruning,
    slashing_params,
    staking_params,
    staking_pool,
    supply,
    token,
    token_price,
    token_price_history,
    token_unit,
    transaction,
    validator,
    validator_commission,
    validator_description,
    validator_info,
    validator_signing_info,
    validator_status,
    validator_voting_power,
    vesting_account,
    vesting_period,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
