/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2017-03-25 23:15:54
 * @version $Id$
 */
const keymap = require('./keymap.js');

// console.log(keymap.LAYOUT.yoda.ansi);
var dataKeyCode = keymap.LAYOUT.yoda.ansi;
let BufferArrayKeyCode = [];
let keyCodeLength = 0;
const fs = require('fs');

let BufferArray = [];
let BufferLength;
let items;
const profile = 4;
let profiles = [];
const marco = 0;
items = 1;

const title = Buffer.from('CYFI', 'ascii');
const rev = Buffer.from([0, 0]);
const itemSize = Buffer.from([items]);
let headerLength = 8;

BufferArray.push(title);
BufferArray.push(rev);
BufferArray.push(itemSize);

// profile
let item = Buffer.from([0, profile, 0, (items + 1)*8]);
BufferArray.push(item);
BufferLength = headerLength + 8;
// marco


// keycode
for (var i = 0; i < dataKeyCode.length; i++) {
  var hex = dataKeyCode[i].hex;
  keyCodeLength = keyCodeLength + hex.length;
  for (var j = 0; j < hex.length; j++) {
    var tmpBuff = Buffer.from([hex[j]]);
    BufferArrayKeyCode.push(tmpBuff);
  }
}




const buff = Buffer.concat(BufferArray, BufferLength);

const keyCode = Buffer.concat(BufferArrayKeyCode, keyCodeLength);
// buff.write('text', profiles[0], 2);
console.log('L', BufferLength);
console.log(buff.toString('hex'));

fs.writeFile("./KEYMAP.CYS", BufferArrayKeyCode, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});