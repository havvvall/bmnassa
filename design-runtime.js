(function () {
  var tpl = document.getElementById("tpl").content;
  var app = document.getElementById("app");
  var comp = new Component({});
  var MUST = /\{\{\s*([^}]+?)\s*\}\}/g;

  function get(path, scope, d) {
    var parts = path.trim().split(".");
    var cur = Object.prototype.hasOwnProperty.call(scope, parts[0]) ? scope[parts[0]] : d[parts[0]];
    for (var i = 1; i < parts.length && cur != null; i++) cur = cur[parts[i]];
    return cur;
  }
  function interp(str, scope, d) {
    return str.replace(MUST, function (_, e) { var v = get(e, scope, d); return v == null ? "" : String(v); });
  }
  function bindRef(el, expr, scope, d) {
    var fn = get(expr, scope, d);
    if (typeof fn === "function") fn(el);
  }
  function process(parent, scope, d) {
    var kids = Array.prototype.slice.call(parent.childNodes);
    kids.forEach(function (node) {
      if (node.nodeType === 3) {
        if (node.nodeValue.indexOf("{{") >= 0) node.nodeValue = interp(node.nodeValue, scope, d);
        return;
      }
      if (node.nodeType !== 1) return;
      var tag = node.tagName;
      if (tag === "SC-FOR") {
        var list = get(node.getAttribute("list").replace(/^\{\{|\}\}$/g, ""), scope, d) || [];
        var as = node.getAttribute("as") || "item";
        var frag = document.createDocumentFragment();
        list.forEach(function (item) {
          var s2 = Object.assign({}, scope); s2[as] = item;
          Array.prototype.slice.call(node.childNodes).forEach(function (c) {
            var cc = c.cloneNode(true);
            var holder = document.createElement("div");
            holder.appendChild(cc);
            process(holder, s2, d);
            while (holder.firstChild) frag.appendChild(holder.firstChild);
          });
        });
        node.parentNode.replaceChild(frag, node);
        return;
      }
      if (tag === "SC-IF") {
        var v = get(node.getAttribute("value").replace(/^\{\{|\}\}$/g, ""), scope, d);
        var frag2 = document.createDocumentFragment();
        if (v) {
          Array.prototype.slice.call(node.childNodes).forEach(function (c) {
            var cc = c.cloneNode(true);
            var holder = document.createElement("div");
            holder.appendChild(cc);
            process(holder, scope, d);
            while (holder.firstChild) frag2.appendChild(holder.firstChild);
          });
        }
        node.parentNode.replaceChild(frag2, node);
        return;
      }
      Array.prototype.slice.call(node.attributes).forEach(function (a) {
        var name = a.name, val = a.value;
        if (name.indexOf("hint-") === 0) { node.removeAttribute(name); return; }
        if (val.indexOf("{{") < 0) return;
        var whole = /^\{\{\s*([^}]+?)\s*\}\}$/.exec(val);
        if (name === "ref") { node.removeAttribute(name); bindRef(node, whole[1], scope, d); return; }
        if (name.indexOf("on") === 0 && whole) {
          node.removeAttribute(name);
          var ev = name.slice(2).toLowerCase();
          var handler = get(whole[1], scope, d);
          if (typeof handler === "function") node.addEventListener(ev, function (e) { handler(e); });
          return;
        }
        node.setAttribute(name, interp(val, scope, d));
      });
      process(node, scope, d);
    });
  }

  function root() { return app.querySelector(".bm"); }

  function paint() {
    var d = comp.renderVals();
    app.innerHTML = "";
    var frag = tpl.cloneNode(true);
    var holder = document.createElement("div");
    holder.appendChild(frag);
    process(holder, {}, d);
    while (holder.firstChild) app.appendChild(holder.firstChild);
  }

  // language toggle and forced updates: repaint from the template; glFrame re-creates GL when the canvas is new
  comp.onState = paint;
  comp.forceUpdate = paint;
  paint();
  comp.componentDidMount && comp.componentDidMount();
  // the template's ref callbacks have set root and canvas; the loop started in componentDidMount draws the stage
})();
