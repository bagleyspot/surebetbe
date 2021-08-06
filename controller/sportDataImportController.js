const express = require('express')
const router = express.Router();
const sportDataServiceImport = require('../service/sportDataServiceImport')


/**
 * Metodo che mi va a eralizzare l'import delle quotazioni alla chiamata dell'end point
 * @params: <Number>seasonId
 */
router.get('/importdatasport/:seasonId', async (req,res) =>{
    console.log("Esecuzione import quotazioni")
    return res.json(await sportDataServiceImport.CRON.importData(req.params.seasonId));
})

module.exports = router