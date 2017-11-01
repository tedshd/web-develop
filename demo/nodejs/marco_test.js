const fs = require('fs');
/**
 *
 * @authors Your Name (you@example.org)
 * @date    2017-10-09 19:00:33
 * @version $Id$
 */

let BufferArray = [];
let BufferLength = 0;
const profileCount = 3;
let profiles = [];
const marco = 0;
const itemCount = 2;

const title = Buffer.from('CYFI', 'ascii');
var rev = new Uint16Array(1);
rev[0] = 0;
rev = Buffer.from(rev.buffer);
var itemSize = new Uint16Array(1);
itemSize[0] = itemCount;
itemSize = Buffer.from(itemSize.buffer);
BufferArray = [title, rev, itemSize];
BufferLength = title.length + rev.length + itemSize.length;

var profile = Buffer.from([0]);
var profileIndex = Buffer.from([1]);
var profileNull = new Uint16Array(1);
    profileNull[0] = null;
    profileNull = Buffer.from(profileNull.buffer);
var itemDataShift = new Uint16Array(2);
itemDataShift[0] = (1 * 8 + 8 + 8);
itemDataShift = Buffer.from(itemDataShift.buffer);
BufferArray = BufferArray.concat([profile, profileIndex, profileNull, itemDataShift]);
BufferLength = BufferLength + profile.length + profileIndex.length + profileNull.length + itemDataShift.length;

var mar = Buffer.from([1]);
var marIndex = Buffer.from([1]);
var marNull = new Uint16Array(1);
    marNull[0] = null;
    marNull = Buffer.from(marNull.buffer);
var itemDataShift = new Uint16Array(2);
itemDataShift[0] = (1 * 8 + 8 + 8 + 8);
itemDataShift = Buffer.from(itemDataShift.buffer);
BufferArray = BufferArray.concat([mar, marIndex, marNull, itemDataShift]);
BufferLength = BufferLength + mar.length + marIndex.length + marNull.length + itemDataShift.length;


function marcoData(key, action, time) {
    var type,
        keyPage,
        keyByte,
        keyEvent,
        delayTime;

    if (key === undefined || action === undefined || time === undefined) {
        console.error('marcoData not set argument');
        return;
    }
    keyPage = '00';
    type = keyPage + '111' + action;
    type = type.split('').reverse().join('');
    action = keyPage + parseInt(type, 10);
    time = time*2;

    keyByte = Buffer.from([key]);
    // keyPage = Buffer.from([0x00]);
    keyEvent = Buffer.from([parseInt(action, 2)]);
    delayTime = new Uint16Array(1);
    delayTime[0] = time;
    delayTime = Buffer.from(delayTime.buffer);

    BufferArray = BufferArray.concat([keyByte, keyEvent, delayTime]);
    BufferLength = BufferLength + keyByte.length + keyEvent.length + delayTime.length;
}




// var keyPage, keyEvent, delayTime;

// keyPage = Buffer.from([224]);
// keyEvent = Buffer.from([parseInt(111100, 2)]);
// delayTime = new Uint16Array(1);
// delayTime[0] = 20;
// delayTime = Buffer.from(delayTime.buffer);

// BufferArray = BufferArray.concat([keyPage, keyEvent, delayTime]);
// BufferLength = BufferLength + keyPage.length + keyEvent.length + delayTime.length;

// var e, f, g, h;

// e = Buffer.from([224]);
// f = Buffer.from([parseInt(111010, 2)]);
// g = Buffer.from([0]);
// h = Buffer.from([0]);

// BufferArray = BufferArray.concat([e, f, g, h]);
// BufferLength = BufferLength + e.length + f.length + g.length + h.length;

function marcoKey(marcoIndex, keycode, type) {
    type = parseInt('111' + type, 10);
    var key = Buffer.from([0x18]);
    var index = new Uint16Array(1);
    index[0] = parseInt(marcoIndex, 10);
    index = Buffer.from(index.buffer);
    var macroTunes = new Uint16Array(1);
    macroTunes[0] = 1;
    macroTunes = Buffer.from(macroTunes.buffer);
    var data = Buffer.from([keycode, parseInt(type, 2)]);
    var len = Buffer.from([2]);
    BufferArray = BufferArray.concat([len, key, index, data, macroTunes]);

    BufferLength = BufferLength + key.length + index.length + macroTunes.length + data.length + len.length;
}

marcoKey(0, 41, '100');
marcoData(227, '100', 10);
marcoData(6, '100', 10);
marcoData(6, '010', 0);
marcoData(227, '010', 0);

marcoData(0, '111', 0);

// var key = Buffer.from([0x18]);
// var index = new Uint16Array(1);
// index[0] = parseInt(1, 10);
// index = Buffer.from(index.buffer);
// var data = Buffer.from([41, parseInt(111001, 2), 1]);
// // var data = new Uint16Array(2);
// // data[0] = parseInt(41, 10);
// // data = Buffer.from(data.buffer);
// var len = Buffer.from([2]);
// var arr = [len, key, index, data];
// BufferArray = BufferArray.concat([len, key, index, data]);

// BufferLength = BufferLength + key.length + index.length + data.length + len.length;



const buff = Buffer.concat(BufferArray, BufferLength);

console.log(buff.toString('hex'));


fs.writeFile('./marco.TEX', buff, function(err) {
    if (err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
