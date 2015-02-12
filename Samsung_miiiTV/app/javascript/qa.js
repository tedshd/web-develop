/*global $, jQuery, alert, console, angular*/
/**
 *
 * @authors Your Name (you@example.org)
 * @date    2014-04-08 19:04:07
 * @version $Id$
 */

// for QA

var QAreg = 1,
    QAgetAllProfile = 1,
    QAloadAllChannels = 1,
    QAunBindUser = 1;
var QAErrorTest = true;
var regCount = 0;

function QAtest(data, state) {
    if (state === 'QAreg' && QAreg === 1) {
        data.status = 'fail';
        console.error('== QA test api fail ==');
        console.error(state);
        regCount++;
        if (regCount === 10) {
            QAreg = 0;
        }
    }
}