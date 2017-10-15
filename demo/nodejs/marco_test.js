/**
 *
 * @authors Your Name (you@example.org)
 * @date    2017-10-09 19:00:33
 * @version $Id$
 */

var a, b, c, d;

var BufferArray = [],
    BufferLength;

a = Buffer.from([224]);
b = Buffer.from([parseInt(111100, 2)]);
c = Buffer.from([19]);
d = Buffer.from([0]);

// var b = new Uint16Array(2);
// b[0] = 41+1+1+1+0+0;
// b[1] = 1;
// b[2] = 1;
// b[3] = 1;
// b[4] = 1;
// b[5] = 1;
// b[6] = 0;
// b[7] = 0;
// b = Buffer.from(b.buffer);


BufferArray = BufferArray.concat([a, b, c, d]);

BufferLength = a.length + b.length + c.length + d.length;


const buff = Buffer.concat(BufferArray, BufferLength);

console.log(buff.toString('hex'));