javascript-htmlspecialchars
===========================

## Description

handle view special chars in HTML

if string ```&#lt;```
show in HTML ```<```

use javascript-htmlspecialchars

string ```&#lt;```
output in HTML ```&#lt;```

## Usage

in javascript
```JavaScript
var str = '&lt;';
str = util.htmlspecialchars(str);

document.getElementById('area_1').innerHTML= 'innerHTML-' + str;

// jQuery
$('#area_2').html('html-' + str);
$('#area_3').append('append-' + '<span>' + str + '</span>');
```
