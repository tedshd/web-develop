alert = function (str) {
    console.log(str);
};

webapis = {
    tv : {
        info : {
            getModel : function () {
                return "PC_Browser";
            },
            getDeviceID : function () {
                if(localStorage.getItem('hwDid')) {
                    return localStorage.getItem('hwDid');
                }
                var hwDid = Math.floor(Math.random()*89999999+10000000);
                localStorage.setItem('hwDid', hwDid);
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
            var val = localStorage.getItem(name);
            // return (val == null) ? "{}" : val;
            return val;
        },
        writeAll : function (value) {
            localStorage.setItem(name, value);
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
            localStorage.setItem(name, null);
            return true;
        },

        openCommonFile : function (name, rw) {
            var val = localStorage.getItem(name);
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


