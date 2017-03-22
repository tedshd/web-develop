var fs = require('fs');

fs.open('exp.cys', 'r', function(status, fd) {
    if (status) {
        console.log(status.message);
        return;
    }
    var buffer = new Buffer(40000);
    fs.read(fd, buffer, 0, 40000, 0, function(err, num) {
        console.log(buffer.toString('ascii', 0, num));
    });
});