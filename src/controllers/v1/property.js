const axios = require('axios')

class Property {
    
    async SearchProperty() {
        const task_id = '09171517-0696-0242-0000-a96bc1ad0bce';
    const axios = require('axios');
    axios({
        method: 'get',
        url: 'https://api.dataforseo.com/v3/business_data/google/hotel_searches/task_get/' + task_id,
        auth: {
            username: 'doantri2003@gmail.com',
            password: 'ab176e4dda0429b4'
        },
        headers: {
            'content-type': 'application/json'
        }
    }).then(function (response) {
        var result = response['data']['tasks'];
        // Result data
        console.log(result);
    }).catch(function (error) {
        console.log(error);
    });

    }
}

module.exports = new Property;