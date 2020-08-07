var express = require('express')
app = express()
const https = require('https');
const jsdom = require('jsdom');


app.get('/latestStories', function (req, resp) {
    https.get('https://time.com', function (res) {

        let data = '';
        const latestNewsElements = [];
        // A chunk of data has been recieved.
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            const dom = new jsdom.JSDOM(data);
            // console.log(dom)
            const latestSec = dom.window.document.getElementsByClassName("latest")[0];
            var elements = latestSec.getElementsByClassName("title")

            for (var i = 0; i < elements.length; i++) {
                var title = elements[i].getElementsByTagName('a')[0].innerHTML;
                var startIndex = elements[i].innerHTML.indexOf('<a href=\"') + 9
                var endIndex = elements[i].innerHTML.indexOf('\"', 9);
                var link = 'https://www.time.com' + elements[i].innerHTML.slice(startIndex, endIndex)
                var obj = { title: title, link: link };
                latestNewsElements.push(obj);
                
            }
            resp.json(latestNewsElements)

        });
    })
    
});

app.listen(3000)