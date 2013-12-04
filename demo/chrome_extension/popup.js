if (localStorage.accessToken) {
    var graphUrl = "https://graph.facebook.com/me?" + localStorage.accessToken;
    console.log(graphUrl);
    console.log('url', graphUrl);



    var xhr = new XMLHttpRequest();
    xhr.open('GET', graphUrl, true);
    xhr.onload = function(e) {
        // console.log(e);
        // console.log(this);
        console.log('response', this.response);
        data = JSON.parse(this.response);
        console.log(data);
        if (data.error) {
            node('#login').setAttribute('class', '');
            node('#content').setAttribute('class', 'hide');
        } else {
            node('#login').setAttribute('class', 'hide');
            node('#content').setAttribute('class', '');
        }
        fb_data = data;
        runApp(fb_data);
    };
    xhr.send();
}
