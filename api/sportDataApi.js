const axios = require('axios');

async function getApiCall(url){
    return await axios.get(url).then( response => {return response.data}).catch(err => {console.log(url);console.log(err);console.log(response.data.errors[0]);return false})
}

module.exports = {getApiCall}