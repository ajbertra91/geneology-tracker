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
})({"node_modules/lit-html/lib/directive.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDirective = exports.directive = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const directives = new WeakMap();
/**
 * Brands a function as a directive factory function so that lit-html will call
 * the function during template rendering, rather than passing as a value.
 *
 * A _directive_ is a function that takes a Part as an argument. It has the
 * signature: `(part: Part) => void`.
 *
 * A directive _factory_ is a function that takes arguments for data and
 * configuration and returns a directive. Users of directive usually refer to
 * the directive factory as the directive. For example, "The repeat directive".
 *
 * Usually a template author will invoke a directive factory in their template
 * with relevant arguments, which will then return a directive function.
 *
 * Here's an example of using the `repeat()` directive factory that takes an
 * array and a function to render an item:
 *
 * ```js
 * html`<ul><${repeat(items, (item) => html`<li>${item}</li>`)}</ul>`
 * ```
 *
 * When `repeat` is invoked, it returns a directive function that closes over
 * `items` and the template function. When the outer template is rendered, the
 * return directive function is called with the Part for the expression.
 * `repeat` then performs it's custom logic to render multiple items.
 *
 * @param f The directive factory function. Must be a function that returns a
 * function of the signature `(part: Part) => void`. The returned function will
 * be called with the part object.
 *
 * @example
 *
 * import {directive, html} from 'lit-html';
 *
 * const immutable = directive((v) => (part) => {
 *   if (part.value !== v) {
 *     part.setValue(v)
 *   }
 * });
 */

const directive = f => (...args) => {
  const d = f(...args);
  directives.set(d, true);
  return d;
};

exports.directive = directive;

const isDirective = o => {
  return typeof o === 'function' && directives.has(o);
};

exports.isDirective = isDirective;
},{}],"node_modules/lit-html/lib/dom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeNodes = exports.reparentNodes = exports.isCEPolyfill = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * True if the custom elements polyfill is in use.
 */
const isCEPolyfill = window.customElements !== undefined && window.customElements.polyfillWrapFlushCallback !== undefined;
/**
 * Reparents nodes, starting from `start` (inclusive) to `end` (exclusive),
 * into another container (could be the same container), before `before`. If
 * `before` is null, it appends the nodes to the container.
 */

exports.isCEPolyfill = isCEPolyfill;

const reparentNodes = (container, start, end = null, before = null) => {
  while (start !== end) {
    const n = start.nextSibling;
    container.insertBefore(start, before);
    start = n;
  }
};
/**
 * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
 * `container`.
 */


exports.reparentNodes = reparentNodes;

const removeNodes = (container, start, end = null) => {
  while (start !== end) {
    const n = start.nextSibling;
    container.removeChild(start);
    start = n;
  }
};

exports.removeNodes = removeNodes;
},{}],"node_modules/lit-html/lib/part.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nothing = exports.noChange = void 0;

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = {};
/**
 * A sentinel value that signals a NodePart to fully clear its content.
 */

exports.noChange = noChange;
const nothing = {};
exports.nothing = nothing;
},{}],"node_modules/lit-html/lib/template.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lastAttributeNameRegex = exports.createMarker = exports.isTemplatePartActive = exports.Template = exports.boundAttributeSuffix = exports.markerRegex = exports.nodeMarker = exports.marker = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */

exports.marker = marker;
const nodeMarker = `<!--${marker}-->`;
exports.nodeMarker = nodeMarker;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * Suffix appended to all bound attribute names.
 */

exports.markerRegex = markerRegex;
const boundAttributeSuffix = '$lit$';
/**
 * An updateable Template that tracks the location of dynamic parts.
 */

exports.boundAttributeSuffix = boundAttributeSuffix;

class Template {
  constructor(result, element) {
    this.parts = [];
    this.element = element;
    const nodesToRemove = [];
    const stack = []; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null

    const walker = document.createTreeWalker(element.content, 133
    /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
    , null, false); // Keeps track of the last index associated with a part. We try to delete
    // unnecessary nodes, but we never want to associate two different parts
    // to the same index. They must have a constant node between.

    let lastPartIndex = 0;
    let index = -1;
    let partIndex = 0;
    const {
      strings,
      values: {
        length
      }
    } = result;

    while (partIndex < length) {
      const node = walker.nextNode();

      if (node === null) {
        // We've exhausted the content inside a nested template element.
        // Because we still have parts (the outer for-loop), we know:
        // - There is a template in the stack
        // - The walker will find a nextNode outside the template
        walker.currentNode = stack.pop();
        continue;
      }

      index++;

      if (node.nodeType === 1
      /* Node.ELEMENT_NODE */
      ) {
          if (node.hasAttributes()) {
            const attributes = node.attributes;
            const {
              length
            } = attributes; // Per
            // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
            // attributes are not guaranteed to be returned in document order.
            // In particular, Edge/IE can return them out of order, so we cannot
            // assume a correspondence between part index and attribute index.

            let count = 0;

            for (let i = 0; i < length; i++) {
              if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                count++;
              }
            }

            while (count-- > 0) {
              // Get the template literal section leading up to the first
              // expression in this attribute
              const stringForPart = strings[partIndex]; // Find the attribute name

              const name = lastAttributeNameRegex.exec(stringForPart)[2]; // Find the corresponding attribute
              // All bound attributes have had a suffix added in
              // TemplateResult#getHTML to opt out of special attribute
              // handling. To look up the attribute value we also need to add
              // the suffix.

              const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
              const attributeValue = node.getAttribute(attributeLookupName);
              node.removeAttribute(attributeLookupName);
              const statics = attributeValue.split(markerRegex);
              this.parts.push({
                type: 'attribute',
                index,
                name,
                strings: statics
              });
              partIndex += statics.length - 1;
            }
          }

          if (node.tagName === 'TEMPLATE') {
            stack.push(node);
            walker.currentNode = node.content;
          }
        } else if (node.nodeType === 3
      /* Node.TEXT_NODE */
      ) {
          const data = node.data;

          if (data.indexOf(marker) >= 0) {
            const parent = node.parentNode;
            const strings = data.split(markerRegex);
            const lastIndex = strings.length - 1; // Generate a new text node for each literal section
            // These nodes are also used as the markers for node parts

            for (let i = 0; i < lastIndex; i++) {
              let insert;
              let s = strings[i];

              if (s === '') {
                insert = createMarker();
              } else {
                const match = lastAttributeNameRegex.exec(s);

                if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                  s = s.slice(0, match.index) + match[1] + match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                }

                insert = document.createTextNode(s);
              }

              parent.insertBefore(insert, node);
              this.parts.push({
                type: 'node',
                index: ++index
              });
            } // If there's no text, we must insert a comment to mark our place.
            // Else, we can trust it will stick around after cloning.


            if (strings[lastIndex] === '') {
              parent.insertBefore(createMarker(), node);
              nodesToRemove.push(node);
            } else {
              node.data = strings[lastIndex];
            } // We have a part for each match found


            partIndex += lastIndex;
          }
        } else if (node.nodeType === 8
      /* Node.COMMENT_NODE */
      ) {
          if (node.data === marker) {
            const parent = node.parentNode; // Add a new marker node to be the startNode of the Part if any of
            // the following are true:
            //  * We don't have a previousSibling
            //  * The previousSibling is already the start of a previous part

            if (node.previousSibling === null || index === lastPartIndex) {
              index++;
              parent.insertBefore(createMarker(), node);
            }

            lastPartIndex = index;
            this.parts.push({
              type: 'node',
              index
            }); // If we don't have a nextSibling, keep this node so we have an end.
            // Else, we can remove it to save future costs.

            if (node.nextSibling === null) {
              node.data = '';
            } else {
              nodesToRemove.push(node);
              index--;
            }

            partIndex++;
          } else {
            let i = -1;

            while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
              // Comment node has a binding marker inside, make an inactive part
              // The binding won't work, but subsequent bindings will
              // TODO (justinfagnani): consider whether it's even worth it to
              // make bindings in comments work
              this.parts.push({
                type: 'node',
                index: -1
              });
              partIndex++;
            }
          }
        }
    } // Remove text binding nodes after the walk to not disturb the TreeWalker


    for (const n of nodesToRemove) {
      n.parentNode.removeChild(n);
    }
  }

}

exports.Template = Template;

const endsWith = (str, suffix) => {
  const index = str.length - suffix.length;
  return index >= 0 && str.slice(index) === suffix;
};

const isTemplatePartActive = part => part.index !== -1; // Allows `document.createComment('')` to be renamed for a
// small manual size-savings.


exports.isTemplatePartActive = isTemplatePartActive;

const createMarker = () => document.createComment('');
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-characters
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
 * space character except " ".
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */


exports.createMarker = createMarker;
const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
exports.lastAttributeNameRegex = lastAttributeNameRegex;
},{}],"node_modules/lit-html/lib/template-instance.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TemplateInstance = void 0;

var _dom = require("./dom.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module lit-html
 */

/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
  constructor(template, processor, options) {
    this.__parts = [];
    this.template = template;
    this.processor = processor;
    this.options = options;
  }

  update(values) {
    let i = 0;

    for (const part of this.__parts) {
      if (part !== undefined) {
        part.setValue(values[i]);
      }

      i++;
    }

    for (const part of this.__parts) {
      if (part !== undefined) {
        part.commit();
      }
    }
  }

  _clone() {
    // There are a number of steps in the lifecycle of a template instance's
    // DOM fragment:
    //  1. Clone - create the instance fragment
    //  2. Adopt - adopt into the main document
    //  3. Process - find part markers and create parts
    //  4. Upgrade - upgrade custom elements
    //  5. Update - set node, attribute, property, etc., values
    //  6. Connect - connect to the document. Optional and outside of this
    //     method.
    //
    // We have a few constraints on the ordering of these steps:
    //  * We need to upgrade before updating, so that property values will pass
    //    through any property setters.
    //  * We would like to process before upgrading so that we're sure that the
    //    cloned fragment is inert and not disturbed by self-modifying DOM.
    //  * We want custom elements to upgrade even in disconnected fragments.
    //
    // Given these constraints, with full custom elements support we would
    // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
    //
    // But Safari dooes not implement CustomElementRegistry#upgrade, so we
    // can not implement that order and still have upgrade-before-update and
    // upgrade disconnected fragments. So we instead sacrifice the
    // process-before-upgrade constraint, since in Custom Elements v1 elements
    // must not modify their light DOM in the constructor. We still have issues
    // when co-existing with CEv0 elements like Polymer 1, and with polyfills
    // that don't strictly adhere to the no-modification rule because shadow
    // DOM, which may be created in the constructor, is emulated by being placed
    // in the light DOM.
    //
    // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
    // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
    // in one step.
    //
    // The Custom Elements v1 polyfill supports upgrade(), so the order when
    // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
    // Connect.
    const fragment = _dom.isCEPolyfill ? this.template.element.content.cloneNode(true) : document.importNode(this.template.element.content, true);
    const stack = [];
    const parts = this.template.parts; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null

    const walker = document.createTreeWalker(fragment, 133
    /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
    , null, false);
    let partIndex = 0;
    let nodeIndex = 0;
    let part;
    let node = walker.nextNode(); // Loop through all the nodes and parts of a template

    while (partIndex < parts.length) {
      part = parts[partIndex];

      if (!(0, _template.isTemplatePartActive)(part)) {
        this.__parts.push(undefined);

        partIndex++;
        continue;
      } // Progress the tree walker until we find our next part's node.
      // Note that multiple parts may share the same node (attribute parts
      // on a single element), so this loop may not run at all.


      while (nodeIndex < part.index) {
        nodeIndex++;

        if (node.nodeName === 'TEMPLATE') {
          stack.push(node);
          walker.currentNode = node.content;
        }

        if ((node = walker.nextNode()) === null) {
          // We've exhausted the content inside a nested template element.
          // Because we still have parts (the outer for-loop), we know:
          // - There is a template in the stack
          // - The walker will find a nextNode outside the template
          walker.currentNode = stack.pop();
          node = walker.nextNode();
        }
      } // We've arrived at our part's node.


      if (part.type === 'node') {
        const part = this.processor.handleTextExpression(this.options);
        part.insertAfterNode(node.previousSibling);

        this.__parts.push(part);
      } else {
        this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
      }

      partIndex++;
    }

    if (_dom.isCEPolyfill) {
      document.adoptNode(fragment);
      customElements.upgrade(fragment);
    }

    return fragment;
  }

}

exports.TemplateInstance = TemplateInstance;
},{"./dom.js":"node_modules/lit-html/lib/dom.js","./template.js":"node_modules/lit-html/lib/template.js"}],"node_modules/lit-html/lib/template-result.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SVGTemplateResult = exports.TemplateResult = void 0;

var _dom = require("./dom.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module lit-html
 */
const commentMarker = ` ${_template.marker} `;
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */

class TemplateResult {
  constructor(strings, values, type, processor) {
    this.strings = strings;
    this.values = values;
    this.type = type;
    this.processor = processor;
  }
  /**
   * Returns a string of HTML used to create a `<template>` element.
   */


  getHTML() {
    const l = this.strings.length - 1;
    let html = '';
    let isCommentBinding = false;

    for (let i = 0; i < l; i++) {
      const s = this.strings[i]; // For each binding we want to determine the kind of marker to insert
      // into the template source before it's parsed by the browser's HTML
      // parser. The marker type is based on whether the expression is in an
      // attribute, text, or comment poisition.
      //   * For node-position bindings we insert a comment with the marker
      //     sentinel as its text content, like <!--{{lit-guid}}-->.
      //   * For attribute bindings we insert just the marker sentinel for the
      //     first binding, so that we support unquoted attribute bindings.
      //     Subsequent bindings can use a comment marker because multi-binding
      //     attributes must be quoted.
      //   * For comment bindings we insert just the marker sentinel so we don't
      //     close the comment.
      //
      // The following code scans the template source, but is *not* an HTML
      // parser. We don't need to track the tree structure of the HTML, only
      // whether a binding is inside a comment, and if not, if it appears to be
      // the first binding in an attribute.

      const commentOpen = s.lastIndexOf('<!--'); // We're in comment position if we have a comment open with no following
      // comment close. Because <-- can appear in an attribute value there can
      // be false positives.

      isCommentBinding = (commentOpen > -1 || isCommentBinding) && s.indexOf('-->', commentOpen + 1) === -1; // Check to see if we have an attribute-like sequence preceeding the
      // expression. This can match "name=value" like structures in text,
      // comments, and attribute values, so there can be false-positives.

      const attributeMatch = _template.lastAttributeNameRegex.exec(s);

      if (attributeMatch === null) {
        // We're only in this branch if we don't have a attribute-like
        // preceeding sequence. For comments, this guards against unusual
        // attribute values like <div foo="<!--${'bar'}">. Cases like
        // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
        // below.
        html += s + (isCommentBinding ? commentMarker : _template.nodeMarker);
      } else {
        // For attributes we use just a marker sentinel, and also append a
        // $lit$ suffix to the name to opt-out of attribute-specific parsing
        // that IE and Edge do for style and certain SVG attributes.
        html += s.substr(0, attributeMatch.index) + attributeMatch[1] + attributeMatch[2] + _template.boundAttributeSuffix + attributeMatch[3] + _template.marker;
      }
    }

    html += this.strings[l];
    return html;
  }

  getTemplateElement() {
    const template = document.createElement('template');
    template.innerHTML = this.getHTML();
    return template;
  }

}
/**
 * A TemplateResult for SVG fragments.
 *
 * This class wraps HTML in an `<svg>` tag in order to parse its contents in the
 * SVG namespace, then modifies the template to remove the `<svg>` tag so that
 * clones only container the original fragment.
 */


exports.TemplateResult = TemplateResult;

class SVGTemplateResult extends TemplateResult {
  getHTML() {
    return `<svg>${super.getHTML()}</svg>`;
  }

  getTemplateElement() {
    const template = super.getTemplateElement();
    const content = template.content;
    const svgElement = content.firstChild;
    content.removeChild(svgElement);
    (0, _dom.reparentNodes)(content, svgElement.firstChild);
    return template;
  }

}

exports.SVGTemplateResult = SVGTemplateResult;
},{"./dom.js":"node_modules/lit-html/lib/dom.js","./template.js":"node_modules/lit-html/lib/template.js"}],"node_modules/lit-html/lib/parts.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventPart = exports.PropertyPart = exports.PropertyCommitter = exports.BooleanAttributePart = exports.NodePart = exports.AttributePart = exports.AttributeCommitter = exports.isIterable = exports.isPrimitive = void 0;

var _directive = require("./directive.js");

var _dom = require("./dom.js");

var _part = require("./part.js");

var _templateInstance = require("./template-instance.js");

var _templateResult = require("./template-result.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module lit-html
 */
const isPrimitive = value => {
  return value === null || !(typeof value === 'object' || typeof value === 'function');
};

exports.isPrimitive = isPrimitive;

const isIterable = value => {
  return Array.isArray(value) || // tslint:disable-next-line:no-any
  !!(value && value[Symbol.iterator]);
};
/**
 * Writes attribute values to the DOM for a group of AttributeParts bound to a
 * single attibute. The value is only set once even if there are multiple parts
 * for an attribute.
 */


exports.isIterable = isIterable;

class AttributeCommitter {
  constructor(element, name, strings) {
    this.dirty = true;
    this.element = element;
    this.name = name;
    this.strings = strings;
    this.parts = [];

    for (let i = 0; i < strings.length - 1; i++) {
      this.parts[i] = this._createPart();
    }
  }
  /**
   * Creates a single part. Override this to create a differnt type of part.
   */


  _createPart() {
    return new AttributePart(this);
  }

  _getValue() {
    const strings = this.strings;
    const l = strings.length - 1;
    let text = '';

    for (let i = 0; i < l; i++) {
      text += strings[i];
      const part = this.parts[i];

      if (part !== undefined) {
        const v = part.value;

        if (isPrimitive(v) || !isIterable(v)) {
          text += typeof v === 'string' ? v : String(v);
        } else {
          for (const t of v) {
            text += typeof t === 'string' ? t : String(t);
          }
        }
      }
    }

    text += strings[l];
    return text;
  }

  commit() {
    if (this.dirty) {
      this.dirty = false;
      this.element.setAttribute(this.name, this._getValue());
    }
  }

}
/**
 * A Part that controls all or part of an attribute value.
 */


exports.AttributeCommitter = AttributeCommitter;

class AttributePart {
  constructor(committer) {
    this.value = undefined;
    this.committer = committer;
  }

  setValue(value) {
    if (value !== _part.noChange && (!isPrimitive(value) || value !== this.value)) {
      this.value = value; // If the value is a not a directive, dirty the committer so that it'll
      // call setAttribute. If the value is a directive, it'll dirty the
      // committer if it calls setValue().

      if (!(0, _directive.isDirective)(value)) {
        this.committer.dirty = true;
      }
    }
  }

  commit() {
    while ((0, _directive.isDirective)(this.value)) {
      const directive = this.value;
      this.value = _part.noChange;
      directive(this);
    }

    if (this.value === _part.noChange) {
      return;
    }

    this.committer.commit();
  }

}
/**
 * A Part that controls a location within a Node tree. Like a Range, NodePart
 * has start and end locations and can set and update the Nodes between those
 * locations.
 *
 * NodeParts support several value types: primitives, Nodes, TemplateResults,
 * as well as arrays and iterables of those types.
 */


exports.AttributePart = AttributePart;

class NodePart {
  constructor(options) {
    this.value = undefined;
    this.__pendingValue = undefined;
    this.options = options;
  }
  /**
   * Appends this part into a container.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  appendInto(container) {
    this.startNode = container.appendChild((0, _template.createMarker)());
    this.endNode = container.appendChild((0, _template.createMarker)());
  }
  /**
   * Inserts this part after the `ref` node (between `ref` and `ref`'s next
   * sibling). Both `ref` and its next sibling must be static, unchanging nodes
   * such as those that appear in a literal section of a template.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  insertAfterNode(ref) {
    this.startNode = ref;
    this.endNode = ref.nextSibling;
  }
  /**
   * Appends this part into a parent part.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  appendIntoPart(part) {
    part.__insert(this.startNode = (0, _template.createMarker)());

    part.__insert(this.endNode = (0, _template.createMarker)());
  }
  /**
   * Inserts this part after the `ref` part.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  insertAfterPart(ref) {
    ref.__insert(this.startNode = (0, _template.createMarker)());

    this.endNode = ref.endNode;
    ref.endNode = this.startNode;
  }

  setValue(value) {
    this.__pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this.__pendingValue)) {
      const directive = this.__pendingValue;
      this.__pendingValue = _part.noChange;
      directive(this);
    }

    const value = this.__pendingValue;

    if (value === _part.noChange) {
      return;
    }

    if (isPrimitive(value)) {
      if (value !== this.value) {
        this.__commitText(value);
      }
    } else if (value instanceof _templateResult.TemplateResult) {
      this.__commitTemplateResult(value);
    } else if (value instanceof Node) {
      this.__commitNode(value);
    } else if (isIterable(value)) {
      this.__commitIterable(value);
    } else if (value === _part.nothing) {
      this.value = _part.nothing;
      this.clear();
    } else {
      // Fallback, will render the string representation
      this.__commitText(value);
    }
  }

  __insert(node) {
    this.endNode.parentNode.insertBefore(node, this.endNode);
  }

  __commitNode(value) {
    if (this.value === value) {
      return;
    }

    this.clear();

    this.__insert(value);

    this.value = value;
  }

  __commitText(value) {
    const node = this.startNode.nextSibling;
    value = value == null ? '' : value; // If `value` isn't already a string, we explicitly convert it here in case
    // it can't be implicitly converted - i.e. it's a symbol.

    const valueAsString = typeof value === 'string' ? value : String(value);

    if (node === this.endNode.previousSibling && node.nodeType === 3
    /* Node.TEXT_NODE */
    ) {
        // If we only have a single text node between the markers, we can just
        // set its value, rather than replacing it.
        // TODO(justinfagnani): Can we just check if this.value is primitive?
        node.data = valueAsString;
      } else {
      this.__commitNode(document.createTextNode(valueAsString));
    }

    this.value = value;
  }

  __commitTemplateResult(value) {
    const template = this.options.templateFactory(value);

    if (this.value instanceof _templateInstance.TemplateInstance && this.value.template === template) {
      this.value.update(value.values);
    } else {
      // Make sure we propagate the template processor from the TemplateResult
      // so that we use its syntax extension, etc. The template factory comes
      // from the render function options so that it can control template
      // caching and preprocessing.
      const instance = new _templateInstance.TemplateInstance(template, value.processor, this.options);

      const fragment = instance._clone();

      instance.update(value.values);

      this.__commitNode(fragment);

      this.value = instance;
    }
  }

  __commitIterable(value) {
    // For an Iterable, we create a new InstancePart per item, then set its
    // value to the item. This is a little bit of overhead for every item in
    // an Iterable, but it lets us recurse easily and efficiently update Arrays
    // of TemplateResults that will be commonly returned from expressions like:
    // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
    // If _value is an array, then the previous render was of an
    // iterable and _value will contain the NodeParts from the previous
    // render. If _value is not an array, clear this part and make a new
    // array for NodeParts.
    if (!Array.isArray(this.value)) {
      this.value = [];
      this.clear();
    } // Lets us keep track of how many items we stamped so we can clear leftover
    // items from a previous render


    const itemParts = this.value;
    let partIndex = 0;
    let itemPart;

    for (const item of value) {
      // Try to reuse an existing part
      itemPart = itemParts[partIndex]; // If no existing part, create a new one

      if (itemPart === undefined) {
        itemPart = new NodePart(this.options);
        itemParts.push(itemPart);

        if (partIndex === 0) {
          itemPart.appendIntoPart(this);
        } else {
          itemPart.insertAfterPart(itemParts[partIndex - 1]);
        }
      }

      itemPart.setValue(item);
      itemPart.commit();
      partIndex++;
    }

    if (partIndex < itemParts.length) {
      // Truncate the parts array so _value reflects the current state
      itemParts.length = partIndex;
      this.clear(itemPart && itemPart.endNode);
    }
  }

  clear(startNode = this.startNode) {
    (0, _dom.removeNodes)(this.startNode.parentNode, startNode.nextSibling, this.endNode);
  }

}
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */


exports.NodePart = NodePart;

class BooleanAttributePart {
  constructor(element, name, strings) {
    this.value = undefined;
    this.__pendingValue = undefined;

    if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
      throw new Error('Boolean attributes can only contain a single expression');
    }

    this.element = element;
    this.name = name;
    this.strings = strings;
  }

  setValue(value) {
    this.__pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this.__pendingValue)) {
      const directive = this.__pendingValue;
      this.__pendingValue = _part.noChange;
      directive(this);
    }

    if (this.__pendingValue === _part.noChange) {
      return;
    }

    const value = !!this.__pendingValue;

    if (this.value !== value) {
      if (value) {
        this.element.setAttribute(this.name, '');
      } else {
        this.element.removeAttribute(this.name);
      }

      this.value = value;
    }

    this.__pendingValue = _part.noChange;
  }

}
/**
 * Sets attribute values for PropertyParts, so that the value is only set once
 * even if there are multiple parts for a property.
 *
 * If an expression controls the whole property value, then the value is simply
 * assigned to the property under control. If there are string literals or
 * multiple expressions, then the strings are expressions are interpolated into
 * a string first.
 */


exports.BooleanAttributePart = BooleanAttributePart;

class PropertyCommitter extends AttributeCommitter {
  constructor(element, name, strings) {
    super(element, name, strings);
    this.single = strings.length === 2 && strings[0] === '' && strings[1] === '';
  }

  _createPart() {
    return new PropertyPart(this);
  }

  _getValue() {
    if (this.single) {
      return this.parts[0].value;
    }

    return super._getValue();
  }

  commit() {
    if (this.dirty) {
      this.dirty = false; // tslint:disable-next-line:no-any

      this.element[this.name] = this._getValue();
    }
  }

}

exports.PropertyCommitter = PropertyCommitter;

class PropertyPart extends AttributePart {} // Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the thrid
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.


exports.PropertyPart = PropertyPart;
let eventOptionsSupported = false;

try {
  const options = {
    get capture() {
      eventOptionsSupported = true;
      return false;
    }

  }; // tslint:disable-next-line:no-any

  window.addEventListener('test', options, options); // tslint:disable-next-line:no-any

  window.removeEventListener('test', options, options);
} catch (_e) {}

class EventPart {
  constructor(element, eventName, eventContext) {
    this.value = undefined;
    this.__pendingValue = undefined;
    this.element = element;
    this.eventName = eventName;
    this.eventContext = eventContext;

    this.__boundHandleEvent = e => this.handleEvent(e);
  }

  setValue(value) {
    this.__pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this.__pendingValue)) {
      const directive = this.__pendingValue;
      this.__pendingValue = _part.noChange;
      directive(this);
    }

    if (this.__pendingValue === _part.noChange) {
      return;
    }

    const newListener = this.__pendingValue;
    const oldListener = this.value;
    const shouldRemoveListener = newListener == null || oldListener != null && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
    const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);

    if (shouldRemoveListener) {
      this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
    }

    if (shouldAddListener) {
      this.__options = getOptions(newListener);
      this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
    }

    this.value = newListener;
    this.__pendingValue = _part.noChange;
  }

  handleEvent(event) {
    if (typeof this.value === 'function') {
      this.value.call(this.eventContext || this.element, event);
    } else {
      this.value.handleEvent(event);
    }
  }

} // We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.


exports.EventPart = EventPart;

const getOptions = o => o && (eventOptionsSupported ? {
  capture: o.capture,
  passive: o.passive,
  once: o.once
} : o.capture);
},{"./directive.js":"node_modules/lit-html/lib/directive.js","./dom.js":"node_modules/lit-html/lib/dom.js","./part.js":"node_modules/lit-html/lib/part.js","./template-instance.js":"node_modules/lit-html/lib/template-instance.js","./template-result.js":"node_modules/lit-html/lib/template-result.js","./template.js":"node_modules/lit-html/lib/template.js"}],"node_modules/lit-html/lib/default-template-processor.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultTemplateProcessor = exports.DefaultTemplateProcessor = void 0;

var _parts = require("./parts.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * Creates Parts when a template is instantiated.
 */
class DefaultTemplateProcessor {
  /**
   * Create parts for an attribute-position binding, given the event, attribute
   * name, and string literals.
   *
   * @param element The element containing the binding
   * @param name  The attribute name
   * @param strings The string literals. There are always at least two strings,
   *   event for fully-controlled bindings with a single expression.
   */
  handleAttributeExpressions(element, name, strings, options) {
    const prefix = name[0];

    if (prefix === '.') {
      const committer = new _parts.PropertyCommitter(element, name.slice(1), strings);
      return committer.parts;
    }

    if (prefix === '@') {
      return [new _parts.EventPart(element, name.slice(1), options.eventContext)];
    }

    if (prefix === '?') {
      return [new _parts.BooleanAttributePart(element, name.slice(1), strings)];
    }

    const committer = new _parts.AttributeCommitter(element, name, strings);
    return committer.parts;
  }
  /**
   * Create parts for a text-position binding.
   * @param templateFactory
   */


  handleTextExpression(options) {
    return new _parts.NodePart(options);
  }

}

exports.DefaultTemplateProcessor = DefaultTemplateProcessor;
const defaultTemplateProcessor = new DefaultTemplateProcessor();
exports.defaultTemplateProcessor = defaultTemplateProcessor;
},{"./parts.js":"node_modules/lit-html/lib/parts.js"}],"node_modules/lit-html/lib/template-factory.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templateFactory = templateFactory;
exports.templateCaches = void 0;

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function templateFactory(result) {
  let templateCache = templateCaches.get(result.type);

  if (templateCache === undefined) {
    templateCache = {
      stringsArray: new WeakMap(),
      keyString: new Map()
    };
    templateCaches.set(result.type, templateCache);
  }

  let template = templateCache.stringsArray.get(result.strings);

  if (template !== undefined) {
    return template;
  } // If the TemplateStringsArray is new, generate a key from the strings
  // This key is shared between all templates with identical content


  const key = result.strings.join(_template.marker); // Check if we already have a Template for this key

  template = templateCache.keyString.get(key);

  if (template === undefined) {
    // If we have not seen this key before, create a new Template
    template = new _template.Template(result, result.getTemplateElement()); // Cache the Template for this key

    templateCache.keyString.set(key, template);
  } // Cache all future queries for this TemplateStringsArray


  templateCache.stringsArray.set(result.strings, template);
  return template;
}

const templateCaches = new Map();
exports.templateCaches = templateCaches;
},{"./template.js":"node_modules/lit-html/lib/template.js"}],"node_modules/lit-html/lib/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.parts = void 0;

var _dom = require("./dom.js");

var _parts = require("./parts.js");

var _templateFactory = require("./template-factory.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module lit-html
 */
const parts = new WeakMap();
/**
 * Renders a template result or other value to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result Any value renderable by NodePart - typically a TemplateResult
 *     created by evaluating a template tag like `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param options RenderOptions for the entire render tree rendered to this
 *     container. Render options must *not* change between renders to the same
 *     container, as those changes will not effect previously rendered DOM.
 */

exports.parts = parts;

const render = (result, container, options) => {
  let part = parts.get(container);

  if (part === undefined) {
    (0, _dom.removeNodes)(container, container.firstChild);
    parts.set(container, part = new _parts.NodePart(Object.assign({
      templateFactory: _templateFactory.templateFactory
    }, options)));
    part.appendInto(container);
  }

  part.setValue(result);
  part.commit();
};

exports.render = render;
},{"./dom.js":"node_modules/lit-html/lib/dom.js","./parts.js":"node_modules/lit-html/lib/parts.js","./template-factory.js":"node_modules/lit-html/lib/template-factory.js"}],"node_modules/lit-html/lit-html.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DefaultTemplateProcessor", {
  enumerable: true,
  get: function () {
    return _defaultTemplateProcessor.DefaultTemplateProcessor;
  }
});
Object.defineProperty(exports, "defaultTemplateProcessor", {
  enumerable: true,
  get: function () {
    return _defaultTemplateProcessor.defaultTemplateProcessor;
  }
});
Object.defineProperty(exports, "SVGTemplateResult", {
  enumerable: true,
  get: function () {
    return _templateResult.SVGTemplateResult;
  }
});
Object.defineProperty(exports, "TemplateResult", {
  enumerable: true,
  get: function () {
    return _templateResult.TemplateResult;
  }
});
Object.defineProperty(exports, "directive", {
  enumerable: true,
  get: function () {
    return _directive.directive;
  }
});
Object.defineProperty(exports, "isDirective", {
  enumerable: true,
  get: function () {
    return _directive.isDirective;
  }
});
Object.defineProperty(exports, "removeNodes", {
  enumerable: true,
  get: function () {
    return _dom.removeNodes;
  }
});
Object.defineProperty(exports, "reparentNodes", {
  enumerable: true,
  get: function () {
    return _dom.reparentNodes;
  }
});
Object.defineProperty(exports, "noChange", {
  enumerable: true,
  get: function () {
    return _part.noChange;
  }
});
Object.defineProperty(exports, "nothing", {
  enumerable: true,
  get: function () {
    return _part.nothing;
  }
});
Object.defineProperty(exports, "AttributeCommitter", {
  enumerable: true,
  get: function () {
    return _parts.AttributeCommitter;
  }
});
Object.defineProperty(exports, "AttributePart", {
  enumerable: true,
  get: function () {
    return _parts.AttributePart;
  }
});
Object.defineProperty(exports, "BooleanAttributePart", {
  enumerable: true,
  get: function () {
    return _parts.BooleanAttributePart;
  }
});
Object.defineProperty(exports, "EventPart", {
  enumerable: true,
  get: function () {
    return _parts.EventPart;
  }
});
Object.defineProperty(exports, "isIterable", {
  enumerable: true,
  get: function () {
    return _parts.isIterable;
  }
});
Object.defineProperty(exports, "isPrimitive", {
  enumerable: true,
  get: function () {
    return _parts.isPrimitive;
  }
});
Object.defineProperty(exports, "NodePart", {
  enumerable: true,
  get: function () {
    return _parts.NodePart;
  }
});
Object.defineProperty(exports, "PropertyCommitter", {
  enumerable: true,
  get: function () {
    return _parts.PropertyCommitter;
  }
});
Object.defineProperty(exports, "PropertyPart", {
  enumerable: true,
  get: function () {
    return _parts.PropertyPart;
  }
});
Object.defineProperty(exports, "parts", {
  enumerable: true,
  get: function () {
    return _render.parts;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function () {
    return _render.render;
  }
});
Object.defineProperty(exports, "templateCaches", {
  enumerable: true,
  get: function () {
    return _templateFactory.templateCaches;
  }
});
Object.defineProperty(exports, "templateFactory", {
  enumerable: true,
  get: function () {
    return _templateFactory.templateFactory;
  }
});
Object.defineProperty(exports, "TemplateInstance", {
  enumerable: true,
  get: function () {
    return _templateInstance.TemplateInstance;
  }
});
Object.defineProperty(exports, "createMarker", {
  enumerable: true,
  get: function () {
    return _template.createMarker;
  }
});
Object.defineProperty(exports, "isTemplatePartActive", {
  enumerable: true,
  get: function () {
    return _template.isTemplatePartActive;
  }
});
Object.defineProperty(exports, "Template", {
  enumerable: true,
  get: function () {
    return _template.Template;
  }
});
exports.svg = exports.html = void 0;

var _defaultTemplateProcessor = require("./lib/default-template-processor.js");

var _templateResult = require("./lib/template-result.js");

var _directive = require("./lib/directive.js");

var _dom = require("./lib/dom.js");

var _part = require("./lib/part.js");

var _parts = require("./lib/parts.js");

var _render = require("./lib/render.js");

var _templateFactory = require("./lib/template-factory.js");

var _templateInstance = require("./lib/template-instance.js");

var _template = require("./lib/template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 *
 * Main lit-html module.
 *
 * Main exports:
 *
 * -  [[html]]
 * -  [[svg]]
 * -  [[render]]
 *
 * @module lit-html
 * @preferred
 */

/**
 * Do not remove this comment; it keeps typedoc from misplacing the module
 * docs.
 */
// TODO(justinfagnani): remove line when we get NodePart moving methods
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
(window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.1.2');
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */

const html = (strings, ...values) => new _templateResult.TemplateResult(strings, values, 'html', _defaultTemplateProcessor.defaultTemplateProcessor);
/**
 * Interprets a template literal as an SVG template that can efficiently
 * render to and update a container.
 */


exports.html = html;

const svg = (strings, ...values) => new _templateResult.SVGTemplateResult(strings, values, 'svg', _defaultTemplateProcessor.defaultTemplateProcessor);

exports.svg = svg;
},{"./lib/default-template-processor.js":"node_modules/lit-html/lib/default-template-processor.js","./lib/template-result.js":"node_modules/lit-html/lib/template-result.js","./lib/directive.js":"node_modules/lit-html/lib/directive.js","./lib/dom.js":"node_modules/lit-html/lib/dom.js","./lib/part.js":"node_modules/lit-html/lib/part.js","./lib/parts.js":"node_modules/lit-html/lib/parts.js","./lib/render.js":"node_modules/lit-html/lib/render.js","./lib/template-factory.js":"node_modules/lit-html/lib/template-factory.js","./lib/template-instance.js":"node_modules/lit-html/lib/template-instance.js","./lib/template.js":"node_modules/lit-html/lib/template.js"}],"node_modules/haunted/lib/symbols.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contextEvent = exports.contextSymbol = exports.effectsSymbol = exports.commitSymbol = exports.updateSymbol = exports.hookSymbol = exports.phaseSymbol = void 0;
const symbolFor = typeof Symbol === 'function' ? Symbol.for : str => str;
const phaseSymbol = symbolFor('haunted.phase');
exports.phaseSymbol = phaseSymbol;
const hookSymbol = symbolFor('haunted.hook');
exports.hookSymbol = hookSymbol;
const updateSymbol = symbolFor('haunted.update');
exports.updateSymbol = updateSymbol;
const commitSymbol = symbolFor('haunted.commit');
exports.commitSymbol = commitSymbol;
const effectsSymbol = symbolFor('haunted.effects');
exports.effectsSymbol = effectsSymbol;
const contextSymbol = symbolFor('haunted.context');
exports.contextSymbol = contextSymbol;
const contextEvent = 'haunted.context';
exports.contextEvent = contextEvent;
},{}],"node_modules/haunted/lib/interface.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clear = clear;
exports.setCurrent = setCurrent;
exports.notify = notify;
exports.current = void 0;
let current;
exports.current = current;
let currentId = 0;

function setCurrent(element) {
  exports.current = current = element;
}

function clear() {
  exports.current = current = null;
  currentId = 0;
}

function notify() {
  let id = currentId;
  currentId++;
  return id;
}
},{}],"node_modules/haunted/lib/container.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeContainer = makeContainer;

var _symbols = require("./symbols.js");

var _interface = require("./interface.js");

//import { render, html } from './lit.js';
const defer = Promise.resolve().then.bind(Promise.resolve());

function scheduler() {
  let tasks = [];
  let id;

  function runTasks() {
    id = null;
    let t = tasks;
    tasks = [];

    for (var i = 0, len = t.length; i < len; i++) {
      t[i]();
    }
  }

  return function (task) {
    tasks.push(task);

    if (id == null) {
      id = defer(runTasks);
    }
  };
}

function makeContainer(render) {
  const read = scheduler();
  const write = scheduler();

  class Container {
    constructor(renderer, frag, host) {
      this.renderer = renderer;
      this.frag = frag;
      this.host = host || frag;
      this[_symbols.hookSymbol] = new Map();
      this[_symbols.phaseSymbol] = null;
      this._updateQueued = false;
    }

    update() {
      if (this._updateQueued) return;
      read(() => {
        let result = this.handlePhase(_symbols.updateSymbol);
        write(() => {
          this.handlePhase(_symbols.commitSymbol, result);

          if (this[_symbols.effectsSymbol]) {
            write(() => {
              this.handlePhase(_symbols.effectsSymbol);
            });
          }
        });
        this._updateQueued = false;
      });
      this._updateQueued = true;
    }

    handlePhase(phase, arg) {
      this[_symbols.phaseSymbol] = phase;

      switch (phase) {
        case _symbols.commitSymbol:
          return this.commit(arg);

        case _symbols.updateSymbol:
          return this.render();

        case _symbols.effectsSymbol:
          return this.runEffects(_symbols.effectsSymbol);
      }

      this[_symbols.phaseSymbol] = null;
    }

    commit(result) {
      render(result, this.frag);
      this.runEffects(_symbols.commitSymbol);
    }

    render() {
      (0, _interface.setCurrent)(this);
      let result = this.args ? this.renderer.apply(this.host, this.args) : this.renderer.call(this.host, this.host);
      (0, _interface.clear)();
      return result;
    }

    runEffects(symbol) {
      let effects = this[symbol];

      if (effects) {
        (0, _interface.setCurrent)(this);

        for (let effect of effects) {
          effect.call(this);
        }

        (0, _interface.clear)();
      }
    }

    teardown() {
      let hooks = this[_symbols.hookSymbol];
      hooks.forEach(hook => {
        if (typeof hook.teardown === 'function') {
          hook.teardown();
        }
      });
    }

  }

  return Container;
}
},{"./symbols.js":"node_modules/haunted/lib/symbols.js","./interface.js":"node_modules/haunted/lib/interface.js"}],"node_modules/haunted/lib/component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeComponent = makeComponent;

function toCamelCase(val = '') {
  return val.indexOf('-') === -1 ? val.toLowerCase() : val.toLowerCase().split('-').reduce((out, part) => {
    return out ? out + part.charAt(0).toUpperCase() + part.slice(1) : part;
  }, '');
}

function makeComponent(Container) {
  function component(renderer, baseElementOrOptions, options) {
    const BaseElement = (options || baseElementOrOptions || {}).baseElement || HTMLElement;
    const {
      observedAttributes = [],
      useShadowDOM = true,
      shadowRootInit = {}
    } = options || baseElementOrOptions || {};

    class Element extends BaseElement {
      static get observedAttributes() {
        return renderer.observedAttributes || observedAttributes || [];
      }

      constructor() {
        super();

        if (useShadowDOM === false) {
          this._container = new Container(renderer, this);
        } else {
          this.attachShadow({
            mode: "open",
            ...shadowRootInit
          });
          this._container = new Container(renderer, this.shadowRoot, this);
        }
      }

      connectedCallback() {
        this._container.update();
      }

      disconnectedCallback() {
        this._container.teardown();
      }

      attributeChangedCallback(name, _, newValue) {
        let val = newValue === '' ? true : newValue;
        Reflect.set(this, toCamelCase(name), val);
      }

    }

    ;

    function reflectiveProp(initialValue) {
      let value = initialValue;
      return Object.freeze({
        enumerable: true,
        configurable: true,

        get() {
          return value;
        },

        set(newValue) {
          value = newValue;

          this._container.update();
        }

      });
    }

    const proto = new Proxy(BaseElement.prototype, {
      set(target, key, value, receiver) {
        if (key in target) {
          Reflect.set(target, key, value);
        }

        let desc;

        if (typeof key === 'symbol' || key[0] === '_') {
          desc = {
            enumerable: true,
            configurable: true,
            writable: true,
            value
          };
        } else {
          desc = reflectiveProp(value);
        }

        Object.defineProperty(receiver, key, desc);

        if (desc.set) {
          desc.set.call(receiver, value);
        }

        return true;
      }

    });
    Object.setPrototypeOf(Element.prototype, proto);
    return Element;
  }

  return component;
}
},{}],"node_modules/haunted/lib/hook.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hook = hook;
exports.Hook = void 0;

var _interface = require("./interface.js");

var _symbols = require("./symbols.js");

class Hook {
  constructor(id, el) {
    this.id = id;
    this.el = el;
  }

}

exports.Hook = Hook;

function use(Hook, ...args) {
  let id = (0, _interface.notify)();
  let hooks = _interface.current[_symbols.hookSymbol];
  let hook = hooks.get(id);

  if (!hook) {
    hook = new Hook(id, _interface.current, ...args);
    hooks.set(id, hook);
  }

  return hook.update(...args);
}

function hook(Hook) {
  return use.bind(null, Hook);
}
},{"./interface.js":"node_modules/haunted/lib/interface.js","./symbols.js":"node_modules/haunted/lib/symbols.js"}],"node_modules/haunted/lib/use-effect.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setEffects = setEffects;
exports.useEffect = void 0;

var _symbols = require("./symbols.js");

var _hook = require("./hook.js");

function setEffects(el, cb) {
  if (!(_symbols.effectsSymbol in el)) {
    el[_symbols.effectsSymbol] = [];
  }

  el[_symbols.effectsSymbol].push(cb);
}

const useEffect = (0, _hook.hook)(class extends _hook.Hook {
  constructor(id, el) {
    super(id, el);
    this.values = false;
    setEffects(el, this);
  }

  update(callback, values) {
    this.callback = callback;
    this.lastValues = this.values;
    this.values = values;
  }

  call() {
    if (this.values) {
      if (this.hasChanged()) {
        this.run();
      }
    } else {
      this.run();
    }
  }

  run() {
    this.teardown();
    this._teardown = this.callback.call(this.el);
  }

  teardown() {
    if (this._teardown) {
      this._teardown();
    }
  }

  hasChanged() {
    return this.lastValues === false || this.values.some((value, i) => this.lastValues[i] !== value);
  }

});
exports.useEffect = useEffect;
},{"./symbols.js":"node_modules/haunted/lib/symbols.js","./hook.js":"node_modules/haunted/lib/hook.js"}],"node_modules/haunted/lib/use-context.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useContext = void 0;

var _symbols = require("./symbols.js");

var _hook = require("./hook.js");

var _useEffect = require("./use-effect.js");

function setContexts(el, consumer) {
  if (!(_symbols.contextSymbol in el)) {
    el[_symbols.contextSymbol] = [];
  }

  el[_symbols.contextSymbol].push(consumer);
}

const useContext = (0, _hook.hook)(class extends _hook.Hook {
  constructor(id, el) {
    super(id, el);
    setContexts(el, this);
    this._updater = this._updater.bind(this);
    this._ranEffect = false;
    this._unsubscribe = null;
    (0, _useEffect.setEffects)(el, this);
  }

  update(Context) {
    if (this.el.virtual) {
      throw new Error('can\'t be used with virtual components');
    }

    if (this.Context !== Context) {
      this._subscribe(Context);

      this.Context = Context;
    }

    return this.value;
  }

  call() {
    if (!this._ranEffect) {
      this._ranEffect = true;
      if (this._unsubscribe) this._unsubscribe();

      this._subscribe(this.Context);

      this.el.update();
    }
  }

  _updater(value) {
    this.value = value;
    this.el.update();
  }

  _subscribe(Context) {
    const detail = {
      Context,
      callback: this._updater
    };
    this.el.host.dispatchEvent(new CustomEvent(_symbols.contextEvent, {
      detail,
      // carrier
      bubbles: true,
      // to bubble up in tree
      cancelable: true,
      // to be able to cancel
      composed: true // to pass ShadowDOM boundaries

    }));
    const {
      unsubscribe,
      value
    } = detail;
    this.value = unsubscribe ? value : Context.defaultValue;
    this._unsubscribe = unsubscribe;
  }

  teardown() {
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

});
exports.useContext = useContext;
},{"./symbols.js":"node_modules/haunted/lib/symbols.js","./hook.js":"node_modules/haunted/lib/hook.js","./use-effect.js":"node_modules/haunted/lib/use-effect.js"}],"node_modules/haunted/lib/create-context.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeContext = makeContext;

var _symbols = require("./symbols.js");

var _useContext = require("./use-context.js");

function makeContext(component) {
  return defaultValue => {
    const Context = {
      Provider: class extends HTMLElement {
        constructor() {
          super();
          this.listeners = new Set();
          this.addEventListener(_symbols.contextEvent, this);
        }

        disconnectedCallback() {
          this.removeEventListener(_symbols.contextEvent, this);
        }

        handleEvent(event) {
          const {
            detail
          } = event;

          if (detail.Context === Context) {
            detail.value = this.value;
            detail.unsubscribe = this.unsubscribe.bind(this, detail.callback);
            this.listeners.add(detail.callback);
            event.stopPropagation();
          }
        }

        unsubscribe(callback) {
          if (this.listeners.has(callback)) {
            this.listeners.delete(callback);
          }
        }

        set value(value) {
          this._value = value;

          for (let callback of this.listeners) {
            callback(value);
          }
        }

        get value() {
          return this._value;
        }

      },
      Consumer: component(function ({
        render
      }) {
        const context = (0, _useContext.useContext)(Context);
        return render(context);
      }),
      defaultValue
    };
    return Context;
  };
}
},{"./symbols.js":"node_modules/haunted/lib/symbols.js","./use-context.js":"node_modules/haunted/lib/use-context.js"}],"node_modules/haunted/lib/use-memo.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useMemo = void 0;

var _hook = require("./hook.js");

const useMemo = (0, _hook.hook)(class extends _hook.Hook {
  constructor(id, el, fn, values) {
    super(id, el);
    this.value = fn();
    this.values = values;
  }

  update(fn, values) {
    if (this.hasChanged(values)) {
      this.values = values;
      this.value = fn();
    }

    return this.value;
  }

  hasChanged(values) {
    return values.some((value, i) => this.values[i] !== value);
  }

});
exports.useMemo = useMemo;
},{"./hook.js":"node_modules/haunted/lib/hook.js"}],"node_modules/haunted/lib/use-callback.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useCallback = void 0;

var _useMemo = require("./use-memo.js");

const useCallback = (fn, inputs) => (0, _useMemo.useMemo)(() => fn, inputs);

exports.useCallback = useCallback;
},{"./use-memo.js":"node_modules/haunted/lib/use-memo.js"}],"node_modules/haunted/lib/use-state.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useState = void 0;

var _hook = require("./hook.js");

const useState = (0, _hook.hook)(class extends _hook.Hook {
  constructor(id, el, initialValue) {
    super(id, el);
    this.updater = this.updater.bind(this);

    if (typeof initialValue === 'function') {
      initialValue = initialValue();
    }

    this.makeArgs(initialValue);
  }

  update() {
    return this.args;
  }

  updater(value) {
    if (typeof value === "function") {
      const updaterFn = value;
      const [previousValue] = this.args;
      value = updaterFn(previousValue);
    }

    this.makeArgs(value);
    this.el.update();
  }

  makeArgs(value) {
    this.args = Object.freeze([value, this.updater]);
  }

});
exports.useState = useState;
},{"./hook.js":"node_modules/haunted/lib/hook.js"}],"node_modules/haunted/lib/use-reducer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useReducer = void 0;

var _hook = require("./hook.js");

const useReducer = (0, _hook.hook)(class extends _hook.Hook {
  constructor(id, el, _, initialState) {
    super(id, el);
    this.dispatch = this.dispatch.bind(this);
    this.state = initialState;
  }

  update(reducer) {
    this.reducer = reducer;
    return [this.state, this.dispatch];
  }

  dispatch(action) {
    this.state = this.reducer(this.state, action);
    this.el.update();
  }

});
exports.useReducer = useReducer;
},{"./hook.js":"node_modules/haunted/lib/hook.js"}],"node_modules/haunted/lib/use-ref.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useRef = void 0;

var _useMemo = require("./use-memo.js");

const useRef = initialValue => {
  return (0, _useMemo.useMemo)(() => {
    return {
      current: initialValue
    };
  }, []);
};

exports.useRef = useRef;
},{"./use-memo.js":"node_modules/haunted/lib/use-memo.js"}],"node_modules/haunted/lib/core.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = haunted;
Object.defineProperty(exports, "useCallback", {
  enumerable: true,
  get: function () {
    return _useCallback.useCallback;
  }
});
Object.defineProperty(exports, "useEffect", {
  enumerable: true,
  get: function () {
    return _useEffect.useEffect;
  }
});
Object.defineProperty(exports, "useState", {
  enumerable: true,
  get: function () {
    return _useState.useState;
  }
});
Object.defineProperty(exports, "useReducer", {
  enumerable: true,
  get: function () {
    return _useReducer.useReducer;
  }
});
Object.defineProperty(exports, "useMemo", {
  enumerable: true,
  get: function () {
    return _useMemo.useMemo;
  }
});
Object.defineProperty(exports, "useContext", {
  enumerable: true,
  get: function () {
    return _useContext.useContext;
  }
});
Object.defineProperty(exports, "useRef", {
  enumerable: true,
  get: function () {
    return _useRef.useRef;
  }
});
Object.defineProperty(exports, "hook", {
  enumerable: true,
  get: function () {
    return _hook.hook;
  }
});
Object.defineProperty(exports, "Hook", {
  enumerable: true,
  get: function () {
    return _hook.Hook;
  }
});

var _container = require("./container.js");

var _component = require("./component.js");

var _createContext = require("./create-context.js");

var _useCallback = require("./use-callback.js");

var _useEffect = require("./use-effect.js");

var _useState = require("./use-state.js");

var _useReducer = require("./use-reducer.js");

var _useMemo = require("./use-memo.js");

var _useContext = require("./use-context.js");

var _useRef = require("./use-ref.js");

var _hook = require("./hook.js");

function haunted({
  render
}) {
  const Container = (0, _container.makeContainer)(render);
  const component = (0, _component.makeComponent)(Container);
  const createContext = (0, _createContext.makeContext)(component);
  return {
    Container,
    component,
    createContext
  };
}
},{"./container.js":"node_modules/haunted/lib/container.js","./component.js":"node_modules/haunted/lib/component.js","./create-context.js":"node_modules/haunted/lib/create-context.js","./use-callback.js":"node_modules/haunted/lib/use-callback.js","./use-effect.js":"node_modules/haunted/lib/use-effect.js","./use-state.js":"node_modules/haunted/lib/use-state.js","./use-reducer.js":"node_modules/haunted/lib/use-reducer.js","./use-memo.js":"node_modules/haunted/lib/use-memo.js","./use-context.js":"node_modules/haunted/lib/use-context.js","./use-ref.js":"node_modules/haunted/lib/use-ref.js","./hook.js":"node_modules/haunted/lib/hook.js"}],"node_modules/haunted/lib/virtual.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeVirtual = makeVirtual;

var _litHtml = require("lit-html");

const includes = Array.prototype.includes;

function makeVirtual(Container) {
  const partToContainer = new WeakMap();
  const containerToPart = new WeakMap();

  class DirectiveContainer extends Container {
    constructor(renderer, part) {
      super(renderer, part);
      this.virtual = true;
    }

    commit(result) {
      this.host.setValue(result);
      this.host.commit();
    }

    teardown() {
      super.teardown();
      let part = containerToPart.get(this);
      partToContainer.delete(part);
    }

  }

  function virtual(renderer) {
    function factory(...args) {
      return part => {
        let cont = partToContainer.get(part);

        if (!cont) {
          cont = new DirectiveContainer(renderer, part);
          partToContainer.set(part, cont);
          containerToPart.set(cont, part);
          teardownOnRemove(cont, part);
        }

        cont.args = args;
        cont.update();
      };
    }

    return (0, _litHtml.directive)(factory);
  }

  return virtual;
}

function teardownOnRemove(cont, part, node = part.startNode) {
  let frag = node.parentNode;
  let mo = new MutationObserver(mutations => {
    for (let mutation of mutations) {
      if (includes.call(mutation.removedNodes, node)) {
        mo.disconnect();

        if (node.parentNode instanceof ShadowRoot) {
          teardownOnRemove(cont, part);
        } else {
          cont.teardown();
        }

        break;
      } else if (includes.call(mutation.addedNodes, node.nextSibling)) {
        mo.disconnect();
        teardownOnRemove(cont, part, node.nextSibling);
        break;
      }
    }
  });
  mo.observe(frag, {
    childList: true
  });
}
},{"lit-html":"node_modules/lit-html/lit-html.js"}],"node_modules/haunted/lib/lit-haunted.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "html", {
  enumerable: true,
  get: function () {
    return _litHtml.html;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function () {
    return _litHtml.render;
  }
});
exports.virtual = exports.createContext = exports.component = void 0;

var _litHtml = require("lit-html");

var _core = _interopRequireDefault(require("./core.js"));

var _virtual = require("./virtual.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Container,
  component,
  createContext
} = (0, _core.default)({
  render(what, where) {
    (0, _litHtml.render)(what, where);
  }

});
exports.createContext = createContext;
exports.component = component;
const virtual = (0, _virtual.makeVirtual)(Container);
exports.virtual = virtual;
},{"lit-html":"node_modules/lit-html/lit-html.js","./core.js":"node_modules/haunted/lib/core.js","./virtual.js":"node_modules/haunted/lib/virtual.js"}],"node_modules/haunted/lib/haunted.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  html: true,
  render: true,
  component: true,
  createContext: true,
  virtual: true
};
Object.defineProperty(exports, "html", {
  enumerable: true,
  get: function () {
    return _litHaunted.html;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function () {
    return _litHaunted.render;
  }
});
Object.defineProperty(exports, "component", {
  enumerable: true,
  get: function () {
    return _litHaunted.component;
  }
});
Object.defineProperty(exports, "createContext", {
  enumerable: true,
  get: function () {
    return _litHaunted.createContext;
  }
});
Object.defineProperty(exports, "virtual", {
  enumerable: true,
  get: function () {
    return _litHaunted.virtual;
  }
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _core.default;
  }
});

var _litHaunted = require("./lit-haunted.js");

var _core = _interopRequireWildcard(require("./core.js"));

Object.keys(_core).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _core[key];
    }
  });
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }
},{"./lit-haunted.js":"node_modules/haunted/lib/lit-haunted.js","./core.js":"node_modules/haunted/lib/core.js"}],"src/components/name-input/index.js":[function(require,module,exports) {
"use strict";

var _haunted = require("haunted");

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <style>\n            :host {\n                display: inline-block;\n                margin-bottom: 1em;\n            }\n            .father,\n            .mother {\n                position: relative;\n            }\n            .father {\n                margin-right: 11px;\n            }\n            .mother {\n                margin-left: 11px;\n            }\n            .father::after,\n            .mother::after {\n                content: '';\n                display: block;\n                width: 10px;\n                height: 30%;\n                position: absolute;\n                top: 70%;\n                border-top: 1px solid var(--color-border, #333);\n            }\n            .father::after {\n                right: -10px;\n            }\n            .mother::after {\n                left: -10px;\n            }\n            label {\n                display: block;\n            }\n        </style>\n        <section class=", ">\n            <label>", "</label>\n            <input\n                type=\"text\"\n                placeholder=", "\n                value=", "\n                @change=", "\n            />\n        </section>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var NameInput = function NameInput(_ref) {
  var name = _ref.name,
      type = _ref.type;

  var _useState = (0, _haunted.useState)(name),
      _useState2 = _slicedToArray(_useState, 2),
      dataName = _useState2[0],
      setDataName = _useState2[1];

  var _useState3 = (0, _haunted.useState)(type),
      _useState4 = _slicedToArray(_useState3, 2),
      dataType = _useState4[0],
      setDataType = _useState4[1];

  return (0, _haunted.html)(_templateObject(), dataType, dataType, dataType === 'father' ? 'Adam' : 'Eve', dataName ? dataName : '', function (e) {
    return setDataName(e.target.value);
  });
};

customElements.define("ajb-name-input", (0, _haunted.component)(NameInput, {
  observedAttributes: ['name', 'type']
}));
},{"haunted":"node_modules/haunted/lib/haunted.js"}],"src/components/expand-collapse/index.js":[function(require,module,exports) {
"use strict";

var _haunted = require("haunted");

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <style>\n            :host {\n                display: inline-block;\n                margin-bottom: 1em;\n                width: 100%;\n            }\n            :host > section {\n                border-bottom: 1px solid #eee;\n            }\n            :host section .expandable-area {\n                max-height: 0px;\n                transition: max-height 0.3s ease-out;\n                overflow: hidden;\n            }\n            :host section.is-open .expandable-area {\n                max-height: 500px;\n                transition: max-height 0.4s ease-in;\n            }\n            :host a,\n            :host a i {\n                height: 20px;\n                width: 20px;\n                display: inline-block;\n            }\n            :host a i {\n                color: #333;\n            }\n\n            :host .title-bar  {\n                border-bottom: 1px solid #eee;\n            }\n            :host .title-bar h2 {\n                display: inline-block;\n            }\n        </style>\n        <section class=", ">\n            <div class=\"title-bar\">\n                <h2>", "</h2>\n                <button\n                    href=\"\"\n                    @click=", "\n                >\n                    <i class=", "></i>\n                    <span>", "</span>\n                </button>\n            </div>\n            <section class=\"expandable-area\">\n                <slot></slot>\n            </section>\n        </section>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ExpandCollapse = function ExpandCollapse(_ref) {
  var open = _ref.open,
      customTitle = _ref.customTitle;

  var _useState = (0, _haunted.useState)(open),
      _useState2 = _slicedToArray(_useState, 2),
      dataOpen = _useState2[0],
      setDataOpen = _useState2[1];

  var _useState3 = (0, _haunted.useState)(customTitle),
      _useState4 = _slicedToArray(_useState3, 2),
      dataTitle = _useState4[0],
      setDataTitle = _useState4[1];

  return (0, _haunted.html)(_templateObject(), dataOpen ? 'is-open' : '', dataTitle, function () {
    return setDataOpen(!dataOpen);
  }, dataOpen ? 'fas fa-angle-up' : 'fas fa-angle-down', dataOpen ? 'Collapse' : 'Expand');
};

customElements.define("ajb-expand-collapse", (0, _haunted.component)(ExpandCollapse, {
  observedAttributes: ['open', 'custom-title']
}));
},{"haunted":"node_modules/haunted/lib/haunted.js"}],"src/components/timeline/index.js":[function(require,module,exports) {
"use strict";

var _haunted = require("haunted");

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n                        <span class=\"timeline-interval\">\n                            <img class=\"timeline-element-img\" src=", " alt=\"\" />\n                            <span class=\"timeline-divider\"></span>\n                            <span class=\"timeline-label\">", " ", "</span>\n                        </span>\n                    "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n                        <span class=\"timeline-interval\">\n                            <span class=\"timeline-divider\"></span>\n                            <span class=\"timeline-label\">", " ", "</span>\n                        </span>\n                    "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <style>\n            :host {\n                position: relative;\n            }\n            :host {\n                display: inline-block;\n                margin-bottom: 1em;\n                width: 100%;\n            }\n            :host .timeline-baseline {\n                display: flex;\n                justify-content: space-evenly;\n                width: 100%;\n            }\n            :host .timeline-interval {\n                position: relative;\n                margin-top: 23px;\n            }\n            :host .timeline-divider {\n                display: inline-block;\n                height: 20px;\n                width: 1px;\n                background-color: #333;\n                position: absolute;\n                top: -130%;\n                left: 50%;\n            }\n            :host .timeline-element-img {\n                position: absolute;\n                top: -60px;\n                left: 15px;\n                height: 30px;\n                width: 30px;\n            }\n        </style>\n        <h3 class=\"timeline-title\">", "</h3>\n        <section class=\"timeline-baseline\">\n            ", "\n        </section>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Timeline = function Timeline(_ref) {
  var startDate = _ref.startDate,
      endDate = _ref.endDate,
      interval = _ref.interval,
      timelineTitle = _ref.timelineTitle,
      elements = _ref.elements;

  // set the startDate for the timeline
  var _useState = (0, _haunted.useState)(parseInt(startDate)),
      _useState2 = _slicedToArray(_useState, 2),
      dataStartDate = _useState2[0],
      setDataStartDate = _useState2[1]; // set the endDate for the timeline


  var _useState3 = (0, _haunted.useState)(parseInt(endDate)),
      _useState4 = _slicedToArray(_useState3, 2),
      dataEndDate = _useState4[0],
      setDataEndDate = _useState4[1]; // set the interval of ticks on the timeline


  var _useState5 = (0, _haunted.useState)(parseInt(interval)),
      _useState6 = _slicedToArray(_useState5, 2),
      dataInterval = _useState6[0],
      setDataInterval = _useState6[1]; // set the title of the timeline


  var _useState7 = (0, _haunted.useState)(timelineTitle),
      _useState8 = _slicedToArray(_useState7, 2),
      dataTitle = _useState8[0],
      setDataTitle = _useState8[1]; // set the JS object of the the elements to show on the timeline


  var _useState9 = (0, _haunted.useState)(elements),
      _useState10 = _slicedToArray(_useState9, 2),
      dataElements = _useState10[0],
      setDataElements = _useState10[1];

  var timelineArray = [];

  var _loop = function _loop(i) {
    var label = i < 0 ? 'B.C.' : 'A.D.';
    var year = i < 0 ? Math.abs(i) : i;
    var showLabel = i % dataInterval === 0;
    var element = dataElements.filter(function (el) {
      return el.location === year;
    })[0];
    timelineArray.push({
      label: label,
      year: year,
      showLabel: showLabel,
      element: element
    });
  };

  for (var i = dataStartDate; i <= dataEndDate; i++) {
    _loop(i);
  }

  return (0, _haunted.html)(_templateObject(), dataTitle, timelineArray.map(function (divider, idx) {
    if (divider.showLabel) {
      return (0, _haunted.html)(_templateObject2(), divider.year, divider.label);
    } else if (divider.element && divider.element.location) {
      return (0, _haunted.html)(_templateObject3(), divider.element.path, divider.year, divider.label);
    }
  }));
};

customElements.define("ajb-timeline", (0, _haunted.component)(Timeline, {
  observedAttributes: ['start-date', 'end-date', 'interval', 'timeline-title', 'elements']
}));
},{"haunted":"node_modules/haunted/lib/haunted.js"}],"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
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
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"src/main.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/static/images/pyramids.jpg":[function(require,module,exports) {
module.exports = "/pyramids.103b25fd.jpg";
},{}],"src/static/images/noah-ark.png":[function(require,module,exports) {
module.exports = "/noah-ark.f9caaea5.png";
},{}],"src/static/images/towerOfBabel.jpg":[function(require,module,exports) {
module.exports = "/towerOfBabel.132fdb05.jpg";
},{}],"index.js":[function(require,module,exports) {
"use strict";

var _haunted = require("haunted");

require("./src/components/name-input");

require("./src/components/expand-collapse");

require("./src/components/timeline");

require("./src/main.scss");

var _pyramids = _interopRequireDefault(require("./src/static/images/pyramids.jpg"));

var _noahArk = _interopRequireDefault(require("./src/static/images/noah-ark.png"));

var _towerOfBabel = _interopRequireDefault(require("./src/static/images/towerOfBabel.jpg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <style>\n            .gen-couple {\n                display: inline-block;\n            }\n            aside {\n                position: absolute;\n                top: 5%;\n                right: 2%;\n                min-height: 300px;\n                width: 300px;\n                border: 1px solid #ccc;\n                padding: 1em;\n            }\n        </style>\n        <main id=\"main\">\n            <ajb-expand-collapse\n                open\n                custom-title=\"Traditional Timeline\"\n            >\n                <ajb-timeline\n                    start-date=\"-3000\"\n                    end-date=\"-1000\"\n                    interval=\"500\"\n                    timeline-title=\"Creation Scientists\"\n                    .elements=", "\n                ></ajb-timeline>\n                <p>Creation Scientist traditionally teach the pyramids were built at 2350 B.C. The Tower of Babel sometime after that and the Great Pyramids of Giza sometime after that.</p>\n                <p>Traditionally the flood was at 2350 B.C.</p>\n            </ajb-expand-collapse>\n\n            <ajb-expand-collapse\n                open\n                custom-title=\"Traditional Timeline\"\n            >\n                <ajb-timeline\n                    start-date=\"-3000\"\n                    end-date=\"-1000\"\n                    interval=\"500\"\n                    timeline-title=\"Egyptologists\"\n                    .elements=", "\n                ></ajb-timeline>\n                <p>Egyptologies traditionally teach the pyramids were built at 2550 B.C. 200 eyars before the traditional flood date of 2350 B.C.</p>\n                <p>How could the pyramids have been built 200 years before the flood, which was before the Tower of Babel incident? Which was before the nation of Egypt even existed?</p>\n            </ajb-expand-collapse>\n        </main>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var initialState = [{
  father: '',
  mother: ''
}];

var reducer = function reducer(state, action) {
  switch (action) {
    case 'addNew':
      return [].concat(_toConsumableArray(state), [{
        father: '',
        mother: ''
      }]);

    case 'remove':
      state.pop();
      return state;

    default:
      throw new Error("what's going on?");
  }
};

var App = function App() {
  var _useReducer = (0, _haunted.useReducer)(reducer, initialState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      geneology = _useReducer2[0],
      dispatch = _useReducer2[1]; // CREATION SCIENTISTS TRADITITONAL


  var TRAD_GIZA_PYRAMIDS = {
    path: _pyramids.default,
    location: 2150
  };
  var TRAD_TOWER_OF_BABEL = {
    path: _towerOfBabel.default,
    location: 2250
  };
  var TRAD_NOAH_ARK = {
    path: _noahArk.default,
    location: 2350 // EGYPTOLOGISTS

  };
  var EGYPT_GIZA_PYRAMIDS = {
    path: _pyramids.default,
    location: 2550
  };
  var EGYPT_TOWER_OF_BABEL = {
    path: _towerOfBabel.default,
    location: 2250
  };
  var EGYPT_NOAH_ARK = {
    path: _noahArk.default,
    location: 2350
  };
  return (0, _haunted.html)(_templateObject(), [TRAD_GIZA_PYRAMIDS, TRAD_TOWER_OF_BABEL, TRAD_NOAH_ARK], [EGYPT_GIZA_PYRAMIDS, EGYPT_TOWER_OF_BABEL, EGYPT_NOAH_ARK]);
};

customElements.define("ajb-app", (0, _haunted.component)(App));
},{"haunted":"node_modules/haunted/lib/haunted.js","./src/components/name-input":"src/components/name-input/index.js","./src/components/expand-collapse":"src/components/expand-collapse/index.js","./src/components/timeline":"src/components/timeline/index.js","./src/main.scss":"src/main.scss","./src/static/images/pyramids.jpg":"src/static/images/pyramids.jpg","./src/static/images/noah-ark.png":"src/static/images/noah-ark.png","./src/static/images/towerOfBabel.jpg":"src/static/images/towerOfBabel.jpg"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50471" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/geneologyTracker.e31bb0bc.js.map