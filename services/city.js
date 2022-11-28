const axios = require('axios');

exports.isCityOk = async (city) => {
    const request = 'https://api-adresse.data.gouv.fr/search/?q=' + city + '&type=municipality&autocomplete=0'
    let ret = await axios.get(request,
        {
            headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }
        }).then((result) => {
            if (result && result.data) {
                let toCompare = JSON.stringify(result.data.features);//.toLowerCase()
                if (toCompare.search(new RegExp(city, "i")) > 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }).catch((error) => {
            console.log(error);
            return false;
        });
    return ret;
}
