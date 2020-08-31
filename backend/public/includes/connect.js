var config = require('./config')
var knex = require('knex')({
    client: 'mysql',
    connection: {
      host : config.dbSettings.host,
      user : config.dbSettings.user,
      password : config.dbSettings.password,
      database : config.dbSettings.db_name
    }
});

var dbServices = {
  queryBuilder:knex
}



module.exports = dbServices,knex