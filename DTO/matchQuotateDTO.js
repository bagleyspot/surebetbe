
class MatchQuotateDTO {

    constructor(matchId,matchStart,lega,stagione,homeTeam,awaitTeam,status,bookMaker) {
        this.matchId = matchId;
        this.matchStart = matchStart;
        this.lega = lega;
        this.stagione = stagione;
        this.homeTeam = homeTeam;
        this.awaitTeam = awaitTeam;
        this.status = status;
        this.bookMaker = bookMaker;
    }

}

module.exports = MatchQuotateDTO