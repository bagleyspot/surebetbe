const cron = require('node-cron')
const sportDataApi = require('../api/sportDataApi')
const MatchQuotateDTO = require('../DTO/matchQuotateDTO')
const MatchQuotate = require('../entity/matchQuotate')
/**
 * Metodo schedulato ogni 3 giorni a settimana che mi va ad importare le partite e le loro quotazioni
 * navigazione country -> league -> season -> match
 * country_id=48 -> league_id=315 -> season_id = 2024
 */
const taskImportDataFromSportDataApi = () => { cron.schedule('01 13 * * *', async function (){

    //Url per prelevare le partire di una determinata stagione
    const url = process.env.BASE_URL+process.env.API_VERSION+'soccer/matches?apikey=4ecbc490-f179-11eb-9b67-ef68bf20b7b3&season_id=2024&date_to=2021-08-01'
    //Vado a prelevare l'elenco delle partire per quella settimana
    const matchList = await sportDataApi.getApiCall(url)
    //Variabile che conterrà le quotazioni di ogni bookmaker per le partite di quella settimana
    const matchQuotListDTO = [];
    console.log(matchList)

    //Aspetto un secondo
    await setTimeout(() => {matchList.data.forEach( async elem => {
        const url1 = process.env.BASE_URL+process.env.API_VERSION+'soccer/odds/'+elem.match_id+'?apikey=4ecbc490-f179-11eb-9b67-ef68bf20b7b3&type=prematch'

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
        }

    sureBetCalc(matchQuotDTO);


    })},1000)




})}


function sureBetCalc(match){
    match.bookMaker.bookmakers.forEach( elem => {
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
            console.log("HOME "+homeP);
            console.log("DRAW "+ drawP);
            console.log("AWAY "+ awayP);

        }
        else {
            console.log("SURE NON TROVATA")
        }

    })
}

exports.CRON = {taskImportDataFromSportDataApi}