const fs = require('fs');

// const buf = Buffer.from('CYFI', 'ascii');

const buf1 = Buffer.from('CYFI', 'ascii');
// const buf2 = Buffer.from([0x000]);
const buf2 = Buffer.from([0x02FE0]);
const arr = new Uint16Array(2);

arr[0] = 0;
arr[1] = 1;

// Shares memory with `arr`
const arrBuf = Buffer.from(arr.buffer);

const totalLength = buf1.length + arrBuf.length;
const bufA = Buffer.concat([buf1, arrBuf], 8);
const ab = new ArrayBuffer(12);
const buf = Buffer.from([00], 0, 2);

// Prints: <Buffer 88 13 a0 0f>
console.log(buf);

let BufferArray = [];

const keymap = require('./keymap.js');

console.log(keymap.LAYOUT.yoda.ansi);
var keyCode = keymap.LAYOUT.yoda.ansi;
var BufferLength = 0;


for (var i = 0; i < keyCode.length; i++) {
  var hex = keyCode[i].hex;
  BufferLength = BufferLength + hex.length;
  for (var j = 0; j < hex.length; j++) {
    var buff = Buffer.from([hex[j]]);
    BufferArray.push(buff);
  }
}
var buff = Buffer.concat(BufferArray, BufferLength);

console.log(BufferArray.length)
console.log(BufferArray.toString('hex'));

// Prints: 2
console.log('buf', buf.length);
console.log(arrBuf.toString('hex'));

console.log(0xC00);
// Prints: 68656c6c6f20776f726c64
console.log(arrBuf.toString('hex'));

// console.log(new Buffer('0x000', 'hex').toString());

// Prints: aGVsbG8gd29ybGQ=
console.log(buf1.toString('base64'));

fs.writeFile("./KEYMAP.CYS", bufA, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});