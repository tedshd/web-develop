/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2015-11-29 00:06:11
 * @version $Id$
 */

var pageData = {
    // news: 'https://api.import.io/store/connector/bb2f0d16-14f6-4a1d-9ffd-76984c2f275b/_query?input=webpage/url:http%3A%2F%2Fwww.hccg.gov.tw%2Fweb%2FNews%3FFP%3DD40000001852000008_0&&_apikey=f014508a178344289fe61673fdd283646ad5a4617842e18bdf46ecdbd9c2ae04b63032114bd15aab47c0c6cc96ca73c62cd0bec75a7f5d374d1bfb6d93ee34b9219c98f6578417995ddcce28b52ef34b',
    news: 'news.json',
};
function apiInterface (url, ui, fail) {
    $.ajax({
        url: url,
        type: 'GET',
        data: {
        },
        success: function(data) {
            ui(data);
        },
        error: function(data) {
            fail(data);
        }
    });
}

apiInterface(pageData.news, ui, fail);
function ui (data) {
    console.log(data);
    var data = data.results;
    console.log(data);
    for (var i = 0; i < data.length; i++) {
        var items = {
            data: data[i].dlarktext_number,
            link: data[i].dlarktext_link,
            title: data[i]['dlarktext_link/_title'],
            department: data[i].dlarktext_value_1,
            cat: data[i].dlarktext_value_2
        };
        console.log(items);
    };
}
function fail (data) {
    // body...
}