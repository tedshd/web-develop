/**
 *
 * @authors Ted Shiu (ted@sitetag.us)
 * @date    2016-05-25 11:27:02
 */

var my_slack_bot_token = 'xoxb-44948081186-Un5oEQrV3oBcFHWxfSD53AKf';
var Botkit = require('botkit');
var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: my_slack_bot_token
});
bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

// controller.hears(["keyword","^pattern$"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
//   // do something to respond to message
//   // all of the fields available in a normal Slack message object are available
//   // https://api.slack.com/events/message
//   bot.reply(message,'You used a keyword!');
// });

function exec_cmd(cmd, callBack ) {
    var childProcess = require('child_process');

    var ls = childProcess.exec(cmd, function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: '+error.code);
        }
        console.log('Child Process STDOUT: '+stdout);
        callBack(stdout);
    });
}

controller.hears('(.*)cdn',["direct_message","direct_mention","mention","ambient"],function(bot,message) {
    var msg = 'bbbbbbbbbbbbbb...';
    msg = 'Under processing...';
    exec_cmd( "php cdn.php", function(text) {
        return bot.reply(message, 'Finish it');
    });
    return bot.reply(message, msg);
});

controller.hears('file:(.*)',["direct_message","direct_mention","mention","ambient"],function(bot,message) {
    var msg = 'bbbbbbbbbbbbbb...';
    msg = 'Under processing...';
    var url = 'http://ad.sitemaji.com';
    if (message.match[1] === '') {
        return bot.reply(message, 'Please tell me file you want to clear from akamai');
    }
    exec_cmd('php cdn_url.php ' + url + message.match[1], function(text) {
        return bot.reply(message, 'Finish it');
    });
    return bot.reply(message, msg);
});

controller.hears('open the (.*) doors',["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var doorType = message.match[1]; //match[1] is the (.*) group. match[0] is the entire group (open the (.*) doors).
  if (doorType === 'pod bay') {
    return bot.reply(message, 'I\'m sorry, Dave. I\'m afraid I can\'t do that.');
  }
  return bot.reply(message, 'Okay');
});

controller.hears(["go to hell","^pattern$"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  // do something to respond to message
  // all of the fields available in a normal Slack message object are available
  // https://api.slack.com/events/message
  bot.reply(message,'Shut up!');
});