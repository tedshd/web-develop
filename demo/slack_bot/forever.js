/**
 *
 * @authors Ted Shiu (ted@sitetag.us)
 * @date    2016-05-27 11:37:13
 */

var forever = require('forever');

var child = new (forever.Forever)('bb8.js', {
    max: 3,
    silent: true,
    args: []
});

child.on('exit', this.callback);
child.start();