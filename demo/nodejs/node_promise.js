let myFirstPromise = new Promise((resolve, reject) => {
  // 當非同步作業成功時，呼叫 resolve(...),而失敗時則呼叫 reject(...)。
  // 在這個例子中，使用 setTimeout(...) 來模擬非同步程式碼。
  // 在實務中，您將可能使用像是 XHR 或者一個 HTML5 API.
  setTimeout(function(){
    resolve("Success!"); // Yay！非常順利！
  }, 250);
});

var http = require('http');

myFirstPromise.then((successMessage) => {
  // successMessage 是任何您由上方 resolve(...) 傳入的東西。
  // 在此僅作為成功訊息，但是它不一定是字串。
  console.log("Yay! " + successMessage);
});


http.get('http://nodejs.org/dist/index.json', (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
                      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // consume response data to free up memory
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});