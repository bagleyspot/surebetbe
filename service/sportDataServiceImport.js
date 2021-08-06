const cron = require('node-cron')
const sportDataApi = require('../api/sportDataApi')
const MatchQuotateDTO = require('../DTO/matchQuotateDTO')
const MatchQuotate = require('../entity/matchQuotate')
const TOKEN = process.env.TOKEN_TELEGRAM
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(TOKEN, {polling: true})
let message = ''
/**
 * Metodo schedulato ogni 3 giorni a settimana che mi va ad importare le partite e le loro quotazioni
 * navigazione country -> league -> season -> match
 * country_id=48 -> league_id=315 -> season_id = 2024
 */
const taskImportDataFromSportDataApi = () => { cron.schedule('41 23 * * *', async function (){
    await importData(2155);
})}

//Prelevo l'identificativo del messaggio
bot.on('message', msg => {
    message = msg.chat.id;
})

/**
 * Metodo che realizza l'import effettivo
 * @param seasonId
 * @returns {Promise<string>}
 */
async function importData(seasonId){
    //Type Date 2020-01-18
    const toDay = ((new Date()).toISOString().split('T')[0]);
    let plusDay = (new Date())
    plusDay.setDate(plusDay.getDate()+20);
    plusDay = (plusDay.toISOString().split('T')[0])


    //Url per prelevare le partire di una determinata stagione
    const url = process.env.BASE_URL+process.env.API_VERSION+'soccer/matches?apikey='+process.env.API_KEY+'&season_id='+seasonId+'&date_from='+toDay+'&date_to='+plusDay
    //Vado a prelevare l'elenco delle partire per quella settimana
    const matchList = await sportDataApi.getApiCall(url)
    //Variabile che conterrà le quotazioni di ogni bookmaker per le partite di quella settimana
    const matchQuotListDTO = [];
    console.log(matchList)

    //Aspetto un secondo
    await setTimeout(() => {
        if(matchList){
            matchList.data.forEach( async elem => {
                const url1 = process.env.BASE_URL+process.env.API_VERSION+'soccer/odds/'+elem.match_id+'?apikey='+process.env.API_KEY+'&type=prematch'

                //Prendo le quotazioni per quella partita
                const matchQuotList = await sportDataApi.getApiCall(url1).then( res => {return res})
                //Costruisco la classe contenente i dettagli di quella partita e le sue quotazioni
                const matchQuotDTO = new MatchQuotateDTO(elem.match_id,elem.match_start,elem.league_id,elem.season_id,elem.home_team,elem.away_team,elem.status,matchQuotList.data['1X2, Full Time Result'])
                console.log(matchQuotDTO)
                matchQuotListDTO.push(matchQuotDTO)

                const entity = new MatchQuotate({
                    matchId: matchQuotDTO.matchId,
                    matchStart: matchQuotDTO.matchStart,
                    lega: matchQuotDTO.lega,
                    stagione: matchQuotDTO.stagione,
                    homeTeam: matchQuotDTO.homeTeam,
                    awaitTeam: matchQuotDTO.awaitTeam,
                    status: matchQuotDTO.status,
                    bookMaker: matchQuotDTO.bookMaker
                })

                //Vado a verificare se la partita è già presente, se è già presente aggiorno i dati
                //Altrimenti la inserisco
                const isExist = await MatchQuotate.exists({matchId: matchQuotDTO.matchId});
                if (!isExist) {

                    await entity.save().then(data => {
                        console.log("Partita " + matchQuotDTO.matchId + " inserita con successo")
                    })
                        .catch(err => {
                            console.log("Partita " + matchQuotDTO.matchId + " Inserimento fallita" + err)
                        })
                }
                else {

                    await entity.updateOne({matchId:matchQuotDTO.matchId},{$set: {matchStart:matchQuotDTO.matchStart,
                            lega: matchQuotDTO.lega, stagione: matchQuotDTO.stagione, homeTeam: matchQuotDTO.homeTeam,
                            awaitTeam: matchQuotDTO.awaitTeam, status: matchQuotDTO.status, bookMaker: matchQuotDTO.bookMaker}})
                        .then( data => {console.log("Partita " + matchQuotDTO.matchId + " aggiornata con successo")})

                    //Invio la notifica a telegram
                    await bot.sendMessage(message, 'Partita Aggiornata')
                }

                await sureBetCalc(matchQuotDTO);


            })}},1000)

    return "OK"
}



//Metodo che realizza la ricerca della surebet per singolo bookmakers
async function sureBetCalc(match){

    //Se non c'è quotazione lo notifica e ritorna vuoto
    if( typeof match.bookMaker === 'undefined') {console.log("Quotazione non presente");return ""}

    for (const elem of match.bookMaker.bookmakers) {
        const home = elem.odds_data.home;
        const draw = elem.odds_data.draw;
        const away = elem.odds_data.away;
        const s = 100;
        const k = (1/home)+(1/draw)+(1/away);
        let homeP = 0;
        let drawP = 0;
        let awayP = 0;

        if ( k < 1) {
            console.log("TROVATA SURE");
            homeP = s/(k*home);
            drawP = s/(k*draw);
            awayP = s/(k*away);
            console.log("Home Team"+match.homeTeam)
            console.log("Away Team"+match.awaitTeam)
            console.log("HOME "+homeP);
            console.log("DRAW "+ drawP);
            console.log("AWAY "+ awayP);

        }
        else {
            console.log("SURE NON TROVATA")
        }

    }
}

exports.CRON = {taskImportDataFromSportDataApi,importData}