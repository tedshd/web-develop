function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}

alert = function (str) {
    console.log(str);
    return;
    var div = document.createElement('div');
    div.innerHTML = str;
    document.querySelector('#log').appendChild(div);
};

webapis = {
    tv : {
        info : {
            getModel : function () {
                return "PC_Browser";
            },
            getDeviceID : function () {
                if(getCookie('hwDid')) {
                    return getCookie('hwDid');
                }
                var hwDid = Math.floor(Math.random()*89999999+10000000);
                setCookie('hwDid', hwDid, 3);
                return hwDid;
            },
        }
    }
};

curWidget = {
    id : "samsung",

    setPreference : function () {
        return true;
    }
};

FileObj = function (name) {
    var obj = {
        readAll : function () {
            var val = getCookie(name);
            // return (val == null) ? "{}" : val;
            return val;
        },
        writeAll : function (value) {
            setCookie(name, value, 3);
            return true;
        },
        getName : function () {
            return name;
        },
    };
    return obj;
};

FileSystem = function () {
    var obj = {
        deleteCommonFile : function (name) {
            setCookie(name, null, 3);
            return true;
        },

        openCommonFile : function (name, rw) {
            var val = getCookie(name);
            if (val || rw == 'w') {
                var file = new FileObj(name);
            } else {
                var file = null;
            }
            return file;
        },

        closeCommonFile : function () {
            return true;
        },

        isValidCommonPath : function () {
            return true;
        },

        createCommonDir : function () {
            return true;
        },

        dummy : ""
    };

    return obj;
};


