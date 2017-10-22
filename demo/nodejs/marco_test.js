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
const itemCount = profileCount;

const title = Buffer.from('CYFI', 'ascii');
var rev = new Uint16Array(1);
rev[0] = 0;
rev = Buffer.from(rev.buffer);
var itemSize = new Uint16Array(1);
itemSize[0] = itemCount;
itemSize = Buffer.from(itemSize.buffer);
// BufferArray = [title, rev, itemSize];
// BufferLength = title.length + rev.length + itemSize.length;


function marcoData(key, action, time) {
    var keyPage,
        keyEvent,
        delayTime;

    if (!key || !action || !time) {
        console.error('marcoData not set argument');
        return;
    }
    action = parseInt('111' + action, 10);
    time = time*2;

    keyPage = Buffer.from([key]);
    keyEvent = Buffer.from([parseInt(action, 2)]);
    delayTime = new Uint16Array(1);
    delayTime[0] = time;
    delayTime = Buffer.from(delayTime.buffer);

    BufferArray = BufferArray.concat([keyPage, keyEvent, delayTime]);
    BufferLength = BufferLength + keyPage.length + keyEvent.length + delayTime.length;
}


// marcoData(224, '100', 10);

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
    var data = Buffer.from([keycode, parseInt(type, 2), 1]);
    var len = Buffer.from([2]);
    var arr = [len, key, index, data];
    BufferArray = BufferArray.concat([len, key, index, data]);

    BufferLength = BufferLength + key.length + index.length + data.length + len.length;
}

marcoKey(0, 41, '001');

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