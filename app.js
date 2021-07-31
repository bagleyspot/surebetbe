const express = require('express');
const app = express();
const cors = require('cors');
const connectionMongo = require('./connection/mongodb/connectionMongo')
const sportDataApi = require('./api/sportDataApi')
const sportDataServiceImport = require('./service/sportDataServiceImport')

require('dotenv/config');

//Setto il server sulla porta di ascolto
app.listen(process.env.PORTSERVER);
console.log("In ascolto su porta "+process.env.PORTSERVER);

//Realizzo la connessione con il DB di Mongo
connectionMongo.CON.connectioDB()

/**
 * Operazione schedulata di import delle partite con le rispettive quotazioni
 */
sportDataServiceImport.CRON.taskImportDataFromSportDataApi();


/** navigazione country -> league -> season -> match**/
/** country_id=62 -> league_id=392 -> season_id = 619
/**
 * Italia country_id=62
 * SeriaA league_id=392
 * SerieB league_id=393
 * season_id = 619
 * @type {string}
 */
