const got = require('got');

(async() => {
    try {
        const response = await got('https://www.instagram.com/graphql/query/?query_hash=7c8a1055f69ff97dc201e752cf6f0093&variables=%7B%22id%22%3A%223597847967%22%2C%22first%22%3A12%7D');
        console.log(response.body)
            //=> '<!doctype html> ...'
    } catch (error) {
        console.log(error);
        //=> 'Internal server error ...'
    }
})();