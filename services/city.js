const axios = require('axios');

exports.isCityOk = async (city) => {
    const request = 'https://api-adresse.data.gouv.fr/search/?q=' + city + '&type=municipality&autocomplete=0'
    let ret = await axios.get(request,
        {
            headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }
        }).then((result) => {
            if (result && result.data) {
                const toCompare = JSON.stringify(result.data.features);
                if (toCompare.search(new RegExp(city, "i")) > 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }).catch((error) => {
            return false;
        });
    return ret;
}
