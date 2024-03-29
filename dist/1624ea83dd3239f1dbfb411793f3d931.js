// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
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

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      function localRequire(x) {
        return newRequire(localRequire.resolve(x));
      }

      localRequire.resolve = function (x) {
        return modules[name][1][x] || x;
      };

      var module = cache[name] = new newRequire.Module;
      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({3:[function(require,module,exports) {
function traveral(element, tree, tagList) {
    if (!element)
        return;
    var child = element;
    if (tagList.includes(child.tagName)) {
        tree.push({
            label: child.tagName,
            text: child.textContent,
            href: child.firstElementChild.id,
            child: child.firstElementChild || null
        });
    }
    var nextElementSibling = child.nextElementSibling;
    if (nextElementSibling) {
        return traveral(nextElementSibling, tree, tagList);
    }
    else {
        return tree;
    }
}
function getTopParent() {
    var markdown = document.querySelector('.markdown-body');
    return markdown || document.body || null;
}
// h1 - h[n]
function createHTagList(length) {
    var array = Array.from({ length: length }, function (v, i) { return i + 1; }) || [1];
    return Array.from(array, function (x) { return "H" + x; });
}
function template(array) {
    return array.map(function (x) {
        return "<a class='LK-" + x.label + " LK-A' href=#" + x.href + ">" + x.text + "</a>";
    }).join(' ');
}
// not pure at all.
function createDom(templates) {
    var domc = document.createElement('div');
    domc.className = 'lk-outline-container';
    var content = document.createElement('div');
    content.className = 'lk-content LK-HIDE';
    content.innerHTML = templates;
    var operate = document.createElement('div');
    operate.className = 'LK-OPERATE LK-SHOW';
    operate.addEventListener('click', function () {
        if (content.className === 'lk-content LK-HIDE') {
            content.className = 'lk-content LK-SHOW';
        }
        else {
            content.className = 'lk-content LK-HIDE';
        }
    });
    domc.appendChild(content);
    domc.appendChild(operate);
    document.body.append(domc);
}
function init() {
    var parent = getTopParent();
    if (!parent || !parent.firstElementChild)
        return;
    // const hTagList: string[] = createHTagList(6);
    var hTagList = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
    var tree = traveral(parent.firstElementChild, [], hTagList);
    if (tree.length) {
        var templates = template(tree);
        createDom(templates);
    }
}
init();

},{}],0:[function(require,module,exports) {
var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent) {
  var ws = new WebSocket('ws://localhost:58770/');
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = () => {
        window.location.reload();
      }
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
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
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(+k);
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

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id)
  });
}
},{}]},{},[0,3])