var https = require('https');

const args = process.argv;

console.log('file:', args[2]);

var fileName = args[2];
var urlArray = [],
    requestCount = 0;

fs = require('fs')
fs.readFile(fileName, 'utf8', function(err, data) {
    if (err) {
        return console.log(err);
    }
    // console.log(data);
    var arr = data.toString().split('\n');
    for (var i in arr) {
        // console.log(arr[i]);
        var tmpArr = arr[i].split(',')[0].replace('https://', '');
        // console.log(tmpArr);
        // ping(tmpArr);
        if (tmpArr.indexOf('feebee.com.tw') !== -1) {
            urlArray.push(tmpArr);
        }
    }
    ping(urlArray[requestCount]);
});


function ping(argument) {
    requestCount++;
    console.log(requestCount);
    if (urlArray.length === requestCount) {
        return;
    }
    https.get('https://cdn.ampproject.org/update-ping/c/s/' + argument, (res) => {
        const { statusCode } = res;
        console.log(statusCode);
        res.on('data', () => {});
        res.on('end', () => {
            ping(urlArray[requestCount]);
        });
    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
    });
}