 (function() {
     var m, aa = typeof Object.create == "function" ? Object.create : function(a) {
             var b = function() {};
             b.prototype = a;
             return new b
         },
         ba = typeof Object.defineProperties == "function" ? Object.defineProperty : function(a, b, c) {
             if (a == Array.prototype || a == Object.prototype) return a;
             a[b] = c.value;
             return a
         },
         ea = function(a) {
             a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
             for (var b = 0; b < a.length; ++b) {
                 var c = a[b];
                 if (c && c.Math == Math) return c
             }
             throw Error("Cannot find global object");
         },
         ha = ea(this),
         ia = function(a, b) {
             if (b) a: {
                 var c = ha;a = a.split(".");
                 for (var d = 0; d < a.length - 1; d++) {
                     var e = a[d];
                     if (!(e in c)) break a;
                     c = c[e]
                 }
                 a = a[a.length - 1];d = c[a];b = b(d);b != d && b != null && ba(c, a, {
                     configurable: !0,
                     writable: !0,
                     value: b
                 })
             }
         },
         ka = function() {
             function a() {
                 function c() {}
                 new c;
                 Reflect.construct(c, [], function() {});
                 return new c instanceof c
             }
             if (typeof Reflect != "undefined" && Reflect.construct) {
                 if (a()) return Reflect.construct;
                 var b = Reflect.construct;
                 return function(c, d, e) {
                     c = b(c, d);
                     e && Reflect.setPrototypeOf(c,
                         e.prototype);
                     return c
                 }
             }
             return function(c, d, e) {
                 e === void 0 && (e = c);
                 e = aa(e.prototype || Object.prototype);
                 return Function.prototype.apply.call(c, e, d) || e
             }
         }(),
         la;
     if (typeof Object.setPrototypeOf == "function") la = Object.setPrototypeOf;
     else {
         var ma;
         a: {
             var na = {
                     a: !0
                 },
                 oa = {};
             try {
                 oa.__proto__ = na;
                 ma = oa.a;
                 break a
             } catch (a) {}
             ma = !1
         }
         la = ma ? function(a, b) {
             a.__proto__ = b;
             if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
             return a
         } : null
     }
     var pa = la,
         r = function(a, b) {
             a.prototype = aa(b.prototype);
             a.prototype.constructor = a;
             if (pa) pa(a, b);
             else
                 for (var c in b)
                     if (c != "prototype")
                         if (Object.defineProperties) {
                             var d = Object.getOwnPropertyDescriptor(b, c);
                             d && Object.defineProperty(a, c, d)
                         } else a[c] = b[c];
             a.Za = b.prototype
         },
         ra = function(a) {
             var b = 0;
             return function() {
                 return b < a.length ? {
                     done: !1,
                     value: a[b++]
                 } : {
                     done: !0
                 }
             }
         },
         w = function(a) {
             var b = typeof Symbol != "undefined" && Symbol.iterator && a[Symbol.iterator];
             if (b) return b.call(a);
             if (typeof a.length == "number") return {
                 next: ra(a)
             };
             throw Error(String(a) + " is not an iterable or ArrayLike");
         },
         ta = function(a) {
             for (var b, c = []; !(b = a.next()).done;) c.push(b.value);
             return c
         },
         ua = function(a) {
             return a instanceof Array ? a : ta(w(a))
         },
         wa = function(a) {
             return va(a, a)
         },
         va = function(a, b) {
             a.raw = b;
             Object.freeze && (Object.freeze(a), Object.freeze(b));
             return a
         },
         xa = function(a, b) {
             return Object.prototype.hasOwnProperty.call(a, b)
         },
         ya = typeof Object.assign == "function" ? Object.assign : function(a, b) {
             if (a == null) throw new TypeError("No nullish arg");
             a = Object(a);
             for (var c =
                     1; c < arguments.length; c++) {
                 var d = arguments[c];
                 if (d)
                     for (var e in d) xa(d, e) && (a[e] = d[e])
             }
             return a
         };
     ia("Object.assign", function(a) {
         return a || ya
     });
     var za = function() {
             this.A = !1;
             this.o = null;
             this.j = void 0;
             this.g = 1;
             this.I = this.l = 0;
             this.B = null
         },
         Aa = function(a) {
             if (a.A) throw new TypeError("Generator is already running");
             a.A = !0
         };
     za.prototype.C = function(a) {
         this.j = a
     };
     var Ca = function(a, b) {
         a.B = {
             qf: b,
             Eh: !0
         };
         a.g = a.l || a.I
     };
     za.prototype.return = function(a) {
         this.B = {
             return: a
         };
         this.g = this.I
     };
     var Da = function(a, b, c) {
             a.g = c;
             return {
                 value: b
             }
         },
         Ea = function(a, b) {
             a.g = b;
             a.l = 0
         },
         Fa = function(a) {
             a.l = 0;
             var b = a.B.qf;
             a.B = null;
             return b
         },
         Ga = function(a) {
             this.g = new za;
             this.j = a
         },
         Ja = function(a, b) {
             Aa(a.g);
             var c = a.g.o;
             if (c) return Ha(a, "return" in c ? c["return"] : function(d) {
                 return {
                     value: d,
                     done: !0
                 }
             }, b, a.g.return);
             a.g.return(b);
             return Ia(a)
         },
         Ha = function(a, b, c, d) {
             try {
                 var e = b.call(a.g.o, c);
                 if (!(e instanceof Object)) throw new TypeError("Iterator result " + e + " is not an object");
                 if (!e.done) return a.g.A = !1, e;
                 var f = e.value
             } catch (g) {
                 return a.g.o =
                     null, Ca(a.g, g), Ia(a)
             }
             a.g.o = null;
             d.call(a.g, f);
             return Ia(a)
         },
         Ia = function(a) {
             for (; a.g.g;) try {
                 var b = a.j(a.g);
                 if (b) return a.g.A = !1, {
                     value: b.value,
                     done: !1
                 }
             } catch (c) {
                 a.g.j = void 0, Ca(a.g, c)
             }
             a.g.A = !1;
             if (a.g.B) {
                 b = a.g.B;
                 a.g.B = null;
                 if (b.Eh) throw b.qf;
                 return {
                     value: b.return,
                     done: !0
                 }
             }
             return {
                 value: void 0,
                 done: !0
             }
         },
         Ka = function(a) {
             this.next = function(b) {
                 Aa(a.g);
                 a.g.o ? b = Ha(a, a.g.o.next, b, a.g.C) : (a.g.C(b), b = Ia(a));
                 return b
             };
             this.throw = function(b) {
                 Aa(a.g);
                 a.g.o ? b = Ha(a, a.g.o["throw"], b, a.g.C) : (Ca(a.g, b), b = Ia(a));
                 return b
             };
             this.return = function(b) {
                 return Ja(a, b)
             };
             this[Symbol.iterator] = function() {
                 return this
             }
         },
         Na = function(a) {
             function b(d) {
                 return a.next(d)
             }

             function c(d) {
                 return a.throw(d)
             }
             return new Promise(function(d, e) {
                 function f(g) {
                     g.done ? d(g.value) : Promise.resolve(g.value).then(b, c).then(f, e)
                 }
                 f(a.next())
             })
         },
         Oa = function(a) {
             return Na(new Ka(new Ga(a)))
         },
         Ra = function() {
             for (var a = Number(this), b = [], c = a; c < arguments.length; c++) b[c - a] = arguments[c];
             return b
         };
     ia("globalThis", function(a) {
         return a || ha
     });
     ia("Reflect", function(a) {
         return a ? a : {}
     });
     ia("Reflect.construct", function() {
         return ka
     });
     ia("Reflect.setPrototypeOf", function(a) {
         return a ? a : pa ? function(b, c) {
             try {
                 return pa(b, c), !0
             } catch (d) {
                 return !1
             }
         } : null
     });
     ia("Symbol", function(a) {
         if (a) return a;
         var b = function(f, g) {
             this.g = f;
             ba(this, "description", {
                 configurable: !0,
                 writable: !0,
                 value: g
             })
         };
         b.prototype.toString = function() {
             return this.g
         };
         var c = "jscomp_symbol_" + (Math.random() * 1E9 >>> 0) + "_",
             d = 0,
             e = function(f) {
                 if (this instanceof e) throw new TypeError("Symbol is not a constructor");
                 return new b(c + (f || "") + "_" + d++, f)
             };
         return e
     });
     ia("Symbol.iterator", function(a) {
         if (a) return a;
         a = Symbol("Symbol.iterator");
         ba(Array.prototype, a, {
             configurable: !0,
             writable: !0,
             value: function() {
                 return Sa(ra(this))
             }
         });
         return a
     });
     var Sa = function(a) {
         a = {
             next: a
         };
         a[Symbol.iterator] = function() {
             return this
         };
         return a
     };
     ia("Promise", function(a) {
         function b() {
             this.g = null
         }

         function c(g) {
             return g instanceof e ? g : new e(function(h) {
                 h(g)
             })
         }
         if (a) return a;
         b.prototype.j = function(g) {
             if (this.g == null) {
                 this.g = [];
                 var h = this;
                 this.l(function() {
                     h.B()
                 })
             }
             this.g.push(g)
         };
         var d = ha.setTimeout;
         b.prototype.l = function(g) {
             d(g, 0)
         };
         b.prototype.B = function() {
             for (; this.g && this.g.length;) {
                 var g = this.g;
                 this.g = [];
                 for (var h = 0; h < g.length; ++h) {
                     var k = g[h];
                     g[h] = null;
                     try {
                         k()
                     } catch (l) {
                         this.o(l)
                     }
                 }
             }
             this.g = null
         };
         b.prototype.o = function(g) {
             this.l(function() {
                 throw g;
             })
         };
         var e = function(g) {
             this.g = 0;
             this.l = void 0;
             this.j = [];
             this.C = !1;
             var h = this.o();
             try {
                 g(h.resolve, h.reject)
             } catch (k) {
                 h.reject(k)
             }
         };
         e.prototype.o = function() {
             function g(l) {
                 return function(n) {
                     k || (k = !0, l.call(h, n))
                 }
             }
             var h = this,
                 k = !1;
             return {
                 resolve: g(this.H),
                 reject: g(this.B)
             }
         };
         e.prototype.H = function(g) {
             if (g === this) this.B(new TypeError("A Promise cannot resolve to itself"));
             else if (g instanceof e) this.M(g);
             else {
                 a: switch (typeof g) {
                     case "object":
                         var h = g != null;
                         break a;
                     case "function":
                         h = !0;
                         break a;
                     default:
                         h = !1
                 }
                 h ?
                 this.G(g) : this.A(g)
             }
         };
         e.prototype.G = function(g) {
             var h = void 0;
             try {
                 h = g.then
             } catch (k) {
                 this.B(k);
                 return
             }
             typeof h == "function" ? this.P(h, g) : this.A(g)
         };
         e.prototype.B = function(g) {
             this.I(2, g)
         };
         e.prototype.A = function(g) {
             this.I(1, g)
         };
         e.prototype.I = function(g, h) {
             if (this.g != 0) throw Error("Cannot settle(" + g + ", " + h + "): Promise already settled in state" + this.g);
             this.g = g;
             this.l = h;
             this.g === 2 && this.K();
             this.L()
         };
         e.prototype.K = function() {
             var g = this;
             d(function() {
                     if (g.F()) {
                         var h = ha.console;
                         typeof h !== "undefined" && h.error(g.l)
                     }
                 },
                 1)
         };
         e.prototype.F = function() {
             if (this.C) return !1;
             var g = ha.CustomEvent,
                 h = ha.Event,
                 k = ha.dispatchEvent;
             if (typeof k === "undefined") return !0;
             typeof g === "function" ? g = new g("unhandledrejection", {
                 cancelable: !0
             }) : typeof h === "function" ? g = new h("unhandledrejection", {
                 cancelable: !0
             }) : (g = ha.document.createEvent("CustomEvent"), g.initCustomEvent("unhandledrejection", !1, !0, g));
             g.promise = this;
             g.reason = this.l;
             return k(g)
         };
         e.prototype.L = function() {
             if (this.j != null) {
                 for (var g = 0; g < this.j.length; ++g) f.j(this.j[g]);
                 this.j =
                     null
             }
         };
         var f = new b;
         e.prototype.M = function(g) {
             var h = this.o();
             g.Wc(h.resolve, h.reject)
         };
         e.prototype.P = function(g, h) {
             var k = this.o();
             try {
                 g.call(h, k.resolve, k.reject)
             } catch (l) {
                 k.reject(l)
             }
         };
         e.prototype.then = function(g, h) {
             function k(q, v) {
                 return typeof q == "function" ? function(u) {
                     try {
                         l(q(u))
                     } catch (t) {
                         n(t)
                     }
                 } : v
             }
             var l, n, p = new e(function(q, v) {
                 l = q;
                 n = v
             });
             this.Wc(k(g, l), k(h, n));
             return p
         };
         e.prototype.catch = function(g) {
             return this.then(void 0, g)
         };
         e.prototype.Wc = function(g, h) {
             function k() {
                 switch (l.g) {
                     case 1:
                         g(l.l);
                         break;
                     case 2:
                         h(l.l);
                         break;
                     default:
                         throw Error("Unexpected state: " + l.g);
                 }
             }
             var l = this;
             this.j == null ? f.j(k) : this.j.push(k);
             this.C = !0
         };
         e.resolve = c;
         e.reject = function(g) {
             return new e(function(h, k) {
                 k(g)
             })
         };
         e.race = function(g) {
             return new e(function(h, k) {
                 for (var l = w(g), n = l.next(); !n.done; n = l.next()) c(n.value).Wc(h, k)
             })
         };
         e.all = function(g) {
             var h = w(g),
                 k = h.next();
             return k.done ? c([]) : new e(function(l, n) {
                 function p(u) {
                     return function(t) {
                         q[u] = t;
                         v--;
                         v == 0 && l(q)
                     }
                 }
                 var q = [],
                     v = 0;
                 do q.push(void 0), v++, c(k.value).Wc(p(q.length -
                     1), n), k = h.next(); while (!k.done)
             })
         };
         return e
     });
     ia("Object.setPrototypeOf", function(a) {
         return a || pa
     });
     ia("Symbol.dispose", function(a) {
         return a ? a : Symbol("Symbol.dispose")
     });
     ia("Array.prototype.find", function(a) {
         return a ? a : function(b, c) {
             a: {
                 var d = this;d instanceof String && (d = String(d));
                 for (var e = d.length, f = 0; f < e; f++) {
                     var g = d[f];
                     if (b.call(c, g, f, d)) {
                         b = g;
                         break a
                     }
                 }
                 b = void 0
             }
             return b
         }
     });
     ia("WeakMap", function(a) {
         function b() {}

         function c(k) {
             var l = typeof k;
             return l === "object" && k !== null || l === "function"
         }

         function d(k) {
             if (!xa(k, f)) {
                 var l = new b;
                 ba(k, f, {
                     value: l
                 })
             }
         }

         function e(k) {
             var l = Object[k];
             l && (Object[k] = function(n) {
                 if (n instanceof b) return n;
                 Object.isExtensible(n) && d(n);
                 return l(n)
             })
         }
         if (function() {
                 if (!a || !Object.seal) return !1;
                 try {
                     var k = Object.seal({}),
                         l = Object.seal({}),
                         n = new a([
                             [k, 2],
                             [l, 3]
                         ]);
                     if (n.get(k) != 2 || n.get(l) != 3) return !1;
                     n.delete(k);
                     n.set(l, 4);
                     return !n.has(k) && n.get(l) == 4
                 } catch (p) {
                     return !1
                 }
             }()) return a;
         var f = "$jscomp_hidden_" + Math.random();
         e("freeze");
         e("preventExtensions");
         e("seal");
         var g = 0,
             h = function(k) {
                 this.g = (g += Math.random() + 1).toString();
                 if (k) {
                     k = w(k);
                     for (var l; !(l = k.next()).done;) l = l.value, this.set(l[0], l[1])
                 }
             };
         h.prototype.set = function(k, l) {
             if (!c(k)) throw Error("Invalid WeakMap key");
             d(k);
             if (!xa(k, f)) throw Error("WeakMap key fail: " + k);
             k[f][this.g] = l;
             return this
         };
         h.prototype.get = function(k) {
             return c(k) && xa(k, f) ? k[f][this.g] : void 0
         };
         h.prototype.has = function(k) {
             return c(k) && xa(k, f) && xa(k[f],
                 this.g)
         };
         h.prototype.delete = function(k) {
             return c(k) && xa(k, f) && xa(k[f], this.g) ? delete k[f][this.g] : !1
         };
         return h
     });
     ia("Map", function(a) {
         if (function() {
                 if (!a || typeof a != "function" || !a.prototype.entries || typeof Object.seal != "function") return !1;
                 try {
                     var h = Object.seal({
                             x: 4
                         }),
                         k = new a(w([
                             [h, "s"]
                         ]));
                     if (k.get(h) != "s" || k.size != 1 || k.get({
                             x: 4
                         }) || k.set({
                             x: 4
                         }, "t") != k || k.size != 2) return !1;
                     var l = k.entries(),
                         n = l.next();
                     if (n.done || n.value[0] != h || n.value[1] != "s") return !1;
                     n = l.next();
                     return n.done || n.value[0].x != 4 || n.value[1] != "t" || !l.next().done ? !1 : !0
                 } catch (p) {
                     return !1
                 }
             }()) return a;
         var b = new WeakMap,
             c = function(h) {
                 this[0] = {};
                 this[1] =
                     f();
                 this.size = 0;
                 if (h) {
                     h = w(h);
                     for (var k; !(k = h.next()).done;) k = k.value, this.set(k[0], k[1])
                 }
             };
         c.prototype.set = function(h, k) {
             h = h === 0 ? 0 : h;
             var l = d(this, h);
             l.list || (l.list = this[0][l.id] = []);
             l.entry ? l.entry.value = k : (l.entry = {
                 next: this[1],
                 ob: this[1].ob,
                 head: this[1],
                 key: h,
                 value: k
             }, l.list.push(l.entry), this[1].ob.next = l.entry, this[1].ob = l.entry, this.size++);
             return this
         };
         c.prototype.delete = function(h) {
             h = d(this, h);
             return h.entry && h.list ? (h.list.splice(h.index, 1), h.list.length || delete this[0][h.id], h.entry.ob.next =
                 h.entry.next, h.entry.next.ob = h.entry.ob, h.entry.head = null, this.size--, !0) : !1
         };
         c.prototype.clear = function() {
             this[0] = {};
             this[1] = this[1].ob = f();
             this.size = 0
         };
         c.prototype.has = function(h) {
             return !!d(this, h).entry
         };
         c.prototype.get = function(h) {
             return (h = d(this, h).entry) && h.value
         };
         c.prototype.entries = function() {
             return e(this, function(h) {
                 return [h.key, h.value]
             })
         };
         c.prototype.keys = function() {
             return e(this, function(h) {
                 return h.key
             })
         };
         c.prototype.values = function() {
             return e(this, function(h) {
                 return h.value
             })
         };
         c.prototype.forEach =
             function(h, k) {
                 for (var l = this.entries(), n; !(n = l.next()).done;) n = n.value, h.call(k, n[1], n[0], this)
             };
         c.prototype[Symbol.iterator] = c.prototype.entries;
         var d = function(h, k) {
                 var l = k && typeof k;
                 l == "object" || l == "function" ? b.has(k) ? l = b.get(k) : (l = "" + ++g, b.set(k, l)) : l = "p_" + k;
                 var n = h[0][l];
                 if (n && xa(h[0], l))
                     for (h = 0; h < n.length; h++) {
                         var p = n[h];
                         if (k !== k && p.key !== p.key || k === p.key) return {
                             id: l,
                             list: n,
                             index: h,
                             entry: p
                         }
                     }
                 return {
                     id: l,
                     list: n,
                     index: -1,
                     entry: void 0
                 }
             },
             e = function(h, k) {
                 var l = h[1];
                 return Sa(function() {
                     if (l) {
                         for (; l.head !=
                             h[1];) l = l.ob;
                         for (; l.next != l.head;) return l = l.next, {
                             done: !1,
                             value: k(l)
                         };
                         l = null
                     }
                     return {
                         done: !0,
                         value: void 0
                     }
                 })
             },
             f = function() {
                 var h = {};
                 return h.ob = h.next = h.head = h
             },
             g = 0;
         return c
     });
     ia("Set", function(a) {
         if (function() {
                 if (!a || typeof a != "function" || !a.prototype.entries || typeof Object.seal != "function") return !1;
                 try {
                     var c = Object.seal({
                             x: 4
                         }),
                         d = new a(w([c]));
                     if (!d.has(c) || d.size != 1 || d.add(c) != d || d.size != 1 || d.add({
                             x: 4
                         }) != d || d.size != 2) return !1;
                     var e = d.entries(),
                         f = e.next();
                     if (f.done || f.value[0] != c || f.value[1] != c) return !1;
                     f = e.next();
                     return f.done || f.value[0] == c || f.value[0].x != 4 || f.value[1] != f.value[0] ? !1 : e.next().done
                 } catch (g) {
                     return !1
                 }
             }()) return a;
         var b = function(c) {
             this.g = new Map;
             if (c) {
                 c =
                     w(c);
                 for (var d; !(d = c.next()).done;) this.add(d.value)
             }
             this.size = this.g.size
         };
         b.prototype.add = function(c) {
             c = c === 0 ? 0 : c;
             this.g.set(c, c);
             this.size = this.g.size;
             return this
         };
         b.prototype.delete = function(c) {
             c = this.g.delete(c);
             this.size = this.g.size;
             return c
         };
         b.prototype.clear = function() {
             this.g.clear();
             this.size = 0
         };
         b.prototype.has = function(c) {
             return this.g.has(c)
         };
         b.prototype.entries = function() {
             return this.g.entries()
         };
         b.prototype.values = function() {
             return this.g.values()
         };
         b.prototype.keys = b.prototype.values;
         b.prototype[Symbol.iterator] = b.prototype.values;
         b.prototype.forEach = function(c, d) {
             var e = this;
             this.g.forEach(function(f) {
                 return c.call(d, f, f, e)
             })
         };
         return b
     });
     ia("Object.values", function(a) {
         return a ? a : function(b) {
             var c = [],
                 d;
             for (d in b) xa(b, d) && c.push(b[d]);
             return c
         }
     });
     ia("Object.is", function(a) {
         return a ? a : function(b, c) {
             return b === c ? b !== 0 || 1 / b === 1 / c : b !== b && c !== c
         }
     });
     ia("Array.prototype.includes", function(a) {
         return a ? a : function(b, c) {
             var d = this;
             d instanceof String && (d = String(d));
             var e = d.length;
             c = c || 0;
             for (c < 0 && (c = Math.max(c + e, 0)); c < e; c++) {
                 var f = d[c];
                 if (f === b || Object.is(f, b)) return !0
             }
             return !1
         }
     });
     var Ta = function(a, b, c) {
         if (a == null) throw new TypeError("The 'this' value for String.prototype." + c + " must not be null or undefined");
         if (b instanceof RegExp) throw new TypeError("First argument to String.prototype." + c + " must not be a regular expression");
         return a + ""
     };
     ia("String.prototype.includes", function(a) {
         return a ? a : function(b, c) {
             return Ta(this, b, "includes").indexOf(b, c || 0) !== -1
         }
     });
     ia("Array.from", function(a) {
         return a ? a : function(b, c, d) {
             c = c != null ? c : function(h) {
                 return h
             };
             var e = [],
                 f = typeof Symbol != "undefined" && Symbol.iterator && b[Symbol.iterator];
             if (typeof f == "function") {
                 b = f.call(b);
                 for (var g = 0; !(f = b.next()).done;) e.push(c.call(d, f.value, g++))
             } else
                 for (f = b.length, g = 0; g < f; g++) e.push(c.call(d, b[g], g));
             return e
         }
     });
     ia("Object.entries", function(a) {
         return a ? a : function(b) {
             var c = [],
                 d;
             for (d in b) xa(b, d) && c.push([d, b[d]]);
             return c
         }
     });
     ia("Number.isFinite", function(a) {
         return a ? a : function(b) {
             return typeof b !== "number" ? !1 : !isNaN(b) && b !== Infinity && b !== -Infinity
         }
     });
     ia("Number.MAX_SAFE_INTEGER", function() {
         return 9007199254740991
     });
     ia("Number.MIN_SAFE_INTEGER", function() {
         return -9007199254740991
     });
     ia("Number.isInteger", function(a) {
         return a ? a : function(b) {
             return Number.isFinite(b) ? b === Math.floor(b) : !1
         }
     });
     ia("Number.isSafeInteger", function(a) {
         return a ? a : function(b) {
             return Number.isInteger(b) && Math.abs(b) <= Number.MAX_SAFE_INTEGER
         }
     });
     ia("String.prototype.startsWith", function(a) {
         return a ? a : function(b, c) {
             var d = Ta(this, b, "startsWith");
             b += "";
             var e = d.length,
                 f = b.length;
             c = Math.max(0, Math.min(c | 0, d.length));
             for (var g = 0; g < f && c < e;)
                 if (d[c++] != b[g++]) return !1;
             return g >= f
         }
     });
     var Ua = function(a, b) {
         a instanceof String && (a += "");
         var c = 0,
             d = !1,
             e = {
                 next: function() {
                     if (!d && c < a.length) {
                         var f = c++;
                         return {
                             value: b(f, a[f]),
                             done: !1
                         }
                     }
                     d = !0;
                     return {
                         done: !0,
                         value: void 0
                     }
                 }
             };
         e[Symbol.iterator] = function() {
             return e
         };
         return e
     };
     ia("Array.prototype.entries", function(a) {
         return a ? a : function() {
             return Ua(this, function(b, c) {
                 return [b, c]
             })
         }
     });
     ia("Math.trunc", function(a) {
         return a ? a : function(b) {
             b = Number(b);
             if (isNaN(b) || b === Infinity || b === -Infinity || b === 0) return b;
             var c = Math.floor(Math.abs(b));
             return b < 0 ? -c : c
         }
     });
     ia("Number.isNaN", function(a) {
         return a ? a : function(b) {
             return typeof b === "number" && isNaN(b)
         }
     });
     ia("Array.prototype.keys", function(a) {
         return a ? a : function() {
             return Ua(this, function(b) {
                 return b
             })
         }
     });
     ia("Array.prototype.values", function(a) {
         return a ? a : function() {
             return Ua(this, function(b, c) {
                 return c
             })
         }
     });
     ia("Object.fromEntries", function(a) {
         return a ? a : function(b) {
             var c = {};
             if (!(Symbol.iterator in b)) throw new TypeError("" + b + " is not iterable");
             b = b[Symbol.iterator].call(b);
             for (var d = b.next(); !d.done; d = b.next()) {
                 d = d.value;
                 if (Object(d) !== d) throw new TypeError("iterable for fromEntries should yield objects");
                 c[d[0]] = d[1]
             }
             return c
         }
     });
     ia("String.prototype.repeat", function(a) {
         return a ? a : function(b) {
             var c = Ta(this, null, "repeat");
             if (b < 0 || b > 1342177279) throw new RangeError("Invalid count value");
             b |= 0;
             for (var d = ""; b;)
                 if (b & 1 && (d += c), b >>>= 1) c += c;
             return d
         }
     });
     var Va = function(a, b) {
         a = a !== void 0 ? String(a) : " ";
         return b > 0 && a ? a.repeat(Math.ceil(b / a.length)).substring(0, b) : ""
     };
     ia("String.prototype.padStart", function(a) {
         return a ? a : function(b, c) {
             var d = Ta(this, null, "padStart");
             return Va(c, b - d.length) + d
         }
     });
     ia("String.prototype.padEnd", function(a) {
         return a ? a : function(b, c) {
             var d = Ta(this, null, "padStart");
             return d + Va(c, b - d.length)
         }
     });
     ia("Promise.allSettled", function(a) {
         function b(d) {
             return {
                 status: "fulfilled",
                 value: d
             }
         }

         function c(d) {
             return {
                 status: "rejected",
                 reason: d
             }
         }
         return a ? a : function(d) {
             var e = this;
             d = Array.from(d, function(f) {
                 return e.resolve(f).then(b, c)
             });
             return e.all(d)
         }
     });
     ia("Math.imul", function(a) {
         return a ? a : function(b, c) {
             b = Number(b);
             c = Number(c);
             var d = b & 65535,
                 e = c & 65535;
             return d * e + ((b >>> 16 & 65535) * e + d * (c >>> 16 & 65535) << 16 >>> 0) | 0
         }
     });
     /* 
      
      Copyright The Closure Library Authors. 
      SPDX-License-Identifier: Apache-2.0 
     */
     var Wa = Wa || {},
         x = this || self,
         z = function(a, b, c) {
             a = a.split(".");
             c = c || x;
             for (var d; a.length && (d = a.shift());) a.length || b === void 0 ? c[d] && c[d] !== Object.prototype[d] ? c = c[d] : c = c[d] = {} : c[d] = b
         },
         Ya = function(a, b) {
             var c = Xa("CLOSURE_FLAGS");
             a = c && c[a];
             return a != null ? a : b
         },
         Xa = function(a, b) {
             a = a.split(".");
             b = b || x;
             for (var c = 0; c < a.length; c++)
                 if (b = b[a[c]], b == null) return null;
             return b
         },
         Za = function(a) {
             var b = typeof a;
             return b != "object" ? b : a ? Array.isArray(a) ? "array" : b : "null"
         },
         $a = function(a) {
             var b = Za(a);
             return b == "array" || b == "object" &&
                 typeof a.length == "number"
         },
         db = function(a) {
             var b = typeof a;
             return b == "object" && a != null || b == "function"
         },
         gb = function(a) {
             return Object.prototype.hasOwnProperty.call(a, eb) && a[eb] || (a[eb] = ++fb)
         },
         jb = function(a) {
             a !== null && "removeAttribute" in a && a.removeAttribute(eb);
             try {
                 delete a[eb]
             } catch (b) {}
         },
         eb = "closure_uid_" + (Math.random() * 1E9 >>> 0),
         fb = 0,
         kb = function(a, b, c) {
             return a.call.apply(a.bind, arguments)
         },
         lb = function(a, b, c) {
             if (!a) throw Error();
             if (arguments.length > 2) {
                 var d = Array.prototype.slice.call(arguments, 2);
                 return function() {
                     var e =
                         Array.prototype.slice.call(arguments);
                     Array.prototype.unshift.apply(e, d);
                     return a.apply(b, e)
                 }
             }
             return function() {
                 return a.apply(b, arguments)
             }
         },
         nb = function(a, b, c) {
             nb = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? kb : lb;
             return nb.apply(null, arguments)
         },
         ob = function(a, b) {
             var c = Array.prototype.slice.call(arguments, 1);
             return function() {
                 var d = c.slice();
                 d.push.apply(d, arguments);
                 return a.apply(this, d)
             }
         },
         pb = function() {
             return Date.now()
         },
         qb = function(a) {
             return a
         },
         sb = function(a,
             b) {
             function c() {}
             c.prototype = b.prototype;
             a.Za = b.prototype;
             a.prototype = new c;
             a.prototype.constructor = a;
             a.jk = function(d, e, f) {
                 for (var g = Array(arguments.length - 2), h = 2; h < arguments.length; h++) g[h - 2] = arguments[h];
                 return b.prototype[e].apply(d, g)
             }
         };

     function tb(a, b) {
         if (Error.captureStackTrace) Error.captureStackTrace(this, tb);
         else {
             var c = Error().stack;
             c && (this.stack = c)
         }
         a && (this.message = String(a));
         b !== void 0 && (this.cause = b)
     }
     sb(tb, Error);
     tb.prototype.name = "CustomError";
     var ub;
     var vb, yb = typeof String.prototype.isWellFormed === "function",
         zb = typeof TextEncoder !== "undefined";

     function Ab(a) {
         var b = !1;
         b = b === void 0 ? !1 : b;
         if (zb) {
             if (b && (yb ? !a.isWellFormed() : /(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])/.test(a))) throw Error("Found an unpaired surrogate");
             a = (vb || (vb = new TextEncoder)).encode(a)
         } else {
             for (var c = 0, d = new Uint8Array(3 * a.length), e = 0; e < a.length; e++) {
                 var f = a.charCodeAt(e);
                 if (f < 128) d[c++] = f;
                 else {
                     if (f < 2048) d[c++] = f >> 6 | 192;
                     else {
                         if (f >= 55296 && f <= 57343) {
                             if (f <= 56319 && e < a.length) {
                                 var g = a.charCodeAt(++e);
                                 if (g >= 56320 && g <= 57343) {
                                     f = (f - 55296) * 1024 + g - 56320 +
                                         65536;
                                     d[c++] = f >> 18 | 240;
                                     d[c++] = f >> 12 & 63 | 128;
                                     d[c++] = f >> 6 & 63 | 128;
                                     d[c++] = f & 63 | 128;
                                     continue
                                 } else e--
                             }
                             if (b) throw Error("Found an unpaired surrogate");
                             f = 65533
                         }
                         d[c++] = f >> 12 | 224;
                         d[c++] = f >> 6 & 63 | 128
                     }
                     d[c++] = f & 63 | 128
                 }
             }
             a = c === d.length ? d : d.subarray(0, c)
         }
         return a
     };

     function Bb(a) {
         x.setTimeout(function() {
             throw a;
         }, 0)
     };

     function Cb(a, b) {
         var c = a.length - b.length;
         return c >= 0 && a.indexOf(b, c) == c
     }

     function Db(a) {
         return /^[\s\xa0]*$/.test(a)
     }
     var Eb = String.prototype.trim ? function(a) {
             return a.trim()
         } : function(a) {
             return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]
         },
         Fb = /&/g,
         Gb = /</g,
         Hb = />/g,
         Ib = /"/g,
         Jb = /'/g,
         Kb = /\x00/g,
         Lb = /[\x00&<>"']/;

     function Mb(a, b) {
         return a.indexOf(b) != -1
     }

     function Nb(a, b) {
         return Mb(a.toLowerCase(), b.toLowerCase())
     }

     function Ob(a, b) {
         var c = 0;
         a = Eb(String(a)).split(".");
         b = Eb(String(b)).split(".");
         for (var d = Math.max(a.length, b.length), e = 0; c == 0 && e < d; e++) {
             var f = a[e] || "",
                 g = b[e] || "";
             do {
                 f = /(\d*)(\D*)(.*)/.exec(f) || ["", "", "", ""];
                 g = /(\d*)(\D*)(.*)/.exec(g) || ["", "", "", ""];
                 if (f[0].length == 0 && g[0].length == 0) break;
                 c = Pb(f[1].length == 0 ? 0 : parseInt(f[1], 10), g[1].length == 0 ? 0 : parseInt(g[1], 10)) || Pb(f[2].length == 0, g[2].length == 0) || Pb(f[2], g[2]);
                 f = f[3];
                 g = g[3]
             } while (c == 0)
         }
         return c
     }

     function Pb(a, b) {
         return a < b ? -1 : a > b ? 1 : 0
     };
     var Qb = Ya(610401301, !1),
         Rb = Ya(748402147, !0);

     function Sb() {
         var a = x.navigator;
         return a && (a = a.userAgent) ? a : ""
     }
     var Tb, Ub = x.navigator;
     Tb = Ub ? Ub.userAgentData || null : null;

     function Vb(a) {
         if (!Qb || !Tb) return !1;
         for (var b = 0; b < Tb.brands.length; b++) {
             var c = Tb.brands[b].brand;
             if (c && Mb(c, a)) return !0
         }
         return !1
     }

     function A(a) {
         return Mb(Sb(), a)
     };

     function Wb() {
         return Qb ? !!Tb && Tb.brands.length > 0 : !1
     }

     function Xb() {
         return Wb() ? !1 : A("Opera")
     }

     function Yb() {
         return Wb() ? !1 : A("Trident") || A("MSIE")
     }

     function Zb() {
         return A("Firefox") || A("FxiOS")
     }

     function $b() {
         return Wb() ? Vb("Chromium") : (A("Chrome") || A("CriOS")) && !(Wb() ? 0 : A("Edge")) || A("Silk")
     };

     function bc() {
         return Qb && Tb && Tb.platform ? Tb.platform === "Android" : A("Android")
     }

     function cc() {
         return A("iPhone") && !A("iPod") && !A("iPad")
     };
     var dc = function(a, b) {
             if (typeof a === "string") return typeof b !== "string" || b.length != 1 ? -1 : a.indexOf(b, 0);
             for (var c = 0; c < a.length; c++)
                 if (c in a && a[c] === b) return c;
             return -1
         },
         ec = function(a, b) {
             for (var c = a.length, d = typeof a === "string" ? a.split("") : a, e = 0; e < c; e++) e in d && b.call(void 0, d[e], e, a)
         };

     function fc(a, b) {
         for (var c = typeof a === "string" ? a.split("") : a, d = a.length - 1; d >= 0; --d) d in c && b.call(void 0, c[d], d, a)
     }
     var hc = function(a, b) {
             for (var c = a.length, d = [], e = 0, f = typeof a === "string" ? a.split("") : a, g = 0; g < c; g++)
                 if (g in f) {
                     var h = f[g];
                     b.call(void 0, h, g, a) && (d[e++] = h)
                 } return d
         },
         ic = function(a, b) {
             for (var c = a.length, d = Array(c), e = typeof a === "string" ? a.split("") : a, f = 0; f < c; f++) f in e && (d[f] = b.call(void 0, e[f], f, a));
             return d
         },
         jc = function(a, b, c) {
             var d = c;
             ec(a, function(e, f) {
                 d = b.call(void 0, d, e, f, a)
             });
             return d
         },
         kc = function(a, b) {
             for (var c = a.length, d = typeof a === "string" ? a.split("") : a, e = 0; e < c; e++)
                 if (e in d && b.call(void 0, d[e],
                         e, a)) return !0;
             return !1
         };

     function mc(a, b) {
         b = nc(a, b);
         return b < 0 ? null : typeof a === "string" ? a.charAt(b) : a[b]
     }

     function nc(a, b) {
         for (var c = a.length, d = typeof a === "string" ? a.split("") : a, e = 0; e < c; e++)
             if (e in d && b.call(void 0, d[e], e, a)) return e;
         return -1
     }

     function oc(a, b) {
         b = pc(a, b);
         return b < 0 ? null : typeof a === "string" ? a.charAt(b) : a[b]
     }

     function pc(a, b) {
         for (var c = typeof a === "string" ? a.split("") : a, d = a.length - 1; d >= 0; d--)
             if (d in c && b.call(void 0, c[d], d, a)) return d;
         return -1
     }

     function qc(a, b) {
         return dc(a, b) >= 0
     }

     function rc(a, b) {
         b = dc(a, b);
         var c;
         (c = b >= 0) && sc(a, b);
         return c
     }

     function sc(a, b) {
         return Array.prototype.splice.call(a, b, 1).length == 1
     }

     function tc(a, b) {
         var c = 0;
         fc(a, function(d, e) {
             b.call(void 0, d, e, a) && sc(a, e) && c++
         })
     }

     function uc(a) {
         return Array.prototype.concat.apply([], arguments)
     }

     function vc(a) {
         var b = a.length;
         if (b > 0) {
             for (var c = Array(b), d = 0; d < b; d++) c[d] = a[d];
             return c
         }
         return []
     }

     function wc(a) {
         for (var b = 0, c = 0, d = {}; c < a.length;) {
             var e = a[c++],
                 f = db(e) ? "o" + gb(e) : (typeof e).charAt(0) + e;
             Object.prototype.hasOwnProperty.call(d, f) || (d[f] = !0, a[b++] = e)
         }
         a.length = b
     }

     function yc(a, b) {
         a.sort(b || zc)
     }

     function zc(a, b) {
         return a > b ? 1 : a < b ? -1 : 0
     }

     function Ac(a) {
         for (var b = [], c = 0; c < a; c++) b[c] = "";
         return b
     };
     var Bc = function(a) {
         Bc[" "](a);
         return a
     };
     Bc[" "] = function() {};
     var Cc = function(a, b) {
             try {
                 return Bc(a[b]), !0
             } catch (c) {}
             return !1
         },
         Ec = function(a) {
             var b = Dc;
             return Object.prototype.hasOwnProperty.call(b, 8) ? b[8] : b[8] = a(8)
         };
     var Fc = Xb(),
         Gc = Yb(),
         Hc = A("Edge"),
         Ic = A("Gecko") && !(Nb(Sb(), "WebKit") && !A("Edge")) && !(A("Trident") || A("MSIE")) && !A("Edge"),
         Jc = Nb(Sb(), "WebKit") && !A("Edge"),
         Kc = Qb && Tb && Tb.platform ? Tb.platform === "macOS" : A("Macintosh"),
         Lc = bc(),
         Mc = cc(),
         Nc = A("iPad"),
         Oc = A("iPod"),
         Pc = cc() || A("iPad") || A("iPod"),
         Qc;
     a: {
         var Rc = "",
             Sc = function() {
                 var a = Sb();
                 if (Ic) return /rv:([^\);]+)(\)|;)/.exec(a);
                 if (Hc) return /Edge\/([\d\.]+)/.exec(a);
                 if (Gc) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
                 if (Jc) return /WebKit\/(\S+)/.exec(a);
                 if (Fc) return /(?:Version)[ \/]?(\S+)/.exec(a)
             }();Sc && (Rc = Sc ? Sc[1] : "");
         if (Gc) {
             var Tc, Uc = x.document;
             Tc = Uc ? Uc.documentMode : void 0;
             if (Tc != null && Tc > parseFloat(Rc)) {
                 Qc = String(Tc);
                 break a
             }
         }
         Qc = Rc
     }
     var Vc = Qc,
         Dc = {},
         Wc = function() {
             return Ec(function() {
                 return Ob(Vc, 8) >= 0
             })
         };
     var Xc = Zb(),
         Yc = A("Android") && !($b() || Zb() || Xb() || A("Silk")),
         Zc = $b();
     var $c = {},
         ad = null,
         cd = function(a, b) {
             b === void 0 && (b = 0);
             bd();
             b = $c[b];
             for (var c = Array(Math.floor(a.length / 3)), d = b[64] || "", e = 0, f = 0; e < a.length - 2; e += 3) {
                 var g = a[e],
                     h = a[e + 1],
                     k = a[e + 2],
                     l = b[g >> 2];
                 g = b[(g & 3) << 4 | h >> 4];
                 h = b[(h & 15) << 2 | k >> 6];
                 k = b[k & 63];
                 c[f++] = "" + l + g + h + k
             }
             l = 0;
             k = d;
             switch (a.length - e) {
                 case 2:
                     l = a[e + 1], k = b[(l & 15) << 2] || d;
                 case 1:
                     a = a[e], c[f] = "" + b[a >> 2] + b[(a & 3) << 4 | l >> 4] + k + d
             }
             return c.join("")
         },
         ed = function(a) {
             var b = [];
             dd(a, function(c) {
                 b.push(c)
             });
             return b
         },
         dd = function(a, b) {
             function c(k) {
                 for (; d < a.length;) {
                     var l = a.charAt(d++),
                         n = ad[l];
                     if (n != null) return n;
                     if (!Db(l)) throw Error("Unknown base64 encoding at char: " + l);
                 }
                 return k
             }
             bd();
             for (var d = 0;;) {
                 var e = c(-1),
                     f = c(0),
                     g = c(64),
                     h = c(64);
                 if (h === 64 && e === -1) break;
                 b(e << 2 | f >> 4);
                 g != 64 && (b(f << 4 & 240 | g >> 2), h != 64 && b(g << 6 & 192 | h))
             }
         },
         bd = function() {
             if (!ad) {
                 ad = {};
                 for (var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""), b = ["+/=", "+/", "-_=", "-_.", "-_"], c = 0; c < 5; c++) {
                     var d = a.concat(b[c].split(""));
                     $c[c] = d;
                     for (var e = 0; e < d.length; e++) {
                         var f = d[e];
                         ad[f] === void 0 && (ad[f] = e)
                     }
                 }
             }
         };

     function fd(a, b) {
         a.__closure__error__context__984382 || (a.__closure__error__context__984382 = {});
         a.__closure__error__context__984382.severity = b
     };
     var gd = void 0;

     function hd(a) {
         a = Error(a);
         fd(a, "warning");
         return a
     }

     function id(a, b) {
         if (a != null) {
             var c;
             var d = (c = gd) != null ? c : gd = {};
             c = d[a] || 0;
             c >= b || (d[a] = c + 1, a = Error(), fd(a, "incident"), Bb(a))
         }
     };
     var kd = typeof Symbol === "function" && typeof Symbol() === "symbol";

     function ld(a, b, c) {
         return typeof Symbol === "function" && typeof Symbol() === "symbol" ? (c === void 0 ? 0 : c) && Symbol.for && a ? Symbol.for(a) : a != null ? Symbol(a) : Symbol() : b
     }
     var md = ld("jas", void 0, !0),
         nd = ld(void 0, "0di"),
         od = ld(void 0, "1oa"),
         pd = ld(void 0, "0ubsb"),
         qd = ld(void 0, "0actk"),
         rd = ld("m_m", "zk", !0),
         sd = ld(void 0, "vps");
     var td = {
             Bh: {
                 value: 0,
                 configurable: !0,
                 writable: !0,
                 enumerable: !1
             }
         },
         ud = Object.defineProperties,
         B = kd ? md : "Bh",
         vd, wd = [];
     xd(wd, 7);
     vd = Object.freeze(wd);

     function yd(a, b) {
         kd || B in a || ud(a, td);
         a[B] |= b
     }

     function xd(a, b) {
         kd || B in a || ud(a, td);
         a[B] = b
     }

     function zd(a) {
         if (4 & a) return 512 & a ? 512 : 1024 & a ? 1024 : 0
     }

     function Ad(a) {
         yd(a, 34);
         return a
     }

     function Bd(a) {
         yd(a, 8192);
         return a
     }

     function Cd(a) {
         yd(a, 32);
         return a
     };

     function Dd() {
         return typeof BigInt === "function"
     };
     var Ed = {};

     function Fd(a, b) {
         return b === void 0 ? a.g !== Gd && !!(2 & (a.D[B] | 0)) : !!(2 & b) && a.g !== Gd
     }
     var Gd = {},
         Hd = function(a, b, c) {
             this.g = a;
             this.j = b;
             this.l = c
         };
     Hd.prototype.next = function() {
         var a = this.g.next();
         a.done || (a.value = this.j.call(this.l, a.value));
         return a
     };
     Hd.prototype[Symbol.iterator] = function() {
         return this
     };
     var Id = Object.freeze({}),
         Jd = Object.freeze({});

     function Kd(a, b, c) {
         var d = b & 128 ? 0 : -1,
             e = a.length,
             f;
         if (f = !!e) f = a[e - 1], f = f != null && typeof f === "object" && f.constructor === Object;
         var g = e + (f ? -1 : 0);
         for (b = b & 128 ? 1 : 0; b < g; b++) c(b - d, a[b]);
         if (f) {
             a = a[e - 1];
             for (var h in a) !isNaN(h) && c(+h, a[h])
         }
     };

     function Ld(a) {
         a.xk = !0;
         return a
     };
     var Md = Ld(function(a) {
             return typeof a === "number"
         }),
         Nd = Ld(function(a) {
             return typeof a === "string"
         }),
         Od = Ld(function(a) {
             return typeof a === "boolean"
         }),
         Pd = Ld(function(a) {
             return !!a && (typeof a === "object" || typeof a === "function")
         });

     function Qd() {
         return Rd(Ld(function(a, b) {
             return a === void 0 ? !0 : Nd(a, b)
         }))
     }

     function Rd(a) {
         a.Gh = !0;
         return a
     };
     var Sd = typeof x.BigInt === "function" && typeof x.BigInt(0) === "bigint";

     function Td(a) {
         var b = a;
         if (Nd(b)) {
             if (!/^\s*(?:-?[1-9]\d*|0)?\s*$/.test(b)) throw Error(String(b));
         } else if (Md(b) && !Number.isSafeInteger(b)) throw Error(String(b));
         return Sd ? BigInt(a) : a = Od(a) ? a ? "1" : "0" : Nd(a) ? a.trim() || "0" : String(a)
     }
     var Zd = Ld(function(a) {
             return Sd ? a >= Ud && a <= Vd : a[0] === "-" ? Wd(a, Xd) : Wd(a, Yd)
         }),
         Xd = Number.MIN_SAFE_INTEGER.toString(),
         Ud = Sd ? BigInt(Number.MIN_SAFE_INTEGER) : void 0,
         Yd = Number.MAX_SAFE_INTEGER.toString(),
         Vd = Sd ? BigInt(Number.MAX_SAFE_INTEGER) : void 0;

     function Wd(a, b) {
         if (a.length > b.length) return !1;
         if (a.length < b.length || a === b) return !0;
         for (var c = 0; c < a.length; c++) {
             var d = a[c],
                 e = b[c];
             if (d > e) return !1;
             if (d < e) return !0
         }
     };
     var $d = 0,
         ae = 0,
         be;

     function ce(a) {
         var b = a >>> 0;
         $d = b;
         ae = (a - b) / 4294967296 >>> 0
     }

     function de(a) {
         if (a < 0) {
             ce(0 - a);
             var b = w(ee($d, ae));
             a = b.next().value;
             b = b.next().value;
             $d = a >>> 0;
             ae = b >>> 0
         } else ce(a)
     }

     function fe(a, b) {
         var c = b * 4294967296 + (a >>> 0);
         return Number.isSafeInteger(c) ? c : ge(a, b)
     }

     function ge(a, b) {
         b >>>= 0;
         a >>>= 0;
         if (b <= 2097151) var c = "" + (4294967296 * b + a);
         else Dd() ? c = "" + (BigInt(b) << BigInt(32) | BigInt(a)) : (c = (a >>> 24 | b << 8) & 16777215, b = b >> 16 & 65535, a = (a & 16777215) + c * 6777216 + b * 6710656, c += b * 8147497, b *= 2, a >= 1E7 && (c += a / 1E7 >>> 0, a %= 1E7), c >= 1E7 && (b += c / 1E7 >>> 0, c %= 1E7), c = b + he(c) + he(a));
         return c
     }

     function he(a) {
         a = String(a);
         return "0000000".slice(a.length) + a
     }

     function ie() {
         var a = $d,
             b = ae;
         b & 2147483648 ? Dd() ? a = "" + (BigInt(b | 0) << BigInt(32) | BigInt(a >>> 0)) : (b = w(ee(a, b)), a = b.next().value, b = b.next().value, a = "-" + ge(a, b)) : a = ge(a, b);
         return a
     }

     function je(a) {
         if (a.length < 16) de(Number(a));
         else if (Dd()) a = BigInt(a), $d = Number(a & BigInt(4294967295)) >>> 0, ae = Number(a >> BigInt(32) & BigInt(4294967295));
         else {
             var b = +(a[0] === "-");
             ae = $d = 0;
             for (var c = a.length, d = 0 + b, e = (c - b) % 6 + b; e <= c; d = e, e += 6) d = Number(a.slice(d, e)), ae *= 1E6, $d = $d * 1E6 + d, $d >= 4294967296 && (ae += Math.trunc($d / 4294967296), ae >>>= 0, $d >>>= 0);
             b && (b = w(ee($d, ae)), a = b.next().value, b = b.next().value, $d = a, ae = b)
         }
     }

     function ee(a, b) {
         b = ~b;
         a ? a = ~a + 1 : b += 1;
         return [a, b]
     };

     function ke(a) {
         return Array.prototype.slice.call(a)
     };
     var le = typeof BigInt === "function" ? BigInt.asIntN : void 0,
         me = typeof BigInt === "function" ? BigInt.asUintN : void 0,
         ne = Number.isSafeInteger,
         oe = Number.isFinite,
         pe = Math.trunc;

     function qe(a) {
         if (a == null || typeof a === "number") return a;
         if (a === "NaN" || a === "Infinity" || a === "-Infinity") return Number(a)
     }

     function re(a) {
         if (typeof a !== "boolean") throw Error("Expected boolean but got " + Za(a) + ": " + a);
         return a
     }

     function se(a) {
         if (a == null || typeof a === "boolean") return a;
         if (typeof a === "number") return !!a
     }
     var te = /^-?([1-9][0-9]*|0)(\.[0-9]+)?$/;

     function ve(a) {
         switch (typeof a) {
             case "bigint":
                 return !0;
             case "number":
                 return oe(a);
             case "string":
                 return te.test(a);
             default:
                 return !1
         }
     }

     function we(a) {
         if (!oe(a)) throw hd("enum");
         return a | 0
     }

     function xe(a) {
         return a == null ? a : oe(a) ? a | 0 : void 0
     }

     function ye(a) {
         if (typeof a !== "number") throw hd("int32");
         if (!oe(a)) throw hd("int32");
         return a | 0
     }

     function ze(a) {
         if (a == null) return a;
         if (typeof a === "string" && a) a = +a;
         else if (typeof a !== "number") return;
         return oe(a) ? a | 0 : void 0
     }

     function Ae(a) {
         if (a == null) return a;
         if (typeof a === "string" && a) a = +a;
         else if (typeof a !== "number") return;
         return oe(a) ? a >>> 0 : void 0
     }

     function Be(a) {
         var b = 0;
         b = b === void 0 ? 0 : b;
         if (!ve(a)) throw hd("int64");
         var c = typeof a;
         switch (b) {
             case 512:
                 switch (c) {
                     case "string":
                         return Ce(a);
                     case "bigint":
                         return String(le(64, a));
                     default:
                         return De(a)
                 }
                 case 1024:
                     switch (c) {
                         case "string":
                             return Ee(a);
                         case "bigint":
                             return Td(le(64, a));
                         default:
                             return Fe(a)
                     }
                     case 0:
                         switch (c) {
                             case "string":
                                 return Ce(a);
                             case "bigint":
                                 return Td(le(64, a));
                             default:
                                 return Ge(a)
                         }
                         default:
                             throw Error("Unknown format requested type for int64");
         }
     }

     function He(a) {
         return a == null ? a : Be(a)
     }

     function Ie(a) {
         var b = a.length;
         if (a[0] === "-" ? b < 20 || b === 20 && a <= "-9223372036854775808" : b < 19 || b === 19 && a <= "9223372036854775807") return a;
         je(a);
         return ie()
     }

     function Ge(a) {
         a = pe(a);
         if (!ne(a)) {
             de(a);
             var b = $d,
                 c = ae;
             if (a = c & 2147483648) b = ~b + 1 >>> 0, c = ~c >>> 0, b == 0 && (c = c + 1 >>> 0);
             b = fe(b, c);
             a = typeof b === "number" ? a ? -b : b : a ? "-" + b : b
         }
         return a
     }

     function De(a) {
         a = pe(a);
         ne(a) ? a = String(a) : (de(a), a = ie());
         return a
     }

     function Ce(a) {
         var b = pe(Number(a));
         if (ne(b)) return String(b);
         b = a.indexOf(".");
         b !== -1 && (a = a.substring(0, b));
         return Ie(a)
     }

     function Ee(a) {
         var b = pe(Number(a));
         if (ne(b)) return Td(b);
         b = a.indexOf(".");
         b !== -1 && (a = a.substring(0, b));
         return Dd() ? Td(le(64, BigInt(a))) : Td(Ie(a))
     }

     function Fe(a) {
         return ne(a) ? Td(Ge(a)) : Td(De(a))
     }

     function Je(a) {
         if (a == null) return a;
         var b = typeof a;
         if (b === "bigint") return String(le(64, a));
         if (ve(a)) {
             if (b === "string") return Ce(a);
             if (b === "number") return Ge(a)
         }
     }

     function Ke(a) {
         if (a == null) return a;
         var b = typeof a;
         if (b === "bigint") return String(me(64, a));
         if (ve(a)) {
             if (b === "string") return b = pe(Number(a)), ne(b) && b >= 0 ? a = String(b) : (b = a.indexOf("."), b !== -1 && (a = a.substring(0, b)), a[0] === "-" ? b = !1 : (b = a.length, b = b < 20 ? !0 : b === 20 && a <= "18446744073709551615"), b || (je(a), a = ge($d, ae))), a;
             if (b === "number") return a = pe(a), a >= 0 && ne(a) || (de(a), a = fe($d, ae)), a
         }
     }

     function Le(a) {
         if (typeof a !== "string") throw Error();
         return a
     }

     function Me(a) {
         if (a != null && typeof a !== "string") throw Error();
         return a
     }

     function Ne(a) {
         return a == null || typeof a === "string" ? a : void 0
     }

     function Oe(a, b, c, d) {
         if (a != null && a[rd] === Ed) return a;
         if (!Array.isArray(a)) return c ? d & 2 ? b[nd] || (b[nd] = Pe(b)) : new b : void 0;
         c = a[B] | 0;
         d = c | d & 32 | d & 2;
         d !== c && xd(a, d);
         return new b(a)
     }

     function Pe(a) {
         a = new a;
         Ad(a.D);
         return a
     }

     function Qe(a, b, c) {
         if (b) return re(a);
         var d;
         return (d = se(a)) != null ? d : c ? !1 : void 0
     }

     function Re(a, b, c) {
         if (b) return Le(a);
         var d;
         return (d = Ne(a)) != null ? d : c ? "" : void 0
     };
     var Se = {};

     function Te(a) {
         return a
     };
     var Ue = {},
         Ve = function() {
             try {
                 var a = function() {
                     return ka(Map, [], this.constructor)
                 };
                 r(a, Map);
                 Bc(new a);
                 return !1
             } catch (b) {
                 return !0
             }
         }(),
         We = function() {
             this.g = new Map
         };
     m = We.prototype;
     m.get = function(a) {
         return this.g.get(a)
     };
     m.set = function(a, b) {
         this.g.set(a, b);
         this.size = this.g.size;
         return this
     };
     m.delete = function(a) {
         a = this.g.delete(a);
         this.size = this.g.size;
         return a
     };
     m.clear = function() {
         this.g.clear();
         this.size = this.g.size
     };
     m.has = function(a) {
         return this.g.has(a)
     };
     m.entries = function() {
         return this.g.entries()
     };
     m.keys = function() {
         return this.g.keys()
     };
     m.values = function() {
         return this.g.values()
     };
     m.forEach = function(a, b) {
         return this.g.forEach(a, b)
     };
     We.prototype[Symbol.iterator] = function() {
         return this.entries()
     };
     var Xe = function() {
         if (Ve) return Object.setPrototypeOf(We.prototype, Map.prototype), Object.defineProperties(We.prototype, {
             size: {
                 value: 0,
                 configurable: !0,
                 enumerable: !0,
                 writable: !0
             }
         }), We;
         var a = function() {
             return ka(Map, [], this.constructor)
         };
         r(a, Map);
         return a
     }();

     function Ye(a) {
         return a
     }
     var $e = function(a, b, c, d) {
         c = c === void 0 ? Ye : c;
         d = d === void 0 ? Ye : d;
         var e = Xe.call(this) || this;
         e.Yb = a[B] | 0;
         e.Ub = b;
         e.hd = c;
         e.dg = e.Ub ? Ze : d;
         for (var f = 0; f < a.length; f++) {
             var g = a[f],
                 h = c(g[0], !1, !0),
                 k = g[1];
             b ? k === void 0 && (k = null) : k = d(g[1], !1, !0, void 0, void 0, e.Yb);
             Xe.prototype.set.call(e, h, k)
         }
         return e
     };
     r($e, Xe);
     var af = function(a) {
             if (a.Yb & 2) throw Error("Cannot mutate an immutable Map");
         },
         bf = function(a, b) {
             return Bd(Array.from(Xe.prototype.entries.call(a), b))
         };
     m = $e.prototype;
     m.clear = function() {
         af(this);
         Xe.prototype.clear.call(this)
     };
     m.delete = function(a) {
         af(this);
         return Xe.prototype.delete.call(this, this.hd(a, !0, !1))
     };
     m.entries = function() {
         if (this.Ub) {
             var a = Xe.prototype.keys.call(this);
             a = new Hd(a, cf, this)
         } else a = Xe.prototype.entries.call(this);
         return a
     };
     m.values = function() {
         if (this.Ub) {
             var a = Xe.prototype.keys.call(this);
             a = new Hd(a, $e.prototype.get, this)
         } else a = Xe.prototype.values.call(this);
         return a
     };
     m.forEach = function(a, b) {
         this.Ub ? Xe.prototype.forEach.call(this, function(c, d, e) {
             a.call(b, e.get(d), d, e)
         }) : Xe.prototype.forEach.call(this, a, b)
     };
     m.set = function(a, b) {
         af(this);
         a = this.hd(a, !0, !1);
         return a == null ? this : b == null ? (Xe.prototype.delete.call(this, a), this) : Xe.prototype.set.call(this, a, this.dg(b, !0, !0, this.Ub, !1, this.Yb))
     };
     m.has = function(a) {
         return Xe.prototype.has.call(this, this.hd(a, !1, !1))
     };
     m.get = function(a) {
         a = this.hd(a, !1, !1);
         var b = Xe.prototype.get.call(this, a);
         if (b !== void 0) {
             var c = this.Ub;
             return c ? (c = this.dg(b, !1, !0, c, this.Tg, this.Yb), c !== b && Xe.prototype.set.call(this, a, c), c) : b
         }
     };
     $e.prototype[Symbol.iterator] = function() {
         return this.entries()
     };
     $e.prototype.toJSON = void 0;

     function Ze(a, b, c, d, e, f) {
         a = Oe(a, d, c, f);
         e && (a = df(a));
         return a
     }

     function cf(a) {
         return [a, this.get(a)]
     }
     var ef;

     function ff() {
         return ef || (ef = new $e(Ad([]), void 0, void 0, void 0, Ue))
     };

     function gf(a, b, c, d) {
         var e = d !== void 0;
         d = !!d;
         var f = [],
             g = a.length,
             h = 4294967295,
             k = !1,
             l = !!(b & 64),
             n = l ? b & 128 ? 0 : -1 : void 0;
         if (!(b & 1)) {
             var p = g && a[g - 1];
             p != null && typeof p === "object" && p.constructor === Object ? (g--, h = g) : p = void 0;
             if (l && !(b & 128) && !e) {
                 k = !0;
                 var q;
                 h = ((q = hf) != null ? q : Te)(h - n, n, a, p, void 0) + n
             }
         }
         b = void 0;
         for (e = 0; e < g; e++)
             if (q = a[e], q != null && (q = c(q, d)) != null)
                 if (l && e >= h) {
                     var v = e - n,
                         u = void 0;
                     ((u = b) != null ? u : b = {})[v] = q
                 } else f[e] = q;
         if (p)
             for (var t in p) a = p[t], a != null && (a = c(a, d)) != null && (g = +t, e = void 0, l && !Number.isNaN(g) &&
                 (e = g + n) < h ? f[e] = a : (g = void 0, ((g = b) != null ? g : b = {})[t] = a));
         b && (k ? f.push(b) : f[h] = b);
         return f
     }

     function jf(a) {
         a[0] = kf(a[0]);
         a[1] = kf(a[1]);
         return a
     }

     function kf(a) {
         switch (typeof a) {
             case "number":
                 return Number.isFinite(a) ? a : "" + a;
             case "bigint":
                 return Zd(a) ? Number(a) : "" + a;
             case "boolean":
                 return a ? 1 : 0;
             case "object":
                 if (Array.isArray(a)) {
                     var b = a[B] | 0;
                     return a.length === 0 && b & 1 ? void 0 : gf(a, b, kf)
                 }
                 if (a != null && a[rd] === Ed) return lf(a);
                 if (a instanceof $e) return a = a.size !== 0 ? bf(a, jf) : void 0, a;
                 return
         }
         return a
     }
     var hf;

     function mf(a, b) {
         if (b) {
             hf = b == null || b === Te || b[sd] !== Se ? Te : b;
             try {
                 return lf(a)
             } finally {
                 hf = void 0
             }
         }
         return lf(a)
     }

     function lf(a) {
         a = a.D;
         return gf(a, a[B] | 0, kf)
     };
     var qf, rf;

     function sf(a) {
         switch (typeof a) {
             case "boolean":
                 return qf || (qf = [0, void 0, !0]);
             case "number":
                 return a > 0 ? void 0 : a === 0 ? rf || (rf = [0, void 0]) : [-a, void 0];
             case "string":
                 return [0, a];
             case "object":
                 return a
         }
     }

     function C(a, b, c) {
         return tf(a, b, c, 2048)
     }

     function tf(a, b, c, d) {
         d = d === void 0 ? 0 : d;
         if (a == null) {
             var e = 32;
             c ? (a = [c], e |= 128) : a = [];
             b && (e = e & -16760833 | (b & 1023) << 14)
         } else {
             if (!Array.isArray(a)) throw Error("narr");
             e = a[B] | 0;
             if (Rb && 1 & e) throw Error("rfarr");
             2048 & e && !(2 & e) && uf();
             if (e & 256) throw Error("farr");
             if (e & 64) return (e | d) !== e && xd(a, e | d), a;
             if (c && (e |= 128, c !== a[0])) throw Error("mid");
             a: {
                 c = a;e |= 64;
                 var f = c.length;
                 if (f) {
                     var g = f - 1,
                         h = c[g];
                     if (h != null && typeof h === "object" && h.constructor === Object) {
                         b = e & 128 ? 0 : -1;
                         g -= b;
                         if (g >= 1024) throw Error("pvtlmt");
                         for (var k in h) f = +k, f < g && (c[f + b] = h[k], delete h[k]);
                         e = e & -16760833 | (g & 1023) << 14;
                         break a
                     }
                 }
                 if (b) {
                     k = Math.max(b, f - (e & 128 ? 0 : -1));
                     if (k > 1024) throw Error("spvt");
                     e = e & -16760833 | (k & 1023) << 14
                 }
             }
         }
         xd(a, e | 64 | d);
         return a
     }

     function uf() {
         if (Rb) throw Error("carr");
         id(qd, 5)
     };

     function vf(a, b) {
         if (typeof a !== "object") return a;
         if (Array.isArray(a)) {
             var c = a[B] | 0;
             return a.length === 0 && c & 1 ? void 0 : wf(a, c, b)
         }
         if (a != null && a[rd] === Ed) return xf(a);
         if (a instanceof $e) {
             b = a.Yb;
             if (b & 2) return a;
             if (a.size) {
                 c = Ad(bf(a));
                 if (a.Ub)
                     for (a = 0; a < c.length; a++) {
                         var d = c[a],
                             e = d[1];
                         e == null || typeof e !== "object" ? e = void 0 : e != null && e[rd] === Ed ? e = xf(e) : Array.isArray(e) ? e = wf(e, e[B] | 0, !!(b & 32)) : e = void 0;
                         d[1] = e
                     }
                 return c
             }
         }
     }

     function wf(a, b, c) {
         if (b & 2) return a;
         !c || 4096 & b || 16 & b ? a = yf(a, b, !1, c && !(b & 16)) : (yd(a, 34), b & 4 && Object.freeze(a));
         return a
     }

     function zf(a, b, c) {
         a = new a.constructor(b);
         c && (a.g = Gd);
         a.l = Gd;
         return a
     }

     function xf(a) {
         var b = a.D,
             c = b[B] | 0;
         return Fd(a, c) ? a : Af(a, b, c) ? zf(a, b) : yf(b, c)
     }

     function yf(a, b, c, d) {
         d != null || (d = !!(34 & b));
         a = gf(a, b, vf, d);
         d = 32;
         c && (d |= 2);
         b = b & 16769217 | d;
         xd(a, b);
         return a
     }

     function df(a) {
         var b = a.D,
             c = b[B] | 0;
         return Fd(a, c) ? Af(a, b, c) ? zf(a, b, !0) : new a.constructor(yf(b, c, !1)) : a
     }

     function Bf(a) {
         if (a.g !== Gd) return !1;
         var b = a.D;
         b = yf(b, b[B] | 0);
         yd(b, 2048);
         a.D = b;
         a.g = void 0;
         a.l = void 0;
         return !0
     }

     function Cf(a) {
         if (!Bf(a) && Fd(a, a.D[B] | 0)) throw Error();
     }

     function Df(a, b) {
         b === void 0 && (b = a[B] | 0);
         b & 32 && !(b & 4096) && xd(a, b | 4096)
     }

     function Af(a, b, c) {
         return c & 2 ? !0 : c & 32 && !(c & 4096) ? (xd(b, c | 2), a.g = Gd, !0) : !1
     };
     var Ef = Td(0),
         Ff = {},
         Hf = function(a, b, c, d, e) {
             b = Gf(a.D, b, c, e);
             if (b !== null || d && a.l !== Gd) return b
         },
         Gf = function(a, b, c, d) {
             if (b === -1) return null;
             var e = b + (c ? 0 : -1),
                 f = a.length - 1;
             if (!(f < 1 + (c ? 0 : -1))) {
                 if (e >= f) {
                     var g = a[f];
                     if (g != null && typeof g === "object" && g.constructor === Object) {
                         c = g[b];
                         var h = !0
                     } else if (e === f) c = g;
                     else return
                 } else c = a[e];
                 if (d && c != null) {
                     d = d(c);
                     if (d == null) return d;
                     if (!Object.is(d, c)) return h ? g[b] = d : a[e] = d, d
                 }
                 return c
             }
         },
         Jf = function(a, b, c) {
             Cf(a);
             var d = a.D;
             If(d, d[B] | 0, b, c);
             return a
         };

     function If(a, b, c, d, e) {
         var f = c + (e ? 0 : -1),
             g = a.length - 1;
         if (g >= 1 + (e ? 0 : -1) && f >= g) {
             var h = a[g];
             if (h != null && typeof h === "object" && h.constructor === Object) return h[c] = d, b
         }
         if (f <= g) return a[f] = d, b;
         if (d !== void 0) {
             var k;
             g = ((k = b) != null ? k : b = a[B] | 0) >> 14 & 1023 || 536870912;
             c >= g ? d != null && (f = {}, a[g + (e ? 0 : -1)] = (f[c] = d, f)) : a[f] = d
         }
         return b
     }
     var Lf = function(a, b) {
             a = a.D;
             return Kf(a, a[B] | 0, b, 5) !== void 0
         },
         Mf = function(a) {
             return a === Id ? 2 : 4
         };

     function Nf(a, b, c, d, e) {
         var f = a.D,
             g = f[B] | 0;
         d = Fd(a, g) ? 1 : d;
         e = !!e || d === 3;
         d === 2 && Bf(a) && (f = a.D, g = f[B] | 0);
         a = Of(f, b);
         var h = a === vd ? 7 : a[B] | 0,
             k = Pf(h, g);
         var l = 4 & k ? !1 : !0;
         if (l) {
             4 & k && (a = ke(a), h = 0, k = Qf(k, g), g = If(f, g, b, a));
             for (var n = 0, p = 0; n < a.length; n++) {
                 var q = c(a[n]);
                 q != null && (a[p++] = q)
             }
             p < n && (a.length = p);
             c = (k | 4) & -513;
             k = c &= -1025;
             k &= -4097
         }
         k !== h && (xd(a, k), 2 & k && Object.freeze(a));
         return a = Rf(a, k, f, g, b, d, l, e)
     }

     function Rf(a, b, c, d, e, f, g, h) {
         var k = b;
         f === 1 || (f !== 4 ? 0 : 2 & b || !(16 & b) && 32 & d) ? Sf(b) || (b |= !a.length || g && !(4096 & b) || 32 & d && !(4096 & b || 16 & b) ? 2 : 256, b !== k && xd(a, b), Object.freeze(a)) : (f === 2 && Sf(b) && (a = ke(a), k = 0, b = Qf(b, d), d = If(c, d, e, a)), Sf(b) || (h || (b |= 16), b !== k && xd(a, b)));
         2 & b || !(4096 & b || 16 & b) || Df(c, d);
         return a
     }

     function Of(a, b) {
         a = Gf(a, b, void 0);
         return Array.isArray(a) ? a : vd
     }

     function Pf(a, b) {
         2 & b && (a |= 2);
         return a | 1
     }

     function Sf(a) {
         return !!(2 & a) && !!(4 & a) || !!(256 & a)
     }

     function Tf(a, b, c, d) {
         var e = a.D,
             f = e[B] | 0;
         var g = Fd(a, f);
         a: {
             !g && Bf(a) && (e = a.D, f = e[B] | 0);
             var h = Gf(e, b);a = !1;
             if (h == null) {
                 if (g) {
                     b = ff();
                     break a
                 }
                 h = []
             } else if (h.constructor === $e)
                 if (h.Yb & 2 && !g) h = bf(h);
                 else {
                     b = h;
                     break a
                 }
             else Array.isArray(h) ? a = !!((h[B] | 0) & 2) : h = [];
             if (g) {
                 if (!h.length) {
                     b = ff();
                     break a
                 }
                 a || (a = !0, Ad(h))
             } else if (a) {
                 a = !1;
                 Bd(h);
                 h = ke(h);
                 for (var k = 0; k < h.length; k++) {
                     var l = h[k] = ke(h[k]);
                     Array.isArray(l[1]) && (l[1] = Ad(l[1]))
                 }
                 h = Bd(h)
             }!a && f & 32 && Cd(h);d = new $e(h, c, Re, d);f = If(e, f, b, d);a || Df(e, f);b = d
         }!g && c && (b.Tg = !0);
         return b
     }

     function Uf(a, b, c, d) {
         Cf(a);
         var e = a.D,
             f = e[B] | 0;
         if (c == null) return If(e, f, b), a;
         var g = c === vd ? 7 : c[B] | 0,
             h = g,
             k = Sf(g),
             l = k || Object.isFrozen(c);
         k || (g = 0);
         l || (c = ke(c), h = 0, g = Qf(g, f), l = !1);
         g |= 5;
         var n;
         k = (n = zd(g)) != null ? n : 0;
         for (n = 0; n < c.length; n++) {
             var p = c[n],
                 q = d(p, k);
             Object.is(p, q) || (l && (c = ke(c), h = 0, g = Qf(g, f), l = !1), c[n] = q)
         }
         g !== h && (l && (c = ke(c), g = Qf(g, f)), xd(c, g));
         If(e, f, b, c);
         return a
     }

     function Vf(a, b, c, d) {
         Cf(a);
         var e = a.D;
         If(e, e[B] | 0, b, (d === "0" ? Number(c) === 0 : c === d) ? void 0 : c);
         return a
     }
     var Yf = function(a, b, c, d) {
             Cf(a);
             var e = a.D,
                 f = e[B] | 0;
             if (d == null) {
                 var g = Wf(e);
                 if (Xf(g, e, f, c) === b) g.set(c, 0);
                 else return a
             } else {
                 g = Wf(e);
                 var h = Xf(g, e, f, c);
                 h !== b && (h && (f = If(e, f, h)), g.set(c, b))
             }
             If(e, f, b, d);
             return a
         },
         $f = function(a, b, c) {
             return Zf(a, b) === c ? c : -1
         },
         Zf = function(a, b) {
             a = a.D;
             return Xf(Wf(a), a, void 0, b)
         };

     function Wf(a) {
         if (kd) {
             var b;
             return (b = a[od]) != null ? b : a[od] = new Map
         }
         if (od in a) return a[od];
         b = new Map;
         Object.defineProperty(a, od, {
             value: b
         });
         return b
     }

     function Xf(a, b, c, d) {
         var e = a.get(d);
         if (e != null) return e;
         for (var f = e = 0; f < d.length; f++) {
             var g = d[f];
             Gf(b, g, void 0) != null && (e !== 0 && (c = If(b, c, e, void 0, void 0)), e = g)
         }
         a.set(d, e);
         return e
     }

     function Kf(a, b, c, d) {
         var e = !1;
         d = Gf(a, d, void 0, function(f) {
             var g = Oe(f, c, !1, b);
             e = g !== f && g != null;
             return g
         });
         if (d != null) return e && !Fd(d) && Df(a, b), d
     }
     var ag = function(a, b, c) {
             a = a.D;
             return Kf(a, a[B] | 0, b, c) || b[nd] || (b[nd] = Pe(b))
         },
         E = function(a, b, c) {
             var d = a.D,
                 e = d[B] | 0;
             b = Kf(d, e, b, c);
             if (b == null) return b;
             e = d[B] | 0;
             if (!Fd(a, e)) {
                 var f = df(b);
                 f !== b && (Bf(a) && (d = a.D, e = d[B] | 0), b = f, e = If(d, e, c, b), Df(d, e))
             }
             return b
         };

     function bg(a, b, c, d, e, f, g, h) {
         var k = Fd(a, c);
         f = k ? 1 : f;
         g = !!g || f === 3;
         k = h && !k;
         (f === 2 || k) && Bf(a) && (b = a.D, c = b[B] | 0);
         a = Of(b, e);
         var l = a === vd ? 7 : a[B] | 0,
             n = Pf(l, c);
         if (h = !(4 & n)) {
             var p = a,
                 q = c,
                 v = !!(2 & n);
             v && (q |= 2);
             for (var u = !v, t = !0, y = 0, D = 0; y < p.length; y++) {
                 var ca = Oe(p[y], d, !1, q);
                 if (ca instanceof d) {
                     if (!v) {
                         var X = Fd(ca);
                         u && (u = !X);
                         t && (t = X)
                     }
                     p[D++] = ca
                 }
             }
             D < y && (p.length = D);
             n |= 4;
             n = t ? n & -4097 : n | 4096;
             n = u ? n | 8 : n & -9
         }
         n !== l && (xd(a, n), 2 & n && Object.freeze(a));
         if (k && !(8 & n || !a.length && (f === 1 || (f !== 4 ? 0 : 2 & n || !(16 & n) && 32 & c)))) {
             Sf(n) && (a = ke(a),
                 n = Qf(n, c), c = If(b, c, e, a));
             d = a;
             k = n;
             for (l = 0; l < d.length; l++) p = d[l], n = df(p), p !== n && (d[l] = n);
             k |= 8;
             n = k = d.length ? k | 4096 : k & -4097;
             xd(a, n)
         }
         return a = Rf(a, n, b, c, e, f, h, g)
     }
     var cg = function(a, b, c, d) {
         var e = a.D;
         return bg(a, e, e[B] | 0, b, c, d, !1, !0)
     };

     function dg(a) {
         a == null && (a = void 0);
         return a
     }
     var F = function(a, b, c) {
             c = dg(c);
             Jf(a, b, c);
             c && !Fd(c) && Df(a.D);
             return a
         },
         eg = function(a, b, c, d) {
             d = dg(d);
             Yf(a, b, c, d);
             d && !Fd(d) && Df(a.D);
             return a
         },
         fg = function(a, b, c) {
             Cf(a);
             var d = a.D,
                 e = d[B] | 0;
             if (c == null) return If(d, e, b), a;
             for (var f = c === vd ? 7 : c[B] | 0, g = f, h = Sf(f), k = h || Object.isFrozen(c), l = !0, n = !0, p = 0; p < c.length; p++) {
                 var q = c[p];
                 h || (q = Fd(q), l && (l = !q), n && (n = q))
             }
             h || (f = l ? 13 : 5, f = n ? f & -4097 : f | 4096);
             k && f === g || (c = ke(c), g = 0, f = Qf(f, e));
             f !== g && xd(c, f);
             e = If(d, e, b, c);
             2 & f || !(4096 & f || 16 & f) || Df(d, e);
             return a
         };

     function Qf(a, b) {
         return a = (2 & b ? a | 2 : a & -3) & -273
     }

     function gg(a, b, c, d, e) {
         Cf(a);
         a = Nf(a, b, e, 2, !0);
         var f;
         b = (f = zd(a === vd ? 7 : a[B] | 0)) != null ? f : 0;
         if (Array.isArray(d))
             for (f = d.length, e = 0; e < f; e++) a.push(c(d[e], b));
         else
             for (d = w(d), f = d.next(); !f.done; f = d.next()) a.push(c(f.value, b))
     }

     function hg(a, b, c, d) {
         Cf(a);
         var e = a.D;
         a = bg(a, e, e[B] | 0, c, b, 2, !0);
         d = d != null ? d : new c;
         a.push(d);
         b = c = a === vd ? 7 : a[B] | 0;
         var f = Fd(d);
         f ? (c &= -9, a.length === 1 && (c &= -4097)) : c |= 4096;
         c !== b && xd(a, c);
         f || Df(e);
         return d
     }
     var ig = function(a, b, c, d) {
             hg(a, b, c, d);
             return a
         },
         jg = function(a, b) {
             a = Hf(a, b);
             b = typeof a;
             a = a == null ? a : b === "bigint" ? Td(le(64, a)) : ve(a) ? b === "string" ? Ee(a) : Fe(a) : void 0;
             return a
         },
         kg = function(a, b) {
             var c = c === void 0 ? !1 : c;
             a = se(Hf(a, b));
             return a != null ? a : c
         },
         lg = function(a, b) {
             var c = c === void 0 ? 0 : c;
             var d;
             return (d = ze(Hf(a, b))) != null ? d : c
         },
         mg = function(a, b) {
             var c = c === void 0 ? 0 : c;
             var d;
             return (d = Ae(Hf(a, b))) != null ? d : c
         },
         ng = function(a, b) {
             var c = c === void 0 ? Ef : c;
             var d;
             return (d = jg(a, b)) != null ? d : c
         },
         og = function(a, b) {
             var c = c === void 0 ?
                 0 : c;
             a = Hf(a, b, void 0, void 0, qe);
             return a != null ? a : c
         },
         pg = function(a, b) {
             var c = c === void 0 ? "" : c;
             var d;
             return (d = Ne(Hf(a, b))) != null ? d : c
         },
         G = function(a, b) {
             var c = c === void 0 ? 0 : c;
             var d;
             return (d = xe(Hf(a, b))) != null ? d : c
         },
         qg = function(a, b) {
             var c = c === void 0 ? "0" : c;
             a = Hf(a, b);
             b = !0;
             b = b === void 0 ? !1 : b;
             var d = typeof a;
             a = a == null ? a : d === "bigint" ? String(le(64, a)) : ve(a) ? d === "string" ? Ce(a) : b ? De(a) : Ge(a) : void 0;
             return a != null ? a : c
         },
         rg = function(a, b) {
             return Nf(a, b, ze, Mf())
         },
         sg = function(a, b, c) {
             return G(a, $f(a, c, b))
         },
         tg = function(a, b) {
             return Ne(Hf(a,
                 b, void 0, Ff))
         },
         ug = function(a, b, c) {
             return Jf(a, b, c == null ? c : re(c))
         },
         vg = function(a, b, c) {
             return Vf(a, b, c == null ? c : re(c), !1)
         },
         wg = function(a, b, c) {
             return Jf(a, b, c == null ? c : ye(c))
         },
         xg = function(a, b, c) {
             return Vf(a, b, c == null ? c : ye(c), 0)
         },
         yg = function(a, b, c) {
             return Vf(a, b, He(c), "0")
         },
         zg = function(a, b, c) {
             return Jf(a, b, Me(c))
         },
         Ag = function(a, b, c) {
             return Jf(a, b, c == null ? c : we(c))
         },
         H = function(a, b, c) {
             return Vf(a, b, c == null ? c : we(c), 0)
         },
         Bg = function(a, b, c, d) {
             return Yf(a, b, c, d == null ? d : we(d))
         };
     var Cg = function(a, b) {
             this.j = a >>> 0;
             this.g = b >>> 0
         },
         Eg = function(a) {
             if (!a) return Dg || (Dg = new Cg(0, 0));
             if (!/^\d+$/.test(a)) return null;
             je(a);
             return new Cg($d, ae)
         },
         Dg, Fg = function(a, b) {
             this.j = a >>> 0;
             this.g = b >>> 0
         },
         Ig = function(a) {
             if (!a) return Gg || (Gg = new Fg(0, 0));
             if (!/^-?\d+$/.test(a)) return null;
             je(a);
             return new Fg($d, ae)
         },
         Gg;
     var Jg = function() {
         this.g = []
     };
     Jg.prototype.length = function() {
         return this.g.length
     };
     Jg.prototype.end = function() {
         var a = this.g;
         this.g = [];
         return a
     };
     var Kg = function(a, b, c) {
             for (; c > 0 || b > 127;) a.g.push(b & 127 | 128), b = (b >>> 7 | c << 25) >>> 0, c >>>= 7;
             a.g.push(b)
         },
         Lg = function(a, b) {
             for (; b > 127;) a.g.push(b & 127 | 128), b >>>= 7;
             a.g.push(b)
         },
         Mg = function(a, b) {
             if (b >= 0) Lg(a, b);
             else {
                 for (var c = 0; c < 9; c++) a.g.push(b & 127 | 128), b >>= 7;
                 a.g.push(1)
             }
         },
         Ng = function(a, b) {
             a.g.push(b >>> 0 & 255);
             a.g.push(b >>> 8 & 255);
             a.g.push(b >>> 16 & 255);
             a.g.push(b >>> 24 & 255)
         };
     var Og = function() {
             this.l = [];
             this.j = 0;
             this.g = new Jg
         },
         Pg = function(a, b) {
             b.length !== 0 && (a.l.push(b), a.j += b.length)
         },
         Rg = function(a, b) {
             Qg(a, b, 2);
             b = a.g.end();
             Pg(a, b);
             b.push(a.j);
             return b
         },
         Sg = function(a, b) {
             var c = b.pop();
             for (c = a.j + a.g.length() - c; c > 127;) b.push(c & 127 | 128), c >>>= 7, a.j++;
             b.push(c);
             a.j++
         },
         Qg = function(a, b, c) {
             Lg(a.g, b * 8 + c)
         },
         Tg = function(a, b, c) {
             Qg(a, b, 2);
             Lg(a.g, c.length);
             Pg(a, a.g.end());
             Pg(a, c)
         };

     function Ug() {
         var a = function() {
             throw Error();
         };
         Object.setPrototypeOf(a, a.prototype);
         return a
     }
     var Vg = Ug(),
         Wg = Ug(),
         Xg = Ug(),
         Yg = Ug(),
         Zg = Ug(),
         $g = Ug(),
         ah = Ug(),
         bh = Ug(),
         ch = Ug(),
         dh = Ug();
     var I = function(a, b, c) {
         this.D = C(a, b, c)
     };
     I.prototype.toJSON = function() {
         return mf(this)
     };
     I.prototype.ba = function(a) {
         return JSON.stringify(mf(this, a))
     };
     I.prototype[rd] = Ed;
     I.prototype.toString = function() {
         return this.D.toString()
     };
     var eh = function(a, b) {
         this.g = a;
         a = qb(Vg);
         this.j = !!a && b === a || !1
     };

     function fh() {
         var a = gh;
         var b = b === void 0 ? Vg : b;
         return new eh(a, b)
     }

     function gh(a, b, c, d, e) {
         b = hh(b, d);
         b != null && (c = Rg(a, c), e(b, a), Sg(a, c))
     }
     var ih = fh(),
         jh = fh(),
         kh = Symbol(),
         lh = Symbol(),
         mh, nh;

     function oh(a) {
         var b = ph,
             c = qh,
             d = a[kh];
         if (d) return d;
         d = {};
         d.kk = a;
         d.Bf = sf(a[0]);
         var e = a[1],
             f = 1;
         e && e.constructor === Object && (d.ih = e, e = a[++f], typeof e === "function" && (d.Fh = !0, mh != null || (mh = e), nh != null || (nh = a[f + 1]), e = a[f += 2]));
         for (var g = {}; e && Array.isArray(e) && e.length && typeof e[0] === "number" && e[0] > 0;) {
             for (var h = 0; h < e.length; h++) g[e[h]] = e;
             e = a[++f]
         }
         for (h = 1; e !== void 0;) {
             typeof e === "number" && (h += e, e = a[++f]);
             var k = void 0;
             if (e instanceof eh) var l = e;
             else l = ih, f--;
             e = void 0;
             if ((e = l) == null ? 0 : e.j) {
                 e = a[++f];
                 k = a;
                 var n =
                     f;
                 typeof e === "function" && (e = e(), k[n] = e);
                 k = e
             }
             e = a[++f];
             n = h + 1;
             typeof e === "number" && e < 0 && (n -= e, e = a[++f]);
             for (; h < n; h++) {
                 var p = g[h];
                 k ? c(d, h, l, k, p) : b(d, h, l, p)
             }
         }
         return a[kh] = d
     }

     function hh(a, b) {
         if (a instanceof I) return a.D;
         if (Array.isArray(a)) return tf(a, b[0], b[1])
     };

     function ph(a, b, c) {
         a[b] = c.g
     }

     function qh(a, b, c, d) {
         var e, f, g = c.g;
         a[b] = function(h, k, l) {
             return g(h, k, l, f || (f = oh(d).Bf), e || (e = rh(d)))
         }
     }

     function rh(a) {
         var b = a[lh];
         if (!b) {
             var c = oh(a);
             b = function(d, e) {
                 return sh(d, e, c)
             };
             a[lh] = b
         }
         return b
     }

     function sh(a, b, c) {
         Kd(a, a[B] | 0, function(d, e) {
             if (e != null) {
                 var f = th(c, d);
                 f ? f(b, e, d) : d < 500 || id(pd, 3)
             }
         })
     }

     function th(a, b) {
         var c = a[b];
         if (c) return c;
         if (c = a.ih)
             if (c = c[b]) {
                 c = Array.isArray(c) ? c[0] instanceof eh ? c : [jh, c] : [c, void 0];
                 var d = c[0].g;
                 if (c = c[1]) {
                     var e = rh(c),
                         f = oh(c).Bf;
                     c = a.Fh ? nh(f, e) : function(g, h, k) {
                         return d(g, h, k, f, e)
                     }
                 } else c = d;
                 return a[b] = c
             }
     };

     function uh(a, b) {
         if (Array.isArray(b)) {
             var c = b[B] | 0;
             if (c & 4) return b;
             for (var d = 0, e = 0; d < b.length; d++) {
                 var f = a(b[d]);
                 f != null && (b[e++] = f)
             }
             e < d && (b.length = e);
             a = (c | 5) & -1537;
             a !== c && xd(b, a);
             a & 2 && Object.freeze(b);
             return b
         }
     }
     var vh = function(a, b) {
         var c = new Og;
         sh(a.D, c, oh(b));
         Pg(c, c.g.end());
         a = new Uint8Array(c.j);
         b = c.l;
         for (var d = b.length, e = 0, f = 0; f < d; f++) {
             var g = b[f];
             a.set(g, e);
             e += g.length
         }
         c.l = [a];
         return a
     };

     function wh(a, b) {
         return new eh(a, b)
     }

     function xh(a, b, c) {
         b = Je(b);
         if (b != null) {
             switch (typeof b) {
                 case "string":
                     Ig(b)
             }
             if (b != null) switch (Qg(a, c, 0), typeof b) {
                 case "number":
                     a = a.g;
                     de(b);
                     Kg(a, $d, ae);
                     break;
                 case "bigint":
                     c = BigInt.asUintN(64, b);
                     c = new Fg(Number(c & BigInt(4294967295)), Number(c >> BigInt(32)));
                     Kg(a.g, c.j, c.g);
                     break;
                 default:
                     c = Ig(b), Kg(a.g, c.j, c.g)
             }
         }
     }

     function yh(a, b, c) {
         b = ze(b);
         b != null && b != null && (Qg(a, c, 0), Mg(a.g, b))
     }
     var zh = wh(function(a, b, c) {
             b = qe(b);
             b != null && (Qg(a, c, 1), a = a.g, c = be || (be = new DataView(new ArrayBuffer(8))), c.setFloat64(0, +b, !0), $d = c.getUint32(0, !0), ae = c.getUint32(4, !0), Ng(a, $d), Ng(a, ae))
         }, ch),
         Ah = wh(function(a, b, c) {
             b = qe(b);
             b != null && (Qg(a, c, 5), a = a.g, c = be || (be = new DataView(new ArrayBuffer(8))), c.setFloat32(0, +b, !0), ae = 0, $d = c.getUint32(0, !0), Ng(a, $d))
         }, bh),
         Bh = wh(xh, $g),
         Ch = wh(xh, $g),
         Dh = wh(xh, $g),
         Eh = wh(function(a, b, c) {
             b = Ke(b);
             if (b != null) {
                 switch (typeof b) {
                     case "string":
                         Eg(b)
                 }
                 if (b != null) switch (Qg(a, c, 0),
                     typeof b) {
                     case "number":
                         a = a.g;
                         de(b);
                         Kg(a, $d, ae);
                         break;
                     case "bigint":
                         c = BigInt.asUintN(64, b);
                         c = new Cg(Number(c & BigInt(4294967295)), Number(c >> BigInt(32)));
                         Kg(a.g, c.j, c.g);
                         break;
                     default:
                         c = Eg(b), Kg(a.g, c.j, c.g)
                 }
             }
         }, ah),
         Fh = wh(yh, Yg),
         Gh = wh(yh, Yg),
         Hh = wh(function(a, b, c) {
             b = se(b);
             b != null && (Qg(a, c, 0), a.g.g.push(b ? 1 : 0))
         }, Wg),
         Ih = wh(function(a, b, c) {
             b = Ne(b);
             b != null && Tg(a, c, Ab(b))
         }, Xg),
         Jh;
     Jh = new eh(function(a, b, c) {
         b = uh(Ne, b);
         if (b != null)
             for (var d = 0; d < b.length; d++) {
                 var e = a,
                     f = c,
                     g = b[d];
                 g != null && Tg(e, f, Ab(g))
             }
     }, Xg);
     var Kh, Lh = void 0;
     Lh = Lh === void 0 ? Vg : Lh;
     Kh = new eh(function(a, b, c, d, e) {
         if (Array.isArray(b)) {
             for (var f = 0; f < b.length; f++) {
                 var g = a,
                     h = c,
                     k = e,
                     l = hh(b[f], d);
                 l != null && (h = Rg(g, h), k(l, g), Sg(g, h))
             }
             a = b[B] | 0;
             a & 1 || xd(b, a | 1)
         }
     }, Lh);
     var Mh = wh(function(a, b, c) {
             b = Ae(b);
             b != null && b != null && (Qg(a, c, 0), Lg(a.g, b))
         }, Zg),
         Nh = wh(function(a, b, c) {
             b = ze(b);
             b != null && (b = parseInt(b, 10), Qg(a, c, 0), Mg(a.g, b))
         }, dh),
         Oh;
     Oh = new eh(function(a, b, c) {
         b = uh(ze, b);
         if (b != null && b.length) {
             c = Rg(a, c);
             for (var d = 0; d < b.length; d++) Mg(a.g, b[d]);
             Sg(a, c)
         }
     }, dh);

     function Ph(a) {
         return function(b) {
             return vh(b, a)
         }
     }

     function Qh(a) {
         return function() {
             return vh(this, a)
         }
     }

     function Rh(a) {
         return function(b) {
             b = JSON.parse(b);
             if (!Array.isArray(b)) throw Error("Expected jspb data to be an array, got " + Za(b) + ": " + b);
             Ad(b);
             return new a(b)
         }
     }

     function Sh(a) {
         return function(b) {
             if (b == null || b == "") b = new a;
             else {
                 b = JSON.parse(b);
                 if (!Array.isArray(b)) throw Error("dnarr");
                 b = new a(Cd(b))
             }
             return b
         }
     };
     var Th = function(a) {
         this.D = C(a)
     };
     r(Th, I);
     var Uh = function(a) {
         this.D = C(a)
     };
     r(Uh, I);
     var Vh = function(a) {
         this.D = C(a)
     };
     r(Vh, I);
     var Wh = function(a) {
         this.D = C(a)
     };
     r(Wh, I);
     var Xh = function(a) {
         this.D = C(a)
     };
     r(Xh, I);
     var Yh = function(a) {
         this.D = C(a)
     };
     r(Yh, I);
     var Zh = function(a) {
         this.D = C(a)
     };
     r(Zh, I);
     var $h = function(a) {
         this.D = C(a)
     };
     r($h, I);
     $h.prototype.getEscapedQemQueryId = function() {
         return pg(this, 1)
     };
     var ai = function(a) {
         this.D = C(a)
     };
     r(ai, I);
     var bi = function(a) {
         this.D = C(a)
     };
     r(bi, I);
     var ci = [0, Ih, [0, Bh],
         [0, Nh, Ch]
     ];
     var di = function(a) {
         this.D = C(a)
     };
     r(di, I);
     var ei = function(a, b, c) {
             c = c === void 0 ? {} : c;
             this.error = a;
             this.meta = c;
             this.context = b.context;
             this.msg = b.message || "";
             this.id = b.id || "jserror"
         },
         fi = function(a) {
             return !!(a.error && a.meta && a.id)
         };

     function gi(a) {
         var b = a.toString();
         a.name && b.indexOf(a.name) == -1 && (b += ": " + a.name);
         a.message && b.indexOf(a.message) == -1 && (b += ": " + a.message);
         if (a.stack) a: {
             a = a.stack;
             var c = b;
             try {
                 a.indexOf(c) == -1 && (a = c + "\n" + a);
                 for (var d; a != d;) d = a, a = a.replace(RegExp("((https?:/..*/)[^/:]*:\\d+(?:.|\n)*)\\2"), "$1");
                 b = a.replace(RegExp("\n *", "g"), "\n");
                 break a
             } catch (e) {
                 b = c;
                 break a
             }
             b = void 0
         }
         return b
     };

     function hi(a, b) {
         if (a)
             for (var c in a) Object.prototype.hasOwnProperty.call(a, c) && b(a[c], c, a)
     };

     function ii(a) {
         try {
             return !!a && a.location.href != null && Cc(a, "foo")
         } catch (b) {
             return !1
         }
     }

     function ji(a) {
         for (var b = a; a && a != a.parent;) a = a.parent, ii(a) && (b = a);
         return b
     };
     var ki = function() {},
         li = function(a) {
             var b = !1,
                 c;
             return function() {
                 b || (c = a(), b = !0);
                 return c
             }
         },
         mi = function(a) {
             var b = a;
             return function() {
                 if (b) {
                     var c = b;
                     b = null;
                     c()
                 }
             }
         },
         ni = function(a) {
             var b = 0,
                 c = !1,
                 d = [],
                 e = function() {
                     b = 0;
                     c && (c = !1, f())
                 },
                 f = function() {
                     b = x.setTimeout(e, 1E3);
                     var g = d;
                     d = [];
                     a.apply(void 0, g)
                 };
             return function(g) {
                 d = arguments;
                 b ? c = !0 : f()
             }
         };
     var pi = function() {
             return Qb && Tb ? Tb.mobile : !oi() && (A("iPod") || A("iPhone") || A("Android") || A("IEMobile"))
         },
         oi = function() {
             return Qb && Tb ? !Tb.mobile && (A("iPad") || A("Android") || A("Silk")) : A("iPad") || A("Android") && !A("Mobile") || A("Silk")
         };
     /* 
      
      Copyright Google LLC 
      SPDX-License-Identifier: Apache-2.0 
     */
     var qi = globalThis.trustedTypes,
         ri;

     function si() {
         var a = null;
         if (!qi) return a;
         try {
             var b = function(c) {
                 return c
             };
             a = qi.createPolicy("goog#html", {
                 createHTML: b,
                 createScript: b,
                 createScriptURL: b
             })
         } catch (c) {}
         return a
     }

     function ti() {
         ri === void 0 && (ri = si());
         return ri
     };
     var ui = function(a) {
         this.g = a
     };
     ui.prototype.toString = function() {
         return this.g + ""
     };

     function vi(a) {
         var b = ti();
         a = b ? b.createScriptURL(a) : a;
         return new ui(a)
     };
     var wi = function(a) {
         this.g = a
     };
     wi.prototype.toString = function() {
         return this.g
     };

     function xi(a) {
         return new wi(a)
     }
     var yi = xi("about:invalid#zClosurez");
     var zi = function(a) {
         this.Ih = a
     };

     function Ai(a) {
         return new zi(function(b) {
             return b.substr(0, a.length + 1).toLowerCase() === a + ":"
         })
     }
     var Bi = [Ai("data"), Ai("http"), Ai("https"), Ai("mailto"), Ai("ftp"), new zi(function(a) {
         return /^[^:]*([/?#]|$)/.test(a)
     })];

     function Ci(a) {
         var b = window;
         if (typeof MediaSource !== "undefined" && a instanceof MediaSource || typeof b.ManagedMediaSource !== "undefined" && a instanceof b.ManagedMediaSource) return xi(URL.createObjectURL(a));
         b = a.type;
         b.toLowerCase() === "application/octet-stream" ? b = !0 : (b = b.match(/^([^;]+)(?:;\w+=(?:\w+|"[\w;,= ]+"))*$/i), b = (b == null ? void 0 : b.length) === 2 && (/^image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp|x-icon|heic|heif|avif|x-ms-bmp)$/i.test(b[1]) || /^video\/(?:3gpp|avi|mpeg|mpg|mp4|ogg|webm|x-flv|x-matroska|quicktime|x-ms-wmv)$/i.test(b[1]) ||
             /^audio\/(?:3gpp2|3gpp|aac|amr|L16|midi|mp3|mp4|mpeg|oga|ogg|opus|x-m4a|x-matroska|x-wav|wav|webm)$/i.test(b[1]) || /^font\/[\w-]+$/i.test(b[1])));
         if (!b) throw Error("");
         return xi(URL.createObjectURL(a))
     }
     var Di = /^\s*(?!javascript:)(?:[\w+.-]+:|[^:/?#]*(?:[/?#]|$))/i;
     var Li = function(a) {
         this.g = a
     };
     Li.prototype.toString = function() {
         return this.g + ""
     };

     function Mi(a) {
         if (a instanceof Li) return a.g;
         throw Error("");
     };

     function Ni(a, b) {
         if (b instanceof ui) b = b.g;
         else throw Error("");
         a.src = b;
         var c;
         b = a.ownerDocument;
         b = b === void 0 ? document : b;
         var d;
         b = (d = (c = b).querySelector) == null ? void 0 : d.call(c, "script[nonce]");
         (c = b == null ? "" : b.nonce || b.getAttribute("nonce") || "") && a.setAttribute("nonce", c)
     };

     function Oi(a, b) {
         if (a.nodeType === 1 && /^(script|style)$/i.test(a.tagName)) throw Error("");
         a.innerHTML = Mi(b)
     };
     var Pi = function(a) {
         var b = [],
             c = [],
             d = {},
             e = function(f, g) {
                 var h = g + "  ";
                 try {
                     if (f === void 0) b.push("undefined");
                     else if (f === null) b.push("NULL");
                     else if (typeof f === "string") b.push('"' + f.replace(/\n/g, "\n" + g) + '"');
                     else if (typeof f === "function") b.push(String(f).replace(/\n/g, "\n" + g));
                     else if (db(f)) {
                         f[eb] || c.push(f);
                         var k = gb(f);
                         if (d[k]) b.push("*** reference loop detected (id=" + k + ") ***");
                         else {
                             d[k] = !0;
                             b.push("{");
                             for (var l in f) typeof f[l] !== "function" && (b.push("\n"), b.push(h), b.push(l + " = "), e(f[l], h));
                             b.push("\n" +
                                 g + "}");
                             delete d[k]
                         }
                     } else b.push(f)
                 } catch (n) {
                     b.push("*** " + n + " ***")
                 }
             };
         e(a, "");
         for (a = 0; a < c.length; a++) jb(c[a]);
         return b.join("")
     };

     function Qi(a, b) {
         a.write(Mi(b))
     };
     var Ri = function(a) {
             return decodeURIComponent(a.replace(/\+/g, " "))
         },
         Si = function(a) {
             Lb.test(a) && (a.indexOf("&") != -1 && (a = a.replace(Fb, "&amp;")), a.indexOf("<") != -1 && (a = a.replace(Gb, "&lt;")), a.indexOf(">") != -1 && (a = a.replace(Hb, "&gt;")), a.indexOf('"') != -1 && (a = a.replace(Ib, "&quot;")), a.indexOf("'") != -1 && (a = a.replace(Jb, "&#39;")), a.indexOf("\x00") != -1 && (a = a.replace(Kb, "&#0;")));
             return a
         },
         Ti = function(a, b) {
             a.length > b && (a = a.substring(0, b - 3) + "...");
             return a
         },
         Ui = String.prototype.repeat ? function(a, b) {
             return a.repeat(b)
         } :
         function(a, b) {
             return Array(b + 1).join(a)
         },
         Vi = function(a) {
             return a == null ? "" : String(a)
         },
         Wi = Math.random() * 2147483648 | 0,
         Xi = function(a) {
             return String(a).replace(/\-([a-z])/g, function(b, c) {
                 return c.toUpperCase()
             })
         },
         Yi = function() {
             return "googleAvInapp".replace(/([A-Z])/g, "-$1").toLowerCase()
         },
         Zi = function(a) {
             return a.replace(RegExp("(^|[\\s]+)([a-z])", "g"), function(b, c, d) {
                 return c + d.toUpperCase()
             })
         },
         $i = function(a) {
             isFinite(a) && (a = String(a));
             return typeof a === "string" ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a,
                 10) : NaN
         };

     function aj(a) {
         var b, c;
         return (c = (b = /https?:\/\/[^\/]+/.exec(a)) == null ? void 0 : b[0]) != null ? c : ""
     }

     function bj() {
         try {
             for (var a = x, b = null; b != a; b = a, a = a.parent) switch (a.location.protocol) {
                 case "https:":
                     return !0;
                 case "file:":
                     return !0;
                 case "http:":
                     return !1
             }
         } catch (c) {}
         return !0
     }
     var cj = li(function() {
         return pi() ? 2 : oi() ? 1 : 0
     });

     function dj() {
         if (!globalThis.crypto) return Math.random();
         try {
             var a = new Uint32Array(1);
             globalThis.crypto.getRandomValues(a);
             return a[0] / 65536 / 65536
         } catch (b) {
             return Math.random()
         }
     };
     var ej, fj = 64;

     function gj() {
         try {
             return ej != null || (ej = new Uint32Array(64)), fj >= 64 && (crypto.getRandomValues(ej), fj = 0), ej[fj++]
         } catch (a) {
             return Math.floor(Math.random() * 4294967296)
         }
     };

     function hj(a) {
         var b = window;
         if (!Md(b.goog_pvsid)) try {
             var c = gj() + (gj() & 2097151) * 4294967296;
             Object.defineProperty(b, "goog_pvsid", {
                 value: c,
                 configurable: !1
             })
         } catch (d) {
             a.Xa({
                 methodName: 784,
                 Hb: d
             })
         }
         b = Number(b.goog_pvsid);
         (!b || b <= 0) && a.Xa({
             methodName: 784,
             Hb: Error("Invalid correlator, " + b)
         });
         return b || -1
     };

     function ij(a) {
         var b = Ra.apply(1, arguments);
         if (b.length === 0) return vi(a[0]);
         for (var c = a[0], d = 0; d < b.length; d++) c += encodeURIComponent(b[d]) + a[d + 1];
         return vi(c)
     };
     var jj = function(a, b) {
             try {
                 return !(!a.frames || !a.frames[b])
             } catch (c) {
                 return !1
             }
         },
         kj = function(a, b) {
             for (var c = 0; c < 50; ++c) {
                 if (jj(a, b)) return a;
                 a: {
                     try {
                         var d = a.parent;
                         if (d && d != a) {
                             var e = d;
                             break a
                         }
                     } catch (f) {}
                     e = null
                 }
                 if (!(a = e)) break
             }
             return null
         },
         lj = function() {
             return hj({
                 Xa: function() {}
             })
         },
         mj = function(a, b) {
             b = b === void 0 ? document : b;
             return b.createElement(String(a).toLowerCase())
         };

     function nj(a) {
         a = a && a.toString && a.toString();
         return typeof a === "string" && Mb(a, "[native code]")
     };
     var oj = function() {
         if (!x.addEventListener || !Object.defineProperty) return !1;
         var a = !1,
             b = Object.defineProperty({}, "passive", {
                 get: function() {
                     a = !0
                 }
             });
         try {
             var c = function() {};
             x.addEventListener("test", c, b);
             x.removeEventListener("test", c, b)
         } catch (d) {}
         return a
     }();
     var pj = function(a, b) {
         this.x = a !== void 0 ? a : 0;
         this.y = b !== void 0 ? b : 0
     };
     m = pj.prototype;
     m.equals = function(a) {
         return a instanceof pj && (this == a ? !0 : this && a ? this.x == a.x && this.y == a.y : !1)
     };
     m.ceil = function() {
         this.x = Math.ceil(this.x);
         this.y = Math.ceil(this.y);
         return this
     };
     m.floor = function() {
         this.x = Math.floor(this.x);
         this.y = Math.floor(this.y);
         return this
     };
     m.round = function() {
         this.x = Math.round(this.x);
         this.y = Math.round(this.y);
         return this
     };
     m.scale = function(a, b) {
         this.x *= a;
         this.y *= typeof b === "number" ? b : a;
         return this
     };
     var qj = function(a, b) {
         this.width = a;
         this.height = b
     };
     m = qj.prototype;
     m.aspectRatio = function() {
         return this.width / this.height
     };
     m.isEmpty = function() {
         return !(this.width * this.height)
     };
     m.ceil = function() {
         this.width = Math.ceil(this.width);
         this.height = Math.ceil(this.height);
         return this
     };
     m.floor = function() {
         this.width = Math.floor(this.width);
         this.height = Math.floor(this.height);
         return this
     };
     m.round = function() {
         this.width = Math.round(this.width);
         this.height = Math.round(this.height);
         return this
     };
     m.scale = function(a, b) {
         this.width *= a;
         this.height *= typeof b === "number" ? b : a;
         return this
     };

     function rj(a, b, c) {
         for (var d in a) b.call(c, a[d], d, a)
     }

     function sj(a, b) {
         var c = {},
             d;
         for (d in a) b.call(void 0, a[d], d, a) && (c[d] = a[d]);
         return c
     }

     function tj(a) {
         var b = uj,
             c;
         for (c in b)
             if (!a.call(void 0, b[c], c, b)) return !1;
         return !0
     }

     function vj(a) {
         var b = [],
             c = 0,
             d;
         for (d in a) b[c++] = a[d];
         return b
     }

     function wj(a) {
         var b = [],
             c = 0,
             d;
         for (d in a) b[c++] = d;
         return b
     }

     function xj(a, b) {
         var c = $a(b),
             d = c ? b : arguments;
         for (c = c ? 0 : 1; c < d.length; c++) {
             if (a == null) return;
             a = a[d[c]]
         }
         return a
     }

     function yj(a, b) {
         return a !== null && b in a
     }

     function zj(a, b) {
         for (var c in a)
             if (a[c] == b) return !0;
         return !1
     }

     function Aj(a) {
         var b = Bj,
             c;
         for (c in b)
             if (a.call(void 0, b[c], c, b)) return c
     }

     function Cj(a) {
         for (var b in a) return !1;
         return !0
     }

     function Dj(a) {
         for (var b in a) delete a[b]
     }

     function Ej(a, b, c) {
         return a !== null && b in a ? a[b] : c
     }
     var Fj = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");

     function Gj(a, b) {
         for (var c, d, e = 1; e < arguments.length; e++) {
             d = arguments[e];
             for (c in d) a[c] = d[c];
             for (var f = 0; f < Fj.length; f++) c = Fj[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
         }
     };
     var Jj = function(a) {
             return a ? new Hj(Ij(a)) : ub || (ub = new Hj)
         },
         Kj = function(a) {
             var b = document;
             return typeof a === "string" ? b.getElementById(a) : a
         },
         Mj = function(a, b) {
             rj(b, function(c, d) {
                 d == "style" ? a.style.cssText = c : d == "class" ? a.className = c : d == "for" ? a.htmlFor = c : Lj.hasOwnProperty(d) ? a.setAttribute(Lj[d], c) : d.lastIndexOf("aria-", 0) == 0 || d.lastIndexOf("data-", 0) == 0 ? a.setAttribute(d, c) : a[d] = c
             })
         },
         Lj = {
             cellpadding: "cellPadding",
             cellspacing: "cellSpacing",
             colspan: "colSpan",
             frameborder: "frameBorder",
             height: "height",
             maxlength: "maxLength",
             nonce: "nonce",
             role: "role",
             rowspan: "rowSpan",
             type: "type",
             usemap: "useMap",
             valign: "vAlign",
             width: "width"
         },
         Nj = function(a) {
             a = a.document;
             a = a.compatMode == "CSS1Compat" ? a.documentElement : a.body;
             return new qj(a.clientWidth, a.clientHeight)
         },
         Oj = function(a) {
             return a ? a.defaultView : window
         },
         Rj = function(a, b, c) {
             var d = arguments,
                 e = document,
                 f = d[1],
                 g = Pj(e, String(d[0]));
             f && (typeof f === "string" ? g.className = f : Array.isArray(f) ? g.className = f.join(" ") : Mj(g, f));
             d.length > 2 && Qj(e, g, d, 2);
             return g
         },
         Qj = function(a, b, c, d) {
             function e(h) {
                 h &&
                     b.appendChild(typeof h === "string" ? a.createTextNode(h) : h)
             }
             for (; d < c.length; d++) {
                 var f = c[d];
                 if (!$a(f) || db(f) && f.nodeType > 0) e(f);
                 else {
                     a: {
                         if (f && typeof f.length == "number") {
                             if (db(f)) {
                                 var g = typeof f.item == "function" || typeof f.item == "string";
                                 break a
                             }
                             if (typeof f === "function") {
                                 g = typeof f.item == "function";
                                 break a
                             }
                         }
                         g = !1
                     }
                     ec(g ? vc(f) : f, e)
                 }
             }
         },
         Pj = function(a, b) {
             b = String(b);
             a.contentType === "application/xhtml+xml" && (b = b.toLowerCase());
             return a.createElement(b)
         },
         Sj = function(a) {
             a && a.parentNode && a.parentNode.removeChild(a)
         },
         Tj = function(a, b) {
             if (!a || !b) return !1;
             if (a.contains && b.nodeType == 1) return a == b || a.contains(b);
             if (typeof a.compareDocumentPosition != "undefined") return a == b || !!(a.compareDocumentPosition(b) & 16);
             for (; b && a != b;) b = b.parentNode;
             return b == a
         },
         Ij = function(a) {
             return a.nodeType == 9 ? a : a.ownerDocument || a.document
         },
         Uj = function(a) {
             try {
                 return a.contentWindow || (a.contentDocument ? Oj(a.contentDocument) : null)
             } catch (b) {}
             return null
         },
         Vj = function(a, b) {
             a && (a = a.parentNode);
             for (var c = 0; a;) {
                 if (b(a)) return a;
                 a = a.parentNode;
                 c++
             }
             return null
         },
         Hj = function(a) {
             this.g = a || x.document || document
         };
     Hj.prototype.getElementsByTagName = function(a, b) {
         return (b || this.g).getElementsByTagName(String(a))
     };
     var Wj = function(a) {
         var b = a.g;
         a = b.scrollingElement ? b.scrollingElement : Jc || b.compatMode != "CSS1Compat" ? b.body || b.documentElement : b.documentElement;
         b = b.defaultView;
         return new pj((b == null ? void 0 : b.pageXOffset) || a.scrollLeft, (b == null ? void 0 : b.pageYOffset) || a.scrollTop)
     };
     Hj.prototype.appendChild = function(a, b) {
         a.appendChild(b)
     };
     Hj.prototype.append = function(a, b) {
         Qj(Ij(a), a, arguments, 1)
     };
     Hj.prototype.canHaveChildren = function(a) {
         if (a.nodeType != 1) return !1;
         switch (a.tagName) {
             case "APPLET":
             case "AREA":
             case "BASE":
             case "BR":
             case "COL":
             case "COMMAND":
             case "EMBED":
             case "FRAME":
             case "HR":
             case "IMG":
             case "INPUT":
             case "IFRAME":
             case "ISINDEX":
             case "KEYGEN":
             case "LINK":
             case "NOFRAMES":
             case "NOSCRIPT":
             case "META":
             case "OBJECT":
             case "PARAM":
             case "SCRIPT":
             case "SOURCE":
             case "STYLE":
             case "TRACK":
             case "WBR":
                 return !1
         }
         return !0
     };
     Hj.prototype.contains = Tj;

     function J(a, b, c, d) {
         this.top = a;
         this.right = b;
         this.bottom = c;
         this.left = d
     }
     J.prototype.getWidth = function() {
         return this.right - this.left
     };
     J.prototype.getHeight = function() {
         return this.bottom - this.top
     };
     var Xj = function(a) {
         return new J(a.top, a.right, a.bottom, a.left)
     };
     J.prototype.contains = function(a) {
         return this && a ? a instanceof J ? a.left >= this.left && a.right <= this.right && a.top >= this.top && a.bottom <= this.bottom : a.x >= this.left && a.x <= this.right && a.y >= this.top && a.y <= this.bottom : !1
     };
     J.prototype.expand = function(a, b, c, d) {
         db(a) ? (this.top -= a.top, this.right += a.right, this.bottom += a.bottom, this.left -= a.left) : (this.top -= a, this.right += Number(b), this.bottom += Number(c), this.left -= Number(d));
         return this
     };
     var Yj = function(a, b) {
         return a == b ? !0 : a && b ? a.top == b.top && a.right == b.right && a.bottom == b.bottom && a.left == b.left : !1
     };
     J.prototype.ceil = function() {
         this.top = Math.ceil(this.top);
         this.right = Math.ceil(this.right);
         this.bottom = Math.ceil(this.bottom);
         this.left = Math.ceil(this.left);
         return this
     };
     J.prototype.floor = function() {
         this.top = Math.floor(this.top);
         this.right = Math.floor(this.right);
         this.bottom = Math.floor(this.bottom);
         this.left = Math.floor(this.left);
         return this
     };
     J.prototype.round = function() {
         this.top = Math.round(this.top);
         this.right = Math.round(this.right);
         this.bottom = Math.round(this.bottom);
         this.left = Math.round(this.left);
         return this
     };
     var Zj = function(a, b, c) {
         b instanceof pj ? (a.left += b.x, a.right += b.x, a.top += b.y, a.bottom += b.y) : (a.left += b, a.right += b, typeof c === "number" && (a.top += c, a.bottom += c));
         return a
     };
     J.prototype.scale = function(a, b) {
         b = typeof b === "number" ? b : a;
         this.left *= a;
         this.right *= a;
         this.top *= b;
         this.bottom *= b;
         return this
     };
     var ak = function(a, b, c, d) {
             this.left = a;
             this.top = b;
             this.width = c;
             this.height = d
         },
         bk = function(a) {
             return new J(a.top, a.left + a.width, a.top + a.height, a.left)
         };
     m = ak.prototype;
     m.contains = function(a) {
         return a instanceof pj ? a.x >= this.left && a.x <= this.left + this.width && a.y >= this.top && a.y <= this.top + this.height : this.left <= a.left && this.left + this.width >= a.left + a.width && this.top <= a.top && this.top + this.height >= a.top + a.height
     };
     m.getSize = function() {
         return new qj(this.width, this.height)
     };
     m.ceil = function() {
         this.left = Math.ceil(this.left);
         this.top = Math.ceil(this.top);
         this.width = Math.ceil(this.width);
         this.height = Math.ceil(this.height);
         return this
     };
     m.floor = function() {
         this.left = Math.floor(this.left);
         this.top = Math.floor(this.top);
         this.width = Math.floor(this.width);
         this.height = Math.floor(this.height);
         return this
     };
     m.round = function() {
         this.left = Math.round(this.left);
         this.top = Math.round(this.top);
         this.width = Math.round(this.width);
         this.height = Math.round(this.height);
         return this
     };
     m.scale = function(a, b) {
         b = typeof b === "number" ? b : a;
         this.left *= a;
         this.width *= a;
         this.top *= b;
         this.height *= b;
         return this
     };
     var dk = function(a, b) {
             if (typeof b === "string")(b = ck(a, b)) && (a.style[b] = void 0);
             else
                 for (var c in b) {
                     var d = a,
                         e = b[c],
                         f = ck(d, c);
                     f && (d.style[f] = e)
                 }
         },
         ek = {},
         ck = function(a, b) {
             var c = ek[b];
             if (!c) {
                 var d = Xi(b);
                 c = d;
                 a.style[d] === void 0 && (d = (Jc ? "Webkit" : Ic ? "Moz" : null) + Zi(d), a.style[d] !== void 0 && (c = d));
                 ek[b] = c
             }
             return c
         },
         fk = function(a, b) {
             var c = a.style[Xi(b)];
             return typeof c !== "undefined" ? c : a.style[ck(a, b)] || ""
         },
         gk = function(a, b) {
             var c = Ij(a);
             return c.defaultView && c.defaultView.getComputedStyle && (a = c.defaultView.getComputedStyle(a,
                 null)) ? a[b] || a.getPropertyValue(b) || "" : ""
         },
         hk = function(a) {
             try {
                 return a.getBoundingClientRect()
             } catch (b) {
                 return {
                     left: 0,
                     top: 0,
                     right: 0,
                     bottom: 0
                 }
             }
         },
         ik = function(a) {
             var b = Ij(a),
                 c = new pj(0, 0);
             if (a == (b ? Ij(b) : document).documentElement) return c;
             a = hk(a);
             b = Wj(Jj(b));
             c.x = a.left + b.x;
             c.y = a.top + b.y;
             return c
         },
         jk = function(a, b) {
             var c = new pj(0, 0),
                 d = Oj(Ij(a));
             if (!Cc(d, "parent")) return c;
             do {
                 if (d == b) var e = ik(a);
                 else e = hk(a), e = new pj(e.left, e.top);
                 c.x += e.x;
                 c.y += e.y
             } while (d && d != b && d != d.parent && (a = d.frameElement) && (d = d.parent));
             return c
         },
         kk = function() {
             var a = "100%";
             typeof a == "number" && (a = Math.round(a) + "px");
             return a
         },
         mk = function(a) {
             var b = lk,
                 c;
             (c = gk(a, "display")) || (c = a.currentStyle ? a.currentStyle.display : null);
             if ((c || a.style && a.style.display) != "none") return b(a);
             c = a.style;
             var d = c.display,
                 e = c.visibility,
                 f = c.position;
             c.visibility = "hidden";
             c.position = "absolute";
             c.display = "inline";
             a = b(a);
             c.display = d;
             c.position = f;
             c.visibility = e;
             return a
         },
         lk = function(a) {
             var b = a.offsetWidth,
                 c = a.offsetHeight,
                 d = Jc && !b && !c;
             return (b === void 0 || d) && a.getBoundingClientRect ?
                 (a = hk(a), new qj(a.right - a.left, a.bottom - a.top)) : new qj(b, c)
         },
         nk = function(a) {
             var b = new qj(a.offsetWidth, a.offsetHeight);
             var c = gk(a, "paddingLeft");
             var d = gk(a, "paddingRight"),
                 e = gk(a, "paddingTop"),
                 f = gk(a, "paddingBottom");
             c = new J(parseFloat(e), parseFloat(d), parseFloat(f), parseFloat(c));
             d = gk(a, "borderLeftWidth");
             e = gk(a, "borderRightWidth");
             f = gk(a, "borderTopWidth");
             a = gk(a, "borderBottomWidth");
             a = new J(parseFloat(f), parseFloat(e), parseFloat(a), parseFloat(d));
             return new qj(b.width - a.left - c.left - c.right - a.right,
                 b.height - a.top - c.top - c.bottom - a.bottom)
         };
     var ok = li(function() {
         var a = !1;
         try {
             var b = Object.defineProperty({}, "passive", {
                 get: function() {
                     a = !0
                 }
             });
             x.addEventListener("test", null, b)
         } catch (c) {}
         return a
     });

     function pk(a) {
         return a ? a.passive && ok() ? a : a.capture || !1 : !1
     }

     function qk(a, b, c, d) {
         return typeof a.addEventListener === "function" ? (a.addEventListener(b, c, pk(d)), !0) : !1
     }

     function rk(a, b, c) {
         typeof a.removeEventListener === "function" && a.removeEventListener(b, c, pk())
     };

     function sk(a, b, c, d, e) {
         tk(a, b, c === void 0 ? null : c, d === void 0 ? !1 : d, e === void 0 ? !1 : e)
     }

     function tk(a, b, c, d, e) {
         e = e === void 0 ? !1 : e;
         a.google_image_requests || (a.google_image_requests = []);
         var f = mj("IMG", a.document);
         if (c || d) {
             var g = function(h) {
                 c && c(h);
                 d && rc(a.google_image_requests, f);
                 rk(f, "load", g);
                 rk(f, "error", g)
             };
             qk(f, "load", g);
             qk(f, "error", g)
         }
         e && (f.attributionSrc = "");
         f.src = b;
         a.google_image_requests.push(f)
     }

     function uk(a, b) {
         var c = c === void 0 ? !1 : c;
         var d = "https://pagead2.googlesyndication.com/pagead/gen_204?id=" + b;
         hi(a, function(e, f) {
             if (e || e === 0) d += "&" + f + "=" + encodeURIComponent(String(e))
         });
         vk(d, c)
     }

     function vk(a, b) {
         var c = window;
         b = b === void 0 ? !1 : b;
         var d = d === void 0 ? !1 : d;
         c.fetch ? (b = {
             keepalive: !0,
             credentials: "include",
             redirect: "follow",
             method: "get",
             mode: "no-cors"
         }, d && (b.mode = "cors", "setAttributionReporting" in XMLHttpRequest.prototype ? b.attributionReporting = {
             eventSourceEligible: "true",
             triggerEligible: "false"
         } : b.headers = {
             "Attribution-Reporting-Eligible": "event-source"
         }), c.fetch(a, b)) : sk(c, a, void 0, b, d)
     };

     function wk(a, b) {
         try {
             var c = function(d) {
                 var e = {};
                 return [(e[d.ag] = d.Af, e)]
             };
             return JSON.stringify([a.filter(function(d) {
                 return d.me
             }).map(c), mf(b), a.filter(function(d) {
                 return !d.me
             }).map(c)])
         } catch (d) {
             return xk(d, b), ""
         }
     }

     function xk(a, b) {
         try {
             uk({
                 m: gi(a instanceof Error ? a : Error(String(a))),
                 b: G(b, 1) || null,
                 v: pg(b, 2) || null
             }, "rcs_internal")
         } catch (c) {}
     }
     var yk = function(a, b, c) {
             this.B = c;
             c = new di;
             a = H(c, 1, a);
             this.l = Vf(a, 2, Me(b), "")
         },
         zk = function(a) {
             if (a.B) {
                 var b = a.l,
                     c = [],
                     d = c.concat,
                     e = Set,
                     f = [],
                     g = f.concat;
                 var h = rg(a.l, 3);
                 c = d.call(c, ua(new e(g.call(f, ua(h), ua(a.B())))));
                 Uf(b, 3, c, ye)
             }
             a = a.l;
             b = a.D;
             c = b[B] | 0;
             return Fd(a, c) ? a : Af(a, b, c) ? zf(a, b) : new a.constructor(yf(b, c, !0))
         };
     var Ak = function(a) {
         this.D = C(a)
     };
     r(Ak, I);
     var Bk = [1, 2, 3];
     var Ck = function(a) {
         this.D = C(a)
     };
     r(Ck, I);
     var Dk = [2, 4];
     var Ek = function(a) {
         this.D = C(a)
     };
     r(Ek, I);
     var Fk = function(a) {
         this.D = C(a)
     };
     r(Fk, I);
     var Gk = function(a) {
         this.D = C(a)
     };
     r(Gk, I);
     var Hk = function(a, b) {
             return H(a, 1, b)
         },
         Ik = function(a, b) {
             return H(a, 2, b)
         };
     var Jk = function(a) {
         this.D = C(a)
     };
     r(Jk, I);
     var Kk = [1, 2];
     var Lk = function(a) {
         this.D = C(a)
     };
     r(Lk, I);
     var Mk = function(a, b) {
             return F(a, 1, b)
         },
         Nk = function(a, b) {
             return fg(a, 2, b)
         },
         Ok = function(a, b) {
             return Uf(a, 4, b, ye)
         },
         Pk = function(a, b) {
             return fg(a, 5, b)
         },
         Qk = function(a, b) {
             return H(a, 6, b)
         };
     var Rk = function(a) {
         this.D = C(a)
     };
     r(Rk, I);
     var Sk = [1, 2, 3, 4, 6];
     var Tk = function(a) {
         this.D = C(a)
     };
     r(Tk, I);
     var Uk = function(a) {
         this.D = C(a)
     };
     r(Uk, I);
     var Vk = [2, 3, 4];
     var Wk = function(a) {
         this.D = C(a)
     };
     r(Wk, I);
     var Xk = [3, 4, 5],
         Yk = [6, 7];
     var Zk = function(a) {
         this.D = C(a)
     };
     r(Zk, I);
     var $k = [4, 5];
     var al = function(a) {
         this.D = C(a)
     };
     r(al, I);
     al.prototype.getTagSessionCorrelator = function() {
         return ng(this, 2)
     };
     var cl = function(a) {
             var b = new al;
             return eg(b, 4, bl, a)
         },
         bl = [4, 5, 7, 8, 9];
     var dl = function(a) {
         this.D = C(a)
     };
     r(dl, I);
     var el = function(a) {
         this.D = C(a)
     };
     r(el, I);
     var fl = function(a) {
         this.D = C(a)
     };
     r(fl, I);
     var gl = function(a) {
         this.D = C(a)
     };
     r(gl, I);
     gl.prototype.zb = function() {
         return E(this, el, 1)
     };
     gl.prototype.getSize = function() {
         return E(this, fl, 2)
     };
     gl.prototype.getDuration = function() {
         return E(this, dl, 3)
     };
     var hl = function(a) {
         this.D = C(a)
     };
     r(hl, I);
     var il = function(a) {
         this.D = C(a)
     };
     r(il, I);
     var jl = function(a) {
             var b = new il;
             return yg(b, 1, a)
         },
         kl = function(a, b) {
             return yg(a, 2, b)
         };
     var ll = function(a) {
         this.D = C(a)
     };
     r(ll, I);
     var ml = function(a) {
         this.D = C(a)
     };
     r(ml, I);
     var nl = function(a) {
         this.D = C(a)
     };
     r(nl, I);
     var ol = function(a) {
         this.D = C(a)
     };
     r(ol, I);
     ol.prototype.getEscapedQemQueryId = function() {
         return pg(this, 4)
     };
     var pl = function(a) {
         this.D = C(a)
     };
     r(pl, I);
     var ql = function(a) {
         this.D = C(a)
     };
     r(ql, I);
     ql.prototype.getEscapedQemQueryId = function() {
         return pg(this, 2)
     };
     var rl = function(a) {
         return ag(a, pl, 5)
     };
     var tl = function(a) {
             this.g = a;
             this.pi = new sl(this.g)
         },
         sl = function(a) {
             this.g = a;
             this.wi = new ul(this.g)
         },
         ul = function(a) {
             this.g = a;
             this.runAdAuction = new vl;
             this.Rg = new wl(this.g)
         },
         wl = function(a) {
             this.g = a
         },
         xl = function(a, b) {
             a = a.g;
             var c = a.K;
             var d = new Ek;
             d = Vf(d, 1, Me("SOomke"), "");
             var e = new Ak;
             e = Yf(e, 1, Bk, Me(b.Sd));
             d = ig(d, 4, Ak, e);
             e = new Ak;
             e = Yf(e, 1, Bk, Me(b.status));
             d = ig(d, 4, Ak, e);
             e = new Ck;
             b = Yf(e, 2, Dk, He(Math.round(b.Pe)));
             b = F(d, 3, b);
             c.call(a, b)
         },
         vl = function() {
             this.duration = new yl
         },
         yl = function() {},
         zl = function() {
             yk.apply(this,
                 arguments);
             this.Lh = new tl(this)
         };
     r(zl, yk);
     var Al = function() {
         zl.apply(this, arguments)
     };
     r(Al, zl);
     Al.prototype.Gd = function() {
         this.C.apply(this, ua(Ra.apply(0, arguments).map(function(a) {
             return {
                 me: !0,
                 ag: 4,
                 Af: mf(a)
             }
         })))
     };
     Al.prototype.K = function() {
         this.C.apply(this, ua(Ra.apply(0, arguments).map(function(a) {
             return {
                 me: !1,
                 ag: 1,
                 Af: mf(a)
             }
         })))
     };

     function Bl(a, b) {
         if (globalThis.fetch) globalThis.fetch(a, {
             method: "POST",
             body: b,
             keepalive: b.length < 65536,
             credentials: "omit",
             mode: "no-cors",
             redirect: "follow"
         }).catch(function() {});
         else {
             var c = new XMLHttpRequest;
             c.open("POST", a, !0);
             c.send(b)
         }
     };
     var Cl = function(a, b, c, d, e, f, g, h, k) {
         Al.call(this, a, b, k);
         this.G = c;
         this.F = d;
         this.H = e;
         this.I = f;
         this.L = g;
         this.o = h;
         this.g = [];
         this.j = null;
         this.A = !1
     };
     r(Cl, Al);
     var Dl = function(a) {
         a.j !== null && (clearTimeout(a.j), a.j = null);
         if (a.g.length) {
             var b = wk(a.g, zk(a));
             a.F(a.G + "?e=1", b);
             a.g = []
         }
     };
     Cl.prototype.C = function() {
         var a = Ra.apply(0, arguments),
             b = this;
         try {
             this.L && wk(this.g.concat(a), zk(this)).length >= 65536 && Dl(this), this.o && !this.A && (this.A = !0, this.o.g(function() {
                 Dl(b)
             })), this.g.push.apply(this.g, ua(a)), this.g.length >= this.I && Dl(this), this.g.length && this.j === null && (this.j = setTimeout(function() {
                 Dl(b)
             }, this.H))
         } catch (c) {
             xk(c, zk(this))
         }
     };
     var El = function(a, b, c, d, e, f, g) {
         Cl.call(this, a, b, "https://pagead2.googlesyndication.com/pagead/ping", Bl, c === void 0 ? 1E3 : c, d === void 0 ? 100 : d, (e === void 0 ? !1 : e) && !!globalThis.fetch, f, g)
     };
     r(El, Cl);

     function cm(a) {
         a = a === void 0 ? x : a;
         var b = a.context || a.AMP_CONTEXT_DATA;
         if (!b) try {
             b = a.parent.context || a.parent.AMP_CONTEXT_DATA
         } catch (e) {}
         var c, d;
         return ((c = b) == null ? 0 : c.pageViewId) && ((d = b) == null ? 0 : d.canonicalUrl) ? b : null
     };
     var dm = function() {
             this.S = {}
         },
         em = function() {
             var a = cm(window);
             if (a) {
                 if (a) {
                     var b = a.pageViewId;
                     a = a.clientId;
                     typeof a === "string" && (b += a.replace(/\D/g, "").substring(0, 6))
                 } else b = null;
                 return +b
             }
             b = ji(window);
             a = b.google_global_correlator;
             a || (b.google_global_correlator = a = 1 + Math.floor(Math.random() * 8796093022208));
             return a
         },
         gm = function(a, b) {
             var c = fm[7] || "google_ps_7";
             a = a.S;
             var d = a[c];
             return d === void 0 ? (a[c] = b(), a[c]) : d
         },
         hm = function(a) {
             var b = em();
             return gm(a, function() {
                 return b
             })
         },
         jm = function() {
             if (im) var a = im;
             else {
                 a = ((a = a === void 0 ? cm() : a) ? ii(a.master) ? a.master : null : null) || window;
                 var b = a.google_persistent_state_async;
                 a = b != null && typeof b == "object" && b.S != null && typeof b.S == "object" ? im = b : a.google_persistent_state_async = im = new dm
             }
             return hm(a)
         },
         im = null,
         km = {},
         fm = (km[8] = "google_prev_ad_formats_by_region", km[9] = "google_prev_ad_slotnames_by_region", km);

     function lm(a) {
         if (a != null) return mm(a)
     }

     function nm(a) {
         return a == null ? null : mm(a)
     }

     function mm(a) {
         return Zd(a) ? Number(a) : String(a)
     };
     var om = wa(["https://pagead2.googlesyndication.com/pagead/js/err_rep.js"]),
         pm = function() {
             var a = a === void 0 ? "jserror" : a;
             var b = b === void 0 ? .01 : b;
             var c = c === void 0 ? ij(om) : c;
             this.j = a;
             this.l = b;
             this.o = c;
             this.g = !1
         };
     pm.prototype.Ne = function(a) {
         this.g = a
     };
     pm.prototype.lb = function(a, b, c, d) {
         c = c === void 0 ? this.l : c;
         d = d === void 0 ? this.j : d;
         if (Math.random() > c) return this.g;
         fi(b) || (b = new ei(b, {
             context: a,
             id: d
         }));
         x.google_js_errors = x.google_js_errors || [];
         x.google_js_errors.push(b);
         x.error_rep_loaded || (b = x.document, a = mj("SCRIPT", b), Ni(a, this.o), (b = b.getElementsByTagName("script")[0]) && b.parentNode && b.parentNode.insertBefore(a, b), x.error_rep_loaded = !0);
         return this.g
     };
     pm.prototype.Qb = function(a, b) {
         try {
             return b()
         } catch (c) {
             if (!this.lb(a, c, this.l, this.j)) throw c;
         }
     };
     pm.prototype.Be = function(a, b, c) {
         var d = this;
         return function() {
             var e = Ra.apply(0, arguments);
             return d.Qb(a, function() {
                 return b.apply(c, e)
             })
         }
     };

     function qm(a) {
         if (a.prerendering) return 3;
         var b;
         return (b = {
             visible: 1,
             hidden: 2,
             prerender: 3,
             preview: 4,
             unloaded: 5,
             "": 0
         } [a.visibilityState || a.webkitVisibilityState || a.mozVisibilityState || ""]) != null ? b : 0
     }

     function rm(a) {
         var b;
         a.visibilityState ? b = "visibilitychange" : a.mozVisibilityState ? b = "mozvisibilitychange" : a.webkitVisibilityState && (b = "webkitvisibilitychange");
         return b
     };
     var sm = null,
         tm = function() {
             var a = a === void 0 ? window : a;
             if (sm === null) {
                 sm = "";
                 try {
                     var b = "";
                     try {
                         b = a.top.location.hash
                     } catch (d) {
                         b = a.location.hash
                     }
                     if (b) {
                         var c = b.match(/\bdeid=([\d,]+)/);
                         sm = c ? c[1] : ""
                     }
                 } catch (d) {}
             }
             return sm
         };

     function um() {
         var a = a === void 0 ? x : a;
         return (a = a.performance) && a.now && a.timing ? Math.floor(a.now() + a.timing.navigationStart) : pb()
     }

     function vm() {
         var a = a === void 0 ? x : a;
         return (a = a.performance) && a.now ? a.now() : null
     }

     function wm(a, b) {
         b = b === void 0 ? x : b;
         var c, d;
         return ((c = b.performance) == null ? void 0 : (d = c.timing) == null ? void 0 : d[a]) || 0
     }

     function xm() {
         var a = a === void 0 ? x : a;
         var b = Math.min(wm("domLoading", a) || Infinity, wm("domInteractive", a) || Infinity);
         return b === Infinity ? Math.max(wm("responseEnd", a), wm("navigationStart", a)) : b
     };
     var ym = function(a, b, c, d) {
         this.label = a;
         this.type = b;
         this.value = c;
         this.duration = d === void 0 ? 0 : d;
         this.taskId = this.slotId = void 0;
         this.uniqueId = Math.random()
     };
     var zm = x.performance,
         Am = !!(zm && zm.mark && zm.measure && zm.clearMarks),
         Bm = li(function() {
             var a;
             if (a = Am) a = tm(), a = !!a.indexOf && a.indexOf("1337") >= 0;
             return a
         }),
         Cm = function(a, b) {
             this.events = [];
             this.g = b || x;
             var c = null;
             b && (b.google_js_reporting_queue = b.google_js_reporting_queue || [], this.events = b.google_js_reporting_queue, c = b.google_measure_js_timing);
             this.l = Bm() || (c != null ? c : Math.random() < a)
         };
     Cm.prototype.A = function() {
         this.l = !1;
         this.events !== this.g.google_js_reporting_queue && (Bm() && ec(this.events, Dm), this.events.length = 0)
     };
     Cm.prototype.I = function(a) {
         !this.l || this.events.length > 2048 || this.events.push(a)
     };
     var Dm = function(a) {
         a && zm && Bm() && (zm.clearMarks("goog_" + a.label + "_" + a.uniqueId + "_start"), zm.clearMarks("goog_" + a.label + "_" + a.uniqueId + "_end"))
     };
     Cm.prototype.start = function(a, b) {
         if (!this.l) return null;
         a = new ym(a, b, vm() || um());
         b = "goog_" + a.label + "_" + a.uniqueId + "_start";
         zm && Bm() && zm.mark(b);
         return a
     };
     Cm.prototype.end = function(a) {
         if (this.l && typeof a.value === "number") {
             a.duration = (vm() || um()) - a.value;
             var b = "goog_" + a.label + "_" + a.uniqueId + "_end";
             zm && Bm() && zm.mark(b);
             this.I(a)
         }
     };

     function Em(a) {
         a = a._google_rum_ns_ = a._google_rum_ns_ || {};
         return a.pq = a.pq || []
     };

     function Fm(a, b, c) {
         hi(b, function(d, e) {
             var f = c && c[e];
             !d && d !== 0 || f || (a += "&" + encodeURIComponent(e) + "=" + encodeURIComponent(String(d)), c && (c[e] = !0))
         });
         return a
     }
     var Km = function(a, b, c, d, e, f, g, h) {
         f = f === void 0 ? Infinity : f;
         g = g === void 0 ? !1 : g;
         Cm.call(this, a, h);
         var k = this;
         this.Z = b;
         this.domain = c;
         this.path = d;
         this.da = e;
         this.L = 0;
         this.C = {};
         this.H = {};
         this.ca = [];
         this.report = {};
         this.j = 0;
         this.G = [];
         this.M = f;
         a = this.g.navigator;
         this.V = !(this.domain !== "csi.gstatic.com" || !a || !a.sendBeacon);
         this.g.performance && this.g.performance.now || Gm(this, "dat", 1);
         a && a.deviceMemory && Gm(this, "dmc", a.deviceMemory);
         this.g === this.g.top && Gm(this, "top", 1);
         this.K = !g;
         this.P = function() {
             k.g.setTimeout(function() {
                     k.o()
                 },
                 1100)
         };
         this.U = function() {
             for (var n = w(k.ca), p = n.next(); !p.done; p = n.next()) {
                 p = p.value;
                 try {
                     p()
                 } catch (v) {}
             }
             n = k.g;
             var q = q === void 0 ? {} : q;
             typeof window.CustomEvent === "function" ? p = new CustomEvent("rum_blp", q) : (p = document.createEvent("CustomEvent"), p.initCustomEvent("rum_blp", !!q.bubbles, !!q.cancelable, q.detail));
             n.dispatchEvent(p);
             k.o()
         };
         this.fa = ni(function() {
             k.o()
         });
         this.ga = function() {
             var n = k.g.document;
             (n.hidden != null ? n.hidden : n.mozHidden != null ? n.mozHidden : n.webkitHidden != null && n.webkitHidden) && k.fa()
         };
         this.F = this.g.setTimeout(function() {
             k.o()
         }, 5E3);
         this.B = b.length + c.length + d.length + e.length + 3;
         ec(this.events, function(n) {
             Hm(k, n)
         });
         b = Em(this.g);
         var l = function() {
             var n = Ra.apply(0, arguments)[0],
                 p = n[0];
             n = n[1];
             var q = p.length + n.length + 2;
             k.B + k.j + q > 8E3 && k.o();
             k.G.push([p, n]);
             k.j += q;
             Im(k);
             return 0
         };
         ec(b, function(n) {
             return l(n)
         });
         b.length = 0;
         b.push = l;
         Gm(this, "puid", (this.L + 1).toString(36) + "~" + pb().toString(36));
         Jm(this)
     };
     r(Km, Cm);
     var Jm = function(a) {
             a.g.document.readyState === "complete" ? a.g.setTimeout(function() {
                 a.o()
             }, 0) : qk(a.g, "load", a.P);
             var b = rm(a.g.document);
             typeof b !== "undefined" && qk(a.g, b, a.ga);
             qk(a.g, "pagehide", a.U)
         },
         Gm = function(a, b, c) {
             c = String(c);
             a.B = a.C[b] != null ? a.B + (c.length - a.C[b].length) : a.B + (b.length + c.length + 2);
             a.C[b] = c
         },
         Nm = function(a, b, c, d, e) {
             e = e === void 0 ? "" : e;
             var f = Lm(a, b, c, d, e);
             a.B + a.j + f > 8E3 && (a.o(), f = b.length + c.length + 2);
             Mm(a, b, c, d, e);
             a.j += f;
             Im(a)
         },
         Lm = function(a, b, c, d, e) {
             return a.report[b] == null ? b.length +
                 c.length + 2 : d ? c.length + (e === void 0 ? "" : e).length : c.length - a.report[b].length
         },
         Mm = function(a, b, c, d, e) {
             a.report[b] = d && a.report[b] != null ? a.report[b] + ("" + (e === void 0 ? "" : e) + c) : c
         },
         Im = function(a) {
             a.B + a.j >= 6E3 && a.o()
         };
     Km.prototype.o = function() {
         if (this.l && this.K) {
             try {
                 this.j && (this.sendBeacon(this.report), this.L === this.M && this.A())
             } catch (a) {
                 (new pm).lb(358, a)
             }
             this.report = {};
             this.j = 0;
             this.events.length = 0;
             this.g.clearTimeout(this.F);
             this.F = 0
         }
     };
     var Om = function(a, b) {
         var c = a.Z + "//" + a.domain + a.path + a.da,
             d = {};
         c = Fm(c, a.C, d);
         c = Fm(c, b, d);
         b = a.g;
         b.google_timing_params && (c = Fm(c, b.google_timing_params, d), b.google_timing_params = void 0);
         ec(a.G, function(e) {
             var f = w(e);
             e = f.next().value;
             f = f.next().value;
             var g = {};
             c = Fm(c, (g[e] = f, g))
         });
         a.G.length = 0;
         return c
     };
     Km.prototype.sendBeacon = function(a) {
         this.L++;
         a = Om(this, a);
         var b = !1;
         try {
             b = !!(this.V && this.g.navigator && this.g.navigator.sendBeacon(a, null))
         } catch (c) {
             this.V = !1
         }
         b || sk(this.g, a);
         Gm(this, "puid", (this.L + 1).toString(36) + "~" + pb().toString(36))
     };
     var Hm = function(a, b) {
         var c = "met." + b.type,
             d = typeof b.value === "number" ? Math.round(b.value).toString(36) : b.value,
             e = Math.round(b.duration);
         b = "" + b.label + (b.slotId != null ? "_" + b.slotId : "") + ("." + d) + (e > 0 ? "_" + e.toString(36) : "") + (b.taskId != null ? "__" + Math.round(b.taskId).toString(36) : "");
         Nm(a, c, b, !0, "~")
     };
     Km.prototype.I = function(a) {
         this.l && this.L < this.M && (Cm.prototype.I.call(this, a), Hm(this, a))
     };
     Km.prototype.A = function() {
         Cm.prototype.A.call(this);
         this.g.clearTimeout(this.F);
         this.j = this.F = 0;
         this.report = {};
         Dj(this.H);
         Dj(this.C);
         rk(this.g, "load", this.P);
         rk(this.g, "pagehide", this.U)
     };
     var K = function(a) {
         var b = "Ob";
         if (a.Ob && a.hasOwnProperty(b)) return a.Ob;
         b = new a;
         return a.Ob = b
     };
     var L = function() {
         this.g = new Km(1, "https:", "csi.gstatic.com", "/csi?v=2&s=", "ima", void 0, !0);
         var a = jm();
         a != null && Gm(this.g, "c", a);
         a = Math.floor(Number(this.g.C.c) / 2);
         a != null && Gm(this.g, "slotId", a)
     };
     L.prototype.o = function() {
         var a = this.g;
         a.K = !0;
         a.o()
     };
     var M = function(a, b, c) {
             if (c != null) {
                 a = a.g;
                 var d = b + "=" + c;
                 a.H[d] || (Nm(a, b, c, !1), d.length < 1E3 && (a.H[d] = !0))
             }
         },
         Pm = function(a, b) {
             for (var c in b) b[c] = typeof b[c] === "object" ? encodeURIComponent(JSON.stringify(b[c])) : encodeURIComponent(String(b[c]));
             a = a.g;
             var d = !1;
             c = 0;
             for (var e = w(Object.keys(b)), f = e.next(); !f.done; f = e.next()) f = f.value, a.report[f] != null && (d = !0), c += Lm(a, f, b[f], !1);
             (a.B + a.j + c > 8E3 || d) && a.o();
             d = w(Object.keys(b));
             for (e = d.next(); !e.done; e = d.next()) e = e.value, Mm(a, e, b[e], !1);
             a.j += c;
             Im(a)
         },
         Qm = function(a) {
             var b =
                 L.getInstance().g;
             b.l && b.I(new ym(a, 4, um() - 0, 0))
         };
     L.prototype.recordClick = function(a, b, c, d) {
         for (var e = !1, f = "notag"; d != null && d !== document.documentElement;) {
             var g = void 0,
                 h = void 0;
             if (((g = d) == null ? 0 : g.getAttribute("data-ck-navigates")) || ((h = d) == null ? 0 : h.getAttribute("data-ck-tag"))) {
                 g = f = void 0;
                 e = (g = (f = d) == null ? void 0 : f.getAttribute("data-ck-navigates")) != null ? g : !1;
                 h = g = void 0;
                 f = (h = (g = d) == null ? void 0 : g.getAttribute("data-ck-tag")) != null ? h : "notag";
                 break
             }
             g = void 0;
             d = (g = d.parentElement) != null ? g : void 0
         }
         d = this.g;
         d.l && d.I(new ym(a + "_" + b + "x" + c + "|" + e + "|" + f, 4, um(),
             0))
     };
     L.getInstance = function() {
         return K(L)
     };
     var Rm = function(a) {
             return /^\s*$/.test(a) ? !1 : /^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/(?:"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)[\s\u2028\u2029]*(?=:|,|]|}|$)/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""))
         },
         Sm = function(a) {
             try {
                 return x.JSON.parse(a)
             } catch (b) {}
             a = String(a);
             if (Rm(a)) try {
                 return eval("(" + a + ")")
             } catch (b) {}
             throw Error("Invalid JSON string: " + a);
         },
         Um = function() {
             this.g = Tm
         };
     Um.prototype.ba = function(a) {
         var b = [];
         Vm(this, a, b);
         return b.join("")
     };
     var Vm = function(a, b, c) {
             if (b == null) c.push("null");
             else {
                 if (typeof b == "object") {
                     if (Array.isArray(b)) {
                         var d = b;
                         b = d.length;
                         c.push("[");
                         for (var e = "", f = 0; f < b; f++) c.push(e), e = d[f], Vm(a, a.g ? a.g.call(d, String(f), e) : e, c), e = ",";
                         c.push("]");
                         return
                     }
                     if (b instanceof String || b instanceof Number || b instanceof Boolean) b = b.valueOf();
                     else {
                         c.push("{");
                         f = "";
                         for (d in b) Object.prototype.hasOwnProperty.call(b, d) && (e = b[d], typeof e != "function" && (c.push(f), Wm(d, c), c.push(":"), Vm(a, a.g ? a.g.call(b, d, e) : e, c), f = ","));
                         c.push("}");
                         return
                     }
                 }
                 switch (typeof b) {
                     case "string":
                         Wm(b, c);
                         break;
                     case "number":
                         c.push(isFinite(b) && !isNaN(b) ? String(b) : "null");
                         break;
                     case "boolean":
                         c.push(String(b));
                         break;
                     case "function":
                         c.push("null");
                         break;
                     default:
                         throw Error("Unknown type: " + typeof b);
                 }
             }
         },
         Xm = {
             '"': '\\"',
             "\\": "\\\\",
             "/": "\\/",
             "\b": "\\b",
             "\f": "\\f",
             "\n": "\\n",
             "\r": "\\r",
             "\t": "\\t",
             "\v": "\\u000b"
         },
         Ym = /\uffff/.test("\uffff") ? /[\\"\x00-\x1f\x7f-\uffff]/g : /[\\"\x00-\x1f\x7f-\xff]/g,
         Wm = function(a, b) {
             b.push('"', a.replace(Ym, function(c) {
                 var d = Xm[c];
                 d || (d = "\\u" + (c.charCodeAt(0) | 65536).toString(16).slice(1), Xm[c] = d);
                 return d
             }), '"')
         };
     var Zm = function() {
             this.l = null;
             this.g = "missing-id";
             this.j = !1
         },
         an = function(a) {
             var b = null;
             try {
                 b = document.getElementsByClassName("lima-exp-data")
             } catch (c) {
                 return $m("missing-element", a.g), null
             }
             if (b.length > 1) return $m("multiple-elements", a.g), null;
             b = b[0];
             return b ? b.innerHTML : ($m("missing-element", a.g), null)
         },
         cn = function() {
             var a = bn,
                 b = an(a);
             if (b !== null)
                 if (Rm(b)) {
                     var c = JSON.parse(b);
                     b = c.experimentIds;
                     var d = c.binaryIdentifier;
                     c = c.adEventId;
                     var e = typeof d === "string";
                     if (typeof c == "string") {
                         var f = L.getInstance();
                         c != null && Gm(f.g, "qqid", c)
                     }
                     e && (a.g = d);
                     typeof b !== "string" ? $m("missing-flags", a.g) : (e || $m("missing-binary-id", a.g), a.l = b)
                 } else $m("invalid-json", a.g)
         };
     Zm.prototype.reset = function() {
         this.l = null;
         this.g = "missing-id"
     };

     function dn(a, b) {
         var c = cg(a, Wk, 2, Mf());
         if (!c.length) return en(a, b);
         a = G(a, 1);
         if (a === 1) {
             var d = dn(c[0], b);
             return d.success ? {
                 success: !0,
                 value: !d.value
             } : d
         }
         c = ic(c, function(h) {
             return dn(h, b)
         });
         switch (a) {
             case 2:
                 var e;
                 return (e = (d = c.find(function(h) {
                     return h.success && !h.value
                 })) != null ? d : c.find(function(h) {
                     return !h.success
                 })) != null ? e : {
                     success: !0,
                     value: !0
                 };
             case 3:
                 var f, g;
                 return (g = (f = c.find(function(h) {
                     return h.success && h.value
                 })) != null ? f : c.find(function(h) {
                     return !h.success
                 })) != null ? g : {
                     success: !0,
                     value: !1
                 };
             default:
                 return {
                     success: !1,
                         Na: 3
                 }
         }
     }

     function en(a, b) {
         var c = Zf(a, Xk);
         a: {
             switch (c) {
                 case 3:
                     var d = sg(a, 3, Xk);
                     break a;
                 case 4:
                     d = sg(a, 4, Xk);
                     break a;
                 case 5:
                     d = sg(a, 5, Xk);
                     break a
             }
             d = void 0
         }
         if (!d) return {
             success: !1,
             Na: 2
         };
         b = (b = b[c]) && b[d];
         if (!b) return {
             success: !1,
             hc: d,
             Lc: c,
             Na: 1
         };
         try {
             var e = b.apply;
             var f = Nf(a, 8, Ne, Mf());
             var g = e.call(b, null, ua(f))
         } catch (h) {
             return {
                 success: !1,
                 hc: d,
                 Lc: c,
                 Na: 2
             }
         }
         e = G(a, 1);
         if (e === 4) return {
             success: !0,
             value: !!g
         };
         if (e === 5) return {
             success: !0,
             value: g != null
         };
         if (e === 12) a = pg(a, $f(a, Yk, 7));
         else a: {
             switch (c) {
                 case 4:
                     a = og(a, $f(a, Yk, 6));
                     break a;
                 case 5:
                     a = pg(a, $f(a, Yk, 7));
                     break a
             }
             a = void 0
         }
         if (a == null) return {
             success: !1,
             hc: d,
             Lc: c,
             Na: 3
         };
         if (e === 6) return {
             success: !0,
             value: g === a
         };
         if (e === 9) return {
             success: !0,
             value: g != null && Ob(String(g), a) === 0
         };
         if (g == null) return {
             success: !1,
             hc: d,
             Lc: c,
             Na: 4
         };
         switch (e) {
             case 7:
                 c = g < a;
                 break;
             case 8:
                 c = g > a;
                 break;
             case 12:
                 c = Nd(a) && Nd(g) && (new RegExp(a)).test(g);
                 break;
             case 10:
                 c = g != null && Ob(String(g), a) === -1;
                 break;
             case 11:
                 c = g != null && Ob(String(g), a) === 1;
                 break;
             default:
                 return {
                     success: !1, Na: 3
                 }
         }
         return {
             success: !0,
             value: c
         }
     }

     function fn(a, b) {
         return a ? b ? dn(a, b) : {
             success: !1,
             Na: 1
         } : {
             success: !0,
             value: !0
         }
     };
     var gn = function(a) {
         this.D = C(a)
     };
     r(gn, I);
     var hn = function(a) {
         return Nf(a, 4, Ne, Mf())
     };
     var jn = function(a) {
         this.D = C(a)
     };
     r(jn, I);
     jn.prototype.getValue = function() {
         return E(this, gn, 2)
     };
     var kn = function(a) {
         this.D = C(a)
     };
     r(kn, I);
     var ln = function(a) {
             Cf(a);
             a = a.D;
             var b = a[B] | 0,
                 c = Gf(a, 4),
                 d = void 0 === Jd,
                 e = Oe(c, gn, !d, b);
             !d || e ? (e = df(e), c !== e && (b = If(a, b, 4, e), Df(a, b)), a = e) : a = void 0;
             return a
         },
         mn = Sh(kn),
         nn = [1, 2, 3, 6, 7, 8];
     var on = function(a, b, c) {
             var d = d === void 0 ? new El(6, "unknown", b) : d;
             this.B = a;
             this.o = c;
             this.j = d;
             this.g = [];
             this.l = a > 0 && dj() < 1 / a
         },
         qn = function(a, b, c, d, e, f) {
             if (a.l) {
                 var g = Ik(Hk(new Gk, b), c);
                 b = Qk(Nk(Mk(Pk(Ok(new Lk, d), e), g), a.g.slice()), f);
                 b = cl(b);
                 a.j.Gd(pn(a, b));
                 if (f === 1 || f === 3 || f === 4 && !a.g.some(function(h) {
                         return G(h, 1) === G(g, 1) && G(h, 2) === c
                     })) a.g.push(g), a.g.length > 100 && a.g.shift()
             }
         },
         rn = function(a, b, c, d) {
             if (a.l) {
                 var e = new Fk;
                 b = wg(e, 1, b);
                 c = wg(b, 2, c);
                 d = Ag(c, 3, d);
                 c = new al;
                 d = eg(c, 8, bl, d);
                 a.j.Gd(pn(a, d))
             }
         },
         sn =
         function(a, b, c, d, e) {
             if (a.l) {
                 var f = new Zk;
                 b = F(f, 1, b);
                 c = Ag(b, 2, c);
                 d = wg(c, 3, d);
                 if (e.Lc === void 0) Bg(d, 4, $k, e.Na);
                 else switch (e.Lc) {
                     case 3:
                         c = new Uk;
                         c = Bg(c, 2, Vk, e.hc);
                         e = Ag(c, 1, e.Na);
                         eg(d, 5, $k, e);
                         break;
                     case 4:
                         c = new Uk;
                         c = Bg(c, 3, Vk, e.hc);
                         e = Ag(c, 1, e.Na);
                         eg(d, 5, $k, e);
                         break;
                     case 5:
                         c = new Uk, c = Bg(c, 4, Vk, e.hc), e = Ag(c, 1, e.Na), eg(d, 5, $k, e)
                 }
                 e = new al;
                 e = eg(e, 9, bl, d);
                 a.j.Gd(pn(a, e))
             }
         },
         pn = function(a, b) {
             var c = Date.now();
             c = Number.isFinite(c) ? Math.round(c) : 0;
             b = yg(b, 1, c);
             c = lj();
             b = yg(b, 2, c);
             return yg(b, 6, a.B)
         };
     var tn = function() {
         var a = {};
         this.Ra = (a[3] = {}, a[4] = {}, a[5] = {}, a)
     };
     var un = /^true$/.test("false");

     function vn(a, b) {
         switch (b) {
             case 1:
                 return sg(a, 1, nn);
             case 2:
                 return sg(a, 2, nn);
             case 3:
                 return sg(a, 3, nn);
             case 6:
                 return sg(a, 6, nn);
             case 8:
                 return sg(a, 8, nn);
             default:
                 return null
         }
     }

     function wn(a, b) {
         if (!a) return null;
         switch (b) {
             case 1:
                 return kg(a, 1);
             case 7:
                 return pg(a, 3);
             case 2:
                 return og(a, 2);
             case 3:
                 return pg(a, 3);
             case 6:
                 return hn(a);
             case 8:
                 return hn(a);
             default:
                 return null
         }
     }
     var xn = li(function() {
         if (!un) return {};
         try {
             var a = a === void 0 ? window : a;
             try {
                 var b = a.sessionStorage.getItem("GGDFSSK")
             } catch (c) {
                 b = null
             }
             if (b) return JSON.parse(b)
         } catch (c) {}
         return {}
     });

     function yn(a, b, c, d) {
         var e = d = d === void 0 ? 0 : d,
             f, g;
         K(zn).l[e] = (g = (f = K(zn).l[e]) == null ? void 0 : f.add(b)) != null ? g : (new Set).add(b);
         e = xn();
         if (e[b] != null) return e[b];
         b = An(d)[b];
         if (!b) return c;
         b = mn(JSON.stringify(b));
         b = Bn(b);
         a = wn(b, a);
         return a != null ? a : c
     }

     function Bn(a) {
         var b = K(tn).Ra;
         if (b && Zf(a, nn) !== 8) {
             var c = oc(cg(a, jn, 5, Mf()), function(f) {
                 f = fn(E(f, Wk, 1), b);
                 return f.success && f.value
             });
             if (c) {
                 var d;
                 return (d = c.getValue()) != null ? d : null
             }
         }
         var e;
         return (e = E(a, gn, 4)) != null ? e : null
     }
     var zn = function() {
         this.j = {};
         this.o = [];
         this.l = {};
         this.g = new Map
     };

     function Cn(a, b, c) {
         return !!yn(1, a, b === void 0 ? !1 : b, c)
     }

     function Dn(a, b, c) {
         b = b === void 0 ? 0 : b;
         a = Number(yn(2, a, b, c));
         return isNaN(a) ? b : a
     }

     function En(a, b, c) {
         b = b === void 0 ? "" : b;
         a = yn(3, a, b, c);
         return typeof a === "string" ? a : b
     }

     function Fn(a, b, c) {
         b = b === void 0 ? [] : b;
         a = yn(6, a, b, c);
         return Array.isArray(a) ? a : b
     }

     function Gn(a, b, c) {
         b = b === void 0 ? [] : b;
         a = yn(8, a, b, c);
         return Array.isArray(a) ? a : b
     }

     function An(a) {
         return K(zn).j[a] || (K(zn).j[a] = {})
     }

     function Hn(a, b) {
         var c = An(b);
         hi(a, function(d, e) {
             if (c[e]) {
                 d = mn(JSON.stringify(d));
                 var f = $f(d, nn, 8);
                 if (xe(Hf(d, f)) != null) {
                     var g = mn(JSON.stringify(c[e]));
                     f = ln(d);
                     g = hn(ag(g, gn, 4));
                     gg(f, 4, Le, g, Ne)
                 }
                 c[e] = mf(d)
             } else c[e] = d
         })
     }

     function In(a, b, c, d, e) {
         e = e === void 0 ? !1 : e;
         var f = [],
             g = [];
         b = w(b);
         for (var h = b.next(); !h.done; h = b.next()) {
             h = h.value;
             for (var k = An(h), l = w(a), n = l.next(); !n.done; n = l.next()) {
                 n = n.value;
                 var p = Zf(n, nn),
                     q = vn(n, p);
                 if (q) {
                     var v = void 0,
                         u = void 0,
                         t = void 0;
                     var y = (v = (t = K(zn).g.get(h)) == null ? void 0 : (u = t.get(q)) == null ? void 0 : u.slice(0)) != null ? v : [];
                     a: {
                         v = q;u = p;t = new Rk;
                         switch (u) {
                             case 1:
                                 Bg(t, 1, Sk, v);
                                 break;
                             case 2:
                                 Bg(t, 2, Sk, v);
                                 break;
                             case 3:
                                 Bg(t, 3, Sk, v);
                                 break;
                             case 6:
                                 Bg(t, 4, Sk, v);
                                 break;
                             case 8:
                                 Bg(t, 6, Sk, v);
                                 break;
                             default:
                                 y = void 0;
                                 break a
                         }
                         Uf(t, 5, y, ye);y = t
                     }
                     if (v = y) u = void 0, v = !((u = K(zn).l[h]) == null || !u.has(q));
                     v && f.push(y);
                     if (p === 8 && k[q]) y = mn(JSON.stringify(k[q])), p = ln(n), y = hn(ag(y, gn, 4)), gg(p, 4, Le, y, Ne);
                     else {
                         if (p = y) v = void 0, p = !((v = K(zn).g.get(h)) == null || !v.has(q));
                         p && g.push(y)
                     }
                     e || (p = q, y = h, v = d, u = K(zn), u.g.has(y) || u.g.set(y, new Map), u.g.get(y).has(p) || u.g.get(y).set(p, []), v && u.g.get(y).get(p).push(v));
                     k[q] = mf(n)
                 }
             }
         }
         if (f.length || g.length) a = d != null ? d : void 0, c.l && c.o && (d = new Tk, f = fg(d, 2, f), g = fg(f, 3, g), a && xg(g, 1, a), f = new al, g = eg(f,
             7, bl, g), c.j.Gd(pn(c, g)))
     }

     function Jn(a, b) {
         b = An(b);
         a = w(a);
         for (var c = a.next(); !c.done; c = a.next()) {
             c = c.value;
             var d = mn(JSON.stringify(c)),
                 e = Zf(d, nn);
             (d = vn(d, e)) && (b[d] || (b[d] = c))
         }
     }

     function Kn() {
         return Object.keys(K(zn).j).map(function(a) {
             return Number(a)
         })
     }

     function Ln(a) {
         K(zn).o.includes(a) || Hn(An(4), a)
     };

     function Mn(a, b, c) {
         c.hasOwnProperty(a) || Object.defineProperty(c, String(a), {
             value: b
         })
     }

     function Nn(a, b, c) {
         return b[a] || c
     }

     function On(a) {
         Mn(5, Cn, a);
         Mn(6, Dn, a);
         Mn(7, En, a);
         Mn(8, Fn, a);
         Mn(17, Gn, a);
         Mn(13, Jn, a);
         Mn(15, Ln, a)
     }

     function Pn(a) {
         Mn(4, function(b) {
             K(tn).Ra = b
         }, a);
         Mn(9, function(b, c) {
             var d = K(tn);
             d.Ra[3][b] == null && (d.Ra[3][b] = c)
         }, a);
         Mn(10, function(b, c) {
             var d = K(tn);
             d.Ra[4][b] == null && (d.Ra[4][b] = c)
         }, a);
         Mn(11, function(b, c) {
             var d = K(tn);
             d.Ra[5][b] == null && (d.Ra[5][b] = c)
         }, a);
         Mn(14, function(b) {
             for (var c = K(tn), d = w([3, 4, 5]), e = d.next(); !e.done; e = d.next()) e = e.value, Object.assign(c.Ra[e], b[e])
         }, a)
     }

     function Qn(a) {
         a.hasOwnProperty("init-done") || Object.defineProperty(a, "init-done", {
             value: !0
         })
     };
     var Rn = function() {};
     Rn.prototype.j = function() {};
     Rn.prototype.g = function() {
         return []
     };
     var Sn = function(a, b, c) {
         a.j = function(d, e) {
             Nn(2, b, function() {
                 return []
             })(d, c, e)
         };
         a.g = function(d) {
             return Nn(3, b, function() {
                 return []
             })(d != null ? d : c)
         }
     };
     var Tn = function(a, b, c) {
             this.id = a;
             this.J = b;
             this.j = c;
             this.g = !1
         },
         Un = function(a) {
             return a.g || a.j
         },
         Vn = function() {
             this.g = []
         },
         Wn = function() {
             this.g = new Map;
             this.j = !1;
             this.o = new Vn;
             this.B = new Tn(0, 0, !1);
             this.l = [this.o]
         },
         O = function(a) {
             var b = Xn;
             if (b.j || b.g.has(a.id) || a.J == null && a.control == null || a.pk == 0) return b.B;
             var c = b.o;
             if (a.control != null)
                 for (var d = w(b.l), e = d.next(); !e.done; e = d.next()) {
                     if (e = e.value, e.g.includes(a.control)) {
                         c = e;
                         break
                     }
                 } else a.oa != null && (c = a.oa);
             d = 0;
             a.control != null ? d = a.control.J : a.J != null &&
                 (d = a.J);
             a = new Tn(a.id, d, !!a.sk);
             c.g.push(a);
             b.l.includes(c) || b.l.push(c);
             b.g.set(a.id, a);
             return a
         },
         Yn = function() {
             var a = Xn;
             a = [].concat(ua(a.g.keys())).filter(function(c) {
                 return Un(this.g.get(c))
             }, a);
             var b = K(Rn).g();
             return [].concat(ua(a), ua(b))
         },
         Zn = function(a) {
             var b = Xn;
             b.j || (a.g(b.l, b.g), b.j = !0)
         };
     Wn.prototype.reset = function() {
         for (var a = w(this.g), b = a.next(); !b.done; b = a.next()) b = w(b.value), b.next(), b.next().value.g = !1;
         this.j = !1
     };
     var Xn = new Wn,
         ao = function() {
             return $n.g.filter(function(a) {
                 return Un(a)
             }).map(function(a) {
                 return a.id
             })
         };
     var bo = function() {};
     bo.prototype.g = function(a) {
         a = w(a);
         for (var b = a.next(); !b.done; b = a.next()) {
             var c = 0,
                 d = Math.floor(Math.random() * 1E3);
             b = w(b.value.g);
             for (var e = b.next(); !e.done; e = b.next())
                 if (e = e.value, c += e.J, d < c) {
                     e.g = !0;
                     break
                 }
         }
     };
     var co = function(a) {
         this.j = a
     };
     co.prototype.g = function(a, b) {
         a = w(this.j);
         for (var c = a.next(); !c.done; c = a.next())
             if (c = b.get(c.value)) c.g = !0
     };
     var eo = function(a, b) {
         this.j = a;
         this.l = b
     };
     r(eo, co);
     eo.prototype.g = function(a, b) {
         co.prototype.g.call(this, a, b);
         var c = [];
         a = [];
         for (var d = w(this.j), e = d.next(); !e.done; e = d.next()) e = e.value, b.get(e) ? c.push(e) : a.push(e);
         b = c.map(String).join(",") || "0";
         a = a.map(String).join(",") || "0";
         M(L.getInstance(), "sei", b);
         M(L.getInstance(), "nsei", a);
         M(L.getInstance(), "bi", this.l)
     };
     var fo = function() {
         Zm.apply(this, arguments)
     };
     r(fo, Zm);
     var $m = function(a, b) {
         var c = L.getInstance();
         M(c, "eee", a);
         M(c, "bi", b)
     };
     fo.getInstance = function() {
         return K(fo)
     };

     function go() {
         return ho.split(",").map(function(a) {
             return parseInt(a, 10)
         }).filter(function(a) {
             return !isNaN(a)
         })
     };
     var $n = new Vn,
         io = new Vn,
         jo = new Vn,
         ko = new Vn,
         lo = new Vn,
         mo = new Vn,
         no = new Vn;
     O({
         id: 95342637,
         J: 0
     });
     O({
         id: 318475490,
         J: 0
     });
     O({
         id: 324123032,
         J: 0
     });
     O({
         id: 420706097,
         J: 10
     });
     O({
         id: 420706098,
         J: 10
     });
     O({
         id: 95342168,
         J: 10
     });
     O({
         id: 95342169,
         J: 10
     });
     O({
         id: 21062100,
         J: 0
     });
     O({
         id: 420706142,
         J: 0
     });
     O({
         id: 44745813,
         J: 0
     });
     O({
         id: 95355265,
         J: 0
     });
     O({
         id: 44746068,
         J: 0
     });
     O({
         id: 21064565,
         J: 0
     });
     O({
         id: 21064567,
         J: 0
     });
     O({
         id: 418572006,
         J: 10
     });
     O({
         id: 95338773,
         J: 10,
         oa: ko
     });
     O({
         id: 95338774,
         J: 10,
         oa: ko
     });
     O({
         id: 95334214,
         J: 10
     });
     O({
         id: 95334215,
         J: 10
     });
     O({
         id: 44749839,
         J: 0
     });
     O({
         id: 44714743,
         J: 0
     });
     O({
         id: 44715336,
         J: 10
     });
     O({
         id: 44724516,
         J: 0
     });
     O({
         id: 44726389,
         J: 10
     });
     O({
         id: 44752711,
         J: 50
     });
     O({
         id: 44752052,
         J: 50
     });
     O({
         id: 44752657,
         J: 50
     });
     O({
         id: 44733246,
         J: 10
     });
     O({
         id: 95371574,
         J: 10,
         oa: io
     });
     O({
         id: 95371575,
         J: 10,
         oa: io
     });
     O({
         id: 95371573,
         J: 10,
         oa: io
     });
     O({
         id: 44751889,
         J: 10
     });
     O({
         id: 44751890,
         J: 10
     });
     O({
         id: 44752995,
         J: 10
     });
     O({
         id: 44752996,
         J: 10
     });
     O({
         id: 44762627,
         J: 0
     });
     O({
         id: 44762628,
         J: 0
     });
     O({
         id: 44801479,
         J: 10,
         oa: jo
     });
     O({
         id: 44801480,
         J: 10,
         oa: jo
     });
     O({
         id: 44752538,
         J: 0
     });
     O({
         id: 44754608,
         J: 10
     });
     O({
         id: 44754609,
         J: 10
     });
     O({
         id: 44776384,
         J: 0
     });
     O({
         id: 44789282,
         J: 0
     });
     O({
         id: 95344889,
         J: 0
     });
     O({
         id: 95355192,
         J: 0
     });
     O({
         id: 95334260,
         J: 0
     });
     O({
         id: 95345698,
         J: 0
     });
     O({
         id: 95356737,
         J: 0
     });
     var oo = O({
             id: 75259416,
             J: 0
         }),
         po = O({
             id: 75259420,
             J: 0
         }),
         qo = O({
             id: 75259421,
             J: 0
         });
     O({
         id: 45401791,
         J: 0
     });
     O({
         id: 95326337,
         J: 0,
         oa: lo
     });
     O({
         id: 44809192,
         J: 10,
         oa: no
     });
     O({
         id: 44809193,
         J: 10,
         oa: no
     });
     O({
         id: 95320804,
         J: 10,
         oa: no
     });
     O({
         id: 95320805,
         J: 10,
         oa: no
     });
     O({
         id: 95322027,
         J: 1E3,
         oa: mo
     });
     var ro = O({
         id: 46130031,
         J: 0
     });
     O({
         id: 95328713,
         J: 10
     });
     O({
         id: 95328714,
         J: 10
     });
     var so = O({
         id: 95327848,
         J: 0
     });
     O({
         id: 31065644,
         J: 1
     });
     var to = O({
             id: 31065645,
             J: 1
         }),
         uo = new Vn;
     O({
         id: 95331588,
         J: 0,
         oa: uo
     });
     O({
         id: 95331589,
         J: 1E3,
         oa: uo
     });
     var vo = O({
         id: 95332182,
         J: 0
     });
     O({
         id: 95362047,
         J: 0
     });
     O({
         id: 95363795,
         J: 0
     });
     var wo = O({
         id: 789179015,
         J: 0
     });
     O({
         id: 798227501,
         J: 0
     });
     O({
         id: 95370886,
         J: 0
     });
     var xo = O({
         id: 318523523,
         J: 0
     });
     if (typeof window !== "undefined" && typeof window.initializeVirtualDom === "undefined") {
         var bn = fo.getInstance();
         bn.j || (cn(), bn.j = !0);
         var ho = bn.l,
             yo;
         bn.j || (cn(), bn.j = !0);
         yo = bn.g;
         if (ho != null) {
             var zo = new eo(go(), yo);
             Zn(zo)
         }
     };
     var Ao = function(a) {
         this.D = C(a)
     };
     r(Ao, I);
     var Bo = function(a) {
         this.D = C(a)
     };
     r(Bo, I);
     Bo.prototype.getId = function() {
         return lg(this, 1)
     };
     var Co = function(a) {
         this.D = C(a)
     };
     r(Co, I);
     var Do = function(a) {
         return cg(a, Bo, 2, Mf())
     };
     var Eo = function(a) {
         this.D = C(a)
     };
     r(Eo, I);
     var Fo = function(a) {
         this.D = C(a)
     };
     r(Fo, I);
     var Go = function(a) {
         this.D = C(a)
     };
     r(Go, I);
     var Ho = function(a) {
         this.D = C(a)
     };
     r(Ho, I);
     var Io = function(a) {
         this.D = C(a)
     };
     r(Io, I);
     var Ko = function() {
         var a = Jo();
         return E(a, Ho, 4)
     };
     var Lo = Rh(Io);
     var Mo = null;

     function Jo() {
         var a;
         return (a = Mo) != null ? a : Mo = Lo("[[[[45713128,null,null,[]],[803064088,null,null,[1]],[45681221,null,null,[1]],[null,749060184,null,[null,100]],[45722344,null,null,[]],[45706017,null,null,[]],[45668885,null,null,[]],[45685340,null,null,[]],[45734716,null,null,[]],[45663239,null,null,[]],[45715032,null,null,[1]],[45661356,null,null,[]],[45676441,null,null,[]],[45675307,null,null,[1]],[45675308,null,null,[1]],[null,45645574,null,[]],[45688859,null,null,[]],[45656766,null,null,[]],[45710689,null,null,[]],[45710688,null,null,[]],[45685601,null,null,[]],[null,45685602,null,[null,500]],[775241416,null,null,[]],[781107959,null,null,[]],[781107958,null,null,[]],[792614055,null,null,[]],[781107957,null,null,[]],[45658982,null,null,[]],[45725657,null,null,[]]],[[16,[[1,[[31089630],[31089631,[[45668885,null,null,[1]]]]]],[1000,[[95332046]]],[null,[[95332047]]],[10,[[95333808],[95333809,[[635466687,null,null,[1]]]]]],[10,[[95338769,[[null,45645574,null,[null,1]]]],[95338770,[[null,45645574,null,[null,2]]]]]],[10,[[95345206],[95345207,[[45661356,null,null,[1]]]]]],[null,[[95351425],[95351426,[[45676441,null,null,[1]]]]]],[10,[[95356068],[95356069,[[45685601,null,null,[]],[null,45685602,null,[]]]],[95356070,[[45685601,null,null,[1]],[null,45685602,null,[]]]],[95356071,[[45685601,null,null,[1]],[null,45685602,null,[null,100]]]]]],[100,[[95365753,[[45710689,null,null,[1]]]],[95365754,[[45710688,null,null,[1]]]]]],[null,[[95370402],[95370403,[[45722344,null,null,[1]]]]]],[10,[[95372277],[95372278,[[null,745150931,null,[null,1]]]]]],[1,[[95373378,[[792614055,null,null,[1]]]],[95373379,[[781107959,null,null,[1]],[792614055,null,null,[1]],[781107957,null,null,[1]]]]]],[10,[[95375243],[95375244]]],[50,[[95375505],[95375506,[[null,749060184,null,[]]]]]],[100,[[95375625],[95375626,[[45706017,null,null,[1]]]]]],[null,[[95375930],[95375931,[[45734716,null,null,[1]]]]]]]]],null,null,[null,1000,1,1000]],null,[\"\",[null,[],[],[],[]]],[0,0,0]]")
     };
     var No = ["A9AxgGSwmnfgzzkyJHILUr3H8nJ/3D+57oAsL4DBt4USlng4jZ0weq+fZtHC/Qwwn6gd4QSa5DzT3OBif+kXVA0AAAB4eyJvcmlnaW4iOiJodHRwczovL2ltYXNkay5nb29nbGVhcGlzLmNvbTo0NDMiLCJmZWF0dXJlIjoiUHJpdmFjeVNhbmRib3hBZHNBUElzIiwiZXhwaXJ5IjoxNjk1MTY3OTk5LCJpc1RoaXJkUGFydHkiOnRydWV9", "AlK2UR5SkAlj8jjdEc9p3F3xuFYlF6LYjAML3EOqw1g26eCwWPjdmecULvBH5MVPoqKYrOfPhYVL71xAXI1IBQoAAAB8eyJvcmlnaW4iOiJodHRwczovL2RvdWJsZWNsaWNrLm5ldDo0NDMiLCJmZWF0dXJlIjoiV2ViVmlld1hSZXF1ZXN0ZWRXaXRoRGVwcmVjYXRpb24iLCJleHBpcnkiOjE3NTgwNjcxOTksImlzU3ViZG9tYWluIjp0cnVlfQ=="];

     function Oo(a, b) {
         b = b === void 0 ? document : b;
         var c;
         return !((c = b.featurePolicy) == null || !c.features().includes(a))
     }

     function Po(a, b) {
         b = b === void 0 ? document : b;
         var c;
         return !((c = b.featurePolicy) == null || !c.allowedFeatures().includes(a))
     }

     function Qo() {
         var a = window.navigator,
             b = window.document;
         return !!(window.isSecureContext && "runAdAuction" in a && a.runAdAuction instanceof Function && Po("run-ad-auction", b))
     };

     function Ro(a, b) {
         try {
             var c = a.split(".");
             a = x;
             for (var d = 0, e; a != null && d < c.length; d++) e = a, a = a[c[d]], typeof a === "function" && (a = e[c[d]]());
             var f = a;
             if (typeof f === b) return f
         } catch (g) {}
     }
     var So = {},
         To = {},
         Uo = {},
         Vo = {},
         Wo = (Vo[3] = (So[8] = function(a) {
                 try {
                     return Xa(a) != null
                 } catch (b) {}
             }, So[9] = function(a) {
                 try {
                     var b = Xa(a)
                 } catch (c) {
                     return
                 }
                 return typeof b === "function" && nj(b)
             }, So[10] = function() {
                 return window === window.top
             }, So[6] = function(a, b) {
                 b = b ? Number(b) : void 0;
                 b = K(Rn).g(b);
                 return qc(b, Number(a))
             }, So[27] = function(a) {
                 a = Ro(a, "boolean");
                 return a !== void 0 ? a : void 0
             }, So[60] = function(a) {
                 try {
                     return !!x.document.querySelector(a)
                 } catch (b) {}
             }, So[80] = function(a) {
                 try {
                     return !!x.matchMedia(a).matches
                 } catch (b) {}
             },
             So[69] = function(a) {
                 return Oo(a, x.document)
             }, So[70] = function(a) {
                 return Po(a, x.document)
             }, So[79] = function(a) {
                 var b = x.navigator;
                 b = b === void 0 ? navigator : b;
                 try {
                     var c, d;
                     var e = !!((c = b.protectedAudience) == null ? 0 : (d = c.queryFeatureSupport) == null ? 0 : d.call(c, a))
                 } catch (f) {
                     e = !1
                 }
                 return e
             }, So), Vo[4] = (To[3] = function() {
             return cj()
         }, To[6] = function(a) {
             a = Ro(a, "number");
             return a !== void 0 ? a : void 0
         }, To), Vo[5] = (Uo[2] = function() {
                 return window.location.href
             }, Uo[3] = function() {
                 try {
                     return window.top.location.hash
                 } catch (a) {
                     return ""
                 }
             },
             Uo[4] = function(a) {
                 a = Ro(a, "string");
                 return a !== void 0 ? a : void 0
             }, Uo[12] = function(a) {
                 try {
                     var b = Ro(a, "string");
                     if (b !== void 0) return atob(b)
                 } catch (c) {}
             }, Uo), Vo);

     function Xo() {
         var a = a === void 0 ? x : a;
         return a.ggeac || (a.ggeac = {})
     };

     function Yo(a) {
         var b = {};
         return Zo((b[0] = new Map, b[1] = new Map, b[2] = new Map, b), a)
     }

     function Zo(a, b) {
         for (var c = new Map, d = w(a[1].entries()), e = d.next(); !e.done; e = d.next()) {
             var f = w(e.value);
             e = f.next().value;
             f = f.next().value;
             f = f[f.length - 1];
             c.set(e, f.Xf + f.Cf * f.Df)
         }
         b = w(b);
         for (d = b.next(); !d.done; d = b.next())
             for (d = d.value, e = cg(d, Co, 2, Mf()), e = w(e), f = e.next(); !f.done; f = e.next())
                 if (f = f.value, Do(f).length !== 0) {
                     var g = mg(f, 8);
                     if (G(f, 4) && !G(f, 13) && !G(f, 14)) {
                         var h = void 0;
                         g = (h = c.get(G(f, 4))) != null ? h : 0;
                         h = mg(f, 1) * Do(f).length;
                         c.set(G(f, 4), g + h)
                     }
                     h = [];
                     for (var k = 0; k < Do(f).length; k++) {
                         var l = {
                             Xf: g,
                             Cf: mg(f,
                                 1),
                             Df: Do(f).length,
                             Mh: k,
                             Zc: G(d, 1),
                             Kd: f,
                             Va: Do(f)[k]
                         };
                         h.push(l)
                     }
                     $o(a[2], G(f, 10), h) || $o(a[1], G(f, 4), h) || $o(a[0], Do(f)[0].getId(), h)
                 } return a
     }

     function $o(a, b, c) {
         if (!b) return !1;
         a.has(b) || a.set(b, []);
         var d;
         (d = a.get(b)).push.apply(d, ua(c));
         return !0
     };
     var ap = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$"),
         bp = function(a) {
             var b = a.match(ap);
             a = b[1];
             var c = b[3];
             b = b[4];
             var d = "";
             a && (d += a + ":");
             c && (d = d + "//" + c, b && (d += ":" + b));
             return d
         },
         cp = function(a, b) {
             if (a) {
                 a = a.split("&");
                 for (var c = 0; c < a.length; c++) {
                     var d = a[c].indexOf("="),
                         e = null;
                     if (d >= 0) {
                         var f = a[c].substring(0, d);
                         e = a[c].substring(d + 1)
                     } else f = a[c];
                     b(f, e ? Ri(e) : "")
                 }
             }
         },
         dp = /#|$/,
         ep = function(a, b) {
             var c = a.search(dp);
             a: {
                 var d =
                     0;
                 for (var e = b.length;
                     (d = a.indexOf(b, d)) >= 0 && d < c;) {
                     var f = a.charCodeAt(d - 1);
                     if (f == 38 || f == 63)
                         if (f = a.charCodeAt(d + e), !f || f == 61 || f == 38 || f == 35) break a;
                     d += e + 1
                 }
                 d = -1
             }
             if (d < 0) return null;
             e = a.indexOf("&", d);
             if (e < 0 || e > c) e = c;
             d += b.length + 1;
             return Ri(a.slice(d, e !== -1 ? e : 0))
         };

     function fp(a) {
         var b = a.length;
         if (b === 0) return 0;
         for (var c = 305419896, d = 0; d < b; d++) c ^= (c << 5) + (c >> 2) + a.charCodeAt(d) & 4294967295;
         return c > 0 ? c : 4294967296 + c
     };
     var gp = [12, 13, 20],
         hp = function(a, b, c, d) {
             d = d === void 0 ? {} : d;
             var e = d.ce === void 0 ? !1 : d.ce;
             d = d.gi === void 0 ? [] : d.gi;
             this.Fc = a;
             this.Db = c;
             this.o = {};
             this.ce = e;
             a = {};
             this.g = (a[b] = [], a[4] = [], a);
             this.j = {};
             this.l = {};
             if (b = tm())
                 for (b = w(b.split(",") || []), a = b.next(); !a.done; a = b.next())(a = Number(a.value)) && (this.j[a] = !0);
             d = w(d);
             for (b = d.next(); !b.done; b = d.next()) this.j[b.value] = !0
         },
         kp = function(a, b, c, d) {
             var e = [],
                 f;
             if (f = b !== 9) a.o[b] ? f = !0 : (a.o[b] = !0, f = !1);
             if (f) return qn(a.Db, b, c, e, [], 4), e;
             f = gp.includes(b);
             for (var g = [], h = [], k = w([0, 1, 2]), l = k.next(); !l.done; l = k.next()) {
                 l = l.value;
                 for (var n = w(a.Fc[l].entries()), p = n.next(); !p.done; p = n.next()) {
                     var q = w(p.value);
                     p = q.next().value;
                     q = q.next().value;
                     var v = p,
                         u = q;
                     p = new Jk;
                     q = u.filter(function(X) {
                         return X.Zc === b && a.j[X.Va.getId()] && ip(a, X)
                     });
                     if (q.length)
                         for (p = w(q), q = p.next(); !q.done; q = p.next()) h.push(q.value.Va);
                     else if (!a.ce) {
                         q = void 0;
                         l === 2 ? (q = d[1], Bg(p, 2, Kk, v)) : q = d[0];
                         var t = void 0,
                             y = void 0;
                         q = (y = (t = q) == null ? void 0 : t(String(v))) != null ? y : l === 2 && G(u[0].Kd, 11) === 1 ? void 0 : d[0](String(v));
                         if (q !== void 0) {
                             v = w(u);
                             for (u = v.next(); !u.done; u = v.next())
                                 if (u = u.value, u.Zc === b) {
                                     t = q - u.Xf;
                                     var D = u;
                                     y = D.Cf;
                                     var ca = D.Df;
                                     D = D.Mh;
                                     t < 0 || t >= y * ca || t % ca !== D || !ip(a, u) || (t = G(u.Kd, 13), t !== 0 && t !== void 0 && (y = a.l[String(t)], y !== void 0 && y !== u.Va.getId() ? rn(a.Db, a.l[String(t)], u.Va.getId(), t) : a.l[String(t)] = u.Va.getId()), h.push(u.Va))
                                 } Zf(p, Kk) !== 0 && (xg(p, 3, q), g.push(p))
                         }
                     }
                 }
             }
             d = w(h);
             for (h = d.next(); !h.done; h = d.next()) h = h.value, k = h.getId(), e.push(k), jp(a, k, f ? 4 : c), In(cg(h, kn, 2, Mf()), f ? Kn() : [c], a.Db, k);
             qn(a.Db, b, c, e, g, 1);
             return e
         },
         jp = function(a, b, c) {
             a.g[c] || (a.g[c] = []);
             a = a.g[c];
             a.includes(b) || a.push(b)
         },
         ip = function(a, b) {
             var c = K(tn).Ra,
                 d = fn(E(b.Kd, Wk, 3), c);
             if (!d.success) return sn(a.Db, E(b.Kd, Wk, 3), b.Zc, b.Va.getId(), d), !1;
             if (!d.value) return !1;
             c = fn(E(b.Va, Wk, 3), c);
             return c.success ? c.value ? !0 : !1 : (sn(a.Db, E(b.Va, Wk, 3), b.Zc, b.Va.getId(), c), !1)
         },
         lp = function(a, b) {
             b = b.map(function(c) {
                 return new Eo(c)
             }).filter(function(c) {
                 return !gp.includes(G(c, 1))
             });
             a.Fc = Zo(a.Fc, b)
         },
         mp = function(a, b) {
             Mn(1, function(c) {
                 a.j[c] = !0
             }, b);
             Mn(2, function(c,
                 d, e) {
                 return kp(a, c, d, e)
             }, b);
             Mn(3, function(c) {
                 return (a.g[c] || []).concat(a.g[4])
             }, b);
             Mn(12, function(c) {
                 return void lp(a, c)
             }, b);
             Mn(16, function(c, d) {
                 return void jp(a, c, d)
             }, b)
         };
     var np = function() {
         var a = {};
         this.g = function(b, c) {
             return a[b] != null ? a[b] : c
         };
         this.j = function(b, c) {
             return a[b] != null ? a[b] : c
         };
         this.B = function(b, c) {
             return a[b] != null ? a[b] : c
         };
         this.A = function(b, c) {
             return a[b] != null ? a[b] : c
         };
         this.o = function(b, c) {
             return a[b] != null ? c.concat(a[b]) : c
         };
         this.l = function() {}
     };

     function op(a) {
         return K(np).g(a.g, a.defaultValue)
     }

     function pp(a) {
         return K(np).j(a.g, a.defaultValue)
     };
     var qp = function() {
             this.g = function() {}
         },
         rp = function(a, b) {
             a.g = Nn(14, b, function() {})
         };

     function sp(a) {
         K(qp).g(a)
     };
     var tp, up, vp, wp, xp, yp;

     function zp(a, b) {
         var c = b = b === void 0 ? Xo() : b;
         Sn(K(Rn), c, a);
         Ap(b, a);
         a = b;
         rp(K(qp), a);
         K(np).l()
     }

     function Ap(a, b) {
         var c = K(np);
         c.g = function(d, e) {
             return Nn(5, a, function() {
                 return !1
             })(d, e, b)
         };
         c.j = function(d, e) {
             return Nn(6, a, function() {
                 return 0
             })(d, e, b)
         };
         c.B = function(d, e) {
             return Nn(7, a, function() {
                 return ""
             })(d, e, b)
         };
         c.A = function(d, e) {
             return Nn(8, a, function() {
                 return []
             })(d, e, b)
         };
         c.o = function(d, e) {
             return Nn(17, a, function() {
                 return []
             })(d, e, b)
         };
         c.l = function() {
             Nn(15, a, function() {})(b)
         }
     };
     Xn.reset();
     Zn(new bo);
     var Bp, Cp, Dp = Jo();
     Cp = E(Dp, Go, 1);
     (function(a) {
         var b = a.hh;
         var c = a.Ra;
         var d = a.config;
         var e = a.Og === void 0 ? Xo() : a.Og;
         var f = a.gf === void 0 ? 0 : a.gf;
         var g = a.Db === void 0 ? new on((wp = lm((tp = E(b, Fo, 5)) == null ? void 0 : ng(tp, 2))) != null ? wp : 0, (xp = lm((up = E(b, Fo, 5)) == null ? void 0 : ng(up, 4))) != null ? xp : 0, (yp = (vp = E(b, Fo, 5)) == null ? void 0 : kg(vp, 3)) != null ? yp : !1) : a.Db;
         a = a.Fc === void 0 ? Yo(cg(b, Eo, 2, Mf(Id))) : a.Fc;
         e.hasOwnProperty("init-done") ? (Nn(12, e, function() {})(cg(b, Eo, 2, Mf()).map(function(h) {
             return mf(h)
         })), Nn(13, e, function() {})(cg(b, kn, 1, Mf()).map(function(h) {
                 return mf(h)
             }),
             f), c && Nn(14, e, function() {})(c), zp(f, e)) : (mp(new hp(a, f, g, d), e), On(e), Pn(e), Qn(e), zp(f, e), In(cg(b, kn, 1, Mf(Id)), [f], g, void 0, !0), un = un || !(!d || !d.uk), sp(Wo), c && sp(c))
     })({
         hh: (Bp = Cp == null ? void 0 : df(Cp)) != null ? Bp : new Go,
         gf: 7
     });
     var Ep = lj(),
         Fp = {},
         Gp = (Fp[0] = function(a) {
             a = a === void 0 ? dj() : a;
             return function(b) {
                 return fp(b + " + " + a) % 1E3
             }
         }(Ep), Fp);
     K(Rn).j(16, Gp);
     var Hp = function(a) {
         var b = {};
         ec(a, function(c) {
             var d = c.event,
                 e = b[d];
             b.hasOwnProperty(d) ? e !== null && (c.equals(e) || (b[d] = null)) : b[d] = c
         });
         tc(a, function(c) {
             return b[c.event] === null
         })
     };
     var Ip = {
             NONE: 0,
             Ui: 1
         },
         Jp = {
             Ri: 0,
             Pj: 1,
             Oj: 2,
             Qj: 3
         },
         Kp = {
             gg: "a",
             Ti: "d",
             VIDEO: "v"
         };
     var Lp = function() {
         this.aa = 0;
         this.g = !1;
         this.j = -1;
         this.Pb = !1;
         this.xa = 0
     };
     Lp.prototype.isVisible = function() {
         return this.Pb ? this.aa >= .3 : this.aa >= .5
     };
     var Mp = {
             Qi: 0,
             Xi: 1
         },
         Np = {
             668123728: 0,
             668123729: 1
         },
         Op = {
             44731964: 0,
             44731965: 1
         },
         Pp = {
             NONE: 0,
             Cj: 1,
             cj: 2
         },
         Qp = {
             480596784: 0,
             480596785: 1,
             21063355: 2
         };
     var Rp = function() {
             this.g = null;
             this.o = !1;
             this.l = null
         },
         Sp = function(a) {
             a.o = !0;
             return a
         },
         Tp = function(a, b) {
             a.l && ec(b, function(c) {
                 c = a.l[c];
                 c !== void 0 && a.j(c)
             })
         };
     Rp.prototype.getValue = function() {
         return this.g
     };
     var Up = function(a) {
         Rp.call(this);
         this.B = a
     };
     r(Up, Rp);
     Up.prototype.j = function(a) {
         this.g === null && zj(this.B, a) && (this.g = a)
     };
     var Vp = function() {
         Rp.call(this)
     };
     r(Vp, Rp);
     Vp.prototype.j = function(a) {
         this.g === null && typeof a === "number" && (this.g = a)
     };
     var Wp = function() {
         Rp.call(this)
     };
     r(Wp, Rp);
     Wp.prototype.j = function(a) {
         this.g === null && typeof a === "string" && (this.g = a)
     };
     var Xp = function() {
         this.g = {};
         this.l = !0;
         this.j = {}
     };
     Xp.prototype.reset = function() {
         this.g = {};
         this.l = !0;
         this.j = {}
     };
     var Yp = function(a, b, c) {
             a.g[b] || (a.g[b] = new Up(c));
             return a.g[b]
         },
         Zp = function(a) {
             a.g.queryid || (a.g.queryid = new Wp)
         },
         $p = function(a, b, c) {
             (a = a.g[b]) && a.j(c)
         },
         aq = function(a, b) {
             if (yj(a.j, b)) return a.j[b];
             if (a = a.g[b]) return a.getValue()
         },
         bq = function(a) {
             var b = {},
                 c = sj(a.g, function(d) {
                     return d.o
                 });
             rj(c, function(d, e) {
                 d = a.j[e] !== void 0 ? String(a.j[e]) : d.o && d.g !== null ? String(d.g) : "";
                 d.length > 0 && (b[e] = d)
             }, a);
             return b
         },
         cq = function(a) {
             a = bq(a);
             var b = [];
             rj(a, function(c, d) {
                 d in Object.prototype || typeof c != "undefined" &&
                     b.push([d, ":", c].join(""))
             });
             return b
         },
         eq = function() {
             var a = dq().R,
                 b = ao();
             a.l && ec(vj(a.g), function(c) {
                 return Tp(c, b)
             })
         };
     var fq = function(a) {
         Yp(a, "od", Ip);
         Sp(Yp(a, "opac", Mp));
         Sp(Yp(a, "sbeos", Mp));
         Sp(Yp(a, "prf", Mp));
         Sp(Yp(a, "mwt", Mp));
         Yp(a, "iogeo", Mp)
     };
     var gq = document,
         P = window;
     var hq = !Gc && !(A("Safari") && !($b() || (Wb() ? 0 : A("Coast")) || Xb() || (Wb() ? 0 : A("Edge")) || (Wb() ? Vb("Microsoft Edge") : A("Edg/")) || (Wb() ? Vb("Opera") : A("OPR")) || Zb() || A("Silk") || A("Android")));
     var iq = function() {
         this.g = this.Cb = null
     };
     var jq = function() {};
     jq.prototype.now = function() {
         return 0
     };
     jq.prototype.j = function() {
         return 0
     };
     jq.prototype.l = function() {
         return 0
     };
     jq.prototype.g = function() {
         return 0
     };
     var lq = function() {
         if (!kq()) throw Error();
     };
     r(lq, jq);
     var kq = function() {
         return !(!P || !P.performance)
     };
     lq.prototype.now = function() {
         return kq() && P.performance.now ? P.performance.now() : jq.prototype.now.call(this)
     };
     lq.prototype.j = function() {
         return kq() && P.performance.memory ? P.performance.memory.totalJSHeapSize || 0 : jq.prototype.j.call(this)
     };
     lq.prototype.l = function() {
         return kq() && P.performance.memory ? P.performance.memory.usedJSHeapSize || 0 : jq.prototype.l.call(this)
     };
     lq.prototype.g = function() {
         return kq() && P.performance.memory ? P.performance.memory.jsHeapSizeLimit || 0 : jq.prototype.g.call(this)
     };
     var mq = function() {};
     mq.prototype.isVisible = function() {
         return qm(gq) === 1
     };
     var nq = RegExp("^https?://(\\w|-)+\\.cdn\\.ampproject\\.(net|org)(\\?|/|$)"),
         rq = function(a) {
             a = a || oq();
             for (var b = new pq(x.location.href, !1), c = null, d = a.length - 1, e = d; e >= 0; --e) {
                 var f = a[e];
                 !c && nq.test(f.url) && (c = f);
                 if (f.url && !f.g) {
                     b = f;
                     break
                 }
             }
             e = null;
             f = a.length && a[d].url;
             b.depth !== 0 && f && (e = a[d]);
             return new qq(b, e, c)
         },
         oq = function() {
             var a = x,
                 b = [],
                 c = null;
             do {
                 var d = a;
                 if (ii(d)) {
                     var e = d.location.href;
                     c = d.document && d.document.referrer || null
                 } else e = c, c = null;
                 b.push(new pq(e || ""));
                 try {
                     a = d.parent
                 } catch (f) {
                     a = null
                 }
             } while (a &&
                 d !== a);
             d = 0;
             for (a = b.length - 1; d <= a; ++d) b[d].depth = a - d;
             d = x;
             if (d.location && d.location.ancestorOrigins && d.location.ancestorOrigins.length === b.length - 1)
                 for (a = 1; a < b.length; ++a) e = b[a], e.url || (e.url = d.location.ancestorOrigins[a - 1] || "", e.g = !0);
             return b
         },
         qq = function(a, b, c) {
             this.g = a;
             this.j = b;
             this.l = c
         },
         pq = function(a, b) {
             this.url = a;
             this.g = !!b;
             this.depth = null
         };
     var sq = function() {
             this.l = "&";
             this.j = {};
             this.o = 0;
             this.g = []
         },
         tq = function(a, b) {
             var c = {};
             c[a] = b;
             return [c]
         },
         vq = function(a, b, c, d, e) {
             var f = [];
             hi(a, function(g, h) {
                 (g = uq(g, b, c, d, e)) && f.push(h + "=" + g)
             });
             return f.join(b)
         },
         uq = function(a, b, c, d, e) {
             if (a == null) return "";
             b = b || "&";
             c = c || ",$";
             typeof c === "string" && (c = c.split(""));
             if (a instanceof Array) {
                 if (d || (d = 0), d < c.length) {
                     for (var f = [], g = 0; g < a.length; g++) f.push(uq(a[g], b, c, d + 1, e));
                     return f.join(c[d])
                 }
             } else if (typeof a === "object") return e || (e = 0), e < 2 ? encodeURIComponent(vq(a,
                 b, c, d, e + 1)) : "...";
             return encodeURIComponent(String(a))
         },
         wq = function(a, b, c) {
             a.g.push(b);
             a.j[b] = c
         },
         xq = function(a, b, c, d) {
             a.g.push(b);
             a.j[b] = tq(c, d)
         },
         zq = function(a, b, c, d) {
             b = b + "//" + c + d;
             var e = yq(a) - d.length;
             if (e < 0) return "";
             a.g.sort(function(n, p) {
                 return n - p
             });
             d = null;
             c = "";
             for (var f = 0; f < a.g.length; f++)
                 for (var g = a.g[f], h = a.j[g], k = 0; k < h.length; k++) {
                     if (!e) {
                         d = d == null ? g : d;
                         break
                     }
                     var l = vq(h[k], a.l, ",$");
                     if (l) {
                         l = c + l;
                         if (e >= l.length) {
                             e -= l.length;
                             b += l;
                             c = a.l;
                             break
                         }
                         d = d == null ? g : d
                     }
                 }
             a = "";
             d != null && (a = "" + c + "trn=" + d);
             return b +
                 a
         },
         yq = function(a) {
             var b = 1,
                 c;
             for (c in a.j) c.length > b && (b = c.length);
             return 3997 - b - a.l.length - 1
         };
     var Aq = function(a, b) {
             this.g = a;
             this.depth = b
         },
         Cq = function() {
             var a = oq(),
                 b = Math.max(a.length - 1, 0),
                 c = rq(a);
             a = c.g;
             var d = c.j,
                 e = c.l,
                 f = [];
             c = function(h, k) {
                 return h == null ? k : h
             };
             e && f.push(new Aq([e.url, e.g ? 2 : 0], c(e.depth, 1)));
             d && d != e && f.push(new Aq([d.url, 2], 0));
             a.url && a != e && f.push(new Aq([a.url, 0], c(a.depth, b)));
             var g = ic(f, function(h, k) {
                 return f.slice(0, f.length - k)
             });
             !a.url || (e || d) && a != e || (d = aj(a.url)) && g.push([new Aq([d, 1], c(a.depth, b))]);
             g.push([]);
             return ic(g, function(h) {
                 return Bq(b, h)
             })
         };

     function Bq(a, b) {
         var c = jc(b, function(e, f) {
                 return Math.max(e, f.depth)
             }, -1),
             d = Ac(c + 2);
         d[0] = a;
         ec(b, function(e) {
             return d[e.depth + 1] = e.g
         });
         return d
     }

     function Dq() {
         var a = a === void 0 ? Cq() : a;
         return a.map(function(b) {
             return uq(b)
         })
     };
     var Yq = function() {
             this.j = new mq;
             this.g = kq() ? new lq : new jq
         },
         $q = function() {
             Zq();
             var a = P.document;
             return !!(a && a.body && a.body.getBoundingClientRect && typeof P.setInterval === "function" && typeof P.clearInterval === "function" && typeof P.setTimeout === "function" && typeof P.clearTimeout === "function")
         };
     Yq.prototype.setInterval = function(a, b) {
         return P.setInterval(a, b)
     };
     Yq.prototype.clearInterval = function(a) {
         P.clearInterval(a)
     };
     Yq.prototype.setTimeout = function(a, b) {
         return P.setTimeout(a, b)
     };
     Yq.prototype.clearTimeout = function(a) {
         P.clearTimeout(a)
     };
     var ar = function() {
         Zq();
         return Dq()
     };
     var br = function() {},
         Zq = function() {
             var a = K(br);
             if (!a.g) {
                 if (!P) throw Error("Context has not been set and window is undefined.");
                 a.g = K(Yq)
             }
             return a.g
         };
     var cr = function(a) {
         this.D = C(a)
     };
     r(cr, I);
     cr.prototype.j = Qh([0, zh, Dh, -2, Gh]);
     var dr = function(a) {
             this.l = a;
             this.g = -1;
             this.j = this.o = 0
         },
         er = function(a, b) {
             return function() {
                 var c = Ra.apply(0, arguments);
                 if (a.g > -1) return b.apply(null, ua(c));
                 try {
                     return a.g = a.l.g.now(), b.apply(null, ua(c))
                 } finally {
                     a.o += a.l.g.now() - a.g, a.g = -1, a.j += 1
                 }
             }
         };
     var fr = function(a, b) {
         this.j = a;
         this.l = b;
         this.g = new dr(a)
     };
     var gr = function() {
             this.g = {}
         },
         ir = function() {
             var a = dq().flags,
                 b = hr;
             a = a.g[b.key];
             if (b.valueType === "proto") {
                 try {
                     var c = JSON.parse(a);
                     if (Array.isArray(c)) return c
                 } catch (d) {}
                 return b.defaultValue
             }
             return typeof a === typeof b.defaultValue ? a : b.defaultValue
         };
     var jr = {
         Lj: 1,
         dk: 2,
         Hj: 3,
         1: "POSITION",
         2: "VISIBILITY",
         3: "MONITOR_VISIBILITY"
     };
     var kr = function() {
         this.l = void 0;
         this.j = this.A = 0;
         this.B = -1;
         this.R = new Xp;
         Sp(Yp(this.R, "mv", Pp)).l = Qp === void 0 ? null : Qp;
         Yp(this.R, "omid", Mp);
         Sp(Yp(this.R, "epoh", Mp));
         Sp(Yp(this.R, "epph", Mp));
         Sp(Yp(this.R, "umt", Mp)).l = Np === void 0 ? null : Np;
         Sp(Yp(this.R, "phel", Mp));
         Sp(Yp(this.R, "phell", Mp));
         Sp(Yp(this.R, "oseid", jr));
         var a = this.R;
         a.g.sloi || (a.g.sloi = new Vp);
         Sp(a.g.sloi);
         Yp(this.R, "mm", Kp);
         Sp(Yp(this.R, "ovms", Jp));
         Sp(Yp(this.R, "xdi", Mp));
         Sp(Yp(this.R, "amp", Mp));
         Sp(Yp(this.R, "prf", Mp));
         Sp(Yp(this.R, "gtx", Mp));
         Sp(Yp(this.R, "mvp_lv", Mp));
         Sp(Yp(this.R, "ssmol", Mp)).l = Op === void 0 ? null : Op;
         Sp(Yp(this.R, "fmd", Mp));
         Yp(this.R, "gen204simple", Mp);
         this.g = new fr(Zq(), this.R);
         this.o = !1;
         this.flags = new gr
     };
     kr.prototype.Ae = function(a) {
         if (typeof a === "string" && a.length != 0) {
             var b = this.R;
             if (b.l) {
                 a = a.split("&");
                 for (var c = a.length - 1; c >= 0; c--) {
                     var d = a[c].split("="),
                         e = decodeURIComponent(d[0]);
                     d.length > 1 ? (d = decodeURIComponent(d[1]), d = /^[0-9]+$/g.exec(d) ? parseInt(d, 10) : d) : d = 1;
                     (e = b.g[e]) && e.j(d)
                 }
             }
         }
     };
     var dq = function() {
         return K(kr)
     };
     var lr = function(a, b, c, d, e) {
         if ((d ? a.l : Math.random()) < (e || a.g)) try {
             if (c instanceof sq) var f = c;
             else f = new sq, hi(c, function(h, k) {
                 var l = f,
                     n = l.o++;
                 wq(l, n, tq(k, h))
             });
             var g = zq(f, a.j, "pagead2.googlesyndication.com", "/pagead/gen_204?id=" + b + "&");
             g && (Zq(), sk(P, g))
         } catch (h) {}
     };
     var or = function() {
         var a = mr;
         this.A = nr;
         this.B = "jserror";
         this.l = !0;
         this.j = null;
         this.C = this.lb;
         this.g = a === void 0 ? null : a;
         this.o = !1
     };
     m = or.prototype;
     m.Ke = function(a) {
         this.j = a
     };
     m.Rf = function(a) {
         this.B = a
     };
     m.Ne = function(a) {
         this.l = a
     };
     m.Sf = function(a) {
         this.o = a
     };
     m.Qb = function(a, b, c) {
         var d = this;
         return er(dq().g.g, function() {
             try {
                 if (d.g && d.g.l) {
                     var e = d.g.start(a.toString(), 3);
                     var f = b();
                     d.g.end(e)
                 } else f = b()
             } catch (h) {
                 var g = d.l;
                 try {
                     Dm(e), g = d.C(a, new pr(qr(h)), void 0, c)
                 } catch (k) {
                     d.lb(217, k)
                 }
                 if (!g) throw h;
             }
             return f
         })()
     };
     m.Be = function(a, b, c, d) {
         var e = this;
         return er(dq().g.g, function() {
             var f = Ra.apply(0, arguments);
             return e.Qb(a, function() {
                 return b.apply(c, f)
             }, d)
         })
     };
     m.lb = function(a, b, c, d, e) {
         e = e || this.B;
         try {
             var f = new sq;
             xq(f, 1, "context", a);
             fi(b) || (b = new pr(qr(b)));
             b.msg && xq(f, 2, "msg", b.msg.substring(0, 512));
             var g = b.meta || {};
             if (this.j) try {
                 this.j(g)
             } catch (k) {}
             if (d) try {
                 d(g)
             } catch (k) {}
             wq(f, 3, [g]);
             var h = rq();
             h.j && xq(f, 4, "top", h.j.url || "");
             wq(f, 5, [{
                 url: h.g.url || ""
             }, {
                 url: h.g.url ? bp(h.g.url) : ""
             }]);
             lr(this.A, e, f, this.o, c)
         } catch (k) {
             try {
                 lr(this.A, e, {
                     context: "ecmserr",
                     rctx: a,
                     msg: qr(k),
                     url: h && h.g.url
                 }, this.o, c)
             } catch (l) {}
         }
         return this.l
     };
     var qr = function(a) {
             var b = a.toString();
             a.name && b.indexOf(a.name) == -1 && (b += ": " + a.name);
             a.message && b.indexOf(a.message) == -1 && (b += ": " + a.message);
             if (a.stack) a: {
                 a = a.stack;
                 var c = b;
                 try {
                     a.indexOf(c) == -1 && (a = c + "\n" + a);
                     for (var d; a != d;) d = a, a = a.replace(/((https?:\/..*\/)[^\/:]*:\d+(?:.|\n)*)\2/, "$1");
                     b = a.replace(/\n */g, "\n");
                     break a
                 } catch (e) {
                     b = c;
                     break a
                 }
                 b = void 0
             }
             return b
         },
         pr = function(a) {
             ei.call(this, Error(a), {
                 message: a
             })
         };
     r(pr, ei);
     var nr, rr, mr = new Cm(1, window),
         sr = function() {
             P && typeof P.google_measure_js_timing != "undefined" && (P.google_measure_js_timing || mr.A())
         };
     nr = new function() {
         var a = "https:";
         P && P.location && P.location.protocol === "http:" && (a = "http:");
         this.j = a;
         this.g = .01;
         this.l = Math.random()
     };
     rr = new or;
     P && P.document && (P.document.readyState == "complete" ? sr() : mr.l && qk(P, "load", function() {
         sr()
     }));
     var tr = function(a) {
             rr.Ke(function(b) {
                 ec(a, function(c) {
                     c(b)
                 })
             })
         },
         ur = function(a, b) {
             return rr.Qb(a, b)
         },
         vr = function(a, b, c, d) {
             return rr.Be(a, b, c, d)
         },
         wr = function(a, b, c, d) {
             rr.lb(a, b, c, d)
         };
     var xr = Date.now(),
         yr = -1,
         zr = -1,
         Ar, Br = -1,
         Cr = !1,
         Dr = function() {
             return Date.now() - xr
         },
         Er = function() {
             var a = dq().l,
                 b = zr >= 0 ? Dr() - zr : -1,
                 c = Cr ? Dr() - yr : -1,
                 d = Br >= 0 ? Dr() - Br : -1;
             if (a == 947190542) return 100;
             if (a == 79463069) return 200;
             a = [2E3, 4E3];
             var e = [250, 500, 1E3];
             wr(637, Error(), .001);
             var f = b;
             c != -1 && c < b && (f = c);
             for (b = 0; b < a.length; ++b)
                 if (f < a[b]) {
                     var g = e[b];
                     break
                 } g === void 0 && (g = e[a.length]);
             return d != -1 && d > 1500 && d < 4E3 ? 500 : g
         };
     var Fr = function(a, b, c) {
         var d = new J(0, 0, 0, 0);
         this.time = a;
         this.volume = null;
         this.l = b;
         this.g = d;
         this.j = c
     };
     Fr.prototype.equals = function(a, b) {
         return !!a && (!(b === void 0 ? 0 : b) || this.volume == a.volume) && this.l == a.l && Yj(this.g, a.g) && !0
     };
     var Gr = function(a, b, c, d, e, f, g, h) {
         this.l = a;
         this.I = b;
         this.j = c;
         this.B = d;
         this.g = e;
         this.o = f;
         this.C = g;
         this.A = h
     };
     Gr.prototype.getTimestamp = function() {
         return this.C
     };
     Gr.prototype.equals = function(a, b) {
         return this.l.equals(a.l, b === void 0 ? !1 : b) && this.I == a.I && Yj(this.j, a.j) && Yj(this.B, a.B) && this.g == a.g && this.o == a.o && this.C == a.C && this.A == a.A
     };
     var Hr = {
             currentTime: 1,
             duration: 2,
             isVpaid: 4,
             volume: 8,
             isYouTube: 16,
             isPlaying: 32
         },
         Bj = {
             af: "start",
             FIRST_QUARTILE: "firstquartile",
             MIDPOINT: "midpoint",
             THIRD_QUARTILE: "thirdquartile",
             COMPLETE: "complete",
             ERROR: "error",
             ug: "metric",
             PAUSE: "pause",
             Dg: "resume",
             SKIPPED: "skip",
             VIEWABLE_IMPRESSION: "viewable_impression",
             vg: "mute",
             Hg: "unmute",
             FULLSCREEN: "fullscreen",
             qg: "exitfullscreen",
             lg: "bufferstart",
             kg: "bufferfinish",
             Ve: "fully_viewable_audible_half_duration_impression",
             Ze: "measurable_impression",
             fg: "abandon",
             Ue: "engagedview",
             IMPRESSION: "impression",
             ng: "creativeview",
             LOADED: "loaded",
             PROGRESS: "progress",
             Ki: "close",
             Li: "collapse",
             wg: "overlay_resize",
             xg: "overlay_unmeasurable_impression",
             yg: "overlay_unviewable_impression",
             Ag: "overlay_viewable_immediate_impression",
             zg: "overlay_viewable_end_of_session_impression",
             og: "custom_metric_viewable",
             hg: "audio_audible",
             jg: "audio_measurable",
             ig: "audio_impression"
         },
         Ir = "start firstquartile midpoint thirdquartile resume loaded".split(" "),
         Jr = ["start", "firstquartile", "midpoint", "thirdquartile"],
         Kr = ["abandon"],
         Lr = {
             UNKNOWN: -1,
             af: 0,
             FIRST_QUARTILE: 1,
             MIDPOINT: 2,
             THIRD_QUARTILE: 3,
             COMPLETE: 4,
             ug: 5,
             PAUSE: 6,
             Dg: 7,
             SKIPPED: 8,
             VIEWABLE_IMPRESSION: 9,
             vg: 10,
             Hg: 11,
             FULLSCREEN: 12,
             qg: 13,
             Ve: 14,
             Ze: 15,
             fg: 16,
             Ue: 17,
             IMPRESSION: 18,
             ng: 19,
             LOADED: 20,
             og: 21,
             lg: 22,
             kg: 23,
             ig: 27,
             jg: 28,
             hg: 29
         };
     var uj = {
             Gi: "addEventListener",
             dj: "getMaxSize",
             ej: "getScreenSize",
             fj: "getState",
             gj: "getVersion",
             Nj: "removeEventListener",
             Dj: "isViewable"
         },
         Mr = function(a) {
             var b = a !== a.top,
                 c = a.top === ji(a),
                 d = -1,
                 e = 0;
             if (b && c && a.top.mraid) {
                 d = 3;
                 var f = a.top.mraid
             } else d = (f = a.mraid) ? b ? c ? 2 : 1 : 0 : -1;
             f && (f.IS_GMA_SDK || (e = 2), tj(function(g) {
                 return typeof f[g] === "function"
             }) || (e = 1));
             return {
                 Oa: f,
                 Yc: e,
                 ki: d
             }
         };
     var Nr = function() {
         var a = window.document;
         return a && typeof a.elementFromPoint === "function"
     };

     function Or(a, b, c) {
         try {
             if (a) {
                 if (!b.top) return new J(-12245933, -12245933, -12245933, -12245933);
                 b = b.top
             }
             a: {
                 var d = b;
                 if (a && d !== null && d != d.top) {
                     if (!d.top) {
                         var e = new qj(-12245933, -12245933);
                         break a
                     }
                     d = d.top
                 }
                 try {
                     e = (c === void 0 ? 0 : c) ? (new qj(d.innerWidth, d.innerHeight)).round() : Nj(d || window).round()
                 } catch (n) {
                     e = new qj(-12245933, -12245933)
                 }
             }
             a = e;
             var f = a.height,
                 g = a.width;
             if (g === -12245933) return new J(g, g, g, g);
             var h = Wj(Jj(b.document)),
                 k = h.x,
                 l = h.y;
             return new J(l, k + g, l + f, k)
         } catch (n) {
             return new J(-12245933, -12245933,
                 -12245933, -12245933)
         }
     };
     var Pr = function(a, b) {
         b = Math.pow(10, b);
         return Math.floor(a * b) / b
     };

     function Qr(a, b, c, d) {
         if (!a) return {
             value: d,
             done: !1
         };
         d = b(d, a);
         var e = c(d, a);
         return !e && Cc(a, "parentElement") ? Qr(a.parentElement || null, b, c, d) : {
             done: e,
             value: d
         }
     }
     var Rr = function(a, b, c, d) {
         if (!a) return d;
         d = Qr(a, b, c, d);
         if (!d.done) try {
             var e = Ij(a),
                 f = e && Oj(e);
             return Rr(f && f.frameElement, b, c, d.value)
         } catch (g) {}
         return d.value
     };

     function Sr(a) {
         var b = !Gc || Wc();
         return Rr(a, function(c, d) {
             c = Cc(d, "style") && d.style && fk(d, "visibility");
             return {
                 hidden: c === "hidden",
                 visible: b && c === "visible"
             }
         }, function(c) {
             return c.hidden || c.visible
         }, {
             hidden: !1,
             visible: !1
         }).hidden
     }
     var Tr = function(a) {
             return Rr(a, function(b, c) {
                 return !(!Cc(c, "style") || !c.style || fk(c, "display") !== "none")
             }, function(b) {
                 return b
             }, !1) ? !0 : Sr(a)
         },
         Ur = function(a) {
             return new J(a.top, a.right, a.bottom, a.left)
         },
         Vr = function(a) {
             var b = a.top || 0,
                 c = a.left || 0;
             return new J(b, c + (a.width || 0), b + (a.height || 0), c)
         },
         Wr = function(a) {
             return a != null && a >= 0 && a <= 1
         };

     function Xr() {
         var a = Sb();
         return a ? kc("AmazonWebAppPlatform;Android TV;Apple TV;AppleTV;BRAVIA;BeyondTV;Freebox;GoogleTV;HbbTV;LongTV;MiBOX;MiTV;NetCast.TV;Netcast;Opera TV;PANASONIC;POV_TV;SMART-TV;SMART_TV;SWTV;Smart TV;SmartTV;TV Store;UnionTV;Version/8.0 Safari/601.1 WPE;WebOS".split(";"), function(b) {
             return Nb(a, b)
         }) || Nb(a, "OMI/") && !Nb(a, "XiaoMi/") ? !0 : Nb(a, "Presto") && Nb(a, "Linux") && !Nb(a, "X11") && !Nb(a, "Android") && !Nb(a, "Mobi") : !1
     }

     function Yr() {
         var a = Sb();
         return Nb(a, "AppleTV") || Nb(a, "Apple TV") || Nb(a, "CFNetwork") || Nb(a, "tvOS")
     }

     function Zr(a) {
         a = a.userAgentData;
         return Array.isArray(a == null ? void 0 : a.brands) ? a.brands.some(function(b) {
             return b.brand.includes("kepler_webview")
         }) : Nb(Sb(), "Kepler")
     }

     function $r() {
         var a;
         (a = Nb(Sb(), "CrKey") && !(Nb(Sb(), "CrKey") && Nb(Sb(), "SmartSpeaker")) || Nb(Sb(), "PlayStation") || Nb(Sb(), "Roku") || Xr() || Nb(Sb(), "Xbox") || Yr()) || (a = Sb(), a = Nb(a, "sdk_google_atv_x86") || Nb(a, "Android TV"));
         return a
     };
     var bs = function() {
             this.l = !ii(P.top);
             this.C = oi() || pi();
             var a = oq();
             a = a.length > 0 && a[a.length - 1] != null && a[a.length - 1].url != null ? ((a = a[a.length - 1].url.match(ap)[3] || null) ? decodeURI(a) : a) || "" : "";
             this.domain = a;
             this.g = new J(0, 0, 0, 0);
             this.B = new qj(0, 0);
             this.o = new qj(0, 0);
             this.I = new J(0, 0, 0, 0);
             this.frameOffset = new pj(0, 0);
             this.A = 0;
             this.L = !1;
             this.j = !(!P || !Mr(P).Oa);
             as(this)
         },
         cs = function(a, b) {
             b && b.screen && (a.B = new qj(b.screen.width, b.screen.height))
         },
         ds = function(a, b) {
             a: {
                 var c = a.g ? new qj(a.g.getWidth(), a.g.getHeight()) : new qj(0, 0);b = b === void 0 ? P : b;b !== null && b != b.top && (b = b.top);
                 var d = 0,
                     e = 0;
                 try {
                     var f = b.document,
                         g = f.body,
                         h = f.documentElement;
                     if (f.compatMode == "CSS1Compat" && h.scrollHeight) d = h.scrollHeight != c.height ? h.scrollHeight : h.offsetHeight, e = h.scrollWidth != c.width ? h.scrollWidth : h.offsetWidth;
                     else {
                         var k = h.scrollHeight,
                             l = h.scrollWidth,
                             n = h.offsetHeight,
                             p = h.offsetWidth;
                         h.clientHeight != n && (k = g.scrollHeight, l = g.scrollWidth, n = g.offsetHeight, p = g.offsetWidth);
                         k > c.height ? k > n ? (d = k, e = l) : (d = n, e = p) : k < n ? (d = k, e = l) : (d = n, e = p)
                     }
                     var q =
                         new qj(e, d);
                     break a
                 } catch (v) {
                     q = new qj(-12245933, -12245933);
                     break a
                 }
                 q = void 0
             }
             a.o = q
         },
         as = function(a) {
             P && P.document && (a.I = Or(!1, P, a.C), a.g = Or(!0, P, a.C), ds(a, P), cs(a, P))
         },
         fs = function() {
             var a = es();
             if (a.A > 0 || a.L) return !0;
             a = Zq().j.isVisible();
             var b = qm(gq) === 0;
             return a || b
         },
         es = function() {
             return K(bs)
         };
     var gs = function(a) {
         this.l = a;
         this.j = 0;
         this.g = null
     };
     gs.prototype.cancel = function() {
         Zq().clearTimeout(this.g);
         this.g = null
     };
     var hs = function(a) {
         var b = Zq(),
             c = dq().g.g;
         a.g = b.setTimeout(er(c, vr(143, function() {
             a.j++;
             a.l.sample()
         })), Er())
     };
     var is = function(a, b, c) {
         this.l = a;
         this.Aa = c === void 0 ? "na" : c;
         this.B = [];
         this.Da = !1;
         this.o = new Fr(-1, !0, this);
         this.g = this;
         this.L = b;
         this.H = this.F = !1;
         this.Z = "uk";
         this.P = !1;
         this.C = !0
     };
     is.prototype.G = function() {
         return !1
     };
     is.prototype.initialize = function() {
         return this.Da = !0
     };
     is.prototype.Zb = function() {
         return this.g.Z
     };
     is.prototype.Cc = function() {
         return this.g.H
     };
     var ks = function(a, b, c) {
         if (!a.H || (c === void 0 ? 0 : c)) a.H = !0, a.Z = b, a.L = 0, a.g != a || js(a)
     };
     is.prototype.getName = function() {
         return this.g.Aa
     };
     is.prototype.yb = function() {
         return this.g.ca()
     };
     is.prototype.ca = function() {
         return {}
     };
     is.prototype.fb = function() {
         return this.g.L
     };
     var ls = function(a, b) {
         qc(a.B, b) || (a.B.push(b), b.bc(a.g), b.Ab(a.o), b.Ya() && (a.F = !0))
     };
     is.prototype.U = function() {
         var a = es();
         a.g = Or(!0, this.l, a.C)
     };
     is.prototype.V = function() {
         cs(es(), this.l)
     };
     is.prototype.da = function() {
         return this.o.g
     };
     var ms = function(a) {
         a = a.g;
         a.V();
         a.U();
         var b = es();
         b.I = Or(!1, a.l, b.C);
         ds(es(), a.l);
         a.o.g = a.da()
     };
     is.prototype.sample = function() {};
     is.prototype.isActive = function() {
         return this.g.C
     };
     var ns = function(a) {
             a.F = a.B.length ? kc(a.B, function(b) {
                 return b.Ya()
             }) : !1
         },
         os = function(a) {
             var b = vc(a.B);
             ec(b, function(c) {
                 c.Ab(a.o)
             })
         },
         js = function(a) {
             var b = vc(a.B);
             ec(b, function(c) {
                 c.bc(a.g)
             });
             a.g != a || os(a)
         };
     m = is.prototype;
     m.bc = function(a) {
         var b = this.g;
         this.g = a.fb() >= this.L ? a : this;
         b !== this.g ? (this.C = this.g.C, js(this)) : this.C !== this.g.C && (this.C = this.g.C, js(this))
     };
     m.Ab = function(a) {
         if (a.j === this.g) {
             var b = !this.o.equals(a, this.F);
             this.o = a;
             b && os(this)
         }
     };
     m.Ya = function() {
         return this.F
     };
     m.dispose = function() {
         this.P = !0
     };
     m.Ia = function() {
         return this.P
     };
     var ps = function(a, b, c, d) {
         this.j = a;
         this.g = new J(0, 0, 0, 0);
         this.o = null;
         this.C = new J(0, 0, 0, 0);
         this.l = b;
         this.R = c;
         this.P = d;
         this.M = !1;
         this.timestamp = -1;
         this.G = new Gr(b.o, this.j, this.g, new J(0, 0, 0, 0), 0, 0, Dr(), 0);
         this.A = void 0
     };
     ps.prototype.Od = function() {
         return !0
     };
     ps.prototype.F = function() {};
     ps.prototype.dispose = function() {
         if (!this.Ia()) {
             var a = this.l;
             rc(a.B, this);
             a.F && this.Ya() && ns(a);
             this.F();
             this.M = !0
         }
     };
     ps.prototype.Ia = function() {
         return this.M
     };
     var qs = function(a, b) {
         return a.A ? new J(Math.max(b.top + a.A.top, b.top), Math.min(b.left + a.A.right, b.right), Math.min(b.top + a.A.bottom, b.bottom), Math.max(b.left + a.A.left, b.left)) : Xj(b)
     };
     m = ps.prototype;
     m.yb = function() {
         return this.l.yb()
     };
     m.fb = function() {
         return this.l.fb()
     };
     m.Zb = function() {
         return this.l.Zb()
     };
     m.Cc = function() {
         return this.l.Cc()
     };
     m.bc = function() {};
     m.Ab = function() {
         this.sb()
     };
     m.Ya = function() {
         return this.P
     };
     var rs = function(a) {
         this.B = !1;
         this.g = a;
         this.o = function() {}
     };
     m = rs.prototype;
     m.fb = function() {
         return this.g.fb()
     };
     m.Zb = function() {
         return this.g.Zb()
     };
     m.Cc = function() {
         return this.g.Cc()
     };
     m.create = function(a, b, c) {
         var d = null;
         this.g && (d = this.Pc(a, b, c), ls(this.g, d));
         return d
     };
     m.We = function() {
         return this.lc()
     };
     m.lc = function() {
         return !1
     };
     m.init = function(a) {
         return this.g.initialize() ? (ls(this.g, this), this.o = a, !0) : !1
     };
     m.bc = function(a) {
         a.fb() == 0 && this.o(a.Zb(), this)
     };
     m.Ab = function() {};
     m.Ya = function() {
         return !1
     };
     m.dispose = function() {
         this.B = !0
     };
     m.Ia = function() {
         return this.B
     };
     m.yb = function() {
         return {}
     };
     var ts = function(a, b, c) {
             this.l = c === void 0 ? 0 : c;
             this.j = a;
             this.g = b == null ? "" : b
         },
         us = function(a) {
             switch (Math.trunc(a.l)) {
                 case -16:
                     return -16;
                 case -8:
                     return -8;
                 case 0:
                     return 0;
                 case 8:
                     return 8;
                 case 16:
                     return 16;
                 default:
                     return 16
             }
         },
         vs = function(a, b) {
             return a.l < b.l ? !0 : a.l > b.l ? !1 : a.j < b.j ? !0 : a.j > b.j ? !1 : typeof a.g < typeof b.g ? !0 : typeof a.g > typeof b.g ? !1 : a.g < b.g
         };
     var ws = function() {
         this.l = 0;
         this.g = [];
         this.j = !1
     };
     ws.prototype.add = function(a, b, c) {
         ++this.l;
         a = new ts(a, b, c);
         this.g.push(new ts(a.j, a.g, a.l + this.l / 4096));
         this.j = !0;
         return this
     };
     var xs = function(a, b) {
             ec(b.g, function(c) {
                 a.add(c.j, c.g, us(c))
             })
         },
         ys = function(a, b) {
             var c = c === void 0 ? 0 : c;
             var d = d === void 0 ? !0 : d;
             hi(b, function(e, f) {
                 d && e === void 0 || a.add(f, e, c)
             });
             return a
         },
         As = function(a) {
             var b = zs;
             a.j && (yc(a.g, function(c, d) {
                 return vs(d, c) ? 1 : vs(c, d) ? -1 : 0
             }), a.j = !1);
             return jc(a.g, function(c, d) {
                 d = b(d);
                 return "" + c + (c != "" && d != "" ? "&" : "") + d
             }, "")
         };
     var zs = function(a) {
         var b = a.j;
         a = a.g;
         return a === "" ? b : typeof a === "boolean" ? a ? b : "" : Array.isArray(a) ? a.length === 0 ? b : b + "=" + a.join() : b + "=" + (qc(["mtos", "tos", "p"], b) ? a : encodeURIComponent(a))
     };
     var Bs = function(a) {
         var b = b === void 0 ? !0 : b;
         this.g = new ws;
         a !== void 0 && xs(this.g, a);
         b && this.g.add("v", "unreleased", -16)
     };
     Bs.prototype.toString = function() {
         var a = "//pagead2.googlesyndication.com//pagead/gen_204",
             b = As(this.g);
         b.length > 0 && (a += "?" + b);
         return a
     };
     var Cs = function(a) {
             var b = [],
                 c = [];
             rj(a, function(d, e) {
                 if (!(e in Object.prototype) && typeof d != "undefined") switch (Array.isArray(d) && (d = d.join(",")), d = [e, "=", d].join(""), e) {
                     case "adk":
                     case "r":
                     case "tt":
                     case "error":
                     case "mtos":
                     case "tos":
                     case "p":
                     case "bs":
                         b.unshift(d);
                         break;
                     case "req":
                     case "url":
                     case "referrer":
                     case "iframe_loc":
                         c.push(d);
                         break;
                     default:
                         b.push(d)
                 }
             });
             return b.concat(c)
         },
         Ds = function(a) {
             a = a.toString();
             Zq();
             sk(P, a)
         };
     var Es = function() {
         this.g = 0
     };

     function Fs(a) {
         a && typeof a.dispose == "function" && a.dispose()
     };
     var Q = function() {
         this.L = this.L;
         this.I = this.I
     };
     Q.prototype.L = !1;
     Q.prototype.Ia = function() {
         return this.L
     };
     Q.prototype.dispose = function() {
         this.L || (this.L = !0, this.O())
     };
     Q.prototype[Symbol.dispose] = function() {
         this.dispose()
     };
     var Hs = function(a, b) {
             Gs(a, ob(Fs, b))
         },
         Gs = function(a, b) {
             a.L ? b() : (a.I || (a.I = []), a.I.push(b))
         };
     Q.prototype.O = function() {
         if (this.I)
             for (; this.I.length;) this.I.shift()()
     };
     var Is = function(a, b, c) {
         ec(a.l, function(d) {
             var e = a.g;
             if (!d.g && (d.l(b, c), d.o())) {
                 d.g = !0;
                 var f = d.j(),
                     g = new ws;
                 g.add("id", "av-js");
                 g.add("type", "verif");
                 g.add("vtype", d.B);
                 d = K(Es);
                 g.add("i", d.g++);
                 g.add("adk", e);
                 ys(g, f);
                 e = new Bs(g);
                 Ds(e)
             }
         })
     };
     var Js = function() {
             this.j = this.l = this.o = this.g = 0
         },
         Ks = function(a, b, c, d) {
             b && (a.g += c, a.j += c, a.o += c, a.l = Math.max(a.l, a.o));
             if (d === void 0 ? !b : d) a.o = 0
         };
     var Ls = [1, .75, .5, .3, 0],
         Ms = function(a) {
             this.j = a = a === void 0 ? Ls : a;
             this.g = ic(this.j, function() {
                 return new Js
             })
         },
         Os = function(a, b) {
             return Ns(a, function(c) {
                 return c.g
             }, b === void 0 ? !0 : b)
         },
         Qs = function(a, b) {
             return Ps(a, b, function(c) {
                 return c.g
             })
         },
         Rs = function(a, b) {
             return Ns(a, function(c) {
                 return c.l
             }, b === void 0 ? !0 : b)
         },
         Ss = function(a, b) {
             return Ps(a, b, function(c) {
                 return c.l
             })
         },
         Ts = function(a, b) {
             return Ps(a, b, function(c) {
                 return c.j
             })
         },
         Us = function(a) {
             ec(a.g, function(b) {
                 b.j = 0
             })
         },
         Vs = function(a, b, c, d, e, f, g) {
             g = g === void 0 ?
                 !0 : g;
             c = f ? Math.min(b, c) : c;
             for (f = 0; f < a.j.length; f++) {
                 var h = a.j[f],
                     k = c > 0 && c >= h;
                 h = !(b > 0 && b >= h) || d;
                 Ks(a.g[f], g && k, e, !g || h)
             }
         },
         Ns = function(a, b, c) {
             a = ic(a.g, function(d) {
                 return b(d)
             });
             return c ? a : Ws(a)
         },
         Ps = function(a, b, c) {
             var d = pc(a.j, function(e) {
                 return b <= e
             });
             return d == -1 ? 0 : c(a.g[d])
         },
         Ws = function(a) {
             return ic(a, function(b, c, d) {
                 return c > 0 ? d[c] - d[c - 1] : d[c]
             })
         };
     var Xs = function() {
             this.j = new Ms;
             this.Z = this.V = 0;
             this.da = new Js;
             this.H = this.C = -1;
             this.Aa = 1E3;
             this.ra = new Ms([1, .9, .8, .7, .6, .5, .4, .3, .2, .1, 0]);
             this.P = this.K = -1
         },
         Ys = function(a, b) {
             return Rs(a.j, b === void 0 ? !0 : b)
         };
     Xs.prototype.L = function(a, b, c, d) {
         this.C = this.C != -1 ? Math.min(this.C, b.aa) : b.aa;
         this.H = Math.max(this.H, b.aa);
         this.K = this.K != -1 ? Math.min(this.K, b.xa) : b.xa;
         this.P = Math.max(this.P, b.xa);
         Vs(this.ra, b.xa, c.xa, b.g, a, d);
         this.V += a;
         b.aa === 0 && (this.Z += a);
         Vs(this.j, b.aa, c.aa, b.g, a, d);
         c = d || c.Pb != b.Pb ? c.isVisible() && b.isVisible() : c.isVisible();
         b = !b.isVisible() || b.g;
         Ks(this.da, c, a, b)
     };
     Xs.prototype.kb = function() {
         return this.da.l >= this.Aa
     };
     if (gq && gq.URL) {
         var Zs = gq.URL,
             $s;
         a: {
             if (Zs) {
                 var at = RegExp(".*[&#?]google_debug(=[^&]*)?(&.*)?$");
                 try {
                     var bt = at.exec(decodeURIComponent(Zs));
                     if (bt) {
                         $s = bt[1] && bt[1].length > 1 ? bt[1].substring(1) : "true";
                         break a
                     }
                 } catch (a) {}
             }
             $s = ""
         }
         rr.Ne(!($s.length > 0))
     }
     var ct = function(a, b, c, d) {
         var e = e === void 0 ? !1 : e;
         c = vr(d, c);
         qk(a, b, c, {
             capture: e
         })
     };
     var dt = new J(0, 0, 0, 0);

     function et(a, b) {
         b = ft(b);
         return b === 0 ? 0 : ft(a) / b
     }

     function ft(a) {
         return Math.max(a.bottom - a.top, 0) * Math.max(a.right - a.left, 0)
     }

     function gt(a, b) {
         if (!a || !b) return !1;
         for (var c = 0; a !== null && c++ < 100;) {
             if (a === b) return !0;
             try {
                 if (a = a.parentElement || a) {
                     var d = Ij(a),
                         e = d && Oj(d),
                         f = e && e.frameElement;
                     f && (a = f)
                 }
             } catch (g) {
                 break
             }
         }
         return !1
     }

     function ht(a, b, c) {
         if (!a || !b) return !1;
         b = Zj(Xj(a), -b.left, -b.top);
         a = (b.left + b.right) / 2;
         b = (b.top + b.bottom) / 2;
         ii(window.top) && window.top && window.top.document && (window = window.top);
         if (!Nr()) return !1;
         a = window.document.elementFromPoint(a, b);
         if (!a) return !1;
         b = (b = (b = Ij(c)) && b.defaultView && b.defaultView.frameElement) && gt(b, a);
         var d = a === c;
         a = !d && a && Vj(a, function(e) {
             return e === c
         });
         return !(b || d || a)
     }

     function it(a, b, c, d) {
         return es().l ? !1 : a.getWidth() <= 0 || a.getHeight() <= 0 ? !0 : c && d ? ur(208, function() {
             return ht(a, b, c)
         }) : !1
     };
     var jt = new J(0, 0, 0, 0),
         lt = function(a, b, c) {
             Q.call(this);
             this.position = Xj(jt);
             this.rd = this.dd();
             this.ke = -2;
             this.si = Date.now();
             this.Zf = -1;
             this.kd = b;
             this.jd = null;
             this.yc = !1;
             this.zd = null;
             this.opacity = -1;
             this.ci = c;
             this.ti = !1;
             this.oe = function() {};
             this.bg = function() {};
             this.Ca = new iq;
             this.Ca.Cb = a;
             this.Ca.g = a;
             this.gb = !1;
             this.Kb = {
                 qe: null,
                 pe: null
             };
             this.Tf = !0;
             this.Oc = null;
             this.dc = this.Hh = !1;
             dq().A++;
             this.wa = this.fe();
             this.Yf = -1;
             this.X = null;
             this.wf = this.Ch = !1;
             this.R = new Xp;
             fq(this.R);
             kt(this);
             this.ci == 1 ? $p(this.R,
                 "od", 1) : $p(this.R, "od", 0)
         };
     r(lt, Q);
     lt.prototype.O = function() {
         this.Ca.g && (this.Kb.qe && (rk(this.Ca.g, "mouseover", this.Kb.qe), this.Kb.qe = null), this.Kb.pe && (rk(this.Ca.g, "mouseout", this.Kb.pe), this.Kb.pe = null));
         this.Oc && this.Oc.dispose();
         this.X && this.X.dispose();
         delete this.rd;
         delete this.oe;
         delete this.bg;
         delete this.Ca.Cb;
         delete this.Ca.g;
         delete this.Kb;
         delete this.Oc;
         delete this.X;
         delete this.R;
         Q.prototype.O.call(this)
     };
     lt.prototype.zb = function() {
         return this.X ? this.X.g : this.position
     };
     lt.prototype.Ae = function(a) {
         dq().Ae(a)
     };
     var kt = function(a) {
         a = a.Ca.Cb;
         var b;
         if (b = a && a.getAttribute) b = /-[a-z]/.test("googleAvInapp") ? !1 : hq && a.dataset ? "googleAvInapp" in a.dataset : a.hasAttribute ? a.hasAttribute("data-" + Yi()) : !!a.getAttribute("data-" + Yi());
         b && (es().j = !0)
     };
     lt.prototype.Ya = function() {
         return !1
     };
     lt.prototype.dd = function() {
         return new Xs
     };
     lt.prototype.ua = function() {
         return this.rd
     };
     var mt = function(a, b) {
             b != a.dc && (a.dc = b, a = es(), b ? a.A++ : a.A > 0 && a.A--)
         },
         nt = function(a, b) {
             if (a.X) {
                 if (b.getName() === a.X.getName()) return;
                 a.X.dispose();
                 a.X = null
             }
             b = b.create(a.Ca.g, a.R, a.Ya());
             if (b = b != null && b.Od() ? b : null) a.X = b
         },
         ot = function(a, b, c) {
             if (!a.jd || a.kd == -1 || b.getTimestamp() === -1 || a.jd.getTimestamp() === -1) return 0;
             a = b.getTimestamp() - a.jd.getTimestamp();
             return a > c ? 0 : a
         };
     lt.prototype.sf = function(a) {
         return ot(this, a, 1E4)
     };
     var pt = function(a, b, c) {
             if (a.X) {
                 a.X.sb();
                 var d = a.X.G,
                     e = d.l,
                     f = e.g;
                 if (d.B != null) {
                     var g = d.j;
                     a.zd = new pj(g.left - f.left, g.top - f.top)
                 }
                 f = a.Id() ? Math.max(d.g, d.o) : d.g;
                 g = {};
                 e.volume !== null && (g.volume = e.volume);
                 e = a.sf(d);
                 a.jd = d;
                 a.Re(f, b, c, !1, g, e, d.A)
             }
         },
         qt = function(a) {
             if (a.yc && a.Oc) {
                 var b = aq(a.R, "od") == 1,
                     c = es().g,
                     d = a.Oc,
                     e = a.X ? a.X.getName() : "ns",
                     f = a.zd,
                     g = new qj(c.getWidth(), c.getHeight());
                 c = a.Id();
                 a = {
                     mi: e,
                     zd: f,
                     Fi: g,
                     Id: c,
                     aa: a.wa.aa,
                     Ai: b
                 };
                 if (b = d.j) {
                     b.sb();
                     e = b.G;
                     f = e.l.g;
                     var h = g = null;
                     e.B != null && f && (g = e.j, g = new pj(g.left -
                         f.left, g.top - f.top), h = new qj(f.right - f.left, f.bottom - f.top));
                     e = c ? Math.max(e.g, e.o) : e.g;
                     c = {
                         mi: b.getName(),
                         zd: g,
                         Fi: h,
                         Id: c,
                         Ai: !1,
                         aa: e
                     }
                 } else c = null;
                 c && Is(d, a, c)
             }
         };
     m = lt.prototype;
     m.Re = function(a, b, c, d, e, f, g) {
         this.gb || (this.yc && (a = this.Rd(a, c, e, g), d = d && this.wa.aa >= (this.Pb() ? .3 : .5), this.Se(f, a, d), this.kd = b, a.aa > 0 && -1 === this.Yf && (this.Yf = b), this.Zf == -1 && this.kb() && (this.Zf = b), this.ke == -2 && (this.ke = ft(this.zb()) ? a.aa : -1), this.wa = a), this.oe(this))
     };
     m.Se = function(a, b, c) {
         this.ua().L(a, b, this.wa, c)
     };
     m.fe = function() {
         return new Lp
     };
     m.Rd = function(a, b, c, d) {
         c = this.fe();
         c.g = b;
         b = Zq().j;
         b = qm(gq) === 0 ? -1 : b.isVisible() ? 0 : 1;
         c.j = b;
         c.aa = this.Wd(a);
         c.Pb = this.Pb();
         c.xa = d;
         return c
     };
     m.Wd = function(a) {
         return this.opacity === 0 && aq(this.R, "opac") === 1 ? 0 : a
     };
     m.Pb = function() {
         return !1
     };
     m.Id = function() {
         return this.Ch || this.Hh
     };
     m.Ha = function() {
         return 0
     };
     m.kb = function() {
         return this.rd.kb()
     };
     m.uf = function() {
         var a = this.yc;
         a = (this.wf || this.Ia()) && !a;
         var b = dq().j !== 2 || this.ti;
         return this.gb || b && a ? 2 : this.kb() ? 4 : 3
     };
     m.bd = function() {
         return 0
     };
     var rt = function(a, b, c) {
         b && (a.oe = b);
         c && (a.bg = c)
     };
     var tt = function() {};
     tt.prototype.next = function() {
         return ut
     };
     var ut = {
         done: !0,
         value: void 0
     };
     tt.prototype.Xb = function() {
         return this
     };
     var vt = function() {
             this.o = this.g = this.l = this.j = this.B = 0
         },
         wt = function(a) {
             var b = {};
             b = (b.ptlt = pb() - a.B, b);
             var c = a.j;
             c && (b.pnk = c);
             (c = a.l) && (b.pnc = c);
             (c = a.o) && (b.pnmm = c);
             (a = a.g) && (b.pns = a);
             return b
         };
     var xt = function() {
         Lp.call(this);
         this.fullscreen = !1;
         this.volume = void 0;
         this.l = !1;
         this.mediaTime = -1
     };
     r(xt, Lp);
     var yt = function(a) {
         return Wr(a.volume) && a.volume > 0
     };
     var At = function(a, b, c, d) {
             c = c === void 0 ? !0 : c;
             d = d === void 0 ? function() {
                 return !0
             } : d;
             return function(e) {
                 var f = e[a];
                 if (Array.isArray(f) && d(e)) return zt(f, b, c)
             }
         },
         Bt = function(a, b) {
             return function(c) {
                 return b(c) ? c[a] : void 0
             }
         },
         Ct = function(a) {
             return function(b) {
                 for (var c = 0; c < a.length; c++)
                     if (a[c] === b.e || a[c] === void 0 && !b.hasOwnProperty("e")) return !0;
                 return !1
             }
         },
         zt = function(a, b, c) {
             return c === void 0 || c ? hc(a, function(d, e) {
                 return qc(b, e)
             }) : ic(b, function(d, e, f) {
                 return a.slice(e > 0 ? f[e - 1] + 1 : 0, d + 1).reduce(function(g, h) {
                     return g +
                         h
                 }, 0)
             })
         };
     var Dt = Ct([void 0, 1, 2, 3, 4, 8, 16]),
         Et = Ct([void 0, 4, 8, 16]),
         Ft = {
             sv: "sv",
             v: "v",
             cb: "cb",
             e: "e",
             nas: "nas",
             msg: "msg",
             "if": "if",
             sdk: "sdk",
             p: "p",
             p0: Bt("p0", Et),
             p1: Bt("p1", Et),
             p2: Bt("p2", Et),
             p3: Bt("p3", Et),
             cp: "cp",
             tos: "tos",
             mtos: "mtos",
             amtos: "amtos",
             mtos1: At("mtos1", [0, 2, 4], !1, Et),
             mtos2: At("mtos2", [0, 2, 4], !1, Et),
             mtos3: At("mtos3", [0, 2, 4], !1, Et),
             mcvt: "mcvt",
             ps: "ps",
             scs: "scs",
             bs: "bs",
             vht: "vht",
             mut: "mut",
             a: "a",
             a0: Bt("a0", Et),
             a1: Bt("a1", Et),
             a2: Bt("a2", Et),
             a3: Bt("a3", Et),
             ft: "ft",
             dft: "dft",
             at: "at",
             dat: "dat",
             as: "as",
             vpt: "vpt",
             gmm: "gmm",
             std: "std",
             efpf: "efpf",
             swf: "swf",
             nio: "nio",
             px: "px",
             nnut: "nnut",
             vmer: "vmer",
             vmmk: "vmmk",
             vmiec: "vmiec",
             nmt: "nmt",
             tcm: "tcm",
             bt: "bt",
             pst: "pst",
             vpaid: "vpaid",
             dur: "dur",
             vmtime: "vmtime",
             dtos: "dtos",
             dtoss: "dtoss",
             dvs: "dvs",
             dfvs: "dfvs",
             dvpt: "dvpt",
             fmf: "fmf",
             vds: "vds",
             is: "is",
             i0: "i0",
             i1: "i1",
             i2: "i2",
             i3: "i3",
             ic: "ic",
             cs: "cs",
             c: "c",
             c0: Bt("c0", Et),
             c1: Bt("c1", Et),
             c2: Bt("c2", Et),
             c3: Bt("c3", Et),
             mc: "mc",
             nc: "nc",
             mv: "mv",
             nv: "nv",
             qmt: Bt("qmtos", Dt),
             qnc: Bt("qnc", Dt),
             qmv: Bt("qmv", Dt),
             qnv: Bt("qnv", Dt),
             raf: "raf",
             rafc: "rafc",
             lte: "lte",
             ces: "ces",
             tth: "tth",
             femt: "femt",
             femvt: "femvt",
             emc: "emc",
             emuc: "emuc",
             emb: "emb",
             avms: "avms",
             nvat: "nvat",
             qi: "qi",
             psm: "psm",
             psv: "psv",
             psfv: "psfv",
             psa: "psa",
             pnk: "pnk",
             pnc: "pnc",
             pnmm: "pnmm",
             pns: "pns",
             ptlt: "ptlt",
             pngs: "pings",
             veid: "veid",
             ssb: "ssb",
             ss0: Bt("ss0", Et),
             ss1: Bt("ss1", Et),
             ss2: Bt("ss2", Et),
             ss3: Bt("ss3", Et),
             dc_rfl: "urlsigs",
             obd: "obd",
             omidp: "omidp",
             omidr: "omidr",
             omidv: "omidv",
             omida: "omida",
             omids: "omids",
             omidpv: "omidpv",
             omidam: "omidam",
             omidct: "omidct",
             omidia: "omidia",
             omiddc: "omiddc",
             omidlat: "omidlat",
             omiddit: "omiddit",
             nopd: "nopd",
             co: "co",
             tm: "tm",
             tu: "tu"
         },
         Gt = Object.assign({}, Ft, {
             avid: function(a) {
                 return function() {
                     return a
                 }
             }("audio"),
             avas: "avas",
             vs: "vs"
         }),
         Ht = {
             atos: "atos",
             avt: At("atos", [2]),
             davs: "davs",
             dafvs: "dafvs",
             dav: "dav",
             ss: function(a, b) {
                 return function(c) {
                     return c[a] === void 0 && b !== void 0 ? b : c[a]
                 }
             }("ss", 0),
             t: "t"
         };
     var It = function() {
         this.j = this.g = ""
     };
     var Jt = function() {},
         Kt = function(a, b) {
             var c = {};
             if (a !== void 0)
                 if (b != null)
                     for (var d in b) {
                         var e = b[d];
                         d in Object.prototype || e != null && (c[d] = typeof e === "function" ? e(a) : a[e])
                     } else Gj(c, a);
             return As(ys(new ws, c))
         };
     var Lt = function() {
         var a = {};
         this.j = (a.vs = [1, 0], a.vw = [0, 1], a.am = [2, 2], a.a = [4, 4], a.f = [8, 8], a.bm = [16, 16], a.b = [32, 32], a.avw = [0, 64], a.avs = [64, 0], a.pv = [256, 256], a.gdr = [0, 512], a.p = [0, 1024], a.r = [0, 2048], a.m = [0, 4096], a.um = [0, 8192], a.ef = [0, 16384], a.s = [0, 32768], a.pmx = [0, 16777216], a.mut = [33554432, 33554432], a.umutb = [67108864, 67108864], a.tvoff = [134217728, 134217728], a);
         this.g = {};
         for (var b in this.j) this.j[b][1] > 0 && (this.g[b] = 0);
         this.l = 0
     };
     Lt.prototype.reportEvent = function(a) {
         var b = this.j[a],
             c = b[1];
         this.l += b[0];
         c > 0 && this.g[a] == 0 && (this.g[a] = 1)
     };
     var Mt = function(a) {
             var b = wj(a.j),
                 c = 0,
                 d;
             for (d in a.g) qc(b, d) && a.g[d] == 1 && (c += a.j[d][1], a.g[d] = 2);
             return c
         },
         Nt = function(a) {
             var b = 0,
                 c;
             for (c in a.g) {
                 var d = a.g[c];
                 if (d == 1 || d == 2) b += a.j[c][1]
             }
             return b
         };
     var Ot = function() {
         this.g = this.j = 0
     };
     Ot.prototype.getValue = function() {
         return this.j
     };
     var Pt = function(a, b, c) {
         b >= 32 || (a.g & 1 << b && !c ? a.j &= ~(1 << b) : a.g & 1 << b || !c || (a.j |= 1 << b), a.g |= 1 << b)
     };
     var Qt = function() {
         Xs.call(this);
         this.l = new Js;
         this.ca = this.F = this.M = 0;
         this.I = -1;
         this.Ba = new Js;
         this.B = new Js;
         this.g = new Ms;
         this.A = this.o = -1;
         this.G = new Js;
         this.Aa = 2E3;
         this.U = new Ot;
         this.ga = new Ot;
         this.fa = new Ot
     };
     r(Qt, Xs);
     var Rt = function(a, b, c) {
         var d = a.ca;
         Cr || c || a.I == -1 || (d += b - a.I);
         return d
     };
     Qt.prototype.L = function(a, b, c, d) {
         if (!b.l) {
             Xs.prototype.L.call(this, a, b, c, d);
             var e = yt(b) && yt(c),
                 f = (d ? Math.min(b.aa, c.aa) : c.aa) >= .5;
             Wr(b.volume) && (this.o = this.o != -1 ? Math.min(this.o, b.volume) : b.volume, this.A = Math.max(this.A, b.volume));
             f && (this.M += a, this.F += e ? a : 0);
             Vs(this.g, b.aa, c.aa, b.g, a, d, e);
             Ks(this.l, !0, a);
             Ks(this.B, e, a);
             Ks(this.G, c.fullscreen, a);
             Ks(this.Ba, e && !f, a);
             a = Math.floor(b.mediaTime / 1E3);
             Pt(this.U, a, b.isVisible());
             Pt(this.ga, a, b.aa >= 1);
             Pt(this.fa, a, yt(b))
         }
     };
     var St = function() {
         this.l = !1
     };
     St.prototype.j = function(a) {
         this.l || (this.g(a) ? (a = this.L.report(this.o, a), this.B |= a, a = a == 0) : a = !1, this.l = a)
     };
     var Tt = function(a, b) {
         this.l = !1;
         this.o = a;
         this.L = b;
         this.B = 0
     };
     r(Tt, St);
     Tt.prototype.g = function() {
         return !0
     };
     Tt.prototype.A = function() {
         return !1
     };
     Tt.prototype.getId = function() {
         var a = this,
             b = Aj(function(c) {
                 return c == a.o
             });
         return Lr[b].toString()
     };
     Tt.prototype.toString = function() {
         var a = "";
         this.A() && (a += "c");
         this.l && (a += "s");
         this.B > 0 && (a += ":" + this.B);
         return this.getId() + a
     };
     var Ut = function(a, b) {
         Tt.call(this, a, b);
         this.C = []
     };
     r(Ut, Tt);
     Ut.prototype.j = function(a, b) {
         b = b === void 0 ? null : b;
         b != null && this.C.push(b);
         Tt.prototype.j.call(this, a)
     };
     var Vt = function() {};
     var Wt = function() {};
     r(Wt, Vt);
     Wt.prototype.j = function() {
         return null
     };
     Wt.prototype.l = function() {
         return []
     };
     var Xt = function(a, b, c, d) {
         ps.call(this, a, b, c, d)
     };
     r(Xt, ps);
     m = Xt.prototype;
     m.Td = function() {
         if (this.j) {
             var a = this.j,
                 b = this.l.g.l;
             try {
                 try {
                     var c = Ur(a.getBoundingClientRect())
                 } catch (l) {
                     c = new J(0, 0, 0, 0)
                 }
                 var d = c.right - c.left,
                     e = c.bottom - c.top,
                     f = jk(a, b),
                     g = f.x,
                     h = f.y;
                 var k = new J(Math.round(h), Math.round(g + d), Math.round(h + e), Math.round(g))
             } catch (l) {
                 k = Xj(dt)
             }
             this.o = k;
             this.g = qs(this, this.o)
         }
     };
     m.hf = function() {
         this.C = this.l.o.g
     };
     m.xf = function(a) {
         var b = aq(this.R, "od") == 1;
         return it(a, this.C, this.j, b)
     };
     m.jf = function() {
         this.timestamp = Dr()
     };
     m.sb = function() {
         this.jf();
         this.Td();
         if (this.j && typeof this.j.videoWidth === "number" && typeof this.j.videoHeight === "number") {
             var a = this.j;
             var b = new qj(a.videoWidth, a.videoHeight);
             a = this.g;
             var c = a.getWidth(),
                 d = a.getHeight(),
                 e = b.width;
             b = b.height;
             e <= 0 || b <= 0 || c <= 0 || d <= 0 || (e /= b, a = Xj(a), e > c / d ? (c /= e, d = (d - c) / 2, d > 0 && (d = a.top + d, a.top = Math.round(d), a.bottom = Math.round(d + c))) : (d *= e, c = Math.round((c - d) / 2), c > 0 && (c = a.left + c, a.left = Math.round(c), a.right = Math.round(c + d))));
             this.g = a
         }
         this.hf();
         a = this.g;
         c = this.C;
         a = a.left <=
             c.right && c.left <= a.right && a.top <= c.bottom && c.top <= a.bottom ? new J(Math.max(a.top, c.top), Math.min(a.right, c.right), Math.min(a.bottom, c.bottom), Math.max(a.left, c.left)) : new J(0, 0, 0, 0);
         c = a.top >= a.bottom || a.left >= a.right ? new J(0, 0, 0, 0) : a;
         a = this.l.o;
         b = e = d = 0;
         if ((this.g.bottom - this.g.top) * (this.g.right - this.g.left) > 0)
             if (this.xf(c)) c = new J(0, 0, 0, 0);
             else {
                 d = es().B;
                 b = new J(0, d.height, d.width, 0);
                 var f;
                 d = et(c, (f = this.A) != null ? f : this.g);
                 e = et(c, es().g);
                 b = et(c, b)
             } f = c.top >= c.bottom || c.left >= c.right ? new J(0, 0, 0, 0) :
             Zj(c, -this.g.left, -this.g.top);
         fs() || (e = d = 0);
         this.G = new Gr(a, this.j, this.g, f, d, e, this.timestamp, b)
     };
     m.getName = function() {
         return this.l.getName()
     };
     var Yt = new J(0, 0, 0, 0),
         Zt = function(a, b, c) {
             ps.call(this, null, a, b, c);
             this.L = a.isActive();
             this.I = 0
         };
     r(Zt, Xt);
     m = Zt.prototype;
     m.Od = function() {
         this.B();
         return !0
     };
     m.Ab = function() {
         Xt.prototype.sb.call(this)
     };
     m.jf = function() {};
     m.Td = function() {};
     m.sb = function() {
         this.B();
         Xt.prototype.sb.call(this)
     };
     m.bc = function(a) {
         a = a.isActive();
         a !== this.L && (a ? this.B() : (es().g = new J(0, 0, 0, 0), this.g = new J(0, 0, 0, 0), this.C = new J(0, 0, 0, 0), this.timestamp = -1));
         this.L = a
     };

     function $t(a) {
         return [a.top, a.left, a.bottom, a.right]
     }
     var au = {},
         bu = (au.firstquartile = 0, au.midpoint = 1, au.thirdquartile = 2, au.complete = 3, au),
         cu = function(a, b, c, d, e, f) {
             f = f === void 0 ? new Wt : f;
             lt.call(this, b, c, d);
             this.ze = e;
             this.Zd = 0;
             this.la = {};
             this.ia = new Lt;
             this.eg = {};
             this.na = "";
             this.Eb = null;
             this.La = !1;
             this.g = [];
             this.nb = f.j();
             this.A = f.l();
             this.B = null;
             this.l = -1;
             this.ca = this.G = void 0;
             this.K = this.H = 0;
             this.U = -1;
             this.Aa = this.ga = !1;
             this.P = this.F = this.j = this.kc = this.Ka = 0;
             new Ms;
             this.V = this.da = 0;
             this.fa = -1;
             this.ma = 0;
             this.C = ki;
             this.M = [this.dd()];
             this.ub = 2;
             this.Vb = {};
             this.Vb.pause = "p";
             this.Vb.resume = "r";
             this.Vb.skip = "s";
             this.Vb.mute = "m";
             this.Vb.unmute = "um";
             this.Vb.exitfullscreen = "ef";
             this.o = null;
             this.ra = this.Ba = !1;
             this.bb = Math.floor(Date.now() / 1E3 - 1704067200);
             this.Z = 0
         };
     r(cu, lt);
     cu.prototype.Ya = function() {
         return !0
     };
     var du = function(a) {
             a.wf = !0;
             a.ma != 0 && (a.ma = 3)
         },
         eu = function(a) {
             return a === void 0 ? a : Number(a) ? Pr(a, 3) : 0
         };
     m = cu.prototype;
     m.sf = function(a) {
         return ot(this, a, Math.max(1E4, this.l / 3))
     };
     m.Re = function(a, b, c, d, e, f, g) {
         var h = this,
             k = this.C(this) || {};
         Gj(k, e);
         this.l = k.duration || this.l;
         this.G = k.isVpaid || this.G;
         this.ca = k.isYouTube || this.ca;
         Zq();
         this.ra = !1;
         e = fu(this, b);
         gu(this) === 1 && (f = e);
         lt.prototype.Re.call(this, a, b, c, d, k, f, g);
         this.nb && this.nb.l && ec(this.A, function(l) {
             l.j(h)
         })
     };
     m.Se = function(a, b, c) {
         lt.prototype.Se.call(this, a, b, c);
         hu(this).L(a, b, this.wa, c);
         this.Aa = yt(this.wa) && yt(b);
         this.U == -1 && this.ga && (this.U = this.ua().l.g);
         this.ia.l = 0;
         a = this.kb();
         b.isVisible() && this.ia.reportEvent("vs");
         a && this.ia.reportEvent("vw");
         Wr(b.volume) && this.ia.reportEvent("am");
         yt(b) ? this.ia.reportEvent("a") : this.ia.reportEvent("mut");
         this.dc && this.ia.reportEvent("f");
         b.j != -1 && (this.ia.reportEvent("bm"), b.j == 1 && (this.ia.reportEvent("b"), yt(b) && this.ia.reportEvent("umutb")));
         yt(b) && b.isVisible() &&
             this.ia.reportEvent("avs");
         this.Aa && a && this.ia.reportEvent("avw");
         b.aa > 0 && this.ia.reportEvent("pv");
         iu(this, this.ua().l.g, !0) && this.ia.reportEvent("gdr");
         Ss(this.ua().j, 1) >= 2E3 && this.ia.reportEvent("pmx");
         this.ra && this.ia.reportEvent("tvoff")
     };
     m.dd = function() {
         return new Qt
     };
     m.ua = function() {
         return this.rd
     };
     var hu = function(a, b) {
         return a.M[b != null && b < a.M.length ? b : a.M.length - 1]
     };
     cu.prototype.fe = function() {
         return new xt
     };
     cu.prototype.Rd = function(a, b, c, d) {
         a = lt.prototype.Rd.call(this, a, b, c, d === void 0 ? -1 : d);
         a.fullscreen = this.dc;
         a.l = this.ma == 2;
         a.volume = c.volume;
         Wr(a.volume) || (this.Ka++, b = this.wa, Wr(b.volume) && (a.volume = b.volume));
         c = c.currentTime;
         a.mediaTime = c !== void 0 && c >= 0 ? c : -1;
         return a
     };
     var gu = function(a) {
             var b = !!aq(dq().R, "umt");
             return a.G || !b && !a.ca ? 0 : 1
         },
         fu = function(a, b) {
             a.ma == 2 ? b = 0 : a.kd == -1 ? b = 0 : (b -= a.kd, b = b > Math.max(1E4, a.l / 3) ? 0 : b);
             var c = a.C(a) || {};
             c = c.currentTime !== void 0 ? c.currentTime : a.H;
             var d = c - a.H,
                 e = 0;
             d >= 0 ? (a.K += b, a.V += Math.max(b - d, 0), e = Math.min(d, a.K)) : a.da += Math.abs(d);
             d != 0 && (a.K = 0);
             a.fa == -1 && d > 0 && (a.fa = Br >= 0 ? Dr() - Br : -1);
             a.H = c;
             return e
         };
     cu.prototype.Wd = function(a) {
         return es(), this.dc ? 1 : lt.prototype.Wd.call(this, a)
     };
     cu.prototype.Ha = function() {
         return 1
     };
     cu.prototype.getDuration = function() {
         return this.l
     };
     var ju = function(a, b) {
             kc(a.A, function(c) {
                 return c.o == b.o
             }) || a.A.push(b)
         },
         ku = function(a) {
             var b = Qs(a.ua().g, 1);
             return iu(a, b)
         },
         iu = function(a, b, c) {
             return b >= 15E3 ? !0 : a.ga ? (c === void 0 ? 0 : c) ? !0 : a.l > 0 ? b >= a.l / 2 : a.U > 0 ? b >= a.U : !1 : !1
         },
         lu = function(a) {
             var b = {},
                 c = es();
             b.insideIframe = c.l;
             b.unmeasurable = a.gb;
             var d = a.zb(),
                 e = a.X ? a.X.o : null;
             b.position = d;
             e && !Yj(d, e) && (b.containerPosition = e);
             b.exposure = a.wa.aa;
             b.documentSize = c.o;
             b.viewportSize = new qj(c.g.getWidth(), c.g.getHeight());
             a.o != null && (b.presenceData = a.o);
             b.screenShare =
                 a.wa.xa;
             return b
         },
         mu = function(a) {
             var b = Pr(a.wa.aa, 2),
                 c = a.ia.l,
                 d = a.wa,
                 e = hu(a),
                 f = eu(e.o),
                 g = eu(e.A),
                 h = eu(d.volume),
                 k = Pr(e.C, 2),
                 l = Pr(e.H, 2),
                 n = Pr(d.aa, 2),
                 p = Pr(e.K, 2),
                 q = Pr(e.P, 2);
             d = Pr(d.xa, 2);
             var v = Xj(a.zb()).round();
             a = a.X && a.X.o ? Xj(a.X ? a.X.o : null).round() : null;
             e = Ys(e, !1);
             return {
                 Ei: b,
                 Dc: c,
                 td: f,
                 od: g,
                 sc: h,
                 ud: k,
                 pd: l,
                 aa: n,
                 wd: p,
                 qd: q,
                 xa: d,
                 position: v,
                 uc: a,
                 xd: e
             }
         },
         ou = function(a, b) {
             nu(a.g, b, function() {
                 return {
                     Ei: 0,
                     Dc: void 0,
                     td: -1,
                     od: -1,
                     sc: -1,
                     ud: -1,
                     pd: -1,
                     aa: -1,
                     wd: -1,
                     qd: -1,
                     xa: -1,
                     position: void 0,
                     uc: void 0,
                     xd: []
                 }
             });
             a.g[b] =
                 mu(a)
         },
         nu = function(a, b, c) {
             for (var d = a.length; d < b + 1;) a.push(c()), d++
         },
         ru = function(a, b, c) {
             var d = a.eg[b];
             if (d != null) return d;
             d = pu(a, b);
             var e = Aj(function(f) {
                 return f == b
             });
             a = qu(a, d, d, c, bu[Bj[e]]);
             b == "fully_viewable_audible_half_duration_impression" && (a.std = "csm");
             return a
         },
         tu = function(a, b, c) {
             var d = [b];
             if (a != b || c != b) d.unshift(a), d.push(c);
             return d
         },
         qu = function(a, b, c, d, e) {
             if (a.gb) return {
                 "if": 0,
                 vs: 0
             };
             var f = Xj(a.zb()).round(),
                 g = a.X ? a.X.o : null,
                 h = es(),
                 k = dq(),
                 l = a.ua(),
                 n = a.X ? a.X.getName() : "ns",
                 p = {};
             p["if"] = h.l ?
                 1 : void 0;
             p.sdk = a.B ? a.B : void 0;
             p.t = a.si;
             p.p = [f.top, f.left, f.bottom, f.right];
             f && g && !Yj(g, f) && (f = g.round(), p.cp = [f.top, f.left, f.bottom, f.right]);
             p.tos = Os(l.j, !1);
             p.mtos = Ys(l);
             p.mcvt = l.da.l;
             p.ps = void 0;
             p.vht = Rt(l, Dr(), a.ma == 2);
             p.mut = l.Ba.l;
             p.a = eu(a.wa.volume);
             p.mv = eu(l.A);
             p.fs = a.dc ? 1 : 0;
             p.ft = l.G.g;
             p.at = l.B.g;
             p.as = l.o > 0 ? 1 : 0;
             p.atos = Os(l.g);
             p.ssb = Os(l.ra, !1);
             p.amtos = Rs(l.g, !1);
             p.uac = a.Ka;
             p.vpt = l.l.g;
             n == "nio" && (p.nio = 1, p.avms = "nio");
             p.gmm = "4";
             p.gdr = iu(a, l.l.g, !0) ? 1 : 0;
             p.efpf = a.ub;
             if (n == "gsv" || n == "nis") n = a.X,
                 n.I > 0 && (p.nnut = n.I);
             p.tcm = gu(a);
             p.nmt = a.da;
             p.bt = a.V;
             p.pst = a.fa;
             p.vpaid = a.G;
             p.dur = a.l;
             p.vmtime = a.H;
             p.is = a.ia.l;
             a.g.length >= 1 && (p.i0 = a.g[0].Dc, p.a0 = [a.g[0].sc], p.c0 = [a.g[0].aa], p.ss0 = [a.g[0].xa], n = a.g[0].position, f = a.g[0].uc, p.p0 = n ? $t(n) : void 0, n && f && !Yj(f, n) && (p.cp0 = $t(f)));
             a.g.length >= 2 && (p.i1 = a.g[1].Dc, p.a1 = tu(a.g[1].td, a.g[1].sc, a.g[1].od), p.c1 = tu(a.g[1].ud, a.g[1].aa, a.g[1].pd), p.ss1 = tu(a.g[1].wd, a.g[1].xa, a.g[1].qd), n = a.g[1].position, f = a.g[1].uc, p.p1 = n ? $t(n) : void 0, n && f && !Yj(f, n) && (p.cp1 = $t(f)),
                 p.mtos1 = a.g[1].xd);
             a.g.length >= 3 && (p.i2 = a.g[2].Dc, p.a2 = tu(a.g[2].td, a.g[2].sc, a.g[2].od), p.c2 = tu(a.g[2].ud, a.g[2].aa, a.g[2].pd), p.ss2 = tu(a.g[2].wd, a.g[2].xa, a.g[2].qd), n = a.g[2].position, f = a.g[2].uc, p.p2 = n ? $t(n) : void 0, n && f && !Yj(f, n) && (p.cp2 = $t(f)), p.mtos2 = a.g[2].xd);
             a.g.length >= 4 && (p.i3 = a.g[3].Dc, p.a3 = tu(a.g[3].td, a.g[3].sc, a.g[3].od), p.c3 = tu(a.g[3].ud, a.g[3].aa, a.g[3].pd), p.ss3 = tu(a.g[3].wd, a.g[3].xa, a.g[3].qd), n = a.g[3].position, f = a.g[3].uc, p.p3 = n ? $t(n) : void 0, n && f && !Yj(f, n) && (p.cp3 = $t(f)), p.mtos3 =
                 a.g[3].xd);
             p.cs = Nt(a.ia);
             b && (p.ic = Mt(a.ia), p.dvpt = l.l.j, p.dvs = Ts(l.j, .5), p.dfvs = Ts(l.j, 1), p.davs = Ts(l.g, .5), p.dafvs = Ts(l.g, 1), c && (l.l.j = 0, Us(l.j), Us(l.g)), a.kb() && (p.dtos = l.M, p.dav = l.F, p.dtoss = a.Zd + 1, c && (l.M = 0, l.F = 0, a.Zd++)), p.dat = l.B.j, p.dft = l.G.j, c && (l.B.j = 0, l.G.j = 0));
             p.ps = [h.o.width, h.o.height];
             p.bs = [h.g.getWidth(), h.g.getHeight()];
             p.scs = [h.B.width, h.B.height];
             p.dom = h.domain;
             a.kc && (p.vds = a.kc);
             if (a.A.length > 0 || a.nb) b = vc(a.A), a.nb && b.push(a.nb), p.pings = ic(b, function(q) {
                 return q.toString()
             });
             b = ic(hc(a.A,
                 function(q) {
                     return q.A()
                 }), function(q) {
                 return q.getId()
             });
             wc(b);
             p.ces = b;
             a.j && (p.vmer = a.j);
             a.F && (p.vmmk = a.F);
             a.P && (p.vmiec = a.P);
             p.avms = a.X ? a.X.getName() : "ns";
             a.X && Gj(p, a.X.yb());
             d ? (p.c = Pr(a.wa.aa, 2), p.ss = Pr(a.wa.xa, 2)) : p.tth = Dr() - Ar;
             p.mc = Pr(l.H, 2);
             p.nc = Pr(l.C, 2);
             p.mv = eu(l.A);
             p.nv = eu(l.o);
             p.lte = Pr(a.ke, 2);
             d = hu(a, e);
             Ys(l);
             p.qmtos = Ys(d);
             p.qnc = Pr(d.C, 2);
             p.qmv = eu(d.A);
             p.qnv = eu(d.o);
             p.qas = d.o > 0 ? 1 : 0;
             p.qi = a.na;
             p.avms || (p.avms = "geo");
             p.psm = l.U.g;
             p.psv = l.U.getValue();
             p.psfv = l.ga.getValue();
             p.psa = l.fa.getValue();
             k = cq(k.R);
             k.length && (p.veid = k);
             a.o && Gj(p, wt(a.o));
             p.avas = a.bd();
             p.vs = a.uf();
             p.co = uu(a);
             p.tm = l.V;
             p.tu = l.Z;
             return p
         },
         pu = function(a, b) {
             if (qc(Kr, b)) return !0;
             var c = a.la[b];
             return c !== void 0 ? (a.la[b] = !0, !c) : !1
         };
     cu.prototype.uf = function() {
         return this.gb ? 2 : ku(this) ? 5 : this.kb() ? 4 : 3
     };
     cu.prototype.bd = function() {
         return this.Ba ? this.ua().B.l >= 2E3 ? 4 : 3 : 2
     };
     var uu = function(a) {
         var b = a.Z.toString(10).padStart(2, "0");
         b = "" + a.bb + b;
         a.Z < 99 && a.Z++;
         return b
     };
     var vu = pb(),
         yu = function() {
             this.g = {};
             var a = Oj();
             wu(this, a, document);
             var b = xu();
             try {
                 if ("1" == b) {
                     for (var c = a.parent; c != a.top; c = c.parent) wu(this, c, c.document);
                     wu(this, a.top, a.top.document)
                 }
             } catch (d) {}
         },
         xu = function() {
             var a = document.documentElement;
             try {
                 if (!ii(Oj().top)) return "2";
                 var b = [],
                     c = Oj(a.ownerDocument);
                 for (a = c; a != c.top; a = a.parent)
                     if (a.frameElement) b.push(a.frameElement);
                     else break;
                 return b && b.length != 0 ? "1" : "0"
             } catch (d) {
                 return "2"
             }
         },
         wu = function(a, b, c) {
             ct(c, "mousedown", function() {
                 return zu(a)
             }, 301);
             ct(b, "scroll", function() {
                 return Au(a)
             }, 302);
             ct(c, "touchmove", function() {
                 return Bu(a)
             }, 303);
             ct(c, "mousemove", function() {
                 return Cu(a)
             }, 304);
             ct(c, "keydown", function() {
                 return Du(a)
             }, 305)
         },
         zu = function(a) {
             rj(a.g, function(b) {
                 b.l > 1E5 || ++b.l
             })
         },
         Au = function(a) {
             rj(a.g, function(b) {
                 b.g > 1E5 || ++b.g
             })
         },
         Bu = function(a) {
             rj(a.g, function(b) {
                 b.g > 1E5 || ++b.g
             })
         },
         Du = function(a) {
             rj(a.g, function(b) {
                 b.j > 1E5 || ++b.j
             })
         },
         Cu = function(a) {
             rj(a.g, function(b) {
                 b.o > 1E5 || ++b.o
             })
         };
     var Eu = function() {
             this.g = [];
             this.j = []
         },
         Fu = function(a, b) {
             return mc(a.g, function(c) {
                 return c.na == b
             })
         },
         Gu = function(a, b) {
             return b ? mc(a.g, function(c) {
                 return c.Ca.Cb == b
             }) : null
         },
         Hu = function(a, b) {
             return mc(a.j, function(c) {
                 return c.Ha() == 2 && c.na == b
             })
         },
         Ju = function() {
             var a = Iu;
             return a.g.length == 0 ? a.j : a.j.length == 0 ? a.g : uc(a.j, a.g)
         };
     Eu.prototype.reset = function() {
         this.g = [];
         this.j = []
     };
     var Ku = function(a, b) {
             a = b.Ha() == 1 ? a.g : a.j;
             var c = nc(a, function(d) {
                 return d == b
             });
             return c != -1 ? (a.splice(c, 1), b.X && b.X.F(), b.dispose(), !0) : !1
         },
         Lu = function(a) {
             var b = Iu;
             if (Ku(b, a)) {
                 switch (a.Ha()) {
                     case 0:
                         var c = function() {
                             return null
                         };
                     case 2:
                         c = function() {
                             return Hu(b, a.na)
                         };
                         break;
                     case 1:
                         c = function() {
                             return Fu(b, a.na)
                         }
                 }
                 for (var d = c(); d; d = c()) Ku(b, d)
             }
         },
         Mu = function(a) {
             var b = Iu;
             a = hc(a, function(c) {
                 return !Gu(b, c.Ca.Cb)
             });
             b.g.push.apply(b.g, ua(a))
         },
         Nu = function(a) {
             var b = [];
             ec(a, function(c) {
                 kc(Iu.g, function(d) {
                     return d.Ca.Cb ===
                         c.Ca.Cb && d.na === c.na
                 }) || (Iu.g.push(c), b.push(c))
             })
         },
         Iu = K(Eu);
     var Ou = function() {
             this.g = this.j = null
         },
         Pu = function(a, b) {
             if (a.j == null) return !1;
             var c = function(d, e) {
                 b(d, e)
             };
             a.g = mc(a.j, function(d) {
                 return d != null && d.We()
             });
             a.g && (a.g.init(c) ? ms(a.g.g) : b(a.g.g.Zb(), a.g));
             return a.g != null
         };
     var Ru = function(a) {
         a = Qu(a);
         rs.call(this, a.length ? a[a.length - 1] : new is(P, 0));
         this.l = a;
         this.j = null
     };
     r(Ru, rs);
     m = Ru.prototype;
     m.getName = function() {
         return (this.j ? this.j : this.g).getName()
     };
     m.yb = function() {
         return (this.j ? this.j : this.g).yb()
     };
     m.fb = function() {
         return (this.j ? this.j : this.g).fb()
     };
     m.init = function(a) {
         var b = !1;
         ec(this.l, function(c) {
             c.initialize() && (b = !0)
         });
         b && (this.o = a, ls(this.g, this));
         return b
     };
     m.dispose = function() {
         ec(this.l, function(a) {
             a.dispose()
         });
         rs.prototype.dispose.call(this)
     };
     m.We = function() {
         return kc(this.l, function(a) {
             return a.G()
         })
     };
     m.lc = function() {
         return kc(this.l, function(a) {
             return a.G()
         })
     };
     m.Pc = function(a, b, c) {
         return new Xt(a, this.g, b, c)
     };
     m.Ab = function(a) {
         this.j = a.j
     };
     var Qu = function(a) {
         if (!a.length) return [];
         a = hc(a, function(c) {
             return c != null && c.G()
         });
         for (var b = 1; b < a.length; b++) ls(a[b - 1], a[b]);
         return a
     };
     var Su = {
             threshold: [0, .3, .5, .75, 1]
         },
         Tu = function(a, b, c, d) {
             ps.call(this, a, b, c, d);
             this.K = this.H = this.I = this.L = this.B = null
         };
     r(Tu, Xt);
     Tu.prototype.Od = function() {
         var a = this;
         this.K || (this.K = Dr());
         if (ur(298, function() {
                 return Uu(a)
             })) return !0;
         ks(this.l, "msf");
         return !1
     };
     Tu.prototype.F = function() {
         if (this.B && this.j) try {
             this.B.unobserve(this.j), this.L ? (this.L.unobserve(this.j), this.L = null) : this.I && (this.I.disconnect(), this.I = null)
         } catch (a) {}
     };
     var Vu = function(a) {
             return a.B && a.B.takeRecords ? a.B.takeRecords() : []
         },
         Uu = function(a) {
             if (!a.j) return !1;
             var b = a.j,
                 c = a.l.g.l,
                 d = dq().g.g;
             a.B = new c.IntersectionObserver(er(d, function(e) {
                 return Wu(a, e)
             }), Su);
             d = er(d, function() {
                 a.B.unobserve(b);
                 a.B.observe(b);
                 Wu(a, Vu(a))
             });
             c.ResizeObserver ? (a.L = new c.ResizeObserver(d), a.L.observe(b)) : c.MutationObserver && (a.I = new x.MutationObserver(d), a.I.observe(b, {
                 attributes: !0,
                 childList: !0,
                 characterData: !0,
                 subtree: !0
             }));
             a.B.observe(b);
             Wu(a, Vu(a));
             return !0
         },
         Wu = function(a,
             b) {
             try {
                 if (b.length) {
                     a.H || (a.H = Dr());
                     var c = Xu(b),
                         d = jk(a.j, a.l.g.l),
                         e = d.x,
                         f = d.y;
                     a.o = new J(Math.round(f), Math.round(e) + c.boundingClientRect.width, Math.round(f) + c.boundingClientRect.height, Math.round(e));
                     a.g = qs(a, a.o);
                     var g = Ur(c.intersectionRect);
                     a.C = Zj(g, a.o.left - g.left, a.o.top - g.top)
                 }
             } catch (h) {
                 a.F(), wr(299, h)
             }
         },
         Xu = function(a) {
             return jc(a, function(b, c) {
                 return b.time > c.time ? b : c
             }, a[0])
         };
     m = Tu.prototype;
     m.sb = function() {
         var a = Vu(this);
         a.length > 0 && Wu(this, a);
         Xt.prototype.sb.call(this)
     };
     m.Td = function() {};
     m.xf = function() {
         return !1
     };
     m.hf = function() {};
     m.yb = function() {
         var a = {};
         return Object.assign(this.l.yb(), (a.niot_obs = this.K, a.niot_cbk = this.H, a))
     };
     m.getName = function() {
         return "nio"
     };
     var Yu = function(a) {
         a = a === void 0 ? P : a;
         rs.call(this, new is(a, 2))
     };
     r(Yu, rs);
     Yu.prototype.getName = function() {
         return "nio"
     };
     Yu.prototype.lc = function() {
         return !es().j && this.g.g.l.IntersectionObserver != null
     };
     Yu.prototype.Pc = function(a, b, c) {
         return new Tu(a, this.g, b, c)
     };
     var $u = function() {
         var a = Zu();
         is.call(this, P.top, a, "geo")
     };
     r($u, is);
     $u.prototype.da = function() {
         return es().g
     };
     $u.prototype.G = function() {
         var a = Zu();
         this.L !== a && (this.g != this && a > this.g.L && (this.g = this, js(this)), this.L = a);
         return a == 2
     };
     var Zu = function() {
         dq();
         var a = es();
         return a.l || a.j ? 0 : 2
     };
     var av = function() {};
     var bv = function() {
             this.done = !1;
             this.g = {
                 Jg: 0,
                 bf: 0,
                 Ek: 0,
                 mf: 0,
                 he: -1,
                 Yg: 0,
                 Xg: 0,
                 Zg: 0,
                 li: 0
             };
             this.B = null;
             this.A = !1;
             this.l = null;
             this.C = 0;
             this.j = new gs(this)
         },
         ev = function() {
             var a = cv;
             a.A || (a.A = !0, dv(a, function() {
                 return a.o.apply(a, ua(Ra.apply(0, arguments)))
             }), a.o())
         };
     bv.prototype.sample = function() {
         fv(this, Ju(), !1)
     };
     var gv = function() {
             K(av);
             var a = K(Ou);
             a.g != null && a.g.g ? ms(a.g.g) : as(es())
         },
         fv = function(a, b, c) {
             if (!a.done && (a.j.cancel(), b.length != 0)) {
                 a.l = null;
                 try {
                     gv();
                     var d = Dr();
                     dq().B = d;
                     if (K(Ou).g != null)
                         for (var e = 0; e < b.length; e++) pt(b[e], d, c);
                     for (d = 0; d < b.length; d++) qt(b[d]);
                     ++a.g.mf
                 } finally {
                     c ? ec(b, function(f) {
                         f.wa.aa = 0
                     }) : hs(a.j)
                 }
             }
         },
         dv = function(a, b) {
             if (!a.B) {
                 b = vr(142, b);
                 Zq();
                 var c = rm(gq);
                 c && qk(gq, c, b, {
                     capture: !1
                 }) && (a.B = b)
             }
         };
     bv.prototype.o = function() {
         var a = fs(),
             b = Dr();
         a ? (Cr || (yr = b, ec(Iu.g, function(c) {
             var d = c.ua();
             d.ca = Rt(d, b, c.ma != 1)
         })), Cr = !0) : (this.C = hv(this, b), Cr = !1, Ar = b, ec(Iu.g, function(c) {
             c.yc && (c.ua().I = b)
         }));
         fv(this, Ju(), !a)
     };
     var iv = function() {
             var a = K(Ou);
             if (a.g != null) {
                 var b = a.g;
                 ec(Ju(), function(c) {
                     return nt(c, b)
                 })
             }
         },
         hv = function(a, b) {
             a = a.C;
             Cr && (a += b - yr);
             return a
         },
         jv = function(a) {
             a = a === void 0 ? function() {
                 return {}
             } : a;
             rr.Rf("av-js");
             nr.g = .01;
             tr([function(b) {
                 var c = dq(),
                     d = {};
                 d = (d.bin = c.j, d.type = "error", d);
                 c = bq(c.R);
                 if (!cv.l) {
                     var e = cv,
                         f = P.document,
                         g = zr >= 0 ? Dr() - zr : -1,
                         h = Dr();
                     e.g.he == -1 && (g = h);
                     var k = es(),
                         l = dq(),
                         n = bq(l.R),
                         p = Ju();
                     try {
                         if (p.length > 0) {
                             var q = k.g;
                             q && (n.bs = [q.getWidth(), q.getHeight()]);
                             var v = k.o;
                             v && (n.ps = [v.width, v.height]);
                             P.screen && (n.scs = [P.screen.width, P.screen.height])
                         } else n.url = encodeURIComponent(P.location.href.substring(0, 512)), f.referrer && (n.referrer = encodeURIComponent(f.referrer.substring(0, 512)));
                         n.tt = g;
                         n.pt = zr;
                         n.bin = l.j;
                         P.google_osd_load_pub_page_exp !== void 0 && (n.olpp = P.google_osd_load_pub_page_exp);
                         n.deb = [1, e.g.Jg, e.g.bf, e.g.mf, e.g.he, 0, e.j.j, e.g.Yg, e.g.Xg, e.g.Zg, e.g.li, -1].join(";");
                         n.tvt = hv(e, h);
                         k.j && (n.inapp = 1);
                         if (P !== null && P != P.top) {
                             p.length > 0 && (n.iframe_loc = encodeURIComponent(P.location.href.substring(0,
                                 512)));
                             var u = k.I;
                             n.is = [u.getWidth(), u.getHeight()]
                         }
                     } catch (y) {
                         n.error = 1
                     }
                     cv.l = n
                 }
                 v = cv.l;
                 q = {};
                 for (var t in v) q[t] = v[t];
                 t = dq().g;
                 if (aq(t.l, "prf") == 1) {
                     v = new cr;
                     u = t.g;
                     e = 0;
                     u.g > -1 && (e = u.l.g.now() - u.g);
                     u = u.o + e;
                     if (u != null && typeof u !== "number") throw Error("Value of float/double field must be a number, found " + typeof u + ": " + u);
                     v = Vf(v, 1, u, 0);
                     u = t.g;
                     v = xg(v, 5, u.g > -1 ? u.j + 1 : u.j);
                     v = yg(v, 2, t.j.g.l());
                     v = yg(v, 3, t.j.g.j());
                     t = yg(v, 4, t.j.g.g());
                     v = {};
                     t = (v.pf = cd(t.j()), v)
                 } else t = {};
                 Gj(q, t);
                 Gj(b, d, c, q, a())
             }])
         },
         cv = K(bv);
     var kv = null,
         lv = "",
         mv = !1,
         nv = function() {
             var a = kv || P;
             if (!a) return "";
             var b = [];
             if (!a.location || !a.location.href) return "";
             b.push("url=" + encodeURIComponent(a.location.href.substring(0, 512)));
             a.document && a.document.referrer && b.push("referrer=" + encodeURIComponent(a.document.referrer.substring(0, 512)));
             return b.join("&")
         };

     function ov() {
         var a = "av.default_js_unreleased_RCxx".match(/_(\d{8})_RC\d+$/) || "av.default_js_unreleased_RCxx".match(/_(\d{8})_\d+_\d+$/) || "av.default_js_unreleased_RCxx".match(/_(\d{8})_\d+\.\d+$/) || "av.default_js_unreleased_RCxx".match(/_(\d{8})_\d+_RC\d+$/),
             b;
         if (((b = a) == null ? void 0 : b.length) == 2) return a[1];
         a = "av.default_js_unreleased_RCxx".match(/.*_(\d{2})\.(\d{4})\.\d+_RC\d+$/);
         var c;
         return ((c = a) == null ? void 0 : c.length) == 3 ? "20" + a[1] + a[2] : null
     }
     var pv = function() {
             return "ima_html5_sdk".includes("ima_html5_sdk") ? {
                 Ta: "ima",
                 Ua: null
             } : "ima_html5_sdk".includes("ima_native_sdk") ? {
                 Ta: "nima",
                 Ua: null
             } : "ima_html5_sdk".includes("admob-native-video-javascript") ? {
                 Ta: "an",
                 Ua: null
             } : "av.default_js_unreleased_RCxx".includes("cast_js_sdk") ? {
                 Ta: "cast",
                 Ua: ov()
             } : "av.default_js_unreleased_RCxx".includes("youtube.player.web") ? {
                 Ta: "yw",
                 Ua: ov()
             } : "av.default_js_unreleased_RCxx".includes("outstream_web_client") ? {
                 Ta: "out",
                 Ua: ov()
             } : "av.default_js_unreleased_RCxx".includes("drx_rewarded_web") ? {
                 Ta: "r",
                 Ua: ov()
             } : "av.default_js_unreleased_RCxx".includes("gam_native_web_video") ? {
                 Ta: "n",
                 Ua: ov()
             } : "av.default_js_unreleased_RCxx".includes("admob_interstitial_video") ? {
                 Ta: "int",
                 Ua: ov()
             } : {
                 Ta: "j",
                 Ua: null
             }
         },
         qv = pv().Ta,
         rv = pv().Ua;
     var uv = function(a, b) {
             var c = {
                 sv: "968"
             };
             rv !== null && (c.v = rv);
             c.cb = qv;
             c.nas = Iu.g.length;
             c.msg = a;
             b !== void 0 && (a = tv(b)) && (c.e = Lr[a]);
             return c
         },
         vv = function(a) {
             return a.lastIndexOf("custom_metric_viewable", 0) == 0
         },
         tv = function(a) {
             var b = vv(a) ? "custom_metric_viewable" : a.toLowerCase();
             return Aj(function(c) {
                 return c == b
             })
         };
     var wv = {
             Yi: "visible",
             Ii: "audible",
             Uj: "time",
             Wj: "timetype"
         },
         xv = {
             visible: function(a) {
                 return /^(100|[0-9]{1,2})$/.test(a)
             },
             audible: function(a) {
                 return a == "0" || a == "1"
             },
             timetype: function(a) {
                 return a == "mtos" || a == "tos"
             },
             time: function(a) {
                 return /^(100|[0-9]{1,2})%$/.test(a) || /^([0-9])+ms$/.test(a)
             }
         },
         yv = function() {
             this.g = void 0;
             this.j = !1;
             this.l = 0;
             this.o = -1;
             this.B = "tos"
         },
         zv = function(a) {
             try {
                 var b = a.split(",");
                 return b.length > wj(wv).length ? null : jc(b, function(c, d) {
                     d = d.toLowerCase().split("=");
                     if (d.length != 2 || xv[d[0]] ===
                         void 0 || !xv[d[0]](d[1])) throw Error("Entry (" + d[0] + ", " + d[1] + ") is invalid.");
                     c[d[0]] = d[1];
                     return c
                 }, {})
             } catch (c) {
                 return null
             }
         },
         Av = function(a, b) {
             if (a.g == void 0) return 0;
             switch (a.B) {
                 case "mtos":
                     return a.j ? Ss(b.g, a.g) : Ss(b.j, a.g);
                 case "tos":
                     return a.j ? Qs(b.g, a.g) : Qs(b.j, a.g)
             }
             return 0
         };
     var Bv = function(a, b, c, d) {
         Tt.call(this, b, d);
         this.C = a;
         this.I = c
     };
     r(Bv, Tt);
     Bv.prototype.getId = function() {
         return this.C
     };
     Bv.prototype.A = function() {
         return !0
     };
     Bv.prototype.g = function(a) {
         var b = a.ua(),
             c = a.getDuration();
         return kc(this.I, function(d) {
             if (d.g != void 0) var e = Av(d, b);
             else b: {
                 switch (d.B) {
                     case "mtos":
                         e = d.j ? b.B.l : b.l.g;
                         break b;
                     case "tos":
                         e = d.j ? b.B.g : b.l.g;
                         break b
                 }
                 e = 0
             }
             e == 0 ? d = !1 : (d = d.l != -1 ? d.l : c !== void 0 && c > 0 ? d.o * c : -1, d = d != -1 && e >= d);
             return d
         })
     };
     var Cv = function() {};
     r(Cv, Jt);
     Cv.prototype.g = function(a) {
         var b = new It;
         b.g = Kt(a, Ft);
         b.j = Kt(a, Ht);
         return b
     };
     var Dv = function(a) {
         Tt.call(this, "fully_viewable_audible_half_duration_impression", a)
     };
     r(Dv, Tt);
     Dv.prototype.g = function(a) {
         return ku(a)
     };
     var Ev = function(a) {
         this.g = a
     };
     r(Ev, Vt);
     var Fv = function(a, b) {
         Tt.call(this, a, b)
     };
     r(Fv, Tt);
     Fv.prototype.g = function(a) {
         return a.ua().kb()
     };
     var Gv = function(a) {
         Ut.call(this, "measurable_impression", a)
     };
     r(Gv, Ut);
     Gv.prototype.g = function(a) {
         var b = qc(this.C, aq(dq().R, "ovms"));
         return !a.gb && (a.ma != 0 || b)
     };
     var Hv = function() {
         Ev.apply(this, arguments)
     };
     r(Hv, Ev);
     Hv.prototype.j = function() {
         return new Gv(this.g)
     };
     Hv.prototype.l = function() {
         return [new Fv("viewable_impression", this.g), new Dv(this.g)]
     };
     var Iv = function(a, b, c) {
         Zt.call(this, a, b, c)
     };
     r(Iv, Zt);
     Iv.prototype.B = function() {
         var a = Xa("ima.admob.getViewability"),
             b = aq(this.R, "queryid");
         typeof a === "function" && b && a(b)
     };
     Iv.prototype.getName = function() {
         return "gsv"
     };
     var Jv = function(a) {
         a = a === void 0 ? P : a;
         rs.call(this, new is(a, 2))
     };
     r(Jv, rs);
     Jv.prototype.getName = function() {
         return "gsv"
     };
     Jv.prototype.lc = function() {
         var a = es();
         dq();
         return a.j && !1
     };
     Jv.prototype.Pc = function(a, b, c) {
         return new Iv(this.g, b, c)
     };
     var Kv = function(a, b, c) {
         Zt.call(this, a, b, c)
     };
     r(Kv, Zt);
     Kv.prototype.B = function() {
         var a = this,
             b = Xa("ima.bridge.getNativeViewability"),
             c = aq(this.R, "queryid");
         typeof b === "function" && c && b(c, function(d) {
             Cj(d) && a.I++;
             var e = d.opt_nativeViewVisibleBounds || {},
                 f = d.opt_nativeViewHidden;
             a.g = Vr(d.opt_nativeViewBounds || {});
             var g = a.l.o;
             g.g = f ? Xj(Yt) : Vr(e);
             a.timestamp = d.opt_nativeTime || -1;
             es().g = g.g;
             d = d.opt_nativeVolume;
             d !== void 0 && (g.volume = d)
         })
     };
     Kv.prototype.getName = function() {
         return "nis"
     };
     var Lv = function(a) {
         a = a === void 0 ? P : a;
         rs.call(this, new is(a, 2))
     };
     r(Lv, rs);
     Lv.prototype.getName = function() {
         return "nis"
     };
     Lv.prototype.lc = function() {
         var a = es();
         dq();
         return a.j && !1
     };
     Lv.prototype.Pc = function(a, b, c) {
         return new Kv(this.g, b, c)
     };
     var Mv = function() {
         is.call(this, P, 2, "mraid");
         this.fa = 0;
         this.K = this.M = !1;
         this.I = null;
         this.j = Mr(this.l);
         this.o.g = new J(0, 0, 0, 0);
         this.ga = !1
     };
     r(Mv, is);
     Mv.prototype.G = function() {
         return this.j.Oa != null
     };
     Mv.prototype.ca = function() {
         var a = {};
         this.fa && (a.mraid = this.fa);
         this.M && (a.mlc = 1);
         a.mtop = this.j.ki;
         this.I && (a.mse = this.I);
         this.ga && (a.msc = 1);
         a.mcp = this.j.Yc;
         return a
     };
     Mv.prototype.A = function(a) {
         var b = Ra.apply(1, arguments);
         try {
             return this.j.Oa[a].apply(this.j.Oa, b)
         } catch (c) {
             wr(538, c, .01, function(d) {
                 d.method = a
             })
         }
     };
     var Nv = function(a, b, c) {
         a.A("addEventListener", b, c)
     };
     Mv.prototype.initialize = function() {
         var a = this;
         if (this.Da) return !this.Cc();
         this.Da = !0;
         if (this.j.Yc === 2) return this.I = "ng", ks(this, "w"), !1;
         if (this.j.Yc === 1) return this.I = "mm", ks(this, "w"), !1;
         es().L = !0;
         this.l.document.readyState && this.l.document.readyState == "complete" ? Ov(this) : ct(this.l, "load", function() {
             Zq().setTimeout(vr(292, function() {
                 return Ov(a)
             }), 100)
         }, 292);
         return !0
     };
     var Ov = function(a) {
             dq().o = !!a.A("isViewable");
             Nv(a, "viewableChange", Pv);
             a.A("getState") === "loading" ? Nv(a, "ready", Qv) : Rv(a)
         },
         Rv = function(a) {
             typeof a.j.Oa.AFMA_LIDAR === "string" ? (a.M = !0, Sv(a)) : (a.j.Yc = 3, a.I = "nc", ks(a, "w"))
         },
         Sv = function(a) {
             a.K = !1;
             var b = aq(dq().R, "rmmt") == 1,
                 c = !!a.A("isViewable");
             (b ? !c : 1) && Zq().setTimeout(vr(524, function() {
                 a.K || (Tv(a), wr(540, Error()), a.I = "mt", ks(a, "w"))
             }), 500);
             Uv(a);
             Nv(a, a.j.Oa.AFMA_LIDAR, Vv)
         },
         Uv = function(a) {
             var b = aq(dq().R, "sneio") == 1,
                 c = a.j.Oa.AFMA_LIDAR_EXP_1 !== void 0,
                 d = a.j.Oa.AFMA_LIDAR_EXP_2 !== void 0;
             (b = b && d) && (a.j.Oa.AFMA_LIDAR_EXP_2 = !0);
             c && (a.j.Oa.AFMA_LIDAR_EXP_1 = !b)
         },
         Tv = function(a) {
             a.A("removeEventListener", a.j.Oa.AFMA_LIDAR, Vv);
             a.M = !1
         };
     Mv.prototype.U = function() {
         var a = es(),
             b = Wv(this, "getMaxSize");
         a.g = new J(0, b.width, b.height, 0)
     };
     Mv.prototype.V = function() {
         es().B = Wv(this, "getScreenSize")
     };
     var Wv = function(a, b) {
         if (a.A("getState") === "loading") return new qj(-1, -1);
         b = a.A(b);
         if (!b) return new qj(-1, -1);
         a = parseInt(b.width, 10);
         b = parseInt(b.height, 10);
         return isNaN(a) || isNaN(b) ? new qj(-1, -1) : new qj(a, b)
     };
     Mv.prototype.dispose = function() {
         Tv(this);
         is.prototype.dispose.call(this)
     };
     var Qv = function() {
             try {
                 var a = K(Mv);
                 a.A("removeEventListener", "ready", Qv);
                 Rv(a)
             } catch (b) {
                 wr(541, b)
             }
         },
         Vv = function(a, b) {
             try {
                 var c = K(Mv);
                 c.K = !0;
                 var d = a ? new J(a.y, a.x + a.width, a.y + a.height, a.x) : new J(0, 0, 0, 0);
                 var e = Dr(),
                     f = fs();
                 var g = new Fr(e, f, c);
                 g.g = d;
                 g.volume = b;
                 c.Ab(g)
             } catch (h) {
                 wr(542, h)
             }
         },
         Pv = function(a) {
             var b = dq(),
                 c = K(Mv);
             a && !b.o && (b.o = !0, c.ga = !0, c.I && ks(c, "w", !0))
         };
     var hr = new function(a, b) {
         this.key = a;
         this.defaultValue = b === void 0 ? !1 : b;
         this.valueType = "boolean"
     }("45378663");
     var Yv = function() {
         this.l = this.Da = !1;
         this.g = this.j = null;
         var a = {};
         this.P = (a.start = this.yh, a.firstquartile = this.sh, a.midpoint = this.uh, a.thirdquartile = this.zh, a.complete = this.ph, a.error = this.qh, a.pause = this.ye, a.resume = this.Qf, a.skip = this.xh, a.viewable_impression = this.Wa, a.mute = this.jc, a.unmute = this.jc, a.fullscreen = this.th, a.exitfullscreen = this.rh, a.fully_viewable_audible_half_duration_impression = this.Wa, a.measurable_impression = this.Wa, a.abandon = this.ye, a.engagedview = this.Wa, a.impression = this.Wa, a.creativeview =
             this.Wa, a.progress = this.jc, a.custom_metric_viewable = this.Wa, a.bufferstart = this.ye, a.bufferfinish = this.Qf, a.audio_measurable = this.Wa, a.audio_audible = this.Wa, a);
         a = {};
         this.V = (a.overlay_resize = this.wh, a.abandon = this.ge, a.close = this.ge, a.collapse = this.ge, a.overlay_unmeasurable_impression = function(b) {
             return ru(b, "overlay_unmeasurable_impression", fs())
         }, a.overlay_viewable_immediate_impression = function(b) {
             return ru(b, "overlay_viewable_immediate_impression", fs())
         }, a.overlay_unviewable_impression = function(b) {
             return ru(b,
                 "overlay_unviewable_impression", fs())
         }, a.overlay_viewable_end_of_session_impression = function(b) {
             return ru(b, "overlay_viewable_end_of_session_impression", fs())
         }, a);
         dq().j = 3;
         Xv(this);
         this.I = null
     };
     Yv.prototype.B = function(a) {
         mt(a, !1);
         Lu(a)
     };
     Yv.prototype.L = function() {};
     var Zv = function(a, b, c, d) {
         a = a.A(null, d, !0, b);
         a.B = c;
         Mu([a]);
         return a
     };
     Yv.prototype.A = function(a, b, c, d) {
         var e = this;
         a = new cu(P, a, c ? b : -1, 7, this.Xd(), this.lf());
         a.na = d;
         Zp(a.R);
         $p(a.R, "queryid", a.na);
         a.Ae("");
         rt(a, function() {
             return e.M.apply(e, ua(Ra.apply(0, arguments)))
         }, function() {
             return e.U.apply(e, ua(Ra.apply(0, arguments)))
         });
         (d = K(Ou).g) && nt(a, d);
         this.I && (a.X && (a.X.A = this.I), this.I = null);
         a.Ca.Cb && K(av);
         return a
     };
     var $v = function(a, b, c) {
             Hp(b);
             var d = a.g;
             ec(b, function(e) {
                 var f = ic(e.g, function(g) {
                     var h = zv(g);
                     if (h == null) g = null;
                     else if (g = new yv, h.visible != null && (g.g = h.visible / 100), h.audible != null && (g.j = h.audible == 1), h.time != null) {
                         var k = h.timetype == "mtos" ? "mtos" : "tos",
                             l = Cb(h.time, "%") ? "%" : "ms";
                         h = parseInt(h.time, 10);
                         l == "%" && (h /= 100);
                         l == "ms" ? (g.l = h, g.o = -1) : (g.l = -1, g.o = h);
                         g.B = k === void 0 ? "tos" : k
                     }
                     return g
                 });
                 kc(f, function(g) {
                     return g == null
                 }) || ju(c, new Bv(e.id, e.event, f, d))
             })
         },
         aw = function() {
             var a = [],
                 b = dq();
             a.push(K($u));
             aq(b.R, "mvp_lv") && a.push(K(Mv));
             b = [new Jv, new Lv];
             b.push(new Ru(a));
             b.push(new Yu(P));
             return b
         },
         cw = function(a) {
             if (!a.Da) {
                 a.Da = !0;
                 try {
                     var b = Dr(),
                         c = dq(),
                         d = es();
                     zr = b;
                     c.l = 79463069;
                     a.j !== "o" && (kv = ji(P));
                     if ($q()) {
                         cv.g.bf = 0;
                         cv.g.he = Dr() - b;
                         var e = aw(),
                             f = K(Ou);
                         f.j = e;
                         Pu(f, function() {
                             bw()
                         }) ? cv.done || (iv(), ls(f.g.g, a), ev()) : d.l ? bw() : ev()
                     } else mv = !0
                 } catch (g) {
                     throw Iu.reset(), g;
                 }
             }
         },
         dw = function(a) {
             cv.j.cancel();
             lv = a;
             cv.done = !0
         },
         ew = function(a) {
             if (a.j) return a.j;
             var b = K(Ou).g;
             if (b) switch (b.getName()) {
                 case "nis":
                     a.j =
                         "n";
                     break;
                 case "gsv":
                     a.j = "m"
             }
             a.j || (a.j = "h");
             return a.j
         },
         fw = function(a, b, c) {
             if (a.g == null) return b.kc |= 4, !1;
             a = a.g.report(c, b);
             b.kc |= a;
             return a == 0
         };
     Yv.prototype.bc = function(a) {
         switch (a.fb()) {
             case 0:
                 if (a = K(Ou).g) a = a.g, rc(a.B, this), a.F && this.Ya() && ns(a);
                 bw();
                 break;
             case 2:
                 ev()
         }
     };
     Yv.prototype.Ab = function() {};
     Yv.prototype.Ya = function() {
         return !1
     };
     var bw = function() {
         var a = [new Yu(P)],
             b = K(Ou);
         b.j = a;
         Pu(b, function() {
             dw("i")
         }) ? cv.done || (iv(), ev()) : dw("i")
     };
     Yv.prototype.U = function(a, b) {
         a.gb = !0;
         switch (a.Ha()) {
             case 1:
                 gw(a, b);
                 break;
             case 2:
                 this.Fe(a)
         }
         this.Je(a)
     };
     var gw = function(a, b) {
         if (!a.La) {
             var c = ru(a, "start", fs());
             c = a.ze.g(c).g;
             var d = {
                 id: "lidarv"
             };
             d.r = b;
             d.sv = "968";
             rv !== null && (d.v = rv);
             cp(c, function(e, f) {
                 return d[e] = e == "mtos" || e == "tos" ? f : encodeURIComponent(f)
             });
             b = nv();
             cp(b, function(e, f) {
                 return d[e] = encodeURIComponent(f)
             });
             b = "//pagead2.googlesyndication.com/pagead/gen_204?" + As(ys(new ws, d));
             Ds(b);
             a.La = !0
         }
     };
     m = Yv.prototype;
     m.yh = function(a) {
         var b = a.C(a);
         b && (b = b.volume, a.Ba = Wr(b) && b > 0);
         ou(a, 0);
         return ru(a, "start", fs())
     };
     m.jc = function(a, b, c) {
         fv(cv, [a], !fs());
         return this.Wa(a, b, c)
     };
     m.Wa = function(a, b, c) {
         return ru(a, c, fs())
     };
     m.sh = function(a) {
         return hw(a, "firstquartile", 1)
     };
     m.uh = function(a) {
         a.ga = !0;
         return hw(a, "midpoint", 2)
     };
     m.zh = function(a) {
         return hw(a, "thirdquartile", 3)
     };
     m.ph = function(a) {
         var b = hw(a, "complete", 4);
         du(a);
         return b
     };
     m.qh = function(a) {
         a.ma = 3;
         return ru(a, "error", fs())
     };
     var hw = function(a, b, c) {
         fv(cv, [a], !fs());
         ou(a, c);
         c != 4 && nu(a.M, c, a.dd);
         return ru(a, b, fs())
     };
     m = Yv.prototype;
     m.Qf = function(a, b, c) {
         b = fs();
         a.ma != 2 || b || (a.ua().I = Dr());
         fv(cv, [a], !b);
         a.ma == 2 && (a.ma = 1);
         return ru(a, c, b)
     };
     m.xh = function(a, b) {
         b = this.jc(a, b || {}, "skip");
         du(a);
         return b
     };
     m.th = function(a, b) {
         mt(a, !0);
         return this.jc(a, b || {}, "fullscreen")
     };
     m.rh = function(a, b) {
         mt(a, !1);
         return this.jc(a, b || {}, "exitfullscreen")
     };
     m.ye = function(a, b, c) {
         b = a.ua();
         b.ca = Rt(b, Dr(), a.ma != 1);
         fv(cv, [a], !fs());
         a.ma == 1 && (a.ma = 2);
         return ru(a, c, fs())
     };
     m.wh = function(a) {
         fv(cv, [a], !fs());
         return a.j()
     };
     m.ge = function(a) {
         fv(cv, [a], !fs());
         this.Nf(a);
         du(a);
         return a.j()
     };
     var Xv = function(a) {
             jv(function() {
                 var b = iw();
                 a.j != null && (b.sdk = a.j);
                 var c = K(Ou);
                 c.g != null && (b.avms = c.g.getName());
                 return b
             })
         },
         jw = function(a, b, c, d) {
             var e = Gu(Iu, c);
             e !== null && e.na !== b && (a.B(e), e = null);
             e || (b = a.A(c, Dr(), !1, b), Iu.j.length == 0 && (dq().l = 79463069), Nu([b]), e = b, e.B = ew(a), d && (e.Eb = d));
             return e
         };
     Yv.prototype.M = function() {};
     var lw = function(a, b) {
         b.F = 0;
         for (var c in Hr) a[c] == null && (b.F |= Hr[c]);
         kw(a, "currentTime");
         kw(a, "duration")
     };
     m = Yv.prototype;
     m.Fe = function() {};
     m.Nf = function() {};
     m.Xe = function() {};
     m.Je = function() {};
     m.Yd = function() {};
     m.lf = function() {
         this.g || (this.g = this.Yd());
         return this.g == null || this.l ? new Wt : new Hv(this.g)
     };
     m.Xd = function() {
         return new Cv
     };
     var kw = function(a, b) {
             var c = a[b];
             c !== void 0 && c > 0 && (a[b] = Math.floor(c * 1E3))
         },
         iw = function() {
             var a = es(),
                 b = {},
                 c = {},
                 d = {};
             return Object.assign({}, (b.sv = "968", b), rv !== null && (c.v = rv, c), (d["if"] = a.l ? "1" : "0", d.nas = String(Iu.g.length), d))
         };
     var mw = function(a) {
         Tt.call(this, "audio_audible", a)
     };
     r(mw, Tt);
     mw.prototype.g = function(a) {
         return a.bd() == 4
     };
     var nw = function(a) {
         Ut.call(this, "audio_measurable", a)
     };
     r(nw, Ut);
     nw.prototype.g = function(a) {
         a = a.bd();
         return a == 3 || a == 4
     };
     var ow = function() {
         Ev.apply(this, arguments)
     };
     r(ow, Ev);
     ow.prototype.j = function() {
         return new nw(this.g)
     };
     ow.prototype.l = function() {
         return [new mw(this.g)]
     };
     var pw = function() {};
     r(pw, Jt);
     pw.prototype.g = function(a) {
         a && (a.e === 28 && (a = Object.assign({}, a, {
             avas: 3
         })), a.vs === 4 || a.vs === 5) && (a = Object.assign({}, a, {
             vs: 3
         }));
         var b = new It;
         b.g = Kt(a, Gt);
         b.j = Kt(a, Ht);
         return b
     };
     var qw = function(a) {
         this.j = a
     };
     qw.prototype.report = function(a, b) {
         var c = this.g(b);
         if (typeof c === "function") {
             var d = {};
             var e = {};
             d = Object.assign({}, rv !== null && (d.v = rv, d), (e.sv = "968", e.cb = qv, e.e = rw(a), e));
             e = ru(b, a, fs());
             Gj(d, e);
             b.eg[a] = e;
             d = b.Ha() == 2 ? Cs(d).join("&") : b.ze.g(d).g;
             try {
                 return c(b.na, d, a), 0
             } catch (f) {
                 return 2
             }
         } else return 1
     };
     var rw = function(a) {
         var b = vv(a) ? "custom_metric_viewable" : a;
         a = Aj(function(c) {
             return c == b
         });
         return Lr[a]
     };
     qw.prototype.g = function() {
         return Xa(this.j)
     };
     var tw = function(a, b) {
         this.j = a;
         this.l = b
     };
     r(tw, qw);
     tw.prototype.g = function(a) {
         if (!a.Eb) return qw.prototype.g.call(this, a);
         if (this.l[a.Eb]) return function() {};
         wr(393, Error());
         return null
     };
     var uw = function() {
         Yv.call(this);
         this.G = void 0;
         this.H = null;
         this.F = !1;
         this.o = {};
         this.K = 0;
         this.C = "ACTIVE_VIEW_TRAFFIC_TYPE_UNSPECIFIED"
     };
     r(uw, Yv);
     uw.prototype.L = function(a, b) {
         var c = this,
             d = K(Ou);
         if (d.g != null) switch (d.g.getName()) {
             case "nis":
                 var e = vw(this, a, b);
                 break;
             case "gsv":
                 e = ww(this, a, b);
                 break;
             case "exc":
                 e = xw(this, a)
         }
         e || (b.opt_overlayAdElement ? e = void 0 : b.opt_adElement && (e = jw(this, a, b.opt_adElement, b.opt_osdId)));
         e && e.Ha() == 1 && (e.C == ki && (e.C = function(f) {
             return c.Xe(f)
         }), yw(this, e, b));
         return e
     };
     var yw = function(a, b, c) {
         c = c.opt_configurable_tracking_events;
         a.g != null && Array.isArray(c) && $v(a, c, b)
     };
     uw.prototype.Xe = function(a) {
         a.j = 0;
         a.P = 0;
         if (a.B == "h" || a.B == "n") {
             var b;
             dq();
             if (a.Eb && zw(this)) {
                 var c = this.o[a.Eb];
                 c ? b = function(e) {
                     return Aw(c, e)
                 } : c !== null && wr(379, Error())
             } else b = Xa("ima.common.getVideoMetadata");
             if (typeof b === "function") try {
                 var d = b(a.na)
             } catch (e) {
                 a.j |= 4
             } else a.j |= 2
         } else if (a.B == "b")
             if (b = Xa("ytads.bulleit.getVideoMetadata"), typeof b === "function") try {
                 d = b(a.na)
             } catch (e) {
                 a.j |= 4
             } else a.j |= 2;
             else if (a.B == "ml")
             if (b = Xa("ima.common.getVideoMetadata"), typeof b === "function") try {
                 d = b(a.na)
             } catch (e) {
                 a.j |=
                     4
             } else a.j |= 2;
             else a.j |= 1;
         a.j || (d === void 0 ? a.j |= 8 : d === null ? a.j |= 16 : Cj(d) ? a.j |= 32 : d.errorCode != null && (a.P = d.errorCode, a.j |= 64));
         d == null && (d = {});
         lw(d, a);
         Wr(d.volume) && Wr(this.G) && (d.volume *= this.G);
         return d
     };
     var ww = function(a, b, c) {
             var d = Fu(Iu, b);
             d || (d = c.opt_nativeTime || -1, d = Zv(a, b, ew(a), d), c.opt_osdId && (d.Eb = c.opt_osdId));
             return d
         },
         vw = function(a, b, c) {
             var d = Fu(Iu, b);
             d || (d = Zv(a, b, "n", c.opt_nativeTime || -1));
             return d
         },
         xw = function(a, b) {
             var c = Fu(Iu, b);
             c || (c = Zv(a, b, "h", -1));
             return c
         };
     uw.prototype.Yd = function() {
         if (zw(this)) return new tw("ima.common.triggerExternalActivityEvent", this.o);
         var a = Bw(this);
         return a != null ? new qw(a) : null
     };
     var Bw = function(a) {
         dq();
         switch (ew(a)) {
             case "b":
                 return "ytads.bulleit.triggerExternalActivityEvent";
             case "n":
                 return "ima.bridge.triggerExternalActivityEvent";
             case "h":
             case "m":
             case "ml":
                 return "ima.common.triggerExternalActivityEvent"
         }
         return null
     };
     uw.prototype.Fe = function(a) {
         !a.g && a.gb && fw(this, a, "overlay_unmeasurable_impression") && (a.g = !0)
     };
     uw.prototype.Nf = function(a) {
         a.Tf && (a.kb() ? fw(this, a, "overlay_viewable_end_of_session_impression") : fw(this, a, "overlay_unviewable_impression"), a.Tf = !1)
     };
     var Cw = function(a, b, c, d) {
         c = c === void 0 ? {} : c;
         var e = {};
         Gj(e, {
             opt_adElement: void 0,
             opt_fullscreen: void 0
         }, c);
         var f = a.L(b, c);
         c = f ? f.ze : a.Xd();
         if (e.opt_bounds) return c.g(uv("ol", d));
         if (d !== void 0)
             if (tv(d) !== void 0)
                 if (mv) a = uv("ue", d);
                 else if (cw(a), lv == "i") a = uv("i", d), a["if"] = 0;
         else if (b = a.L(b, e)) {
             b: {
                 lv == "i" && (b.gb = !0, a.Je(b));f = e.opt_fullscreen;f !== void 0 && mt(b, !!f);
                 var g;
                 if (f = !es().j && !$r()) Zq(),
                 f = qm(gq) === 0;
                 if (g = f) {
                     switch (b.Ha()) {
                         case 1:
                             gw(b, "pv");
                             break;
                         case 2:
                             a.Fe(b)
                     }
                     dw("pv")
                 }
                 f = d.toLowerCase();
                 if (g = !g) c: {
                     if (aq(dq().R,
                             "ssmol") && (g = a.l, f === "loaded")) break c;g = qc(Ir, f)
                 }
                 if (g && b.ma == 0) {
                     lv != "i" && (cv.done = !1);
                     g = e !== void 0 ? e.opt_nativeTime : void 0;
                     Br = g = typeof g === "number" ? g : Dr();
                     b.yc = !0;
                     var h = fs();
                     b.ma = 1;
                     b.la = {};
                     b.la.start = !1;
                     b.la.firstquartile = !1;
                     b.la.midpoint = !1;
                     b.la.thirdquartile = !1;
                     b.la.complete = !1;
                     b.la.resume = !1;
                     b.la.pause = !1;
                     b.la.skip = !1;
                     b.la.mute = !1;
                     b.la.unmute = !1;
                     b.la.viewable_impression = !1;
                     b.la.measurable_impression = !1;
                     b.la.fully_viewable_audible_half_duration_impression = !1;
                     b.la.fullscreen = !1;
                     b.la.exitfullscreen = !1;
                     b.Zd = 0;
                     h || (b.ua().I = g);
                     fv(cv, [b], !h)
                 }(g = b.Vb[f]) && b.ia.reportEvent(g);aq(dq().R, "fmd") || qc(Jr, f) && b.nb && b.nb.j(b, null);
                 switch (b.Ha()) {
                     case 1:
                         var k = vv(f) ? a.P.custom_metric_viewable : a.P[f];
                         break;
                     case 2:
                         k = a.V[f]
                 }
                 if (k && (d = k.call(a, b, e, d), aq(dq().R, "fmd") && qc(Jr, f) && b.nb && b.nb.j(b, null), d !== void 0)) {
                     e = uv(void 0, f);
                     Gj(e, d);
                     d = e;
                     break b
                 }
                 d = void 0
             }
             b.ma == 3 && a.B(b);a = d
         }
         else a = uv("nf", d);
         else a = void 0;
         else mv ? a = uv("ue") : f ? (a = uv(), Gj(a, qu(f, !0, !1, !1))) : a = uv("nf");
         return typeof a === "string" ? c.g() : c.g(a)
     };
     uw.prototype.M = function(a) {
         this.l && a.Ha() == 1 && Dw(this, a)
     };
     uw.prototype.Je = function(a) {
         this.l && a.Ha() == 1 && Dw(this, a)
     };
     var Dw = function(a, b) {
             var c;
             if (b.Eb && zw(a)) {
                 var d = a.o[b.Eb];
                 d ? c = function(f, g) {
                     Ew(d, f, g)
                 } : d !== null && wr(379, Error())
             } else c = Xa("ima.common.triggerViewabilityMeasurementUpdate");
             if (typeof c === "function") {
                 var e = lu(b);
                 e.nativeVolume = a.G;
                 c(b.na, e)
             }
         },
         zw = function(a) {
             return (dq(), ew(a) != "h" && ew(a) != "m") ? !1 : a.K != 0
         };
     uw.prototype.A = function(a, b, c, d) {
         if (ir()) {
             var e = aq(dq().R, "mm"),
                 f = {};
             (e = (f[Kp.gg] = "ACTIVE_VIEW_TRAFFIC_TYPE_AUDIO", f[Kp.VIDEO] = "ACTIVE_VIEW_TRAFFIC_TYPE_VIDEO", f)[e]) && e && (this.C = e);
             this.C === "ACTIVE_VIEW_TRAFFIC_TYPE_UNSPECIFIED" && wr(1044, Error())
         }
         a = Yv.prototype.A.call(this, a, b, c, d);
         this.F && (b = this.H, a.o == null && (a.o = new vt), b.g[a.na] = a.o, a.o.B = vu);
         return a
     };
     uw.prototype.B = function(a) {
         a && a.Ha() == 1 && this.F && delete this.H.g[a.na];
         return Yv.prototype.B.call(this, a)
     };
     uw.prototype.lf = function() {
         this.g || (this.g = this.Yd());
         return this.g == null || this.l ? new Wt : this.C === "ACTIVE_VIEW_TRAFFIC_TYPE_AUDIO" ? new ow(this.g) : new Hv(this.g)
     };
     uw.prototype.Xd = function() {
         return this.C === "ACTIVE_VIEW_TRAFFIC_TYPE_AUDIO" ? new pw : new Cv
     };
     var Fw = function(a) {
             var b = {};
             return b.viewability = a.g, b.googleViewability = a.j, b
         },
         Gw = function(a, b, c) {
             c = c === void 0 ? {} : c;
             a = Cw(K(uw), b, c, a);
             return Fw(a)
         },
         Hw = vr(193, Gw, void 0, iw);
     z("Goog_AdSense_Lidar_sendVastEvent", Hw);
     var Iw = vr(194, function(a, b) {
         b = b === void 0 ? {} : b;
         a = Cw(K(uw), a, b);
         return Fw(a)
     });
     z("Goog_AdSense_Lidar_getViewability", Iw);
     var Jw = vr(195, function() {
         return ar()
     });
     z("Goog_AdSense_Lidar_getUrlSignalsArray", Jw);
     var Kw = vr(196, function() {
         return JSON.stringify(ar())
     });
     z("Goog_AdSense_Lidar_getUrlSignalsList", Kw);
     var Lw = wa(["//ep2.adtrafficquality.google/sodar/", ""]),
         Mw = wa(["//tpc.googlesyndication.com/sodar/", ""]);
     x.console && typeof x.console.log === "function" && nb(x.console.log, x.console);
     var Nw = function(a) {
         for (var b = [], c = a = Oj(a.ownerDocument); c != a.top; c = c.parent)
             if (c.frameElement) b.push(c.frameElement);
             else break;
         return b
     };
     var Ow = function(a, b) {
         this.type = a;
         this.currentTarget = this.target = b;
         this.defaultPrevented = !1
     };
     Ow.prototype.preventDefault = function() {
         this.defaultPrevented = !0
     };
     var Pw = function(a, b) {
         Ow.call(this, a ? a.type : "");
         this.relatedTarget = this.currentTarget = this.target = null;
         this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0;
         this.key = "";
         this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
         this.state = null;
         this.pointerId = 0;
         this.pointerType = "";
         this.qc = null;
         a && this.init(a, b)
     };
     sb(Pw, Ow);
     Pw.prototype.init = function(a, b) {
         var c = this.type = a.type,
             d = a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : null;
         this.target = a.target || a.srcElement;
         this.currentTarget = b;
         b = a.relatedTarget;
         b || (c == "mouseover" ? b = a.fromElement : c == "mouseout" && (b = a.toElement));
         this.relatedTarget = b;
         d ? (this.clientX = d.clientX !== void 0 ? d.clientX : d.pageX, this.clientY = d.clientY !== void 0 ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0) : (this.clientX = a.clientX !== void 0 ? a.clientX : a.pageX, this.clientY =
             a.clientY !== void 0 ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0);
         this.button = a.button;
         this.key = a.key || "";
         this.ctrlKey = a.ctrlKey;
         this.altKey = a.altKey;
         this.shiftKey = a.shiftKey;
         this.metaKey = a.metaKey;
         this.pointerId = a.pointerId || 0;
         this.pointerType = a.pointerType;
         this.state = a.state;
         this.qc = a;
         a.defaultPrevented && Pw.Za.preventDefault.call(this)
     };
     Pw.prototype.preventDefault = function() {
         Pw.Za.preventDefault.call(this);
         var a = this.qc;
         a.preventDefault ? a.preventDefault() : a.returnValue = !1
     };
     var Qw = "closure_listenable_" + (Math.random() * 1E6 | 0),
         Rw = function(a) {
             return !(!a || !a[Qw])
         };
     var Sw = 0;
     var Tw = function(a, b, c, d, e) {
             this.listener = a;
             this.proxy = null;
             this.src = b;
             this.type = c;
             this.capture = !!d;
             this.handler = e;
             this.key = ++Sw;
             this.Nc = this.Vc = !1
         },
         Uw = function(a) {
             a.Nc = !0;
             a.listener = null;
             a.proxy = null;
             a.src = null;
             a.handler = null
         };

     function Vw(a) {
         this.src = a;
         this.g = {};
         this.j = 0
     }
     Vw.prototype.add = function(a, b, c, d, e) {
         var f = a.toString();
         a = this.g[f];
         a || (a = this.g[f] = [], this.j++);
         var g = Ww(a, b, d, e);
         g > -1 ? (b = a[g], c || (b.Vc = !1)) : (b = new Tw(b, this.src, f, !!d, e), b.Vc = c, a.push(b));
         return b
     };
     Vw.prototype.remove = function(a, b, c, d) {
         a = a.toString();
         if (!(a in this.g)) return !1;
         var e = this.g[a];
         b = Ww(e, b, c, d);
         return b > -1 ? (Uw(e[b]), sc(e, b), e.length == 0 && (delete this.g[a], this.j--), !0) : !1
     };
     var Xw = function(a, b) {
         var c = b.type;
         c in a.g && rc(a.g[c], b) && (Uw(b), a.g[c].length == 0 && (delete a.g[c], a.j--))
     };
     Vw.prototype.Ac = function(a, b, c, d) {
         a = this.g[a.toString()];
         var e = -1;
         a && (e = Ww(a, b, c, d));
         return e > -1 ? a[e] : null
     };
     var Ww = function(a, b, c, d) {
         for (var e = 0; e < a.length; ++e) {
             var f = a[e];
             if (!f.Nc && f.listener == b && f.capture == !!c && f.handler == d) return e
         }
         return -1
     };
     var Yw = "closure_lm_" + (Math.random() * 1E6 | 0),
         Zw = {},
         $w = 0,
         bx = function(a, b, c, d, e) {
             if (d && d.once) return ax(a, b, c, d, e);
             if (Array.isArray(b)) {
                 for (var f = 0; f < b.length; f++) bx(a, b[f], c, d, e);
                 return null
             }
             c = cx(c);
             return Rw(a) ? a.listen(b, c, db(d) ? !!d.capture : !!d, e) : dx(a, b, c, !1, d, e)
         },
         dx = function(a, b, c, d, e, f) {
             if (!b) throw Error("Invalid event type");
             var g = db(e) ? !!e.capture : !!e,
                 h = ex(a);
             h || (a[Yw] = h = new Vw(a));
             c = h.add(b, c, d, g, f);
             if (c.proxy) return c;
             d = fx();
             c.proxy = d;
             d.src = a;
             d.listener = c;
             if (a.addEventListener) oj || (e = g), e ===
                 void 0 && (e = !1), a.addEventListener(b.toString(), d, e);
             else if (a.attachEvent) a.attachEvent(gx(b.toString()), d);
             else if (a.addListener && a.removeListener) a.addListener(d);
             else throw Error("addEventListener and attachEvent are unavailable.");
             $w++;
             return c
         },
         fx = function() {
             var a = hx,
                 b = function(c) {
                     return a.call(b.src, b.listener, c)
                 };
             return b
         },
         ax = function(a, b, c, d, e) {
             if (Array.isArray(b)) {
                 for (var f = 0; f < b.length; f++) ax(a, b[f], c, d, e);
                 return null
             }
             c = cx(c);
             return Rw(a) ? a.Gc(b, c, db(d) ? !!d.capture : !!d, e) : dx(a, b, c, !0, d,
                 e)
         },
         ix = function(a, b, c, d, e) {
             if (Array.isArray(b))
                 for (var f = 0; f < b.length; f++) ix(a, b[f], c, d, e);
             else d = db(d) ? !!d.capture : !!d, c = cx(c), Rw(a) ? a.ab(b, c, d, e) : a && (a = ex(a)) && (b = a.Ac(b, c, d, e)) && jx(b)
         },
         jx = function(a) {
             if (typeof a !== "number" && a && !a.Nc) {
                 var b = a.src;
                 if (Rw(b)) Xw(b.B, a);
                 else {
                     var c = a.type,
                         d = a.proxy;
                     b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent ? b.detachEvent(gx(c), d) : b.addListener && b.removeListener && b.removeListener(d);
                     $w--;
                     (c = ex(b)) ? (Xw(c, a), c.j == 0 && (c.src = null, b[Yw] = null)) :
                     Uw(a)
                 }
             }
         },
         gx = function(a) {
             return a in Zw ? Zw[a] : Zw[a] = "on" + a
         },
         hx = function(a, b) {
             if (a.Nc) a = !0;
             else {
                 b = new Pw(b, this);
                 var c = a.listener,
                     d = a.handler || a.src;
                 a.Vc && jx(a);
                 a = c.call(d, b)
             }
             return a
         },
         ex = function(a) {
             a = a[Yw];
             return a instanceof Vw ? a : null
         },
         kx = "__closure_events_fn_" + (Math.random() * 1E9 >>> 0),
         cx = function(a) {
             if (typeof a === "function") return a;
             a[kx] || (a[kx] = function(b) {
                 return a.handleEvent(b)
             });
             return a[kx]
         };
     var R = function() {
         Q.call(this);
         this.B = new Vw(this);
         this.jh = this;
         this.Aa = null
     };
     sb(R, Q);
     R.prototype[Qw] = !0;
     m = R.prototype;
     m.addEventListener = function(a, b, c, d) {
         bx(this, a, b, c, d)
     };
     m.removeEventListener = function(a, b, c, d) {
         ix(this, a, b, c, d)
     };
     m.dispatchEvent = function(a) {
         var b, c = this.Aa;
         if (c)
             for (b = []; c; c = c.Aa) b.push(c);
         c = this.jh;
         var d = a.type || a;
         if (typeof a === "string") a = new Ow(a, c);
         else if (a instanceof Ow) a.target = a.target || c;
         else {
             var e = a;
             a = new Ow(d, c);
             Gj(a, e)
         }
         e = !0;
         var f;
         if (b)
             for (f = b.length - 1; f >= 0; f--) {
                 var g = a.currentTarget = b[f];
                 e = lx(g, d, !0, a) && e
             }
         g = a.currentTarget = c;
         e = lx(g, d, !0, a) && e;
         e = lx(g, d, !1, a) && e;
         if (b)
             for (f = 0; f < b.length; f++) g = a.currentTarget = b[f], e = lx(g, d, !1, a) && e;
         return e
     };
     m.O = function() {
         R.Za.O.call(this);
         this.Ee();
         this.Aa = null
     };
     m.listen = function(a, b, c, d) {
         return this.B.add(String(a), b, !1, c, d)
     };
     m.Gc = function(a, b, c, d) {
         return this.B.add(String(a), b, !0, c, d)
     };
     m.ab = function(a, b, c, d) {
         this.B.remove(String(a), b, c, d)
     };
     m.Ee = function() {
         if (this.B) {
             var a = this.B,
                 b = 0,
                 c;
             for (c in a.g) {
                 for (var d = a.g[c], e = 0; e < d.length; e++) ++b, Uw(d[e]);
                 delete a.g[c];
                 a.j--
             }
         }
     };
     var lx = function(a, b, c, d) {
         b = a.B.g[String(b)];
         if (!b) return !0;
         b = b.concat();
         for (var e = !0, f = 0; f < b.length; ++f) {
             var g = b[f];
             if (g && !g.Nc && g.capture == c) {
                 var h = g.listener,
                     k = g.handler || g.src;
                 g.Vc && Xw(a.B, g);
                 e = h.call(k, d) !== !1 && e
             }
         }
         return e && !d.defaultPrevented
     };
     R.prototype.Ac = function(a, b, c, d) {
         return this.B.Ac(String(a), b, c, d)
     };
     var mx = typeof AsyncContext !== "undefined" && typeof AsyncContext.Snapshot === "function" ? function(a) {
         return a && AsyncContext.Snapshot.wrap(a)
     } : function(a) {
         return a
     };
     var nx = function(a, b) {
         this.l = a;
         this.o = b;
         this.j = 0;
         this.g = null
     };
     nx.prototype.get = function() {
         if (this.j > 0) {
             this.j--;
             var a = this.g;
             this.g = a.next;
             a.next = null
         } else a = this.l();
         return a
     };
     var ox = function(a, b) {
         a.o(b);
         a.j < 100 && (a.j++, b.next = a.g, a.g = b)
     };
     var px = function() {
         this.j = this.g = null
     };
     px.prototype.add = function(a, b) {
         var c = qx.get();
         c.set(a, b);
         this.j ? this.j.next = c : this.g = c;
         this.j = c
     };
     px.prototype.remove = function() {
         var a = null;
         this.g && (a = this.g, this.g = this.g.next, this.g || (this.j = null), a.next = null);
         return a
     };
     var qx = new nx(function() {
             return new rx
         }, function(a) {
             return a.reset()
         }),
         rx = function() {
             this.next = this.g = this.j = null
         };
     rx.prototype.set = function(a, b) {
         this.j = a;
         this.g = b;
         this.next = null
     };
     rx.prototype.reset = function() {
         this.next = this.g = this.j = null
     };
     var sx, tx = !1,
         ux = new px,
         wx = function(a, b) {
             sx || vx();
             tx || (sx(), tx = !0);
             ux.add(a, b)
         },
         vx = function() {
             var a = Promise.resolve(void 0);
             sx = function() {
                 a.then(xx)
             }
         };

     function xx() {
         for (var a; a = ux.remove();) {
             try {
                 a.j.call(a.g)
             } catch (b) {
                 Bb(b)
             }
             ox(qx, a)
         }
         tx = !1
     };
     var yx = function(a) {
         if (!a) return !1;
         try {
             return !!a.$goog_Thenable
         } catch (b) {
             return !1
         }
     };
     var Ax = function(a) {
             this.g = 0;
             this.C = void 0;
             this.o = this.j = this.l = null;
             this.B = this.A = !1;
             if (a != ki) try {
                 var b = this;
                 a.call(void 0, function(c) {
                     zx(b, 2, c)
                 }, function(c) {
                     zx(b, 3, c)
                 })
             } catch (c) {
                 zx(this, 3, c)
             }
         },
         Bx = function() {
             this.next = this.context = this.j = this.l = this.g = null;
             this.o = !1
         };
     Bx.prototype.reset = function() {
         this.context = this.j = this.l = this.g = null;
         this.o = !1
     };
     var Cx = new nx(function() {
             return new Bx
         }, function(a) {
             a.reset()
         }),
         Dx = function(a, b, c) {
             var d = Cx.get();
             d.l = a;
             d.j = b;
             d.context = c;
             return d
         };
     Ax.prototype.then = function(a, b, c) {
         return Ex(this, mx(typeof a === "function" ? a : null), mx(typeof b === "function" ? b : null), c)
     };
     Ax.prototype.$goog_Thenable = !0;
     Ax.prototype.I = function(a, b) {
         return Ex(this, null, mx(a), b)
     };
     Ax.prototype.catch = Ax.prototype.I;
     Ax.prototype.cancel = function(a) {
         if (this.g == 0) {
             var b = new Fx(a);
             wx(function() {
                 Gx(this, b)
             }, this)
         }
     };
     var Gx = function(a, b) {
             if (a.g == 0)
                 if (a.l) {
                     var c = a.l;
                     if (c.j) {
                         for (var d = 0, e = null, f = null, g = c.j; g && (g.o || (d++, g.g == a && (e = g), !(e && d > 1))); g = g.next) e || (f = g);
                         e && (c.g == 0 && d == 1 ? Gx(c, b) : (f ? (d = f, d.next == c.o && (c.o = d), d.next = d.next.next) : Hx(c), Ix(c, e, 3, b)))
                     }
                     a.l = null
                 } else zx(a, 3, b)
         },
         Kx = function(a, b) {
             a.j || a.g != 2 && a.g != 3 || Jx(a);
             a.o ? a.o.next = b : a.j = b;
             a.o = b
         },
         Ex = function(a, b, c, d) {
             var e = Dx(null, null, null);
             e.g = new Ax(function(f, g) {
                 e.l = b ? function(h) {
                     try {
                         var k = b.call(d, h);
                         f(k)
                     } catch (l) {
                         g(l)
                     }
                 } : f;
                 e.j = c ? function(h) {
                     try {
                         var k = c.call(d,
                             h);
                         k === void 0 && h instanceof Fx ? g(h) : f(k)
                     } catch (l) {
                         g(l)
                     }
                 } : g
             });
             e.g.l = a;
             Kx(a, e);
             return e.g
         };
     Ax.prototype.F = function(a) {
         this.g = 0;
         zx(this, 2, a)
     };
     Ax.prototype.G = function(a) {
         this.g = 0;
         zx(this, 3, a)
     };
     var zx = function(a, b, c) {
             if (a.g == 0) {
                 a === c && (b = 3, c = new TypeError("Promise cannot resolve to itself"));
                 a.g = 1;
                 a: {
                     var d = c,
                         e = a.F,
                         f = a.G;
                     if (d instanceof Ax) {
                         Kx(d, Dx(e || ki, f || null, a));
                         var g = !0
                     } else if (yx(d)) d.then(e, f, a),
                     g = !0;
                     else {
                         if (db(d)) try {
                             var h = d.then;
                             if (typeof h === "function") {
                                 Lx(d, h, e, f, a);
                                 g = !0;
                                 break a
                             }
                         } catch (k) {
                             f.call(a, k);
                             g = !0;
                             break a
                         }
                         g = !1
                     }
                 }
                 g || (a.C = c, a.g = b, a.l = null, Jx(a), b != 3 || c instanceof Fx || Mx(a, c))
             }
         },
         Lx = function(a, b, c, d, e) {
             var f = !1,
                 g = function(k) {
                     f || (f = !0, c.call(e, k))
                 },
                 h = function(k) {
                     f || (f = !0, d.call(e,
                         k))
                 };
             try {
                 b.call(a, g, h)
             } catch (k) {
                 h(k)
             }
         },
         Jx = function(a) {
             a.A || (a.A = !0, wx(a.L, a))
         },
         Hx = function(a) {
             var b = null;
             a.j && (b = a.j, a.j = b.next, b.next = null);
             a.j || (a.o = null);
             return b
         };
     Ax.prototype.L = function() {
         for (var a; a = Hx(this);) Ix(this, a, this.g, this.C);
         this.A = !1
     };
     var Ix = function(a, b, c, d) {
             if (c == 3 && b.j && !b.o)
                 for (; a && a.B; a = a.l) a.B = !1;
             if (b.g) b.g.l = null, Nx(b, c, d);
             else try {
                 b.o ? b.l.call(b.context) : Nx(b, c, d)
             } catch (e) {
                 Ox.call(null, e)
             }
             ox(Cx, b)
         },
         Nx = function(a, b, c) {
             b == 2 ? a.l.call(a.context, c) : a.j && a.j.call(a.context, c)
         },
         Mx = function(a, b) {
             a.B = !0;
             wx(function() {
                 a.B && Ox.call(null, b)
             })
         },
         Ox = Bb,
         Fx = function(a) {
             tb.call(this, a)
         };
     sb(Fx, tb);
     Fx.prototype.name = "cancel";
     var Px = function(a, b) {
         R.call(this);
         this.j = a || 1;
         this.g = b || x;
         this.l = nb(this.ri, this);
         this.o = pb()
     };
     sb(Px, R);
     m = Px.prototype;
     m.enabled = !1;
     m.Ja = null;
     m.setInterval = function(a) {
         this.j = a;
         this.Ja && this.enabled ? (this.stop(), this.start()) : this.Ja && this.stop()
     };
     m.ri = function() {
         if (this.enabled) {
             var a = pb() - this.o;
             a > 0 && a < this.j * .8 ? this.Ja = this.g.setTimeout(this.l, this.j - a) : (this.Ja && (this.g.clearTimeout(this.Ja), this.Ja = null), this.dispatchEvent("tick"), this.enabled && (this.stop(), this.start()))
         }
     };
     m.start = function() {
         this.enabled = !0;
         this.Ja || (this.Ja = this.g.setTimeout(this.l, this.j), this.o = pb())
     };
     m.stop = function() {
         this.enabled = !1;
         this.Ja && (this.g.clearTimeout(this.Ja), this.Ja = null)
     };
     m.O = function() {
         Px.Za.O.call(this);
         this.stop();
         delete this.g
     };
     var Qx = function(a, b) {
             if (typeof a !== "function")
                 if (a && typeof a.handleEvent == "function") a = nb(a.handleEvent, a);
                 else throw Error("Invalid listener argument");
             return Number(b) > 2147483647 ? -1 : x.setTimeout(a, b || 0)
         },
         Rx = function(a, b) {
             var c = null;
             return (new Ax(function(d, e) {
                 c = Qx(function() {
                     d(b)
                 }, a);
                 c == -1 && e(Error("Failed to schedule timer."))
             })).I(function(d) {
                 x.clearTimeout(c);
                 throw d;
             })
         };
     var Sx = function() {
         return Math.round(Date.now() / 1E3)
     };
     var Tx = function() {
         this.g = {};
         return this
     };
     Tx.prototype.remove = function(a) {
         var b = this.g;
         a in b && delete b[a]
     };
     Tx.prototype.set = function(a, b) {
         this.g[a] = b
     };
     var Ux = function(a, b) {
         a.g.eb = Ej(a.g, "eb", 0) | b
     };
     Tx.prototype.get = function(a) {
         return Ej(this.g, a, null)
     };
     Tx.prototype.ba = function() {
         var a = [],
             b;
         for (b in this.g) a.push(b + this.g[b]);
         return a.join("_")
     };
     var Vx = null,
         Wx = function() {
             this.g = {};
             this.j = 0
         },
         Xx = function() {
             Vx || (Vx = new Wx);
             return Vx
         },
         Yx = function(a, b) {
             a.g[b.getName()] = b
         };
     Wx.prototype.ba = function(a) {
         var b = [];
         a || (a = 0);
         for (var c in this.g) {
             var d = this.g[c];
             d instanceof Zx ? d.getValue() && (a |= d.B) : (d = this.g[c].ba()) && b.push(c + d)
         }
         b.push("eb" + String(a));
         return b.join("_")
     };
     var $x = function(a, b) {
         this.o = a;
         this.l = !0;
         this.g = b
     };
     $x.prototype.getName = function() {
         return this.o
     };
     $x.prototype.getValue = function() {
         return this.g
     };
     $x.prototype.ba = function() {
         return this.l ? this.j() : ""
     };
     $x.prototype.j = function() {
         return String(this.g)
     };
     var Zx = function(a, b) {
         $x.call(this, String(a), b);
         this.B = a;
         this.g = !!b
     };
     r(Zx, $x);
     Zx.prototype.j = function() {
         return this.g ? "1" : "0"
     };
     var ay = function(a, b) {
         $x.call(this, a, b)
     };
     r(ay, $x);
     ay.prototype.j = function() {
         return this.g ? Math.round(this.g.top) + "." + Math.round(this.g.left) + "." + (Math.round(this.g.top) + Math.round(this.g.height)) + "." + (Math.round(this.g.left) + Math.round(this.g.width)) : ""
     };
     var by = function(a) {
         if (a.match(/^-?[0-9]+\.-?[0-9]+\.-?[0-9]+\.-?[0-9]+$/)) {
             a = a.split(".");
             var b = Number(a[0]),
                 c = Number(a[1]);
             return new ay("", new ak(c, b, Number(a[3]) - c, Number(a[2]) - b))
         }
         return new ay("", new ak(0, 0, 0, 0))
     };
     var cy = function(a) {
             var b = new ak(-Number.MAX_VALUE / 2, -Number.MAX_VALUE / 2, Number.MAX_VALUE, Number.MAX_VALUE),
                 c = new ak(0, 0, 0, 0);
             if (!a || 0 == a.length) return c;
             for (var d = 0; d < a.length; d++) {
                 a: {
                     var e = b;
                     var f = a[d],
                         g = Math.max(e.left, f.left),
                         h = Math.min(e.left + e.width, f.left + f.width);
                     if (g <= h) {
                         var k = Math.max(e.top, f.top);
                         f = Math.min(e.top + e.height, f.top + f.height);
                         if (k <= f) {
                             e.left = g;
                             e.top = k;
                             e.width = h - g;
                             e.height = f - k;
                             e = !0;
                             break a
                         }
                     }
                     e = !1
                 }
                 if (!e) return c
             }
             return b
         },
         dy = function(a, b) {
             var c = a.getBoundingClientRect();
             a = jk(a,
                 b);
             return new ak(Math.round(a.x), Math.round(a.y), Math.round(c.right - c.left), Math.round(c.bottom - c.top))
         },
         ey = function(a, b, c) {
             if (b && c) {
                 a: {
                     var d = Math.max(b.left, c.left);
                     var e = Math.min(b.left + b.width, c.left + c.width);
                     if (d <= e) {
                         var f = Math.max(b.top, c.top),
                             g = Math.min(b.top + b.height, c.top + c.height);
                         if (f <= g) {
                             d = new ak(d, f, e - d, g - f);
                             break a
                         }
                     }
                     d = null
                 }
                 e = d ? d.height * d.width : 0;f = d ? b.height * b.width : 0;d = d && f ? Math.round(e / f * 100) : 0;Yx(a, new $x("vp", d));d && d > 0 ? (e = bk(b), f = bk(c), e = e.top >= f.top && e.top < f.bottom) : e = !1;Yx(a, new Zx(512,
                     e));d && d > 0 ? (e = bk(b), f = bk(c), e = e.bottom <= f.bottom && e.bottom > f.top) : e = !1;Yx(a, new Zx(1024, e));d && d > 0 ? (e = bk(b), f = bk(c), e = e.left >= f.left && e.left < f.right) : e = !1;Yx(a, new Zx(2048, e));d && d > 0 ? (b = bk(b), c = bk(c), c = b.right <= c.right && b.right > c.left) : c = !1;Yx(a, new Zx(4096, c))
             }
         };
     var fy = function(a, b) {
         var c = 0;
         xj(Oj(), "ima", "video", "client", "tagged") && (c = 1);
         var d = null;
         a && (d = a());
         if (d) {
             a = Xx();
             a.g = {};
             var e = new Zx(32, !0);
             e.l = !1;
             Yx(a, e);
             e = Oj().document;
             e = e.visibilityState || e.webkitVisibilityState || e.mozVisibilityState || e.msVisibilityState || "";
             Yx(a, new Zx(64, e.toLowerCase().substring(e.length - 6) != "hidden" ? !0 : !1));
             a: {
                 try {
                     var f = Oj().top;
                     try {
                         var g = !!f.location.href || f.location.href === ""
                     } catch (n) {
                         g = !1
                     }
                     if (g) {
                         var h = Nw(d);
                         var k = h && h.length != 0 ? "1" : "0";
                         break a
                     }
                     k = "2";
                     break a
                 } catch (n) {
                     k = "2";
                     break a
                 }
                 k = void 0
             }
             Yx(a, new Zx(256, k == "2"));
             Yx(a, new Zx(128, k == "1"));
             h = g = Oj().top;
             k == "2" && (h = Oj());
             f = dy(d, h);
             Yx(a, new ay("er", f));
             try {
                 var l = h.document && !h.document.body ? null : Nj(h || window)
             } catch (n) {
                 l = null
             }
             l ? (h = Wj(Jj(h.document)), Yx(a, new Zx(16384, !!h)), l = h ? new ak(h.x, h.y, l.width, l.height) : null) : l = null;
             Yx(a, new ay("vi", l));
             if (l && "1" == k) {
                 k = Nw(d);
                 d = [];
                 for (h = 0; h < k.length; h++)(e = dy(k[h], g)) && d.push(e);
                 d.push(l);
                 l = cy(d)
             }
             ey(a, f, l);
             a.j && Yx(a, new $x("ts", Sx() - a.j));
             a.j = Sx()
         } else a = Xx(), a.g = {}, a.j = Sx(), Yx(a, new Zx(32,
             !1));
         this.l = a;
         this.g = new Tx;
         this.g.set("ve", 4);
         c && Ux(this.g, 1);
         xj(Oj(), "ima", "video", "client", "crossdomainTag") && Ux(this.g, 4);
         xj(Oj(), "ima", "video", "client", "sdkTag") && Ux(this.g, 8);
         xj(Oj(), "ima", "video", "client", "jsTag") && Ux(this.g, 2);
         b && Ej(b, "fullscreen", !1) && Ux(this.g, 16);
         this.j = b = null;
         if (c && (c = xj(Oj(), "ima", "video", "client"), c.getEData)) {
             this.j = c.getEData();
             if (c = xj(Oj(), "ima", "video", "client", "getLastSnapshotFromTop"))
                 if (a = c()) this.j.extendWithDataFromTopIframe(a.tagstamp, a.playstamp, a.lactstamp),
                     c = this.l, b = a.er, a = a.vi, b && a && (b = by(b).getValue(), a = by(a).getValue(), k = null, Ej(c.g, "er", null) && (k = Ej(c.g, "er", null).getValue(), k.top += b.top, k.left += b.left, Yx(c, new ay("er", k))), Ej(c.g, "vi", null) && (l = Ej(c.g, "vi", null).getValue(), l.top += b.top, l.left += b.left, d = [], d.push(l), d.push(b), d.push(a), b = cy(d), ey(c, k, b), Yx(c, new ay("vi", a))));
             a: {
                 if (this.j) {
                     if (this.j.getTagLoadTimestamp) {
                         b = this.j.getTagLoadTimestamp();
                         break a
                     }
                     if (this.j.getTimeSinceTagLoadSeconds) {
                         b = this.j.getTimeSinceTagLoadSeconds();
                         break a
                     }
                 }
                 b =
                 null
             }
         }
         c = this.g;
         a = window.performance && window.performance.timing && window.performance.timing.domLoading && window.performance.timing.domLoading > 0 ? Math.round(window.performance.timing.domLoading / 1E3) : null;
         c.set.call(c, "td", Sx() - (a != null ? a : b != null ? b : Sx()))
     };
     fy.prototype.ba = function() {
         var a = [],
             b = Number(this.g.get("eb"));
         this.g.remove("eb");
         var c = this.g.ba();
         c && a.push(c);
         this.j && (c = this.j.serialize()) && a.push(c);
         (c = this.l.ba(b)) && a.push(c);
         this.g.set("eb", b);
         return a.join("_")
     };
     new Px(200);
     var gy = function(a, b) {
         try {
             return (new fy(a, b)).ba()
         } catch (c) {
             return "tle;" + Ti(c.name, 12) + ";" + Ti(c.message, 40)
         }
     };
     var hy = function(a) {
         this.D = C(a)
     };
     r(hy, I);
     hy.prototype.getId = function() {
         return pg(this, 1)
     };
     var iy = [0, Ih];
     var jy = function(a) {
         this.D = C(a)
     };
     r(jy, I);
     var ky = [0, Ih, -3];
     var ly = function(a) {
         this.D = C(a)
     };
     r(ly, I);
     ly.prototype.getWidth = function() {
         return lg(this, 1)
     };
     ly.prototype.getHeight = function() {
         return lg(this, 2)
     };
     var my = [0, Fh, -1];
     var ny = function(a) {
         this.D = C(a)
     };
     r(ny, I);
     var oy = [0, Ch, Hh, Ih, -1];
     var py = function(a) {
         this.D = C(a)
     };
     r(py, I);
     py.prototype.getAdId = function() {
         return pg(this, 1)
     };
     py.prototype.getSize = function() {
         return E(this, ly, 7)
     };
     py.prototype.Bc = function() {
         return E(this, ny, 9)
     };
     var qy = [0, Ih, Ch, Ih, Jh, Nh, iy, my, Ch, oy, Ih, ky];
     var ry = function(a) {
         this.D = C(a)
     };
     r(ry, I);
     var sy = function(a, b) {
             return Ag(a, 1, b)
         },
         ty = function(a, b) {
             return ug(a, 4, b)
         },
         uy = function(a, b) {
             return wg(a, 2, b)
         };
     var vy = function(a) {
         this.D = C(a)
     };
     r(vy, I);
     var wy = function(a, b) {
             return zg(a, 1, b)
         },
         yy = function(a, b) {
             return ig(a, 3, py, b)
         },
         zy = function(a, b) {
             return Ag(a, 4, b)
         },
         Ay = function(a, b) {
             return ug(a, 6, b)
         };
     var By = [0, Nh, Fh, Ih, Hh];
     var Cy = [0, Ih, Ch, Kh, qy, Nh, By, Hh, Nh, 2, Jh];
     var Dy = function(a) {
         this.D = C(a)
     };
     r(Dy, I);
     var Ey = function(a) {
         this.D = C(a)
     };
     r(Ey, I);
     var Fy = function(a, b) {
             return hg(a, 2, vy, b)
         },
         Gy = function(a, b) {
             F(a, 5, b)
         },
         Hy = function(a, b) {
             zg(a, 10, b)
         },
         Iy = function(a, b) {
             zg(a, 11, b)
         };
     var Jy = [0, Nh, Kh, Cy, Nh, Ih, By, Ih, Hh, Fh, [0, Nh, Hh, Ch], Ih, -1];
     var Ky = function(a) {
         this.D = C(a)
     };
     r(Ky, I);
     var Ly = function(a) {
         var b = new Ey;
         b = Ag(b, 1, 1);
         return hg(a, 1, Ey, b)
     };
     var My = Ph([0, Kh, Jy]);
     var Ny = Rh(bi);
     var Oy = function(a) {
         this.D = C(a)
     };
     r(Oy, I);
     var Py = function(a) {
         var b = new Oy;
         return Ag(b, 1, a)
     };
     var Qy = [0, Nh];
     var Ry = function(a) {
         this.D = C(a)
     };
     r(Ry, I);
     var Sy = function(a) {
             var b = new Ry;
             return zg(b, 1, a)
         },
         Ty = function(a) {
             var b = window.Date.now();
             b = Number.isFinite(b) ? Math.round(b) : 0;
             return Jf(a, 3, He(b))
         };
     Ry.prototype.getError = function() {
         return E(this, Oy, 10)
     };
     Ry.prototype.ya = function(a) {
         return F(this, 10, a)
     };
     var Uy = Sh(Ry);
     var Vy = [0, Ih, -1, Ch, Fh, -2, Ch, Ah, Hh, Qy, Hh];
     var Wy = [0, 1, [0, Eh, -2], -1, Ih, -1, Hh, [0, 3, Nh, Ih], Ch, Oh, Mh];
     var Xy = function(a) {
         this.D = C(a)
     };
     r(Xy, I);
     Xy.prototype.j = Qh([0, Kh, Wy, Kh, Vy]);
     var $y = function() {
         var a = Yy;
         this.B = Zy;
         this.A = "jserror";
         this.j = !0;
         this.g = a === void 0 ? null : a;
         this.l = null;
         this.o = !1;
         this.ta = this.lb
     };
     m = $y.prototype;
     m.Ke = function(a) {
         this.l = a
     };
     m.Rf = function(a) {
         this.A = a
     };
     m.Ne = function(a) {
         this.j = a
     };
     m.Sf = function(a) {
         this.o = a
     };
     m.Qb = function(a, b, c) {
         try {
             if (this.g && this.g.l) {
                 var d = this.g.start(a.toString(), 3);
                 var e = b();
                 this.g.end(d)
             } else e = b()
         } catch (h) {
             b = this.j;
             try {
                 Dm(d), b = this.ta(a, new ei(h, {
                     message: gi(h)
                 }), void 0, c)
             } catch (k) {
                 this.lb(217, k)
             }
             if (b) {
                 var f, g;
                 (f = window.console) == null || (g = f.error) == null || g.call(f, h)
             } else throw h;
         }
         return e
     };
     m.Be = function(a, b, c, d) {
         var e = this;
         return function() {
             var f = Ra.apply(0, arguments);
             return e.Qb(a, function() {
                 return b.apply(c, f)
             }, d)
         }
     };
     m.lb = function(a, b, c, d, e) {
         e = e || this.A;
         var f = void 0;
         try {
             var g = new sq;
             xq(g, 1, "context", a);
             fi(b) || (b = new ei(b, {
                 message: gi(b)
             }));
             b.msg && xq(g, 2, "msg", b.msg.substring(0, 512));
             var h = b.meta || {};
             if (this.l) try {
                 this.l(h)
             } catch (n) {}
             if (d) try {
                 d(h)
             } catch (n) {}
             wq(g, 3, [h]);
             f = rq();
             f.j && xq(g, 4, "top", f.j.url || "");
             wq(g, 5, [{
                 url: f.g.url || ""
             }, {
                 url: f.g.url ? bp(f.g.url) : ""
             }]);
             az(this.B, e, g, this.o, c)
         } catch (n) {
             try {
                 var k, l;
                 az(this.B, e, {
                     context: "ecmserr",
                     rctx: a,
                     msg: gi(n),
                     url: (l = (k = f) == null ? void 0 : k.g.url) != null ? l : ""
                 }, this.o, c)
             } catch (p) {}
         }
         return this.j
     };
     var bz = function() {
             this.domain = "pagead2.googlesyndication.com";
             this.path = "/pagead/gen_204?id=";
             this.g = Math.random()
         },
         cz = function() {
             var a = Zy,
                 b = window.google_srt;
             b >= 0 && b <= 1 && (a.g = b)
         },
         az = function(a, b, c, d, e) {
             if (((d === void 0 ? 0 : d) ? a.g : Math.random()) < (e || .01)) try {
                 if (c instanceof sq) var f = c;
                 else f = new sq, hi(c, function(h, k) {
                     var l = f,
                         n = l.o++;
                     wq(l, n, tq(k, h))
                 });
                 var g = zq(f, "https:", a.domain, a.path + b + "&");
                 g && sk(x, g)
             } catch (h) {}
         };
     var Zy, dz, Yy = new Cm(1, window);
     (function(a) {
         Zy = a != null ? a : new bz;
         typeof window.google_srt !== "number" && (window.google_srt = Math.random());
         cz();
         dz = new $y;
         dz.Ke(function() {});
         dz.Sf(!0);
         window.document.readyState === "complete" ? window.google_measure_js_timing || Yy.A() : Yy.l && qk(window, "load", function() {
             window.google_measure_js_timing || Yy.A()
         })
     })();
     var ez = function(a) {
         this.D = C(a)
     };
     r(ez, I);
     var fz = function(a) {
         this.D = C(a)
     };
     r(fz, I);
     var gz = {
         "-": 0,
         Y: 2,
         N: 1
     };
     var hz = function(a) {
         this.D = C(a)
     };
     r(hz, I);
     hz.prototype.getType = function() {
         return lg(this, 1)
     };
     hz.prototype.getVersion = function() {
         return lg(this, 2)
     };

     function iz(a) {
         return ed(a.length % 4 !== 0 ? a + "A" : a).map(function(b) {
             return b.toString(2).padStart(8, "0")
         }).join("")
     }

     function jz(a) {
         if (!/^[0-1]+$/.test(a)) throw Error("Invalid input [" + a + "] not a bit string.");
         return parseInt(a, 2)
     }

     function kz(a) {
         if (!/^[0-1]+$/.test(a)) throw Error("Invalid input [" + a + "] not a bit string.");
         for (var b = [1, 2, 3, 5], c = 0, d = 0; d < a.length - 1; d++) b.length <= d && b.push(b[d - 1] + b[d - 2]), c += parseInt(a[d], 2) * b[d];
         return c
     }

     function lz(a, b) {
         a = iz(a);
         return a.length < b ? a.padEnd(b, "0") : a
     };

     function mz(a, b) {
         var c = a.indexOf("11");
         if (c === -1) throw Error("Expected section bitstring but not found in [" + a + "] part of [" + b + "]");
         return a.slice(0, c + 2)
     };
     var nz = function(a) {
         this.D = C(a)
     };
     r(nz, I);
     var oz = function(a) {
         this.D = C(a)
     };
     r(oz, I);
     var pz = function(a) {
         this.D = C(a)
     };
     r(pz, I);
     pz.prototype.getVersion = function() {
         return lg(this, 1)
     };
     var qz = function(a) {
         this.D = C(a)
     };
     r(qz, I);
     var rz = function(a) {
         this.D = C(a)
     };
     r(rz, I);
     var sz = function(a) {
         var b = new rz;
         return F(b, 1, a)
     };
     var sC = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
         tC = 6 + sC.reduce(function(a, b) {
             return a + b
         });
     var uC = function(a) {
         this.D = C(a)
     };
     r(uC, I);
     var vC = function(a) {
         this.D = C(a)
     };
     r(vC, I);
     vC.prototype.getVersion = function() {
         return lg(this, 1)
     };
     var wC = function(a) {
         this.D = C(a)
     };
     r(wC, I);
     var xC = function(a) {
         this.D = C(a)
     };
     r(xC, I);
     var yC = function(a) {
         var b = new xC;
         return F(b, 1, a)
     };
     var zC = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
         AC = 6 + zC.reduce(function(a, b) {
             return a + b
         });
     var BC = function(a) {
         this.D = C(a)
     };
     r(BC, I);
     var CC = function(a) {
         this.D = C(a)
     };
     r(CC, I);
     var DC = function(a) {
         this.D = C(a)
     };
     r(DC, I);
     DC.prototype.getVersion = function() {
         return lg(this, 1)
     };
     var EC = function(a) {
         this.D = C(a)
     };
     r(EC, I);
     var FC = function(a) {
         this.D = C(a)
     };
     r(FC, I);
     var GC = function(a) {
         var b = new FC;
         return F(b, 1, a)
     };
     var HC = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
         IC = 6 + HC.reduce(function(a, b) {
             return a + b
         });
     var JC = function(a) {
         this.D = C(a)
     };
     r(JC, I);
     var KC = function(a) {
         this.D = C(a)
     };
     r(KC, I);
     var LC = function(a) {
         this.D = C(a)
     };
     r(LC, I);
     LC.prototype.getVersion = function() {
         return lg(this, 1)
     };
     var MC = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
         NC = 6 + MC.reduce(function(a, b) {
             return a + b
         });
     var OC = function(a) {
         this.D = C(a)
     };
     r(OC, I);
     var PC = function(a) {
         this.D = C(a)
     };
     r(PC, I);
     var QC = function(a) {
         this.D = C(a)
     };
     r(QC, I);
     QC.prototype.getVersion = function() {
         return lg(this, 1)
     };
     var RC = function(a) {
         var b = new QC;
         return xg(b, 1, a)
     };
     var SC = function(a) {
         this.D = C(a)
     };
     r(SC, I);
     var TC = function(a) {
         this.D = C(a)
     };
     r(TC, I);
     var UC = function(a) {
         var b = new TC;
         return F(b, 1, a)
     };
     var VC = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
         WC = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
         XC = 6 + WC.reduce(function(a, b) {
             return a + b
         });
     var YC = function(a) {
         this.D = C(a)
     };
     r(YC, I);
     var ZC = function(a) {
         this.D = C(a)
     };
     r(ZC, I);
     ZC.prototype.getVersion = function() {
         return lg(this, 1)
     };
     var $C = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
         aD = 6 + $C.reduce(function(a, b) {
             return a + b
         });
     var bD = function(a) {
         this.D = C(a)
     };
     r(bD, I);
     var cD = function(a) {
         this.D = C(a)
     };
     r(cD, I);
     var dD = function(a, b) {
             return Uf(a, 1, b, we)
         },
         eD = function(a, b) {
             return Uf(a, 2, b, we)
         },
         fD = function(a, b) {
             return Uf(a, 3, b, ye)
         },
         gD = function(a, b) {
             Uf(a, 4, b, ye)
         };
     var hD = function(a) {
         this.D = C(a)
     };
     r(hD, I);
     hD.prototype.getVersion = function() {
         return lg(this, 1)
     };
     var iD = function(a, b) {
             return xg(a, 1, b)
         },
         jD = function(a, b) {
             return F(a, 2, b)
         },
         kD = function(a, b) {
             return F(a, 3, b)
         },
         lD = function(a, b) {
             return xg(a, 4, b)
         },
         mD = function(a, b) {
             return xg(a, 5, b)
         },
         nD = function(a, b) {
             return xg(a, 6, b)
         },
         oD = function(a, b) {
             return Vf(a, 7, Me(b), "")
         },
         pD = function(a, b) {
             return xg(a, 8, b)
         },
         qD = function(a, b) {
             return xg(a, 9, b)
         },
         rD = function(a, b) {
             return vg(a, 10, b)
         },
         sD = function(a, b) {
             return vg(a, 11, b)
         },
         tD = function(a, b) {
             return Uf(a, 12, b, we)
         },
         uD = function(a, b) {
             return Uf(a, 13, b, we)
         },
         vD = function(a, b) {
             return Uf(a,
                 14, b, we)
         },
         wD = function(a, b) {
             return vg(a, 15, b)
         },
         xD = function(a, b) {
             return Vf(a, 16, Me(b), "")
         },
         yD = function(a, b) {
             return Uf(a, 17, b, ye)
         },
         zD = function(a, b) {
             return Uf(a, 18, b, ye)
         },
         AD = function(a, b) {
             return fg(a, 19, b)
         };
     var BD = function(a) {
         this.D = C(a)
     };
     r(BD, I);
     var CD = "a".charCodeAt(),
         DD = vj({
             vj: 0,
             uj: 1,
             rj: 2,
             mj: 3,
             sj: 4,
             nj: 5,
             tj: 6,
             pj: 7,
             qj: 8,
             lj: 9,
             oj: 10,
             wj: 11
         }),
         ED = vj({
             yj: 0,
             zj: 1,
             xj: 2
         });
     var FD = function(a) {
             if (/[^01]/.test(a)) throw Error("Input bitstring " + a + " is malformed!");
             this.j = a;
             this.g = 0
         },
         HD = function(a) {
             a = GD(a, 36);
             var b = new ez;
             b = yg(b, 1, Math.floor(a / 10));
             return xg(b, 2, a % 10 * 1E8)
         },
         ID = function(a) {
             return String.fromCharCode(CD + GD(a, 6)) + String.fromCharCode(CD + GD(a, 6))
         },
         LD = function(a) {
             var b = GD(a, 16);
             return !!GD(a, 1) === !0 ? (a = JD(a), a.forEach(function(c) {
                 if (c > b) throw Error("ID " + c + " is past MaxVendorId " + b + "!");
             }), a) : KD(a, b)
         },
         MD = function(a) {
             for (var b = [], c = GD(a, 12); c--;) {
                 var d = GD(a, 6),
                     e =
                     GD(a, 2),
                     f = JD(a),
                     g = b,
                     h = g.push,
                     k = new bD;
                 d = H(k, 1, d);
                 e = H(d, 2, e);
                 f = Uf(e, 3, f, ye);
                 h.call(g, f)
             }
             return b
         },
         JD = function(a) {
             for (var b = GD(a, 12), c = []; b--;) {
                 var d = !!GD(a, 1) === !0,
                     e = GD(a, 16);
                 if (d)
                     for (d = GD(a, 16); e <= d; e++) c.push(e);
                 else c.push(e)
             }
             c.sort(function(f, g) {
                 return f - g
             });
             return c
         },
         KD = function(a, b, c) {
             for (var d = [], e = 0; e < b; e++)
                 if (GD(a, 1)) {
                     var f = e + 1;
                     if (c && c.indexOf(f) === -1) throw Error("ID: " + f + " is outside of allowed values!");
                     d.push(f)
                 } return d
         },
         GD = function(a, b) {
             if (a.g + b > a.j.length) throw Error("Requested length " +
                 b + " is past end of string.");
             var c = a.j.substring(a.g, a.g + b);
             a.g += b;
             return parseInt(c, 2)
         };
     FD.prototype.skip = function(a) {
         this.g += a
     };
     var ND = function(a) {
         try {
             var b = ed(a).map(function(f) {
                     return f.toString(2).padStart(8, "0")
                 }).join(""),
                 c = new FD(b);
             if (GD(c, 3) !== 3) return null;
             var d = eD(dD(new cD, KD(c, 24, DD)), KD(c, 24, DD)),
                 e = GD(c, 6);
             e !== 0 && gD(fD(d, KD(c, e)), KD(c, e));
             return d
         } catch (f) {
             return null
         }
     };
     var OD = function(a) {
         try {
             var b = ed(a).map(function(d) {
                     return d.toString(2).padStart(8, "0")
                 }).join(""),
                 c = new FD(b);
             return AD(zD(yD(xD(wD(vD(uD(tD(sD(rD(qD(pD(oD(nD(mD(lD(kD(jD(iD(new hD, GD(c, 6)), HD(c)), HD(c)), GD(c, 12)), GD(c, 12)), GD(c, 6)), ID(c)), GD(c, 12)), GD(c, 6)), !!GD(c, 1)), !!GD(c, 1)), KD(c, 12, ED)), KD(c, 24, DD)), KD(c, 24, DD)), !!GD(c, 1)), ID(c)), LD(c)), LD(c)), MD(c))
         } catch (d) {
             return null
         }
     };
     var QD = function(a) {
             if (!a) return null;
             var b = a.split(".");
             if (b.length > 4) return null;
             a = OD(b[0]);
             if (!a) return null;
             var c = new BD;
             a = F(c, 1, a);
             b.shift();
             b = w(b);
             for (c = b.next(); !c.done; c = b.next()) switch (c = c.value, PD(c)) {
                 case 1:
                 case 2:
                     break;
                 case 3:
                     c = ND(c);
                     if (!c) return null;
                     F(a, 2, c);
                     break;
                 default:
                     return null
             }
             return a
         },
         PD = function(a) {
             try {
                 var b = ed(a).map(function(c) {
                     return c.toString(2).padStart(8, "0")
                 }).join("");
                 return GD(new FD(b), 3)
             } catch (c) {
                 return -1
             }
         };
     var SD = function(a, b) {
             var c = QD(a);
             if (!c || !a) return null;
             var d = E(c, hD, 1),
                 e = E(c, cD, 2) || new cD;
             c = lg(d, 9);
             var f = lg(d, 4),
                 g = lg(d, 5),
                 h = kg(d, 10),
                 k = kg(d, 11),
                 l = pg(d, 16),
                 n = kg(d, 15);
             var p = Nf(d, 13, xe, Mf());
             p = RD(p, DD);
             var q = Nf(d, 14, xe, Mf());
             p = {
                 consents: p,
                 legitimateInterests: RD(q, DD)
             };
             q = rg(d, 17);
             q = RD(q);
             var v = rg(d, 18);
             q = {
                 consents: q,
                 legitimateInterests: RD(v)
             };
             v = Nf(d, 12, xe, Mf());
             v = RD(v, ED);
             var u = cg(d, bD, 19, Mf());
             d = {};
             u = w(u);
             for (var t = u.next(); !t.done; t = u.next()) {
                 t = t.value;
                 var y = G(t, 1);
                 d[y] = d[y] || {};
                 for (var D = w(rg(t,
                         3)), ca = D.next(); !ca.done; ca = D.next()) d[y][ca.value] = G(t, 2)
             }
             u = Nf(e, 1, xe, Mf());
             u = RD(u, DD);
             t = Nf(e, 2, xe, Mf());
             t = RD(t, DD);
             y = rg(e, 3);
             y = RD(y);
             e = rg(e, 4);
             return {
                 tcString: a,
                 tcfPolicyVersion: c,
                 gdprApplies: b,
                 cmpId: f,
                 cmpVersion: g,
                 isServiceSpecific: h,
                 useNonStandardStacks: k,
                 publisherCC: l,
                 purposeOneTreatment: n,
                 purpose: p,
                 vendor: q,
                 specialFeatureOptins: v,
                 publisher: {
                     restrictions: d,
                     consents: u,
                     legitimateInterests: t,
                     customPurposes: {
                         consents: y,
                         legitimateInterests: RD(e)
                     }
                 }
             }
         },
         RD = function(a, b) {
             var c = {};
             if (Array.isArray(b) &&
                 b.length !== 0) {
                 b = w(b);
                 for (var d = b.next(); !d.done; d = b.next()) d = d.value, c[d] = a.indexOf(d) !== -1
             } else
                 for (a = w(a), b = a.next(); !b.done; b = a.next()) c[b.value] = !0;
             delete c[0];
             return c
         };
     var TD = function(a) {
             this.g = a;
             this.defaultValue = !1
         },
         UD = function(a, b) {
             this.g = a;
             this.defaultValue = b === void 0 ? 0 : b
         };
     var VD = new UD(745150931),
         WD = new UD(749060184, 100),
         XD = new TD(45668885),
         YD = new TD(635466687),
         ZD = new UD(45645574),
         $D = new TD(45685601),
         aE = new UD(45685602, 500),
         bE = new TD(775241416),
         cE = new TD(781107959),
         dE = new TD(781107958),
         eE = new TD(781107957);
     var fE = function(a) {
         this.D = C(a)
     };
     r(fE, I);
     var gE = function(a) {
         var b = new fE;
         gg(b, 1, we, a, xe)
     };
     var hE = /^((market|itms|intent|itms-appss):\/\/)/i;

     function iE(a, b, c, d) {
         var e = mj("IFRAME");
         e.id = b;
         e.name = b;
         e.width = String(c);
         e.height = String(d);
         e.allowTransparency = "true";
         e.scrolling = "no";
         e.marginWidth = "0";
         e.marginHeight = "0";
         e.frameBorder = "0";
         e.style.border = "0";
         e.style.verticalAlign = "bottom";
         e.src = "about:blank";
         e.setAttribute("aria-label", "Advertisement");
         e.title = "3rd party ad content";
         e.tabIndex = 0;
         a.appendChild(e);
         return e
     };
     var jE = "ad_type vpos mridx pos vad_type videoad_start_delay".split(" ");
     var kE = function(a) {
         var b = a.Gb;
         var c = a.rb;
         var d = a.height;
         var e = a.width;
         a = a.Pa === void 0 ? !1 : a.Pa;
         this.Gb = b;
         this.rb = c;
         this.height = d;
         this.width = e;
         this.Pa = a
     };
     kE.prototype.getHeight = function() {
         return this.height
     };
     kE.prototype.getWidth = function() {
         return this.width
     };
     var lE = function(a) {
         var b = a.Di;
         var c = a.Qg;
         var d = a.Gb;
         var e = a.rb;
         var f = a.Ci;
         var g = a.Pg;
         kE.call(this, {
             Gb: d,
             rb: e,
             height: a.height,
             width: a.width,
             Pa: a.Pa === void 0 ? !1 : a.Pa
         });
         this.o = b;
         this.j = c;
         this.l = f;
         this.g = g
     };
     r(lE, kE);
     var mE = function(a) {
         var b = a.Kh;
         kE.call(this, {
             Gb: a.Gb,
             rb: a.rb,
             height: a.height,
             width: a.width,
             Pa: a.Pa === void 0 ? !1 : a.Pa
         });
         this.g = b
     };
     r(mE, kE);
     mE.prototype.getMediaUrl = function() {
         return this.g
     };

     function nE(a) {
         return new(Function.prototype.bind.apply(a, [null].concat(ua(Ra.apply(1, arguments)))))
     };
     var oE = function(a, b, c, d) {
         Q.call(this);
         this.G = b;
         this.F = c;
         this.C = d;
         this.B = new Map;
         this.H = 0;
         this.o = new Map;
         this.A = new Map;
         this.l = void 0;
         this.j = a
     };
     r(oE, Q);
     oE.prototype.O = function() {
         delete this.g;
         this.B.clear();
         this.o.clear();
         this.A.clear();
         this.l && (rk(this.j, "message", this.l), delete this.l);
         delete this.j;
         delete this.C;
         Q.prototype.O.call(this)
     };
     var pE = function(a) {
             if (a.g) return a.g;
             a.F && a.F(a.j) ? a.g = a.j : a.g = kj(a.j, a.G);
             var b;
             return (b = a.g) != null ? b : null
         },
         rE = function(a, b, c) {
             if (pE(a))
                 if (a.g === a.j)(b = a.B.get(b)) && b(a.g, c);
                 else {
                     var d = a.o.get(b);
                     if (d && d.nd) {
                         qE(a);
                         var e = ++a.H;
                         a.A.set(e, {
                             Hc: d.Hc,
                             ah: d.ne(c),
                             bi: b === "addEventListener"
                         });
                         a.g.postMessage(d.nd(c, e), "*")
                     }
                 }
         },
         qE = function(a) {
             a.l || (a.l = function(b) {
                     try {
                         var c = a.C ? a.C(b) : void 0;
                         if (c) {
                             var d = c.If,
                                 e = a.A.get(d);
                             if (e) {
                                 e.bi || a.A.delete(d);
                                 var f;
                                 (f = e.Hc) == null || f.call(e, e.ah, c.payload)
                             }
                         }
                     } catch (g) {}
                 },
                 qk(a.j, "message", a.l))
         };
     var sE = function(a, b) {
             (0, a.__uspapi)("getUSPData", 1, function(c, d) {
                 b.Ma({
                     kf: c != null ? c : void 0,
                     nf: d ? void 0 : 2
                 })
             })
         },
         tE = {
             ne: function(a) {
                 return a.Ma
             },
             nd: function(a, b) {
                 a = {};
                 return a.__uspapiCall = {
                     callId: b,
                     command: "getUSPData",
                     version: 1
                 }, a
             },
             Hc: function(a, b) {
                 b = b.__uspapiReturn;
                 var c;
                 a({
                     kf: (c = b.returnValue) != null ? c : void 0,
                     nf: b.success ? void 0 : 2
                 })
             }
         };

     function uE(a) {
         var b = {};
         typeof a.data === "string" ? b = JSON.parse(a.data) : b = a.data;
         return {
             payload: b,
             If: b.__uspapiReturn.callId
         }
     }
     var vE = function(a, b) {
         b = b === void 0 ? {} : b;
         Q.call(this);
         var c;
         this.timeoutMs = (c = b.timeoutMs) != null ? c : 500;
         this.caller = new oE(a, "__uspapiLocator", function(d) {
             return typeof d.__uspapi === "function"
         }, uE);
         this.caller.B.set("getDataWithCallback", sE);
         this.caller.o.set("getDataWithCallback", tE)
     };
     r(vE, Q);
     vE.prototype.O = function() {
         this.caller.dispose();
         Q.prototype.O.call(this)
     };
     var wE = function(a, b) {
         var c = {};
         if (pE(a.caller)) {
             var d = mi(function() {
                 b(c)
             });
             rE(a.caller, "getDataWithCallback", {
                 Ma: function(e) {
                     e.nf || (c = e.kf);
                     d()
                 }
             });
             setTimeout(d, a.timeoutMs)
         } else b(c)
     };

     function xE(a) {
         a.addtlConsent !== void 0 && typeof a.addtlConsent !== "string" && (a.addtlConsent = void 0);
         a.gdprApplies !== void 0 && typeof a.gdprApplies !== "boolean" && (a.gdprApplies = void 0);
         return a.tcString !== void 0 && typeof a.tcString !== "string" || a.listenerId !== void 0 && typeof a.listenerId !== "number" ? 2 : a.cmpStatus && a.cmpStatus !== "error" ? 0 : 3
     }
     var yE = function(a, b) {
         b = b === void 0 ? {} : b;
         Q.call(this);
         this.g = null;
         this.A = {};
         this.C = 0;
         this.l = null;
         this.j = a;
         var c;
         this.o = (c = b.timeoutMs) != null ? c : 500;
         var d;
         this.B = (d = b.lk) != null ? d : !1
     };
     r(yE, Q);
     yE.prototype.O = function() {
         this.A = {};
         this.l && (rk(this.j, "message", this.l), delete this.l);
         delete this.A;
         delete this.j;
         delete this.g;
         Q.prototype.O.call(this)
     };
     var AE = function(a) {
             return typeof a.j.__tcfapi === "function" || zE(a) != null
         },
         DE = function(a, b) {
             var c = {
                     internalErrorState: 0,
                     internalBlockOnErrors: a.B
                 },
                 d = mi(function() {
                     return b(c)
                 }),
                 e = 0;
             a.o !== -1 && (e = setTimeout(function() {
                 e = 0;
                 c.tcString = "tcunavailable";
                 c.internalErrorState = 1;
                 d()
             }, a.o));
             BE(a, "addEventListener", function(f) {
                 f && (c = f, c.internalErrorState = xE(c), c.internalBlockOnErrors = a.B, CE(c) ? (c.internalErrorState !== 0 && (c.tcString = "tcunavailable"), BE(a, "removeEventListener", null, c.listenerId), (f = e) && clearTimeout(f),
                     d()) : (c.cmpStatus === "error" || c.internalErrorState !== 0) && (f = e) && clearTimeout(f))
             })
         };
     yE.prototype.addEventListener = function(a) {
         var b = this,
             c = {
                 internalBlockOnErrors: this.B
             },
             d = mi(function() {
                 return a(c)
             }),
             e = 0;
         this.o !== -1 && (e = setTimeout(function() {
             c.tcString = "tcunavailable";
             c.internalErrorState = 1;
             d()
         }, this.o));
         var f = function(g, h) {
             clearTimeout(e);
             g ? (c = g, c.internalErrorState = xE(c), c.internalBlockOnErrors = b.B, h && c.internalErrorState === 0 || (c.tcString = "tcunavailable", h || (c.internalErrorState = 3))) : (c.tcString = "tcunavailable", c.internalErrorState = 3);
             a(c)
         };
         try {
             BE(this, "addEventListener", f)
         } catch (g) {
             c.tcString =
                 "tcunavailable", c.internalErrorState = 3, e && (clearTimeout(e), e = 0), d()
         }
     };
     yE.prototype.removeEventListener = function(a) {
         a && a.listenerId && BE(this, "removeEventListener", null, a.listenerId)
     };
     var FE = function(a) {
             var b = b === void 0 ? {} : b;
             return CE(a) ? a.gdprApplies === !1 ? !0 : a.tcString === "tcunavailable" ? !b.idpcApplies : (b.idpcApplies || a.gdprApplies !== void 0 || b.tk) && (b.idpcApplies || typeof a.tcString === "string" && a.tcString.length) ? EE(a, "1", 0) : !0 : !1
         },
         EE = function(a, b, c) {
             var d = d === void 0 ? "755" : d;
             a: {
                 if (a.publisher && a.publisher.restrictions) {
                     var e = a.publisher.restrictions[b];
                     if (e !== void 0) {
                         e = e[d === void 0 ? "755" : d];
                         break a
                     }
                 }
                 e = void 0
             }
             if (e === 0) return !1;
             var f = c;
             c === 2 ? (f = 0, e === 2 && (f = 1)) : c === 3 && (f = 1, e === 1 &&
                 (f = 0));
             a = f === 0 ? a.purpose && a.vendor ? (c = GE(a.vendor.consents, d === void 0 ? "755" : d)) && b === "1" && a.purposeOneTreatment && a.publisherCC === "CH" ? !0 : c && GE(a.purpose.consents, b) : !0 : f === 1 ? a.purpose && a.vendor ? GE(a.purpose.legitimateInterests, b) && GE(a.vendor.legitimateInterests, d === void 0 ? "755" : d) : !0 : !0;
             return a
         },
         GE = function(a, b) {
             return !(!a || !a[b])
         },
         BE = function(a, b, c, d) {
             c || (c = function() {});
             var e = a.j;
             typeof e.__tcfapi === "function" ? (a = e.__tcfapi, a(b, 2, c, d)) : zE(a) ? (HE(a), e = ++a.C, a.A[e] = c, a.g && (c = {}, a.g.postMessage((c.__tcfapiCall = {
                 command: b,
                 version: 2,
                 callId: e,
                 parameter: d
             }, c), "*"))) : c({}, !1)
         },
         zE = function(a) {
             if (a.g) return a.g;
             a.g = kj(a.j, "__tcfapiLocator");
             return a.g
         },
         HE = function(a) {
             if (!a.l) {
                 var b = function(c) {
                     try {
                         var d = (typeof c.data === "string" ? JSON.parse(c.data) : c.data).__tcfapiReturn;
                         a.A[d.callId](d.returnValue, d.success)
                     } catch (e) {}
                 };
                 a.l = b;
                 qk(a.j, "message", b)
             }
         },
         CE = function(a) {
             if (a.gdprApplies === !1) return !0;
             a.internalErrorState === void 0 && (a.internalErrorState = xE(a));
             return a.cmpStatus === "error" || a.internalErrorState !== 0 ? a.internalBlockOnErrors ?
                 (uk({
                     e: String(a.internalErrorState)
                 }, "tcfe"), !1) : !0 : a.cmpStatus !== "loaded" || a.eventStatus !== "tcloaded" && a.eventStatus !== "useractioncomplete" ? !1 : !0
         },
         IE = function(a, b, c) {
             return a.gdprApplies === !1 ? !0 : b.every(function(d) {
                 return EE(a, d, c)
             })
         };
     var JE = function(a, b) {
             b = b.listener;
             (a = (0, a.__gpp)("addEventListener", b)) && b(a, !0)
         },
         KE = function(a, b) {
             (0, a.__gpp)("removeEventListener", b.listener, b.listenerId)
         },
         LE = {
             ne: function(a) {
                 return a.listener
             },
             nd: function(a, b) {
                 a = {};
                 return a.__gppCall = {
                     callId: b,
                     command: "addEventListener",
                     version: "1.1"
                 }, a
             },
             Hc: function(a, b) {
                 b = b.__gppReturn;
                 a(b.returnValue, b.success)
             }
         },
         ME = {
             ne: function(a) {
                 return a.listener
             },
             nd: function(a, b) {
                 var c = {};
                 return c.__gppCall = {
                         callId: b,
                         command: "removeEventListener",
                         version: "1.1",
                         parameter: a.listenerId
                     },
                     c
             },
             Hc: function(a, b) {
                 b = b.__gppReturn;
                 var c = b.returnValue.data;
                 a == null || a(c, b.success)
             }
         };

     function NE(a) {
         var b = {};
         typeof a.data === "string" ? b = JSON.parse(a.data) : b = a.data;
         return {
             payload: b,
             If: b.__gppReturn.callId
         }
     }
     var OE = function(a, b) {
         b = (b === void 0 ? {} : b).timeoutMs;
         Q.call(this);
         this.caller = new oE(a, "__gppLocator", function(c) {
             return typeof c.__gpp === "function"
         }, NE);
         this.caller.B.set("addEventListener", JE);
         this.caller.o.set("addEventListener", LE);
         this.caller.B.set("removeEventListener", KE);
         this.caller.o.set("removeEventListener", ME);
         this.timeoutMs = b != null ? b : 500
     };
     r(OE, Q);
     OE.prototype.O = function() {
         this.caller.dispose();
         Q.prototype.O.call(this)
     };
     OE.prototype.addEventListener = function(a) {
         var b = this,
             c = mi(function() {
                 a(PE, !0)
             }),
             d = this.timeoutMs === -1 ? void 0 : setTimeout(function() {
                 c()
             }, this.timeoutMs);
         rE(this.caller, "addEventListener", {
             listener: function(e, f) {
                 clearTimeout(d);
                 try {
                     var g;
                     if (((g = e.pingData) == null ? void 0 : g.gppVersion) === void 0 || e.pingData.gppVersion === "1" || e.pingData.gppVersion === "1.0") {
                         b.removeEventListener(e.listenerId);
                         var h = {
                             eventName: "signalStatus",
                             data: "ready",
                             pingData: {
                                 internalErrorState: 1,
                                 gppString: "GPP_ERROR_STRING_IS_DEPRECATED_SPEC",
                                 applicableSections: [-1]
                             }
                         }
                     } else Array.isArray(e.pingData.applicableSections) ? h = e : (b.removeEventListener(e.listenerId), h = {
                         eventName: "signalStatus",
                         data: "ready",
                         pingData: {
                             internalErrorState: 2,
                             gppString: "GPP_ERROR_STRING_EXPECTED_APPLICATION_SECTION_ARRAY",
                             applicableSections: [-1]
                         }
                     });
                     a(h, f)
                 } catch (k) {
                     if (e == null ? 0 : e.listenerId) try {
                         b.removeEventListener(e.listenerId)
                     } catch (l) {
                         a(QE, !0);
                         return
                     }
                     a(RE, !0)
                 }
             }
         })
     };
     OE.prototype.removeEventListener = function(a) {
         rE(this.caller, "removeEventListener", {
             listener: function() {},
             listenerId: a
         })
     };
     var SE = function(a, b) {
             var c = !(b.includes(2), 0),
                 d = !1,
                 e = !1,
                 f = !1;
             if (a && !a.startsWith("GPP_ERROR_STRING_")) {
                 var g = iz(a.split("~")[0]),
                     h = jz(g.slice(0, 6)),
                     k = jz(g.slice(6, 12)),
                     l = new hz;
                 var n = xg(l, 1, h);
                 var p = xg(n, 2, k);
                 for (var q = g.slice(12), v = jz(q.slice(0, 12)), u = [], t = q.slice(12).replace(/0+$/, ""), y = 0; y < v; y++) {
                     if (t.length === 0) throw Error("Found " + y + " of " + v + " sections [" + u + "] but reached end of input [" + q + "]");
                     var D = jz(t[0]) === 0;
                     t = t.slice(1);
                     var ca = mz(t, q),
                         X = u.length === 0 ? 0 : u[u.length - 1],
                         fa = kz(ca) + X;
                     t = t.slice(ca.length);
                     if (D) u.push(fa);
                     else {
                         for (var Ba = mz(t, q), sa = kz(Ba), ab = 0; ab <= sa; ab++) u.push(fa + ab);
                         t = t.slice(Ba.length)
                     }
                 }
                 if (t.length > 0) throw Error("Found " + v + " sections [" + u + "] but has remaining input [" + t + "], entire input [" + q + "]");
                 var La = Uf(p, 3, u, ye);
                 var V = a.includes("~") ? a.split("~").slice(1) : [];
                 var da = rg(La, 3);
                 for (var Ma = 0; Ma < da.length; ++Ma) {
                     var wb = da[Ma];
                     if (b.includes(wb)) {
                         var qa = V[Ma];
                         switch (wb) {
                             case 2:
                                 var Pa = void 0;
                                 if ((Pa = void 0) == null ? 0 : Pa.supportTcfeu) {
                                     var ac = SD(qa, !0);
                                     if (!ac) throw Error("Cannot decode TCF V2 section string.");
                                     c = FE(ac);
                                     !IE(ac, ["3", "4"], 0) && (d = !0);
                                     !IE(ac, ["2", "7", "9", "10"], 3) && (e = !0)
                                 }
                                 break;
                             case 7:
                                 var xc = void 0,
                                     Qa = qa,
                                     lc = ((xc = void 0) == null ? 0 : xc.supportUsnatV2) ? [1, 2] : [1];
                                 lc = lc === void 0 ? [1] : lc;
                                 if (Qa.length === 0) throw Error("Cannot decode empty USNat section string.");
                                 var jd = Qa.split(".");
                                 if (jd.length > 2) throw Error("Expected at most 2 segments but got " + jd.length + " when decoding " + Qa + ".");
                                 var nf = void 0,
                                     of = void 0,
                                     Fl = void 0,
                                     Gl = void 0,
                                     Hl = void 0,
                                     Il = void 0,
                                     Jl = void 0,
                                     Kl = void 0,
                                     Ll = void 0,
                                     Ei = void 0,
                                     Ml = void 0,
                                     Fi = void 0,
                                     Gi = void 0,
                                     Hi = void 0,
                                     tz = void 0,
                                     uz = void 0,
                                     vz = void 0,
                                     wz = void 0,
                                     xz = void 0,
                                     yz = void 0,
                                     zz = void 0,
                                     Az = void 0,
                                     Bz = void 0,
                                     Cz = void 0,
                                     Dz = void 0,
                                     Ez = void 0,
                                     Fz = void 0,
                                     Gz = void 0,
                                     Hz = void 0,
                                     Iz = void 0,
                                     Jz = void 0,
                                     Kz = void 0,
                                     Lz = void 0,
                                     Mz = void 0,
                                     Nz = void 0,
                                     Oz = void 0,
                                     Pz = void 0,
                                     Qz = void 0,
                                     Rz = void 0,
                                     Sz = void 0,
                                     Tz = void 0,
                                     Uz = void 0,
                                     Vz = void 0,
                                     Wz = void 0,
                                     Xz = void 0,
                                     Yz = void 0,
                                     Zz = void 0,
                                     $z = void 0,
                                     aA = void 0,
                                     bA = void 0,
                                     cA = void 0,
                                     dA = void 0,
                                     eA = void 0,
                                     fA = void 0,
                                     gA = void 0,
                                     hA = void 0,
                                     iA = void 0,
                                     jA = void 0,
                                     kA = void 0,
                                     lA = void 0,
                                     mA = void 0,
                                     Eq = void 0,
                                     nA =
                                     jd[0],
                                     pf = lc;
                                 pf = pf === void 0 ? [1] : pf;
                                 if (nA.length === 0) throw Error("Cannot decode empty core segment string.");
                                 var Nl = lz(nA, XC),
                                     Hg = jz(Nl.slice(0, 6));
                                 Nl = Nl.slice(6);
                                 if (!pf.includes(Hg)) throw Error("Unable to decode unsupported USNat Section specification version " + (Hg + " - only version") + ((pf.length > 1 ? "s" : "") + " ") + (pf.join(", ") + " ") + ((pf.length > 1 ? "are" : "is") + " supported."));
                                 for (var Fq = 0, N = [], oA = Hg === 1 ? VC : WC, Gq = 0; Gq < oA.length; Gq++) {
                                     var pA = oA[Gq];
                                     N.push(jz(Nl.slice(Fq, Fq + pA)));
                                     Fq += pA
                                 }
                                 if (Hg === 1) {
                                     var AN = RC(Hg),
                                         BN = N.shift();
                                     mA = H(AN, 2, BN);
                                     var CN = N.shift();
                                     lA = H(mA, 3, CN);
                                     var DN = N.shift();
                                     kA = H(lA, 4, DN);
                                     var EN = N.shift();
                                     jA = H(kA, 5, EN);
                                     var FN = N.shift();
                                     iA = H(jA, 6, FN);
                                     var GN = N.shift();
                                     hA = H(iA, 7, GN);
                                     var HN = N.shift();
                                     gA = H(hA, 8, HN);
                                     var IN = N.shift();
                                     fA = H(gA, 9, IN);
                                     var JN = N.shift();
                                     eA = H(fA, 10, JN);
                                     var KN = new PC,
                                         LN = N.shift();
                                     dA = H(KN, 1, LN);
                                     var MN = N.shift();
                                     cA = H(dA, 2, MN);
                                     var NN = N.shift();
                                     bA = H(cA, 3, NN);
                                     var ON = N.shift();
                                     aA = H(bA, 4, ON);
                                     var PN = N.shift();
                                     $z = H(aA, 5, PN);
                                     var QN = N.shift();
                                     Zz = H($z, 6, QN);
                                     var RN = N.shift();
                                     Yz = H(Zz, 7, RN);
                                     var SN = N.shift();
                                     Xz = H(Yz, 8, SN);
                                     var TN = N.shift();
                                     Wz = H(Xz, 9, TN);
                                     var UN = N.shift();
                                     Vz = H(Wz, 10, UN);
                                     var VN = N.shift();
                                     Uz = H(Vz, 11, VN);
                                     var WN = N.shift();
                                     Tz = H(Uz, 12, WN);
                                     Sz = F(eA, 11, Tz);
                                     var XN = new OC,
                                         YN = N.shift();
                                     Rz = H(XN, 1, YN);
                                     var ZN = N.shift();
                                     Qz = H(Rz, 2, ZN);
                                     Pz = F(Sz, 12, Qz);
                                     var $N = N.shift();
                                     Oz = H(Pz, 13, $N);
                                     var aO = N.shift();
                                     Nz = H(Oz, 14, aO);
                                     var bO = N.shift();
                                     Mz = H(Nz, 15, bO);
                                     var cO = N.shift();
                                     Eq = H(Mz, 16, cO)
                                 } else {
                                     var dO = RC(Hg),
                                         eO = N.shift();
                                     Lz = H(dO, 2, eO);
                                     var fO = N.shift();
                                     Kz = H(Lz, 3, fO);
                                     var gO = N.shift();
                                     Jz = H(Kz, 4, gO);
                                     var hO =
                                         N.shift();
                                     Iz = H(Jz, 5, hO);
                                     var iO = N.shift();
                                     Hz = H(Iz, 6, iO);
                                     var jO = N.shift();
                                     Gz = H(Hz, 7, jO);
                                     var kO = N.shift();
                                     Fz = H(Gz, 8, kO);
                                     var lO = N.shift();
                                     Ez = H(Fz, 9, lO);
                                     var mO = N.shift();
                                     Dz = H(Ez, 10, mO);
                                     var nO = new PC,
                                         oO = N.shift();
                                     Cz = H(nO, 1, oO);
                                     var pO = N.shift();
                                     Bz = H(Cz, 2, pO);
                                     var qO = N.shift();
                                     Az = H(Bz, 3, qO);
                                     var rO = N.shift();
                                     zz = H(Az, 4, rO);
                                     var sO = N.shift();
                                     yz = H(zz, 5, sO);
                                     var tO = N.shift();
                                     xz = H(yz, 6, tO);
                                     var uO = N.shift();
                                     wz = H(xz, 7, uO);
                                     var vO = N.shift();
                                     vz = H(wz, 8, vO);
                                     var wO = N.shift();
                                     uz = H(vz, 9, wO);
                                     var xO = N.shift();
                                     tz = H(uz, 10, xO);
                                     var yO = N.shift();
                                     Hi = H(tz, 11, yO);
                                     var zO = N.shift();
                                     Gi = H(Hi, 12, zO);
                                     var AO = N.shift();
                                     Fi = H(Gi, 13, AO);
                                     var BO = N.shift();
                                     Ml = H(Fi, 14, BO);
                                     var CO = N.shift();
                                     Ei = H(Ml, 15, CO);
                                     var DO = N.shift();
                                     Ll = H(Ei, 16, DO);
                                     Kl = F(Dz, 11, Ll);
                                     var EO = new OC,
                                         FO = N.shift();
                                     Jl = H(EO, 1, FO);
                                     var GO = N.shift();
                                     Il = H(Jl, 2, GO);
                                     var HO = N.shift();
                                     Hl = H(Il, 3, HO);
                                     Gl = F(Kl, 12, Hl);
                                     var IO = N.shift();
                                     Fl = H(Gl, 13, IO);
                                     var JO = N.shift(); of = H(Fl, 14, JO);
                                     var KO = N.shift();
                                     nf = H( of , 15, KO);
                                     var LO = N.shift();
                                     Eq = H(nf, 16, LO)
                                 }
                                 var qA = Eq;
                                 if (jd.length === 1) var rA = UC(qA);
                                 else {
                                     var MO =
                                         UC(qA),
                                         sA = void 0,
                                         tA = void 0,
                                         uA = void 0,
                                         vA = jd[1];
                                     if (vA.length === 0) throw Error("Cannot decode empty GPC segment string.");
                                     var wA = lz(vA, 3),
                                         Ol = jz(wA.slice(0, 2));
                                     if (Ol < 0 || Ol > 1) throw Error("Attempting to decode unknown GPC segment subsection type " + Ol + ".");
                                     uA = Ol + 1;
                                     var NO = jz(wA.slice(2, 3)),
                                         OO = new SC;
                                     tA = H(OO, 2, uA);
                                     sA = vg(tA, 1, !!NO);
                                     rA = F(MO, 2, sA)
                                 }
                                 var xA = rA,
                                     Pl = E(xA, QC, 1),
                                     Ql = E(Pl, OC, 12);
                                 G(Pl, 8) !== 1 && G(Pl, 9) !== 1 && G(Pl, 10) !== 1 && (Ql == null ? void 0 : G(Ql, 1)) !== 1 && (Ql == null ? void 0 : G(Ql, 3)) !== 1 || (d = !0);
                                 var yA = void 0,
                                     PO =
                                     E(xA, QC, 1),
                                     zA = (yA = E(PO, OC, 12)) == null ? void 0 : G(yA, 2);
                                 zA !== 1 && zA !== 2 || (f = !0);
                                 break;
                             case 8:
                                 if (qa.length === 0) throw Error("Cannot decode empty USCA section string.");
                                 var Ii = qa.split(".");
                                 if (Ii.length > 2) throw Error("Expected at most 1 sub-section but got " + (Ii.length - 1) + " when decoding " + qa + ".");
                                 var QO = void 0,
                                     AA = void 0,
                                     BA = void 0,
                                     CA = void 0,
                                     DA = void 0,
                                     EA = void 0,
                                     FA = void 0,
                                     GA = void 0,
                                     HA = void 0,
                                     IA = void 0,
                                     JA = void 0,
                                     KA = void 0,
                                     LA = void 0,
                                     MA = void 0,
                                     NA = void 0,
                                     OA = void 0,
                                     PA = void 0,
                                     QA = void 0,
                                     RA = void 0,
                                     SA = void 0,
                                     TA = void 0,
                                     UA = void 0,
                                     VA = void 0,
                                     WA = Ii[0];
                                 if (WA.length === 0) throw Error("Cannot decode empty core segment string.");
                                 var Rl = lz(WA, tC),
                                     Hq = jz(Rl.slice(0, 6));
                                 Rl = Rl.slice(6);
                                 if (Hq !== 1) throw Error("Unable to decode unsupported USCA Section specification version " + Hq + " - only version 1 is supported.");
                                 for (var Iq = 0, bb = [], Jq = 0; Jq < sC.length; Jq++) {
                                     var XA = sC[Jq];
                                     bb.push(jz(Rl.slice(Iq, Iq + XA)));
                                     Iq += XA
                                 }
                                 var RO = new pz;
                                 VA = xg(RO, 1, Hq);
                                 var SO = bb.shift();
                                 UA = H(VA, 2, SO);
                                 var TO = bb.shift();
                                 TA = H(UA, 3, TO);
                                 var UO = bb.shift();
                                 SA = H(TA, 4, UO);
                                 var VO = bb.shift();
                                 RA = H(SA, 5, VO);
                                 var WO = bb.shift();
                                 QA = H(RA, 6, WO);
                                 var XO = new oz,
                                     YO = bb.shift();
                                 PA = H(XO, 1, YO);
                                 var ZO = bb.shift();
                                 OA = H(PA, 2, ZO);
                                 var $O = bb.shift();
                                 NA = H(OA, 3, $O);
                                 var aP = bb.shift();
                                 MA = H(NA, 4, aP);
                                 var bP = bb.shift();
                                 LA = H(MA, 5, bP);
                                 var cP = bb.shift();
                                 KA = H(LA, 6, cP);
                                 var dP = bb.shift();
                                 JA = H(KA, 7, dP);
                                 var eP = bb.shift();
                                 IA = H(JA, 8, eP);
                                 var fP = bb.shift();
                                 HA = H(IA, 9, fP);
                                 GA = F(QA, 7, HA);
                                 var gP = new nz,
                                     hP = bb.shift();
                                 FA = H(gP, 1, hP);
                                 var iP = bb.shift();
                                 EA = H(FA, 2, iP);
                                 DA = F(GA, 8, EA);
                                 var jP = bb.shift();
                                 CA = H(DA, 9, jP);
                                 var kP =
                                     bb.shift();
                                 BA = H(CA, 10, kP);
                                 var lP = bb.shift();
                                 AA = H(BA, 11, lP);
                                 var mP = bb.shift();
                                 var YA = QO = H(AA, 12, mP);
                                 if (Ii.length === 1) var ZA = sz(YA);
                                 else {
                                     var nP = sz(YA),
                                         $A = void 0,
                                         aB = void 0,
                                         bB = void 0,
                                         cB = Ii[1];
                                     if (cB.length === 0) throw Error("Cannot decode empty GPC segment string.");
                                     var dB = lz(cB, 3),
                                         Sl = jz(dB.slice(0, 2));
                                     if (Sl < 0 || Sl > 1) throw Error("Attempting to decode unknown GPC segment subsection type " + Sl + ".");
                                     bB = Sl + 1;
                                     var oP = jz(dB.slice(2, 3)),
                                         pP = new qz;
                                     aB = H(pP, 2, bB);
                                     $A = vg(aB, 1, !!oP);
                                     ZA = F(nP, 2, $A)
                                 }
                                 var eB = ZA,
                                     fB = E(eB, pz, 1);
                                 G(fB, 5) !== 1 && G(fB, 6) !== 1 || (d = !0);
                                 var qP = E(eB, pz, 1);
                                 var ue = E(qP, nz, 8);
                                 (ue == null ? void 0 : G(ue, 1)) !== 1 && (ue == null ? void 0 : G(ue, 1)) !== 2 && (ue == null ? void 0 : G(ue, 2)) !== 1 && (ue == null ? void 0 : G(ue, 2)) !== 2 || (f = !0);
                                 break;
                             case 9:
                                 if (qa.length === 0) throw Error("Cannot decode empty USVA section string.");
                                 var Tl = lz(qa, aD),
                                     Kq = jz(Tl.slice(0, 6));
                                 Tl = Tl.slice(6);
                                 if (Kq !== 1) throw Error("Unable to decode unsupported USVA Section specification version " + Kq + " - only version 1 is supported.");
                                 for (var Lq = 0, rb = [], Mq = 0; Mq < $C.length; Mq++) {
                                     var gB =
                                         $C[Mq];
                                     rb.push(jz(Tl.slice(Lq, Lq + gB)));
                                     Lq += gB
                                 }
                                 var rP = Kq,
                                     sP = new ZC,
                                     tP = xg(sP, 1, rP),
                                     uP = rb.shift(),
                                     vP = H(tP, 2, uP),
                                     wP = rb.shift(),
                                     xP = H(vP, 3, wP),
                                     yP = rb.shift(),
                                     zP = H(xP, 4, yP),
                                     AP = rb.shift(),
                                     BP = H(zP, 5, AP),
                                     CP = rb.shift();
                                 var DP = H(BP, 6, CP);
                                 var EP = new YC,
                                     FP = rb.shift(),
                                     GP = H(EP, 1, FP),
                                     HP = rb.shift(),
                                     IP = H(GP, 2, HP),
                                     JP = rb.shift(),
                                     KP = H(IP, 3, JP),
                                     LP = rb.shift(),
                                     MP = H(KP, 4, LP),
                                     NP = rb.shift(),
                                     OP = H(MP, 5, NP),
                                     PP = rb.shift(),
                                     QP = H(OP, 6, PP),
                                     RP = rb.shift(),
                                     SP = H(QP, 7, RP),
                                     TP = rb.shift();
                                 var UP = H(SP, 8, TP);
                                 var VP = F(DP, 7, UP),
                                     WP = rb.shift(),
                                     XP =
                                     H(VP, 8, WP),
                                     YP = rb.shift(),
                                     ZP = H(XP, 9, YP),
                                     $P = rb.shift(),
                                     aQ = H(ZP, 10, $P),
                                     bQ = rb.shift(),
                                     Nq = H(aQ, 11, bQ);
                                 G(Nq, 5) !== 1 && G(Nq, 6) !== 1 || (d = !0);
                                 var hB = G(Nq, 8);
                                 hB !== 1 && hB !== 2 || (f = !0);
                                 break;
                             case 10:
                                 if (qa.length === 0) throw Error("Cannot decode empty USCO section string.");
                                 var Ji = qa.split(".");
                                 if (Ji.length > 2) throw Error("Expected at most 2 segments but got " + Ji.length + " when decoding " + qa + ".");
                                 var cQ = void 0,
                                     iB = void 0,
                                     jB = void 0,
                                     kB = void 0,
                                     lB = void 0,
                                     mB = void 0,
                                     nB = void 0,
                                     oB = void 0,
                                     pB = void 0,
                                     qB = void 0,
                                     rB = void 0,
                                     sB = void 0,
                                     tB = void 0,
                                     uB = void 0,
                                     vB = void 0,
                                     wB = void 0,
                                     xB = void 0,
                                     yB = void 0,
                                     zB = Ji[0];
                                 if (zB.length === 0) throw Error("Cannot decode empty core segment string.");
                                 var Ul = lz(zB, AC),
                                     Oq = jz(Ul.slice(0, 6));
                                 Ul = Ul.slice(6);
                                 if (Oq !== 1) throw Error("Unable to decode unsupported USCO Section specification version " + Oq + " - only version 1 is supported.");
                                 for (var Pq = 0, xb = [], Qq = 0; Qq < zC.length; Qq++) {
                                     var AB = zC[Qq];
                                     xb.push(jz(Ul.slice(Pq, Pq + AB)));
                                     Pq += AB
                                 }
                                 var dQ = new vC;
                                 yB = xg(dQ, 1, Oq);
                                 var eQ = xb.shift();
                                 xB = H(yB, 2, eQ);
                                 var fQ = xb.shift();
                                 wB = H(xB,
                                     3, fQ);
                                 var gQ = xb.shift();
                                 vB = H(wB, 4, gQ);
                                 var hQ = xb.shift();
                                 uB = H(vB, 5, hQ);
                                 var iQ = xb.shift();
                                 tB = H(uB, 6, iQ);
                                 var jQ = new uC,
                                     kQ = xb.shift();
                                 sB = H(jQ, 1, kQ);
                                 var lQ = xb.shift();
                                 rB = H(sB, 2, lQ);
                                 var mQ = xb.shift();
                                 qB = H(rB, 3, mQ);
                                 var nQ = xb.shift();
                                 pB = H(qB, 4, nQ);
                                 var oQ = xb.shift();
                                 oB = H(pB, 5, oQ);
                                 var pQ = xb.shift();
                                 nB = H(oB, 6, pQ);
                                 var qQ = xb.shift();
                                 mB = H(nB, 7, qQ);
                                 lB = F(tB, 7, mB);
                                 var rQ = xb.shift();
                                 kB = H(lB, 8, rQ);
                                 var sQ = xb.shift();
                                 jB = H(kB, 9, sQ);
                                 var tQ = xb.shift();
                                 iB = H(jB, 10, tQ);
                                 var uQ = xb.shift();
                                 var BB = cQ = H(iB, 11, uQ);
                                 if (Ji.length ===
                                     1) var CB = yC(BB);
                                 else {
                                     var vQ = yC(BB),
                                         DB = void 0,
                                         EB = void 0,
                                         FB = void 0,
                                         GB = Ji[1];
                                     if (GB.length === 0) throw Error("Cannot decode empty GPC segment string.");
                                     var HB = lz(GB, 3),
                                         Vl = jz(HB.slice(0, 2));
                                     if (Vl < 0 || Vl > 1) throw Error("Attempting to decode unknown GPC segment subsection type " + Vl + ".");
                                     FB = Vl + 1;
                                     var wQ = jz(HB.slice(2, 3)),
                                         xQ = new wC;
                                     EB = H(xQ, 2, FB);
                                     DB = vg(EB, 1, !!wQ);
                                     CB = F(vQ, 2, DB)
                                 }
                                 var IB = CB,
                                     JB = E(IB, vC, 1);
                                 G(JB, 5) !== 1 && G(JB, 6) !== 1 || (d = !0);
                                 var yQ = E(IB, vC, 1);
                                 var KB = G(yQ, 8);
                                 KB !== 1 && KB !== 2 || (f = !0);
                                 break;
                             case 12:
                                 if (qa.length ===
                                     0) throw Error("Cannot decode empty usct section string.");
                                 var Ki = qa.split(".");
                                 if (Ki.length > 2) throw Error("Expected at most 2 segments but got " + Ki.length + " when decoding " + qa + ".");
                                 var zQ = void 0,
                                     LB = void 0,
                                     MB = void 0,
                                     NB = void 0,
                                     OB = void 0,
                                     PB = void 0,
                                     QB = void 0,
                                     RB = void 0,
                                     SB = void 0,
                                     TB = void 0,
                                     UB = void 0,
                                     VB = void 0,
                                     WB = void 0,
                                     XB = void 0,
                                     YB = void 0,
                                     ZB = void 0,
                                     $B = void 0,
                                     aC = void 0,
                                     bC = void 0,
                                     cC = void 0,
                                     dC = void 0,
                                     eC = void 0,
                                     fC = Ki[0];
                                 if (fC.length === 0) throw Error("Cannot decode empty core segment string.");
                                 var Wl = lz(fC, IC),
                                     Rq = jz(Wl.slice(0, 6));
                                 Wl = Wl.slice(6);
                                 if (Rq !== 1) throw Error("Unable to decode unsupported USCT Section specification version " + Rq + " - only version 1 is supported.");
                                 for (var Sq = 0, ib = [], Tq = 0; Tq < HC.length; Tq++) {
                                     var gC = HC[Tq];
                                     ib.push(jz(Wl.slice(Sq, Sq + gC)));
                                     Sq += gC
                                 }
                                 var AQ = new DC;
                                 eC = xg(AQ, 1, Rq);
                                 var BQ = ib.shift();
                                 dC = H(eC, 2, BQ);
                                 var CQ = ib.shift();
                                 cC = H(dC, 3, CQ);
                                 var DQ = ib.shift();
                                 bC = H(cC, 4, DQ);
                                 var EQ = ib.shift();
                                 aC = H(bC, 5, EQ);
                                 var FQ = ib.shift();
                                 $B = H(aC, 6, FQ);
                                 var GQ = new CC,
                                     HQ = ib.shift();
                                 ZB = H(GQ, 1, HQ);
                                 var IQ = ib.shift();
                                 YB = H(ZB, 2, IQ);
                                 var JQ = ib.shift();
                                 XB = H(YB, 3, JQ);
                                 var KQ = ib.shift();
                                 WB = H(XB, 4, KQ);
                                 var LQ = ib.shift();
                                 VB = H(WB, 5, LQ);
                                 var MQ = ib.shift();
                                 UB = H(VB, 6, MQ);
                                 var NQ = ib.shift();
                                 TB = H(UB, 7, NQ);
                                 var OQ = ib.shift();
                                 SB = H(TB, 8, OQ);
                                 RB = F($B, 7, SB);
                                 var PQ = new BC,
                                     QQ = ib.shift();
                                 QB = H(PQ, 1, QQ);
                                 var RQ = ib.shift();
                                 PB = H(QB, 2, RQ);
                                 var SQ = ib.shift();
                                 OB = H(PB, 3, SQ);
                                 NB = F(RB, 8, OB);
                                 var TQ = ib.shift();
                                 MB = H(NB, 9, TQ);
                                 var UQ = ib.shift();
                                 LB = H(MB, 10, UQ);
                                 var VQ = ib.shift();
                                 var hC = zQ = H(LB, 11, VQ);
                                 if (Ki.length === 1) var iC = GC(hC);
                                 else {
                                     var WQ = GC(hC),
                                         jC = void 0,
                                         kC = void 0,
                                         lC = void 0,
                                         mC = Ki[1];
                                     if (mC.length === 0) throw Error("Cannot decode empty GPC segment string.");
                                     var nC = lz(mC, 3),
                                         Xl = jz(nC.slice(0, 2));
                                     if (Xl < 0 || Xl > 1) throw Error("Attempting to decode unknown GPC segment subsection type " + Xl + ".");
                                     lC = Xl + 1;
                                     var XQ = jz(nC.slice(2, 3)),
                                         YQ = new EC;
                                     kC = H(YQ, 2, lC);
                                     jC = vg(kC, 1, !!XQ);
                                     iC = F(WQ, 2, jC)
                                 }
                                 var oC = iC,
                                     Uq = E(oC, DC, 1),
                                     Yl = E(Uq, BC, 8);
                                 G(Uq, 5) !== 1 && G(Uq, 6) !== 1 && (Yl == null ? void 0 : G(Yl, 2)) !== 1 && (Yl == null ? void 0 : G(Yl, 3)) !== 1 || (d = !0);
                                 var ZQ = E(oC, DC, 1);
                                 var Zl = E(ZQ, BC, 8);
                                 (Zl == null ? void 0 :
                                     G(Zl, 1)) !== 1 && (Zl == null ? void 0 : G(Zl, 1)) !== 2 || (f = !0);
                                 break;
                             case 13:
                                 if (qa.length === 0) throw Error("Cannot decode empty USFL section string.");
                                 var $l = lz(qa, NC),
                                     Vq = jz($l.slice(0, 6));
                                 $l = $l.slice(6);
                                 if (Vq !== 1) throw Error("Unable to decode unsupported USFL Section specification version " + Vq + " - only version 1 is supported.");
                                 for (var Wq = 0, cb = [], Xq = 0; Xq < MC.length; Xq++) {
                                     var pC = MC[Xq];
                                     cb.push(jz($l.slice(Wq, Wq + pC)));
                                     Wq += pC
                                 }
                                 var $Q = Vq,
                                     aR = new LC,
                                     bR = xg(aR, 1, $Q),
                                     cR = cb.shift(),
                                     dR = H(bR, 2, cR),
                                     eR = cb.shift(),
                                     fR = H(dR, 3,
                                         eR),
                                     gR = cb.shift(),
                                     hR = H(fR, 4, gR),
                                     iR = cb.shift(),
                                     jR = H(hR, 5, iR),
                                     kR = cb.shift();
                                 var lR = H(jR, 6, kR);
                                 var mR = new KC,
                                     nR = cb.shift(),
                                     oR = H(mR, 1, nR),
                                     pR = cb.shift(),
                                     qR = H(oR, 2, pR),
                                     rR = cb.shift(),
                                     sR = H(qR, 3, rR),
                                     tR = cb.shift(),
                                     uR = H(sR, 4, tR),
                                     vR = cb.shift(),
                                     wR = H(uR, 5, vR),
                                     xR = cb.shift(),
                                     yR = H(wR, 6, xR),
                                     zR = cb.shift(),
                                     AR = H(yR, 7, zR),
                                     BR = cb.shift();
                                 var CR = H(AR, 8, BR);
                                 var DR = F(lR, 7, CR);
                                 var ER = new JC,
                                     FR = cb.shift(),
                                     GR = H(ER, 1, FR),
                                     HR = cb.shift(),
                                     IR = H(GR, 2, HR),
                                     JR = cb.shift();
                                 var KR = H(IR, 3, JR);
                                 var LR = F(DR, 8, KR),
                                     MR = cb.shift(),
                                     NR = H(LR, 9, MR),
                                     OR =
                                     cb.shift(),
                                     PR = H(NR, 10, OR),
                                     QR = cb.shift(),
                                     RR = H(PR, 11, QR),
                                     SR = cb.shift(),
                                     am = H(RR, 12, SR),
                                     bm = E(am, JC, 8);
                                 G(am, 5) !== 1 && G(am, 6) !== 1 && (bm == null ? void 0 : G(bm, 2)) !== 1 && (bm == null ? void 0 : G(bm, 3)) !== 1 || (d = !0);
                                 var qC = void 0,
                                     rC = (qC = E(am, JC, 8)) == null ? void 0 : G(qC, 1);
                                 rC !== 1 && rC !== 2 || (f = !0)
                         }
                     }
                 }
             }
             return {
                 Gk: c,
                 Oh: d,
                 Hk: e,
                 mk: f
             }
         },
         RE = {
             eventName: "signalStatus",
             data: "ready",
             pingData: {
                 internalErrorState: 2,
                 gppString: "GPP_ERROR_STRING_UNAVAILABLE",
                 applicableSections: [-1]
             },
             listenerId: -1
         },
         PE = {
             eventName: "signalStatus",
             data: "ready",
             pingData: {
                 gppString: "GPP_ERROR_STRING_LISTENER_REGISTRATION_TIMEOUT",
                 internalErrorState: 2,
                 applicableSections: [-1]
             },
             listenerId: -1
         },
         QE = {
             eventName: "signalStatus",
             data: "ready",
             pingData: {
                 gppString: "GPP_ERROR_STRING_REMOVE_EVENT_LISTENER_ERROR",
                 internalErrorState: 2,
                 applicableSections: [-1]
             },
             listenerId: -1
         };
     gE([1, 8, 9, 10, 11, 12, 2, 3, 4, 5, 15, 16, 19, 20, 21, 23]);
     gE([1, 6, 7, 9, 10, 11, 12, 2, 3, 4, 5, 13, 14, 18, 19, 20, 21, 23]);
     gE([1, 6, 7, 9, 10, 11, 12, 22, 2, 3, 4, 5, 13, 14, 17, 18, 19, 20, 21, 23]);
     new fE;
     var TE = function(a, b) {
         this.g = this.A = this.o = "";
         this.I = null;
         this.L = this.j = "";
         this.B = !1;
         var c;
         a instanceof TE ? (this.B = b !== void 0 ? b : a.B, UE(this, a.o), this.A = a.A, this.g = a.g, VE(this, a.I), this.j = a.j, WE(this, XE(a.l)), this.L = a.F()) : a && (c = String(a).match(ap)) ? (this.B = !!b, UE(this, c[1] || "", !0), this.A = YE(c[2] || ""), this.g = YE(c[3] || "", !0), VE(this, c[4]), this.j = YE(c[5] || "", !0), WE(this, c[6] || "", !0), this.L = YE(c[7] || "")) : (this.B = !!b, this.l = new ZE(null, this.B))
     };
     TE.prototype.toString = function() {
         var a = [],
             b = this.o;
         b && a.push($E(b, aF, !0), ":");
         var c = this.g;
         if (c || b == "file") a.push("//"), (b = this.A) && a.push($E(b, aF, !0), "@"), a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.I, c != null && a.push(":", String(c));
         if (c = this.j) this.g && c.charAt(0) != "/" && a.push("/"), a.push($E(c, c.charAt(0) == "/" ? bF : cF, !0));
         (c = this.l.toString()) && a.push("?", c);
         (c = this.F()) && a.push("#", $E(c, dF));
         return a.join("")
     };
     TE.prototype.resolve = function(a) {
         var b = this.G(),
             c = !!a.o;
         c ? UE(b, a.o) : c = !!a.A;
         c ? b.A = a.A : c = !!a.g;
         c ? b.g = a.g : c = a.I != null;
         var d = a.j;
         if (c) VE(b, a.I);
         else if (c = !!a.j) {
             if (d.charAt(0) != "/")
                 if (this.g && !this.j) d = "/" + d;
                 else {
                     var e = b.j.lastIndexOf("/");
                     e != -1 && (d = b.j.slice(0, e + 1) + d)
                 } e = d;
             if (e == ".." || e == ".") d = "";
             else if (Mb(e, "./") || Mb(e, "/.")) {
                 d = e.lastIndexOf("/", 0) == 0;
                 e = e.split("/");
                 for (var f = [], g = 0; g < e.length;) {
                     var h = e[g++];
                     h == "." ? d && g == e.length && f.push("") : h == ".." ? ((f.length > 1 || f.length == 1 && f[0] != "") && f.pop(), d &&
                         g == e.length && f.push("")) : (f.push(h), d = !0)
                 }
                 d = f.join("/")
             } else d = e
         }
         c ? b.j = d : c = a.l.toString() !== "";
         c ? WE(b, XE(a.l)) : c = !!a.L;
         c && (b.L = a.F());
         return b
     };
     TE.prototype.G = function() {
         return new TE(this)
     };
     var UE = function(a, b, c) {
             a.o = c ? YE(b, !0) : b;
             a.o && (a.o = a.o.replace(/:$/, ""))
         },
         VE = function(a, b) {
             if (b) {
                 b = Number(b);
                 if (isNaN(b) || b < 0) throw Error("Bad port number " + b);
                 a.I = b
             } else a.I = null
         },
         WE = function(a, b, c) {
             b instanceof ZE ? (a.l = b, eF(a.l, a.B)) : (c || (b = $E(b, fF)), a.l = new ZE(b, a.B))
         },
         gF = function(a, b, c) {
             a.l.set(b, c);
             return a
         },
         hF = function(a, b) {
             return a.l.get(b)
         };
     TE.prototype.F = function() {
         return this.L
     };
     var iF = function(a) {
             return a instanceof TE ? a.G() : new TE(a, void 0)
         },
         YE = function(a, b) {
             return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : ""
         },
         $E = function(a, b, c) {
             return typeof a === "string" ? (a = encodeURI(a).replace(b, jF), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null
         },
         jF = function(a) {
             a = a.charCodeAt(0);
             return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
         },
         aF = /[#\/\?@]/g,
         cF = /[#\?:]/g,
         bF = /[#\?]/g,
         fF = /[#\?@]/g,
         dF = /#/g,
         ZE = function(a, b) {
             this.j = this.g = null;
             this.l = a || null;
             this.o = !!b
         },
         kF =
         function(a) {
             a.g || (a.g = new Map, a.j = 0, a.l && cp(a.l, function(b, c) {
                 a.add(Ri(b), c)
             }))
         };
     ZE.prototype.add = function(a, b) {
         kF(this);
         this.l = null;
         a = lF(this, a);
         var c = this.g.get(a);
         c || this.g.set(a, c = []);
         c.push(b);
         this.j += 1;
         return this
     };
     ZE.prototype.remove = function(a) {
         kF(this);
         a = lF(this, a);
         return this.g.has(a) ? (this.l = null, this.j -= this.g.get(a).length, this.g.delete(a)) : !1
     };
     ZE.prototype.clear = function() {
         this.g = this.l = null;
         this.j = 0
     };
     ZE.prototype.isEmpty = function() {
         kF(this);
         return this.j == 0
     };
     var mF = function(a, b) {
         kF(a);
         b = lF(a, b);
         return a.g.has(b)
     };
     m = ZE.prototype;
     m.forEach = function(a, b) {
         kF(this);
         this.g.forEach(function(c, d) {
             c.forEach(function(e) {
                 a.call(b, e, d, this)
             }, this)
         }, this)
     };
     m.cd = function() {
         kF(this);
         for (var a = Array.from(this.g.values()), b = Array.from(this.g.keys()), c = [], d = 0; d < b.length; d++)
             for (var e = a[d], f = 0; f < e.length; f++) c.push(b[d]);
         return c
     };
     m.ac = function(a) {
         kF(this);
         var b = [];
         if (typeof a === "string") mF(this, a) && (b = b.concat(this.g.get(lF(this, a))));
         else {
             a = Array.from(this.g.values());
             for (var c = 0; c < a.length; c++) b = b.concat(a[c])
         }
         return b
     };
     m.set = function(a, b) {
         kF(this);
         this.l = null;
         a = lF(this, a);
         mF(this, a) && (this.j -= this.g.get(a).length);
         this.g.set(a, [b]);
         this.j += 1;
         return this
     };
     m.get = function(a, b) {
         if (!a) return b;
         a = this.ac(a);
         return a.length > 0 ? String(a[0]) : b
     };
     m.toString = function() {
         if (this.l) return this.l;
         if (!this.g) return "";
         for (var a = [], b = Array.from(this.g.keys()), c = 0; c < b.length; c++) {
             var d = b[c],
                 e = encodeURIComponent(String(d));
             d = this.ac(d);
             for (var f = 0; f < d.length; f++) {
                 var g = e;
                 d[f] !== "" && (g += "=" + encodeURIComponent(String(d[f])));
                 a.push(g)
             }
         }
         return this.l = a.join("&")
     };
     var XE = function(a) {
             var b = new ZE;
             b.l = a.l;
             a.g && (b.g = new Map(a.g), b.j = a.j);
             return b
         },
         lF = function(a, b) {
             b = String(b);
             a.o && (b = b.toLowerCase());
             return b
         },
         eF = function(a, b) {
             b && !a.o && (kF(a), a.l = null, a.g.forEach(function(c, d) {
                 var e = d.toLowerCase();
                 d != e && (this.remove(d), this.remove(e), c.length > 0 && (this.l = null, this.g.set(lF(this, e), vc(c)), this.j += c.length))
             }, a));
             a.o = b
         };
     var nF, oF, pF, qF = function() {
             return x.navigator ? x.navigator.userAgent : ""
         },
         rF = Mb(qF(), "(iPad") || Mb(qF(), "(Macintosh") || Mb(qF(), "(iPod") || Mb(qF(), "(iPhone");
     var sF = "ad.doubleclick.net bid.g.doubleclick.net ggpht.com google.co.uk google.com googleads.g.doubleclick.net googleads4.g.doubleclick.net googleadservices.com googlesyndication.com googleusercontent.com gstatic.com gvt1.com prod.google.com pubads.g.doubleclick.net s0.2mdn.net static.doubleclick.net surveys.g.doubleclick.net youtube.com ytimg.com".split(" "),
         tF = ["c.googlesyndication.com"];

     function uF(a, b) {
         b = b === void 0 ? window.location.protocol : b;
         var c = !1;
         a == null || !a.startsWith("http") || (a == null ? 0 : a.startsWith("https")) ? c = !1 : vF(a, tF) ? c = !1 : b.includes("https") && vF(a, sF) && (c = !0);
         return c ? (a = new TE(a), M(L.getInstance(), "htp", "1"), UE(a, "https"), a.toString()) : a
     }

     function wF(a) {
         if (!a) return !1;
         try {
             return (typeof a === "string" ? new TE(a) : a).o === "gcache"
         } catch (b) {
             return !1
         }
     }

     function xF(a) {
         return wF(a) && !!hF(new TE(a), "url")
     }

     function yF(a) {
         try {
             var b = typeof a === "string" ? new TE(a) : a;
             if (wF(b)) {
                 var c, d;
                 return (d = (c = hF(b, "url")) != null ? c : hF(b, "tag.check_url")) != null ? d : null
             }
         } catch (e) {}
         return null
     }

     function vF(a, b) {
         return (new RegExp("^https?://([a-z0-9-]{1,63}\\.)*(" + b.join("|").replace(/\./g, "\\.") + ")(:[0-9]+)?([/?#]|$)", "i")).test(a)
     };
     var zF = -1;

     function AF(a, b) {
         b = b != null ? b : "";
         Gc && (b = "");
         if (!Db(Vi(a))) {
             var c = a instanceof wi || !hE.test(a) ? a : xi(a);
             if (c instanceof wi) var d = c;
             else {
                 d = d === void 0 ? Bi : d;
                 a: if (d = d === void 0 ? Bi : d, !(a instanceof wi)) {
                     for (c = 0; c < d.length; ++c) {
                         var e = d[c];
                         if (e instanceof zi && e.Ih(a)) {
                             a = xi(a);
                             break a
                         }
                     }
                     a = void 0
                 } d = a || yi
             }
             a = window;
             if (d instanceof wi)
                 if (d instanceof wi) d = d.g;
                 else throw Error("");
             else d = Di.test(d) ? d : void 0;
             d !== void 0 && a.open(d, "_blank", b)
         }
     };

     function BF(a, b) {
         for (var c; !(c = a.next()).done;) b(c.value)
     }
     var CF = function(a, b) {
         this.g = a[x.Symbol.iterator]();
         this.j = b
     };
     CF.prototype[Symbol.iterator] = function() {
         return this
     };
     CF.prototype.next = function() {
         var a = this.g.next();
         return {
             value: a.done ? void 0 : this.j.call(void 0, a.value),
             done: a.done
         }
     };
     var DF = function(a, b) {
         return new CF(a, b)
     };
     var EF = function(a, b) {
         var c = new Set(a);
         BF(b[Symbol.iterator](), function(d) {
             return c.add(d)
         });
         return c
     };
     var FF = {
             attributes: !0,
             attributeFilter: ["style", "class"]
         },
         GF = new Map;

     function HF(a, b, c, d) {
         return typeof DOMRect !== "undefined" ? new DOMRect(a, b, c, d) : {
             x: a,
             y: b,
             width: c,
             height: d,
             top: b,
             bottom: b + d,
             left: a,
             right: a + c,
             toJSON: function() {
                 return this
             }
         }
     }

     function IF(a, b) {
         return ["top", "left", "width", "height"].every(function(c) {
             return Math.abs(Number(a[c]) - Number(b[c])) <= 1
         })
     }
     var JF = function() {
         this.l = this.g = this.j = null
     };

     function KF(a, b, c, d) {
         var e = a.getBoundingClientRect();
         IF(b, e) ? (e = setTimeout(function() {
             return KF(a, b, c, d)
         }, 200), d.l = e) : (LF(d), c(e))
     }

     function MF(a) {
         var b = new JF,
             c = new Promise(function(f) {
                 var g = a.getBoundingClientRect();
                 if ("ResizeObserver" in window) {
                     var h = new ResizeObserver(function(k) {
                         window.requestAnimationFrame(function() {
                             for (var l = w(k), n = l.next(); !n.done; n = l.next()) {
                                 var p = n.value;
                                 if (p.contentBoxSize) {
                                     var q = Array.isArray(p.contentBoxSize) ? p.contentBoxSize[0] : p.contentBoxSize;
                                     n = Math.round(q.inlineSize);
                                     q = Math.round(q.blockSize)
                                 } else n = Math.round(p.contentRect.width), q = Math.round(p.contentRect.height);
                                 var v = void 0,
                                     u = void 0,
                                     t = ((v =
                                         p) == null ? void 0 : (u = v.contentRect) == null ? void 0 : u.left) || g.left;
                                 u = v = void 0;
                                 p = ((v = p) == null ? void 0 : (u = v.contentRect) == null ? void 0 : u.top) || g.top;
                                 n = HF(t, p, n, q);
                                 if (!IF(g, n)) return LF(b), f(n)
                             }
                         })
                     });
                     b.j = h;
                     h.observe(a);
                     h = new MutationObserver(function() {
                         window.requestAnimationFrame(function() {
                             var k = a.getBoundingClientRect();
                             if (!IF(g, k)) return LF(b), f(k)
                         })
                     });
                     b.g = h;
                     h.observe(a, FF)
                 } else KF(a, g, f, b)
             }),
             d, e = (d = GF.get(c)) != null ? d : new Set;
         e.add(b);
         GF.set(c, e);
         return c
     }

     function NF(a, b) {
         b = b === void 0 ? HF(0, 0, 1, 1) : b;
         var c = function(g) {
                 var h = MF(a),
                     k, l = (k = GF.get(g)) != null ? k : new Set,
                     n;
                 k = (n = GF.get(h)) != null ? n : new Set;
                 GF.set(g, EF(l, k));
                 return h
             },
             d = function(g, h) {
                 c(g).then(function(k) {
                     return b.width <= k.width && b.height <= k.height ? (OF(g), h(k)) : d(g, h)
                 })
             },
             e, f = new Promise(function(g) {
                 e = g
             });
         d(f, e);
         return f
     }

     function OF(a) {
         a = GF.get(a);
         a = w(a);
         for (var b = a.next(); !b.done; b = a.next()) LF(b.value)
     }

     function LF(a) {
         a.l && window.clearTimeout(a.l);
         a.j && (a.j.disconnect(), a.j = null);
         a.g && (a.g.disconnect(), a.g = null)
     };

     function PF(a, b) {
         return a && (a[b] || (a[b] = {}))
     }

     function QF(a, b) {
         var c;
         if (c = c === void 0 ? typeof omidExports === "undefined" ? null : omidExports : c) a = a.split("."), a.slice(0, a.length - 1).reduce(PF, c)[a[a.length - 1]] = b
     };
     var RF = new Map([
         [2, [/^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.moatads\.com\/.*$/]],
         [3, [/^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.doubleverify\.com\/.*$/, /^(https?:\/\/|\/\/)?c\.[\w\-]+\.com\/vfw\/dv\/.*$/, /^(https?:\/\/|\/\/)?(www\.)?[\w]+\.tv\/r\/s\/d\/.*$/, /^(https?:\/\/|\/\/)?(\w\.?)+\.dv\.tech\/.*$/]],
         [4, [/^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.adsafeprotected\.com\/.*$/]],
         [5, [/^https?:\/\/(q|cdn)\.adrta\.com\/s\/.*\/(aa|aanf)\.js.*$/, /^https:\/\/cdn\.rta247\.com\/s\/.*\/(aa|aanf)\.js.*$/]],
         [6, []],
         [7, [/^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.voicefive\.com\/.*$/,
             /^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.measuread\.com\/.*$/, /^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.scorecardresearch\.com\/.*$/
         ]],
         [8, [/^(https?:\/\/|\/\/)?s418\.mxcdn\.net\/bb-serve\/omid-meetrics.*\.js$/]],
         [9, [/^(https?:\/\/|\/\/)?pagead2\.googlesyndication\.com\/.*$/, /^(https?:\/\/|\/\/)?www\.googletagservices\.com\/.*$/]]
     ]);
     QF("OmidSessionClient.verificationVendorIdForScriptUrl", function(a) {
         for (var b = w(RF.keys()), c = b.next(); !c.done; c = b.next()) {
             c = c.value;
             for (var d = w(RF.get(c)), e = d.next(); !e.done; e = d.next())
                 if (e.value.test(a)) return c
         }
         return 1
     });
     QF("OmidSessionClient.VerificationVendorId", {
         OTHER: 1,
         MOAT: 2,
         DOUBLEVERIFY: 3,
         INTEGRAL_AD_SCIENCE: 4,
         PIXELATE: 5,
         NIELSEN: 6,
         COMSCORE: 7,
         MEETRICS: 8,
         GOOGLE: 9
     });
     var SF = /OS (\S+) like/,
         TF = /Android ([\d\.]+)/;

     function UF(a, b) {
         a = (a = a.exec(Sb())) ? a[1] : "";
         a = a.replace(/_/g, ".");
         return Ob(a, b) >= 0
     }
     var VF = function() {
             return Nc || Kc && "ontouchstart" in document.documentElement
         },
         WF = function(a) {
             return (a = a === void 0 ? null : a) && typeof a.getAttribute === "function" ? a.getAttribute("playsinline") ? !0 : !1 : !1
         };
     var XF = function(a) {
         R.call(this);
         this.g = a;
         this.o = this.A = !1;
         this.C = this.F = 0;
         this.j = new Px(1E3);
         Hs(this, this.j);
         bx(this.j, "tick", this.G, !1, this);
         bx(this.g, "pause", this.l, !1, this);
         bx(this.g, "playing", this.l, !1, this);
         bx(this.g, "ended", this.l, !1, this);
         bx(this.g, "timeupdate", this.l, !1, this)
     };
     r(XF, R);
     var YF = function(a) {
         var b = "currentTime";
         if (a.g[b]) return a.g[b];
         b = "getCurrentTime";
         return a.g[b] ? a.g[b]() : 0
     };
     XF.prototype.l = function(a) {
         switch (a.type) {
             case "playing":
                 ZF(this);
                 break;
             case "pause":
             case "ended":
                 this.j.enabled && this.j.stop();
                 break;
             case "timeupdate":
                 !this.A && YF(this) > 0 && (this.A = !0, ZF(this))
         }
     };
     var ZF = function(a) {
         !a.j.enabled && a.A && (a.F = YF(a) * 1E3, a.C = Date.now(), a.o = !1, a.j.start())
     };
     XF.prototype.G = function() {
         var a = Date.now(),
             b = a - this.C,
             c = YF(this) * 1E3;
         c - this.F < b * .5 ? this.o || (this.o = !0, this.dispatchEvent("playbackStalled")) : this.o = !1;
         this.F = c;
         this.C = a
     };
     var $F = "://secure-...imrworldwide.com/ ://cdn.imrworldwide.com/ ://aksecure.imrworldwide.com/ ://[^.]*.moatads.com ://youtube[0-9]+.moatpixel.com ://pm.adsafeprotected.com/youtube ://pm.test-adsafeprotected.com/youtube ://e[0-9]+.yt.srs.doubleverify.com www.google.com/pagead/xsul www.youtube.com/pagead/slav".split(" "),
         aG = /\bocr\b/;

     function bG(a) {
         if (Db(Vi(a)) || Gc && a.length > 2048) return !1;
         try {
             if ((new TE(a)).F().match(aG)) return !0
         } catch (b) {}
         return $F.find(function(b) {
             return a.match(b) != null
         }) != null
     };

     function cG(a, b) {
         return Db(b) ? !1 : (new RegExp(a)).test(b)
     }

     function dG(a) {
         var b = {};
         a.split(",").forEach(function(c) {
             var d = c.split("=");
             d.length == 2 && (c = Eb(d[0]), d = Eb(d[1]), c.length > 0 && (b[c] = d))
         });
         return b
     }

     function eG(a) {
         var b = "af am ar_eg ar_sa ar_xb ar be bg bn ca cs da de_at de_cn de el en_au en_ca en_gb en_ie en_in en_sg en_xa en_xc en_za en es_419 es_ar es_bo es_cl es_co es_cr es_do es_ec es_gt es_hn es_mx es_ni es_pa es_pe es_pr es_py es_sv es_us es_uy es_ve es et eu fa fi fil fr_ca fr_ch fr gl gsw gu he hi hr hu id in is it iw ja kn ko ln lo lt lv ml mo mr ms nb ne nl no pl pt_br pt_pt pt ro ru sk sl sr_latn sr sv sw ta te th tl tr uk ur vi zh_cn zh_hk zh_tw zh zu".split(" ");
         if (!a) return null;
         a = a.toLowerCase().replace("-", "_");
         if (b.includes(a)) return a;
         a = (a = a.match(/^\w{2,3}([-_]|$)/)) ? a[0].replace(/[_-]/g, "") : "";
         return b.includes(a) ? a : null
     };
     var fG = function() {
         this.g = Date.now()
     };
     fG.prototype.reset = function() {
         this.g = Date.now()
     };
     var gG = function(a) {
         a = a.g + 5E3 - Date.now();
         return a > 0 ? a : 0
     };
     var hG = function(a, b) {
         this.url = a;
         this.g = b === void 0 ? null : b
     };
     var iG = function(a) {
         switch (a) {
             case 0:
                 return "No Error";
             case 1:
                 return "Access denied to content document";
             case 2:
                 return "File not found";
             case 3:
                 return "Firefox silently errored";
             case 4:
                 return "Application custom error";
             case 5:
                 return "An exception occurred";
             case 6:
                 return "Http response at 400 or 500 level";
             case 7:
                 return "Request was aborted";
             case 8:
                 return "Request timed out";
             case 9:
                 return "The resource is not available offline";
             default:
                 return "Unrecognized error code"
         }
     };
     var jG = function(a) {
         var b = Error.call(this, a);
         this.message = b.message;
         "stack" in b && (this.stack = b.stack);
         this.errorCode = a
     };
     r(jG, Error);

     function kG(a) {
         a = a === null ? "null" : a === void 0 ? "undefined" : a;
         var b = ti();
         a = b ? b.createHTML(a) : a;
         return new Li(a)
     };
     var lG = function(a) {
         Q.call(this);
         this.o = a;
         this.j = {}
     };
     sb(lG, Q);
     var mG = [];
     lG.prototype.listen = function(a, b, c, d) {
         return nG(this, a, b, c, d)
     };
     var nG = function(a, b, c, d, e, f) {
         Array.isArray(c) || (c && (mG[0] = c.toString()), c = mG);
         for (var g = 0; g < c.length; g++) {
             var h = bx(b, c[g], d || a.handleEvent, e || !1, f || a.o || a);
             if (!h) break;
             a.j[h.key] = h
         }
         return a
     };
     lG.prototype.Gc = function(a, b, c, d) {
         return oG(this, a, b, c, d)
     };
     var oG = function(a, b, c, d, e, f) {
         if (Array.isArray(c))
             for (var g = 0; g < c.length; g++) oG(a, b, c[g], d, e, f);
         else {
             b = ax(b, c, d || a.handleEvent, e, f || a.o || a);
             if (!b) return a;
             a.j[b.key] = b
         }
         return a
     };
     lG.prototype.ab = function(a, b, c, d, e) {
         if (Array.isArray(b))
             for (var f = 0; f < b.length; f++) this.ab(a, b[f], c, d, e);
         else c = c || this.handleEvent, d = db(d) ? !!d.capture : !!d, e = e || this.o || this, c = cx(c), d = !!d, b = Rw(a) ? a.Ac(b, c, d, e) : a ? (a = ex(a)) ? a.Ac(b, c, d, e) : null : null, b && (jx(b), delete this.j[b.key])
     };
     var pG = function(a) {
         rj(a.j, function(b, c) {
             this.j.hasOwnProperty(c) && jx(b)
         }, a);
         a.j = {}
     };
     lG.prototype.O = function() {
         lG.Za.O.call(this);
         pG(this)
     };
     lG.prototype.handleEvent = function() {
         throw Error("EventHandler.handleEvent not implemented");
     };
     var qG = function() {
         R.call(this);
         this.headers = new Map;
         this.j = !1;
         this.g = null;
         this.H = "";
         this.o = 0;
         this.l = this.G = this.A = this.F = !1;
         this.K = 0;
         this.C = null;
         this.U = "";
         this.M = !1
     };
     sb(qG, R);
     var rG = /^https?$/i,
         sG = ["POST", "PUT"],
         vG = function(a, b, c, d) {
             if (a.g) throw Error("[goog.net.XhrIo] Object is active with another request=" + a.H + "; newUri=" + b);
             c = c ? c.toUpperCase() : "GET";
             a.H = b;
             a.o = 0;
             a.F = !1;
             a.j = !0;
             a.g = new XMLHttpRequest;
             a.g.onreadystatechange = mx(nb(a.P, a));
             try {
                 a.G = !0, a.g.open(c, String(b), !0), a.G = !1
             } catch (g) {
                 tG(a);
                 return
             }
             b = d || "";
             d = new Map(a.headers);
             var e = Array.from(d.keys()).find(function(g) {
                     return "content-type" == g.toLowerCase()
                 }),
                 f = x.FormData && b instanceof x.FormData;
             !qc(sG, c) || e || f || d.set("Content-Type",
                 "application/x-www-form-urlencoded;charset=utf-8");
             c = w(d);
             for (d = c.next(); !d.done; d = c.next()) e = w(d.value), d = e.next().value, e = e.next().value, a.g.setRequestHeader(d, e);
             a.U && (a.g.responseType = a.U);
             "withCredentials" in a.g && a.g.withCredentials !== a.M && (a.g.withCredentials = a.M);
             try {
                 uG(a), a.K > 0 && (a.C = setTimeout(a.Z.bind(a), a.K)), a.A = !0, a.g.send(b), a.A = !1
             } catch (g) {
                 tG(a)
             }
         };
     qG.prototype.Z = function() {
         typeof Wa != "undefined" && this.g && (this.o = 8, this.dispatchEvent("timeout"), this.abort(8))
     };
     var tG = function(a) {
             a.j = !1;
             a.g && (a.l = !0, a.g.abort(), a.l = !1);
             a.o = 5;
             wG(a);
             xG(a)
         },
         wG = function(a) {
             a.F || (a.F = !0, a.dispatchEvent("complete"), a.dispatchEvent("error"))
         };
     qG.prototype.abort = function(a) {
         this.g && this.j && (this.j = !1, this.l = !0, this.g.abort(), this.l = !1, this.o = a || 7, this.dispatchEvent("complete"), this.dispatchEvent("abort"), xG(this))
     };
     qG.prototype.O = function() {
         this.g && (this.j && (this.j = !1, this.l = !0, this.g.abort(), this.l = !1), xG(this, !0));
         qG.Za.O.call(this)
     };
     qG.prototype.P = function() {
         this.Ia() || (this.G || this.A || this.l ? yG(this) : this.V())
     };
     qG.prototype.V = function() {
         yG(this)
     };
     var yG = function(a) {
             if (a.j && typeof Wa != "undefined")
                 if (a.A && (a.g ? a.g.readyState : 0) == 4) setTimeout(a.P.bind(a), 0);
                 else if (a.dispatchEvent("readystatechange"), (a.g ? a.g.readyState : 0) == 4) {
                 a.j = !1;
                 try {
                     var b = zG(a);
                     a: switch (b) {
                         case 200:
                         case 201:
                         case 202:
                         case 204:
                         case 206:
                         case 304:
                         case 1223:
                             var c = !0;
                             break a;
                         default:
                             c = !1
                     }
                     var d;
                     if (!(d = c)) {
                         var e;
                         if (e = b === 0) {
                             var f = String(a.H).match(ap)[1] || null;
                             !f && x.self && x.self.location && (f = x.self.location.protocol.slice(0, -1));
                             e = !rG.test(f ? f.toLowerCase() : "")
                         }
                         d = e
                     }
                     d ? (a.dispatchEvent("complete"),
                         a.dispatchEvent("success")) : (a.o = 6, wG(a))
                 } finally {
                     xG(a)
                 }
             }
         },
         xG = function(a, b) {
             if (a.g) {
                 uG(a);
                 var c = a.g;
                 a.g = null;
                 b || a.dispatchEvent("ready");
                 try {
                     c.onreadystatechange = null
                 } catch (d) {}
             }
         },
         uG = function(a) {
             a.C && (clearTimeout(a.C), a.C = null)
         };
     qG.prototype.isActive = function() {
         return !!this.g
     };
     var zG = function(a) {
             try {
                 return (a.g ? a.g.readyState : 0) > 2 ? a.g.status : -1
             } catch (b) {
                 return -1
             }
         },
         AG = function(a) {
             if (a.g) {
                 a: {
                     a = a.g.responseText;
                     if (x.JSON) try {
                         var b = x.JSON.parse(a);
                         break a
                     } catch (c) {}
                     b = Sm(a)
                 }
                 return b
             }
         };
     var BG = function() {};
     BG.prototype.get = function(a) {
         return CG({
             url: a.url,
             timeout: a.timeout,
             withCredentials: a.withCredentials === void 0 ? !0 : a.withCredentials,
             method: "GET",
             headers: a.headers === void 0 ? {} : a.headers
         })
     };
     var CG = function(a) {
             var b = a.url;
             var c = a.timeout;
             var d = a.withCredentials;
             var e = a.method;
             var f = a.content === void 0 ? void 0 : a.content;
             var g = a.headers === void 0 ? {} : a.headers;
             return DG({
                 url: b,
                 timeout: c,
                 withCredentials: d,
                 method: e,
                 content: f,
                 headers: g
             }).then(function(h) {
                 return Promise.resolve(h)
             }, function(h) {
                 return h instanceof Error && h.message == 6 && d ? DG({
                     url: b,
                     timeout: c,
                     withCredentials: !d,
                     method: e,
                     content: f,
                     headers: g
                 }) : Promise.reject(h)
             })
         },
         DG = function(a) {
             var b = a.url;
             var c = a.timeout;
             var d = a.withCredentials;
             var e =
                 a.method;
             var f = a.content === void 0 ? void 0 : a.content;
             a = a.headers === void 0 ? {} : a.headers;
             var g = new qG;
             g.M = d;
             g.K = Math.max(0, gG(c));
             for (var h in a) g.headers.set(h, a[h]);
             var k = new lG;
             return new Promise(function(l, n) {
                 k.Gc(g, "success", function() {
                     a: {
                         if (Yr()) try {
                             AG(g);
                             var p = "application/json";
                             break a
                         } catch (u) {
                             p = "application/xml";
                             break a
                         }
                         g.g && (g.g ? g.g.readyState : 0) == 4 ? (p = g.g.getResponseHeader("Content-Type"), p = p === null ? void 0 : p) : p = void 0;p = p || ""
                     }
                     if (p.indexOf("application/json") != -1) try {
                         l(AG(g) || {})
                     } catch (u) {
                         n(new jG(5,
                             zG(g)))
                     } else {
                         try {
                             var q = g.g ? g.g.responseXML : null
                         } catch (u) {
                             q = null
                         }
                         if (q == null) {
                             try {
                                 var v = g.g ? g.g.responseText : ""
                             } catch (u) {
                                 v = ""
                             }
                             if (typeof DOMParser != "undefined") q = new DOMParser, v = kG(v), q = q.parseFromString(Mi(v), "application/xml");
                             else throw Error("Your browser does not support loading xml documents");
                         }
                         l(q)
                     }
                     k.dispose();g.dispose()
                 });
                 k.Gc(g, ["error", "timeout"], function() {
                     n(new jG(g.o, zG(g)));
                     k.dispose();
                     g.dispose()
                 });
                 vG(g, uF(b), e, f)
             })
         };
     z("google.javascript.ads.imalib.common.UrlLoader", BG);
     var EG = function() {
         var a = this;
         this.promise = new Promise(function(b, c) {
             a.resolve = b;
             a.reject = c
         })
     };
     var FG = RegExp("^(https?:)?\\/\\/ad\\.doubleclick\\.net/ddm/track(imp|clk)"),
         IG = function(a, b, c, d, e) {
             c = c === void 0 ? !1 : c;
             d = d === void 0 ? !1 : d;
             e = e === void 0 ? null : e;
             var f, g;
             Oa(function(h) {
                 if (h.g == 1) {
                     h.l = 2;
                     b = d ? uF(b, "https") : uF(b);
                     if (f = FG.test(b)) b = b.replace("?", ";tpsrc=ima?"), e = e || "";
                     c = c || bG(b);
                     g = e != null && window.fetch != null;
                     return a.j || g ? Da(h, GG(a, b, c, e), 5) : Da(h, HG(a, b, c, e), 5)
                 }
                 if (h.g != 2) return Ea(h, 0);
                 Fa(h);
                 h.g = 0
             })
         },
         HG = function(a, b, c, d) {
             d = Oo("attribution-reporting") ? d : null;
             return Yr() ? JG(b) : KG(a, b, c, d)
         },
         LG =
         function(a, b) {
             var c = {
                 keepalive: !0,
                 method: "get",
                 redirect: "follow",
                 credentials: "include"
             };
             a && (c.referrerPolicy = "no-referrer");
             b ? "setAttributionReporting" in XMLHttpRequest.prototype ? (c.attributionReporting = {
                 eventSourceEligible: !0,
                 triggerEligible: !1
             }, c.mode = "no-cors") : c.headers = {
                 "Attribution-Reporting-Eligible": "event-source"
             } : c.mode = "no-cors";
             return c
         },
         GG = function(a, b, c, d) {
             d = d === void 0 ? null : d;
             var e, f, g, h, k, l, n, p, q;
             return Oa(function(v) {
                 if (v.g == 1) return M(L.getInstance(), "faa", "1"), M(L.getInstance(),
                     "alp", d === null ? "0" : "1"), e = Oo("attribution-reporting"), M(L.getInstance(), "arpa", e ? "1" : "0"), f = d === "" && e, g = LG(c, f), h = fetch(b, g).then(function(u) {
                     M(L.getInstance(), "fas", "1");
                     if (Un(wo) && b.includes("/pagead/adview")) {
                         var t = window,
                             y = {};
                         if (u = u.headers.get("X-Ad-Event-Value")) try {
                             var D = JSON.parse(u);
                             y.revenueCurrency = D.currency;
                             y.revenueMicros = D.value;
                             var ca = t.parent;
                             y.googMsgType = "aevi";
                             ca.postMessage(JSON.stringify(y), "*")
                         } catch (X) {}
                     }
                 }, function() {
                     var u = d;
                     M(L.getInstance(), "faf", "1");
                     a.j = !1;
                     return HG(a,
                         b, c, u)
                 }), k = e && d ? fetch(d, LG(c, !0)) : Promise.resolve(), l = w, Da(v, Promise.allSettled([h, k]), 2);
                 n = l(v.j);
                 q = p = n.next().value;
                 if (q.status === "rejected") throw q.reason;
                 v.g = 0
             })
         },
         KG = function(a, b, c, d) {
             var e = new EG,
                 f = mj("IMG", window.document),
                 g = (a.l++).toString();
             a.g.set(g, f);
             f.addEventListener("load", function() {
                 a.g.delete(g);
                 e.resolve()
             });
             f.addEventListener("error", function(h) {
                 a.g.delete(g);
                 e.reject(h)
             });
             c && (f.referrerPolicy = "no-referrer");
             d != null && (f.attributionSrc = d);
             f.src = b;
             return e.promise
         },
         JG = function(a) {
             var b;
             return Oa(function(c) {
                 b = new BG;
                 return Da(c, b.get({
                     url: a,
                     timeout: new fG
                 }), 0)
             })
         };
     var MG = {
         AUTOPLAY_DISALLOWED: "autoplayDisallowed",
         Ji: "beginFullscreen",
         CAN_PLAY: "canPlay",
         CAN_PLAY_THROUGH: "canPlayThrough",
         CLICK: "click",
         DURATION_CHANGE: "durationChange",
         Vi: "end",
         Wi: "endFullscreen",
         ERROR: "error",
         aj: "focusSkipButton",
         LOAD_START: "loadStart",
         LOADED: "loaded",
         Ej: "mediaLoadTimeout",
         Fj: "mediaPlaybackTimeout",
         PAUSE: "pause",
         PLAY: "play",
         PLAYING: "playing",
         SEEKED: "seeked",
         SEEKING: "seeking",
         Sj: "skip",
         Eg: "skipShown",
         STALLED: "stalled",
         af: "start",
         TIME_UPDATE: "timeUpdate",
         Vj: "timedMetadata",
         ek: "volumeChange",
         WAITING: "waiting",
         fk: "windowFocusChanged",
         bj: "fullyLoaded"
     };
     var NG = function(a, b, c, d) {
         b = b === void 0 ? !1 : b;
         c = c === void 0 ? !1 : c;
         d = d === void 0 ? !1 : d;
         R.call(this);
         this.g = a;
         this.da = d;
         this.loaded = this.l = !1;
         this.U = null;
         this.A = 0;
         this.j = new lG(this);
         Hs(this, this.j);
         this.oh = b && Lc && !Yc || c;
         this.Ka = []
     };
     r(NG, R);
     m = NG.prototype;
     m.dispatchEvent = function(a) {
         return this.da ? (this.Ka.push(a), !0) : R.prototype.dispatchEvent.call(this, a)
     };
     m.releaseEvents = function() {
         var a = this;
         this.da && (this.da = !1, this.Ka.forEach(function(b) {
             a.dispatchEvent(b)
         }))
     };
     m.Ye = function() {
         this.rc();
         this.j.listen(this.g, "ended", this.se);
         this.j.listen(this.g, "pause", this.ue);
         this.j.listen(this.g, "playing", this.Cd);
         this.j.listen(this.g, "timeupdate", this.ve);
         this.j.listen(this.g, "volumechange", this.Hf);
         this.j.listen(this.g, "error", this.Wb);
         this.j.listen(this.g, "canplay", this.Ph);
         this.j.listen(this.g, "canplaythrough", this.Qh);
         this.j.listen(this.g, "loadstart", this.Sh);
         this.j.listen(this.g, "durationchange", this.Rh);
         this.j.listen(this.g, "waiting", this.ai);
         this.j.listen(this.g,
             "seeked", this.Wh);
         this.j.listen(this.g, "seeking", this.Xh);
         this.j.listen(this.g, "stalled", this.Yh);
         this.j.listen(this.g, "progress", this.Vh);
         this.j.listen(this.g, "loadeddata", this.te)
     };
     m.rc = function() {
         pG(this.j)
     };
     m.getCurrentTime = function() {
         return this.g.currentTime
     };
     m.getDuration = function() {
         return isNaN(this.g.duration) ? -1 : this.g.duration
     };
     m.getVolume = function() {
         return this.g.muted ? 0 : this.g.volume
     };
     m.yf = function() {
         return this.g.paused
     };
     m.je = function() {
         return !1
     };
     m.se = function() {
         this.dispatchEvent("end");
         OG(this)
     };
     m.ue = function() {
         this.g.ended || this.dispatchEvent("pause");
         OG(this)
     };
     m.Cd = function() {
         this.dispatchEvent("play");
         this.oh && this.Ic()
     };
     m.Ic = function() {
         this.l || (this.l = !0, OG(this), this.dispatchEvent("start"))
     };
     m.ve = function() {
         var a = this.getCurrentTime();
         if (!this.l) {
             if (a <= 0) return;
             if (Yc && this.g.ended && this.getDuration() === 1) {
                 this.Wb();
                 return
             }
             this.Ic()
         }
         this.A = Math.max(this.A, a);
         this.dispatchEvent("timeUpdate")
     };
     m.ai = function() {
         this.dispatchEvent("waiting")
     };
     m.Hf = function() {
         this.dispatchEvent("volumeChange")
     };
     m.Rh = function() {
         this.dispatchEvent("durationChange")
     };
     m.Wb = function() {
         OG(this);
         this.dispatchEvent("error")
     };
     m.Ph = function() {
         this.dispatchEvent("canPlay");
         this.te()
     };
     m.Qh = function() {
         this.dispatchEvent("canPlayThrough")
     };
     m.Sh = function() {
         this.dispatchEvent("loadStart")
     };
     m.Wh = function() {
         this.dispatchEvent("seeked")
     };
     m.Xh = function() {
         this.dispatchEvent("seeking")
     };
     m.Yh = function() {
         this.dispatchEvent("stalled")
     };
     m.Vh = function() {
         this.g.buffered && this.g.buffered.length && this.g.buffered.end(this.g.buffered.length - 1) === this.getDuration() && (Qm("vfl"), this.dispatchEvent("fullyLoaded"))
     };
     m.te = function() {
         this.loaded || (Qm("vil"), this.loaded = !0, this.dispatchEvent("loaded"))
     };
     m.unload = function() {
         this.g.removeAttribute("src");
         this.g.load()
     };
     m.play = function() {
         this.l || PG(this);
         return this.g.play()
     };
     m.pause = function() {
         this.g.pause()
     };
     var PG = function(a) {
             a.U || (a.U = Qx(function() {
                 a.l || a.dispatchEvent("mediaPlaybackTimeout")
             }, 8E3))
         },
         OG = function(a) {
             a.U && (x.clearTimeout(a.U), a.U = null)
         };
     NG.prototype.setVolume = function(a) {
         this.g.volume = a
     };
     NG.prototype.canPlayType = function(a) {
         if (typeof this.g.canPlayType !== "function") return M(L.getInstance(), "vmcpy", "1"), !0;
         a = this.g.canPlayType(a);
         return a !== "" && a != null
     };
     NG.prototype.getSize = function() {
         return mk(this.g)
     };
     var QG = function() {
         R.apply(this, arguments)
     };
     r(QG, R);
     QG.prototype.C = function() {
         return !1
     };
     QG.prototype.M = function() {
         return !1
     };
     QG.prototype.F = function() {
         return -1
     };
     QG.prototype.G = function() {};
     var SG = function(a) {
             this.uri = a;
             this.g = RG(a)
         },
         RG = function(a) {
             return new Map(a.j.split("/").reduce(function(b, c, d, e) {
                 d % 2 && b.set(e[d - 1], c);
                 return b
             }, new Map))
         },
         TG = function(a) {
             var b, c;
             return (b = a.uri) == null ? void 0 : (c = b.j) == null ? void 0 : c.startsWith("/videoplayback")
         };
     SG.prototype.getId = function() {
         return UG(this, "id")
     };
     var VG = function(a) {
             a = hF(a.uri, "range");
             if (!a) return null;
             a = a.split("-")[0];
             return !a || isNaN(Number(a)) ? null : Number(a)
         },
         UG = function(a, b) {
             var c = hF(a.uri, b);
             return c ? c : (a = a.g.get(b)) ? a : null
         };
     var WG = {},
         XG = (WG[18] = -1, WG[22] = -1, WG[43] = 350, WG[44] = 350, WG[45] = 350, WG[59] = -1, WG[133] = 350, WG[134] = 350, WG[135] = 350, WG[136] = 350, WG[139] = 50, WG[140] = 50, WG[141] = 50, WG[160] = 350, WG[242] = 150, WG[243] = 150, WG[244] = 150, WG[245] = 150, WG[247] = 150, WG[249] = 50, WG[250] = 50, WG[251] = 50, WG[278] = 150, WG[342] = -1, WG[343] = -1, WG[344] = -1, WG[345] = -1, WG[346] = -1, WG[347] = -1, WG),
         YG = {},
         ZG = (YG[18] = !1, YG[22] = !1, YG[43] = !0, YG[44] = !0, YG[45] = !0, YG[59] = !1, YG[133] = !0, YG[134] = !0, YG[135] = !0, YG[136] = !0, YG[139] = !0, YG[140] = !0, YG[141] = !0, YG[160] = !0,
             YG[242] = !0, YG[243] = !0, YG[244] = !0, YG[245] = !0, YG[247] = !0, YG[249] = !0, YG[250] = !0, YG[251] = !0, YG[278] = !0, YG[342] = !1, YG[343] = !1, YG[344] = !1, YG[345] = !1, YG[346] = !1, YG[347] = !1, YG),
         $G = {},
         aH = ($G[18] = "video/mp4", $G[22] = "video/mp4", $G[43] = "video/webm", $G[44] = "video/webm", $G[45] = "video/webm", $G[59] = "video/mp4", $G[133] = "video/mp4", $G[134] = "video/mp4", $G[135] = "video/mp4", $G[136] = "video/mp4", $G[139] = "audio/mp4", $G[140] = "audio/mp4", $G[141] = "audio/mp4", $G[160] = "video/mp4", $G[242] = "video/webm", $G[243] = "video/webm", $G[244] =
             "video/webm", $G[245] = "video/webm", $G[247] = "video/webm", $G[249] = "audio/webm", $G[250] = "audio/webm", $G[251] = "audio/webm", $G[278] = "video/webm", $G[342] = "video/mp4", $G[343] = "video/mp4", $G[344] = "video/mp4", $G[345] = "video/mp4", $G[346] = "video/mp4", $G[347] = "video/mp4", $G),
         bH = {},
         cH = (bH[18] = "avc1.42001E, mp4a.40.2", bH[22] = "avc1.64001F, mp4a.40.2", bH[43] = "vp8, vorbis", bH[44] = "vp8, vorbis", bH[45] = "vp8, vorbis", bH[59] = "avc1.4D001F, mp4a.40.2", bH[133] = "avc1.4D401E", bH[134] = "avc1.4D401E", bH[135] = "avc1.4D401E", bH[136] =
             "avc1.4D401E", bH[139] = "mp4a.40.2", bH[140] = "mp4a.40.2", bH[141] = "mp4a.40.2", bH[160] = "avc1.4D401E", bH[242] = "vp9", bH[243] = "vp9", bH[244] = "vp9", bH[245] = "vp9", bH[247] = "vp9", bH[249] = "opus", bH[250] = "opus", bH[251] = "opus", bH[278] = "vp9", bH[342] = "avc1.42E01E, mp4a.40.2", bH[343] = "avc1.42E01E, mp4a.40.2", bH[344] = "avc1.42E01E, mp4a.40.2", bH[345] = "avc1.42E01E, mp4a.40.2", bH[346] = "avc1.42E01E, mp4a.40.2", bH[347] = "avc1.4D001F, mp4a.40.2", bH);
     var dH = RegExp("/itag/(\\d+)/");

     function eH(a) {
         var b = Number(ep(a, "itag"));
         return b ? b : (a = a.match(dH)) && a.length === 2 ? Number(a[1]) : null
     }

     function fH(a) {
         var b = aH[a];
         a = cH[a];
         b ? (b = Vi(b).toLowerCase(), b = a ? b + '; codecs="' + Vi(a) + '"' : b) : b = "";
         return b
     }

     function gH(a, b) {
         if (typeof CustomEvent === "function") return new CustomEvent(a, {
             detail: b
         });
         var c = document.createEvent("CustomEvent");
         c.initCustomEvent(a, !1, !0, b);
         return c
     };
     var hH = ["doubleclick.net"];

     function iH() {
         if (cc() || A("iPad") || A("iPod")) var a = !1;
         else if (bc()) {
             if (pF === void 0) {
                 a: {
                     if (nF === void 0) {
                         if (rF) {
                             a = Mb(qF(), "Safari");
                             var b = (new TE(window.location.href)).l.ac("js");
                             b: {
                                 if ((b = b.length ? b[0] : "") && b.lastIndexOf("afma-", 0) == 0) {
                                     var c = b.lastIndexOf("v");
                                     if (c > -1 && (b = b.substr(c + 1).match(/^(\d+\.\d+\.\d+|^\d+\.\d+|^\d+)(-.*)?$/))) {
                                         b = b[1];
                                         break b
                                     }
                                 }
                                 b = "0.0.0"
                             }
                             if (!a || b !== "0.0.0") {
                                 a = nF = !0;
                                 break a
                             }
                         }
                         nF = !1
                     }
                     a = nF
                 }
                 a || (oF === void 0 && (oF = Mb(qF(), "afma-sdk-a") ? !0 : !1), a = oF);pF = a
             }
             a = pF ? !0 : oi() ? !1 : jH()
         } else a = !1;
         return a
     }

     function jH() {
         var a = !1,
             b = (new TE(window.location.href)).g;
         hH.forEach(function(c) {
             b.includes(c) && (a = !0)
         });
         return a
     };
     var kH, nH = function(a, b, c) {
         if (typeof a === "number") var d = {
             name: lH(a)
         };
         else d = a, a = mH(a.name);
         this.code = a;
         this.g = d;
         b = "Error " + b + ": " + this.getName();
         c && (b += ", " + c);
         tb.call(this, b)
     };
     sb(nH, tb);
     nH.prototype.getName = function() {
         return this.g.name || ""
     };
     var oH = {
             Gg: 1,
             Jj: 2,
             NOT_FOUND_ERR: 3,
             mg: 4,
             pg: 5,
             Kj: 6,
             Fg: 7,
             ABORT_ERR: 8,
             Cg: 9,
             Yj: 10,
             TIMEOUT_ERR: 11,
             Bg: 12,
             INVALID_ACCESS_ERR: 13,
             INVALID_STATE_ERR: 14
         },
         pH = (x.g || x.j || oH).Gg,
         qH = (x.g || x.j || oH).NOT_FOUND_ERR,
         rH = (x.g || x.j || oH).mg,
         sH = (x.g || x.j || oH).pg,
         tH = (x.g || x.j || oH).Fg,
         uH = (x.g || x.j || oH).ABORT_ERR,
         vH = (x.g || x.j || oH).Cg,
         wH = (x.g || x.j || oH).TIMEOUT_ERR,
         xH = (x.g || x.j || oH).Bg,
         yH = (x.DOMException || oH).INVALID_ACCESS_ERR,
         zH = (x.DOMException || oH).INVALID_STATE_ERR,
         mH = function(a) {
             switch (a) {
                 case "UnknownError":
                     return pH;
                 case "NotFoundError":
                     return qH;
                 case "ConstraintError":
                     return rH;
                 case "DataError":
                     return sH;
                 case "TransactionInactiveError":
                     return tH;
                 case "AbortError":
                     return uH;
                 case "ReadOnlyError":
                     return vH;
                 case "TimeoutError":
                     return wH;
                 case "QuotaExceededError":
                     return xH;
                 case "InvalidAccessError":
                     return yH;
                 case "InvalidStateError":
                     return zH;
                 default:
                     return pH
             }
         },
         lH = function(a) {
             switch (a) {
                 case pH:
                     return "UnknownError";
                 case qH:
                     return "NotFoundError";
                 case rH:
                     return "ConstraintError";
                 case sH:
                     return "DataError";
                 case tH:
                     return "TransactionInactiveError";
                 case uH:
                     return "AbortError";
                 case vH:
                     return "ReadOnlyError";
                 case wH:
                     return "TimeoutError";
                 case xH:
                     return "QuotaExceededError";
                 case yH:
                     return "InvalidAccessError";
                 case zH:
                     return "InvalidStateError";
                 default:
                     return "UnknownError"
             }
         },
         AH = function(a, b) {
             return "error" in a ? new nH(a.error, b) : new nH({
                 name: "UnknownError"
             }, b)
         },
         BH = function(a, b) {
             return "name" in a ? new nH(a, b + ": " + a.message) : new nH({
                 name: "UnknownError"
             }, b)
         };

     function CH(a) {
         this.g = a
     }
     var DH = x.IDBKeyRange || x.webkitIDBKeyRange;
     /* 
      
      Copyright 2005, 2007 Bob Ippolito. All Rights Reserved. 
      Copyright The Closure Library Authors. 
      SPDX-License-Identifier: MIT 
     */
     var EH = function() {
         this.B = [];
         this.o = this.l = !1;
         this.j = void 0;
         this.L = this.G = this.C = !1;
         this.A = 0;
         this.g = null;
         this.I = 0
     };
     EH.prototype.cancel = function(a) {
         if (this.l) this.j instanceof EH && this.j.cancel();
         else {
             if (this.g) {
                 var b = this.g;
                 delete this.g;
                 a ? b.cancel(a) : (b.I--, b.I <= 0 && b.cancel())
             }
             this.L = !0;
             this.l || FH(this, new GH(this))
         }
     };
     EH.prototype.F = function(a, b) {
         this.C = !1;
         HH(this, a, b)
     };
     var HH = function(a, b, c) {
             a.l = !0;
             a.j = c;
             a.o = !b;
             IH(a)
         },
         KH = function(a) {
             if (a.l) {
                 if (!a.L) throw new JH(a);
                 a.L = !1
             }
         };
     EH.prototype.Ma = function(a) {
         KH(this);
         HH(this, !0, a)
     };
     var FH = function(a, b) {
             KH(a);
             HH(a, !1, b)
         },
         MH = function(a, b) {
             return LH(a, b, null)
         },
         LH = function(a, b, c, d) {
             var e = a.l;
             e || (b === c ? b = c = mx(b) : (b = mx(b), c = mx(c)));
             a.B.push([b, c, d]);
             e && IH(a);
             return a
         };
     EH.prototype.then = function(a, b, c) {
         var d, e, f = new Ax(function(g, h) {
             e = g;
             d = h
         });
         LH(this, e, function(g) {
             g instanceof GH ? f.cancel() : d(g);
             return NH
         }, this);
         return f.then(a, b, c)
     };
     EH.prototype.$goog_Thenable = !0;
     var OH = function(a) {
             return kc(a.B, function(b) {
                 return typeof b[1] === "function"
             })
         },
         NH = {},
         IH = function(a) {
             if (a.A && a.l && OH(a)) {
                 var b = a.A,
                     c = PH[b];
                 c && (x.clearTimeout(c.g), delete PH[b]);
                 a.A = 0
             }
             a.g && (a.g.I--, delete a.g);
             b = a.j;
             for (var d = c = !1; a.B.length && !a.C;) {
                 var e = a.B.shift(),
                     f = e[0],
                     g = e[1];
                 e = e[2];
                 if (f = a.o ? g : f) try {
                     var h = f.call(e || null, b);
                     h === NH && (h = void 0);
                     h !== void 0 && (a.o = a.o && (h == b || h instanceof Error), a.j = b = h);
                     if (yx(b) || typeof x.Promise === "function" && b instanceof x.Promise) d = !0, a.C = !0
                 } catch (k) {
                     b = k, a.o = !0,
                         OH(a) || (c = !0)
                 }
             }
             a.j = b;
             d && (h = nb(a.F, a, !0), d = nb(a.F, a, !1), b instanceof EH ? (LH(b, h, d), b.G = !0) : b.then(h, d));
             c && (b = new QH(b), PH[b.g] = b, a.A = b.g)
         },
         JH = function() {
             tb.call(this)
         };
     sb(JH, tb);
     JH.prototype.message = "Deferred has already fired";
     JH.prototype.name = "AlreadyCalledError";
     var GH = function() {
         tb.call(this)
     };
     sb(GH, tb);
     GH.prototype.message = "Deferred was canceled";
     GH.prototype.name = "CanceledError";
     var QH = function(a) {
         this.g = x.setTimeout(nb(this.l, this), 0);
         this.j = a
     };
     QH.prototype.l = function() {
         delete PH[this.g];
         throw this.j;
     };
     var PH = {};
     var RH = function() {
         R.call(this)
     };
     sb(RH, R);
     RH.prototype.g = null;
     RH.prototype.next = function(a) {
         if (a) this.g["continue"](a);
         else this.g["continue"]()
     };
     RH.prototype.remove = function() {
         var a = new EH;
         try {
             var b = this.g["delete"]()
         } catch (c) {
             return FH(a, BH(c, "deleting via cursor")), a
         }
         b.onsuccess = function() {
             a.Ma()
         };
         b.onerror = function(c) {
             FH(a, AH(c.target, "deleting via cursor"))
         };
         return a
     };
     RH.prototype.getValue = function() {
         return this.g.value
     };
     var SH = function(a, b) {
         var c = new RH;
         try {
             var d = a.openCursor(b ? b.g : null)
         } catch (e) {
             throw c.dispose(), BH(e, a.name);
         }
         d.onsuccess = function(e) {
             c.g = e.target.result || null;
             c.g ? c.dispatchEvent("n") : c.dispatchEvent("c")
         };
         d.onerror = function() {
             c.dispatchEvent("e")
         };
         return c
     };

     function TH(a) {
         this.g = a
     }
     TH.prototype.getName = function() {
         return this.g.name
     };
     var UH = function(a, b, c) {
         var d = new EH;
         try {
             var e = a.g.get(c)
         } catch (f) {
             return b += " with key " + Pi(c), FH(d, BH(f, b)), d
         }
         e.onsuccess = function(f) {
             d.Ma(f.target.result)
         };
         e.onerror = function(f) {
             b += " with key " + Pi(c);
             FH(d, AH(f.target, b))
         };
         return d
     };
     TH.prototype.get = function(a) {
         return UH(this, "getting from index " + this.getName(), a)
     };
     var VH = function(a, b) {
         return SH(a.g, b)
     };

     function WH(a) {
         this.g = a
     }
     WH.prototype.getName = function() {
         return this.g.name
     };
     var XH = function(a, b, c, d, e) {
             var f = new EH;
             try {
                 var g = e ? a.g[b](d, e) : a.g[b](d)
             } catch (h) {
                 return c += Pi(d), e && (c += ", with key " + Pi(e)), FH(f, BH(h, c)), f
             }
             g.onsuccess = function(h) {
                 f.Ma(h.target.result)
             };
             g.onerror = function(h) {
                 c += Pi(d);
                 e && (c += ", with key " + Pi(e));
                 FH(f, AH(h.target, c))
             };
             return f
         },
         YH = function(a, b) {
             return XH(a, "put", "putting into " + a.getName() + " with value", b)
         };
     WH.prototype.add = function(a, b) {
         return XH(this, "add", "adding into " + this.getName() + " with value ", a, b)
     };
     WH.prototype.remove = function(a) {
         var b = new EH;
         try {
             var c = this.g["delete"](a instanceof CH ? a.g : a)
         } catch (e) {
             return c = "removing from " + this.getName() + " with key " + Pi(a), FH(b, BH(e, c)), b
         }
         c.onsuccess = function() {
             b.Ma()
         };
         var d = this;
         c.onerror = function(e) {
             var f = "removing from " + d.getName() + " with key " + Pi(a);
             FH(b, AH(e.target, f))
         };
         return b
     };
     WH.prototype.get = function(a) {
         var b = new EH;
         try {
             var c = this.g.get(a)
         } catch (e) {
             return c = "getting from " + this.getName() + " with key " + Pi(a), FH(b, BH(e, c)), b
         }
         c.onsuccess = function(e) {
             b.Ma(e.target.result)
         };
         var d = this;
         c.onerror = function(e) {
             var f = "getting from " + d.getName() + " with key " + Pi(a);
             FH(b, AH(e.target, f))
         };
         return b
     };
     WH.prototype.clear = function() {
         var a = "clearing store " + this.getName(),
             b = new EH;
         try {
             var c = this.g.clear()
         } catch (d) {
             return FH(b, BH(d, a)), b
         }
         c.onsuccess = function() {
             b.Ma()
         };
         c.onerror = function(d) {
             FH(b, AH(d.target, a))
         };
         return b
     };
     var ZH = function(a) {
         try {
             return new TH(a.g.index("timestamp"))
         } catch (b) {
             throw BH(b, "getting index timestamp");
         }
     };
     var $H = function(a, b) {
         R.call(this);
         this.g = a;
         this.l = b;
         this.j = new lG(this);
         this.j.listen(this.g, "complete", nb(this.dispatchEvent, this, "complete"));
         this.j.listen(this.g, "abort", nb(this.dispatchEvent, this, "abort"));
         this.j.listen(this.g, "error", this.rg)
     };
     sb($H, R);
     m = $H.prototype;
     m.rg = function(a) {
         a.target instanceof nH ? this.dispatchEvent({
             type: "error",
             target: a.target
         }) : this.dispatchEvent({
             type: "error",
             target: AH(a.target, "in transaction")
         })
     };
     m.objectStore = function(a) {
         try {
             return new WH(this.g.objectStore(a))
         } catch (b) {
             throw BH(b, "getting object store " + a);
         }
     };
     m.commit = function(a) {
         if (this.g.commit || !a) try {
             this.g.commit()
         } catch (b) {
             throw BH(b, "cannot commit the transaction");
         }
     };
     m.wait = function() {
         var a = new EH;
         ax(this, "complete", nb(a.Ma, a));
         var b = ax(this, "abort", function() {
             jx(c);
             FH(a, new nH(uH, "waiting for transaction to complete"))
         });
         var c = ax(this, "error", function(e) {
             jx(b);
             FH(a, e.target)
         });
         var d = this.l;
         return MH(a, function() {
             return d
         })
     };
     m.abort = function() {
         this.g.abort()
     };
     m.O = function() {
         $H.Za.O.call(this);
         this.j.dispose()
     };

     function aI(a) {
         R.call(this);
         this.g = a;
         this.j = new lG(this);
         this.j.listen(this.g, "abort", nb(this.dispatchEvent, this, "abort"));
         this.j.listen(this.g, "error", this.sg);
         this.j.listen(this.g, "versionchange", this.eh);
         this.j.listen(this.g, "close", nb(this.dispatchEvent, this, "close"))
     }
     sb(aI, R);
     m = aI.prototype;
     m.we = !0;
     m.sg = function(a) {
         a = (a = a.target) && a.error;
         this.dispatchEvent({
             type: "error",
             errorCode: a && a.severity
         })
     };
     m.eh = function(a) {
         this.dispatchEvent(new bI(a.oldVersion, a.newVersion))
     };
     m.close = function() {
         this.we && (this.g.close(), this.we = !1)
     };
     m.ib = function() {
         return this.we
     };
     m.getName = function() {
         return this.g.name
     };
     m.getVersion = function() {
         return Number(this.g.version)
     };
     var cI = function(a) {
         var b = ["MediaSourceVideoChunk"];
         try {
             var c = a.g.transaction(b, "readwrite");
             return new $H(c, a)
         } catch (d) {
             throw BH(d, "creating transaction");
         }
     };
     aI.prototype.O = function() {
         aI.Za.O.call(this);
         this.j.dispose()
     };
     var bI = function(a, b) {
         Ow.call(this, "versionchange");
         this.oldVersion = a;
         this.newVersion = b
     };
     sb(bI, Ow);
     var dI = function(a) {
         var b = new EH;
         kH == void 0 && (kH = x.indexedDB || x.mozIndexedDB || x.webkitIndexedDB || x.moz_indexedDB);
         var c = kH.open("IndexedDbVideoChunkPersistentStorage", 6);
         c.onsuccess = function(d) {
             d = new aI(d.target.result);
             b.Ma(d)
         };
         c.onerror = function(d) {
             FH(b, AH(d.target, "opening database IndexedDbVideoChunkPersistentStorage"))
         };
         c.onupgradeneeded = function(d) {
             if (a) {
                 var e = new aI(d.target.result);
                 a(new bI(d.oldVersion, d.newVersion), e, new $H(d.target.transaction, e))
             }
         };
         c.onblocked = function() {};
         return b
     };
     var eI = function() {
         R.apply(this, arguments);
         this.g = null
     };
     r(eI, R);
     eI.prototype.initialize = function() {
         var a = this;
         return Promise.resolve(dI(this.j)).then(function(b) {
             a.g = b
         }, function(b) {
             M(L.getInstance(), "codf", b.message)
         })
     };
     eI.prototype.ib = function() {
         return this.g !== null && this.g.ib()
     };
     eI.prototype.close = function() {
         var a = this;
         return (new Promise(function(b) {
             fI(a, b)
         })).then(function() {
             return gI()
         }).then(function() {
             a.g.close()
         })
     };
     var gI = function() {
         var a;
         return ((a = navigator.storage) == null ? 0 : a.estimate) ? navigator.storage.estimate().then(function(b) {
             M(L.getInstance(), "csue", String(b.usage))
         }) : Promise.resolve(void 0)
     };
     eI.prototype.Bc = function(a) {
         return (a = hI(a, 0)) ? iI(this, jI(a), a.lmt) : Promise.resolve(null)
     };
     eI.prototype.Sc = function(a, b, c, d) {
         (b = hI(b, c)) ? (c = b.startIndex, kI(this, {
             cacheId: jI(b),
             startIndex: c,
             endIndex: c + a.byteLength - 1,
             lmt: b.lmt,
             timestamp: new Date(Date.now()),
             isLastVideoChunk: d,
             itag: b.itag,
             video: a
         })) : Promise.resolve(void 0)
     };
     eI.prototype.j = function(a, b) {
         if (b.g.objectStoreNames.contains("MediaSourceVideoChunk")) try {
             b.g.deleteObjectStore("MediaSourceVideoChunk")
         } catch (d) {
             throw BH(d, "deleting object store MediaSourceVideoChunk");
         }
         a = {
             keyPath: "cacheId"
         };
         try {
             var c = new WH(b.g.createObjectStore("MediaSourceVideoChunk", a))
         } catch (d) {
             throw BH(d, "creating object store MediaSourceVideoChunk");
         }
         b = {
             unique: !1
         };
         try {
             c.g.createIndex("timestamp", "timestamp", b)
         } catch (d) {
             throw BH(d, "creating new index timestamp with key path timestamp");
         }
     };
     var fI = function(a, b) {
             var c = new Date(Date.now());
             c.setDate(c.getDate() - 30);
             c = new CH(DH.upperBound(c, void 0));
             var d = VH(ZH(cI(a.g).objectStore("MediaSourceVideoChunk")), c),
                 e = d.listen("n", function() {
                     d.remove();
                     d.next()
                 });
             ax(d, "c", function() {
                 jx(e);
                 b()
             })
         },
         hI = function(a, b) {
             var c = new SG(a);
             a = c.getId();
             var d = UG(c, "itag"),
                 e = UG(c, "source"),
                 f = UG(c, "lmt");
             c = VG(c);
             var g = [];
             a ? d ? e ? f ? c === null && g.push("startIndex") : g.push("lmt") : g.push("source") : g.push("itag") : g.push("videoId");
             return g.length > 0 ? (M(L.getInstance(),
                 "civp", g.join("-")), null) : {
                 Bi: a,
                 itag: d,
                 source: e,
                 lmt: f,
                 startIndex: c + b
             }
         },
         jI = function(a) {
             for (var b = [a.Bi, a.source, a.startIndex].join(), c = 0, d = 0; d < b.length; d++) c = Math.imul(31, c) + b.charCodeAt(d) | 0;
             return c.toString() + "," + a.itag
         },
         iI = function(a, b, c) {
             var d = cI(a.g).objectStore("MediaSourceVideoChunk");
             return Promise.resolve(d.get(b)).then(function(e) {
                 if (!e) return M(L.getInstance(), "cenf", "1"), null;
                 if (e.lmt !== c) return M(L.getInstance(), "cdl", "1"), d.remove(b).then(null, function(f) {
                     M(L.getInstance(), "crdlvf",
                         f.message)
                 }), null;
                 M(L.getInstance(), "cefml", "1");
                 return {
                     itag: e.itag,
                     endIndex: e.endIndex,
                     isLastVideoChunk: e.isLastVideoChunk,
                     video: e.video
                 }
             }, function(e) {
                 M(L.getInstance(), "cgvf", e.message);
                 return null
             })
         },
         kI = function(a, b) {
             a = cI(a.g).objectStore("MediaSourceVideoChunk");
             Promise.resolve(YH(a, b)).then(function() {
                 M(L.getInstance(), "cavs", "1")
             }, function(c) {
                 M(L.getInstance(), "cavf", c.message)
             })
         };
     var lI = function(a) {
         QG.call(this);
         var b = this;
         this.H = this.j = this.g = 0;
         this.o = this.K = null;
         this.uri = new TE(a);
         this.state = 0;
         this.l = (this.A = iH() && !xF(this.uri)) ? nE(eI) : null;
         Gs(this, function() {
             Fs(b.l)
         });
         this.K = this.A ? this.l.initialize() : null
     };
     r(lI, QG);
     lI.prototype.F = function() {
         return this.g
     };
     lI.prototype.C = function() {
         return this.state === 3
     };
     lI.prototype.M = function() {
         return this.g <= this.j
     };
     lI.prototype.G = function(a) {
         this.state === 1 ? (this.g += a, this.state = 2) : this.state === 0 && (this.g += a, this.state = 1, mI(this))
     };
     var mI = function(a) {
             Oa(function(b) {
                 if (b.g == 1) return a.state === 2 && (a.state = 1), Da(b, nI(a), 4);
                 var c = a.H > 3;
                 if (c && a.o !== null) {
                     var d = gH("media_source_error", {
                         code: a.j > 0 ? MediaError.MEDIA_ERR_NETWORK : MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED,
                         message: 'Response code "' + a.o + '" with ' + a.g + " bytes requested and " + a.j + " bytes loaded"
                     });
                     a.dispatchEvent(d)
                 }
                 a.j < a.g && a.state !== 3 && !c ? b.g = 1 : (a.state !== 3 && (a.state = 0), b.g = 0)
             })
         },
         nI = function(a) {
             var b;
             return Oa(function(c) {
                 switch (c.g) {
                     case 1:
                         b = a.j + "-" + (a.g - 1);
                         gF(a.uri, "range",
                             b);
                         if (!a.A) {
                             c.g = 2;
                             break
                         }
                         return Da(c, a.K, 3);
                     case 3:
                         return c.return(oI(a));
                     case 2:
                         return c.l = 4, Da(c, pI(a), 6);
                     case 6:
                         Ea(c, 0);
                         break;
                     case 4:
                         Fa(c), qI(a), c.g = 0
                 }
             })
         },
         oI = function(a) {
             var b;
             return Oa(function(c) {
                 switch (c.g) {
                     case 1:
                         return Da(c, a.l.Bc(a.uri), 2);
                     case 2:
                         if (b = c.j) {
                             b.isLastVideoChunk && (a.state = 3);
                             rI(a, b.video, 0);
                             c.g = 0;
                             break
                         }
                         c.l = 4;
                         return Da(c, pI(a), 6);
                     case 6:
                         Ea(c, 0);
                         break;
                     case 4:
                         Fa(c), qI(a), c.g = 0
                 }
             })
         },
         qI = function(a) {
             var b = new SG(a.uri);
             if (Un(ro) && TG(b)) {
                 a: if (TG(b)) {
                     var c = UG(b, "mn");
                     var d = c ? c.split(",") :
                         null;
                     var e = UG(b, "fvip");
                     c = b.uri.G();
                     if (d && e) {
                         var f = (Number(UG(b, "fallback_count")) || 0) + 1;
                         if (d = d[f]) {
                             c.g = "r" + e + "---" + d + ".googlevideo.com";
                             gF(c, "fallback_count", f);
                             b = c;
                             break a
                         }
                     }
                     var g, h;
                     e = Number(((h = (g = hF(c, "cmo")) == null ? void 0 : g.split("=")) != null ? h : [])[1]) || 0;
                     b.uri.g.match(/^r{1,2}(\d+)---(.+)\.googlevideo.com$/) && (c.g = "redirector.googlevideo.com");
                     gF(c, "cmo", "pf=" + (e + 1));
                     b = c
                 } else b = b.uri;a.uri = b;a.dispatchEvent(gH("bandaid_fallback_count"))
             }
             else Un(vo) && xF(a.uri) && (a.uri = new TE(yF(a.uri)));
             a.H++
         },
         pI = function(a) {
             return new Promise(function(b, c) {
                 var d = new XMLHttpRequest,
                     e = 0,
                     f = a.g - a.j;
                 d.addEventListener("load", function() {
                     Qm("lvlcl");
                     if (d.status >= 400) M(L.getInstance(), "lvlxes", d.status.toString()), a.o = d.status, c();
                     else {
                         if (Un(xo)) {
                             var h = d.responseText;
                             for (var k = new ArrayBuffer(h.length), l = new Uint8Array(k), n = 0; n < h.length; n++) l[n] = h.charCodeAt(n) & 255;
                             h = k
                         } else h = d.response;
                         h.byteLength < f && (a.state = 3);
                         k = rI(a, h, e);
                         e += k;
                         a.A && h.byteLength > 0 && a.l.Sc(h, a.uri, 0, h.byteLength < f);
                         b()
                     }
                 });
                 d.addEventListener("timeout",
                     function() {
                         Qm("lvlct");
                         a.o = d.status;
                         c()
                     });
                 d.addEventListener("error", function() {
                     Qm("lvlce");
                     a.o = d.status;
                     c()
                 });
                 var g = function() {
                     if (d.status >= 400) a.o = d.status;
                     else {
                         if (Un(xo)) {
                             var h = d.responseText;
                             var k = new ArrayBuffer(h.length);
                             for (var l = new Uint8Array(k), n = 0; n < h.length; n++) l[n] = h.charCodeAt(n) & 255
                         } else k = d.response;
                         k = rI(a, k, e);
                         e += k
                     }
                 };
                 Un(xo) ? d.onprogress = g : d.addEventListener("progress", g);
                 d.open("get", a.uri.toString());
                 Un(xo) ? d.overrideMimeType && d.overrideMimeType("text/plain; charset=x-user-defined") :
                     d.responseType = "arraybuffer";
                 d.send(null)
             })
         },
         rI = function(a, b, c) {
             if (b === null) return 0;
             b = b.slice(c);
             a.j += b.byteLength;
             a.dispatchEvent({
                 type: "progress",
                 Vd: b
             });
             return b.byteLength
         };
     lI.prototype.O = function() {
         this.A && this.l.ib() && this.l.close();
         QG.prototype.O.call(this)
     };
     var sI = {
         Ck: 2E5,
         Ak: 7E4,
         Sa: 3E5,
         yk: 5E3,
         Kk: 5E3,
         Bk: 6E3
     };

     function tI() {
         return window.ManagedMediaSource || window.MediaSource
     }

     function uI(a) {
         return a !== null && !!window.ManagedMediaSource && a instanceof window.ManagedMediaSource
     }

     function vI(a) {
         return tI() !== void 0 && tI().isTypeSupported(a)
     }

     function wI(a) {
         return [43, 44, 45].includes(a) && Xc ? !1 : ZG[a] ? (a = fH(a), !!a && vI(a)) : !1
     };
     var xI = function(a, b) {
         QG.call(this);
         var c = this;
         this.j = b;
         this.A = this.l = this.g = 0;
         this.o = null;
         this.uri = new TE(a);
         this.state = 0;
         var d;
         this.H = (d = this.j) == null ? void 0 : d.initialize();
         Gs(this, function() {
             Fs(c.j)
         })
     };
     r(xI, QG);
     xI.prototype.F = function() {
         return this.g
     };
     xI.prototype.C = function() {
         return this.state === 3
     };
     xI.prototype.G = function(a) {
         this.state === 1 ? (this.g += a, this.state = 2) : this.state === 0 && (this.g += a, this.state = 1, yI(this))
     };
     var yI = function(a) {
             Oa(function(b) {
                 if (b.g == 1) return a.state === 2 && (a.state = 1), Da(b, zI(a), 4);
                 var c = a.A > 3;
                 if (c) {
                     a.o === null && (a.o = 400);
                     var d = gH("media_source_error", {
                         code: a.l > 0 ? MediaError.MEDIA_ERR_NETWORK : MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED,
                         message: 'Response code "' + a.o + '" with ' + a.g + " bytes requested and " + a.l + " bytes loaded"
                     });
                     a.dispatchEvent(d)
                 }
                 a.l < a.g && a.state !== 3 && !c ? b.g = 1 : (a.state !== 3 && (a.state = 0), b.g = 0)
             })
         },
         zI = function(a) {
             var b;
             return Oa(function(c) {
                 switch (c.g) {
                     case 1:
                         b = a.l + "-" + (a.g - 1);
                         gF(a.uri,
                             "range", b);
                         if (!a.j) {
                             c.g = 2;
                             break
                         }
                         return Da(c, a.H, 3);
                     case 3:
                         return c.return(AI(a));
                     case 2:
                         return c.l = 4, Da(c, BI(a), 6);
                     case 6:
                         Ea(c, 0);
                         break;
                     case 4:
                         Fa(c), a.A++, c.g = 0
                 }
             })
         },
         AI = function(a) {
             var b;
             return Oa(function(c) {
                 switch (c.g) {
                     case 1:
                         return a.j ? Da(c, a.j.Bc(a.uri), 2) : c.return(Promise.reject());
                     case 2:
                         if (b = c.j) return b.isLastVideoChunk && (a.state = 3), CI(a, b.video), c.return();
                         c.l = 3;
                         return Da(c, BI(a), 5);
                     case 5:
                         Ea(c, 0);
                         break;
                     case 3:
                         Fa(c), a.A++, c.g = 0
                 }
             })
         },
         BI = function(a) {
             var b, c, d, e, f, g, h;
             return Oa(function(k) {
                 if (k.g ==
                     1) return b = 0, c = a.g - a.l, Da(k, fetch(a.uri.toString()), 2);
                 d = k.j;
                 if (d.status >= 400) return M(L.getInstance(), "lvlfes", d.status.toString()), a.o = d.status, k.return(Promise.reject());
                 f = (e = d.body) == null ? void 0 : e.getReader();
                 if (!f) return Qm("lvlmr"), a.o = d.status, k.return(Promise.reject());
                 g = [];
                 h = function() {
                     var l, n, p, q, v, u;
                     return Oa(function(t) {
                         if (t.g == 1) return Da(t, f.read(), 2);
                         l = t.j;
                         n = l.done;
                         p = l.value;
                         if (n) return q = b < c, DI(a, g, q), t.return();
                         g.push(p);
                         b += (v = p) == null ? void 0 : v.length;
                         CI(a, (u = p) == null ? void 0 : u.buffer);
                         return Da(t, h(), 0)
                     })
                 };
                 return Da(k, h(), 0)
             })
         },
         DI = function(a, b, c) {
             c && (a.state = 3, CI(a, new ArrayBuffer(0)));
             var d = new Uint8Array(b.reduce(function(g, h) {
                     return g + h.length
                 }, 0)),
                 e = 0;
             b = w(b);
             for (var f = b.next(); !f.done; f = b.next()) f = f.value, d.set(f, e), e += f.length;
             a.j && d.buffer.byteLength > 0 && a.j.Sc(d.buffer, a.uri, 0, c)
         },
         CI = function(a, b) {
             b !== null && (b = b.slice(0), a.l += b.byteLength, a.dispatchEvent({
                 type: "progress",
                 Vd: b
             }))
         };
     xI.prototype.O = function() {
         var a;
         ((a = this.j) == null ? 0 : a.ib()) && this.j.close();
         QG.prototype.O.call(this)
     };
     var EI = function() {};
     EI.prototype.Nh = function(a, b, c) {
         return c === 0 ? 1E6 : b - a < 5E3 ? 3E5 : 0
     };
     var GI = function(a, b) {
         R.call(this);
         var c = this;
         this.g = a;
         this.index = b;
         this.j = [];
         this.l = !1;
         this.g || Qm("msms_sbf" + this.index);
         this.g.addEventListener("updateend", function() {
             FI(c)
         });
         this.g.addEventListener("error", function() {
             Qm("msms_sbe" + c.index)
         })
     };
     r(GI, R);
     var FI = function(a) {
         if (!a.g.updating)
             if (a.j.length > 0) {
                 var b = a.j.shift();
                 a.g.appendBuffer(b)
             } else a.l = !1, a.dispatchEvent(new Event("updateend"))
     };
     ha.Object.defineProperties(GI.prototype, {
         o: {
             configurable: !0,
             enumerable: !0,
             get: function() {
                 return this.l
             }
         }
     });
     var HI = function() {
         this.g = this.cache = null
     };
     m = HI.prototype;
     m.initialize = function() {
         var a = this;
         return window.caches.open("CACHE_VIDEO_CHUNK_PERSISTENT_STORAGE").then(function(b) {
             a.cache = b
         }, function(b) {
             M(L.getInstance(), "codf", b.message)
         })
     };
     m.ib = function() {
         return this.cache !== null
     };
     m.close = function() {
         return Promise.resolve()
     };
     m.Bc = function(a) {
         var b = this;
         a = II(this, a);
         return this.ib() && a ? this.cache.match(a).then(function(c) {
                 if (!c) return M(L.getInstance(), "cenf", "1"), Promise.resolve(null);
                 M(L.getInstance(), "cef", "1");
                 return c.arrayBuffer().then(function(d) {
                     var e = VG(b.g),
                         f;
                     (f = hF(b.g.uri, "range")) ? (f = f.split("-")[1], f = !f || isNaN(Number(f)) ? null : Number(f)) : f = null;
                     e = e + d.byteLength - 1;
                     f = f > e;
                     return {
                         itag: UG(b.g, "itag"),
                         endIndex: e,
                         isLastVideoChunk: f,
                         video: d
                     }
                 })
             }, function(c) {
                 M(L.getInstance(), "cgvf", c.message);
                 return Promise.resolve(null)
             }) :
             (M(L.getInstance(), "cgvf", "1"), Promise.resolve(null))
     };
     m.Sc = function(a, b) {
         b = II(this, b);
         a = new Response(a);
         this.ib() && b ? this.cache.put(b, a).then(function() {
             M(L.getInstance(), "cavs", "1")
         }, function(c) {
             M(L.getInstance(), "cavf", c.message)
         }) : (M(L.getInstance(), "cavf", "1"), Promise.resolve())
     };
     var II = function(a, b) {
         a.g = new SG(b);
         b = a.g.getId();
         var c = UG(a.g, "itag"),
             d = UG(a.g, "source"),
             e = UG(a.g, "lmt");
         a = UG(a.g, "range");
         if (b && c && d && a) return new Request("http://url/videoplayback?id=" + b + "&itag=" + c + "&source=" + d + "&lmt=" + e + "&range=" + a);
         M(L.getInstance(), "civp", "1");
         return null
     };
     var JI = function(a, b) {
             this.currentTimeSeconds = a;
             this.removedRanges = b
         },
         MI = function(a) {
             R.call(this);
             var b = this;
             this.o = a;
             this.j = [];
             this.M = [];
             this.C = null;
             this.G = 0;
             this.P = !1;
             this.F = 0;
             this.A = [];
             if (Un(oo)) {
                 var c = null;
                 iH() && (Un(qo) ? c = nE(HI) : c = nE(eI));
                 this.l = this.o.map(function(d) {
                     return nE(xI, d.url, xF(d.url) ? null : c)
                 })
             } else this.l = this.o.map(function(d) {
                 return nE(lI, d.url)
             });
             Un(ro) && this.l.forEach(function(d) {
                 d.listen("bandaid_fallback_count", function(e) {
                     b.dispatchEvent(e)
                 })
             });
             this.g = nE(tI());
             this.H = function() {
                 KI(b)
             };
             this.g.addEventListener("sourceopen", this.H);
             this.K = LI(this)
         };
     r(MI, R);
     var LI = function(a) {
             for (var b = [], c = 0; c < a.o.length; ++c) b.push(new EI);
             return b
         },
         KI = function(a) {
             Qm("msms_oso");
             for (var b = {
                     va: 0
                 }; b.va < a.o.length; b = {
                     Dd: void 0,
                     ld: void 0,
                     Sb: void 0,
                     va: b.va,
                     md: void 0,
                     Vf: void 0
                 }, ++b.va) {
                 var c = a.o[b.va];
                 M(L.getInstance(), "msms_mime" + b.va, c.mimeType);
                 M(L.getInstance(), "msms_cs" + b.va, c.Sa.toString());
                 if (Un(po)) b.Dd = nE(GI, a.g.addSourceBuffer(c.mimeType), b.va), b.ld = a.l[b.va], b.ld.listen("progress", function(d) {
                     return function(e) {
                         var f = d.Dd,
                             g = d.ld;
                         e = e.Vd;
                         e.byteLength !== 0 && (f.l = !0,
                             f.j.push(e), FI(f));
                         g.C() && (a.G++, a.G === a.j.length && NI(a))
                     }
                 }(b)), b.ld.listen("media_source_error", function(d) {
                     a.dispatchEvent(d)
                 }), a.j.push(b.Dd.g), a.M.push(b.Dd);
                 else {
                     b.Sb = a.g.addSourceBuffer(c.mimeType);
                     if (!b.Sb) {
                         Qm("msms_sbf" + b.va);
                         continue
                     }
                     b.md = a.l[b.va];
                     Un(oo) && (a.A.push([]), b.Sb.addEventListener("updateend", function(d) {
                         return function() {
                             OI(a, d.Sb, d.va)
                         }
                     }(b)));
                     b.Sb.addEventListener("error", function(d) {
                         return function() {
                             Qm("msms_sbe" + d.va)
                         }
                     }(b));
                     b.md.listen("progress", function(d) {
                         return function(e) {
                             var f =
                                 d.Sb,
                                 g = d.md,
                                 h = d.va;
                             e = e.Vd;
                             e.byteLength !== 0 && (Un(oo) ? (a.A[h].push(e), OI(a, f, h)) : f.appendBuffer(e));
                             g.C() && (a.G++, a.G === a.j.length && NI(a))
                         }
                     }(b));
                     b.md.listen("media_source_error", function(d) {
                         a.dispatchEvent(d)
                     });
                     a.j.push(b.Sb)
                 }
                 uI(a.g) && (b.Vf = a.j[b.va], b.Vf.onbufferedchange = function() {
                     return function(d) {
                         d.removedRanges.length > 0 && a.dispatchEvent(new CustomEvent("bufferremoved", {
                             detail: new JI(a.F / 1E3, d.removedRanges)
                         }))
                     }
                 }(b))
             }
             M(L.getInstance(), "msms_ns", a.j.length.toString());
             a.P = !0;
             PI(a)
         },
         OI = function(a,
             b, c) {
             a.A[c].length === 0 && a.l[c].M() ? PI(a) : b.updating || a.A[c].length === 0 || (a = a.A[c].shift(), b.appendBuffer(a))
         },
         NI = function(a) {
             Un(po) ? Promise.all(a.M.map(function(b) {
                 return new Promise(function(c) {
                     b.o ? b.listen("updateend", function() {
                         c()
                     }) : c()
                 })
             })).then(function() {
                 a.g.endOfStream()
             }) : Promise.all(a.j.map(function(b, c) {
                 return new Promise(function(d) {
                     b.updating ? b.addEventListener("updateend", function() {
                         Un(oo) && (b.updating || a.A[c].length > 0) || d()
                     }) : d()
                 })
             })).then(function() {
                 a.g.endOfStream()
             })
         },
         PI = function(a) {
             if (a.P)
                 for (var b =
                         0; b < a.o.length; ++b) {
                     var c = a.l[b],
                         d = a.j[b];
                     d = d.buffered.length === 0 ? 0 : d.buffered.end(0) * 1E3;
                     d = a.K[b].Nh(a.F, d, c.F());
                     d !== 0 && c.G(d)
                 }
         },
         QI = function(a) {
             a.C = Ci(a.g).toString();
             return a.C
         };
     MI.prototype.O = function() {
         this.C && window.URL.revokeObjectURL(this.C);
         for (var a = w(this.l), b = a.next(); !b.done; b = a.next()) b.value.dispose();
         this.g.removeEventListener("sourceopen", this.H);
         R.prototype.O.call(this)
     };
     MI.prototype.Hd = function(a) {
         this.K.filter(function() {
             return !1
         }).map(function(b) {
             return b
         }).forEach(function(b) {
             b.g = Object.assign({}, sI, b.g, a)
         })
     };
     var RI = RegExp("/pagead/conversion|/pagead/adview|/pagead/gen_204|/activeview?|csi.gstatic.com/csi|google.com/pagead/xsul|google.com/ads/measurement/l|googleads.g.doubleclick.net/pagead/ide_cookie|googleads.g.doubleclick.net/xbbe/pixel"),
         SI = RegExp("outstream.min.js"),
         TI = RegExp("outstream.min.css"),
         UI = RegExp("fonts.gstatic.com"),
         VI = RegExp("googlevideo.com/videoplayback|c.2mdn.net/videoplayback|gcdn.2mdn.net/videoplayback"),
         WI = RegExp("custom.elements.min.js");

     function XI(a, b) {
         var c = 0,
             d = 0,
             e = 0,
             f = 0,
             g = 0,
             h = 0,
             k = 0,
             l = !1,
             n = !1;
         if (typeof Xa("performance.getEntriesByType", x) === "function" && "transferSize" in x.PerformanceResourceTiming.prototype) {
             var p = x.performance.getEntriesByType("resource");
             p = w(p);
             for (var q = p.next(); !q.done; q = p.next()) q = q.value, RI.test(q.name) || (f += 1, q.transferSize ? (c += q.transferSize, q.encodedBodySize && q.transferSize < q.encodedBodySize && (h += 1, e += q.encodedBodySize, SI.test(q.name) && (l = !0), TI.test(q.name) && (n = !0)), VI.test(q.name) && (d += q.transferSize)) :
                 q.transferSize === 0 && q.encodedBodySize === 0 ? WI.test(q.name) ? c += 6686 : UI.test(q.name) || (k += 1, Pm(L.getInstance(), {
                     event_name: "unmeasurable_asset",
                     resource_name: q.name,
                     encoded_body_size: q.encodedBodySize,
                     transfer_size: q.transferSize
                 })) : (g += 1, e += q.encodedBodySize, SI.test(q.name) && (l = !0), TI.test(q.name) && (n = !0)));
             p = 0;
             if (a.duration) {
                 for (q = 0; q < a.buffered.length; q++) p += a.buffered.end(q) - a.buffered.start(q);
                 p = Math.min(p, a.duration)
             }
             Pm(L.getInstance(), {
                 event_name: b,
                 asset_bytes: c,
                 video_bytes: d,
                 cached_data_bytes: e,
                 js_cached: l,
                 css_cached: n,
                 num_assets: f,
                 num_assets_cached: g,
                 num_assets_cache_validated: h,
                 num_assets_unmeasurable: k,
                 video_played_seconds: a.currentTime.toFixed(2),
                 video_muted: a.muted,
                 video_seconds_loaded: p.toFixed(2)
             })
         } else M(L.getInstance(), "error", "reporting_timing_not_supported")
     };
     var YI = function(a, b, c, d) {
         this.url = a;
         this.mimeType = b;
         this.Sa = c;
         this.g = d === void 0 ? null : d
     };

     function ZI(a) {
         var b = L.getInstance(),
             c = a.getVideoPlaybackQuality && a.getVideoPlaybackQuality();
         c ? (a = a.currentTime, M(b, "vqdf", String(c.droppedVideoFrames)), M(b, "vqtf", String(c.totalVideoFrames)), M(b, "vqfr", String(Math.round(c.totalVideoFrames / a)))) : M(b, "vqu", "1")
     };

     function $I(a) {
         this.g = a
     }
     $I.prototype.toString = function() {
         return this.g
     };
     var aJ = new $I("video_mute"),
         bJ = new $I("video_caption_visibility");

     function cJ(a) {
         Q.call(this);
         this.A = 1;
         this.l = [];
         this.o = 0;
         this.g = [];
         this.j = {};
         this.F = !!a
     }
     sb(cJ, Q);
     var dJ = function(a, b, c) {
             var d = bJ.toString(),
                 e = a.j[d];
             e || (e = a.j[d] = []);
             var f = a.A;
             a.g[f] = d;
             a.g[f + 1] = b;
             a.g[f + 2] = c;
             a.A = f + 3;
             e.push(f)
         },
         eJ = function(a, b, c) {
             var d = a.j[bJ.toString()];
             if (d) {
                 var e = a.g;
                 (d = d.find(function(f) {
                     return e[f + 1] == b && e[f + 2] == c
                 })) && a.B(d)
             }
         };
     cJ.prototype.B = function(a) {
         var b = this.g[a];
         if (b) {
             var c = this.j[b];
             this.o != 0 ? (this.l.push(a), this.g[a + 1] = function() {}) : (c && rc(c, a), delete this.g[a], delete this.g[a + 1], delete this.g[a + 2])
         }
         return !!b
     };
     cJ.prototype.C = function(a, b) {
         var c = this.j[a];
         if (c) {
             var d = Array(arguments.length - 1),
                 e = arguments.length,
                 f;
             for (f = 1; f < e; f++) d[f - 1] = arguments[f];
             if (this.F)
                 for (f = 0; f < c.length; f++) e = c[f], fJ(this.g[e + 1], this.g[e + 2], d);
             else {
                 this.o++;
                 try {
                     for (f = 0, e = c.length; f < e && !this.Ia(); f++) {
                         var g = c[f];
                         this.g[g + 1].apply(this.g[g + 2], d)
                     }
                 } finally {
                     if (this.o--, this.l.length > 0 && this.o == 0)
                         for (; c = this.l.pop();) this.B(c)
                 }
             }
         }
     };
     var fJ = function(a, b, c) {
         wx(function() {
             a.apply(b, c)
         })
     };
     cJ.prototype.clear = function(a) {
         if (a) {
             var b = this.j[a];
             b && (b.forEach(this.B, this), delete this.j[a])
         } else this.g.length = 0, this.j = {}
     };
     cJ.prototype.O = function() {
         cJ.Za.O.call(this);
         this.clear();
         this.l.length = 0
     };

     function gJ(a) {
         Q.call(this);
         this.g = new cJ(a);
         Hs(this, this.g)
     }
     sb(gJ, Q);
     gJ.prototype.clear = function(a) {
         this.g.clear(a !== void 0 ? a.toString() : void 0)
     };
     var hJ = function(a) {
         a = a === void 0 ? null : a;
         Q.call(this);
         this.g = new lG(this);
         Hs(this, this.g);
         this.Tb = a
     };
     r(hJ, Q);
     var iJ = function(a, b, c) {
         a.Tb && (dJ(a.Tb.g, b, c), Gs(a, function() {
             eJ(a.Tb.g, b, c)
         }))
     };
     var jJ = function(a, b) {
         hJ.call(this, b);
         iJ(this, function(c) {
             c ? a.g.mode = "showing" : a.Bb()
         }, this)
     };
     r(jJ, hJ);
     var kJ = function() {
         R.call(this);
         this.j = new lG(this);
         Hs(this, this.j)
     };
     r(kJ, R);
     var mJ = function(a, b, c) {
         c = c === void 0 ? !0 : c;
         kJ.call(this);
         a.setAttribute("crossorigin", "anonymous");
         var d = Rj("TRACK");
         d.setAttribute("kind", "captions");
         d.setAttribute("src", b);
         d.setAttribute("default", "");
         a.appendChild(d);
         this.g = a.textTracks[0];
         lJ(this);
         c ? this.g.mode = "showing" : this.Bb()
     };
     r(mJ, kJ);
     var lJ = function(a) {
         var b = a.g;
         b.addEventListener("cuechange", function() {
             for (var c = b.cues, d = 0; d < c.length; d++) {
                 var e = c[d];
                 e.align = "center";
                 e.position = "auto"
             }
         }, {
             once: !0
         })
     };
     mJ.prototype.Bb = function() {
         this.g.mode = "hidden"
     };

     function nJ(a, b) {
         if (typeof ReportingObserver !== "undefined") {
             var c = function(e) {
                     e = w(e);
                     for (var f = e.next(); !f.done; f = e.next()) f = f.value, a(f) && b(f)
                 },
                 d = new ReportingObserver(c, {
                     buffered: !0
                 });
             x.addEventListener("pagehide", function() {
                 c(d.takeRecords(), d);
                 d.disconnect()
             });
             d.observe()
         }
     }

     function oJ(a) {
         a = a === void 0 ? null : a;
         nJ(function(b) {
             return b.body && b.body.id === "HeavyAdIntervention"
         }, function(b) {
             var c = b.body.message,
                 d = L.getInstance();
             M(d, "ham", c);
             c.includes("CPU") ? M(d, "hacpu", "true") : c.includes("network") && M(d, "habytes", "true");
             a && a(b)
         })
     };
     var pJ = "autoplay controls crossorigin demuxedaudiosrc demuxedvideosrc loop muted playsinline poster preload src webkit-playsinline x-webkit-airplay".split(" "),
         qJ = "autoplay buffered controls crossOrigin currentSrc currentTime defaultMuted defaultPlaybackRate disablePictureInPicture disableRemotePlayback duration ended loop muted networkState onerror onwaitingforkey paused played playsinline poster preload preservesPitch mozPreservesPitch webkitPreservesPitch readyState seekable videoWidth videoHeight volume textTracks canPlayType captureStream getVideoPlaybackQuality load pause play requestPictureInPicture setSinkId oncanplay oncanplaythrough onload onplay onpause onended onfullscreenchange onfullscreenerror addEventListener dispatchEvent removeEventListener requestFullscreen".split(" "),
         rJ = {
             childList: !0
         },
         sJ = !RegExp("^\\s*class\\s*\\{\\s*\\}\\s*$").test(function() {}.toString()),
         tJ = HTMLElement;
     sJ && (tJ = function() {
         var a = Object.getPrototypeOf(this).constructor;
         return x.Reflect.construct(HTMLElement, [], a)
     }, Object.setPrototypeOf(tJ, HTMLElement), Object.setPrototypeOf(tJ.prototype, HTMLElement.prototype));
     var uJ = function(a) {
             if (a !== null) {
                 a = w(a);
                 for (var b = a.next(); !b.done; b = a.next())
                     if (b = b.value, b.nodeName === "TRACK".toString()) return b
             }
             return null
         },
         vJ = function(a, b) {
             this.code = a;
             this.message = b === void 0 ? "" : b
         },
         wJ = function(a) {
             vJ.call(this, MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED, a === void 0 ? "" : a)
         };
     r(wJ, vJ);
     var AJ = function(a, b) {
         b = b === void 0 ? !1 : b;
         var c = tJ.call(this) || this;
         M(L.getInstance(), "ulv", "1");
         c.yi = b;
         c.ka = null;
         c.Kf = null;
         c.cf = null;
         c.T = Rj("VIDEO");
         xJ(c);
         c.Tb = a || new gJ;
         yJ(c);
         c.Xc = null;
         zJ(c);
         c.attachShadow({
             mode: "open"
         });
         c.shadowRoot.appendChild(c.T);
         oJ(function() {
             M(L.getInstance(), "has", c.src || c.wb);
             M(L.getInstance(), "hat", String(c.T.currentTime))
         });
         c.Ed = !1;
         c.Of = !1;
         c.Jc = null;
         c.Bd = null;
         c.Nd = null;
         c.zi = !1;
         c.Uf = !1;
         c.rk = null;
         c.wc = null;
         return c
     };
     r(AJ, tJ);
     var BJ = function(a) {
         a.T.load();
         Un(so) && a.T.dispatchEvent(new Event("canplaythrough"))
     };
     AJ.prototype.attributeChangedCallback = function(a, b, c) {
         switch (a) {
             case "src":
                 CJ(this, c);
                 break;
             case "demuxedaudiosrc":
             case "demuxedvideosrc":
                 DJ(this);
                 break;
             case "muted":
                 this.T[a] = c === "" ? !0 : !!c;
                 EJ(this, a, c);
                 break;
             default:
                 EJ(this, a, c)
         }
     };
     AJ.prototype.Hd = function(a) {
         this.wc = a;
         var b;
         (b = this.ka) == null || b.Hd(a)
     };
     var FJ = function() {
             navigator.audioSession && navigator.audioSession.type !== "ambient" && (navigator.audioSession.type = "ambient")
         },
         EJ = function(a, b, c) {
             c !== a.T.getAttribute(b) && (c === null ? a.T.removeAttribute(b) : a.T.setAttribute(b, c))
         },
         GJ = function(a) {
             a.ka && (a.T.removeEventListener("timeupdate", a.Jc), a.ka.dispose(), a.ka = null)
         },
         HJ = function(a, b) {
             a.cf = b;
             a.T.dispatchEvent(new Event("error"))
         },
         xJ = function(a) {
             IJ(a);
             JJ(a);
             a.T.addEventListener("loadedmetadata", function() {
                 a.Nd = NF(a);
                 a.Nd.then(function(b) {
                     var c = a.T;
                     var d =
                         new qj(b.width, b.height);
                     b = a.T.videoWidth;
                     var e = a.T.videoHeight,
                         f = d.width,
                         g = d.height;
                     b > 0 && e > 0 && f > 0 && g > 0 ? (d = d.width / d.height, b /= e, b = Math.min(b, d) / Math.max(b, d) >= .97 ? "cover" : "contain") : b = null;
                     b !== null && dk(c, {
                         "object-fit": b
                     })
                 })
             });
             a.T.addEventListener("play", function() {
                 a.Of || (XI(a.T, "first_play"), a.Of = !0)
             });
             a.T.addEventListener("pause", function() {
                 a.Ed || (XI(a.T, "first_pause"), ZI(a.T), a.Ed = !0)
             });
             bx(x, "pagehide", function() {
                 a.Ed || (XI(a.T, "first_pause"), ZI(a.T), a.Ed = !0)
             });
             a.T.addEventListener("stalled", function() {
                 M(L.getInstance(),
                     "ves", "1")
             });
             (new XF(a.T)).listen("playbackStalled", function() {
                 return M(L.getInstance(), "pbs", "1")
             });
             a.T.addEventListener("media_source_error", function(b) {
                 GJ(a);
                 b = b.detail;
                 HJ(a, new vJ(b.code, b.message))
             });
             KJ(a)
         },
         zJ = function(a) {
             var b = uJ(a.childNodes);
             b && LJ(a, b);
             a.Xc === null && MJ(a)
         },
         MJ = function(a) {
             if (x.MutationObserver) {
                 var b = new MutationObserver(function(c) {
                     c = w(c);
                     for (var d = c.next(); !d.done; d = c.next())
                         if (d = d.value, d.type === "childList" && (d = uJ(d.addedNodes))) {
                             LJ(a, d);
                             b.disconnect();
                             break
                         }
                 });
                 b.observe(a,
                     rJ)
             }
         },
         yJ = function(a) {
             a.T.addEventListener("volumechange", function() {
                 a.Tb.g.C(aJ.toString(), a.T.muted);
                 a.yi || a.Tb.g.C(bJ.toString(), a.T.muted)
             })
         },
         LJ = function(a, b) {
             if (a.Xc === null && b.hasAttribute("src")) {
                 var c = b.getAttribute("src");
                 a.Xc = new mJ(a.T, c, b.hasAttribute("default"));
                 new jJ(a.Xc, a.Tb);
                 c.includes("kind=asr") && M(L.getInstance(), "act", "1")
             }
         },
         CJ = function(a, b) {
             if (b !== a.Kf) {
                 a.Kf = b;
                 a.zi && b && wF(b) && (b = yF(b));
                 var c = b ? eH(b) : null,
                     d = !!c && wI(c);
                 M(L.getInstance(), "umsem", d ? "1" : "0");
                 d ? (b = nE(YI, b, fH(c), XG[c] *
                     1E3, null), a.ka = nE(MI, [b]), a.wc && a.ka.Hd(a.wc), a.ka.listen("media_source_error", function(e) {
                     e = gH("media_source_error", e.detail);
                     a.T.dispatchEvent(e)
                 }), Un(ro) && a.ka.listen("bandaid_fallback_count", function() {
                     a.dispatchEvent(gH("bandaid_fallback_count"))
                 }), a.Jc = function() {
                     var e = a.ka;
                     e.F = a.T.currentTime * 1E3;
                     PI(e)
                 }, a.T.addEventListener("timeupdate", a.Jc), uI(a.ka.g) && (EJ(a, "disableRemotePlayback", "true"), FJ(), a.Bd = function(e) {
                     e = e.detail;
                     e.currentTimeSeconds = a.T.currentTime;
                     a.dispatchEvent(new CustomEvent("bufferremoved", {
                         detail: e
                     }))
                 }, a.ka.listen("bufferremoved", a.Bd)), EJ(a, "src", QI(a.ka))) : (GJ(a), EJ(a, "src", b));
                 a.Uf || BJ(a)
             }
         },
         DJ = function(a) {
             a.src && HJ(a, new vJ(MediaError.MEDIA_ERR_ABORTED, "Setting demuxed src after src is already set."));
             if (!a.Mb && !a.wb && a.ka) GJ(a), EJ(a, "src", null), BJ(a);
             else if (a.Mb && a.wb) {
                 var b = eH(wF(a.wb) ? yF(a.wb) : a.wb),
                     c = eH(wF(a.Mb) ? yF(a.Mb) : a.Mb);
                 if (b && wI(b))
                     if (c && wI(c)) {
                         var d = !!b && wI(b) && !!c && wI(c);
                         M(L.getInstance(), "umsed", d ? "1" : "0");
                         b = nE(YI, a.wb, fH(b), -1, null);
                         c = nE(YI, a.Mb, fH(c), -1, null);
                         a.ka =
                             nE(MI, [b, c]);
                         a.wc && a.ka.Hd(a.wc);
                         a.ka.listen("media_source_error", function(e) {
                             e = gH("media_source_error", e.detail);
                             a.T.dispatchEvent(e)
                         });
                         Un(ro) && a.ka.listen("bandaid_fallback_count", function() {
                             a.dispatchEvent(gH("bandaid_fallback_count"))
                         });
                         a.Jc = function() {
                             var e = a.ka;
                             e.F = a.T.currentTime * 1E3;
                             PI(e)
                         };
                         a.T.addEventListener("timeupdate", a.Jc);
                         uI(a.ka.g) && (EJ(a, "disableRemotePlayback", "true"), FJ(), a.Bd = function(e) {
                             e = e.detail;
                             e.currentTimeSeconds = a.T.currentTime;
                             a.dispatchEvent(new CustomEvent("bufferremoved", {
                                 detail: e
                             }))
                         }, a.ka.listen("bufferremoved", a.Bd));
                         EJ(a, "src", QI(a.ka));
                         a.Uf || BJ(a)
                     } else HJ(a, new wJ('Audio itag "' + c + '" not supported.'));
                 else HJ(a, new wJ('Video itag "' + b + '" not supported.'))
             }
         },
         IJ = function(a) {
             for (var b = w(qJ), c = b.next(), d = {}; !c.done; d = {
                     pb: void 0,
                     getValue: void 0
                 }, c = b.next()) d.pb = c.value, d.pb in a.T && (typeof a.T[d.pb] === "function" ? (d.getValue = a.T[d.pb].bind(a.T), Object.defineProperty(a, d.pb, {
                     set: function(e) {
                         return function(f) {
                             a.T[e.pb] = f
                         }
                     }(d),
                     get: function(e) {
                         return function() {
                             return e.getValue
                         }
                     }(d)
                 })) :
                 Object.defineProperty(a, d.pb, {
                     set: function(e) {
                         return function(f) {
                             a.T[e.pb] = f
                         }
                     }(d),
                     get: function(e) {
                         return function() {
                             return a.T[e.pb]
                         }
                     }(d)
                 }))
         },
         JJ = function(a) {
             Object.defineProperty(a, "error", {
                 set: function() {},
                 get: function() {
                     return a.T.error ? a.T.error : a.cf
                 }
             })
         },
         KJ = function(a) {
             a.T.style.width = kk();
             a.T.style.height = kk()
         };
     AJ.prototype.disconnectedCallback = function() {
         this.Nd && OF(this.Nd);
         tJ.prototype.disconnectedCallback && tJ.prototype.disconnectedCallback.call(this)
     };
     ha.Object.defineProperties(AJ.prototype, {
         Mb: {
             configurable: !0,
             enumerable: !0,
             set: function(a) {
                 this.setAttribute("demuxedaudiosrc", a)
             },
             get: function() {
                 return this.getAttribute("demuxedaudiosrc")
             }
         },
         wb: {
             configurable: !0,
             enumerable: !0,
             set: function(a) {
                 this.setAttribute("demuxedvideosrc", a)
             },
             get: function() {
                 return this.getAttribute("demuxedvideosrc")
             }
         },
         src: {
             configurable: !0,
             enumerable: !0,
             set: function(a) {
                 this.setAttribute("src", a)
             },
             get: function() {
                 return this.getAttribute("src")
             }
         }
     });
     ha.Object.defineProperties(AJ, {
         observedAttributes: {
             configurable: !0,
             enumerable: !0,
             get: function() {
                 return pJ
             }
         }
     });
     x.customElements && (x.customElements.get("lima-video") || x.customElements.define("lima-video", AJ));
     var NJ = function() {
         NG.apply(this, arguments)
     };
     r(NJ, NG);
     NJ.prototype.unload = function() {
         this.g.removeAttribute("demuxedVideoSrc");
         this.g.removeAttribute("demuxedAudioSrc");
         NG.prototype.unload.call(this)
     };
     var OJ = function(a) {
             this.g = a;
             this.o = "";
             this.l = -1;
             this.j = null;
             this.B = !1
         },
         QJ = function(a, b) {
             if (a.l >= 0) {
                 var c = b == null ? function() {} : b,
                     d = function() {
                         PJ(a, c);
                         a.g.removeEventListener("loadedmetadata", d, !1)
                     };
                 a.g.addEventListener("loadedmetadata", d, !1);
                 a.g.src = a.o;
                 a.j !== null && a.g.setAttribute("crossOrigin", a.j);
                 a.g.load()
             } else b != null && b()
         },
         PJ = function(a, b) {
             var c = a.g.seekable.length > 0;
             a.B ? c ? (a.g.currentTime = a.l, RJ(a), b()) : setTimeout(function() {
                 return void PJ(a, b)
             }, 100) : (RJ(a), b())
         },
         RJ = function(a) {
             a.l = -1;
             a.o =
                 "";
             a.B = !1;
             a.j = null
         };
     var SJ = function(a, b, c, d) {
         NJ.call(this, a, b === void 0 ? !1 : b, c === void 0 ? !1 : c, d === void 0 ? !1 : d);
         this.La = new OJ(a)
     };
     r(SJ, NJ);
     SJ.prototype.Ba = function() {
         var a = this.La;
         a.o = a.g.currentSrc;
         a.B = a.g.seekable.length > 0;
         a.j = a.g.getAttribute("crossOrigin");
         a.l = a.g.ended ? -1 : a.g.currentTime
     };
     SJ.prototype.V = function(a) {
         QJ(this.La, a)
     };
     var TJ = function() {};

     function UJ() {
         var a = nE(eI);
         a.initialize().then(function() {
             var b = gH("initialized");
             a.dispatchEvent(b)
         });
         return a
     }
     var WJ = function(a, b, c, d, e) {
         Q.call(this);
         this.G = a;
         this.j = c;
         this.o = e;
         this.ca = this.U = this.bb = this.F = this.l = this.La = 0;
         this.C = [];
         this.M = !1;
         this.da = this.ga = this.fa = null;
         this.ra = !1;
         this.ub = this.K = this.B = this.Ba = this.Ka = null;
         this.isLastVideoChunk = !1;
         this.H = new TE(b.url);
         this.Sa = b.Sa;
         this.Aa = d;
         (this.P = b.g) || this.H.l.remove("alr");
         M(L.getInstance(), "sl_dv" + this.o, (this.P !== null).toString());
         this.V = !this.P;
         this.g = new XMLHttpRequest;
         this.Z = .1;
         if (this.A = iH() && !xF(this.H)) this.B = UJ(), Hs(this, this.B);
         VJ(this)
     };
     r(WJ, Q);
     var XJ = function(a, b) {
             b = gH("media_source_error", b);
             a.G.dispatchEvent(b)
         },
         YJ = function(a, b) {
             XJ(a, {
                 code: a.l > 1 ? MediaError.MEDIA_ERR_NETWORK : MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED,
                 message: b
             })
         },
         VJ = function(a) {
             a.fa = function() {
                 ZJ(a);
                 if (a.V) {
                     var b = a.g.responseText;
                     a.M = !b || b.length < a.Sa;
                     a.U = 0;
                     Qm("sl_cc" + a.o + "_" + a.l);
                     a.F++;
                     $J(a)
                 }
             };
             a.ga = function() {
                 ZJ(a)
             };
             a.da = function() {
                 Qm("sl_ec" + a.o + "_" + a.l);
                 YJ(a, "Failed to load chunk " + a.l + " for stream " + a.o)
             };
             a.g.addEventListener("load", a.fa);
             a.g.addEventListener("progress", a.ga);
             a.g.addEventListener("error", a.da);
             a.j.addEventListener("updateend", function() {
                 a.j.buffered.length && (a.bb = a.j.buffered.end(0), a.A ? a.isLastVideoChunk && !a.j.updating && a.l === a.F && (Qm("sl_lc" + a.o), a.Aa()) : a.M && !a.j.updating && a.l === a.F && (Qm("sl_lc" + a.o), a.Aa()));
                 !a.ra && a.G.buffered.length > 1 && (M(L.getInstance(), "dbr", "1"), a.ra = !0)
             });
             a.j.addEventListener("update", function() {
                 a.C.length && !a.j.updating && a.j.appendBuffer(a.C.shift())
             });
             a.j.addEventListener("error", function() {
                 Qm("msb_err" + a.o);
                 XJ(a, {
                     code: MediaError.MEDIA_ERR_DECODE,
                     message: "Error on SourceBuffer " + a.o
                 })
             });
             a.A ? (a.B.ib() ? aK(a) : a.Ka = bx(a.B, "initialized", function() {
                 aK(a)
             }), a.Ba = bx(a.B, "get_video_succeeded", function() {
                 $J(a)
             })) : aK(a)
         },
         cK = function(a) {
             Qm("sl_rc" + a.o + "_" + a.l);
             var b = bK(a);
             a.g.open("get", b);
             a.g.overrideMimeType("text/plain; charset=x-user-defined");
             a.g.send(null);
             a.A && (a.K = null, a.ub = b)
         },
         ZJ = function(a) {
             if (a.g.status >= 400) YJ(a, 'Response code "' + a.g.status + '" on loading chunk ' + a.l + " for stream " + a.o);
             else {
                 if (!a.V) {
                     var b = a.g.getResponseHeader("content-type");
                     if (b && b.indexOf("text/plain") >= 0) {
                         a.g.readyState === XMLHttpRequest.DONE && (a.H = new TE(a.g.response), a.l = 0, a.F = 0, a.La++, aK(a));
                         return
                     }
                     a.V = !0;
                     Qm("sl_redc" + a.o);
                     M(L.getInstance(), "sl_tr" + a.o, a.La.toString())
                 }
                 a.H.l.remove("alr");
                 if (a.g.readyState === XMLHttpRequest.LOADING || a.g.readyState === XMLHttpRequest.DONE) b = dK(a, a.U), a.U = a.g.response.length, a.ca += b.byteLength, eK(a, b);
                 if (a.A && a.g.readyState === XMLHttpRequest.DONE && (b = dK(a, 0), b.byteLength > 0)) {
                     var c = a.g.responseText;
                     a.isLastVideoChunk = !c || c.length < a.Sa;
                     a.B.Sc(b, new TE(a.ub), 0, a.isLastVideoChunk)
                 }
             }
         },
         eK = function(a, b) {
             b.byteLength > 0 && (a.j.updating || a.C.length ? a.C.push(b) : a.j.appendBuffer(b))
         },
         dK = function(a, b) {
             a = a.g.response;
             for (var c = new Uint8Array(a.length - b), d = 0; d < c.length; d++) c[d] = a.charCodeAt(d + b) & 255;
             return c.buffer
         },
         $J = function(a) {
             var b = zF;
             b !== -1 && b < a.ca + a.Sa ? (a.G.pause(), zF = -1, b = !1) : (b = a.F === a.l && !a.j.updating && !a.C.length, b = a.A ? !a.isLastVideoChunk && b && a.G.currentTime >= a.Z : !a.M && b && a.G.currentTime >= a.Z);
             b && (a.Z = a.bb + .1, aK(a))
         },
         bK = function(a) {
             var b =
                 a.A && a.K ? a.K + 1 : a.l * a.Sa;
             return gF(a.H, "range", b + "-" + (b + a.Sa - 1)).toString()
         },
         aK = function(a) {
             if (a.A) {
                 var b = new TE(bK(a));
                 a.B.Bc(b).then(function(c) {
                     c ? (a.K = Number(c.endIndex), a.isLastVideoChunk = c.isLastVideoChunk, eK(a, c.video), c = gH("get_video_succeeded"), a.B.dispatchEvent(c), a.F++) : cK(a);
                     a.l++
                 })
             } else cK(a), a.l++
         };
     WJ.prototype.O = function() {
         this.A && this.B.ib() && this.B.close();
         this.g.removeEventListener("load", this.fa);
         this.g.removeEventListener("progress", this.ga);
         this.g.removeEventListener("error", this.da);
         jx(this.Ka);
         jx(this.Ba);
         Q.prototype.O.call(this)
     };
     var gK = function(a, b) {
         Q.call(this);
         var c = this;
         this.B = a;
         this.G = b;
         this.g = new MediaSource;
         this.F = [];
         this.l = [];
         this.j = this.o = null;
         this.A = !1;
         this.C = function() {
             fK(c)
         };
         this.g.addEventListener("sourceopen", this.C)
     };
     r(gK, Q);
     var hK = function(a) {
             a.o && a.B.removeEventListener("timeupdate", a.o)
         },
         fK = function(a) {
             Qm("msmsw_oso");
             a.o = function() {
                 if (!a.A)
                     for (var e = w(a.l), f = e.next(); !f.done; f = e.next()) $J(f.value)
             };
             a.B.addEventListener("timeupdate", a.o);
             for (var b = 0; b < a.G.length; b++) {
                 var c = a.G[b];
                 M(L.getInstance(), "msmsw_mime" + b, c.mimeType);
                 M(L.getInstance(), "msmsw_cs" + b, c.Sa.toString());
                 var d = a.g.addSourceBuffer(c.mimeType);
                 d ? (a.F.push(d), c = nE(WJ, a.B, c, d, function() {
                     a: if (!a.A) {
                         for (var e = w(a.l), f = e.next(); !f.done; f = e.next())
                             if (f = f.value,
                                 f.A ? !f.isLastVideoChunk || f.j.updating || f.C.length : !f.M || f.j.updating || f.C.length) break a;
                         a.g.endOfStream();
                         a.A = !0;
                         hK(a)
                     }
                 }, b), a.l.push(c)) : Qm("msmsw_sbf" + b)
             }
             M(L.getInstance(), "msmsw_ns", a.F.length.toString())
         };
     gK.prototype.O = function() {
         this.j && window.URL.revokeObjectURL(this.j);
         for (var a = w(this.l), b = a.next(); !b.done; b = a.next()) b.value.dispose();
         hK(this);
         this.g.removeEventListener("sourceopen", this.C);
         Q.prototype.O.call(this)
     };
     RegExp.prototype.hasOwnProperty("sticky");
     /* 
      
     Math.uuid.js (v1.4) 
     http://www.broofa.com 
     mailto:robert@broofa.com 
     Copyright (c) 2010 Robert Kieffer 
     Dual licensed under the MIT and GPL licenses. 
     */
     var iK = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");

     function jK() {
         for (var a = Array(36), b = 0, c, d = 0; d < 36; d++) d == 8 || d == 13 || d == 18 || d == 23 ? a[d] = "-" : d == 14 ? a[d] = "4" : (b <= 2 && (b = 33554432 + Math.random() * 16777216 | 0), c = b & 15, b >>= 4, a[d] = iK[d == 19 ? c & 3 | 8 : c]);
         return a.join("")
     };
     var lK = function(a) {
         TE.call(this, a);
         this.C = new Map;
         a = this.j;
         var b = a.indexOf(";"),
             c = null;
         b >= 0 ? (this.j = a.substring(0, b), c = a.substring(b + 1)) : this.j = a;
         kK(this, c)
     };
     r(lK, TE);
     lK.prototype.toString = function() {
         return mK(this, TE.prototype.toString.call(this))
     };
     lK.prototype.F = function() {
         return ""
     };
     var kK = function(a, b) {
             Db(Vi(b)) || b.split(";").forEach(function(c) {
                 var d = c.indexOf("=");
                 if (!(d <= 0)) {
                     var e = Ri(c.substring(0, d));
                     c = Ri(c.substring(d + 1));
                     d = a.C.get(e);
                     d != null ? d.includes(c) || d.push(c) : d = [Vi(c)];
                     a.C.set(e, d)
                 }
             }, a)
         },
         nK = function(a) {
             if (Db(Vi("ord"))) return null;
             a = a.C.get("ord");
             return a != null ? a : null
         },
         oK = function(a, b) {
             Db(Vi("ord")) || (b = b.map(Vi), a.C.set("ord", b))
         },
         mK = function(a, b) {
             b = [Vi(b)];
             b.push.apply(b, ua(pK(a)));
             return b.join(";")
         },
         pK = function(a) {
             var b = nK(a);
             b == null ? b = [Vi(Date.now())] : Db(Vi("ord")) ||
                 a.C.delete("ord");
             var c = [];
             a.C.forEach(function(d, e) {
                 d.forEach(function(f) {
                     c.push(e + "=" + f)
                 })
             });
             c.push("ord=" + b[0]);
             oK(a, b);
             return c
         };
     lK.prototype.G = function() {
         return new lK(this.toString())
     };
     var qK = {
         Bj: "IABUSPrivacy_String",
         kj: "IABTCF_gdprApplies",
         Aj: "IABTCF_TCString",
         jj: "IABTCF_AddtlConsent",
         ij: "IABGPP_HDR_GppString",
         hj: "IABGPP_GppSID"
     };
     var rK = {
         DEPRECATED_ERROR_CODE: -1,
         VAST_MALFORMED_RESPONSE: 100,
         VAST_SCHEMA_VALIDATION_ERROR: 101,
         VAST_UNSUPPORTED_VERSION: 102,
         VAST_TRAFFICKING_ERROR: 200,
         VAST_UNEXPECTED_LINEARITY: 201,
         VAST_UNEXPECTED_DURATION_ERROR: 202,
         VAST_WRAPPER_ERROR: 300,
         VAST_LOAD_TIMEOUT: 301,
         VAST_TOO_MANY_REDIRECTS: 302,
         VAST_NO_ADS_AFTER_WRAPPER: 303,
         VIDEO_PLAY_ERROR: 400,
         VAST_MEDIA_LOAD_TIMEOUT: 402,
         VAST_LINEAR_ASSET_MISMATCH: 403,
         VAST_PROBLEM_DISPLAYING_MEDIA_FILE: 405,
         OVERLAY_AD_PLAYING_FAILED: 500,
         NONLINEAR_DIMENSIONS_ERROR: 501,
         OVERLAY_AD_LOADING_FAILED: 502,
         VAST_NONLINEAR_ASSET_MISMATCH: 503,
         COMPANION_REQUIRED_ERROR: 602,
         COMPANION_AD_LOADING_FAILED: 603,
         UNKNOWN_ERROR: 900,
         VPAID_ERROR: 901,
         FAILED_TO_REQUEST_ADS: 1005,
         VAST_ASSET_NOT_FOUND: 1007,
         VAST_EMPTY_RESPONSE: 1009,
         UNKNOWN_AD_RESPONSE: 1010,
         UNSUPPORTED_LOCALE: 1011,
         ADS_REQUEST_NETWORK_ERROR: 1012,
         INVALID_AD_TAG: 1013,
         PROTECTED_AUDIENCE_API_ERROR: 1014,
         STREAM_INITIALIZATION_FAILED: 1020,
         ASSET_FALLBACK_FAILED: 1021,
         UNSUPPORTED_URL: 1022,
         INVALID_ARGUMENTS: 1101,
         NATIVE_MESSAGE_ERROR: 1204,
         AUTOPLAY_DISALLOWED: 1205,
         CONSENT_MANAGEMENT_PROVIDER_NOT_READY: 1300,
         Tj: 2002
     };
     rK[-1] = "DEPRECATED_ERROR_CODE";
     rK[100] = "VAST_MALFORMED_RESPONSE";
     rK[101] = "VAST_SCHEMA_VALIDATION_ERROR";
     rK[102] = "VAST_UNSUPPORTED_VERSION";
     rK[200] = "VAST_TRAFFICKING_ERROR";
     rK[201] = "VAST_UNEXPECTED_LINEARITY";
     rK[202] = "VAST_UNEXPECTED_DURATION_ERROR";
     rK[300] = "VAST_WRAPPER_ERROR";
     rK[301] = "VAST_LOAD_TIMEOUT";
     rK[302] = "VAST_TOO_MANY_REDIRECTS";
     rK[303] = "VAST_NO_ADS_AFTER_WRAPPER";
     rK[400] = "VIDEO_PLAY_ERROR";
     rK[402] = "VAST_MEDIA_LOAD_TIMEOUT";
     rK[403] = "VAST_LINEAR_ASSET_MISMATCH";
     rK[405] = "VAST_PROBLEM_DISPLAYING_MEDIA_FILE";
     rK[500] = "OVERLAY_AD_PLAYING_FAILED";
     rK[501] = "NONLINEAR_DIMENSIONS_ERROR";
     rK[502] = "OVERLAY_AD_LOADING_FAILED";
     rK[503] = "VAST_NONLINEAR_ASSET_MISMATCH";
     rK[602] = "COMPANION_REQUIRED_ERROR";
     rK[603] = "COMPANION_AD_LOADING_FAILED";
     rK[900] = "UNKNOWN_ERROR";
     rK[901] = "VPAID_ERROR";
     rK[1005] = "FAILED_TO_REQUEST_ADS";
     rK[1007] = "VAST_ASSET_NOT_FOUND";
     rK[1009] = "VAST_EMPTY_RESPONSE";
     rK[1010] = "UNKNOWN_AD_RESPONSE";
     rK[1011] = "UNSUPPORTED_LOCALE";
     rK[1012] = "ADS_REQUEST_NETWORK_ERROR";
     rK[1013] = "INVALID_AD_TAG";
     rK[1014] = "PROTECTED_AUDIENCE_API_ERROR";
     rK[1020] = "STREAM_INITIALIZATION_FAILED";
     rK[1021] = "ASSET_FALLBACK_FAILED";
     rK[1022] = "UNSUPPORTED_URL";
     rK[1101] = "INVALID_ARGUMENTS";
     rK[1204] = "NATIVE_MESSAGE_ERROR";
     rK[1205] = "AUTOPLAY_DISALLOWED";
     rK[1300] = "CONSENT_MANAGEMENT_PROVIDER_NOT_READY";
     rK[2002] = "SUPPORTED_ADS_NOT_FOUND";
     var sK = function(a, b, c) {
         var d = Error.call(this);
         this.message = d.message;
         "stack" in d && (this.stack = d.stack);
         this.type = a;
         this.errorMessage = b;
         this.errorCode = c;
         this.ad = this.g = null
     };
     r(sK, Error);
     m = sK.prototype;
     m.getAd = function() {
         return this.ad
     };
     m.getInnerError = function() {
         return this.g
     };
     m.getMessage = function() {
         return this.errorMessage
     };
     m.getErrorCode = function() {
         return this.errorCode
     };
     m.getVastErrorCode = function() {
         return this.errorCode < 1E3 ? this.errorCode : 900
     };
     m.getType = function() {
         return this.type
     };
     m.toString = function() {
         return "AdError " + this.getErrorCode() + ": " + this.getMessage() + (this.getInnerError() != null ? " Caused by: " + this.getInnerError() : "")
     };
     m.ba = function() {
         for (var a = {}, b = a = (a.type = this.getType(), a.errorCode = this.getErrorCode(), a.errorMessage = this.getMessage(), a), c = this.getInnerError(), d = 0; d < 3; ++d)
             if (c instanceof sK) {
                 var e = {};
                 e = (e.type = c.getType(), e.errorCode = c.getErrorCode(), e.errorMessage = c.getMessage(), e);
                 b = b.innerError = e;
                 c = c.getInnerError()
             } else {
                 c != null && (b.innerError = String(c));
                 break
             } return a
     };
     var tK = wa(["https://imasdk.googleapis.com/js/sdkloader/car.js"]);
     ij(tK);
     var uK = function(a) {
             this.g = a
         },
         wK = function(a) {
             return vK(a)
         },
         xK = function(a, b) {
             return yj(a.g, b) && (a = a.g[b], typeof a === "boolean") ? a : !1
         },
         yK = function(a) {
             return yj(a.g, "videoElementFakeDuration") && (a = a.g.videoElementFakeDuration, typeof a === "number") ? a : NaN
         },
         vK = function(a) {
             if (yj(a.g, "forceExperimentIds")) {
                 a = a.g.forceExperimentIds;
                 var b = [],
                     c = 0;
                 Array.isArray(a) && a.forEach(function(d) {
                     typeof d === "number" && (b[c++] = d)
                 });
                 return b
             }
             return null
         };
     var zK = function() {
             this.L = "always";
             this.K = 4;
             this.A = null;
             this.B = 1;
             this.g = 0;
             this.I = !0;
             this.locale = "en";
             this.j = null;
             this.H = !1;
             this.U = this.P = "";
             this.o = null;
             this.V = this.M = -1;
             this.l = "";
             this.F = !1;
             this.Z = null;
             this.C = jK();
             this.G = {};
             try {
                 this.Z = Cq()[0]
             } catch (a) {}
         },
         AK = function(a) {
             a = Vi(a);
             Db(a) || (a = a.substring(0, 20));
             return a
         };
     m = zK.prototype;
     m.setCompanionBackfill = function(a) {
         this.L = a
     };
     m.getCompanionBackfill = function() {
         return this.L
     };
     m.setNumRedirects = function(a) {
         this.K = a
     };
     m.getNumRedirects = function() {
         return this.K
     };
     m.setPpid = function(a) {
         this.A = a
     };
     m.getPpid = function() {
         return this.A
     };
     m.setVpaidAllowed = function(a) {
         typeof a === "boolean" && (this.B = a ? 1 : 0)
     };
     m.setVpaidMode = function(a) {
         this.B = a
     };
     m.ed = function() {
         return this.B
     };
     m.setAutoPlayAdBreaks = function(a) {
         this.I = a
     };
     m.Ec = function() {
         return this.I
     };
     m.Le = function(a) {
         this.H = a
     };
     m.xb = function() {
         return this.H
     };
     m.setLocale = function(a) {
         if (a = eG(a)) this.locale = a
     };
     m.getLocale = function() {
         return this.locale
     };
     m.setPlayerType = function(a) {
         this.P = AK(a)
     };
     m.getPlayerType = function() {
         return this.P
     };
     m.setPlayerVersion = function(a) {
         this.U = AK(a)
     };
     m.getPlayerVersion = function() {
         return this.U
     };
     var BK = function(a) {
         if (a.o == null) {
             var b = {};
             var c = (new TE(Oj().location.href)).l;
             if (mF(c, "tcnfp")) try {
                 b = JSON.parse(c.get("tcnfp"))
             } catch (d) {}
             a.o = new uK(b)
         }
         return a.o
     };
     m = zK.prototype;
     m.Me = function(a) {
         this.M = a
     };
     m.Oe = function(a) {
         this.V = a
     };
     m.setDisableCustomPlaybackForIOS10Plus = function(a) {
         this.F = a
     };
     m.getDisableCustomPlaybackForIOS10Plus = function() {
         return this.F
     };
     m.setSessionId = function(a) {
         this.C = a
     };
     m.setFeatureFlags = function(a) {
         this.G = a
     };
     m.getFeatureFlags = function() {
         return this.G
     };
     m.ba = function(a) {
         a = a === void 0 ? null : a;
         var b = {};
         a != null && (b.activeViewPushUpdates = a);
         b.activityMonitorMode = this.g;
         b.adsToken = this.l;
         b.autoPlayAdBreaks = this.Ec();
         b.companionBackfill = this.getCompanionBackfill();
         b.disableCustomPlaybackForIOS10Plus = this.getDisableCustomPlaybackForIOS10Plus();
         b.engagementDetection = !0;
         b.isFunctionalTest = !1;
         b.isVpaidAdapter = this.xb();
         b["1pJar"] = "";
         b.numRedirects = this.getNumRedirects();
         b.pageCorrelator = this.M;
         b.persistentStateCorrelator = jm();
         b.playerType = this.getPlayerType();
         b.playerVersion = this.getPlayerVersion();
         b.ppid = this.getPpid();
         b.privacyControls = "";
         b.reportMediaRequests = !1;
         b.sessionId = this.C;
         b.streamCorrelator = this.V;
         b.testingConfig = BK(this).g;
         b.urlSignals = this.Z;
         b.vpaidMode = this.ed();
         b.featureFlags = this.getFeatureFlags();
         return b
     };
     var S = new zK;

     function CK(a) {
         return a ? (a = /\/(\d+)(?:,\d+){0,2}\//.exec(a)) && a.length === 2 ? a[1] : null : null
     }

     function DK(a) {
         if (a === "") return null;
         a = new TE(a);
         var b = hF(a, "slotname") || hF(a, "iu");
         if (!(b = b ? CK(b) : null)) {
             var c;
             b = (a = (c = hF(a, "client")) != null ? c : "") ? a : null
         }
         return b
     }

     function EK(a, b) {
         try {
             var c = new URL(a);
             return c.searchParams.get("slotname") || c.searchParams.get("iu") || ""
         } catch (d) {
             b == null || b(d)
         }
         return ""
     }

     function FK(a) {
         try {
             var b = new URL(a),
                 c = b.searchParams.get("cust_params"),
                 d = b.searchParams.get("scp");
             if (c == null) return {};
             a = function(e) {
                 return e == null ? {} : Object.fromEntries(e.split("&").map(function(f) {
                     return f.split("=")
                 }).map(function(f) {
                     var g;
                     return [f[0], decodeURIComponent((g = f[1]) != null ? g : "").split(",")]
                 }).filter(function(f) {
                     return f[0].length > 0
                 }))
             };
             return Object.assign({}, a(c), a(d))
         } catch (e) {}
         return {}
     };
     var GK = function(a) {
         var b = a;
         b: {
             if (b && typeof b === "object") {
                 a = w(Object.values(qK));
                 for (var c = a.next(); !c.done; c = a.next())
                     if (b.hasOwnProperty(c.value)) {
                         a = !0;
                         break b
                     }
             }
             a = !1
         }
         if (a) {
             var d, e, f, g, h, k;
             c = {};
             a = (c.uspString = (d = b.IABUSPrivacy_String) != null ? d : null, c.gdprApplies = (e = b.IABTCF_gdprApplies) != null ? e : null, c.tcString = (f = b.IABTCF_TCString) != null ? f : null, c.addtlConsent = (g = b.IABTCF_AddtlConsent) != null ? g : null, c.gppString = (h = b.IABGPP_HDR_GppString) != null ? h : null, c.gppSid = (k = b.IABGPP_GppSID) != null ? k : null, c)
         } else a =
             b;
         b = a.uspString;
         this.uspString = typeof b === "string" ? b : "";
         b = a.gdprApplies;
         this.j = typeof b === "boolean" ? b ? "1" : "0" : typeof b !== "number" || b !== 1 && b !== 0 ? typeof b !== "string" || b !== "1" && b !== "0" ? "" : b === "1" ? "1" : "0" : b === 1 ? "1" : "0";
         b = a.tcString;
         this.g = typeof b === "string" ? b : "";
         /^[\.\w_-]*$/.test(this.g) || (this.g = encodeURIComponent(this.g));
         b = a.gppString;
         this.gppString = typeof b === "string" ? b : "";
         a = a.gppSid;
         this.l = typeof a === "string" ? a : ""
     };
     var HK = function(a) {
         this.D = C(a)
     };
     r(HK, I);

     function IK(a) {
         var b = {};
         (new TE(a)).l.forEach(function(c, d) {
             b[d] = c
         });
         return b
     }

     function JK(a) {
         return a === "1" || a === "true"
     }
     var KK = function(a, b, c, d, e) {
             b = b === void 0 ? {} : b;
             c = c === void 0 ? {} : c;
             this.j = a === void 0 ? !1 : a;
             this.o = d === void 0 ? !1 : d;
             this.B = e === void 0 ? !1 : e;
             a = {};
             b = w(Object.entries(b));
             for (d = b.next(); !d.done; d = b.next()) e = w(d.value), d = e.next().value, e = e.next().value, e != null && (a[d] = String(e));
             this.l = a;
             this.g = new GK(c)
         },
         LK = function(a, b, c) {
             var d = !1;
             d = d === void 0 ? !1 : d;
             c = c === void 0 ? !1 : c;
             var e = new TE(a);
             var f = e.j;
             (e = Cb(e.g, "googleads.g.doubleclick.net") && cG("/pagead/(live/)?ads", f)) || (f = new lK(a), e = f.g, f = mK(f, f.j), e = !Cb(e, ".g.doubleclick.net") &&
                 (Cb(e, "doubleclick.net") || Cb(e, "pagead2.googlesyndication.com")) && cG("/(ad|pfad)[x|i|j]?/", f));
             e || (e = new TE(a), f = e.j, e = Cb(e.g, "doubleclick.net") && cG("/gampad/(live/)?ads", f));
             (e = e || (new TE(a)).g == "bid.g.doubleclick.net") || (e = new TE(a), f = e.j, e = e.g === "ad.doubleclick.net" && cG("/dv3/adv", f));
             e || (e = new TE(a), f = e.j, e = e.g === "pubads.g.doubleclick.net" && (cG("/ssai/", f) || cG("/ondemand/", f)));
             return new KK(e, IK(a), b, d, c)
         },
         OK = function(a) {
             var b = a.g.g;
             var c = MK(a, "gdpr_consent");
             b = b && b !== "tcunavailable" ? b : b === "tcunavailable" ?
                 c || b : c || "";
             if (b === "tcunavailable") return null;
             var d;
             return (d = SD(b, NK(a))) != null ? d : null
         },
         MK = function(a, b) {
             if (a.l.hasOwnProperty(b)) return a.l[b]
         },
         QK = function(a) {
             var b;
             (b = PK(a)) || (NK(a) ? (a = OK(a), a = !!a && FE(a)) : a = !0, b = !a);
             return b
         },
         PK = function(a) {
             a = MK(a, "ltd");
             return JK(a)
         },
         NK = function(a) {
             var b = MK(a, "gdpr"),
                 c = a.g.j;
             b = (c === "1" || c === "0" ? c : b !== void 0 ? b : "").toLowerCase();
             return b === "true" || b === "1" || a.o
         },
         RK = function(a) {
             var b = new HK;
             a = !QK(a);
             ug(b, 5, a);
             return b
         },
         SK = function(a) {
             try {
                 var b = a.g.gppString,
                     c = a.g.l.split("_").map(function(d) {
                         return Number(d)
                     });
                 return SE(b, c).Oh
             } catch (d) {
                 return !1
             }
         };
     var TK = function(a) {
         this.D = C(a)
     };
     r(TK, I);
     TK.prototype.getVersion = function() {
         return pg(this, 2)
     };
     var UK = function(a) {
         this.D = C(a)
     };
     r(UK, I);
     var VK = function(a, b) {
             return zg(a, 2, b)
         },
         WK = function(a, b) {
             return zg(a, 3, b)
         },
         XK = function(a, b) {
             return zg(a, 4, b)
         },
         YK = function(a, b) {
             return zg(a, 5, b)
         },
         ZK = function(a, b) {
             return zg(a, 9, b)
         },
         $K = function(a, b) {
             return fg(a, 10, b)
         },
         aL = function(a, b) {
             return ug(a, 11, b)
         },
         bL = function(a, b) {
             return zg(a, 1, b)
         },
         cL = function(a, b) {
             return ug(a, 7, b)
         };
     var dL = "platform platformVersion architecture model uaFullVersion bitness fullVersionList wow64".split(" ");

     function eL(a) {
         var b;
         return (b = a.google_tag_data) != null ? b : a.google_tag_data = {}
     }

     function fL(a) {
         var b, c;
         return typeof((b = a.navigator) == null ? void 0 : (c = b.userAgentData) == null ? void 0 : c.getHighEntropyValues) === "function"
     }

     function gL() {
         var a = window;
         if (!fL(a)) return null;
         var b = eL(a);
         if (b.uach_promise) return b.uach_promise;
         a = a.navigator.userAgentData.getHighEntropyValues(dL).then(function(c) {
             b.uach != null || (b.uach = c);
             return c
         });
         return b.uach_promise = a
     }

     function hL(a) {
         var b;
         return aL($K(YK(VK(bL(XK(cL(ZK(WK(new UK, a.architecture || ""), a.bitness || ""), a.mobile || !1), a.model || ""), a.platform || ""), a.platformVersion || ""), a.uaFullVersion || ""), ((b = a.fullVersionList) == null ? void 0 : b.map(function(c) {
             var d = new TK;
             d = zg(d, 1, c.brand);
             return zg(d, 2, c.version)
         })) || []), a.wow64 || !1)
     }

     function iL() {
         var a, b;
         return (b = (a = gL()) == null ? void 0 : a.then(function(c) {
             return hL(c)
         })) != null ? b : null
     };
     var kL = function() {
             this.appName = null;
             this.sa = new KK;
             this.secureSignals = null;
             jK();
             this.deviceId = "";
             this.Nb = null;
             this.fd = this.ie = !1;
             this.Ud = 0;
             this.gd = !1;
             this.yd = null;
             this.preferredLinearOrientation = 0;
             lj();
             this.g = this.Rb = this.referrer = null;
             this.cg = this.Md = this.za = !1;
             new ll;
             new hl;
             jL(this)
         },
         lL = function() {
             var a = kL.getInstance(),
                 b = "h.3.728.0";
             S.xb() && (b += "/vpaid_adapter");
             a.fd && (b += "/ima_cast");
             a.gd && (b += "/ima_tv_web");
             return b
         },
         jL = function(a) {
             var b = iL();
             b && b.then(function(c) {
                 if (c == null) c = null;
                 else {
                     c = c.ba();
                     for (var d = [], e = 0, f = 0; f < c.length; f++) {
                         var g = c.charCodeAt(f);
                         g > 255 && (d[e++] = g & 255, g >>= 8);
                         d[e++] = g
                     }
                     c = cd(d, 3)
                 }
                 a.g = c
             })
         };
     kL.getInstance = function() {
         return K(kL)
     };
     var nL = function(a) {
             var b = {
                 Ud: 0,
                 ie: !1,
                 fd: !1,
                 gd: !1,
                 yd: null
             };
             a = a === void 0 ? !1 : a;
             var c = BK(S);
             if (c && xK(c, "forceCustomPlayback") || S.xb()) return !0;
             if (VF() && a) return !1;
             a = a && (VF() || Pc && UF(SF, 10)) && S.getDisableCustomPlaybackForIOS10Plus();
             return (Mc || Oc) && !a || Lc && (!Lc || !UF(TF, 4)) || mL(b) ? !0 : !1
         },
         oL = function(a) {
             var b = {
                 Ud: 0,
                 ie: !1,
                 fd: !1,
                 gd: !1,
                 yd: null
             };
             return a === null ? !1 : S.xb() ? !0 : Pc || VF() ? WF(a) ? VF() || Pc && UF(SF, 10) && S.getDisableCustomPlaybackForIOS10Plus() ? !1 : !0 : !0 : Lc && (!Lc || !UF(TF, 4)) || mL(b) ? !0 : !1
         },
         pL = function() {
             var a =
                 BK(S);
             return a && xK(a, "disableOnScreenDetection") ? !1 : !(navigator && Zr(navigator)) && !Yr()
         },
         mL = function(a) {
             return qL(a) === 1 || qL(a) === 2
         },
         qL = function(a) {
             var b = a.Ud;
             var c = a.ie;
             var d = a.fd;
             var e = a.gd;
             a = a.yd;
             switch (b) {
                 case 1:
                     return 3;
                 case 2:
                     return 1
             }
             b = x.navigator || null;
             return c || d || e || b && Zr(b) || a === "tvos" || a === "kepler" ? 1 : $r() ? 2 : 0
         };
     var rL = function(a, b) {
         return a.indexOf(b) == 0 ? a.substr(b.length) : null
     };

     function sL() {
         if (Yr()) return window.location.href;
         var a = rq(),
             b = a.j,
             c = a.g;
         a = a.l;
         var d = null;
         if (a) try {
             var e = iF(a.url),
                 f = e.j,
                 g = rL(f, "/v/");
             g || (g = rL(f, "/a/"));
             if (!g) throw Error("Can not extract standalone amp url.");
             var h = rL("/" + g, "/s/"),
                 k = XE(e.l);
             k.remove("amp_js_v");
             k.remove("amp_lite");
             var l = h ? iF("https://" + h) : iF("http://" + g);
             WE(l, k);
             d = l.toString()
         } catch (n) {
             d = null
         }
         return d ? d : b && b.url ? b.url : c && c.url ? c.url : ""
     }

     function tL() {
         var a = oq();
         a = w(a);
         for (var b = a.next(); !b.done; b = a.next())
             if (b = b.value, b.url && b.url.includes("amp=1")) return !0;
         return window.context != null ? (a = Number(window.context.ampcontextVersion), isNaN(a) ? !1 : Math.floor(a) > 0) : rq().l != null
     }

     function uL() {
         var a = Oj().location.ancestorOrigins;
         return a ? a.length > 0 ? [].concat(ua(a)).join(",") : "" : ""
     };

     function vL(a, b) {
         gF(a, "url", "");
         try {
             var c = 2083 - a.toString().length - 1;
             if (c <= 0) return a.toString();
             for (var d = b.slice(0, c), e = encodeURIComponent(d), f = c; f > 0 && e.length > c;) d = b.slice(0, f--), e = encodeURIComponent(d);
             gF(a, "url", d)
         } catch (g) {}
         return a.toString()
     };
     var T = {},
         wL = (T.creativeView = "creativeview", T.start = "start", T.midpoint = "midpoint", T.firstQuartile = "firstquartile", T.thirdQuartile = "thirdquartile", T.complete = "complete", T.mute = "mute", T.unmute = "unmute", T.pause = "pause", T.rewind = "rewind", T.resume = "resume", T.fullscreen = "fullscreen", T.exitFullscreen = "exitfullscreen", T.expand = "expand", T.collapse = "collapse", T.close = "close", T.acceptInvitation = "acceptinvitation", T.adCanPlay = "adCanPlay", T.adStarted = "adStarted", T.abandon = "abandon", T.acceptInvitationLinear = "acceptinvitationlinear",
             T.engagedView = "engagedview", T.instreamAdComplete = "instreamAdComplete", T.skipShown = "skipshown", T.skippableStateChanged = "skippableStateChanged", T.skip = "skip", T.progress = "progress", T.publisher_invoked_skip = "PUBLISHER_INVOKED_SKIP", T.annotation_start = "annotation_start", T.annotation_click = "annotation_click", T.annotation_close = "annotation_close", T.cta_annotation_shown = "cta_annotation_shown", T.cta_annotation_clicked = "cta_annotation_clicked", T.cta_annotation_closed = "cta_annotation_closed", T.replay = "replay",
             T.stop = "stop", T.autoplayDisallowed = "autoplayDisallowed", T.error = "error", T.mediaLoadTimeout = "mediaLoadTimeout", T.linearChanged = "linearChanged", T.click = "click", T.contentPauseRequested = "contentPauseRequested", T.contentResumeRequested = "contentResumeRequested", T.discardAdBreak = "discardAdBreak", T.updateAdsRenderingSettings = "updateAdsRenderingSettings", T.durationChange = "durationChange", T.expandedChanged = "expandedChanged", T.autoClose = "autoClose", T.userClose = "userClose", T.userRecall = "userRecall", T.prefetched =
             "prefetched", T.loaded = "loaded", T.init = "init", T.allAdsCompleted = "allAdsCompleted", T.adMetadata = "adMetadata", T.adBreakReady = "adBreakReady", T.adBreakFetchError = "adBreakFetchError", T.log = "log", T.volumeChange = "volumeChange", T.companionBackfill = "companionBackfill", T.companionInitialized = "companionInitialized", T.companionImpression = "companionImpression", T.companionClick = "companionClick", T.impression = "impression", T.interaction = "interaction", T.adProgress = "adProgress", T.adBuffering = "adBuffering", T.trackingUrlPinged =
             "trackingUrlPinged", T.measurable_impression = "measurable_impression", T.custom_metric_viewable = "custom_metric_viewable", T.viewable_impression = "viewable_impression", T.fully_viewable_audible_half_duration_impression = "fully_viewable_audible_half_duration_impression", T.audio_audible = "audio_audible", T.audio_measurable = "audio_measurable", T.overlay_resize = "overlay_resize", T.overlay_unmeasurable_impression = "overlay_unmeasurable_impression", T.overlay_unviewable_impression = "overlay_unviewable_impression", T.overlay_viewable_immediate_impression =
             "overlay_viewable_immediate_impression", T.overlay_viewable_end_of_session_impression = "overlay_viewable_end_of_session_impression", T.externalActivityEvent = "externalActivityEvent", T.adEvent = "adEvent", T.configure = "configure", T.remainingTime = "remainingTime", T.destroy = "destroy", T.resize = "resize", T.volume = "volume", T.authorIconClicked = "videoAuthorIconClicked", T.authorNameClicked = "videoAuthorClicked", T.videoClicked = "videoClicked", T.videoIconClicked = "videoIconClicked", T.learnMoreClicked = "videoLearnMoreClicked",
             T.muteClicked = "videoMuteClicked", T.titleClicked = "videoTitleClicked", T.videoSkipClicked = "SKIPPED", T.unmuteClicked = "videoUnmuteClicked", T.vpaidEvent = "vpaidEvent", T.show_ad = "show_ad", T.video_card_endcap_collapse = "video_card_endcap_collapse", T.video_card_endcap_dismiss = "video_card_endcap_dismiss", T.video_card_endcap_impression = "video_card_endcap_impression", T.mediaUrlPinged = "mediaUrlPinged", T.breakStart = "breakstart", T.breakEnd = "breakend", T.omidReady = "omidReady", T.omidUnavailable = "omidUnavailable", T.omidAdSessionCompleted =
             "omidAdSessionCompleted", T.omidAdSessionAbandoned = "omidAdSessionAbandoned", T.verificationNotExecuted = "verificationNotExecuted", T.loadStart = "loadStart", T.seeked = "seeked", T.seeking = "seeking", T);
     var xL = new function() {
         this.l = 0;
         this.g = new Map;
         this.j = typeof window !== "undefined" && window.fetch != null
     };

     function yL(a) {
         var b = b === void 0 ? xL : b;
         var c = c === void 0 ? null : c;
         a = new hG(a, c ? c : c);
         var d = d === void 0 ? !1 : d;
         var e = e === void 0 ? !1 : e;
         a.g != null || e ? IG(b, a.url, d, e, a.g) : IG(b, a.url, d)
     };
     var U = function() {
         this.l = Math.random() < .01;
         this.j = Math.floor(Math.random() * 4503599627370496);
         this.g = null
     };
     U.prototype.report = function(a, b, c) {
         b = b === void 0 ? {} : b;
         if (x.G_testRunner == null && (this.l || (c === void 0 ? 0 : c))) {
             b.lid = a;
             lL() && (b.sdkv = lL());
             this.g && (b.palv = this.g);
             a = Yn().sort().join(",");
             Db(Vi(a)) || (b.e = a);
             b = zL(this, b);
             var d = new TE("https://pagead2.googlesyndication.com/pagead/gen_204");
             rj(b, function(e, f) {
                 e != null && gF(d, f, e == null ? "" : typeof e === "boolean" ? e ? "t" : "f" : "" + e)
             }, this);
             b = d.toString();
             a = hF(d, "url");
             a != null && Yb() && b.length > 2083 && (b = vL(d, a));
             yL(b)
         }
     };
     var zL = function(a, b) {
         b.id = "ima_html5";
         var c = Oj();
         var d = document;
         c = new TE(c.parent === c ? c.location.href : d.referrer);
         b.c = a.j;
         b.domain = c.g;
         return b
     };
     U.getInstance = function() {
         return K(U)
     };

     function AL(a) {
         var b = Date.now(),
             c = {};
         a = (c["x-afma-token-requester-type"] = a, c);
         c = "https://pubads.g.doubleclick.net/adsid/integrator.json?aos=" + encodeURIComponent(uL());
         return (new BG).get({
             url: c,
             withCredentials: !0,
             timeout: new fG,
             headers: a
         }).then(function(d) {
             var e = Date.now();
             d = d.newToken || "";
             var f = {};
             U.getInstance().report(182, (f.t = e - b, f.aos = uL(), f));
             return new BL(d)
         }).catch(function(d) {
             var e = "not instanceof Error";
             d instanceof Error && (e = iG(Number(d.message)));
             d = Date.now();
             var f = {};
             U.getInstance().report(182,
                 (f.except = e, f.t = d - b, f));
             return Promise.resolve(CL)
         })
     }
     var DL = function() {
         R.call(this);
         this.g = null;
         this.o = new lG(this);
         Hs(this, this.o);
         this.j = new Px(72E5);
         this.l = Promise.resolve(CL)
     };
     r(DL, R);
     var EL = function(a) {
         var b = "requester_type_8";
         b = b === void 0 ? "requester_type_9" : b;
         var c = function(d) {
             a.g = d;
             return a.g
         };
         a.l = AL(b).then(c);
         a.j = new Px(72E5);
         a.o.listen(a.j, "tick", function() {
             a.l = AL(b).then(c)
         });
         a.j.start();
         Gs(a, function() {
             a.j.stop()
         })
     };
     DL.prototype.getId = function() {
         var a = this;
         return Oa(function(b) {
             if (b.g == 1) return a.g != null && a.g !== CL ? (b.g = 2, b = void 0) : b = Da(b, a.l, 3), b;
             b.g != 2 && (a.g = b.j);
             return b.return(a.g)
         })
     };
     var BL = function(a) {
             this.id = a
         },
         CL = new BL("");
     var FL = function(a, b, c, d, e) {
             this.name = a;
             this.type = b;
             this.data = c;
             this.id = d;
             this.g = e
         },
         GL = function(a) {
             R.call(this);
             this.o = [];
             this.j = !1;
             this.l = a || "goog_" + Wi++
         };
     r(GL, R);
     GL.prototype.connect = function() {
         for (this.j = !0; this.o.length !== 0;) {
             var a = this.o.shift();
             a && this.sendMessage(a)
         }
     };
     var HL = function(a, b, c, d, e, f) {
         a.j ? a.sendMessage(new FL(b, c, d, e, f)) : a.o.push(new FL(b, c, d, e, f))
     };
     GL.prototype.sendMessage = function() {};
     var IL = function(a, b, c, d, e, f) {
         e = e === void 0 ? "" : e;
         f = f === void 0 ? "" : f;
         Ow.call(this, a);
         this.messageType = b;
         this.qa = c;
         this.Qc = d;
         this.origin = e;
         this.id = f
     };
     r(IL, Ow);
     IL.prototype.getId = function() {
         return this.id
     };
     IL.prototype.toString = function() {
         return ""
     };
     var JL = {
             IMAGE: "Image",
             FLASH: "Flash",
             ALL: "All"
         },
         KL = {
             HTML: "Html",
             IFRAME: "IFrame",
             STATIC: "Static",
             ALL: "All"
         },
         LL = {
             IGNORE: "IgnoreSize",
             SELECT_EXACT_MATCH: "SelectExactMatch",
             SELECT_NEAR_MATCH: "SelectNearMatch",
             SELECT_FLUID: "SelectFluid"
         },
         ML = {
             Si: "DisallowResize",
             Rj: "ResizeSmaller"
         },
         NL = function() {
             this.allowCustom = !0;
             this.creativeType = this.resourceType = "All";
             this.sizeCriteria = "SelectExactMatch";
             this.nearMatchPercent = 90;
             this.adSlotIds = [];
             this.Fd = "DisallowResize"
         };
     z("module$exports$google3$javascript$ads$interactivemedia$sdk$clientside$api$companion_ad_selection_settings.CompanionAdSelectionSettings.CreativeType", JL);
     z("module$exports$google3$javascript$ads$interactivemedia$sdk$clientside$api$companion_ad_selection_settings.CompanionAdSelectionSettings.ResourceType", KL);
     z("module$exports$google3$javascript$ads$interactivemedia$sdk$clientside$api$companion_ad_selection_settings.CompanionAdSelectionSettings.SizeCriteria", LL);
     var PL = function(a, b) {
             b = b === void 0 ? new NL : b;
             this.g = a;
             this.settings = b ? b : new NL;
             this.resourceType = OL(KL, this.settings.resourceType) ? this.settings.resourceType : "All";
             this.creativeType = OL(JL, this.settings.creativeType) ? this.settings.creativeType : "All";
             this.sizeCriteria = OL(LL, this.settings.sizeCriteria) ? this.settings.sizeCriteria : "SelectExactMatch";
             this.Fd = OL(ML, this.settings.Fd) ? this.settings.Fd : "DisallowResize";
             this.adSlotIds = this.settings.adSlotIds != null ? this.settings.adSlotIds : [];
             this.nearMatchPercent =
                 typeof this.settings.nearMatchPercent === "number" && this.settings.nearMatchPercent > 0 && this.settings.nearMatchPercent <= 100 ? this.settings.nearMatchPercent : 90
         },
         SL = function(a, b) {
             var c = [];
             b.forEach(function(d) {
                 a.settings.allowCustom && (!Db(d.getContent()) && (isNaN(d.data.sequenceNumber) || isNaN(d.data.mainAdSequenceNumber) || d.data.mainAdSequenceNumber === d.data.sequenceNumber) && QL(a, d) ? c.push(d) : (d = RL(a, d), d != null && !Db(d.getContent()) && c.push(d)))
             });
             return c
         };
     PL.prototype.tf = function() {
         return this.resourceType
     };
     var QL = function(a, b) {
             var c;
             if (c = b.getContentType() !== "Flash") {
                 if (c = a.resourceType === "All" || a.resourceType === b.tf()) c = b.getContentType(), c = c == null ? !0 : a.creativeType === "All" || a.creativeType === c;
                 c && (c = b.getAdSlotId(), c = a.adSlotIds.length === 0 ? !0 : c != null ? a.adSlotIds.includes(c) : !1)
             }
             if (c)
                 if (c = b.getSize(), (b = !!b.data.fluidSize) || a.g.rf) a = b && a.g.rf;
                 else if ((b = a.sizeCriteria === "IgnoreSize") || (b = a.g.size, b = b == c ? !0 : b && c ? b.width == c.width && b.height == c.height : !1), b) a = !0;
             else {
                 if (b = a.sizeCriteria === "SelectNearMatch") a.Fd ===
                     "ResizeSmaller" ? (c.width <= a.g.size.width && c.height <= a.g.size.height || (b = a.g.size, b = Math.min(b.width / c.width, b.height / c.height), c = new qj(b * c.width, b * c.height)), b = c.width, c = c.height) : (b = c.width, c = c.height), b = b > a.g.size.width || c > a.g.size.height || b < a.nearMatchPercent / 100 * a.g.size.width || c < a.nearMatchPercent / 100 * a.g.size.height ? !1 : !0;
                 a = b
             } else a = !1;
             return a
         },
         RL = function(a, b) {
             b = TL(b);
             return b == null ? null : b.find(function(c) {
                 return QL(a, c)
             }) || null
         },
         OL = function(a, b) {
             return b != null && zj(a, b)
         };
     var UL = function(a, b) {
         Q.call(this);
         this.g = a;
         this.timeoutMs = b;
         Hs(this, this.g)
     };
     r(UL, Q);
     var WL = function(a) {
             if (!pE(a.g.caller)) return Promise.resolve(null);
             var b = new EG,
                 c = null;
             a.g.addEventListener(function(e) {
                 if (e.pingData.internalErrorState === 1) b.resolve(null);
                 else if (e.eventName === "listenerRegistered") c = e.listenerId, e.pingData.applicableSections.length === 1 && e.pingData.applicableSections[0] === -1 && b.resolve(new VL("", "-1"));
                 else if (e.eventName === "signalStatus" && e.data === "ready") {
                     e = e.pingData;
                     var f, g = ((f = e.applicableSections) != null ? f : []).join("_");
                     b.resolve(new VL(e.gppString, g))
                 }
             });
             var d =
                 new Promise(function(e) {
                     setTimeout(function() {
                         e(null)
                     }, a.timeoutMs)
                 });
             d = Promise.race([b.promise, d]);
             d.then(function() {
                 c !== null && a.g.removeEventListener(c)
             });
             return d
         },
         VL = function(a, b) {
             this.gppString = a;
             this.sid = b
         };

     function XL() {
         var a = a === void 0 ? x : a;
         return jj(a.top, "googlefcLoaded")
     };
     var YL = function(a) {
         Q.call(this);
         this.j = new yE(a, {
             timeoutMs: 500
         });
         this.l = new vE(a, {
             timeoutMs: 500
         });
         a = new OE(a, {
             timeoutMs: 500
         });
         this.g = new UL(a, 500);
         Hs(this, this.g)
     };
     r(YL, Q);
     var ZL = function(a) {
         var b, c, d, e, f, g, h, k, l, n, p, q, v, u, t, y, D, ca, X, fa, Ba, sa, ab, La, V;
         return Oa(function(da) {
             if (da.g == 1) return b = Promise.resolve(null), AE(a.j) && (b = new Promise(function(Ma) {
                 DE(a.j, Ma)
             })), c = Promise.resolve(null), pE(a.l.caller) && (c = new Promise(function(Ma) {
                 wE(a.l, Ma)
             })), d = Promise.resolve(null), d = WL(a.g), e = w, Da(da, Promise.all([c, b, d]), 2);
             f = e(da.j);
             g = f.next().value;
             h = f.next().value;
             k = f.next().value;
             l = g;
             n = h;
             p = k;
             q = XL();
             V = {};
             return da.return((V.gfcLoaded = q, V.addtlConsent = (X = (v = n) == null ? void 0 : v.addtlConsent) !=
                 null ? X : null, V.gdprApplies = (fa = (u = n) == null ? void 0 : u.gdprApplies) != null ? fa : null, V.tcString = (Ba = (t = n) == null ? void 0 : t.tcString) != null ? Ba : null, V.uspString = (sa = (y = l) == null ? void 0 : y.uspString) != null ? sa : null, V.gppString = (ab = (D = p) == null ? void 0 : D.gppString) != null ? ab : null, V.gppSid = (La = (ca = p) == null ? void 0 : ca.sid) != null ? La : null, V))
         })
     };

     function $L(a, b) {
         if (a.length === 0) return null;
         var c = b.ha.g,
             d, e, f = (e = (d = b.Fa) == null ? void 0 : d.g) != null ? e : null;
         a = a.filter(function(g) {
             return g.tagName === "VIDEO" && !g.isEqualNode(c) && !g.isEqualNode(f)
         });
         return a.length > 0 ? a[0] : null
     };
     var aM = function(a, b) {
         this.message = a;
         this.errorCode = b
     };
     aM.prototype.getErrorCode = function() {
         return this.errorCode
     };
     aM.prototype.getMessage = function() {
         return this.message
     };
     var bM = new aM("Failed to initialize ad playback element before starting ad playback.", 400),
         cM = new aM("The provided {0} information: {1} is invalid.", 1101);

     function dM(a, b) {
         var c = b === void 0 ? null : b;
         var d = Ra.apply(2, arguments);
         if (!(c instanceof sK)) {
             var e = a.getErrorCode(),
                 f = a.getMessage();
             if (d.length > 0)
                 for (var g = 0; g < d.length; g++) f = f.replace(new RegExp("\\{" + g + "\\}", "ig"), d[g]);
             d = new sK("adPlayError", f, e);
             d.g = c;
             c = d
         }
         return c
     };

     function eM(a, b, c) {
         b = b === void 0 ? window : b;
         c = c === void 0 ? function() {} : c;
         try {
             return b.localStorage.getItem(a)
         } catch (d) {
             return c(d), null
         }
     }

     function fM(a, b, c) {
         var d = window;
         d = d === void 0 ? window : d;
         c = c === void 0 ? function() {} : c;
         return kg(b, 5) ? eM(a, d, c) : null
     }

     function gM(a, b, c, d) {
         c = c === void 0 ? window : c;
         d = d === void 0 ? function() {} : d;
         try {
             return c.localStorage.setItem(a, b), !0
         } catch (e) {
             d(e)
         }
         return !1
     }

     function hM(a, b, c, d) {
         var e = window;
         e = e === void 0 ? window : e;
         d = d === void 0 ? function() {} : d;
         return kg(c, 5) ? gM(a, b, e, d) : !1
     }

     function iM(a, b, c) {
         b = b === void 0 ? window : b;
         c = c === void 0 ? function() {} : c;
         try {
             b.localStorage.removeItem(a)
         } catch (d) {
             c(d)
         }
     }

     function jM(a, b, c, d) {
         c = c === void 0 ? window : c;
         d = d === void 0 ? function() {} : d;
         kg(b, 5) && iM(a, c, d)
     }

     function kM(a, b) {
         a = a === void 0 ? window : a;
         try {
             return a.localStorage.length
         } catch (c) {
             (b === void 0 ? function() {} : b)(c)
         }
         return null
     }

     function lM(a) {
         var b = b === void 0 ? window : b;
         var c = c === void 0 ? function() {} : c;
         return kg(a, 5) ? kM(b, c) : null
     }

     function mM(a, b, c) {
         b = b === void 0 ? window : b;
         c = c === void 0 ? function() {} : c;
         try {
             return b.localStorage.key(a)
         } catch (d) {
             c(d)
         }
         return null
     }

     function nM(a, b) {
         var c = c === void 0 ? window : c;
         var d = d === void 0 ? function() {} : d;
         return kg(b, 5) ? mM(a, c, d) : null
     }

     function oM(a, b) {
         a = a === void 0 ? window : a;
         b = b === void 0 ? function() {} : b;
         try {
             return Object.keys(a.localStorage)
         } catch (c) {
             b(c)
         }
         return null
     }

     function pM(a) {
         var b = b === void 0 ? window : b;
         var c = c === void 0 ? function() {} : c;
         return kg(a, 5) ? oM(b, c) : null
     };

     function qM(a) {
         return cd(a, 3)
     };
     var rM = {
         Ug: [],
         Sg: 0,
         bh: [],
         Fk: !1
     };
     var sM = function() {};
     sM.getInstance = function() {
         throw Error("Must be overridden");
     };
     var tM = function() {
         this.g = 0
     };
     r(tM, sM);
     tM.Ob = void 0;
     tM.getInstance = function() {
         return tM.Ob ? tM.Ob : tM.Ob = new tM
     };

     function uM(a, b, c, d) {
         c = c === void 0 ? null : c;
         d = d === void 0 ? {} : d;
         var e = tM.getInstance();
         e.g === 0 && (e.g = Math.random() < .001 ? 2 : 1);
         e.g === 2 && (e = {}, uk(Object.assign({}, (e.c = String(a), e.pc = String(lj()), e.em = c, e.lid = b, e.eids = K(Rn).g().join(), e), d), "esp"))
     };

     function vM() {
         var a = window;
         var b = b === void 0 ? function() {} : b;
         return new Promise(function(c) {
             var d = function() {
                 c(b());
                 rk(a, "load", d)
             };
             qk(a, "load", d)
         })
     };
     var wM = function() {
             this.cache = {}
         },
         yM = function() {
             xM || (xM = new wM);
             return xM
         },
         zM = function(a) {
             var b = nm(jg(a, 3));
             if (!b) return 3;
             if (tg(a, 2) === void 0) return 4;
             a = Date.now();
             return a > b + 2592E5 ? 2 : a > b + 432E5 ? 1 : 0
         };
     wM.prototype.get = function(a, b, c) {
         function d(k) {
             uM(6, a, k == null ? void 0 : k.message);
             e = !0
         }
         if (this.cache[a]) return {
             W: this.cache[a],
             success: !0
         };
         var e = !1,
             f = "_GESPSK-" + a;
         b = c ? eM(f, window, d) : fM(f, b, d);
         if (e) return {
             W: null,
             success: !1
         };
         if (!b) return {
             W: null,
             success: !0
         };
         try {
             var g = Uy(b);
             this.cache[a] = g;
             return {
                 W: g,
                 success: !0
             }
         } catch (k) {
             var h;
             uM(5, a, (h = k) == null ? void 0 : h.message);
             return {
                 W: null,
                 success: !1
             }
         }
     };
     wM.prototype.set = function(a, b, c) {
         function d(g) {
             uM(7, e, g == null ? void 0 : g.message)
         }
         var e = tg(a, 1),
             f = "_GESPSK-" + e;
         Ty(a);
         if (c ? !gM(f, a.ba(), window, d) : !hM(f, a.ba(), b, d)) return !1;
         this.cache[e] = a;
         return !0
     };
     wM.prototype.remove = function(a, b, c) {
         function d(e) {
             uM(8, a, e == null ? void 0 : e.message)
         }
         c ? iM("_GESPSK-" + a, window, d) : jM("_GESPSK-" + a, b, window, d);
         delete this.cache[a]
     };
     var xM = null;
     var AM = function(a) {
             var b = new Map;
             a = w(a);
             for (var c = a.next(); !c.done; c = a.next()) {
                 var d = c.value;
                 c = d.o();
                 var e = void 0,
                     f = (e = b.get(c)) != null ? e : new Map;
                 d = w(d.j());
                 for (e = d.next(); !e.done; e = d.next()) {
                     e = e.value;
                     var g = e.o();
                     f.has(g) || f.set(g, []);
                     f.get(g).push(e)
                 }
                 b.set(c, f)
             }
             this.g = b
         },
         BM = function(a, b, c) {
             var d, e, f;
             return !!((d = a.g) == null ? 0 : (e = d.get(c)) == null ? 0 : (f = e.get(b)) == null ? 0 : f.some(function(g) {
                 return g.j()
             }))
         },
         CM = function(a, b) {
             a = w(a.g.values());
             for (var c = a.next(); !c.done; c = a.next()) {
                 var d = void 0;
                 if ((d = c.value.get(b)) ==
                     null ? 0 : d.some(function(e) {
                         return e.j()
                     })) return !0
             }
             return !1
         },
         EM = function(a, b) {
             return DM(a, b, function(c) {
                 return c.j()
             })
         },
         DM = function(a, b, c) {
             var d = new Set;
             a = a.g.get(b);
             if (!a) return d;
             a = w(a.entries());
             for (b = a.next(); !b.done; b = a.next()) {
                 var e = w(b.value);
                 b = e.next().value;
                 e = e.next().value;
                 e.some(function(f) {
                     return c(f)
                 }) && d.add(b)
             }
             return d
         };

     function FM(a) {
         var b = new Map;
         uM(56, "", null);
         for (var c = new AM([]), d = Array, e = d.from, f = Set, g = [], h = RegExp("^_GESPSK-(.+)$"), k = lM(a), l, n = 0; n < ((l = k) != null ? l : 0); n++) {
             var p = nM(n, a);
             p !== null && (p = (h.exec(p) || [])[1]) && g.push(p)
         }
         f = new f(g);
         g = w([]);
         for (h = g.next(); !h.done; h = g.next())
             for (h = w(EM(c, h.value)), k = h.next(); !k.done; k = h.next()) f.add(k.value);
         d = e.call(d, f);
         d = w(d);
         f = d.next();
         for (e = {}; !f.done; e = {
                 Ib: void 0
             }, f = d.next())
             if (e.Ib = f.value, f = void 0, (f = b.get(e.Ib)) == null || Ne(Hf(f, 2)) == null)
                 if (h = g = void 0, f = yM().get(e.Ib,
                         a, GM(e.Ib, (h = (g = void 0) == null ? void 0 : g.split(",")) != null ? h : [], c)).W) g = zM(f), g !== 2 && g !== 3 && (ug(f, 9, !1), (g = tg(f, 2)) && g.length > 1024 && (h = {}, uM(55, e.Ib, null, (h.sl = String(g.length), h)), g = f.ya(Py(108)), Jf(g, 2)), b.set(e.Ib, f), f = tg(f, 2), h = g = void 0, k = {}, uM(19, e.Ib, null, (k.hs = f ? "1" : "0", k.sl = String((h = (g = f) == null ? void 0 : g.length) != null ? h : -1), k)));
         a = new Xy;
         b = w(b);
         for (c = b.next(); !c.done; c = b.next()) c = w(c.value), c.next(), c = c.next().value, ig(a, 2, Ry, c);
         if (!cg(a, Ry, 2, Mf()).length) return null;
         b = {};
         uM(50, "", null, (b.ns =
             String(cg(a, Ry, 2, Mf()).length), b));
         return qM(a.j())
     }

     function GM(a, b, c) {
         return b.some(function(d) {
             return BM(c, a, d)
         })
     };
     var HM = function(a) {
         a = Error.call(this, a);
         this.message = a.message;
         "stack" in a && (this.stack = a.stack);
         Object.setPrototypeOf(this, HM.prototype);
         this.name = "InputError"
     };
     r(HM, Error);
     var IM = function(a) {
             this.reason = a
         },
         JM = function() {
             this.jb = !1
         },
         KM = function() {
             JM.apply(this, arguments);
             this.Kc = new EG
         };
     r(KM, JM);
     var LM = function(a, b) {
         a.jb || (a.jb = !0, a.xe = b, a.Kc.resolve(b))
     };
     ha.Object.defineProperties(KM.prototype, {
         promise: {
             configurable: !0,
             enumerable: !0,
             get: function() {
                 return this.Kc.promise
             }
         },
         Pf: {
             configurable: !0,
             enumerable: !0,
             get: function() {
                 return this.jb
             }
         },
         error: {
             configurable: !0,
             enumerable: !0,
             get: function() {
                 return this.fc
             }
         }
     });
     var MM = function() {
         KM.apply(this, arguments)
     };
     r(MM, KM);
     var NM = function(a, b) {
         b.then(function(c) {
             LM(a, c)
         }).catch(function(c) {
             a.ya(c)
         })
     };
     MM.prototype.ya = function(a, b) {
         this.jb || (this.jb = !0, this.xe = null, this.fc = a, b && b(this.fc), this.Kc.reject(a))
     };
     var OM = function(a) {
         this.jb = !1;
         this.g = a
     };
     r(OM, JM);
     OM.prototype.Pf = function() {
         return this.g.jb
     };
     ha.Object.defineProperties(OM.prototype, {
         error: {
             configurable: !0,
             enumerable: !0,
             get: function() {
                 return this.g.fc
             }
         }
     });
     var PM = function(a) {
         OM.call(this, a);
         this.g = a
     };
     r(PM, OM);
     ha.Object.defineProperties(PM.prototype, {
         value: {
             configurable: !0,
             enumerable: !0,
             get: function() {
                 var a;
                 return (a = this.g.xe) != null ? a : null
             }
         }
     });
     var QM = function() {
         KM.apply(this, arguments)
     };
     r(QM, KM);
     QM.prototype.notify = function() {
         LM(this, null)
     };
     var RM = function(a, b, c) {
         b.then(function() {
             a.notify()
         }).catch(function(d) {
             a.jb = !0;
             a.fc = d;
             c && c(a.fc);
             a.Kc.reject(d)
         })
     };
     var SM = function() {
         Q.apply(this, arguments);
         this.j = [];
         this.g = [];
         this.l = []
     };
     r(SM, Q);
     var TM = function(a, b) {
         a.g.push({
             Tc: !1,
             ae: b
         })
     };
     SM.prototype.Tc = function(a) {
         var b = this.g.find(function(c) {
             return c.ae === a
         });
         b && (b.Tc = !0)
     };
     SM.prototype.O = function() {
         this.j.length = 0;
         this.l.length = 0;
         this.g.length = 0;
         Q.prototype.O.call(this)
     };

     function UM(a, b) {
         var c, d;
         return Oa(function(e) {
             if (e.g == 1) return c = b ? a.filter(function(f) {
                 return !f.Tc
             }) : a, Da(e, Promise.all(c.map(function(f) {
                 return f.ae.promise
             })), 2);
             if (a.length === c.length) return e.return();
             d = a.filter(function(f) {
                 return f.Tc
             });
             return Da(e, Promise.race([Promise.all(d.map(function(f) {
                 return f.ae.promise
             })), new Promise(function(f) {
                 return void setTimeout(f, b)
             })]), 0)
         })
     }
     var VM = function(a, b, c) {
         Q.call(this);
         this.id = a;
         this.B = b;
         this.timeoutMs = c;
         this.l = !1;
         this.g = new SM;
         Hs(this, this.g)
     };
     r(VM, Q);
     VM.prototype.start = function() {
         var a = this,
             b, c;
         return Oa(function(d) {
             if (d.g == 1) {
                 if (a.l) return d.return();
                 a.l = !0;
                 d.l = 2;
                 return Da(d, UM(a.g.g, (b = a.G) != null ? b : a.timeoutMs), 4)
             }
             if (d.g != 2) {
                 if (!a.Ia()) {
                     for (var e = 0, f = w(a.g.l), g = f.next(); !g.done; g = f.next()) {
                         if (g.value.g.xe == null) throw Error("missing input: " + a.id + "/" + e);
                         ++e
                     }
                     e = a.f;
                     f = e.apply;
                     g = {};
                     for (var h = w(Object.entries(a.C)), k = h.next(); !k.done; k = h.next()) {
                         var l = w(k.value);
                         k = l.next().value;
                         l = l.next().value;
                         g[k] = l.value
                     }
                     e = f.call(e, a, [g].concat(ua(a.F)));
                     a.o(e)
                 }
                 return Ea(d,
                     0)
             }
             c = Fa(d);
             if (a.Ia()) return d.return();
             c instanceof HM ? a.A(c) : c instanceof Error && (a.B.Xa({
                 methodName: a.id,
                 Hb: c
             }), a.j(c));
             d.g = 0
         })
     };
     var WM = function(a, b) {
         b = b === void 0 ? new MM : b;
         a.g.j.push(b);
         return b
     };
     VM.prototype.A = function() {};
     VM.prototype.j = function(a) {
         if (this.g.j.length)
             for (var b = new HM(a.message), c = w(this.g.j), d = c.next(); !d.done; d = c.next())
                 if (d = d.value, !d.Pf) {
                     var e = b;
                     d.jb = !0;
                     d.fc = e;
                     d.Kc.reject(e)
                 } if (!(a instanceof HM)) {
             var f;
             (f = console) == null || f.error(a)
         }
     };
     var XM = function(a, b, c, d, e) {
         VM.call(this, a, c);
         this.f = b;
         this.F = e;
         a = {};
         d = w(Object.entries(d));
         for (b = d.next(); !b.done; b = d.next())
             if (c = w(b.value), b = c.next().value, c = c.next().value) TM(this.g, c), a[b] = new PM(c);
         this.C = a
     };
     r(XM, VM);
     XM.prototype.A = function(a) {
         this.j(a)
     };
     XM.prototype.reportError = function() {};
     var YM = function(a, b) {
         if (a.l) throw Error("Invalid operation: producer has already started");
         TM(a.g, b);
         return a
     };
     var ZM = function(a, b, c, d, e, f) {
         XM.call(this, a, b, c, d, f);
         this.ta = e;
         this.output = WM(this, new MM);
         this.complete = new QM
     };
     r(ZM, XM);
     ZM.prototype.o = function(a) {
         var b = this;
         a.then(function(c) {
             c instanceof IM || (LM(b.output, c), b.complete.notify())
         }, function(c) {
             b.ta ? LM(b.output, b.ta(c)) : b.output.ya(new HM("output error: " + c.message), function() {
                 b.B.Xa({
                     methodName: b.id,
                     Hb: c
                 })
             });
             b.complete.notify()
         })
     };
     ZM.prototype.j = function(a) {
         this.ta ? (LM(this.output, this.ta(a)), this.complete.notify()) : XM.prototype.j.call(this, a)
     };

     function $M(a, b) {
         a.id = b.id;
         a.ta = b.ta;
         return a
     }

     function aN(a, b, c) {
         return new ZM(a.id, a, b, c, a.ta, Ra.apply(3, arguments))
     };
     var bN = function(a, b, c, d, e, f, g) {
         XM.call(this, a, b, c, d, g);
         this.ta = f;
         this.finished = new QM;
         a = Object.keys(e);
         a = w(a);
         for (b = a.next(); !b.done; b = a.next()) this[b.value] = WM(this)
     };
     r(bN, XM);
     bN.prototype.o = function(a) {
         a = w(Object.entries(a));
         for (var b = a.next(); !b.done; b = a.next()) {
             var c = w(b.value);
             b = c.next().value;
             c = c.next().value;
             c instanceof Error && this[b].ya(c);
             c instanceof IM || LM(this[b], c)
         }
         this.finished.notify()
     };
     bN.prototype.j = function(a) {
         this.ta ? this.o(this.ta(a)) : XM.prototype.j.call(this, a)
     };

     function cN(a, b) {
         a.id = b.id;
         a.Qa = b.Qa;
         a.ta = b.ta;
         return a
     }

     function dN(a, b, c) {
         return new bN(a.id, a, b, c, a.Qa, a.ta, Ra.apply(3, arguments))
     };
     var eN = function(a) {
         Q.call(this);
         this.F = a;
         this.C = [];
         this.H = [];
         this.A = {};
         this.l = [];
         this.j = new EG;
         this.B = {}
     };
     r(eN, Q);
     var fN = function(a, b) {
         Hs(a, b);
         a.C.push(b);
         return b
     };
     eN.prototype.g = function(a, b) {
         return fN(this, dN.apply(null, [a, this.F, b].concat(ua(Ra.apply(2, arguments)))))
     };
     eN.prototype.o = function(a, b) {
         return fN(this, aN.apply(null, [a, this.F, b].concat(ua(Ra.apply(2, arguments)))))
     };
     var hN = function(a) {
             var b, c, d, e, f, g, h, k, l, n, p, q, v;
             Oa(function(u) {
                 switch (u.g) {
                     case 1:
                         if (!a.l.length) {
                             u.g = 2;
                             break
                         }
                         return Da(u, Promise.all(a.l.map(function(t) {
                             return t.j.promise
                         })), 2);
                     case 2:
                         return Da(u, gN(), 4);
                     case 4:
                         b = u.j;
                         if (!b) return a.j.resolve(a.A), u.return(a.j.promise);
                         c = w(a.C);
                         for (d = c.next(); !d.done; d = c.next()) e = d.value, e.start();
                         f = w(a.H);
                         for (g = f.next(); !g.done; g = f.next()) h = g.value, hN(h);
                         if (!a.B) {
                             u.g = 5;
                             break
                         }
                         k = Object.keys(a.B);
                         if (!k.length) {
                             u.g = 5;
                             break
                         }
                         return Da(u, Promise.all(Object.values(a.B).map(function(t) {
                                 return t.promise
                             })),
                             7);
                     case 7:
                         for (l = u.j, n = 0, p = w(k), q = p.next(); !q.done; q = p.next()) v = q.value, a.A[v] = l[n++];
                     case 5:
                         return a.j.resolve(a.A), u.return(a.j.promise)
                 }
             })
         },
         gN = function() {
             return Oa(function(a) {
                 return a.return(!0)
             })
         };
     eN.prototype.O = function() {
         Q.prototype.O.call(this);
         this.C.length = 0;
         this.H.length = 0;
         this.l.length = 0
     };
     var jN = cN(iN, {
         id: 1041,
         Qa: {}
     });

     function iN(a, b) {
         if (!a.W) return {};
         yM().set(a.W, a.sa, b) && Ne(Hf(a.W, 2)) != null && uM(27, tg(a.W, 1));
         return {}
     };
     var kN = cN(function(a) {
         var b = a.sa;
         if (a = a.ei) {
             a = w(a);
             for (var c = a.next(); !c.done; c = a.next()) {
                 c = w(c.value.j());
                 for (var d = c.next(); !d.done; d = c.next()) d = d.value, d.j() && yM().remove(d.o(), b, !0)
             }
         }
         if (kg(b, 5)) {
             if (b) {
                 var e;
                 a = (e = pM(b)) != null ? e : [];
                 e = w(a);
                 for (a = e.next(); !a.done; a = e.next()) a = a.value, a.startsWith("_GESPSK") && jM(a, b)
             }
             xM = new wM
         }
         return {}
     }, {
         id: 1094,
         Qa: {}
     });
     var lN = cN(function(a) {
         var b = a.W;
         a = function(c) {
             var d = {};
             uM(c, tg(b, 1), null, (d.tic = String(Math.round((Date.now() - nm(jg(b, 3))) / 6E4)), d))
         };
         switch (zM(b)) {
             case 0:
                 return a(24), {
                     tb: new IM("FRESH_ENTRY"),
                     Jb: new IM("FRESH_ENTRY")
                 };
             case 1:
                 return a(25), {
                     tb: new IM("STALE_ENTRY"),
                     Jb: b
                 };
             case 2:
                 return a(26), {
                     tb: b,
                     Jb: new IM("EXPIRED_ENTRY")
                 };
             case 3:
                 return uM(9, tg(b, 1)), {
                     tb: b,
                     Jb: new IM("ERROR_ENTRY")
                 };
             case 4:
                 return a(23), {
                     tb: b,
                     Jb: new IM("NEW_ENTRY")
                 };
             default:
                 return {
                     tb: new IM("DEFAULT_ENTRY"), Jb: new IM("DEFAULT_ENTRY")
                 }
         }
     }, {
         id: 1048,
         Qa: {
             tb: void 0,
             Jb: void 0
         }
     });
     var mN = cN(function(a, b, c, d) {
         if (a = yM().get(b, d, c).W) return {
             Ea: a,
             pa: new IM("CACHED_ENTRY")
         };
         a = Ty(Sy(b));
         return {
             Ea: a,
             pa: a.ya(Py(100))
         }
     }, {
         id: 1027,
         Qa: {
             Ea: void 0,
             pa: void 0
         }
     });
     var oN = cN(nN, {
         id: 1046,
         Qa: {
             Ga: void 0
         }
     });

     function nN(a) {
         return {
             Ga: a.Ea
         }
     };
     var pN = cN(function(a) {
         var b = a.df;
         a = a.W;
         return b.pa ? {
             Qe: a.ya(b.pa),
             Ea: new IM,
             signal: new IM
         } : {
             Ea: b.Ea,
             Qe: new IM,
             signal: b.signal
         }
     }, {
         id: 1479,
         Qa: {
             Ea: void 0,
             Qe: void 0,
             signal: void 0
         }
     });

     function qN(a) {
         return typeof a === "string" ? a : a instanceof Error ? a.message : null
     }
     var rN = $M(function(a, b) {
         var c, d;
         return Oa(function(e) {
             c = um();
             d = Ne(Hf(a.W, 1));
             uM(18, d);
             try {
                 return e.return(b().then(function(f) {
                     uM(29, d, null, {
                         delta: String(um() - c)
                     });
                     return {
                         Ea: zg(a.W, 2, f),
                         pa: null,
                         signal: f
                     }
                 }).catch(function(f) {
                     uM(28, d, qN(f));
                     return {
                         Ea: null,
                         pa: Py(106),
                         signal: null
                     }
                 }))
             } catch (f) {
                 return uM(1, d, qN(f)), e.return({
                     Ea: null,
                     pa: Py(107),
                     signal: null
                 })
             }
         })
     }, {
         id: 1478
     });
     var tN = cN(sN, {
         id: 1028,
         Qa: {
             Ga: void 0
         }
     });

     function sN(a) {
         var b = tg(a.W, 1);
         var c = Hf(a.W, 3);
         c != null && (typeof c === "bigint" ? Zd(c) ? c = Number(c) : (c = le(64, c), c = Zd(c) ? Number(c) : String(c)) : c = ve(c) ? typeof c === "number" ? Ge(c) : Ce(c) : void 0);
         c != null || uM(35, b);
         return {
             Ga: a.W
         }
     };
     var vN = cN(uN, {
         id: 1050,
         Qa: {
             Ga: void 0
         }
     });

     function uN(a, b) {
         var c = tg(a.W, 1);
         if (a.signal == null) return uM(41, c), a.W.ya(Py(111)), {
             Ga: a.W
         };
         if (typeof a.signal !== "string") return uM(21, c), {
             Ga: a.W.ya(Py(113))
         };
         if (a.signal.length > b) return b = {}, uM(12, c, null, (b.sl = String(a.signal.length), b)), c = a.W.ya(Py(108)), Jf(c, 2), {
             Ga: a.W
         };
         a.signal.length || uM(20, c);
         Jf(a.W, 10);
         return {
             Ga: a.W
         }
     };
     var wN = function(a, b, c) {
         this.output = new QM;
         RM(this.output, a, function(d) {
             return void c.Xa({
                 methodName: b,
                 Hb: d
             })
         })
     };
     var xN = function(a, b) {
         wN.call(this, a, 1046, b)
     };
     r(xN, wN);
     var yN = function(a, b, c, d, e) {
         eN.call(this, e, 2);
         this.G = new MM;
         var f = this.g(mN, {}, a, b, d, e),
             g = new MM;
         LM(g, d);
         this.g(jN, {
             W: f.pa,
             sa: g
         }, b);
         d = this.g(tN, {
             W: f.Ea
         });
         d = this.g(lN, {
             W: d.Ga
         }, e);
         f = this.o(rN, {
             W: d.tb
         }, c);
         f = this.g(pN, {
             df: f.output,
             W: d.tb
         });
         var h = f.signal,
             k = f.Ea;
         this.g(jN, {
             W: f.Qe,
             sa: g
         }, b);
         f = this.g(vN, {
             W: k,
             signal: h
         }, 1024);
         this.g(jN, {
             W: f.Ga,
             sa: g
         }, b);
         e = new xN(vM(), e);
         e = YM(this.g(oN, {
             Ea: d.Jb
         }), e.output);
         c = this.o(rN, {
             W: e.Ga
         }, c);
         c = this.g(pN, {
             df: c.output,
             W: e.Ga
         }).Ea;
         this.g(jN, {
             W: c,
             sa: g
         }, b);
         b = f.Ga.promise.then(function(l) {
             var n;
             return {
                 id: a,
                 collectorGeneratedData: (n = l == null ? void 0 : Ne(Hf(l, 2))) != null ? n : null
             }
         }).catch(function() {
             return {
                 id: a,
                 collectorGeneratedData: null
             }
         });
         NM(this.G, b)
     };
     r(yN, eN);
     var zN = $M(function(a, b, c, d) {
         d = d === void 0 ? rM : d;
         var e, f, g, h, k, l, n, p, q, v, u;
         return Oa(function(t) {
             f = new AM((e = a.fi) != null ? e : []);
             g = a.qb;
             h = g.id;
             k = g.networkCode;
             l = g.collectorFunction;
             p = (n = k) != null ? n : h;
             q = !!h && !!CM(f, h);
             if (!kg(a.sa, 5) && !q) return t.return(new IM("Storage consent not granted."));
             v = {};
             uM(42, p, null, (v.ea = String(Number(b)), v));
             u = new yN(p, q, l, a.sa, c, d);
             hN(u);
             return t.return(u.G.promise)
         })
     }, {
         id: 1059
     });
     var TR = cN(function(a, b, c, d) {
         d = d === void 0 ? rM : d;
         if (!b) return uM(39, "UNKNOWN_COLLECTOR_ID"), {
             pa: Sy("UNKNOWN_COLLECTOR_ID").ya(Py(110)),
             qb: new IM
         };
         if (typeof b !== "object") return uM(46, "UNKNOWN_COLLECTOR_ID"), {
             pa: Sy("UNKNOWN_COLLECTOR_ID").ya(Py(112)),
             qb: new IM
         };
         a = b.id;
         c = b.networkCode;
         a && c && (delete b.id, uM(47, a + ";" + c));
         a = c != null ? c : a;
         return typeof a !== "string" ? (b = {}, uM(37, "INVALID_COLLECTOR_ID", null, (b.ii = JSON.stringify(a), b)), {
                 pa: Sy("INVALID_COLLECTOR_ID").ya(Py(102)),
                 qb: new IM
             }) : typeof b.collectorFunction !==
             "function" ? (uM(14, a), {
                 pa: Sy(a).ya(Py(105)),
                 qb: new IM
             }) : d.bh.includes(a) ? (uM(22, a), {
                 pa: Sy(a).ya(Py(104)),
                 qb: new IM
             }) : {
                 pa: null,
                 qb: b
             }
     }, {
         id: 1057,
         Qa: {
             pa: void 0,
             qb: void 0
         }
     });
     var VR = function(a, b, c, d, e, f) {
         var g = document;
         g = g === void 0 ? document : g;
         f = f === void 0 ? rM : f;
         this.l = b;
         this.L = c;
         this.B = g;
         this.F = d;
         this.A = e;
         this.j = f;
         this.I = [];
         this.C = [];
         this.g = new UR;
         this.o = 0;
         a = w(a);
         for (b = a.next(); !b.done; b = a.next()) this.push(b.value)
     };
     VR.prototype.push = function(a) {
         this.L || this.F();
         var b = new eN(this.g, 3);
         a = b.g(TR, {}, a, this.g, this.j);
         var c = a.qb;
         b.g(jN, {
             W: a.pa,
             sa: this.l
         }, void 0);
         a = b.o(zN, {
             qb: c,
             sa: this.l,
             fi: void 0
         }, this.L, this.g, this.j).output.promise;
         hN(b);
         this.I.push(a);
         b = w(this.C);
         for (c = b.next(); !c.done; c = b.next()) a.then(c.value)
     };
     VR.prototype.addOnSignalResolveCallback = function(a) {
         this.C.push(a);
         for (var b = w(this.I), c = b.next(); !c.done; c = b.next()) c.value.then(a)
     };
     var WR = function(a, b) {
         a.g.g.push(b)
     };
     VR.prototype.clearAllCache = function() {
         var a = this,
             b = this.B.currentScript instanceof HTMLScriptElement ? this.B.currentScript.src : "";
         if (this.o === 1) {
             var c = {};
             uM(49, "", null, (c.url = b, c))
         } else if (this.j.Ug.includes(String(fp(b != null ? b : "")))) c = {}, uM(48, "", null, (c.url = b, c));
         else {
             this.A && this.A();
             var d = new eN(this.g, 4);
             c = d.g(kN, {
                 sa: this.l,
                 ei: void 0
             }, this.g);
             hN(d);
             this.o = 1;
             setTimeout(function() {
                 a.o = 0
             }, this.j.Sg * 1E3);
             d = {};
             uM(43, "", null, (d.url = b, d));
             return c.finished.promise
         }
     };
     var UR = function() {
         this.g = []
     };
     UR.prototype.Xa = function(a) {
         this.g.forEach(function(b) {
             return void b.Xa(a)
         })
     };
     var YR = function(a) {
         this.push = function(b) {
             a.push(b)
         };
         this.addOnSignalResolveCallback = function(b) {
             a.addOnSignalResolveCallback(b)
         };
         this.addErrorHandler = function(b) {
             WR(a, {
                 Xa: function(c) {
                     return void b(c.methodName, c.Hb)
                 }
             })
         };
         this.clearAllCache = function() {
             a.clearAllCache()
         }
     };

     function ZR(a, b, c, d, e, f, g) {
         g = g === void 0 ? rM : g;
         if (!$R(a, "encryptedSignalProviders", c, f) || !$R(a, "secureSignalProviders", c, f)) {
             uM(38, "");
             var h = {
                 Xa: function(k) {
                     return void c(k.methodName, k.Hb)
                 }
             };
             aS(a, "encryptedSignalProviders", b, g, h, d, e, f);
             aS(a, "secureSignalProviders", b, g, h, function() {}, e, f)
         }
     }

     function $R(a, b, c, d) {
         if (a[b] === void 0 || a[b] instanceof Array) return !1;
         a = a[b];
         d && a.addOnSignalResolveCallback(d);
         a.addErrorHandler(c);
         return !0
     }

     function aS(a, b, c, d, e, f, g, h) {
         var k, l = new VR((k = a[b]) != null ? k : [], c, b === "secureSignalProviders", f, g, d);
         a[b] = new YR(l);
         h && l.addOnSignalResolveCallback(h);
         WR(l, e)
     }

     function bS(a, b, c, d, e, f) {
         var g = g === void 0 ? rM : g;
         var h = new MM;
         LM(h, b);
         ZR(a, h, c, d, e, f, g)
     }

     function cS(a, b, c, d) {
         var e = dS,
             f = eS,
             g = new Map;
         b = b.map(function(h) {
             var k = h.Wg;
             return new Promise(function(l) {
                 g.set(k, l)
             })
         });
         bS(a, c, d, e, f, function(h) {
             var k = h.collectorGeneratedData;
             h = h.id;
             var l;
             return void((l = g.get(h)) == null ? void 0 : l({
                 collectorGeneratedData: k,
                 id: h
             }))
         });
         return b
     };

     function fS() {
         var a;
         return (a = x.googletag) != null ? a : x.googletag = {
             cmd: []
         }
     };

     function gS(a, b) {
         a = RK(a);
         kg(a, 5) && bS(fS(), a, function() {}, dS, eS, b)
     }

     function hS(a, b) {
         b = RK(b);
         return kg(b, 5) && a.length !== 0 ? cS(fS(), a, b, function() {}) : null
     }

     function eS() {}

     function dS() {};

     function iS(a, b, c, d) {
         var e = new EG,
             f = "",
             g = function(k) {
                 try {
                     var l = typeof k.data === "object" ? k.data : JSON.parse(k.data);
                     f === l.paw_id && (rk(a, "message", g), l.error ? e.reject(Error(l.error)) : e.resolve(d(l)))
                 } catch (n) {}
             },
             h = jS(a);
         return h ? (qk(a, "message", g), f = c(h), e.promise) : (c = kS(a)) ? (f = String(Math.floor(dj() * 2147483647)), qk(a, "message", g), b(c, f), e.promise) : null
     }

     function lS(a) {
         return iS(a, function(b, c) {
             var d, e;
             return void((d = (e = b.getGmaQueryInfo) != null ? e : b.getGmaSig) == null ? void 0 : d.postMessage(c))
         }, function(b) {
             return b.getQueryInfo()
         }, function(b) {
             return b.signal
         })
     }

     function mS() {
         var a = window;
         return !!jS(a) || !!kS(a)
     }

     function jS(a) {
         var b;
         if (typeof((b = a.gmaSdk) == null ? void 0 : b.getQueryInfo) === "function") return a.gmaSdk
     }

     function kS(a) {
         var b, c, d, e, f, g;
         if (typeof((b = a.webkit) == null ? void 0 : (c = b.messageHandlers) == null ? void 0 : (d = c.getGmaQueryInfo) == null ? void 0 : d.postMessage) === "function" || typeof((e = a.webkit) == null ? void 0 : (f = e.messageHandlers) == null ? void 0 : (g = f.getGmaSig) == null ? void 0 : g.postMessage) === "function") return a.webkit.messageHandlers
     }
     (function(a) {
         return Ld(function(b) {
             if (!Pd(b)) return !1;
             for (var c = w(Object.entries(a)), d = c.next(); !d.done; d = c.next()) {
                 var e = w(d.value);
                 d = e.next().value;
                 e = e.next().value;
                 if (!(d in b)) {
                     if (e.Gh === !0) continue;
                     return !1
                 }
                 if (!e(b[d])) return !1
             }
             return !0
         })
     })({
         vc: Nd,
         pn: Nd,
         eid: Qd(),
         vnm: Qd(),
         js: Nd
     }, "RawGmaSdkStaticSignalObject");
     var oS = function() {
             this.timeoutMs = nS;
             this.j = lS;
             this.signal = null;
             this.g = 0
         },
         pS = function(a) {
             if (!mS() || !Pc && !VF() && !op($D)) return Promise.resolve(null);
             var b;
             return ((b = a.j(window)) != null ? b : Promise.resolve(null)).catch(function() {
                 return "0"
             })
         },
         rS = function(a) {
             var b;
             return Oa(function(c) {
                 if (c.g == 1) return b = Date.now() - a.g, !a.signal || b > 3E5 ? c = Da(c, qS(a), 3) : (c.g = 2, c = void 0), c;
                 c.g != 2 && (a.signal = c.j, a.g = Date.now());
                 return c.return(a.signal)
             })
         },
         qS = function(a) {
             return Promise.race([pS(a).then(function(b) {
                 if (b == null) return null;
                 a.signal = b.length > 1E4 ? "0" : b;
                 a.g = Date.now();
                 return a.signal
             }), Rx(a.timeoutMs, "0")])
         };

     function Tm(a, b) {
         return b instanceof RegExp ? "__REGEXP" + b.toString() : b
     }

     function sS(a, b) {
         return b && b.toString().indexOf("__REGEXP") === 0 ? (a = b.split("__REGEXP")[1].match(/\/(.*)\/(.*)?/), new RegExp(a[1], a[2] || "")) : b
     }
     var vS = function(a, b, c) {
         GL.call(this, b);
         var d = this;
         this.A = a;
         this.g = null;
         this.C = new lG(this);
         this.C.listen(Oj(), "message", function(e) {
             try {
                 a: {
                     var f = e.qc,
                         g = tS(f.data);
                     if (uS(d, g)) {
                         if (d.g === null) d.g = f.source, d.j || d.connect();
                         else if (d.g !== f.source) break a;
                         uS(d, g) && d.dispatchEvent(new IL(g.name, g.type, g.data || {}, g.sid, f.origin, g.id, g.replyToMessageId))
                     }
                 }
             }
             catch (h) {
                 throw c == null || c.Xa({
                     Hb: h
                 }), h;
             }
         })
     };
     r(vS, GL);
     var tS = function(a) {
         if (a == null || typeof a !== "string" || !a.startsWith("ima://")) return null;
         a = a.substr(6);
         try {
             return JSON.parse(a, sS)
         } catch (b) {
             return null
         }
     };
     vS.prototype.sendMessage = function(a) {
         if (this.g != null && this.g.postMessage != null) {
             var b = this.g,
                 c = b.postMessage,
                 d = {};
             d.name = a.name;
             d.type = a.type;
             a.data != null && (d.data = a.data);
             a.id && (d.id = a.id);
             a.g && (d.replyToMessageId = a.g);
             d.sid = this.l;
             d.channel = this.A;
             a = "ima://" + (new Um).ba(d);
             c.call(b, a, "*")
         }
         this.g != null && this.g.postMessage == null && U.getInstance().report(11)
     };
     vS.prototype.O = function() {
         Fs(this.C);
         this.g = null;
         GL.prototype.O.call(this)
     };
     var uS = function(a, b) {
         if (b == null) return !1;
         var c = b.channel;
         if (c == null || c !== a.A) return !1;
         b = b.sid;
         return b == null || a.l !== "*" && b !== a.l ? !1 : !0
     };
     var wS = function() {
         R.call(this);
         this.G = !1;
         this.g = null;
         this.A = this.F = this.M = !1;
         this.j = 0;
         this.o = [];
         this.C = !1;
         this.U = this.P = Infinity;
         this.l = 0;
         this.H = {};
         this.K = new lG(this);
         Hs(this, this.K)
     };
     r(wS, R);
     var yS = function(a, b) {
             b == null || a.G || (a.g = b, xS(a), a.G = !0)
         },
         AS = function(a) {
             a.g != null && a.G && (zS(a), a.G = !1, a.F = !1, a.A = !1, a.j = 0, a.o = [], a.C = !1)
         },
         xS = function(a) {
             zS(a);
             !(a.g instanceof R) && "ontouchstart" in document.documentElement && Pc ? (a.H = {
                 touchstart: function(b) {
                     a.F = !0;
                     a.j = b.touches.length;
                     a.l && (window.clearTimeout(a.l), a.l = 0, a.M = !0);
                     a.C = BS(a, b.touches) || b.touches.length !== 1;
                     a.C ? (a.P = Infinity, a.U = Infinity) : (a.P = b.touches[0].clientX, a.U = b.touches[0].clientY);
                     b = b.touches;
                     a.o = [];
                     for (var c = 0; c < b.length; c++) a.o.push(b[c].identifier)
                 },
                 touchmove: function(b) {
                     a.j = b.touches.length;
                     if (!Pc || !UF(SF, 8) || Math.pow(b.changedTouches[0].clientX - a.P, 2) + Math.pow(b.changedTouches[0].clientY - a.U, 2) > 25) a.A = !0
                 },
                 touchend: function(b) {
                     return void CS(a, b)
                 }
             }, rj(a.H, function(b, c) {
                 a.g.addEventListener(c, b, !1)
             })) : a.K.listen(a.g, "click", a.V)
         },
         zS = function(a) {
             a.K.ab(a.g, "click", a.V);
             rj(a.H, function(b, c) {
                 this.g.removeEventListener(c, b, !1)
             }, a);
             a.H = {}
         },
         CS = function(a, b) {
             !a.F || a.j !== 1 || a.A || a.M || a.C || !BS(a, b.changedTouches) || (a.l = window.setTimeout(function() {
                     return void DS(a)
                 },
                 300));
             a.j = b.touches.length;
             a.j === 0 && (a.F = !1, a.A = !1, a.o = []);
             a.M = !1
         };
     wS.prototype.V = function() {
         DS(this)
     };
     var BS = function(a, b) {
             for (var c = 0; c < b.length; c++)
                 if (a.o.includes(b[c].identifier)) return !0;
             return !1
         },
         DS = function(a) {
             a.l = 0;
             a.dispatchEvent(new Ow("click"))
         };
     wS.prototype.O = function() {
         AS(this);
         R.prototype.O.call(this)
     };
     var ES = function(a) {
             return Oa(function(b) {
                 return b.g == 1 ? Da(b, a.g.promise, 2) : b.return({
                     serializedConfig: a.serializedConfig,
                     errorMessage: a.j,
                     latencyMs: a.l
                 })
             })
         },
         IS = function() {
             var a = FS,
                 b = GS,
                 c = Date.now(),
                 d = a.o();
             d.timeout = 6E4;
             d.open("GET", b, !0);
             d.onload = function() {
                 a.l = Date.now() - c;
                 d.status < 200 || d.status >= 300 ? HS(a, Error("status: " + d.status)) : (a.j = null, a.serializedConfig = d.responseText, a.g.resolve())
             };
             d.onerror = function() {
                 a.l = Date.now() - c;
                 HS(a, Error("status: " + d.status))
             };
             d.send()
         },
         HS = function(a, b) {
             a.serializedConfig =
                 null;
             a.j = b.message;
             a.g.resolve()
         },
         JS = new function() {
             this.o = function() {
                 return new XMLHttpRequest
             };
             this.g = new EG;
             this.j = this.serializedConfig = null;
             this.l = 0
         };

     function KS() {
         var a = LS;
         var b = a.appName;
         var c = a.yd;
         a = a.pageUrl;
         var d = new URL("https://securepubads.g.doubleclick.net/pagead/ima_ppub_config");
         if (b && c) {
             switch (c) {
                 case "android":
                     d.searchParams.set("msid", b);
                     break;
                 case "ios":
                 case "tvos":
                 case "kepler":
                     d.searchParams.set("an", b)
             }
             return d.toString()
         }
         return a ? (d.searchParams.set("ippd", a), d.toString()) : null
     };
     var MS = [0, Kh, ci];
     var NS = function(a) {
         this.D = C(a)
     };
     r(NS, I);
     var OS = Ph([0, Kh, ci, Kh, MS]);

     function PS(a, b, c, d) {
         var e, f, g;
         a = ((g = (e = E(a, Xh, 2)) == null ? void 0 : (f = cg(e, Wh, 1, Mf())) == null ? void 0 : f.map(function(h) {
             return pg(h, 1)
         })) != null ? g : []).some(function(h) {
             return h === b
         });
         U.getInstance().report(190, {
             fm: a,
             fl: c,
             nc: b,
             t: d,
             b: "csWeb"
         })
     }

     function QS(a, b) {
         if (!b) return U.getInstance().report(196, {
             status: !1,
             optOutReason: "noNetworkCode",
             network: b
         }), !1;
         if (!a) return !1;
         var c, d;
         a = (c = E(a, Vh, 3)) == null ? void 0 : (d = Tf(c, 1, void 0, Qe)) == null ? void 0 : d.get(b);
         U.getInstance().report(196, {
             status: a,
             optOutReason: a ? null : a === void 0 ? "codeNotFound" : "optedOutInFe",
             network: b
         });
         return a != null ? a : !1
     }

     function RS(a, b) {
         if (!a || !b) return !1;
         var c;
         return !((c = E(a, Uh, 5)) == null || !cg(c, Th, 1, Mf()).find(function(d) {
             return (d == null ? void 0 : pg(d, 1)) === b && (d == null ? void 0 : kg(d, 2))
         }))
     }

     function SS(a) {
         if (!a) return null;
         var b = new NS;
         a = cg(a, ai, 6, Mf());
         a = w(a);
         for (var c = a.next(); !c.done; c = a.next()) {
             var d = void 0;
             if (c = (d = E(c.value, $h, 4)) == null ? void 0 : E(d, Zh, 2)) {
                 d = new $h;
                 var e = new Zh;
                 c = ng(c, 1);
                 c = Jf(e, 1, He(c));
                 d = F(d, 2, c);
                 ig(b, 1, $h, d)
             }
         }
         return cg(b, $h, 1, Mf()).length === 0 ? null : b
     };

     function TS(a, b, c) {
         var d = RK(a);
         a = PK(a) || !kg(d, 5);
         b = QS(b, c);
         return a && !b ? !1 : !0
     };
     var US = function(a, b) {
         Q.call(this);
         var c = this;
         this.g = a;
         this.j = new Map;
         this.l = function(d) {
             var e = c.j.get(d.messageType);
             if (e) {
                 var f = "goog_" + Wi++,
                     g = d.getId();
                 e(d.qa).then(function(h) {
                     HL(c.g, d.type, d.messageType, h, f, g)
                 })
             }
         };
         this.g.listen(b, this.l);
         Gs(this, function() {
             c.j.clear();
             c.g.ab(b, c.l)
         })
     };
     r(US, Q);
     var VS = {
             Jh: function(a, b) {
                 var c = a.injector_basename,
                     d = a.sodar_query_id,
                     e = a.bg_hash_basename,
                     f = a.bg_binary;
                 a = window;
                 var g = g === void 0 ? !1 : g;
                 var h = (g === void 0 ? 0 : g) ? "//ep1.adtrafficquality.google/bg/" + Si(e) + ".js" : "//pagead2.googlesyndication.com/bg/" + Si(e) + ".js";
                 e = g;
                 e = e === void 0 ? !1 : e;
                 g = a.document;
                 var k = {};
                 k._bgu_ = h;
                 k._bgp_ = f;
                 b && (k._li_ = b);
                 d && (k._sid_ = d);
                 (b = a.GoogleTyFxhY) && typeof b.push == "function" || (b = a.GoogleTyFxhY = []);
                 b.push(k);
                 b = Jj(g);
                 b = Pj(b.g, "SCRIPT");
                 b.type = "text/javascript";
                 b.async = !0;
                 c = (e === void 0 ?
                     0 : e) ? ij(Lw, Si(c) + ".js") : ij(Mw, Si(c) + ".js");
                 Ni(b, c);
                 (c = (a.GoogleTyFxhYEET || {})[b.src]) ? c(): g.getElementsByTagName("head")[0].appendChild(b)
             }
         },
         WS = function() {
             this.g = !1
         },
         XS = function(a) {
             var b;
             return Oa(function(c) {
                 switch (c.g) {
                     case 1:
                         return c.l = 2, Da(c, (new BG).get({
                             url: "//pagead2.googlesyndication.com/getconfig/sodar?tid=pal&tv=imaq_h.3.728.0",
                             withCredentials: !1,
                             timeout: new fG
                         }), 4);
                     case 4:
                         b = c.j;
                         Ea(c, 3);
                         break;
                     case 2:
                         return Fa(c), c.return(null);
                     case 3:
                         if (!(typeof b === "object" && b !== null && "injector_basename" in
                                 b && "sodar_query_id" in b && "bg_hash_basename" in b && "bg_binary" in b)) return c.return(null);
                         try {
                             VS.Jh(b, "imaq_h.3.728.0")
                         } catch (d) {
                             return c.return(null)
                         }
                         a.g = !0;
                         return c.return(b.sodar_query_id)
                 }
             })
         };
     var YS = "abort canplay canplaythrough durationchange emptied loadstart loadeddata loadedmetadata progress ratechange seeked seeking stalled suspend waiting".split(" ");

     function ZS(a, b) {
         var c = new Map;
         b = w(Object.entries(b));
         for (var d = b.next(); !d.done; d = b.next()) {
             var e = w(d.value);
             d = e.next().value;
             e = e.next().value;
             c.set(d, encodeURIComponent(JSON.stringify(e)))
         }
         a.hash = Array.from(c.entries(), function(f) {
             var g = w(f);
             f = g.next().value;
             g = g.next().value;
             return f + "=" + g
         }).join("&")
     };
     var $S = wa(["https://pagead2.googlesyndication.com/omsdk/releases/live/omweb-v1.js"]),
         aT = wa(["https://pagead2.googlesyndication.com/omsdk/releases/control/omweb-v1.js"]),
         bT = wa(["https://pagead2.googlesyndication.com/omsdk/releases/canary/omweb-v1.js"]),
         cT = wa(["https://pagead2.googlesyndication.com/omsdk/releases/experimental/omweb-v1.js"]),
         dT = ij($S),
         eT = ij(aT),
         fT = ij(bT),
         gT = ij(cT);

     function hT(a) {
         var b;
         return (b = a.omidSessionInterface) != null ? b : null
     }

     function iT(a) {
         var b, c, d, e, f, g;
         return Oa(function(h) {
             if (h.g == 1) return b = Rj("IFRAME", {
                 style: "visibility: hidden; width: 0; height: 0; position: absolute; left: 0; top: 0;",
                 title: "Advertisement"
             }), c = new Promise(function(k) {
                 b.addEventListener("load", function() {
                     k()
                 })
             }), a.appendChild(b), Da(h, c, 2);
             d = Rj("SCRIPT");
             e = jT();
             Ni(d, e);
             f = new Promise(function(k, l) {
                 d.addEventListener("load", function() {
                     var n = Uj(b);
                     n && hT(n) ? k(b) : l()
                 })
             });
             g = b.contentDocument || b.contentWindow.document;
             g.head.appendChild(d);
             return h.return(f)
         })
     }

     function jT() {
         switch (pp(ZD)) {
             case 0:
                 return dT;
             case 1:
                 return eT;
             case 2:
                 return fT;
             case 3:
                 return gT;
             default:
                 return dT
         }
     };
     var kT = function(a, b) {
         R.call(this);
         this.j = b;
         this.g = hT(a)
     };
     r(kT, R);
     var mT = function(a) {
             try {
                 a.g && a.g.registerSessionObserver(function(b) {
                     b.type === "sessionStart" ? lT(a, a.j) : b.type === "sessionFinish" && mT(a)
                 })
             } catch (b) {
                 a.dispatchEvent(new Event("error"))
             }
         },
         lT = function(a, b) {
             b instanceof AJ && (b = b.T);
             var c;
             if (((c = b.tagName) == null ? void 0 : c.toUpperCase()) !== "AUDIO") try {
                 a.g && a.g.setVideoElement(b)
             } catch (d) {
                 a.dispatchEvent(new Event("error"))
             }
         };
     kT.prototype.O = function() {
         try {
             this.g && this.g.finishAdSession()
         } catch (a) {}
         R.prototype.O.call(this)
     };
     var nT = function(a) {
         this.data = a
     };
     m = nT.prototype;
     m.getTotalAds = function() {
         return this.data.totalAds
     };
     m.getMaxDuration = function() {
         return this.data.maxDuration
     };
     m.getAdPosition = function() {
         return this.data.adPosition
     };
     m.getPodIndex = function() {
         return this.data.podIndex
     };
     m.getTimeOffset = function() {
         return this.data.timeOffset
     };
     m.getIsBumper = function() {
         return this.data.isBumper
     };
     nT.prototype.getIsBumper = nT.prototype.getIsBumper;
     nT.prototype.getTimeOffset = nT.prototype.getTimeOffset;
     nT.prototype.getPodIndex = nT.prototype.getPodIndex;
     nT.prototype.getAdPosition = nT.prototype.getAdPosition;
     nT.prototype.getMaxDuration = nT.prototype.getMaxDuration;
     nT.prototype.getTotalAds = nT.prototype.getTotalAds;
     var oT = function(a) {
         this.data = a
     };
     m = oT.prototype;
     m.getContent = function() {
         return this.data.content
     };
     m.getContentType = function() {
         return this.data.contentType
     };
     m.getWidth = function() {
         return this.getSize().width
     };
     m.getHeight = function() {
         return this.getSize().height
     };
     m.getAdSlotId = function() {
         return this.data.adSlotId
     };
     m.getSize = function() {
         var a = this.data.size;
         return new qj(a.width, a.height)
     };
     m.tf = function() {
         return this.data.resourceType
     };
     var TL = function(a) {
         return (a = a.data.backupCompanions) ? a.map(function(b) {
             return new oT(b)
         }) : []
     };
     oT.prototype.getAdSlotId = oT.prototype.getAdSlotId;
     oT.prototype.getHeight = oT.prototype.getHeight;
     oT.prototype.getWidth = oT.prototype.getWidth;
     oT.prototype.getContentType = oT.prototype.getContentType;
     oT.prototype.getContent = oT.prototype.getContent;
     var pT = function(a, b) {
         this.j = a;
         this.g = b
     };
     pT.prototype.getAdIdValue = function() {
         return this.j
     };
     pT.prototype.getAdIdRegistry = function() {
         return this.g
     };
     pT.prototype.getAdIdRegistry = pT.prototype.getAdIdRegistry;
     pT.prototype.getAdIdValue = pT.prototype.getAdIdValue;
     var W = function(a) {
         this.data = a
     };
     W.prototype.getAdId = function() {
         return this.data.adId
     };
     W.prototype.getCreativeAdId = function() {
         return this.data.creativeAdId
     };
     W.prototype.getCreativeId = function() {
         return this.data.creativeId
     };
     var qT = function(a) {
         return a.data.adQueryId
     };
     W.prototype.getAdSystem = function() {
         return this.data.adSystem
     };
     W.prototype.getAdvertiserName = function() {
         return this.data.advertiserName
     };
     W.prototype.getApiFramework = function() {
         return this.data.apiFramework
     };
     var rT = function(a) {
             var b;
             return (b = a.data.clickThroughUrl) != null ? b : null
         },
         sT = function(a) {
             var b;
             return (b = a.data.attributionParams) != null ? b : null
         };
     m = W.prototype;
     m.getWrapperAdIds = function() {
         return this.data.adWrapperIds
     };
     m.getWrapperCreativeIds = function() {
         return this.data.adWrapperCreativeIds
     };
     m.getWrapperAdSystems = function() {
         return this.data.adWrapperSystems
     };
     m.isLinear = function() {
         return this.data.linear
     };
     m.isSkippable = function() {
         return this.data.skippable
     };
     m.getContentType = function() {
         return this.data.contentType
     };
     m.getDescription = function() {
         return this.data.description
     };
     m.getTitle = function() {
         return this.data.title
     };
     m.getDuration = function() {
         return this.data.duration
     };
     m.getVastMediaWidth = function() {
         return this.data.vastMediaWidth
     };
     m.getVastMediaHeight = function() {
         return this.data.vastMediaHeight
     };
     m.getWidth = function() {
         return this.data.width
     };
     m.getHeight = function() {
         return this.data.height
     };
     m.getUiElements = function() {
         return this.data.uiElements
     };
     m.getMinSuggestedDuration = function() {
         return this.data.minSuggestedDuration
     };
     m.getAdPodInfo = function() {
         return new nT(this.data.adPodInfo)
     };
     m.getCompanionAds = function(a, b, c) {
         var d = this.data.companions;
         if (!d) return [];
         d = d.map(function(e) {
             return new oT(e)
         });
         return SL(new PL({
             size: new qj(a, b),
             rf: c ? c.sizeCriteria === "SelectFluid" : !1
         }, c), d)
     };
     m.getTraffickingParameters = function() {
         return dG(Vi(this.data.traffickingParameters))
     };
     m.getTraffickingParametersString = function() {
         return this.data.traffickingParameters
     };
     m.getVastMediaBitrate = function() {
         return this.data.vastMediaBitrate
     };
     m.getMediaUrl = function() {
         return this.data.mediaUrl
     };
     m.getSurveyUrl = function() {
         return this.data.surveyUrl
     };
     m.getDealId = function() {
         return this.data.dealId
     };
     m.getUniversalAdIds = function() {
         return (this.data.universalAdIds || []).map(function(a) {
             return new pT(a.adIdValue, a.adIdRegistry)
         })
     };
     m.getUniversalAdIdValue = function() {
         return this.data.universalAdIdValue
     };
     m.getUniversalAdIdRegistry = function() {
         return this.data.universalAdIdRegistry
     };
     m.getSkipTimeOffset = function() {
         return this.data.skipTimeOffset
     };
     m.zf = function() {
         return this.data.disableUi
     };
     W.prototype.isUiDisabled = W.prototype.zf;
     W.prototype.getSkipTimeOffset = W.prototype.getSkipTimeOffset;
     W.prototype.getUniversalAdIdRegistry = W.prototype.getUniversalAdIdRegistry;
     W.prototype.getUniversalAdIdValue = W.prototype.getUniversalAdIdValue;
     W.prototype.getUniversalAdIds = W.prototype.getUniversalAdIds;
     W.prototype.getDealId = W.prototype.getDealId;
     W.prototype.getSurveyUrl = W.prototype.getSurveyUrl;
     W.prototype.getMediaUrl = W.prototype.getMediaUrl;
     W.prototype.getVastMediaBitrate = W.prototype.getVastMediaBitrate;
     W.prototype.getTraffickingParametersString = W.prototype.getTraffickingParametersString;
     W.prototype.getTraffickingParameters = W.prototype.getTraffickingParameters;
     W.prototype.getCompanionAds = W.prototype.getCompanionAds;
     W.prototype.getAdPodInfo = W.prototype.getAdPodInfo;
     W.prototype.getMinSuggestedDuration = W.prototype.getMinSuggestedDuration;
     W.prototype.getUiElements = W.prototype.getUiElements;
     W.prototype.getHeight = W.prototype.getHeight;
     W.prototype.getWidth = W.prototype.getWidth;
     W.prototype.getVastMediaHeight = W.prototype.getVastMediaHeight;
     W.prototype.getVastMediaWidth = W.prototype.getVastMediaWidth;
     W.prototype.getDuration = W.prototype.getDuration;
     W.prototype.getTitle = W.prototype.getTitle;
     W.prototype.getDescription = W.prototype.getDescription;
     W.prototype.getContentType = W.prototype.getContentType;
     W.prototype.isSkippable = W.prototype.isSkippable;
     W.prototype.isLinear = W.prototype.isLinear;
     W.prototype.getWrapperAdSystems = W.prototype.getWrapperAdSystems;
     W.prototype.getWrapperCreativeIds = W.prototype.getWrapperCreativeIds;
     W.prototype.getWrapperAdIds = W.prototype.getWrapperAdIds;
     W.prototype.getApiFramework = W.prototype.getApiFramework;
     W.prototype.getAdvertiserName = W.prototype.getAdvertiserName;
     W.prototype.getAdSystem = W.prototype.getAdSystem;
     W.prototype.getCreativeId = W.prototype.getCreativeId;
     W.prototype.getCreativeAdId = W.prototype.getCreativeAdId;
     W.prototype.getAdId = W.prototype.getAdId;
     var tT = function(a) {
         this.g = a
     };
     tT.prototype.getCuePoints = function() {
         return this.g
     };
     tT.prototype.getCuePoints = tT.prototype.getCuePoints;
     z("module$exports$google3$javascript$ads$interactivemedia$sdk$clientside$api$ad_cue_points.AdCuePoints.PREROLL", 0);
     z("module$exports$google3$javascript$ads$interactivemedia$sdk$clientside$api$ad_cue_points.AdCuePoints.POSTROLL", -1);
     var uT = function() {
         this.autoAlign = !0;
         this.bitrate = -1;
         this.enablePreloading = this.disableUi = this.disableClickThrough = !1;
         this.loadVideoTimeout = 8E3;
         this.mimeTypes = null;
         this.playAdsAfterTime = -1;
         this.restoreCustomPlaybackStateOnAdBreakComplete = !1;
         this.uiElements = null;
         this.useStyledNonLinearAds = this.useStyledLinearAds = this.useLearnMoreButton = !1;
         this.useVideoAdUi = !0
     };
     uT.prototype.ba = function(a) {
         var b = {};
         Object.assign(b, this);
         a && (b.disableClickThrough = !0);
         return b
     };
     uT.prototype.append = function(a) {
         if (a) {
             var b = a.autoAlign;
             b != null && (this.autoAlign = b);
             b = $i(a.bitrate);
             typeof b === "number" && !isNaN(b) && b > 0 && (this.bitrate = b);
             this.disableClickThrough = a.disableClickThrough || this.disableClickThrough;
             this.disableUi = a.disableUi || this.disableUi;
             this.enablePreloading = a.enablePreloading || this.enablePreloading;
             (b = a.mimeTypes) && b.length !== 0 && (this.mimeTypes = b);
             b = $i(a.playAdsAfterTime);
             typeof b === "number" && !isNaN(b) && b > 0 && (this.playAdsAfterTime = b);
             this.restoreCustomPlaybackStateOnAdBreakComplete =
                 a.restoreCustomPlaybackStateOnAdBreakComplete || this.restoreCustomPlaybackStateOnAdBreakComplete;
             b = $i(a.loadVideoTimeout);
             typeof b === "number" && !isNaN(b) && b > 0 && (this.loadVideoTimeout = b);
             this.uiElements = a.uiElements || this.uiElements;
             this.useLearnMoreButton = a.useLearnMoreButton || this.useLearnMoreButton;
             this.useStyledLinearAds = a.useStyledLinearAds || this.useStyledLinearAds;
             this.useStyledNonLinearAds = a.useStyledNonLinearAds || this.useStyledNonLinearAds;
             this.useVideoAdUi = a.useVideoAdUi === !1 ? !1 : this.useVideoAdUi
         }
     };
     z("module$exports$google3$javascript$ads$interactivemedia$sdk$clientside$api$ads_rendering_settings.AdsRenderingSettings.AUTO_SCALE", -1);
     var Y = function() {};
     m = Y.prototype;
     m.setCompanionBackfill = function(a) {
         S.setCompanionBackfill(a)
     };
     m.getCompanionBackfill = function() {
         return S.getCompanionBackfill()
     };
     m.setNumRedirects = function(a) {
         S.setNumRedirects(a)
     };
     m.getNumRedirects = function() {
         return S.getNumRedirects()
     };
     m.setPpid = function(a) {
         S.setPpid(a)
     };
     m.getPpid = function() {
         return S.getPpid()
     };
     m.setVpaidAllowed = function(a) {
         S.setVpaidAllowed(a)
     };
     m.setVpaidMode = function(a) {
         S.setVpaidMode(a)
     };
     m.ed = function() {
         return S.ed()
     };
     m.setAutoPlayAdBreaks = function(a) {
         S.setAutoPlayAdBreaks(a)
     };
     m.Ec = function() {
         return S.Ec()
     };
     m.Le = function(a) {
         S.Le(a)
     };
     m.xb = function() {
         return S.xb()
     };
     m.setLocale = function(a) {
         S.setLocale(a)
     };
     m.getLocale = function() {
         return S.getLocale()
     };
     m.setPlayerType = function(a) {
         S.setPlayerType(a)
     };
     m.getPlayerType = function() {
         return S.getPlayerType()
     };
     m.setPlayerVersion = function(a) {
         S.setPlayerVersion(a)
     };
     m.getPlayerVersion = function() {
         return S.getPlayerVersion()
     };
     var vT = function() {
         return BK(S)
     };
     m = Y.prototype;
     m.Me = function(a) {
         S.Me(a)
     };
     m.Oe = function(a) {
         S.Oe(a)
     };
     m.setDisableCustomPlaybackForIOS10Plus = function(a) {
         S.setDisableCustomPlaybackForIOS10Plus(a)
     };
     m.getDisableCustomPlaybackForIOS10Plus = function() {
         return S.getDisableCustomPlaybackForIOS10Plus()
     };
     m.Dh = function() {
         console.warn("isCookiesEnabled always returns true. The ltd parameter in the ad tag URL determines an ad request's ability to use cookies.");
         U.getInstance().report(230, {
             method: "ImaSdkSettings.isCookiesEnabled"
         });
         return !0
     };
     m.hi = function() {
         console.warn("setCookiesEnabled is a no-op. The ltd parameter in the ad tag URL determines an ad request's ability to use cookies.");
         U.getInstance().report(230, {
             method: "ImaSdkSettings.setCookiesEnabled"
         })
     };
     m.setSessionId = function(a) {
         S.setSessionId(a)
     };
     m.ji = function() {};
     m.nh = function() {
         return !0
     };
     m.setFeatureFlags = function(a) {
         S.setFeatureFlags(a)
     };
     m.getFeatureFlags = function() {
         return S.getFeatureFlags()
     };
     m.ba = function(a) {
         return S.ba(a === void 0 ? null : a)
     };
     Y.prototype.getFeatureFlags = Y.prototype.getFeatureFlags;
     Y.prototype.setFeatureFlags = Y.prototype.setFeatureFlags;
     Y.prototype.getDisableFlashAds = Y.prototype.nh;
     Y.prototype.setDisableFlashAds = Y.prototype.ji;
     Y.prototype.setSessionId = Y.prototype.setSessionId;
     Y.prototype.setCookiesEnabled = Y.prototype.hi;
     Y.prototype.isCookiesEnabled = Y.prototype.Dh;
     Y.prototype.getDisableCustomPlaybackForIOS10Plus = Y.prototype.getDisableCustomPlaybackForIOS10Plus;
     Y.prototype.setDisableCustomPlaybackForIOS10Plus = Y.prototype.setDisableCustomPlaybackForIOS10Plus;
     Y.prototype.setStreamCorrelator = Y.prototype.Oe;
     Y.prototype.setPageCorrelator = Y.prototype.Me;
     Y.prototype.getPlayerVersion = Y.prototype.getPlayerVersion;
     Y.prototype.setPlayerVersion = Y.prototype.setPlayerVersion;
     Y.prototype.getPlayerType = Y.prototype.getPlayerType;
     Y.prototype.setPlayerType = Y.prototype.setPlayerType;
     Y.prototype.getLocale = Y.prototype.getLocale;
     Y.prototype.setLocale = Y.prototype.setLocale;
     Y.prototype.getIsVpaidAdapter = Y.prototype.xb;
     Y.prototype.setIsVpaidAdapter = Y.prototype.Le;
     Y.prototype.isAutoPlayAdBreaks = Y.prototype.Ec;
     Y.prototype.setAutoPlayAdBreaks = Y.prototype.setAutoPlayAdBreaks;
     Y.prototype.getVpaidMode = Y.prototype.ed;
     Y.prototype.setVpaidMode = Y.prototype.setVpaidMode;
     Y.prototype.setVpaidAllowed = Y.prototype.setVpaidAllowed;
     Y.prototype.getPpid = Y.prototype.getPpid;
     Y.prototype.setPpid = Y.prototype.setPpid;
     Y.prototype.getNumRedirects = Y.prototype.getNumRedirects;
     Y.prototype.setNumRedirects = Y.prototype.setNumRedirects;
     Y.prototype.getCompanionBackfill = Y.prototype.getCompanionBackfill;
     Y.prototype.setCompanionBackfill = Y.prototype.setCompanionBackfill;
     var wT = new Y;
     var xT = function(a) {
         this.g = a || {
             cookie: ""
         }
     };
     m = xT.prototype;
     m.set = function(a, b, c) {
         var d = !1;
         if (typeof c === "object") {
             var e = c.sameSite;
             d = c.secure || !1;
             var f = c.domain || void 0;
             var g = c.path || void 0;
             var h = c.maxAge
         }
         if (/[;=\s]/.test(a)) throw Error('Invalid cookie name "' + a + '"');
         if (/[;\r\n]/.test(b)) throw Error('Invalid cookie value "' + b + '"');
         h === void 0 && (h = -1);
         this.g.cookie = a + "=" + b + (f ? ";domain=" + f : "") + (g ? ";path=" + g : "") + (h < 0 ? "" : h == 0 ? ";expires=" + (new Date(1970, 1, 1)).toUTCString() : ";expires=" + (new Date(Date.now() + h * 1E3)).toUTCString()) + (d ? ";secure" : "") + (e != null ? ";samesite=" +
             e : "")
     };
     m.get = function(a, b) {
         for (var c = a + "=", d = (this.g.cookie || "").split(";"), e = 0, f; e < d.length; e++) {
             f = Eb(d[e]);
             if (f.lastIndexOf(c, 0) == 0) return f.slice(c.length);
             if (f == a) return ""
         }
         return b
     };
     m.remove = function(a, b, c) {
         var d = this.get(a) !== void 0;
         this.set(a, "", {
             maxAge: 0,
             path: b,
             domain: c
         });
         return d
     };
     m.cd = function() {
         return yT(this).keys
     };
     m.ac = function() {
         return yT(this).values
     };
     m.isEmpty = function() {
         return !this.g.cookie
     };
     m.clear = function() {
         for (var a = yT(this).keys, b = a.length - 1; b >= 0; b--) this.remove(a[b])
     };
     var yT = function(a) {
         a = (a.g.cookie || "").split(";");
         for (var b = [], c = [], d, e, f = 0; f < a.length; f++) e = Eb(a[f]), d = e.indexOf("="), d == -1 ? (b.push(""), c.push(e)) : (b.push(e.substring(0, d)), c.push(e.substring(d + 1)));
         return {
             keys: b,
             values: c
         }
     };

     function zT(a, b, c) {
         return kg(b, 5) ? AT(a, c) : null
     }
     var BT;

     function CT(a) {
         return BT ? BT : a.origin === "null" ? BT = !1 : BT = DT(a)
     }

     function DT(a) {
         if (!a.navigator.cookieEnabled) return !1;
         var b = new xT(a.document);
         if (!b.isEmpty()) return !0;
         b.set("TESTCOOKIESENABLED", "1", {
             maxAge: 60,
             sameSite: a.isSecureContext ? "none" : void 0,
             secure: a.isSecureContext || void 0
         });
         if (b.get("TESTCOOKIESENABLED") !== "1") return !1;
         b.remove("TESTCOOKIESENABLED");
         return !0
     }

     function AT(a, b) {
         b = b.origin !== "null" ? b.document.cookie : null;
         return b === null ? null : (new xT({
             cookie: b
         })).get(a) || ""
     }

     function ET(a, b, c, d) {
         d.origin !== "null" && (d.isSecureContext && (c = Object.assign({}, c, {
             sameSite: "none",
             secure: !0
         })), (new xT(d.document)).set(a, b, c))
     };
     var FT = function() {
             this.j = window;
             this.g = void 0
         },
         GT = function(a, b, c) {
             var d = c.Ce;
             c = c.De;
             return kg(b, 8) || (d || !kg(b, 5)) && c || !CT(a.j) ? !1 : !0
         },
         HT = function(a, b, c) {
             if (GT(a, b, {
                     Ce: c.Ce,
                     De: c.De
                 })) {
                 var d;
                 if ((d = a.g) == null ? 0 : d.g) {
                     var e;
                     return (e = a.g.get("__eoi", b)) == null ? void 0 : e.value
                 }
                 var f;
                 return (f = AT("__eoi", a.j)) != null ? f : void 0
             }
         };
     var IT = function() {
             this.g = window
         },
         JT = function(a, b) {
             return kg(b, 5) ? !!CT(a.g) : !1
         },
         KT = function(a, b, c, d) {
             if (d) {
                 var e = mm(ng(c, 2)) - Date.now() / 1E3;
                 e = {
                     maxAge: Math.max(e, 0),
                     path: pg(c, 3),
                     domain: pg(c, 4),
                     secure: !1
                 };
                 c = c.getValue();
                 a = a.g;
                 kg(d, 5) && ET(b, c, e, a)
             }
         },
         LT = function(a, b, c) {
             if (c && zT(b, c, a.g)) {
                 var d = a.g.location.hostname;
                 if (d === "localhost") d = ["localhost"];
                 else if (d = d.split("."), d.length < 2) d = [];
                 else {
                     for (var e = [], f = 0; f < d.length - 1; ++f) e.push(d.slice(f).join("."));
                     d = e
                 }
                 d = w(d);
                 for (var g = d.next(); !g.done; g = d.next()) e =
                     b, f = a.g, g = g.value, kg(c, 5) && f.origin !== "null" && (new xT(f.document)).remove(e, "/", g)
             }
         };

     function MT(a, b) {
         return a && (a === b.xc || a === b.adUnitCode)
     };

     function NT(a) {
         var b, c, d;
         return (a == null ? void 0 : (b = a.ext) == null ? void 0 : b.gpid) || (a == null ? void 0 : (c = a.ext) == null ? void 0 : (d = c.data) == null ? void 0 : d.pbadslot)
     }

     function OT(a, b) {
         if (!b.length) return [];
         var c, d, e = (d = (c = a.getEvents) == null ? void 0 : c.call(a).filter(function(f) {
             return f.eventType === "auctionEnd"
         })) != null ? d : [];
         return b.map(function(f) {
             for (var g = w(e), h = g.next(); !h.done; h = g.next()) {
                 var k = void 0,
                     l = void 0;
                 h = (l = (k = h.value.args) == null ? void 0 : k.adUnits) != null ? l : [];
                 k = w(h);
                 for (l = k.next(); !l.done; l = k.next()) {
                     l = l.value;
                     h = NT(l.ortb2Imp);
                     var n;
                     if (n = h) {
                         var p = void 0,
                             q = void 0,
                             v = void 0,
                             u = void 0,
                             t = void 0,
                             y = void 0,
                             D = void 0;
                         n = MT(l.code, f) || MT((D = l.ortb2Imp) == null ? void 0 :
                             (y = D.ext) == null ? void 0 : (t = y.data) == null ? void 0 : t.pbadslot, f) || MT((u = l.ortb2Imp) == null ? void 0 : (v = u.ext) == null ? void 0 : (q = v.data) == null ? void 0 : (p = q.adserver) == null ? void 0 : p.adslot, f)
                     }
                     if (n) return h
                 }
             }
         })
     };

     function PT() {
         var a = window,
             b, c;
         return (c = ((b = a._pbjsGlobals) != null ? b : []).concat(["pbjs"]).map(function(d) {
             return a[d]
         }).find(function(d) {
             return Array.isArray(d == null ? void 0 : d.que)
         })) != null ? c : null
     };

     function QT(a, b) {
         var c, d, e;
         b == null ? e = void 0 : e = b.get.call(b, a);
         return (d = (c = e) != null ? c : b == null ? void 0 : b.get(fp(a))) != null ? d : 0
     };
     var RT = /^v?\d{1,3}(\.\d{1,3}){0,2}(-pre)?$/,
         ST = new Map,
         TT = new Map;

     function UT(a, b) {
         b = b === void 0 ? 1 : b;
         var c = function(d) {
             var e, f = (e = d.responseTimestamp) != null ? e : 0,
                 g, h;
             e = (h = d.ttl) != null ? h : 0 - ((g = d.ttlBuffer) != null ? g : b);
             return f + e * 1E3 > (new Date).getTime()
         };
         return function(d) {
             var e;
             return ((e = d.getStatusCode) == null ? void 0 : e.call(d)) === 1
         }(a) && c(a) && "rendered" !== a.status
     }

     function VT(a, b) {
         var c = a.reduce(function(e, f) {
                 var g = f.bidder;
                 e[g] || (e[g] = []);
                 e[g].push(f);
                 return e
             }, {}),
             d = [];
         Object.keys(c).forEach(function(e) {
             d.push(c[e].sort(function(f, g) {
                 var h, k;
                 return ((h = f.timeToRespond) != null ? h : 0) - ((k = g.timeToRespond) != null ? k : 0)
             }).reduce(function(f, g) {
                 var h, k;
                 return ((h = f.cpm) != null ? h : 0) >= ((k = g.cpm) != null ? k : 0) ? f : g
             }))
         });
         d.sort(function(e, f) {
             var g, h;
             return ((g = f.cpm) != null ? g : 0) - ((h = e.cpm) != null ? h : 0)
         });
         return b ? d.slice(0, b) : d
     }

     function WT(a) {
         switch (a) {
             case null:
             case void 0:
             case "client":
                 return 1;
             case "s2s":
                 return 2;
             default:
                 return 0
         }
     }

     function XT(a, b, c) {
         var d = b.getBidResponsesForAdUnitCode;
         if (!d || !a.code) return [];
         var e;
         d = (e = d(a.code)) == null ? void 0 : e.bids;
         return d != null && d.length ? d.filter(function(f) {
             var g;
             if (!UT(f, (g = b.getConfig) == null ? void 0 : g.call(b).ttlBuffer)) return !1;
             var h;
             g = (h = b.getConfig) == null ? void 0 : h.call(b).useBidCache;
             var k;
             h = (k = b.getConfig) == null ? void 0 : k.call(b).bidCacheFilterFunction;
             k = f.auctionId === c;
             h = g && !k && typeof h === "function" ? !!h(f) : !0;
             return (f.adUnitCode !== a.code || g || k) && h
         }) : []
     }

     function YT(a, b, c, d, e) {
         if (TT.has(c)) return TT.get(c);
         var f, g = (f = a.adUnits) == null ? void 0 : f.find(function(v) {
             v = v == null ? void 0 : v.code;
             return !!v && (v === b.xc || v === b.adUnitCode)
         });
         if (!g && d && e != null) {
             e = e.find(function(v) {
                 return v.args.adId === d
             });
             var h, k, l, n = (l = e == null ? void 0 : (h = e.args) == null ? void 0 : h.sharedBidInUse) != null ? l : e == null ? void 0 : (k = e.args) == null ? void 0 : k.adUnitCode;
             if (n) {
                 var p, q;
                 g = (q = (p = a.adUnits) == null ? void 0 : p.find(function(v) {
                     return v.code === n
                 })) != null ? q : {
                     code: n
                 }
             }
         }
         if (g) return TT.set(c, g), g
     }

     function ZT(a, b, c) {
         for (var d = []; b && !d.includes(b);) {
             d.unshift(b);
             var e = void 0,
                 f = void 0;
             b = (e = a) == null ? void 0 : (f = e.aliasRegistry) == null ? void 0 : f[b]
         }
         Uf(c, 10, d, Le)
     }

     function $T(a, b, c, d) {
         var e = a.cpm,
             f = a.originalCpm,
             g = a.currency,
             h = a.originalCurrency,
             k = a.dealId,
             l = a.adserverTargeting,
             n = a.bidder,
             p = a.adId,
             q = a.mediaType,
             v = a.height,
             u = a.width,
             t = a.meta,
             y = new py;
         typeof e === "number" && (Jf(y, 2, He(Math.round(e * 1E6))), h && h !== g || (e = Math.round(Number(f) * 1E6), isNaN(e) || e === mm(ng(y, 2)) || Jf(y, 8, He(e))));
         typeof g === "string" && zg(y, 3, g);
         ["string", "number"].includes(typeof k) && (g = new hy, k = zg(g, 1, String(k)), F(y, 6, k));
         if (typeof l === "object")
             for (k = w(["", "_" + n]), g = k.next(); !g.done; g = k.next()) {
                 e =
                     g.value;
                 g = [];
                 f = w(Object.entries(l));
                 for (h = f.next(); !h.done; h = f.next()) {
                     h = w(h.value);
                     var D = h.next().value;
                     h = h.next().value;
                     D = ("" + D + e).slice(0, 20);
                     var ca = void 0,
                         X = void 0;
                     if ((ca = c) == null ? 0 : (X = ca[D]) == null ? 0 : X.length)
                         if (c[D][0] === String(h)) g.push(D);
                         else {
                             g = [];
                             break
                         }
                 }
                 e = Nf(y, 4, Ne, Mf());
                 Uf(y, 4, e.concat(g), Le)
             }
         switch (q || "banner") {
             case "banner":
                 Ag(y, 5, 1);
                 break;
             case "native":
                 Ag(y, 5, 2);
                 break;
             case "video":
                 Ag(y, 5, 3);
                 c = new ny;
                 var fa;
                 if ((b == null ? void 0 : (fa = b.video) == null ? void 0 : fa.context) === "adpod") {
                     var Ba, sa =
                         b == null ? void 0 : (Ba = b.video) == null ? void 0 : Ba.adPodDurationSec;
                     Jf(c, 1, He(sa))
                 } else Ba = b == null ? void 0 : (sa = b.video) == null ? void 0 : sa.maxduration, Jf(c, 1, He(Ba));
                 var ab;
                 if (typeof(b == null ? void 0 : (ab = b.video) == null ? void 0 : ab.skip) === "number") {
                     var La;
                     b = !!(b == null ? 0 : (La = b.video) == null ? 0 : La.skip);
                     ug(c, 2, b)
                 }
                 var V;
                 La = (V = a.meta) == null ? void 0 : V.adServerCatId;
                 V = zg(c, 3, La);
                 if (typeof l !== "object") l = null;
                 else {
                     var da, Ma;
                     La = String((Ma = (da = l["hb_pb_cat_dur_" + n]) != null ? da : l.hb_pb_cat_dur) != null ? Ma : "");
                     var wb, qa, Pa, ac;
                     da =
                         String((ac = (Pa = (qa = (wb = l["hb_cache_id_" + n]) != null ? wb : l["hb_uuid_" + n]) != null ? qa : l.hb_cache_id) != null ? Pa : l.hb_uuid) != null ? ac : "");
                     l = La && da ? La + "_" + da : da ? da : null
                 }
                 zg(V, 4, l);
                 F(y, 9, c)
         }
         Number.isFinite(v) && Number.isFinite(u) && (l = new ly, u = wg(l, 1, Math.round(u)), v = wg(u, 2, Math.round(v)), F(y, 7, v));
         typeof p === "string" && zg(y, 1, p);
         var xc;
         (d == null ? 0 : d.Ig) && Array.isArray(t == null ? void 0 : t.advertiserDomains) && (t == null ? 0 : (xc = t.advertiserDomains[0]) == null ? 0 : xc.length) && zg(y, 10, t.advertiserDomains[0].substring(0, d == null ?
             void 0 : d.Ig));
         if (a.meta && d) {
             var Qa, lc;
             d.Mg && typeof a.meta.agencyId === "string" && ((lc = a.meta.agencyId) == null ? 0 : lc.length) && (Qa != null || (Qa = new jy), zg(Qa, 1, a.meta.agencyId.substring(0, d.Mg)));
             var jd;
             d.Ng && typeof a.meta.agencyName === "string" && ((jd = a.meta.agencyName) == null ? 0 : jd.length) && (Qa != null || (Qa = new jy), zg(Qa, 2, a.meta.agencyName.substring(0, d.Ng)));
             var nf;
             d.fh && typeof a.meta.networkId === "string" && ((nf = a.meta.networkId) == null ? 0 : nf.length) && (Qa != null || (Qa = new jy), zg(Qa, 3, a.meta.networkId.substring(0,
                 d.fh)));
             var of ;
             d.gh && typeof a.meta.networkName === "string" && (( of = a.meta.networkName) == null ? 0 : of .length) && (Qa != null || (Qa = new jy), zg(Qa, 4, a.meta.networkName.substring(0, d.gh)));
             Qa && F(y, 11, Qa)
         }
         return y
     }

     function aU(a, b, c, d, e, f, g) {
         var h = XT(c, a, d);
         if (h.length) {
             var k, l = (k = a.getConfig) == null ? void 0 : k.call(a).enableSendAllBids,
                 n, p;
             k = (n = a.getConfig) == null ? void 0 : (p = n.call(a).sendBidsControl) == null ? void 0 : p.bidLimit;
             h = VT(h, l && k || 0);
             if (h.length)
                 for (h = w(h), l = h.next(); !l.done; l = h.next()) {
                     l = l.value;
                     p = l.adUnitCode !== c.code;
                     n = !p && l.auctionId !== d;
                     if (!q && !n && !p && l.transactionId) {
                         var q = l.transactionId;
                         Ne(Hf(b, 4)) != null || zg(b, 4, q)
                     }
                     try {
                         p = void 0, (p = e) == null || p(l, l.transactionId)
                     } catch (u) {}
                     var v = n;
                     n = a;
                     p = b;
                     k = $T(l, c.mediaTypes,
                         f, g);
                     v = Ay(zy(wy(new vy, l.bidder), 1), v);
                     v = Ag(v, 7, WT(l.source));
                     k = yy(v, k);
                     ZT(n, l.bidder, k);
                     n = Fy(p, k);
                     typeof l.timeToRespond === "number" && Jf(n, 2, He(Math.round(l.timeToRespond)))
                 }
         }
     }
     var bU = function(a, b, c) {
             this.pbjs = a;
             this.slot = b;
             var d;
             this.Fb = (d = c == null ? void 0 : c.Fb) != null ? d : {};
             this.be = !(c == null || !c.be);
             var e;
             this.de = (e = c == null ? void 0 : c.de) != null ? e : new Map;
             var f;
             this.Jf = (f = c == null ? void 0 : c.Jf) != null ? f : new Map;
             var g;
             this.ff = (g = c == null ? void 0 : c.ff) != null ? g : new Dy;
             this.re = c == null ? void 0 : c.re;
             this.j = c;
             var h, k;
             this.g = ((h = this.slot.xc) != null ? h : "") + ((k = this.slot.adUnitCode) != null ? k : "");
             this.Ld = !(c == null || !c.Ld);
             this.Mf = c == null ? void 0 : c.Mf;
             this.Gf = c == null ? void 0 : c.Gf
         },
         cU = function(a, b,
             c) {
             var d = a.pbjs.getBidResponsesForAdUnitCode;
             if (d) {
                 var e, f, g, h, k, l, n, p, q, v = (q = (n = (e = d((k = a.slot.xc) != null ? k : "")) == null ? void 0 : e.bids) != null ? n : (f = d((l = a.slot.adUnitCode) != null ? l : "")) == null ? void 0 : f.bids) != null ? q : (h = d((p = (g = TT.get(a.g)) == null ? void 0 : g.code) != null ? p : "")) == null ? void 0 : h.bids;
                 if (v != null && v.length && (e = v.filter(function(y) {
                         var D = y.auctionId;
                         var ca = y.adId;
                         return D !== c && Object.values(a.Fb).some(function(X) {
                             return X.includes(ca)
                         })
                     }), e.length)) {
                     var u, t;
                     d = (u = a.pbjs.adUnits) == null ? void 0 : (t = u.find(function(y) {
                         y =
                             y.code;
                         return y === a.slot.xc || y === a.slot.adUnitCode || y === TT.get(a.g)
                     })) == null ? void 0 : t.mediaTypes;
                     u = w(e);
                     for (t = u.next(); !t.done; t = u.next()) t = t.value, e = $T(t, d, a.Fb, a.j), e = Fy(b, yy(Ay(zy(wy(new vy, t.bidder), 1), !0), e)), ZT(a.pbjs, t.bidder, e), typeof t.timeToRespond === "number" && Jf(e, 2, He(Math.round(t.timeToRespond)))
                 }
             }
         },
         dU = function(a, b, c, d, e) {
             e = a.Jf.get(e != null ? e : function() {
                 return null
             });
             (e == null ? void 0 : G(e, 1)) !== 1 && F(c, 5, e);
             Lf(b, ry) || (e ? G(e, 1) === 1 ? Gy(b, e) : Gy(b, uy(sy(ty(new ry, a.be), 1), QT(d, a.de))) : Gy(b,
                 sy(ty(new ry, a.be), QT(d, a.de) ? 2 : 3)))
         },
         eU = function(a, b) {
             var c = new Map,
                 d = function(k) {
                     var l = c.get(k);
                     l || (l = {}, c.set(k, l));
                     return l
                 },
                 e = [];
             a = w(a);
             for (var f = a.next(); !f.done; f = a.next()) {
                 f = f.value;
                 var g = f.args,
                     h = f.eventType;
                 f = f.elapsedTime;
                 h === "bidTimeout" && e.push.apply(e, ua(g));
                 switch (h) {
                     case "bidRequested":
                         if (g.auctionId !== b) continue;
                         if (!Array.isArray(g.bids)) continue;
                         g = w(g.bids);
                         for (h = g.next(); !h.done; h = g.next())
                             if (h = h.value.bidId) d(h).requestTime = f;
                         break;
                     case "noBid":
                         g.auctionId === b && g.bidId && (d(g.bidId).di =
                             f)
                 }
             }
             d = new Map;
             a = w(c.entries());
             for (f = a.next(); !f.done; f = a.next()) g = w(f.value), f = g.next().value, h = g.next().value, g = h.requestTime, h = h.di, g && h && d.set(f, {
                 latency: h - g,
                 ec: !1
             });
             e = w(e);
             for (a = e.next(); !a.done; a = e.next())
                 if (f = a.value, a = f.bidId, f = f.auctionId, a && f === b && (a = d.get(a))) a.ec = !0;
             return d
         };
     bU.prototype.fetch = function() {
         var a = this,
             b, c, d = ((c = (b = this.pbjs) == null ? void 0 : b.getEvents) != null ? c : function() {
                 return []
             })(),
             e = d.filter(function(V) {
                 var da = V.eventType;
                 V = V.args;
                 return da === "auctionEnd" && V.auctionId
             });
         b = d.filter(function(V) {
             return V.eventType === "bidResponse"
         });
         var f, g = YT(this.pbjs, this.slot, this.g, (f = this.Fb.hb_adid) == null ? void 0 : f[0], b);
         if (g == null) {
             var h;
             if (((h = this.Fb.hb_adid) == null ? void 0 : h[0]) != null) {
                 var k;
                 (k = this.Gf) == null || k.call(this, !0)
             }
             return null
         }
         var l = function(V) {
                 return V ===
                     (g == null ? void 0 : g.code)
             },
             n;
         f = (n = this.Mf) != null ? n : function() {
             var V, da = (V = ST.get(a.g)) != null ? V : 0,
                 Ma;
             V = (Ma = e.filter(function(qa) {
                 var Pa, ac, xc;
                 return Number((Pa = qa.args) == null ? void 0 : Pa.timestamp) > da && ((ac = qa.args) == null ? void 0 : (xc = ac.adUnitCodes) == null ? void 0 : xc.find(l))
             })) != null ? Ma : [];
             if (!V.length) return null;
             var wb;
             return (wb = V.reduce(function(qa, Pa) {
                 return Number(Pa.args.timestamp) > Number(qa.args.timestamp) ? Pa : qa
             })) == null ? void 0 : wb.args
         }();
         if (!f) return f;
         b = f.bidderRequests === void 0 ? [] : f.bidderRequests;
         n = f.bidsReceived === void 0 ? [] : f.bidsReceived;
         var p = f.auctionId;
         h = f.timestamp;
         if (p && h != null && b.length) {
             ST.set(this.g, h);
             h = new Ky;
             k = Ly(h);
             this.pbjs.version && RT.test(this.pbjs.version) && zg(k, 6, this.pbjs.version);
             var q, v, u, t;
             if ((v = (q = this.pbjs).getConfig) == null ? 0 : (u = v.call(q).cache) == null ? 0 : (t = u.url) == null ? 0 : t.length) {
                 var y, D, ca;
                 Hy(k, (D = (y = this.pbjs).getConfig) == null ? void 0 : (ca = D.call(y).cache) == null ? void 0 : ca.url)
             }
             F(k, 9, this.ff);
             q = li(function() {
                 return eU(d, p)
             });
             var X;
             v = w(b);
             t = v.next();
             for (u = {}; !t.done; u = {
                     bidderCode: void 0,
                     Wf: void 0
                 }, t = v.next())
                 for (y = t.value, u.bidderCode = y.bidderCode, D = y.bids, t = y.timeout, u.Wf = y.src, y = w(D), D = y.next(), b = {}; !D.done; b = {
                         Uc: void 0
                     }, D = y.next()) {
                     var fa = D.value;
                     b.Uc = fa.bidId;
                     D = fa.transactionId;
                     c = fa.adUnitCode;
                     var Ba = fa.getFloor;
                     ca = fa.mediaTypes;
                     fa = fa.ortb2Imp;
                     if (b.Uc && (l(c) || c === TT.get(this.g))) {
                         xe(Hf(k, 3)) != null || (c === this.slot.adUnitCode ? Ag(k, 3, 1) : c === this.slot.xc && Ag(k, 3, 2));
                         var sa = void 0;
                         ((sa = this.j) == null ? 0 : sa.vf) && Ne(Hf(k, 11)) == null && (fa = NT(fa)) && (sa = void 0, Iy(k, fa.substring(0,
                             (sa = this.j) == null ? void 0 : sa.vf)));
                         D && (X != null || (X = D), Ne(Hf(k, 4)) != null || zg(k, 4, D));
                         ze(Hf(k, 8)) == null && Number.isFinite(t) && wg(k, 8, t);
                         sa = n.find(function(V) {
                             return function(da) {
                                 return da.requestId === V.Uc
                             }
                         }(b));
                         if (!sa || !this.Ld)
                             if (fa = Fy(k, function(V) {
                                     return function() {
                                         var da = wy(new vy, V.bidderCode);
                                         ZT(a.pbjs, V.bidderCode, da);
                                         Ag(da, 7, WT(V.Wf));
                                         return da
                                     }
                                 }(u)()), dU(this, k, fa, c, Ba), sa) {
                                 zy(fa, 1);
                                 typeof sa.timeToRespond === "number" && Number.isFinite(sa.timeToRespond) && Jf(fa, 2, He(Math.round(sa.timeToRespond)));
                                 try {
                                     c = b = void 0, (c = (b = this).re) == null || c.call(b, sa, D)
                                 } catch (V) {}
                                 D = $T(sa, ca, this.Fb, this.j);
                                 yy(fa, D)
                             } else(D = q().get(b.Uc)) && !D.ec ? (zy(fa, 2), Number.isFinite(D.latency) && Jf(fa, 2, He(Math.round(D.latency)))) : (D = zy(fa, 3), Number.isFinite(t) && Jf(D, 2, He(Math.round(t))))
                     }
                 }
             if (this.Ld) g && aU(this.pbjs, k, g, p, this.re, this.Fb, this.j);
             else {
                 var ab, La;
                 ((La = (ab = this.pbjs).getConfig) == null ? 0 : La.call(ab).useBidCache) && cU(this, k, p)
             }
             return {
                 Ah: h,
                 transactionId: X,
                 arg: f
             }
         }
     };

     function fU(a, b, c) {
         return (new bU(a, b, c)).fetch()
     };
     var gU = function(a, b, c) {
         var d;
         this.g = d = d === void 0 ? new FT : d;
         this.l = RK(a);
         this.j = {
             Ce: PK(a),
             De: !QS(c, b)
         }
     };

     function hU(a, b, c) {
         if ($b() && nj(window.fetch) && nj(window.AbortController)) try {
             var d = window.isSecureContext && !["localhost", "127.0.0.1"].includes(window.location.hostname),
                 e = window.document;
             var f = !!(d && "browsingTopics" in e && e.browsingTopics instanceof Function && Po("browsing-topics", e));
             if (a.j) {
                 var g = MK(a, "rdp");
                 var h = JK(g) ? "1" : ""
             } else h = "";
             d = h === "1";
             var k, l = MK(a, "us_privacy"),
                 n = a.g.uspString || l || "";
             n = n.toUpperCase();
             l = n;
             if (l.length == 4 && (l.indexOf("-") == -1 || l.substring(1) === "---") && l[0] >= "1" && l[0] <= "9" &&
                 gz.hasOwnProperty(l[1]) && gz.hasOwnProperty(l[2]) && gz.hasOwnProperty(l[3])) {
                 var p = new fz;
                 var q = xg(p, 1, parseInt(n[0], 10));
                 var v = H(q, 2, gz[n[1]]);
                 var u = H(v, 3, gz[n[2]]);
                 var t = H(u, 4, gz[n[3]])
             } else t = null;
             var y = t;
             var D;
             if (!(D = (y == null ? void 0 : G(y, 3)) === 2 || SK(a)))
                 if (NK(a)) {
                     var ca = OK(a);
                     D = ca ? !IE(ca, ["3", "4"], 0) : !0
                 } else D = !1;
             if (!(k = D)) {
                 var X = MK(a, "npa"),
                     fa = JK(X);
                 k = (a.j && fa ? "1" : "") === "1"
             }
             var Ba;
             if (!(Ba = k || d || QK(a))) {
                 if (a.j) {
                     var sa = MK(a, "tfcd");
                     var ab = sa === "0" || sa === "false" ? (0).toString() : JK(sa) ? (1).toString() :
                         ""
                 } else ab = "";
                 var La;
                 if (!(La = ab === (1).toString())) {
                     if (a.j) {
                         var V = MK(a, "tfua");
                         var da = V === "0" || V === "false" ? (0).toString() : JK(V) ? (1).toString() : ""
                     } else da = "";
                     La = da === (1).toString()
                 }
                 Ba = La
             }
             k = !Ba;
             if (c && b) {
                 var Ma, wb, qa;
                 var Pa = (qa = (Ma = E(c, Yh, 4)) == null ? void 0 : (wb = Tf(Ma, 1, void 0, Qe)) == null ? void 0 : wb.get(b)) != null ? qa : !0
             } else Pa = !0;
             b = Pa;
             var ac = !!navigator.globalPrivacyControl,
                 xc = a.B && ac;
             return f && k && b && !xc
         } catch (lc) {
             var Qa;
             U.getInstance().report(209, {
                 message: (Qa = lc) == null ? void 0 : Qa.message
             })
         }
         return !1
     }

     function iU(a) {
         if (!a) return [];
         if (op(dE)) return ["15018773"];
         var b;
         return (b = E(a, Xh, 2)) == null ? void 0 : cg(b, Wh, 1, Mf()).map(function(c) {
             return pg(c, 1).toString()
         })
     }

     function jU(a, b, c, d, e, f, g, h, k, l, n) {
         var p = a.adTagUrl ? DK(a.adTagUrl) : null,
             q = new gU(c, p, e),
             v = {};
         v = (v.limaExperimentIds = Yn().sort().join(","), v);
         var u = lj(),
             t = Jo(),
             y = E(t, Go, 1),
             D = {};
         y = (D.experimentStateProto = y == null ? void 0 : y.ba(), D);
         D = rg(t, 2);
         t = lg(t, 5);
         var ca = Qo(),
             X = {};
         b = (X.consentSettings = b, X.imalibExperiments = v, X.genotypeExperimentData = y, X.eventfeExperimentIds = D, X.managedJsExperimentId = t, X.settings = h, X.videoEnvironment = k, X.isFledgeEligible = ca, X.preferredLinearOrientation = a.preferredLinearOrientation,
             X.pvsid = u, X.networkCodes = iU(e), X.sqid = f, X.supportsQuicksilver = !0, X);
         Object.assign(b, a.ba());
         f = RK(c);
         b.isBrowserCookieEnabled = JT(l, f);
         h = f ? zT("__gads", f, l.g) : null;
         h !== null && (b.gfpCookieValue = h);
         h = f ? zT("__gpi", f, l.g) : null;
         h !== null && (b.gfpCookieV2Id = h);
         l = f ? zT("__gpi_opt_out", f, l.g) : null;
         l !== null && (b.gfpCookieV2OptOut = l);
         b.eoidCookieEnabled = GT(q.g, q.l, q.j);
         (q = HT(q.g, q.l, q.j)) && (b.eoidCookieValue = q);
         b.ivtDetectionOnlyStorageAllowed = TS(c, e, p);
         g && (b.espSignals = g);
         d && (b.gmaSignals = d);
         b.isEapLoader = !1;
         d = function(Pa) {
             U.getInstance().report(195, {
                 message: Pa == null ? void 0 : Pa.message
             })
         };
         try {
             var fa = PT();
             if (fa) {
                 var Ba = EK(a.adTagUrl, d),
                     sa = Ba ? Un(to) ? 1 : RS(e, CK(Ba)) ? 2 : 0 : 0,
                     ab = pp(WD);
                 switch (sa) {
                     case 1:
                     case 2:
                         var La = {
                                 Fb: FK(a.adTagUrl),
                                 vf: ab || sa !== 1 ? 0 : 100,
                                 Ld: pp(VD) === 1
                             },
                             V, da = (V = fU(fa, {
                                 adUnitCode: Ba
                             }, La)) == null ? void 0 : V.Ah;
                         b.clientBidsProto = da ? qM(My(da)) : void 0
                 }
                 if (ab) {
                     var Ma;
                     b.globalPlacementId = (Ma = OT(fa, [{
                         adUnitCode: Ba
                     }])[0]) == null ? void 0 : Ma.substring(0, ab)
                 }
             }
         } catch (Pa) {
             d(Pa)
         }
         try {
             var wb = SS(e);
             wb && (b.publisherInitiatedExperimentDataProto = qM(OS(wb)))
         } catch (Pa) {
             var qa;
             U.getInstance().report(214, {
                 message: (qa = Pa) == null ? void 0 : qa.message
             })
         }
         b.topicsEnabled = hU(c, p, e);
         n && (b.quicksilverSignals = n);
         return b
     };
     var kU = function() {
         this.l = this.j = "unknown";
         this.g = "0";
         this.adTagUrl = "";
         this.adsResponse = null;
         this.nonLinearAdSlotHeight = this.nonLinearAdSlotWidth = this.linearAdSlotHeight = this.linearAdSlotWidth = this.liveStreamPrefetchSeconds = 0;
         this.forceNonLinearFullSlot = !1;
         this.contentTitle = this.contentKeywords = this.contentDuration = null;
         this.vastLoadTimeout = 5E3;
         this.omidAccessModeRules = {};
         this.pageUrl = null;
         this.preferredLinearOrientation = 0
     };
     kU.prototype.ba = function() {
         var a = {};
         a.adsResponse = this.adsResponse;
         a.videoPlayActivation = this.j;
         a.videoPlayMuted = this.l;
         a.videoContinuousPlay = this.g;
         a.adTagUrl = this.adTagUrl;
         a.contentDuration = this.contentDuration;
         a.contentKeywords = this.contentKeywords;
         a.contentTitle = this.contentTitle;
         a.linearAdSlotWidth = this.linearAdSlotWidth;
         a.linearAdSlotHeight = this.linearAdSlotHeight;
         a.nonLinearAdSlotWidth = this.nonLinearAdSlotWidth;
         a.nonLinearAdSlotHeight = this.nonLinearAdSlotHeight;
         a.forceNonLinearFullSlot = this.forceNonLinearFullSlot;
         a.liveStreamPrefetchSeconds = this.liveStreamPrefetchSeconds;
         a.vastLoadTimeout = this.vastLoadTimeout;
         a.omidAccessModeRules = this.omidAccessModeRules;
         a.pageUrl = this.pageUrl;
         return a
     };
     kU.prototype.setAdWillAutoPlay = function(a) {
         this.j = a ? "auto" : "click"
     };
     kU.prototype.setAdWillPlayMuted = function(a) {
         this.l = a ? "muted" : "unmuted"
     };
     kU.prototype.setContinuousPlayback = function(a) {
         this.g = a ? "2" : "1"
     };
     kU.prototype.setContinuousPlayback = kU.prototype.setContinuousPlayback;
     kU.prototype.setAdWillPlayMuted = kU.prototype.setAdWillPlayMuted;
     kU.prototype.setAdWillAutoPlay = kU.prototype.setAdWillAutoPlay;
     var lU = function(a) {
         this.D = C(a)
     };
     r(lU, I);
     var mU = function(a) {
         this.D = C(a)
     };
     r(mU, I);
     var nU = function(a) {
         this.D = C(a)
     };
     r(nU, I);
     var oU = function(a) {
         this.D = C(a)
     };
     r(oU, I);
     var pU = function(a) {
         this.D = C(a)
     };
     r(pU, I);
     var qU = function(a) {
         return ag(a, ql, 5)
     };
     pU.prototype.getWidth = function() {
         return lg(this, 9)
     };
     pU.prototype.getHeight = function() {
         return lg(this, 10)
     };
     var rU = Sh(pU);

     function sU(a) {
         var b;
         return (b = (new Map([
                 ["https://googleads.g.doubleclick.net", BigInt(200)],
                 ["https://td.doubleclick.net", BigInt(300)],
                 ["https://f.creativecdn.com", BigInt(400)],
                 ["https://fledge.us.criteo.com", BigInt(500)],
                 ["https://fledge.eu.criteo.com", BigInt(600)],
                 ["https://fledge.as.criteo.com", BigInt(700)],
                 ["https://fledge-buyer-testing-1.uc.r.appspot.com", BigInt(800)],
                 ["https://at-us-east.amazon-adsystem.com", BigInt(900)],
                 ["https://x.adroll.com", BigInt(1E3)],
                 ["https://fledge.dynalyst.jp", BigInt(1100)]
             ])).get(a)) !=
             null ? b : BigInt(100)
     };

     function tU(a) {
         var b = a.xi,
             c = a.nk,
             d = a.Dk,
             e = a.auctionNonce,
             f = a.gk,
             g = a.multiBidLimit;
         a = !kg(b, 14);
         for (var h = {}, k = w(cg(b, mU, 7, Mf())), l = k.next(); !l.done; l = k.next()) {
             l = l.value;
             var n = {},
                 p = void 0,
                 q = (p = d) == null ? void 0 : p.Lh.pi.wi.Rg;
             p = pg(l, 1);
             if (pg(l, 2).length) try {
                 if (n = JSON.parse(pg(l, 2)), dj() * 100 < 1) {
                     var v = void 0;
                     (v = q) == null || xl(v, {
                         Sd: p,
                         status: "SUCCESS",
                         Pe: 100
                     })
                 }
             } catch (fa) {
                 v = void 0, (v = q) == null || xl(v, {
                     Sd: p,
                     status: "ERROR",
                     Pe: 1
                 })
             } else v = void 0, (v = q) == null || xl(v, {
                 Sd: p,
                 status: "EMPTY",
                 Pe: 1
             });
             h[pg(l, 1)] = n
         }
         if (d = E(b,
                 ol, 6)) h["https://googleads.g.doubleclick.net"] = mf(d), h["https://td.doubleclick.net"] = mf(d);
         d = {};
         k = cg(b, oU, 11, Mf());
         k = w(k);
         for (l = k.next(); !l.done; l = k.next()) l = l.value, d[pg(l, 1)] = lg(l, 2);
         k = {};
         lg(b, 21) !== 0 && (k["*"] = lg(b, 21));
         if (cg(b, nU, 32, Mf()).length > 0) {
             var u = {};
             l = w(cg(b, nU, 32, Mf()));
             for (n = l.next(); !n.done; n = l.next()) n = n.value, u[pg(n, 1)] = lg(n, 2)
         }
         l = {};
         Ae(Hf(b, 18)) != null && (l["https://googleads.g.doubleclick.net"] = mg(b, 18), l["https://td.doubleclick.net"] = mg(b, 18));
         n = w(Tf(b, 24, lU));
         for (q = n.next(); !q.done; q =
             n.next()) p = w(q.value), q = p.next().value, p = p.next().value, mg(p, 4) && (l[q] = mg(p, 4));
         n = {};
         q = w(Tf(b, 24, lU));
         for (p = q.next(); !p.done; p = q.next()) v = w(p.value), p = v.next().value, v = v.next().value, v = pg(v, 5), v.length && (n[p] = {
             type: v
         });
         var t, y;
         if ((t = E(b, ol, 6)) == null ? 0 : (y = ag(t, nl, 3)) == null ? 0 : kg(y, 71)) n["https://td.doubleclick.net"] = {
             type: "default-local-reporting"
         };
         t = {};
         g && g > 1 && (t["*"] = g);
         g = pg(b, 1).split("/td/")[0];
         (y = E(b, ql, 5)) == null ? y = void 0 : (q = y.D, p = q[B] | 0, y = Af(y, q, p) ? zf(y, q, !0) : new y.constructor(yf(q, p, !1)));
         var D;
         y != null && (D = E(y, pl, 5)) != null && Jf(D, 2);
         D = Object;
         q = D.assign;
         p = pg(b, 1);
         v = pg(b, 2);
         var ca = Nf(b, 3, Ne, Mf(Id));
         u = q.call(D, {}, {
                 seller: g,
                 decisionLogicURL: p,
                 trustedScoringSignalsURL: v,
                 interestGroupBuyers: ca,
                 sellerExperimentGroupId: mg(b, 17),
                 auctionSignals: JSON.parse(pg(b, 4) || "{}"),
                 sellerSignals: (y == null ? void 0 : mf(y)) || [],
                 sellerTimeout: lg(b, 15) || 50,
                 perBuyerExperimentGroupIds: l,
                 perBuyerSignals: h,
                 perBuyerTimeouts: d,
                 perBuyerCumulativeTimeouts: k,
                 perBuyerRealTimeReportingConfig: n,
                 perBuyerMultiBidLimits: t,
                 reportingTimeout: 5E3
             },
             u ? {
                 perBuyerGroupLimits: u
             } : {}, a ? {
                 resolveToConfig: a
             } : {});
         b == null ? h = 0 : (h = qU(b), h = kg(h, 25));
         h && (u.sellerCurrency = "USD", u.perBuyerCurrencies = Object.fromEntries(Tf(b, 22, void 0, Re)));
         pg(b, 28) && (u.directFromSellerSignalsHeaderAdSlot = pg(b, 28));
         if (uU(u.interestGroupBuyers, f)) {
             u.auctionReportBuyerKeys = u.interestGroupBuyers.map(sU);
             f = {
                 interestGroupCount: {
                     bucket: BigInt(0),
                     scale: 1
                 },
                 bidCount: {
                     bucket: BigInt(1),
                     scale: 1
                 }
             };
             f.totalGenerateBidLatency = {
                 bucket: BigInt(2),
                 scale: 1
             };
             f.totalSignalsFetchLatency = {
                 bucket: BigInt(3),
                 scale: 1
             };
             u.auctionReportBuyers = f;
             var X = X === void 0 ? BigInt(0) : X;
             u.auctionReportBuyerDebugModeConfig = {
                 enabled: !0,
                 debugKey: X
             }
         }
         e && (u.auctionNonce = e, u.additionalBids = Promise.resolve());
         Tf(b, 33, void 0, Re).size && (u.deprecatedRenderURLReplacements = Object.fromEntries(Tf(b, 33, void 0, Re).entries()), (e = u.deprecatedRenderURLReplacements["${RENDER_DATA_td.doubleclick.net_GDA}"]) && (u.deprecatedRenderURLReplacements["${RENDER_DATA}"] = e));
         e = Object;
         X = e.assign;
         f = pg(b, 1);
         h = mg(b, 17);
         D = new ql;
         t = qU(b);
         Lf(t, pl) && (t = new pl,
             y = rl(qU(b)), y = qg(y, 2), t = Vf(t, 2, He(y), "0"), y = rl(qU(b)), y = qg(y, 4), t = Vf(t, 4, He(y), "0"), F(D, 5, t));
         qU(b).getEscapedQemQueryId() && (t = qU(b).getEscapedQemQueryId(), Vf(D, 2, Me(t), ""));
         t = qU(b);
         pg(t, 6) && (t = qU(b), t = pg(t, 6), Vf(D, 6, Me(t), ""));
         t = qU(b);
         kg(t, 21) && vg(D, 21, !0);
         t = qU(b);
         kg(t, 4) && vg(D, 4, !0);
         t = qU(b);
         pg(t, 11) && (t = qU(b), t = pg(t, 11), Vf(D, 11, Me(t), ""));
         t = qU(b);
         kg(t, 32) && vg(D, 32, !0);
         D = mf(D);
         t = lg(b, 15) || 50;
         if (kg(b, 30)) {
             if (c == null || !c.length) throw Error("top_td_without_component_auction");
         } else c = [u].concat(ua(c !=
             null ? c : []));
         c = X.call(e, {}, {
             seller: g,
             decisionLogicURL: f,
             sellerExperimentGroupId: h,
             sellerSignals: D,
             sellerTimeout: t,
             interestGroupBuyers: [],
             auctionSignals: {},
             perBuyerExperimentGroupIds: {},
             perBuyerSignals: {},
             perBuyerTimeouts: {},
             perBuyerCumulativeTimeouts: {},
             componentAuctions: c
         }, a ? {
             resolveToConfig: a
         } : {});
         pg(b, 28) && (c.directFromSellerSignalsHeaderAdSlot = pg(b, 28));
         return c
     }

     function uU(a, b) {
         return a.some(function(c) {
             return sU(c) !== BigInt(100)
         }) && (b != null ? b : !1)
     };
     var wU = function(a, b) {
         Q.call(this);
         var c = this;
         this.navigator = b;
         this.j = function(d) {
             var e = Date.now();
             try {
                 var f = vU(c, d.tdconfig)
             } catch (g) {
                 f = Promise.resolve({
                     ec: !1,
                     result: null
                 })
             }
             return f.then(function(g) {
                 var h = kl(jl(e), Date.now()),
                     k = g.ec,
                     l;
                 g = (l = g.result) != null ? l : "";
                 l = {};
                 return l.ffconfig = g, l.timeout = 2E3, l.auctioninterval = h.ba(), l.isauctiontimeout = k, l
             })
         };
         this.g = new US(a, "fledge");
         Hs(this, this.g)
     };
     r(wU, Q);
     var vU = function(a, b) {
         b = rU(b);
         var c = tU({
             xi: b
         });
         b = Rx(2E3, null).then(function() {
             return {
                 ec: !0,
                 result: null
             }
         });
         a = a.navigator.runAdAuction(c).then(function(d) {
             d !== null && typeof d !== "string" ? d = null : d == null && (d = null);
             return {
                 ec: !1,
                 result: d
             }
         });
         return Promise.race([b, a])
     };
     var yU = function(a, b, c) {
         Q.call(this);
         this.C = a;
         this.B = b;
         this.A = c;
         this.g = this.j = this.o = null;
         this.l = 0;
         a = new lG(this);
         Hs(this, a);
         xU(this);
         a.listen(this.B, "adsManager", this.F)
     };
     r(yU, Q);
     var xU = function(a) {
         iT(a.C).then(function(b) {
             a.j = b;
             zU(a, Uj(b))
         }).catch(function() {
             return void AU(a)
         })
     };
     yU.prototype.F = function(a) {
         if (["complete", "skip", "error"].includes(a.messageType)) {
             this.l++;
             if (this.l === 10) {
                 this.l = 0;
                 var b;
                 (b = this.g) == null || b.dispose();
                 xU(this)
             }
             a = Uj(this.j);
             var c;
             a && ((c = a.frames) == null ? 0 : c.omid_v1_present) || U.getInstance().report(188, {})
         }
     };
     var BU = function(a) {
             if (a.g && a.o) {
                 var b = a.g;
                 try {
                     b.g && b.g.setSessionClientWindow(a.o)
                 } catch (c) {
                     b.dispatchEvent(new Event("error"))
                 }
             }
         },
         zU = function(a, b) {
             a.g = new kT(b, a.A);
             a.g.listen("error", function() {
                 return void AU(a)
             });
             mT(a.g);
             BU(a)
         },
         AU = function(a) {
             HL(a.B, "omid", "iframeFailed");
             a.dispose()
         };
     yU.prototype.O = function() {
         this.j && (Sj(this.j), this.j = null);
         var a;
         (a = this.g) == null || a.dispose();
         Q.prototype.O.call(this)
     };
     var CU = function(a, b, c, d) {
         Q.call(this);
         this.o = a;
         this.l = b;
         this.g = c;
         this.C = d;
         this.j = new lG(this);
         Hs(this, this.j);
         this.j.listen(this.o, d, this.A)
     };
     r(CU, Q);
     var DU = function(a, b) {
         var c = b.qa;
         switch (b.messageType) {
             case "showVideo":
                 a.l.Jd();
                 break;
             case "hide":
                 a.l.Bb();
                 break;
             case "resizeAndPositionVideo":
                 b = c.resizeAndPositionVideo;
                 a.l.Ge(new ak(b.x, b.y, b.width, b.height));
                 break;
             case "restoreSizeAndPositionVideo":
                 a.l.He()
         }
     };
     CU.prototype.A = function(a) {
         var b = a.qa;
         switch (a.messageType) {
             case "activate":
                 this.l.Rc(this.g);
                 break;
             case "startTracking":
                 a = this.g;
                 var c = this.B;
                 this.j.listen(a, vj(MG), c);
                 this.j.listen(a, YS, c);
                 this.g.Ye();
                 break;
             case "stopTracking":
                 a = this.g;
                 c = this.B;
                 this.j.ab(a, vj(MG), c);
                 this.j.ab(a, YS, c);
                 this.g.rc();
                 break;
             case "exitFullscreen":
                 a = this.g.g;
                 (Mc || Oc) && a.webkitDisplayingFullscreen && a.webkitExitFullscreen();
                 break;
             case "play":
                 this.g.play();
                 break;
             case "pause":
                 this.g.pause();
                 break;
             case "load":
                 a = this.g;
                 c = b.videoUrl;
                 var d = b.muxedMediaUrl,
                     e = b.muxedMimeType,
                     f = b.muxedAudioCodec,
                     g = b.muxedVideoCodec,
                     h = b.demuxedAudioUrl,
                     k = b.demuxedVideoUrl,
                     l = b.demuxedAudioMimeType,
                     n = b.demuxedVideoMimeType,
                     p = b.demuxedAudioCodec,
                     q = b.demuxedVideoCodec,
                     v = b.mseCompatible;
                 b = b.universalAdIds;
                 var u = null;
                 k && h && v && n && l && q && p && (u = new lE({
                     Di: k,
                     Qg: h,
                     Jk: null,
                     ik: null,
                     Ci: n,
                     Pg: l,
                     Gb: q,
                     rb: p,
                     height: null,
                     width: null,
                     Pa: v,
                     Ik: null,
                     hk: null
                 }));
                 h = null;
                 d && e && g && f && (h = new mE({
                     Kh: d,
                     itag: null,
                     mimeType: e,
                     Gb: g,
                     rb: f,
                     height: null,
                     width: null,
                     Pa: v,
                     qk: null
                 }));
                 u ? EU(a, c,
                     u, b) : h ? EU(a, c, h, b) : EU(a, c, null, b);
                 break;
             case "unload":
                 this.g.unload();
                 break;
             case "setCurrentTime":
                 this.g.g.currentTime = b.currentTime;
                 break;
             case "setVolume":
                 this.g.setVolume(b.volume)
         }
     };
     CU.prototype.B = function(a) {
         var b = {};
         switch (a.type) {
             case "autoplayDisallowed":
                 a = "autoplayDisallowed";
                 break;
             case "beginFullscreen":
                 a = "fullscreen";
                 break;
             case "endFullscreen":
                 a = "exitFullscreen";
                 break;
             case "click":
                 a = "click";
                 break;
             case "end":
                 a = "end";
                 break;
             case "error":
                 a = "error";
                 break;
             case "loaded":
                 a = "loaded";
                 break;
             case "mediaLoadTimeout":
                 a = "mediaLoadTimeout";
                 break;
             case "pause":
                 a = "pause";
                 b.ended = this.g.g.ended;
                 break;
             case "play":
                 a = "play";
                 break;
             case "skip":
                 a = "skip";
                 break;
             case "start":
                 a = "start";
                 b.volume = this.g.getVolume();
                 break;
             case "timeUpdate":
                 a = "timeupdate";
                 b.currentTime = this.g.getCurrentTime();
                 b.duration = this.g.getDuration();
                 break;
             case "volumeChange":
                 a = "volumeChange";
                 b.volume = this.g.getVolume();
                 break;
             case "loadedmetadata":
                 a = a.type;
                 b.duration = this.g.getDuration();
                 break;
             case "abort":
             case "canplay":
             case "canplaythrough":
             case "durationchange":
             case "emptied":
             case "loadstart":
             case "loadeddata":
             case "progress":
             case "ratechange":
             case "seeked":
             case "seeking":
             case "stalled":
             case "suspend":
             case "waiting":
                 a = a.type;
                 break;
             default:
                 return
         }
         HL(this.o,
             this.C, a, b)
     };
     var FU = function(a, b) {
         Q.call(this);
         this.j = b;
         this.g = null;
         this.l = new CU(a, b, this.j.ha, "videoDisplay1");
         Hs(this, this.l);
         var c = this.j.Fa;
         c != null && (this.g = new CU(a, b, c, "videoDisplay2"), Hs(this, this.g))
     };
     r(FU, Q);
     var HU = function(a, b) {
             var c = GU;
             if (c.g) return PS(c.g, a, 0, !0), Promise.resolve(c.g);
             c = ES(c.j).then(function(d) {
                 var e = d.serializedConfig;
                 var f = d.errorMessage;
                 if (e) e = Ny(e);
                 else throw Error(f != null ? f : "Unknown PPC error");
                 PS(e, a, d.latencyMs, !1);
                 return e
             }).catch(function(d) {
                 U.getInstance().report(189, {
                     message: d.message
                 });
                 return null
             });
             return Promise.race([c, Rx(b, null)])
         },
         GU = new function() {
             var a;
             this.j = a = a === void 0 ? JS : a
         };
     var IU = function(a, b) {
             this.g = a;
             this.j = b
         },
         JU = function(a, b, c) {
             var d = {};
             d.contentMediaUrl = a.g.Pd;
             d.customClickTrackingProvided = a.g.Lb != null;
             d.isAmp = tL();
             a: {
                 try {
                     var e = window.top.location.href
                 } catch (y) {
                     e = 2;
                     break a
                 }
                 e = e == null ? 2 : e == window.document.location.href ? 0 : 1
             }
             d.iframeState = e;
             d.imaHostingDomain = window.document.domain;
             d.imaHostingPageUrl = window.document.URL;
             d.topAccessiblePageUrl = sL();
             d.referrer = window.document.referrer;
             d.domLoadTime = c.Nb;
             d.sdkImplLoadTime = c.Rb;
             d.supportsResizing = !a.g.za();
             c = Oj().location.ancestorOrigins;
             d.topOrigin = c ? c.length > 0 && c[c.length - 1].length < 200 ? c[c.length - 1] : "" : null;
             d.osdId = a.j;
             d.usesCustomVideoPlayback = a.g.za();
             d.usesProxyMediaElement = a.g.Md();
             d.usesInlinePlayback = a.g.cg();
             c = a.g.Mc;
             a = [];
             var f = e = "";
             if (c != null) {
                 e = c;
                 f = !0;
                 f = f === void 0 ? !1 : f;
                 for (var g = [], h = 0; e && h < 25; ++h) {
                     var k = "";
                     f !== void 0 && f || (k = (k = e.nodeType !== 9 && e.id) ? "/" + k : "");
                     a: {
                         if (e && e.nodeName && e.parentElement) {
                             var l = e.nodeName.toString().toLowerCase();
                             for (var n = e.parentElement.childNodes, p = 0, q = 0; q < n.length; ++q) {
                                 var v = n[q];
                                 if (v.nodeName &&
                                     v.nodeName.toString().toLowerCase() === l) {
                                     if (e === v) {
                                         l = "." + p;
                                         break a
                                     }++p
                                 }
                             }
                         }
                         l = ""
                     }
                     g.push((e.nodeName && e.nodeName.toString().toLowerCase()) + k + l);
                     e = e.parentElement
                 }
                 e = g.join();
                 if (c) {
                     c = (c = c.ownerDocument) && (c.defaultView || c.parentWindow) || null;
                     f = [];
                     if (c) try {
                         var u = c.parent;
                         for (g = 0; u && u !== c && g < 25; ++g) {
                             var t = u.frames;
                             for (h = 0; h < t.length; ++h)
                                 if (c === t[h]) {
                                     f.push(h);
                                     break
                                 } c = u;
                             u = c.parent
                         }
                     } catch (y) {}
                     f = f.join()
                 } else f = ""
             }
             a.push(e, f);
             if (b != null) {
                 for (u = 0; u < jE.length - 1; ++u) a.push(ep(b, jE[u]) || "");
                 b = ep(b, "videoad_start_delay");
                 u = "";
                 b && (b = parseInt(b, 10), u = b < 0 ? "postroll" : b == 0 ? "preroll" : "midroll");
                 a.push(u)
             } else
                 for (b = 0; b < jE.length; ++b) a.push("");
             return d.videoAdKey = fp(a.join(":")).toString(), d
         };

     function KU() {
         var a, b, c, d = Oj();
         d = d === void 0 ? window : d;
         d = ((c = d === void 0 ? null : d) != null ? c : window).googletag;
         c = (d == null ? 0 : d.apiReady) ? d : void 0;
         return (b = c == null ? void 0 : (a = c.companionAds) == null ? void 0 : a.call(c)) != null ? b : null
     }

     function LU(a) {
         var b = {};
         b.slotId = a.getSlotId().getId();
         var c = [];
         a = w(a.getSizes() || []);
         for (var d = a.next(); !d.done; d = a.next())
             if (d = d.value, typeof d !== "string") {
                 var e = {};
                 c.push((e.adWidth = d.getWidth(), e.adHeight = d.getHeight(), e))
             } else d === "fluid" && (d = {}, c.push((d.fluidSize = !0, d)));
         return b.adSizes = c, b
     }

     function MU(a) {
         var b = KU();
         if (b && a && Array.isArray(a)) {
             var c = new Map(b.getSlots().map(function(q) {
                 return [q.getSlotId().getId(), q]
             }));
             a = w(a);
             for (var d = a.next(); !d.done; d = a.next()) {
                 var e = d.value,
                     f = c.get(e.slotId);
                 if (f && !b.isSlotAPersistentRoadblock(f)) {
                     var g = e.adContent;
                     if (g && (d = Kj(f.getSlotId().getDomId()))) {
                         d.style.display = "";
                         var h = e.adWidth,
                             k = e.adHeight;
                         e.fluidSize && (k = nk(d), h = k.width, k = k.height);
                         d.textContent = "";
                         if (e.friendlyIframeRendering) try {
                             var l = "google_companion_" + f.getSlotId().getId(),
                                 n = iE(d,
                                     l, h, k),
                                 p = n.contentWindow ? n.contentWindow.document : n.contentDocument;
                             Ic && p.open("text/html", "replace");
                             Qi(p, kG(g));
                             p.close()
                         } catch (q) {} else Oi(d, kG(g)), d.style.width = h + "px", d.style.height = k + "px";
                         b.slotRenderEnded(f, h, k);
                         (e = e.onAdContentSet) && e(d)
                     }
                 }
             }
         }
     };
     var NU = function(a, b, c, d, e, f) {
         IL.call(this, a, b, c, d, e);
         this.g = f
     };
     r(NU, IL);
     var OU = function(a, b) {
         R.call(this);
         this.A = a;
         this.o = b;
         this.g = {};
         this.j = new lG(this);
         Hs(this, this.j);
         this.j.listen(Oj(), "message", this.l)
     };
     r(OU, R);
     var PU = function(a, b) {
             var c = b.g;
             a.g.hasOwnProperty(c) && HL(a.g[c], b.type, b.messageType, b.qa)
         },
         QU = function(a, b, c, d) {
             a.g.hasOwnProperty(b) || (c = new vS(b, c), a.j.listen(c, a.A, function(e) {
                 this.dispatchEvent(new NU(e.type, e.messageType, e.qa, e.Qc, e.origin, b))
             }), c.g = d, c.connect(), a.g[b] = c)
         };
     OU.prototype.O = function() {
         for (var a = w(Object.values(this.g)), b = a.next(); !b.done; b = a.next()) Fs(b.value);
         R.prototype.O.call(this)
     };
     OU.prototype.l = function(a) {
         a = a.qc;
         var b = tS(a.data);
         if (b != null) {
             var c = b.channel;
             if (this.o && !this.g.hasOwnProperty(c)) {
                 var d = b.sid;
                 QU(this, c, d, a.source);
                 this.dispatchEvent(new NU(b.name, b.type, b.data || {}, d, a.origin, c))
             }
         }
     };

     function RU() {
         return !!Xa("googletag.cmd", Oj())
     }

     function SU() {
         var a = Xa("googletag.console", Oj());
         return a != null ? a : null
     }
     var TU = function() {
         lG.call(this);
         this.g = null;
         this.l = new OU("gpt", !0);
         Hs(this, this.l);
         this.listen(this.l, "gpt", this.A);
         RU() || Oj().top === Oj() || (this.g = new OU("gpt", !1), Hs(this, this.g), this.listen(this.g, "gpt", this.B))
     };
     r(TU, lG);
     TU.prototype.A = function(a) {
         var b = a.origin,
             c = "//imasdk.googleapis.com".match(ap);
         b = b.match(ap);
         if (c[3] == b[3] && c[4] == b[4])
             if (this.g != null) QU(this.g, a.g, a.Qc, Oj().parent), this.g != null && PU(this.g, a);
             else if (c = a.qa, c != null && c.scope !== void 0) {
             b = c.scope;
             c = c.args;
             var d;
             if (b === "proxy") {
                 var e = a.messageType;
                 e === "isGptPresent" ? d = RU() : e === "isConsolePresent" && (d = SU() != null)
             } else if (RU())
                 if (b === "pubads" || b === "companionAds") {
                     d = a.messageType;
                     var f = Oj().googletag;
                     if (f != null && f[b] != null && (b = f[b](), b != null && (d = b[d],
                             d != null))) try {
                         e = d.apply(b, c)
                     } catch (g) {}
                     d = e
                 } else if (b === "console") {
                 if (e = SU(), e != null && (b = e[a.messageType], b != null)) try {
                     b.apply(e, c)
                 } catch (g) {}
             } else b === null && (e = a.messageType, e === "googleGetCompanionAdSlots" ? (e = KU()) ? (e = e.getSlots().map(LU), d = e.length ? e : null) : d = null : (e === "googleSetCompanionAdContents" && MU(c == null ? void 0 : c[0]), d = null));
             d !== void 0 && (a.qa.returnValue = d, PU(this.l, a))
         }
     };
     TU.prototype.B = function(a) {
         PU(this.l, a)
     };
     var UU = function(a, b) {
         if (a.g) {
             var c = a.g;
             Fs(c.g[b]);
             delete c.g[b]
         }
         a.l && (a = a.l, Fs(a.g[b]), delete a.g[b])
     };
     var WU = function(a, b) {
             var c = Array.prototype.slice.call(arguments),
                 d = c.shift();
             if (typeof d == "undefined") throw Error("[goog.string.format] Template required");
             return d.replace(/%([0\- \+]*)(\d+)?(\.(\d+))?([%sfdiu])/g, function(e, f, g, h, k, l, n, p) {
                 if (l == "%") return "%";
                 var q = c.shift();
                 if (typeof q == "undefined") throw Error("[goog.string.format] Not enough arguments");
                 arguments[0] = q;
                 return VU[l].apply(null, arguments)
             })
         },
         VU = {
             s: function(a, b, c) {
                 return isNaN(c) || c == "" || a.length >= Number(c) ? a : a = b.indexOf("-", 0) > -1 ?
                     a + Ui(" ", Number(c) - a.length) : Ui(" ", Number(c) - a.length) + a
             },
             f: function(a, b, c, d, e) {
                 d = a.toString();
                 isNaN(e) || e == "" || (d = parseFloat(a).toFixed(e));
                 var f = Number(a) < 0 ? "-" : b.indexOf("+") >= 0 ? "+" : b.indexOf(" ") >= 0 ? " " : "";
                 Number(a) >= 0 && (d = f + d);
                 if (isNaN(c) || d.length >= Number(c)) return d;
                 d = isNaN(e) ? Math.abs(Number(a)).toString() : Math.abs(Number(a)).toFixed(e);
                 a = Number(c) - d.length - f.length;
                 return d = b.indexOf("-", 0) >= 0 ? f + d + Ui(" ", a) : f + Ui(b.indexOf("0", 0) >= 0 ? "0" : " ", a) + d
             },
             d: function(a, b, c, d, e, f, g, h) {
                 return VU.f(parseInt(a,
                     10), b, c, d, 0, f, g, h)
             }
         };
     VU.i = VU.d;
     VU.u = VU.d;

     function XU() {
         return ["autoplay", "attribution-reporting"].filter(function(a) {
             var b = document.featurePolicy;
             return b !== void 0 && typeof b.allowedFeatures == "function" && typeof b.allowedFeatures() == "object" && b.allowedFeatures().includes(a)
         }).join(";")
     }

     function YU(a, b, c) {
         var d, e, f, g, h, k, l, n, p, q, v, u;
         return Oa(function(t) {
             if (t.g == 1) return d = new kU, Da(t, ZL(a), 2);
             if (t.g != 3) return e = t.j, g = LK("", e, (f = Ko()) == null ? void 0 : kg(f, 2)), l = k = h = null, n = {}, p = JU(b, "", {
                 Nb: c.Nb,
                 Rb: c.Rb
             }), q = new IT, v = null, Da(t, HU(null, 1E3), 3);
             u = t.j;
             return t.return(jU(d, e, g, h, u, k, l, n, p, q, v))
         })
     }
     var $U = function(a, b, c) {
         c = c === void 0 ? !1 : c;
         R.call(this);
         this.A = b;
         this.U = c;
         this.Rb = this.Nb = this.tc = null;
         this.G = !1;
         this.F = "goog_" + Wi++;
         this.o = new Map;
         this.g = null;
         c = Oj();
         var d = Xa("google.ima.gptProxyInstance", c);
         d != null ? c = d : (d = new TU, z("google.ima.gptProxyInstance", d, c), c = d);
         this.Z = c;
         this.C = null;
         this.l = new lG(this);
         Hs(this, this.l);
         this.Qd = um();
         c = this.F;
         var e = (bj() ? "https:" : "http:") + WU("//imasdk.googleapis.com/js/core/bridge3.728.0_%s.html", S.getLocale());
         d = new URL(e, window.location.href);
         this.U && d.searchParams.append("gdpr",
             "1");
         a: {
             var f = window;
             try {
                 do {
                     try {
                         if (f.location.href.indexOf(e) === 0 || f.document.referrer.indexOf(e) === 0) {
                             var g = !0;
                             break a
                         }
                     } catch (l) {}
                     f = f.parent
                 } while (f !== f.top)
             } catch (l) {}
             g = !1
         }
         g && d.searchParams.append("f", c);
         e = Jo();
         var h, k;
         f = {};
         g = (f.experimentStateProto = (k = (h = E(e, Go, 1)) == null ? void 0 : h.ba()) != null ? k : "", f);
         h = rg(e, 2);
         k = lg(e, 5);
         e = {};
         h = (e.deid = tm(), e.eventfe_experiment_ids = [].concat(ua(h)), e.fid = c, e.genotype_experiment_data = g, e.imalib_experiments = Yn(), e.is_eap_loader = !1, e.managed_js_experiment_id = k, e.pvsid =
             lj(), e.top_accessible_page_url = sL(), e);
         ZS(d, h);
         d = d.toString();
         h = window.document;
         if (No.length && h.head)
             for (k = w(No), g = k.next(); !g.done; g = k.next())(g = g.value) && h.head && (e = mj("META"), h.head.appendChild(e), e.httpEquiv = "origin-trial", e.content = g);
         h = XU();
         c = Rj("IFRAME", {
             src: d,
             allowFullscreen: !0,
             allow: h,
             id: c,
             style: "border:0; opacity:0; margin:0; padding:0; position:relative; color-scheme: light;",
             title: "Advertisement"
         });
         this.l.Gc(c, "load", this.fa);
         a.appendChild(c);
         this.frameElement = c;
         this.j = ZU(this);
         this.H =
             new YL(window);
         Hs(this, this.H);
         this.V = new IU(this.A, null);
         this.K = new wU(this.j, navigator);
         Hs(this, this.K);
         c = this.K;
         c.g.j.set("auction", c.j);
         this.M = new FU(this.j, this.A);
         Hs(this, this.M);
         this.A.ha && this.l.listen(this.j, "displayContainer", this.P);
         this.l.listen(this.j, "mouse", this.ca);
         this.l.listen(this.j, "touch", this.da);
         c = b.Md();
         $r() || Nb(Sb(), "CrKey") && Nb(Sb(), "SmartSpeaker") || Nb(Sb(), "Edge/18.") || c || (this.C = new yU(a, this.j, b.ha.g), Hs(this, this.C))
     };
     r($U, R);
     var ZU = function(a, b) {
         b = b === void 0 ? "*" : b;
         var c = a.o.get(b);
         c == null && (c = new vS(a.F, b), a.G && (c.g = Uj(a.frameElement), c.connect()), a.o.set(b, c));
         return c
     };
     $U.prototype.Rc = function(a) {
         var b;
         (b = this.C) != null && (a = a.g, b.A = a, b.g && (b = b.g, b.j = a, lT(b, a)))
     };
     $U.prototype.O = function() {
         this.g !== null && (this.g.dispose(), this.g = null);
         this.o.forEach(function(a) {
             Fs(a)
         });
         this.o.clear();
         UU(this.Z, this.F);
         Sj(this.frameElement);
         R.prototype.O.call(this)
     };
     $U.prototype.ca = function(a) {
         var b = a.qa,
             c = ik(this.frameElement),
             d = document.createEvent("MouseEvent");
         d.initMouseEvent(a.messageType, !0, !0, window, b.detail, b.screenX, b.screenY, b.clientX + c.x, b.clientY + c.y, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, b.button, null);
         this.frameElement.dispatchEvent(d)
     };
     var aV = function(a, b) {
         var c = ik(a.frameElement),
             d = !!("TouchEvent" in window && TouchEvent.length > 0);
         b = b.map(function(f) {
             return d ? new Touch({
                 identifier: f.identifier,
                 target: a.frameElement,
                 clientX: f.clientX,
                 clientY: f.clientY,
                 screenX: f.screenX,
                 screenY: f.screenY,
                 pageX: f.pageX + c.x,
                 pageY: f.pageY + c.y
             }) : document.createTouch(window, a.frameElement, f.identifier, f.pageX + c.x, f.pageY + c.y, f.screenX, f.screenY)
         });
         if (d) return b;
         var e;
         return (e = document.createTouchList) == null ? void 0 : e.apply(document, b)
     };
     $U.prototype.da = function(a) {
         var b = a.qa,
             c = ik(this.frameElement);
         if ("TouchEvent" in window && TouchEvent.length > 0) b = {
             bubbles: !0,
             cancelable: !0,
             view: window,
             detail: b.detail,
             ctrlKey: b.ctrlKey,
             altKey: b.altKey,
             shiftKey: b.shiftKey,
             metaKey: b.metaKey,
             touches: aV(this, b.touches),
             targetTouches: aV(this, b.targetTouches),
             changedTouches: aV(this, b.changedTouches)
         }, a = new TouchEvent(a.messageType, b), this.frameElement.dispatchEvent(a);
         else {
             var d = document.createEvent("TouchEvent");
             d.initTouchEvent(a.messageType, !0, !0, window,
                 b.detail, b.screenX, b.screenY, b.clientX + c.x, b.clientY + c.y, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, aV(this, b.touches), aV(this, b.targetTouches), aV(this, b.changedTouches), b.scale, b.rotation);
             this.frameElement.dispatchEvent(d)
         }
     };
     $U.prototype.P = function(a) {
         switch (a.messageType) {
             case "showVideo":
                 this.g == null ? (this.g = new wS, this.l.listen(this.g, "click", this.ga)) : AS(this.g);
                 yS(this.g, this.A.zc());
                 break;
             case "hide":
                 this.g !== null && (this.g.dispose(), this.g = null)
         }
         var b = this.M;
         DU(b.l, a);
         b.g && DU(b.g, a)
     };
     $U.prototype.ga = function() {
         HL(this.j, "displayContainer", "videoClick")
     };
     $U.prototype.fa = function() {
         var a = this,
             b, c, d;
         return Oa(function(e) {
             if (e.g == 1) {
                 a.Nb = xm();
                 a.Rb = um();
                 b = Uj(a.frameElement);
                 a.o.forEach(function(f) {
                     f.g = b;
                     f.connect()
                 });
                 (c = a.C) != null && (c.o = b, BU(c));
                 a.G = !0;
                 if (!op(eE)) {
                     op(bE) && (a.tc = um(), HL(a.j, "bridgeInitialize", "connect"));
                     e.g = 0;
                     return
                 }
                 return Da(e, YU(a.H, a.V, a), 3)
             }
             d = e.j;
             a.tc = um();
             HL(a.j, "bridgeInitialize", "connect", d);
             e.g = 0
         })
     };
     var bV = wa(["https://s0.2mdn.net/instream/video/client.js"]),
         cV = null,
         dV = function() {
             R.call(this);
             this.g = null;
             this.j = new Map;
             this.l = new Map;
             this.Da = this.C = !1;
             this.o = null;
             this.A = new lG(this);
             Hs(this, this.A)
         };
     r(dV, R);
     var eV = function() {
             cV == null && (cV = new dV);
             return cV
         },
         Ew = function(a, b, c) {
             var d = {};
             d.queryId = b;
             d.viewabilityData = c;
             a.g && HL(a.g, "activityMonitor", "viewabilityMeasurement", d)
         };
     dV.prototype.destroy = function() {
         this.A.ab(this.g, "activityMonitor", this.F);
         this.Da = !1;
         this.j.clear()
     };
     dV.prototype.O = function() {
         this.destroy();
         R.prototype.O.call(this)
     };
     dV.prototype.init = function(a) {
         if (!this.Da) {
             if (this.g = a || null) this.A.listen(this.g, "activityMonitor", this.F), fV(this);
             if (!(x.ima && x.ima.video && x.ima.video.client && x.ima.video.client.tagged)) {
                 z("ima.video.client.sdkTag", !0);
                 var b = x.document;
                 a = mj("SCRIPT");
                 var c = ij(bV);
                 Ni(a, c);
                 a.async = !0;
                 a.type = "text/javascript";
                 b = b.getElementsByTagName("script")[0];
                 b.parentNode.insertBefore(a, b)
             }
             eq();
             K(uw).K = S.g;
             this.C = !0;
             K(uw).l = !0;
             this.o = null;
             a = K(uw);
             b = ew(a) == "h" || ew(a) == "b";
             c = !(dq(), !1);
             b && c && (a.F = !0, a.H = new yu);
             this.Da = !0
         }
     };
     var hV = function(a) {
             if (a == null) return !1;
             if ((Mc || Oc) && a.webkitDisplayingFullscreen !== null) return a.webkitDisplayingFullscreen;
             a = gV(a);
             var b = window.screen.availHeight || window.screen.height;
             return (window.screen.availWidth || window.screen.width) - a.width <= 0 && b - a.height <= 42
         },
         gV = function(a) {
             var b = {
                 left: a.offsetLeft,
                 top: a.offsetTop,
                 width: a.offsetWidth,
                 height: a.offsetHeight
             };
             try {
                 typeof a.getBoundingClientRect === "function" && Tj(Ij(a), a) && (b = a.getBoundingClientRect())
             } catch (c) {}
             return b
         },
         iV = function(a, b, c, d, e) {
             e =
                 e === void 0 ? {} : e;
             if (a.Da) {
                 d && e.opt_osdId == null && (e.opt_osdId = d);
                 if (a.o) return a.o(b, c, e);
                 if (a = d ? a.l.get(d) : S.j) e.opt_fullscreen == null && (e.opt_fullscreen = hV(a)), e.opt_adElement == null && (e.opt_adElement = a);
                 return dz.Qb(469, ob(Gw, b, c, e)) || {}
             }
             return {}
         },
         jV = function(a) {
             var b;
             S.g !== 0 ? b = K(uw).l : b = a.C;
             return b
         },
         kV = function(a, b) {
             var c = String(Math.floor(Math.random() * 1E9));
             a.l.set(c, b);
             S.g !== 0 && (K(uw).o[c] = a);
             return c
         },
         lV = function(a, b, c) {
             if (c) a.j.get(c) === b && a.j.delete(c);
             else {
                 var d = [];
                 a.j.forEach(function(e,
                     f) {
                     e === b && d.push(f)
                 });
                 d.forEach(a.j.delete, a.j)
             }
         },
         Aw = function(a, b) {
             a = a.j.get(b);
             return typeof a === "function" ? a() : {}
         },
         fV = function(a) {
             if (typeof window.Goog_AdSense_Lidar_getUrlSignalsArray === "function") {
                 var b = {};
                 b.pageSignals = window.Goog_AdSense_Lidar_getUrlSignalsArray();
                 var c;
                 (c = a.g) == null || HL(c, "activityMonitor", "pageSignals", b)
             }
         };
     dV.prototype.F = function(a) {
         var b = a.qa,
             c = b.queryId,
             d = {},
             e = null;
         d.eventId = b.eventId;
         switch (a.messageType) {
             case "getPageSignals":
                 fV(this);
                 break;
             case "reportVastEvent":
                 e = b.vastEvent;
                 a = b.osdId;
                 var f = {};
                 f.opt_fullscreen = b.isFullscreen;
                 b.isOverlay && (f.opt_bounds = b.overlayBounds);
                 d.viewabilityData = iV(this, e, c, a, f);
                 var g;
                 (g = this.g) == null || HL(g, "activityMonitor", "viewability", d);
                 break;
             case "fetchAdTagUrl":
                 c = {}, c.eventId = b.eventId, a = b.osdId, yj(b, "isFullscreen") && (e = b.isFullscreen), yj(b, "loggingId") && (b = b.loggingId,
                     c.loggingId = b, U.getInstance().report(43, {
                         step: "beforeLookup",
                         logid: b,
                         time: Date.now()
                     })), c.engagementString = mV(this, a, e), this.g && HL(this.g, "activityMonitor", "engagement", c)
         }
     };
     var mV = function(a, b, c) {
         var d, e = b ? (d = a.l.get(b)) != null ? d : null : S.j;
         a = {};
         c != null && (a.fullscreen = c);
         c = "";
         try {
             c = gy(function() {
                 return e
             }, a)
         } catch (f) {
             c = f, c = "sdktle;" + Ti(c.name, 12) + ";" + Ti(c.message, 40)
         }
         return c
     };
     z("ima.common.getVideoMetadata", function(a) {
         return Aw(eV(), a)
     });
     z("ima.common.triggerViewabilityMeasurementUpdate", function(a, b) {
         Ew(eV(), a, b)
     });

     function nV(a, b) {
         return a && b ? a.some(function(c) {
             return b.includes(c)
         }) : !1
     }
     var oV = HF(0, 0, 5, 5);

     function pV(a, b) {
         try {
             if ("removeAttribute" in a) return a.removeAttribute(b), !0
         } catch (c) {}
         return !1
     }
     var qV = function(a) {
         SJ.call(this, a);
         this.C = this.ga = null;
         this.K = this.Z = this.H = !1;
         this.ca = this.G = this.M = this.o = null;
         this.fa = !1;
         this.F = this.ra = null;
         this.P = 0;
         this.size = this.getSize();
         this.fullscreen = this.je()
     };
     r(qV, SJ);
     var EU = function(a, b, c, d) {
             if (op(eE)) {
                 if (a.g.src !== "" && (nV(d, a.ra) || a.g.src === b)) {
                     a.Ff(null);
                     a.P = 1;
                     return
                 }
                 a.g.src !== "" ? (a.unload(), a.P = 3) : a.P = 2;
                 a.ra = d
             }
             d = L.getInstance().g;
             d.K = !0;
             d.o();
             Qm("hvd_lc");
             rV(a);
             (Pc || VF()) && pV(a.g, "crossOrigin");
             a.Z = !1;
             if (c)
                 if (Qm("hvd_ad"), c instanceof mE) {
                     if (Qm("hvd_mad"), d = c.getMediaUrl()) {
                         Qm("hvd_admu");
                         sV(a, d);
                         return
                     }
                 } else if (c instanceof lE) {
                 Qm("hvd_dad");
                 d = c.o;
                 var e = c.j,
                     f = c.l,
                     g = c.g,
                     h = c.Gb,
                     k = c.rb;
                 if (d && e && f && g && h && k && (Qm("hvd_addu"), c.Pa)) {
                     Qm("hvd_admse");
                     c = f + '; codecs="' +
                         h + '"';
                     g = g + '; codecs="' + k + '"';
                     if (window.MediaSource && vI(c) && vI(g)) {
                         Qm("hvd_ymse");
                         Qm("hvd_mse");
                         k = !1;
                         try {
                             window.location.search.indexOf("goog_limavideo=true") !== -1 && (k = !0)
                         } catch (l) {}
                         b = a.g;
                         x.customElements ? k ? k = !0 : (op(YD) && U.getInstance().report(153, {
                             limvid: "vd"
                         }), k = op(YD) ? !0 : !1) : k = !1;
                         k && b instanceof AJ ? (b.wb = d, b.Mb = e) : (a.ga = new gK(b, [new YI(d, c, 35E4, new TJ), new YI(e, g, 82E3, new TJ)]), Hs(a, a.ga), a = a.ga, a.j || (a.j = Ci(a.g).toString()), a = a.j, b.src = a);
                         b.load();
                         return
                     }
                     Qm("hvd_nmse")
                 }
             } else Qm("hvd_uad");
             b ? sV(a,
                 b) : (Qm("hvd_vn"), a.g.load())
         },
         sV = function(a, b) {
             Qm("hvd_src");
             a = a.g;
             a.src = b;
             a.load()
         };
     m = qV.prototype;
     m.unload = function() {
         rV(this);
         this.Z = !1;
         var a = this.g;
         pV(this.g, "src") || (a.src = "");
         this.ra = null;
         a.load()
     };
     m.setVolume = function(a) {
         var b = this.g;
         b.volume = Math.max(a, 0);
         b.muted = a === 0 ? !0 : !1
     };
     m.Ge = function(a) {
         var b = this.g;
         b.style.left = String(a.left) + "px";
         b.style.top = String(a.top) + "px";
         b.style.width = String(a.width) + "px";
         b.style.height = String(a.height) + "px"
     };
     m.He = function() {
         var a = this.g;
         a.style.width = "100%";
         a.style.height = "100%";
         a.style.left = "0";
         a.style.right = "0"
     };
     m.play = function() {
         var a = this;
         this.fa = !1;
         if (!this.Z && !Yb()) return this.K = !0, Promise.resolve();
         this.K = !1;
         this.o = this.g.play();
         return this.o != null ? (this.M = null, this.o.then(function() {
             a.o = null;
             a.Cd(a.M);
             a.M = null
         }).catch(function(b) {
             a.o = null;
             var c = "";
             b != null && b.name != null && (c = b.name);
             c === "AbortError" || c === "NotAllowedError" ? a.dispatchEvent("autoplayDisallowed") : a.Wb()
         })) : Promise.resolve()
     };
     m.pause = function() {
         this.o == null && (this.fa = !0, this.g.pause())
     };
     m.yf = function() {
         var a = this.g;
         return a.paused ? Pc || Zc ? a.currentTime < a.duration : !0 : !1
     };
     m.je = function() {
         return hV(this.g)
     };
     m.getSize = function() {
         return new qj(this.g.offsetWidth, this.g.offsetHeight)
     };
     m.O = function() {
         this.ca && OF(this.ca);
         this.rc();
         SJ.prototype.O.call(this)
     };
     m.Ye = function() {
         this.rc();
         var a = this.g;
         this.j.listen(a, YS, this.Uh);
         this.j.listen(a, "ended", this.se);
         this.j.listen(a, "webkitbeginfullscreen", this.ee);
         this.j.listen(a, "webkitendfullscreen", this.Ef);
         this.j.listen(a, "loadedmetadata", this.Ff);
         this.j.listen(a, "pause", this.ue);
         this.j.listen(a, "playing", this.Cd);
         this.j.listen(a, "timeupdate", this.ve);
         this.j.listen(a, "volumechange", this.Hf);
         this.j.listen(a, "error", this.Wb);
         this.j.listen(a, Yc || Pc && (!Pc || !UF(SF, 8)) ? "loadeddata" : "canplay", this.te);
         this.C = new wS;
         this.j.listen(this.C, "click", this.tg);
         yS(this.C, a);
         this.G = new Px(1E3);
         this.j.listen(this.G, "tick", this.ub);
         this.G.start()
     };
     m.rc = function() {
         this.C != null && (AS(this.C), this.C = null);
         this.G != null && this.G.dispose();
         pG(this.j);
         rV(this)
     };
     var rV = function(a) {
         a.loaded = !1;
         a.l = !1;
         a.H = !1;
         a.K = !1;
         a.A = 0;
         a.o = null;
         a.M = null;
         a.P = 0;
         Fs(a.F)
     };
     m = qV.prototype;
     m.Uh = function(a) {
         this.dispatchEvent(a.type)
     };
     m.Ic = function() {
         if (!this.l) {
             this.l = !0;
             this.dispatchEvent("start");
             try {
                 if (op(YD) && x.customElements) {
                     var a = x.customElements.get("lima-video");
                     this.g instanceof a ? U.getInstance().report(153, {
                         limvid: "limastart"
                     }) : U.getInstance().report(153, {
                         limvid: "videostart"
                     })
                 }
             } catch (b) {
                 U.getInstance().report(153, {
                     limvid: "startfail"
                 })
             }
         }
     };
     m.Ff = function() {
         this.Z = !0;
         this.K && this.play();
         this.K = !1;
         tV(this)
     };
     m.Cd = function(a) {
         this.o != null ? this.M = a : (this.dispatchEvent("play"), Pc || VF() || Yc || this.Ic())
     };
     m.ve = function(a) {
         if (!this.l && (Pc || VF() || Yc)) {
             if (this.getCurrentTime() <= 0) return;
             if (Yc && this.g.ended && this.getDuration() === 1) {
                 this.Wb(a);
                 return
             }
             this.Ic()
         }
         if (Pc || Nb(Sb(), "Nintendo WiiU")) {
             if (this.getCurrentTime() - this.A > 1.5) {
                 this.H = !0;
                 this.g.currentTime = this.A;
                 return
             }
             this.H = !1;
             this.getCurrentTime() > this.A && (this.A = this.getCurrentTime())
         }
         this.dispatchEvent("timeUpdate")
     };
     m.ue = function() {
         if (this.l && Pc && !this.fa && (uV(this) < 2 || this.H)) {
             this.F = new Px(250);
             this.j.listen(this.F, "tick", this.bb);
             this.F.start();
             var a = !0
         } else a = !1;
         a || this.o || this.dispatchEvent("pause")
     };
     m.se = function() {
         var a = !0;
         if (Pc || Nb(Sb(), "Nintendo WiiU")) a = this.A >= this.g.duration - 1.5;
         !this.H && a && this.dispatchEvent("end")
     };
     m.Ef = function() {
         this.dispatchEvent("endFullscreen")
     };
     m.Wb = function() {
         this.dispatchEvent("error")
     };
     m.tg = function() {
         this.dispatchEvent("click")
     };
     var tV = function(a) {
         var b = a.g;
         b instanceof HTMLElement && (a.ca = NF(b, oV), a.ca.then(function(c) {
             a.Ia() || M(L.getInstance(), "ps", c.width + "x" + c.height)
         }))
     };
     qV.prototype.ub = function() {
         var a = this.getSize(),
             b = this.je();
         if (a.width !== this.size.width || a.height !== this.size.height) !this.fullscreen && b ? this.dispatchEvent("beginFullscreen") : this.fullscreen && !b && this.Ef(), this.size = a, this.fullscreen = b
     };
     qV.prototype.bb = function() {
         if (this.g.ended || !this.yf()) Fs(this.F);
         else {
             var a = this.g;
             a = a.duration - a.currentTime;
             var b = uV(this);
             b > 0 && (b >= 2 || a < 2) && (Fs(this.F), this.play())
         }
     };
     var uV = function(a) {
         var b;
         a: {
             for (b = a.g.buffered.length - 1; b >= 0; b--)
                 if (a.g.buffered.start(b) <= a.g.currentTime) {
                     b = a.g.buffered.end(b);
                     break a
                 } b = 0
         }
         return b - a.g.currentTime
     };
     qV.prototype.ee = function() {
         U.getInstance().report(139);
         this.dispatchEvent("beginFullscreen")
     };
     var yV = function(a) {
             if (a instanceof vV || a instanceof wV || a instanceof xV) return a;
             if (typeof a.next == "function") return new vV(function() {
                 return a
             });
             if (typeof a[Symbol.iterator] == "function") return new vV(function() {
                 return a[Symbol.iterator]()
             });
             if (typeof a.Xb == "function") return new vV(function() {
                 return a.Xb()
             });
             throw Error("Not an iterator or iterable.");
         },
         vV = function(a) {
             this.g = a
         };
     vV.prototype.Xb = function() {
         return new wV(this.g())
     };
     vV.prototype[Symbol.iterator] = function() {
         return new xV(this.g())
     };
     vV.prototype.j = function() {
         return new xV(this.g())
     };
     var wV = function(a) {
         this.g = a
     };
     r(wV, tt);
     wV.prototype.next = function() {
         return this.g.next()
     };
     wV.prototype[Symbol.iterator] = function() {
         return new xV(this.g)
     };
     wV.prototype.j = function() {
         return new xV(this.g)
     };
     var xV = function(a) {
         vV.call(this, function() {
             return a
         });
         this.l = a
     };
     r(xV, vV);
     xV.prototype.next = function() {
         return this.l.next()
     };
     var zV = function(a, b) {
         this.j = {};
         this.g = [];
         this.l = this.size = 0;
         var c = arguments.length;
         if (c > 1) {
             if (c % 2) throw Error("Uneven number of arguments");
             for (var d = 0; d < c; d += 2) this.set(arguments[d], arguments[d + 1])
         } else if (a)
             if (a instanceof zV)
                 for (c = a.cd(), d = 0; d < c.length; d++) this.set(c[d], a.get(c[d]));
             else
                 for (d in a) this.set(d, a[d])
     };
     zV.prototype.ac = function() {
         AV(this);
         for (var a = [], b = 0; b < this.g.length; b++) a.push(this.j[this.g[b]]);
         return a
     };
     zV.prototype.cd = function() {
         AV(this);
         return this.g.concat()
     };
     zV.prototype.has = function(a) {
         return BV(this.j, a)
     };
     zV.prototype.equals = function(a, b) {
         if (this === a) return !0;
         if (this.size != a.size) return !1;
         b = b || CV;
         AV(this);
         for (var c, d = 0; c = this.g[d]; d++)
             if (!b(this.get(c), a.get(c))) return !1;
         return !0
     };
     var CV = function(a, b) {
         return a === b
     };
     zV.prototype.isEmpty = function() {
         return this.size == 0
     };
     zV.prototype.clear = function() {
         this.j = {};
         this.l = this.size = this.g.length = 0
     };
     zV.prototype.remove = function(a) {
         return this.delete(a)
     };
     zV.prototype.delete = function(a) {
         return BV(this.j, a) ? (delete this.j[a], --this.size, this.l++, this.g.length > 2 * this.size && AV(this), !0) : !1
     };
     var AV = function(a) {
         if (a.size != a.g.length) {
             for (var b = 0, c = 0; b < a.g.length;) {
                 var d = a.g[b];
                 BV(a.j, d) && (a.g[c++] = d);
                 b++
             }
             a.g.length = c
         }
         if (a.size != a.g.length) {
             b = {};
             for (d = c = 0; c < a.g.length;) {
                 var e = a.g[c];
                 BV(b, e) || (a.g[d++] = e, b[e] = 1);
                 c++
             }
             a.g.length = d
         }
     };
     m = zV.prototype;
     m.get = function(a, b) {
         return BV(this.j, a) ? this.j[a] : b
     };
     m.set = function(a, b) {
         BV(this.j, a) || (this.size += 1, this.g.push(a), this.l++);
         this.j[a] = b
     };
     m.forEach = function(a, b) {
         for (var c = this.cd(), d = 0; d < c.length; d++) {
             var e = c[d],
                 f = this.get(e);
             a.call(b, f, e, this)
         }
     };
     m.keys = function() {
         return yV(this.Xb(!0)).j()
     };
     m.values = function() {
         return yV(this.Xb(!1)).j()
     };
     m.entries = function() {
         var a = this;
         return DF(this.keys(), function(b) {
             return [b, a.get(b)]
         })
     };
     m.Xb = function(a) {
         AV(this);
         var b = 0,
             c = this.l,
             d = this,
             e = new tt;
         e.next = function() {
             if (c != d.l) throw Error("The map has changed since the iterator was created");
             if (b >= d.g.length) return ut;
             var f = d.g[b++];
             return {
                 value: a ? f : d.j[f],
                 done: !1
             }
         };
         return e
     };
     var BV = function(a, b) {
         return Object.prototype.hasOwnProperty.call(a, b)
     };
     var EV = function() {
         R.call(this);
         this.currentTime = this.o = 0;
         this.duration = NaN;
         this.j = !0;
         this.F = !1;
         this.volume = 1;
         this.muted = !1;
         this.K = 1;
         this.playbackRate = 0;
         this.g = null;
         this.A = 0;
         this.P = 4;
         this.C = this.l = null;
         this.buffered = new DV;
         this.M = new DV;
         this.H = "";
         this.tagName = "VIDEO";
         this.height = this.width = 0;
         this.canPlayType = function() {
             return ""
         };
         this.G = new lG(this);
         Hs(this, this.G);
         var a = BK(S);
         a && (this.duration = yK(a))
     };
     r(EV, R);
     var FV = function() {
         var a = ["video/mp4"],
             b = ["video/ogg"],
             c = new EV;
         c.canPlayType = function(d) {
             return a.includes(d) ? "probably" : b.includes(d) ? "maybe" : ""
         };
         return c
     };
     EV.prototype.play = function() {
         GV(this);
         return null
     };
     var GV = function(a) {
         a.F && (a.currentTime = 0, a.dispatchEvent("timeupdate"));
         a.j && (a.j = !1, a.dispatchEvent("play"), a.o = a.P, a.o <= 2 ? a.dispatchEvent("waiting") : a.dispatchEvent("playing"));
         if (a.g === null || a.g.Ia()) a.g = new Px(10), Hs(a, a.g), a.g.listen("tick", function() {
             var b = pb() - a.A,
                 c = a.currentTime + b / 1E3;
             a.A += b;
             a.o > 2 && (a.currentTime = Math.min(c, a.duration));
             a.dispatchEvent("timeupdate");
             if (a.currentTime === a.duration) {
                 a.j = !0;
                 a.F = !0;
                 var d;
                 (d = a.g) == null || d.stop();
                 a.dispatchEvent("ended")
             }
         });
         a.A = pb();
         a.g.start()
     };
     m = EV.prototype;
     m.pause = function() {
         if (!this.j) {
             var a;
             (a = this.g) == null || a.stop();
             this.j = !0;
             this.dispatchEvent("timeupdate");
             this.dispatchEvent("pause")
         }
     };
     m.load = function() {
         this.o = 0;
         this.j = !0;
         this.dispatchEvent("loadstart");
         var a;
         isNaN(this.duration) ? a = 10 + Math.random() * 20 : a = this.duration;
         this.duration = Number(a);
         this.dispatchEvent("durationchange");
         a = this.M;
         a.g.push(new HV(this.duration));
         a.length = a.g.length;
         a = this.buffered;
         a.g.push(new HV(this.duration));
         a.length = a.g.length;
         this.dispatchEvent("loadedmetadata");
         this.currentTime > 0 && this.dispatchEvent("timeupdate");
         this.dispatchEvent("loadeddata");
         this.dispatchEvent("canplay");
         this.dispatchEvent("canplaythrough");
         this.dispatchEvent("progress");
         this.playbackRate = this.K
     };
     m.setVolume = function(a) {
         this.volume = a;
         this.dispatchEvent("volumechange")
     };
     m.setAttribute = function(a, b) {
         a != null && IV.set(a, b)
     };
     m.getAttribute = function(a) {
         return IV.get(a)
     };
     m.Zh = function(a) {
         var b = null,
             c = null;
         switch (a.type) {
             case "loadeddata":
                 b = "Loaded";
                 break;
             case "playing":
                 b = "Playing";
                 c = "#00f";
                 break;
             case "pause":
                 b = "Paused";
                 break;
             case "ended":
                 b = "Ended", c = "#000"
         }
         b && this.C && (this.C.innerText = b);
         c && this.l && (this.l.style.backgroundColor = c)
     };
     ha.Object.defineProperties(EV.prototype, {
         src: {
             configurable: !0,
             enumerable: !0,
             get: function() {
                 return this.H
             },
             set: function(a) {
                 this.H = a
             }
         }
     });
     var IV = new zV,
         HV = function(a) {
             this.startTime = 0;
             this.endTime = a
         },
         DV = function() {
             this.length = 0;
             this.g = []
         };
     DV.prototype.start = function(a) {
         return this.g[a].startTime
     };
     DV.prototype.end = function(a) {
         return this.g[a].endTime
     };
     var KV = function(a) {
         Q.call(this);
         this.o = a;
         this.g = this.j = null;
         this.l = JV(this);
         this.j = document.createElement("div");
         this.j.style.display = "none";
         this.o.appendChild(this.j);
         this.j.appendChild(this.l);
         this.g = document.createElement("div");
         this.g.style.position = "absolute";
         this.g.style.width = "100%";
         this.g.style.height = "100%";
         this.g.style.left = "0px";
         this.g.style.top = "0px";
         this.j.appendChild(this.g);
         oJ(function() {
             M(L.getInstance(), "haob", "1")
         })
     };
     r(KV, Q);
     KV.prototype.initialize = function() {
         this.l && this.l.load()
     };
     KV.prototype.O = function() {
         Sj(this.j);
         Q.prototype.O.call(this)
     };
     var JV = function(a) {
             var b = BK(S);
             if (xK(b, "useVideoElementFake")) a = FV(), b = Rj("DIV", {
                 style: "position:absolute;width:100%;height:100%;top:0px;left:0px;"
             }), Object.assign(b, a), a.l = Rj("DIV", {
                 style: "position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:#000"
             }), a.C = Rj("P", {
                 style: "position:absolute;top:25%;margin-left:10px;font-size:24px;color:#fff;"
             }), a.l.appendChild(a.C), b.appendChild(a.l), a.G.listen(a, ["loadeddata", "playing", "pause", "ended"], a.Zh), a = b;
             else {
                 b = !1;
                 try {
                     window.location.search.indexOf("goog_limavideo=true") !==
                         -1 && (b = !0)
                 } catch (c) {}
                 if (LV(a, b)) {
                     b && console.log("force lima video in wrapper");
                     a = null;
                     try {
                         a = new AJ
                     } catch (c) {
                         a = document.createElement("lima-video"), op(YD) && U.getInstance().report(153, {
                             limvid: "firefail"
                         })
                     }
                     a.style.backgroundColor = "#000";
                     a.style.height = "100%";
                     a.style.width = "100%";
                     a.style.position = "absolute";
                     a.style.left = "0";
                     a.style.top = "0"
                 } else a = document.createElement("video"), a.style.backgroundColor = "#000", a.style.height = "100%", a.style.width = "100%", a.style.position = "absolute", a.style.left = "0", a.style.top =
                     "0", a.title = "Advertisement".toString()
             }
             a.setAttribute("webkit-playsinline", "true");
             a.setAttribute("playsinline", "true");
             op(cE) && a.setAttribute("preload", "auto");
             return a
         },
         LV = function(a, b) {
             if (!x.customElements) return !1;
             if (b) return !0;
             if (Zb() && Ij(a.o) !== document) return !1;
             op(YD) && U.getInstance().report(153, {
                 limvid: "vw"
             });
             return op(YD) ? !0 : !1
         };
     KV.prototype.zc = function() {
         return this.g
     };
     KV.prototype.Bb = function() {
         var a = this.j;
         a != null && (a.style.display = "none")
     };
     var NV = function(a, b, c) {
         this.G = String(Math.floor(Math.random() * 1E9));
         this.I = !1;
         this.size = new qj(0, 0);
         this.Te = new Map;
         var d = a && a.getRootNode ? a.getRootNode({
             composed: !0
         }) : a;
         if (a == null || !Tj(Ij(d), d)) throw dM(cM, null, "containerElement", "element");
         this.j = b;
         this.K = oL(this.j || null);
         this.H = WF(this.j || null);
         this.Mc = a;
         this.F = b != null;
         S.g = 2;
         this.C = MV(b ? b : null);
         d = Rj("DIV", {
             style: "position:absolute"
         });
         a.insertBefore(d, a.firstChild);
         this.o = d;
         this.g = null;
         this.za() && b ? a = new qV(b) : (this.g = new KV(this.o), a = new qV(this.g.l));
         this.ha = a;
         this.Fa = this.l = null;
         if (a = this.g && wT.Ec()) a = !(this.za() || Mc || Oc || $r() || Lc && (!Lc || !UF(TF, 4)));
         a && (this.l = new KV(this.o), this.Fa = new qV(this.l.l));
         this.Lb = c || null;
         this.L = this.Lb != null;
         this.za() && b ? typeof b.getBoundingClientRect !== "function" ? (c = this.o, S.j = c) : c = b : c = this.o;
         this.A = c;
         this.B = new $U(this.o, this, !1);
         this.Pd = "";
         b && (b = iF(b.src || b.currentSrc), b.toString().length < 200 ? this.Pd = b.toString() : b.g.length < 200 && (this.Pd = b.g));
         this.Te.set("videoDisplay1", this.ha);
         this.Fa && this.Te.set("videoDisplay2",
             this.Fa);
         this.Md() && !wT.xb() && console.warn("Custom media element must be a <video> or <audio> element. Viewability/audibility measurement will fail.")
     };
     m = NV.prototype;
     m.initialize = function() {
         this.I = !0;
         this.g != null && this.g.initialize();
         this.l != null && this.l.initialize()
     };
     m.Da = function() {
         return this.I
     };
     m.destroy = function() {
         var a = this;
         this.j = null;
         Fs(this.g);
         Fs(this.l);
         Fs(this.B);
         this.ha.V(function() {
             Fs(a.ha)
         });
         this.Fa != null && this.Fa.V(function() {
             Fs(a.Fa)
         });
         Sj(this.o)
     };
     m.Jd = function() {
         if (this.g != null) {
             var a = this.g.j;
             a != null && (a.style.display = "block")
         }
     };
     m.Rc = function(a) {
         this.ha !== a && this.g && this.l && this.Fa && (a.setVolume(this.ha.getVolume()), a = this.ha, this.ha = this.Fa, this.Fa = a, a = this.g, this.g = this.l, this.l = a, this.l.Bb(), this.B.Rc(this.ha))
     };
     m.Bb = function() {
         this.g != null && this.g.Bb()
     };
     m.zc = function() {
         return this.L && this.Lb ? this.Lb : this.g != null ? this.g.zc() : null
     };
     m.za = function() {
         return nL(this.C) && this.F
     };
     m.cg = function() {
         return this.C
     };
     m.Md = function() {
         var a = ["VIDEO", "AUDIO"],
             b;
         return this.za() && !!this.j && !a.includes((b = this.j.tagName) == null ? void 0 : b.toUpperCase())
     };
     m.getSize = function() {
         return this.size
     };
     var MV = function(a) {
         return a != null && typeof a.getAttribute === "function" && a.getAttribute("playsinline") != null ? !0 : !1
     };
     NV.prototype.Ge = function(a) {
         this.ha.Ge(a)
     };
     NV.prototype.He = function() {
         this.ha.He()
     };
     NV.prototype.destroy = NV.prototype.destroy;
     NV.prototype.initialize = NV.prototype.initialize;
     var OV = {
             AD_LOAD: "adLoadError",
             AD_PLAY: "adPlayError"
         },
         PV = function(a) {
             var b = Error.call(this);
             this.message = b.message;
             "stack" in b && (this.stack = b.stack);
             this.data = a
         };
     r(PV, Error);
     m = PV.prototype;
     m.getInnerError = function() {
         var a = this.data.innerError;
         return a instanceof Object ? new PV(a) : a != null ? Error(a) : null
     };
     m.getMessage = function() {
         return this.data.errorMessage
     };
     m.getErrorCode = function() {
         return this.data.errorCode
     };
     m.getVastErrorCode = function() {
         var a = this.getErrorCode();
         return a < 1E3 ? a : 900
     };
     m.getType = function() {
         return this.data.type
     };
     m.toString = function() {
         return "AdError " + this.getErrorCode() + ": " + this.getMessage() + (this.getInnerError() != null ? " Caused by: " + this.getInnerError() : "")
     };
     PV.prototype.getType = PV.prototype.getType;
     PV.prototype.getVastErrorCode = PV.prototype.getVastErrorCode;
     PV.prototype.getErrorCode = PV.prototype.getErrorCode;
     PV.prototype.getMessage = PV.prototype.getMessage;
     PV.prototype.getInnerError = PV.prototype.getInnerError;
     z("module$exports$google3$javascript$ads$interactivemedia$sdk$clientside$api$ad_error.AdError.Type", OV);
     var QV = {
             AD_ERROR: "adError"
         },
         RV = function(a, b) {
             b = b === void 0 ? null : b;
             Ow.call(this, "adError");
             this.error = a;
             this.g = b
         };
     r(RV, Ow);
     RV.prototype.getError = function() {
         return this.error
     };
     RV.prototype.getUserRequestContext = function() {
         return this.g
     };
     RV.prototype.getUserRequestContext = RV.prototype.getUserRequestContext;
     RV.prototype.getError = RV.prototype.getError;
     z("module$exports$google3$javascript$ads$interactivemedia$sdk$clientside$api$ad_error_event.AdErrorEvent.Type", QV);
     var SV = {
             AD_CAN_PLAY: "adCanPlay",
             Hi: "adStarted",
             CONTENT_PAUSE_REQUESTED: "contentPauseRequested",
             CONTENT_RESUME_REQUESTED: "contentResumeRequested",
             CLICK: "click",
             VIDEO_CLICKED: "videoClicked",
             VIDEO_ICON_CLICKED: "videoIconClicked",
             Ue: "engagedView",
             EXPANDED_CHANGED: "expandedChanged",
             STARTED: "start",
             AD_PROGRESS: "adProgress",
             AD_BUFFERING: "adBuffering",
             IMPRESSION: "impression",
             Ze: "measurable_impression",
             VIEWABLE_IMPRESSION: "viewable_impression",
             Ve: "fully_viewable_audible_half_duration_impression",
             wg: "overlay_resize",
             xg: "overlay_unmeasurable_impression",
             yg: "overlay_unviewable_impression",
             Ag: "overlay_viewable_immediate_impression",
             zg: "overlay_viewable_end_of_session_impression",
             Zi: "externalActivityEvent",
             PAUSED: "pause",
             RESUMED: "resume",
             FIRST_QUARTILE: "firstQuartile",
             MIDPOINT: "midpoint",
             THIRD_QUARTILE: "thirdQuartile",
             COMPLETE: "complete",
             DURATION_CHANGE: "durationChange",
             USER_CLOSE: "userClose",
             Zj: "userRecall",
             Mj: "prefetched",
             LOADED: "loaded",
             ALL_ADS_COMPLETED: "allAdsCompleted",
             SKIPPED: "skip",
             Eg: "skipShown",
             LINEAR_CHANGED: "linearChanged",
             SKIPPABLE_STATE_CHANGED: "skippableStateChanged",
             AD_METADATA: "adMetadata",
             AD_BREAK_FETCH_ERROR: "adBreakFetchError",
             AD_BREAK_READY: "adBreakReady",
             LOG: "log",
             VOLUME_CHANGED: "volumeChange",
             VOLUME_MUTED: "mute",
             INTERACTION: "interaction",
             Mi: "companionBackfill",
             Xj: "trackingUrlPinged",
             ak: "video_card_endcap_collapse",
             bk: "video_card_endcap_dismiss",
             ck: "video_card_endcap_impression",
             Pi: "companionInitialized",
             Oi: "companionImpression",
             Ni: "companionClick",
             Gj: "mediaUrlPinged",
             LOAD_START: "loadStart",
             Ij: "navigationRequested"
         },
         TV = function(a, b, c) {
             b = b === void 0 ? null : b;
             c = c === void 0 ? null : c;
             Ow.call(this, a);
             this.ad = b;
             this.j = c
         };
     r(TV, Ow);
     TV.prototype.getAd = function() {
         return this.ad
     };
     TV.prototype.getAdData = function() {
         return this.j
     };
     TV.prototype.getAdData = TV.prototype.getAdData;
     TV.prototype.getAd = TV.prototype.getAd;
     z("module$exports$google3$javascript$ads$interactivemedia$sdk$clientside$api$ad_event.AdEvent.Type", SV);
     var UV = function(a, b) {
         b = b === void 0 ? null : b;
         TV.call(this, "adMetadata", a);
         this.g = b
     };
     r(UV, TV);
     UV.prototype.kh = function() {
         return this.g
     };
     UV.prototype.getAdCuePoints = UV.prototype.kh;
     var VV = function(a) {
         this.adBreakDuration = a.adBreakDuration;
         this.adPosition = a.adPosition;
         this.currentTime = a.currentTime;
         this.duration = a.duration;
         this.totalAds = a.totalAds
     };
     var WV = function(a, b) {
         R.call(this);
         this.l = a;
         this.A = b;
         this.j = this.l.currentTime;
         this.g = new Px(250);
         Hs(this, this.g);
         this.o = new lG(this);
         Hs(this, this.o);
         nG(this.o, this.g, "tick", this.C, !1, this)
     };
     r(WV, R);
     WV.prototype.zb = function() {
         return this.j
     };
     WV.prototype.start = function() {
         XV(this);
         this.g.start()
     };
     WV.prototype.stop = function() {
         this.g.stop()
     };
     WV.prototype.C = function() {
         var a = this.l.currentTime;
         a !== this.zb() && (this.j = a, XV(this))
     };
     var XV = function(a) {
         var b = {};
         b.currentTime = a.zb();
         HL(a.A, "contentTimeUpdate", "contentTimeUpdate", b)
     };
     var YV;
     if (YV = Jc) YV = "srcdoc" in Pj(document, "IFRAME");
     var ZV = YV;

     function $V(a, b) {
         a.open("text/html", "replace");
         Qi(a, kG(String(b)));
         a.close()
     };
     var aW = {
             rgb: !0,
             rgba: !0,
             alpha: !0,
             rect: !0,
             image: !0,
             "linear-gradient": !0,
             "radial-gradient": !0,
             "repeating-linear-gradient": !0,
             "repeating-radial-gradient": !0,
             "cubic-bezier": !0,
             matrix: !0,
             perspective: !0,
             rotate: !0,
             rotate3d: !0,
             rotatex: !0,
             rotatey: !0,
             steps: !0,
             rotatez: !0,
             scale: !0,
             scale3d: !0,
             scalex: !0,
             scaley: !0,
             scalez: !0,
             skew: !0,
             skewx: !0,
             skewy: !0,
             translate: !0,
             translate3d: !0,
             translatex: !0,
             translatey: !0,
             translatez: !0,
             "var": !0
         },
         bW = function(a) {
             a = Eb(a);
             if (a == "") return null;
             var b = String(a.slice(0, 4)).toLowerCase();
             if (("url(" < b ? -1 : "url(" == b ? 0 : 1) == 0) return null;
             if (a.indexOf("(") > 0) {
                 if (/"|'/.test(a)) return null;
                 b = /([\-\w]+)\(/g;
                 for (var c; c = b.exec(a);)
                     if (!(c[1].toLowerCase() in aW)) return null
             }
             return a
         };

     function cW(a, b) {
         a = x[a];
         return a && a.prototype ? (b = Object.getOwnPropertyDescriptor(a.prototype, b)) && b.get || null : null
     }

     function dW(a) {
         var b = x.CSSStyleDeclaration;
         return b && b.prototype && b.prototype[a] || null
     }
     cW("Element", "attributes") || cW("Node", "attributes");
     cW("Element", "innerHTML") || cW("HTMLElement", "innerHTML");
     cW("Node", "nodeName");
     cW("Node", "nodeType");
     cW("Node", "parentNode");
     cW("Node", "childNodes");
     cW("HTMLElement", "style") || cW("Element", "style");
     cW("HTMLStyleElement", "sheet");
     var eW = dW("getPropertyValue"),
         fW = dW("setProperty");
     cW("Element", "namespaceURI") || cW("Node", "namespaceURI");

     function gW(a, b, c, d) {
         if (a) return a.apply(b, d);
         if (Gc && document.documentMode < 10) {
             if (!b[c].call) throw Error("IE Clobbering detected");
         } else if (typeof b[c] != "function") throw Error("Clobbering detected");
         return b[c].apply(b, d)
     };
     var hW = {
         "-webkit-border-horizontal-spacing": !0,
         "-webkit-border-vertical-spacing": !0
     };

     function iW(a) {
         if (!a) return "";
         var b = document.createElement("div").style;
         jW(a).forEach(function(c) {
             var d = Jc && c in hW ? c : c.replace(/^-(?:apple|css|epub|khtml|moz|mso?|o|rim|wap|webkit|xv)-(?=[a-z])/i, "");
             d.lastIndexOf("--", 0) != 0 && d.lastIndexOf("var", 0) != 0 && (c = gW(eW, a, a.getPropertyValue ? "getPropertyValue" : "getAttribute", [c]) || "", c = bW(c), c != null && gW(fW, b, b.setProperty ? "setProperty" : "setAttribute", [d, c]))
         });
         return b.cssText || ""
     }

     function jW(a) {
         $a(a) ? a = vc(a) : (a = wj(a), rc(a, "cssText"));
         return a
     };
     var kW = function(a, b, c) {
         R.call(this);
         this.j = a;
         this.l = b;
         this.C = c;
         this.g = null;
         this.G = this.F = "";
         this.H = 0;
         this.o = this.slot = this.frameElement = null;
         this.A = ""
     };
     r(kW, R);
     kW.prototype.init = function(a) {
         this.A = a;
         a = "about:blank";
         Gc && (a = "");
         this.frameElement = Rj("IFRAME", {
             src: a,
             allowtransparency: !0,
             background: "transparent",
             title: "Advertisement"
         });
         dk(this.frameElement, {
             display: "none",
             width: "0",
             height: "0"
         });
         a = this.j.Mc;
         a.appendChild(this.frameElement);
         a = a.ownerDocument;
         a = a.defaultView || a.parentWindow;
         this.o == null && (this.o = new lG(this));
         this.o.listen(a, "message", this.K);
         a = '<body><script src="//imasdk.googleapis.com/js/sdkloader/loader.js">\x3c/script><script>loader = new VPAIDLoader(false, "' +
             (this.A + '");\x3c/script></body>');
         if (Zc || Xc || Hc) {
             var b = this.frameElement.contentWindow;
             b && $V(b.document, a)
         } else b = this.frameElement, ZV ? (a = kG(a), b.srcdoc = Mi(a)) : (b = b.contentWindow) && $V(b.document, a)
     };
     kW.prototype.K = function(a) {
         try {
             var b = a.qc.data;
             try {
                 var c = JSON.parse(b)
             } catch (v) {
                 return
             }
             var d = c.session;
             if (d != null && this.A === d) switch (c.type) {
                 case "friendlyReady":
                     var e = lW(this);
                     if (e != null) {
                         this.g = e;
                         this.F = e.currentSrc;
                         var f = e.style.cssText,
                             g = document.implementation.createHTMLDocument("").createElement("DIV");
                         g.style.cssText = f;
                         this.G = iW(g.style);
                         this.H = e.currentTime
                     } else {
                         var h = this.j.Mc,
                             k = "border: 0; margin: 0; padding: 0; position: absolute; ",
                             l = this.j.getSize();
                         k += "width:" + l.width + "px;";
                         k += "height:" +
                             l.height + "px;";
                         this.g = Rj("VIDEO", {
                             style: k,
                             autoplay: !0
                         });
                         h.appendChild(this.g)
                     }
                     var n = this.j.Mc;
                     h = "border: 0; margin: 0; padding: 0;position: absolute; ";
                     var p = mk(this.g);
                     h += "width:" + p.width + "px;";
                     h += "height:" + p.height + "px;";
                     this.slot = Rj("DIV", {
                         style: h
                     });
                     n.appendChild(this.slot);
                     try {
                         this.frameElement.contentWindow.loader.initFriendly(this.g, this.slot)
                     } catch (v) {
                         mW(this)
                     }
                     HL(this.l, "vpaid", "", b);
                     break;
                 case "becameLinear":
                     this.g && !pi() && !oi() && dk(this.g, {
                         visibility: "visible"
                     });
                     HL(this.l, "vpaid", "", b);
                     break;
                 case "becameNonlinear":
                     nW(this);
                     HL(this.l, "vpaid", "", b);
                     break;
                 case "startAd":
                     n = {};
                     if (this.g) {
                         k = this.g.paused;
                         var q = this.g.currentTime > 0;
                         n.apl = q && !k ? "1" : "0";
                         n.ip = k ? "1" : "0";
                         n.iavp = q ? "1" : "0"
                     } else n.apl = "n";
                     U.getInstance().report(99, n);
                     HL(this.l, "vpaid", "", b);
                     this.Jd();
                     break;
                 default:
                     HL(this.l, "vpaid", "", b)
             }
         } catch (v) {
             mW(this)
         }
     };
     var mW = function(a) {
         var b = {
             type: "error"
         };
         b.session = a.A;
         b = JSON.stringify(b);
         a.postMessage(b)
     };
     kW.prototype.postMessage = function(a) {
         window.postMessage(a, "*")
     };
     var lW = function(a) {
         return (a.C === "videoDisplayUnknown" ? a.j.ha : a.j.Te.get(a.C)).g
     };
     kW.prototype.Jd = function() {
         lW(this) != null && this.j.Jd()
     };
     var nW = function(a) {
         a.g && !pi() && !oi() && dk(a.g, {
             visibility: "hidden"
         })
     };
     kW.prototype.O = function() {
         Fs(this.o);
         this.o = null;
         Sj(this.slot);
         this.slot = null;
         Sj(this.frameElement);
         this.frameElement = null;
         var a = lW(this);
         a != null ? (a.style.cssText = this.G, pi() || oi() ? (a.src = this.F, a.currentTime = this.H) : (a.removeAttribute("src"), this.j.Bb())) : (Sj(this.g), this.g = null);
         R.prototype.O.call(this)
     };
     var oW = function(a, b) {
         Q.call(this);
         this.j = a;
         this.l = b;
         this.g = new Map
     };
     r(oW, Q);
     var pW = function(a, b) {
         try {
             var c = b.session;
             switch (b.vpaidEventType) {
                 case "createFriendlyIframe":
                     c = "videoDisplayUnknown";
                     b.videoDisplayName && (c = b.videoDisplayName);
                     var d = b.session,
                         e = new kW(a.j, a.l, c);
                     a.g.set(d, e);
                     e.init(d);
                     break;
                 case "vpaidNonLinear":
                     var f = a.g.get(c);
                     f && nW(f);
                     break;
                 case "destroyFriendlyIframe":
                     var g = a.g.get(c);
                     g && (g.dispose(), a.g.delete(c))
             }
         } catch (h) {
             U.getInstance().report(125, {
                 msg: h.message
             })
         }
     };
     oW.prototype.O = function() {
         this.g.forEach(function(a) {
             a.dispose()
         })
     };
     var qW = function(a) {
         this.D = C(a)
     };
     r(qW, I);
     qW.prototype.getValue = function() {
         return pg(this, 1)
     };
     qW.prototype.getVersion = function() {
         return G(this, 5)
     };
     var rW = Sh(qW);

     function sW() {
         this.g = [];
         this.j = []
     }
     m = sW.prototype;
     m.isEmpty = function() {
         return this.g.length === 0 && this.j.length === 0
     };
     m.clear = function() {
         this.g = [];
         this.j = []
     };
     m.contains = function(a) {
         return qc(this.g, a) || qc(this.j, a)
     };
     m.remove = function(a) {
         var b = this.g;
         b: {
             var c = b.length - 1;c < 0 && (c = Math.max(0, b.length + c));
             if (typeof b === "string") c = typeof a !== "string" || a.length != 1 ? -1 : b.lastIndexOf(a, c);
             else {
                 for (; c >= 0; c--)
                     if (c in b && b[c] === a) break b;
                 c = -1
             }
         }
         c >= 0 ? (sc(b, c), b = !0) : b = !1;
         return b || rc(this.j, a)
     };
     m.ac = function() {
         for (var a = [], b = this.g.length - 1; b >= 0; --b) a.push(this.g[b]);
         b = this.j.length;
         for (var c = 0; c < b; ++c) a.push(this.j[c]);
         return a
     };
     var Z = function(a, b, c, d, e, f, g, h, k) {
         R.call(this);
         var l = this;
         this.K = a;
         this.g = b;
         this.adTagUrl = c;
         this.ub = d;
         this.ra = e;
         this.F = g;
         this.sa = h;
         this.V = k;
         this.o = new uT;
         this.U = !1;
         this.volume = 1;
         this.ga = -1;
         this.C = this.l = this.j = null;
         this.G = new sW;
         this.Ba = this.ca = !1;
         this.H = null;
         this.fa = this.La = !1;
         this.Z = function() {
             var n = l.g.ha,
                 p = n.getCurrentTime();
             n = n.getDuration();
             return {
                 currentTime: p,
                 duration: n,
                 isPlaying: !0,
                 volume: l.volume
             }
         };
         this.da = this.Ka = null;
         this.A = new WV({
             currentTime: 0
         }, this.F);
         this.bb = new oW(b, g);
         Hs(this, this.bb);
         this.P = f && this.g.Lb != null;
         this.M = new lG(this);
         Hs(this, this.M);
         this.M.listen(this.F, "adsManager", this.ee)
     };
     r(Z, R);
     Z.prototype.ee = function(a) {
         var b = this,
             c = {
                 type: a.messageType,
                 data: a.qa
             };
         switch (c.type) {
             case "error":
                 tW(this);
                 uW(this, c.data);
                 break;
             case "contentPauseRequested":
                 U.getInstance().report(130);
                 vW(this);
                 this.A.stop();
                 wW(this, c);
                 break;
             case "contentResumeRequested":
                 xW(this, function() {
                     wW(b, c)
                 });
                 break;
             case "remainingTime":
                 this.ga = c.data.remainingTime;
                 break;
             case "companionBackfill":
                 a = Xa("window.google_show_companion_ad");
                 a != null && a();
                 break;
             case "skipShown":
                 this.U = !0;
                 wW(this, c);
                 break;
             case "vpaidEvent":
                 pW(this.bb,
                     c.data);
                 break;
             case "skippableStateChanged":
                 a = c.data.adData;
                 (a == null ? void 0 : a.skippable) != null && (this.U = a.skippable);
                 wW(this, c);
                 break;
             case "volumeChange":
                 a = c.data.adData;
                 a != null && typeof a.volume === "number" && (this.volume = a.volume);
                 wW(this, c);
                 break;
             case "firstQuartile":
                 wW(this, {
                     type: wL.firstQuartile,
                     data: c.data
                 });
                 wW(this, c);
                 break;
             case "thirdQuartile":
                 wW(this, {
                     type: wL.thirdQuartile,
                     data: c.data
                 });
                 wW(this, c);
                 break;
             case "updateGfpCookie":
                 yW(this, c.data);
                 break;
             default:
                 wW(this, c)
         }
     };
     var wW = function(a, b) {
             var c = b.data.adData,
                 d = null;
             c && (c.companions == null && a.H != null && (c.companions = a.H), d = new W(c), a.j = d);
             switch (b.type) {
                 case "adBreakReady":
                 case "mediaUrlPinged":
                     b = new TV(b.type, null, b.data);
                     break;
                 case "adMetadata":
                     c = null;
                     b.data.adCuePoints != null && (c = new tT(b.data.adCuePoints));
                     b = new UV(d, c);
                     break;
                 case "allAdsCompleted":
                     a.j = null;
                     a.La = !0;
                     b = new TV(b.type, d);
                     break;
                 case "contentPauseRequested":
                     a.fa = !1;
                     b = new TV(b.type, d);
                     break;
                 case "contentResumeRequested":
                     a.j = null;
                     a.fa = !0;
                     b = new TV(b.type,
                         d);
                     break;
                 case "loaded":
                     a.ga = d.getDuration();
                     a.U = !1;
                     if (a.ra && pL()) {
                         var e = a.K,
                             f = d,
                             g = a.ra;
                         e.j.set(qT(f), a.Z);
                         jV(e) && iV(e, "loaded", qT(f), g)
                     }
                     b = new TV(b.type, d, c);
                     break;
                 case "skip":
                     a.H = null;
                     b = new TV(b.type, d);
                     break;
                 case "start":
                     c && (c = c.companions) && (a.H = c);
                     a.g.zc() != null && (a.l == null ? (a.l = new wS, a.M.listen(a.l, "click", a.Th)) : AS(a.l), yS(a.l, a.g.zc()));
                     a.da == null && (a.da = um(), c = a.g.ha, e = new ml, c = H(e, 4, c.P), e = kl(jl(a.V.Qd), a.V.tc), c = F(c, 1, e), e = kl(jl(a.V.Lg), a.V.Kg), c = F(c, 2, e), e = kl(jl(a.Ka), a.da), c = F(c, 3, e),
                         e = {}, zW(a, {
                             type: "videoPlaybackInstrumentation",
                             data: (e.videoPlaybackLatency = c.ba(), e)
                         }));
                     b = new TV(b.type, d);
                     break;
                 case "complete":
                     a.l != null && AS(a.l);
                     pL() && lV(a.K, a.Z, qT(d));
                     a.j = null;
                     a.H = null;
                     b = new TV(b.type, d);
                     break;
                 case "log":
                     c = null;
                     e = b.data.logData;
                     e != null && e.type != null ? (f = e.type, f = f === "adLoadError" || f === "adPlayError") : f = !1;
                     f && (c = {
                         adError: new PV(e)
                     });
                     b = new TV(b.type, d, c);
                     break;
                 case "interaction":
                     b = new TV(b.type, d, b.data.interactionData);
                     break;
                 case "adProgress":
                     b = new TV(b.type, d, new VV(b.data));
                     break;
                 default:
                     b = new TV(b.type, d)
             }
             R.prototype.dispatchEvent.call(a, b);
             a.La && a.fa && a.destroy()
         },
         uW = function(a, b) {
             var c = new RV(new PV(b));
             a.ca ? (R.prototype.dispatchEvent.call(a, c), pL() && a.j && lV(a.K, a.Z, qT(a.j)), a.j = null) : a.G.j.push(c);
             a = {
                 error: b.errorCode,
                 vis: qm(document)
             };
             U.getInstance().report(7, a)
         },
         zW = function(a, b) {
             HL(a.F, "adsManager", b.type, b.data)
         },
         xW = function(a, b) {
             U.getInstance().report(131);
             tW(a, b);
             a.Ia() || a.A.start()
         },
         vW = function(a) {
             var b = a.g.ha;
             a.g.za() && a.o.restoreCustomPlaybackStateOnAdBreakComplete &&
                 b.Ba != null && b.Ba()
         },
         tW = function(a, b) {
             var c = a.g.ha;
             a.g.za() && a.o.restoreCustomPlaybackStateOnAdBreakComplete && c.V != null ? c.V(b) : b && b()
         };
     m = Z.prototype;
     m.addEventListener = function(a, b, c, d) {
         d && (console.warn("Handler scope is deprecated. Use arrow function or bind."), U.getInstance().report(217, {
             method: "AdsManager.addEventListener w/ handler scope"
         }));
         if (Array.isArray(a)) {
             console.warn("Array not supported. Listen for a single event type.");
             U.getInstance().report(217, {
                 method: "AdsManager.addEventListener w/ array"
             });
             a = w(a);
             for (var e = a.next(); !e.done; e = a.next()) this.addEventListener(e.value, b, c, d)
         } else R.prototype.listen.call(this, a, b, c, d)
     };
     m.removeEventListener = function(a, b, c, d) {
         d && (console.warn("Handler scope is deprecated. Use arrow function or bind."), U.getInstance().report(217, {
             method: "AdsManager.removeEventListener w/ handler scope"
         }));
         if (Array.isArray(a)) {
             console.warn("Array not supported. Listen for a single event type.");
             U.getInstance().report(217, {
                 method: "AdsManager.removeEventListener w/ array"
             });
             a = w(a);
             for (var e = a.next(); !e.done; e = a.next()) this.removeEventListener(e.value, b, c, d)
         } else R.prototype.ab.call(this, a, b, c, d)
     };
     m.Lf = function() {
         R.prototype.Ee.call(this)
     };
     m.listen = function() {
         throw Error("Not supported; use addEventListener instead.");
     };
     m.dispatchEvent = function() {
         console.error("Dispatching events is not supported.");
         U.getInstance().report(217, {
             method: "AdsManager.dispatchEvent"
         });
         return !1
     };
     m.configureAdsManager = function(a, b) {
         this.C = a;
         a.currentTime != null && (this.A = new WV(a, this.F), this.A.start());
         b != null && (this.o = AW(b))
     };
     m.init = function(a, b, c, d) {
         if (this.G.isEmpty()) {
             c = this.g;
             var e = null;
             c.j && d == null && (e = {
                 vd: "setnull"
             });
             c.j && c.j === d && (e = {
                 vd: "match"
             });
             if (c.j && c.j !== d) {
                 e = oL(d || null);
                 var f = WF(d || null);
                 e = {
                     vd: "diff",
                     oc: c.K,
                     nc: e,
                     oi: c.H,
                     ni: f
                 }
             }!c.j && d && (e = {
                 vd: "new"
             });
             e && (e.custVid = c.G, U.getInstance().report(93, e));
             d != null && (c.C = MV(d), nL(c.C) && (c.F = !0, Fs(c.g), Fs(c.l), Fs(c.Fa), c.g = null, c.l = null, c.Fa = null, Fs(c.ha), c.ha = new qV(d), typeof d.getBoundingClientRect !== "function" ? (c.A = c.o, S.j = c.A) : c.A = d, c.B.Rc(c.ha)));
             this.ca = !0;
             this.resize(a,
                 b);
             d = this.o.ba(this.P);
             c = {};
             a = (c.adsRenderingSettings = d, c.width = a, c.height = b, c);
             zW(this, {
                 type: "init",
                 data: a
             })
         } else {
             for (; !this.G.isEmpty();) b = a = this.G, b.g.length === 0 && (b.g = b.j, b.g.reverse(), b.j = []), a = a.g.pop(), R.prototype.dispatchEvent.call(this, a);
             this.dispose()
         }
     };
     m.isCustomPlaybackUsed = function() {
         return this.g.za()
     };
     m.isCustomClickTrackingUsed = function() {
         return this.P
     };
     m.getRemainingTime = function() {
         return this.ga
     };
     m.getAdSkippableState = function() {
         return this.U
     };
     m.discardAdBreak = function() {
         zW(this, {
             type: "discardAdBreak"
         })
     };
     m.updateAdsRenderingSettings = function(a) {
         if (a != null) {
             a = AW(a);
             var b = this.o.bitrate,
                 c = a.bitrate;
             U.getInstance().report(96, {
                 init: this.ca ? "1" : "0",
                 start: this.Ba ? "1" : "0",
                 old: b,
                 "new": c,
                 changed: b !== c ? "1" : "0"
             });
             this.o = a;
             a = this.o.ba(this.P);
             b = {};
             a = (b.adsRenderingSettings = a, b);
             zW(this, {
                 type: "updateAdsRenderingSettings",
                 data: a
             })
         }
     };
     m.skip = function() {
         zW(this, {
             type: "skip"
         })
     };
     m.start = function() {
         this.Ka = um();
         if (this.adTagUrl) {
             var a;
             if (a = Mc || Oc) a = !0;
             a && U.getInstance().report(50, {
                 customPlayback: this.g.za()
             });
             this.g.Da() || U.getInstance().report(26, {
                 adtagurl: this.adTagUrl,
                 customPlayback: this.g.za()
             });
             Tr(this.g.o) && U.getInstance().report(30, {
                 adtagurl: this.adTagUrl,
                 customPlayback: this.g.za()
             });
             var b = this.g.Lb;
             a = this.g.o;
             var c;
             if (c = b && a && !Tr(b)) b = gV(b), a = gV(a), c = b.width > 0 && b.height > 0 && a.width > 0 && a.height > 0 && b.left <= a.left + a.width && a.left <= b.left + b.width && b.top <= a.top + a.height &&
                 a.top <= b.top + b.height;
             a = c;
             U.getInstance().report(31, {
                 adtagurl: this.adTagUrl,
                 customPlayback: this.g.za(),
                 covers: a
             })
         }
         if (!this.g.Da() && !this.g.za()) throw dM(bM);
         a = this.g;
         a.L = this.P && a.Lb != null;
         this.g.B.frameElement.style.opacity = "1";
         if (this.C != null && this.getVolume() === 1) {
             var d, e;
             if (typeof((d = this.C) == null ? void 0 : d.muted) === "boolean" && ((e = this.C) == null ? 0 : e.muted)) this.setVolume(0);
             else {
                 var f;
                 if (typeof((f = this.C) == null ? void 0 : f.volume) === "number") {
                     var g;
                     d = (g = this.C) == null ? void 0 : g.volume;
                     if (d >= 0 && d <= 1) {
                         var h;
                         this.setVolume((h = this.C) == null ? void 0 : h.volume)
                     }
                 }
             }
         }
         this.Ba = !0;
         zW(this, {
             type: "start"
         })
     };
     m.Th = function() {
         if (!this.o.disableClickThrough && this.j != null) {
             var a = rT(this.j);
             a != null && AF(a, sT(this.j))
         }
     };
     m.resize = function(a, b) {
         var c = this.g,
             d = c.o;
         d != null && (a === -1 ? (d.style.right = "0", d.style.left = "0") : d.style.width = a + "px", b === -1 ? (d.style.bottom = "0", d.style.top = "0") : d.style.height = b + "px");
         d = c.B;
         d.frameElement.width = a === -1 ? "100%" : String(a);
         d.frameElement.height = b === -1 ? "100%" : String(b);
         try {
             d.frameElement.offsetTop = d.frameElement.offsetTop
         } catch (e) {}
         c.size = new qj(a, b);
         c = {};
         a = (c.width = a, c.height = b, c);
         zW(this, {
             type: "resize",
             data: a
         })
     };
     m.stop = function() {
         zW(this, {
             type: "stop"
         })
     };
     m.expand = function() {
         zW(this, {
             type: "expand"
         })
     };
     m.collapse = function() {
         zW(this, {
             type: "collapse"
         })
     };
     m.getVolume = function() {
         return this.volume
     };
     m.setVolume = function(a) {
         this.volume = a;
         this.g.ha.setVolume(a);
         var b = {};
         a = (b.volume = a, b);
         zW(this, {
             type: "volume",
             data: a
         })
     };
     m.pause = function() {
         zW(this, {
             type: "pause"
         })
     };
     m.resume = function() {
         zW(this, {
             type: "resume"
         })
     };
     m.destroy = function() {
         this.dispose()
     };
     m.getCuePoints = function() {
         return this.ub
     };
     m.mh = function() {
         return this.j
     };
     m.O = function() {
         zW(this, {
             type: "destroy"
         });
         this.l != null && this.l.dispose();
         this.M.dispose();
         this.G.clear();
         this.A && (this.A.stop(), this.A.dispose());
         pL() && lV(this.K, this.Z);
         R.prototype.O.call(this)
     };
     m.Vg = function() {
         U.getInstance().report(124, {
             api: "clicked"
         });
         var a = this.j && rT(this.j),
             b;
         if (a && ((b = this.j) == null ? 0 : b.zf())) {
             var c;
             AF(a, (c = this.j) == null ? void 0 : sT(c))
         }
         zW(this, {
             type: "click"
         })
     };
     m.focus = function() {
         HL(this.F, "userInteraction", "focusUiElement")
     };
     var yW = function(a, b) {
         var c = b.gfpCookieUserEnabled;
         b = b.gfpCookieClearData;
         var d = new qW;
         d = zg(d, 1, c ? "0" : "1");
         d = Jf(d, 2, He(2147483647));
         d = zg(d, 3, "/");
         d = zg(d, 4, window.location.hostname);
         var e = new IT,
             f, g;
         a = (g = (f = a.sa) == null ? void 0 : RK(f)) != null ? g : null;
         KT(e, "__gpi_opt_out", d, a);
         if (!c || b) LT(e, "__gads", a), LT(e, "__gpi", a)
     };
     Z.prototype.clicked = Z.prototype.Vg;
     Z.prototype.getCurrentAd = Z.prototype.mh;
     Z.prototype.getCuePoints = Z.prototype.getCuePoints;
     Z.prototype.destroy = Z.prototype.destroy;
     Z.prototype.resume = Z.prototype.resume;
     Z.prototype.pause = Z.prototype.pause;
     Z.prototype.setVolume = Z.prototype.setVolume;
     Z.prototype.getVolume = Z.prototype.getVolume;
     Z.prototype.collapse = Z.prototype.collapse;
     Z.prototype.expand = Z.prototype.expand;
     Z.prototype.stop = Z.prototype.stop;
     Z.prototype.resize = Z.prototype.resize;
     Z.prototype.start = Z.prototype.start;
     Z.prototype.skip = Z.prototype.skip;
     Z.prototype.updateAdsRenderingSettings = Z.prototype.updateAdsRenderingSettings;
     Z.prototype.discardAdBreak = Z.prototype.discardAdBreak;
     Z.prototype.getAdSkippableState = Z.prototype.getAdSkippableState;
     Z.prototype.getRemainingTime = Z.prototype.getRemainingTime;
     Z.prototype.isCustomClickTrackingUsed = Z.prototype.isCustomClickTrackingUsed;
     Z.prototype.isCustomPlaybackUsed = Z.prototype.isCustomPlaybackUsed;
     Z.prototype.init = Z.prototype.init;
     Z.prototype.dispatchEvent = Z.prototype.dispatchEvent;
     Z.prototype.listen = Z.prototype.listen;
     Z.prototype.removeAllEventListeners = Z.prototype.Lf;

     function AW(a) {
         if (a instanceof uT) return U.getInstance().report(174, {
             valid: !0
         }), a;
         U.getInstance().report(174, {
             valid: !1
         });
         var b = new uT;
         b.append(a);
         return b
     };
     var BW = {
             ADS_MANAGER_LOADED: "adsManagerLoaded"
         },
         CW = function(a, b) {
             Ow.call(this, "adsManagerLoaded");
             this.g = a;
             this.j = b
         };
     r(CW, Ow);
     CW.prototype.getAdsManager = function(a, b) {
         a = a || {
             currentTime: null
         };
         this.g.configureAdsManager(a, b);
         return this.g
     };
     CW.prototype.getUserRequestContext = function() {
         return this.j
     };
     CW.prototype.getUserRequestContext = CW.prototype.getUserRequestContext;
     CW.prototype.getAdsManager = CW.prototype.getAdsManager;
     z("module$exports$google3$javascript$ads$interactivemedia$sdk$clientside$api$ads_manager_loaded_event.AdsManagerLoadedEvent.Type", BW);
     var nS = pp(aE),
         DW = function(a) {
             R.call(this);
             var b = this;
             this.C = new IT;
             this.l = null;
             this.F = new Map;
             this.G = {};
             this.P = new WS;
             this.A = null;
             var c = wK(vT(this.getSettings()));
             c && c.length > 0 && (Xn.reset(), Zn(new co(c)));
             this.o = a;
             this.g = this.o.B;
             this.K = new lG(this);
             Hs(this, this.K);
             this.H = new YL(window);
             Hs(this, this.H);
             this.M = new oS;
             rS(this.M);
             S.g !== 0 ? (this.j = new dV, Hs(this, this.j)) : this.j = eV();
             op(XD) ? this.U = XS(this.P) : this.U = Promise.resolve(null);
             if (pL()) {
                 this.j.init(ZU(this.g));
                 var d = kV(this.j, this.o.A);
                 Gs(this,
                     function() {
                         b.j.l.delete(d);
                         S.g !== 0 && (K(uw).o[d] = null)
                     });
                 this.A = d
             }
             this.V = new IU(this.o, this.A)
         };
     r(DW, R);
     m = DW.prototype;
     m.addEventListener = function(a, b, c, d) {
         d && (console.warn("Handler scope is deprecated. Use arrow function or bind."), U.getInstance().report(217, {
             method: "AdsLoader.addEventListener w/ handler scope"
         }));
         if (Array.isArray(a)) throw Error("Array not supported. Listen for a single event type.");
         R.prototype.listen.call(this, a, b, c, d)
     };
     m.removeEventListener = function(a, b, c, d) {
         d && (console.warn("Handler scope is deprecated. Use arrow function or bind."), U.getInstance().report(217, {
             method: "AdsLoader.removeEventListener w/ handler scope"
         }));
         if (Array.isArray(a)) throw Error("Array not supported. Listen for a single event type.");
         R.prototype.ab.call(this, a, b, c, d)
     };
     m.Lf = function() {
         R.prototype.Ee.call(this)
     };
     m.listen = function() {
         throw Error("Not supported; use addEventListener instead.");
     };
     m.dispatchEvent = function() {
         throw Error("Dispatching events is not supported.");
     };
     m.destroy = function() {
         this.dispose()
     };
     m.getVersion = function() {
         return "h.3.728.0"
     };
     m.requestAds = function(a, b) {
         var c = this,
             d, e, f, g, h, k;
         return Oa(function(l) {
             if (l.g == 1) {
                 d = um();
                 if (!a.adTagUrl && !a.adsResponse) return e = {}, EW(c, (e.errorCode = 1013, e.errorMessage = "The ad request must either have an ad tag URL or an ads response.", e.type = "adLoadError", e), ""), l.return();
                 f = "goog_" + Wi++;
                 c.F.set(f, b || null);
                 return Da(l, FW(c, a), 2)
             }
             g = l.j;
             h = g.data;
             k = g.sa;
             GW(c, f, k, h, d);
             l.g = 0
         })
     };
     var FW = function(a, b) {
         var c = b.adTagUrl || "",
             d = c.includes("GOOGLE_INSTREAM_VIDEO_NONCE"),
             e = ZL(a.H),
             f = e.then(function(l) {
                 var n;
                 return LK(c, l || {}, (n = Ko()) == null ? void 0 : kg(n, 2))
             });
         f.then(function(l) {
             gS(l, function() {
                 HW(a, l)
             })
         });
         var g = IW(a, d, f),
             h = rS(a.M),
             k = c ? DK(c) : null;
         k = HU(k, 500);
         return Promise.all([e, f, h, k, a.U, g]).then(function(l) {
             var n = w(l);
             l = n.next().value;
             var p = n.next().value;
             var q = n.next().value;
             var v = n.next().value;
             var u = n.next().value;
             ta(n);
             n = QK(p);
             var t = {};
             U.getInstance().report(182, (t.aid = !!S.l,
                 t.aidf = !!a.l, t.hsc = !n && d, t));
             n = {};
             U.getInstance().report(155, (n.ws = mS(), n.blob = q != null ? q : "undef", n));
             if (u && a.P.g) try {
                 var y = Uj(gq.querySelector("iframe[src^='//tpc.googlesyndication.com/sodar']"));
                 n = {};
                 var D = (n["0"] = "3", n["10"] = "", n["11"] = 2, n["12"] = 1, n);
                 var ca = (location.protocol.indexOf("https:") == 0 ? "https:" : "http:") + "//tpc.googlesyndication.com";
                 y && y.postMessage(D, ca)
             } catch (Hi) {}(y = FM(RK(p))) && (a.G.espSignals = y);
             D = a.getSettings().ba(jV(a.j));
             ca = JU(a.V, c, {
                 Nb: a.g.Nb,
                 Rb: a.g.Rb
             });
             n = a.C;
             a: {
                 try {
                     var X = a.o,
                         fa = new hl;
                     var Ba = X.Mc,
                         sa = Ba.clientWidth,
                         ab = Ba.clientHeight;
                     if (typeof Ba.getBoundingClientRect === "function" && Tj(Ij(Ba), Ba)) {
                         var La = Ba.getBoundingClientRect();
                         var V = document.elementsFromPoint(La.x + .5 * sa, La.y + .5 * ab)
                     } else V = [];
                     var da = $L(V, X);
                     if (da) {
                         var Ma = new gl,
                             wb = da.getBoundingClientRect(),
                             qa = wb.y,
                             Pa = wb.x,
                             ac = new el;
                         var xc = xg(ac, 1, qa);
                         var Qa = xg(xc, 2, Pa);
                         var lc = da.duration,
                             jd = da.clientWidth,
                             nf = da.clientHeight,
                             of = new fl;
                         var Fl = xg( of , 1, jd);
                         var Gl = xg(Fl, 2, nf);
                         if (lc !== Number.POSITIVE_INFINITY && !isNaN(lc)) {
                             var Hl =
                                 new dl;
                             var Il = wg(Hl, 1, lc);
                             F(Ma, 3, Il)
                         }
                         var Jl = Number(window.getComputedStyle(da).opacity),
                             Kl = F(Ma, 1, Qa);
                         var Ll = F(Kl, 2, Gl);
                         wg(Ll, 4, Jl);
                         var Ei = F(fa, 2, Ma)
                     } else {
                         var Ml = new gl;
                         Ei = F(fa, 2, Ml)
                     }
                     var Fi = Ei.ba();
                     break a
                 } catch (Hi) {
                     var Gi;
                     U.getInstance().report(212, {
                         message: (Gi = Hi) == null ? void 0 : Gi.message
                     }, !0)
                 }
                 Fi = null
             }
             return {
                 data: jU(b, l, p, q, v, u, y, D, ca, n, Fi),
                 sa: p
             }
         })
     };
     DW.prototype.getSettings = function() {
         return wT
     };
     DW.prototype.contentComplete = function() {
         HL(ZU(this.g), "adsLoader", "contentComplete")
     };
     var JW = function(a, b, c) {
             b.length !== 0 && (b = hS(b.map(function(d) {
                 return {
                     Wg: d,
                     wk: !1,
                     vk: !1
                 }
             }), c)) && b.forEach(function(d) {
                 d.then(function(e) {
                     e && HW(a, c)
                 })
             })
         },
         HW = function(a, b) {
             if (b = FM(RK(b))) a.G.espSignals = b, HL(ZU(a.g), "adsLoader", "signalsRefresh", a.G)
         },
         KW = function(a, b) {
             var c = a.F.get(b);
             a.F.delete(b);
             return c != null ? c : null
         },
         EW = function(a, b, c) {
             c = new RV(new PV(b), KW(a, c));
             R.prototype.dispatchEvent.call(a, c);
             a = {
                 error: b.errorCode,
                 vis: qm(document)
             };
             U.getInstance().report(7, a)
         },
         GW = function(a, b, c, d, e) {
             b = ZU(a.g, b);
             a.K.listen(b, "adsLoader", function(f) {
                 var g = f.messageType;
                 switch (g) {
                     case "adsLoaded":
                         var h = f.qa;
                         f = f.Qc;
                         h = new Z(a.j, a.o, h.adTagUrl || "", h.adCuePoints, a.A, h.isCustomClickTrackingAllowed, ZU(a.g, f), c, {
                             Lg: e,
                             Kg: um(),
                             Qd: a.g.Qd,
                             tc: a.g.tc
                         });
                         f = new CW(h, KW(a, f));
                         R.prototype.dispatchEvent.call(a, f);
                         break;
                     case "error":
                         EW(a, f.qa, f.Qc);
                         break;
                     case "cookieUpdate":
                         f = f.qa;
                         if (f == null) break;
                         g = new HK;
                         g = ug(g, 5, !0);
                         var k = f.gfpCookie;
                         k && KT(a.C, "__gads", rW(k), g);
                         (k = f.gfpCookieV2) && KT(a.C, "__gpi", rW(k), g);
                         if (k = f.eoidCookie) g =
                             new FT, k = rW(k), ((h = g.g) == null ? 0 : h.g) ? g.g.set("__eoi", k) : (h = mm(ng(k, 2)) - Date.now() / 1E3, h = {
                                 maxAge: Math.max(h, 0),
                                 path: pg(k, 3),
                                 domain: pg(k, 4),
                                 secure: !1
                             }, ET("__eoi", k.getValue(), h, g.j));
                         JW(a, f.encryptedSignalBidderIds || [], c);
                         break;
                     case "trackingUrlPinged":
                         R.prototype.dispatchEvent.call(a, new TV(g, null, f.qa))
                 }
             });
             HL(b, "adsLoader", "requestAds", d)
         },
         IW = function(a, b, c) {
             var d, e;
             return Oa(function(f) {
                 if (f.g == 1) return Da(f, c, 2);
                 if (f.g != 3) {
                     d = f.j;
                     if (QK(d)) return a.l = null, f.return();
                     if (!b) return f.return();
                     a.l || (a.l =
                         new DL, EL(a.l));
                     return Da(f, a.l.getId(), 3)
                 }
                 e = f.j;
                 S.l = e.id || "";
                 f.g = 0
             })
         };
     DW.prototype.contentComplete = DW.prototype.contentComplete;
     DW.prototype.getSettings = DW.prototype.getSettings;
     DW.prototype.requestAds = DW.prototype.requestAds;
     DW.prototype.getVersion = DW.prototype.getVersion;
     DW.prototype.destroy = DW.prototype.destroy;
     DW.prototype.dispatchEvent = DW.prototype.dispatchEvent;
     DW.prototype.listen = DW.prototype.listen;
     z("google.ima.AdCuePoints.POSTROLL", -1, window);
     z("google.ima.AdCuePoints.PREROLL", 0, window);
     z("google.ima.AdDisplayContainer", NV, window);
     z("google.ima.AdError.ErrorCode", rK, window);
     z("google.ima.AdError.ErrorCode.VIDEO_ELEMENT_USED", -1, window);
     z("google.ima.AdError.ErrorCode.VIDEO_ELEMENT_REQUIRED", -1, window);
     z("google.ima.AdError.ErrorCode.VAST_MEDIA_ERROR", -1, window);
     z("google.ima.AdError.ErrorCode.ADSLOT_NOT_VISIBLE", -1, window);
     z("google.ima.AdError.ErrorCode.OVERLAY_AD_LOADING_FAILED", -1, window);
     z("google.ima.AdError.ErrorCode.VAST_MALFORMED_RESPONSE", -1, window);
     z("google.ima.AdError.ErrorCode.COMPANION_AD_LOADING_FAILED", -1, window);
     z("google.ima.AdError.Type", OV, window);
     z("google.ima.AdErrorEvent.Type", QV, window);
     z("google.ima.AdEvent.Type", SV, window);
     z("google.ima.AdsLoader", DW, window);
     z("google.ima.AdsManagerLoadedEvent.Type", BW, window);
     z("google.ima.CompanionAdSelectionSettings", NL, window);
     z("google.ima.CompanionAdSelectionSettings.CreativeType", JL);
     z("google.ima.CompanionAdSelectionSettings.ResourceType", KL);
     z("google.ima.CompanionAdSelectionSettings.SizeCriteria", LL);
     z("google.ima.CustomContentLoadedEvent.Type.CUSTOM_CONTENT_LOADED", "deprecated-event", window);
     z("ima.ImaSdkSettings", Y, window);
     z("google.ima.settings", wT, window);
     z("google.ima.ImaSdkSettings.CompanionBackfillMode", {
         ALWAYS: "always",
         ON_MASTER_AD: "on_master_ad"
     });
     z("google.ima.ImaSdkSettings.VpaidMode", {
         DISABLED: 0,
         ENABLED: 1,
         INSECURE: 2,
         0: "DISABLED",
         1: "ENABLED",
         2: "INSECURE"
     });
     z("google.ima.AdsRenderingSettings", uT, window);
     z("google.ima.AdsRenderingSettings.AUTO_SCALE", -1, window);
     z("google.ima.AdsRequest", kU, window);
     z("google.ima.VideoOrientation", {
         UNSET: 0,
         LANDSCAPE: 1,
         PORTRAIT: 2,
         SQUARE: 3,
         0: "UNSET",
         1: "LANDSCAPE",
         2: "PORTRAIT",
         3: "SQUARE"
     }, window);
     z("google.ima.VERSION", "3.728.0");
     z("google.ima.OmidAccessMode", {
         LIMITED: "limited",
         DOMAIN: "limited",
         FULL: "full"
     });
     z("google.ima.OmidVerificationVendor", {
         COMSCORE: 7,
         DOUBLEVERIFY: 3,
         GOOGLE: 9,
         INTEGRAL_AD_SCIENCE: 4,
         MEETRICS: 8,
         MOAT: 2,
         NIELSEN: 6,
         PIXELATE: 5,
         OTHER: 1,
         7: "COMSCORE",
         3: "DOUBLEVERIFY",
         9: "GOOGLE",
         4: "INTEGRAL_AD_SCIENCE",
         8: "MEETRICS",
         2: "MOAT",
         6: "NIELSEN",
         5: "PIXELATE",
         1: "OTHER"
     });
     z("google.ima.UiElements", {
         AD_ATTRIBUTION: "adAttribution",
         COUNTDOWN: "countdown"
     });
     z("google.ima.ViewMode", {
         NORMAL: "normal",
         FULLSCREEN: "fullscreen"
     });
     z("google.ima.secureSignals", {
         clearAllCache: function() {
             var a = window.localStorage;
             if (a !== void 0)
                 for (var b = w(Object.keys(a)), c = b.next(); !c.done; c = b.next())
                     if (c = c.value, c.startsWith("_GESPSK")) try {
                         a.removeItem(c)
                     } catch (d) {}
             xM = new wM
         }
     });
     var LW = function(a, b, c) {
             this.j = c;
             b.length === 0 && (b = [
                 []
             ]);
             this.g = b.map(function(d) {
                 d = a.concat(d);
                 for (var e = [], f = 0, g = 0; f < d.length;) {
                     var h = d[f++];
                     if (h < 128) e[g++] = String.fromCharCode(h);
                     else if (h > 191 && h < 224) {
                         var k = d[f++];
                         e[g++] = String.fromCharCode((h & 31) << 6 | k & 63)
                     } else if (h > 239 && h < 365) {
                         k = d[f++];
                         var l = d[f++],
                             n = d[f++];
                         h = ((h & 7) << 18 | (k & 63) << 12 | (l & 63) << 6 | n & 63) - 65536;
                         e[g++] = String.fromCharCode(55296 + (h >> 10));
                         e[g++] = String.fromCharCode(56320 + (h & 1023))
                     } else k = d[f++], l = d[f++], e[g++] = String.fromCharCode((h & 15) << 12 |
                         (k & 63) << 6 | l & 63)
                 }
                 return new RegExp(e.join(""))
             })
         },
         MW = function(a, b) {
             return b ? a.g.some(function(c) {
                 c = b.match(c);
                 return c == null ? !1 : !a.j || c.length >= 1 && c[1] === "3.728.0" || c.length >= 2 && c[2] === "3.728.0" ? !0 : !1
             }) : !1
         },
         NW = [94, 40, 63, 58, 104, 116, 116, 112, 115, 63, 58, 41, 63, 47, 47, 105, 109, 97, 115, 100, 107, 92, 46, 103, 111, 111, 103, 108, 101, 97, 112, 105, 115, 92, 46, 99, 111, 109, 47, 106, 115, 47, 40, 115, 100, 107, 108, 111, 97, 100, 101, 114, 124, 99, 111, 114, 101, 41, 47],
         OW = [94, 40, 63, 58, 104, 116, 116, 112, 115, 63, 58, 41, 63, 47, 47, 115, 48, 92, 46, 50, 109, 100,
             110, 92, 46, 110, 101, 116, 47, 105, 110, 115, 116, 114, 101, 97, 109, 47, 104, 116, 109, 108, 53, 47
         ],
         PW = [94, 40, 63, 58, 104, 116, 116, 112, 115, 63, 58, 41, 63, 47, 47, 105, 109, 97, 115, 100, 107, 92, 46, 103, 111, 111, 103, 108, 101, 97, 112, 105, 115, 92, 46, 99, 111, 109, 47, 112, 97, 108, 47, 115, 100, 107, 108, 111, 97, 100, 101, 114, 47],
         QW = [
             [105, 109, 97, 51, 92, 46, 106, 115],
             [105, 109, 97, 51, 95, 100, 101, 98, 117, 103, 92, 46, 106, 115],
             [105, 109, 97, 51, 95, 101, 97, 112, 46, 106, 115]
         ],
         RW = [
             [98, 114, 105, 100, 103, 101, 40, 91, 48, 45, 57, 93, 43, 92, 46, 91, 48, 45, 57, 92, 46, 93, 43, 41, 40, 95, 40, 91, 97,
                 45, 122, 48, 45, 57, 93, 41, 123, 50, 44, 51, 125, 41, 123, 48, 44, 50, 125, 92, 46, 104, 116, 109, 108
             ],
             [98, 114, 105, 100, 103, 101, 40, 91, 48, 45, 57, 93, 43, 92, 46, 91, 48, 45, 57, 92, 46, 93, 43, 41, 95, 100, 101, 98, 117, 103, 40, 95, 40, 91, 97, 45, 122, 48, 45, 57, 93, 41, 123, 50, 44, 51, 125, 41, 123, 48, 44, 50, 125, 92, 46, 104, 116, 109, 108],
             [98, 114, 105, 100, 103, 101, 40, 95, 40, 91, 97, 45, 122, 48, 45, 57, 93, 41, 123, 50, 44, 51, 125, 41, 123, 48, 44, 50, 125, 92, 46, 104, 116, 109, 108]
         ],
         SW = new LW(NW, QW, !1);
     new LW(NW, RW, !0);
     var TW = new LW(OW, QW, !1);
     new LW(OW, RW, !0);
     var UW = new LW([94, 40, 63, 58, 104, 116, 116, 112, 115, 63, 58, 41, 63, 47, 47, 105, 109, 97, 115, 100, 107, 92, 46, 103, 111, 111, 103, 108, 101, 97, 112, 105, 115, 92, 46, 99, 111, 109, 47, 112, 114, 101, 114, 101, 108, 101, 97, 115, 101, 47, 106, 115, 47, 91, 48, 45, 57, 93, 43, 46, 91, 48, 45, 57, 46, 93, 43, 47], QW, !1),
         VW = new LW([94, 40, 63, 58, 104, 116, 116, 112, 115, 63, 58, 41, 63, 47, 47, 40, 112, 97, 103, 101, 97, 100, 50, 124, 116, 112, 99, 41, 92, 46, 103, 111, 111, 103, 108, 101, 115, 121, 110, 100, 105, 99, 97, 116, 105, 111, 110, 92, 46, 99, 111, 109, 47, 112, 97, 103, 101, 97, 100, 47, 40, 103, 97, 100, 103,
             101, 116, 115, 124, 106, 115, 41, 47
         ], [], !1);
     new LW(NW, [
         [100, 97, 105, 95, 105, 102, 114, 97, 109, 101, 40, 91, 48, 45, 57, 93, 43, 92, 46, 91, 48, 45, 57, 92, 46, 93, 43, 41, 40, 95, 40, 91, 97, 45, 122, 48, 45, 57, 93, 41, 123, 50, 44, 51, 125, 41, 123, 48, 44, 50, 125, 92, 46, 104, 116, 109, 108],
         [100, 97, 105, 95, 105, 102, 114, 97, 109, 101, 40, 91, 48, 45, 57, 93, 43, 92, 46, 91, 48, 45, 57, 92, 46, 93, 43, 41, 95, 100, 101, 98, 117, 103, 40, 95, 40, 91, 97, 45, 122, 48, 45, 57, 93, 41, 123, 50, 44, 51, 125, 41, 123, 48, 44, 50, 125, 92, 46, 104, 116, 109, 108],
         [100, 97, 105, 95, 105, 102, 114, 97, 109, 101, 40, 95, 40, 91, 97, 45, 122, 48, 45, 57, 93, 41, 123, 50, 44, 51, 125,
             41, 123, 48, 44, 50, 125, 92, 46, 104, 116, 109, 108
         ],
         [100, 97, 105, 95, 99, 116, 118, 95, 105, 102, 114, 97, 109, 101, 40, 91, 48, 45, 57, 93, 43, 92, 46, 91, 48, 45, 57, 92, 46, 93, 43, 41, 40, 95, 40, 91, 97, 45, 122, 48, 45, 57, 93, 41, 123, 50, 44, 51, 125, 41, 123, 48, 44, 50, 125, 92, 46, 104, 116, 109, 108],
         [100, 97, 105, 95, 99, 116, 118, 95, 105, 102, 114, 97, 109, 101, 40, 91, 48, 45, 57, 93, 43, 92, 46, 91, 48, 45, 57, 92, 46, 93, 43, 41, 95, 100, 101, 98, 117, 103, 40, 95, 40, 91, 97, 45, 122, 48, 45, 57, 93, 41, 123, 50, 44, 51, 125, 41, 123, 48, 44, 50, 125, 92, 46, 104, 116, 109, 108],
         [100, 97, 105, 95, 99, 116, 118, 95, 105,
             102, 114, 97, 109, 101, 40, 95, 40, 91, 97, 45, 122, 48, 45, 57, 93, 41, 123, 50, 44, 51, 125, 41, 123, 48, 44, 50, 125, 92, 46, 104, 116, 109, 108
         ]
     ], !0);
     new LW(PW, [
         [112, 97, 108, 46, 106, 115]
     ], !1);
     new LW(PW, [
         [99, 97, 115, 116, 95, 112, 97, 108, 46, 106, 115]
     ], !1);
     new LW(PW, [
         [99, 116, 118, 95, 112, 97, 108, 46, 106, 115]
     ], !1);

     function WW(a, b) {
         for (var c = {}, d = 0; d < b.length; c = {
                 Ie: void 0
             }, d++)
             if (c.Ie = b[d], a.some(function(e) {
                     return function(f) {
                         return MW(f, e.Ie.src)
                     }
                 }(c))) return c.Ie;
         return null
     };
     if (! function(a) {
             if (a.some(function(c) {
                     return MW(c, Oj().location.href)
                 })) return !0;
             var b = WW(a, document.querySelectorAll("SCRIPT"));
             b == null && document.querySelectorAll && (b = WW(a, document.querySelectorAll("script")));
             return b != null
         }([SW, UW, TW, VW])) throw Error("IMA SDK is either not loaded from a google domain or is not a supported version.");
     var XW, YW = Jo();
     XW = E(YW, Ao, 3);
     var ZW = GU,
         $W = XW != null ? XW : null,
         aX = sL(),
         bX;
     if ($W) {
         var cX = pg($W, 1);
         if (cX && (new URL(aX)).hostname.includes(cX)) {
             var dX = E($W, bi, 2);
             bX = dX ? dX : null
         } else bX = null
     } else bX = null;
     var eX = bX;
     if (eX) ZW.g = eX;
     else {
         var FS = ZW.j,
             LS = {
                 pageUrl: aX
             };
         try {
             var GS = KS();
             if (!GS) throw Error("Could not generate config URL");
             IS()
         } catch (a) {
             HS(FS, a)
         }
     };
 })();