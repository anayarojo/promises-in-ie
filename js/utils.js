'use strict';

String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
};

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

String.prototype.toCamelCase = function () {
    return this.replaceAll('_', ' ').replace(/\W+(.)/g, function (match, chr) {
        return chr.toUpperCase();
    });
};

String.prototype.toSnikeCase = function () {
    return this.toCamelCase().split(/(?=[A-Z])/).join('_').toLowerCase();
};

Array.prototype.removeIf = function (callback) {
    var i = this.length;
    while (i--) {
        if (callback(this[i], i)) {
            this.splice(i, 1);
        }
    }
};

var Dynamic = function () {
    var obj = {};
    var src = getScriptUrl();

    obj.get = function (url) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                var DONE = 4;
                var OK = 200;
                if (this.readyState === DONE) {
                    if (this.status === OK) {
                        resolve(JSON.parse(this.responseText));
                    } else {
                        reject(new Error('Something went wrong.'));
                    }
                }
            };
            xhr.open('GET', url);
            xhr.send();
        });
    };

    obj.getBaseUrl = function () {
        if (src == '') return src;
        var pathArray = src.split('/');
        var protocol = pathArray[0];
        var host = pathArray[2];
        var url = protocol + '//' + host;
        return url;
    };

    obj.getFunction = function (strScope, strPrefix, strFunction) {
        return new Promise(function (resolve, reject) {
            var objScope = window[strScope];
            var strParent = strScope.toSnikeCase();
            if (typeof objScope !== 'undefined') {
                var strName = ('' + strPrefix + strFunction).toCamelCase();
                if (typeof objScope[strName] === 'undefined') {
                    //let strUrl = `${window.location.origin}/js/${strParent}/${strFunction}.js`;
                    var strBaseUrl = obj.getBaseUrl();
                    var strUrl = strBaseUrl + '/js/' + strParent + '/' + strFunction + '.js';
                    obj.loadScript(strUrl, function () {
                        console.info('Load \u2500 ' + strUrl);
                        resolve(objScope[strName]);
                    });
                } else {
                    resolve(objScope[strName]);
                }
            } else {
                reject('Scope ' + strScope + ' not found');
            }
        });
    };

    obj.loadScript = function (url, callback) {
        var script = document.createElement('script');
        if (script.readyState) {
            // Internet Explorer
            script.onreadystatechange = function () {
                if (script.readyState === 'loaded' || script.readyState === 'complete') {
                    script.onreadystatechange = null;
                    if (callback) callback();
                }
            };
        } else {
            // Others
            script.onload = function () {
                if (callback) callback();
            };
        }
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    };

    function getScriptUrl() {
        var scripts = document.getElementsByTagName('script');
        var index = scripts.length - 1;
        var myScript = scripts[index];
        return myScript.src;
    };

    function init() {
        if (typeof Promise !== "function") {
            var strBaseUrl = obj.getBaseUrl();
            var url = strBaseUrl + '/js/bluebird.min.js';
            // var url = strBaseUrl + '/js/es6-promise.min.js';
            //var url = 'https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.4/bluebird.min.js';
            obj.loadScript(url);
        }
    };

    init();

    return obj;
}();

var Guid = function () {
    var obj = {};

    obj.get = function () {
        return "ss-s-s-s-sss".replace(/s/g, s4);
    };

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    return obj;
}();