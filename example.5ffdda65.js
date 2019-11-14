// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"rDCW":[function(require,module,exports) {

},{}],"R7gn":[function(require,module,exports) {
var define;
var global = arguments[3];
/*
Syntax highlighting with language autodetection.
https://highlightjs.org/
*/

(function(factory) {

  // Find the global object for export to both the browser and web workers.
  var globalObject = typeof window === 'object' && window ||
                     typeof self === 'object' && self;

  // Setup highlight.js for different environments. First is Node.js or
  // CommonJS.
  // `nodeType` is checked to ensure that `exports` is not a HTML element.
  if(typeof exports !== 'undefined' && !exports.nodeType) {
    factory(exports);
  } else if(globalObject) {
    // Export hljs globally even when using AMD for cases when this script
    // is loaded with others that may still expect a global hljs.
    globalObject.hljs = factory({});

    // Finally register the global hljs with AMD.
    if(typeof define === 'function' && define.amd) {
      define([], function() {
        return globalObject.hljs;
      });
    }
  }

}(function(hljs) {
  // Convenience variables for build-in objects
  var ArrayProto = [],
      objectKeys = Object.keys;

  // Global internal variables used within the highlight.js library.
  var languages = {},
      aliases   = {};

  // Regular expressions used throughout the highlight.js library.
  var noHighlightRe    = /^(no-?highlight|plain|text)$/i,
      languagePrefixRe = /\blang(?:uage)?-([\w-]+)\b/i,
      fixMarkupRe      = /((^(<[^>]+>|\t|)+|(?:\n)))/gm;

  // The object will be assigned by the build tool. It used to synchronize API
  // of external language files with minified version of the highlight.js library.
  var API_REPLACES;

  var spanEndTag = '</span>';

  // Global options used when within external APIs. This is modified when
  // calling the `hljs.configure` function.
  var options = {
    classPrefix: 'hljs-',
    tabReplace: null,
    useBR: false,
    languages: undefined
  };

  // keywords that should have no default relevance value
  var COMMON_KEYWORDS = 'of and for in not or if then'.split(' ')


  /* Utility functions */

  function escape(value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function tag(node) {
    return node.nodeName.toLowerCase();
  }

  function testRe(re, lexeme) {
    var match = re && re.exec(lexeme);
    return match && match.index === 0;
  }

  function isNotHighlighted(language) {
    return noHighlightRe.test(language);
  }

  function blockLanguage(block) {
    var i, match, length, _class;
    var classes = block.className + ' ';

    classes += block.parentNode ? block.parentNode.className : '';

    // language-* takes precedence over non-prefixed class names.
    match = languagePrefixRe.exec(classes);
    if (match) {
      return getLanguage(match[1]) ? match[1] : 'no-highlight';
    }

    classes = classes.split(/\s+/);

    for (i = 0, length = classes.length; i < length; i++) {
      _class = classes[i];

      if (isNotHighlighted(_class) || getLanguage(_class)) {
        return _class;
      }
    }
  }

  function inherit(parent) {  // inherit(parent, override_obj, override_obj, ...)
    var key;
    var result = {};
    var objects = Array.prototype.slice.call(arguments, 1);

    for (key in parent)
      result[key] = parent[key];
    objects.forEach(function(obj) {
      for (key in obj)
        result[key] = obj[key];
    });
    return result;
  }

  /* Stream merging */

  function nodeStream(node) {
    var result = [];
    (function _nodeStream(node, offset) {
      for (var child = node.firstChild; child; child = child.nextSibling) {
        if (child.nodeType === 3)
          offset += child.nodeValue.length;
        else if (child.nodeType === 1) {
          result.push({
            event: 'start',
            offset: offset,
            node: child
          });
          offset = _nodeStream(child, offset);
          // Prevent void elements from having an end tag that would actually
          // double them in the output. There are more void elements in HTML
          // but we list only those realistically expected in code display.
          if (!tag(child).match(/br|hr|img|input/)) {
            result.push({
              event: 'stop',
              offset: offset,
              node: child
            });
          }
        }
      }
      return offset;
    })(node, 0);
    return result;
  }

  function mergeStreams(original, highlighted, value) {
    var processed = 0;
    var result = '';
    var nodeStack = [];

    function selectStream() {
      if (!original.length || !highlighted.length) {
        return original.length ? original : highlighted;
      }
      if (original[0].offset !== highlighted[0].offset) {
        return (original[0].offset < highlighted[0].offset) ? original : highlighted;
      }

      /*
      To avoid starting the stream just before it should stop the order is
      ensured that original always starts first and closes last:

      if (event1 == 'start' && event2 == 'start')
        return original;
      if (event1 == 'start' && event2 == 'stop')
        return highlighted;
      if (event1 == 'stop' && event2 == 'start')
        return original;
      if (event1 == 'stop' && event2 == 'stop')
        return highlighted;

      ... which is collapsed to:
      */
      return highlighted[0].event === 'start' ? original : highlighted;
    }

    function open(node) {
      function attr_str(a) {return ' ' + a.nodeName + '="' + escape(a.value).replace('"', '&quot;') + '"';}
      result += '<' + tag(node) + ArrayProto.map.call(node.attributes, attr_str).join('') + '>';
    }

    function close(node) {
      result += '</' + tag(node) + '>';
    }

    function render(event) {
      (event.event === 'start' ? open : close)(event.node);
    }

    while (original.length || highlighted.length) {
      var stream = selectStream();
      result += escape(value.substring(processed, stream[0].offset));
      processed = stream[0].offset;
      if (stream === original) {
        /*
        On any opening or closing tag of the original markup we first close
        the entire highlighted node stack, then render the original tag along
        with all the following original tags at the same offset and then
        reopen all the tags on the highlighted stack.
        */
        nodeStack.reverse().forEach(close);
        do {
          render(stream.splice(0, 1)[0]);
          stream = selectStream();
        } while (stream === original && stream.length && stream[0].offset === processed);
        nodeStack.reverse().forEach(open);
      } else {
        if (stream[0].event === 'start') {
          nodeStack.push(stream[0].node);
        } else {
          nodeStack.pop();
        }
        render(stream.splice(0, 1)[0]);
      }
    }
    return result + escape(value.substr(processed));
  }

  /* Initialization */

  function dependencyOnParent(mode) {
    if (!mode) return false;

    return mode.endsWithParent || dependencyOnParent(mode.starts)
  }

  function expand_or_clone_mode(mode) {
    if (mode.variants && !mode.cached_variants) {
      mode.cached_variants = mode.variants.map(function(variant) {
        return inherit(mode, {variants: null}, variant);
      });
    }

    // EXPAND
    // if we have variants then essentually "replace" the mode with the variants
    // this happens in compileMode, where this function is called from
    if (mode.cached_variants)
      return mode.cached_variants;

    // CLONE
    // if we have dependencies on parents then we need a unique
    // instance of ourselves, so we can be reused with many
    // different parents without issue
    if (dependencyOnParent(mode))
      return [inherit(mode, { starts: mode.starts ? inherit(mode.starts) : null })]

    // no special dependency issues, just return ourselves
    return [mode]
  }

  function restoreLanguageApi(obj) {
    if(API_REPLACES && !obj.langApiRestored) {
      obj.langApiRestored = true;
      for(var key in API_REPLACES)
        obj[key] && (obj[API_REPLACES[key]] = obj[key]);
      (obj.contains || []).concat(obj.variants || []).forEach(restoreLanguageApi);
    }
  }

  function compileKeywords(rawKeywords, case_insensitive) {
      var compiled_keywords = {};

      if (typeof rawKeywords === 'string') { // string
        splitAndCompile('keyword', rawKeywords);
      } else {
        objectKeys(rawKeywords).forEach(function (className) {
          splitAndCompile(className, rawKeywords[className]);
        });
      }
    return compiled_keywords;

    // ---

    function splitAndCompile(className, str) {
      if (case_insensitive) {
        str = str.toLowerCase();
      }
      str.split(' ').forEach(function(keyword) {
        var pair = keyword.split('|');
        compiled_keywords[pair[0]] = [className, scoreForKeyword(pair[0], pair[1])];
      });
    };
  }

  function scoreForKeyword(keyword, providedScore) {
    // manual scores always win over common keywords
    // so you can force a score of 1 if you really insist
    if (providedScore)
      return Number(providedScore)

    return commonKeyword(keyword) ? 0 : 1;
  }

  function commonKeyword(word) {
    return COMMON_KEYWORDS.indexOf(word.toLowerCase()) != -1
  }

  function compileLanguage(language) {

    function reStr(re) {
        return (re && re.source) || re;
    }

    function langRe(value, global) {
      return new RegExp(
        reStr(value),
        'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : '')
      );
    }

    function reCountMatchGroups(re) {
      return (new RegExp(re.toString() + '|')).exec('').length - 1;
    }

    // joinRe logically computes regexps.join(separator), but fixes the
    // backreferences so they continue to match.
    // it also places each individual regular expression into it's own
    // match group, keeping track of the sequencing of those match groups
    // is currently an exercise for the caller. :-)
    function joinRe(regexps, separator) {
      // backreferenceRe matches an open parenthesis or backreference. To avoid
      // an incorrect parse, it additionally matches the following:
      // - [...] elements, where the meaning of parentheses and escapes change
      // - other escape sequences, so we do not misparse escape sequences as
      //   interesting elements
      // - non-matching or lookahead parentheses, which do not capture. These
      //   follow the '(' with a '?'.
      var backreferenceRe = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
      var numCaptures = 0;
      var ret = '';
      for (var i = 0; i < regexps.length; i++) {
        numCaptures += 1;
        var offset = numCaptures;
        var re = reStr(regexps[i]);
        if (i > 0) {
          ret += separator;
        }
        ret += "(";
        while (re.length > 0) {
          var match = backreferenceRe.exec(re);
          if (match == null) {
            ret += re;
            break;
          }
          ret += re.substring(0, match.index);
          re = re.substring(match.index + match[0].length);
          if (match[0][0] == '\\' && match[1]) {
            // Adjust the backreference.
            ret += '\\' + String(Number(match[1]) + offset);
          } else {
            ret += match[0];
            if (match[0] == '(') {
              numCaptures++;
            }
          }
        }
        ret += ")";
      }
      return ret;
    }

    function buildModeRegex(mode) {

      var matchIndexes = {};
      var matcherRe;
      var regexes = [];
      var matcher = {};
      var matchAt = 1;

      function addRule(rule, regex) {
        matchIndexes[matchAt] = rule;
        regexes.push([rule, regex]);
        matchAt += reCountMatchGroups(regex) + 1;
      }

      var term;
      for (var i=0; i < mode.contains.length; i++) {
        var re;
        term = mode.contains[i];
        if (term.beginKeywords) {
          re = '\\.?(?:' + term.begin + ')\\.?';
        } else {
          re = term.begin;
        }
        addRule(term, re);
      }
      if (mode.terminator_end)
        addRule("end", mode.terminator_end);
      if (mode.illegal)
        addRule("illegal", mode.illegal);

      var terminators = regexes.map(function(el) { return el[1] });
      matcherRe = langRe(joinRe(terminators, '|'), true);

      matcher.lastIndex = 0;
      matcher.exec = function(s) {
        var rule;

        if( regexes.length === 0) return null;

        matcherRe.lastIndex = matcher.lastIndex;
        var match = matcherRe.exec(s);
        if (!match) { return null; }

        for(var i = 0; i<match.length; i++) {
          if (match[i] != undefined && matchIndexes["" +i] != undefined ) {
            rule = matchIndexes[""+i];
            break;
          }
        }

        // illegal or end match
        if (typeof rule === "string") {
          match.type = rule;
          match.extra = [mode.illegal, mode.terminator_end];
        } else {
          match.type = "begin";
          match.rule = rule;
        }
        return match;
      }

      return matcher;
    }

    function compileMode(mode, parent) {
      if (mode.compiled)
        return;
      mode.compiled = true;

      mode.keywords = mode.keywords || mode.beginKeywords;
      if (mode.keywords)
        mode.keywords = compileKeywords(mode.keywords, language.case_insensitive)

      mode.lexemesRe = langRe(mode.lexemes || /\w+/, true);

      if (parent) {
        if (mode.beginKeywords) {
          mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')\\b';
        }
        if (!mode.begin)
          mode.begin = /\B|\b/;
        mode.beginRe = langRe(mode.begin);
        if (mode.endSameAsBegin)
          mode.end = mode.begin;
        if (!mode.end && !mode.endsWithParent)
          mode.end = /\B|\b/;
        if (mode.end)
          mode.endRe = langRe(mode.end);
        mode.terminator_end = reStr(mode.end) || '';
        if (mode.endsWithParent && parent.terminator_end)
          mode.terminator_end += (mode.end ? '|' : '') + parent.terminator_end;
      }
      if (mode.illegal)
        mode.illegalRe = langRe(mode.illegal);
      if (mode.relevance == null)
        mode.relevance = 1;
      if (!mode.contains) {
        mode.contains = [];
      }
      mode.contains = Array.prototype.concat.apply([], mode.contains.map(function(c) {
        return expand_or_clone_mode(c === 'self' ? mode : c);
      }));
      mode.contains.forEach(function(c) {compileMode(c, mode);});

      if (mode.starts) {
        compileMode(mode.starts, parent);
      }

      mode.terminators = buildModeRegex(mode);
    }

    compileMode(language);
  }

  /*
  Core highlighting function. Accepts a language name, or an alias, and a
  string with the code to highlight. Returns an object with the following
  properties:

  - relevance (int)
  - value (an HTML string with highlighting markup)

  */
  function highlight(name, value, ignore_illegals, continuation) {

    function escapeRe(value) {
      return new RegExp(value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'm');
    }

    function endOfMode(mode, lexeme) {
      if (testRe(mode.endRe, lexeme)) {
        while (mode.endsParent && mode.parent) {
          mode = mode.parent;
        }
        return mode;
      }
      if (mode.endsWithParent) {
        return endOfMode(mode.parent, lexeme);
      }
    }

    function keywordMatch(mode, match) {
      var match_str = language.case_insensitive ? match[0].toLowerCase() : match[0];
      return mode.keywords.hasOwnProperty(match_str) && mode.keywords[match_str];
    }

    function buildSpan(classname, insideSpan, leaveOpen, noPrefix) {
      if (!leaveOpen && insideSpan === '') return '';
      if (!classname) return insideSpan;

      var classPrefix = noPrefix ? '' : options.classPrefix,
          openSpan    = '<span class="' + classPrefix,
          closeSpan   = leaveOpen ? '' : spanEndTag;

      openSpan += classname + '">';

      return openSpan + insideSpan + closeSpan;
    }

    function processKeywords() {
      var keyword_match, last_index, match, result;

      if (!top.keywords)
        return escape(mode_buffer);

      result = '';
      last_index = 0;
      top.lexemesRe.lastIndex = 0;
      match = top.lexemesRe.exec(mode_buffer);

      while (match) {
        result += escape(mode_buffer.substring(last_index, match.index));
        keyword_match = keywordMatch(top, match);
        if (keyword_match) {
          relevance += keyword_match[1];
          result += buildSpan(keyword_match[0], escape(match[0]));
        } else {
          result += escape(match[0]);
        }
        last_index = top.lexemesRe.lastIndex;
        match = top.lexemesRe.exec(mode_buffer);
      }
      return result + escape(mode_buffer.substr(last_index));
    }

    function processSubLanguage() {
      var explicit = typeof top.subLanguage === 'string';
      if (explicit && !languages[top.subLanguage]) {
        return escape(mode_buffer);
      }

      var result = explicit ?
                   highlight(top.subLanguage, mode_buffer, true, continuations[top.subLanguage]) :
                   highlightAuto(mode_buffer, top.subLanguage.length ? top.subLanguage : undefined);

      // Counting embedded language score towards the host language may be disabled
      // with zeroing the containing mode relevance. Usecase in point is Markdown that
      // allows XML everywhere and makes every XML snippet to have a much larger Markdown
      // score.
      if (top.relevance > 0) {
        relevance += result.relevance;
      }
      if (explicit) {
        continuations[top.subLanguage] = result.top;
      }
      return buildSpan(result.language, result.value, false, true);
    }

    function processBuffer() {
      result += (top.subLanguage != null ? processSubLanguage() : processKeywords());
      mode_buffer = '';
    }

    function startNewMode(mode) {
      result += mode.className? buildSpan(mode.className, '', true): '';
      top = Object.create(mode, {parent: {value: top}});
    }


    function doBeginMatch(match) {
      var lexeme = match[0];
      var new_mode = match.rule;

      if (new_mode && new_mode.endSameAsBegin) {
        new_mode.endRe = escapeRe( lexeme );
      }

      if (new_mode.skip) {
        mode_buffer += lexeme;
      } else {
        if (new_mode.excludeBegin) {
          mode_buffer += lexeme;
        }
        processBuffer();
        if (!new_mode.returnBegin && !new_mode.excludeBegin) {
          mode_buffer = lexeme;
        }
      }
      startNewMode(new_mode, lexeme);
      return new_mode.returnBegin ? 0 : lexeme.length;
    }

    function doEndMatch(match) {
      var lexeme = match[0];
      var end_mode = endOfMode(top, lexeme);
      if (!end_mode) { return; }

      var origin = top;
      if (origin.skip) {
        mode_buffer += lexeme;
      } else {
        if (!(origin.returnEnd || origin.excludeEnd)) {
          mode_buffer += lexeme;
        }
        processBuffer();
        if (origin.excludeEnd) {
          mode_buffer = lexeme;
        }
      }
      do {
        if (top.className) {
          result += spanEndTag;
        }
        if (!top.skip && !top.subLanguage) {
          relevance += top.relevance;
        }
        top = top.parent;
      } while (top !== end_mode.parent);
      if (end_mode.starts) {
        if (end_mode.endSameAsBegin) {
          end_mode.starts.endRe = end_mode.endRe;
        }
        startNewMode(end_mode.starts, '');
      }
      return origin.returnEnd ? 0 : lexeme.length;
    }

    var lastMatch = {};
    function processLexeme(text_before_match, match) {

      var lexeme = match && match[0];

      // add non-matched text to the current mode buffer
      mode_buffer += text_before_match;

      if (lexeme == null) {
        processBuffer();
        return 0;
      }

      // we've found a 0 width match and we're stuck, so we need to advance
      // this happens when we have badly behaved rules that have optional matchers to the degree that
      // sometimes they can end up matching nothing at all
      // Ref: https://github.com/highlightjs/highlight.js/issues/2140
      if (lastMatch.type=="begin" && match.type=="end" && lastMatch.index == match.index && lexeme === "") {
        // spit the "skipped" character that our regex choked on back into the output sequence
        mode_buffer += value.slice(match.index, match.index + 1)
        return 1;
      }
      lastMatch = match;

      if (match.type==="begin") {
        return doBeginMatch(match);
      } else if (match.type==="illegal" && !ignore_illegals) {
        // illegal match, we do not continue processing
        throw new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.className || '<unnamed>') + '"');
      } else if (match.type==="end") {
        var processed = doEndMatch(match);
        if (processed != undefined)
          return processed;
      }

      /*
      Why might be find ourselves here?  Only one occasion now.  An end match that was
      triggered but could not be completed.  When might this happen?  When an `endSameasBegin`
      rule sets the end rule to a specific match.  Since the overall mode termination rule that's
      being used to scan the text isn't recompiled that means that any match that LOOKS like
      the end (but is not, because it is not an exact match to the beginning) will
      end up here.  A definite end match, but when `doEndMatch` tries to "reapply"
      the end rule and fails to match, we wind up here, and just silently ignore the end.

      This causes no real harm other than stopping a few times too many.
      */

      mode_buffer += lexeme;
      return lexeme.length;
    }

    var language = getLanguage(name);
    if (!language) {
      throw new Error('Unknown language: "' + name + '"');
    }

    compileLanguage(language);
    var top = continuation || language;
    var continuations = {}; // keep continuations for sub-languages
    var result = '', current;
    for(current = top; current !== language; current = current.parent) {
      if (current.className) {
        result = buildSpan(current.className, '', true) + result;
      }
    }
    var mode_buffer = '';
    var relevance = 0;
    try {
      var match, count, index = 0;
      while (true) {
        top.terminators.lastIndex = index;
        match = top.terminators.exec(value);
        if (!match)
          break;
        count = processLexeme(value.substring(index, match.index), match);
        index = match.index + count;
      }
      processLexeme(value.substr(index));
      for(current = top; current.parent; current = current.parent) { // close dangling modes
        if (current.className) {
          result += spanEndTag;
        }
      }
      return {
        relevance: relevance,
        value: result,
        illegal:false,
        language: name,
        top: top
      };
    } catch (e) {
      if (e.message && e.message.indexOf('Illegal') !== -1) {
        return {
          illegal: true,
          relevance: 0,
          value: escape(value)
        };
      } else {
        throw e;
      }
    }
  }

  /*
  Highlighting with language detection. Accepts a string with the code to
  highlight. Returns an object with the following properties:

  - language (detected language)
  - relevance (int)
  - value (an HTML string with highlighting markup)
  - second_best (object with the same structure for second-best heuristically
    detected language, may be absent)

  */
  function highlightAuto(text, languageSubset) {
    languageSubset = languageSubset || options.languages || objectKeys(languages);
    var result = {
      relevance: 0,
      value: escape(text)
    };
    var second_best = result;
    languageSubset.filter(getLanguage).filter(autoDetection).forEach(function(name) {
      var current = highlight(name, text, false);
      current.language = name;
      if (current.relevance > second_best.relevance) {
        second_best = current;
      }
      if (current.relevance > result.relevance) {
        second_best = result;
        result = current;
      }
    });
    if (second_best.language) {
      result.second_best = second_best;
    }
    return result;
  }

  /*
  Post-processing of the highlighted markup:

  - replace TABs with something more useful
  - replace real line-breaks with '<br>' for non-pre containers

  */
  function fixMarkup(value) {
    return !(options.tabReplace || options.useBR)
      ? value
      : value.replace(fixMarkupRe, function(match, p1) {
          if (options.useBR && match === '\n') {
            return '<br>';
          } else if (options.tabReplace) {
            return p1.replace(/\t/g, options.tabReplace);
          }
          return '';
      });
  }

  function buildClassName(prevClassName, currentLang, resultLang) {
    var language = currentLang ? aliases[currentLang] : resultLang,
        result   = [prevClassName.trim()];

    if (!prevClassName.match(/\bhljs\b/)) {
      result.push('hljs');
    }

    if (prevClassName.indexOf(language) === -1) {
      result.push(language);
    }

    return result.join(' ').trim();
  }

  /*
  Applies highlighting to a DOM node containing code. Accepts a DOM node and
  two optional parameters for fixMarkup.
  */
  function highlightBlock(block) {
    var node, originalStream, result, resultNode, text;
    var language = blockLanguage(block);

    if (isNotHighlighted(language))
        return;

    if (options.useBR) {
      node = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      node.innerHTML = block.innerHTML.replace(/\n/g, '').replace(/<br[ \/]*>/g, '\n');
    } else {
      node = block;
    }
    text = node.textContent;
    result = language ? highlight(language, text, true) : highlightAuto(text);

    originalStream = nodeStream(node);
    if (originalStream.length) {
      resultNode = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      resultNode.innerHTML = result.value;
      result.value = mergeStreams(originalStream, nodeStream(resultNode), text);
    }
    result.value = fixMarkup(result.value);

    block.innerHTML = result.value;
    block.className = buildClassName(block.className, language, result.language);
    block.result = {
      language: result.language,
      re: result.relevance
    };
    if (result.second_best) {
      block.second_best = {
        language: result.second_best.language,
        re: result.second_best.relevance
      };
    }
  }

  /*
  Updates highlight.js global options with values passed in the form of an object.
  */
  function configure(user_options) {
    options = inherit(options, user_options);
  }

  /*
  Applies highlighting to all <pre><code>..</code></pre> blocks on a page.
  */
  function initHighlighting() {
    if (initHighlighting.called)
      return;
    initHighlighting.called = true;

    var blocks = document.querySelectorAll('pre code');
    ArrayProto.forEach.call(blocks, highlightBlock);
  }

  /*
  Attaches highlighting to the page load event.
  */
  function initHighlightingOnLoad() {
    addEventListener('DOMContentLoaded', initHighlighting, false);
    addEventListener('load', initHighlighting, false);
  }

  function registerLanguage(name, language) {
    var lang = languages[name] = language(hljs);
    restoreLanguageApi(lang);
    lang.rawDefinition = language.bind(null,hljs);

    if (lang.aliases) {
      lang.aliases.forEach(function(alias) {aliases[alias] = name;});
    }
  }

  function listLanguages() {
    return objectKeys(languages);
  }

  function getLanguage(name) {
    name = (name || '').toLowerCase();
    return languages[name] || languages[aliases[name]];
  }

  function autoDetection(name) {
    var lang = getLanguage(name);
    return lang && !lang.disableAutodetect;
  }

  /* Interface definition */

  hljs.highlight = highlight;
  hljs.highlightAuto = highlightAuto;
  hljs.fixMarkup = fixMarkup;
  hljs.highlightBlock = highlightBlock;
  hljs.configure = configure;
  hljs.initHighlighting = initHighlighting;
  hljs.initHighlightingOnLoad = initHighlightingOnLoad;
  hljs.registerLanguage = registerLanguage;
  hljs.listLanguages = listLanguages;
  hljs.getLanguage = getLanguage;
  hljs.autoDetection = autoDetection;
  hljs.inherit = inherit;

  // Common regexps
  hljs.IDENT_RE = '[a-zA-Z]\\w*';
  hljs.UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*';
  hljs.NUMBER_RE = '\\b\\d+(\\.\\d+)?';
  hljs.C_NUMBER_RE = '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
  hljs.BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
  hljs.RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';

  // Common modes
  hljs.BACKSLASH_ESCAPE = {
    begin: '\\\\[\\s\\S]', relevance: 0
  };
  hljs.APOS_STRING_MODE = {
    className: 'string',
    begin: '\'', end: '\'',
    illegal: '\\n',
    contains: [hljs.BACKSLASH_ESCAPE]
  };
  hljs.QUOTE_STRING_MODE = {
    className: 'string',
    begin: '"', end: '"',
    illegal: '\\n',
    contains: [hljs.BACKSLASH_ESCAPE]
  };
  hljs.PHRASAL_WORDS_MODE = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  };
  hljs.COMMENT = function (begin, end, inherits) {
    var mode = hljs.inherit(
      {
        className: 'comment',
        begin: begin, end: end,
        contains: []
      },
      inherits || {}
    );
    mode.contains.push(hljs.PHRASAL_WORDS_MODE);
    mode.contains.push({
      className: 'doctag',
      begin: '(?:TODO|FIXME|NOTE|BUG|XXX):',
      relevance: 0
    });
    return mode;
  };
  hljs.C_LINE_COMMENT_MODE = hljs.COMMENT('//', '$');
  hljs.C_BLOCK_COMMENT_MODE = hljs.COMMENT('/\\*', '\\*/');
  hljs.HASH_COMMENT_MODE = hljs.COMMENT('#', '$');
  hljs.NUMBER_MODE = {
    className: 'number',
    begin: hljs.NUMBER_RE,
    relevance: 0
  };
  hljs.C_NUMBER_MODE = {
    className: 'number',
    begin: hljs.C_NUMBER_RE,
    relevance: 0
  };
  hljs.BINARY_NUMBER_MODE = {
    className: 'number',
    begin: hljs.BINARY_NUMBER_RE,
    relevance: 0
  };
  hljs.CSS_NUMBER_MODE = {
    className: 'number',
    begin: hljs.NUMBER_RE + '(' +
      '%|em|ex|ch|rem'  +
      '|vw|vh|vmin|vmax' +
      '|cm|mm|in|pt|pc|px' +
      '|deg|grad|rad|turn' +
      '|s|ms' +
      '|Hz|kHz' +
      '|dpi|dpcm|dppx' +
      ')?',
    relevance: 0
  };
  hljs.REGEXP_MODE = {
    className: 'regexp',
    begin: /\//, end: /\/[gimuy]*/,
    illegal: /\n/,
    contains: [
      hljs.BACKSLASH_ESCAPE,
      {
        begin: /\[/, end: /\]/,
        relevance: 0,
        contains: [hljs.BACKSLASH_ESCAPE]
      }
    ]
  };
  hljs.TITLE_MODE = {
    className: 'title',
    begin: hljs.IDENT_RE,
    relevance: 0
  };
  hljs.UNDERSCORE_TITLE_MODE = {
    className: 'title',
    begin: hljs.UNDERSCORE_IDENT_RE,
    relevance: 0
  };
  hljs.METHOD_GUARD = {
    // excludes method names from keyword processing
    begin: '\\.\\s*' + hljs.UNDERSCORE_IDENT_RE,
    relevance: 0
  };

  return hljs;
}));

},{}],"YrXX":[function(require,module,exports) {
module.exports = function(hljs) {
  var IDENT_RE = '[A-Za-z$_][0-9A-Za-z$_]*';
  var KEYWORDS = {
    keyword:
      'in of if for while finally var new function do return void else break catch ' +
      'instanceof with throw case default try this switch continue typeof delete ' +
      'let yield const export super debugger as async await static ' +
      // ECMAScript 6 modules import
      'import from as'
    ,
    literal:
      'true false null undefined NaN Infinity',
    built_in:
      'eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent ' +
      'encodeURI encodeURIComponent escape unescape Object Function Boolean Error ' +
      'EvalError InternalError RangeError ReferenceError StopIteration SyntaxError ' +
      'TypeError URIError Number Math Date String RegExp Array Float32Array ' +
      'Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array ' +
      'Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require ' +
      'module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect ' +
      'Promise'
  };
  var NUMBER = {
    className: 'number',
    variants: [
      { begin: '\\b(0[bB][01]+)n?' },
      { begin: '\\b(0[oO][0-7]+)n?' },
      { begin: hljs.C_NUMBER_RE + 'n?' }
    ],
    relevance: 0
  };
  var SUBST = {
    className: 'subst',
    begin: '\\$\\{', end: '\\}',
    keywords: KEYWORDS,
    contains: []  // defined later
  };
  var HTML_TEMPLATE = {
    begin: 'html`', end: '',
    starts: {
      end: '`', returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: 'xml',
    }
  };
  var CSS_TEMPLATE = {
    begin: 'css`', end: '',
    starts: {
      end: '`', returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: 'css',
    }
  };
  var TEMPLATE_STRING = {
    className: 'string',
    begin: '`', end: '`',
    contains: [
      hljs.BACKSLASH_ESCAPE,
      SUBST
    ]
  };
  SUBST.contains = [
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE,
    HTML_TEMPLATE,
    CSS_TEMPLATE,
    TEMPLATE_STRING,
    NUMBER,
    hljs.REGEXP_MODE
  ];
  var PARAMS_CONTAINS = SUBST.contains.concat([
    hljs.C_BLOCK_COMMENT_MODE,
    hljs.C_LINE_COMMENT_MODE
  ]);

  return {
    aliases: ['js', 'jsx'],
    keywords: KEYWORDS,
    contains: [
      {
        className: 'meta',
        relevance: 10,
        begin: /^\s*['"]use (strict|asm)['"]/
      },
      {
        className: 'meta',
        begin: /^#!/, end: /$/
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      HTML_TEMPLATE,
      CSS_TEMPLATE,
      TEMPLATE_STRING,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      NUMBER,
      { // object attr container
        begin: /[{,\n]\s*/, relevance: 0,
        contains: [
          {
            begin: IDENT_RE + '\\s*:', returnBegin: true,
            relevance: 0,
            contains: [{className: 'attr', begin: IDENT_RE, relevance: 0}]
          }
        ]
      },
      { // "value" container
        begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
        keywords: 'return throw case',
        contains: [
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          hljs.REGEXP_MODE,
          {
            className: 'function',
            begin: '(\\(.*?\\)|' + IDENT_RE + ')\\s*=>', returnBegin: true,
            end: '\\s*=>',
            contains: [
              {
                className: 'params',
                variants: [
                  {
                    begin: IDENT_RE
                  },
                  {
                    begin: /\(\s*\)/,
                  },
                  {
                    begin: /\(/, end: /\)/,
                    excludeBegin: true, excludeEnd: true,
                    keywords: KEYWORDS,
                    contains: PARAMS_CONTAINS
                  }
                ]
              }
            ]
          },
          {
            className: '',
            begin: /\s/,
            end: /\s*/,
            skip: true,
          },
          { // E4X / JSX
            begin: /</, end: /(\/[A-Za-z0-9\\._:-]+|[A-Za-z0-9\\._:-]+\/)>/,
            subLanguage: 'xml',
            contains: [
              { begin: /<[A-Za-z0-9\\._:-]+\s*\/>/, skip: true },
              {
                begin: /<[A-Za-z0-9\\._:-]+/, end: /(\/[A-Za-z0-9\\._:-]+|[A-Za-z0-9\\._:-]+\/)>/, skip: true,
                contains: [
                  { begin: /<[A-Za-z0-9\\._:-]+\s*\/>/, skip: true },
                  'self'
                ]
              }
            ]
          }
        ],
        relevance: 0
      },
      {
        className: 'function',
        beginKeywords: 'function', end: /\{/, excludeEnd: true,
        contains: [
          hljs.inherit(hljs.TITLE_MODE, {begin: IDENT_RE}),
          {
            className: 'params',
            begin: /\(/, end: /\)/,
            excludeBegin: true,
            excludeEnd: true,
            contains: PARAMS_CONTAINS
          }
        ],
        illegal: /\[|%/
      },
      {
        begin: /\$[(.]/ // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      },
      hljs.METHOD_GUARD,
      { // ES6 class
        className: 'class',
        beginKeywords: 'class', end: /[{;=]/, excludeEnd: true,
        illegal: /[:"\[\]]/,
        contains: [
          {beginKeywords: 'extends'},
          hljs.UNDERSCORE_TITLE_MODE
        ]
      },
      {
        beginKeywords: 'constructor get set', end: /\{/, excludeEnd: true
      }
    ],
    illegal: /#(?!!)/
  };
};
},{}],"ElH3":[function(require,module,exports) {
module.exports = function(hljs) {
  var XML_IDENT_RE = '[A-Za-z0-9\\._:-]+';
  var TAG_INTERNALS = {
    endsWithParent: true,
    illegal: /</,
    relevance: 0,
    contains: [
      {
        className: 'attr',
        begin: XML_IDENT_RE,
        relevance: 0
      },
      {
        begin: /=\s*/,
        relevance: 0,
        contains: [
          {
            className: 'string',
            endsParent: true,
            variants: [
              {begin: /"/, end: /"/},
              {begin: /'/, end: /'/},
              {begin: /[^\s"'=<>`]+/}
            ]
          }
        ]
      }
    ]
  };
  return {
    aliases: ['html', 'xhtml', 'rss', 'atom', 'xjb', 'xsd', 'xsl', 'plist', 'wsf', 'svg'],
    case_insensitive: true,
    contains: [
      {
        className: 'meta',
        begin: '<!DOCTYPE', end: '>',
        relevance: 10,
        contains: [{begin: '\\[', end: '\\]'}]
      },
      hljs.COMMENT(
        '<!--',
        '-->',
        {
          relevance: 10
        }
      ),
      {
        begin: '<\\!\\[CDATA\\[', end: '\\]\\]>',
        relevance: 10
      },
      {
        className: 'meta',
        begin: /<\?xml/, end: /\?>/, relevance: 10
      },
      {
        begin: /<\?(php)?/, end: /\?>/,
        subLanguage: 'php',
        contains: [
          // We don't want the php closing tag ?> to close the PHP block when
          // inside any of the following blocks:
          {begin: '/\\*', end: '\\*/', skip: true},
          {begin: 'b"', end: '"', skip: true},
          {begin: 'b\'', end: '\'', skip: true},
          hljs.inherit(hljs.APOS_STRING_MODE, {illegal: null, className: null, contains: null, skip: true}),
          hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: null, className: null, contains: null, skip: true})
        ]
      },
      {
        className: 'tag',
        /*
        The lookahead pattern (?=...) ensures that 'begin' only matches
        '<style' as a single word, followed by a whitespace or an
        ending braket. The '$' is needed for the lexeme to be recognized
        by hljs.subMode() that tests lexemes outside the stream.
        */
        begin: '<style(?=\\s|>)', end: '>',
        keywords: {name: 'style'},
        contains: [TAG_INTERNALS],
        starts: {
          end: '</style>', returnEnd: true,
          subLanguage: ['css', 'xml']
        }
      },
      {
        className: 'tag',
        // See the comment in the <style tag about the lookahead pattern
        begin: '<script(?=\\s|>)', end: '>',
        keywords: {name: 'script'},
        contains: [TAG_INTERNALS],
        starts: {
          end: '\<\/script\>', returnEnd: true,
          subLanguage: ['actionscript', 'javascript', 'handlebars', 'xml']
        }
      },
      {
        className: 'tag',
        begin: '</?', end: '/?>',
        contains: [
          {
            className: 'name', begin: /[^\/><\s]+/, relevance: 0
          },
          TAG_INTERNALS
        ]
      }
    ]
  };
};
},{}],"exOZ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
function rafThrottle(fn) {
  var isRunning = false;
  return function fnBinfRaf() {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (isRunning) return;
    isRunning = true;
    requestAnimationFrame(function () {
      isRunning = false;
      fn.apply(_this, args);
    });
  };
}

var _default = {
  name: 'Container',
  props: {
    menus: Array
  },
  data: function data() {
    return {
      activeIndex: 0,
      handleScroll: rafThrottle(this.scroll)
    };
  },
  computed: {
    menuIds: function menuIds() {
      return this.menus.map(function (v) {
        return v.id;
      });
    }
  },
  methods: {
    scroll: function scroll() {
      for (var i = 0; i < this.menuIds.length; i++) {
        var id = this.menuIds[i];
        var el = document.getElementById(id);

        var _el$getBoundingClient = el.getBoundingClientRect(),
            top = _el$getBoundingClient.top;

        if (top >= 0) {
          this.activeIndex = i;
          break;
        }
      }
    }
  }
};
exports.default = _default;
        var $617eab = exports.default || module.exports;
      
      if (typeof $617eab === 'function') {
        $617eab = $617eab.options;
      }
    
        /* template */
        Object.assign($617eab, (function () {
          var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"container"},[_c('div',{staticClass:"sidebar"},_vm._l((_vm.menus),function(menu,i){return _c('a',{key:menu.id,class:{ active: _vm.activeIndex === i },attrs:{"href":("#" + (menu.id)),"title":menu.title}},[_vm._v(_vm._s(menu.title))])}),0),_vm._v(" "),_c('div',{ref:"main",staticClass:"main",on:{"scroll":_vm.handleScroll}},[_c('div',{staticClass:"content"},[_vm._t("default")],2)])])}
var staticRenderFns = []

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{}],"K2WH":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// TODO: 替换img 图标, 本地
var _default = {
  name: 'DemoCard',
  props: {
    id: String,
    title: String,
    description: String,
    code: String,
    active: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      codeVisible: false
    };
  },
  methods: {
    handleExpand: function handleExpand() {
      this.codeVisible = !this.codeVisible;
    }
  }
};
exports.default = _default;
        var $eea8fa = exports.default || module.exports;
      
      if (typeof $eea8fa === 'function') {
        $eea8fa = $eea8fa.options;
      }
    
        /* template */
        Object.assign($eea8fa, (function () {
          var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"card",class:{ active: _vm.active }},[_c('section',{staticClass:"card-title",attrs:{"id":_vm.id},domProps:{"innerHTML":_vm._s(_vm.title)}}),_vm._v(" "),_c('section',{staticClass:"card-description markdown-body",domProps:{"innerHTML":_vm._s(_vm.description)}}),_vm._v(" "),_c('section',{staticClass:"card-demo markdown-body"},[_vm._t("default")],2),_vm._v(" "),_c('section',{staticClass:"card-actions",on:{"click":_vm.handleExpand}},[(_vm.codeVisible)?_c('img',{staticClass:"icon-expand",attrs:{"alt":"show code","src":"expand.29367ed0.svg"}}):_c('img',{staticClass:"icon-expand",attrs:{"alt":"hide code","src":"collapse.9db1dced.svg"}})]),_vm._v(" "),_c('section',{directives:[{name:"show",rawName:"v-show",value:(_vm.codeVisible),expression:"codeVisible"}],staticClass:"card-code"},[_c('pre',[_vm._v("      "),_c('code',{staticClass:"vue"},[_vm._v(_vm._s(_vm.code))]),_vm._v("\n    ")])])])}
var staticRenderFns = []

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{"./../assets/expand.svg":[["expand.29367ed0.svg","qjjT"],"qjjT"],"./../assets/collapse.svg":[["collapse.9db1dced.svg","lmY9"],"lmY9"]}],"F4k5":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  name: 'Basic',
  data: function data() {
    return {
      value1: null,
      value2: null,
      value3: null,
      value4: null,
      value5: null,
      value6: null
    };
  }
};
exports.default = _default;
        var $8c88ad = exports.default || module.exports;
      
      if (typeof $8c88ad === 'function') {
        $8c88ad = $8c88ad.options;
      }
    
        /* template */
        Object.assign($8c88ad, (function () {
          var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_c('section',[_c('p',[_vm._v("date (default)")]),_vm._v(" "),_c('date-picker',{attrs:{"format":"YYYY-MM-DD","type":"date","placeholder":"Select date"},model:{value:(_vm.value1),callback:function ($$v) {_vm.value1=$$v},expression:"value1"}})],1),_vm._v(" "),_c('section',[_c('p',[_vm._v("month")]),_vm._v(" "),_c('date-picker',{attrs:{"type":"month","placeholder":"Select month"},model:{value:(_vm.value2),callback:function ($$v) {_vm.value2=$$v},expression:"value2"}})],1),_vm._v(" "),_c('section',[_c('p',[_vm._v("year")]),_vm._v(" "),_c('date-picker',{attrs:{"type":"year","placeholder":"Select year"},model:{value:(_vm.value3),callback:function ($$v) {_vm.value3=$$v},expression:"value3"}})],1),_vm._v(" "),_c('section',[_c('p',[_vm._v("datetime")]),_vm._v(" "),_c('date-picker',{attrs:{"type":"datetime","placeholder":"Select datetime"},model:{value:(_vm.value4),callback:function ($$v) {_vm.value4=$$v},expression:"value4"}})],1),_vm._v(" "),_c('section',[_c('p',[_vm._v("time")]),_vm._v(" "),_c('date-picker',{attrs:{"type":"time","placeholder":"Select time"},model:{value:(_vm.value5),callback:function ($$v) {_vm.value5=$$v},expression:"value5"}})],1),_vm._v(" "),_c('section',[_c('p',[_vm._v("week")]),_vm._v(" "),_c('date-picker',{attrs:{"type":"week","placeholder":"Select week"},model:{value:(_vm.value6),callback:function ($$v) {_vm.value6=$$v},expression:"value6"}})],1)])}
var staticRenderFns = []

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{}],"MAVg":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  name: 'ValueType',
  data: function data() {
    return {
      value1: new Date(2019, 9, 9),
      value2: '2019-10-09',
      value3: new Date(2019, 9, 9).getTime(),
      value4: '09/10/2019'
    };
  }
};
exports.default = _default;
        var $7566f2 = exports.default || module.exports;
      
      if (typeof $7566f2 === 'function') {
        $7566f2 = $7566f2.options;
      }
    
        /* template */
        Object.assign($7566f2, (function () {
          var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_c('section',[_c('p',[_vm._v("format")]),_vm._v(" "),_c('date-picker',{attrs:{"value-type":"format","format":"YYYY-MM-DD"},model:{value:(_vm.value2),callback:function ($$v) {_vm.value2=$$v},expression:"value2"}}),_vm._v(" "),_c('p',[_c('code',[_vm._v("v-model = "+_vm._s(_vm.value2))])])],1),_vm._v(" "),_c('section',[_c('p',[_vm._v("date (Date Object)")]),_vm._v(" "),_c('date-picker',{attrs:{"value-type":"date"},model:{value:(_vm.value1),callback:function ($$v) {_vm.value1=$$v},expression:"value1"}}),_vm._v(" "),_c('p',[_c('code',[_vm._v("v-model = "+_vm._s(_vm.value1))])])],1),_vm._v(" "),_c('section',[_c('p',[_vm._v("timestamp")]),_vm._v(" "),_c('date-picker',{attrs:{"value-type":"timestamp"},model:{value:(_vm.value3),callback:function ($$v) {_vm.value3=$$v},expression:"value3"}}),_vm._v(" "),_c('p',[_c('code',[_vm._v("v-model = "+_vm._s(_vm.value3))])])],1),_vm._v(" "),_c('section',[_c('p',[_vm._v("DD/MM/YYYY")]),_vm._v(" "),_c('date-picker',{attrs:{"value-type":"DD/MM/YYYY","format":"YYYY-MM-DD"},model:{value:(_vm.value4),callback:function ($$v) {_vm.value4=$$v},expression:"value4"}}),_vm._v(" "),_c('p',[_c('code',[_vm._v("v-model = "+_vm._s(_vm.value4))])])],1)])}
var staticRenderFns = []

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{}],"vssy":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  name: 'Range',
  data: function data() {
    return {
      value1: [new Date(2019, 9, 8), new Date(2019, 9, 19)],
      value2: []
    };
  }
};
exports.default = _default;
        var $adb521 = exports.default || module.exports;
      
      if (typeof $adb521 === 'function') {
        $adb521 = $adb521.options;
      }
    
        /* template */
        Object.assign($adb521, (function () {
          var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_c('section',[_c('p',[_vm._v("date range")]),_vm._v(" "),_c('date-picker',{attrs:{"type":"date","range":"","placeholder":"Select date range"},model:{value:(_vm.value1),callback:function ($$v) {_vm.value1=$$v},expression:"value1"}})],1),_vm._v(" "),_c('section',[_c('p',[_vm._v("datetime range")]),_vm._v(" "),_c('date-picker',{attrs:{"type":"datetime","range":"","placeholder":"Select datetime range"},model:{value:(_vm.value2),callback:function ($$v) {_vm.value2=$$v},expression:"value2"}})],1)])}
var staticRenderFns = []

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{}],"tBXd":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var today = new Date();
today.setHours(0, 0, 0, 0);
var _default = {
  data: function data() {
    return {
      value1: new Date(),
      value2: new Date(),
      value3: '',
      value4: '',
      value5: ''
    };
  },
  methods: {
    notBeforeToday: function notBeforeToday(date) {
      return date < today;
    },
    notAfterToday: function notAfterToday(date) {
      return date > today;
    },
    notBeforeNine: function notBeforeNine(date) {
      return date.getHours() < 9;
    },
    notBeforeDate: function notBeforeDate(date) {
      return date < new Date(2019, 9, 9);
    },
    notBeforeTime: function notBeforeTime(date) {
      return date < new Date(2019, 9, 9, 12);
    }
  }
};
exports.default = _default;
        var $bc90ee = exports.default || module.exports;
      
      if (typeof $bc90ee === 'function') {
        $bc90ee = $bc90ee.options;
      }
    
        /* template */
        Object.assign($bc90ee, (function () {
          var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_c('section',[_c('p',[_vm._v("date not before today")]),_vm._v(" "),_c('date-picker',{attrs:{"disabled-date":_vm.notBeforeToday},model:{value:(_vm.value1),callback:function ($$v) {_vm.value1=$$v},expression:"value1"}})],1),_vm._v(" "),_c('section',[_c('p',[_vm._v("date not after today")]),_vm._v(" "),_c('date-picker',{attrs:{"disabled-date":_vm.notAfterToday},model:{value:(_vm.value2),callback:function ($$v) {_vm.value2=$$v},expression:"value2"}})],1),_vm._v(" "),_c('section',[_c('p',[_vm._v("time not before 09:00")]),_vm._v(" "),_c('date-picker',{attrs:{"value-type":"format","type":"time","placeholder":"HH:mm:ss","default-value":new Date().setHours(9, 0, 0),"disabled-time":_vm.notBeforeNine},model:{value:(_vm.value3),callback:function ($$v) {_vm.value3=$$v},expression:"value3"}})],1),_vm._v(" "),_c('section',[_c('p',[_vm._v("datetime not before 2019-10-09 12:00")]),_vm._v(" "),_c('date-picker',{attrs:{"type":"datetime","disabled-date":_vm.notBeforeDate,"disabled-time":_vm.notBeforeTime,"value-type":"format"},model:{value:(_vm.value4),callback:function ($$v) {_vm.value4=$$v},expression:"value4"}})],1)])}
var staticRenderFns = []

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{}],"U8rn":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  name: 'Basic',
  data: function data() {
    return {
      value1: null,
      value2: null,
      value3: null,
      shortcuts: [{
        text: 'Today',
        onClick: function onClick() {
          var date = new Date(); // return a Date

          return date;
        }
      }, {
        text: 'Yesterday',
        onClick: function onClick() {
          var date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24);
          return date;
        }
      }]
    };
  },
  methods: {
    selectNextThreeDay: function selectNextThreeDay(emit) {
      var start = new Date();
      var end = new Date();
      end.setTime(end.getTime() + 3 * 24 * 3600 * 1000);
      var date = [start, end];
      emit(date);
    }
  }
};
exports.default = _default;
        var $150dd1 = exports.default || module.exports;
      
      if (typeof $150dd1 === 'function') {
        $150dd1 = $150dd1.options;
      }
    
        /* template */
        Object.assign($150dd1, (function () {
          var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_c('section',[_c('p',[_vm._v("shortcuts")]),_vm._v(" "),_c('date-picker',{attrs:{"shortcuts":_vm.shortcuts,"placeholder":"Select date"},model:{value:(_vm.value1),callback:function ($$v) {_vm.value1=$$v},expression:"value1"}})],1),_vm._v(" "),_c('section',[_c('p',[_vm._v("header slot")]),_vm._v(" "),_c('date-picker',{attrs:{"placeholder":"Select date"},scopedSlots:_vm._u([{key:"header",fn:function(ref){
var emit = ref.emit;
return [_c('button',{staticClass:"mx-btn mx-btn-text",on:{"click":function($event){emit(new Date())}}},[_vm._v("Today")])]}}]),model:{value:(_vm.value2),callback:function ($$v) {_vm.value2=$$v},expression:"value2"}})],1),_vm._v(" "),_c('section',[_c('p',[_vm._v("footer slot")]),_vm._v(" "),_c('date-picker',{attrs:{"range":"","placeholder":"Select date range"},scopedSlots:_vm._u([{key:"footer",fn:function(ref){
var emit = ref.emit;
return [_c('div',{staticStyle:{"text-align":"left"}},[_c('button',{staticClass:"mx-btn mx-btn-text",on:{"click":function($event){return _vm.selectNextThreeDay(emit)}}},[_vm._v("\n            NextThreeDay\n          ")])])]}}]),model:{value:(_vm.value3),callback:function ($$v) {_vm.value3=$$v},expression:"value3"}})],1)])}
var staticRenderFns = []

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{}],"jkBQ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  data: function data() {
    return {
      value1: null,
      value2: [],
      showTimePanel: false,
      showTimeRangePanel: false
    };
  },
  methods: {
    toggleTimePanel: function toggleTimePanel() {
      this.showTimePanel = !this.showTimePanel;
    },
    toggleTimeRangePanel: function toggleTimeRangePanel() {
      this.showTimeRangePanel = !this.showTimeRangePanel;
    },
    handleOpenChange: function handleOpenChange() {
      this.showTimePanel = false;
    },
    handleRangeClose: function handleRangeClose() {
      this.showTimeRangePanel = false;
    }
  }
};
exports.default = _default;
        var $426d4e = exports.default || module.exports;
      
      if (typeof $426d4e === 'function') {
        $426d4e = $426d4e.options;
      }
    
        /* template */
        Object.assign($426d4e, (function () {
          var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_c('section',[_c('date-picker',{attrs:{"type":"datetime","placeholder":"Select datetime","show-time-panel":_vm.showTimePanel},on:{"close":_vm.handleOpenChange},scopedSlots:_vm._u([{key:"footer",fn:function(){return [_c('button',{staticClass:"mx-btn mx-btn-text",on:{"click":_vm.toggleTimePanel}},[_vm._v("\n          "+_vm._s(_vm.showTimePanel ? 'select date' : 'select time')+"\n        ")])]},proxy:true}]),model:{value:(_vm.value1),callback:function ($$v) {_vm.value1=$$v},expression:"value1"}})],1),_vm._v(" "),_c('section',[_c('date-picker',{attrs:{"type":"datetime","placeholder":"Select datetime range","range":"","show-time-panel":_vm.showTimeRangePanel},on:{"close":_vm.handleRangeClose},scopedSlots:_vm._u([{key:"footer",fn:function(){return [_c('button',{staticClass:"mx-btn mx-btn-text",on:{"click":_vm.toggleTimeRangePanel}},[_vm._v("\n          "+_vm._s(_vm.showTimeRangePanel ? 'select date' : 'select time')+"\n        ")])]},proxy:true}]),model:{value:(_vm.value2),callback:function ($$v) {_vm.value2=$$v},expression:"value2"}})],1)])}
var staticRenderFns = []

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{}],"hLWH":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  name: 'ControlOpen',
  data: function data() {
    return {
      value: null,
      open: false
    };
  },
  methods: {
    handleChange: function handleChange(value, type) {
      if (type === 'second') {
        this.open = false;
      }
    }
  }
};
exports.default = _default;
        var $bbcab3 = exports.default || module.exports;
      
      if (typeof $bbcab3 === 'function') {
        $bbcab3 = $bbcab3.options;
      }
    
        /* template */
        Object.assign($bbcab3, (function () {
          var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('date-picker',{attrs:{"value-type":"format","type":"time","open":_vm.open,"placeholder":"Select time"},on:{"update:open":function($event){_vm.open=$event},"change":_vm.handleChange},model:{value:(_vm.value),callback:function ($$v) {_vm.value=$$v},expression:"value"}})],1)}
var staticRenderFns = []

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{}],"P315":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  name: 'ControlOpen',
  data: function data() {
    return {
      value: ''
    };
  }
};
exports.default = _default;
        var $6579d5 = exports.default || module.exports;
      
      if (typeof $6579d5 === 'function') {
        $6579d5 = $6579d5.options;
      }
    
        /* template */
        Object.assign($6579d5, (function () {
          var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('date-picker',{attrs:{"format":"hh:mm a","value-type":"format","type":"time","placeholder":"hh:mm a"},model:{value:(_vm.value),callback:function ($$v) {_vm.value=$$v},expression:"value"}})],1)}
var staticRenderFns = []

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{}],"WCZR":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  name: 'ControlOpen',
  data: function data() {
    return {
      value: '',
      hours: Array.from({
        length: 10
      }).map(function (_, i) {
        return i + 8;
      })
    };
  }
};
exports.default = _default;
        var $edaa9d = exports.default || module.exports;
      
      if (typeof $edaa9d === 'function') {
        $edaa9d = $edaa9d.options;
      }
    
        /* template */
        Object.assign($edaa9d, (function () {
          var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('date-picker',{attrs:{"minute-step":30,"hour-options":_vm.hours,"format":"HH:mm","value-type":"format","type":"time","placeholder":"HH:mm"},model:{value:(_vm.value),callback:function ($$v) {_vm.value=$$v},expression:"value"}})],1)}
var staticRenderFns = []

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{}],"hxWp":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  name: 'FixedTimeList',
  data: function data() {
    return {
      value: null
    };
  }
};
exports.default = _default;
        var $509c90 = exports.default || module.exports;
      
      if (typeof $509c90 === 'function') {
        $509c90 = $509c90.options;
      }
    
        /* template */
        Object.assign($509c90, (function () {
          var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('date-picker',{attrs:{"time-picker-options":{
      start: '08:30',
      step: '00:30',
      end: '18:30',
    },"format":"hh:mm a","type":"time","placeholder":"hh:mm a"},model:{value:(_vm.value),callback:function ($$v) {_vm.value=$$v},expression:"value"}})],1)}
var staticRenderFns = []

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{}],"TYGO":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  data: function data() {
    return {
      value1: new Date(),
      value2: new Date(),
      value3: new Date()
    };
  }
};
exports.default = _default;
        var $799230 = exports.default || module.exports;
      
      if (typeof $799230 === 'function') {
        $799230 = $799230.options;
      }
    
        /* template */
        Object.assign($799230, (function () {
          var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_c('section',[_c('p',[_vm._v("disabled = \"true\"")]),_vm._v(" "),_c('date-picker',{attrs:{"disabled":""},model:{value:(_vm.value1),callback:function ($$v) {_vm.value1=$$v},expression:"value1"}})],1),_vm._v(" "),_c('section',[_c('p',[_vm._v("editable = \"false\"")]),_vm._v(" "),_c('date-picker',{attrs:{"editable":false},model:{value:(_vm.value2),callback:function ($$v) {_vm.value2=$$v},expression:"value2"}})],1),_vm._v(" "),_c('section',[_c('p',[_vm._v("clearable = \"false\"")]),_vm._v(" "),_c('date-picker',{attrs:{"clearable":false},model:{value:(_vm.value3),callback:function ($$v) {_vm.value3=$$v},expression:"value3"}})],1)])}
var staticRenderFns = []

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{}],"A2T1":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _highlight = _interopRequireDefault(require("highlight.js/lib/highlight"));

var _javascript = _interopRequireDefault(require("highlight.js/lib/languages/javascript"));

var _xml = _interopRequireDefault(require("highlight.js/lib/languages/xml"));

require("highlight.js/styles/atom-one-light.css");

var _container = _interopRequireDefault(require("./helper/container.vue"));

var _card = _interopRequireDefault(require("./helper/card.vue"));

var _Basic = _interopRequireDefault(require("./demo/Basic.vue"));

var _ValueType = _interopRequireDefault(require("./demo/ValueType.vue"));

var _Range = _interopRequireDefault(require("./demo/Range.vue"));

var _DisabledDateTime = _interopRequireDefault(require("./demo/DisabledDateTime.vue"));

var _Shortcut = _interopRequireDefault(require("./demo/Shortcut.vue"));

var _ControlTimePanel = _interopRequireDefault(require("./demo/ControlTimePanel.vue"));

var _ControlOpen = _interopRequireDefault(require("./demo/ControlOpen.vue"));

var _HideSeconds = _interopRequireDefault(require("./demo/HideSeconds.vue"));

var _MinuteStep = _interopRequireDefault(require("./demo/MinuteStep.vue"));

var _FixedTimeList = _interopRequireDefault(require("./demo/FixedTimeList.vue"));

var _Disabled = _interopRequireDefault(require("./demo/Disabled.vue"));

var _en = _interopRequireDefault(require("./en.md"));

var _zhCn = _interopRequireDefault(require("./zh-cn.md"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

_highlight.default.registerLanguage('javascript', _javascript.default);

_highlight.default.registerLanguage('xml', _xml.default);

var components = [{
  id: 'Basic',
  component: _Basic.default,
  code: "<template>\n  <div class=\"box\">\n    <section>\n      <p>date (default)</p>\n      <date-picker\n        v-model=\"value1\"\n        format=\"YYYY-MM-DD\"\n        type=\"date\"\n        placeholder=\"Select date\"\n      ></date-picker>\n    </section>\n    <section>\n      <p>month</p>\n      <date-picker v-model=\"value2\" type=\"month\" placeholder=\"Select month\"></date-picker>\n    </section>\n    <section>\n      <p>year</p>\n      <date-picker v-model=\"value3\" type=\"year\" placeholder=\"Select year\"></date-picker>\n    </section>\n    <section>\n      <p>datetime</p>\n      <date-picker v-model=\"value4\" type=\"datetime\" placeholder=\"Select datetime\"></date-picker>\n    </section>\n    <section>\n      <p>time</p>\n      <date-picker v-model=\"value5\" type=\"time\" placeholder=\"Select time\"></date-picker>\n    </section>\n    <section>\n      <p>week</p>\n      <date-picker v-model=\"value6\" type=\"week\" placeholder=\"Select week\"></date-picker>\n    </section>\n  </div>\n</template>\n\n<script>\nexport default {\n  name: 'Basic',\n  data() {\n    return {\n      value1: null,\n      value2: null,\n      value3: null,\n      value4: null,\n      value5: null,\n      value6: null,\n    };\n  },\n};\n</script>\n"
}, {
  id: 'ValueType',
  component: _ValueType.default,
  code: "<template>\n  <div class=\"box\">\n    <section>\n      <p>format</p>\n      <date-picker v-model=\"value2\" value-type=\"format\" format=\"YYYY-MM-DD\"></date-picker>\n      <p>\n        <code>v-model = {{ value2 }}</code>\n      </p>\n    </section>\n    <section>\n      <p>date (Date Object)</p>\n      <date-picker v-model=\"value1\" value-type=\"date\"></date-picker>\n      <p>\n        <code>v-model = {{ value1 }}</code>\n      </p>\n    </section>\n    <section>\n      <p>timestamp</p>\n      <date-picker v-model=\"value3\" value-type=\"timestamp\"></date-picker>\n      <p>\n        <code>v-model = {{ value3 }}</code>\n      </p>\n    </section>\n    <section>\n      <p>DD/MM/YYYY</p>\n      <date-picker v-model=\"value4\" value-type=\"DD/MM/YYYY\" format=\"YYYY-MM-DD\"></date-picker>\n      <p>\n        <code>v-model = {{ value4 }}</code>\n      </p>\n    </section>\n  </div>\n</template>\n\n<script>\nexport default {\n  name: 'ValueType',\n  data() {\n    return {\n      value1: new Date(2019, 9, 9),\n      value2: '2019-10-09',\n      value3: new Date(2019, 9, 9).getTime(),\n      value4: '09/10/2019',\n    };\n  },\n};\n</script>\n"
}, {
  id: 'Range',
  component: _Range.default,
  code: "<template>\n  <div class=\"box\">\n    <section>\n      <p>date range</p>\n      <date-picker v-model=\"value1\" type=\"date\" range placeholder=\"Select date range\"></date-picker>\n    </section>\n    <section>\n      <p>datetime range</p>\n      <date-picker\n        v-model=\"value2\"\n        type=\"datetime\"\n        range\n        placeholder=\"Select datetime range\"\n      ></date-picker>\n    </section>\n  </div>\n</template>\n\n<script>\nexport default {\n  name: 'Range',\n  data() {\n    return {\n      value1: [new Date(2019, 9, 8), new Date(2019, 9, 19)],\n      value2: [],\n    };\n  },\n};\n</script>\n"
}, {
  id: 'HideSeconds',
  component: _HideSeconds.default,
  code: "<template>\n  <div>\n    <date-picker\n      v-model=\"value\"\n      format=\"hh:mm a\"\n      value-type=\"format\"\n      type=\"time\"\n      placeholder=\"hh:mm a\"\n    ></date-picker>\n  </div>\n</template>\n\n<script>\nexport default {\n  name: 'ControlOpen',\n  data() {\n    return {\n      value: '',\n    };\n  },\n};\n</script>\n"
}, {
  id: 'MinuteStep',
  component: _MinuteStep.default,
  code: "<template>\n  <div>\n    <date-picker\n      v-model=\"value\"\n      :minute-step=\"30\"\n      :hour-options=\"hours\"\n      format=\"HH:mm\"\n      value-type=\"format\"\n      type=\"time\"\n      placeholder=\"HH:mm\"\n    ></date-picker>\n  </div>\n</template>\n\n<script>\nexport default {\n  name: 'ControlOpen',\n  data() {\n    return {\n      value: '',\n      hours: Array.from({ length: 10 }).map((_, i) => i + 8),\n    };\n  },\n};\n</script>\n"
}, {
  id: 'FixedTimeList',
  component: _FixedTimeList.default,
  code: "<template>\n  <div>\n    <date-picker\n      v-model=\"value\"\n      :time-picker-options=\"{\n        start: '08:30',\n        step: '00:30',\n        end: '18:30',\n      }\"\n      format=\"hh:mm a\"\n      type=\"time\"\n      placeholder=\"hh:mm a\"\n    ></date-picker>\n  </div>\n</template>\n\n<script>\nexport default {\n  name: 'FixedTimeList',\n  data() {\n    return {\n      value: null,\n    };\n  },\n};\n</script>\n"
}, {
  id: 'DisabledDateTime',
  component: _DisabledDateTime.default,
  code: "<template>\n  <div class=\"box\">\n    <section>\n      <p>date not before today</p>\n      <date-picker v-model=\"value1\" :disabled-date=\"notBeforeToday\"></date-picker>\n    </section>\n    <section>\n      <p>date not after today</p>\n      <date-picker v-model=\"value2\" :disabled-date=\"notAfterToday\"></date-picker>\n    </section>\n    <section>\n      <p>time not before 09:00</p>\n      <date-picker\n        v-model=\"value3\"\n        value-type=\"format\"\n        type=\"time\"\n        placeholder=\"HH:mm:ss\"\n        :default-value=\"new Date().setHours(9, 0, 0)\"\n        :disabled-time=\"notBeforeNine\"\n      ></date-picker>\n    </section>\n    <section>\n      <p>datetime not before 2019-10-09 12:00</p>\n      <date-picker\n        v-model=\"value4\"\n        type=\"datetime\"\n        :disabled-date=\"notBeforeDate\"\n        :disabled-time=\"notBeforeTime\"\n        value-type=\"format\"\n      ></date-picker>\n    </section>\n  </div>\n</template>\n\n<script>\nconst today = new Date();\ntoday.setHours(0, 0, 0, 0);\n\nexport default {\n  data() {\n    return {\n      value1: new Date(),\n      value2: new Date(),\n      value3: '',\n      value4: '',\n      value5: '',\n    };\n  },\n  methods: {\n    notBeforeToday(date) {\n      return date < today;\n    },\n    notAfterToday(date) {\n      return date > today;\n    },\n    notBeforeNine(date) {\n      return date.getHours() < 9;\n    },\n    notBeforeDate(date) {\n      return date < new Date(2019, 9, 9);\n    },\n    notBeforeTime(date) {\n      return date < new Date(2019, 9, 9, 12);\n    },\n  },\n};\n</script>\n"
}, {
  id: 'Disabled',
  component: _Disabled.default,
  code: "<template>\n  <div class=\"box\">\n    <section>\n      <p>disabled = \"true\"</p>\n      <date-picker v-model=\"value1\" disabled></date-picker>\n    </section>\n    <section>\n      <p>editable = \"false\"</p>\n      <date-picker v-model=\"value2\" :editable=\"false\"></date-picker>\n    </section>\n    <section>\n      <p>clearable = \"false\"</p>\n      <date-picker v-model=\"value3\" :clearable=\"false\"></date-picker>\n    </section>\n  </div>\n</template>\n\n<script>\nexport default {\n  data() {\n    return {\n      value1: new Date(),\n      value2: new Date(),\n      value3: new Date(),\n    };\n  },\n};\n</script>\n"
}, {
  id: 'Shortcut',
  component: _Shortcut.default,
  code: "<template>\n  <div class=\"box\">\n    <section>\n      <p>shortcuts</p>\n      <date-picker v-model=\"value1\" :shortcuts=\"shortcuts\" placeholder=\"Select date\"></date-picker>\n    </section>\n    <section>\n      <p>header slot</p>\n      <date-picker v-model=\"value2\" placeholder=\"Select date\">\n        <template v-slot:header=\"{ emit }\">\n          <button class=\"mx-btn mx-btn-text\" @click=\"emit(new Date())\">Today</button>\n        </template>\n      </date-picker>\n    </section>\n    <section>\n      <p>footer slot</p>\n      <date-picker v-model=\"value3\" range placeholder=\"Select date range\">\n        <template v-slot:footer=\"{ emit }\">\n          <div style=\"text-align: left\">\n            <button class=\"mx-btn mx-btn-text\" @click=\"selectNextThreeDay(emit)\">\n              NextThreeDay\n            </button>\n          </div>\n        </template>\n      </date-picker>\n    </section>\n  </div>\n</template>\n\n<script>\nexport default {\n  name: 'Basic',\n  data() {\n    return {\n      value1: null,\n      value2: null,\n      value3: null,\n      shortcuts: [\n        {\n          text: 'Today',\n          onClick() {\n            const date = new Date();\n            // return a Date\n            return date;\n          },\n        },\n        {\n          text: 'Yesterday',\n          onClick() {\n            const date = new Date();\n            date.setTime(date.getTime() - 3600 * 1000 * 24);\n            return date;\n          },\n        },\n      ],\n    };\n  },\n  methods: {\n    selectNextThreeDay(emit) {\n      const start = new Date();\n      const end = new Date();\n      end.setTime(end.getTime() + 3 * 24 * 3600 * 1000);\n      const date = [start, end];\n      emit(date);\n    },\n  },\n};\n</script>\n"
}, {
  id: 'ControlTimePanel',
  component: _ControlTimePanel.default,
  code: "<template>\n  <div class=\"box\">\n    <section>\n      <date-picker\n        v-model=\"value1\"\n        type=\"datetime\"\n        placeholder=\"Select datetime\"\n        :show-time-panel=\"showTimePanel\"\n        @close=\"handleOpenChange\"\n      >\n        <template v-slot:footer>\n          <button class=\"mx-btn mx-btn-text\" @click=\"toggleTimePanel\">\n            {{ showTimePanel ? 'select date' : 'select time' }}\n          </button>\n        </template>\n      </date-picker>\n    </section>\n    <section>\n      <date-picker\n        v-model=\"value2\"\n        type=\"datetime\"\n        placeholder=\"Select datetime range\"\n        range\n        :show-time-panel=\"showTimeRangePanel\"\n        @close=\"handleRangeClose\"\n      >\n        <template v-slot:footer>\n          <button class=\"mx-btn mx-btn-text\" @click=\"toggleTimeRangePanel\">\n            {{ showTimeRangePanel ? 'select date' : 'select time' }}\n          </button>\n        </template>\n      </date-picker>\n    </section>\n  </div>\n</template>\n\n<script>\nexport default {\n  data() {\n    return {\n      value1: null,\n      value2: [],\n      showTimePanel: false,\n      showTimeRangePanel: false,\n    };\n  },\n  methods: {\n    toggleTimePanel() {\n      this.showTimePanel = !this.showTimePanel;\n    },\n    toggleTimeRangePanel() {\n      this.showTimeRangePanel = !this.showTimeRangePanel;\n    },\n    handleOpenChange() {\n      this.showTimePanel = false;\n    },\n    handleRangeClose() {\n      this.showTimeRangePanel = false;\n    },\n  },\n};\n</script>\n"
}, {
  id: 'ControlOpen',
  component: _ControlOpen.default,
  code: "<template>\n  <div>\n    <date-picker\n      v-model=\"value\"\n      value-type=\"format\"\n      type=\"time\"\n      :open.sync=\"open\"\n      placeholder=\"Select time\"\n      @change=\"handleChange\"\n    ></date-picker>\n  </div>\n</template>\n\n<script>\nexport default {\n  name: 'ControlOpen',\n  data() {\n    return {\n      value: null,\n      open: false,\n    };\n  },\n  methods: {\n    handleChange(value, type) {\n      if (type === 'second') {\n        this.open = false;\n      }\n    },\n  },\n};\n</script>\n"
}];

function transformMd(text) {
  var array = text.split(/\n(?=<!-)/);

  var getId = function getId(s) {
    var result = s.match(/<!--\s*(\w+)\s*-->/);
    return result && result[1].trim();
  };

  var getTitleAndDescription = function getTitleAndDescription(s) {
    var result = s.match(/<h.*?>(.*?)<\/h\d>/);
    if (!result) return null;
    var title = result[1];
    var description = s.slice(result[0].length + result.index);
    return {
      title: title.trim().replace(/&amp;/g, '&'),
      description: description.trim()
    };
  };

  var result = {};
  array.forEach(function (str) {
    var id = getId(str);

    if (id) {
      result[id] = getTitleAndDescription(str);
    }
  });
  return result;
}

var docMap = {
  en: transformMd(_en.default),
  'zh-cn': transformMd(_zhCn.default)
};
var App = {
  name: 'App',
  props: {
    changeLocale: {
      type: Function,
      default: function _default() {
        return '';
      }
    }
  },
  data: function data() {
    return {
      lang: 'en',
      hackReset: true,
      currentId: this.getCurrentId()
    };
  },
  mounted: function mounted() {
    var _this = this;

    _highlight.default.initHighlighting();

    window.onhashchange = function () {
      _this.currentId = _this.getCurrentId();
    };

    if (this.currentId) {
      document.getElementById(this.currentId).scrollIntoView();
    }
  },
  methods: {
    getCurrentId: function getCurrentId() {
      return location.hash.slice(1);
    },
    handleChangeLocale: function handleChangeLocale() {
      var _this2 = this;

      var lang = this.lang === 'en' ? 'zh-cn' : 'en';
      this.lang = lang;
      this.changeLocale(lang);
      this.hackReset = false;
      this.$nextTick(function () {
        _this2.hackReset = true;
      });
    }
  },
  render: function render(h) {
    var _this3 = this;

    var doc = docMap[this.lang] || docMap.en;
    var menus = components.map(function (item) {
      return _objectSpread({
        id: item.id
      }, doc[item.id]);
    });
    return h(_container.default, {
      attrs: {
        menus: menus
      }
    }, [h("div", {
      style: {
        textAlign: 'right'
      }
    }, [h("a", {
      style: "margin-right: 10px",
      "class": "mx-btn-text mx-btn",
      attrs: {
        href: "https://github.com/mengxiong10/vue2-datepicker",
        target: "_blank"
      }
    }, ["GitHub"]), h("button", {
      on: {
        "click": this.handleChangeLocale
      },
      "class": "mx-btn"
    }, [this.lang === 'en' ? '中文' : 'English'])]), this.hackReset && components.map(function (item) {
      var component = item.component,
          id = item.id,
          code = item.code;

      var props = _objectSpread({
        id: id,
        code: code,
        active: id === _this3.currentId
      }, doc[id]);

      return h(_card.default, {
        props: props
      }, [h(component)]);
    })]);
  }
};
var _default = App;
exports.default = _default;
},{"fs":"rDCW","highlight.js/lib/highlight":"R7gn","highlight.js/lib/languages/javascript":"YrXX","highlight.js/lib/languages/xml":"ElH3","highlight.js/styles/atom-one-light.css":"rDCW","./helper/container.vue":"exOZ","./helper/card.vue":"K2WH","./demo/Basic.vue":"F4k5","./demo/ValueType.vue":"MAVg","./demo/Range.vue":"vssy","./demo/DisabledDateTime.vue":"tBXd","./demo/Shortcut.vue":"U8rn","./demo/ControlTimePanel.vue":"jkBQ","./demo/ControlOpen.vue":"hLWH","./demo/HideSeconds.vue":"P315","./demo/MinuteStep.vue":"WCZR","./demo/FixedTimeList.vue":"hxWp","./demo/Disabled.vue":"TYGO","./en.md":"yxg7","./zh-cn.md":"u7Vb"}],"Focm":[function(require,module,exports) {
"use strict";

var _app = _interopRequireDefault(require("./app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.DatePicker.locale('en');
new window.Vue({
  render: function render(h) {
    return h(_app.default, {
      props: {
        changeLocale: window.DatePicker.locale
      }
    });
  }
}).$mount('#app');
},{"./app":"A2T1"}],"FheM":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"TUK3":[function(require,module,exports) {
var getBundleURL = require('./bundle-url').getBundleURL;

function loadBundlesLazy(bundles) {
  if (!Array.isArray(bundles)) {
    bundles = [bundles];
  }

  var id = bundles[bundles.length - 1];

  try {
    return Promise.resolve(require(id));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return new LazyPromise(function (resolve, reject) {
        loadBundles(bundles.slice(0, -1)).then(function () {
          return require(id);
        }).then(resolve, reject);
      });
    }

    throw err;
  }
}

function loadBundles(bundles) {
  return Promise.all(bundles.map(loadBundle));
}

var bundleLoaders = {};

function registerBundleLoader(type, loader) {
  bundleLoaders[type] = loader;
}

module.exports = exports = loadBundlesLazy;
exports.load = loadBundles;
exports.register = registerBundleLoader;
var bundles = {};

function loadBundle(bundle) {
  var id;

  if (Array.isArray(bundle)) {
    id = bundle[1];
    bundle = bundle[0];
  }

  if (bundles[bundle]) {
    return bundles[bundle];
  }

  var type = (bundle.substring(bundle.lastIndexOf('.') + 1, bundle.length) || bundle).toLowerCase();
  var bundleLoader = bundleLoaders[type];

  if (bundleLoader) {
    return bundles[bundle] = bundleLoader(getBundleURL() + bundle).then(function (resolved) {
      if (resolved) {
        module.bundle.register(id, resolved);
      }

      return resolved;
    }).catch(function (e) {
      delete bundles[bundle];
      throw e;
    });
  }
}

function LazyPromise(executor) {
  this.executor = executor;
  this.promise = null;
}

LazyPromise.prototype.then = function (onSuccess, onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.then(onSuccess, onError);
};

LazyPromise.prototype.catch = function (onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.catch(onError);
};
},{"./bundle-url":"FheM"}],"A3BY":[function(require,module,exports) {
module.exports = function loadHTMLBundle(bundle) {
  return fetch(bundle).then(function (res) {
    return res.text();
  });
};
},{}],0:[function(require,module,exports) {
var b=require("TUK3");b.register("html",require("A3BY"));b.load([["en.41eb6cda.html","yxg7"],["zh-cn.27351eac.html","u7Vb"]]).then(function(){require("Focm");});
},{}]},{},[0], null)