try {
    document.domain = "qq.com";
} catch (e) {}
if (typeof JSON !== 'object') {
    JSON = {};
}

(function() {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function() {

            return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' +
            f(this.getUTCMonth() + 1) + '-' +
            f(this.getUTCDate()) + 'T' +
            f(this.getUTCHours()) + ':' +
            f(this.getUTCMinutes()) + ':' +
            f(this.getUTCSeconds()) + 'Z' : null;
        };

        String.prototype.toJSON =
            Number.prototype.toJSON =
                Boolean.prototype.toJSON = function() {
                    return this.valueOf();
                };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = { // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
            var c = meta[a];
            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

        // Produce a string from holder[key].

        var i, // The loop counter.
            k, // The member key.
            v, // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

        // If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        // What happens next depends on the value's type.

        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

                // JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce 'null'. The case is included here in
                // the remote chance that this gets fixed someday.

                return String(value);

            // If the type is 'object', we might be dealing with an object or an array or
            // null.

            case 'object':

                // Due to a specification blunder in ECMAScript, typeof null is 'object',
                // so watch out for that case.

                if (!value) {
                    return 'null';
                }

                // Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

                // Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.

                    v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                // If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

                    // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

    // If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function(value, replacer, space) {

            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

            // If the space parameter is a number, make an indent string containing that
            // many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

                // If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            // Make a fake root object containing our value under the key of ''.
            // Return the result of stringifying the value.

            return str('', {
                '': value
            });
        };
    }


    // If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function(text, reviver) {

            // The parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

                // The walk method is used to recursively walk the resulting structure so
                // that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


            // Parsing happens in four stages. In the first stage, we replace certain
            // Unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function(a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            // In the second stage, we run the text against regular expressions that look
            // for non-JSON patterns. We are especially concerned with '()' and 'new'
            // because they can cause invocation, and '=' because it can cause mutation.
            // But just to be safe, we want to reject all unexpected forms.

            // We split the second stage into 4 regexp operations in order to work around
            // crippling inefficiencies in IE's and Safari's regexp engines. First we
            // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
            // replace all simple value tokens with ']' characters. Third, we delete all
            // open brackets that follow a colon or comma or that begin the text. Finally,
            // we look to see that the remaining characters are only whitespace or ']' or
            // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ? walk({
                    '': j
                }, '') : j;
            }

            // If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());


if (typeof AppPlatform == "undefined") {
    var AppPlatform = new Object();
}

AppPlatform.Browser = new Object();
AppPlatform.Browser.ua = window.navigator.userAgent.toLowerCase();
AppPlatform.Browser.ie = /msie/.test(AppPlatform.Browser.ua);
AppPlatform.Browser.moz = /gecko/.test(AppPlatform.Browser.ua);

AppPlatform.$ = function(s) {
    return (typeof s == "object") ? s : document.getElementById(s);
};

AppPlatform.Cookie = {
    getCookie: function(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return window.unescape(arr[2]);
        }
        return null;
    }
};

AppPlatform.Element = {
    getElementLeft: function(e) {
        return (e == null) ? 0 :
            (AppPlatform.$(e).offsetLeft + AppPlatform.Element.getElementLeft(AppPlatform.$(e).offsetParent));
    },

    getElementTop: function(e) {
        return (e == null) ? 0 :
            (AppPlatform.$(e).offsetTop + AppPlatform.Element.getElementTop(AppPlatform.$(e).offsetParent));
    },

    scrollIntoView: function(e) {
        var x = AppPlatform.Element.getElementLeft(e);
        var y = AppPlatform.Element.getElementTop(e);
        window.scrollTo(x, y);
    },

    remove: function() {
        for (var i = 0; i < arguments.length; i++) {
            try {
                AppPlatform.$(arguments[i]).parentNode.removeChild(AppPlatform.$(arguments[i]));
            } catch (e) {}
        }
    }
};

AppPlatform.JsLoader = {
    PrjId: 0,
    load: function(sId, sUrl, fCallback) {
        AppPlatform.Element.remove(sId);

        var _script = document.createElement("script");
        _script.setAttribute("id", sId);
        _script.setAttribute("type", "text/javascript");
        _script.setAttribute("src", sUrl);

        if (AppPlatform.Browser.ie) {
            _script.onreadystatechange = function() {
                if (this.readyState == "loaded" || this.readyState == "complete") {
                    AppPlatform.Element.remove(_script);
                    fCallback();
                }
            };
        } else if (AppPlatform.Browser.moz) {
            _script.onload = function() {
                AppPlatform.Element.remove(_script);
                fCallback();
            };
        } else {
            AppPlatform.Element.remove(_script);
            fCallback();
        }

        document.getElementsByTagName("head")[0].appendChild(_script);
    }
};

if (typeof AppPlatform.Survey == "undefined") {
    AppPlatform.Survey = new Object();
}

if (typeof AppPlatform.Survey.Digg == "undefined") {
    AppPlatform.Survey.Digg = {
        ProjectList: {},

        loadDiggResult: function(projId) {
            var OptIdList = "";
            for (i = 0; i < AppPlatform.Survey.Digg.ProjectList[projId].OptIdArray.length; i++) {
                if (0 != i) {
                    OptIdList += "|";
                }

                OptIdList += AppPlatform.Survey.Digg.ProjectList[projId].OptIdArray[i];
            }

            var LoadUrl = "https://panshi.qq.com/vote/" + AppPlatform.Survey.Digg.ProjectList[projId].ProjectId + "/result?source=1&callback=AppPlatform.Survey.Digg.showDiggResult&_=" + Math.random();

            AppPlatform.JsLoader.load(projId, LoadUrl, function() {});
        },

        init: function(surveyObj) {
            AppPlatform.Survey.Digg.ProjectList[surveyObj.PrjId] = {};
            AppPlatform.Survey.Digg.ProjectList[surveyObj.PrjId].ProjectId = surveyObj.PrjId;
            AppPlatform.Survey.Digg.ProjectList[surveyObj.PrjId].SubjectId = surveyObj.SubjId;
            AppPlatform.Survey.Digg.ProjectList[surveyObj.PrjId].DiggMode = surveyObj.DiggMode;
            AppPlatform.Survey.Digg.ProjectList[surveyObj.PrjId].IsShowResult = surveyObj.ShowResult;
            AppPlatform.Survey.Digg.ProjectList[surveyObj.PrjId].OptIdObject = surveyObj.OptIdObject;
            AppPlatform.Survey.Digg.ProjectList[surveyObj.PrjId].OptIdArray = new Array();
            AppPlatform.Survey.Digg.ProjectList[surveyObj.PrjId].OptListCount = new Array();
            for (var o in surveyObj.OptIdObject) {
                AppPlatform.Survey.Digg.ProjectList[surveyObj.PrjId].OptIdArray.push(o);
            }

            if (AppPlatform.Survey.Digg.ProjectList[surveyObj.PrjId].IsShowResult) {
                AppPlatform.Survey.Digg.loadDiggResult(surveyObj.PrjId);
            }
        },

        showDiggResult: function(data) {
            if (0 != data.errCode) {
                return false;
            }

            var result = data.data;
            var projId = result.voteid;

            if (typeof result[AppPlatform.Survey.Digg.ProjectList[projId].SubjectId] != 'object') {
                return;
            }

            var options = result[AppPlatform.Survey.Digg.ProjectList[projId].SubjectId];

            for (var i in options) {
                if (/^\d+$/.test(i)) {
                    var OptId = i;

                    AppPlatform.Survey.Digg.ProjectList[projId].OptListCount[OptId] = {
                        "count": options[i].selected,
                        "percent": options[i].percent
                    };
                }
            }

            for (i = 0; i < AppPlatform.Survey.Digg.ProjectList[projId].OptIdArray.length; i++) {
                var IndexId = AppPlatform.Survey.Digg.ProjectList[projId].OptIdObject[AppPlatform.Survey.Digg.ProjectList[projId].OptIdArray[i]];
                var OptId = AppPlatform.Survey.Digg.ProjectList[projId].OptIdArray[i];
                try {

                    AppPlatform.$('apps_svy_opt_count_' + projId + '_' + IndexId).innerHTML =
                        AppPlatform.Survey.Digg.ProjectList[projId].OptListCount[OptId].count;
                    AppPlatform.$('apps_svy_opt_title_' + projId + '_' + IndexId).innerHTML =
                        '<a href="javascript:AppPlatform.Survey.Digg.digg(this, ' +
                        projId + ', ' +
                        AppPlatform.Survey.Digg.ProjectList[projId].SubjectId +
                        ', ' + OptId + ');" target=\"_self\">' +
                        AppPlatform.$('apps_svy_opt_title_' + projId + '_' + IndexId).innerHTML + '</a>';
                } catch (e) {}
            }
        },

        ReceiveDiggResult: function(data) {

            if (data.code == 20 || data.code == 8) {
                alert("\u8bf7\u5148\u767b\u5f55");
            } else if (data.code == 21) {
                alert("\u60a8\u5df2\u53c2\u4e0e");
            } else if(data.code == 0){
                $(".count.voted").html(parseInt($(".count.voted").html())+1).removeClass("voted");
            } else {
                alert(data.msg);
            }
            $(".count.voted").removeClass("voted");
            return;
        },

        digg: function(obj, projId, subjId, optId) {
            var IndexId = AppPlatform.Survey.Digg.ProjectList[projId].OptIdObject[optId];
            /*
             AppPlatform.Survey.Digg.ProjectList[projId].OptListCount[optId].count++;
             AppPlatform.$('apps_svy_opt_count_' + projId + '_' + IndexId).innerHTML =
             AppPlatform.Survey.Digg.ProjectList[projId].OptListCount[optId].count;
             */
            $('#apps_svy_opt_count_' + projId + '_' + IndexId).addClass("voted");
            //AppPlatform.$('apps_svy_opt_title_' + projId + '_' + IndexId).innerHTML =AppPlatform.$('apps_svy_opt_title_' + projId + '_' + IndexId).getAttribute("doneText");

            if (AppPlatform.Survey.Digg.ProjectList[projId].DiggMode == 0) {
                for (i = 0; i < AppPlatform.Survey.Digg.ProjectList[projId].OptIdArray.length; i++) {
                    var IndexId = AppPlatform.Survey.Digg.ProjectList[projId].OptIdObject[AppPlatform.Survey.Digg.ProjectList[projId].OptIdArray[i]];
                    var OptId = AppPlatform.Survey.Digg.ProjectList[projId].OptIdArray[i];
                    try {
                        //AppPlatform.$('apps_svy_opt_title_' + projId + '_' + IndexId).innerHTML =AppPlatform.$('apps_svy_opt_title_' + projId + '_' + IndexId).getAttribute("doneText");
                    } catch (e) {}
                }
            }

            answer = {};
            answer[subjId] = {};
            answer[subjId]['selected'] = [];
            answer[subjId]['selected'].push(optId);

            data = {
                'answer': JSON.stringify(answer),
                'login': 1,
                'source': 1,
                'g_tk': generateToken(getKey()),
                'format': 'script',
                'callback': 'parent.AppPlatform.Survey.Digg.ReceiveDiggResult'
            }

            AppPlatform.Survey.Digg.submit("//panshi.qq.com/v2/vote/" + projId + "/submit", data);
        },

        submit: function(url, data) {
            //create frame

            var _target = 'post_iframe';
            if (!$('#post_iframe').length) {
                $("body").append('<iframe id="post_iframe" name="post_iframe" style="display:none"><script type="text/javascript">document.domain = "qq.com";</script></iframe>');
            }
            var _$form = $('#_messageform').length ?
                $('#_messageform').attr('action', url).empty() :
                $('<form action="' + url + '" method="post" target="' + _target + '" id="_messageform" style="display:none;"></form>').appendTo($("body"));

            for (name in data) {
                _$form.append($('<input name="' + name + '" type="hidden" value="" />').val(data[name]));
            }
            _$form.submit();

        }
    };
}

function generateToken(key) {
    var hash = 2013;
    if (key) {
        for (var i = 0, len = key.length; i < len; i++) {
            hash += (hash << 5) + key.charCodeAt(i);
        }
    }
    return hash & 0x7fffffff;
}

function getKey() {
    return AppPlatform.Cookie.getCookie('skey') || AppPlatform.Cookie.getCookie('lskey');
}/*  |xGv00|7255f63bb2f629bc3224d3211376c3fb */