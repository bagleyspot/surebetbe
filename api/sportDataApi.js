const axios = require('axios');

async function getApiCall(url){
    return await axios.get(url).then( response => {return response.data}).catch(err => console.log(err))
}

module.exports = {getApiCall}