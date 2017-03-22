const fs = require('fs');

// const buf = Buffer.from('CYFI', 'ascii');

const buf1 = Buffer.from('CYFI', 'ascii');
const buf2 = Buffer.from([0, 0]);
const totalLength = buf1.length + buf2.length;
const bufA = Buffer.concat([buf1, buf2], totalLength);

// Prints: 68656c6c6f20776f726c64
console.log(buf1.toString('hex'));

// Prints: aGVsbG8gd29ybGQ=
console.log(buf1.toString('base64'));

fs.writeFile("./KEYMAP.CYS", bufA, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});