const fs = require('fs');

// var buffer = Buffer.alloc(8, 'CYFI');
// var buffer = new Buffer(['CYFI', 0, 511]);
var buffer = new Buffer('CYFI');

const buf1 = Buffer.alloc(10);

// Creates a Buffer of length 10, filled with 0x1.
const buf2 = Buffer.alloc(10, 1);

// Creates an uninitialized buffer of length 10.
// This is faster than calling Buffer.alloc() but the returned
// Buffer instance might contain old data that needs to be
// overwritten using either fill() or write().
const buf3 = Buffer.allocUnsafe(10);

// Creates a Buffer containing [0x1, 0x2, 0x3].
const buf4 = Buffer.from([1, 2, 3]);


const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

// Prints: <Buffer 00 00 00 00 ...>
// console.log(bufA);

console.log(buffer);

fs.writeFile("./KEYMAP.CYS", buffer, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});