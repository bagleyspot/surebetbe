const mongoose = require('mongoose')

const MatchQuotate = mongoose.Schema({

    matchId: {
        type: Number,
        required: true
    },
    matchStart: {
        type: Date,
        required: true
    },
    lega: {
        type: Number,
        required: true
    },
    stagione: {
        type: Number,
        required: true
    },
    homeTeam: {
        type: {},
        required: true
    },
    awaitTeam: {
        type: {},
        required: true
    },
    status: {
        type: String,
        required: false,
        default: ""
    },
    bookMaker: {
        type: [],
        required: false,
        default: []
    }
})

module.exports = mongoose.model("MatchQuotate", MatchQuotate);