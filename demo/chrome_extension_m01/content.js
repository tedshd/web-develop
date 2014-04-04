console.log(document);
var adArr = document.querySelectorAll('.subject-text a'),
    urlArr = [],
    count = 0,
    loop,
    win,
    close;
console.log(adArr);
for (var i = 0; i < adArr.length; i++) {
    var url = adArr[i].getAttribute('href');
    urlArr.push(url);
}
console.log(urlArr);
if (urlArr.length !== 0) {
    run();
}

function run () {
    loop = setInterval(function() {
        console.log('loop');
        // adArr[count].click();
        win = window.open(urlArr[count]);
        close = setTimeout(function() {
            win.close();
            clearTimeout(close);
        }, 900);
        count++;
        if (count === urlArr.length) {
            clearInterval(loop);
            clearTimeout(close);
        }
    },5000);
}
var adArr_1 = document.querySelectorAll('.fast-ad a'),
    urlArr_1 = [],
    count_1 = 0,
    loop_1,
    win_1,
    close_1;
console.log(adArr_1);
for (var i = 0; i < adArr_1.length; i++) {
    var url = adArr_1[i].getAttribute('href');
    urlArr_1.push(url);
}
console.log(urlArr_1);
if (urlArr_1.length !== 0) {
    run_1();
}

function run_1 () {
    loop_1 = setInterval(function() {
        console.log('loop_1');
        // adArr[count].click();
        win_1 = window.open(urlArr[count_1]);
        close_1 = setTimeout(function() {
            win_1.close();
            clearTimeout(close_1);
        }, 900);
        count_1++;
        if (count_1 === urlArr_1.length) {
            clearInterval(loop_1);
            clearTimeout(close_1);
        }
    },5000);
}