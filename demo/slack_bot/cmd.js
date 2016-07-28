/**
 *
 * @authors Ted Shiu (ted@sitetag.us)
 * @date    2016-05-25 14:08:38
 */

function run_cmd(cmd, args, callBack) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var resp = "";

    child.stdout.on('data', function (buffer) {resp += buffer.toString();});
    child.stdout.on('end', function() {callBack (resp); });
} // ()



// You can use:

// run_cmd( "ls", ["-l"], function(text) {
//     console.log (text) ;
// });

run_cmd( "php cdn.php", [], function(text) {
    console.log (text) ;
});
function exec_cmd(cmd, callBack ) {
    var childProcess = require('child_process');

    var ls = childProcess.exec(cmd, function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: '+error.code);
        }
        console.log('Child Process  : '+ stdout);
        callBack(stdout);
    });
}

// exec_cmd( "mkdir ok", function(text) {
//     console.log (text);
//     console.log ('fin');
// });

exec_cmd( "ls -l", function(text) {
    console.log (text);
    console.log ('fin');
});
