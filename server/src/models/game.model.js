// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const game = sequelizeClient.define('game', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    match_link: {
      type: DataTypes.STRING,
    },
    match_it_id: {
      type: DataTypes.UUID,
    },
    hot_it_id: {
      type: DataTypes.UUID,
    },
    party_id: {
      type: DataTypes.UUID,
    },
    state: {
      type: DataTypes.STRING,
      defaultValue: 'lobby'
    },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  game.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return game;
};
