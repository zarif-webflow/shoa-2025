var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// bin/live-reload.js
var init_live_reload = __esm({
  "bin/live-reload.js"() {
    "use strict";
    new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());
  }
});

// node_modules/.pnpm/@taj-wf+utils@1.1.1/node_modules/@taj-wf/utils/dist/index.js
init_live_reload();
var m = (e) => {
  window.Webflow ||= [], window.Webflow.push(e);
};
var c = ({ selector: e, parent: t, log: n = "debug" }) => {
  let o = (t || document).querySelector(e);
  return o === null ? (n === false || (n === "debug" ? console.debug : console.error)(`${n.toUpperCase()}: Element with selector "${e}" not found in ${t !== void 0 ? "the specified parent element:" : "the document."}`, t), null) : o;
};
var d = ({ selector: e, parent: t, log: n = "debug" }) => {
  let o = Array.from((t || document).querySelectorAll(e));
  return o.length === 0 ? (n === false || (n === "debug" ? console.debug : console.error)(`${n.toUpperCase()}: No elements found with selector "${e}" in ${t !== void 0 ? "the specified parent element:" : "the document."}`, t), null) : o;
};
var u = () => {
  let e = import.meta.url;
  return c({ selector: `script[src="${e}"]` });
};
var y = (e = [], t) => {
  let n = null, o = t === "debug" ? console.debug : t === "error" ? console.error : null;
  try {
    n = gsap;
  } catch {
    o?.("GSAP script needs to be imported before this script:", u(), `
`, "Get GSAP from here: https://gsap.com/docs/v3/Installation/ ");
  }
  let r = [n];
  for (let l = 0; l < e.length; l++) {
    let s = e[l], p = null;
    try {
      p = window[s] || null;
    } catch {
      o?.(`${s} plugin script needs to be imported before this script.`, u(), `
`, `Get ${s} plugin from here: https://gsap.com/docs/v3/Installation/ `);
    }
    r[l + 1] = p;
  }
  return r;
};

export {
  __commonJS,
  __toESM,
  init_live_reload,
  m,
  c,
  d,
  y
};
//# sourceMappingURL=chunk-RARI25CR.js.map
