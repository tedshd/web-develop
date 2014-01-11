if (localStorage.accessToken) {
    var graphUrl = "https://graph.facebook.com/me?" + localStorage.accessToken;
    console.log('url', graphUrl);
    console.log('token', localStorage.accessToken);



    var xhr = new XMLHttpRequest();
    xhr.open('GET', graphUrl, true);
    xhr.onload = function(e) {
        // console.log(e);
        // console.log(this);
        console.log('response', this.response);
        data = JSON.parse(this.response);
        console.log(data);
        if (data.error) {
            console.log(data);
            node('#loading').setAttribute('class', 'hide');
            node('#login').setAttribute('class', '');
            node('#content').setAttribute('class', 'hide');
            localStorage.accessToken = '';
        } else {
            node('#loading').setAttribute('class', 'hide');
            node('#content').setAttribute('class', '');
        }
        fb_data = data;
        runApp(fb_data);
    };
    xhr.send();
} else {
    console.log('no localStorage accessToken');
    node('#loading').setAttribute('class', 'hide');
    node('#login').setAttribute('class', '');
}
