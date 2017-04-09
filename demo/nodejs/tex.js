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
const profileCount = 3;
let profiles = [];
const marco = 0;
const itemCount = 3;

const title = Buffer.from('CYFI', 'ascii');
var rev = new Uint16Array(1);
rev[0] = 0;
rev = Buffer.from(rev.buffer);
var itemSize = new Uint16Array(1);
itemSize[0] = itemCount;
itemSize = Buffer.from(itemSize.buffer);
BufferArray = [title, rev, itemSize];
BufferLength = title.length + rev.length + itemSize.length;

// profile
// var profile = Buffer.from([0]);
// var profileIndex = Buffer.from([0]);
// var profileNull = new Uint16Array(1);
// profileNull[0] = null;
// profileNull = Buffer.from(profileNull.buffer);
// var itemDataShift = new Uint16Array(2);
// itemDataShift[0] = (itemCount + 1)*8;
// itemDataShift = Buffer.from(itemDataShift.buffer);
// BufferArray = BufferArray.concat([profile, profileIndex, profileNull, itemDataShift]);
// BufferLength = BufferLength + profile.length + profileIndex.length + profileNull.length + itemDataShift.length;
for (var x = 0; x < itemCount; x++) {
  var profile = Buffer.from([0]);
  var profileIndex = Buffer.from([0]);
  var profileNull = new Uint16Array(1);
  profileNull[0] = null;
  profileNull = Buffer.from(profileNull.buffer);
  var itemDataShift = new Uint16Array(2);
  itemDataShift[0] = (itemCount + 1)*8 + 4*x + x;
  itemDataShift = Buffer.from(itemDataShift.buffer);
  BufferArray = BufferArray.concat([profile, profileIndex, profileNull, itemDataShift]);
  BufferLength = BufferLength + profile.length + profileIndex.length + profileNull.length + itemDataShift.length;
}
// marco

var keyChange = [
  {
    'index': 0x004,
    'data': 0x011,
  },
  {
    'index': 0x028,
    'data': 0x02C,
  },
  {
    'index': 0x02C,
    'data': 0x024,
  }
];

for (var y = 0; y < itemCount; y++) {
  var key = Buffer.from([0x20]);
  var index = new Uint16Array(1);
  index[0] = keyChange[y]['index'];
  index = Buffer.from(index.buffer);
  var data = Buffer.from([keyChange[y]['data']]);
  var len = Buffer.from([key.length + index.length + data.length]);
  var arr = [len, key, index, data];
  BufferArray = BufferArray.concat([len, key, index, data]);

  BufferLength = BufferLength + key.length + index.length + data.length + len.length;
}

// var key = Buffer.from([0x20]);
// var index = new Uint16Array(1);
// index[0] = 0x004;
// index = Buffer.from(index.buffer);
// var data = Buffer.from([0x011]);
// var len = Buffer.from([key.length + index.length + data.length]);
// var arr = [len, key, index, data];
// BufferArray = BufferArray.concat([len, key, index, data]);

// BufferLength = BufferLength + key.length + index.length + data.length + len.length;


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

fs.writeFile("./KEYMAP.CYS", buff, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});