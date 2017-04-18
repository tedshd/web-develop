var crypto = require('crypto');


function ip2Md5(ip) {
  return crypto.createHash('md5').update(ip).digest('hex');
}
console.log(ip2Md5('168.0.0.119'));

function hash(ip) {
    var ts = new Date().getTime();
    return crypto.createHash('md5').update(ip + ts).digest('hex');
}
console.log(hash('168.0.0.119'));
