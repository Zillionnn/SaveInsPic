const got = require('got');

(async() => {
    try {
        const response = await got('http://127.0.0.1');
        // console.log(response.body)
            //=> '<!doctype html> ...'
            const html = response.body
            
            let startString = '"graphql": '
            let startIdx = html.search(startString)

            let remain = html.substring(startIdx, html.length)
            
          let   remain1  = remain.substring(0, remain.length)



            const endIdx = remain1.search('</')
            console.log(endIdx)
            let jsonString = remain1.substring(startString.length, endIdx-9)
            let jsonObj = JSON.parse(jsonString)
            console.log(jsonObj.shortcode_media.display_resources)
            // console.log(jsonString)
    } catch (error) {
        console.log(error);
        //=> 'Internal server error ...'
    }
})();