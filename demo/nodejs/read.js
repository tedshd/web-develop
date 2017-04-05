var fs = require('fs');
var buff;

fs.open('KEYMAP.CYS', 'r', function(status, fd) {
    if (status) {
        console.log(status.message);
        return;
    }
    var buffer = new Buffer(40000);
    fs.read(fd, buffer, 0, 40000, 0, function(err, num) {
        buff = buffer.toString('ascii', 0, num);
        console.log(buffer.toString('ascii', 0, num));
        console.log(buffer.toString('utf8', 0, num));
        console.log(buffer.toString('hex', 0, num));
        console.log(buffer.toString('utf16le', 0, num));
        console.log(buffer.toString('binary', 0, num));
        console.log(buffer.toString('latin1', 0, num));
        console.log(buffer.toString('base64', 0, num));
        fs.writeFile("./read.txt", buff, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    });
});

