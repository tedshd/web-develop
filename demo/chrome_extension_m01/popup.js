console.log('popupJs');
var adArr = document.querySelectorAll('embed'),
    urlArr = [],
    count = 0;

for (var i = 0; i < adArr.length; i++) {
    var url = adArr[i].getAttribute('src');
    urlArr.push('url');
}

document.querySelector('button').addEventListener('click', function() {
    run();
});

function run () {
    setInterval(function() {
        window.open(urlArr[count]);
        count++;
    },7000);
}
