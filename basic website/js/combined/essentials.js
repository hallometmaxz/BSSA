'use strict';
(function(b, c) {
    var a = 0,
        d = c("head"),
        f = b.BigText,
        e = c.fn.bigtext,
        g = {
            DEBUG_MODE: !1,
            DEFAULT_MIN_FONT_SIZE_PX: null,
            DEFAULT_MAX_FONT_SIZE_PX: 528,
            GLOBAL_STYLE_ID: "bigtext-style",
            STYLE_ID: "bigtext-id",
            LINE_CLASS_PREFIX: "bigtext-line",
            EXEMPT_CLASS: "bigtext-exempt",
            noConflict: function(a) {
                a && (c.fn.bigtext = e, b.BigText = f);
                return g
            },
            supports: {
                wholeNumberFontSizeOnly: function() {
                    if (!("getComputedStyle" in b)) return !0;
                    var a = c("<div/>").css({
                            position: "absolute",
                            "font-size": "14.1px"
                        }).insertBefore(c("script").eq(0)),
                        d = b.getComputedStyle(a[0], null),
                        d = d && "14px" === d.getPropertyValue("font-size");
                    a.remove();
                    return d
                }()
            },
            init: function() {
                c("#" + g.GLOBAL_STYLE_ID).length || d.append(g.generateStyleTag(g.GLOBAL_STYLE_ID, [".bigtext * { white-space: nowrap; } .bigtext > * { display: block; }", ".bigtext ." + g.EXEMPT_CLASS + ", .bigtext ." + g.EXEMPT_CLASS + " * { white-space: normal; }"]))
            },
            bindResize: function(a, d) {
                var f;
                c(b).off(a).on(a, function() {
                    f && clearTimeout(f);
                    f = setTimeout(d, 100)
                })
            },
            getStyleId: function(a) {
                return g.STYLE_ID +
                    "-" + a
            },
            generateStyleTag: function(a, b) {
                return c("<style>" + b.join("\n") + "</style>").attr("id", a)
            },
            clearCss: function(a) {
                a = g.getStyleId(a);
                c("#" + a).remove()
            },
            generateCss: function(a, b, d, c) {
                var f = [];
                g.clearCss(a);
                for (var e = 0, z = b.length; e < z; e++) f.push("#" + a + " ." + g.LINE_CLASS_PREFIX + e + " {" + (c[e] ? " white-space: normal;" : "") + (b[e] ? " font-size: " + b[e] + "px;" : "") + (d[e] ? " word-spacing: " + d[e] + "px;" : "") + "}");
                return g.generateStyleTag(g.getStyleId(a), f)
            },
            jQueryMethod: function(b) {
                g.init();
                b = c.extend({
                    minfontsize: g.DEFAULT_MIN_FONT_SIZE_PX,
                    maxfontsize: g.DEFAULT_MAX_FONT_SIZE_PX,
                    childSelector: "",
                    resize: !0
                }, b || {});
                this.each(function() {
                    var f = c(this).addClass("bigtext"),
                        e = f.width(),
                        n = f.attr("id"),
                        u = b.childSelector ? f.find(b.childSelector) : f.children();
                    n || (n = "bigtext-id" + a++, f.attr("id", n));
                    b.resize && g.bindResize("resize.bigtext-event-" + n, function() {
                        g.jQueryMethod.call(c("#" + n), b)
                    });
                    g.clearCss(n);
                    u.addClass(function(a, b) {
                        return [b.replace(new RegExp("\\b" + g.LINE_CLASS_PREFIX + "\\d+\\b"), ""), g.LINE_CLASS_PREFIX + a].join(" ")
                    });
                    f = g.calculateSizes(f,
                        u, e, b.maxfontsize, b.minfontsize);
                    d.append(g.generateCss(n, f.fontSizes, f.wordSpacings, f.minFontSizes))
                });
                return this.trigger("bigtext:complete")
            },
            testLineDimensions: function(a, b, d, c, f, e, g) {
                g = "number" === typeof g ? g : 0;
                a.css(d, c + e);
                e = a.width();
                if (e >= b) {
                    a.css(d, "");
                    if (e === b) return {
                        match: "exact",
                        size: parseFloat((parseFloat(c) - .1).toFixed(3))
                    };
                    a = b - g;
                    b = e - b;
                    return {
                        match: "estimate",
                        size: parseFloat((parseFloat(c) - ("word-spacing" === d && g && b < a ? 0 : f)).toFixed(3))
                    }
                }
                return e
            },
            calculateSizes: function(a, b, d, f, e) {
                a = a.clone(!0).addClass("bigtext-cloned").css({
                    fontFamily: a.css("font-family"),
                    textTransform: a.css("text-transform"),
                    wordSpacing: a.css("word-spacing"),
                    letterSpacing: a.css("letter-spacing"),
                    position: "absolute",
                    left: g.DEBUG_MODE ? 0 : -9999,
                    top: g.DEBUG_MODE ? 0 : -9999
                }).appendTo(document.body);
                var J = [],
                    z = [],
                    V = [],
                    m = [];
                b.css("float", "left").each(function() {
                    var a = c(this),
                        b = g.supports.wholeNumberFontSizeOnly ? [8, 4, 1] : [8, 4, 1, .1],
                        t, h;
                    if (a.hasClass(g.EXEMPT_CLASS)) J.push(null), m.push(null), V.push(!1);
                    else {
                        h = parseFloat(a.css("font-size"));
                        h = (a.width() / h).toFixed(6);
                        h = parseInt(d / h, 10) - 32;
                        var k =
                            0,
                            z = b.length;
                        a: for (; k < z; k++) {
                            var O = 1;
                            b: for (; 10 >= O; O++) {
                                if (h + O * b[k] > f) {
                                    h = f;
                                    break a
                                }
                                t = g.testLineDimensions(a, d, "font-size", h + O * b[k], b[k], "px", t);
                                if ("number" !== typeof t) {
                                    h = t.size;
                                    if ("exact" === t.match) break a;
                                    break b
                                }
                            }
                        }
                        m.push(d / h);
                        h > f ? (J.push(f), V.push(!1)) : e && h < e ? (J.push(e), V.push(!0)) : (J.push(h), V.push(!1))
                    }
                }).each(function(a) {
                    var b = c(this),
                        f = 0,
                        e;
                    if (b.hasClass(g.EXEMPT_CLASS)) z.push(null);
                    else {
                        b.css("font-size", J[a] + "px");
                        for (a = 1; 3 > a; a += 1)
                            if (e = g.testLineDimensions(b, d, "word-spacing", a, 1, "px", e), "number" !==
                                typeof e) {
                                f = e.size;
                                break
                            }
                        b.css("font-size", "");
                        z.push(f)
                    }
                }).removeAttr("style");
                g.DEBUG_MODE ? a.css({
                    "background-color": "rgba(255,255,255,.4)"
                }) : a.remove();
                return {
                    fontSizes: J,
                    wordSpacings: z,
                    ratios: m,
                    minFontSizes: V
                }
            }
        };
    c.fn.bigtext = g.jQueryMethod;
    b.BigText = g
})(this, jQuery);
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
    _gsScope._gsDefine("easing.CustomEase", ["easing.Ease"], function(b) {
        var c = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
            a = /[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
            d = /[\+\-]?\d*\.?\d+e[\+\-]?\d+/gi,
            f = /[cLlsS]/g,
            e = function(a, b, d, c, f, m, p, g, t, l, h) {
                var k, O = (a + d) / 2,
                    E = (b + c) / 2,
                    B = (d + f) / 2,
                    I = (c + m) / 2,
                    F = (f + p) / 2,
                    R = (m + g) / 2,
                    H = (O + B) / 2,
                    W = (E + I) / 2,
                    B = (B + F) / 2,
                    I = (I + R) / 2,
                    C = (H + B) / 2,
                    fa = (W + I) / 2,
                    Z = p - a,
                    na = g - b;
                d = Math.abs((d - p) * na - (c - g) * Z);
                f = Math.abs((f - p) *
                    na - (m - g) * Z);
                return l || (l = [{
                    x: a,
                    y: b
                }, {
                    x: p,
                    y: g
                }], h = 1), l.splice(h || l.length - 1, 0, {
                    x: C,
                    y: fa
                }), (d + f) * (d + f) > t * (Z * Z + na * na) && (k = l.length, e(a, b, O, E, H, W, C, fa, t, l, h), e(C, fa, B, I, F, R, p, g, t, l, h + 1 + (l.length - k))), l
            },
            g = function(b) {
                var c, f, e, g, m, p, q, t, l, h, k = (b + "").replace(d, function(a) {
                        a = +a;
                        return 1E-4 > a && -1E-4 < a ? 0 : a
                    }).match(a) || [],
                    O = [],
                    E = 0,
                    B = 0,
                    I = k.length,
                    F = 2;
                for (b = 0; I > b; b++)
                    if (t = e, isNaN(k[b]) ? (e = k[b].toUpperCase(), g = e !== k[b]) : b--, c = +k[b + 1], f = +k[b + 2], g && (c += E, f += B), b || (p = c, q = f), "M" === e) m && 8 > m.length && (--O.length, F =
                        0), E = p = c, B = q = f, m = [c, f], F = 2, O.push(m), b += 2, e = "L";
                    else if ("C" === e) m || (m = [0, 0]), m[F++] = c, m[F++] = f, g || (E = B = 0), m[F++] = E + 1 * k[b + 3], m[F++] = B + 1 * k[b + 4], m[F++] = E += 1 * k[b + 5], m[F++] = B += 1 * k[b + 6], b += 6;
                else if ("S" === e) "C" === t || "S" === t ? (l = E - m[F - 4], h = B - m[F - 3], m[F++] = E + l, m[F++] = B + h) : (m[F++] = E, m[F++] = B), m[F++] = c, m[F++] = f, g || (E = B = 0), m[F++] = E += 1 * k[b + 3], m[F++] = B += 1 * k[b + 4], b += 4;
                else {
                    if ("L" !== e && "Z" !== e) throw "CustomEase only accepts Cubic Bezier data.";
                    "Z" === e && (c = p, f = q, m.closed = !0);
                    ("L" === e || .5 < Math.abs(E - c) || .5 < Math.abs(B -
                        f)) && (m[F++] = E + (c - E) / 3, m[F++] = B + (f - B) / 3, m[F++] = E + 2 * (c - E) / 3, m[F++] = B + 2 * (f - B) / 3, m[F++] = c, m[F++] = f, "L" === e && (b += 2));
                    E = c;
                    B = f
                }
                return O[0]
            },
            k = function(a) {
                var b = this.lookup[a * this.l | 0] || this.lookup[this.l - 1];
                return b.nx < a && (b = b.n), b.y + (a - b.x) / b.cx * b.cy
            },
            h = function(a, d, c) {
                this._calcEnd = !0;
                (this.id = a) && (b.map[a] = this);
                this.getRatio = k;
                this.setData(d, c)
            },
            l = h.prototype = new b;
        return l.constructor = h, l.setData = function(a, b) {
            a = a || "0,0,1,1";
            var d, l, V, m, p, q, t;
            q = a.match(c);
            p = 1;
            var h = [];
            if (b = b || {}, t = b.precision || 1, this.data =
                a, this.lookup = [], this.points = h, this.fast = 1 >= t, (f.test(a) || -1 !== a.indexOf("M") && -1 === a.indexOf("C")) && (q = g(a)), d = q.length, 4 === d) q.unshift(0, 0), q.push(1, 1), d = 8;
            else if ((d - 2) % 6) throw "CustomEase only accepts Cubic Bezier data.";
            if (0 !== +q[0] || 1 !== +q[d - 2]) {
                m = q;
                var k = b.height,
                    K = b.originY;
                K || 0 === K || (K = Math.max(+m[m.length - 1], +m[1]));
                V = -1 * +m[0];
                var K = -K,
                    O = m.length,
                    E = 1 / (+m[O - 2] + V);
                if (!(k = -k))
                    if (Math.abs(+m[O - 1] - +m[1]) < .01 * (+m[O - 2] - +m[0])) {
                        for (var B = m.length, I = 999999999999, k = 1; B > k; k += 6) + m[k] < I && (I = +m[k]);
                        k =
                            I + K
                    } else k = +m[O - 1] + K;
                B = (B = k) ? 1 / B : -E;
                for (k = 0; O > k; k += 2) m[k] = (+m[k] + V) * E, m[k + 1] = (+m[k + 1] + K) * B
            }
            this.rawBezier = q;
            for (m = 2; d > m; m += 6) l = {
                x: +q[m - 2],
                y: +q[m - 1]
            }, V = {
                x: +q[m + 4],
                y: +q[m + 5]
            }, h.push(l, V), e(l.x, l.y, +q[m], +q[m + 1], +q[m + 2], +q[m + 3], V.x, V.y, 1 / (2E5 * t), h, h.length - 1);
            d = h.length;
            for (m = 0; d > m; m++) t = h[m], q = h[m - 1] || t, t.x > q.x || q.y !== t.y && q.x === t.x || t === q ? (q.cx = t.x - q.x, q.cy = t.y - q.y, q.n = t, q.nx = t.x, this.fast && 1 < m && 2 < Math.abs(q.cy / q.cx - h[m - 2].cy / h[m - 2].cx) && (this.fast = !1), q.cx < p && (q.cx ? p = q.cx : (q.cx = .001, m === d - 1 && (q.x -=
                .001, p = Math.min(p, .001), this.fast = !1)))) : (h.splice(m--, 1), d--);
            if (d = 1 / p + 1 | 0, this.l = d, p = 1 / d, q = 0, t = h[0], this.fast) {
                for (m = 0; d > m; m++) V = m * p, t.nx < V && (t = h[++q]), l = t.y + (V - t.x) / t.cx * t.cy, this.lookup[m] = {
                    x: V,
                    cx: p,
                    y: l,
                    cy: 0,
                    nx: 9
                }, m && (this.lookup[m - 1].cy = l - this.lookup[m - 1].y);
                this.lookup[d - 1].cy = h[h.length - 1].y - l
            } else {
                for (m = 0; d > m; m++) t.nx < m * p && (t = h[++q]), this.lookup[m] = t;
                q < h.length - 1 && (this.lookup[m - 1] = h[h.length - 2])
            }
            return this._calcEnd = 1 !== h[h.length - 1].y || 0 !== h[0].y, this
        }, l.getRatio = k, l.getSVGData = function(a) {
            return h.getSVGData(this,
                a)
        }, h.create = function(a, b, d) {
            return new h(a, b, d)
        }, h.version = "0.2.2", h.bezierToPoints = e, h.get = function(a) {
            return b.map[a]
        }, h.getSVGData = function(a, d) {
            d = d || {};
            var c, f, e, m, p, g, t, h, l, k, O = d.width || 100,
                E = d.height || 100,
                B = d.x || 0,
                I = (d.y || 0) + E,
                F = d.path;
            if (d.invert && (E = -E, I = 0), a = a.getRatio ? a : b.map[a] || console.log("No ease found: ", a), a.rawBezier) {
                c = [];
                t = a.rawBezier.length;
                for (e = 0; t > e; e += 2) c.push((1E3 * (B + a.rawBezier[e] * O) | 0) / 1E3 + "," + (1E3 * (I + a.rawBezier[e + 1] * -E) | 0) / 1E3);
                c[0] = "M" + c[0];
                c[1] = "C" + c[1]
            } else
                for (c = ["M" + B + "," + I], t = Math.max(5, 200 * (d.precision || 1)), m = 1 / t, t += 2, h = 5 / t, l = (1E3 * (B + m * O) | 0) / 1E3, k = (1E3 * (I + a.getRatio(m) * -E) | 0) / 1E3, f = (k - I) / (l - B), e = 2; t > e; e++) p = (1E3 * (B + e * m * O) | 0) / 1E3, g = (1E3 * (I + a.getRatio(e * m) * -E) | 0) / 1E3, (Math.abs((g - k) / (p - l) - f) > h || e === t - 1) && (c.push(l + "," + k), f = (g - k) / (p - l)), l = p, k = g;
            return F && ("string" == typeof F ? document.querySelector(F) : F).setAttribute("d", c.join(" ")), c.join(" ")
        }, h
    }, !0)
});
_gsScope._gsDefine && _gsScope._gsQueue.pop()();
(function(b) {
    var c = function() {
        return (_gsScope.GreenSockGlobals || _gsScope)[b]
    };
    "undefined" != typeof module && module.exports ? (require("../TweenLite.min.js"), module.exports = c()) : "function" == typeof define && define.amd && define(["TweenLite"], c)
})("CustomEase");

function parseBool(b, c) {
    c = c || {};
    var a = c.ignoreCase && "string" == typeof b ? b.toLowerCase() : b;
    return "false" === a ? !1 : "true" === a ? !0 : c.force ? !!a : a
}
$(function() {
    function b() {
        var b = $(this),
            a = b.find(".modal-dialog");
        b.css("display", "block");
        a.css("margin-top", Math.max(0, ($(window).height() - a.height()) / 2))
    }
    $(".modal").on("show.bs.modal", b);
    $(window).on("resize", function() {
        $(".modal:visible").each(b)
    })
});
! function(b) {
    var c, a, d = b.event;
    c = d.special.debouncedresize = {
        setup: function() {
            b(this).on("resize", c.handler)
        },
        teardown: function() {
            b(this).off("resize", c.handler)
        },
        handler: function(b, e) {
            var g = this,
                k = arguments,
                h = function() {
                    b.type = "debouncedresize";
                    d.dispatch.apply(g, k)
                };
            a && clearTimeout(a);
            e ? h() : a = setTimeout(h, c.threshold)
        },
        threshold: 150
    }
}(jQuery);
Number.prototype.roundTo = function(b) {
    var c = this % b;
    return c <= b / 2 ? this - c : this + b - c
};
(function() {
    ! function(b, c) {
        return "function" == typeof define && define.amd ? define(function() {
            return c()
        }) : "object" == typeof exports ? module.exports = c() : b.ifvisible = c()
    }(this, function() {
        var b, c, a, d, f, e, g, k, h, l, n, u, J;
        return k = {}, a = document, l = !1, n = "active", e = 6E4, f = !1, c = function() {
                var a, b, d, c;
                return d = {}, a = function(a, b, c) {
                        return a.__ceGUID = void 0, a.__ceGUID || (a.__ceGUID = "ifvisible.object.event.identifier"), d[a.__ceGUID] || (d[a.__ceGUID] = {}), d[a.__ceGUID][b] || (d[a.__ceGUID][b] = []), d[a.__ceGUID][b].push(c)
                    }, b =
                    function(a, b, c) {
                        var f, e, p;
                        if (a.__ceGUID && d[a.__ceGUID] && d[a.__ceGUID][b]) {
                            e = d[a.__ceGUID][b];
                            p = [];
                            b = 0;
                            for (f = e.length; b < f; b++) a = e[b], p.push(a(c || {}));
                            return p
                        }
                    }, c = function(a, b, c) {
                        var f, e, p, g, h;
                        if (c) {
                            if (a.__ceGUID && d[a.__ceGUID] && d[a.__ceGUID][b])
                                for (h = d[a.__ceGUID][b], e = p = 0, g = h.length; p < g; e = ++p)
                                    if (f = h[e], f === c) return d[a.__ceGUID][b].splice(e, 1), f
                        } else if (a.__ceGUID && d[a.__ceGUID] && d[a.__ceGUID][b]) return delete d[a.__ceGUID][b]
                    }, {
                        add: a,
                        remove: c,
                        fire: b
                    }
            }(), b = function() {
                var a;
                return a = !1,
                    function(b,
                        d, c) {
                        return a || (a = b.addEventListener ? function(a, b, d) {
                            return a.addEventListener(b, d, !1)
                        } : b.attachEvent ? function(a, b, d) {
                            return a.attachEvent("on" + b, d, !1)
                        } : function(a, b, d) {
                            return a["on" + b] = d
                        }), a(b, d, c)
                    }
            }(), g = function() {
                var b, d, c, f;
                f = 3;
                c = a.createElement("div");
                b = c.getElementsByTagName("i");
                for (d = function() {
                        return c.innerHTML = "\x3c!--[if gt IE " + ++f + "]><i></i><![endif]--\x3e", b[0]
                    }; d(););
                return 4 < f ? f : void 0
            }(), d = !1, J = void 0, "undefined" != typeof a.hidden ? (d = "hidden", J = "visibilitychange") : "undefined" != typeof a.mozHidden ?
            (d = "mozHidden", J = "mozvisibilitychange") : "undefined" != typeof a.msHidden ? (d = "msHidden", J = "msvisibilitychange") : "undefined" != typeof a.webkitHidden && (d = "webkitHidden", J = "webkitvisibilitychange"), u = function() {
                var d, c;
                return d = [], c = function() {
                    return d.map(clearTimeout), "active" !== n && k.wakeup(), f = +new Date, d.push(setTimeout(function() {
                        if ("active" === n) return k.idle()
                    }, e))
                }, c(), b(a, "mousemove", c), b(a, "keyup", c), b(a, "touchstart", c), b(window, "scroll", c), k.focus(c), k.wakeup(c)
            }, h = function() {
                var c;
                return !!l ||
                    (!1 === d ? (c = "blur", 9 > g && (c = "focusout"), b(window, c, function() {
                        return k.blur()
                    }), b(window, "focus", function() {
                        return k.focus()
                    })) : b(a, J, function() {
                        return a[d] ? k.blur() : k.focus()
                    }, !1), l = !0, u())
            }, k = {
                setIdleDuration: function(a) {
                    return e = 1E3 * a
                },
                getIdleDuration: function() {
                    return e
                },
                getIdleInfo: function() {
                    var a, b;
                    return a = +new Date, b = {}, "idle" === n ? (b.isIdle = !0, b.idleFor = a - f, b.timeLeft = 0, b.timeLeftPer = 100) : (b.isIdle = !1, b.idleFor = a - f, b.timeLeft = f + e - a, b.timeLeftPer = (100 - 100 * b.timeLeft / e).toFixed(2)), b
                },
                focus: function(a) {
                    return "function" ==
                        typeof a ? this.on("focus", a) : (n = "active", c.fire(this, "focus"), c.fire(this, "wakeup"), c.fire(this, "statusChanged", {
                            status: n
                        })), this
                },
                blur: function(a) {
                    return "function" == typeof a ? this.on("blur", a) : (n = "hidden", c.fire(this, "blur"), c.fire(this, "idle"), c.fire(this, "statusChanged", {
                        status: n
                    })), this
                },
                idle: function(a) {
                    return "function" == typeof a ? this.on("idle", a) : (n = "idle", c.fire(this, "idle"), c.fire(this, "statusChanged", {
                        status: n
                    })), this
                },
                wakeup: function(a) {
                    return "function" == typeof a ? this.on("wakeup", a) : (n = "active",
                        c.fire(this, "wakeup"), c.fire(this, "statusChanged", {
                            status: n
                        })), this
                },
                on: function(a, b) {
                    return h(), c.add(this, a, b), this
                },
                off: function(a, b) {
                    return h(), c.remove(this, a, b), this
                },
                onEvery: function(a, b) {
                    var d, c;
                    return h(), d = !1, b && (c = setInterval(function() {
                        if ("active" === n && !1 === d) return b()
                    }, 1E3 * a)), {
                        stop: function() {
                            return clearInterval(c)
                        },
                        pause: function() {
                            return d = !0
                        },
                        resume: function() {
                            return d = !1
                        },
                        code: c,
                        callback: b
                    }
                },
                now: function(a) {
                    return h(), n === (a || "active")
                }
            }
    })
}).call(this);
! function(b) {
    var c = /iPhone/i,
        a = /iPod/i,
        d = /iPad/i,
        f = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,
        e = /Android/i,
        g = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,
        k = /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,
        h = /Windows Phone/i,
        l = /(?=.*\bWindows\b)(?=.*\bARM\b)/i,
        n = /BlackBerry/i,
        u = /BB10/i,
        J = /Opera Mini/i,
        z = /(CriOS|Chrome)(?=.*\bMobile\b)/i,
        V = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,
        m = /(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)/i,
        p = function(b) {
            b =
                b || navigator.userAgent || "";
            var p = b.split("[FBAN");
            if ("undefined" != typeof p[1] && (b = p[0]), p = b.split("Twitter"), "undefined" != typeof p[1] && (b = p[0]), this.apple = {
                    phone: c.test(b),
                    ipod: a.test(b),
                    tablet: !c.test(b) && d.test(b),
                    device: c.test(b) || a.test(b) || d.test(b)
                }, this.amazon = {
                    phone: g.test(b),
                    tablet: !g.test(b) && k.test(b),
                    device: g.test(b) || k.test(b)
                }, this.android = {
                    phone: g.test(b) || f.test(b),
                    tablet: !g.test(b) && !f.test(b) && (k.test(b) || e.test(b)),
                    device: g.test(b) || k.test(b) || f.test(b) || e.test(b)
                }, this.windows = {
                    phone: h.test(b),
                    tablet: l.test(b),
                    device: h.test(b) || l.test(b)
                }, this.other = {
                    blackberry: n.test(b),
                    blackberry10: u.test(b),
                    opera: J.test(b),
                    firefox: V.test(b),
                    chrome: z.test(b),
                    device: n.test(b) || u.test(b) || J.test(b) || V.test(b) || z.test(b)
                }, this.seven_inch = m.test(b), this.any = this.apple.device || this.android.device || this.windows.device || this.other.device || this.seven_inch, this.phone = this.apple.phone || this.android.phone || this.windows.phone, this.tablet = this.apple.tablet || this.android.tablet || this.windows.tablet,
                "undefined" == typeof window) return this
        },
        q = function() {
            var a = new p;
            return a.Class = p, a
        };
    "undefined" != typeof module && module.exports && "undefined" == typeof window ? module.exports = p : "undefined" != typeof module && module.exports && "undefined" != typeof window ? module.exports = q() : "function" == typeof define && define.amd ? define("isMobile", [], b.isMobile = q()) : b.isMobile = q()
}(this);

function onYouTubeIframeAPIReady() {
    ytp.YTAPIReady || (ytp.YTAPIReady = !0, jQuery(document).trigger("YTAPIReady"))
}

function iOSversion() {
    if (/iP(hone|od|ad)/.test(navigator.platform)) {
        var b = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
        return [parseInt(b[1], 10), parseInt(b[2], 10), parseInt(b[3] || 0, 10)]
    }
}

function uncamel(b) {
    return b.replace(/([A-Z])/g, function(b) {
        return "-" + b.toLowerCase()
    })
}

function setUnit(b, c) {
    return "string" != typeof b || b.match(/^[\-0-9\.]+jQuery/) ? "" + b + c : b
}

function setFilter(b, c, a) {
    var d = uncamel(c),
        f = jQuery.browser.mozilla ? "" : jQuery.CSS.sfx;
    b[f + "filter"] = b[f + "filter"] || "";
    a = setUnit(a > jQuery.CSS.filters[c].max ? jQuery.CSS.filters[c].max : a, jQuery.CSS.filters[c].unit);
    b[f + "filter"] += d + "(" + a + ") ";
    delete b[c]
}

function isTouchSupported() {
    var b = nAgt.msMaxTouchPoints,
        c = "ontouchstart" in document.createElement("div");
    return b || c ? !0 : !1
}

function isTouchSupported() {
    var b = nAgt.msMaxTouchPoints,
        c = "ontouchstart" in document.createElement("div");
    return b || c ? !0 : !1
}
var ytp = ytp || {},
    getYTPVideoID = function(b) {
        var c, a;
        return 0 < b.indexOf("youtu.be") || 0 < b.indexOf("youtube.com/embed") ? (c = b.substr(b.lastIndexOf("/") + 1, b.length), a = 0 < c.indexOf("?list=") ? c.substr(c.lastIndexOf("="), c.length) : null, c = a ? c.substr(0, c.lastIndexOf("?")) : c) : -1 < b.indexOf("http") ? (c = b.match(/[\\?&]v=([^&#]*)/)[1], a = 0 < b.indexOf("list=") ? b.match(/[\\?&]list=([^&#]*)/)[1] : null) : (c = 15 < b.length ? null : b, a = c ? null : b), {
            videoID: c,
            playlistID: a
        }
    };
! function(b, c) {
    b.mbYTPlayer = {
        name: "jquery.mb.YTPlayer",
        version: "3.2.7",
        build: "7318",
        author: "Matteo Bicocchi (pupunzi)",
        apiKey: "",
        defaults: {
            videoURL: null,
            containment: "body",
            ratio: "auto",
            fadeOnStartTime: 1500,
            startAt: 0,
            stopAt: 0,
            autoPlay: !0,
            coverImage: !1,
            loop: !0,
            addRaster: !1,
            mask: !1,
            opacity: 1,
            quality: "default",
            vol: 50,
            mute: !1,
            showControls: !0,
            anchor: "center,center",
            showAnnotations: !1,
            cc_load_policy: !1,
            showYTLogo: !0,
            useOnMobile: !0,
            mobileFallbackImage: null,
            playOnlyIfVisible: !1,
            onScreenPercentage: 30,
            stopMovieOnBlur: !0,
            realfullscreen: !0,
            optimizeDisplay: !0,
            abundance: .2,
            gaTrack: !0,
            remember_last_time: !1,
            addFilters: !1,
            onReady: function(a) {},
            onError: function(a, b) {}
        },
        controls: {
            play: "P",
            pause: "p",
            mute: "M",
            unmute: "A",
            onlyYT: "O",
            showSite: "R",
            ytLogo: "Y"
        },
        controlBar: null,
        locationProtocol: "https:",
        defaultFilters: {
            grayscale: {
                value: 0,
                unit: "%"
            },
            hue_rotate: {
                value: 0,
                unit: "deg"
            },
            invert: {
                value: 0,
                unit: "%"
            },
            opacity: {
                value: 0,
                unit: "%"
            },
            saturate: {
                value: 0,
                unit: "%"
            },
            sepia: {
                value: 0,
                unit: "%"
            },
            brightness: {
                value: 0,
                unit: "%"
            },
            contrast: {
                value: 0,
                unit: "%"
            },
            blur: {
                value: 0,
                unit: "px"
            }
        },
        buildPlayer: function(a) {
            function d() {
                var a = !1;
                try {
                    self.location.href != top.location.href && (a = !0)
                } catch (b) {
                    a = !0
                }
                return a
            }
            if (c.YTAPIReady || "undefined" != typeof window.YT) setTimeout(function() {
                b(document).trigger("YTAPIReady");
                c.YTAPIReady = !0
            }, 100);
            else {
                b("#YTAPI").remove();
                var f = b("<script>\x3c/script>").attr({
                    src: b.mbYTPlayer.locationProtocol + "//www.youtube.com/iframe_api?v=" + b.mbYTPlayer.version,
                    id: "YTAPI"
                });
                b("head").prepend(f)
            }
            return this.each(function() {
                var f =
                    this,
                    g = b(f);
                g.hide();
                f.loop = 0;
                f.state = 0;
                f.filters = b.extend(!0, {}, b.mbYTPlayer.defaultFilters);
                f.filtersEnabled = !0;
                f.id = f.id || "YTP_" + (new Date).getTime();
                g.addClass("mb_YTPlayer");
                var k = g.data("property") && "string" == typeof g.data("property") ? eval("(" + g.data("property") + ")") : g.data("property");
                "object" != typeof k && (k = {});
                f.opt = b.extend(!0, {}, b.mbYTPlayer.defaults, f.opt, a, k);
                f.opt.elementId = f.id;
                0 === f.opt.vol && (f.opt.vol = 1, f.opt.mute = !0);
                f.opt.autoPlay && 0 == f.opt.mute && b.mbBrowser.chrome && (b(document).one("mousedown.YTPstart",
                    function() {
                        g.YTPPlay()
                    }), console.info("YTPlayer info: On Webkit browsers you can not autoplay the video if the audio is on."));
                f.opt.loop && "boolean" == typeof f.opt.loop && (f.opt.loop = 9999);
                k = document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;
                f.opt.realfullscreen = d() || !k ? !1 : f.opt.realfullscreen;
                f.opt.showAnnotations = f.opt.showAnnotations ? "1" : "3";
                f.opt.cc_load_policy = f.opt.cc_load_policy ? "1" : "0";
                f.opt.coverImage = f.opt.coverImage ||
                    f.opt.backgroundImage;
                b.mbBrowser.msie && 9 > b.mbBrowser.version && (f.opt.opacity = 1);
                "mac" == b.mbBrowser.os.name && b.mbBrowser.safari && (f.opt.fadeOnStartTime = f.opt.fadeOnStartTime);
                f.opt.containment = "self" === f.opt.containment ? g : b(f.opt.containment);
                f.isRetina = window.retina || 1 < window.devicePixelRatio;
                f.opt.ratio = "auto" === f.opt.ratio ? 16 / 9 : f.opt.ratio;
                f.opt.ratio = eval(f.opt.ratio);
                f.orig_containment_background = f.opt.containment.css("background-image");
                g.attr("id") || g.attr("id", "ytp_" + (new Date).getTime());
                f.playerID = "iframe_" + f.id;
                f.isAlone = !1;
                f.hasFocus = !0;
                f.videoID = f.opt.videoURL ? getYTPVideoID(f.opt.videoURL).videoID : g.attr("href") ? getYTPVideoID(g.attr("href")).videoID : !1;
                f.playlistID = f.opt.videoURL ? getYTPVideoID(f.opt.videoURL).playlistID : g.attr("href") ? getYTPVideoID(g.attr("href")).playlistID : !1;
                k = 0;
                if (b.mbCookie.get("YTPlayer_start_from" + f.videoID) && (k = parseFloat(b.mbCookie.get("YTPlayer_start_from" + f.videoID))), f.opt.remember_last_time && k && (f.start_from_last = k, b.mbCookie.remove("YTPlayer_start_from" +
                        f.videoID)), f.isPlayer = g.is(f.opt.containment), f.isBackground = f.opt.containment.is("body"), !f.isBackground || !c.backgroundIsInited) {
                    f.isPlayer && g.show();
                    f.overlay = b("<div/>").css({
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%"
                    }).addClass("YTPOverlay");
                    f.wrapper = b("<div/>").attr("id", "wrapper_" + f.id).css({
                        position: "absolute",
                        zIndex: 0,
                        minWidth: "100%",
                        minHeight: "100%",
                        left: 0,
                        top: 0,
                        overflow: "hidden",
                        opacity: 0
                    }).addClass("mbYTP_wrapper");
                    f.isPlayer && (f.inlinePlayButton = b("<div/>").addClass("inlinePlayButton").html(b.mbYTPlayer.controls.play),
                        g.append(f.inlinePlayButton), f.inlinePlayButton.on("click", function(a) {
                            g.YTPPlay();
                            a.stopPropagation()
                        }), f.opt.autoPlay && f.inlinePlayButton.hide(), f.overlay.on("click", function() {
                            g.YTPTogglePlay()
                        }).css({
                            cursor: "pointer"
                        }));
                    k = b("<div/>").attr("id", f.playerID).addClass("playerBox");
                    if (k.css({
                            position: "absolute",
                            zIndex: 0,
                            width: "100%",
                            height: "100%",
                            top: 0,
                            left: 0,
                            overflow: "hidden",
                            opacity: 1
                        }), f.wrapper.append(k), k.after(f.overlay), f.isPlayer && (f.inlineWrapper = b("<div/>").addClass("inline-YTPlayer"), f.inlineWrapper.css({
                            position: "relative",
                            maxWidth: f.opt.containment.css("width")
                        }), f.opt.containment.css({
                            position: "relative",
                            paddingBottom: "56.25%",
                            overflow: "hidden",
                            height: 0
                        }), f.opt.containment.wrap(f.inlineWrapper)), f.opt.containment.children().not("script, style").each(function() {
                            "static" == b(this).css("position") && b(this).css("position", "relative")
                        }), f.isBackground ? (b("body").css({
                            boxSizing: "border-box"
                        }), f.wrapper.css({
                            position: "fixed",
                            top: 0,
                            left: 0,
                            zIndex: 0
                        })) : "static" == f.opt.containment.css("position") && (f.opt.containment.css({
                                position: "relative"
                            }),
                            g.show()), f.opt.containment.prepend(f.wrapper), f.isBackground || f.overlay.on("mouseenter", function() {
                            f.controlBar && f.controlBar.length && f.controlBar.addClass("visible")
                        }).on("mouseleave", function() {
                            f.controlBar && f.controlBar.length && f.controlBar.removeClass("visible")
                        }), b.mbBrowser.mobile && !f.opt.useOnMobile) return f.opt.mobileFallbackImage && (f.wrapper.css({
                            backgroundImage: "url(" + f.opt.mobileFallbackImage + ")",
                            backgroundPosition: "center center",
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            opacity: 1
                        }),
                        f.wrapper.css({
                            opacity: 1
                        })), g;
                    b.mbBrowser.mobile && f.opt.autoPlay && f.opt.useOnMobile && b("body").one("touchstart", function() {
                        f.player.playVideo()
                    });
                    b(document).one("YTAPIReady", function() {
                        g.trigger("YTAPIReady_" + f.id);
                        c.YTAPIReady = !0
                    });
                    f.isOnScreen = b.mbYTPlayer.isOnScreen(f, f.opt.onScreenPercentage);
                    g.one("YTAPIReady_" + f.id, function() {
                        var a = this,
                            d = b(a);
                        a.isBackground && c.backgroundIsInited || a.isInit || (a.isBackground && (c.backgroundIsInited = !0), a.opt.autoPlay = "undefined" == typeof a.opt.autoPlay ? a.isBackground ?
                            !0 : !1 : a.opt.autoPlay, a.opt.vol = a.opt.vol ? a.opt.vol : 100, b.mbYTPlayer.getDataFromAPI(a), b(a).on("YTPChanged", function(c) {
                                a.isInit || (a.isInit = !0, c = {
                                    modestbranding: 1,
                                    autoplay: 0,
                                    controls: 0,
                                    showinfo: 0,
                                    rel: 0,
                                    enablejsapi: 1,
                                    version: 3,
                                    playerapiid: a.playerID,
                                    origin: "*",
                                    allowfullscreen: !0,
                                    wmode: "transparent",
                                    iv_load_policy: a.opt.showAnnotations,
                                    cc_load_policy: a.opt.cc_load_policy,
                                    playsinline: b.mbBrowser.mobile ? 1 : 0,
                                    html5: document.createElement("video").canPlayType ? 1 : 0
                                }, new YT.Player(a.playerID, {
                                    playerVars: c,
                                    events: {
                                        onReady: function(b) {
                                            a.player =
                                                b.target;
                                            a.player.loadVideoById({
                                                videoId: a.videoID.toString(),
                                                suggestedQuality: a.opt.quality
                                            });
                                            d.trigger("YTPlayerIsReady_" + a.id)
                                        },
                                        onStateChange: function(d) {
                                            if ("function" == typeof d.target.getPlayerState) {
                                                d = d.target.getPlayerState();
                                                if (a.preventTrigger || a.isStarting) return void(a.preventTrigger = !1);
                                                a.state = d;
                                                var c;
                                                switch (d) {
                                                    case -1:
                                                        c = "YTPUnstarted";
                                                        break;
                                                    case 0:
                                                        c = "YTPRealEnd";
                                                        break;
                                                    case 1:
                                                        c = "YTPPlay";
                                                        a.controlBar.length && a.controlBar.find(".mb_YTPPlayPause").html(b.mbYTPlayer.controls.pause);
                                                        a.isPlayer &&
                                                            a.inlinePlayButton.hide();
                                                        b(document).off("mousedown.YTPstart");
                                                        break;
                                                    case 2:
                                                        c = "YTPPause";
                                                        a.controlBar.length && a.controlBar.find(".mb_YTPPlayPause").html(b.mbYTPlayer.controls.play);
                                                        a.isPlayer && a.inlinePlayButton.show();
                                                        break;
                                                    case 3:
                                                        a.player.setPlaybackQuality(a.opt.quality);
                                                        c = "YTPBuffering";
                                                        a.controlBar.length && a.controlBar.find(".mb_YTPPlayPause").html(b.mbYTPlayer.controls.play);
                                                        break;
                                                    case 5:
                                                        c = "YTPCued"
                                                }
                                                c = b.Event(c);
                                                c.time = a.currentTime;
                                                b(a).trigger(c)
                                            }
                                        },
                                        onPlaybackQualityChange: function(d) {
                                            d = d.target.getPlaybackQuality();
                                            var c = b.Event("YTPQualityChange");
                                            c.quality = d;
                                            b(a).trigger(c)
                                        },
                                        onError: function(c) {
                                            switch ("function" == typeof a.opt.onError && a.opt.onError(d, c), c.data) {
                                                case 2:
                                                    console.error("video ID:: " + a.videoID + ": The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.");
                                                    break;
                                                case 5:
                                                    console.error("video ID:: " + a.videoID + ": The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.");
                                                    break;
                                                case 100:
                                                    console.error("video ID:: " + a.videoID + ": The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.");
                                                    break;
                                                case 101:
                                                case 150:
                                                    console.error("video ID:: " + a.videoID + ": The owner of the requested video does not allow it to be played in embedded players.")
                                            }
                                            a.isList && b(a).YTPPlayNext()
                                        }
                                    }
                                }), d.on("YTPlayerIsReady_" + a.id, function() {
                                    return a.isReady ? this : (a.playerEl = a.player.getIframe(), b(a.playerEl).unselectable(), d.optimizeDisplay(),
                                        b(window).off("resize.YTP_" + a.id).on("resize.YTP_" + a.id, function() {
                                            d.optimizeDisplay()
                                        }), a.opt.remember_last_time && b(window).on("unload.YTP_" + a.id, function() {
                                            var d = a.player.getCurrentTime();
                                            b.mbCookie.set("YTPlayer_start_from" + a.videoID, d, 0)
                                        }), void d.YTPCheckForState())
                                }))
                            }))
                    });
                    g.off("YTPTime.mask");
                    b.mbYTPlayer.applyMask(f)
                }
            })
        },
        isOnScreen: function(a, d) {
            d = d || 10;
            var c = a.wrapper,
                e = b(window).scrollTop(),
                g = e + b(window).height(),
                k = c.height() * d / 100,
                h = c.offset().top + k,
                c = c.offset().top + (c.height() - k);
            return g >=
                c && h >= e
        },
        getDataFromAPI: function(a) {
            if (a.videoData = b.mbStorage.get("YTPlayer_data_" + a.videoID), b(a).off("YTPData.YTPlayer").on("YTPData.YTPlayer", function() {
                    if (a.hasData && a.isPlayer && !a.opt.autoPlay) {
                        var b = a.opt.coverImage ? "url(" + a.opt.coverImage + ") center center" : a.orig_containment_background;
                        console.debug("1", b);
                        a.opt.containment.css({
                            background: b,
                            backgroundSize: "cover"
                        })
                    }
                }), a.videoData) setTimeout(function() {
                a.dataReceived = !0;
                var d = b.Event("YTPChanged");
                d.time = a.currentTime;
                d.videoId = a.videoID;
                d.opt = a.opt;
                b(a).trigger(d);
                d = b.Event("YTPData");
                d.prop = {};
                for (var c in a.videoData) d.prop[c] = a.videoData[c];
                b(a).trigger(d)
            }, a.opt.fadeOnStartTime), a.hasData = !0;
            else if (b.mbYTPlayer.apiKey) b.getJSON(b.mbYTPlayer.locationProtocol + "//www.googleapis.com/youtube/v3/videos?id=" + a.videoID + "&key=" + b.mbYTPlayer.apiKey + "&part=snippet", function(d) {
                a.dataReceived = !0;
                var c = b.Event("YTPChanged");
                c.time = a.currentTime;
                c.videoId = a.videoID;
                b(a).trigger(c);
                d.items[0] ? (d = d.items[0].snippet, a.videoData = {}, a.videoData.id =
                    a.videoID, a.videoData.channelTitle = d.channelTitle, a.videoData.title = d.title, a.videoData.description = 400 > d.description.length ? d.description : d.description.substring(0, 400) + " ...", a.videoData.thumb_max = d.thumbnails.maxres ? d.thumbnails.maxres.url : null, a.videoData.thumb_high = d.thumbnails.high ? d.thumbnails.high.url : null, a.videoData.thumb_medium = d.thumbnails.medium ? d.thumbnails.medium.url : null, b.mbStorage.set("YTPlayer_data_" + a.videoID, a.videoData), a.hasData = !0) : (a.videoData = {}, a.hasData = !1);
                d = b.Event("YTPData");
                d.prop = {};
                for (var g in a.videoData) d.prop[g] = a.videoData[g];
                b(a).trigger(d)
            });
            else {
                if (setTimeout(function() {
                        var d = b.Event("YTPChanged");
                        d.time = a.currentTime;
                        d.videoId = a.videoID;
                        b(a).trigger(d)
                    }, 50), !a.opt.autoPlay) {
                    var d = a.opt.coverImage ? "url(" + a.opt.coverImage + ") center center" : a.orig_containment_background;
                    d && a.opt.containment.css({
                        background: d,
                        backgroundSize: "cover"
                    })
                }
                a.videoData = null
            }
            a.opt.ratio = "auto" == a.opt.ratio ? "16/9" : a.opt.ratio;
            a.isPlayer && !a.opt.autoPlay && (a.loading = b("<div/>").addClass("loading").html("Loading").hide(),
                b(a).append(a.loading), a.loading.fadeIn())
        },
        removeStoredData: function() {
            b.mbStorage.remove()
        },
        getVideoData: function() {
            return this.get(0).videoData
        },
        getVideoID: function() {
            return this.get(0).videoID || !1
        },
        getPlaylistID: function() {
            return this.get(0).playlistID || !1
        },
        setVideoQuality: function(a) {
            return this.get(0).player.setPlaybackQuality(a), this
        },
        playlist: function(a, d, c) {
            var e = this.get(0);
            return e.isList = !0, d && (a = b.shuffle(a)), e.videoID || (e.videos = a, e.videoCounter = 1, e.videoLength = a.length, b(e).data("property",
                a[0]), b(e).YTPlayer()), "function" == typeof c && b(e).one("YTPChanged", function() {
                c(e)
            }), b(e).on("YTPEnd", function() {
                b(e).YTPPlayNext()
            }), this
        },
        playNext: function() {
            var a = this.get(0);
            return a.videoCounter++, a.videoCounter > a.videoLength && (a.videoCounter = 1), b(a).YTPPlayIndex(a.videoCounter), this
        },
        playPrev: function() {
            var a = this.get(0);
            return a.videoCounter--, 0 >= a.videoCounter && (a.videoCounter = a.videoLength), b(a).YTPPlayIndex(a.videoCounter), this
        },
        playIndex: function(a) {
            var d = this.get(0);
            d.checkForStartAt &&
                (clearInterval(d.checkForStartAt), clearInterval(d.getState));
            d.videoCounter = a;
            d.videoCounter >= d.videoLength && (d.videoCounter = d.videoLength);
            a = d.videos[d.videoCounter - 1];
            return b(d).YTPChangeVideo(a), this
        },
        changeVideo: function(a) {
            var d = this,
                c = d.get(0);
            c.opt.startAt = 0;
            c.opt.stopAt = 0;
            c.opt.mask = !1;
            c.opt.mute = !0;
            c.opt.autoPlay = !0;
            c.opt.addFilters = !1;
            c.opt.coverImage = !1;
            c.hasData = !1;
            c.hasChanged = !0;
            c.player.loopTime = void 0;
            a && b.extend(c.opt, a);
            console.debug("changeVideo::", c.opt);
            c.videoID = getYTPVideoID(c.opt.videoURL).videoID;
            c.opt.loop && "boolean" == typeof c.opt.loop && (c.opt.loop = 9999);
            c.wrapper.css({
                background: "none"
            });
            b(c.playerEl).CSSAnimate({
                opacity: 0
            }, c.opt.fadeOnStartTime, function() {
                b.mbYTPlayer.getDataFromAPI(c);
                console.debug("YTPGetPlayer::", d.YTPGetPlayer());
                d.YTPGetPlayer().loadVideoById({
                    videoId: c.videoID,
                    suggestedQuality: c.opt.quality
                });
                d.YTPPause();
                d.optimizeDisplay();
                d.YTPCheckForState()
            });
            a = b.Event("YTPChangeVideo");
            return a.time = c.currentTime, b(c).trigger(a), b.mbYTPlayer.applyMask(c), this
        },
        getPlayer: function() {
            var a =
                this.get(0);
            return a.isReady ? a.player || null : null
        },
        playerDestroy: function() {
            var a = this.get(0);
            return a.isReady ? (c.YTAPIReady = !0, c.backgroundIsInited = !1, a.isInit = !1, a.videoID = null, a.isReady = !1, a.wrapper.remove(), b("#controlBar_" + a.id).remove(), clearInterval(a.checkForStartAt), clearInterval(a.getState), this) : this
        },
        fullscreen: function(a) {
            function d() {
                g.overlay.css({
                    cursor: "none"
                })
            }

            function c(a, b) {
                for (var d, f, e = ["webkit", "moz", "ms", "o", ""], p = 0; p < e.length && !a[d];) {
                    if (d = b, "" == e[p] && (d = d.substr(0, 1).toLowerCase() +
                            d.substr(1)), d = e[p] + d, f = typeof a[d], "undefined" != f) return "function" == f ? a[d]() : a[d];
                    p++
                }
            }

            function e(a) {
                c(a, "RequestFullScreen")
            }
            var g = this.get(0);
            "undefined" == typeof a && (a = eval(g.opt.realfullscreen));
            var k = b("#controlBar_" + g.id),
                h = k.find(".mb_OnlyYT"),
                l = g.isPlayer ? g.opt.containment : g.wrapper;
            if (a) {
                var n = b.mbBrowser.mozilla ? "mozfullscreenchange" : b.mbBrowser.webkit ? "webkitfullscreenchange" : "fullscreenchange";
                b(document).off(n).on(n, function() {
                    c(document, "IsFullScreen") || c(document, "FullScreen") ? (b(g).YTPSetVideoQuality("default"),
                        b(g).trigger("YTPFullScreenStart")) : (g.isAlone = !1, h.html(b.mbYTPlayer.controls.onlyYT), b(g).YTPSetVideoQuality(g.opt.quality), l.removeClass("YTPFullscreen"), l.CSSAnimate({
                        opacity: g.opt.opacity
                    }, g.opt.fadeOnStartTime), l.css({
                        zIndex: 0
                    }), g.isBackground ? b("body").after(k) : g.wrapper.before(k), b(window).resize(), b(g).trigger("YTPFullScreenEnd"))
                })
            }
            g.isAlone ? (b(document).off("mousemove.YTPlayer"), clearTimeout(g.hideCursor), g.overlay.css({
                    cursor: "auto"
                }), a ? (c(document, "FullScreen") || c(document, "IsFullScreen")) &&
                c(document, "CancelFullScreen") : (l.CSSAnimate({
                    opacity: g.opt.opacity
                }, g.opt.fadeOnStartTime), l.css({
                    zIndex: 0
                })), h.html(b.mbYTPlayer.controls.onlyYT), g.isAlone = !1) : (b(document).on("mousemove.YTPlayer", function(a) {
                g.overlay.css({
                    cursor: "auto"
                });
                clearTimeout(g.hideCursor);
                b(a.target).parents().is(".mb_YTPBar") || (g.hideCursor = setTimeout(d, 3E3))
            }), d(), a ? (l.css({
                opacity: 0
            }), l.addClass("YTPFullscreen"), e(l.get(0)), setTimeout(function() {
                l.CSSAnimate({
                    opacity: 1
                }, 2 * g.opt.fadeOnStartTime);
                l.append(k);
                b(g).optimizeDisplay();
                g.player.seekTo(g.player.getCurrentTime() + .1, !0)
            }, g.opt.fadeOnStartTime)) : l.css({
                zIndex: 1E4
            }).CSSAnimate({
                opacity: 1
            }, 2 * g.opt.fadeOnStartTime), h.html(b.mbYTPlayer.controls.showSite), g.isAlone = !0);
            return this
        },
        toggleLoops: function() {
            var a = this.get(0),
                b = a.opt;
            return 1 == b.loop ? b.loop = 0 : (b.startAt ? a.player.seekTo(b.startAt) : a.player.playVideo(), b.loop = 1), this
        },
        play: function() {
            var a = this.get(0);
            if (!a.isReady) return this;
            a.player.playVideo();
            b(a.playerEl).css({
                opacity: 1
            });
            a.wrapper.css({
                backgroundImage: "none"
            });
            a.wrapper.CSSAnimate({
                opacity: a.isAlone ? 1 : a.opt.opacity
            }, a.opt.fadeOnStartTime);
            return b("#controlBar_" + a.id).find(".mb_YTPPlayPause").html(b.mbYTPlayer.controls.pause), a.state = 1, this
        },
        togglePlay: function(a) {
            var b = this.get(0);
            return b.isReady ? (1 == b.state ? this.YTPPause() : this.YTPPlay(), "function" == typeof a && a(b.state), this) : this
        },
        stop: function() {
            var a = this.get(0);
            return a.isReady ? (b("#controlBar_" + a.id).find(".mb_YTPPlayPause").html(b.mbYTPlayer.controls.play), a.player.stopVideo(), this) : this
        },
        pause: function() {
            var a =
                this.get(0);
            return a.isReady ? (a.player.pauseVideo(), a.state = 2, this) : this
        },
        seekTo: function(a) {
            var b = this.get(0);
            return b.isReady ? (b.player.seekTo(a, !0), this) : this
        },
        setVolume: function(a) {
            var b = this.get(0);
            return b.isReady ? (b.opt.vol = a, b.player.setVolume(b.opt.vol), b.volumeBar && b.volumeBar.length && b.volumeBar.updateSliderVal(a), this) : this
        },
        getVolume: function() {
            var a = this.get(0);
            return a.isReady ? a.player.getVolume() : this
        },
        toggleVolume: function() {
            var a = this.get(0);
            return a.isReady ? (a.isMute ? (b.mbBrowser.mobile ||
                this.YTPSetVolume(a.opt.vol), this.YTPUnmute()) : this.YTPMute(), this) : this
        },
        mute: function() {
            var a = this.get(0);
            if (!a.isReady || a.isMute) return this;
            a.player.mute();
            a.isMute = !0;
            a.player.setVolume(0);
            a.volumeBar && a.volumeBar.length && 10 < a.volumeBar.width() && a.volumeBar.updateSliderVal(0);
            b("#controlBar_" + a.id).find(".mb_YTPMuteUnmute").html(b.mbYTPlayer.controls.unmute);
            b(a).addClass("isMuted");
            a.volumeBar && a.volumeBar.length && a.volumeBar.addClass("muted");
            var d = b.Event("YTPMuted");
            return d.time = a.currentTime,
                a.preventTrigger || b(a).trigger(d), this
        },
        unmute: function() {
            var a = this.get(0);
            if (!a.isReady || !a.isMute) return this;
            a.player.unMute();
            a.isMute = !1;
            b(a).YTPSetVolume(a.opt.vol);
            a.volumeBar && a.volumeBar.length && a.volumeBar.updateSliderVal(10 < a.opt.vol ? a.opt.vol : 10);
            b("#controlBar_" + a.id).find(".mb_YTPMuteUnmute").html(b.mbYTPlayer.controls.mute);
            b(a).removeClass("isMuted");
            a.volumeBar && a.volumeBar.length && a.volumeBar.removeClass("muted");
            var d = b.Event("YTPUnmuted");
            return d.time = a.currentTime, a.preventTrigger ||
                b(a).trigger(d), this
        },
        applyFilter: function(a, b) {
            var c = this.get(0);
            return c.isReady ? (c.filters[a].value = b, void(c.filtersEnabled && this.YTPEnableFilters())) : this
        },
        applyFilters: function(a) {
            var d = this,
                c = d.get(0);
            if (!c.isReady) return this;
            if (!c.isReady) return b(c).on("YTPReady", function() {
                d.YTPApplyFilters(a)
            }), this;
            for (var e in a) d.YTPApplyFilter(e, a[e]);
            d.trigger("YTPFiltersApplied")
        },
        toggleFilter: function(a, d) {
            var c = this.get(0);
            return c.isReady ? (c.filters[a].value ? c.filters[a].value = 0 : c.filters[a].value =
                d, c.filtersEnabled && b(c).YTPEnableFilters(), this) : this
        },
        toggleFilters: function(a) {
            var d = this.get(0);
            return d.isReady ? (d.filtersEnabled ? (b(d).trigger("YTPDisableFilters"), b(d).YTPDisableFilters()) : (b(d).YTPEnableFilters(), b(d).trigger("YTPEnableFilters")), "function" == typeof a && a(d.filtersEnabled), this) : this
        },
        disableFilters: function() {
            var a = this.get(0);
            if (!a.isReady) return this;
            var d = b(a.playerEl);
            return d.css("-webkit-filter", ""), d.css("filter", ""), a.filtersEnabled = !1, this
        },
        enableFilters: function() {
            var a =
                this.get(0);
            if (!a.isReady) return this;
            var d = b(a.playerEl),
                c = "",
                e;
            for (e in a.filters) a.filters[e].value && (c += e.replace("_", "-") + "(" + a.filters[e].value + a.filters[e].unit + ") ");
            return d.css("-webkit-filter", c), d.css("filter", c), a.filtersEnabled = !0, this
        },
        removeFilter: function(a, d) {
            var c = this.get(0);
            if (!c.isReady) return this;
            if ("function" == typeof a && (d = a, a = null), a) this.YTPApplyFilter(a, 0), "function" == typeof d && d(a);
            else {
                for (var e in c.filters) this.YTPApplyFilter(e, 0);
                "function" == typeof d && d(e);
                c.filters =
                    b.extend(!0, {}, b.mbYTPlayer.defaultFilters)
            }
            c = b.Event("YTPFiltersApplied");
            return this.trigger(c), this
        },
        getFilters: function() {
            var a = this.get(0);
            return a.isReady ? a.filters : this
        },
        addMask: function(a) {
            var d = this.get(0);
            if (!d.isReady) return this;
            a || (a = d.actualMask);
            var c = b("<img/>").attr("src", a).on("load", function() {
                d.overlay.CSSAnimate({
                    opacity: 0
                }, d.opt.fadeOnStartTime, function() {
                    d.hasMask = !0;
                    c.remove();
                    d.overlay.css({
                        backgroundImage: "url(" + a + ")",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center center",
                        backgroundSize: "cover"
                    });
                    d.overlay.CSSAnimate({
                        opacity: 1
                    }, d.opt.fadeOnStartTime)
                })
            });
            return this
        },
        removeMask: function() {
            var a = this.get(0);
            return a.isReady ? (a.overlay.CSSAnimate({
                opacity: 0
            }, a.opt.fadeOnStartTime, function() {
                a.hasMask = !1;
                a.overlay.css({
                    backgroundImage: "",
                    backgroundRepeat: "",
                    backgroundPosition: "",
                    backgroundSize: ""
                });
                a.overlay.CSSAnimate({
                    opacity: 1
                }, a.opt.fadeOnStartTime)
            }), this) : this
        },
        applyMask: function(a) {
            var d = b(a);
            if (!a.isReady) return this;
            if (d.off("YTPTime.mask"), a.opt.mask)
                if ("string" ==
                    typeof a.opt.mask) d.YTPAddMask(a.opt.mask), a.actualMask = a.opt.mask;
                else if ("object" == typeof a.opt.mask) {
                for (var c in a.opt.mask) a.opt.mask[c] && b("<img/>").attr("src", a.opt.mask[c]);
                a.opt.mask[0] && d.YTPAddMask(a.opt.mask[0]);
                d.on("YTPTime.mask", function(b) {
                    for (var c in a.opt.mask) b.time == c && (a.opt.mask[c] ? (d.YTPAddMask(a.opt.mask[c]), a.actualMask = a.opt.mask[c]) : d.YTPRemoveMask())
                })
            }
        },
        toggleMask: function() {
            var a = this.get(0);
            if (!a.isReady) return this;
            var d = b(a);
            return a.hasMask ? d.YTPRemoveMask() : d.YTPAddMask(),
                this
        },
        manageProgress: function() {
            var a = this.get(0),
                d = b("#controlBar_" + a.id),
                c = d.find(".mb_YTPProgress"),
                e = d.find(".mb_YTPLoaded"),
                d = d.find(".mb_YTPseekbar"),
                g = c.outerWidth(),
                c = Math.floor(a.player.getCurrentTime()),
                k = Math.floor(a.player.getDuration()),
                g = c * g / k,
                a = 100 * a.player.getVideoLoadedFraction();
            return e.css({
                left: 0,
                width: a + "%"
            }), d.css({
                left: 0,
                width: g
            }), {
                totalTime: k,
                currentTime: c
            }
        },
        buildControls: function(a) {
            if (b("#controlBar_" + a.id).remove(), !a.opt.showControls) return void(a.controlBar = !1);
            if (a.opt.showYTLogo =
                a.opt.showYTLogo || a.opt.printUrl, !b("#controlBar_" + a.id).length) {
                a.controlBar = b("<span/>").attr("id", "controlBar_" + a.id).addClass("mb_YTPBar").css({
                    whiteSpace: "noWrap",
                    position: a.isBackground ? "fixed" : "absolute",
                    zIndex: a.isBackground ? 1E4 : 1E3
                }).hide().on("click", function(a) {
                    a.stopPropagation()
                });
                var d = b("<div/>").addClass("buttonBar"),
                    c = b("<span>" + b.mbYTPlayer.controls.play + "</span>").addClass("mb_YTPPlayPause ytpicon").on("click", function(d) {
                        d.stopPropagation();
                        b(a).YTPTogglePlay()
                    }),
                    e = b("<span>" +
                        b.mbYTPlayer.controls.mute + "</span>").addClass("mb_YTPMuteUnmute ytpicon").on("click", function(d) {
                        d.stopPropagation();
                        b(a).YTPToggleVolume()
                    }),
                    g = b("<div/>").addClass("mb_YTPVolumeBar").css({
                        display: "inline-block"
                    });
                a.volumeBar = g;
                var k = b("<span/>").addClass("mb_YTPTime"),
                    h = a.opt.videoURL ? a.opt.videoURL : "";
                0 > h.indexOf("http") && (h = b.mbYTPlayer.locationProtocol + "//www.youtube.com/watch?v=" + a.opt.videoURL);
                var l = b("<span/>").html(b.mbYTPlayer.controls.ytLogo).addClass("mb_YTPUrl ytpicon").attr("title",
                        "view on YouTube").on("click", function() {
                        window.open(h, "viewOnYT")
                    }),
                    n = b("<span/>").html(b.mbYTPlayer.controls.onlyYT).addClass("mb_OnlyYT ytpicon").on("click", function(d) {
                        d.stopPropagation();
                        b(a).YTPFullscreen(a.opt.realfullscreen)
                    }),
                    u = b("<div/>").addClass("mb_YTPProgress").css("position", "absolute").on("click", function(b) {
                        b.stopPropagation();
                        z.css({
                            width: b.clientX - z.offset().left
                        });
                        a.timeW = b.clientX - z.offset().left;
                        a.controlBar.find(".mb_YTPLoaded").css({
                            width: 0
                        });
                        b = Math.floor(a.player.getDuration());
                        a["goto"] = z.outerWidth() * b / u.outerWidth();
                        a.player.seekTo(parseFloat(a["goto"]), !0);
                        a.controlBar.find(".mb_YTPLoaded").css({
                            width: 0
                        })
                    }),
                    J = b("<div/>").addClass("mb_YTPLoaded").css("position", "absolute"),
                    z = b("<div/>").addClass("mb_YTPseekbar").css("position", "absolute");
                u.append(J).append(z);
                d.append(c).append(e).append(g).append(k);
                a.opt.showYTLogo && d.append(l);
                (a.isBackground || eval(a.opt.realfullscreen) && !a.isBackground) && d.append(n);
                a.controlBar.append(d).append(u);
                a.isBackground ? b("body").after(a.controlBar) :
                    (a.controlBar.addClass("inlinePlayer"), a.wrapper.before(a.controlBar));
                g.simpleSlider({
                    initialval: a.opt.vol,
                    scale: 100,
                    orientation: "h",
                    callback: function(d) {
                        0 == d.value ? b(a).YTPMute() : b(a).YTPUnmute();
                        a.player.setVolume(d.value);
                        a.isMute || (a.opt.vol = d.value)
                    }
                })
            }
        },
        checkForState: function() {
            var a = this.get(0),
                d = b(a);
            clearInterval(a.getState);
            return b.contains(document, a) ? (b.mbYTPlayer.checkForStart(a), void(a.getState = setInterval(function() {
                    var d = b(a);
                    if (a.isReady) {
                        var c = b(a).YTPManageProgress(),
                            g = a.opt.stopAt >
                            a.opt.startAt ? a.opt.stopAt : 0;
                        if (g = g < a.player.getDuration() ? g : 0, a.currentTime != c.currentTime) {
                            var k = b.Event("YTPTime");
                            k.time = a.currentTime;
                            b(a).trigger(k)
                        }
                        if (a.currentTime = c.currentTime, a.totalTime = a.player.getDuration(), 0 == a.player.getVolume() ? d.addClass("isMuted") : d.removeClass("isMuted"), a.opt.showControls && (c.totalTime ? a.controlBar.find(".mb_YTPTime").html(b.mbYTPlayer.formatTime(c.currentTime) + " / " + b.mbYTPlayer.formatTime(c.totalTime)) : a.controlBar.find(".mb_YTPTime").html("-- : -- / -- : --")),
                            eval(a.opt.stopMovieOnBlur) && (document.hasFocus() ? document.hasFocus() && !a.hasFocus && -1 != a.state && 0 != a.state && (a.hasFocus = !0, a.preventTrigger = !0, a.preventTrigger = !0, d.YTPPlay()) : 1 == a.state && (a.hasFocus = !1, a.preventTrigger = !0, d.YTPPause())), a.opt.playOnlyIfVisible)(c = b.mbYTPlayer.isOnScreen(a, a.opt.onScreenPercentage)) || 1 != a.state ? c && !a.isOnScreen && (a.isOnScreen = !0, a.player.playVideo()) : (a.isOnScreen = !1, d.YTPPause());
                        if ((a.controlBar.length && 400 >= a.controlBar.outerWidth() && !a.isCompact ? (a.controlBar.addClass("compact"),
                                a.isCompact = !0, !a.isMute && a.volumeBar && a.volumeBar.updateSliderVal(a.opt.vol)) : a.controlBar.length && 400 < a.controlBar.outerWidth() && a.isCompact && (a.controlBar.removeClass("compact"), a.isCompact = !1, !a.isMute && a.volumeBar && a.volumeBar.updateSliderVal(a.opt.vol)), 0 < a.player.getPlayerState() && (parseFloat(a.player.getDuration() - .5) < a.player.getCurrentTime() || 0 < g && parseFloat(a.player.getCurrentTime()) > g)) && !a.isEnded) {
                            if (a.isEnded = !0, setTimeout(function() {
                                    a.isEnded = !1
                                }, 1E3), a.isList) {
                                if (!a.opt.loop || 0 < a.opt.loop &&
                                    a.player.loopTime === a.opt.loop - 1) return a.player.loopTime = void 0, clearInterval(a.getState), d = b.Event("YTPEnd"), d.time = a.currentTime, void b(a).trigger(d)
                            } else if (!a.opt.loop || 0 < a.opt.loop && a.player.loopTime === a.opt.loop - 1) return a.player.loopTime = void 0, a.state = 2, a.opt.containment.css({
                                background: a.opt.coverImage ? "url(" + a.opt.coverImage + ") center center" : a.orig_containment_background,
                                backgroundSize: "cover"
                            }), b(a).YTPPause(), void a.wrapper.CSSAnimate({
                                opacity: 0
                            }, a.opt.fadeOnStartTime, function() {
                                a.controlBar.length &&
                                    a.controlBar.find(".mb_YTPPlayPause").html(b.mbYTPlayer.controls.play);
                                var d = b.Event("YTPEnd");
                                d.time = a.currentTime;
                                b(a).trigger(d);
                                a.player.seekTo(a.opt.startAt, !0);
                                a.opt.containment.css({
                                    background: a.opt.coverImage ? "url(" + a.opt.coverImage + ") center center" : a.orig_containment_background,
                                    backgroundSize: "cover"
                                })
                            });
                            a.player.loopTime = a.player.loopTime ? ++a.player.loopTime : 1;
                            a.opt.startAt = a.opt.startAt || 1;
                            a.preventTrigger = !0;
                            a.state = 2;
                            a.player.pauseVideo();
                            a.player.seekTo(a.opt.startAt, !0);
                            a.player.playVideo()
                        }
                    }
                },
                100))) : (d.YTPPlayerDestroy(), clearInterval(a.getState), void clearInterval(a.checkForStartAt))
        },
        checkForStart: function(a) {
            var d = b(a);
            if (!b.contains(document, a)) return void d.YTPPlayerDestroy();
            if (b.mbYTPlayer.buildControls(a), a.overlay)
                if (a.opt.addRaster) {
                    var c = "dot" == a.opt.addRaster ? "raster-dot" : "raster";
                    a.overlay.addClass(a.isRetina ? c + " retina" : c)
                } else a.overlay.removeClass(function(a, d) {
                    var c = d.split(" "),
                        f = [];
                    return b.each(c, function(a, b) {
                        /raster.*/.test(b) && f.push(b)
                    }), f.push("retina"), f.join(" ")
                });
            a.preventTrigger = !0;
            a.state = 2;
            a.preventTrigger = !0;
            a.player.mute();
            a.player.playVideo();
            a.isStarting = !0;
            var e = a.start_from_last ? a.start_from_last : a.opt.startAt ? a.opt.startAt : 1;
            return a.checkForStartAt = setInterval(function() {
                a.player.seekTo(e, !0);
                var c = a.player.getVideoLoadedFraction() >= e / a.player.getDuration();
                0 < a.player.getDuration() && a.player.getCurrentTime() >= e && c && (a.start_from_last = null, clearInterval(a.checkForStartAt), "function" == typeof a.opt.onReady && a.opt.onReady(a), a.isReady = !0, d.YTPRemoveFilter(),
                    a.opt.addFilters ? d.YTPApplyFilters(a.opt.addFilters) : d.YTPApplyFilters(), d.YTPEnableFilters(), c = b.Event("YTPReady"), (c.time = a.currentTime, d.trigger(c), a.state = 2, d.YTPPause(), a.opt.mute ? d.YTPMute() : (a.player.unMute(), a.opt.autoPlay && console.debug("To make the video 'auto-play' you must mute the audio according with the new vendor policy")), "undefined" != typeof _gaq && eval(a.opt.gaTrack) ? _gaq.push(["_trackEvent", "YTPlayer", "Play", a.hasData ? a.videoData.title : a.videoID.toString()]) : "undefined" != typeof ga &&
                        eval(a.opt.gaTrack) && ga("send", "event", "YTPlayer", "play", a.hasData ? a.videoData.title : a.videoID.toString()), a.opt.autoPlay) ? (c = b.Event("YTPStart"), c.time = a.currentTime, b(a).trigger(c), a.isStarting = !1, "mac" == b.mbBrowser.os.name && b.mbBrowser.safari && b("body").one("mousedown.YTPstart", function() {
                        d.YTPPlay()
                    }), d.YTPPlay()) : (a.player.pauseVideo(), setTimeout(function() {
                        a.start_from_last && a.player.seekTo(e, !0);
                        a.isPlayer || (a.opt.coverImage ? (a.wrapper.css({
                            opacity: 0
                        }), setTimeout(function() {
                            a.wrapper.css({
                                background: a.opt.coverImage ?
                                    "url(" + a.opt.coverImage + ") center center" : a.orig_containment_background,
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat"
                            })
                        }, a.opt.fadeOnStartTime)) : (b(a.playerEl).CSSAnimate({
                            opacity: 1
                        }, a.opt.fadeOnStartTime), a.wrapper.CSSAnimate({
                            opacity: a.isAlone ? 1 : a.opt.opacity
                        }, a.opt.fadeOnStartTime)));
                        a.isStarting = !1
                    }, 150), a.controlBar.length && a.controlBar.find(".mb_YTPPlayPause").html(b.mbYTPlayer.controls.play)), a.isPlayer && !a.opt.autoPlay && a.loading && a.loading.length && (a.loading.html("Ready"), setTimeout(function() {
                            a.loading.fadeOut()
                        },
                        100)), a.controlBar && a.controlBar.length && a.controlBar.slideDown(1E3));
                "mac" == b.mbBrowser.os.name && b.mbBrowser.safari && (a.player.playVideo(), 0 <= e && a.player.seekTo(e, !0))
            }, 100), d
        },
        getTime: function() {
            var a = this.get(0);
            return b.mbYTPlayer.formatTime(a.currentTime)
        },
        getTotalTime: function(a) {
            a = this.get(0);
            return b.mbYTPlayer.formatTime(a.totalTime)
        },
        formatTime: function(a) {
            var b = Math.floor(a / 60);
            a = Math.floor(a - 60 * b);
            return (9 >= b ? "0" + b : b) + " : " + (9 >= a ? "0" + a : a)
        },
        setAnchor: function(a) {
            this.optimizeDisplay(a)
        },
        getAnchor: function() {
            return this.get(0).opt.anchor
        }
    };
    b.fn.optimizeDisplay = function(a) {
        var d = this.get(0),
            c, e, g, k;
        d.opt.anchor = a || d.opt.anchor;
        d.opt.anchor = "undefined " != typeof d.opt.anchor ? d.opt.anchor : "center,center";
        a = d.opt.anchor.split(",");
        c = d.wrapper;
        var h = b(d.playerEl);
        if (d.opt.optimizeDisplay) {
            e = h.height() * d.opt.abundance;
            var l, n;
            l = c.outerWidth();
            n = c.outerHeight() + e;
            d.opt.ratio = "auto" === d.opt.ratio ? 16 / 9 : d.opt.ratio;
            d.opt.ratio = eval(d.opt.ratio);
            c = l;
            e = Math.ceil(c / d.opt.ratio);
            g = Math.ceil(-((e -
                n) / 2));
            k = 0;
            var u = e < n;
            u && (e = n, c = Math.ceil(e * d.opt.ratio), g = 0, k = Math.ceil(-((c - l) / 2)));
            for (var J in a)
                if (a.hasOwnProperty(J)) switch (a[J].replace(/ /g, "")) {
                    case "top":
                        g = u ? -((e - n) / 2) : 0;
                        break;
                    case "bottom":
                        g = u ? 0 : -(e - n);
                        break;
                    case "left":
                        k = 0;
                        break;
                    case "right":
                        k = u ? -(c - l) : 0;
                        break;
                    default:
                        c > l && (k = -((c - l) / 2))
                }
        } else e = c = "100%", k = g = 0;
        h.css({
            width: c,
            height: e,
            marginTop: g,
            marginLeft: k,
            maxWidth: "initial"
        })
    };
    b.shuffle = function(a) {
        a = a.slice();
        for (var b = a.length, c = b; c--;) {
            var e = parseInt(Math.random() * b),
                g = a[c];
            a[c] =
                a[e];
            a[e] = g
        }
        return a
    };
    b.fn.unselectable = function() {
        return this.each(function() {
            b(this).css({
                "-moz-user-select": "none",
                "-webkit-user-select": "none",
                "user-select": "none"
            }).attr("unselectable", "on")
        })
    };
    b.fn.YTPlayer = b.mbYTPlayer.buildPlayer;
    b.fn.mb_YTPlayer = b.mbYTPlayer.buildPlayer;
    b.fn.YTPCheckForState = b.mbYTPlayer.checkForState;
    b.fn.YTPGetPlayer = b.mbYTPlayer.getPlayer;
    b.fn.YTPGetVideoID = b.mbYTPlayer.getVideoID;
    b.fn.YTPGetPlaylistID = b.mbYTPlayer.getPlaylistID;
    b.fn.YTPChangeVideo = b.fn.YTPChangeMovie =
        b.mbYTPlayer.changeVideo;
    b.fn.YTPPlayerDestroy = b.mbYTPlayer.playerDestroy;
    b.fn.YTPPlay = b.mbYTPlayer.play;
    b.fn.YTPTogglePlay = b.mbYTPlayer.togglePlay;
    b.fn.YTPStop = b.mbYTPlayer.stop;
    b.fn.YTPPause = b.mbYTPlayer.pause;
    b.fn.YTPSeekTo = b.mbYTPlayer.seekTo;
    b.fn.YTPlaylist = b.mbYTPlayer.playlist;
    b.fn.YTPPlayNext = b.mbYTPlayer.playNext;
    b.fn.YTPPlayPrev = b.mbYTPlayer.playPrev;
    b.fn.YTPPlayIndex = b.mbYTPlayer.playIndex;
    b.fn.YTPMute = b.mbYTPlayer.mute;
    b.fn.YTPUnmute = b.mbYTPlayer.unmute;
    b.fn.YTPToggleVolume = b.mbYTPlayer.toggleVolume;
    b.fn.YTPSetVolume = b.mbYTPlayer.setVolume;
    b.fn.YTPGetVolume = b.mbYTPlayer.getVolume;
    b.fn.YTPGetVideoData = b.mbYTPlayer.getVideoData;
    b.fn.YTPFullscreen = b.mbYTPlayer.fullscreen;
    b.fn.YTPToggleLoops = b.mbYTPlayer.toggleLoops;
    b.fn.YTPSetVideoQuality = b.mbYTPlayer.setVideoQuality;
    b.fn.YTPManageProgress = b.mbYTPlayer.manageProgress;
    b.fn.YTPApplyFilter = b.mbYTPlayer.applyFilter;
    b.fn.YTPApplyFilters = b.mbYTPlayer.applyFilters;
    b.fn.YTPToggleFilter = b.mbYTPlayer.toggleFilter;
    b.fn.YTPToggleFilters = b.mbYTPlayer.toggleFilters;
    b.fn.YTPRemoveFilter = b.mbYTPlayer.removeFilter;
    b.fn.YTPDisableFilters = b.mbYTPlayer.disableFilters;
    b.fn.YTPEnableFilters = b.mbYTPlayer.enableFilters;
    b.fn.YTPGetFilters = b.mbYTPlayer.getFilters;
    b.fn.YTPGetTime = b.mbYTPlayer.getTime;
    b.fn.YTPGetTotalTime = b.mbYTPlayer.getTotalTime;
    b.fn.YTPAddMask = b.mbYTPlayer.addMask;
    b.fn.YTPRemoveMask = b.mbYTPlayer.removeMask;
    b.fn.YTPToggleMask = b.mbYTPlayer.toggleMask;
    b.fn.YTPSetAnchor = b.mbYTPlayer.setAnchor;
    b.fn.YTPGetAnchor = b.mbYTPlayer.getAnchor
}(jQuery, ytp);
jQuery.support.CSStransition = function() {
    var b = (document.body || document.documentElement).style;
    return void 0 !== b.transition || void 0 !== b.WebkitTransition || void 0 !== b.MozTransition || void 0 !== b.MsTransition || void 0 !== b.OTransition
}();
jQuery.CSS = {
    name: "mb.CSSAnimate",
    author: "Matteo Bicocchi",
    version: "2.0.0",
    transitionEnd: "transitionEnd",
    sfx: "",
    filters: {
        blur: {
            min: 0,
            max: 100,
            unit: "px"
        },
        brightness: {
            min: 0,
            max: 400,
            unit: "%"
        },
        contrast: {
            min: 0,
            max: 400,
            unit: "%"
        },
        grayscale: {
            min: 0,
            max: 100,
            unit: "%"
        },
        hueRotate: {
            min: 0,
            max: 360,
            unit: "deg"
        },
        invert: {
            min: 0,
            max: 100,
            unit: "%"
        },
        saturate: {
            min: 0,
            max: 400,
            unit: "%"
        },
        sepia: {
            min: 0,
            max: 100,
            unit: "%"
        }
    },
    normalizeCss: function(b) {
        var c = jQuery.extend(!0, {}, b);
        jQuery.browser.webkit || jQuery.browser.opera ? jQuery.CSS.sfx =
            "-webkit-" : jQuery.browser.mozilla ? jQuery.CSS.sfx = "-moz-" : jQuery.browser.msie && (jQuery.CSS.sfx = "-ms-");
        jQuery.CSS.sfx = "";
        for (var a in c) {
            if ("transform" === a && (c[jQuery.CSS.sfx + "transform"] = c[a], delete c[a]), "transform-origin" === a && (c[jQuery.CSS.sfx + "transform-origin"] = b[a], delete c[a]), "filter" !== a || jQuery.browser.mozilla || (c[jQuery.CSS.sfx + "filter"] = b[a], delete c[a]), "blur" === a && setFilter(c, "blur", b[a]), "brightness" === a && setFilter(c, "brightness", b[a]), "contrast" === a && setFilter(c, "contrast", b[a]), "grayscale" ===
                a && setFilter(c, "grayscale", b[a]), "hueRotate" === a && setFilter(c, "hueRotate", b[a]), "invert" === a && setFilter(c, "invert", b[a]), "saturate" === a && setFilter(c, "saturate", b[a]), "sepia" === a && setFilter(c, "sepia", b[a]), "x" === a) {
                var d = jQuery.CSS.sfx + "transform";
                c[d] = c[d] || "";
                c[d] += " translateX(" + setUnit(b[a], "px") + ")";
                delete c[a]
            }
            "y" === a && (d = jQuery.CSS.sfx + "transform", c[d] = c[d] || "", c[d] += " translateY(" + setUnit(b[a], "px") + ")", delete c[a]);
            "z" === a && (d = jQuery.CSS.sfx + "transform", c[d] = c[d] || "", c[d] += " translateZ(" +
                setUnit(b[a], "px") + ")", delete c[a]);
            "rotate" === a && (d = jQuery.CSS.sfx + "transform", c[d] = c[d] || "", c[d] += " rotate(" + setUnit(b[a], "deg") + ")", delete c[a]);
            "rotateX" === a && (d = jQuery.CSS.sfx + "transform", c[d] = c[d] || "", c[d] += " rotateX(" + setUnit(b[a], "deg") + ")", delete c[a]);
            "rotateY" === a && (d = jQuery.CSS.sfx + "transform", c[d] = c[d] || "", c[d] += " rotateY(" + setUnit(b[a], "deg") + ")", delete c[a]);
            "rotateZ" === a && (d = jQuery.CSS.sfx + "transform", c[d] = c[d] || "", c[d] += " rotateZ(" + setUnit(b[a], "deg") + ")", delete c[a]);
            "scale" === a &&
                (d = jQuery.CSS.sfx + "transform", c[d] = c[d] || "", c[d] += " scale(" + setUnit(b[a], "") + ")", delete c[a]);
            "scaleX" === a && (d = jQuery.CSS.sfx + "transform", c[d] = c[d] || "", c[d] += " scaleX(" + setUnit(b[a], "") + ")", delete c[a]);
            "scaleY" === a && (d = jQuery.CSS.sfx + "transform", c[d] = c[d] || "", c[d] += " scaleY(" + setUnit(b[a], "") + ")", delete c[a]);
            "scaleZ" === a && (d = jQuery.CSS.sfx + "transform", c[d] = c[d] || "", c[d] += " scaleZ(" + setUnit(b[a], "") + ")", delete c[a]);
            "skew" === a && (d = jQuery.CSS.sfx + "transform", c[d] = c[d] || "", c[d] += " skew(" + setUnit(b[a],
                "deg") + ")", delete c[a]);
            "skewX" === a && (d = jQuery.CSS.sfx + "transform", c[d] = c[d] || "", c[d] += " skewX(" + setUnit(b[a], "deg") + ")", delete c[a]);
            "skewY" === a && (d = jQuery.CSS.sfx + "transform", c[d] = c[d] || "", c[d] += " skewY(" + setUnit(b[a], "deg") + ")", delete c[a]);
            "perspective" === a && (d = jQuery.CSS.sfx + "transform", c[d] = c[d] || "", c[d] += " perspective(" + setUnit(b[a], "px") + ")", delete c[a])
        }
        return c
    },
    getProp: function(b) {
        var c, a = [];
        for (c in b) 0 > a.indexOf(c) && a.push(uncamel(c));
        return a.join(",")
    },
    animate: function(b, c, a, d, f) {
        return this.each(function() {
            function e() {
                g.called = !0;
                g.CSSAIsRunning = !1;
                k.off(jQuery.CSS.transitionEnd + "." + g.id);
                clearTimeout(g.timeout);
                k.css(jQuery.CSS.sfx + "transition", "");
                "function" == typeof f && f.apply(g);
                "function" == typeof g.CSSqueue && (g.CSSqueue(), g.CSSqueue = null)
            }
            var g = this,
                k = jQuery(this);
            g.id = g.id || "CSSA_" + (new Date).getTime();
            var h = h || {
                type: "noEvent"
            };
            if (g.CSSAIsRunning && g.eventType == h.type && !jQuery.browser.msie && 9 >= jQuery.browser.version) g.CSSqueue = function() {
                k.CSSAnimate(b, c, a, d, f)
            };
            else if (g.CSSqueue = null, g.eventType = h.type, 0 !== k.length &&
                b) {
                if (b = jQuery.normalizeCss(b), g.CSSAIsRunning = !0, "function" == typeof c && (f = c, c = jQuery.fx.speeds._default), "function" == typeof a && (d = a, a = 0), "string" == typeof a && (f = a, a = 0), "function" == typeof d && (f = d, d = "cubic-bezier(0.65,0.03,0.36,0.72)"), "string" == typeof c)
                    for (var l in jQuery.fx.speeds) {
                        if (c == l) {
                            c = jQuery.fx.speeds[l];
                            break
                        }
                        c = jQuery.fx.speeds._default
                    }
                if (c || (c = jQuery.fx.speeds._default), "string" == typeof f && (d = f, f = null), jQuery.support.CSStransition) {
                    var n = {
                        "default": "ease",
                        "in": "ease-in",
                        out: "ease-out",
                        "in-out": "ease-in-out",
                        snap: "cubic-bezier(0,1,.5,1)",
                        easeOutCubic: "cubic-bezier(.215,.61,.355,1)",
                        easeInOutCubic: "cubic-bezier(.645,.045,.355,1)",
                        easeInCirc: "cubic-bezier(.6,.04,.98,.335)",
                        easeOutCirc: "cubic-bezier(.075,.82,.165,1)",
                        easeInOutCirc: "cubic-bezier(.785,.135,.15,.86)",
                        easeInExpo: "cubic-bezier(.95,.05,.795,.035)",
                        easeOutExpo: "cubic-bezier(.19,1,.22,1)",
                        easeInOutExpo: "cubic-bezier(1,0,0,1)",
                        easeInQuad: "cubic-bezier(.55,.085,.68,.53)",
                        easeOutQuad: "cubic-bezier(.25,.46,.45,.94)",
                        easeInOutQuad: "cubic-bezier(.455,.03,.515,.955)",
                        easeInQuart: "cubic-bezier(.895,.03,.685,.22)",
                        easeOutQuart: "cubic-bezier(.165,.84,.44,1)",
                        easeInOutQuart: "cubic-bezier(.77,0,.175,1)",
                        easeInQuint: "cubic-bezier(.755,.05,.855,.06)",
                        easeOutQuint: "cubic-bezier(.23,1,.32,1)",
                        easeInOutQuint: "cubic-bezier(.86,0,.07,1)",
                        easeInSine: "cubic-bezier(.47,0,.745,.715)",
                        easeOutSine: "cubic-bezier(.39,.575,.565,1)",
                        easeInOutSine: "cubic-bezier(.445,.05,.55,.95)",
                        easeInBack: "cubic-bezier(.6,-.28,.735,.045)",
                        easeOutBack: "cubic-bezier(.175, .885,.32,1.275)",
                        easeInOutBack: "cubic-bezier(.68,-.55,.265,1.55)"
                    };
                    n[d] && (d = n[d]);
                    k.off(jQuery.CSS.transitionEnd + "." + g.id);
                    var n = jQuery.CSS.getProp(b),
                        u = {};
                    jQuery.extend(u, b);
                    u[jQuery.CSS.sfx + "transition-property"] = n;
                    u[jQuery.CSS.sfx + "transition-duration"] = c + "ms";
                    u[jQuery.CSS.sfx + "transition-delay"] = a + "ms";
                    u[jQuery.CSS.sfx + "transition-timing-function"] = d;
                    setTimeout(function() {
                        k.one(jQuery.CSS.transitionEnd + "." + g.id, e);
                        k.css(u)
                    }, 1);
                    g.timeout = setTimeout(function() {
                        g.called || !f ? (g.called = !1, g.CSSAIsRunning = !1) : (k.css(jQuery.CSS.sfx + "transition", ""), f.apply(g), g.CSSAIsRunning = !1, "function" == typeof g.CSSqueue && (g.CSSqueue(), g.CSSqueue = null))
                    }, c + a + 10)
                } else {
                    for (n in b) "transform" === n && delete b[n], "filter" === n && delete b[n], "transform-origin" === n && delete b[n], "auto" === b[n] && delete b[n], "x" === n && (h = b[n], l = "left", b[l] = h, delete b[n]), "y" === n && (h = b[n], l = "top", b[l] = h, delete b[n]), "-ms-transform" !== n && "-ms-filter" !== n || delete b[n];
                    k.delay(a).animate(b, c, f)
                }
            }
        })
    }
};
jQuery.fn.CSSAnimate = jQuery.CSS.animate;
jQuery.normalizeCss = jQuery.CSS.normalizeCss;
jQuery.fn.css3 = function(b) {
    return this.each(function() {
        var c = jQuery(this),
            a = jQuery.normalizeCss(b);
        c.css(a)
    })
};
var nAgt = navigator.userAgent;
jQuery.browser = jQuery.browser || {};
jQuery.browser.mozilla = !1;
jQuery.browser.webkit = !1;
jQuery.browser.opera = !1;
jQuery.browser.safari = !1;
jQuery.browser.chrome = !1;
jQuery.browser.androidStock = !1;
jQuery.browser.msie = !1;
jQuery.browser.edge = !1;
jQuery.browser.ua = nAgt;
var getOS = function() {
    var b = {
        version: "Unknown version",
        name: "Unknown OS"
    };
    return -1 != navigator.appVersion.indexOf("Win") && (b.name = "Windows"), -1 != navigator.appVersion.indexOf("Mac") && 0 > navigator.appVersion.indexOf("Mobile") && (b.name = "Mac"), -1 != navigator.appVersion.indexOf("Linux") && (b.name = "Linux"), /Mac OS X/.test(nAgt) && !/Mobile/.test(nAgt) && (b.version = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1], b.version = b.version.replace(/_/g, ".").substring(0, 5)), /Windows/.test(nAgt) && (b.version = "Unknown.Unknown"), /Windows NT 5.1/.test(nAgt) &&
        (b.version = "5.1"), /Windows NT 6.0/.test(nAgt) && (b.version = "6.0"), /Windows NT 6.1/.test(nAgt) && (b.version = "6.1"), /Windows NT 6.2/.test(nAgt) && (b.version = "6.2"), /Windows NT 10.0/.test(nAgt) && (b.version = "10.0"), /Linux/.test(nAgt) && /Linux/.test(nAgt) && (b.version = "Unknown.Unknown"), b.name = b.name.toLowerCase(), b.major_version = "Unknown", b.minor_version = "Unknown", "Unknown.Unknown" != b.version && (b.major_version = parseFloat(b.version.split(".")[0]), b.minor_version = parseFloat(b.version.split(".")[1])), b
};
jQuery.browser.os = getOS();
jQuery.browser.hasTouch = isTouchSupported();
jQuery.browser.name = navigator.appName;
jQuery.browser.fullVersion = "" + parseFloat(navigator.appVersion);
jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10);
var nameOffset, verOffset, ix;
if (-1 != (verOffset = nAgt.indexOf("Opera"))) jQuery.browser.opera = !0, jQuery.browser.name = "Opera", jQuery.browser.fullVersion = nAgt.substring(verOffset + 6), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8));
else if (-1 != (verOffset = nAgt.indexOf("OPR"))) jQuery.browser.opera = !0, jQuery.browser.name = "Opera", jQuery.browser.fullVersion = nAgt.substring(verOffset + 4);
else if (-1 != (verOffset = nAgt.indexOf("MSIE"))) jQuery.browser.msie = !0, jQuery.browser.name = "Microsoft Internet Explorer",
    jQuery.browser.fullVersion = nAgt.substring(verOffset + 5);
else if (-1 != nAgt.indexOf("Trident")) {
    jQuery.browser.msie = !0;
    jQuery.browser.name = "Microsoft Internet Explorer";
    var start = nAgt.indexOf("rv:") + 3,
        end = start + 4;
    jQuery.browser.fullVersion = nAgt.substring(start, end)
} else -1 != (verOffset = nAgt.indexOf("Edge")) ? (jQuery.browser.edge = !0, jQuery.browser.name = "Microsoft Edge", jQuery.browser.fullVersion = nAgt.substring(verOffset + 5)) : -1 != (verOffset = nAgt.indexOf("Chrome")) ? (jQuery.browser.webkit = !0, jQuery.browser.chrome = !0, jQuery.browser.name = "Chrome", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7)) : -1 < nAgt.indexOf("mozilla/5.0") && -1 < nAgt.indexOf("android ") && -1 < nAgt.indexOf("applewebkit") && !(-1 < nAgt.indexOf("chrome")) ? (verOffset = nAgt.indexOf("Chrome"), jQuery.browser.webkit = !0, jQuery.browser.androidStock = !0, jQuery.browser.name = "androidStock", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7)) : -1 != (verOffset = nAgt.indexOf("Safari")) ? (jQuery.browser.webkit = !0, jQuery.browser.safari = !0, jQuery.browser.name =
    "Safari", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8))) : -1 != (verOffset = nAgt.indexOf("AppleWebkit")) ? (jQuery.browser.webkit = !0, jQuery.browser.safari = !0, jQuery.browser.name = "Safari", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8))) : -1 != (verOffset = nAgt.indexOf("Firefox")) ? (jQuery.browser.mozilla = !0, jQuery.browser.name = "Firefox", jQuery.browser.fullVersion = nAgt.substring(verOffset + 8)) : (nameOffset = nAgt.lastIndexOf(" ") + 1) < (verOffset = nAgt.lastIndexOf("/")) && (jQuery.browser.name = nAgt.substring(nameOffset, verOffset), jQuery.browser.fullVersion = nAgt.substring(verOffset + 1), jQuery.browser.name.toLowerCase() == jQuery.browser.name.toUpperCase() && (jQuery.browser.name = navigator.appName)); - 1 != (ix = jQuery.browser.fullVersion.indexOf(";")) && (jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix)); - 1 != (ix = jQuery.browser.fullVersion.indexOf(" ")) && (jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix));
jQuery.browser.majorVersion = parseInt("" + jQuery.browser.fullVersion, 10);
isNaN(jQuery.browser.majorVersion) && (jQuery.browser.fullVersion = "" + parseFloat(navigator.appVersion), jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10));
jQuery.browser.version = jQuery.browser.majorVersion;
jQuery.browser.android = /Android/i.test(nAgt);
jQuery.browser.blackberry = /BlackBerry|BB|PlayBook/i.test(nAgt);
jQuery.browser.ios = /iPhone|iPad|iPod|webOS/i.test(nAgt);
jQuery.browser.operaMobile = /Opera Mini/i.test(nAgt);
jQuery.browser.windowsMobile = /IEMobile|Windows Phone/i.test(nAgt);
jQuery.browser.kindle = /Kindle|Silk/i.test(nAgt);
jQuery.browser.mobile = jQuery.browser.android || jQuery.browser.blackberry || jQuery.browser.ios || jQuery.browser.windowsMobile || jQuery.browser.operaMobile || jQuery.browser.kindle;
jQuery.isMobile = jQuery.browser.mobile;
jQuery.isTablet = jQuery.browser.mobile && 765 < jQuery(window).width();
jQuery.isAndroidDefault = jQuery.browser.android && !/chrome/i.test(nAgt);
jQuery.mbBrowser = jQuery.browser;
jQuery.browser.versionCompare = function(b, c) {
    if ("stringstring" != typeof b + typeof c) return !1;
    for (var a = b.split("."), d = c.split("."), f = 0, e = Math.max(a.length, d.length); e > f; f++) {
        if (a[f] && !d[f] && 0 < parseInt(a[f]) || parseInt(a[f]) > parseInt(d[f])) return 1;
        if (d[f] && !a[f] && 0 < parseInt(d[f]) || parseInt(a[f]) < parseInt(d[f])) return -1
    }
    return 0
};
nAgt = navigator.userAgent;
jQuery.browser = jQuery.browser || {};
jQuery.browser.mozilla = !1;
jQuery.browser.webkit = !1;
jQuery.browser.opera = !1;
jQuery.browser.safari = !1;
jQuery.browser.chrome = !1;
jQuery.browser.androidStock = !1;
jQuery.browser.msie = !1;
jQuery.browser.edge = !1;
jQuery.browser.ua = nAgt;
getOS = function() {
    var b = {
        version: "Unknown version",
        name: "Unknown OS"
    };
    return -1 != navigator.appVersion.indexOf("Win") && (b.name = "Windows"), -1 != navigator.appVersion.indexOf("Mac") && 0 > navigator.appVersion.indexOf("Mobile") && (b.name = "Mac"), -1 != navigator.appVersion.indexOf("Linux") && (b.name = "Linux"), /Mac OS X/.test(nAgt) && !/Mobile/.test(nAgt) && (b.version = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1], b.version = b.version.replace(/_/g, ".").substring(0, 5)), /Windows/.test(nAgt) && (b.version = "Unknown.Unknown"), /Windows NT 5.1/.test(nAgt) &&
        (b.version = "5.1"), /Windows NT 6.0/.test(nAgt) && (b.version = "6.0"), /Windows NT 6.1/.test(nAgt) && (b.version = "6.1"), /Windows NT 6.2/.test(nAgt) && (b.version = "6.2"), /Windows NT 10.0/.test(nAgt) && (b.version = "10.0"), /Linux/.test(nAgt) && /Linux/.test(nAgt) && (b.version = "Unknown.Unknown"), b.name = b.name.toLowerCase(), b.major_version = "Unknown", b.minor_version = "Unknown", "Unknown.Unknown" != b.version && (b.major_version = parseFloat(b.version.split(".")[0]), b.minor_version = parseFloat(b.version.split(".")[1])), b
};
jQuery.browser.os = getOS();
jQuery.browser.hasTouch = isTouchSupported();
jQuery.browser.name = navigator.appName;
jQuery.browser.fullVersion = "" + parseFloat(navigator.appVersion);
jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10); - 1 != (verOffset = nAgt.indexOf("Opera")) ? (jQuery.browser.opera = !0, jQuery.browser.name = "Opera", jQuery.browser.fullVersion = nAgt.substring(verOffset + 6), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8))) : -1 != (verOffset = nAgt.indexOf("OPR")) ? (jQuery.browser.opera = !0, jQuery.browser.name = "Opera", jQuery.browser.fullVersion = nAgt.substring(verOffset + 4)) : -1 != (verOffset = nAgt.indexOf("MSIE")) ? (jQuery.browser.msie = !0, jQuery.browser.name = "Microsoft Internet Explorer",
    jQuery.browser.fullVersion = nAgt.substring(verOffset + 5)) : -1 != nAgt.indexOf("Trident") ? (jQuery.browser.msie = !0, jQuery.browser.name = "Microsoft Internet Explorer", start = nAgt.indexOf("rv:") + 3, end = start + 4, jQuery.browser.fullVersion = nAgt.substring(start, end)) : -1 != (verOffset = nAgt.indexOf("Edge")) ? (jQuery.browser.edge = !0, jQuery.browser.name = "Microsoft Edge", jQuery.browser.fullVersion = nAgt.substring(verOffset + 5)) : -1 != (verOffset = nAgt.indexOf("Chrome")) ? (jQuery.browser.webkit = !0, jQuery.browser.chrome = !0, jQuery.browser.name =
    "Chrome", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7)) : -1 < nAgt.indexOf("mozilla/5.0") && -1 < nAgt.indexOf("android ") && -1 < nAgt.indexOf("applewebkit") && !(-1 < nAgt.indexOf("chrome")) ? (verOffset = nAgt.indexOf("Chrome"), jQuery.browser.webkit = !0, jQuery.browser.androidStock = !0, jQuery.browser.name = "androidStock", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7)) : -1 != (verOffset = nAgt.indexOf("Safari")) ? (jQuery.browser.webkit = !0, jQuery.browser.safari = !0, jQuery.browser.name = "Safari", jQuery.browser.fullVersion =
    nAgt.substring(verOffset + 7), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8))) : -1 != (verOffset = nAgt.indexOf("AppleWebkit")) ? (jQuery.browser.webkit = !0, jQuery.browser.safari = !0, jQuery.browser.name = "Safari", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8))) : -1 != (verOffset = nAgt.indexOf("Firefox")) ? (jQuery.browser.mozilla = !0, jQuery.browser.name = "Firefox",
    jQuery.browser.fullVersion = nAgt.substring(verOffset + 8)) : (nameOffset = nAgt.lastIndexOf(" ") + 1) < (verOffset = nAgt.lastIndexOf("/")) && (jQuery.browser.name = nAgt.substring(nameOffset, verOffset), jQuery.browser.fullVersion = nAgt.substring(verOffset + 1), jQuery.browser.name.toLowerCase() == jQuery.browser.name.toUpperCase() && (jQuery.browser.name = navigator.appName)); - 1 != (ix = jQuery.browser.fullVersion.indexOf(";")) && (jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix)); - 1 != (ix = jQuery.browser.fullVersion.indexOf(" ")) && (jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix));
jQuery.browser.majorVersion = parseInt("" + jQuery.browser.fullVersion, 10);
isNaN(jQuery.browser.majorVersion) && (jQuery.browser.fullVersion = "" + parseFloat(navigator.appVersion), jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10));
jQuery.browser.version = jQuery.browser.majorVersion;
jQuery.browser.android = /Android/i.test(nAgt);
jQuery.browser.blackberry = /BlackBerry|BB|PlayBook/i.test(nAgt);
jQuery.browser.ios = /iPhone|iPad|iPod|webOS/i.test(nAgt);
jQuery.browser.operaMobile = /Opera Mini/i.test(nAgt);
jQuery.browser.windowsMobile = /IEMobile|Windows Phone/i.test(nAgt);
jQuery.browser.kindle = /Kindle|Silk/i.test(nAgt);
jQuery.browser.mobile = jQuery.browser.android || jQuery.browser.blackberry || jQuery.browser.ios || jQuery.browser.windowsMobile || jQuery.browser.operaMobile || jQuery.browser.kindle;
jQuery.isMobile = jQuery.browser.mobile;
jQuery.isTablet = jQuery.browser.mobile && 765 < jQuery(window).width();
jQuery.isAndroidDefault = jQuery.browser.android && !/chrome/i.test(nAgt);
jQuery.mbBrowser = jQuery.browser;
jQuery.browser.versionCompare = function(b, c) {
    if ("stringstring" != typeof b + typeof c) return !1;
    for (var a = b.split("."), d = c.split("."), f = 0, e = Math.max(a.length, d.length); e > f; f++) {
        if (a[f] && !d[f] && 0 < parseInt(a[f]) || parseInt(a[f]) > parseInt(d[f])) return 1;
        if (d[f] && !a[f] && 0 < parseInt(d[f]) || parseInt(a[f]) < parseInt(d[f])) return -1
    }
    return 0
};
(function(b) {
    b.simpleSlider = {
        defaults: {
            initialval: 0,
            scale: 100,
            orientation: "h",
            readonly: !1,
            callback: !1
        },
        events: {
            start: b.browser.mobile ? "touchstart" : "mousedown",
            end: b.browser.mobile ? "touchend" : "mouseup",
            move: b.browser.mobile ? "touchmove" : "mousemove"
        },
        init: function(c) {
            return this.each(function() {
                var a = this,
                    d = b(a);
                d.addClass("simpleSlider");
                a.opt = {};
                b.extend(a.opt, b.simpleSlider.defaults, c);
                b.extend(a.opt, d.data());
                var f = "h" == a.opt.orientation ? "horizontal" : "vertical",
                    f = b("<div/>").addClass("level").addClass(f);
                d.prepend(f);
                a.level = f;
                d.css({
                    cursor: "default"
                });
                "auto" == a.opt.scale && (a.opt.scale = b(a).outerWidth());
                d.updateSliderVal();
                a.opt.readonly || (d.on(b.simpleSlider.events.start, function(c) {
                    b.browser.mobile && (c = c.changedTouches[0]);
                    a.canSlide = !0;
                    d.updateSliderVal(c);
                    "h" == a.opt.orientation ? d.css({
                        cursor: "col-resize"
                    }) : d.css({
                        cursor: "row-resize"
                    });
                    b.browser.mobile || (c.preventDefault(), c.stopPropagation())
                }), b(document).on(b.simpleSlider.events.move, function(c) {
                    b.browser.mobile && (c = c.changedTouches[0]);
                    a.canSlide &&
                        (b(document).css({
                            cursor: "default"
                        }), d.updateSliderVal(c), b.browser.mobile || (c.preventDefault(), c.stopPropagation()))
                }).on(b.simpleSlider.events.end, function() {
                    b(document).css({
                        cursor: "auto"
                    });
                    a.canSlide = !1;
                    d.css({
                        cursor: "auto"
                    })
                }))
            })
        },
        updateSliderVal: function(c) {
            var a = this.get(0);
            if (a.opt) {
                a.opt.initialval = "number" == typeof a.opt.initialval ? a.opt.initialval : a.opt.initialval(a);
                var d = b(a).outerWidth(),
                    f = b(a).outerHeight();
                a.x = "object" == typeof c ? c.clientX + document.body.scrollLeft - this.offset().left :
                    "number" == typeof c ? c * d / a.opt.scale : a.opt.initialval * d / a.opt.scale;
                a.y = "object" == typeof c ? c.clientY + document.body.scrollTop - this.offset().top : "number" == typeof c ? (a.opt.scale - a.opt.initialval - c) * f / a.opt.scale : a.opt.initialval * f / a.opt.scale;
                a.y = this.outerHeight() - a.y;
                a.scaleX = a.x * a.opt.scale / d;
                a.scaleY = a.y * a.opt.scale / f;
                a.outOfRangeX = a.scaleX > a.opt.scale ? a.scaleX - a.opt.scale : 0 > a.scaleX ? a.scaleX : 0;
                a.outOfRangeY = a.scaleY > a.opt.scale ? a.scaleY - a.opt.scale : 0 > a.scaleY ? a.scaleY : 0;
                a.outOfRange = "h" == a.opt.orientation ?
                    a.outOfRangeX : a.outOfRangeY;
                a.value = "undefined" != typeof c ? "h" == a.opt.orientation ? a.x >= this.outerWidth() ? a.opt.scale : 0 >= a.x ? 0 : a.scaleX : a.y >= this.outerHeight() ? a.opt.scale : 0 >= a.y ? 0 : a.scaleY : "h" == a.opt.orientation ? a.scaleX : a.scaleY;
                "h" == a.opt.orientation ? a.level.width(Math.floor(100 * a.x / d) + "%") : a.level.height(Math.floor(100 * a.y / f));
                "function" == typeof a.opt.callback && a.opt.callback(a)
            }
        }
    };
    b.fn.simpleSlider = b.simpleSlider.init;
    b.fn.updateSliderVal = b.simpleSlider.updateSliderVal
})(jQuery);
(function(b) {
    b.mbCookie = {
        set: function(b, a, d, f) {
            "object" == typeof a && (a = JSON.stringify(a));
            f = f ? "; domain=" + f : "";
            var e = new Date,
                g = "";
            0 < d && (e.setTime(e.getTime() + 864E5 * d), g = "; expires=" + e.toGMTString());
            document.cookie = b + "=" + a + g + "; path=/" + f
        },
        get: function(b) {
            b += "=";
            for (var a = document.cookie.split(";"), d = 0; d < a.length; d++) {
                for (var f = a[d];
                    " " == f.charAt(0);) f = f.substring(1, f.length);
                if (0 == f.indexOf(b)) try {
                    return JSON.parse(f.substring(b.length, f.length))
                } catch (e) {
                    return f.substring(b.length, f.length)
                }
            }
            return null
        },
        remove: function(c) {
            b.mbCookie.set(c, "", -1)
        }
    };
    b.mbStorage = {
        set: function(b, a) {
            "object" == typeof a && (a = JSON.stringify(a));
            localStorage.setItem(b, a)
        },
        get: function(b) {
            if (!localStorage[b]) return null;
            try {
                return JSON.parse(localStorage[b])
            } catch (a) {
                return localStorage[b]
            }
        },
        remove: function(b) {
            b ? localStorage.removeItem(b) : localStorage.clear()
        }
    }
})(jQuery);
! function() {
    if ("undefined" != typeof window) {
        var b = window.navigator.userAgent.match(/Edge\/(\d{2})\./),
            c = !!b && 16 <= parseInt(b[1], 10);
        if (0 != "objectFit" in document.documentElement.style && !c) return void(window.objectFitPolyfill = function() {
            return !1
        });
        var a = function(a, b, d) {
                var c, f, n;
                if (d = d.split(" "), 2 > d.length && (d[1] = d[0]), "x" === a) a = d[0], d = d[1], c = "left", f = "right", n = b.clientWidth;
                else {
                    if ("y" !== a) return;
                    a = d[1];
                    d = d[0];
                    c = "top";
                    f = "bottom";
                    n = b.clientHeight
                }
                return a === c || d === c ? void(b.style[c] = "0") : a === f || d === f ?
                    void(b.style[f] = "0") : "center" === a || "50%" === a ? (b.style[c] = "50%", void(b.style["margin-" + c] = n / -2 + "px")) : 0 <= a.indexOf("%") ? (a = parseInt(a), void(50 > a ? (b.style[c] = a + "%", b.style["margin-" + c] = a / -100 * n + "px") : (a = 100 - a, b.style[f] = a + "%", b.style["margin-" + f] = a / -100 * n + "px"))) : void(b.style[c] = a)
            },
            d = function(b) {
                var d = b.dataset ? b.dataset.objectFit : b.getAttribute("data-object-fit"),
                    c = b.dataset ? b.dataset.objectPosition : b.getAttribute("data-object-position"),
                    d = d || "cover",
                    c = c || "50% 50%",
                    f = b.parentNode,
                    l = window.getComputedStyle(f,
                        null),
                    n = l.getPropertyValue("position"),
                    u = l.getPropertyValue("overflow"),
                    l = l.getPropertyValue("display");
                n && "static" !== n || (f.style.position = "relative");
                "hidden" !== u && (f.style.overflow = "hidden");
                l && "inline" !== l || (f.style.display = "block");
                0 === f.clientHeight && (f.style.height = "100%"); - 1 === f.className.indexOf("object-fit-polyfill") && (f.className += " object-fit-polyfill");
                var n = window.getComputedStyle(b, null),
                    u = {
                        "max-width": "none",
                        "max-height": "none",
                        "min-width": "0px",
                        "min-height": "0px",
                        top: "auto",
                        right: "auto",
                        bottom: "auto",
                        left: "auto",
                        "margin-top": "0px",
                        "margin-right": "0px",
                        "margin-bottom": "0px",
                        "margin-left": "0px"
                    },
                    J;
                for (J in u) n.getPropertyValue(J) !== u[J] && (b.style[J] = u[J]);
                b.style.position = "absolute";
                b.style.height = "100%";
                b.style.width = "auto";
                "scale-down" === d && (b.style.height = "auto", b.clientWidth < f.clientWidth && b.clientHeight < f.clientHeight ? (a("x", b, c), a("y", b, c)) : (d = "contain", b.style.height = "100%"));
                "none" === d ? (b.style.width = "auto", b.style.height = "auto", a("x", b, c), a("y", b, c)) : "cover" === d && b.clientWidth >
                    f.clientWidth || "contain" === d && b.clientWidth < f.clientWidth ? (b.style.top = "0", b.style.marginTop = "0", a("x", b, c)) : "scale-down" !== d && (b.style.width = "100%", b.style.height = "auto", b.style.left = "0", b.style.marginLeft = "0", a("y", b, c))
            },
            f = function(a) {
                if (void 0 === a) a = document.querySelectorAll("[data-object-fit]");
                else if (a && a.nodeName) a = [a];
                else if ("object" != typeof a || !a.length || !a[0].nodeName) return !1;
                for (var b = 0; b < a.length; b++)
                    if (a[b].nodeName) {
                        var f = a[b].nodeName.toLowerCase();
                        "img" !== f || c ? "video" === f && (0 < a[b].readyState ?
                            d(a[b]) : a[b].addEventListener("loadedmetadata", function() {
                                d(this)
                            })) : a[b].complete ? d(a[b]) : a[b].addEventListener("load", function() {
                            d(this)
                        })
                    }
                return !0
            };
        document.addEventListener("DOMContentLoaded", function() {
            f()
        });
        window.addEventListener("resize", function() {
            f()
        });
        window.objectFitPolyfill = f
    }
}();
this.createjs = this.createjs || {};
(function() {
    var b = createjs.PreloadJS = createjs.PreloadJS || {};
    b.version = "NEXT";
    b.buildDate = "Thu, 14 Sep 2017 22:19:45 GMT"
})();
this.createjs = this.createjs || {};
createjs.extend = function(b, c) {
    function a() {
        this.constructor = b
    }
    return a.prototype = c.prototype, b.prototype = new a
};
this.createjs = this.createjs || {};
createjs.promote = function(b, c) {
    var a = b.prototype,
        d = Object.getPrototypeOf && Object.getPrototypeOf(a) || a.__proto__;
    if (d) {
        a[(c += "_") + "constructor"] = d.constructor;
        for (var f in d) a.hasOwnProperty(f) && "function" == typeof d[f] && (a[c + f] = d[f])
    }
    return b
};
this.createjs = this.createjs || {};
createjs.deprecate = function(b, c) {
    return function() {
        var a = "Deprecated property or method '" + c + "'. See docs for info.";
        return console && (console.warn ? console.warn(a) : console.log(a)), b && b.apply(this, arguments)
    }
};
this.createjs = this.createjs || {};
(function() {
    createjs.proxy = function(b, c) {
        var a = Array.prototype.slice.call(arguments, 2);
        return function() {
            return b.apply(c, Array.prototype.slice.call(arguments, 0).concat(a))
        }
    }
})();
this.createjs = this.createjs || {};
createjs.indexOf = function(b, c) {
    for (var a = 0, d = b.length; d > a; a++)
        if (c === b[a]) return a;
    return -1
};
this.createjs = this.createjs || {};
(function() {
    function b(a, b, c) {
        this.type = a;
        this.currentTarget = this.target = null;
        this.eventPhase = 0;
        this.bubbles = !!b;
        this.cancelable = !!c;
        this.timeStamp = (new Date).getTime();
        this.removed = this.immediatePropagationStopped = this.propagationStopped = this.defaultPrevented = !1
    }
    var c = b.prototype;
    c.preventDefault = function() {
        this.defaultPrevented = this.cancelable && !0
    };
    c.stopPropagation = function() {
        this.propagationStopped = !0
    };
    c.stopImmediatePropagation = function() {
        this.immediatePropagationStopped = this.propagationStopped = !0
    };
    c.remove = function() {
        this.removed = !0
    };
    c.clone = function() {
        return new b(this.type, this.bubbles, this.cancelable)
    };
    c.set = function(a) {
        for (var b in a) this[b] = a[b];
        return this
    };
    c.toString = function() {
        return "[Event (type=" + this.type + ")]"
    };
    createjs.Event = b
})();
this.createjs = this.createjs || {};
(function() {
    function b(b, a, d) {
        this.Event_constructor("error");
        this.title = b;
        this.message = a;
        this.data = d
    }
    createjs.extend(b, createjs.Event).clone = function() {
        return new createjs.ErrorEvent(this.title, this.message, this.data)
    };
    createjs.ErrorEvent = createjs.promote(b, "Event")
})();
this.createjs = this.createjs || {};
(function() {
    function b() {
        this._captureListeners = this._listeners = null
    }
    var c = b.prototype;
    b.initialize = function(a) {
        a.addEventListener = c.addEventListener;
        a.on = c.on;
        a.removeEventListener = a.off = c.removeEventListener;
        a.removeAllEventListeners = c.removeAllEventListeners;
        a.hasEventListener = c.hasEventListener;
        a.dispatchEvent = c.dispatchEvent;
        a._dispatchEvent = c._dispatchEvent;
        a.willTrigger = c.willTrigger
    };
    c.addEventListener = function(a, b, c) {
        var e;
        e = c ? this._captureListeners = this._captureListeners || {} : this._listeners =
            this._listeners || {};
        var g = e[a];
        return g && this.removeEventListener(a, b, c), g = e[a], g ? g.push(b) : e[a] = [b], b
    };
    c.on = function(a, b, c, e, g, k) {
        return b.handleEvent && (c = c || b, b = b.handleEvent), c = c || this, this.addEventListener(a, function(a) {
            b.call(c, a, g);
            e && a.remove()
        }, k)
    };
    c.removeEventListener = function(a, b, c) {
        if (c = c ? this._captureListeners : this._listeners) {
            var e = c[a];
            if (e)
                for (var g = 0, k = e.length; k > g; g++)
                    if (e[g] == b) {
                        1 == k ? delete c[a] : e.splice(g, 1);
                        break
                    }
        }
    };
    c.off = c.removeEventListener;
    c.removeAllEventListeners = function(a) {
        a ?
            (this._listeners && delete this._listeners[a], this._captureListeners && delete this._captureListeners[a]) : this._listeners = this._captureListeners = null
    };
    c.dispatchEvent = function(a, b, c) {
        if ("string" == typeof a) {
            var e = this._listeners;
            if (!(b || e && e[a])) return !0;
            a = new createjs.Event(a, b, c)
        } else a.target && a.clone && (a = a.clone());
        try {
            a.target = this
        } catch (g) {}
        if (a.bubbles && this.parent) {
            c = this;
            for (b = [c]; c.parent;) b.push(c = c.parent);
            e = b.length;
            for (c = e - 1; 0 <= c && !a.propagationStopped; c--) b[c]._dispatchEvent(a, 1 + (0 == c));
            for (c = 1; e > c && !a.propagationStopped; c++) b[c]._dispatchEvent(a, 3)
        } else this._dispatchEvent(a, 2);
        return !a.defaultPrevented
    };
    c.hasEventListener = function(a) {
        var b = this._listeners,
            c = this._captureListeners;
        return !!(b && b[a] || c && c[a])
    };
    c.willTrigger = function(a) {
        for (var b = this; b;) {
            if (b.hasEventListener(a)) return !0;
            b = b.parent
        }
        return !1
    };
    c.toString = function() {
        return "[EventDispatcher]"
    };
    c._dispatchEvent = function(a, b) {
        var c, e, g = 2 >= b ? this._captureListeners : this._listeners;
        if (a && g && (e = g[a.type]) && (c = e.length)) {
            try {
                a.currentTarget =
                    this
            } catch (k) {}
            try {
                a.eventPhase = 0 | b
            } catch (k) {}
            a.removed = !1;
            e = e.slice();
            for (g = 0; c > g && !a.immediatePropagationStopped; g++) {
                var h = e[g];
                h.handleEvent ? h.handleEvent(a) : h(a);
                a.removed && (this.off(a.type, h, 1 == b), a.removed = !1)
            }
        }
        2 === b && this._dispatchEvent(a, 2.1)
    };
    createjs.EventDispatcher = b
})();
this.createjs = this.createjs || {};
(function() {
    function b(b, a) {
        this.Event_constructor("progress");
        this.loaded = b;
        this.total = null == a ? 1 : a;
        this.progress = 0 == a ? 0 : this.loaded / this.total
    }
    createjs.extend(b, createjs.Event).clone = function() {
        return new createjs.ProgressEvent(this.loaded, this.total)
    };
    createjs.ProgressEvent = createjs.promote(b, "Event")
})(window);
(function() {
    function b(d, c) {
        function e(a) {
            if (e[a] !== E) return e[a];
            var b;
            if ("bug-string-char-index" == a) b = "a" != "a" [0];
            else if ("json" == a) b = e("json-stringify") && e("json-parse");
            else {
                var d;
                if ("json-stringify" == a) {
                    b = c.stringify;
                    var f = "function" == typeof b && I;
                    if (f) {
                        (d = function() {
                            return 1
                        }).toJSON = d;
                        try {
                            f = "0" === b(0) && "0" === b(new g) && '""' == b(new l) && b(B) === E && b(E) === E && b() === E && "1" === b(d) && "[1]" == b([d]) && "[null]" == b([E]) && "null" == b(null) && "[null,null,null]" == b([E, B, null]) && '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}' ==
                                b({
                                    a: [d, !0, !1, null, "\x00\b\n\f\r\t"]
                                }) && "1" === b(null, d) && "[\n 1,\n 2\n]" == b([1, 2], null, 1) && '"-271821-04-20T00:00:00.000Z"' == b(new p(-864E13)) && '"+275760-09-13T00:00:00.000Z"' == b(new p(864E13)) && '"-000001-01-01T00:00:00.000Z"' == b(new p(-621987552E5)) && '"1969-12-31T23:59:59.999Z"' == b(new p(-1))
                        } catch (m) {
                            f = !1
                        }
                    }
                    b = f
                }
                if ("json-parse" == a) {
                    b = c.parse;
                    if ("function" == typeof b) try {
                        if (0 === b("0") && !b(!1)) {
                            d = b('{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}');
                            var q = 5 == d.a.length && 1 === d.a[0];
                            if (q) {
                                try {
                                    q = !b('"\t"')
                                } catch (m) {}
                                if (q) try {
                                    q =
                                        1 !== b("01")
                                } catch (m) {}
                                if (q) try {
                                    q = 1 !== b("1.")
                                } catch (m) {}
                            }
                        }
                    } catch (m) {
                        q = !1
                    }
                    b = q
                }
            }
            return e[a] = !!b
        }
        d || (d = f.Object());
        c || (c = f.Object());
        var g = d.Number || f.Number,
            l = d.String || f.String,
            m = d.Object || f.Object,
            p = d.Date || f.Date,
            q = d.SyntaxError || f.SyntaxError,
            t = d.TypeError || f.TypeError,
            k = d.Math || f.Math,
            h = d.JSON || f.JSON;
        "object" == typeof h && h && (c.stringify = h.stringify, c.parse = h.parse);
        var K, O, E, m = m.prototype,
            B = m.toString,
            I = new p(-0xc782b5b800cec);
        try {
            I = -109252 == I.getUTCFullYear() && 0 === I.getUTCMonth() && 1 === I.getUTCDate() &&
                10 == I.getUTCHours() && 37 == I.getUTCMinutes() && 6 == I.getUTCSeconds() && 708 == I.getUTCMilliseconds()
        } catch (F) {}
        if (!e("json")) {
            var R = e("bug-string-char-index");
            if (!I) var H = k.floor,
                W = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
                C = function(a, b) {
                    return W[b] + 365 * (a - 1970) + H((a - 1969 + (b = +(1 < b))) / 4) - H((a - 1901 + b) / 100) + H((a - 1601 + b) / 400)
                };
            if ((K = m.hasOwnProperty) || (K = function(a) {
                    var b, d = {};
                    return (d.__proto__ = null, d.__proto__ = {
                        toString: 1
                    }, d).toString != B ? K = function(a) {
                        var b = this.__proto__;
                        a = a in (this.__proto__ = null, this);
                        return this.__proto__ = b, a
                    } : (b = d.constructor, K = function(a) {
                        var d = (this.constructor || b).prototype;
                        return a in this && !(a in d && this[a] === d[a])
                    }), d = null, K.call(this, a)
                }), O = function(b, d) {
                    var c, f, e, p = 0;
                    (c = function() {
                        this.valueOf = 0
                    }).prototype.valueOf = 0;
                    f = new c;
                    for (e in f) K.call(f, e) && p++;
                    return c = f = null, p ? O = 2 == p ? function(a, b) {
                        var d, c = {},
                            f = "[object Function]" == B.call(a);
                        for (d in a) f && "prototype" == d || K.call(c, d) || !(c[d] = 1) || !K.call(a, d) || b(d)
                    } : function(a, b) {
                        var d, c, f = "[object Function]" == B.call(a);
                        for (d in a) f &&
                            "prototype" == d || !K.call(a, d) || (c = "constructor" === d) || b(d);
                        (c || K.call(a, d = "constructor")) && b(d)
                    } : (f = "valueOf toString toLocaleString propertyIsEnumerable isPrototypeOf hasOwnProperty constructor".split(" "), O = function(b, d) {
                        var c, e;
                        e = "[object Function]" == B.call(b);
                        var p = !e && "function" != typeof b.constructor && a[typeof b.hasOwnProperty] && b.hasOwnProperty || K;
                        for (c in b) e && "prototype" == c || !p.call(b, c) || d(c);
                        for (e = f.length; c = f[--e]; p.call(b, c) && d(c));
                    }), O(b, d)
                }, !e("json-stringify")) {
                var fa = {
                        92: "\\\\",
                        34: '\\"',
                        8: "\\b",
                        12: "\\f",
                        10: "\\n",
                        13: "\\r",
                        9: "\\t"
                    },
                    Z = function(a, b) {
                        return ("000000" + (b || 0)).slice(-a)
                    },
                    na = function(a) {
                        for (var b = '"', d = 0, c = a.length, f = !R || 10 < c, e = f && (R ? a.split("") : a); c > d; d++) {
                            var p = a.charCodeAt(d);
                            switch (p) {
                                case 8:
                                case 9:
                                case 10:
                                case 12:
                                case 13:
                                case 34:
                                case 92:
                                    b += fa[p];
                                    break;
                                default:
                                    if (32 > p) {
                                        b += "\\u00" + Z(2, p.toString(16));
                                        break
                                    }
                                    b += f ? e[d] : a.charAt(d)
                            }
                        }
                        return b + '"'
                    },
                    ia = function(a, b, d, c, f, e, p) {
                        var m, g, r, q, l, k, V, h, X, J;
                        try {
                            m = b[a]
                        } catch (u) {}
                        if ("object" == typeof m && m)
                            if (g = B.call(m), "[object Date]" !=
                                g || K.call(m, "toJSON")) "function" == typeof m.toJSON && ("[object Number]" != g && "[object String]" != g && "[object Array]" != g || K.call(m, "toJSON")) && (m = m.toJSON(a));
                            else if (m > -1 / 0 && 1 / 0 > m) {
                            if (C) {
                                l = H(m / 864E5);
                                for (r = H(l / 365.2425) + 1970 - 1; C(r + 1, 0) <= l; r++);
                                for (q = H((l - C(r, 0)) / 30.42); C(r, q + 1) <= l; q++);
                                l = 1 + l - C(r, q);
                                k = (m % 864E5 + 864E5) % 864E5;
                                V = H(k / 36E5) % 24;
                                h = H(k / 6E4) % 60;
                                X = H(k / 1E3) % 60;
                                k %= 1E3
                            } else r = m.getUTCFullYear(), q = m.getUTCMonth(), l = m.getUTCDate(), V = m.getUTCHours(), h = m.getUTCMinutes(), X = m.getUTCSeconds(), k = m.getUTCMilliseconds();
                            m = (0 >= r || 1E4 <= r ? (0 > r ? "-" : "+") + Z(6, 0 > r ? -r : r) : Z(4, r)) + "-" + Z(2, q + 1) + "-" + Z(2, l) + "T" + Z(2, V) + ":" + Z(2, h) + ":" + Z(2, X) + "." + Z(3, k) + "Z"
                        } else m = null;
                        if (d && (m = d.call(b, a, m)), null === m) return "null";
                        if (g = B.call(m), "[object Boolean]" == g) return "" + m;
                        if ("[object Number]" == g) return m > -1 / 0 && 1 / 0 > m ? "" + m : "null";
                        if ("[object String]" == g) return na("" + m);
                        if ("object" == typeof m) {
                            for (a = p.length; a--;)
                                if (p[a] === m) throw t();
                            if (p.push(m), J = [], b = e, e += f, "[object Array]" == g) {
                                r = 0;
                                for (a = m.length; a > r; r++) g = ia(r, m, d, c, f, e, p), J.push(g === E ? "null" :
                                    g);
                                g = J.length ? f ? "[\n" + e + J.join(",\n" + e) + "\n" + b + "]" : "[" + J.join(",") + "]" : "[]"
                            } else O(c || m, function(a) {
                                var b = ia(a, m, d, c, f, e, p);
                                b !== E && J.push(na(a) + ":" + (f ? " " : "") + b)
                            }), g = J.length ? f ? "{\n" + e + J.join(",\n" + e) + "\n" + b + "}" : "{" + J.join(",") + "}" : "{}";
                            return p.pop(), g
                        }
                    };
                c.stringify = function(b, d, c) {
                    var f, e, p, m;
                    if (a[typeof d] && d)
                        if ("[object Function]" == (m = B.call(d))) e = d;
                        else if ("[object Array]" == m) {
                        p = {};
                        for (var g, q = 0, r = d.length; r > q; g = d[q++], m = B.call(g), ("[object String]" == m || "[object Number]" == m) && (p[g] = 1));
                    }
                    if (c)
                        if ("[object Number]" ==
                            (m = B.call(c))) {
                            if (0 < (c -= c % 1))
                                for (f = "", 10 < c && (c = 10); f.length < c; f += " ");
                        } else "[object String]" == m && (f = 10 >= c.length ? c : c.slice(0, 10));
                    return ia("", (g = {}, g[""] = b, g), e, p, f, "", [])
                }
            }
            if (!e("json-parse")) {
                var G, y, la = l.fromCharCode,
                    ma = {
                        92: "\\",
                        34: '"',
                        47: "/",
                        98: "\b",
                        116: "\t",
                        110: "\n",
                        102: "\f",
                        114: "\r"
                    },
                    Y = function() {
                        throw G = y = null, q();
                    },
                    ca = function() {
                        for (var a, b, d, c, f, e = y, p = e.length; p > G;) switch (f = e.charCodeAt(G)) {
                            case 9:
                            case 10:
                            case 13:
                            case 32:
                                G++;
                                break;
                            case 123:
                            case 125:
                            case 91:
                            case 93:
                            case 58:
                            case 44:
                                return a =
                                    R ? e.charAt(G) : e[G], G++, a;
                            case 34:
                                a = "@";
                                for (G++; p > G;)
                                    if (f = e.charCodeAt(G), 32 > f) Y();
                                    else if (92 == f) switch (f = e.charCodeAt(++G)) {
                                    case 92:
                                    case 34:
                                    case 47:
                                    case 98:
                                    case 116:
                                    case 110:
                                    case 102:
                                    case 114:
                                        a += ma[f];
                                        G++;
                                        break;
                                    case 117:
                                        b = ++G;
                                        for (d = G + 4; d > G; G++) f = e.charCodeAt(G), 48 <= f && 57 >= f || 97 <= f && 102 >= f || 65 <= f && 70 >= f || Y();
                                        a += la("0x" + e.slice(b, G));
                                        break;
                                    default:
                                        Y()
                                } else {
                                    if (34 == f) break;
                                    f = e.charCodeAt(G);
                                    for (b = G; 32 <= f && 92 != f && 34 != f;) f = e.charCodeAt(++G);
                                    a += e.slice(b, G)
                                }
                                if (34 == e.charCodeAt(G)) return G++, a;
                                Y();
                            default:
                                if (b =
                                    G, 45 == f && (c = !0, f = e.charCodeAt(++G)), 48 <= f && 57 >= f) {
                                    for (48 == f && (f = e.charCodeAt(G + 1), 48 <= f && 57 >= f) && Y(); p > G && (f = e.charCodeAt(G), 48 <= f && 57 >= f); G++);
                                    if (46 == e.charCodeAt(G)) {
                                        for (d = ++G; p > d && (f = e.charCodeAt(d), 48 <= f && 57 >= f); d++);
                                        d == G && Y();
                                        G = d
                                    }
                                    if (f = e.charCodeAt(G), 101 == f || 69 == f) {
                                        f = e.charCodeAt(++G);
                                        43 != f && 45 != f || G++;
                                        for (d = G; p > d && (f = e.charCodeAt(d), 48 <= f && 57 >= f); d++);
                                        d == G && Y();
                                        G = d
                                    }
                                    return +e.slice(b, G)
                                }
                                if (c && Y(), "true" == e.slice(G, G + 4)) return G += 4, !0;
                                if ("false" == e.slice(G, G + 5)) return G += 5, !1;
                                if ("null" == e.slice(G,
                                        G + 4)) return G += 4, null;
                                Y()
                        }
                        return "$"
                    },
                    ja = function(a) {
                        var b, d;
                        if ("$" == a && Y(), "string" == typeof a) {
                            if ("@" == (R ? a.charAt(0) : a[0])) return a.slice(1);
                            if ("[" == a) {
                                for (b = []; a = ca(), "]" != a; d || (d = !0)) d && ("," == a ? (a = ca(), "]" == a && Y()) : Y()), "," == a && Y(), b.push(ja(a));
                                return b
                            }
                            if ("{" == a) {
                                for (b = {}; a = ca(), "}" != a; d || (d = !0)) d && ("," == a ? (a = ca(), "}" == a && Y()) : Y()), "," != a && "string" == typeof a && "@" == (R ? a.charAt(0) : a[0]) && ":" == ca() || Y(), b[a.slice(1)] = ja(ca());
                                return b
                            }
                            Y()
                        }
                        return a
                    },
                    qa = function(a, b, d) {
                        d = pa(a, b, d);
                        d === E ? delete a[b] :
                            a[b] = d
                    },
                    pa = function(a, b, d) {
                        var c, f = a[b];
                        if ("object" == typeof f && f)
                            if ("[object Array]" == B.call(f))
                                for (c = f.length; c--;) qa(f, c, d);
                            else O(f, function(a) {
                                qa(f, a, d)
                            });
                        return d.call(a, b, f)
                    };
                c.parse = function(a, b) {
                    var d, c;
                    return G = 0, y = "" + a, d = ja(ca()), "$" != ca() && Y(), G = y = null, b && "[object Function]" == B.call(b) ? pa((c = {}, c[""] = d, c), "", b) : d
                }
            }
        }
        return c.runInContext = b, c
    }
    var c = "function" == typeof define && define.amd,
        a = {
            "function": !0,
            object: !0
        },
        d = a[typeof exports] && exports && !exports.nodeType && exports,
        f = a[typeof window] &&
        window || this,
        e = d && a[typeof module] && module && !module.nodeType && "object" == typeof global && global;
    if (!e || e.global !== e && e.window !== e && e.self !== e || (f = e), d && !c) b(f, d);
    else {
        var g = f.JSON,
            k = f.JSON3,
            h = !1,
            l = b(f, f.JSON3 = {
                noConflict: function() {
                    return h || (h = !0, f.JSON = g, f.JSON3 = k, g = k = null), l
                }
            });
        f.JSON = {
            parse: l.parse,
            stringify: l.stringify
        }
    }
    c && define(function() {
        return l
    })
}).call(this);
(function() {
    var b = {
        a: function() {
            return b.el("a")
        },
        svg: function() {
            return b.el("svg")
        },
        object: function() {
            return b.el("object")
        },
        image: function() {
            return b.el("image")
        },
        img: function() {
            return b.el("img")
        },
        style: function() {
            return b.el("style")
        },
        link: function() {
            return b.el("link")
        },
        script: function() {
            return b.el("script")
        },
        audio: function() {
            return b.el("audio")
        },
        video: function() {
            return b.el("video")
        },
        text: function(b) {
            return document.createTextNode(b)
        },
        el: function(b) {
            return document.createElement(b)
        }
    };
    createjs.Elements =
        b
})();
(function() {
    var b = {
        ABSOLUTE_PATT: /^(?:\w+:)?\/{2}/i,
        RELATIVE_PATT: /^[.\/]*?\//i,
        EXTENSION_PATT: /\/?[^\/]+\.(\w{1,5})$/i,
        parseURI: function(c) {
            var a = {
                absolute: !1,
                relative: !1,
                protocol: null,
                hostname: null,
                port: null,
                pathname: null,
                search: null,
                hash: null,
                host: null
            };
            if (null == c) return a;
            var d = createjs.Elements.a();
            d.href = c;
            for (var f in a) f in d && (a[f] = d[f]);
            d = c.indexOf("?"); - 1 < d && (c = c.substr(0, d));
            var e;
            return b.ABSOLUTE_PATT.test(c) ? a.absolute = !0 : b.RELATIVE_PATT.test(c) && (a.relative = !0), (e = c.match(b.EXTENSION_PATT)) && (a.extension =
                e[1].toLowerCase()), a
        },
        formatQueryString: function(b, a) {
            if (null == b) throw Error("You must specify data.");
            var d = [],
                f;
            for (f in b) d.push(f + "=" + escape(b[f]));
            return a && (d = d.concat(a)), d.join("&")
        },
        buildURI: function(b, a) {
            if (null == a) return b;
            var d = [],
                f = b.indexOf("?");
            if (-1 != f) var e = b.slice(f + 1),
                d = d.concat(e.split("&"));
            return -1 != f ? b.slice(0, f) + "?" + this.formatQueryString(a, d) : b + "?" + this.formatQueryString(a, d)
        },
        isCrossDomain: function(b) {
            var a = createjs.Elements.a();
            a.href = b.src;
            b = createjs.Elements.a();
            b.href =
                location.href;
            return "" != a.hostname && (a.port != b.port || a.protocol != b.protocol || a.hostname != b.hostname)
        },
        isLocal: function(b) {
            var a = createjs.Elements.a();
            return a.href = b.src, "" == a.hostname && "file:" == a.protocol
        }
    };
    createjs.URLUtils = b
})();
(function() {
    var b = {
        container: null,
        appendToHead: function(c) {
            b.getHead().appendChild(c)
        },
        appendToBody: function(c) {
            if (null == b.container) {
                b.container = document.createElement("div");
                b.container.id = "preloadjs-container";
                var a = b.container.style;
                a.visibility = "hidden";
                a.position = "absolute";
                a.width = b.container.style.height = "10px";
                a.overflow = "hidden";
                a.transform = a.msTransform = a.webkitTransform = a.oTransform = "translate(-10px, -10px)";
                b.getBody().appendChild(b.container)
            }
            b.container.appendChild(c)
        },
        getHead: function() {
            return document.head ||
                document.getElementsByTagName("head")[0]
        },
        getBody: function() {
            return document.body || document.getElementsByTagName("body")[0]
        },
        removeChild: function(b) {
            b.parent && b.parent.removeChild(b)
        },
        isImageTag: function(b) {
            return b instanceof HTMLImageElement
        },
        isAudioTag: function(b) {
            return window.HTMLAudioElement ? b instanceof HTMLAudioElement : !1
        },
        isVideoTag: function(b) {
            return window.HTMLVideoElement ? b instanceof HTMLVideoElement : !1
        }
    };
    createjs.DomUtils = b
})();
(function() {
    createjs.DataUtils = {
        parseXML: function(b) {
            var c = null;
            try {
                window.DOMParser && (c = (new DOMParser).parseFromString(b, "text/xml"))
            } catch (a) {}
            if (!c) try {
                c = new ActiveXObject("Microsoft.XMLDOM"), c.async = !1, c.loadXML(b)
            } catch (a) {
                c = null
            }
            return c
        },
        parseJSON: function(b) {
            if (null == b) return null;
            try {
                return JSON.parse(b)
            } catch (c) {
                throw c;
            }
        }
    }
})();
this.createjs = this.createjs || {};
(function() {
    createjs.Types = {
        BINARY: "binary",
        CSS: "css",
        FONT: "font",
        FONTCSS: "fontcss",
        IMAGE: "image",
        JAVASCRIPT: "javascript",
        JSON: "json",
        JSONP: "jsonp",
        MANIFEST: "manifest",
        SOUND: "sound",
        VIDEO: "video",
        SPRITESHEET: "spritesheet",
        SVG: "svg",
        TEXT: "text",
        XML: "xml"
    }
})();
this.createjs = this.createjs || {};
(function() {
    createjs.Methods = {
        POST: "POST",
        GET: "GET"
    }
})();
this.createjs = this.createjs || {};
(function() {
    function b() {
        this.id = this.type = this.src = null;
        this.maintainOrder = !1;
        this.data = this.callback = null;
        this.method = createjs.Methods.GET;
        this.headers = this.values = null;
        this.withCredentials = !1;
        this.crossOrigin = this.mimeType = null;
        this.loadTimeout = a.LOAD_TIMEOUT_DEFAULT
    }
    var c = b.prototype = {},
        a = b;
    a.LOAD_TIMEOUT_DEFAULT = 8E3;
    a.create = function(d) {
        if ("string" == typeof d) {
            var c = new b;
            return c.src = d, c
        }
        if (d instanceof a) return d;
        if (d instanceof Object && d.src) return null == d.loadTimeout && (d.loadTimeout = a.LOAD_TIMEOUT_DEFAULT),
            d;
        throw Error("Type not recognized.");
    };
    c.set = function(a) {
        for (var b in a) this[b] = a[b];
        return this
    };
    createjs.LoadItem = a
})();
(function() {
    createjs.RequestUtils = {
        isBinary: function(b) {
            switch (b) {
                case createjs.Types.IMAGE:
                case createjs.Types.BINARY:
                    return !0;
                default:
                    return !1
            }
        },
        isText: function(b) {
            switch (b) {
                case createjs.Types.TEXT:
                case createjs.Types.JSON:
                case createjs.Types.MANIFEST:
                case createjs.Types.XML:
                case createjs.Types.CSS:
                case createjs.Types.SVG:
                case createjs.Types.JAVASCRIPT:
                case createjs.Types.SPRITESHEET:
                    return !0;
                default:
                    return !1
            }
        },
        getTypeByExtension: function(b) {
            if (null == b) return createjs.Types.TEXT;
            switch (b.toLowerCase()) {
                case "jpeg":
                case "jpg":
                case "gif":
                case "png":
                case "webp":
                case "bmp":
                    return createjs.Types.IMAGE;
                case "ogg":
                case "mp3":
                case "webm":
                    return createjs.Types.SOUND;
                case "mp4":
                case "webm":
                case "ts":
                    return createjs.Types.VIDEO;
                case "json":
                    return createjs.Types.JSON;
                case "xml":
                    return createjs.Types.XML;
                case "css":
                    return createjs.Types.CSS;
                case "js":
                    return createjs.Types.JAVASCRIPT;
                case "svg":
                    return createjs.Types.SVG;
                default:
                    return createjs.Types.TEXT
            }
        }
    }
})();
this.createjs = this.createjs || {};
(function() {
    function b(a, b, c) {
        this.EventDispatcher_constructor();
        this.canceled = this.loaded = !1;
        this.progress = 0;
        this.type = c;
        this.resultFormatter = null;
        this._item = a ? createjs.LoadItem.create(a) : null;
        this._preferXHR = b;
        this._tag = this._tagSrcAttribute = this._loadedItems = this._rawResult = this._result = null
    }
    var c = createjs.extend(b, createjs.EventDispatcher);
    try {
        Object.defineProperties(b, {
            POST: {
                get: createjs.deprecate(function() {
                    return createjs.Methods.POST
                }, "AbstractLoader.POST")
            },
            GET: {
                get: createjs.deprecate(function() {
                        return createjs.Methods.GET
                    },
                    "AbstractLoader.GET")
            },
            BINARY: {
                get: createjs.deprecate(function() {
                    return createjs.Types.BINARY
                }, "AbstractLoader.BINARY")
            },
            CSS: {
                get: createjs.deprecate(function() {
                    return createjs.Types.CSS
                }, "AbstractLoader.CSS")
            },
            FONT: {
                get: createjs.deprecate(function() {
                    return createjs.Types.FONT
                }, "AbstractLoader.FONT")
            },
            FONTCSS: {
                get: createjs.deprecate(function() {
                    return createjs.Types.FONTCSS
                }, "AbstractLoader.FONTCSS")
            },
            IMAGE: {
                get: createjs.deprecate(function() {
                    return createjs.Types.IMAGE
                }, "AbstractLoader.IMAGE")
            },
            JAVASCRIPT: {
                get: createjs.deprecate(function() {
                        return createjs.Types.JAVASCRIPT
                    },
                    "AbstractLoader.JAVASCRIPT")
            },
            JSON: {
                get: createjs.deprecate(function() {
                    return createjs.Types.JSON
                }, "AbstractLoader.JSON")
            },
            JSONP: {
                get: createjs.deprecate(function() {
                    return createjs.Types.JSONP
                }, "AbstractLoader.JSONP")
            },
            MANIFEST: {
                get: createjs.deprecate(function() {
                    return createjs.Types.MANIFEST
                }, "AbstractLoader.MANIFEST")
            },
            SOUND: {
                get: createjs.deprecate(function() {
                    return createjs.Types.SOUND
                }, "AbstractLoader.SOUND")
            },
            VIDEO: {
                get: createjs.deprecate(function() {
                    return createjs.Types.VIDEO
                }, "AbstractLoader.VIDEO")
            },
            SPRITESHEET: {
                get: createjs.deprecate(function() {
                    return createjs.Types.SPRITESHEET
                }, "AbstractLoader.SPRITESHEET")
            },
            SVG: {
                get: createjs.deprecate(function() {
                    return createjs.Types.SVG
                }, "AbstractLoader.SVG")
            },
            TEXT: {
                get: createjs.deprecate(function() {
                    return createjs.Types.TEXT
                }, "AbstractLoader.TEXT")
            },
            XML: {
                get: createjs.deprecate(function() {
                    return createjs.Types.XML
                }, "AbstractLoader.XML")
            }
        })
    } catch (a) {}
    c.getItem = function() {
        return this._item
    };
    c.getResult = function(a) {
        return a ? this._rawResult : this._result
    };
    c.getTag =
        function() {
            return this._tag
        };
    c.setTag = function(a) {
        this._tag = a
    };
    c.load = function() {
        this._createRequest();
        this._request.on("complete", this, this);
        this._request.on("progress", this, this);
        this._request.on("loadStart", this, this);
        this._request.on("abort", this, this);
        this._request.on("timeout", this, this);
        this._request.on("error", this, this);
        var a = new createjs.Event("initialize");
        a.loader = this._request;
        this.dispatchEvent(a);
        this._request.load()
    };
    c.cancel = function() {
        this.canceled = !0;
        this.destroy()
    };
    c.destroy = function() {
        this._request &&
            (this._request.removeAllEventListeners(), this._request.destroy());
        this._loadItems = this._result = this._rawResult = this._item = this._request = null;
        this.removeAllEventListeners()
    };
    c.getLoadedItems = function() {
        return this._loadedItems
    };
    c._createRequest = function() {
        this._request = this._preferXHR ? new createjs.XHRRequest(this._item) : new createjs.TagRequest(this._item, this._tag || this._createTag(), this._tagSrcAttribute)
    };
    c._createTag = function() {
        return null
    };
    c._sendLoadStart = function() {
        this._isCanceled() || this.dispatchEvent("loadstart")
    };
    c._sendProgress = function(a) {
        if (!this._isCanceled()) {
            var b = null;
            "number" == typeof a ? (this.progress = a, b = new createjs.ProgressEvent(this.progress)) : (b = a, this.progress = a.loaded / a.total, b.progress = this.progress, (isNaN(this.progress) || 1 / 0 == this.progress) && (this.progress = 0));
            this.hasEventListener("progress") && this.dispatchEvent(b)
        }
    };
    c._sendComplete = function() {
        if (!this._isCanceled()) {
            this.loaded = !0;
            var a = new createjs.Event("complete");
            a.rawResult = this._rawResult;
            null != this._result && (a.result = this._result);
            this.dispatchEvent(a)
        }
    };
    c._sendError = function(a) {
        !this._isCanceled() && this.hasEventListener("error") && (null == a && (a = new createjs.ErrorEvent("PRELOAD_ERROR_EMPTY")), this.dispatchEvent(a))
    };
    c._isCanceled = function() {
        return null == window.createjs || this.canceled ? !0 : !1
    };
    c.resultFormatter = null;
    c.handleEvent = function(a) {
        switch (a.type) {
            case "complete":
                this._rawResult = a.target._response;
                a = this.resultFormatter && this.resultFormatter(this);
                a instanceof Function ? a.call(this, createjs.proxy(this._resultFormatSuccess,
                    this), createjs.proxy(this._resultFormatFailed, this)) : (this._result = a || this._rawResult, this._sendComplete());
                break;
            case "progress":
                this._sendProgress(a);
                break;
            case "error":
                this._sendError(a);
                break;
            case "loadstart":
                this._sendLoadStart();
                break;
            case "abort":
            case "timeout":
                this._isCanceled() || this.dispatchEvent(new createjs.ErrorEvent("PRELOAD_" + a.type.toUpperCase() + "_ERROR"))
        }
    };
    c._resultFormatSuccess = function(a) {
        this._result = a;
        this._sendComplete()
    };
    c._resultFormatFailed = function(a) {
        this._sendError(a)
    };
    c.toString = function() {
        return "[PreloadJS AbstractLoader]"
    };
    createjs.AbstractLoader = createjs.promote(b, "EventDispatcher")
})();
this.createjs = this.createjs || {};
(function() {
    function b(a, b, c) {
        this.AbstractLoader_constructor(a, b, c);
        this.resultFormatter = this._formatResult;
        this._tagSrcAttribute = "src";
        this.on("initialize", this._updateXHR, this)
    }
    var c = createjs.extend(b, createjs.AbstractLoader);
    c.load = function() {
        this._tag || (this._tag = this._createTag(this._item.src));
        this._tag.preload = "auto";
        this._tag.load();
        this.AbstractLoader_load()
    };
    c._createTag = function() {};
    c._createRequest = function() {
        this._request = this._preferXHR ? new createjs.XHRRequest(this._item) : new createjs.MediaTagRequest(this._item,
            this._tag || this._createTag(), this._tagSrcAttribute)
    };
    c._updateXHR = function(a) {
        a.loader.setResponseType && a.loader.setResponseType("blob")
    };
    c._formatResult = function(a) {
        if (this._tag.removeEventListener && this._tag.removeEventListener("canplaythrough", this._loadedHandler), this._tag.onstalled = null, this._preferXHR) {
            var b = window.URL || window.webkitURL,
                c = a.getResult(!0);
            a.getTag().src = b.createObjectURL(c)
        }
        return a.getTag()
    };
    createjs.AbstractMediaLoader = createjs.promote(b, "AbstractLoader")
})();
this.createjs = this.createjs || {};
(function() {
    var b = function(a) {
            this._item = a
        },
        c = createjs.extend(b, createjs.EventDispatcher);
    c.load = function() {};
    c.destroy = function() {};
    c.cancel = function() {};
    createjs.AbstractRequest = createjs.promote(b, "EventDispatcher")
})();
this.createjs = this.createjs || {};
(function() {
    function b(a, b, c) {
        this.AbstractRequest_constructor(a);
        this._tag = b;
        this._tagSrcAttribute = c;
        this._loadedHandler = createjs.proxy(this._handleTagComplete, this);
        this._addedToDOM = !1
    }
    var c = createjs.extend(b, createjs.AbstractRequest);
    c.load = function() {
        this._tag.onload = createjs.proxy(this._handleTagComplete, this);
        this._tag.onreadystatechange = createjs.proxy(this._handleReadyStateChange, this);
        this._tag.onerror = createjs.proxy(this._handleError, this);
        var a = new createjs.Event("initialize");
        a.loader =
            this._tag;
        this.dispatchEvent(a);
        this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), this._item.loadTimeout);
        this._tag[this._tagSrcAttribute] = this._item.src;
        null == this._tag.parentNode && (createjs.DomUtils.appendToBody(this._tag), this._addedToDOM = !0)
    };
    c.destroy = function() {
        this._clean();
        this._tag = null;
        this.AbstractRequest_destroy()
    };
    c._handleReadyStateChange = function() {
        clearTimeout(this._loadTimeout);
        var a = this._tag;
        "loaded" != a.readyState && "complete" != a.readyState || this._handleTagComplete()
    };
    c._handleError = function() {
        this._clean();
        this.dispatchEvent("error")
    };
    c._handleTagComplete = function() {
        this._rawResult = this._tag;
        this._result = this.resultFormatter && this.resultFormatter(this) || this._rawResult;
        this._clean();
        this.dispatchEvent("complete")
    };
    c._handleTimeout = function() {
        this._clean();
        this.dispatchEvent(new createjs.Event("timeout"))
    };
    c._clean = function() {
        this._tag.onload = null;
        this._tag.onreadystatechange = null;
        this._tag.onerror = null;
        this._addedToDOM && null != this._tag.parentNode && this._tag.parentNode.removeChild(this._tag);
        clearTimeout(this._loadTimeout)
    };
    c._handleStalled = function() {};
    createjs.TagRequest = createjs.promote(b, "AbstractRequest")
})();
this.createjs = this.createjs || {};
(function() {
    function b(a, b, c) {
        this.AbstractRequest_constructor(a);
        this._tag = b;
        this._tagSrcAttribute = c;
        this._loadedHandler = createjs.proxy(this._handleTagComplete, this)
    }
    var c = createjs.extend(b, createjs.TagRequest);
    c.load = function() {
        var a = createjs.proxy(this._handleStalled, this);
        this._stalledCallback = a;
        var b = createjs.proxy(this._handleProgress, this);
        this._handleProgress = b;
        this._tag.addEventListener("stalled", a);
        this._tag.addEventListener("progress", b);
        this._tag.addEventListener && this._tag.addEventListener("canplaythrough",
            this._loadedHandler, !1);
        this.TagRequest_load()
    };
    c._handleReadyStateChange = function() {
        clearTimeout(this._loadTimeout);
        var a = this._tag;
        "loaded" != a.readyState && "complete" != a.readyState || this._handleTagComplete()
    };
    c._handleStalled = function() {};
    c._handleProgress = function(a) {
        !a || 0 < a.loaded && 0 == a.total || (a = new createjs.ProgressEvent(a.loaded, a.total), this.dispatchEvent(a))
    };
    c._clean = function() {
        this._tag.removeEventListener && this._tag.removeEventListener("canplaythrough", this._loadedHandler);
        this._tag.removeEventListener("stalled",
            this._stalledCallback);
        this._tag.removeEventListener("progress", this._progressCallback);
        this.TagRequest__clean()
    };
    createjs.MediaTagRequest = createjs.promote(b, "TagRequest")
})();
this.createjs = this.createjs || {};
(function() {
    function b(a) {
        this.AbstractRequest_constructor(a);
        this._loadTimeout = this._request = null;
        this._xhrLevel = 1;
        this._rawResponse = this._response = null;
        this._canceled = !1;
        this._handleLoadStartProxy = createjs.proxy(this._handleLoadStart, this);
        this._handleProgressProxy = createjs.proxy(this._handleProgress, this);
        this._handleAbortProxy = createjs.proxy(this._handleAbort, this);
        this._handleErrorProxy = createjs.proxy(this._handleError, this);
        this._handleTimeoutProxy = createjs.proxy(this._handleTimeout, this);
        this._handleLoadProxy =
            createjs.proxy(this._handleLoad, this);
        this._handleReadyStateChangeProxy = createjs.proxy(this._handleReadyStateChange, this);
        !this._createXHR(a)
    }
    var c = createjs.extend(b, createjs.AbstractRequest);
    b.ACTIVEX_VERSIONS = "Msxml2.XMLHTTP.6.0 Msxml2.XMLHTTP.5.0 Msxml2.XMLHTTP.4.0 MSXML2.XMLHTTP.3.0 MSXML2.XMLHTTP Microsoft.XMLHTTP".split(" ");
    c.getResult = function(a) {
        return a && this._rawResponse ? this._rawResponse : this._response
    };
    c.cancel = function() {
        this.canceled = !0;
        this._clean();
        this._request.abort()
    };
    c.load = function() {
        if (null ==
            this._request) return void this._handleError();
        null != this._request.addEventListener ? (this._request.addEventListener("loadstart", this._handleLoadStartProxy, !1), this._request.addEventListener("progress", this._handleProgressProxy, !1), this._request.addEventListener("abort", this._handleAbortProxy, !1), this._request.addEventListener("error", this._handleErrorProxy, !1), this._request.addEventListener("timeout", this._handleTimeoutProxy, !1), this._request.addEventListener("load", this._handleLoadProxy, !1), this._request.addEventListener("readystatechange",
            this._handleReadyStateChangeProxy, !1)) : (this._request.onloadstart = this._handleLoadStartProxy, this._request.onprogress = this._handleProgressProxy, this._request.onabort = this._handleAbortProxy, this._request.onerror = this._handleErrorProxy, this._request.ontimeout = this._handleTimeoutProxy, this._request.onload = this._handleLoadProxy, this._request.onreadystatechange = this._handleReadyStateChangeProxy);
        1 == this._xhrLevel && (this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), this._item.loadTimeout));
        try {
            this._item.values ? this._request.send(createjs.URLUtils.formatQueryString(this._item.values)) : this._request.send()
        } catch (a) {
            this.dispatchEvent(new createjs.ErrorEvent("XHR_SEND", null, a))
        }
    };
    c.setResponseType = function(a) {
        "blob" === a && (a = window.URL ? "blob" : "arraybuffer", this._responseType = a);
        this._request.responseType = a
    };
    c.getAllResponseHeaders = function() {
        return this._request.getAllResponseHeaders instanceof Function ? this._request.getAllResponseHeaders() : null
    };
    c.getResponseHeader = function(a) {
        return this._request.getResponseHeader instanceof
        Function ? this._request.getResponseHeader(a) : null
    };
    c._handleProgress = function(a) {
        !a || 0 < a.loaded && 0 == a.total || (a = new createjs.ProgressEvent(a.loaded, a.total), this.dispatchEvent(a))
    };
    c._handleLoadStart = function() {
        clearTimeout(this._loadTimeout);
        this.dispatchEvent("loadstart")
    };
    c._handleAbort = function(a) {
        this._clean();
        this.dispatchEvent(new createjs.ErrorEvent("XHR_ABORTED", null, a))
    };
    c._handleError = function(a) {
        this._clean();
        this.dispatchEvent(new createjs.ErrorEvent(a.message))
    };
    c._handleReadyStateChange =
        function() {
            4 == this._request.readyState && this._handleLoad()
        };
    c._handleLoad = function() {
        if (!this.loaded) {
            this.loaded = !0;
            var a = this._checkError();
            if (a) return void this._handleError(a);
            if (this._response = this._getResponse(), "arraybuffer" === this._responseType) try {
                this._response = new Blob([this._response])
            } catch (b) {
                if (window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder, "TypeError" === b.name && window.BlobBuilder) a = new BlobBuilder, a.append(this._response),
                    this._response = a.getBlob()
            }
            this._clean();
            this.dispatchEvent(new createjs.Event("complete"))
        }
    };
    c._handleTimeout = function(a) {
        this._clean();
        this.dispatchEvent(new createjs.ErrorEvent("PRELOAD_TIMEOUT", null, a))
    };
    c._checkError = function() {
        var a = parseInt(this._request.status);
        return 400 <= a && 599 >= a ? Error(a) : 0 == a && /^https?:/.test(location.protocol) ? Error(0) : null
    };
    c._getResponse = function() {
        if (null != this._response) return this._response;
        if (null != this._request.response) return this._request.response;
        try {
            if (null !=
                this._request.responseText) return this._request.responseText
        } catch (a) {}
        try {
            if (null != this._request.responseXML) return this._request.responseXML
        } catch (a) {}
        return null
    };
    c._createXHR = function(a) {
        var b = createjs.URLUtils.isCrossDomain(a),
            c = {},
            e = null;
        if (window.XMLHttpRequest) e = new XMLHttpRequest, b && void 0 === e.withCredentials && window.XDomainRequest && (e = new XDomainRequest);
        else {
            for (var g = 0, k = s.ACTIVEX_VERSIONS.length; k > g; g++) {
                var h = s.ACTIVEX_VERSIONS[g];
                try {
                    e = new ActiveXObject(h);
                    break
                } catch (l) {}
            }
            if (null ==
                e) return !1
        }
        null == a.mimeType && createjs.RequestUtils.isText(a.type) && (a.mimeType = "text/plain; charset=utf-8");
        a.mimeType && e.overrideMimeType && e.overrideMimeType(a.mimeType);
        this._xhrLevel = "string" == typeof e.responseType ? 2 : 1;
        g = null;
        if (g = a.method == createjs.Methods.GET ? createjs.URLUtils.buildURI(a.src, a.values) : a.src, e.open(a.method || createjs.Methods.GET, g, !0), b && e instanceof XMLHttpRequest && 1 == this._xhrLevel && (c.Origin = location.origin), a.values && a.method == createjs.Methods.POST && (c["Content-Type"] = "application/x-www-form-urlencoded"),
            b || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest"), a.headers)
            for (var n in a.headers) c[n] = a.headers[n];
        for (n in c) e.setRequestHeader(n, c[n]);
        return e instanceof XMLHttpRequest && void 0 !== a.withCredentials && (e.withCredentials = a.withCredentials), this._request = e, !0
    };
    c._clean = function() {
        clearTimeout(this._loadTimeout);
        null != this._request.removeEventListener ? (this._request.removeEventListener("loadstart", this._handleLoadStartProxy), this._request.removeEventListener("progress", this._handleProgressProxy),
            this._request.removeEventListener("abort", this._handleAbortProxy), this._request.removeEventListener("error", this._handleErrorProxy), this._request.removeEventListener("timeout", this._handleTimeoutProxy), this._request.removeEventListener("load", this._handleLoadProxy), this._request.removeEventListener("readystatechange", this._handleReadyStateChangeProxy)) : (this._request.onloadstart = null, this._request.onprogress = null, this._request.onabort = null, this._request.onerror = null, this._request.ontimeout = null, this._request.onload =
            null, this._request.onreadystatechange = null)
    };
    c.toString = function() {
        return "[PreloadJS XHRRequest]"
    };
    createjs.XHRRequest = createjs.promote(b, "AbstractRequest")
})();
this.createjs = this.createjs || {};
(function() {
    function b(a, b, c) {
        this.AbstractLoader_constructor();
        this._plugins = [];
        this._typeCallbacks = {};
        this._extensionCallbacks = {};
        this.next = null;
        this.maintainScriptOrder = !0;
        this.stopOnError = !1;
        this._maxConnections = 1;
        this._availableLoaders = [createjs.FontLoader, createjs.ImageLoader, createjs.JavaScriptLoader, createjs.CSSLoader, createjs.JSONLoader, createjs.JSONPLoader, createjs.SoundLoader, createjs.ManifestLoader, createjs.SpriteSheetLoader, createjs.XMLLoader, createjs.SVGLoader, createjs.BinaryLoader,
            createjs.VideoLoader, createjs.TextLoader
        ];
        this._defaultLoaderLength = this._availableLoaders.length;
        this.init(a, b, c)
    }
    var c = createjs.extend(b, createjs.AbstractLoader);
    try {
        Object.defineProperties(b, {
            POST: {
                get: createjs.deprecate(function() {
                    return createjs.Methods.POST
                }, "AbstractLoader.POST")
            },
            GET: {
                get: createjs.deprecate(function() {
                    return createjs.Methods.GET
                }, "AbstractLoader.GET")
            },
            BINARY: {
                get: createjs.deprecate(function() {
                    return createjs.Types.BINARY
                }, "AbstractLoader.BINARY")
            },
            CSS: {
                get: createjs.deprecate(function() {
                        return createjs.Types.CSS
                    },
                    "AbstractLoader.CSS")
            },
            FONT: {
                get: createjs.deprecate(function() {
                    return createjs.Types.FONT
                }, "AbstractLoader.FONT")
            },
            FONTCSS: {
                get: createjs.deprecate(function() {
                    return createjs.Types.FONTCSS
                }, "AbstractLoader.FONTCSS")
            },
            IMAGE: {
                get: createjs.deprecate(function() {
                    return createjs.Types.IMAGE
                }, "AbstractLoader.IMAGE")
            },
            JAVASCRIPT: {
                get: createjs.deprecate(function() {
                    return createjs.Types.JAVASCRIPT
                }, "AbstractLoader.JAVASCRIPT")
            },
            JSON: {
                get: createjs.deprecate(function() {
                    return createjs.Types.JSON
                }, "AbstractLoader.JSON")
            },
            JSONP: {
                get: createjs.deprecate(function() {
                    return createjs.Types.JSONP
                }, "AbstractLoader.JSONP")
            },
            MANIFEST: {
                get: createjs.deprecate(function() {
                    return createjs.Types.MANIFEST
                }, "AbstractLoader.MANIFEST")
            },
            SOUND: {
                get: createjs.deprecate(function() {
                    return createjs.Types.SOUND
                }, "AbstractLoader.SOUND")
            },
            VIDEO: {
                get: createjs.deprecate(function() {
                    return createjs.Types.VIDEO
                }, "AbstractLoader.VIDEO")
            },
            SPRITESHEET: {
                get: createjs.deprecate(function() {
                    return createjs.Types.SPRITESHEET
                }, "AbstractLoader.SPRITESHEET")
            },
            SVG: {
                get: createjs.deprecate(function() {
                    return createjs.Types.SVG
                }, "AbstractLoader.SVG")
            },
            TEXT: {
                get: createjs.deprecate(function() {
                    return createjs.Types.TEXT
                }, "AbstractLoader.TEXT")
            },
            XML: {
                get: createjs.deprecate(function() {
                    return createjs.Types.XML
                }, "AbstractLoader.XML")
            }
        })
    } catch (a) {}
    c.init = function(a, b, c) {
        this._preferXHR = this.preferXHR = !0;
        this.setPreferXHR(a);
        this._paused = !1;
        this._basePath = b;
        this._crossOrigin = c;
        this._loadStartWasDispatched = !1;
        this._currentlyLoadingScript = null;
        this._currentLoads = [];
        this._loadQueue = [];
        this._loadQueueBackup = [];
        this._loadItemsById = {};
        this._loadItemsBySrc = {};
        this._loadedResults = {};
        this._loadedRawResults = {};
        this._numItemsLoaded = this._numItems = 0;
        this._scriptOrder = [];
        this._loadedScripts = [];
        this._lastProgress = 0 / 0
    };
    c.registerLoader = function(a) {
        if (!a || !a.canLoadItem) throw Error("loader is of an incorrect type.");
        if (-1 != this._availableLoaders.indexOf(a)) throw Error("loader already exists.");
        this._availableLoaders.unshift(a)
    };
    c.unregisterLoader = function(a) {
        a = this._availableLoaders.indexOf(a); - 1 != a && a < this._defaultLoaderLength - 1 && this._availableLoaders.splice(a, 1)
    };
    c.setPreferXHR = function(a) {
        return this.preferXHR = 0 != a && null != window.XMLHttpRequest, this.preferXHR
    };
    c.removeAll = function() {
        this.remove()
    };
    c.remove = function(a) {
        var b = null;
        if (a && !Array.isArray(a)) b = [a];
        else if (a) b = a;
        else if (0 < arguments.length) return;
        var c = !1;
        if (b) {
            for (; b.length;) {
                for (var g = b.pop(), k = this.getResult(g), h = this._loadQueue.length - 1; 0 <= h; h--)
                    if (l = this._loadQueue[h].getItem(), l.id == g || l.src == g) {
                        this._loadQueue.splice(h,
                            1)[0].cancel();
                        break
                    }
                for (h = this._loadQueueBackup.length - 1; 0 <= h; h--)
                    if (l = this._loadQueueBackup[h].getItem(), l.id == g || l.src == g) {
                        this._loadQueueBackup.splice(h, 1)[0].cancel();
                        break
                    }
                if (k) this._disposeItem(this.getItem(g));
                else
                    for (h = this._currentLoads.length - 1; 0 <= h; h--) {
                        var l = this._currentLoads[h].getItem();
                        if (l.id == g || l.src == g) {
                            this._currentLoads.splice(h, 1)[0].cancel();
                            c = !0;
                            break
                        }
                    }
            }
            c && this._loadNext()
        } else {
            this.close();
            for (g in this._loadItemsById) this._disposeItem(this._loadItemsById[g]);
            this.init(this.preferXHR,
                this._basePath)
        }
    };
    c.reset = function() {
        this.close();
        for (var a in this._loadItemsById) this._disposeItem(this._loadItemsById[a]);
        a = [];
        for (var b = 0, c = this._loadQueueBackup.length; c > b; b++) a.push(this._loadQueueBackup[b].getItem());
        this.loadManifest(a, !1)
    };
    c.installPlugin = function(a) {
        if (null != a && null != a.getPreloadHandlers) {
            this._plugins.push(a);
            var b = a.getPreloadHandlers();
            if (b.scope = a, null != b.types) {
                a = 0;
                for (var c = b.types.length; c > a; a++) this._typeCallbacks[b.types[a]] = b
            }
            if (null != b.extensions)
                for (a = 0, c = b.extensions.length; c >
                    a; a++) this._extensionCallbacks[b.extensions[a]] = b
        }
    };
    c.setMaxConnections = function(a) {
        this._maxConnections = a;
        !this._paused && 0 < this._loadQueue.length && this._loadNext()
    };
    c.loadFile = function(a, b, c) {
        if (null == a) return a = new createjs.ErrorEvent("PRELOAD_NO_FILE"), void this._sendError(a);
        this._addItem(a, null, c);
        this.setPaused(!1 !== b ? !1 : !0)
    };
    c.loadManifest = function(a, c, e) {
        var g = null,
            k = null;
        if (Array.isArray(a)) {
            if (0 == a.length) return g = new createjs.ErrorEvent("PRELOAD_MANIFEST_EMPTY"), void this._sendError(g);
            g = a
        } else if ("string" == typeof a) g = [{
            src: a,
            type: b.MANIFEST
        }];
        else {
            if ("object" != typeof a) return g = new createjs.ErrorEvent("PRELOAD_MANIFEST_NULL"), void this._sendError(g);
            void 0 !== a.src ? (null == a.type ? a.type = b.MANIFEST : a.type != b.MANIFEST && (g = new createjs.ErrorEvent("PRELOAD_MANIFEST_TYPE"), this._sendError(g)), g = [a]) : void 0 !== a.manifest && (g = a.manifest, k = a.path)
        }
        a = 0;
        for (var h = g.length; h > a; a++) this._addItem(g[a], k, e);
        this.setPaused(!1 !== c ? !1 : !0)
    };
    c.load = function() {
        this.setPaused(!1)
    };
    c.getItem = function(a) {
        return this._loadItemsById[a] ||
            this._loadItemsBySrc[a]
    };
    c.getResult = function(a, b) {
        var c = this._loadItemsById[a] || this._loadItemsBySrc[a];
        if (null == c) return null;
        c = c.id;
        return b && this._loadedRawResults[c] ? this._loadedRawResults[c] : this._loadedResults[c]
    };
    c.getItems = function(a) {
        var b = [],
            c;
        for (c in this._loadItemsById) {
            var g = this._loadItemsById[c],
                k = this.getResult(c);
            !0 === a && null == k || b.push({
                item: g,
                result: k,
                rawResult: this.getResult(c, !0)
            })
        }
        return b
    };
    c.setPaused = function(a) {
        (this._paused = a) || this._loadNext()
    };
    c.close = function() {
        for (; this._currentLoads.length;) this._currentLoads.pop().cancel();
        this._scriptOrder.length = 0;
        this._loadedScripts.length = 0;
        this.loadStartWasDispatched = !1;
        this._itemCount = 0;
        this._lastProgress = 0 / 0
    };
    c._addItem = function(a, b, c) {
        a = this._createLoadItem(a, b, c);
        null != a && (b = this._createLoader(a), null != b && ("plugins" in b && (b.plugins = this._plugins), a._loader = b, this._loadQueue.push(b), this._loadQueueBackup.push(b), this._numItems++, this._updateProgress(), (this.maintainScriptOrder && a.type == createjs.Types.JAVASCRIPT || !0 === a.maintainOrder) && (this._scriptOrder.push(a), this._loadedScripts.push(null))))
    };
    c._createLoadItem = function(a, b, c) {
        a = createjs.LoadItem.create(a);
        if (null == a) return null;
        var g = "";
        c = c || this._basePath;
        if (a.src instanceof Object) {
            if (!a.type) return null;
            if (b) {
                var g = b,
                    k = createjs.URLUtils.parseURI(b);
                null == c || k.absolute || k.relative || (g = c + g)
            } else null != c && (g = c)
        } else {
            k = createjs.URLUtils.parseURI(a.src);
            k.extension && (a.ext = k.extension);
            null == a.type && (a.type = createjs.RequestUtils.getTypeByExtension(a.ext));
            var h = a.src;
            k.absolute || k.relative || (b ? (g = b, k = createjs.URLUtils.parseURI(b), h = b + h,
                null == c || k.absolute || k.relative || (g = c + g)) : null != c && (g = c));
            a.src = g + a.src
        }
        a.path = g;
        void 0 !== a.id && null !== a.id && "" !== a.id || (a.id = h);
        if (b = this._typeCallbacks[a.type] || this._extensionCallbacks[a.ext]) {
            b = b.callback.call(b.scope, a, this);
            if (!1 === b) return null;
            !0 === b || null != b && (a._loader = b);
            k = createjs.URLUtils.parseURI(a.src);
            null != k.extension && (a.ext = k.extension)
        }
        return this._loadItemsById[a.id] = a, this._loadItemsBySrc[a.src] = a, null == a.crossOrigin && (a.crossOrigin = this._crossOrigin), a
    };
    c._createLoader = function(a) {
        if (null !=
            a._loader) return a._loader;
        for (var b = this.preferXHR, c = 0; c < this._availableLoaders.length; c++) {
            var g = this._availableLoaders[c];
            if (g && g.canLoadItem(a)) return new g(a, b)
        }
        return null
    };
    c._loadNext = function() {
        if (!this._paused) {
            this._loadStartWasDispatched || (this._sendLoadStart(), this._loadStartWasDispatched = !0);
            this._numItems == this._numItemsLoaded ? (this.loaded = !0, this._sendComplete(), this.next && this.next.load && this.next.load()) : this.loaded = !1;
            for (var a = 0; a < this._loadQueue.length && !(this._currentLoads.length >=
                    this._maxConnections); a++) {
                var b = this._loadQueue[a];
                this._canStartLoad(b) && (this._loadQueue.splice(a, 1), a--, this._loadItem(b))
            }
        }
    };
    c._loadItem = function(a) {
        a.on("fileload", this._handleFileLoad, this);
        a.on("progress", this._handleProgress, this);
        a.on("complete", this._handleFileComplete, this);
        a.on("error", this._handleError, this);
        a.on("fileerror", this._handleFileError, this);
        this._currentLoads.push(a);
        this._sendFileStart(a.getItem());
        a.load()
    };
    c._handleFileLoad = function(a) {
        a.target = null;
        this.dispatchEvent(a)
    };
    c._handleFileError = function(a) {
        a = new createjs.ErrorEvent("FILE_LOAD_ERROR", null, a.item);
        this._sendError(a)
    };
    c._handleError = function(a) {
        a = a.target;
        this._numItemsLoaded++;
        this._finishOrderedItem(a, !0);
        this._updateProgress();
        var b = new createjs.ErrorEvent("FILE_LOAD_ERROR", null, a.getItem());
        this._sendError(b);
        this.stopOnError ? this.setPaused(!0) : (this._removeLoadItem(a), this._cleanLoadItem(a), this._loadNext())
    };
    c._handleFileComplete = function(a) {
        a = a.target;
        var b = a.getItem(),
            c = a.getResult();
        this._loadedResults[b.id] =
            c;
        var g = a.getResult(!0);
        null != g && g !== c && (this._loadedRawResults[b.id] = g);
        this._saveLoadedItems(a);
        this._removeLoadItem(a);
        this._finishOrderedItem(a) || this._processFinishedLoad(b, a);
        this._cleanLoadItem(a)
    };
    c._saveLoadedItems = function(a) {
        a = a.getLoadedItems();
        if (null !== a)
            for (var b = 0; b < a.length; b++) {
                var c = a[b].item;
                this._loadItemsBySrc[c.src] = c;
                this._loadItemsById[c.id] = c;
                this._loadedResults[c.id] = a[b].result;
                this._loadedRawResults[c.id] = a[b].rawResult
            }
    };
    c._finishOrderedItem = function(a, b) {
        var c = a.getItem();
        if (this.maintainScriptOrder && c.type == createjs.Types.JAVASCRIPT || c.maintainOrder) {
            a instanceof createjs.JavaScriptLoader && (this._currentlyLoadingScript = !1);
            var g = createjs.indexOf(this._scriptOrder, c);
            return -1 == g ? !1 : (this._loadedScripts[g] = !0 === b ? !0 : c, this._checkScriptLoadOrder(), !0)
        }
        return !1
    };
    c._checkScriptLoadOrder = function() {
        for (var a = this._loadedScripts.length, b = 0; a > b; b++) {
            var c = this._loadedScripts[b];
            if (null === c) break;
            if (!0 !== c) {
                var g = this._loadedResults[c.id];
                c.type == createjs.Types.JAVASCRIPT &&
                    createjs.DomUtils.appendToHead(g);
                this._processFinishedLoad(c, c._loader);
                this._loadedScripts[b] = !0
            }
        }
    };
    c._processFinishedLoad = function(a, b) {
        if (this._numItemsLoaded++, !this.maintainScriptOrder && a.type == createjs.Types.JAVASCRIPT) {
            var c = b.getTag();
            createjs.DomUtils.appendToHead(c)
        }
        this._updateProgress();
        this._sendFileComplete(a, b);
        this._loadNext()
    };
    c._canStartLoad = function(a) {
        if (!this.maintainScriptOrder || a.preferXHR) return !0;
        a = a.getItem();
        if (a.type != createjs.Types.JAVASCRIPT) return !0;
        if (this._currentlyLoadingScript) return !1;
        a = this._scriptOrder.indexOf(a);
        for (var b = 0; a > b;) {
            if (null == this._loadedScripts[b]) return !1;
            b++
        }
        return this._currentlyLoadingScript = !0, !0
    };
    c._removeLoadItem = function(a) {
        for (var b = this._currentLoads.length, c = 0; b > c; c++)
            if (this._currentLoads[c] == a) {
                this._currentLoads.splice(c, 1);
                break
            }
    };
    c._cleanLoadItem = function(a) {
        (a = a.getItem()) && delete a._loader
    };
    c._handleProgress = function(a) {
        a = a.target;
        this._sendFileProgress(a.getItem(), a.progress);
        this._updateProgress()
    };
    c._updateProgress = function() {
        var a = this._numItemsLoaded /
            this._numItems,
            b = this._numItems - this._numItemsLoaded;
        if (0 < b) {
            for (var c = 0, g = 0, k = this._currentLoads.length; k > g; g++) c += this._currentLoads[g].progress;
            a += c / b * (b / this._numItems)
        }
        this._lastProgress != a && (this._sendProgress(a), this._lastProgress = a)
    };
    c._disposeItem = function(a) {
        delete this._loadedResults[a.id];
        delete this._loadedRawResults[a.id];
        delete this._loadItemsById[a.id];
        delete this._loadItemsBySrc[a.src]
    };
    c._sendFileProgress = function(a, b) {
        if (!this._isCanceled() && !this._paused && this.hasEventListener("fileprogress")) {
            var c =
                new createjs.Event("fileprogress");
            c.progress = b;
            c.loaded = b;
            c.total = 1;
            c.item = a;
            this.dispatchEvent(c)
        }
    };
    c._sendFileComplete = function(a, b) {
        if (!this._isCanceled() && !this._paused) {
            var c = new createjs.Event("fileload");
            c.loader = b;
            c.item = a;
            c.result = this._loadedResults[a.id];
            c.rawResult = this._loadedRawResults[a.id];
            a.completeHandler && a.completeHandler(c);
            this.hasEventListener("fileload") && this.dispatchEvent(c)
        }
    };
    c._sendFileStart = function(a) {
        var b = new createjs.Event("filestart");
        b.item = a;
        this.hasEventListener("filestart") &&
            this.dispatchEvent(b)
    };
    c.toString = function() {
        return "[PreloadJS LoadQueue]"
    };
    createjs.LoadQueue = createjs.promote(b, "AbstractLoader")
})();
this.createjs = this.createjs || {};
(function() {
    function b(b) {
        this.AbstractLoader_constructor(b, !0, createjs.Types.TEXT)
    }(createjs.extend(b, createjs.AbstractLoader), b).canLoadItem = function(b) {
        return b.type == createjs.Types.TEXT
    };
    createjs.TextLoader = createjs.promote(b, "AbstractLoader")
})();
this.createjs = this.createjs || {};
(function() {
    function b(a) {
        this.AbstractLoader_constructor(a, !0, createjs.Types.BINARY);
        this.on("initialize", this._updateXHR, this)
    }
    var c = createjs.extend(b, createjs.AbstractLoader);
    b.canLoadItem = function(a) {
        return a.type == createjs.Types.BINARY
    };
    c._updateXHR = function(a) {
        a.loader.setResponseType("arraybuffer")
    };
    createjs.BinaryLoader = createjs.promote(b, "AbstractLoader")
})();
this.createjs = this.createjs || {};
(function() {
    function b(a, b) {
        this.AbstractLoader_constructor(a, b, createjs.Types.CSS);
        this.resultFormatter = this._formatResult;
        this._tagSrcAttribute = "href";
        this._tag = b ? createjs.Elements.style() : createjs.Elements.link();
        this._tag.rel = "stylesheet";
        this._tag.type = "text/css"
    }
    var c = createjs.extend(b, createjs.AbstractLoader);
    b.canLoadItem = function(a) {
        return a.type == createjs.Types.CSS
    };
    c._formatResult = function(a) {
        if (this._preferXHR) {
            var b = a.getTag();
            b.styleSheet ? b.styleSheet.cssText = a.getResult(!0) : (a = createjs.Elements.text(a.getResult(!0)),
                b.appendChild(a))
        } else b = this._tag;
        return createjs.DomUtils.appendToHead(b), b
    };
    createjs.CSSLoader = createjs.promote(b, "AbstractLoader")
})();
this.createjs = this.createjs || {};
(function() {
    function b(a, b) {
        this.AbstractLoader_constructor(a, b, a.type);
        this._faces = {};
        this._watched = [];
        this._count = 0;
        this._loadTimeout = this._watchInterval = null;
        this._injectCSS = void 0 === a.injectCSS ? !0 : a.injectCSS;
        this.dispatchEvent("initialize")
    }
    var c = createjs.extend(b, createjs.AbstractLoader);
    b.canLoadItem = function(a) {
        return a.type == createjs.Types.FONT || a.type == createjs.Types.FONTCSS
    };
    b.sampleText = "abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    b._ctx = document.createElement("canvas").getContext("2d");
    b._referenceFonts = ["serif", "monospace"];
    b.WEIGHT_REGEX = /[- ._]*(thin|normal|book|regular|medium|black|heavy|[1-9]00|(?:extra|ultra|semi|demi)?[- ._]*(?:light|bold))[- ._]*/gi;
    b.STYLE_REGEX = /[- ._]*(italic|oblique)[- ._]*/gi;
    b.FONT_FORMAT = {
        woff2: "woff2",
        woff: "woff",
        ttf: "truetype",
        otf: "truetype"
    };
    b.FONT_WEIGHT = {
        thin: 100,
        extralight: 200,
        ultralight: 200,
        light: 300,
        semilight: 300,
        demilight: 300,
        book: "normal",
        regular: "normal",
        semibold: 600,
        demibold: 600,
        extrabold: 800,
        ultrabold: 800,
        black: 900,
        heavy: 900
    };
    b.WATCH_DURATION =
        10;
    c.load = function() {
        if (this.type == createjs.Types.FONTCSS) {
            if (!this._watchCSS()) return void this.AbstractLoader_load()
        } else if (this._item.src instanceof Array) this._watchFontArray();
        else {
            var a = this._defFromSrc(this._item.src);
            this._watchFont(a);
            this._injectStyleTag(this._cssFromDef(a))
        }
        this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), this._item.loadTimeout);
        this.dispatchEvent("loadstart")
    };
    c._handleTimeout = function() {
        this._stopWatching();
        this.dispatchEvent(new createjs.ErrorEvent("PRELOAD_TIMEOUT"))
    };
    c._createRequest = function() {
        return this._request
    };
    c.handleEvent = function(a) {
        switch (a.type) {
            case "complete":
                this._rawResult = a.target._response;
                this._result = !0;
                this._parseCSS(this._rawResult);
                break;
            case "error":
                this._stopWatching(), this.AbstractLoader_handleEvent(a)
        }
    };
    c._watchCSS = function() {
        var a = this._item.src;
        return a instanceof HTMLStyleElement && (this._injectCSS && !a.parentNode && (document.head || document.getElementsByTagName("head")[0]).appendChild(a), this._injectCSS = !1, a = "\n" + a.textContent), -1 !==
            a.search(/\n|\r|@font-face/i) ? (this._parseCSS(a), !0) : (this._request = new createjs.XHRRequest(this._item), !1)
    };
    c._parseCSS = function(a) {
        for (var b = /@font-face\s*\{([^}]+)}/g;;) {
            var c = b.exec(a);
            if (!c) break;
            this._watchFont(this._parseFontFace(c[1]))
        }
        this._injectStyleTag(a)
    };
    c._watchFontArray = function() {
        for (var a, b = this._item.src, c = "", e = b.length - 1; 0 <= e; e--) a = b[e], a = "string" == typeof a ? this._defFromSrc(a) : this._defFromObj(a), this._watchFont(a), c += this._cssFromDef(a) + "\n";
        this._injectStyleTag(c)
    };
    c._injectStyleTag =
        function(a) {
            if (this._injectCSS) {
                var b = document.head || document.getElementsByTagName("head")[0],
                    c = document.createElement("style");
                c.type = "text/css";
                c.styleSheet ? c.styleSheet.cssText = a : c.appendChild(document.createTextNode(a));
                b.appendChild(c)
            }
        };
    c._parseFontFace = function(a) {
        var b = this._getCSSValue(a, "font-family"),
            c = this._getCSSValue(a, "src");
        return b && c ? this._defFromObj({
            family: b,
            src: c,
            style: this._getCSSValue(a, "font-style"),
            weight: this._getCSSValue(a, "font-weight")
        }) : null
    };
    c._watchFont = function(a) {
        a &&
            !this._faces[a.id] && (this._faces[a.id] = a, this._watched.push(a), this._count++, this._calculateReferenceSizes(a), this._startWatching())
    };
    c._startWatching = function() {
        null == this._watchInterval && (this._watchInterval = setInterval(createjs.proxy(this._watch, this), b.WATCH_DURATION))
    };
    c._stopWatching = function() {
        clearInterval(this._watchInterval);
        clearTimeout(this._loadTimeout);
        this._watchInterval = null
    };
    c._watch = function() {
        for (var a = this._watched, c = b._referenceFonts, f = a.length, e = f - 1; 0 <= e; e--)
            for (var g = a[e], k =
                    g.refs, h = k.length - 1; 0 <= h; h--)
                if (this._getTextWidth(g.family + "," + c[h], g.weight, g.style) != k[h]) {
                    k = new createjs.Event("fileload");
                    g.type = "font-family";
                    k.item = g;
                    this.dispatchEvent(k);
                    a.splice(e, 1);
                    break
                }
        f !== a.length && (k = new createjs.ProgressEvent(this._count - a.length, this._count), this.dispatchEvent(k));
        0 === f && (this._stopWatching(), this._sendComplete())
    };
    c._calculateReferenceSizes = function(a) {
        for (var c = b._referenceFonts, f = a.refs = [], e = 0; e < c.length; e++) f[e] = this._getTextWidth(c[e], a.weight, a.style)
    };
    c._defFromSrc =
        function(a) {
            var c, f = /[- ._]+/g,
                e = a,
                g = null;
            c = e.search(/[?#]/); - 1 !== c && (e = e.substr(0, c));
            c = e.lastIndexOf("."); - 1 !== c && (g = e.substr(c + 1), e = e.substr(0, c));
            c = e.lastIndexOf("/"); - 1 !== c && (e = e.substr(c + 1));
            c = e;
            var k = c.match(b.WEIGHT_REGEX);
            k && (k = k[0], c = c.replace(k, ""), k = k.replace(f, "").toLowerCase());
            var h = e.match(b.STYLE_REGEX);
            h && (c = c.replace(h[0], ""), h = "italic");
            c = c.replace(f, "");
            a = "local('" + e.replace(f, " ") + "'), url('" + a + "')";
            g = b.FONT_FORMAT[g];
            return g && (a += " format('" + g + "')"), this._defFromObj({
                family: c,
                weight: b.FONT_WEIGHT[k] || k,
                style: h,
                src: a
            })
        };
    c._defFromObj = function(a) {
        a = {
            family: a.family,
            src: a.src,
            style: a.style || "normal",
            weight: a.weight || "normal"
        };
        return a.id = a.family + ";" + a.style + ";" + a.weight, a
    };
    c._cssFromDef = function(a) {
        return "@font-face {\n\tfont-family: '" + a.family + "';\n\tfont-style: " + a.style + ";\n\tfont-weight: " + a.weight + ";\n\tsrc: " + a.src + ";\n}"
    };
    c._getTextWidth = function(a, c, f) {
        var e = b._ctx;
        return e.font = f + " " + c + " 72px " + a, e.measureText(b.sampleText).width
    };
    c._getCSSValue = function(a, b) {
        var c =
            (new RegExp(b + ":s*([^;}]+?)s*[;}]")).exec(a);
        return c && c[1] ? c[1] : null
    };
    createjs.FontLoader = createjs.promote(b, "AbstractLoader")
})();
this.createjs = this.createjs || {};
(function() {
    function b(a, b) {
        this.AbstractLoader_constructor(a, b, createjs.Types.IMAGE);
        this.resultFormatter = this._formatResult;
        this._tagSrcAttribute = "src";
        createjs.DomUtils.isImageTag(a) ? this._tag = a : createjs.DomUtils.isImageTag(a.src) ? this._tag = a.src : createjs.DomUtils.isImageTag(a.tag) && (this._tag = a.tag);
        null != this._tag ? this._preferXHR = !1 : this._tag = createjs.Elements.img();
        this.on("initialize", this._updateXHR, this)
    }
    var c = createjs.extend(b, createjs.AbstractLoader);
    b.canLoadItem = function(a) {
        return a.type ==
            createjs.Types.IMAGE
    };
    c.load = function() {
        if ("" != this._tag.src && this._tag.complete) return void this._sendComplete();
        var a = this._item.crossOrigin;
        1 == a && (a = "Anonymous");
        null == a || createjs.URLUtils.isLocal(this._item) || (this._tag.crossOrigin = a);
        this.AbstractLoader_load()
    };
    c._updateXHR = function(a) {
        a.loader.mimeType = "text/plain; charset=x-user-defined-binary";
        a.loader.setResponseType && a.loader.setResponseType("blob")
    };
    c._formatResult = function() {
        return this._formatImage
    };
    c._formatImage = function(a, b) {
        var c =
            this._tag,
            e = window.URL || window.webkitURL;
        this._preferXHR && (e ? (e = e.createObjectURL(this.getResult(!0)), c.src = e, c.addEventListener("load", this._cleanUpURL, !1), c.addEventListener("error", this._cleanUpURL, !1)) : c.src = this._item.src);
        c.complete ? a(c) : (c.onload = createjs.proxy(function() {
            a(this._tag);
            c.onload = c.onerror = null
        }, this), c.onerror = createjs.proxy(function(a) {
            b(new createjs.ErrorEvent("IMAGE_FORMAT", null, a));
            c.onload = c.onerror = null
        }, this))
    };
    c._cleanUpURL = function(a) {
        (window.URL || window.webkitURL).revokeObjectURL(a.target.src)
    };
    createjs.ImageLoader = createjs.promote(b, "AbstractLoader")
})();
this.createjs = this.createjs || {};
(function() {
    function b(a, b) {
        this.AbstractLoader_constructor(a, b, createjs.Types.JAVASCRIPT);
        this.resultFormatter = this._formatResult;
        this._tagSrcAttribute = "src";
        this.setTag(createjs.Elements.script())
    }
    var c = createjs.extend(b, createjs.AbstractLoader);
    b.canLoadItem = function(a) {
        return a.type == createjs.Types.JAVASCRIPT
    };
    c._formatResult = function(a) {
        var b = a.getTag();
        return this._preferXHR && (b.text = a.getResult(!0)), b
    };
    createjs.JavaScriptLoader = createjs.promote(b, "AbstractLoader")
})();
this.createjs = this.createjs || {};
(function() {
    function b(a) {
        this.AbstractLoader_constructor(a, !0, createjs.Types.JSON);
        this.resultFormatter = this._formatResult
    }
    var c = createjs.extend(b, createjs.AbstractLoader);
    b.canLoadItem = function(a) {
        return a.type == createjs.Types.JSON
    };
    c._formatResult = function(a) {
        var b = null;
        try {
            b = createjs.DataUtils.parseJSON(a.getResult(!0))
        } catch (c) {
            return a = new createjs.ErrorEvent("JSON_FORMAT", null, c), this._sendError(a), c
        }
        return b
    };
    createjs.JSONLoader = createjs.promote(b, "AbstractLoader")
})();
this.createjs = this.createjs || {};
(function() {
    function b(a) {
        this.AbstractLoader_constructor(a, !1, createjs.Types.JSONP);
        this.setTag(createjs.Elements.script());
        this.getTag().type = "text/javascript"
    }
    var c = createjs.extend(b, createjs.AbstractLoader);
    b.canLoadItem = function(a) {
        return a.type == createjs.Types.JSONP
    };
    c.cancel = function() {
        this.AbstractLoader_cancel();
        this._dispose()
    };
    c.load = function() {
        if (null == this._item.callback) throw Error("callback is required for loading JSONP requests.");
        if (null != window[this._item.callback]) throw Error("JSONP callback '" + this._item.callback +
            "' already exists on window. You need to specify a different callback or re-name the current one.");
        window[this._item.callback] = createjs.proxy(this._handleLoad, this);
        createjs.DomUtils.appendToBody(this._tag);
        this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), this._item.loadTimeout);
        this._tag.src = this._item.src
    };
    c._handleLoad = function(a) {
        this._result = this._rawResult = a;
        this._sendComplete();
        this._dispose()
    };
    c._handleTimeout = function() {
        this._dispose();
        this.dispatchEvent(new createjs.ErrorEvent("timeout"))
    };
    c._dispose = function() {
        createjs.DomUtils.removeChild(this._tag);
        delete window[this._item.callback];
        clearTimeout(this._loadTimeout)
    };
    createjs.JSONPLoader = createjs.promote(b, "AbstractLoader")
})();
this.createjs = this.createjs || {};
(function() {
    function b(a, b) {
        this.AbstractLoader_constructor(a, b, createjs.Types.MANIFEST);
        this._manifestQueue = this.plugins = null
    }
    var c = createjs.extend(b, createjs.AbstractLoader);
    b.MANIFEST_PROGRESS = .25;
    b.canLoadItem = function(a) {
        return a.type == createjs.Types.MANIFEST
    };
    c.load = function() {
        this.AbstractLoader_load()
    };
    c._createRequest = function() {
        this._request = null != this._item.callback ? new createjs.JSONPLoader(this._item) : new createjs.JSONLoader(this._item)
    };
    c.handleEvent = function(a) {
        switch (a.type) {
            case "complete":
                return this._rawResult =
                    a.target.getResult(!0), this._result = a.target.getResult(), this._sendProgress(b.MANIFEST_PROGRESS), void this._loadManifest(this._result);
            case "progress":
                return a.loaded *= b.MANIFEST_PROGRESS, this.progress = a.loaded / a.total, (isNaN(this.progress) || 1 / 0 == this.progress) && (this.progress = 0), void this._sendProgress(a)
        }
        this.AbstractLoader_handleEvent(a)
    };
    c.destroy = function() {
        this.AbstractLoader_destroy();
        this._manifestQueue.close()
    };
    c._loadManifest = function(a) {
        if (a && a.manifest) {
            var b = this._manifestQueue = new createjs.LoadQueue(this._preferXHR);
            b.on("fileload", this._handleManifestFileLoad, this);
            b.on("progress", this._handleManifestProgress, this);
            b.on("complete", this._handleManifestComplete, this, !0);
            b.on("error", this._handleManifestError, this, !0);
            for (var c = 0, e = this.plugins.length; e > c; c++) b.installPlugin(this.plugins[c]);
            b.loadManifest(a)
        } else this._sendComplete()
    };
    c._handleManifestFileLoad = function(a) {
        a.target = null;
        this.dispatchEvent(a)
    };
    c._handleManifestComplete = function() {
        this._loadedItems = this._manifestQueue.getItems(!0);
        this._sendComplete()
    };
    c._handleManifestProgress = function(a) {
        this.progress = a.progress * (1 - b.MANIFEST_PROGRESS) + b.MANIFEST_PROGRESS;
        this._sendProgress(this.progress)
    };
    c._handleManifestError = function(a) {
        var b = new createjs.Event("fileerror");
        b.item = a.data;
        this.dispatchEvent(b)
    };
    createjs.ManifestLoader = createjs.promote(b, "AbstractLoader")
})();
this.createjs = this.createjs || {};
(function() {
    function b(a, b) {
        this.AbstractMediaLoader_constructor(a, b, createjs.Types.SOUND);
        createjs.DomUtils.isAudioTag(a) ? this._tag = a : createjs.DomUtils.isAudioTag(a.src) ? this._tag = a : createjs.DomUtils.isAudioTag(a.tag) && (this._tag = createjs.DomUtils.isAudioTag(a) ? a : a.src);
        null != this._tag && (this._preferXHR = !1)
    }
    var c = createjs.extend(b, createjs.AbstractMediaLoader);
    b.canLoadItem = function(a) {
        return a.type == createjs.Types.SOUND
    };
    c._createTag = function(a) {
        var b = createjs.Elements.audio();
        return b.autoplay = !1, b.preload = "none", b.src = a, b
    };
    createjs.SoundLoader = createjs.promote(b, "AbstractMediaLoader")
})();
this.createjs = this.createjs || {};
(function() {
    function b(b, a) {
        this.AbstractMediaLoader_constructor(b, a, createjs.Types.VIDEO);
        createjs.DomUtils.isVideoTag(b) || createjs.DomUtils.isVideoTag(b.src) ? (this.setTag(createjs.DomUtils.isVideoTag(b) ? b : b.src), this._preferXHR = !1) : this.setTag(this._createTag())
    }
    createjs.extend(b, createjs.AbstractMediaLoader)._createTag = function() {
        return createjs.Elements.video()
    };
    b.canLoadItem = function(b) {
        return b.type == createjs.Types.VIDEO
    };
    createjs.VideoLoader = createjs.promote(b, "AbstractMediaLoader")
})();
this.createjs = this.createjs || {};
(function() {
    function b(a, b) {
        this.AbstractLoader_constructor(a, b, createjs.Types.SPRITESHEET);
        this._manifestQueue = null
    }
    var c = createjs.extend(b, createjs.AbstractLoader);
    b.SPRITESHEET_PROGRESS = .25;
    b.canLoadItem = function(a) {
        return a.type == createjs.Types.SPRITESHEET
    };
    c.destroy = function() {
        this.AbstractLoader_destroy();
        this._manifestQueue.close()
    };
    c._createRequest = function() {
        this._request = null != this._item.callback ? new createjs.JSONPLoader(this._item) : new createjs.JSONLoader(this._item)
    };
    c.handleEvent = function(a) {
        switch (a.type) {
            case "complete":
                return this._rawResult =
                    a.target.getResult(!0), this._result = a.target.getResult(), this._sendProgress(b.SPRITESHEET_PROGRESS), void this._loadManifest(this._result);
            case "progress":
                return a.loaded *= b.SPRITESHEET_PROGRESS, this.progress = a.loaded / a.total, (isNaN(this.progress) || 1 / 0 == this.progress) && (this.progress = 0), void this._sendProgress(a)
        }
        this.AbstractLoader_handleEvent(a)
    };
    c._loadManifest = function(a) {
        if (a && a.images) {
            var b = this._manifestQueue = new createjs.LoadQueue(this._preferXHR, this._item.path, this._item.crossOrigin);
            b.on("complete",
                this._handleManifestComplete, this, !0);
            b.on("fileload", this._handleManifestFileLoad, this);
            b.on("progress", this._handleManifestProgress, this);
            b.on("error", this._handleManifestError, this, !0);
            b.loadManifest(a.images)
        }
    };
    c._handleManifestFileLoad = function(a) {
        var b = a.result;
        if (null != b) {
            var c = this.getResult().images;
            a = c.indexOf(a.item.src);
            c[a] = b
        }
    };
    c._handleManifestComplete = function() {
        this._result = new createjs.SpriteSheet(this._result);
        this._loadedItems = this._manifestQueue.getItems(!0);
        this._sendComplete()
    };
    c._handleManifestProgress = function(a) {
        this.progress = a.progress * (1 - b.SPRITESHEET_PROGRESS) + b.SPRITESHEET_PROGRESS;
        this._sendProgress(this.progress)
    };
    c._handleManifestError = function(a) {
        var b = new createjs.Event("fileerror");
        b.item = a.data;
        this.dispatchEvent(b)
    };
    createjs.SpriteSheetLoader = createjs.promote(b, "AbstractLoader")
})();
this.createjs = this.createjs || {};
(function() {
    function b(a, b) {
        this.AbstractLoader_constructor(a, b, createjs.Types.SVG);
        this.resultFormatter = this._formatResult;
        this._tagSrcAttribute = "data";
        b ? this.setTag(createjs.Elements.svg()) : (this.setTag(createjs.Elements.object()), this.getTag().type = "image/svg+xml")
    }
    var c = createjs.extend(b, createjs.AbstractLoader);
    b.canLoadItem = function(a) {
        return a.type == createjs.Types.SVG
    };
    c._formatResult = function(a) {
        var b = createjs.DataUtils.parseXML(a.getResult(!0));
        a = a.getTag();
        return (!this._preferXHR && document.body.contains(a) &&
            document.body.removeChild(a), null != b.documentElement) ? (b = b.documentElement, document.importNode && (b = document.importNode(b, !0)), a.appendChild(b), a) : b
    };
    createjs.SVGLoader = createjs.promote(b, "AbstractLoader")
})();
this.createjs = this.createjs || {};
(function() {
    function b(a) {
        this.AbstractLoader_constructor(a, !0, createjs.Types.XML);
        this.resultFormatter = this._formatResult
    }
    var c = createjs.extend(b, createjs.AbstractLoader);
    b.canLoadItem = function(a) {
        return a.type == createjs.Types.XML
    };
    c._formatResult = function(a) {
        return createjs.DataUtils.parseXML(a.getResult(!0))
    };
    createjs.XMLLoader = createjs.promote(b, "AbstractLoader")
})();
this.createjs = this.createjs || {};
(function() {
    var b = createjs.SoundJS = createjs.SoundJS || {};
    b.version = "NEXT";
    b.buildDate = "Thu, 12 Oct 2017 16:33:45 GMT"
})();
this.createjs = this.createjs || {};
createjs.extend = function(b, c) {
    function a() {
        this.constructor = b
    }
    return a.prototype = c.prototype, b.prototype = new a
};
this.createjs = this.createjs || {};
createjs.promote = function(b, c) {
    var a = b.prototype,
        d = Object.getPrototypeOf && Object.getPrototypeOf(a) || a.__proto__;
    if (d) {
        a[(c += "_") + "constructor"] = d.constructor;
        for (var f in d) a.hasOwnProperty(f) && "function" == typeof d[f] && (a[c + f] = d[f])
    }
    return b
};
this.createjs = this.createjs || {};
createjs.deprecate = function(b, c) {
    return function() {
        var a = "Deprecated property or method '" + c + "'. See docs for info.";
        return console && (console.warn ? console.warn(a) : console.log(a)), b && b.apply(this, arguments)
    }
};
this.createjs = this.createjs || {};
createjs.indexOf = function(b, c) {
    for (var a = 0, d = b.length; d > a; a++)
        if (c === b[a]) return a;
    return -1
};
this.createjs = this.createjs || {};
(function() {
    createjs.proxy = function(b, c) {
        var a = Array.prototype.slice.call(arguments, 2);
        return function() {
            return b.apply(c, Array.prototype.slice.call(arguments, 0).concat(a))
        }
    }
})();
this.createjs = this.createjs || {};
(function() {
    function b() {
        throw "BrowserDetect cannot be instantiated";
    }
    var c = b.agent = window.navigator.userAgent;
    b.isWindowPhone = -1 < c.indexOf("IEMobile") || -1 < c.indexOf("Windows Phone");
    b.isFirefox = -1 < c.indexOf("Firefox");
    b.isOpera = null != window.opera;
    b.isChrome = -1 < c.indexOf("Chrome");
    b.isIOS = (-1 < c.indexOf("iPod") || -1 < c.indexOf("iPhone") || -1 < c.indexOf("iPad")) && !b.isWindowPhone;
    b.isAndroid = -1 < c.indexOf("Android") && !b.isWindowPhone;
    b.isBlackberry = -1 < c.indexOf("Blackberry");
    createjs.BrowserDetect = b
})();
this.createjs = this.createjs || {};
(function() {
    function b() {
        this._captureListeners = this._listeners = null
    }
    var c = b.prototype;
    b.initialize = function(a) {
        a.addEventListener = c.addEventListener;
        a.on = c.on;
        a.removeEventListener = a.off = c.removeEventListener;
        a.removeAllEventListeners = c.removeAllEventListeners;
        a.hasEventListener = c.hasEventListener;
        a.dispatchEvent = c.dispatchEvent;
        a._dispatchEvent = c._dispatchEvent;
        a.willTrigger = c.willTrigger
    };
    c.addEventListener = function(a, b, c) {
        var e;
        e = c ? this._captureListeners = this._captureListeners || {} : this._listeners =
            this._listeners || {};
        var g = e[a];
        return g && this.removeEventListener(a, b, c), g = e[a], g ? g.push(b) : e[a] = [b], b
    };
    c.on = function(a, b, c, e, g, k) {
        return b.handleEvent && (c = c || b, b = b.handleEvent), c = c || this, this.addEventListener(a, function(a) {
            b.call(c, a, g);
            e && a.remove()
        }, k)
    };
    c.removeEventListener = function(a, b, c) {
        if (c = c ? this._captureListeners : this._listeners) {
            var e = c[a];
            if (e)
                for (var g = 0, k = e.length; k > g; g++)
                    if (e[g] == b) {
                        1 == k ? delete c[a] : e.splice(g, 1);
                        break
                    }
        }
    };
    c.off = c.removeEventListener;
    c.removeAllEventListeners = function(a) {
        a ?
            (this._listeners && delete this._listeners[a], this._captureListeners && delete this._captureListeners[a]) : this._listeners = this._captureListeners = null
    };
    c.dispatchEvent = function(a, b, c) {
        if ("string" == typeof a) {
            var e = this._listeners;
            if (!(b || e && e[a])) return !0;
            a = new createjs.Event(a, b, c)
        } else a.target && a.clone && (a = a.clone());
        try {
            a.target = this
        } catch (g) {}
        if (a.bubbles && this.parent) {
            c = this;
            for (b = [c]; c.parent;) b.push(c = c.parent);
            e = b.length;
            for (c = e - 1; 0 <= c && !a.propagationStopped; c--) b[c]._dispatchEvent(a, 1 + (0 == c));
            for (c = 1; e > c && !a.propagationStopped; c++) b[c]._dispatchEvent(a, 3)
        } else this._dispatchEvent(a, 2);
        return !a.defaultPrevented
    };
    c.hasEventListener = function(a) {
        var b = this._listeners,
            c = this._captureListeners;
        return !!(b && b[a] || c && c[a])
    };
    c.willTrigger = function(a) {
        for (var b = this; b;) {
            if (b.hasEventListener(a)) return !0;
            b = b.parent
        }
        return !1
    };
    c.toString = function() {
        return "[EventDispatcher]"
    };
    c._dispatchEvent = function(a, b) {
        var c, e, g = 2 >= b ? this._captureListeners : this._listeners;
        if (a && g && (e = g[a.type]) && (c = e.length)) {
            try {
                a.currentTarget =
                    this
            } catch (k) {}
            try {
                a.eventPhase = 0 | b
            } catch (k) {}
            a.removed = !1;
            e = e.slice();
            for (g = 0; c > g && !a.immediatePropagationStopped; g++) {
                var h = e[g];
                h.handleEvent ? h.handleEvent(a) : h(a);
                a.removed && (this.off(a.type, h, 1 == b), a.removed = !1)
            }
        }
        2 === b && this._dispatchEvent(a, 2.1)
    };
    createjs.EventDispatcher = b
})();
this.createjs = this.createjs || {};
(function() {
    function b(a, b, c) {
        this.type = a;
        this.currentTarget = this.target = null;
        this.eventPhase = 0;
        this.bubbles = !!b;
        this.cancelable = !!c;
        this.timeStamp = (new Date).getTime();
        this.removed = this.immediatePropagationStopped = this.propagationStopped = this.defaultPrevented = !1
    }
    var c = b.prototype;
    c.preventDefault = function() {
        this.defaultPrevented = this.cancelable && !0
    };
    c.stopPropagation = function() {
        this.propagationStopped = !0
    };
    c.stopImmediatePropagation = function() {
        this.immediatePropagationStopped = this.propagationStopped = !0
    };
    c.remove = function() {
        this.removed = !0
    };
    c.clone = function() {
        return new b(this.type, this.bubbles, this.cancelable)
    };
    c.set = function(a) {
        for (var b in a) this[b] = a[b];
        return this
    };
    c.toString = function() {
        return "[Event (type=" + this.type + ")]"
    };
    createjs.Event = b
})();
this.createjs = this.createjs || {};
(function() {
    function b(b, a, d) {
        this.Event_constructor("error");
        this.title = b;
        this.message = a;
        this.data = d
    }
    createjs.extend(b, createjs.Event).clone = function() {
        return new createjs.ErrorEvent(this.title, this.message, this.data)
    };
    createjs.ErrorEvent = createjs.promote(b, "Event")
})();
this.createjs = this.createjs || {};
(function() {
    function b(b, a) {
        this.Event_constructor("progress");
        this.loaded = b;
        this.total = null == a ? 1 : a;
        this.progress = 0 == a ? 0 : this.loaded / this.total
    }
    createjs.extend(b, createjs.Event).clone = function() {
        return new createjs.ProgressEvent(this.loaded, this.total)
    };
    createjs.ProgressEvent = createjs.promote(b, "Event")
})(window);
this.createjs = this.createjs || {};
(function() {
    function b() {
        this.id = this.type = this.src = null;
        this.maintainOrder = !1;
        this.data = this.callback = null;
        this.method = createjs.Methods.GET;
        this.headers = this.values = null;
        this.withCredentials = !1;
        this.crossOrigin = this.mimeType = null;
        this.loadTimeout = a.LOAD_TIMEOUT_DEFAULT
    }
    var c = b.prototype = {},
        a = b;
    a.LOAD_TIMEOUT_DEFAULT = 8E3;
    a.create = function(c) {
        if ("string" == typeof c) {
            var f = new b;
            return f.src = c, f
        }
        if (c instanceof a) return c;
        if (c instanceof Object && c.src) return null == c.loadTimeout && (c.loadTimeout = a.LOAD_TIMEOUT_DEFAULT),
            c;
        throw Error("Type not recognized.");
    };
    c.set = function(a) {
        for (var b in a) this[b] = a[b];
        return this
    };
    createjs.LoadItem = a
})();
this.createjs = this.createjs || {};
(function() {
    createjs.Methods = {
        POST: "POST",
        GET: "GET"
    }
})();
this.createjs = this.createjs || {};
(function() {
    createjs.Types = {
        BINARY: "binary",
        CSS: "css",
        FONT: "font",
        FONTCSS: "fontcss",
        IMAGE: "image",
        JAVASCRIPT: "javascript",
        JSON: "json",
        JSONP: "jsonp",
        MANIFEST: "manifest",
        SOUND: "sound",
        VIDEO: "video",
        SPRITESHEET: "spritesheet",
        SVG: "svg",
        TEXT: "text",
        XML: "xml"
    }
})();
(function() {
    var b = {
        a: function() {
            return b.el("a")
        },
        svg: function() {
            return b.el("svg")
        },
        object: function() {
            return b.el("object")
        },
        image: function() {
            return b.el("image")
        },
        img: function() {
            return b.el("img")
        },
        style: function() {
            return b.el("style")
        },
        link: function() {
            return b.el("link")
        },
        script: function() {
            return b.el("script")
        },
        audio: function() {
            return b.el("audio")
        },
        video: function() {
            return b.el("video")
        },
        text: function(b) {
            return document.createTextNode(b)
        },
        el: function(b) {
            return document.createElement(b)
        }
    };
    createjs.Elements =
        b
})();
(function() {
    var b = {
        container: null,
        appendToHead: function(c) {
            b.getHead().appendChild(c)
        },
        appendToBody: function(c) {
            if (null == b.container) {
                b.container = document.createElement("div");
                b.container.id = "preloadjs-container";
                var a = b.container.style;
                a.visibility = "hidden";
                a.position = "absolute";
                a.width = b.container.style.height = "10px";
                a.overflow = "hidden";
                a.transform = a.msTransform = a.webkitTransform = a.oTransform = "translate(-10px, -10px)";
                b.getBody().appendChild(b.container)
            }
            b.container.appendChild(c)
        },
        getHead: function() {
            return document.head || document.getElementsByTagName("head")[0]
        },
        getBody: function() {
            return document.body || document.getElementsByTagName("body")[0]
        },
        removeChild: function(b) {
            b.parent && b.parent.removeChild(b)
        },
        isImageTag: function(b) {
            return b instanceof HTMLImageElement
        },
        isAudioTag: function(b) {
            return window.HTMLAudioElement ? b instanceof HTMLAudioElement : !1
        },
        isVideoTag: function(b) {
            return window.HTMLVideoElement ? b instanceof HTMLVideoElement : !1
        }
    };
    createjs.DomUtils = b
})();
(function() {
    createjs.RequestUtils = {
        isBinary: function(b) {
            switch (b) {
                case createjs.Types.IMAGE:
                case createjs.Types.BINARY:
                    return !0;
                default:
                    return !1
            }
        },
        isText: function(b) {
            switch (b) {
                case createjs.Types.TEXT:
                case createjs.Types.JSON:
                case createjs.Types.MANIFEST:
                case createjs.Types.XML:
                case createjs.Types.CSS:
                case createjs.Types.SVG:
                case createjs.Types.JAVASCRIPT:
                case createjs.Types.SPRITESHEET:
                    return !0;
                default:
                    return !1
            }
        },
        getTypeByExtension: function(b) {
            if (null == b) return createjs.Types.TEXT;
            switch (b.toLowerCase()) {
                case "jpeg":
                case "jpg":
                case "gif":
                case "png":
                case "webp":
                case "bmp":
                    return createjs.Types.IMAGE;
                case "ogg":
                case "mp3":
                case "webm":
                    return createjs.Types.SOUND;
                case "mp4":
                case "webm":
                case "ts":
                    return createjs.Types.VIDEO;
                case "json":
                    return createjs.Types.JSON;
                case "xml":
                    return createjs.Types.XML;
                case "css":
                    return createjs.Types.CSS;
                case "js":
                    return createjs.Types.JAVASCRIPT;
                case "svg":
                    return createjs.Types.SVG;
                default:
                    return createjs.Types.TEXT
            }
        }
    }
})();
(function() {
    var b = {
        ABSOLUTE_PATT: /^(?:\w+:)?\/{2}/i,
        RELATIVE_PATT: /^[.\/]*?\//i,
        EXTENSION_PATT: /\/?[^\/]+\.(\w{1,5})$/i,
        parseURI: function(c) {
            var a = {
                absolute: !1,
                relative: !1,
                protocol: null,
                hostname: null,
                port: null,
                pathname: null,
                search: null,
                hash: null,
                host: null
            };
            if (null == c) return a;
            var d = createjs.Elements.a();
            d.href = c;
            for (var f in a) f in d && (a[f] = d[f]);
            d = c.indexOf("?"); - 1 < d && (c = c.substr(0, d));
            var e;
            return b.ABSOLUTE_PATT.test(c) ? a.absolute = !0 : b.RELATIVE_PATT.test(c) && (a.relative = !0), (e = c.match(b.EXTENSION_PATT)) &&
                (a.extension = e[1].toLowerCase()), a
        },
        formatQueryString: function(b, a) {
            if (null == b) throw Error("You must specify data.");
            var d = [],
                f;
            for (f in b) d.push(f + "=" + escape(b[f]));
            return a && (d = d.concat(a)), d.join("&")
        },
        buildURI: function(b, a) {
            if (null == a) return b;
            var d = [],
                f = b.indexOf("?");
            if (-1 != f) var e = b.slice(f + 1),
                d = d.concat(e.split("&"));
            return -1 != f ? b.slice(0, f) + "?" + this.formatQueryString(a, d) : b + "?" + this.formatQueryString(a, d)
        },
        isCrossDomain: function(b) {
            var a = createjs.Elements.a();
            a.href = b.src;
            b = createjs.Elements.a();
            b.href = location.href;
            return "" != a.hostname && (a.port != b.port || a.protocol != b.protocol || a.hostname != b.hostname)
        },
        isLocal: function(b) {
            var a = createjs.Elements.a();
            return a.href = b.src, "" == a.hostname && "file:" == a.protocol
        }
    };
    createjs.URLUtils = b
})();
this.createjs = this.createjs || {};
(function() {
    function b(a, b, c) {
        this.EventDispatcher_constructor();
        this.canceled = this.loaded = !1;
        this.progress = 0;
        this.type = c;
        this.resultFormatter = null;
        this._item = a ? createjs.LoadItem.create(a) : null;
        this._preferXHR = b;
        this._tag = this._tagSrcAttribute = this._loadedItems = this._rawResult = this._result = null
    }
    var c = createjs.extend(b, createjs.EventDispatcher);
    try {
        Object.defineProperties(b, {
            POST: {
                get: createjs.deprecate(function() {
                    return createjs.Methods.POST
                }, "AbstractLoader.POST")
            },
            GET: {
                get: createjs.deprecate(function() {
                        return createjs.Methods.GET
                    },
                    "AbstractLoader.GET")
            },
            BINARY: {
                get: createjs.deprecate(function() {
                    return createjs.Types.BINARY
                }, "AbstractLoader.BINARY")
            },
            CSS: {
                get: createjs.deprecate(function() {
                    return createjs.Types.CSS
                }, "AbstractLoader.CSS")
            },
            FONT: {
                get: createjs.deprecate(function() {
                    return createjs.Types.FONT
                }, "AbstractLoader.FONT")
            },
            FONTCSS: {
                get: createjs.deprecate(function() {
                    return createjs.Types.FONTCSS
                }, "AbstractLoader.FONTCSS")
            },
            IMAGE: {
                get: createjs.deprecate(function() {
                    return createjs.Types.IMAGE
                }, "AbstractLoader.IMAGE")
            },
            JAVASCRIPT: {
                get: createjs.deprecate(function() {
                        return createjs.Types.JAVASCRIPT
                    },
                    "AbstractLoader.JAVASCRIPT")
            },
            JSON: {
                get: createjs.deprecate(function() {
                    return createjs.Types.JSON
                }, "AbstractLoader.JSON")
            },
            JSONP: {
                get: createjs.deprecate(function() {
                    return createjs.Types.JSONP
                }, "AbstractLoader.JSONP")
            },
            MANIFEST: {
                get: createjs.deprecate(function() {
                    return createjs.Types.MANIFEST
                }, "AbstractLoader.MANIFEST")
            },
            SOUND: {
                get: createjs.deprecate(function() {
                    return createjs.Types.SOUND
                }, "AbstractLoader.SOUND")
            },
            VIDEO: {
                get: createjs.deprecate(function() {
                    return createjs.Types.VIDEO
                }, "AbstractLoader.VIDEO")
            },
            SPRITESHEET: {
                get: createjs.deprecate(function() {
                    return createjs.Types.SPRITESHEET
                }, "AbstractLoader.SPRITESHEET")
            },
            SVG: {
                get: createjs.deprecate(function() {
                    return createjs.Types.SVG
                }, "AbstractLoader.SVG")
            },
            TEXT: {
                get: createjs.deprecate(function() {
                    return createjs.Types.TEXT
                }, "AbstractLoader.TEXT")
            },
            XML: {
                get: createjs.deprecate(function() {
                    return createjs.Types.XML
                }, "AbstractLoader.XML")
            }
        })
    } catch (a) {}
    c.getItem = function() {
        return this._item
    };
    c.getResult = function(a) {
        return a ? this._rawResult : this._result
    };
    c.getTag =
        function() {
            return this._tag
        };
    c.setTag = function(a) {
        this._tag = a
    };
    c.load = function() {
        this._createRequest();
        this._request.on("complete", this, this);
        this._request.on("progress", this, this);
        this._request.on("loadStart", this, this);
        this._request.on("abort", this, this);
        this._request.on("timeout", this, this);
        this._request.on("error", this, this);
        var a = new createjs.Event("initialize");
        a.loader = this._request;
        this.dispatchEvent(a);
        this._request.load()
    };
    c.cancel = function() {
        this.canceled = !0;
        this.destroy()
    };
    c.destroy = function() {
        this._request &&
            (this._request.removeAllEventListeners(), this._request.destroy());
        this._loadItems = this._result = this._rawResult = this._item = this._request = null;
        this.removeAllEventListeners()
    };
    c.getLoadedItems = function() {
        return this._loadedItems
    };
    c._createRequest = function() {
        this._request = this._preferXHR ? new createjs.XHRRequest(this._item) : new createjs.TagRequest(this._item, this._tag || this._createTag(), this._tagSrcAttribute)
    };
    c._createTag = function() {
        return null
    };
    c._sendLoadStart = function() {
        this._isCanceled() || this.dispatchEvent("loadstart")
    };
    c._sendProgress = function(a) {
        if (!this._isCanceled()) {
            var b = null;
            "number" == typeof a ? (this.progress = a, b = new createjs.ProgressEvent(this.progress)) : (b = a, this.progress = a.loaded / a.total, b.progress = this.progress, (isNaN(this.progress) || 1 / 0 == this.progress) && (this.progress = 0));
            this.hasEventListener("progress") && this.dispatchEvent(b)
        }
    };
    c._sendComplete = function() {
        if (!this._isCanceled()) {
            this.loaded = !0;
            var a = new createjs.Event("complete");
            a.rawResult = this._rawResult;
            null != this._result && (a.result = this._result);
            this.dispatchEvent(a)
        }
    };
    c._sendError = function(a) {
        !this._isCanceled() && this.hasEventListener("error") && (null == a && (a = new createjs.ErrorEvent("PRELOAD_ERROR_EMPTY")), this.dispatchEvent(a))
    };
    c._isCanceled = function() {
        return null == window.createjs || this.canceled ? !0 : !1
    };
    c.resultFormatter = null;
    c.handleEvent = function(a) {
        switch (a.type) {
            case "complete":
                this._rawResult = a.target._response;
                a = this.resultFormatter && this.resultFormatter(this);
                a instanceof Function ? a.call(this, createjs.proxy(this._resultFormatSuccess,
                    this), createjs.proxy(this._resultFormatFailed, this)) : (this._result = a || this._rawResult, this._sendComplete());
                break;
            case "progress":
                this._sendProgress(a);
                break;
            case "error":
                this._sendError(a);
                break;
            case "loadstart":
                this._sendLoadStart();
                break;
            case "abort":
            case "timeout":
                this._isCanceled() || this.dispatchEvent(new createjs.ErrorEvent("PRELOAD_" + a.type.toUpperCase() + "_ERROR"))
        }
    };
    c._resultFormatSuccess = function(a) {
        this._result = a;
        this._sendComplete()
    };
    c._resultFormatFailed = function(a) {
        this._sendError(a)
    };
    c.toString = function() {
        return "[PreloadJS AbstractLoader]"
    };
    createjs.AbstractLoader = createjs.promote(b, "EventDispatcher")
})();
this.createjs = this.createjs || {};
(function() {
    function b(a, b, c) {
        this.AbstractLoader_constructor(a, b, c);
        this.resultFormatter = this._formatResult;
        this._tagSrcAttribute = "src";
        this.on("initialize", this._updateXHR, this)
    }
    var c = createjs.extend(b, createjs.AbstractLoader);
    c.load = function() {
        this._tag || (this._tag = this._createTag(this._item.src));
        this._tag.preload = "auto";
        this._tag.load();
        this.AbstractLoader_load()
    };
    c._createTag = function() {};
    c._createRequest = function() {
        this._request = this._preferXHR ? new createjs.XHRRequest(this._item) : new createjs.MediaTagRequest(this._item,
            this._tag || this._createTag(), this._tagSrcAttribute)
    };
    c._updateXHR = function(a) {
        a.loader.setResponseType && a.loader.setResponseType("blob")
    };
    c._formatResult = function(a) {
        if (this._tag.removeEventListener && this._tag.removeEventListener("canplaythrough", this._loadedHandler), this._tag.onstalled = null, this._preferXHR) {
            var b = window.URL || window.webkitURL,
                c = a.getResult(!0);
            a.getTag().src = b.createObjectURL(c)
        }
        return a.getTag()
    };
    createjs.AbstractMediaLoader = createjs.promote(b, "AbstractLoader")
})();
this.createjs = this.createjs || {};
(function() {
    var b = function(a) {
            this._item = a
        },
        c = createjs.extend(b, createjs.EventDispatcher);
    c.load = function() {};
    c.destroy = function() {};
    c.cancel = function() {};
    createjs.AbstractRequest = createjs.promote(b, "EventDispatcher")
})();
this.createjs = this.createjs || {};
(function() {
    function b(a, b, c) {
        this.AbstractRequest_constructor(a);
        this._tag = b;
        this._tagSrcAttribute = c;
        this._loadedHandler = createjs.proxy(this._handleTagComplete, this);
        this._addedToDOM = !1
    }
    var c = createjs.extend(b, createjs.AbstractRequest);
    c.load = function() {
        this._tag.onload = createjs.proxy(this._handleTagComplete, this);
        this._tag.onreadystatechange = createjs.proxy(this._handleReadyStateChange, this);
        this._tag.onerror = createjs.proxy(this._handleError, this);
        var a = new createjs.Event("initialize");
        a.loader =
            this._tag;
        this.dispatchEvent(a);
        this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), this._item.loadTimeout);
        this._tag[this._tagSrcAttribute] = this._item.src;
        null == this._tag.parentNode && (createjs.DomUtils.appendToBody(this._tag), this._addedToDOM = !0)
    };
    c.destroy = function() {
        this._clean();
        this._tag = null;
        this.AbstractRequest_destroy()
    };
    c._handleReadyStateChange = function() {
        clearTimeout(this._loadTimeout);
        var a = this._tag;
        "loaded" != a.readyState && "complete" != a.readyState || this._handleTagComplete()
    };
    c._handleError = function() {
        this._clean();
        this.dispatchEvent("error")
    };
    c._handleTagComplete = function() {
        this._rawResult = this._tag;
        this._result = this.resultFormatter && this.resultFormatter(this) || this._rawResult;
        this._clean();
        this.dispatchEvent("complete")
    };
    c._handleTimeout = function() {
        this._clean();
        this.dispatchEvent(new createjs.Event("timeout"))
    };
    c._clean = function() {
        this._tag.onload = null;
        this._tag.onreadystatechange = null;
        this._tag.onerror = null;
        this._addedToDOM && null != this._tag.parentNode && this._tag.parentNode.removeChild(this._tag);
        clearTimeout(this._loadTimeout)
    };
    c._handleStalled = function() {};
    createjs.TagRequest = createjs.promote(b, "AbstractRequest")
})();
this.createjs = this.createjs || {};
(function() {
    function b(a, b, c) {
        this.AbstractRequest_constructor(a);
        this._tag = b;
        this._tagSrcAttribute = c;
        this._loadedHandler = createjs.proxy(this._handleTagComplete, this)
    }
    var c = createjs.extend(b, createjs.TagRequest);
    c.load = function() {
        var a = createjs.proxy(this._handleStalled, this);
        this._stalledCallback = a;
        var b = createjs.proxy(this._handleProgress, this);
        this._handleProgress = b;
        this._tag.addEventListener("stalled", a);
        this._tag.addEventListener("progress", b);
        this._tag.addEventListener && this._tag.addEventListener("canplaythrough",
            this._loadedHandler, !1);
        this.TagRequest_load()
    };
    c._handleReadyStateChange = function() {
        clearTimeout(this._loadTimeout);
        var a = this._tag;
        "loaded" != a.readyState && "complete" != a.readyState || this._handleTagComplete()
    };
    c._handleStalled = function() {};
    c._handleProgress = function(a) {
        !a || 0 < a.loaded && 0 == a.total || (a = new createjs.ProgressEvent(a.loaded, a.total), this.dispatchEvent(a))
    };
    c._clean = function() {
        this._tag.removeEventListener && this._tag.removeEventListener("canplaythrough", this._loadedHandler);
        this._tag.removeEventListener("stalled",
            this._stalledCallback);
        this._tag.removeEventListener("progress", this._progressCallback);
        this.TagRequest__clean()
    };
    createjs.MediaTagRequest = createjs.promote(b, "TagRequest")
})();
this.createjs = this.createjs || {};
(function() {
    function b(a) {
        this.AbstractRequest_constructor(a);
        this._loadTimeout = this._request = null;
        this._xhrLevel = 1;
        this._rawResponse = this._response = null;
        this._canceled = !1;
        this._handleLoadStartProxy = createjs.proxy(this._handleLoadStart, this);
        this._handleProgressProxy = createjs.proxy(this._handleProgress, this);
        this._handleAbortProxy = createjs.proxy(this._handleAbort, this);
        this._handleErrorProxy = createjs.proxy(this._handleError, this);
        this._handleTimeoutProxy = createjs.proxy(this._handleTimeout, this);
        this._handleLoadProxy =
            createjs.proxy(this._handleLoad, this);
        this._handleReadyStateChangeProxy = createjs.proxy(this._handleReadyStateChange, this);
        !this._createXHR(a)
    }
    var c = createjs.extend(b, createjs.AbstractRequest);
    b.ACTIVEX_VERSIONS = "Msxml2.XMLHTTP.6.0 Msxml2.XMLHTTP.5.0 Msxml2.XMLHTTP.4.0 MSXML2.XMLHTTP.3.0 MSXML2.XMLHTTP Microsoft.XMLHTTP".split(" ");
    c.getResult = function(a) {
        return a && this._rawResponse ? this._rawResponse : this._response
    };
    c.cancel = function() {
        this.canceled = !0;
        this._clean();
        this._request.abort()
    };
    c.load = function() {
        if (null ==
            this._request) return void this._handleError();
        null != this._request.addEventListener ? (this._request.addEventListener("loadstart", this._handleLoadStartProxy, !1), this._request.addEventListener("progress", this._handleProgressProxy, !1), this._request.addEventListener("abort", this._handleAbortProxy, !1), this._request.addEventListener("error", this._handleErrorProxy, !1), this._request.addEventListener("timeout", this._handleTimeoutProxy, !1), this._request.addEventListener("load", this._handleLoadProxy, !1), this._request.addEventListener("readystatechange",
            this._handleReadyStateChangeProxy, !1)) : (this._request.onloadstart = this._handleLoadStartProxy, this._request.onprogress = this._handleProgressProxy, this._request.onabort = this._handleAbortProxy, this._request.onerror = this._handleErrorProxy, this._request.ontimeout = this._handleTimeoutProxy, this._request.onload = this._handleLoadProxy, this._request.onreadystatechange = this._handleReadyStateChangeProxy);
        1 == this._xhrLevel && (this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), this._item.loadTimeout));
        try {
            this._item.values ? this._request.send(createjs.URLUtils.formatQueryString(this._item.values)) : this._request.send()
        } catch (a) {
            this.dispatchEvent(new createjs.ErrorEvent("XHR_SEND", null, a))
        }
    };
    c.setResponseType = function(a) {
        "blob" === a && (a = window.URL ? "blob" : "arraybuffer", this._responseType = a);
        this._request.responseType = a
    };
    c.getAllResponseHeaders = function() {
        return this._request.getAllResponseHeaders instanceof Function ? this._request.getAllResponseHeaders() : null
    };
    c.getResponseHeader = function(a) {
        return this._request.getResponseHeader instanceof
        Function ? this._request.getResponseHeader(a) : null
    };
    c._handleProgress = function(a) {
        !a || 0 < a.loaded && 0 == a.total || (a = new createjs.ProgressEvent(a.loaded, a.total), this.dispatchEvent(a))
    };
    c._handleLoadStart = function() {
        clearTimeout(this._loadTimeout);
        this.dispatchEvent("loadstart")
    };
    c._handleAbort = function(a) {
        this._clean();
        this.dispatchEvent(new createjs.ErrorEvent("XHR_ABORTED", null, a))
    };
    c._handleError = function(a) {
        this._clean();
        this.dispatchEvent(new createjs.ErrorEvent(a.message))
    };
    c._handleReadyStateChange =
        function() {
            4 == this._request.readyState && this._handleLoad()
        };
    c._handleLoad = function() {
        if (!this.loaded) {
            this.loaded = !0;
            var a = this._checkError();
            if (a) return void this._handleError(a);
            if (this._response = this._getResponse(), "arraybuffer" === this._responseType) try {
                this._response = new Blob([this._response])
            } catch (b) {
                if (window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder, "TypeError" === b.name && window.BlobBuilder) a = new BlobBuilder, a.append(this._response),
                    this._response = a.getBlob()
            }
            this._clean();
            this.dispatchEvent(new createjs.Event("complete"))
        }
    };
    c._handleTimeout = function(a) {
        this._clean();
        this.dispatchEvent(new createjs.ErrorEvent("PRELOAD_TIMEOUT", null, a))
    };
    c._checkError = function() {
        var a = parseInt(this._request.status);
        return 400 <= a && 599 >= a ? Error(a) : 0 == a && /^https?:/.test(location.protocol) ? Error(0) : null
    };
    c._getResponse = function() {
        if (null != this._response) return this._response;
        if (null != this._request.response) return this._request.response;
        try {
            if (null !=
                this._request.responseText) return this._request.responseText
        } catch (a) {}
        try {
            if (null != this._request.responseXML) return this._request.responseXML
        } catch (a) {}
        return null
    };
    c._createXHR = function(a) {
        var b = createjs.URLUtils.isCrossDomain(a),
            c = {},
            e = null;
        if (window.XMLHttpRequest) e = new XMLHttpRequest, b && void 0 === e.withCredentials && window.XDomainRequest && (e = new XDomainRequest);
        else {
            for (var g = 0, k = s.ACTIVEX_VERSIONS.length; k > g; g++) {
                var h = s.ACTIVEX_VERSIONS[g];
                try {
                    e = new ActiveXObject(h);
                    break
                } catch (l) {}
            }
            if (null ==
                e) return !1
        }
        null == a.mimeType && createjs.RequestUtils.isText(a.type) && (a.mimeType = "text/plain; charset=utf-8");
        a.mimeType && e.overrideMimeType && e.overrideMimeType(a.mimeType);
        this._xhrLevel = "string" == typeof e.responseType ? 2 : 1;
        g = null;
        if (g = a.method == createjs.Methods.GET ? createjs.URLUtils.buildURI(a.src, a.values) : a.src, e.open(a.method || createjs.Methods.GET, g, !0), b && e instanceof XMLHttpRequest && 1 == this._xhrLevel && (c.Origin = location.origin), a.values && a.method == createjs.Methods.POST && (c["Content-Type"] = "application/x-www-form-urlencoded"),
            b || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest"), a.headers)
            for (var n in a.headers) c[n] = a.headers[n];
        for (n in c) e.setRequestHeader(n, c[n]);
        return e instanceof XMLHttpRequest && void 0 !== a.withCredentials && (e.withCredentials = a.withCredentials), this._request = e, !0
    };
    c._clean = function() {
        clearTimeout(this._loadTimeout);
        null != this._request.removeEventListener ? (this._request.removeEventListener("loadstart", this._handleLoadStartProxy), this._request.removeEventListener("progress", this._handleProgressProxy),
            this._request.removeEventListener("abort", this._handleAbortProxy), this._request.removeEventListener("error", this._handleErrorProxy), this._request.removeEventListener("timeout", this._handleTimeoutProxy), this._request.removeEventListener("load", this._handleLoadProxy), this._request.removeEventListener("readystatechange", this._handleReadyStateChangeProxy)) : (this._request.onloadstart = null, this._request.onprogress = null, this._request.onabort = null, this._request.onerror = null, this._request.ontimeout = null, this._request.onload =
            null, this._request.onreadystatechange = null)
    };
    c.toString = function() {
        return "[PreloadJS XHRRequest]"
    };
    createjs.XHRRequest = createjs.promote(b, "AbstractRequest")
})();
this.createjs = this.createjs || {};
(function() {
    function b(a, b) {
        this.AbstractMediaLoader_constructor(a, b, createjs.Types.SOUND);
        createjs.DomUtils.isAudioTag(a) ? this._tag = a : createjs.DomUtils.isAudioTag(a.src) ? this._tag = a : createjs.DomUtils.isAudioTag(a.tag) && (this._tag = createjs.DomUtils.isAudioTag(a) ? a : a.src);
        null != this._tag && (this._preferXHR = !1)
    }
    var c = createjs.extend(b, createjs.AbstractMediaLoader);
    b.canLoadItem = function(a) {
        return a.type == createjs.Types.SOUND
    };
    c._createTag = function(a) {
        var b = createjs.Elements.audio();
        return b.autoplay = !1, b.preload = "none", b.src = a, b
    };
    createjs.SoundLoader = createjs.promote(b, "AbstractMediaLoader")
})();
this.createjs = this.createjs || {};
(function() {
    var b = function() {
            this.duration = this.startTime = this.pan = this.volume = this.loop = this.offset = this.delay = this.interrupt = null
        },
        c = b.prototype = {};
    b.create = function(a) {
        if ("string" == typeof a) return console && (console.warn || console.log)("Deprecated behaviour. Sound.play takes a configuration object instead of individual arguments. See docs for info."), (new createjs.PlayPropsConfig).set({
            interrupt: a
        });
        if (null == a || a instanceof b || a instanceof Object) return (new createjs.PlayPropsConfig).set(a);
        if (null ==
            a) throw Error("PlayProps configuration not recognized.");
    };
    c.set = function(a) {
        if (null != a)
            for (var b in a) this[b] = a[b];
        return this
    };
    c.toString = function() {
        return "[PlayPropsConfig]"
    };
    createjs.PlayPropsConfig = b
})();
this.createjs = this.createjs || {};
(function() {
    function b() {
        throw "Sound cannot be instantiated";
    }

    function c(a, b) {
        this.init(a, b)
    }
    b.INTERRUPT_ANY = "any";
    b.INTERRUPT_EARLY = "early";
    b.INTERRUPT_LATE = "late";
    b.INTERRUPT_NONE = "none";
    b.PLAY_INITED = "playInited";
    b.PLAY_SUCCEEDED = "playSucceeded";
    b.PLAY_INTERRUPTED = "playInterrupted";
    b.PLAY_FINISHED = "playFinished";
    b.PLAY_FAILED = "playFailed";
    b.SUPPORTED_EXTENSIONS = "mp3 ogg opus mpeg wav m4a mp4 aiff wma mid".split(" ");
    b.EXTENSION_MAP = {
        m4a: "mp4"
    };
    b.FILE_PATTERN = /^(?:(\w+:)\/{2}(\w+(?:\.\w+)*\/?))?([\/.]*?(?:[^?]+)?\/)?((?:[^\/?]+)\.(\w+))(?:\?(\S+)?)?$/;
    b.defaultInterruptBehavior = b.INTERRUPT_NONE;
    b.alternateExtensions = [];
    b.activePlugin = null;
    b._masterVolume = 1;
    b._getMasterVolume = function() {
        return this._masterVolume
    };
    b.getVolume = createjs.deprecate(b._getMasterVolume, "Sound.getVolume");
    b._setMasterVolume = function(a) {
        if (null != Number(a) && (a = Math.max(0, Math.min(1, a)), b._masterVolume = a, !this.activePlugin || !this.activePlugin.setVolume || !this.activePlugin.setVolume(a)))
            for (var c = this._instances, e = 0, g = c.length; g > e; e++) c[e].setMasterVolume(a)
    };
    b.setVolume = createjs.deprecate(b._setMasterVolume,
        "Sound.setVolume");
    b._masterMute = !1;
    b._getMute = function() {
        return this._masterMute
    };
    b.getMute = createjs.deprecate(b._getMute, "Sound.getMute");
    b._setMute = function(a) {
        if (null != a && (this._masterMute = a, !this.activePlugin || !this.activePlugin.setMute || !this.activePlugin.setMute(a)))
            for (var b = this._instances, c = 0, g = b.length; g > c; c++) b[c].setMasterMute(a)
    };
    b.setMute = createjs.deprecate(b._setMute, "Sound.setMute");
    b._getCapabilities = function() {
        return null == b.activePlugin ? null : b.activePlugin._capabilities
    };
    b.getCapabilities =
        createjs.deprecate(b._getCapabilities, "Sound.getCapabilities");
    Object.defineProperties(b, {
        volume: {
            get: b._getMasterVolume,
            set: b._setMasterVolume
        },
        muted: {
            get: b._getMute,
            set: b._setMute
        },
        capabilities: {
            get: b._getCapabilities
        }
    });
    b._pluginsRegistered = !1;
    b._lastID = 0;
    b._instances = [];
    b._idHash = {};
    b._preloadHash = {};
    b._defaultPlayPropsHash = {};
    b.addEventListener = null;
    b.removeEventListener = null;
    b.removeAllEventListeners = null;
    b.dispatchEvent = null;
    b.hasEventListener = null;
    b._listeners = null;
    createjs.EventDispatcher.initialize(b);
    b.getPreloadHandlers = function() {
        return {
            callback: createjs.proxy(b.initLoad, b),
            types: ["sound"],
            extensions: b.SUPPORTED_EXTENSIONS
        }
    };
    b._handleLoadComplete = function(a) {
        var c = a.target.getItem().src;
        if (b._preloadHash[c])
            for (var e = 0, g = b._preloadHash[c].length; g > e; e++) {
                var k = b._preloadHash[c][e];
                if (b._preloadHash[c][e] = !0, b.hasEventListener("fileload")) a = new createjs.Event("fileload"), a.src = k.src, a.id = k.id, a.data = k.data, a.sprite = k.sprite, b.dispatchEvent(a)
            }
    };
    b._handleLoadError = function(a) {
        var c = a.target.getItem().src;
        if (b._preloadHash[c])
            for (var e = 0, g = b._preloadHash[c].length; g > e; e++) {
                var k = b._preloadHash[c][e];
                if (b._preloadHash[c][e] = !1, b.hasEventListener("fileerror")) a = new createjs.Event("fileerror"), a.src = k.src, a.id = k.id, a.data = k.data, a.sprite = k.sprite, b.dispatchEvent(a)
            }
    };
    b._registerPlugin = function(a) {
        return a.isSupported() ? (b.activePlugin = new a, !0) : !1
    };
    b.registerPlugins = function(a) {
        b._pluginsRegistered = !0;
        for (var c = 0, e = a.length; e > c; c++)
            if (b._registerPlugin(a[c])) return !0;
        return !1
    };
    b.initializeDefaultPlugins =
        function() {
            return null != b.activePlugin ? !0 : b._pluginsRegistered ? !1 : b.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin]) ? !0 : !1
        };
    b.isReady = function() {
        return null != b.activePlugin
    };
    b.initLoad = function(a) {
        return "video" == a.type ? !0 : b._registerSound(a)
    };
    b._registerSound = function(a) {
        if (!b.initializeDefaultPlugins()) return !1;
        var f;
        if (a.src instanceof Object ? (f = b._parseSrc(a.src), f.src = a.path + f.src) : f = b._parsePath(a.src), null == f) return !1;
        a.src = f.src;
        a.type = "sound";
        f = a.data;
        var e = null;
        if (null !=
            f && (isNaN(f.channels) ? isNaN(f) || (e = parseInt(f)) : e = parseInt(f.channels), f.audioSprite))
            for (var g, k = f.audioSprite.length; k--;) g = f.audioSprite[k], b._idHash[g.id] = {
                src: a.src,
                startTime: parseInt(g.startTime),
                duration: parseInt(g.duration)
            }, g.defaultPlayProps && (b._defaultPlayPropsHash[g.id] = createjs.PlayPropsConfig.create(g.defaultPlayProps));
        null != a.id && (b._idHash[a.id] = {
            src: a.src
        });
        g = b.activePlugin.register(a);
        return c.create(a.src, e), null != f && isNaN(f) ? a.data.channels = e || c.maxPerChannel() : a.data = e || c.maxPerChannel(),
            g.type && (a.type = g.type), a.defaultPlayProps && (b._defaultPlayPropsHash[a.src] = createjs.PlayPropsConfig.create(a.defaultPlayProps)), g
    };
    b.registerSound = function(a, c, e, g, k) {
        e = {
            src: a,
            id: c,
            data: e,
            defaultPlayProps: k
        };
        a instanceof Object && a.src && (g = c, e = a);
        e = createjs.LoadItem.create(e);
        e.path = g;
        null == g || e.src instanceof Object || (e.src = g + e.src);
        a = b._registerSound(e);
        if (!a) return !1;
        if (b._preloadHash[e.src] || (b._preloadHash[e.src] = []), b._preloadHash[e.src].push(e), 1 == b._preloadHash[e.src].length) a.on("complete",
            this._handleLoadComplete, this), a.on("error", this._handleLoadError, this), b.activePlugin.preload(a);
        else if (1 == b._preloadHash[e.src][0]) return !0;
        return e
    };
    b.registerSounds = function(a, b) {
        var c = [];
        a.path && (b ? b += a.path : b = a.path, a = a.manifest);
        for (var g = 0, k = a.length; k > g; g++) c[g] = createjs.Sound.registerSound(a[g].src, a[g].id, a[g].data, b, a[g].defaultPlayProps);
        return c
    };
    b.removeSound = function(a, f) {
        if (null == b.activePlugin) return !1;
        a instanceof Object && a.src && (a = a.src);
        var e;
        if (a instanceof Object ? e = b._parseSrc(a) :
            (a = b._getSrcById(a).src, e = b._parsePath(a)), null == e) return !1;
        a = e.src;
        null != f && (a = f + a);
        for (var g in b._idHash) b._idHash[g].src == a && delete b._idHash[g];
        return c.removeSrc(a), delete b._preloadHash[a], b.activePlugin.removeSound(a), !0
    };
    b.removeSounds = function(a, b) {
        var c = [];
        a.path && (b ? b += a.path : b = a.path, a = a.manifest);
        for (var g = 0, k = a.length; k > g; g++) c[g] = createjs.Sound.removeSound(a[g].src, b);
        return c
    };
    b.removeAllSounds = function() {
        b._idHash = {};
        b._preloadHash = {};
        c.removeAll();
        b.activePlugin && b.activePlugin.removeAllSounds()
    };
    b.loadComplete = function(a) {
        if (!b.isReady()) return !1;
        var c = b._parsePath(a);
        return a = c ? b._getSrcById(c.src).src : b._getSrcById(a).src, void 0 == b._preloadHash[a] ? !1 : 1 == b._preloadHash[a][0]
    };
    b._parsePath = function(a) {
        "string" != typeof a && (a = a.toString());
        var c = a.match(b.FILE_PATTERN);
        if (null == c) return !1;
        for (var e = c[4], g = c[5], k = b.capabilities, h = 0; !k[g];)
            if (g = b.alternateExtensions[h++], h > b.alternateExtensions.length) return null;
        a = a.replace("." + c[5], "." + g);
        return {
            name: e,
            src: a,
            extension: g
        }
    };
    b._parseSrc = function(a) {
        var c = {
                name: void 0,
                src: void 0,
                extension: void 0
            },
            e = b.capabilities,
            g;
        for (g in a)
            if (a.hasOwnProperty(g) && e[g]) {
                c.src = a[g];
                c.extension = g;
                break
            }
        if (!c.src) return !1;
        a = c.src.lastIndexOf("/");
        return c.name = -1 != a ? c.src.slice(a + 1) : c.src, c
    };
    b.play = function(a, c) {
        var e = createjs.PlayPropsConfig.create(c),
            g = b.createInstance(a, e.startTime, e.duration);
        return b._playInstance(g, e) || g._playFailed(), g
    };
    b.createInstance = function(a, f, e) {
        if (!b.initializeDefaultPlugins()) return new createjs.DefaultSoundInstance(a, f, e);
        var g = b._defaultPlayPropsHash[a];
        a = b._getSrcById(a);
        var k = b._parsePath(a.src),
            h = null;
        return null != k && null != k.src ? (c.create(k.src), null == f && (f = a.startTime), h = b.activePlugin.create(k.src, f, e || a.duration), g = g || b._defaultPlayPropsHash[k.src], g && h.applyPlayProps(g)) : h = new createjs.DefaultSoundInstance(a, f, e), h.uniqueId = b._lastID++, h
    };
    b.stop = function() {
        for (var a = this._instances, b = a.length; b--;) a[b].stop()
    };
    b.setDefaultPlayProps = function(a, c) {
        a = b._getSrcById(a);
        b._defaultPlayPropsHash[b._parsePath(a.src).src] = createjs.PlayPropsConfig.create(c)
    };
    b.getDefaultPlayProps = function(a) {
        return a = b._getSrcById(a), b._defaultPlayPropsHash[b._parsePath(a.src).src]
    };
    b._playInstance = function(a, c) {
        var e = b._defaultPlayPropsHash[a.src] || {};
        if (null == c.interrupt && (c.interrupt = e.interrupt || b.defaultInterruptBehavior), null == c.delay && (c.delay = e.delay || 0), null == c.offset && (c.offset = a.position), null == c.loop && (c.loop = a.loop), null == c.volume && (c.volume = a.volume), null == c.pan && (c.pan = a.pan), 0 == c.delay) {
            if (!b._beginPlaying(a, c)) return !1
        } else e = setTimeout(function() {
            b._beginPlaying(a,
                c)
        }, c.delay), a.delayTimeoutId = e;
        return this._instances.push(a), !0
    };
    b._beginPlaying = function(a, b) {
        if (!c.add(a, b.interrupt)) return !1;
        if (!a._beginPlaying(b)) {
            var e = createjs.indexOf(this._instances, a);
            return -1 < e && this._instances.splice(e, 1), !1
        }
        return !0
    };
    b._getSrcById = function(a) {
        return b._idHash[a] || {
            src: a
        }
    };
    b._playFinished = function(a) {
        c.remove(a);
        a = createjs.indexOf(this._instances, a); - 1 < a && this._instances.splice(a, 1)
    };
    createjs.Sound = b;
    c.channels = {};
    c.create = function(a, b) {
        return null == c.get(a) ? (c.channels[a] =
            new c(a, b), !0) : !1
    };
    c.removeSrc = function(a) {
        var b = c.get(a);
        return null == b ? !1 : (b._removeAll(), delete c.channels[a], !0)
    };
    c.removeAll = function() {
        for (var a in c.channels) c.channels[a]._removeAll();
        c.channels = {}
    };
    c.add = function(a, b) {
        var e = c.get(a.src);
        return null == e ? !1 : e._add(a, b)
    };
    c.remove = function(a) {
        var b = c.get(a.src);
        return null == b ? !1 : (b._remove(a), !0)
    };
    c.maxPerChannel = function() {
        return a.maxDefault
    };
    c.get = function(a) {
        return c.channels[a]
    };
    var a = c.prototype;
    a.constructor = c;
    a.src = null;
    a.max = null;
    a.maxDefault =
        100;
    a.length = 0;
    a.init = function(a, b) {
        this.src = a;
        this.max = b || this.maxDefault; - 1 == this.max && (this.max = this.maxDefault);
        this._instances = []
    };
    a._get = function(a) {
        return this._instances[a]
    };
    a._add = function(a, b) {
        return this._getSlot(b, a) ? (this._instances.push(a), this.length++, !0) : !1
    };
    a._remove = function(a) {
        a = createjs.indexOf(this._instances, a);
        return -1 == a ? !1 : (this._instances.splice(a, 1), this.length--, !0)
    };
    a._removeAll = function() {
        for (var a = this.length - 1; 0 <= a; a--) this._instances[a].stop()
    };
    a._getSlot = function(a) {
        var c,
            e;
        if (a != b.INTERRUPT_NONE && (e = this._get(0), null == e)) return !0;
        for (var g = 0, k = this.max; k > g; g++) {
            if (c = this._get(g), null == c) return !0;
            if (c.playState == b.PLAY_FINISHED || c.playState == b.PLAY_INTERRUPTED || c.playState == b.PLAY_FAILED) {
                e = c;
                break
            }
            a != b.INTERRUPT_NONE && (a == b.INTERRUPT_EARLY && c.position < e.position || a == b.INTERRUPT_LATE && c.position > e.position) && (e = c)
        }
        return null != e ? (e._interrupt(), this._remove(e), !0) : !1
    };
    a.toString = function() {
        return "[Sound SoundChannel]"
    }
})();
this.createjs = this.createjs || {};
(function() {
    var b = function(a, b, c, e) {
            this.EventDispatcher_constructor();
            this.src = a;
            this.uniqueId = -1;
            this.delayTimeoutId = this.playState = null;
            this._volume = 1;
            Object.defineProperty(this, "volume", {
                get: this._getVolume,
                set: this._setVolume
            });
            this.getVolume = createjs.deprecate(this._getVolume, "AbstractSoundInstance.getVolume");
            this.setVolume = createjs.deprecate(this._setVolume, "AbstractSoundInstance.setVolume");
            this._pan = 0;
            Object.defineProperty(this, "pan", {
                get: this._getPan,
                set: this._setPan
            });
            this.getPan = createjs.deprecate(this._getPan,
                "AbstractSoundInstance.getPan");
            this.setPan = createjs.deprecate(this._setPan, "AbstractSoundInstance.setPan");
            this._startTime = Math.max(0, b || 0);
            Object.defineProperty(this, "startTime", {
                get: this._getStartTime,
                set: this._setStartTime
            });
            this.getStartTime = createjs.deprecate(this._getStartTime, "AbstractSoundInstance.getStartTime");
            this.setStartTime = createjs.deprecate(this._setStartTime, "AbstractSoundInstance.setStartTime");
            this._duration = Math.max(0, c || 0);
            Object.defineProperty(this, "duration", {
                get: this._getDuration,
                set: this._setDuration
            });
            this.getDuration = createjs.deprecate(this._getDuration, "AbstractSoundInstance.getDuration");
            this.setDuration = createjs.deprecate(this._setDuration, "AbstractSoundInstance.setDuration");
            this._playbackResource = null;
            Object.defineProperty(this, "playbackResource", {
                get: this._getPlaybackResource,
                set: this._setPlaybackResource
            });
            !1 !== e && !0 !== e && this._setPlaybackResource(e);
            this.getPlaybackResource = createjs.deprecate(this._getPlaybackResource, "AbstractSoundInstance.getPlaybackResource");
            this.setPlaybackResource = createjs.deprecate(this._setPlaybackResource, "AbstractSoundInstance.setPlaybackResource");
            this._position = 0;
            Object.defineProperty(this, "position", {
                get: this._getPosition,
                set: this._setPosition
            });
            this.getPosition = createjs.deprecate(this._getPosition, "AbstractSoundInstance.getPosition");
            this.setPosition = createjs.deprecate(this._setPosition, "AbstractSoundInstance.setPosition");
            this._loop = 0;
            Object.defineProperty(this, "loop", {
                get: this._getLoop,
                set: this._setLoop
            });
            this.getLoop = createjs.deprecate(this._getLoop,
                "AbstractSoundInstance.getLoop");
            this.setLoop = createjs.deprecate(this._setLoop, "AbstractSoundInstance.setLoop");
            this._muted = !1;
            Object.defineProperty(this, "muted", {
                get: this._getMuted,
                set: this._setMuted
            });
            this.getMuted = createjs.deprecate(this._getMuted, "AbstractSoundInstance.getMuted");
            this.setMuted = createjs.deprecate(this._setMuted, "AbstractSoundInstance.setMuted");
            this._paused = !1;
            Object.defineProperty(this, "paused", {
                get: this._getPaused,
                set: this._setPaused
            });
            this.getPaused = createjs.deprecate(this._getPaused,
                "AbstractSoundInstance.getPaused");
            this.setPaused = createjs.deprecate(this._setPaused, "AbstractSoundInstance.setPaused")
        },
        c = createjs.extend(b, createjs.EventDispatcher);
    c.play = function(a) {
        a = createjs.PlayPropsConfig.create(a);
        return this.playState == createjs.Sound.PLAY_SUCCEEDED ? (this.applyPlayProps(a), void(this._paused && this._setPaused(!1))) : (this._cleanUp(), createjs.Sound._playInstance(this, a), this)
    };
    c.stop = function() {
        return this._position = 0, this._paused = !1, this._handleStop(), this._cleanUp(), this.playState =
            createjs.Sound.PLAY_FINISHED, this
    };
    c.destroy = function() {
        this._cleanUp();
        this.playbackResource = this.src = null;
        this.removeAllEventListeners()
    };
    c.applyPlayProps = function(a) {
        return null != a.offset && this._setPosition(a.offset), null != a.loop && this._setLoop(a.loop), null != a.volume && this._setVolume(a.volume), null != a.pan && this._setPan(a.pan), null != a.startTime && (this._setStartTime(a.startTime), this._setDuration(a.duration)), this
    };
    c.toString = function() {
        return "[AbstractSoundInstance]"
    };
    c._getPaused = function() {
        return this._paused
    };
    c._setPaused = function(a) {
        return !0 !== a && !1 !== a || this._paused == a || 1 == a && this.playState != createjs.Sound.PLAY_SUCCEEDED ? void 0 : (this._paused = a, a ? this._pause() : this._resume(), clearTimeout(this.delayTimeoutId), this)
    };
    c._setVolume = function(a) {
        return a == this._volume ? this : (this._volume = Math.max(0, Math.min(1, a)), this._muted || this._updateVolume(), this)
    };
    c._getVolume = function() {
        return this._volume
    };
    c._setMuted = function(a) {
        return !0 === a || !1 === a ? (this._muted = a, this._updateVolume(), this) : void 0
    };
    c._getMuted = function() {
        return this._muted
    };
    c._setPan = function(a) {
        return a == this._pan ? this : (this._pan = Math.max(-1, Math.min(1, a)), this._updatePan(), this)
    };
    c._getPan = function() {
        return this._pan
    };
    c._getPosition = function() {
        return this._paused || this.playState != createjs.Sound.PLAY_SUCCEEDED || (this._position = this._calculateCurrentPosition()), this._position
    };
    c._setPosition = function(a) {
        return this._position = Math.max(0, a), this.playState == createjs.Sound.PLAY_SUCCEEDED && this._updatePosition(), this
    };
    c._getStartTime = function() {
        return this._startTime
    };
    c._setStartTime =
        function(a) {
            return a == this._startTime ? this : (this._startTime = Math.max(0, a || 0), this._updateStartTime(), this)
        };
    c._getDuration = function() {
        return this._duration
    };
    c._setDuration = function(a) {
        return a == this._duration ? this : (this._duration = Math.max(0, a || 0), this._updateDuration(), this)
    };
    c._setPlaybackResource = function(a) {
        return this._playbackResource = a, 0 == this._duration && this._playbackResource && this._setDurationFromSource(), this
    };
    c._getPlaybackResource = function() {
        return this._playbackResource
    };
    c._getLoop = function() {
        return this._loop
    };
    c._setLoop = function(a) {
        null != this._playbackResource && (0 != this._loop && 0 == a ? this._removeLooping(a) : 0 == this._loop && 0 != a && this._addLooping(a));
        this._loop = a
    };
    c._sendEvent = function(a) {
        a = new createjs.Event(a);
        this.dispatchEvent(a)
    };
    c._cleanUp = function() {
        clearTimeout(this.delayTimeoutId);
        this._handleCleanUp();
        this._paused = !1;
        createjs.Sound._playFinished(this)
    };
    c._interrupt = function() {
        this._cleanUp();
        this.playState = createjs.Sound.PLAY_INTERRUPTED;
        this._sendEvent("interrupted")
    };
    c._beginPlaying = function(a) {
        return this._setPosition(a.offset),
            this._setLoop(a.loop), this._setVolume(a.volume), this._setPan(a.pan), null != a.startTime && (this._setStartTime(a.startTime), this._setDuration(a.duration)), null != this._playbackResource && this._position < this._duration ? (this._paused = !1, this._handleSoundReady(), this.playState = createjs.Sound.PLAY_SUCCEEDED, this._sendEvent("succeeded"), !0) : (this._playFailed(), !1)
    };
    c._playFailed = function() {
        this._cleanUp();
        this.playState = createjs.Sound.PLAY_FAILED;
        this._sendEvent("failed")
    };
    c._handleSoundComplete = function() {
        return this._position =
            0, 0 != this._loop ? (this._loop--, this._handleLoop(), void this._sendEvent("loop")) : (this._cleanUp(), this.playState = createjs.Sound.PLAY_FINISHED, void this._sendEvent("complete"))
    };
    c._handleSoundReady = function() {};
    c._updateVolume = function() {};
    c._updatePan = function() {};
    c._updateStartTime = function() {};
    c._updateDuration = function() {};
    c._setDurationFromSource = function() {};
    c._calculateCurrentPosition = function() {};
    c._updatePosition = function() {};
    c._removeLooping = function() {};
    c._addLooping = function() {};
    c._pause =
        function() {};
    c._resume = function() {};
    c._handleStop = function() {};
    c._handleCleanUp = function() {};
    c._handleLoop = function() {};
    createjs.AbstractSoundInstance = createjs.promote(b, "EventDispatcher");
    createjs.DefaultSoundInstance = createjs.AbstractSoundInstance
})();
this.createjs = this.createjs || {};
(function() {
    var b = function() {
            this._capabilities = null;
            this._loaders = {};
            this._audioSources = {};
            this._soundInstances = {};
            this._volume = 1;
            this._loaderClass;
            this._soundInstanceClass
        },
        c = b.prototype;
    b._capabilities = null;
    b.isSupported = function() {
        return !0
    };
    c.register = function(a) {
        var b = this._loaders[a.src];
        return b && !b.canceled ? this._loaders[a.src] : (this._audioSources[a.src] = !0, this._soundInstances[a.src] = [], b = new this._loaderClass(a), b.on("complete", this._handlePreloadComplete, this), this._loaders[a.src] = b, b)
    };
    c.preload = function(a) {
        a.on("error", this._handlePreloadError, this);
        a.load()
    };
    c.isPreloadStarted = function(a) {
        return null != this._audioSources[a]
    };
    c.isPreloadComplete = function(a) {
        return !(null == this._audioSources[a] || 1 == this._audioSources[a])
    };
    c.removeSound = function(a) {
        if (this._soundInstances[a]) {
            for (var b = this._soundInstances[a].length; b--;) this._soundInstances[a][b].destroy();
            delete this._soundInstances[a];
            delete this._audioSources[a];
            this._loaders[a] && this._loaders[a].destroy();
            delete this._loaders[a]
        }
    };
    c.removeAllSounds = function() {
        for (var a in this._audioSources) this.removeSound(a)
    };
    c.create = function(a, b, c) {
        this.isPreloadStarted(a) || this.preload(this.register(a));
        b = new this._soundInstanceClass(a, b, c, this._audioSources[a]);
        return this._soundInstances[a] && this._soundInstances[a].push(b), b.setMasterVolume && b.setMasterVolume(createjs.Sound.volume), b.setMasterMute && b.setMasterMute(createjs.Sound.muted), b
    };
    c.setVolume = function(a) {
        return this._volume = a, this._updateVolume(), !0
    };
    c.getVolume = function() {
        return this._volume
    };
    c.setMute = function() {
        return this._updateVolume(), !0
    };
    c.toString = function() {
        return "[AbstractPlugin]"
    };
    c._handlePreloadComplete = function(a) {
        var b = a.target.getItem().src;
        this._audioSources[b] = a.result;
        a = 0;
        for (var c = this._soundInstances[b].length; c > a; a++) this._soundInstances[b][a].playbackResource = this._audioSources[b], this._soundInstances[b] = null
    };
    c._handlePreloadError = function() {};
    c._updateVolume = function() {};
    createjs.AbstractPlugin = b
})();
this.createjs = this.createjs || {};
(function() {
    function b(a) {
        this.AbstractLoader_constructor(a, !0, createjs.Types.SOUND)
    }
    var c = createjs.extend(b, createjs.AbstractLoader);
    b.context = null;
    c.toString = function() {
        return "[WebAudioLoader]"
    };
    c._createRequest = function() {
        this._request = new createjs.XHRRequest(this._item, !1);
        this._request.setResponseType("arraybuffer")
    };
    c._sendComplete = function() {
        b.context.decodeAudioData(this._rawResult, createjs.proxy(this._handleAudioDecoded, this), createjs.proxy(this._sendError, this))
    };
    c._handleAudioDecoded = function(a) {
        this._result =
            a;
        this.AbstractLoader__sendComplete()
    };
    createjs.WebAudioLoader = createjs.promote(b, "AbstractLoader")
})();
this.createjs = this.createjs || {};
(function() {
    function b(b, c, e, g) {
        this.AbstractSoundInstance_constructor(b, c, e, g);
        this.gainNode = a.context.createGain();
        this.panNode = a.context.createPanner();
        this.panNode.panningModel = a._panningModel;
        this.panNode.connect(this.gainNode);
        this._updatePan();
        this._sourceNodeNext = this._soundCompleteTimeout = this.sourceNode = null;
        this._playbackStartTime = 0;
        this._endedHandler = createjs.proxy(this._handleSoundComplete, this)
    }
    var c = createjs.extend(b, createjs.AbstractSoundInstance),
        a = b;
    a.context = null;
    a._scratchBuffer =
        null;
    a.destinationNode = null;
    a._panningModel = "equalpower";
    c.destroy = function() {
        this.AbstractSoundInstance_destroy();
        this.panNode.disconnect(0);
        this.panNode = null;
        this.gainNode.disconnect(0);
        this.gainNode = null
    };
    c.toString = function() {
        return "[WebAudioSoundInstance]"
    };
    c._updatePan = function() {
        this.panNode.setPosition(this._pan, 0, -.5)
    };
    c._removeLooping = function() {
        this._sourceNodeNext = this._cleanUpAudioNode(this._sourceNodeNext)
    };
    c._addLooping = function() {
        this.playState == createjs.Sound.PLAY_SUCCEEDED && (this._sourceNodeNext =
            this._createAndPlayAudioNode(this._playbackStartTime, 0))
    };
    c._setDurationFromSource = function() {
        this._duration = 1E3 * this.playbackResource.duration
    };
    c._handleCleanUp = function() {
        this.sourceNode && this.playState == createjs.Sound.PLAY_SUCCEEDED && (this.sourceNode = this._cleanUpAudioNode(this.sourceNode), this._sourceNodeNext = this._cleanUpAudioNode(this._sourceNodeNext));
        0 != this.gainNode.numberOfOutputs && this.gainNode.disconnect(0);
        clearTimeout(this._soundCompleteTimeout);
        this._playbackStartTime = 0
    };
    c._cleanUpAudioNode =
        function(b) {
            if (b) {
                if (b.stop(0), b.disconnect(0), createjs.BrowserDetect.isIOS) try {
                    b.buffer = a._scratchBuffer
                } catch (c) {}
                b = null
            }
            return b
        };
    c._handleSoundReady = function() {
        this.gainNode.connect(a.destinationNode);
        var b = .001 * this._duration,
            c = Math.min(.001 * Math.max(0, this._position), b);
        this.sourceNode = this._createAndPlayAudioNode(a.context.currentTime - b, c);
        this._playbackStartTime = this.sourceNode.startTime - c;
        this._soundCompleteTimeout = setTimeout(this._endedHandler, 1E3 * (b - c));
        0 != this._loop && (this._sourceNodeNext =
            this._createAndPlayAudioNode(this._playbackStartTime, 0))
    };
    c._createAndPlayAudioNode = function(b, c) {
        var e = a.context.createBufferSource();
        e.buffer = this.playbackResource;
        e.connect(this.panNode);
        var g = .001 * this._duration;
        return e.startTime = b + g, e.start(e.startTime, c + .001 * this._startTime, g - c), e
    };
    c._pause = function() {
        this._position = 1E3 * (a.context.currentTime - this._playbackStartTime);
        this.sourceNode = this._cleanUpAudioNode(this.sourceNode);
        this._sourceNodeNext = this._cleanUpAudioNode(this._sourceNodeNext);
        0 !=
            this.gainNode.numberOfOutputs && this.gainNode.disconnect(0);
        clearTimeout(this._soundCompleteTimeout)
    };
    c._resume = function() {
        this._handleSoundReady()
    };
    c._updateVolume = function() {
        var a = this._muted ? 0 : this._volume;
        a != this.gainNode.gain.value && (this.gainNode.gain.value = a)
    };
    c._calculateCurrentPosition = function() {
        return 1E3 * (a.context.currentTime - this._playbackStartTime)
    };
    c._updatePosition = function() {
        this.sourceNode = this._cleanUpAudioNode(this.sourceNode);
        this._sourceNodeNext = this._cleanUpAudioNode(this._sourceNodeNext);
        clearTimeout(this._soundCompleteTimeout);
        this._paused || this._handleSoundReady()
    };
    c._handleLoop = function() {
        this._cleanUpAudioNode(this.sourceNode);
        this.sourceNode = this._sourceNodeNext;
        this._playbackStartTime = this.sourceNode.startTime;
        this._sourceNodeNext = this._createAndPlayAudioNode(this._playbackStartTime, 0);
        this._soundCompleteTimeout = setTimeout(this._endedHandler, this._duration)
    };
    c._updateDuration = function() {
        this.playState == createjs.Sound.PLAY_SUCCEEDED && (this._pause(), this._resume())
    };
    createjs.WebAudioSoundInstance =
        createjs.promote(b, "AbstractSoundInstance")
})();
this.createjs = this.createjs || {};
(function() {
    function b() {
        this.AbstractPlugin_constructor();
        this._panningModel = a._panningModel;
        this.context = a.context;
        this.dynamicsCompressorNode = this.context.createDynamicsCompressor();
        this.dynamicsCompressorNode.connect(this.context.destination);
        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.dynamicsCompressorNode);
        createjs.WebAudioSoundInstance.destinationNode = this.gainNode;
        this._capabilities = a._capabilities;
        this._loaderClass = createjs.WebAudioLoader;
        this._soundInstanceClass =
            createjs.WebAudioSoundInstance;
        this._addPropsToClasses()
    }
    var c = createjs.extend(b, createjs.AbstractPlugin),
        a = b;
    a._capabilities = null;
    a._panningModel = "equalpower";
    a.context = null;
    a._scratchBuffer = null;
    a._unlocked = !1;
    a.DEFAULT_SAMPLE_RATE = 44100;
    a.isSupported = function() {
        var b = createjs.BrowserDetect.isIOS || createjs.BrowserDetect.isAndroid || createjs.BrowserDetect.isBlackberry;
        return "file:" != location.protocol || b || this._isFileXHRSupported() ? (a._generateCapabilities(), null == a.context ? !1 : !0) : !1
    };
    a.playEmptySound =
        function() {
            if (null != a.context) {
                var b = a.context.createBufferSource();
                b.buffer = a._scratchBuffer;
                b.connect(a.context.destination);
                b.start(0, 0, 0)
            }
        };
    a._isFileXHRSupported = function() {
        var a = !0,
            b = new XMLHttpRequest;
        try {
            b.open("GET", "WebAudioPluginTest.fail", !1)
        } catch (c) {
            return a = !1
        }
        b.onerror = function() {
            a = !1
        };
        b.onload = function() {
            a = 404 == this.status || 200 == this.status || 0 == this.status && "" != this.response
        };
        try {
            b.send()
        } catch (c) {
            a = !1
        }
        return a
    };
    a._generateCapabilities = function() {
        if (null == a._capabilities) {
            var b = document.createElement("audio");
            if (null == b.canPlayType || null == a.context && (a.context = a._createAudioContext(), null == a.context)) return null;
            null == a._scratchBuffer && (a._scratchBuffer = a.context.createBuffer(1, 1, 22050));
            a._compatibilitySetUp();
            "ontouchstart" in window && "running" != a.context.state && (a._unlock(), document.addEventListener("mousedown", a._unlock, !0), document.addEventListener("touchstart", a._unlock, !0), document.addEventListener("touchend", a._unlock, !0));
            a._capabilities = {
                panning: !0,
                volume: !0,
                tracks: -1
            };
            for (var c = createjs.Sound.SUPPORTED_EXTENSIONS,
                    e = createjs.Sound.EXTENSION_MAP, g = 0, k = c.length; k > g; g++) {
                var h = c[g],
                    l = e[h] || h;
                a._capabilities[h] = "no" != b.canPlayType("audio/" + h) && "" != b.canPlayType("audio/" + h) || "no" != b.canPlayType("audio/" + l) && "" != b.canPlayType("audio/" + l)
            }
            2 > a.context.destination.numberOfChannels && (a._capabilities.panning = !1)
        }
    };
    a._createAudioContext = function() {
        var b = window.AudioContext || window.webkitAudioContext;
        if (null == b) return null;
        var c = new b;
        if (/(iPhone|iPad)/i.test(navigator.userAgent) && c.sampleRate !== a.DEFAULT_SAMPLE_RATE) {
            var e =
                c.createBuffer(1, 1, a.DEFAULT_SAMPLE_RATE),
                g = c.createBufferSource();
            g.buffer = e;
            g.connect(c.destination);
            g.start(0);
            g.disconnect();
            c.close();
            c = new b
        }
        return c
    };
    a._compatibilitySetUp = function() {
        if (a._panningModel = "equalpower", !a.context.createGain) {
            a.context.createGain = a.context.createGainNode;
            var b = a.context.createBufferSource();
            b.__proto__.start = b.__proto__.noteGrainOn;
            b.__proto__.stop = b.__proto__.noteOff;
            a._panningModel = 0
        }
    };
    a._unlock = function() {
        a._unlocked || (a.playEmptySound(), "running" == a.context.state &&
            (document.removeEventListener("mousedown", a._unlock, !0), document.removeEventListener("touchend", a._unlock, !0), document.removeEventListener("touchstart", a._unlock, !0), a._unlocked = !0))
    };
    c.toString = function() {
        return "[WebAudioPlugin]"
    };
    c._addPropsToClasses = function() {
        var b = this._soundInstanceClass;
        b.context = this.context;
        b._scratchBuffer = a._scratchBuffer;
        b.destinationNode = this.gainNode;
        b._panningModel = this._panningModel;
        this._loaderClass.context = this.context
    };
    c._updateVolume = function() {
        var a = createjs.Sound._masterMute ?
            0 : this._volume;
        a != this.gainNode.gain.value && (this.gainNode.gain.value = a)
    };
    createjs.WebAudioPlugin = createjs.promote(b, "AbstractPlugin")
})();
this.createjs = this.createjs || {};
(function() {
    function b() {
        throw "HTMLAudioTagPool cannot be instantiated";
    }

    function c() {
        this._tags = []
    }
    b._tags = {};
    b._tagPool = new c;
    b._tagUsed = {};
    b.get = function(a) {
        var c = b._tags[a];
        return null == c ? (c = b._tags[a] = b._tagPool.get(), c.src = a) : b._tagUsed[a] ? (c = b._tagPool.get(), c.src = a) : b._tagUsed[a] = !0, c
    };
    b.set = function(a, c) {
        c == b._tags[a] ? b._tagUsed[a] = !1 : b._tagPool.set(c)
    };
    b.remove = function(a) {
        var c = b._tags[a];
        return null == c ? !1 : (b._tagPool.set(c), delete b._tags[a], delete b._tagUsed[a], !0)
    };
    b.getDuration = function(a) {
        a =
            b._tags[a];
        return null != a && a.duration ? 1E3 * a.duration : 0
    };
    createjs.HTMLAudioTagPool = b;
    var a = c.prototype;
    a.constructor = c;
    a.get = function() {
        var a;
        return a = 0 == this._tags.length ? this._createTag() : this._tags.pop(), null == a.parentNode && document.body.appendChild(a), a
    };
    a.set = function(a) {
        -1 == createjs.indexOf(this._tags, a) && (this._tags.src = null, this._tags.push(a))
    };
    a.toString = function() {
        return "[TagPool]"
    };
    a._createTag = function() {
        var a = document.createElement("audio");
        return a.autoplay = !1, a.preload = "none", a
    }
})();
this.createjs = this.createjs || {};
(function() {
    function b(a, b, c, e) {
        this.AbstractSoundInstance_constructor(a, b, c, e);
        this._delayTimeoutId = this._audioSpriteStopTime = null;
        this._endedHandler = createjs.proxy(this._handleSoundComplete, this);
        this._readyHandler = createjs.proxy(this._handleTagReady, this);
        this._stalledHandler = createjs.proxy(this._playFailed, this);
        this._audioSpriteEndHandler = createjs.proxy(this._handleAudioSpriteLoop, this);
        this._loopHandler = createjs.proxy(this._handleSoundComplete, this);
        c ? this._audioSpriteStopTime = .001 * (b + c) : this._duration =
            createjs.HTMLAudioTagPool.getDuration(this.src)
    }
    var c = createjs.extend(b, createjs.AbstractSoundInstance);
    c.setMasterVolume = function() {
        this._updateVolume()
    };
    c.setMasterMute = function() {
        this._updateVolume()
    };
    c.toString = function() {
        return "[HTMLAudioSoundInstance]"
    };
    c._removeLooping = function() {
        null != this._playbackResource && (this._playbackResource.loop = !1, this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, !1))
    };
    c._addLooping = function() {
        null == this._playbackResource ||
            this._audioSpriteStopTime || (this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, !1), this._playbackResource.loop = !0)
    };
    c._handleCleanUp = function() {
        var a = this._playbackResource;
        if (null != a) {
            a.pause();
            a.loop = !1;
            a.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_ENDED, this._endedHandler, !1);
            a.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_READY, this._readyHandler, !1);
            a.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_STALLED, this._stalledHandler, !1);
            a.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, !1);
            a.removeEventListener(createjs.HTMLAudioPlugin._TIME_UPDATE, this._audioSpriteEndHandler, !1);
            try {
                a.currentTime = this._startTime
            } catch (b) {}
            createjs.HTMLAudioTagPool.set(this.src, a);
            this._playbackResource = null
        }
    };
    c._beginPlaying = function(a) {
        return this._playbackResource = createjs.HTMLAudioTagPool.get(this.src), this.AbstractSoundInstance__beginPlaying(a)
    };
    c._handleSoundReady = function() {
        if (4 !== this._playbackResource.readyState) {
            var a =
                this._playbackResource;
            return a.addEventListener(createjs.HTMLAudioPlugin._AUDIO_READY, this._readyHandler, !1), a.addEventListener(createjs.HTMLAudioPlugin._AUDIO_STALLED, this._stalledHandler, !1), a.preload = "auto", void a.load()
        }
        this._updateVolume();
        this._playbackResource.currentTime = .001 * (this._startTime + this._position);
        this._audioSpriteStopTime ? this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._TIME_UPDATE, this._audioSpriteEndHandler, !1) : (this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._AUDIO_ENDED,
            this._endedHandler, !1), 0 != this._loop && (this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, !1), this._playbackResource.loop = !0));
        this._playbackResource.play()
    };
    c._handleTagReady = function() {
        this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_READY, this._readyHandler, !1);
        this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_STALLED, this._stalledHandler, !1);
        this._handleSoundReady()
    };
    c._pause = function() {
        this._playbackResource.pause()
    };
    c._resume = function() {
        this._playbackResource.play()
    };
    c._updateVolume = function() {
        if (null != this._playbackResource) {
            var a = this._muted || createjs.Sound._masterMute ? 0 : this._volume * createjs.Sound._masterVolume;
            a != this._playbackResource.volume && (this._playbackResource.volume = a)
        }
    };
    c._calculateCurrentPosition = function() {
        return 1E3 * this._playbackResource.currentTime - this._startTime
    };
    c._updatePosition = function() {
        this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, !1);
        this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._handleSetPositionSeek, !1);
        try {
            this._playbackResource.currentTime = .001 * (this._position + this._startTime)
        } catch (a) {
            this._handleSetPositionSeek(null)
        }
    };
    c._handleSetPositionSeek = function() {
        null != this._playbackResource && (this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._handleSetPositionSeek, !1), this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, !1))
    };
    c._handleAudioSpriteLoop = function() {
        this._playbackResource.currentTime <= this._audioSpriteStopTime || (this._playbackResource.pause(), 0 == this._loop ? this._handleSoundComplete(null) : (this._position = 0, this._loop--, this._playbackResource.currentTime = .001 * this._startTime, this._paused || this._playbackResource.play(), this._sendEvent("loop")))
    };
    c._handleLoop = function() {
        0 == this._loop && (this._playbackResource.loop = !1, this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, !1))
    };
    c._updateStartTime = function() {
        this._audioSpriteStopTime = .001 * (this._startTime + this._duration);
        this.playState == createjs.Sound.PLAY_SUCCEEDED && (this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_ENDED, this._endedHandler, !1), this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._TIME_UPDATE, this._audioSpriteEndHandler, !1))
    };
    c._updateDuration = function() {
        this._audioSpriteStopTime = .001 * (this._startTime + this._duration);
        this.playState == createjs.Sound.PLAY_SUCCEEDED &&
            (this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_ENDED, this._endedHandler, !1), this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._TIME_UPDATE, this._audioSpriteEndHandler, !1))
    };
    c._setDurationFromSource = function() {
        this._duration = createjs.HTMLAudioTagPool.getDuration(this.src);
        this._playbackResource = null
    };
    createjs.HTMLAudioSoundInstance = createjs.promote(b, "AbstractSoundInstance")
})();
this.createjs = this.createjs || {};
(function() {
    function b() {
        this.AbstractPlugin_constructor();
        this._capabilities = a._capabilities;
        this._loaderClass = createjs.SoundLoader;
        this._soundInstanceClass = createjs.HTMLAudioSoundInstance
    }
    var c = createjs.extend(b, createjs.AbstractPlugin),
        a = b;
    a.MAX_INSTANCES = 30;
    a._AUDIO_READY = "canplaythrough";
    a._AUDIO_ENDED = "ended";
    a._AUDIO_SEEKED = "seeked";
    a._AUDIO_STALLED = "stalled";
    a._TIME_UPDATE = "timeupdate";
    a._capabilities = null;
    a.isSupported = function() {
        return a._generateCapabilities(), null != a._capabilities
    };
    a._generateCapabilities =
        function() {
            if (null == a._capabilities) {
                var b = document.createElement("audio");
                if (null == b.canPlayType) return null;
                a._capabilities = {
                    panning: !1,
                    volume: !0,
                    tracks: -1
                };
                for (var c = createjs.Sound.SUPPORTED_EXTENSIONS, e = createjs.Sound.EXTENSION_MAP, g = 0, k = c.length; k > g; g++) {
                    var h = c[g],
                        l = e[h] || h;
                    a._capabilities[h] = "no" != b.canPlayType("audio/" + h) && "" != b.canPlayType("audio/" + h) || "no" != b.canPlayType("audio/" + l) && "" != b.canPlayType("audio/" + l)
                }
            }
        };
    c.register = function(a) {
        var b = createjs.HTMLAudioTagPool.get(a.src);
        a = this.AbstractPlugin_register(a);
        return a.setTag(b), a
    };
    c.removeSound = function(a) {
        this.AbstractPlugin_removeSound(a);
        createjs.HTMLAudioTagPool.remove(a)
    };
    c.create = function(a, b, c) {
        a = this.AbstractPlugin_create(a, b, c);
        return a.playbackResource = null, a
    };
    c.toString = function() {
        return "[HTMLAudioPlugin]"
    };
    c.setVolume = c.getVolume = c.setMute = null;
    createjs.HTMLAudioPlugin = createjs.promote(b, "AbstractPlugin")
})();
_gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
! function(b) {
    var c = b.GreenSockGlobals || b,
        a = function(a) {
            var b = a.split("."),
                d = c;
            for (a = 0; a < b.length; a++) d[b[a]] = d = d[b[a]] || {};
            return d
        }("com.greensock.utils"),
        d = function(a) {
            var b = a.nodeType,
                c = "";
            if (1 === b || 9 === b || 11 === b) {
                if ("string" == typeof a.textContent) return a.textContent;
                for (a = a.firstChild; a; a = a.nextSibling) c += d(a)
            } else if (3 === b || 4 === b) return a.nodeValue;
            return c
        },
        f = document,
        e = f.defaultView ? f.defaultView.getComputedStyle : function() {},
        g = /([A-Z])/g,
        k = function(a, b, c, d) {
            var f;
            return (c = c || e(a, null)) ? (a =
                c.getPropertyValue(b.replace(g, "-$1").toLowerCase()), f = a || c.length ? a : c[b]) : a.currentStyle && (c = a.currentStyle, f = c[b]), d ? f : parseInt(f, 10) || 0
        },
        h = function(a) {
            return a.length && a[0] && (a[0].nodeType && a[0].style && !a.nodeType || a[0].length && a[0][0]) ? !0 : !1
        },
        l = function(a, b) {
            for (var c, d = b.length; - 1 < --d;)
                if (c = b[d], a.substr(0, c.length) === c) return c.length
        },
        n = /(?:\r|\n|\t\t)/g,
        u = /(?:\s\s+)/g,
        J = function(a) {
            return (a.charCodeAt(0) - 55296 << 10) + (a.charCodeAt(1) - 56320) + 65536
        },
        z = " style='position:relative;display:inline-block;" +
        (f.all && !f.addEventListener ? "*display:inline;*zoom:1;'" : "'"),
        V = function(a, b) {
            a = a || "";
            var c = -1 !== a.indexOf("++"),
                d = 1;
            return c && (a = a.split("++").join("")),
                function() {
                    return "<" + b + z + (a ? " class='" + a + (c ? d++ : "") + "'>" : ">")
                }
        },
        m = a.SplitText = c.SplitText = function(a, b) {
            if ("string" == typeof a && (a = m.selector(a)), !a) throw "cannot split a null element.";
            var c;
            if (h(a)) {
                c = a;
                var d, e, f, p = [],
                    g = c.length;
                for (d = 0; g > d; d++)
                    if (e = c[d], h(e))
                        for (f = 0; f < e.length; f++) p.push(e[f]);
                    else p.push(e);
                c = p
            } else c = [a];
            this.elements = c;
            this.chars = [];
            this.words = [];
            this.lines = [];
            this._originals = [];
            this.vars = b || {};
            this.split(b)
        },
        p = function(a, b, c) {
            var d = a.nodeType;
            if (1 === d || 9 === d || 11 === d)
                for (a = a.firstChild; a; a = a.nextSibling) p(a, b, c);
            else 3 !== d && 4 !== d || (a.nodeValue = a.nodeValue.split(b).join(c))
        },
        q = function(a, b) {
            for (var c = b.length; - 1 < --c;) a.push(b[c])
        },
        t = function(a) {
            var b, c = [],
                d = a.length;
            for (b = 0; b !== d; c.push(a[b++]));
            return c
        },
        X = function(a, b, c) {
            for (var d; a && a !== b;) {
                if (d = a._next || a.nextSibling) return d.textContent.charAt(0) === c;
                a = a.parentNode || a._parent
            }
            return !1
        },
        T = function(a) {
            var b, c, d = t(a.childNodes),
                e = d.length;
            for (b = 0; e > b; b++) c = d[b], c._isSplit ? T(c) : (b && 3 === c.previousSibling.nodeType ? c.previousSibling.nodeValue += 3 === c.nodeType ? c.nodeValue : c.firstChild.nodeValue : 3 !== c.nodeType && a.insertBefore(c.firstChild, c), a.removeChild(c))
        },
        K = function(a, b, c, e) {
            var m, g, q = t(a.childNodes),
                V = q.length,
                h = "absolute" === b.position || !0 === b.absolute;
            if (3 !== a.nodeType || 1 < V) {
                b.absolute = !1;
                for (m = 0; V > m; m++) g = q[m], (3 !== g.nodeType || /\S+/.test(g.nodeValue)) && (h && 3 !== g.nodeType && "inline" ===
                    k(g, "display", null, !0) && (g.style.display = "inline-block", g.style.position = "relative"), g._isSplit = !0, K(g, b, c, e));
                return b.absolute = h, void(a._isSplit = !0)
            }
            var X, T, z, ia, G, y, la, ma, q = b.span ? "span" : "div",
                V = -1 !== (b.type || b.split || "chars,words,lines").indexOf("chars"),
                Y = "absolute" === b.position || !0 === b.absolute,
                h = b.wordDelimiter || " ",
                Y = " " !== h ? "" : Y ? "&#173; " : " ",
                ca = b.span ? "</span>" : "</div>",
                ja = !0,
                qa = b.specialChars ? "function" == typeof b.specialChars ? b.specialChars : l : null;
            X = f.createElement("div");
            var pa = a.parentNode;
            pa.insertBefore(X, a);
            X.textContent = a.nodeValue;
            pa.removeChild(a);
            a = X;
            X = d(a);
            y = -1 !== X.indexOf("<");
            !1 !== b.reduceWhiteSpace && (X = X.replace(u, " ").replace(n, ""));
            y && (X = X.split("<").join("{{LT}}"));
            ia = X.length;
            T = (" " === X.charAt(0) ? Y : "") + c();
            for (z = 0; ia > z; z++)
                if (G = X.charAt(z), qa && (ma = qa(X.substr(z), b.specialChars))) G = X.substr(z, ma || 1), T += V && " " !== G ? e() + G + "</" + q + ">" : G, z += ma - 1;
                else if (G === h && X.charAt(z - 1) !== h && z) {
                T += ja ? ca : "";
                for (ja = !1; X.charAt(z + 1) === h;) T += Y, z++;
                z === ia - 1 ? T += Y : ")" !== X.charAt(z + 1) && (T += Y + c(),
                    ja = !0)
            } else "{" === G && "{{LT}}" === X.substr(z, 6) ? (T += V ? e() + "{{LT}}</" + q + ">" : "{{LT}}", z += 5) : 55296 <= G.charCodeAt(0) && 56319 >= G.charCodeAt(0) || 65024 <= X.charCodeAt(z + 1) && 65039 >= X.charCodeAt(z + 1) ? (g = J(X.substr(z, 2)), la = J(X.substr(z + 2, 2)), m = 127462 <= g && 127487 >= g && 127462 <= la && 127487 >= la || 127995 <= la && 127999 >= la ? 4 : 2, T += V && " " !== G ? e() + X.substr(z, m) + "</" + q + ">" : X.substr(z, m), z += m - 1) : T += V && " " !== G ? e() + G + "</" + q + ">" : G;
            a.outerHTML = T + (ja ? ca : "");
            y && p(pa, "{{LT}}", "<")
        },
        a = m.prototype;
    a.split = function(a) {
        this.isSplit && this.revert();
        this.vars = a = a || this.vars;
        this._originals.length = this.chars.length = this.words.length = this.lines.length = 0;
        for (var b, c, d, m = this.elements.length, g = a.span ? "span" : "div", t = V(a.wordsClass, g), g = V(a.charsClass, g); - 1 < --m;) {
            d = this.elements[m];
            this._originals[m] = d.innerHTML;
            b = d.clientHeight;
            c = d.clientWidth;
            K(d, a, t, g);
            var l = a,
                h = this.chars,
                J = this.words,
                u = this.lines,
                n = void 0,
                z = void 0,
                G = void 0,
                y = void 0,
                la = void 0,
                ma = void 0,
                Y = void 0,
                ca = void 0,
                ja = void 0,
                qa = void 0,
                pa = void 0,
                ka = e(d),
                aa = k(d, "paddingLeft", ka),
                Y = -999,
                D = k(d,
                    "borderBottomWidth", ka) + k(d, "borderTopWidth", ka),
                va = k(d, "borderLeftWidth", ka) + k(d, "borderRightWidth", ka),
                Ca = k(d, "paddingTop", ka) + k(d, "paddingBottom", ka),
                Fa = k(d, "paddingLeft", ka) + k(d, "paddingRight", ka),
                xa = .2 * k(d, "fontSize"),
                ka = k(d, "textAlign", ka, !0),
                oa = [],
                ba = [],
                r = [],
                v = l.wordDelimiter || " ",
                w = l.span ? "span" : "div",
                n = l.type || l.split || "chars,words,lines",
                A = u && -1 !== n.indexOf("lines") ? [] : null,
                L = -1 !== n.indexOf("words"),
                S = -1 !== n.indexOf("chars"),
                M = "absolute" === l.position || !0 === l.absolute,
                P = l.linesClass,
                N = -1 !==
                (P || "").indexOf("++"),
                Ga = [];
            N && (P = P.split("++").join(""));
            z = d.getElementsByTagName("*");
            G = z.length;
            la = [];
            for (n = 0; G > n; n++) la[n] = z[n];
            if (A || M)
                for (n = 0; G > n; n++) y = la[n], ((z = y.parentNode === d) || M || S && !L) && (pa = y.offsetTop, A && z && Math.abs(pa - Y) > xa && ("BR" !== y.nodeName || 0 === n) && (ma = [], A.push(ma), Y = pa), M && (y._x = y.offsetLeft, y._y = pa, y._w = y.offsetWidth, y._h = y.offsetHeight), A && ((y._isSplit && z || !S && z || L && z || !L && y.parentNode.parentNode === d && !y.parentNode._isSplit) && (ma.push(y), y._x -= aa, X(y, d, v) && (y._wordEnd = !0)), "BR" ===
                    y.nodeName && (y.nextSibling && "BR" === y.nextSibling.nodeName || 0 === n) && A.push([])));
            for (n = 0; G > n; n++) y = la[n], z = y.parentNode === d, "BR" !== y.nodeName ? (M && (ca = y.style, L || z || (y._x += y.parentNode._x, y._y += y.parentNode._y), ca.left = y._x + "px", ca.top = y._y + "px", ca.position = "absolute", ca.display = "block", ca.width = y._w + 1 + "px", ca.height = y._h + "px"), !L && S ? y._isSplit ? (y._next = y.nextSibling, y.parentNode.appendChild(y)) : y.parentNode._isSplit ? (y._parent = y.parentNode, !y.previousSibling && y.firstChild && (y.firstChild._isFirst = !0),
                y.nextSibling && " " === y.nextSibling.textContent && !y.nextSibling.nextSibling && Ga.push(y.nextSibling), y._next = y.nextSibling && y.nextSibling._isFirst ? null : y.nextSibling, y.parentNode.removeChild(y), la.splice(n--, 1), G--) : z || (pa = !y.nextSibling && X(y.parentNode, d, v), y.parentNode._parent && y.parentNode._parent.appendChild(y), pa && y.parentNode.appendChild(f.createTextNode(" ")), l.span && (y.style.display = "inline"), oa.push(y)) : y.parentNode._isSplit && !y._isSplit && "" !== y.innerHTML ? ba.push(y) : S && !y._isSplit && (l.span &&
                (y.style.display = "inline"), oa.push(y))) : A || M ? (y.parentNode && y.parentNode.removeChild(y), la.splice(n--, 1), G--) : L || d.appendChild(y);
            for (n = Ga.length; - 1 < --n;) Ga[n].parentNode.removeChild(Ga[n]);
            if (A) {
                M && (ja = f.createElement(w), d.appendChild(ja), qa = ja.offsetWidth + "px", pa = ja.offsetParent === d ? 0 : d.offsetLeft, d.removeChild(ja));
                ca = d.style.cssText;
                for (d.style.cssText = "display:none;"; d.firstChild;) d.removeChild(d.firstChild);
                Y = " " === v && (!M || !L && !S);
                for (n = 0; n < A.length; n++) {
                    ma = A[n];
                    ja = f.createElement(w);
                    ja.style.cssText =
                        "display:block;text-align:" + ka + ";position:" + (M ? "absolute;" : "relative;");
                    P && (ja.className = P + (N ? n + 1 : ""));
                    r.push(ja);
                    G = ma.length;
                    for (z = 0; G > z; z++) "BR" !== ma[z].nodeName && (y = ma[z], ja.appendChild(y), Y && y._wordEnd && ja.appendChild(f.createTextNode(" ")), M && (0 === z && (ja.style.top = y._y + "px", ja.style.left = aa + pa + "px"), y.style.top = "0px", pa && (y.style.left = y._x - pa + "px")));
                    0 === G ? ja.innerHTML = "&nbsp;" : L || S || (T(ja), p(ja, String.fromCharCode(160), " "));
                    M && (ja.style.width = qa, ja.style.height = y._h + "px");
                    d.appendChild(ja)
                }
                d.style.cssText =
                    ca
            }
            M && (b > d.clientHeight && (d.style.height = b - Ca + "px", d.clientHeight < b && (d.style.height = b + D + "px")), c > d.clientWidth && (d.style.width = c - Fa + "px", d.clientWidth < c && (d.style.width = c + va + "px")));
            q(h, oa);
            L && q(J, ba);
            q(u, r)
        }
        return this.chars.reverse(), this.words.reverse(), this.lines.reverse(), this.isSplit = !0, this
    };
    a.revert = function() {
        if (!this._originals) throw "revert() call wasn't scoped properly.";
        for (var a = this._originals.length; - 1 < --a;) this.elements[a].innerHTML = this._originals[a];
        return this.chars = [], this.words = [], this.lines = [], this.isSplit = !1, this
    };
    m.selector = b.$ || b.jQuery || function(a) {
        var c = b.$ || b.jQuery;
        return c ? (m.selector = c, c(a)) : "undefined" == typeof document ? a : document.querySelectorAll ? document.querySelectorAll(a) : document.getElementById("#" === a.charAt(0) ? a.substr(1) : a)
    };
    m.version = "0.6.1"
}(_gsScope);
(function(b) {
    var c = function() {
        return (_gsScope.GreenSockGlobals || _gsScope)[b]
    };
    "undefined" != typeof module && module.exports ? module.exports = c() : "function" == typeof define && define.amd && define([], c)
})("SplitText");
_gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
    var b = function(a) {
            var c = a.nodeType,
                d = "";
            if (1 === c || 9 === c || 11 === c) {
                if ("string" == typeof a.textContent) return a.textContent;
                for (a = a.firstChild; a; a = a.nextSibling) d += b(a)
            } else if (3 === c || 4 === c) return a.nodeValue;
            return d
        },
        c = /[\ue000-\uf8ff]|\ufffd[\ufffd-\ufffd]|\ufffd[\ufffd-\ufffd]|[\u2694-\u2697]|\ufffd[\ufffd-\ufffd]|[\ufffd-\ufffd][\ufffd-\ufffd]/,
        a = /[\ue000-\uf8ff]|\ufffd[\ufffd-\ufffd]|\ufffd[\ufffd-\ufffd]|[\u2694-\u2697]|\ufffd[\ufffd-\ufffd]|[\ufffd-\ufffd][\ufffd-\ufffd]|./g,
        d = function(b, d) {
            return "" !== d && d || !c.test(b) ? b.split(d || "") : b.match(a)
        },
        f = _gsScope._gsDefine.plugin({
            propName: "text",
            API: 2,
            version: "0.6.2",
            init: function(a, c, f, h) {
                var l = a.nodeName.toUpperCase();
                if ("function" == typeof c && (c = c(h, a)), this._svg = a.getBBox && ("TEXT" === l || "TSPAN" === l), !("innerHTML" in a || this._svg)) return !1;
                if (this._target = a, "object" != typeof c && (c = {
                        value: c
                    }), void 0 === c.value) return this._text = this._original = [""], !0;
                this._delimiter = c.delimiter || "";
                this._original = d(b(a).replace(/\s+/g, " "), this._delimiter);
                this._text = d(c.value.replace(/\s+/g, " "), this._delimiter);
                (this._runBackwards = !0 === f.vars.runBackwards) && (l = this._original, this._original = this._text, this._text = l);
                "string" == typeof c.newClass && (this._newClass = c.newClass, this._hasClass = !0);
                "string" == typeof c.oldClass && (this._oldClass = c.oldClass, this._hasClass = !0);
                l = this._original.length - this._text.length;
                a = 0 > l ? this._original : this._text;
                this._fillChar = c.fillChar || (c.padSpace ? "&nbsp;" : "");
                for (0 > l && (l = -l); - 1 < --l;) a.push(this._fillChar);
                return !0
            },
            set: function(a) {
                1 <
                    a ? a = 1 : 0 > a && (a = 0);
                this._runBackwards && (a = 1 - a);
                var b, c, d, f = this._text.length;
                a = a * f + .5 | 0;
                this._hasClass ? (b = this._newClass && 0 !== a, c = this._oldClass && a !== f, d = (b ? "<span class='" + this._newClass + "'>" : "") + this._text.slice(0, a).join(this._delimiter) + (b ? "</span>" : "") + (c ? "<span class='" + this._oldClass + "'>" : "") + this._delimiter + this._original.slice(a).join(this._delimiter) + (c ? "</span>" : "")) : d = this._text.slice(0, a).join(this._delimiter) + this._delimiter + this._original.slice(a).join(this._delimiter);
                this._svg ? this._target.textContent =
                    d : this._target.innerHTML = "&nbsp;" === this._fillChar && -1 !== d.indexOf("  ") ? d.split("  ").join("&nbsp;&nbsp;") : d
            }
        }).prototype;
    f._newClass = f._oldClass = f._delimiter = ""
});
_gsScope._gsDefine && _gsScope._gsQueue.pop()();
(function(b) {
    var c = function() {
        return (_gsScope.GreenSockGlobals || _gsScope)[b]
    };
    "undefined" != typeof module && module.exports ? (require("../TweenLite.min.js"), module.exports = c()) : "function" == typeof define && define.amd && define(["TweenLite"], c)
})("TextPlugin");
_gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
    _gsScope._gsDefine("TweenMax", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function(b, c, a) {
        var d = function(a) {
                var b, c = [],
                    d = a.length;
                for (b = 0; b !== d; c.push(a[b++]));
                return c
            },
            f = function(a, b, c) {
                var d, f, e = a.cycle;
                for (d in e) f = e[d], a[d] = "function" == typeof f ? f(c, b[c]) : f[c % f.length];
                delete a.cycle
            },
            e = function(b, c, d) {
                a.call(this, b, c, d);
                this._cycle = 0;
                this._yoyo = !0 === this.vars.yoyo || !!this.vars.yoyoEase;
                this._repeat = this.vars.repeat || 0;
                this._repeatDelay =
                    this.vars.repeatDelay || 0;
                this._repeat && this._uncache(!0);
                this.render = e.prototype.render
            },
            g = a._internals,
            k = g.isSelector,
            h = g.isArray,
            l = e.prototype = a.to({}, .1, {}),
            n = [];
        e.version = "2.0.2";
        l.constructor = e;
        l.kill()._gc = !1;
        e.killTweensOf = e.killDelayedCallsTo = a.killTweensOf;
        e.getTweensOf = a.getTweensOf;
        e.lagSmoothing = a.lagSmoothing;
        e.ticker = a.ticker;
        e.render = a.render;
        l.invalidate = function() {
            return this._yoyo = !0 === this.vars.yoyo || !!this.vars.yoyoEase, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay ||
                0, this._yoyoEase = null, this._uncache(!0), a.prototype.invalidate.call(this)
        };
        l.updateTo = function(b, c) {
            var d, f = this.ratio,
                e = this.vars.immediateRender || b.immediateRender;
            c && this._startTime < this._timeline._time && (this._startTime = this._timeline._time, this._uncache(!1), this._gc ? this._enabled(!0, !1) : this._timeline.insert(this, this._startTime - this._delay));
            for (d in b) this.vars[d] = b[d];
            if (this._initted || e)
                if (c) this._initted = !1, e && this.render(0, !0, !0);
                else if (this._gc && this._enabled(!0, !1), this._notifyPluginsOfEnabled &&
                this._firstPT && a._onPluginEvent("_onDisable", this), .998 < this._time / this._duration) d = this._totalTime, this.render(0, !0, !1), this._initted = !1, this.render(d, !0, !1);
            else if (this._initted = !1, this._init(), 0 < this._time || e)
                for (f = 1 / (1 - f), e = this._firstPT; e;) d = e.s + e.c, e.c *= f, e.s = d - e.c, e = e._next;
            return this
        };
        l.render = function(b, c, d) {
            this._initted || 0 === this._duration && this.vars.repeat && this.invalidate();
            var f, e, l, k, h, J, n, u, z = this._dirty ? this.totalDuration() : this._totalDuration,
                F = this._time,
                R = this._totalTime,
                H = this._cycle,
                W = this._duration,
                C = this._rawPrevTime;
            if (b >= z - 1E-7 && 0 <= b ? (this._totalTime = z, this._cycle = this._repeat, this._yoyo && 0 !== (1 & this._cycle) ? (this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0) : (this._time = W, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1), this._reversed || (f = !0, e = "onComplete", d = d || this._timeline.autoRemoveChildren), 0 === W && (this._initted || !this.vars.lazy || d) && (this._startTime === this._timeline._duration && (b = 0), (0 > C || 0 >= b && -1E-7 <= b || 1E-10 === C && "isPause" !== this.data) &&
                    C !== b && (d = !0, 1E-10 < C && (e = "onReverseComplete")), this._rawPrevTime = n = !c || b || C === b ? b : 1E-10)) : 1E-7 > b ? (this._totalTime = this._time = this._cycle = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== R || 0 === W && 0 < C) && (e = "onReverseComplete", f = this._reversed), 0 > b && (this._active = !1, 0 === W && (this._initted || !this.vars.lazy || d) && (0 <= C && (d = !0), this._rawPrevTime = n = !c || b || C === b ? b : 1E-10)), this._initted || (d = !0)) : (this._totalTime = this._time = b, 0 !== this._repeat && (l = W + this._repeatDelay, this._cycle = this._totalTime /
                    l >> 0, 0 !== this._cycle && this._cycle === this._totalTime / l && b >= R && this._cycle--, this._time = this._totalTime - this._cycle * l, this._yoyo && 0 !== (1 & this._cycle) && (this._time = W - this._time, u = this._yoyoEase || this.vars.yoyoEase, u && (this._yoyoEase || (!0 !== u || this._initted ? this._yoyoEase = u = !0 === u ? this._ease : u instanceof Ease ? u : Ease.map[u] : (u = this.vars.ease, this._yoyoEase = u = u ? u instanceof Ease ? u : "function" == typeof u ? new Ease(u, this.vars.easeParams) : Ease.map[u] || a.defaultEase : a.defaultEase)), this.ratio = u ? 1 - u.getRatio((W -
                        this._time) / W) : 0)), this._time > W ? this._time = W : 0 > this._time && (this._time = 0)), this._easeType && !u ? (k = this._time / W, h = this._easeType, J = this._easePower, (1 === h || 3 === h && .5 <= k) && (k = 1 - k), 3 === h && (k *= 2), 1 === J ? k *= k : 2 === J ? k *= k * k : 3 === J ? k *= k * k * k : 4 === J && (k *= k * k * k * k), 1 === h ? this.ratio = 1 - k : 2 === h ? this.ratio = k : .5 > this._time / W ? this.ratio = k / 2 : this.ratio = 1 - k / 2) : u || (this.ratio = this._ease.getRatio(this._time / W))), F === this._time && !d && H === this._cycle) return void(R !== this._totalTime && this._onUpdate && (c || this._callback("onUpdate")));
            if (!this._initted) {
                if (this._init(), !this._initted || this._gc) return;
                if (!d && this._firstPT && (!1 !== this.vars.lazy && this._duration || this.vars.lazy && !this._duration)) return this._time = F, this._totalTime = R, this._rawPrevTime = C, this._cycle = H, g.lazyTweens.push(this), void(this._lazy = [b, c]);
                !this._time || f || u ? f && this._ease._calcEnd && !u && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1)) : this.ratio = this._ease.getRatio(this._time / W)
            }!1 !== this._lazy && (this._lazy = !1);
            this._active || !this._paused && this._time !== F &&
                0 <= b && (this._active = !0);
            0 !== R || (2 === this._initted && 0 < b && this._init(), this._startAt && (0 <= b ? this._startAt.render(b, !0, d) : e || (e = "_dummyGS")), !this.vars.onStart || 0 === this._totalTime && 0 !== W || !c && this._callback("onStart"));
            for (l = this._firstPT; l;) l.f ? l.t[l.p](l.c * this.ratio + l.s) : l.t[l.p] = l.c * this.ratio + l.s, l = l._next;
            this._onUpdate && (0 > b && this._startAt && this._startTime && this._startAt.render(b, !0, d), c || (this._totalTime !== R || e) && this._callback("onUpdate"));
            this._cycle !== H && (c || this._gc || this.vars.onRepeat &&
                this._callback("onRepeat"));
            e && (!this._gc || d) && (0 > b && this._startAt && !this._onUpdate && this._startTime && this._startAt.render(b, !0, d), f && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !c && this.vars[e] && this._callback(e), 0 === W && 1E-10 === this._rawPrevTime && 1E-10 !== n && (this._rawPrevTime = 0))
        };
        e.to = function(a, b, c) {
            return new e(a, b, c)
        };
        e.from = function(a, b, c) {
            return c.runBackwards = !0, c.immediateRender = 0 != c.immediateRender, new e(a, b, c)
        };
        e.fromTo = function(a, b, c, d) {
            return d.startAt = c,
                d.immediateRender = 0 != d.immediateRender && 0 != c.immediateRender, new e(a, b, d)
        };
        e.staggerTo = e.allTo = function(b, c, p, g, l, X, J) {
            g = g || 0;
            var u, z, E, B, I = 0,
                F = [],
                R = function() {
                    p.onComplete && p.onComplete.apply(p.onCompleteScope || this, arguments);
                    l.apply(J || p.callbackScope || this, X || n)
                },
                H = p.cycle,
                W = p.startAt && p.startAt.cycle;
            h(b) || ("string" == typeof b && (b = a.selector(b) || b), k(b) && (b = d(b)));
            b = b || [];
            0 > g && (b = d(b), b.reverse(), g *= -1);
            u = b.length - 1;
            for (E = 0; u >= E; E++) {
                z = {};
                for (B in p) z[B] = p[B];
                if (H && (f(z, b, E), null != z.duration &&
                        (c = z.duration, delete z.duration)), W) {
                    W = z.startAt = {};
                    for (B in p.startAt) W[B] = p.startAt[B];
                    f(z.startAt, b, E)
                }
                z.delay = I + (z.delay || 0);
                E === u && l && (z.onComplete = R);
                F[E] = new e(b[E], c, z);
                I += g
            }
            return F
        };
        e.staggerFrom = e.allFrom = function(a, b, c, d, f, g, l) {
            return c.runBackwards = !0, c.immediateRender = 0 != c.immediateRender, e.staggerTo(a, b, c, d, f, g, l)
        };
        e.staggerFromTo = e.allFromTo = function(a, b, c, d, f, g, l, k) {
            return d.startAt = c, d.immediateRender = 0 != d.immediateRender && 0 != c.immediateRender, e.staggerTo(a, b, d, f, g, l, k)
        };
        e.delayedCall =
            function(a, b, c, d, f) {
                return new e(b, 0, {
                    delay: a,
                    onComplete: b,
                    onCompleteParams: c,
                    callbackScope: d,
                    onReverseComplete: b,
                    onReverseCompleteParams: c,
                    immediateRender: !1,
                    useFrames: f,
                    overwrite: 0
                })
            };
        e.set = function(a, b) {
            return new e(a, 0, b)
        };
        e.isTweening = function(b) {
            return 0 < a.getTweensOf(b, !0).length
        };
        var u = function(b, c) {
                for (var d = [], f = 0, e = b._first; e;) e instanceof a ? d[f++] = e : (c && (d[f++] = e), d = d.concat(u(e, c)), f = d.length), e = e._next;
                return d
            },
            J = e.getAllTweens = function(a) {
                return u(b._rootTimeline, a).concat(u(b._rootFramesTimeline,
                    a))
            };
        e.killAll = function(a, b, d, f) {
            null == b && (b = !0);
            null == d && (d = !0);
            var e, g, l = J(0 != f),
                k = l.length,
                h = b && d && f;
            for (g = 0; k > g; g++) f = l[g], (h || f instanceof c || (e = f.target === f.vars.onComplete) && d || b && !e) && (a ? f.totalTime(f._reversed ? 0 : f.totalDuration()) : f._enabled(!1, !1))
        };
        e.killChildTweensOf = function(b, c) {
            if (null != b) {
                var f, q, l, J = g.tweenLookup;
                if ("string" == typeof b && (b = a.selector(b) || b), k(b) && (b = d(b)), h(b))
                    for (q = b.length; - 1 < --q;) e.killChildTweensOf(b[q], c);
                else {
                    f = [];
                    for (l in J)
                        for (q = J[l].target.parentNode; q;) q ===
                            b && (f = f.concat(J[l].tweens)), q = q.parentNode;
                    l = f.length;
                    for (q = 0; l > q; q++) c && f[q].totalTime(f[q].totalDuration()), f[q]._enabled(!1, !1)
                }
            }
        };
        var z = function(a, b, d, f) {
            b = !1 !== b;
            d = !1 !== d;
            f = !1 !== f;
            for (var e, g = J(f), l = b && d && f, k = g.length; - 1 < --k;) f = g[k], (l || f instanceof c || (e = f.target === f.vars.onComplete) && d || b && !e) && f.paused(a)
        };
        return e.pauseAll = function(a, b, c) {
            z(!0, a, b, c)
        }, e.resumeAll = function(a, b, c) {
            z(!1, a, b, c)
        }, e.globalTimeScale = function(c) {
            var d = b._rootTimeline,
                f = a.ticker.time;
            return arguments.length ? (c = c ||
                1E-10, d._startTime = f - (f - d._startTime) * d._timeScale / c, d = b._rootFramesTimeline, f = a.ticker.frame, d._startTime = f - (f - d._startTime) * d._timeScale / c, d._timeScale = b._rootTimeline._timeScale = c, c) : d._timeScale
        }, l.progress = function(a, b) {
            return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - a : a) + this._cycle * (this._duration + this._repeatDelay), b) : this._time / this.duration()
        }, l.totalProgress = function(a, b) {
            return arguments.length ? this.totalTime(this.totalDuration() * a, b) : this._totalTime /
                this.totalDuration()
        }, l.time = function(a, b) {
            return arguments.length ? (this._dirty && this.totalDuration(), a > this._duration && (a = this._duration), this._yoyo && 0 !== (1 & this._cycle) ? a = this._duration - a + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (a += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(a, b)) : this._time
        }, l.duration = function(a) {
            return arguments.length ? b.prototype.duration.call(this, a) : this._duration
        }, l.totalDuration = function(a) {
            return arguments.length ? -1 === this._repeat ?
                this : this.duration((a - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat, this._dirty = !1), this._totalDuration)
        }, l.repeat = function(a) {
            return arguments.length ? (this._repeat = a, this._uncache(!0)) : this._repeat
        }, l.repeatDelay = function(a) {
            return arguments.length ? (this._repeatDelay = a, this._uncache(!0)) : this._repeatDelay
        }, l.yoyo = function(a) {
            return arguments.length ? (this._yoyo = a, this) :
                this._yoyo
        }, e
    }, !0);
    _gsScope._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function(b, c, a) {
        var d = function(a) {
                c.call(this, a);
                this._labels = {};
                this.autoRemoveChildren = !0 === this.vars.autoRemoveChildren;
                this.smoothChildTiming = !0 === this.vars.smoothChildTiming;
                this._sortChildren = !0;
                this._onUpdate = this.vars.onUpdate;
                var b, d = this.vars;
                for (b in d) a = d[b], k(a) && -1 !== a.join("").indexOf("{self}") && (d[b] = this._swapSelfInParams(a));
                k(d.tweens) && this.add(d.tweens, 0, d.align, d.stagger)
            },
            f = a._internals,
            e = d._internals = {},
            g = f.isSelector,
            k = f.isArray,
            h = f.lazyTweens,
            l = f.lazyRender,
            n = _gsScope._gsDefine.globals,
            u = function(a) {
                var b, c = {};
                for (b in a) c[b] = a[b];
                return c
            },
            J = function(a, b, c) {
                var d, f, e = a.cycle;
                for (d in e) f = e[d], a[d] = "function" == typeof f ? f(c, b[c]) : f[c % f.length];
                delete a.cycle
            },
            z = e.pauseCallback = function() {},
            V = function(a) {
                var b, c = [],
                    d = a.length;
                for (b = 0; b !== d; c.push(a[b++]));
                return c
            },
            f = d.prototype = new c;
        return d.version = "2.0.2", f.constructor = d, f.kill()._gc = f._forcingPlayhead = f._hasPause = !1, f.to = function(b, c, d, f) {
                var e = d.repeat && n.TweenMax || a;
                return c ? this.add(new e(b, c, d), f) : this.set(b, d, f)
            }, f.from = function(b, c, d, f) {
                return this.add((d.repeat && n.TweenMax || a).from(b, c, d), f)
            }, f.fromTo = function(b, c, d, f, e) {
                var g = f.repeat && n.TweenMax || a;
                return c ? this.add(g.fromTo(b, c, d, f), e) : this.set(b, f, e)
            }, f.staggerTo = function(b, c, f, e, l, k, h, n) {
                n = new d({
                    onComplete: k,
                    onCompleteParams: h,
                    callbackScope: n,
                    smoothChildTiming: this.smoothChildTiming
                });
                var z = f.cycle;
                "string" == typeof b && (b = a.selector(b) || b);
                b = b || [];
                g(b) && (b = V(b));
                e = e || 0;
                0 > e && (b = V(b), b.reverse(), e *= -1);
                for (h = 0; h < b.length; h++) k = u(f), k.startAt && (k.startAt = u(k.startAt), k.startAt.cycle && J(k.startAt, b, h)), z && (J(k, b, h), null != k.duration && (c = k.duration, delete k.duration)), n.to(b[h], c, k, h * e);
                return this.add(n, l)
            }, f.staggerFrom = function(a, b, c, d, f, e, g, l) {
                return c.immediateRender = 0 != c.immediateRender, c.runBackwards = !0, this.staggerTo(a, b, c, d, f, e, g, l)
            }, f.staggerFromTo = function(a, b, c, d, f, e, g, l, k) {
                return d.startAt = c, d.immediateRender = 0 != d.immediateRender &&
                    0 != c.immediateRender, this.staggerTo(a, b, d, f, e, g, l, k)
            }, f.call = function(b, c, d, f) {
                return this.add(a.delayedCall(0, b, c, d), f)
            }, f.set = function(b, c, d) {
                return d = this._parseTimeOrLabel(d, 0, !0), null == c.immediateRender && (c.immediateRender = d === this._time && !this._paused), this.add(new a(b, 0, c), d)
            }, d.exportRoot = function(b, c) {
                b = b || {};
                null == b.smoothChildTiming && (b.smoothChildTiming = !0);
                var f, e, g, l, k = new d(b),
                    h = k._timeline;
                null == c && (c = !0);
                h._remove(k, !0);
                k._startTime = 0;
                k._rawPrevTime = k._time = k._totalTime = h._time;
                for (g =
                    h._first; g;) l = g._next, c && g instanceof a && g.target === g.vars.onComplete || (e = g._startTime - g._delay, 0 > e && (f = 1), k.add(g, e)), g = l;
                return h.add(k, 0), f && k.totalDuration(), k
            }, f.add = function(f, e, g, l) {
                var h, J, u;
                if ("number" != typeof e && (e = this._parseTimeOrLabel(e, 0, !0, f)), !(f instanceof b)) {
                    if (f instanceof Array || f && f.push && k(f)) {
                        g = g || "normal";
                        l = l || 0;
                        h = e;
                        e = f.length;
                        for (J = 0; e > J; J++) k(u = f[J]) && (u = new d({
                            tweens: u
                        })), this.add(u, h), "string" != typeof u && "function" != typeof u && ("sequence" === g ? h = u._startTime + u.totalDuration() /
                            u._timeScale : "start" === g && (u._startTime -= u.delay())), h += l;
                        return this._uncache(!0)
                    }
                    if ("string" == typeof f) return this.addLabel(f, e);
                    if ("function" != typeof f) throw "Cannot add " + f + " into the timeline; it is not a tween, timeline, function, or string.";
                    f = a.delayedCall(0, f)
                }
                if (c.prototype.add.call(this, f, e), f._time && (h = Math.max(0, Math.min(f.totalDuration(), (this.rawTime() - f._startTime) * f._timeScale)), 1E-5 < Math.abs(h - f._totalTime) && f.render(h, !1, !1)), (this._gc || this._time === this._duration) && !this._paused &&
                    this._duration < this.duration())
                    for (g = this, f = g.rawTime() > f._startTime; g._timeline;) f && g._timeline.smoothChildTiming ? g.totalTime(g._totalTime, !0) : g._gc && g._enabled(!0, !1), g = g._timeline;
                return this
            }, f.remove = function(a) {
                if (a instanceof b) {
                    this._remove(a, !1);
                    var c = a._timeline = a.vars.useFrames ? b._rootFramesTimeline : b._rootTimeline;
                    return a._startTime = (a._paused ? a._pauseTime : c._time) - (a._reversed ? a.totalDuration() - a._totalTime : a._totalTime) / a._timeScale, this
                }
                if (a instanceof Array || a && a.push && k(a)) {
                    for (c =
                        a.length; - 1 < --c;) this.remove(a[c]);
                    return this
                }
                return "string" == typeof a ? this.removeLabel(a) : this.kill(null, a)
            }, f._remove = function(a, b) {
                c.prototype._remove.call(this, a, b);
                return this._last ? this._time > this.duration() && (this._time = this._duration, this._totalTime = this._totalDuration) : this._time = this._totalTime = this._duration = this._totalDuration = 0, this
            }, f.append = function(a, b) {
                return this.add(a, this._parseTimeOrLabel(null, b, !0, a))
            }, f.insert = f.insertMultiple = function(a, b, c, d) {
                return this.add(a, b || 0, c, d)
            },
            f.appendMultiple = function(a, b, c, d) {
                return this.add(a, this._parseTimeOrLabel(null, b, !0, a), c, d)
            }, f.addLabel = function(a, b) {
                return this._labels[a] = this._parseTimeOrLabel(b), this
            }, f.addPause = function(b, c, d, f) {
                d = a.delayedCall(0, z, d, f || this);
                return d.vars.onComplete = d.vars.onReverseComplete = c, d.data = "isPause", this._hasPause = !0, this.add(d, b)
            }, f.removeLabel = function(a) {
                return delete this._labels[a], this
            }, f.getLabelTime = function(a) {
                return null != this._labels[a] ? this._labels[a] : -1
            }, f._parseTimeOrLabel = function(a,
                c, d, f) {
                var e;
                if (f instanceof b && f.timeline === this) this.remove(f);
                else if (f && (f instanceof Array || f.push && k(f)))
                    for (e = f.length; - 1 < --e;) f[e] instanceof b && f[e].timeline === this && this.remove(f[e]);
                if (f = "number" != typeof a || c ? 99999999999 < this.duration() ? this.recent().endTime(!1) : this._duration : 0, "string" == typeof c) return this._parseTimeOrLabel(c, d && "number" == typeof a && null == this._labels[c] ? a - f : 0, d);
                if (c = c || 0, "string" != typeof a || !isNaN(a) && null == this._labels[a]) null == a && (a = f);
                else {
                    if (e = a.indexOf("="), -1 ===
                        e) return null == this._labels[a] ? d ? this._labels[a] = f + c : c : this._labels[a] + c;
                    c = parseInt(a.charAt(e - 1) + "1", 10) * Number(a.substr(e + 1));
                    a = 1 < e ? this._parseTimeOrLabel(a.substr(0, e - 1), 0, d) : f
                }
                return Number(a) + c
            }, f.seek = function(a, b) {
                return this.totalTime("number" == typeof a ? a : this._parseTimeOrLabel(a), !1 !== b)
            }, f.stop = function() {
                return this.paused(!0)
            }, f.gotoAndPlay = function(a, b) {
                return this.play(a, b)
            }, f.gotoAndStop = function(a, b) {
                return this.pause(a, b)
            }, f.render = function(a, b, c) {
                this._gc && this._enabled(!0, !1);
                var d,
                    f, e, g, k, u, J, n = this._time,
                    z = this._dirty ? this.totalDuration() : this._totalDuration,
                    V = this._startTime,
                    H = this._timeScale,
                    W = this._paused;
                if (n !== this._time && (a += this._time - n), a >= z - 1E-7 && 0 <= a) this._totalTime = this._time = z, this._reversed || this._hasPausedChild() || (f = !0, g = "onComplete", k = !!this._timeline.autoRemoveChildren, 0 === this._duration && (0 >= a && -1E-7 <= a || 0 > this._rawPrevTime || 1E-10 === this._rawPrevTime) && this._rawPrevTime !== a && this._first && (k = !0, 1E-10 < this._rawPrevTime && (g = "onReverseComplete"))), this._rawPrevTime =
                    this._duration || !b || a || this._rawPrevTime === a ? a : 1E-10, a = z + 1E-4;
                else if (1E-7 > a)
                    if (this._totalTime = this._time = 0, (0 !== n || 0 === this._duration && 1E-10 !== this._rawPrevTime && (0 < this._rawPrevTime || 0 > a && 0 <= this._rawPrevTime)) && (g = "onReverseComplete", f = this._reversed), 0 > a) this._active = !1, this._timeline.autoRemoveChildren && this._reversed ? (k = f = !0, g = "onReverseComplete") : 0 <= this._rawPrevTime && this._first && (k = !0), this._rawPrevTime = a;
                    else {
                        if (this._rawPrevTime = this._duration || !b || a || this._rawPrevTime === a ? a : 1E-10, 0 ===
                            a && f)
                            for (d = this._first; d && 0 === d._startTime;) d._duration || (f = !1), d = d._next;
                        a = 0;
                        this._initted || (k = !0)
                    } else {
                    if (this._hasPause && !this._forcingPlayhead && !b) {
                        if (a >= n)
                            for (d = this._first; d && d._startTime <= a && !u;) d._duration || "isPause" !== d.data || d.ratio || 0 === d._startTime && 0 === this._rawPrevTime || (u = d), d = d._next;
                        else
                            for (d = this._last; d && d._startTime >= a && !u;) d._duration || "isPause" === d.data && 0 < d._rawPrevTime && (u = d), d = d._prev;
                        u && (this._time = a = u._startTime, this._totalTime = a + this._cycle * (this._totalDuration + this._repeatDelay))
                    }
                    this._totalTime =
                        this._time = this._rawPrevTime = a
                }
                if (this._time !== n && this._first || c || k || u) {
                    if (this._initted || (this._initted = !0), this._active || !this._paused && this._time !== n && 0 < a && (this._active = !0), 0 === n && this.vars.onStart && (0 === this._time && this._duration || b || this._callback("onStart")), J = this._time, J >= n)
                        for (d = this._first; d && (e = d._next, J === this._time && (!this._paused || W));)(d._active || d._startTime <= J && !d._paused && !d._gc) && (u === d && this.pause(), d._reversed ? d.render((d._dirty ? d.totalDuration() : d._totalDuration) - (a - d._startTime) *
                            d._timeScale, b, c) : d.render((a - d._startTime) * d._timeScale, b, c)), d = e;
                    else
                        for (d = this._last; d && (e = d._prev, J === this._time && (!this._paused || W));) {
                            if (d._active || d._startTime <= n && !d._paused && !d._gc) {
                                if (u === d) {
                                    for (u = d._prev; u && u.endTime() > this._time;) u.render(u._reversed ? u.totalDuration() - (a - u._startTime) * u._timeScale : (a - u._startTime) * u._timeScale, b, c), u = u._prev;
                                    u = null;
                                    this.pause()
                                }
                                d._reversed ? d.render((d._dirty ? d.totalDuration() : d._totalDuration) - (a - d._startTime) * d._timeScale, b, c) : d.render((a - d._startTime) *
                                    d._timeScale, b, c)
                            }
                            d = e
                        }
                    this._onUpdate && (b || (h.length && l(), this._callback("onUpdate")));
                    g && (this._gc || (V === this._startTime || H !== this._timeScale) && (0 === this._time || z >= this.totalDuration()) && (f && (h.length && l(), this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !b && this.vars[g] && this._callback(g)))
                }
            }, f._hasPausedChild = function() {
                for (var a = this._first; a;) {
                    if (a._paused || a instanceof d && a._hasPausedChild()) return !0;
                    a = a._next
                }
                return !1
            }, f.getChildren = function(b, c, d, f) {
                f = f || -9999999999;
                for (var e = [], g = this._first, l = 0; g;) g._startTime < f || (g instanceof a ? !1 !== c && (e[l++] = g) : (!1 !== d && (e[l++] = g), !1 !== b && (e = e.concat(g.getChildren(!0, c, d)), l = e.length))), g = g._next;
                return e
            }, f.getTweensOf = function(b, c) {
                var d, f, e = this._gc,
                    g = [],
                    l = 0;
                e && this._enabled(!0, !0);
                d = a.getTweensOf(b);
                for (f = d.length; - 1 < --f;)(d[f].timeline === this || c && this._contains(d[f])) && (g[l++] = d[f]);
                return e && this._enabled(!1, !0), g
            }, f.recent = function() {
                return this._recent
            }, f._contains = function(a) {
                for (a = a.timeline; a;) {
                    if (a === this) return !0;
                    a = a.timeline
                }
                return !1
            }, f.shiftChildren = function(a, b, c) {
                c = c || 0;
                for (var d, f = this._first, e = this._labels; f;) f._startTime >= c && (f._startTime += a), f = f._next;
                if (b)
                    for (d in e) e[d] >= c && (e[d] += a);
                return this._uncache(!0)
            }, f._kill = function(a, b) {
                if (!a && !b) return this._enabled(!1, !1);
                for (var c = b ? this.getTweensOf(b) : this.getChildren(!0, !0, !1), d = c.length, f = !1; - 1 < --d;) c[d]._kill(a, b) && (f = !0);
                return f
            }, f.clear = function(a) {
                var b = this.getChildren(!1, !0, !0),
                    c = b.length;
                for (this._time = this._totalTime = 0; - 1 < --c;) b[c]._enabled(!1, !1);
                return !1 !== a && (this._labels = {}), this._uncache(!0)
            }, f.invalidate = function() {
                for (var a = this._first; a;) a.invalidate(), a = a._next;
                return b.prototype.invalidate.call(this)
            }, f._enabled = function(a, b) {
                if (a === this._gc)
                    for (var d = this._first; d;) d._enabled(a, !0), d = d._next;
                return c.prototype._enabled.call(this, a, b)
            }, f.totalTime = function(a, c, d) {
                this._forcingPlayhead = !0;
                var f = b.prototype.totalTime.apply(this, arguments);
                return this._forcingPlayhead = !1, f
            }, f.duration = function(a) {
                return arguments.length ? (0 !== this.duration() &&
                    0 !== a && this.timeScale(this._duration / a), this) : (this._dirty && this.totalDuration(), this._duration)
            }, f.totalDuration = function(a) {
                if (!arguments.length) {
                    if (this._dirty) {
                        var b, c, d = 0;
                        c = this._last;
                        for (var f = 999999999999; c;) b = c._prev, c._dirty && c.totalDuration(), c._startTime > f && this._sortChildren && !c._paused && !this._calculatingDuration ? (this._calculatingDuration = 1, this.add(c, c._startTime - c._delay), this._calculatingDuration = 0) : f = c._startTime, 0 > c._startTime && !c._paused && (d -= c._startTime, this._timeline.smoothChildTiming &&
                            (this._startTime += c._startTime / this._timeScale, this._time -= c._startTime, this._totalTime -= c._startTime, this._rawPrevTime -= c._startTime), this.shiftChildren(-c._startTime, !1, -9999999999), f = 0), c = c._startTime + c._totalDuration / c._timeScale, c > d && (d = c), c = b;
                        this._duration = this._totalDuration = d;
                        this._dirty = !1
                    }
                    return this._totalDuration
                }
                return a && this.totalDuration() ? this.timeScale(this._totalDuration / a) : this
            }, f.paused = function(a) {
                if (!a)
                    for (var c = this._first, d = this._time; c;) c._startTime === d && "isPause" === c.data &&
                        (c._rawPrevTime = 0), c = c._next;
                return b.prototype.paused.apply(this, arguments)
            }, f.usesFrames = function() {
                for (var a = this._timeline; a._timeline;) a = a._timeline;
                return a === b._rootFramesTimeline
            }, f.rawTime = function(a) {
                return a && (this._paused || this._repeat && 0 < this.time() && 1 > this.totalProgress()) ? this._totalTime % (this._duration + this._repeatDelay) : this._paused ? this._totalTime : (this._timeline.rawTime(a) - this._startTime) * this._timeScale
            }, d
    }, !0);
    _gsScope._gsDefine("TimelineMax", ["TimelineLite", "TweenLite", "easing.Ease"],
        function(b, c, a) {
            var d = function(a) {
                    b.call(this, a);
                    this._repeat = this.vars.repeat || 0;
                    this._repeatDelay = this.vars.repeatDelay || 0;
                    this._cycle = 0;
                    this._yoyo = !0 === this.vars.yoyo;
                    this._dirty = !0
                },
                f = c._internals,
                e = f.lazyTweens,
                g = f.lazyRender,
                k = _gsScope._gsDefine.globals,
                h = new a(null, null, 1, 0);
            a = d.prototype = new b;
            return a.constructor = d, a.kill()._gc = !1, d.version = "2.0.2", a.invalidate = function() {
                    return this._yoyo = !0 === this.vars.yoyo, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._uncache(!0),
                        b.prototype.invalidate.call(this)
                }, a.addCallback = function(a, b, d, f) {
                    return this.add(c.delayedCall(0, a, d, f), b)
                }, a.removeCallback = function(a, b) {
                    if (a)
                        if (null == b) this._kill(null, a);
                        else
                            for (var c = this.getTweensOf(a, !1), d = c.length, f = this._parseTimeOrLabel(b); - 1 < --d;) c[d]._startTime === f && c[d]._enabled(!1, !1);
                    return this
                }, a.removePause = function(a) {
                    return this.removeCallback(b._internals.pauseCallback, a)
                }, a.tweenTo = function(a, b) {
                    b = b || {};
                    var d, f, e, g = {
                            ease: h,
                            useFrames: this.usesFrames(),
                            immediateRender: !1,
                            lazy: !1
                        },
                        m = b.repeat && k.TweenMax || c;
                    for (f in b) g[f] = b[f];
                    return g.time = this._parseTimeOrLabel(a), d = Math.abs(Number(g.time) - this._time) / this._timeScale || .001, e = new m(this, d, g), g.onStart = function() {
                        e.target.paused(!0);
                        e.vars.time === e.target.time() || d !== e.duration() || e.isFromTo || e.duration(Math.abs(e.vars.time - e.target.time()) / e.target._timeScale).render(e.time(), !0, !0);
                        b.onStart && b.onStart.apply(b.onStartScope || b.callbackScope || e, b.onStartParams || [])
                    }, e
                }, a.tweenFromTo = function(a, b, c) {
                    c = c || {};
                    a = this._parseTimeOrLabel(a);
                    c.startAt = {
                        onComplete: this.seek,
                        onCompleteParams: [a],
                        callbackScope: this
                    };
                    c.immediateRender = !1 !== c.immediateRender;
                    b = this.tweenTo(b, c);
                    return b.isFromTo = 1, b.duration(Math.abs(b.vars.time - a) / this._timeScale || .001)
                }, a.render = function(a, b, c) {
                    this._gc && this._enabled(!0, !1);
                    var d, f, k, m, p, h, t, X = this._time,
                        T = this._dirty ? this.totalDuration() : this._totalDuration,
                        K = this._duration,
                        O = this._totalTime,
                        E = this._startTime,
                        B = this._timeScale,
                        I = this._rawPrevTime,
                        F = this._paused,
                        R = this._cycle;
                    if (X !== this._time && (a += this._time -
                            X), a >= T - 1E-7 && 0 <= a) this._locked || (this._totalTime = T, this._cycle = this._repeat), this._reversed || this._hasPausedChild() || (f = !0, m = "onComplete", p = !!this._timeline.autoRemoveChildren, 0 === this._duration && (0 >= a && -1E-7 <= a || 0 > I || 1E-10 === I) && I !== a && this._first && (p = !0, 1E-10 < I && (m = "onReverseComplete"))), this._rawPrevTime = this._duration || !b || a || this._rawPrevTime === a ? a : 1E-10, this._yoyo && 0 !== (1 & this._cycle) ? this._time = a = 0 : (this._time = K, a = K + 1E-4);
                    else if (1E-7 > a)
                        if (this._locked || (this._totalTime = this._cycle = 0), this._time =
                            0, (0 !== X || 0 === K && 1E-10 !== I && (0 < I || 0 > a && 0 <= I) && !this._locked) && (m = "onReverseComplete", f = this._reversed), 0 > a) this._active = !1, this._timeline.autoRemoveChildren && this._reversed ? (p = f = !0, m = "onReverseComplete") : 0 <= I && this._first && (p = !0), this._rawPrevTime = a;
                        else {
                            if (this._rawPrevTime = K || !b || a || this._rawPrevTime === a ? a : 1E-10, 0 === a && f)
                                for (d = this._first; d && 0 === d._startTime;) d._duration || (f = !1), d = d._next;
                            a = 0;
                            this._initted || (p = !0)
                        } else if (0 === K && 0 > I && (p = !0), this._time = this._rawPrevTime = a, this._locked || (this._totalTime =
                            a, 0 !== this._repeat && (d = K + this._repeatDelay, this._cycle = this._totalTime / d >> 0, 0 !== this._cycle && this._cycle === this._totalTime / d && a >= O && this._cycle--, this._time = this._totalTime - this._cycle * d, this._yoyo && 0 !== (1 & this._cycle) && (this._time = K - this._time), this._time > K ? (this._time = K, a = K + 1E-4) : 0 > this._time ? this._time = a = 0 : a = this._time)), this._hasPause && !this._forcingPlayhead && !b) {
                        if (a = this._time, a >= X || this._repeat && R !== this._cycle)
                            for (d = this._first; d && d._startTime <= a && !h;) d._duration || "isPause" !== d.data || d.ratio ||
                                0 === d._startTime && 0 === this._rawPrevTime || (h = d), d = d._next;
                        else
                            for (d = this._last; d && d._startTime >= a && !h;) d._duration || "isPause" === d.data && 0 < d._rawPrevTime && (h = d), d = d._prev;
                        h && h._startTime < K && (this._time = a = h._startTime, this._totalTime = a + this._cycle * (this._totalDuration + this._repeatDelay))
                    }
                    if (this._cycle !== R && !this._locked) {
                        d = this._yoyo && 0 !== (1 & R);
                        var H = d === (this._yoyo && 0 !== (1 & this._cycle)),
                            W = this._totalTime,
                            C = this._cycle,
                            fa = this._rawPrevTime,
                            Z = this._time;
                        if ((this._totalTime = R * K, this._cycle < R ? d = !d : this._totalTime +=
                                K, this._time = X, this._rawPrevTime = 0 === K ? I - 1E-4 : I, this._cycle = R, this._locked = !0, X = d ? 0 : K, this.render(X, b, 0 === K), b || this._gc || this.vars.onRepeat && (this._cycle = C, this._locked = !1, this._callback("onRepeat")), X !== this._time) || (H && (this._cycle = R, this._locked = !0, X = d ? K + 1E-4 : -1E-4, this.render(X, !0, !1)), this._locked = !1, this._paused && !F)) return;
                        this._time = Z;
                        this._totalTime = W;
                        this._cycle = C;
                        this._rawPrevTime = fa
                    }
                    if (!(this._time !== X && this._first || c || p || h)) return void(O !== this._totalTime && this._onUpdate && (b || this._callback("onUpdate")));
                    if (this._initted || (this._initted = !0), this._active || !this._paused && this._totalTime !== O && 0 < a && (this._active = !0), 0 === O && this.vars.onStart && (0 === this._totalTime && this._totalDuration || b || this._callback("onStart")), t = this._time, t >= X)
                        for (d = this._first; d && (k = d._next, t === this._time && (!this._paused || F));)(d._active || d._startTime <= this._time && !d._paused && !d._gc) && (h === d && this.pause(), d._reversed ? d.render((d._dirty ? d.totalDuration() : d._totalDuration) - (a - d._startTime) * d._timeScale, b, c) : d.render((a - d._startTime) *
                            d._timeScale, b, c)), d = k;
                    else
                        for (d = this._last; d && (k = d._prev, t === this._time && (!this._paused || F));) {
                            if (d._active || d._startTime <= X && !d._paused && !d._gc) {
                                if (h === d) {
                                    for (h = d._prev; h && h.endTime() > this._time;) h.render(h._reversed ? h.totalDuration() - (a - h._startTime) * h._timeScale : (a - h._startTime) * h._timeScale, b, c), h = h._prev;
                                    h = null;
                                    this.pause()
                                }
                                d._reversed ? d.render((d._dirty ? d.totalDuration() : d._totalDuration) - (a - d._startTime) * d._timeScale, b, c) : d.render((a - d._startTime) * d._timeScale, b, c)
                            }
                            d = k
                        }
                    this._onUpdate && (b ||
                        (e.length && g(), this._callback("onUpdate")));
                    m && (this._locked || this._gc || (E === this._startTime || B !== this._timeScale) && (0 === this._time || T >= this.totalDuration()) && (f && (e.length && g(), this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !b && this.vars[m] && this._callback(m)))
                }, a.getActive = function(a, b, c) {
                    null == a && (a = !0);
                    null == b && (b = !0);
                    null == c && (c = !1);
                    var d = [];
                    c = this.getChildren(a, b, c);
                    var f = 0,
                        e = c.length;
                    for (a = 0; e > a; a++) b = c[a], b.isActive() && (d[f++] = b);
                    return d
                }, a.getLabelAfter = function(a) {
                    a ||
                        0 !== a && (a = this._time);
                    var b, c = this.getLabelsArray(),
                        d = c.length;
                    for (b = 0; d > b; b++)
                        if (c[b].time > a) return c[b].name;
                    return null
                }, a.getLabelBefore = function(a) {
                    null == a && (a = this._time);
                    for (var b = this.getLabelsArray(), c = b.length; - 1 < --c;)
                        if (b[c].time < a) return b[c].name;
                    return null
                }, a.getLabelsArray = function() {
                    var a, b = [],
                        c = 0;
                    for (a in this._labels) b[c++] = {
                        time: this._labels[a],
                        name: a
                    };
                    return b.sort(function(a, b) {
                        return a.time - b.time
                    }), b
                }, a.invalidate = function() {
                    return this._locked = !1, b.prototype.invalidate.call(this)
                },
                a.progress = function(a, b) {
                    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - a : a) + this._cycle * (this._duration + this._repeatDelay), b) : this._time / this.duration() || 0
                }, a.totalProgress = function(a, b) {
                    return arguments.length ? this.totalTime(this.totalDuration() * a, b) : this._totalTime / this.totalDuration() || 0
                }, a.totalDuration = function(a) {
                    return arguments.length ? -1 !== this._repeat && a ? this.timeScale(this.totalDuration() / a) : this : (this._dirty && (b.prototype.totalDuration.call(this),
                        this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat), this._totalDuration)
                }, a.time = function(a, b) {
                    return arguments.length ? (this._dirty && this.totalDuration(), a > this._duration && (a = this._duration), this._yoyo && 0 !== (1 & this._cycle) ? a = this._duration - a + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (a += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(a, b)) : this._time
                }, a.repeat = function(a) {
                    return arguments.length ? (this._repeat =
                        a, this._uncache(!0)) : this._repeat
                }, a.repeatDelay = function(a) {
                    return arguments.length ? (this._repeatDelay = a, this._uncache(!0)) : this._repeatDelay
                }, a.yoyo = function(a) {
                    return arguments.length ? (this._yoyo = a, this) : this._yoyo
                }, a.currentLabel = function(a) {
                    return arguments.length ? this.seek(a, !0) : this.getLabelBefore(this._time + 1E-8)
                }, d
        }, !0);
    (function() {
        var b = 180 / Math.PI,
            c = [],
            a = [],
            d = [],
            f = {},
            e = _gsScope._gsDefine.globals,
            g = function(a, b, c, d) {
                c === d && (c = d - (d - b) / 1E6);
                a === b && (b = a + (c - a) / 1E6);
                this.a = a;
                this.b = b;
                this.c =
                    c;
                this.d = d;
                this.da = d - a;
                this.ca = c - a;
                this.ba = b - a
            },
            k = function(a, b, c, d) {
                var f = {
                        a: a
                    },
                    e = {},
                    g = {},
                    k = {
                        c: d
                    },
                    h = (a + b) / 2,
                    l = (b + c) / 2;
                c = (c + d) / 2;
                b = (h + l) / 2;
                var l = (l + c) / 2,
                    n = (l - b) / 8;
                return f.b = h + (a - h) / 4, e.b = b + n, f.c = e.a = (f.b + e.b) / 2, e.c = g.a = (b + l) / 2, g.b = l - n, k.b = c + (d - c) / 4, g.c = k.a = (g.b + k.b) / 2, [f, e, g, k]
            },
            h = function(b, e, h, l, m, p) {
                var q, t, n, T, K = {},
                    O = [],
                    E = p || b[0];
                m = "string" == typeof m ? "," + m + "," : ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,";
                null == e && (e = 1);
                for (t in b[0]) O.push(t);
                if (1 < b.length) {
                    n = b[b.length - 1];
                    T = !0;
                    for (q = O.length; - 1 < --q;)
                        if (t = O[q], .05 < Math.abs(E[t] - n[t])) {
                            T = !1;
                            break
                        }
                    T && (b = b.concat(), p && b.unshift(p), b.push(b[1]), p = b[b.length - 3])
                }
                c.length = a.length = d.length = 0;
                for (q = O.length; - 1 < --q;) {
                    t = O[q];
                    f[t] = -1 !== m.indexOf("," + t + ",");
                    n = t;
                    var E = b,
                        B = t,
                        I = f[t],
                        F = p,
                        R = void 0,
                        H = void 0,
                        W = void 0,
                        C = void 0,
                        fa = void 0,
                        W = void 0,
                        Z = [];
                    if (F)
                        for (E = [F].concat(E), H = E.length; - 1 < --H;) "string" == typeof(W = E[H][B]) && "=" === W.charAt(1) && (E[H][B] = F[B] + Number(W.charAt(0) +
                            W.substr(2)));
                    if (R = E.length - 2, 0 > R) E = (Z[0] = new g(E[0][B], 0, 0, E[0][B]), Z);
                    else {
                        for (H = 0; R > H; H++) W = E[H][B], C = E[H + 1][B], Z[H] = new g(W, 0, 0, C), I && (fa = E[H + 2][B], c[H] = (c[H] || 0) + (C - W) * (C - W), a[H] = (a[H] || 0) + (fa - C) * (fa - C));
                        E = (Z[H] = new g(E[H][B], 0, 0, E[H + 1][B]), Z)
                    }
                    K[n] = E
                }
                for (q = c.length; - 1 < --q;) c[q] = Math.sqrt(c[q]), a[q] = Math.sqrt(a[q]);
                if (!l) {
                    for (q = O.length; - 1 < --q;)
                        if (f[t])
                            for (b = K[O[q]], n = b.length - 1, m = 0; n > m; m++) p = b[m + 1].da / a[m] + b[m].da / c[m] || 0, d[m] = (d[m] || 0) + p * p;
                    for (q = d.length; - 1 < --q;) d[q] = Math.sqrt(d[q])
                }
                q = O.length;
                for (m = h ? 4 : 1; - 1 < --q;) {
                    t = O[q];
                    p = b = K[t];
                    n = e;
                    E = h;
                    B = l;
                    t = f[t];
                    for (var na = void 0, ia = C = W = Z = fa = void 0, G = void 0, y = void 0, la = p.length - 1, ma = 0, Y = p[0].a, I = 0; la > I; I++) H = p[ma], F = H.a, R = H.d, na = p[ma + 1].d, t ? (ia = c[I], G = a[I], y = (G + ia) * n * .25 / (B ? .5 : d[I] || .5), fa = R - (R - F) * (B ? .5 * n : 0 !== ia ? y / ia : 0), Z = R + (na - R) * (B ? .5 * n : 0 !== G ? y / G : 0), W = R - (fa + ((Z - fa) * (3 * ia / (ia + G) + .5) / 4 || 0))) : (fa = R - (R - F) * n * .5, Z = R + (na - R) * n * .5, W = R - (fa + Z) / 2), fa += W, Z += W, H.c = na = fa, 0 !== I ? H.b = Y : H.b = Y = H.a + .6 * (H.c - H.a), H.da = R - F, H.ca = na - F, H.ba = Y - F, E ? (C = k(F, Y, na, R), p.splice(ma,
                        1, C[0], C[1], C[2], C[3]), ma += 4) : ma++, Y = Z;
                    H = p[ma];
                    H.b = Y;
                    H.c = Y + .4 * (H.d - Y);
                    H.da = H.d - H.a;
                    H.ca = H.c - H.a;
                    H.ba = Y - H.a;
                    E && (C = k(H.a, Y, H.c, H.d), p.splice(ma, 1, C[0], C[1], C[2], C[3]));
                    T && (b.splice(0, m), b.splice(b.length - m, m))
                }
                return K
            },
            l = _gsScope._gsDefine.plugin({
                propName: "bezier",
                priority: -1,
                version: "1.3.8",
                API: 2,
                global: !0,
                init: function(a, b, c) {
                    this._target = a;
                    b instanceof Array && (b = {
                        values: b
                    });
                    this._func = {};
                    this._mod = {};
                    this._props = [];
                    this._timeRes = null == b.timeResolution ? 6 : parseInt(b.timeResolution, 10);
                    var d, f, e,
                        k, l, n = b.values || [],
                        T = {};
                    e = n[0];
                    this._autoRotate = (f = b.autoRotate || c.vars.orientToBezier) ? f instanceof Array ? f : [
                        ["x", "y", "rotation", !0 === f ? 0 : Number(f) || 0]
                    ] : null;
                    for (d in e) this._props.push(d);
                    for (e = this._props.length; - 1 < --e;) d = this._props[e], this._overwriteProps.push(d), f = this._func[d] = "function" == typeof a[d], T[d] = f ? a[d.indexOf("set") || "function" != typeof a["get" + d.substr(3)] ? d : "get" + d.substr(3)]() : parseFloat(a[d]), l || T[d] !== n[0][d] && (l = T);
                    if ("cubic" !== b.type && "quadratic" !== b.type && "soft" !== b.type) T =
                        h(n, isNaN(b.curviness) ? 1 : b.curviness, !1, "thruBasic" === b.type, b.correlate, l);
                    else {
                        e = n;
                        var n = (n = b.type) || "soft",
                            K, O, E, B, I, F, R;
                        b = {};
                        l = "cubic" === n ? 3 : 2;
                        var H = "soft" === n,
                            W = [];
                        if (H && T && (e = [T].concat(e)), null == e || e.length < l + 1) throw "invalid Bezier data";
                        for (K in e[0]) W.push(K);
                        for (B = W.length; - 1 < --B;) {
                            K = W[B];
                            b[K] = f = [];
                            R = 0;
                            F = e.length;
                            for (I = 0; F > I; I++) n = null == T ? e[I][K] : "string" == typeof(O = e[I][K]) && "=" === O.charAt(1) ? T[K] + Number(O.charAt(0) + O.substr(2)) : Number(O), H && 1 < I && F - 1 > I && (f[R++] = (n + f[R - 2]) / 2), f[R++] = n;
                            F =
                                R - l + 1;
                            for (I = R = 0; F > I; I += l) n = f[I], K = f[I + 1], O = f[I + 2], E = 2 === l ? 0 : f[I + 3], f[R++] = O = 3 === l ? new g(n, K, O, E) : new g(n, (2 * K + n) / 3, (2 * K + O) / 3, O);
                            f.length = R
                        }
                        T = b
                    }
                    if (this._beziers = T, this._segCount = this._beziers[d].length, this._timeRes) {
                        f = this._beziers;
                        d = this._timeRes;
                        d = d >> 0 || 6;
                        T = [];
                        K = [];
                        e = O = 0;
                        b = d - 1;
                        l = [];
                        n = [];
                        for (k in f) {
                            B = f[k];
                            I = T;
                            F = d;
                            var C = void 0,
                                fa = void 0,
                                Z = void 0,
                                na = void 0,
                                ia = void 0,
                                W = 1 / F;
                            for (E = B.length; - 1 < --E;)
                                for (Z = B[E], fa = Z.a, R = Z.d - fa, H = Z.c - fa, Z = Z.b - fa, fa = 0, na = 1; F >= na; na++) C = W * na, ia = 1 - C, C = fa - (fa = (C * C * R + 3 * ia * (C *
                                    H + ia * Z)) * C), ia = E * F + na - 1, I[ia] = (I[ia] || 0) + C * C
                        }
                        f = T.length;
                        for (k = 0; f > k; k++) O += Math.sqrt(T[k]), B = k % d, n[B] = O, B === b && (e += O, B = k / d >> 0, l[B] = n, K[B] = e, O = 0, n = []);
                        this._length = e;
                        this._lengths = K;
                        this._segments = l;
                        this._l1 = this._li = this._s1 = this._si = 0;
                        this._l2 = this._lengths[0];
                        this._curSeg = this._segments[0];
                        this._s2 = this._curSeg[0];
                        this._prec = 1 / this._curSeg.length
                    }
                    if (f = this._autoRotate)
                        for (this._initialRotations = [], f[0] instanceof Array || (this._autoRotate = f = [f]), e = f.length; - 1 < --e;) {
                            for (k = 0; 3 > k; k++) d = f[e][k], this._func[d] =
                                "function" == typeof a[d] ? a[d.indexOf("set") || "function" != typeof a["get" + d.substr(3)] ? d : "get" + d.substr(3)] : !1;
                            d = f[e][2];
                            this._initialRotations[e] = (this._func[d] ? this._func[d].call(this._target) : this._target[d]) || 0;
                            this._overwriteProps.push(d)
                        }
                    return this._startRatio = c.vars.runBackwards ? 1 : 0, !0
                },
                set: function(a) {
                    var c, d, f, e, g, k;
                    g = this._segCount;
                    var h = this._func,
                        l = this._target,
                        n = a !== this._startRatio;
                    if (this._timeRes) {
                        if (c = this._lengths, e = this._curSeg, a *= this._length, f = this._li, a > this._l2 && g - 1 > f) {
                            for (--g; g >
                                f && (this._l2 = c[++f]) <= a;);
                            this._l1 = c[f - 1];
                            this._li = f;
                            this._curSeg = e = this._segments[f];
                            this._s2 = e[this._s1 = this._si = 0]
                        } else if (a < this._l1 && 0 < f) {
                            for (; 0 < f && (this._l1 = c[--f]) >= a;);
                            0 === f && a < this._l1 ? this._l1 = 0 : f++;
                            this._l2 = c[f];
                            this._li = f;
                            this._curSeg = e = this._segments[f];
                            this._s1 = e[(this._si = e.length - 1) - 1] || 0;
                            this._s2 = e[this._si]
                        }
                        if (c = f, a -= this._l1, f = this._si, a > this._s2 && f < e.length - 1) {
                            for (g = e.length - 1; g > f && (this._s2 = e[++f]) <= a;);
                            this._s1 = e[f - 1];
                            this._si = f
                        } else if (a < this._s1 && 0 < f) {
                            for (; 0 < f && (this._s1 = e[--f]) >=
                                a;);
                            0 === f && a < this._s1 ? this._s1 = 0 : f++;
                            this._s2 = e[f];
                            this._si = f
                        }
                        g = (f + (a - this._s1) / (this._s2 - this._s1)) * this._prec || 0
                    } else c = 0 > a ? 0 : 1 <= a ? g - 1 : g * a >> 0, g *= a - 1 / g * c;
                    d = 1 - g;
                    for (f = this._props.length; - 1 < --f;) a = this._props[f], e = this._beziers[a][c], k = (g * g * e.da + 3 * d * (g * e.ca + d * e.ba)) * g + e.a, this._mod[a] && (k = this._mod[a](k, l)), h[a] ? l[a](k) : l[a] = k;
                    if (this._autoRotate) {
                        var K, O, E, B, I, F, R = this._autoRotate;
                        for (f = R.length; - 1 < --f;) a = R[f][2], I = R[f][3] || 0, F = !0 === R[f][4] ? 1 : b, e = this._beziers[R[f][0]], d = this._beziers[R[f][1]], e &&
                            d && (e = e[c], d = d[c], K = e.a + (e.b - e.a) * g, E = e.b + (e.c - e.b) * g, K += (E - K) * g, E += (e.c + (e.d - e.c) * g - E) * g, O = d.a + (d.b - d.a) * g, B = d.b + (d.c - d.b) * g, O += (B - O) * g, B += (d.c + (d.d - d.c) * g - B) * g, k = n ? Math.atan2(B - O, E - K) * F + I : this._initialRotations[f], this._mod[a] && (k = this._mod[a](k, l)), h[a] ? l[a](k) : l[a] = k)
                    }
                }
            }),
            n = l.prototype;
        l.bezierThrough = h;
        l.cubicToQuadratic = k;
        l._autoCSS = !0;
        l.quadraticToCubic = function(a, b, c) {
            return new g(a, (2 * b + a) / 3, (2 * b + c) / 3, c)
        };
        l._cssRegister = function() {
            var a = e.CSSPlugin;
            if (a) {
                var a = a._internals,
                    b = a._parseToProxy,
                    c = a._setPluginRatio,
                    d = a.CSSPropTween;
                a._registerComplexSpecialProp("bezier", {
                    parser: function(a, f, e, g, k, h) {
                        f instanceof Array && (f = {
                            values: f
                        });
                        h = new l;
                        var n, u, E = f.values,
                            B = E.length - 1,
                            I = [],
                            F = {};
                        if (0 > B) return k;
                        for (e = 0; B >= e; e++) u = b(a, E[e], g, k, h, B !== e), I[e] = u.end;
                        for (n in f) F[n] = f[n];
                        return F.values = I, k = new d(a, "bezier", 0, 0, u.pt, 2), k.data = u, k.plugin = h, k.setRatio = c, 0 === F.autoRotate && (F.autoRotate = !0), !F.autoRotate || F.autoRotate instanceof Array || (e = !0 === F.autoRotate ? 0 : Number(F.autoRotate), F.autoRotate =
                            null != u.end.left ? [
                                ["left", "top", "rotation", e, !1]
                            ] : null != u.end.x ? [
                                ["x", "y", "rotation", e, !1]
                            ] : !1), F.autoRotate && (g._transform || g._enableTransforms(!1), u.autoRotate = g._target._gsTransform, u.proxy.rotation = u.autoRotate.rotation || 0, g._overwriteProps.push("rotation")), h._onInitTween(u.proxy, F, g._tween), k
                    }
                })
            }
        };
        n._mod = function(a) {
            for (var b, c = this._overwriteProps, d = c.length; - 1 < --d;)(b = a[c[d]]) && "function" == typeof b && (this._mod[c[d]] = b)
        };
        n._kill = function(a) {
            var b, c, d = this._props;
            for (b in this._beziers)
                if (b in
                    a)
                    for (delete this._beziers[b], delete this._func[b], c = d.length; - 1 < --c;) d[c] === b && d.splice(c, 1);
            if (d = this._autoRotate)
                for (c = d.length; - 1 < --c;) a[d[c][2]] && d.splice(c, 1);
            return this._super._kill.call(this, a)
        }
    })();
    _gsScope._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"], function(b, c) {
        var a, d, f, e, g = function() {
                b.call(this, "css");
                this._overwriteProps.length = 0;
                this.setRatio = g.prototype.setRatio
            },
            k = _gsScope._gsDefine.globals,
            h = {},
            l = g.prototype = new b("css");
        l.constructor = g;
        g.version = "2.0.2";
        g.API = 2;
        g.defaultTransformPerspective = 0;
        g.defaultSkewType = "compensated";
        g.defaultSmoothOrigin = !0;
        l = "px";
        g.suffixMap = {
            top: l,
            right: l,
            bottom: l,
            left: l,
            width: l,
            height: l,
            fontSize: l,
            padding: l,
            margin: l,
            perspective: l,
            lineHeight: ""
        };
        var n, u, J, z, V, m, p, q, t = /(?:\-|\.|\b)(\d|\.|e\-)+/g,
            X = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
            T = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,
            K = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g,
            O = /(?:\d|\-|\+|=|#|\.)*/g,
            E = /opacity *= *([^)]*)/i,
            B = /opacity:([^;]*)/i,
            I =
            /alpha\(opacity *=.+?\)/i,
            F = /^(rgb|hsl)/,
            R = /([A-Z])/g,
            H = /-([a-z])/gi,
            W = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,
            C = function(a, b) {
                return b.toUpperCase()
            },
            fa = /(?:Left|Right|Width)/i,
            Z = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
            na = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
            ia = /,(?=[^\)]*(?:\(|$))/gi,
            G = /[\s,\(]/i,
            y = Math.PI / 180,
            la = 180 / Math.PI,
            ma = {},
            Y = {
                style: {}
            },
            ca = _gsScope.document || {
                createElement: function() {
                    return Y
                }
            },
            ja = function(a, b) {
                return ca.createElementNS ? ca.createElementNS(b || "http://www.w3.org/1999/xhtml",
                    a) : ca.createElement(a)
            },
            qa = ja("div"),
            pa = ja("img"),
            ka = g._internals = {
                _specialProps: h
            },
            aa = (_gsScope.navigator || {}).userAgent || "",
            D = function() {
                var a = aa.indexOf("Android"),
                    b = ja("a");
                return J = -1 !== aa.indexOf("Safari") && -1 === aa.indexOf("Chrome") && (-1 === a || 3 < parseFloat(aa.substr(a + 8, 2))), V = J && 6 > parseFloat(aa.substr(aa.indexOf("Version/") + 8, 2)), z = -1 !== aa.indexOf("Firefox"), (/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(aa) || /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(aa)) && (m = parseFloat(RegExp.$1)), b ? (b.style.cssText =
                    "top:1px;opacity:.55;", /^0.55/.test(b.style.opacity)) : !1
            }(),
            va = function(a) {
                return E.test("string" == typeof a ? a : (a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1
            },
            Ca = "",
            Fa = "",
            xa = function(a, b) {
                b = b || qa;
                var c, d, f = b.style;
                if (void 0 !== f[a]) return a;
                a = a.charAt(0).toUpperCase() + a.substr(1);
                c = ["O", "Moz", "ms", "Ms", "Webkit"];
                for (d = 5; - 1 < --d && void 0 === f[c[d] + a];);
                return 0 <= d ? (Fa = 3 === d ? "ms" : c[d], Ca = "-" + Fa.toLowerCase() + "-", Fa + a) : null
            },
            oa = ("undefined" != typeof window ? window : ca.defaultView || {
                getComputedStyle: function() {}
            }).getComputedStyle,
            ba = g.getStyle = function(a, b, c, d, f) {
                var e;
                return D || "opacity" !== b ? (!d && a.style[b] ? e = a.style[b] : (c = c || oa(a)) ? e = c[b] || c.getPropertyValue(b) || c.getPropertyValue(b.replace(R, "-$1").toLowerCase()) : a.currentStyle && (e = a.currentStyle[b]), null == f || e && "none" !== e && "auto" !== e && "auto auto" !== e ? e : f) : va(a)
            },
            r = ka.convertToPixels = function(a, b, d, f, e) {
                if ("px" === f || !f && "lineHeight" !== b) return d;
                if ("auto" === f || !d) return 0;
                var k, Ia, p, h = fa.test(b),
                    l = a;
                k = qa.style;
                var v = 0 > d,
                    x = 1 === d;
                if (v && (d = -d), x && (d *= 100), "lineHeight" !== b || f)
                    if ("%" === f && -1 !== b.indexOf("border")) k = d / 100 * (h ? a.clientWidth : a.clientHeight);
                    else {
                        if (k.cssText = "border:0 solid red;position:" + ba(a, "position") + ";line-height:0;", "%" !== f && l.appendChild && "v" !== f.charAt(0) && "rem" !== f) k[h ? "borderLeftWidth" : "borderTopWidth"] = d + f;
                        else {
                            if (l = a.parentNode || ca.body, -1 !== ba(l, "display").indexOf("flex") && (k.position = "absolute"), Ia = l._gsCache, p = c.ticker.frame, Ia && h && Ia.time === p) return Ia.width * d / 100;
                            k[h ? "width" : "height"] = d +
                                f
                        }
                        l.appendChild(qa);
                        k = parseFloat(qa[h ? "offsetWidth" : "offsetHeight"]);
                        l.removeChild(qa);
                        h && "%" === f && !1 !== g.cacheWidths && (Ia = l._gsCache = l._gsCache || {}, Ia.time = p, Ia.width = k / d * 100);
                        0 !== k || e || (k = r(a, b, d, f, !0))
                    } else Ia = oa(a).lineHeight, a.style.lineHeight = d, k = parseFloat(oa(a).lineHeight), a.style.lineHeight = Ia;
                return x && (k /= 100), v ? -k : k
            },
            v = ka.calculateOffset = function(a, b, c) {
                if ("absolute" !== ba(a, "position", c)) return 0;
                var d = "left" === b ? "Left" : "Top";
                c = ba(a, "margin" + d, c);
                return a["offset" + d] - (r(a, b, parseFloat(c),
                    c.replace(O, "")) || 0)
            },
            w = function(a, b) {
                var c, d, f, e = {};
                if (b = b || oa(a, null))
                    if (c = b.length)
                        for (; - 1 < --c;) f = b[c], -1 !== f.indexOf("-transform") && mb !== f || (e[f.replace(H, C)] = b.getPropertyValue(f));
                    else
                        for (c in b) - 1 !== c.indexOf("Transform") && wa !== c || (e[c] = b[c]);
                else if (b = a.currentStyle || a.style)
                    for (c in b) "string" == typeof c && void 0 === e[c] && (e[c.replace(H, C)] = b[c]);
                return D || (e.opacity = va(a)), d = Ja(a, b, !1), e.rotation = d.rotation, e.skewX = d.skewX, e.scaleX = d.scaleX, e.scaleY = d.scaleY, e.x = d.x, e.y = d.y, Aa && (e.z = d.z, e.rotationX =
                    d.rotationX, e.rotationY = d.rotationY, e.scaleZ = d.scaleZ), e.filters && delete e.filters, e
            },
            A = function(a, b, c, d, f) {
                var e, g, r, k = {},
                    p = a.style;
                for (g in c) "cssText" !== g && "length" !== g && isNaN(g) && (b[g] !== (e = c[g]) || f && f[g]) && -1 === g.indexOf("Origin") && ("number" == typeof e || "string" == typeof e) && (k[g] = "auto" !== e || "left" !== g && "top" !== g ? "" !== e && "auto" !== e && "none" !== e || "string" != typeof b[g] || "" === b[g].replace(K, "") ? e : 0 : v(a, g), void 0 !== p[g] && (r = new da(p, g, p[g], r)));
                if (d)
                    for (g in d) "className" !== g && (k[g] = d[g]);
                return {
                    difs: k,
                    firstMPT: r
                }
            },
            L = {
                width: ["Left", "Right"],
                height: ["Top", "Bottom"]
            },
            S = ["marginLeft", "marginRight", "marginTop", "marginBottom"],
            M = function(a, b) {
                if ("contain" === a || "auto" === a || "auto auto" === a) return a + " ";
                null != a && "" !== a || (a = "0 0");
                var c, d = a.split(" ");
                c = -1 !== a.indexOf("left") ? "0%" : -1 !== a.indexOf("right") ? "100%" : d[0];
                var f = -1 !== a.indexOf("top") ? "0%" : -1 !== a.indexOf("bottom") ? "100%" : d[1];
                if (3 < d.length && !b) {
                    d = a.split(", ").join(",").split(",");
                    a = [];
                    for (c = 0; c < d.length; c++) a.push(M(d[c]));
                    return a.join(",")
                }
                return null ==
                    f ? f = "center" === c ? "50%" : "0" : "center" === f && (f = "50%"), ("center" === c || isNaN(parseFloat(c)) && -1 === (c + "").indexOf("=")) && (c = "50%"), a = c + " " + f + (2 < d.length ? " " + d[2] : ""), b && (b.oxp = -1 !== c.indexOf("%"), b.oyp = -1 !== f.indexOf("%"), b.oxr = "=" === c.charAt(1), b.oyr = "=" === f.charAt(1), b.ox = parseFloat(c.replace(K, "")), b.oy = parseFloat(f.replace(K, "")), b.v = a), b || a
            },
            P = function(a, b) {
                return "function" == typeof a && (a = a(q, p)), "string" == typeof a && "=" === a.charAt(1) ? parseInt(a.charAt(0) + "1", 10) * parseFloat(a.substr(2)) : parseFloat(a) -
                    parseFloat(b) || 0
            },
            N = function(a, b) {
                "function" == typeof a && (a = a(q, p));
                var c = "string" == typeof a && "=" === a.charAt(1);
                return "string" == typeof a && "v" === a.charAt(a.length - 2) && (a = (c ? a.substr(0, 2) : 0) + window["inner" + ("vh" === a.substr(-2) ? "Height" : "Width")] * (parseFloat(c ? a.substr(2) : a) / 100)), null == a ? b : c ? parseInt(a.charAt(0) + "1", 10) * parseFloat(a.substr(2)) + b : parseFloat(a) || 0
            },
            Ga = function(a, b, c, d) {
                var f, e, g, r;
                return "function" == typeof a && (a = a(q, p)), null == a ? g = b : "number" == typeof a ? g = a : (f = a.split("_"), r = "=" === a.charAt(1),
                    e = (r ? parseInt(a.charAt(0) + "1", 10) * parseFloat(f[0].substr(2)) : parseFloat(f[0])) * (-1 === a.indexOf("rad") ? 1 : la) - (r ? 0 : b), f.length && (d && (d[c] = b + e), -1 !== a.indexOf("short") && (e %= 360, e !== e % 180 && (e = 0 > e ? e + 360 : e - 360)), -1 !== a.indexOf("_cw") && 0 > e ? e = (e + 3599999999640) % 360 - 360 * (e / 360 | 0) : -1 !== a.indexOf("ccw") && 0 < e && (e = (e - 3599999999640) % 360 - 360 * (e / 360 | 0))), g = b + e), 1E-6 > g && -1E-6 < g && (g = 0), g
            },
            ua = {
                aqua: [0, 255, 255],
                lime: [0, 255, 0],
                silver: [192, 192, 192],
                black: [0, 0, 0],
                maroon: [128, 0, 0],
                teal: [0, 128, 128],
                blue: [0, 0, 255],
                navy: [0,
                    0, 128
                ],
                white: [255, 255, 255],
                fuchsia: [255, 0, 255],
                olive: [128, 128, 0],
                yellow: [255, 255, 0],
                orange: [255, 165, 0],
                gray: [128, 128, 128],
                purple: [128, 0, 128],
                green: [0, 128, 0],
                red: [255, 0, 0],
                pink: [255, 192, 203],
                cyan: [0, 255, 255],
                transparent: [255, 255, 255, 0]
            },
            La = function(a, b, c) {
                return a = 0 > a ? a + 1 : 1 < a ? a - 1 : a, 255 * (1 > 6 * a ? b + (c - b) * a * 6 : .5 > a ? c : 2 > 3 * a ? b + (c - b) * (2 / 3 - a) * 6 : b) + .5 | 0
            },
            Ba = g.parseColor = function(a, b) {
                var c, d, f, e, g, r, k, p, h, l, v;
                if (a)
                    if ("number" == typeof a) c = [a >> 16, a >> 8 & 255, 255 & a];
                    else {
                        if ("," === a.charAt(a.length - 1) && (a = a.substr(0,
                                a.length - 1)), ua[a]) c = ua[a];
                        else if ("#" === a.charAt(0)) 4 === a.length && (d = a.charAt(1), f = a.charAt(2), e = a.charAt(3), a = "#" + d + d + f + f + e + e), a = parseInt(a.substr(1), 16), c = [a >> 16, a >> 8 & 255, 255 & a];
                        else if ("hsl" === a.substr(0, 3))
                            if (c = v = a.match(t), b) {
                                if (-1 !== a.indexOf("=")) return a.match(X)
                            } else g = Number(c[0]) % 360 / 360, r = Number(c[1]) / 100, k = Number(c[2]) / 100, f = .5 >= k ? k * (r + 1) : k + r - k * r, d = 2 * k - f, 3 < c.length && (c[3] = Number(c[3])), c[0] = La(g + 1 / 3, d, f), c[1] = La(g, d, f), c[2] = La(g - 1 / 3, d, f);
                        else c = a.match(t) || ua.transparent;
                        c[0] = Number(c[0]);
                        c[1] = Number(c[1]);
                        c[2] = Number(c[2]);
                        3 < c.length && (c[3] = Number(c[3]))
                    } else c = ua.black;
                return b && !v && (d = c[0] / 255, f = c[1] / 255, e = c[2] / 255, p = Math.max(d, f, e), h = Math.min(d, f, e), k = (p + h) / 2, p === h ? g = r = 0 : (l = p - h, r = .5 < k ? l / (2 - p - h) : l / (p + h), g = p === d ? (f - e) / l + (e > f ? 6 : 0) : p === f ? (e - d) / l + 2 : (d - f) / l + 4, g *= 60), c[0] = g + .5 | 0, c[1] = 100 * r + .5 | 0, c[2] = 100 * k + .5 | 0), c
            },
            Ta = function(a, b) {
                var c, d, f, e = a.match(x) || [],
                    g = 0,
                    r = "";
                if (!e.length) return a;
                for (c = 0; c < e.length; c++) d = e[c], f = a.substr(g, a.indexOf(d, g) - g), g += f.length + d.length, d = Ba(d, b), 3 === d.length &&
                    d.push(1), r += f + (b ? "hsla(" + d[0] + "," + d[1] + "%," + d[2] + "%," + d[3] : "rgba(" + d.join(",")) + ")";
                return r + a.substr(g)
            },
            x = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b";
        for (l in ua) x += "|" + l + "\\b";
        x = new RegExp(x + ")", "gi");
        g.colorStringFilter = function(a) {
            var b, c = a[0] + " " + a[1];
            x.test(c) && (b = -1 !== c.indexOf("hsl(") || -1 !== c.indexOf("hsla("), a[0] = Ta(a[0], b), a[1] = Ta(a[1], b));
            x.lastIndex = 0
        };
        c.defaultStringFilter || (c.defaultStringFilter = g.colorStringFilter);
        var U = function(a, b, c, d) {
                if (null == a) return function(a) {
                    return a
                };
                var f, e = b ? (a.match(x) || [""])[0] : "",
                    g = a.split(e).join("").match(T) || [],
                    r = a.substr(0, a.indexOf(g[0])),
                    k = ")" === a.charAt(a.length - 1) ? ")" : "",
                    p = -1 !== a.indexOf(" ") ? " " : ",",
                    h = g.length,
                    l = 0 < h ? g[0].replace(t, "") : "";
                return h ? f = b ? function(a) {
                    var b, Xa, Ka;
                    if ("number" == typeof a) a += l;
                    else if (d && ia.test(a)) {
                        a = a.replace(ia, "|").split("|");
                        for (Ka = 0; Ka < a.length; Ka++) a[Ka] = f(a[Ka]);
                        return a.join(",")
                    }
                    if (b = (a.match(x) || [e])[0], Xa = a.split(b).join("").match(T) || [], Ka = Xa.length, h > Ka--)
                        for (; ++Ka < h;) Xa[Ka] = c ? Xa[(Ka - 1) / 2 | 0] :
                            g[Ka];
                    return r + Xa.join(p) + p + b + k + (-1 !== a.indexOf("inset") ? " inset" : "")
                } : function(a) {
                    var b, e;
                    if ("number" == typeof a) a += l;
                    else if (d && ia.test(a)) {
                        a = a.replace(ia, "|").split("|");
                        for (e = 0; e < a.length; e++) a[e] = f(a[e]);
                        return a.join(",")
                    }
                    if (b = a.match(T) || [], e = b.length, h > e--)
                        for (; ++e < h;) b[e] = c ? b[(e - 1) / 2 | 0] : g[e];
                    return r + b.join(p) + k
                } : function(a) {
                    return a
                }
            },
            Sa = function(a) {
                return a = a.split(","),
                    function(b, c, d, f, e, g, r) {
                        d = (c + "").split(" ");
                        r = {};
                        for (c = 0; 4 > c; c++) r[a[c]] = d[c] = d[c] || d[(c - 1) / 2 >> 0];
                        return f.parse(b, r, e,
                            g)
                    }
            },
            da = (ka._setPluginRatio = function(a) {
                this.plugin.setRatio(a);
                var b, c, d;
                d = this.data;
                for (var f = d.proxy, e = d.firstMPT; e;) b = f[e.v], e.r ? b = e.r(b) : 1E-6 > b && -1E-6 < b && (b = 0), e.t[e.p] = b, e = e._next;
                if (d.autoRotate && (d.autoRotate.rotation = d.mod ? d.mod.call(this._tween, f.rotation, this.t, this._tween) : f.rotation), 1 === a || 0 === a)
                    for (e = d.firstMPT, d = 1 === a ? "e" : "b"; e;) {
                        if (c = e.t, c.type) {
                            if (1 === c.type) {
                                b = c.xs0 + c.s + c.xs1;
                                for (a = 1; a < c.l; a++) b += c["xn" + a] + c["xs" + (a + 1)];
                                c[d] = b
                            }
                        } else c[d] = c.s + c.xs0;
                        e = e._next
                    }
            }, function(a, b, c, d, f) {
                this.t =
                    a;
                this.p = b;
                this.v = c;
                this.r = f;
                d && (d._prev = this, this._next = d)
            }),
            ya = (ka._parseToProxy = function(a, b, c, d, f, e) {
                var g, r, k, p = d,
                    h = {},
                    l = {};
                r = c._transform;
                var v = ma;
                c._transform = null;
                ma = b;
                d = a = c.parse(a, b, d, f);
                ma = v;
                for (e && (c._transform = r, p && (p._prev = null, p._prev && (p._prev._next = null))); d && d !== p;) {
                    if (1 >= d.type && (g = d.p, l[g] = d.s + d.c, h[g] = d.s, e || (k = new da(d, "s", g, k, d.r), d.c = 0), 1 === d.type))
                        for (c = d.l; 0 < --c;) r = "xn" + c, g = d.p + "_" + r, l[g] = d.data[r], h[g] = d[r], e || (k = new da(d, r, g, k, d.rxp[r]));
                    d = d._next
                }
                return {
                    proxy: h,
                    end: l,
                    firstMPT: k,
                    pt: a
                }
            }, ka.CSSPropTween = function(b, c, d, f, g, r, k, p, h, l, v) {
                this.t = b;
                this.p = c;
                this.s = d;
                this.c = f;
                this.n = k || c;
                b instanceof ya || e.push(this.n);
                this.r = p ? "function" == typeof p ? p : Math.round : p;
                this.type = r || 0;
                h && (this.pr = h, a = !0);
                this.b = void 0 === l ? d : l;
                this.e = void 0 === v ? d + f : v;
                g && (this._next = g, g._prev = this)
            }),
            Ua = function(a, b, c, d, f, e) {
                a = new ya(a, b, c, d - c, f, -1, e);
                return a.b = c, a.e = a.xs0 = d, a
            },
            gb = g.parseComplex = function(a, b, c, d, f, e, r, k, h, l) {
                c = c || e || "";
                "function" == typeof d && (d = d(q, p));
                r = new ya(a, b, 0, 0, r, l ? 2 : 1,
                    null, !1, k, c, d);
                d += "";
                f && x.test(d + c) && (d = [c, d], g.colorStringFilter(d), c = d[0], d = d[1]);
                var v, w, A, m, U;
                a = c.split(", ").join(",").split(" ");
                b = d.split(", ").join(",").split(" ");
                k = a.length;
                var L = !1 !== n;
                (-1 !== d.indexOf(",") || -1 !== c.indexOf(",")) && (-1 !== (d + c).indexOf("rgb") || -1 !== (d + c).indexOf("hsl") ? (a = a.join(" ").replace(ia, ", ").split(" "), b = b.join(" ").replace(ia, ", ").split(" ")) : (a = a.join(" ").split(",").join(", ").split(" "), b = b.join(" ").split(",").join(", ").split(" ")), k = a.length);
                k !== b.length &&
                    (a = (e || "").split(" "), k = a.length);
                r.plugin = h;
                r.setRatio = l;
                for (c = x.lastIndex = 0; k > c; c++)
                    if (w = a[c], h = b[c] + "", m = parseFloat(w), m || 0 === m) r.appendXtra("", m, P(h, m), h.replace(X, ""), L && -1 !== h.indexOf("px") ? Math.round : !1, !0);
                    else if (f && x.test(w)) v = h.indexOf(")") + 1, v = ")" + (v ? h.substr(v) : ""), U = -1 !== h.indexOf("hsl") && D, e = h, w = Ba(w, U), h = Ba(h, U), (l = 6 < w.length + h.length) && !D && 0 === h[3] ? (r["xs" + r.l] += r.l ? " transparent" : "transparent", r.e = r.e.split(b[c]).join("transparent")) : (D || (l = !1), U ? r.appendXtra(e.substr(0, e.indexOf("hsl")) +
                    (l ? "hsla(" : "hsl("), w[0], P(h[0], w[0]), ",", !1, !0).appendXtra("", w[1], P(h[1], w[1]), "%,", !1).appendXtra("", w[2], P(h[2], w[2]), l ? "%," : "%" + v, !1) : r.appendXtra(e.substr(0, e.indexOf("rgb")) + (l ? "rgba(" : "rgb("), w[0], h[0] - w[0], ",", Math.round, !0).appendXtra("", w[1], h[1] - w[1], ",", Math.round).appendXtra("", w[2], h[2] - w[2], l ? "," : v, Math.round), l && (w = 4 > w.length ? 1 : w[3], r.appendXtra("", w, (4 > h.length ? 1 : h[3]) - w, v, !1))), x.lastIndex = 0;
                else if (l = w.match(t)) {
                    if (A = h.match(X), !A || A.length !== l.length) return r;
                    for (h = v = 0; h < l.length; h++) U =
                        l[h], e = w.indexOf(U, v), r.appendXtra(w.substr(v, e - v), Number(U), P(A[h], U), "", L && "px" === w.substr(e + U.length, 2) ? Math.round : !1, 0 === h), v = e + U.length;
                    r["xs" + r.l] += w.substr(v)
                } else r["xs" + r.l] += r.l || r["xs" + r.l] ? " " + h : h;
                if (-1 !== d.indexOf("=") && r.data) {
                    v = r.xs0 + r.data.s;
                    for (c = 1; c < r.l; c++) v += r["xs" + c] + r.data["xn" + c];
                    r.e = v + r["xs" + c]
                }
                return r.l || (r.type = -1, r.xs0 = r.e), r.xfirst || r
            },
            za = 9,
            l = ya.prototype;
        for (l.l = l.pr = 0; 0 < --za;) l["xn" + za] = 0, l["xs" + za] = "";
        l.xs0 = "";
        l._next = l._prev = l.xfirst = l.data = l.plugin = l.setRatio = l.rxp =
            null;
        l.appendXtra = function(a, b, c, d, f, e) {
            var g = this.l;
            return this["xs" + g] += e && (g || this["xs" + g]) ? " " + a : a || "", c || 0 === g || this.plugin ? (this.l++, this.type = this.setRatio ? 2 : 1, this["xs" + this.l] = d || "", 0 < g ? (this.data["xn" + g] = b + c, this.rxp["xn" + g] = f, this["xn" + g] = b, this.plugin || (this.xfirst = new ya(this, "xn" + g, b, c, this.xfirst || this, 0, this.n, f, this.pr), this.xfirst.xs0 = 0), this) : (this.data = {
                s: b + c
            }, this.rxp = {}, this.s = b, this.c = c, this.r = f, this)) : (this["xs" + g] += b + (d || ""), this)
        };
        var Da = function(a, b) {
                b = b || {};
                this.p = b.prefix ?
                    xa(a) || a : a;
                h[a] = h[this.p] = this;
                this.format = b.formatter || U(b.defaultValue, b.color, b.collapsible, b.multi);
                b.parser && (this.parse = b.parser);
                this.clrs = b.color;
                this.multi = b.multi;
                this.keyword = b.keyword;
                this.dflt = b.defaultValue;
                this.pr = b.priority || 0
            },
            ra = ka._registerComplexSpecialProp = function(a, b, c) {
                "object" != typeof b && (b = {
                    parser: c
                });
                var d = a.split(","),
                    f = b.defaultValue;
                c = c || [f];
                for (a = 0; a < d.length; a++) b.prefix = 0 === a && b.prefix, b.defaultValue = c[a] || f, new Da(d[a], b)
            },
            xb = ka._registerPluginProp = function(a) {
                if (!h[a]) {
                    var b =
                        a.charAt(0).toUpperCase() + a.substr(1) + "Plugin";
                    ra(a, {
                        parser: function(a, c, d, f, e, g, r) {
                            var p = k.com.greensock.plugins[b];
                            p ? a = (p._cssRegister(), h[d].parse(a, c, d, f, e, g, r)) : (_gsScope.console && console.log("Error: " + b + " js file not loaded."), a = e);
                            return a
                        }
                    })
                }
            },
            l = Da.prototype;
        l.parseComplex = function(a, b, c, d, f, e) {
            var g, r, k, h, p, l, v = this.keyword;
            if (this.multi && (ia.test(c) || ia.test(b) ? (r = b.replace(ia, "|").split("|"), k = c.replace(ia, "|").split("|")) : v && (r = [b], k = [c])), k) {
                h = k.length > r.length ? k.length : r.length;
                for (g =
                    0; h > g; g++) b = r[g] = r[g] || this.dflt, c = k[g] = k[g] || this.dflt, v && (p = b.indexOf(v), l = c.indexOf(v), p !== l && (-1 === l ? r[g] = r[g].split(v).join("") : -1 === p && (r[g] += " " + v)));
                b = r.join(", ");
                c = k.join(", ")
            }
            return gb(a, this.p, b, c, this.clrs, this.dflt, d, this.pr, f, e)
        };
        l.parse = function(a, b, c, d, e, g, r) {
            return this.parseComplex(a.style, this.format(ba(a, this.p, f, !1, this.dflt)), this.format(b), e, g)
        };
        g.registerSpecialProp = function(a, b, c) {
            ra(a, {
                parser: function(a, d, f, e, g, r, k) {
                    g = new ya(a, f, 0, 0, g, 2, f, !1, c);
                    return g.plugin = r, g.setRatio =
                        b(a, d, e._tween, f), g
                },
                priority: c
            })
        };
        g.useSVGTransformAttr = !0;
        var Va, Ha = "scaleX scaleY scaleZ x y z skewX skewY rotation rotationX rotationY perspective xPercent yPercent".split(" "),
            wa = xa("transform"),
            mb = Ca + "transform",
            Ma = xa("transformOrigin"),
            Aa = null !== xa("perspective"),
            hb = ka.Transform = function() {
                this.perspective = parseFloat(g.defaultTransformPerspective) || 0;
                this.force3D = !1 !== g.defaultForce3D && Aa ? g.defaultForce3D || "auto" : !1
            },
            ab = _gsScope.SVGElement,
            jb = function(a, b, c) {
                var d;
                a = ca.createElementNS("http://www.w3.org/2000/svg",
                    a);
                var f = /([a-z])([A-Z])/g;
                for (d in c) a.setAttributeNS(null, d.replace(f, "$1-$2").toLowerCase(), c[d]);
                return b.appendChild(a), a
            },
            bb = ca.documentElement || {},
            sb = function() {
                var a, b, c, d = m || /Android/i.test(aa) && !_gsScope.chrome;
                return ca.createElementNS && !d && (a = jb("svg", bb), b = jb("rect", a, {
                    width: 100,
                    height: 50,
                    x: 100
                }), c = b.getBoundingClientRect().width, b.style[Ma] = "50% 50%", b.style[wa] = "scaleX(0.5)", d = c === b.getBoundingClientRect().width && !(z && Aa), bb.removeChild(a)), d
            }(),
            db = function(a, b, c, d, f, e) {
                var r, k, h, p,
                    l, v, w, x, A, m, q, U, n, L = a._gsTransform,
                    S = Na(a, !0);
                L && (U = L.xOrigin, n = L.yOrigin);
                (!d || 2 > (r = d.split(" ")).length) && (v = a.getBBox(), 0 === v.x && 0 === v.y && 0 === v.width + v.height && (v = {
                    x: parseFloat(a.hasAttribute("x") ? a.getAttribute("x") : a.hasAttribute("cx") ? a.getAttribute("cx") : 0) || 0,
                    y: parseFloat(a.hasAttribute("y") ? a.getAttribute("y") : a.hasAttribute("cy") ? a.getAttribute("cy") : 0) || 0,
                    width: 0,
                    height: 0
                }), b = M(b).split(" "), r = [(-1 !== b[0].indexOf("%") ? parseFloat(b[0]) / 100 * v.width : parseFloat(b[0])) + v.x, (-1 !== b[1].indexOf("%") ?
                    parseFloat(b[1]) / 100 * v.height : parseFloat(b[1])) + v.y]);
                c.xOrigin = b = parseFloat(r[0]);
                c.yOrigin = p = parseFloat(r[1]);
                d && S !== kb && (l = S[0], v = S[1], w = S[2], x = S[3], A = S[4], m = S[5], q = l * x - v * w, q && (k = x / q * b + -w / q * p + (w * m - x * A) / q, h = -v / q * b + l / q * p - (l * m - v * A) / q, b = c.xOrigin = r[0] = k, p = c.yOrigin = r[1] = h));
                L && (e && (c.xOffset = L.xOffset, c.yOffset = L.yOffset, L = c), f || !1 !== f && !1 !== g.defaultSmoothOrigin ? (k = b - U, h = p - n, L.xOffset += k * S[0] + h * S[2] - k, L.yOffset += k * S[1] + h * S[3] - h) : L.xOffset = L.yOffset = 0);
                e || a.setAttribute("data-svg-origin", r.join(" "))
            },
            ob = function(a) {
                var b, c = ja("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
                    d = this.parentNode,
                    f = this.nextSibling,
                    e = this.style.cssText;
                if (bb.appendChild(c), c.appendChild(this), this.style.display = "block", a) try {
                    b = this.getBBox(), this._originalGetBBox = this.getBBox, this.getBBox = ob
                } catch (g) {} else this._originalGetBBox && (b = this._originalGetBBox());
                return f ? d.insertBefore(this, f) : d.appendChild(this), bb.removeChild(c), this.style.cssText = e, b
            },
            pb = function(a) {
                var b;
                if (!(b = !ab || !a.getCTM || a.parentNode && !a.ownerSVGElement)) {
                    var c;
                    try {
                        c = a.getBBox()
                    } catch (d) {
                        c = ob.call(a, !0)
                    }
                    b = !c
                }
                return !b
            },
            kb = [1, 0, 0, 1, 0, 0],
            Na = function(a, b) {
                var c, d, f, e, g, r, k = a._gsTransform || new hb,
                    h = a.style;
                if (wa ? d = ba(a, mb, null, !0) : a.currentStyle && (d = a.currentStyle.filter.match(Z), d = d && 4 === d.length ? [d[0].substr(4), Number(d[2].substr(4)), Number(d[1].substr(4)), d[3].substr(4), k.x || 0, k.y || 0].join() : ""), c = !d || "none" === d || "matrix(1, 0, 0, 1, 0, 0)" === d, !wa || !(r = !oa(a) || "none" === oa(a).display) && a.parentNode ||
                    (r && (e = h.display, h.display = "block"), a.parentNode || (g = 1, bb.appendChild(a)), d = ba(a, mb, null, !0), c = !d || "none" === d || "matrix(1, 0, 0, 1, 0, 0)" === d, e ? h.display = e : r && Ea(h, "display"), g && bb.removeChild(a)), (k.svg || a.getCTM && pb(a)) && (c && -1 !== (h[wa] + "").indexOf("matrix") && (d = h[wa], c = 0), f = a.getAttribute("transform"), c && f && (f = a.transform.baseVal.consolidate().matrix, d = "matrix(" + f.a + "," + f.b + "," + f.c + "," + f.d + "," + f.e + "," + f.f + ")", c = 0)), c) return kb;
                f = (d || "").match(t) || [];
                for (za = f.length; - 1 < --za;) e = Number(f[za]), f[za] =
                    (g = e - (e |= 0)) ? (1E5 * g + (0 > g ? -.5 : .5) | 0) / 1E5 + e : e;
                return b && 6 < f.length ? [f[0], f[1], f[4], f[5], f[12], f[13]] : f
            },
            Ja = ka.getTransform = function(a, b, d, f) {
                if (a._gsTransform && d && !f) return a._gsTransform;
                var e, r, k, h = d ? a._gsTransform || new hb : new hb,
                    p = 0 > h.scaleX,
                    l = Aa ? parseFloat(ba(a, Ma, b, !1, "0 0 0").split(" ")[2]) || h.zOrigin || 0 : 0,
                    v = parseFloat(g.defaultTransformPerspective) || 0;
                if (h.svg = !(!a.getCTM || !pb(a)), h.svg && (db(a, ba(a, Ma, b, !1, "50% 50%") + "", h, a.getAttribute("data-svg-origin")), Va = g.useSVGTransformAttr || sb), e = Na(a),
                    e !== kb) {
                    if (16 === e.length) {
                        var w, x, A, m, v = e[0];
                        b = e[1];
                        f = e[2];
                        var q = e[3],
                            U = e[4],
                            n = e[5],
                            L = e[6],
                            S = e[7],
                            M = e[8],
                            P = e[9],
                            u = e[10],
                            t = e[12],
                            N = e[13],
                            da = e[14],
                            y = e[11],
                            ea = Math.atan2(L, u);
                        h.zOrigin && (da = -h.zOrigin, t = M * da - e[12], N = P * da - e[13], da = u * da + h.zOrigin - e[14]);
                        h.rotationX = ea * la;
                        ea && (m = Math.cos(-ea), k = Math.sin(-ea), w = U * m + M * k, x = n * m + P * k, A = L * m + u * k, M = U * -k + M * m, P = n * -k + P * m, u = L * -k + u * m, y = S * -k + y * m, U = w, n = x, L = A);
                        ea = Math.atan2(-f, u);
                        h.rotationY = ea * la;
                        ea && (m = Math.cos(-ea), k = Math.sin(-ea), w = v * m - M * k, x = b * m - P * k, A = f * m - u * k, P = b * k +
                            P * m, u = f * k + u * m, y = q * k + y * m, v = w, b = x, f = A);
                        ea = Math.atan2(b, v);
                        h.rotation = ea * la;
                        ea && (m = Math.cos(ea), k = Math.sin(ea), w = v * m + b * k, x = U * m + n * k, A = M * m + P * k, b = b * m - v * k, n = n * m - U * k, P = P * m - M * k, v = w, U = x, M = A);
                        h.rotationX && 359.9 < Math.abs(h.rotationX) + Math.abs(h.rotation) && (h.rotationX = h.rotation = 0, h.rotationY = 180 - h.rotationY);
                        ea = Math.atan2(U, n);
                        h.scaleX = (1E5 * Math.sqrt(v * v + b * b + f * f) + .5 | 0) / 1E5;
                        h.scaleY = (1E5 * Math.sqrt(n * n + L * L) + .5 | 0) / 1E5;
                        h.scaleZ = (1E5 * Math.sqrt(M * M + P * P + u * u) + .5 | 0) / 1E5;
                        v /= h.scaleX;
                        U /= h.scaleY;
                        b /= h.scaleX;
                        n /= h.scaleY;
                        2E-5 < Math.abs(ea) ? (h.skewX = ea * la, U = 0, "simple" !== h.skewType && (h.scaleY *= 1 / Math.cos(ea))) : h.skewX = 0;
                        h.perspective = y ? 1 / (0 > y ? -y : y) : 0;
                        h.x = t;
                        h.y = N;
                        h.z = da;
                        h.svg && (h.x -= h.xOrigin - (h.xOrigin * v - h.yOrigin * U), h.y -= h.yOrigin - (h.yOrigin * b - h.xOrigin * n))
                    } else Aa && !f && e.length && h.x === e[4] && h.y === e[5] && (h.rotationX || h.rotationY) || (w = (m = 6 <= e.length) ? e[0] : 1, x = e[1] || 0, A = e[2] || 0, m = m ? e[3] : 1, h.x = e[4] || 0, h.y = e[5] || 0, e = Math.sqrt(w * w + x * x), k = Math.sqrt(m * m + A * A), b = w || x ? Math.atan2(x, w) * la : h.rotation || 0, f = A || m ? Math.atan2(A, m) * la +
                        b : h.skewX || 0, h.scaleX = e, h.scaleY = k, h.rotation = b, h.skewX = f, Aa && (h.rotationX = h.rotationY = h.z = 0, h.perspective = v, h.scaleZ = 1), h.svg && (h.x -= h.xOrigin - (h.xOrigin * w + h.yOrigin * A), h.y -= h.yOrigin - (h.xOrigin * x + h.yOrigin * m)));
                    90 < Math.abs(h.skewX) && 270 > Math.abs(h.skewX) && (p ? (h.scaleX *= -1, h.skewX += 0 >= h.rotation ? 180 : -180, h.rotation += 0 >= h.rotation ? 180 : -180) : (h.scaleY *= -1, h.skewX += 0 >= h.skewX ? 180 : -180));
                    h.zOrigin = l;
                    for (r in h) 2E-5 > h[r] && -2E-5 < h[r] && (h[r] = 0)
                }
                return d && (a._gsTransform = h, h.svg && (Va && a.style[wa] ? c.delayedCall(.001,
                    function() {
                        Ea(a.style, wa)
                    }) : !Va && a.getAttribute("transform") && c.delayedCall(.001, function() {
                    a.removeAttribute("transform")
                }))), h
            },
            eb = function(a) {
                var b, c, d = this.data,
                    f = -d.rotation * y,
                    e = f + d.skewX * y,
                    g = (Math.cos(f) * d.scaleX * 1E5 | 0) / 1E5,
                    h = (Math.sin(f) * d.scaleX * 1E5 | 0) / 1E5,
                    k = (Math.sin(e) * -d.scaleY * 1E5 | 0) / 1E5,
                    p = (Math.cos(e) * d.scaleY * 1E5 | 0) / 1E5,
                    e = this.t.style;
                if (f = this.t.currentStyle) {
                    c = h;
                    h = -k;
                    k = -c;
                    b = f.filter;
                    e.filter = "";
                    var l, v;
                    c = this.t.offsetWidth;
                    var w = this.t.offsetHeight,
                        x = "absolute" !== f.position,
                        A = "progid:DXImageTransform.Microsoft.Matrix(M11=" +
                        g + ", M12=" + h + ", M21=" + k + ", M22=" + p,
                        U = d.x + c * d.xPercent / 100,
                        q = d.y + w * d.yPercent / 100;
                    if (null != d.ox && (l = (d.oxp ? c * d.ox * .01 : d.ox) - c / 2, v = (d.oyp ? w * d.oy * .01 : d.oy) - w / 2, U += l - (l * g + v * h), q += v - (l * k + v * p)), x ? (l = c / 2, v = w / 2, A += ", Dx=" + (l - (l * g + v * h) + U) + ", Dy=" + (v - (l * k + v * p) + q) + ")") : A += ", sizingMethod='auto expand')", -1 !== b.indexOf("DXImageTransform.Microsoft.Matrix(") ? e.filter = b.replace(na, A) : e.filter = A + " " + b, (0 === a || 1 === a) && 1 === g && 0 === h && 0 === k && 1 === p && (x && -1 === A.indexOf("Dx=0, Dy=0") || E.test(b) && 100 !== parseFloat(RegExp.$1) ||
                            -1 === b.indexOf(b.indexOf("Alpha")) && e.removeAttribute("filter")), !x)
                        for (a = 8 > m ? 1 : -1, l = d.ieOffsetX || 0, v = d.ieOffsetY || 0, d.ieOffsetX = Math.round((c - ((0 > g ? -g : g) * c + (0 > h ? -h : h) * w)) / 2 + U), d.ieOffsetY = Math.round((w - ((0 > p ? -p : p) * w + (0 > k ? -k : k) * c)) / 2 + q), za = 0; 4 > za; za++) g = S[za], h = f[g], c = -1 !== h.indexOf("px") ? parseFloat(h) : r(this.t, g, parseFloat(h), h.replace(O, "")) || 0, h = c !== d[g] ? 2 > za ? -d.ieOffsetX : -d.ieOffsetY : 2 > za ? l - d.ieOffsetX : v - d.ieOffsetY, e[g] = (d[g] = Math.round(c - h * (0 === za || 2 === za ? 1 : a))) + "px"
                }
            },
            qb = ka.set3DTransformRatio =
            ka.setTransformRatio = function(a) {
                var b, c, d, f, e, g, r, h, k, p, l, v, w, x, A, m, U, q = this.data,
                    n = this.t.style,
                    L = q.rotation,
                    M = q.rotationX,
                    S = q.rotationY,
                    P = q.scaleX,
                    u = q.scaleY,
                    t = q.scaleZ,
                    N = q.x,
                    ea = q.y,
                    Oa = q.z,
                    lb = q.svg,
                    Wa = q.perspective;
                r = q.force3D;
                h = q.skewY;
                k = q.skewX;
                if (h && (k += h, L += h), !((1 !== a && 0 !== a || "auto" !== r || this.tween._totalTime !== this.tween._totalDuration && this.tween._totalTime) && r || Oa || Wa || S || M) && 1 === t || Va && lb || !Aa) return void(L || k || lb ? (L *= y, g = k * y, c = Math.cos(L) * P, f = Math.sin(L) * P, d = Math.sin(L - g) * -u, e = Math.cos(L -
                    g) * u, g && "simple" === q.skewType && (b = Math.tan(g - h * y), b = Math.sqrt(1 + b * b), d *= b, e *= b, h && (b = Math.tan(h * y), b = Math.sqrt(1 + b * b), c *= b, f *= b)), lb && (N += q.xOrigin - (q.xOrigin * c + q.yOrigin * d) + q.xOffset, ea += q.yOrigin - (q.xOrigin * f + q.yOrigin * e) + q.yOffset, Va && (q.xPercent || q.yPercent) && (x = this.t.getBBox(), N += .01 * q.xPercent * x.width, ea += .01 * q.yPercent * x.height), x = 1E-6, x > N && N > -x && (N = 0), x > ea && ea > -x && (ea = 0)), w = (1E5 * c | 0) / 1E5 + "," + (1E5 * f | 0) / 1E5 + "," + (1E5 * d | 0) / 1E5 + "," + (1E5 * e | 0) / 1E5 + "," + N + "," + ea + ")", lb && Va ? this.t.setAttribute("transform",
                    "matrix(" + w) : n[wa] = (q.xPercent || q.yPercent ? "translate(" + q.xPercent + "%," + q.yPercent + "%) matrix(" : "matrix(") + w) : n[wa] = (q.xPercent || q.yPercent ? "translate(" + q.xPercent + "%," + q.yPercent + "%) matrix(" : "matrix(") + P + ",0,0," + u + "," + N + "," + ea + ")");
                if (z && (x = 1E-4, x > P && P > -x && (P = t = 2E-5), x > u && u > -x && (u = t = 2E-5), !Wa || q.z || q.rotationX || q.rotationY || (Wa = 0)), L || k) L *= y, A = c = Math.cos(L), m = f = Math.sin(L), k && (L -= k * y, A = Math.cos(L), m = Math.sin(L), "simple" === q.skewType && (b = Math.tan((k - h) * y), b = Math.sqrt(1 + b * b), A *= b, m *= b, q.skewY && (b =
                    Math.tan(h * y), b = Math.sqrt(1 + b * b), c *= b, f *= b))), d = -m, e = A;
                else {
                    if (!(S || M || 1 !== t || Wa || lb)) return void(n[wa] = (q.xPercent || q.yPercent ? "translate(" + q.xPercent + "%," + q.yPercent + "%) translate3d(" : "translate3d(") + N + "px," + ea + "px," + Oa + "px)" + (1 !== P || 1 !== u ? " scale(" + P + "," + u + ")" : ""));
                    c = e = 1;
                    d = f = 0
                }
                k = 1;
                a = g = r = h = p = l = 0;
                v = Wa ? -1 / Wa : 0;
                w = q.zOrigin;
                x = 1E-6;
                (L = S * y) && (A = Math.cos(L), m = Math.sin(L), r = -m, p = v * -m, a = c * m, g = f * m, k = A, v *= A, c *= A, f *= A);
                (L = M * y) && (A = Math.cos(L), m = Math.sin(L), b = d * A + a * m, U = e * A + g * m, h = k * m, l = v * m, a = d * -m + a * A, g = e * -m +
                    g * A, k *= A, v *= A, d = b, e = U);
                1 !== t && (a *= t, g *= t, k *= t, v *= t);
                1 !== u && (d *= u, e *= u, h *= u, l *= u);
                1 !== P && (c *= P, f *= P, r *= P, p *= P);
                (w || lb) && (w && (N += a * -w, ea += g * -w, Oa += k * -w + w), lb && (N += q.xOrigin - (q.xOrigin * c + q.yOrigin * d) + q.xOffset, ea += q.yOrigin - (q.xOrigin * f + q.yOrigin * e) + q.yOffset), x > N && N > -x && (N = "0"), x > ea && ea > -x && (ea = "0"), x > Oa && Oa > -x && (Oa = 0));
                w = q.xPercent || q.yPercent ? "translate(" + q.xPercent + "%," + q.yPercent + "%) matrix3d(" : "matrix3d(";
                w = w + ((x > c && c > -x ? "0" : c) + "," + (x > f && f > -x ? "0" : f) + "," + (x > r && r > -x ? "0" : r)) + ("," + (x > p && p > -x ? "0" : p) +
                    "," + (x > d && d > -x ? "0" : d) + "," + (x > e && e > -x ? "0" : e));
                M || S || 1 !== t ? (w += "," + (x > h && h > -x ? "0" : h) + "," + (x > l && l > -x ? "0" : l) + "," + (x > a && a > -x ? "0" : a), w += "," + (x > g && g > -x ? "0" : g) + "," + (x > k && k > -x ? "0" : k) + "," + (x > v && v > -x ? "0" : v) + ",") : w += ",0,0,0,0,1,0,";
                n[wa] = w + (N + "," + ea + "," + Oa + "," + (Wa ? 1 + -Oa / Wa : 1) + ")")
            },
            l = hb.prototype;
        l.x = l.y = l.z = l.skewX = l.skewY = l.rotation = l.rotationX = l.rotationY = l.zOrigin = l.xPercent = l.yPercent = l.xOffset = l.yOffset = 0;
        l.scaleX = l.scaleY = l.scaleZ = 1;
        ra("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin", {
            parser: function(a, b, c, d, e, r, h) {
                if (d._lastParsedTransform === h) return e;
                d._lastParsedTransform = h;
                var k, l = h.scale && "function" == typeof h.scale ? h.scale : 0;
                "function" == typeof h[c] && (k = h[c], h[c] = b);
                l && (h.scale = l(q, a));
                var v, w, x, A, m, U, L, n;
                b = a._gsTransform;
                var P = a.style,
                    S = Ha.length,
                    u = {},
                    t = Ja(a, f, !0, h.parseTransform),
                    da = h.transform && ("function" == typeof h.transform ? h.transform(q, p) : h.transform);
                if (t.skewType = h.skewType || t.skewType || g.defaultSkewType, d._transform = t, "rotationZ" in h && (h.rotation = h.rotationZ), da &&
                    "string" == typeof da && wa) w = qa.style, w[wa] = da, w.display = "block", w.position = "absolute", -1 !== da.indexOf("%") && (w.width = ba(a, "width"), w.height = ba(a, "height")), ca.body.appendChild(qa), v = Ja(qa, null, !1), "simple" === t.skewType && (v.scaleY *= Math.cos(v.skewX * y)), t.svg && (m = t.xOrigin, U = t.yOrigin, v.x -= t.xOffset, v.y -= t.yOffset, (h.transformOrigin || h.svgOrigin) && (da = {}, db(a, M(h.transformOrigin), da, h.svgOrigin, h.smoothOrigin, !0), m = da.xOrigin, U = da.yOrigin, v.x -= da.xOffset - t.xOffset, v.y -= da.yOffset - t.yOffset), (m || U) && (L =
                    Na(qa, !0), v.x -= m - (m * L[0] + U * L[2]), v.y -= U - (m * L[1] + U * L[3]))), ca.body.removeChild(qa), v.perspective || (v.perspective = t.perspective), null != h.xPercent && (v.xPercent = N(h.xPercent, t.xPercent)), null != h.yPercent && (v.yPercent = N(h.yPercent, t.yPercent));
                else if ("object" == typeof h) {
                    if (v = {
                            scaleX: N(null != h.scaleX ? h.scaleX : h.scale, t.scaleX),
                            scaleY: N(null != h.scaleY ? h.scaleY : h.scale, t.scaleY),
                            scaleZ: N(h.scaleZ, t.scaleZ),
                            x: N(h.x, t.x),
                            y: N(h.y, t.y),
                            z: N(h.z, t.z),
                            xPercent: N(h.xPercent, t.xPercent),
                            yPercent: N(h.yPercent, t.yPercent),
                            perspective: N(h.transformPerspective, t.perspective)
                        }, x = h.directionalRotation, null != x)
                        if ("object" == typeof x)
                            for (w in x) h[w] = x[w];
                        else h.rotation = x;
                        "string" == typeof h.x && -1 !== h.x.indexOf("%") && (v.x = 0, v.xPercent = N(h.x, t.xPercent));
                    "string" == typeof h.y && -1 !== h.y.indexOf("%") && (v.y = 0, v.yPercent = N(h.y, t.yPercent));
                    v.rotation = Ga("rotation" in h ? h.rotation : "shortRotation" in h ? h.shortRotation + "_short" : t.rotation, t.rotation, "rotation", u);
                    Aa && (v.rotationX = Ga("rotationX" in h ? h.rotationX : "shortRotationX" in h ? h.shortRotationX +
                        "_short" : t.rotationX || 0, t.rotationX, "rotationX", u), v.rotationY = Ga("rotationY" in h ? h.rotationY : "shortRotationY" in h ? h.shortRotationY + "_short" : t.rotationY || 0, t.rotationY, "rotationY", u));
                    v.skewX = Ga(h.skewX, t.skewX);
                    v.skewY = Ga(h.skewY, t.skewY)
                }
                Aa && null != h.force3D && (t.force3D = h.force3D, A = !0);
                for ((x = t.force3D || t.z || t.rotationX || t.rotationY || v.z || v.rotationX || v.rotationY || v.perspective) || null == h.scale || (v.scaleZ = 1); - 1 < --S;) n = Ha[S], da = v[n] - t[n], (1E-6 < da || -1E-6 > da || null != h[n] || null != ma[n]) && (A = !0, e = new ya(t,
                    n, t[n], da, e), n in u && (e.e = u[n]), e.xs0 = 0, e.plugin = r, d._overwriteProps.push(e.n));
                return da = h.transformOrigin, t.svg && (da || h.svgOrigin) && (m = t.xOffset, U = t.yOffset, db(a, M(da), v, h.svgOrigin, h.smoothOrigin), e = Ua(t, "xOrigin", (b ? t : v).xOrigin, v.xOrigin, e, "transformOrigin"), e = Ua(t, "yOrigin", (b ? t : v).yOrigin, v.yOrigin, e, "transformOrigin"), (m !== t.xOffset || U !== t.yOffset) && (e = Ua(t, "xOffset", b ? m : t.xOffset, t.xOffset, e, "transformOrigin"), e = Ua(t, "yOffset", b ? U : t.yOffset, t.yOffset, e, "transformOrigin")), da = "0px 0px"), (da ||
                    Aa && x && t.zOrigin) && (wa ? (A = !0, n = Ma, da = (da || ba(a, n, f, !1, "50% 50%")) + "", e = new ya(P, n, 0, 0, e, -1, "transformOrigin"), e.b = P[n], e.plugin = r, Aa ? (w = t.zOrigin, da = da.split(" "), t.zOrigin = (2 < da.length && (0 === w || "0px" !== da[2]) ? parseFloat(da[2]) : w) || 0, e.xs0 = e.e = da[0] + " " + (da[1] || "50%") + " 0px", e = new ya(t, "zOrigin", 0, 0, e, -1, e.n), e.b = w, e.xs0 = e.e = t.zOrigin) : e.xs0 = e.e = da) : M(da + "", t)), A && (d._transformType = t.svg && Va || !x && 3 !== this._transformType ? 2 : 3), k && (h[c] = k), l && (h.scale = l), e
            },
            prefix: !0
        });
        ra("boxShadow", {
            defaultValue: "0px 0px 0px 0px #999",
            prefix: !0,
            color: !0,
            multi: !0,
            keyword: "inset"
        });
        ra("borderRadius", {
            defaultValue: "0px",
            parser: function(a, b, c, e, g, h) {
                b = this.format(b);
                var k, v, p, l, w, x, m, A, q, U, n, L, t, P = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
                    S = a.style;
                e = parseFloat(a.offsetWidth);
                h = parseFloat(a.offsetHeight);
                b = b.split(" ");
                for (k = 0; k < P.length; k++) this.p.indexOf("border") && (P[k] = xa(P[k])), l = p = ba(a, P[k], f, !1, "0px"), -1 !== l.indexOf(" ") && (p = l.split(" "), l = p[0], p = p[1]), w = v = b[k], x = parseFloat(l),
                    q = l.substr((x + "").length), (U = "=" === w.charAt(1)) ? (m = parseInt(w.charAt(0) + "1", 10), w = w.substr(2), m *= parseFloat(w), A = w.substr((m + "").length - (0 > m ? 1 : 0)) || "") : (m = parseFloat(w), A = w.substr((m + "").length)), "" === A && (A = d[c] || q), A !== q && (n = r(a, "borderLeft", x, q), L = r(a, "borderTop", x, q), "%" === A ? (l = n / e * 100 + "%", p = L / h * 100 + "%") : "em" === A ? (t = r(a, "borderLeft", 1, "em"), l = n / t + "em", p = L / t + "em") : (l = n + "px", p = L + "px"), U && (w = parseFloat(l) + m + A, v = parseFloat(p) + m + A)), g = gb(S, P[k], l + " " + p, w + " " + v, !1, "0px", g);
                return g
            },
            prefix: !0,
            formatter: U("0px 0px 0px 0px", !1, !0)
        });
        ra("borderBottomLeftRadius,borderBottomRightRadius,borderTopLeftRadius,borderTopRightRadius", {
            defaultValue: "0px",
            parser: function(a, b, c, d, e, g) {
                return gb(a.style, c, this.format(ba(a, c, f, !1, "0px 0px")), this.format(b), !1, "0px", e)
            },
            prefix: !0,
            formatter: U("0px 0px", !1, !0)
        });
        ra("backgroundPosition", {
            defaultValue: "0 0",
            parser: function(a, b, c, d, e, g) {
                var r, h, k;
                c = f || oa(a, null);
                c = this.format((c ? m ? c.getPropertyValue("background-position-x") + " " + c.getPropertyValue("background-position-y") : c.getPropertyValue("background-position") :
                    a.currentStyle.backgroundPositionX + " " + a.currentStyle.backgroundPositionY) || "0 0");
                var v = this.format(b);
                if (-1 !== c.indexOf("%") != (-1 !== v.indexOf("%")) && 2 > v.split(",").length && (r = ba(a, "backgroundImage").replace(W, ""), r && "none" !== r)) {
                    b = c.split(" ");
                    d = v.split(" ");
                    pa.setAttribute("src", r);
                    for (r = 2; - 1 < --r;) c = b[r], h = -1 !== c.indexOf("%"), h !== (-1 !== d[r].indexOf("%")) && (k = 0 === r ? a.offsetWidth - pa.width : a.offsetHeight - pa.height, b[r] = h ? parseFloat(c) / 100 * k + "px" : parseFloat(c) / k * 100 + "%");
                    c = b.join(" ")
                }
                return this.parseComplex(a.style,
                    c, v, e, g)
            },
            formatter: M
        });
        ra("backgroundSize", {
            defaultValue: "0 0",
            formatter: function(a) {
                return a += "", "co" === a.substr(0, 2) ? a : M(-1 === a.indexOf(" ") ? a + " " + a : a)
            }
        });
        ra("perspective", {
            defaultValue: "0px",
            prefix: !0
        });
        ra("perspectiveOrigin", {
            defaultValue: "50% 50%",
            prefix: !0
        });
        ra("transformStyle", {
            prefix: !0
        });
        ra("backfaceVisibility", {
            prefix: !0
        });
        ra("userSelect", {
            prefix: !0
        });
        ra("margin", {
            parser: Sa("marginTop,marginRight,marginBottom,marginLeft")
        });
        ra("padding", {
            parser: Sa("paddingTop,paddingRight,paddingBottom,paddingLeft")
        });
        ra("clip", {
            defaultValue: "rect(0px,0px,0px,0px)",
            parser: function(a, b, c, d, e, g) {
                var r, h, k;
                return 9 > m ? (h = a.currentStyle, k = 8 > m ? " " : ",", r = "rect(" + h.clipTop + k + h.clipRight + k + h.clipBottom + k + h.clipLeft + ")", b = this.format(b).split(",").join(k)) : (r = this.format(ba(a, this.p, f, !1, this.dflt)), b = this.format(b)), this.parseComplex(a.style, r, b, e, g)
            }
        });
        ra("textShadow", {
            defaultValue: "0px 0px 0px #999",
            color: !0,
            multi: !0
        });
        ra("autoRound,strictUnits", {
            parser: function(a, b, c, d, f) {
                return f
            }
        });
        ra("border", {
            defaultValue: "0px solid #000",
            parser: function(a, b, c, d, e, g) {
                c = ba(a, "borderTopWidth", f, !1, "0px");
                b = this.format(b).split(" ");
                d = b[0].replace(O, "");
                return "px" !== d && (c = parseFloat(c) / r(a, "borderTopWidth", 1, d) + d), this.parseComplex(a.style, this.format(c + " " + ba(a, "borderTopStyle", f, !1, "solid") + " " + ba(a, "borderTopColor", f, !1, "#000")), b.join(" "), e, g)
            },
            color: !0,
            formatter: function(a) {
                var b = a.split(" ");
                return b[0] + " " + (b[1] || "solid") + " " + (a.match(x) || ["#000"])[0]
            }
        });
        ra("borderWidth", {
            parser: Sa("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")
        });
        ra("float,cssFloat,styleFloat", {
            parser: function(a, b, c, d, f, e) {
                a = a.style;
                d = "cssFloat" in a ? "cssFloat" : "styleFloat";
                return new ya(a, d, 0, 0, f, -1, c, !1, 0, a[d], b)
            }
        });
        var Qa = function(a) {
            var b, c = this.t,
                d = c.filter || ba(this.data, "filter") || "";
            a = this.s + this.c * a | 0;
            100 === a && (-1 === d.indexOf("atrix(") && -1 === d.indexOf("radient(") && -1 === d.indexOf("oader(") ? (c.removeAttribute("filter"), b = !ba(this.data, "filter")) : (c.filter = d.replace(I, ""), b = !0));
            b || (this.xn1 && (c.filter = d = d || "alpha(opacity=" + a + ")"), -1 === d.indexOf("pacity") ?
                0 === a && this.xn1 || (c.filter = d + " alpha(opacity=" + a + ")") : c.filter = d.replace(E, "opacity=" + a))
        };
        ra("opacity,alpha,autoAlpha", {
            defaultValue: "1",
            parser: function(a, b, c, d, e, g) {
                var r = parseFloat(ba(a, "opacity", f, !1, "1")),
                    h = a.style,
                    k = "autoAlpha" === c;
                return "string" == typeof b && "=" === b.charAt(1) && (b = ("-" === b.charAt(0) ? -1 : 1) * parseFloat(b.substr(2)) + r), k && 1 === r && "hidden" === ba(a, "visibility", f) && 0 !== b && (r = 0), D ? e = new ya(h, "opacity", r, b - r, e) : (e = new ya(h, "opacity", 100 * r, 100 * (b - r), e), e.xn1 = k ? 1 : 0, h.zoom = 1, e.type = 2, e.b =
                    "alpha(opacity=" + e.s + ")", e.e = "alpha(opacity=" + (e.s + e.c) + ")", e.data = a, e.plugin = g, e.setRatio = Qa), k && (e = new ya(h, "visibility", 0, 0, e, -1, null, !1, 0, 0 !== r ? "inherit" : "hidden", 0 === b ? "hidden" : "inherit"), e.xs0 = "inherit", d._overwriteProps.push(e.n), d._overwriteProps.push(c)), e
            }
        });
        var Ea = function(a, b) {
                b && (a.removeProperty ? (("ms" === b.substr(0, 2) || "webkit" === b.substr(0, 6)) && (b = "-" + b), a.removeProperty(b.replace(R, "-$1").toLowerCase())) : a.removeAttribute(b))
            },
            ib = function(a) {
                if (this.t._gsClassPT = this, 1 === a || 0 === a) {
                    this.t.setAttribute("class",
                        0 === a ? this.b : this.e);
                    for (var b = this.data, c = this.t.style; b;) b.v ? c[b.p] = b.v : Ea(c, b.p), b = b._next;
                    1 === a && this.t._gsClassPT === this && (this.t._gsClassPT = null)
                } else this.t.getAttribute("class") !== this.e && this.t.setAttribute("class", this.e)
            };
        ra("className", {
            parser: function(b, c, d, e, g, r, h) {
                var k, v, p, l, x = b.getAttribute("class") || "",
                    m = b.style.cssText;
                if (g = e._classNamePT = new ya(b, d, 0, 0, g, 2), g.setRatio = ib, g.pr = -11, a = !0, g.b = x, d = w(b, f), v = b._gsClassPT) {
                    p = {};
                    for (l = v.data; l;) p[l.p] = 1, l = l._next;
                    v.setRatio(1)
                }
                return b._gsClassPT =
                    g, g.e = "=" !== c.charAt(1) ? c : x.replace(new RegExp("(?:\\s|^)" + c.substr(2) + "(?![\\w-])"), "") + ("+" === c.charAt(0) ? " " + c.substr(2) : ""), b.setAttribute("class", g.e), k = A(b, d, w(b), h, p), b.setAttribute("class", x), g.data = k.firstMPT, b.style.cssText = m, g.xfirst = e.parse(b, k.difs, g, r)
            }
        });
        var zb = function(a) {
            if ((1 === a || 0 === a) && this.data._totalTime === this.data._totalDuration && "isFromStart" !== this.data.data) {
                var b, c, d, e, f = this.t.style,
                    g = h.transform.parse;
                if ("all" === this.e) f.cssText = "", d = !0;
                else
                    for (a = this.e.split(" ").join("").split(","),
                        c = a.length; - 1 < --c;) b = a[c], h[b] && (h[b].parse === g ? d = !0 : b = "transformOrigin" === b ? Ma : h[b].p), Ea(f, b);
                d && (Ea(f, wa), e = this.t._gsTransform, e && (e.svg && (this.t.removeAttribute("data-svg-origin"), this.t.removeAttribute("transform")), delete this.t._gsTransform))
            }
        };
        ra("clearProps", {
            parser: function(b, c, d, e, f) {
                return f = new ya(b, d, 0, 0, f, 2), f.setRatio = zb, f.e = c, f.pr = -10, f.data = e._tween, a = !0, f
            }
        });
        l = ["bezier", "throwProps", "physicsProps", "physics2D"];
        for (za = l.length; za--;) xb(l[za]);
        l = g.prototype;
        l._firstPT = l._lastParsedTransform =
            l._transform = null;
        l._onInitTween = function(b, c, r, k) {
            if (!b.nodeType) return !1;
            this._target = p = b;
            this._tween = r;
            this._vars = c;
            q = k;
            n = c.autoRound;
            a = !1;
            d = c.suffixMap || g.suffixMap;
            f = oa(b, "");
            e = this._overwriteProps;
            var v, l, x, m, U;
            k = b.style;
            if (u && "" === k.zIndex && (v = ba(b, "zIndex", f), ("auto" === v || "" === v) && this._addLazySet(k, "zIndex", 0)), "string" == typeof c && (m = k.cssText, v = w(b, f), k.cssText = m + ";" + c, v = A(b, v, w(b)).difs, !D && B.test(c) && (v.opacity = parseFloat(RegExp.$1)), c = v, k.cssText = m), c.className ? this._firstPT = l = h.className.parse(b,
                    c.className, "className", this, null, null, c) : this._firstPT = l = this.parse(b, c, null), this._transformType) {
                c = 3 === this._transformType;
                wa ? J && (u = !0, "" === k.zIndex && (x = ba(b, "zIndex", f), ("auto" === x || "" === x) && this._addLazySet(k, "zIndex", 0)), V && this._addLazySet(k, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (c ? "visible" : "hidden"))) : k.zoom = 1;
                for (x = l; x && x._next;) x = x._next;
                c = new ya(b, "transform", 0, 0, null, 2);
                this._linkCSSP(c, null, x);
                c.setRatio = wa ? qb : eb;
                c.data = this._transform || Ja(b, f, !0);
                c.tween = r;
                c.pr = -1;
                e.pop()
            }
            if (a) {
                for (; l;) {
                    b = l._next;
                    for (x = m; x && x.pr > l.pr;) x = x._next;
                    (l._prev = x ? x._prev : U) ? l._prev._next = l: m = l;
                    (l._next = x) ? x._prev = l: U = l;
                    l = b
                }
                this._firstPT = m
            }
            return !0
        };
        l.parse = function(a, b, c, e) {
            var g, k, l, x, w, m, A, U, t, P = a.style;
            for (g in b) {
                if (w = b[g], "function" == typeof w && (w = w(q, p)), k = h[g]) c = k.parse(a, w, g, this, c, e, b);
                else {
                    if ("--" === g.substr(0, 2)) {
                        this._tween._propLookup[g] = this._addTween.call(this._tween, a.style, "setProperty", oa(a).getPropertyValue(g) + "", w + "", g, !1, g);
                        continue
                    }
                    k = ba(a, g, f) + "";
                    U = "string" ==
                        typeof w;
                    if ("color" === g || "fill" === g || "stroke" === g || -1 !== g.indexOf("Color") || U && F.test(w)) U || (w = Ba(w), w = (3 < w.length ? "rgba(" : "rgb(") + w.join(",") + ")"), c = gb(P, g, k, w, !0, "transparent", c, 0, e);
                    else if (U && G.test(w)) c = gb(P, g, k, w, !0, null, c, 0, e);
                    else {
                        m = (l = parseFloat(k)) || 0 === l ? k.substr((l + "").length) : "";
                        if ("" === k || "auto" === k)
                            if ("width" === g || "height" === g) {
                                l = a;
                                var S = g;
                                m = f;
                                if ("svg" === (l.nodeName + "").toLowerCase()) l = (m || oa(l))[S] || 0;
                                else if (l.getCTM && pb(l)) l = l.getBBox()[S] || 0;
                                else {
                                    t = parseFloat("width" === S ? l.offsetWidth :
                                        l.offsetHeight);
                                    var S = L[S],
                                        M = S.length;
                                    for (m = m || oa(l, null); - 1 < --M;) t -= parseFloat(ba(l, "padding" + S[M], m, !0)) || 0, t -= parseFloat(ba(l, "border" + S[M] + "Width", m, !0)) || 0;
                                    l = t
                                }
                                m = "px"
                            } else "left" === g || "top" === g ? (l = v(a, g, f), m = "px") : (l = "opacity" !== g ? 0 : 1, m = "");
                            (t = U && "=" === w.charAt(1)) ? (x = parseInt(w.charAt(0) + "1", 10), w = w.substr(2), x *= parseFloat(w), A = w.replace(O, "")) : (x = parseFloat(w), A = U ? w.replace(O, "") : "");
                            "" === A && (A = g in d ? d[g] : m);
                        w = x || 0 === x ? (t ? x + l : x) + A : b[g];
                        m === A || "" === A && "lineHeight" !== g || !x && 0 !== x || !l || (l = r(a,
                            g, l, m), "%" === A ? (l /= r(a, g, 100, "%") / 100, !0 !== b.strictUnits && (k = l + "%")) : "em" === A || "rem" === A || "vw" === A || "vh" === A ? l /= r(a, g, 1, A) : "px" !== A && (x = r(a, g, x, A), A = "px"), !t || !x && 0 !== x || (w = x + l + A));
                        t && (x += l);
                        !l && 0 !== l || !x && 0 !== x ? void 0 !== P[g] && (w || "NaN" != w + "" && null != w) ? (c = new ya(P, g, x || l || 0, 0, c, -1, g, !1, 0, k, w), c.xs0 = "none" !== w || "display" !== g && -1 === g.indexOf("Style") ? w : k) : _gsScope.console && console.log("invalid " + g + " tween value: " + b[g]) : (c = new ya(P, g, l, x - l, c, 0, g, !1 !== n && ("px" === A || "zIndex" === g), 0, k, w), c.xs0 = A)
                    }
                }
                e &&
                    c && !c.plugin && (c.plugin = e)
            }
            return c
        };
        l.setRatio = function(a) {
            var b, c, d, e = this._firstPT;
            if (1 !== a || this._tween._time !== this._tween._duration && 0 !== this._tween._time)
                if (a || this._tween._time !== this._tween._duration && 0 !== this._tween._time || -1E-6 === this._tween._rawPrevTime)
                    for (; e;) {
                        if (b = e.c * a + e.s, e.r ? b = e.r(b) : 1E-6 > b && -1E-6 < b && (b = 0), e.type)
                            if (1 === e.type)
                                if (d = e.l, 2 === d) e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 + e.xs2;
                                else if (3 === d) e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 + e.xs2 + e.xn2 + e.xs3;
                        else if (4 === d) e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 +
                            e.xs2 + e.xn2 + e.xs3 + e.xn3 + e.xs4;
                        else if (5 === d) e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 + e.xs2 + e.xn2 + e.xs3 + e.xn3 + e.xs4 + e.xn4 + e.xs5;
                        else {
                            c = e.xs0 + b + e.xs1;
                            for (d = 1; d < e.l; d++) c += e["xn" + d] + e["xs" + (d + 1)];
                            e.t[e.p] = c
                        } else -1 === e.type ? e.t[e.p] = e.xs0 : e.setRatio && e.setRatio(a);
                        else e.t[e.p] = b + e.xs0;
                        e = e._next
                    } else
                        for (; e;) 2 !== e.type ? e.t[e.p] = e.b : e.setRatio(a), e = e._next;
                else
                    for (; e;) {
                        if (2 !== e.type)
                            if (e.r && -1 !== e.type)
                                if (b = e.r(e.s + e.c), e.type) {
                                    if (1 === e.type) {
                                        c = e.xs0 + b + e.xs1;
                                        for (d = 1; d < e.l; d++) c += e["xn" + d] + e["xs" + (d + 1)];
                                        e.t[e.p] =
                                            c
                                    }
                                } else e.t[e.p] = b + e.xs0;
                        else e.t[e.p] = e.e;
                        else e.setRatio(a);
                        e = e._next
                    }
        };
        l._enableTransforms = function(a) {
            this._transform = this._transform || Ja(this._target, f, !0);
            this._transformType = this._transform.svg && Va || !a && 3 !== this._transformType ? 2 : 3
        };
        var rb = function(a) {
            this.t[this.p] = this.e;
            this.data._linkCSSP(this, this._next, null, !0)
        };
        l._addLazySet = function(a, b, c) {
            a = this._firstPT = new ya(a, b, 0, 0, this._firstPT, 2);
            a.e = c;
            a.setRatio = rb;
            a.data = this
        };
        l._linkCSSP = function(a, b, c, d) {
            return a && (b && (b._prev = a), a._next &&
                (a._next._prev = a._prev), a._prev ? a._prev._next = a._next : this._firstPT === a && (this._firstPT = a._next, d = !0), c ? c._next = a : d || null !== this._firstPT || (this._firstPT = a), a._next = b, a._prev = c), a
        };
        l._mod = function(a) {
            for (var b = this._firstPT; b;) "function" == typeof a[b.p] && (b.r = a[b.p]), b = b._next
        };
        l._kill = function(a) {
            var c, d, e, f = a;
            if (a.autoAlpha || a.alpha) {
                f = {};
                for (d in a) f[d] = a[d];
                f.opacity = 1;
                f.autoAlpha && (f.visibility = 1)
            }
            a.className && (c = this._classNamePT) && (e = c.xfirst, e && e._prev ? this._linkCSSP(e._prev, c._next, e._prev._prev) :
                e === this._firstPT && (this._firstPT = c._next), c._next && this._linkCSSP(c._next, c._next._next, e._prev), this._classNamePT = null);
            for (c = this._firstPT; c;) c.plugin && c.plugin !== d && c.plugin._kill && (c.plugin._kill(a), d = c.plugin), c = c._next;
            return b.prototype._kill.call(this, f)
        };
        var fb = function(a, b, c) {
            var d, e, f;
            if (a.slice)
                for (d = a.length; - 1 < --d;) fb(a[d], b, c);
            else
                for (a = a.childNodes, d = a.length; - 1 < --d;) e = a[d], f = e.type, e.style && (b.push(w(e)), c && c.push(e)), 1 !== f && 9 !== f && 11 !== f || !e.childNodes.length || fb(e, b, c)
        };
        return g.cascadeTo =
            function(a, b, d) {
                var e, f, g;
                g = c.to(a, b, d);
                var r = [g],
                    h = [],
                    k = [],
                    l = [],
                    v = c._internals.reservedProps;
                a = g._targets || g.target;
                fb(a, h, l);
                g.render(b, !0, !0);
                fb(a, k);
                g.render(0, !0, !0);
                g._enabled(!0);
                for (a = l.length; - 1 < --a;)
                    if (e = A(l[a], h[a], k[a]), e.firstMPT) {
                        e = e.difs;
                        for (f in d) v[f] && (e[f] = d[f]);
                        g = {};
                        for (f in e) g[f] = h[a][f];
                        r.push(c.fromTo(l[a], b, g, e))
                    }
                return r
            }, b.activate([g]), g
    }, !0);
    (function() {
        var b = function(a) {
                var b = 1 > a ? Math.pow(10, (a + "").length - 2) : 1;
                return function(c) {
                    return (Math.round(c / a) * a * b | 0) / b
                }
            },
            c = _gsScope._gsDefine.plugin({
                propName: "roundProps",
                version: "1.7.0",
                priority: -1,
                API: 2,
                init: function(a, b, c) {
                    return this._tween = c, !0
                }
            }).prototype;
        c._onInitAllProps = function() {
            var a, c, f, e = this._tween;
            a = e.vars.roundProps;
            var g = {},
                k = e._propLookup.roundProps;
            if ("object" != typeof a || a.push)
                for ("string" == typeof a && (a = a.split(",")), c = a.length; - 1 < --c;) g[a[c]] = Math.round;
            else
                for (f in a) g[f] = b(a[f]);
            for (f in g)
                for (a = e._firstPT; a;) {
                    c = a._next;
                    if (a.pg) a.t._mod(g);
                    else if (a.n === f)
                        if (2 === a.f && a.t) {
                            a = a.t._firstPT;
                            for (var h = g[f]; a;) a.f || a.blob || (a.m = h || Math.round), a =
                                a._next
                        } else this._add(a.t, f, a.s, a.c, g[f]), c && (c._prev = a._prev), a._prev ? a._prev._next = c : e._firstPT === a && (e._firstPT = c), a._next = a._prev = null, e._propLookup[f] = k;
                    a = c
                }
            return !1
        };
        c._add = function(a, b, c, e, g) {
            this._addTween(a, b, c, c + e, b, g || Math.round);
            this._overwriteProps.push(b)
        }
    })();
    (function() {
        _gsScope._gsDefine.plugin({
            propName: "attr",
            API: 2,
            version: "0.6.1",
            init: function(b, c, a, d) {
                var f;
                if ("function" != typeof b.setAttribute) return !1;
                for (f in c) a = c[f], "function" == typeof a && (a = a(d, b)), this._addTween(b, "setAttribute",
                    b.getAttribute(f) + "", a + "", f, !1, f), this._overwriteProps.push(f);
                return !0
            }
        })
    })();
    _gsScope._gsDefine.plugin({
        propName: "directionalRotation",
        version: "0.3.1",
        API: 2,
        init: function(b, c, a, d) {
            "object" != typeof c && (c = {
                rotation: c
            });
            this.finals = {};
            var f, e, g, k, h, l;
            a = !0 === c.useRadians ? 2 * Math.PI : 360;
            for (f in c) "useRadians" !== f && (k = c[f], "function" == typeof k && (k = k(d, b)), l = (k + "").split("_"), e = l[0], g = parseFloat("function" != typeof b[f] ? b[f] : b[f.indexOf("set") || "function" != typeof b["get" + f.substr(3)] ? f : "get" + f.substr(3)]()),
                k = this.finals[f] = "string" == typeof e && "=" === e.charAt(1) ? g + parseInt(e.charAt(0) + "1", 10) * Number(e.substr(2)) : Number(e) || 0, h = k - g, l.length && (e = l.join("_"), -1 !== e.indexOf("short") && (h %= a, h !== h % (a / 2) && (h = 0 > h ? h + a : h - a)), -1 !== e.indexOf("_cw") && 0 > h ? h = (h + 9999999999 * a) % a - (h / a | 0) * a : -1 !== e.indexOf("ccw") && 0 < h && (h = (h - 9999999999 * a) % a - (h / a | 0) * a)), (1E-6 < h || -1E-6 > h) && (this._addTween(b, f, g, g + h, f), this._overwriteProps.push(f)));
            return !0
        },
        set: function(b) {
            if (1 !== b) this._super.setRatio.call(this, b);
            else
                for (b = this._firstPT; b;) b.f ?
                    b.t[b.p](this.finals[b.p]) : b.t[b.p] = this.finals[b.p], b = b._next
        }
    })._autoCSS = !0;
    _gsScope._gsDefine("easing.Back", ["easing.Ease"], function(b) {
        var c, a, d, f, e = _gsScope.GreenSockGlobals || _gsScope,
            g = 2 * Math.PI,
            k = Math.PI / 2,
            h = e.com.greensock._class,
            l = function(a, c) {
                var d = h("easing." + a, function() {}, !0),
                    e = d.prototype = new b;
                return e.constructor = d, e.getRatio = c, d
            },
            n = b.register || function() {},
            u = function(a, b, c, d, e) {
                b = h("easing." + a, {
                    easeOut: new b,
                    easeIn: new c,
                    easeInOut: new d
                }, !0);
                return n(b, a), b
            },
            J = function(a, b, c) {
                this.t =
                    a;
                this.v = b;
                c && (this.next = c, c.prev = this, this.c = c.v - b, this.gap = c.t - a)
            },
            z = function(a, c) {
                var d = h("easing." + a, function(a) {
                        this._p1 = a || 0 === a ? a : 1.70158;
                        this._p2 = 1.525 * this._p1
                    }, !0),
                    e = d.prototype = new b;
                return e.constructor = d, e.getRatio = c, e.config = function(a) {
                    return new d(a)
                }, d
            },
            z = u("Back", z("BackOut", function(a) {
                return --a * a * ((this._p1 + 1) * a + this._p1) + 1
            }), z("BackIn", function(a) {
                return a * a * ((this._p1 + 1) * a - this._p1)
            }), z("BackInOut", function(a) {
                return 1 > (a *= 2) ? .5 * a * a * ((this._p2 + 1) * a - this._p2) : .5 * ((a -= 2) * a * ((this._p2 +
                    1) * a + this._p2) + 2)
            })),
            V = h("easing.SlowMo", function(a, b, c) {
                null == a ? a = .7 : 1 < a && (a = 1);
                this._p = 1 !== a ? b || 0 === b ? b : .7 : 0;
                this._p1 = (1 - a) / 2;
                this._p2 = a;
                this._p3 = this._p1 + this._p2;
                this._calcEnd = !0 === c
            }, !0),
            m = V.prototype = new b;
        return m.constructor = V, m.getRatio = function(a) {
                var b = a + (.5 - a) * this._p;
                return a < this._p1 ? this._calcEnd ? 1 - (a = 1 - a / this._p1) * a : b - (a = 1 - a / this._p1) * a * a * a * b : a > this._p3 ? this._calcEnd ? 1 === a ? 0 : 1 - (a = (a - this._p3) / this._p1) * a : b + (a - b) * (a = (a - this._p3) / this._p1) * a * a * a : this._calcEnd ? 1 : b
            }, V.ease = new V(.7, .7),
            m.config = V.config = function(a, b, c) {
                return new V(a, b, c)
            }, c = h("easing.SteppedEase", function(a, b) {
                a = a || 1;
                this._p1 = 1 / a;
                this._p2 = a + (b ? 0 : 1);
                this._p3 = b ? 1 : 0
            }, !0), m = c.prototype = new b, m.constructor = c, m.getRatio = function(a) {
                return 0 > a ? a = 0 : 1 <= a && (a = .999999999), ((this._p2 * a | 0) + this._p3) * this._p1
            }, m.config = c.config = function(a, b) {
                return new c(a, b)
            }, a = h("easing.ExpoScaleEase", function(a, b, c) {
                this._p1 = Math.log(b / a);
                this._p2 = b - a;
                this._p3 = a;
                this._ease = c
            }, !0), m = a.prototype = new b, m.constructor = a, m.getRatio = function(a) {
                return this._ease &&
                    (a = this._ease.getRatio(a)), (this._p3 * Math.exp(this._p1 * a) - this._p3) / this._p2
            }, m.config = a.config = function(b, c, d) {
                return new a(b, c, d)
            }, d = h("easing.RoughEase", function(a) {
                a = a || {};
                for (var c, d, e, f, g = a.taper || "none", h = [], k = 0, l = f = 0 | (a.points || 20), m = !1 !== a.randomize, n = !0 === a.clamp, u = a.template instanceof b ? a.template : null, z = "number" == typeof a.strength ? .4 * a.strength : .4; - 1 < --l;) a = m ? Math.random() : 1 / f * l, c = u ? u.getRatio(a) : a, "none" === g ? d = z : "out" === g ? (e = 1 - a, d = e * e * z) : "in" === g ? d = a * a * z : .5 > a ? (e = 2 * a, d = e * e * .5 * z) : (e = 2 *
                    (1 - a), d = e * e * .5 * z), m ? c += Math.random() * d - .5 * d : l % 2 ? c += .5 * d : c -= .5 * d, n && (1 < c ? c = 1 : 0 > c && (c = 0)), h[k++] = {
                    x: a,
                    y: c
                };
                h.sort(function(a, b) {
                    return a.x - b.x
                });
                d = new J(1, 1, null);
                for (l = f; - 1 < --l;) f = h[l], d = new J(f.x, f.y, d);
                this._prev = new J(0, 0, 0 !== d.t ? d : d.next)
            }, !0), m = d.prototype = new b, m.constructor = d, m.getRatio = function(a) {
                var b = this._prev;
                if (a > b.t) {
                    for (; b.next && a >= b.t;) b = b.next;
                    b = b.prev
                } else
                    for (; b.prev && a <= b.t;) b = b.prev;
                return this._prev = b, b.v + (a - b.t) / b.gap * b.c
            }, m.config = function(a) {
                return new d(a)
            }, d.ease = new d,
            u("Bounce", l("BounceOut", function(a) {
                return 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
            }), l("BounceIn", function(a) {
                return (a = 1 - a) < 1 / 2.75 ? 1 - 7.5625 * a * a : 2 / 2.75 > a ? 1 - (7.5625 * (a -= 1.5 / 2.75) * a + .75) : 2.5 / 2.75 > a ? 1 - (7.5625 * (a -= 2.25 / 2.75) * a + .9375) : 1 - (7.5625 * (a -= 2.625 / 2.75) * a + .984375)
            }), l("BounceInOut", function(a) {
                var b = .5 > a;
                return a = b ? 1 - 2 * a : 2 * a - 1, a = 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -=
                    2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375, b ? .5 * (1 - a) : .5 * a + .5
            })), u("Circ", l("CircOut", function(a) {
                return Math.sqrt(1 - --a * a)
            }), l("CircIn", function(a) {
                return -(Math.sqrt(1 - a * a) - 1)
            }), l("CircInOut", function(a) {
                return 1 > (a *= 2) ? -.5 * (Math.sqrt(1 - a * a) - 1) : .5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
            })), f = function(a, c, d) {
                var e = h("easing." + a, function(a, b) {
                    this._p1 = 1 <= a ? a : 1;
                    this._p2 = (b || d) / (1 > a ? a : 1);
                    this._p3 = this._p2 / g * (Math.asin(1 / this._p1) || 0);
                    this._p2 = g / this._p2
                }, !0);
                a = e.prototype = new b;
                return a.constructor = e, a.getRatio =
                    c, a.config = function(a, b) {
                        return new e(a, b)
                    }, e
            }, u("Elastic", f("ElasticOut", function(a) {
                return this._p1 * Math.pow(2, -10 * a) * Math.sin((a - this._p3) * this._p2) + 1
            }, .3), f("ElasticIn", function(a) {
                return -(this._p1 * Math.pow(2, 10 * --a) * Math.sin((a - this._p3) * this._p2))
            }, .3), f("ElasticInOut", function(a) {
                return 1 > (a *= 2) ? -.5 * this._p1 * Math.pow(2, 10 * --a) * Math.sin((a - this._p3) * this._p2) : this._p1 * Math.pow(2, -10 * --a) * Math.sin((a - this._p3) * this._p2) * .5 + 1
            }, .45)), u("Expo", l("ExpoOut", function(a) {
                    return 1 - Math.pow(2, -10 * a)
                }),
                l("ExpoIn", function(a) {
                    return Math.pow(2, 10 * (a - 1)) - .001
                }), l("ExpoInOut", function(a) {
                    return 1 > (a *= 2) ? .5 * Math.pow(2, 10 * (a - 1)) : .5 * (2 - Math.pow(2, -10 * (a - 1)))
                })), u("Sine", l("SineOut", function(a) {
                return Math.sin(a * k)
            }), l("SineIn", function(a) {
                return -Math.cos(a * k) + 1
            }), l("SineInOut", function(a) {
                return -.5 * (Math.cos(Math.PI * a) - 1)
            })), h("easing.EaseLookup", {
                find: function(a) {
                    return b.map[a]
                }
            }, !0), n(e.SlowMo, "SlowMo", "ease,"), n(d, "RoughEase", "ease,"), n(c, "SteppedEase", "ease,"), z
    }, !0)
});
_gsScope._gsDefine && _gsScope._gsQueue.pop()();
(function(b, c) {
    var a = {},
        d = b.document,
        f = b.GreenSockGlobals = b.GreenSockGlobals || b,
        e = f[c];
    if (e) return "undefined" != typeof module && module.exports && (module.exports = e), e;
    var g, k, h, l, n = function(a) {
            var b = a.split("."),
                c = f;
            for (a = 0; a < b.length; a++) c[b[a]] = c = c[b[a]] || {};
            return c
        },
        u = n("com.greensock"),
        J = function(a) {
            var b, c = [],
                d = a.length;
            for (b = 0; b !== d; c.push(a[b++]));
            return c
        },
        z = function() {},
        V = function() {
            var a = Object.prototype.toString,
                b = a.call([]);
            return function(c) {
                return null != c && (c instanceof Array || "object" ==
                    typeof c && !!c.push && a.call(c) === b)
            }
        }(),
        m = {},
        p = function(d, e, g, h) {
            this.sc = m[d] ? m[d].sc : [];
            m[d] = this;
            this.gsClass = null;
            this.func = g;
            var k = [];
            this.check = function(l) {
                for (var q, P, t, u, y = e.length, z = y; - 1 < --y;)(q = m[e[y]] || new p(e[y], [])).gsClass ? (k[y] = q.gsClass, z--) : l && q.sc.push(this);
                if (0 === z && g) {
                    if (P = ("com.greensock." + d).split("."), t = P.pop(), u = n(P.join("."))[t] = this.gsClass = g.apply(g, k), h)
                        if (f[t] = a[t] = u, "undefined" != typeof module && module.exports)
                            if (d === c)
                                for (y in module.exports = a[c] = u, a) u[y] = a[y];
                            else a[c] &&
                                (a[c][t] = u);
                    else "function" == typeof define && define.amd && define((b.GreenSockAMDPath ? b.GreenSockAMDPath + "/" : "") + d.split(".").pop(), [], function() {
                        return u
                    });
                    for (y = 0; y < this.sc.length; y++) this.sc[y].check()
                }
            };
            this.check(!0)
        },
        q = b._gsDefine = function(a, b, c, d) {
            return new p(a, b, c, d)
        },
        t = u._class = function(a, b, c) {
            return b = b || function() {}, q(a, [], function() {
                return b
            }, c), b
        };
    q.globals = f;
    var X = [0, 0, 1, 1],
        T = t("easing.Ease", function(a, b, c, d) {
            this._func = a;
            this._type = c || 0;
            this._power = d || 0;
            this._params = b ? X.concat(b) : X
        }, !0),
        K = T.map = {},
        O = T.register = function(a, b, c, d) {
            var e, f, g;
            b = b.split(",");
            for (var h = b.length, k = (c || "easeIn,easeOut,easeInOut").split(","); - 1 < --h;)
                for (e = b[h], c = d ? t("easing." + e, null, !0) : u.easing[e] || {}, f = k.length; - 1 < --f;) g = k[f], K[e + "." + g] = K[g + e] = c[g] = a.getRatio ? a : a[g] || new a
        },
        e = T.prototype;
    e._calcEnd = !1;
    e.getRatio = function(a) {
        if (this._func) return this._params[0] = a, this._func.apply(null, this._params);
        var b = this._type,
            c = this._power,
            d = 1 === b ? 1 - a : 2 === b ? a : .5 > a ? 2 * a : 2 * (1 - a);
        return 1 === c ? d *= d : 2 === c ? d *= d * d : 3 === c ? d *=
            d * d * d : 4 === c && (d *= d * d * d * d), 1 === b ? 1 - d : 2 === b ? d : .5 > a ? d / 2 : 1 - d / 2
    };
    g = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"];
    for (k = g.length; - 1 < --k;) e = g[k] + ",Power" + k, O(new T(null, null, 1, k), e, "easeOut", !0), O(new T(null, null, 2, k), e, "easeIn" + (0 === k ? ",easeNone" : "")), O(new T(null, null, 3, k), e, "easeInOut");
    K.linear = u.easing.Linear.easeIn;
    K.swing = u.easing.Quad.easeInOut;
    var E = t("events.EventDispatcher", function(a) {
            this._listeners = {};
            this._eventTarget = a || this
        }),
        e = E.prototype;
    e.addEventListener = function(a, b, c, d, e) {
        e = e ||
            0;
        var f, g = this._listeners[a],
            k = 0;
        this !== h || l || h.wake();
        null == g && (this._listeners[a] = g = []);
        for (f = g.length; - 1 < --f;) a = g[f], a.c === b && a.s === c ? g.splice(f, 1) : 0 === k && a.pr < e && (k = f + 1);
        g.splice(k, 0, {
            c: b,
            s: c,
            up: d,
            pr: e
        })
    };
    e.removeEventListener = function(a, b) {
        var c, d = this._listeners[a];
        if (d)
            for (c = d.length; - 1 < --c;)
                if (d[c].c === b) return void d.splice(c, 1)
    };
    e.dispatchEvent = function(a) {
        var b, c, d, e = this._listeners[a];
        if (e)
            for (b = e.length, 1 < b && (e = e.slice(0)), c = this._eventTarget; - 1 < --b;)(d = e[b]) && (d.up ? d.c.call(d.s || c, {
                type: a,
                target: c
            }) : d.c.call(d.s || c))
    };
    var B = b.requestAnimationFrame,
        I = b.cancelAnimationFrame,
        F = Date.now || function() {
            return (new Date).getTime()
        },
        R = F();
    g = ["ms", "moz", "webkit", "o"];
    for (k = g.length; - 1 < --k && !B;) B = b[g[k] + "RequestAnimationFrame"], I = b[g[k] + "CancelAnimationFrame"] || b[g[k] + "CancelRequestAnimationFrame"];
    t("Ticker", function(a, b) {
        var c, e, f, g, k, m = this,
            n = F(),
            q = !1 !== b && B ? "auto" : !1,
            p = 500,
            t = 33,
            u = function(a) {
                var b, d;
                b = F() - R;
                b > p && (n += b - t);
                R += b;
                m.time = (R - n) / 1E3;
                b = m.time - k;
                (!c || 0 < b || !0 === a) && (m.frame++, k += b + (b >=
                    g ? .004 : g - b), d = !0);
                !0 !== a && (f = e(u));
                d && m.dispatchEvent("tick")
            };
        E.call(m);
        m.time = m.frame = 0;
        m.tick = function() {
            u(!0)
        };
        m.lagSmoothing = function(a, b) {
            return arguments.length ? (p = a || 1E10, void(t = Math.min(b, p, 0))) : 1E10 > p
        };
        m.sleep = function() {
            null != f && (q && I ? I(f) : clearTimeout(f), e = z, f = null, m === h && (l = !1))
        };
        m.wake = function(a) {
            null !== f ? m.sleep() : a ? n += -R + (R = F()) : 10 < m.frame && (R = F() - p + 5);
            e = 0 === c ? z : q && B ? B : function(a) {
                return setTimeout(a, 1E3 * (k - m.time) + 1 | 0)
            };
            m === h && (l = !0);
            u(2)
        };
        m.fps = function(a) {
            return arguments.length ?
                (c = a, g = 1 / (c || 60), k = this.time + g, void m.wake()) : c
        };
        m.useRAF = function(a) {
            return arguments.length ? (m.sleep(), q = a, void m.fps(c)) : q
        };
        m.fps(a);
        setTimeout(function() {
            "auto" === q && 5 > m.frame && "hidden" !== (d || {}).visibilityState && m.useRAF(!1)
        }, 1500)
    });
    e = u.Ticker.prototype = new u.events.EventDispatcher;
    e.constructor = u.Ticker;
    var H = t("core.Animation", function(a, b) {
        if (this.vars = b = b || {}, this._duration = this._totalDuration = a || 0, this._delay = Number(b.delay) || 0, this._timeScale = 1, this._active = !0 === b.immediateRender, this.data =
            b.data, this._reversed = !0 === b.reversed, aa) {
            l || h.wake();
            var c = this.vars.useFrames ? ka : aa;
            c.add(this, c._time);
            this.vars.paused && this.paused(!0)
        }
    });
    h = H.ticker = new u.Ticker;
    e = H.prototype;
    e._dirty = e._gc = e._initted = e._paused = !1;
    e._totalTime = e._time = 0;
    e._rawPrevTime = -1;
    e._next = e._last = e._onUpdate = e._timeline = e.timeline = null;
    e._paused = !1;
    var W = function() {
        l && 2E3 < F() - R && ("hidden" !== (d || {}).visibilityState || !h.lagSmoothing()) && h.wake();
        var a = setTimeout(W, 2E3);
        a.unref && a.unref()
    };
    W();
    e.play = function(a, b) {
        return null !=
            a && this.seek(a, b), this.reversed(!1).paused(!1)
    };
    e.pause = function(a, b) {
        return null != a && this.seek(a, b), this.paused(!0)
    };
    e.resume = function(a, b) {
        return null != a && this.seek(a, b), this.paused(!1)
    };
    e.seek = function(a, b) {
        return this.totalTime(Number(a), !1 !== b)
    };
    e.restart = function(a, b) {
        return this.reversed(!1).paused(!1).totalTime(a ? -this._delay : 0, !1 !== b, !0)
    };
    e.reverse = function(a, b) {
        return null != a && this.seek(a || this.totalDuration(), b), this.reversed(!0).paused(!1)
    };
    e.render = function(a, b, c) {};
    e.invalidate = function() {
        return this._time =
            this._totalTime = 0, this._initted = this._gc = !1, this._rawPrevTime = -1, (this._gc || !this.timeline) && this._enabled(!0), this
    };
    e.isActive = function() {
        var a, b = this._timeline,
            c = this._startTime;
        return !b || !this._gc && !this._paused && b.isActive() && (a = b.rawTime(!0)) >= c && a < c + this.totalDuration() / this._timeScale - 1E-7
    };
    e._enabled = function(a, b) {
        return l || h.wake(), this._gc = !a, this._active = this.isActive(), !0 !== b && (a && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !a && this.timeline && this._timeline._remove(this, !0)), !1
    };
    e._kill = function(a, b) {
        return this._enabled(!1, !1)
    };
    e.kill = function(a, b) {
        return this._kill(a, b), this
    };
    e._uncache = function(a) {
        for (a = a ? this : this.timeline; a;) a._dirty = !0, a = a.timeline;
        return this
    };
    e._swapSelfInParams = function(a) {
        for (var b = a.length, c = a.concat(); - 1 < --b;) "{self}" === a[b] && (c[b] = this);
        return c
    };
    e._callback = function(a) {
        var b = this.vars,
            c = b[a],
            d = b[a + "Params"];
        a = b[a + "Scope"] || b.callbackScope || this;
        switch (d ? d.length : 0) {
            case 0:
                c.call(a);
                break;
            case 1:
                c.call(a, d[0]);
                break;
            case 2:
                c.call(a,
                    d[0], d[1]);
                break;
            default:
                c.apply(a, d)
        }
    };
    e.eventCallback = function(a, b, c, d) {
        if ("on" === (a || "").substr(0, 2)) {
            var e = this.vars;
            if (1 === arguments.length) return e[a];
            null == b ? delete e[a] : (e[a] = b, e[a + "Params"] = V(c) && -1 !== c.join("").indexOf("{self}") ? this._swapSelfInParams(c) : c, e[a + "Scope"] = d);
            "onUpdate" === a && (this._onUpdate = b)
        }
        return this
    };
    e.delay = function(a) {
        return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + a - this._delay), this._delay = a, this) : this._delay
    };
    e.duration = function(a) {
        return arguments.length ?
            (this._duration = this._totalDuration = a, this._uncache(!0), this._timeline.smoothChildTiming && 0 < this._time && this._time < this._duration && 0 !== a && this.totalTime(a / this._duration * this._totalTime, !0), this) : (this._dirty = !1, this._duration)
    };
    e.totalDuration = function(a) {
        return this._dirty = !1, arguments.length ? this.duration(a) : this._totalDuration
    };
    e.time = function(a, b) {
        return arguments.length ? (this._dirty && this.totalDuration(), this.totalTime(a > this._duration ? this._duration : a, b)) : this._time
    };
    e.totalTime = function(a,
        b, c) {
        if (l || h.wake(), !arguments.length) return this._totalTime;
        if (this._timeline) {
            if (0 > a && !c && (a += this.totalDuration()), this._timeline.smoothChildTiming) {
                this._dirty && this.totalDuration();
                var d = this._totalDuration,
                    e = this._timeline;
                if (a > d && !c && (a = d), this._startTime = (this._paused ? this._pauseTime : e._time) - (this._reversed ? d - a : a) / this._timeScale, e._dirty || this._uncache(!1), e._timeline)
                    for (; e._timeline;) e._timeline._time !== (e._startTime + e._totalTime) / e._timeScale && e.totalTime(e._totalTime, !0), e = e._timeline
            }
            this._gc &&
                this._enabled(!0, !1);
            (this._totalTime !== a || 0 === this._duration) && (Z.length && va(), this.render(a, b, !1), Z.length && va())
        }
        return this
    };
    e.progress = e.totalProgress = function(a, b) {
        var c = this.duration();
        return arguments.length ? this.totalTime(c * a, b) : c ? this._time / c : this.ratio
    };
    e.startTime = function(a) {
        return arguments.length ? (a !== this._startTime && (this._startTime = a, this.timeline && this.timeline._sortChildren && this.timeline.add(this, a - this._delay)), this) : this._startTime
    };
    e.endTime = function(a) {
        return this._startTime +
            (0 != a ? this.totalDuration() : this.duration()) / this._timeScale
    };
    e.timeScale = function(a) {
        if (!arguments.length) return this._timeScale;
        var b, c;
        a = a || 1E-10;
        this._timeline && this._timeline.smoothChildTiming && (b = this._pauseTime, c = b || 0 === b ? b : this._timeline.totalTime(), this._startTime = c - (c - this._startTime) * this._timeScale / a);
        this._timeScale = a;
        for (c = this.timeline; c && c.timeline;) c._dirty = !0, c.totalDuration(), c = c.timeline;
        return this
    };
    e.reversed = function(a) {
        return arguments.length ? (a != this._reversed && (this._reversed =
            a, this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, !0)), this) : this._reversed
    };
    e.paused = function(a) {
        if (!arguments.length) return this._paused;
        var b, c, d = this._timeline;
        return a != this._paused && d && (l || a || h.wake(), b = d.rawTime(), c = b - this._pauseTime, !a && d.smoothChildTiming && (this._startTime += c, this._uncache(!1)), this._pauseTime = a ? b : null, this._paused = a, this._active = this.isActive(), !a && 0 !== c && this._initted && this.duration() && (b = d.smoothChildTiming ?
            this._totalTime : (b - this._startTime) / this._timeScale, this.render(b, b === this._totalTime, !0))), this._gc && !a && this._enabled(!0, !1), this
    };
    g = t("core.SimpleTimeline", function(a) {
        H.call(this, 0, a);
        this.autoRemoveChildren = this.smoothChildTiming = !0
    });
    e = g.prototype = new H;
    e.constructor = g;
    e.kill()._gc = !1;
    e._first = e._last = e._recent = null;
    e._sortChildren = !1;
    e.add = e.insert = function(a, b, c, d) {
        if (a._startTime = Number(b || 0) + a._delay, a._paused && this !== a._timeline && (a._pauseTime = this.rawTime() - (a._timeline.rawTime() - a._pauseTime)),
            a.timeline && a.timeline._remove(a, !0), a.timeline = a._timeline = this, a._gc && a._enabled(!0, !0), b = this._last, this._sortChildren)
            for (c = a._startTime; b && b._startTime > c;) b = b._prev;
        return b ? (a._next = b._next, b._next = a) : (a._next = this._first, this._first = a), a._next ? a._next._prev = a : this._last = a, a._prev = b, this._recent = a, this._timeline && this._uncache(!0), this
    };
    e._remove = function(a, b) {
        return a.timeline === this && (b || a._enabled(!1, !0), a._prev ? a._prev._next = a._next : this._first === a && (this._first = a._next), a._next ? a._next._prev =
            a._prev : this._last === a && (this._last = a._prev), a._next = a._prev = a.timeline = null, a === this._recent && (this._recent = this._last), this._timeline && this._uncache(!0)), this
    };
    e.render = function(a, b, c) {
        var d, e = this._first;
        for (this._totalTime = this._time = this._rawPrevTime = a; e;) d = e._next, (e._active || a >= e._startTime && !e._paused && !e._gc) && (e._reversed ? e.render((e._dirty ? e.totalDuration() : e._totalDuration) - (a - e._startTime) * e._timeScale, b, c) : e.render((a - e._startTime) * e._timeScale, b, c)), e = d
    };
    e.rawTime = function() {
        return l ||
            h.wake(), this._totalTime
    };
    var C = t("TweenLite", function(a, c, d) {
            if (H.call(this, c, d), this.render = C.prototype.render, null == a) throw "Cannot tween a null target.";
            this.target = a = "string" != typeof a ? a : C.selector(a) || a;
            var e, f;
            e = a.jquery || a.length && a !== b && a[0] && (a[0] === b || a[0].nodeType && a[0].style && !a.nodeType);
            d = this.vars.overwrite;
            if (this._overwrite = d = null == d ? pa[C.defaultOverwrite] : "number" == typeof d ? d >> 0 : pa[d], (e || a instanceof Array || a.push && V(a)) && "number" != typeof a[0])
                for (this._targets = f = J(a), this._propLookup = [], this._siblings = [], a = 0; a < f.length; a++)(e = f[a]) ? "string" != typeof e ? e.length && e !== b && e[0] && (e[0] === b || e[0].nodeType && e[0].style && !e.nodeType) ? (f.splice(a--, 1), this._targets = f = f.concat(J(e))) : (this._siblings[a] = Ca(e, this, !1), 1 === d && 1 < this._siblings[a].length && xa(e, this, null, 1, this._siblings[a])) : (e = f[a--] = C.selector(e), "string" == typeof e && f.splice(a + 1, 1)) : f.splice(a--, 1);
            else this._propLookup = {}, this._siblings = Ca(a, this, !1), 1 === d && 1 < this._siblings.length && xa(a, this, null, 1, this._siblings);
            (this.vars.immediateRender ||
                0 === c && 0 === this._delay && !1 !== this.vars.immediateRender) && (this._time = -1E-10, this.render(Math.min(0, -this._delay)))
        }, !0),
        fa = function(a) {
            return a && a.length && a !== b && a[0] && (a[0] === b || a[0].nodeType && a[0].style && !a.nodeType)
        },
        e = C.prototype = new H;
    e.constructor = C;
    e.kill()._gc = !1;
    e.ratio = 0;
    e._firstPT = e._targets = e._overwrittenProps = e._startAt = null;
    e._notifyPluginsOfEnabled = e._lazy = !1;
    C.version = "2.0.2";
    C.defaultEase = e._ease = new T(null, null, 1, 1);
    C.defaultOverwrite = "auto";
    C.ticker = h;
    C.autoSleep = 120;
    C.lagSmoothing =
        function(a, b) {
            h.lagSmoothing(a, b)
        };
    C.selector = b.$ || b.jQuery || function(a) {
        var c = b.$ || b.jQuery;
        return c ? (C.selector = c, c(a)) : (d || (d = b.document), d ? d.querySelectorAll ? d.querySelectorAll(a) : d.getElementById("#" === a.charAt(0) ? a.substr(1) : a) : a)
    };
    var Z = [],
        na = {},
        ia = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
        G = /[\+-]=-?[\.\d]/,
        y = function(a) {
            for (var b, c = this._firstPT; c;) b = c.blob ? 1 === a && null != this.end ? this.end : a ? this.join("") : this.start : c.c * a + c.s, c.m ? b = c.m.call(this._tween, b, this._target || c.t, this._tween) :
                1E-6 > b && -1E-6 < b && !c.blob && (b = 0), c.f ? c.fp ? c.t[c.p](c.fp, b) : c.t[c.p](b) : c.t[c.p] = b, c = c._next
        },
        la = function(a, b, c, d) {
            var e, f, g, h, k = [],
                l = 0,
                m = "",
                n = 0;
            k.start = a;
            k.end = b;
            a = k[0] = a + "";
            b = k[1] = b + "";
            c && (c(k), a = k[0], b = k[1]);
            k.length = 0;
            a = a.match(ia) || [];
            c = b.match(ia) || [];
            d && (d._next = null, d.blob = 1, k._firstPT = k._applyPT = d);
            f = c.length;
            for (d = 0; f > d; d++) h = c[d], g = b.substr(l, b.indexOf(h, l) - l), m += g || !d ? g : ",", l += g.length, n ? n = (n + 1) % 5 : "rgba(" === g.substr(-5) && (n = 1), h === a[d] || a.length <= d ? m += h : (m && (k.push(m), m = ""), e = parseFloat(a[d]),
                k.push(e), k._firstPT = {
                    _next: k._firstPT,
                    t: k,
                    p: k.length - 1,
                    s: e,
                    c: ("=" === h.charAt(1) ? parseInt(h.charAt(0) + "1", 10) * parseFloat(h.substr(2)) : parseFloat(h) - e) || 0,
                    f: 0,
                    m: n && 4 > n ? Math.round : 0
                }), l += h.length;
            return m += b.substr(l), m && k.push(m), k.setRatio = y, G.test(b) && (k.end = null), k
        },
        ma = function(a, b, c, d, e, f, g, h, k) {
            "function" == typeof d && (d = d(k || 0, a));
            var l;
            k = typeof a[b];
            var m = "function" !== k ? "" : b.indexOf("set") || "function" != typeof a["get" + b.substr(3)] ? b : "get" + b.substr(3);
            c = "get" !== c ? c : m ? g ? a[m](g) : a[m]() : a[b];
            m = "string" ==
                typeof d && "=" === d.charAt(1);
            a = {
                t: a,
                p: b,
                s: c,
                f: "function" === k,
                pg: 0,
                n: e || b,
                m: f ? "function" == typeof f ? f : Math.round : 0,
                pr: 0,
                c: m ? parseInt(d.charAt(0) + "1", 10) * parseFloat(d.substr(2)) : parseFloat(d) - c || 0
            };
            return ("number" != typeof c || "number" != typeof d && !m) && (g || isNaN(c) || !m && isNaN(d) || "boolean" == typeof c || "boolean" == typeof d ? (a.fp = g, l = la(c, m ? parseFloat(a.s) + a.c + (a.s + "").replace(/[0-9\-\.]/g, "") : d, h || C.defaultStringFilter, a), a = {
                t: l,
                p: "setRatio",
                s: 0,
                c: 1,
                f: 2,
                pg: 0,
                n: e || b,
                pr: 0,
                m: 0
            }) : (a.s = parseFloat(c), m || (a.c = parseFloat(d) -
                a.s || 0))), a.c ? ((a._next = this._firstPT) && (a._next._prev = a), this._firstPT = a, a) : void 0
        };
    k = C._internals = {
        isArray: V,
        isSelector: fa,
        lazyTweens: Z,
        blobDif: la
    };
    var Y = C._plugins = {},
        ca = k.tweenLookup = {},
        ja = 0,
        qa = k.reservedProps = {
            ease: 1,
            delay: 1,
            overwrite: 1,
            onComplete: 1,
            onCompleteParams: 1,
            onCompleteScope: 1,
            useFrames: 1,
            runBackwards: 1,
            startAt: 1,
            onUpdate: 1,
            onUpdateParams: 1,
            onUpdateScope: 1,
            onStart: 1,
            onStartParams: 1,
            onStartScope: 1,
            onReverseComplete: 1,
            onReverseCompleteParams: 1,
            onReverseCompleteScope: 1,
            onRepeat: 1,
            onRepeatParams: 1,
            onRepeatScope: 1,
            easeParams: 1,
            yoyo: 1,
            immediateRender: 1,
            repeat: 1,
            repeatDelay: 1,
            data: 1,
            paused: 1,
            reversed: 1,
            autoCSS: 1,
            lazy: 1,
            onOverwrite: 1,
            callbackScope: 1,
            stringFilter: 1,
            id: 1,
            yoyoEase: 1
        },
        pa = {
            none: 0,
            all: 1,
            auto: 2,
            concurrent: 3,
            allOnStart: 4,
            preexisting: 5,
            "true": 1,
            "false": 0
        },
        ka = H._rootFramesTimeline = new g,
        aa = H._rootTimeline = new g,
        D = 30,
        va = k.lazyRender = function() {
            var a, b = Z.length;
            for (na = {}; - 1 < --b;)(a = Z[b]) && !1 !== a._lazy && (a.render(a._lazy[0], a._lazy[1], !0), a._lazy = !1);
            Z.length = 0
        };
    aa._startTime = h.time;
    ka._startTime =
        h.frame;
    aa._active = ka._active = !0;
    setTimeout(va, 1);
    H._updateRoot = C.render = function() {
        var a, b, c;
        if (Z.length && va(), aa.render((h.time - aa._startTime) * aa._timeScale, !1, !1), ka.render((h.frame - ka._startTime) * ka._timeScale, !1, !1), Z.length && va(), h.frame >= D) {
            D = h.frame + (parseInt(C.autoSleep, 10) || 120);
            for (c in ca) {
                b = ca[c].tweens;
                for (a = b.length; - 1 < --a;) b[a]._gc && b.splice(a, 1);
                0 === b.length && delete ca[c]
            }
            if (c = aa._first, (!c || c._paused) && C.autoSleep && !ka._first && 1 === h._listeners.tick.length) {
                for (; c && c._paused;) c = c._next;
                c || h.sleep()
            }
        }
    };
    h.addEventListener("tick", H._updateRoot);
    var Ca = function(a, b, c) {
            var d, e, f = a._gsTweenID;
            if (ca[f || (a._gsTweenID = f = "t" + ja++)] || (ca[f] = {
                    target: a,
                    tweens: []
                }), b && (d = ca[f].tweens, d[e = d.length] = b, c))
                for (; - 1 < --e;) d[e] === b && d.splice(e, 1);
            return ca[f].tweens
        },
        Fa = function(a, b, c, d) {
            var e, f, g = a.vars.onOverwrite;
            return g && (e = g(a, b, c, d)), g = C.onOverwrite, g && (f = g(a, b, c, d)), !1 !== e && !1 !== f
        },
        xa = function(a, b, c, d, e) {
            var f, g, h, k;
            if (1 === d || 4 <= d) {
                k = e.length;
                for (f = 0; k > f; f++)
                    if ((h = e[f]) !== b) h._gc || h._kill(null,
                        a, b) && (g = !0);
                    else if (5 === d) break;
                return g
            }
            var l, m = b._startTime + 1E-10,
                n = [],
                q = 0,
                p = 0 === b._duration;
            for (f = e.length; - 1 < --f;)(h = e[f]) === b || h._gc || h._paused || (h._timeline !== b._timeline ? (l = l || oa(b, 0, p), 0 === oa(h, l, p) && (n[q++] = h)) : h._startTime <= m && h._startTime + h.totalDuration() / h._timeScale > m && ((p || !h._initted) && 2E-10 >= m - h._startTime || (n[q++] = h)));
            for (f = q; - 1 < --f;)(h = n[f], k = h._firstPT, 2 === d && h._kill(c, a, b) && (g = !0), 2 !== d || !h._firstPT && h._initted && k) && (2 === d || Fa(h, b)) && h._enabled(!1, !1) && (g = !0);
            return g
        },
        oa = function(a,
            b, c) {
            for (var d = a._timeline, e = d._timeScale, f = a._startTime; d._timeline;) {
                if (f += d._startTime, e *= d._timeScale, d._paused) return -100;
                d = d._timeline
            }
            return f /= e, f > b ? f - b : c && f === b || !a._initted && 2E-10 > f - b ? 1E-10 : (f += a.totalDuration() / a._timeScale / e) > b + 1E-10 ? 0 : f - b - 1E-10
        };
    e._init = function() {
        var a, b, c, d, e = this.vars,
            f = this._overwrittenProps,
            g = this._duration;
        d = !!e.immediateRender;
        var h = e.ease;
        if (e.startAt) {
            this._startAt && (this._startAt.render(-1, !0), this._startAt.kill());
            c = {};
            for (a in e.startAt) c[a] = e.startAt[a];
            if (c.data = "isStart", c.overwrite = !1, c.immediateRender = !0, c.lazy = d && !1 !== e.lazy, c.startAt = c.delay = null, c.onUpdate = e.onUpdate, c.onUpdateParams = e.onUpdateParams, c.onUpdateScope = e.onUpdateScope || e.callbackScope || this, this._startAt = C.to(this.target || {}, 0, c), d)
                if (0 < this._time) this._startAt = null;
                else if (0 !== g) return
        } else if (e.runBackwards && 0 !== g)
            if (this._startAt) this._startAt.render(-1, !0), this._startAt.kill(), this._startAt = null;
            else {
                0 !== this._time && (d = !1);
                c = {};
                for (a in e) qa[a] && "autoCSS" !== a || (c[a] = e[a]);
                if (c.overwrite = 0, c.data = "isFromStart", c.lazy = d && !1 !== e.lazy, c.immediateRender = d, this._startAt = C.to(this.target, 0, c), d) {
                    if (0 === this._time) return
                } else this._startAt._init(), this._startAt._enabled(!1), this.vars.immediateRender && (this._startAt = null)
            }
        if (this._ease = h = h ? h instanceof T ? h : "function" == typeof h ? new T(h, e.easeParams) : K[h] || C.defaultEase : C.defaultEase, e.easeParams instanceof Array && h.config && (this._ease = h.config.apply(h, e.easeParams)), this._easeType = this._ease._type, this._easePower = this._ease._power,
            this._firstPT = null, this._targets)
            for (d = this._targets.length, a = 0; d > a; a++) this._initProps(this._targets[a], this._propLookup[a] = {}, this._siblings[a], f ? f[a] : null, a) && (b = !0);
        else b = this._initProps(this.target, this._propLookup, this._siblings, f, 0);
        if (b && C._onPluginEvent("_onInitAllProps", this), f && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)), e.runBackwards)
            for (c = this._firstPT; c;) c.s += c.c, c.c = -c.c, c = c._next;
        this._onUpdate = e.onUpdate;
        this._initted = !0
    };
    e._initProps = function(a, c, d, e,
        f) {
        var g, h, k, l, m;
        if (null == a) return !1;
        na[a._gsTweenID] && va();
        if (!this.vars.css && a.style && a !== b && a.nodeType && Y.css && !1 !== this.vars.autoCSS) {
            h = this.vars;
            var n = {};
            for (m in h) qa[m] || m in a && "transform" !== m && "x" !== m && "y" !== m && "width" !== m && "height" !== m && "className" !== m && "border" !== m || !(!Y[m] || Y[m] && Y[m]._autoCSS) || (n[m] = h[m], delete h[m]);
            h.css = n
        }
        for (g in this.vars)
            if (h = this.vars[g], qa[g]) h && (h instanceof Array || h.push && V(h)) && -1 !== h.join("").indexOf("{self}") && (this.vars[g] = this._swapSelfInParams(h, this));
            else if (Y[g] && (l = new Y[g])._onInitTween(a, this.vars[g], this, f)) {
            this._firstPT = m = {
                _next: this._firstPT,
                t: l,
                p: "setRatio",
                s: 0,
                c: 1,
                f: 1,
                n: g,
                pg: 1,
                pr: l._priority,
                m: 0
            };
            for (h = l._overwriteProps.length; - 1 < --h;) c[l._overwriteProps[h]] = this._firstPT;
            (l._priority || l._onInitAllProps) && (k = !0);
            (l._onDisable || l._onEnable) && (this._notifyPluginsOfEnabled = !0);
            m._next && (m._next._prev = m)
        } else c[g] = ma.call(this, a, g, "get", h, g, 0, null, this.vars.stringFilter, f);
        return e && this._kill(e, a) ? this._initProps(a, c, d, e, f) : 1 < this._overwrite &&
            this._firstPT && 1 < d.length && xa(a, this, c, this._overwrite, d) ? (this._kill(c, a), this._initProps(a, c, d, e, f)) : (this._firstPT && (!1 !== this.vars.lazy && this._duration || this.vars.lazy && !this._duration) && (na[a._gsTweenID] = !0), k)
    };
    e.render = function(a, b, c) {
        var d, e, f, g, h = this._time,
            k = this._duration;
        f = this._rawPrevTime;
        if (a >= k - 1E-7 && 0 <= a) this._totalTime = this._time = k, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1, this._reversed || (d = !0, e = "onComplete", c = c || this._timeline.autoRemoveChildren), 0 === k && (this._initted ||
            !this.vars.lazy || c) && (this._startTime === this._timeline._duration && (a = 0), (0 > f || 0 >= a && -1E-7 <= a || 1E-10 === f && "isPause" !== this.data) && f !== a && (c = !0, 1E-10 < f && (e = "onReverseComplete")), this._rawPrevTime = g = !b || a || f === a ? a : 1E-10);
        else if (1E-7 > a) this._totalTime = this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== h || 0 === k && 0 < f) && (e = "onReverseComplete", d = this._reversed), 0 > a && (this._active = !1, 0 === k && (this._initted || !this.vars.lazy || c) && (0 <= f && (1E-10 !== f || "isPause" !== this.data) && (c = !0), this._rawPrevTime =
            g = !b || a || f === a ? a : 1E-10)), (!this._initted || this._startAt && this._startAt.progress()) && (c = !0);
        else if (this._totalTime = this._time = a, this._easeType) {
            var l = a / k,
                m = this._easeType,
                n = this._easePower;
            (1 === m || 3 === m && .5 <= l) && (l = 1 - l);
            3 === m && (l *= 2);
            1 === n ? l *= l : 2 === n ? l *= l * l : 3 === n ? l *= l * l * l : 4 === n && (l *= l * l * l * l);
            1 === m ? this.ratio = 1 - l : 2 === m ? this.ratio = l : .5 > a / k ? this.ratio = l / 2 : this.ratio = 1 - l / 2
        } else this.ratio = this._ease.getRatio(a / k);
        if (this._time !== h || c) {
            if (!this._initted) {
                if (this._init(), !this._initted || this._gc) return;
                if (!c && this._firstPT && (!1 !== this.vars.lazy && this._duration || this.vars.lazy && !this._duration)) return this._time = this._totalTime = h, this._rawPrevTime = f, Z.push(this), void(this._lazy = [a, b]);
                this._time && !d ? this.ratio = this._ease.getRatio(this._time / k) : d && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
            }!1 !== this._lazy && (this._lazy = !1);
            this._active || !this._paused && this._time !== h && 0 <= a && (this._active = !0);
            0 !== h || (this._startAt && (0 <= a ? this._startAt.render(a, !0, c) : e || (e = "_dummyGS")), !this.vars.onStart || 0 === this._time && 0 !== k || !b && this._callback("onStart"));
            for (f = this._firstPT; f;) f.f ? f.t[f.p](f.c * this.ratio + f.s) : f.t[f.p] = f.c * this.ratio + f.s, f = f._next;
            this._onUpdate && (0 > a && this._startAt && -1E-4 !== a && this._startAt.render(a, !0, c), b || (this._time !== h || d || c) && this._callback("onUpdate"));
            e && (!this._gc || c) && (0 > a && this._startAt && !this._onUpdate && -1E-4 !== a && this._startAt.render(a, !0, c), d && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !b && this.vars[e] && this._callback(e),
                0 === k && 1E-10 === this._rawPrevTime && 1E-10 !== g && (this._rawPrevTime = 0))
        }
    };
    e._kill = function(a, b, c) {
        if ("all" === a && (a = null), null == a && (null == b || b === this.target)) return this._lazy = !1, this._enabled(!1, !1);
        b = "string" != typeof b ? b || this._targets || this.target : C.selector(b) || b;
        var d, e, f, g, h, k, l, m, n = c && this._time && c._startTime === this._startTime && this._timeline === c._timeline,
            q = this._firstPT;
        if ((V(b) || fa(b)) && "number" != typeof b[0])
            for (d = b.length; - 1 < --d;) this._kill(a, b[d], c) && (k = !0);
        else {
            if (this._targets)
                for (d = this._targets.length; - 1 <
                    --d;) {
                    if (b === this._targets[d]) {
                        h = this._propLookup[d] || {};
                        this._overwrittenProps = this._overwrittenProps || [];
                        e = this._overwrittenProps[d] = a ? this._overwrittenProps[d] || {} : "all";
                        break
                    }
                } else {
                    if (b !== this.target) return !1;
                    h = this._propLookup;
                    e = this._overwrittenProps = a ? this._overwrittenProps || {} : "all"
                }
            if (h) {
                if (d = a || h, l = a !== e && "all" !== e && a !== h && ("object" != typeof a || !a._tempKill), c && (C.onOverwrite || this.vars.onOverwrite)) {
                    for (f in d) h[f] && (m || (m = []), m.push(f));
                    if ((m || !a) && !Fa(this, c, b, m)) return !1
                }
                for (f in d)(g =
                    h[f]) && (n && (g.f ? g.t[g.p](g.s) : g.t[g.p] = g.s, k = !0), g.pg && g.t._kill(d) && (k = !0), g.pg && 0 !== g.t._overwriteProps.length || (g._prev ? g._prev._next = g._next : g === this._firstPT && (this._firstPT = g._next), g._next && (g._next._prev = g._prev), g._next = g._prev = null), delete h[f]), l && (e[f] = 1);
                !this._firstPT && this._initted && q && this._enabled(!1, !1)
            }
        }
        return k
    };
    e.invalidate = function() {
        return this._notifyPluginsOfEnabled && C._onPluginEvent("_onDisable", this), this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null,
            this._notifyPluginsOfEnabled = this._active = this._lazy = !1, this._propLookup = this._targets ? {} : [], H.prototype.invalidate.call(this), this.vars.immediateRender && (this._time = -1E-10, this.render(Math.min(0, -this._delay))), this
    };
    e._enabled = function(a, b) {
        if (l || h.wake(), a && this._gc) {
            var c, d = this._targets;
            if (d)
                for (c = d.length; - 1 < --c;) this._siblings[c] = Ca(d[c], this, !0);
            else this._siblings = Ca(this.target, this, !0)
        }
        return H.prototype._enabled.call(this, a, b), this._notifyPluginsOfEnabled && this._firstPT ? C._onPluginEvent(a ?
            "_onEnable" : "_onDisable", this) : !1
    };
    C.to = function(a, b, c) {
        return new C(a, b, c)
    };
    C.from = function(a, b, c) {
        return c.runBackwards = !0, c.immediateRender = 0 != c.immediateRender, new C(a, b, c)
    };
    C.fromTo = function(a, b, c, d) {
        return d.startAt = c, d.immediateRender = 0 != d.immediateRender && 0 != c.immediateRender, new C(a, b, d)
    };
    C.delayedCall = function(a, b, c, d, e) {
        return new C(b, 0, {
            delay: a,
            onComplete: b,
            onCompleteParams: c,
            callbackScope: d,
            onReverseComplete: b,
            onReverseCompleteParams: c,
            immediateRender: !1,
            lazy: !1,
            useFrames: e,
            overwrite: 0
        })
    };
    C.set = function(a, b) {
        return new C(a, 0, b)
    };
    C.getTweensOf = function(a, b) {
        if (null == a) return [];
        a = "string" != typeof a ? a : C.selector(a) || a;
        var c, d, e, f;
        if ((V(a) || fa(a)) && "number" != typeof a[0]) {
            c = a.length;
            for (d = []; - 1 < --c;) d = d.concat(C.getTweensOf(a[c], b));
            for (c = d.length; - 1 < --c;)
                for (f = d[c], e = c; - 1 < --e;) f === d[e] && d.splice(c, 1)
        } else if (a._gsTweenID)
            for (d = Ca(a).concat(), c = d.length; - 1 < --c;)(d[c]._gc || b && !d[c].isActive()) && d.splice(c, 1);
        return d || []
    };
    C.killTweensOf = C.killDelayedCallsTo = function(a, b, c) {
        "object" == typeof b &&
            (c = b, b = !1);
        b = C.getTweensOf(a, b);
        for (var d = b.length; - 1 < --d;) b[d]._kill(c, a)
    };
    var ba = t("plugins.TweenPlugin", function(a, b) {
        this._overwriteProps = (a || "").split(",");
        this._propName = this._overwriteProps[0];
        this._priority = b || 0;
        this._super = ba.prototype
    }, !0);
    if (e = ba.prototype, ba.version = "1.19.0", ba.API = 2, e._firstPT = null, e._addTween = ma, e.setRatio = y, e._kill = function(a) {
            var b, c = this._overwriteProps,
                d = this._firstPT;
            if (null != a[this._propName]) this._overwriteProps = [];
            else
                for (b = c.length; - 1 < --b;) null != a[c[b]] && c.splice(b,
                    1);
            for (; d;) null != a[d.n] && (d._next && (d._next._prev = d._prev), d._prev ? (d._prev._next = d._next, d._prev = null) : this._firstPT === d && (this._firstPT = d._next)), d = d._next;
            return !1
        }, e._mod = e._roundProps = function(a) {
            for (var b, c = this._firstPT; c;)(b = a[this._propName] || null != c.n && a[c.n.split(this._propName + "_").join("")]) && "function" == typeof b && (2 === c.f ? c.t._applyPT.m = b : c.m = b), c = c._next
        }, C._onPluginEvent = function(a, b) {
            var c, d, e, f, g, h = b._firstPT;
            if ("_onInitAllProps" === a) {
                for (; h;) {
                    g = h._next;
                    for (d = e; d && d.pr > h.pr;) d = d._next;
                    (h._prev = d ? d._prev : f) ? h._prev._next = h: e = h;
                    (h._next = d) ? d._prev = h: f = h;
                    h = g
                }
                h = b._firstPT = e
            }
            for (; h;) h.pg && "function" == typeof h.t[a] && h.t[a]() && (c = !0), h = h._next;
            return c
        }, ba.activate = function(a) {
            for (var b = a.length; - 1 < --b;) a[b].API === ba.API && (Y[(new a[b])._propName] = a[b]);
            return !0
        }, q.plugin = function(a) {
            if (!(a && a.propName && a.init && a.API)) throw "illegal plugin definition.";
            var b, c = a.propName,
                d = a.priority || 0,
                e = a.overwriteProps,
                f = {
                    init: "_onInitTween",
                    set: "setRatio",
                    kill: "_kill",
                    round: "_mod",
                    mod: "_mod",
                    initAll: "_onInitAllProps"
                },
                g = t("plugins." + c.charAt(0).toUpperCase() + c.substr(1) + "Plugin", function() {
                    ba.call(this, c, d);
                    this._overwriteProps = e || []
                }, !0 === a.global),
                h = g.prototype = new ba(c);
            h.constructor = g;
            g.API = a.API;
            for (b in f) "function" == typeof a[b] && (h[f[b]] = a[b]);
            return g.version = a.version, ba.activate([g]), g
        }, g = b._gsQueue) {
        for (k = 0; k < g.length; k++) g[k]();
        for (e in m) m[e].func || b.console.log("GSAP encountered missing dependency: " + e)
    }
    l = !1
})("undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window,
    "TweenMax");
(function() {
    function b(a, b, c) {
        return a.call.apply(a.bind, arguments)
    }

    function c(a, b, c) {
        if (!a) throw Error();
        if (2 < arguments.length) {
            var d = Array.prototype.slice.call(arguments, 2);
            return function() {
                var c = Array.prototype.slice.call(arguments);
                Array.prototype.unshift.apply(c, d);
                return a.apply(b, c)
            }
        }
        return function() {
            return a.apply(b, arguments)
        }
    }

    function a(d, e, f) {
        a = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? b : c;
        return a.apply(null, arguments)
    }

    function d(a, b) {
        this.a =
            a;
        this.o = b || a;
        this.c = this.o.document
    }

    function f(a, b, c, d) {
        b = a.c.createElement(b);
        if (c)
            for (var e in c) c.hasOwnProperty(e) && ("style" == e ? b.style.cssText = c[e] : b.setAttribute(e, c[e]));
        d && b.appendChild(a.c.createTextNode(d));
        return b
    }

    function e(a, b, c) {
        (a = a.c.getElementsByTagName(b)[0]) || (a = document.documentElement);
        a.insertBefore(c, a.lastChild)
    }

    function g(a) {
        a.parentNode && a.parentNode.removeChild(a)
    }

    function k(a, b, c) {
        b = b || [];
        c = c || [];
        for (var d = a.className.split(/\s+/), e = 0; e < b.length; e += 1) {
            for (var f = !1, g =
                    0; g < d.length; g += 1)
                if (b[e] === d[g]) {
                    f = !0;
                    break
                }
            f || d.push(b[e])
        }
        b = [];
        for (e = 0; e < d.length; e += 1) {
            f = !1;
            for (g = 0; g < c.length; g += 1)
                if (d[e] === c[g]) {
                    f = !0;
                    break
                }
            f || b.push(d[e])
        }
        a.className = b.join(" ").replace(/\s+/g, " ").replace(/^\s+|\s+$/, "")
    }

    function h(a, b) {
        for (var c = a.className.split(/\s+/), d = 0, e = c.length; d < e; d++)
            if (c[d] == b) return !0;
        return !1
    }

    function l(a) {
        return a.o.location.hostname || a.a.location.hostname
    }

    function n(a, b, c) {
        function d() {
            l && g && h && (l(k), l = null)
        }
        b = f(a, "link", {
            rel: "stylesheet",
            href: b,
            media: "all"
        });
        var g = !1,
            h = !0,
            k = null,
            l = c || null;
        w ? (b.onload = function() {
            g = !0;
            d()
        }, b.onerror = function() {
            g = !0;
            k = Error("Stylesheet failed to load");
            d()
        }) : setTimeout(function() {
            g = !0;
            d()
        }, 0);
        e(a, "head", b)
    }

    function u(a, b, c, d) {
        var e = a.c.getElementsByTagName("head")[0];
        if (e) {
            var g = f(a, "script", {
                    src: b
                }),
                h = !1;
            g.onload = g.onreadystatechange = function() {
                h || this.readyState && "loaded" != this.readyState && "complete" != this.readyState || (h = !0, c && c(null), g.onload = g.onreadystatechange = null, "HEAD" == g.parentNode.tagName && e.removeChild(g))
            };
            e.appendChild(g);
            setTimeout(function() {
                h || (h = !0, c && c(Error("Script load timeout")))
            }, d || 5E3);
            return g
        }
        return null
    }

    function J() {
        this.a = 0;
        this.c = null
    }

    function z(a) {
        a.a++;
        return function() {
            a.a--;
            m(a)
        }
    }

    function V(a, b) {
        a.c = b;
        m(a)
    }

    function m(a) {
        0 == a.a && a.c && (a.c(), a.c = null)
    }

    function p(a) {
        this.a = a || "-"
    }

    function q(a, b) {
        this.c = a;
        this.f = 4;
        this.a = "n";
        var c = (b || "n4").match(/^([nio])([1-9])$/i);
        c && (this.a = c[1], this.f = parseInt(c[2], 10))
    }

    function t(a) {
        return K(a) + " " + (a.f + "00") + " 300px " + X(a.c)
    }

    function X(a) {
        var b = [];
        a = a.split(/,\s*/);
        for (var c = 0; c < a.length; c++) {
            var d = a[c].replace(/['"]/g, ""); - 1 != d.indexOf(" ") || /^\d/.test(d) ? b.push("'" + d + "'") : b.push(d)
        }
        return b.join(",")
    }

    function T(a) {
        return a.a + a.f
    }

    function K(a) {
        var b = "normal";
        "o" === a.a ? b = "oblique" : "i" === a.a && (b = "italic");
        return b
    }

    function O(a) {
        var b = 4,
            c = "n",
            d = null;
        a && ((d = a.match(/(normal|oblique|italic)/i)) && d[1] && (c = d[1].substr(0, 1).toLowerCase()), (d = a.match(/([1-9]00|normal|bold)/i)) && d[1] && (/bold/i.test(d[1]) ? b = 7 : /[1-9]00/.test(d[1]) && (b = parseInt(d[1].substr(0,
            1), 10))));
        return c + b
    }

    function E(a, b) {
        this.c = a;
        this.f = a.o.document.documentElement;
        this.h = b;
        this.a = new p("-");
        this.j = !1 !== b.events;
        this.g = !1 !== b.classes
    }

    function B(a) {
        a.g && k(a.f, [a.a.c("wf", "loading")]);
        F(a, "loading")
    }

    function I(a) {
        if (a.g) {
            var b = h(a.f, a.a.c("wf", "active")),
                c = [],
                d = [a.a.c("wf", "loading")];
            b || c.push(a.a.c("wf", "inactive"));
            k(a.f, c, d)
        }
        F(a, "inactive")
    }

    function F(a, b, c) {
        if (a.j && a.h[b])
            if (c) a.h[b](c.c, T(c));
            else a.h[b]()
    }

    function R() {
        this.c = {}
    }

    function H(a, b, c) {
        var d = [],
            e;
        for (e in b)
            if (b.hasOwnProperty(e)) {
                var f =
                    a.c[e];
                f && d.push(f(b[e], c))
            }
        return d
    }

    function W(a, b) {
        this.c = a;
        this.f = b;
        this.a = f(this.c, "span", {
            "aria-hidden": "true"
        }, this.f)
    }

    function C(a) {
        e(a.c, "body", a.a)
    }

    function fa(a) {
        return "display:block;position:absolute;top:-9999px;left:-9999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:" + X(a.c) + ";" + ("font-style:" + K(a) + ";font-weight:" + (a.f + "00") + ";")
    }

    function Z(a, b, c, d, e, f) {
        this.g = a;
        this.j = b;
        this.a = d;
        this.c = c;
        this.f = e || 3E3;
        this.h = f || void 0
    }

    function na(a, b, c, d, e, f, g) {
        this.v = a;
        this.B = b;
        this.c = c;
        this.a = d;
        this.s = g || "BESbswy";
        this.f = {};
        this.w = e || 3E3;
        this.u = f || null;
        this.m = this.j = this.h = this.g = null;
        this.g = new W(this.c, this.s);
        this.h = new W(this.c, this.s);
        this.j = new W(this.c, this.s);
        this.m = new W(this.c, this.s);
        a = new q(this.a.c + ",serif", T(this.a));
        a = fa(a);
        this.g.a.style.cssText = a;
        a = new q(this.a.c + ",sans-serif", T(this.a));
        a = fa(a);
        this.h.a.style.cssText = a;
        a = new q("serif", T(this.a));
        a = fa(a);
        this.j.a.style.cssText = a;
        a = new q("sans-serif",
            T(this.a));
        a = fa(a);
        this.m.a.style.cssText = a;
        C(this.g);
        C(this.h);
        C(this.j);
        C(this.m)
    }

    function ia() {
        if (null === L) {
            var a = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent);
            L = !!a && (536 > parseInt(a[1], 10) || 536 === parseInt(a[1], 10) && 11 >= parseInt(a[2], 10))
        }
        return L
    }

    function G(a, b, c) {
        for (var d in A)
            if (A.hasOwnProperty(d) && b === a.f[A[d]] && c === a.f[A[d]]) return !0;
        return !1
    }

    function y(a) {
        var b = a.g.a.offsetWidth,
            c = a.h.a.offsetWidth,
            d;
        (d = b === a.f.serif && c === a.f["sans-serif"]) || (d = ia() && G(a, b, c));
        d ? v() - a.A >= a.w ? ia() && G(a, b, c) && (null === a.u || a.u.hasOwnProperty(a.a.c)) ? ma(a, a.v) : ma(a, a.B) : la(a) : ma(a, a.v)
    }

    function la(b) {
        setTimeout(a(function() {
            y(this)
        }, b), 50)
    }

    function ma(b, c) {
        setTimeout(a(function() {
            g(this.g.a);
            g(this.h.a);
            g(this.j.a);
            g(this.m.a);
            c(this.a)
        }, b), 0)
    }

    function Y(a, b, c) {
        this.c = a;
        this.a = b;
        this.f = 0;
        this.m = this.j = !1;
        this.s = c
    }

    function ca(a) {
        0 == --a.f && a.j && (a.m ? (a = a.a, a.g && k(a.f, [a.a.c("wf", "active")], [a.a.c("wf", "loading"), a.a.c("wf", "inactive")]), F(a, "active")) : I(a.a))
    }

    function ja(a) {
        this.j =
            a;
        this.a = new R;
        this.h = 0;
        this.f = this.g = !0
    }

    function qa(b, c, d, e, f) {
        var g = 0 == --b.h;
        (b.f || b.g) && setTimeout(function() {
            var b = f || null,
                h = e || null || {};
            if (0 === d.length && g) I(c.a);
            else {
                c.f += d.length;
                g && (c.j = g);
                var l, m = [];
                for (l = 0; l < d.length; l++) {
                    var n = d[l],
                        q = h[n.c],
                        x = c.a,
                        p = n;
                    x.g && k(x.f, [x.a.c("wf", p.c, T(p).toString(), "loading")]);
                    F(x, "fontloading", p);
                    x = null;
                    if (null === S)
                        if (window.FontFace) {
                            var p = /Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent),
                                r = /OS X.*Version\/10\..*Safari/.exec(window.navigator.userAgent) &&
                                /Apple/.exec(window.navigator.vendor);
                            S = p ? 42 < parseInt(p[1], 10) : r ? !1 : !0
                        } else S = !1;
                    S ? x = new Z(a(c.g, c), a(c.h, c), c.c, n, c.s, q) : x = new na(a(c.g, c), a(c.h, c), c.c, n, c.s, b, q);
                    m.push(x)
                }
                for (l = 0; l < m.length; l++) m[l].start()
            }
        }, 0)
    }

    function pa(a, b, c) {
        var d = [],
            e = c.timeout;
        B(b);
        var d = H(a.a, c, a.c),
            f = new Y(a.c, b, e);
        a.h = d.length;
        b = 0;
        for (c = d.length; b < c; b++) d[b].load(function(b, c, d) {
            qa(a, f, b, c, d)
        })
    }

    function ka(a, b) {
        this.c = a;
        this.a = b
    }

    function aa(a, b) {
        this.c = a;
        this.a = b
    }

    function D(a, b) {
        a ? this.c = a : this.c = M;
        this.a = [];
        this.f = [];
        this.g = b || ""
    }

    function va(a, b) {
        for (var c = b.length, d = 0; d < c; d++) {
            var e = b[d].split(":");
            3 == e.length && a.f.push(e.pop());
            var f = "";
            2 == e.length && "" != e[1] && (f = ":");
            a.a.push(e.join(f))
        }
    }

    function Ca(a) {
        if (0 == a.a.length) throw Error("No fonts to load!");
        if (-1 != a.c.indexOf("kit=")) return a.c;
        for (var b = a.a.length, c = [], d = 0; d < b; d++) c.push(a.a[d].replace(/ /g, "+"));
        b = a.c + "?family=" + c.join("%7C");
        0 < a.f.length && (b += "&subset=" + a.f.join(","));
        0 < a.g.length && (b += "&text=" + encodeURIComponent(a.g));
        return b
    }

    function Fa(a) {
        this.f =
            a;
        this.a = [];
        this.c = {}
    }

    function xa(a) {
        for (var b = a.f.length, c = 0; c < b; c++) {
            var d = a.f[c].split(":"),
                e = d[0].replace(/\+/g, " "),
                f = ["n4"];
            if (2 <= d.length) {
                var g, h = d[1];
                g = [];
                if (h)
                    for (var h = h.split(","), k = h.length, l = 0; l < k; l++) {
                        var m;
                        m = h[l];
                        if (m.match(/^[\w-]+$/)) {
                            var n = ua.exec(m.toLowerCase());
                            if (null == n) m = "";
                            else {
                                m = n[2];
                                m = null == m || "" == m ? "n" : Ga[m];
                                n = n[1];
                                if (null == n || "" == n) n = "4";
                                else var p = N[n],
                                    n = p ? p : isNaN(n) ? "4" : n.substr(0, 1);
                                m = [m, n].join("")
                            }
                        } else m = "";
                        m && g.push(m)
                    }
                0 < g.length && (f = g);
                3 == d.length && (d = d[2], g = [], d = d ? d.split(",") : g, 0 < d.length && (d = P[d[0]]) && (a.c[e] = d))
            }
            a.c[e] || (d = P[e]) && (a.c[e] = d);
            for (d = 0; d < f.length; d += 1) a.a.push(new q(e, f[d]))
        }
    }

    function oa(a, b) {
        this.c = a;
        this.a = b
    }

    function ba(a, b) {
        this.c = a;
        this.a = b
    }

    function r(a, b) {
        this.c = a;
        this.f = b;
        this.a = []
    }
    var v = Date.now || function() {
            return +new Date
        },
        w = !!window.FontFace;
    p.prototype.c = function(a) {
        for (var b = [], c = 0; c < arguments.length; c++) b.push(arguments[c].replace(/[\W_]+/g, "").toLowerCase());
        return b.join(this.a)
    };
    Z.prototype.start = function() {
        var a = this.c.o.document,
            b = this,
            c = v(),
            d = new Promise(function(d, e) {
                function f() {
                    v() - c >= b.f ? e() : a.fonts.load(t(b.a), b.h).then(function(a) {
                        1 <= a.length ? d() : setTimeout(f, 25)
                    }, function() {
                        e()
                    })
                }
                f()
            }),
            e = null,
            f = new Promise(function(a, c) {
                e = setTimeout(c, b.f)
            });
        Promise.race([f, d]).then(function() {
            e && (clearTimeout(e), e = null);
            b.g(b.a)
        }, function() {
            b.j(b.a)
        })
    };
    var A = {
            D: "serif",
            C: "sans-serif"
        },
        L = null;
    na.prototype.start = function() {
        this.f.serif = this.j.a.offsetWidth;
        this.f["sans-serif"] = this.m.a.offsetWidth;
        this.A = v();
        y(this)
    };
    var S = null;
    Y.prototype.g =
        function(a) {
            var b = this.a;
            b.g && k(b.f, [b.a.c("wf", a.c, T(a).toString(), "active")], [b.a.c("wf", a.c, T(a).toString(), "loading"), b.a.c("wf", a.c, T(a).toString(), "inactive")]);
            F(b, "fontactive", a);
            this.m = !0;
            ca(this)
        };
    Y.prototype.h = function(a) {
        var b = this.a;
        if (b.g) {
            var c = h(b.f, b.a.c("wf", a.c, T(a).toString(), "active")),
                d = [],
                e = [b.a.c("wf", a.c, T(a).toString(), "loading")];
            c || d.push(b.a.c("wf", a.c, T(a).toString(), "inactive"));
            k(b.f, d, e)
        }
        F(b, "fontinactive", a);
        ca(this)
    };
    ja.prototype.load = function(a) {
        this.c = new d(this.j,
            a.context || this.j);
        this.g = !1 !== a.events;
        this.f = !1 !== a.classes;
        pa(this, new E(this.c, a), a)
    };
    ka.prototype.load = function(a) {
        function b() {
            if (f["__mti_fntLst" + d]) {
                var c = f["__mti_fntLst" + d](),
                    e = [],
                    g;
                if (c)
                    for (var h = 0; h < c.length; h++) {
                        var k = c[h].fontfamily;
                        void 0 != c[h].fontStyle && void 0 != c[h].fontWeight ? (g = c[h].fontStyle + c[h].fontWeight, e.push(new q(k, g))) : e.push(new q(k))
                    }
                a(e)
            } else setTimeout(function() {
                b()
            }, 50)
        }
        var c = this,
            d = c.a.projectId,
            e = c.a.version;
        if (d) {
            var f = c.c.o;
            u(this.c, (c.a.api || "https://fast.fonts.net/jsapi") +
                "/" + d + ".js" + (e ? "?v=" + e : ""),
                function(e) {
                    e ? a([]) : (f["__MonotypeConfiguration__" + d] = function() {
                        return c.a
                    }, b())
                }).id = "__MonotypeAPIScript__" + d
        } else a([])
    };
    aa.prototype.load = function(a) {
        var b, c, d = this.a.urls || [],
            e = this.a.families || [],
            f = this.a.testStrings || {},
            g = new J;
        b = 0;
        for (c = d.length; b < c; b++) n(this.c, d[b], z(g));
        var h = [];
        b = 0;
        for (c = e.length; b < c; b++)
            if (d = e[b].split(":"), d[1])
                for (var k = d[1].split(","), l = 0; l < k.length; l += 1) h.push(new q(d[0], k[l]));
            else h.push(new q(d[0]));
        V(g, function() {
            a(h, f)
        })
    };
    var M = "https://fonts.googleapis.com/css",
        P = {
            latin: "BESbswy",
            "latin-ext": "\u00e7\u00f6\u00fc\u011f\u015f",
            cyrillic: "\u0439\u044f\u0416",
            greek: "\u03b1\u03b2\u03a3",
            khmer: "\u1780\u1781\u1782",
            Hanuman: "\u1780\u1781\u1782"
        },
        N = {
            thin: "1",
            extralight: "2",
            "extra-light": "2",
            ultralight: "2",
            "ultra-light": "2",
            light: "3",
            regular: "4",
            book: "4",
            medium: "5",
            "semi-bold": "6",
            semibold: "6",
            "demi-bold": "6",
            demibold: "6",
            bold: "7",
            "extra-bold": "8",
            extrabold: "8",
            "ultra-bold": "8",
            ultrabold: "8",
            black: "9",
            heavy: "9",
            l: "3",
            r: "4",
            b: "7"
        },
        Ga = {
            i: "i",
            italic: "i",
            n: "n",
            normal: "n"
        },
        ua = /^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/,
        La = {
            Arimo: !0,
            Cousine: !0,
            Tinos: !0
        };
    oa.prototype.load = function(a) {
        var b = new J,
            c = this.c,
            d = new D(this.a.api, this.a.text),
            e = this.a.families;
        va(d, e);
        var f = new Fa(e);
        xa(f);
        n(c, Ca(d), z(b));
        V(b, function() {
            a(f.a, f.c, La)
        })
    };
    ba.prototype.load = function(a) {
        var b = this.a.id,
            c = this.c.o;
        b ? u(this.c, (this.a.api || "https://use.typekit.net") + "/" + b + ".js", function(b) {
            if (b) a([]);
            else if (c.Typekit && c.Typekit.config && c.Typekit.config.fn) {
                b = c.Typekit.config.fn;
                for (var d = [], e = 0; e < b.length; e += 2)
                    for (var f = b[e], g = b[e + 1], h = 0; h < g.length; h++) d.push(new q(f, g[h]));
                try {
                    c.Typekit.load({
                        events: !1,
                        classes: !1,
                        async: !0
                    })
                } catch (k) {}
                a(d)
            }
        }, 2E3) : a([])
    };
    r.prototype.load = function(a) {
        var b = this.f.id,
            c = this.c.o,
            d = this;
        b ? (c.__webfontfontdeckmodule__ || (c.__webfontfontdeckmodule__ = {}), c.__webfontfontdeckmodule__[b] = function(b, c) {
            for (var e = 0, f = c.fonts.length; e < f; ++e) {
                var g = c.fonts[e];
                d.a.push(new q(g.name,
                    O("font-weight:" + g.weight + ";font-style:" + g.style)))
            }
            a(d.a)
        }, u(this.c, (this.f.api || "https://f.fontdeck.com/s/css/js/") + l(this.c) + "/" + b + ".js", function(b) {
            b && a([])
        })) : a([])
    };
    var Ba = new ja(window);
    Ba.a.c.custom = function(a, b) {
        return new aa(b, a)
    };
    Ba.a.c.fontdeck = function(a, b) {
        return new r(b, a)
    };
    Ba.a.c.monotype = function(a, b) {
        return new ka(b, a)
    };
    Ba.a.c.typekit = function(a, b) {
        return new ba(b, a)
    };
    Ba.a.c.google = function(a, b) {
        return new oa(b, a)
    };
    var Ta = {
        load: a(Ba.load, Ba)
    };
    "function" === typeof define && define.amd ?
        define(function() {
            return Ta
        }) : "undefined" !== typeof module && module.exports ? module.exports = Ta : (window.WebFont = Ta, window.WebFontConfig && Ba.load(window.WebFontConfig))
})();
(function(b) {
    b.xmasPlugin = function(c, a) {
        function d(a, c, d) {
            a = new b.BigVideo({
                useFlashForFirefox: !1,
                container: $a,
                doLoop: a
            });
            a.init();
            a.show(c, {
                ambient: d
            });
            return a
        }

        function f(a, d, e, g, h) {
            d.each(function(k, l) {
                if (k == a || D.preloadScenes) {
                    var m = b(this).data(),
                        n = D.preloadScenes ? M[N] : new TimelineMax({
                            paused: !0
                        });
                    if (!m.sceneVideo && m.sceneImage || ua && m.sceneImage) m.trans = m.trans ? m.trans : "fade-in-bg";
                    m.alignment || (m.alignment = "center-center");
                    m.pursueVideo || (m.pursueVideo = "yes");
                    m.pursueImage || (m.pursueImage = "no");
                    ua && m.mobileAlignment && (m.alignment = m.mobileAlignment);
                    m.trans || (m.trans = "none");
                    ua && m.mobileTrans && (m.trans = m.mobileTrans);
                    "undefined" == typeof m.freezeTime && (m.freezeTime = D.globalFreeze);
                    "undefined" == typeof m.transDur && (m.transDur = "default");
                    var p, q = "right-top top-right right-bottom bottom-right right-center center-right".split(" ");
                    p = -1 != "left-top top-left left-bottom bottom-left left-center center-left".split(" ").indexOf(m.alignment) ? "halign-left" : -1 != q.indexOf(m.alignment) ? "halign-right" : "halign-center";
                    q = b(this).find(".content-container");
                    q.wrap("<div class='xmas-scene " + p + "'><div class='centered " + m.alignment + "'></div></div>");
                    p = q.children();
                    k == e - 1 && (m.outDur = "none", Ta = b(this).attr("id"));
                    var r = b(this).prev();
                    F(b(this), k, r, m, n);
                    H(b(this), k, m, q, p, n);
                    D.preloadScenes || (TweenMax.delayedCall(D.queueDelay, f, [a + 1, d, e]), M[N].add(n.play()));
                    if (0 == a && !D.preloadScenes || D.preloadScenes)
                        if (!qb && ("video-bg" === S && "youtube" === Qa || La && 0 < L.length)) ta.on("YTPReady YTPError", function() {
                            b.isFunction(D.onTeaserReady) &&
                                D.onTeaserReady.call(c);
                            b("body").addClass("set-overflow");
                            !Da && Ea && ib && b(".pl-sound").parent().hide();
                            "video-bg" === S && "youtube" === Qa && Za.css({
                                opacity: "0",
                                visibility: "hidden"
                            });
                            g ? (va = "playing", aa.play(h)) : (va = "paused", aa.seek(h));
                            b(this).off("YTPReady YTPError")
                        });
                        else !Da && Ea && ib && b(".pl-sound").parent().hide(), b.isFunction(D.onTeaserReady) && D.onTeaserReady.call(c), b("body").addClass("set-overflow"), "video-bg" === S && "youtube" === Qa && Za.css({
                                opacity: "0",
                                visibility: "hidden"
                            }), g ? (va = "playing", aa.play(h)) :
                            (va = "paused", aa.seek(h));
                    k != e - 1 || D.preloadScenes || M[N].set({}, {
                        immediateRender: !1,
                        onComplete: E
                    })
                }
            })
        }

        function e() {
            v = "xhr" === D.preloadMethod ? new createjs.LoadQueue : new createjs.LoadQueue(!1);
            v.setMaxConnections(500);
            v.on("progress", k);
            v.on("fileload", h);
            v.on("complete", u);
            v.on("error", n);
            v.on("fileerror", l);
            Da && !Ab && (v.installPlugin(createjs.Sound), "tag" == D.preloadMethod && createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin]), createjs.Sound.alternateExtensions = ["ogg"], v.loadFile({
                id: vb,
                family: "sound-file",
                src: Fb,
                loadTimeout: D.audioTimeout
            }));
            0 < w.length && v.loadManifest(w)
        }

        function g() {
            Fa = !0;
            ha = createjs.Sound.play(vb);
            ha.loop = wa;
            isChrome && !ua && (ha.position = 100);
            ha.on("complete", V);
            oa ? M[N].paused() || ba ? ha.paused = !0 : z() : ha.paused = !0
        }

        function k(a) {
            a = Math.round(100 * a.loaded);
            D.triggerProgress && c.trigger("PLProgress", [a]);
            a >= D.initAfter && Fa && !U && J()
        }

        function h(a) {
            var c = a.item;
            a = a.result;
            switch (c.family) {
                case "splash-image":
                    Db.css("background-image", "url(" + c.src + ")");
                    break;
                case "preview-image":
                    Za.css("background-image",
                        "url(" + c.src + ")");
                    break;
                case "sound-file":
                    Fa = !0;
                    ha = createjs.Sound.play(vb);
                    ha.loop = wa;
                    ha.volume = 0;
                    isChrome && !ua && (ha.position = 100);
                    ha.on("complete", V);
                    setTimeout(function() {
                        100 < ha.position && (r = !0, b(".sound-info").hide(), b(".pl-sound").parent().removeClass("highlight"));
                        ha.paused = !0
                    }, 4);
                    break;
                case "static-image":
                    Ya = Ya.find("img");
                    Ya.attr({
                        src: c.src,
                        width: a.naturalWidth,
                        height: a.naturalHeight
                    });
                    break;
                case "scene-image":
                    Ia.find("." + c.id + " img").attr({
                        src: c.src,
                        width: a.naturalWidth,
                        height: a.naturalHeight
                    })
            }
        }

        function l(a) {
            console.log(a)
        }

        function n(a) {
            console.log(a);
            if ("splash-image" == a.data.id) {
                var b = v.getItem("splash-image");
                Db.css("background-image", "url(" + b.src + ")")
            }
            "sound-file" == a.data.family && (Fa = !0)
        }

        function u(a) {
            U || J()
        }

        function J() {
            U += 1;
            D.autoStart && r ? c.trigger("STUnMuted") : c.trigger("STMuted");
            if (isFontActive) aa.init();
            else b(document).on("fontActive", function() {
                aa.init()
            })
        }

        function z() {
            ha.play();
            if ("undefined" !== typeof ha) {
                var a = Math.round(ha.duration),
                    b = Math.round(1E3 * M[N].totalTime().toFixed(1) /
                        M[N].timeScale()),
                    d = b;
                0 > wa && b > a && (d = b % a);
                ha.position = d;
                c.trigger("STUnMuted")
            }
        }

        function V() {
            xa = !0;
            ha.paused = !0;
            c.trigger("STMuted")
        }

        function m() {
            cb && Q.pause();
            sa && sa.YTPPause()
        }

        function p() {
            cb && Q.play();
            sa && sa.YTPPlay()
        }

        function q(a) {
            cb && Q.currentTime(a);
            sa && sa.YTPSeekTo(a)
        }

        function t() {
            Ja && Q.pause();
            eb && sa.YTPPause()
        }

        function X() {
            Ja && Q.play();
            eb && sa.YTPPlay()
        }

        function T(a, d, e) {
            d.data().sceneImage && (d = v.getItem(d[0].id).src, Za.css("background-image", "url(" + d + ")"));
            Za.css({
                opacity: "1",
                visibility: "visible"
            });
            if ("html5" === e) {
                Ja = !0;
                eb = !1;
                nb.css("visibility", "visible");
                var f = b.grep(A, function(b) {
                    return b.sceneIndex == a
                }); - 1 == Q.currentSrc().indexOf(f[0].videoURL) && cb.show(f[0].videoURL);
                Q.off("timeupdate");
                Q.off("ended");
                Q.muted(f[0].mute);
                Q.currentTime(f[0].startAt);
                Q.muteEnabled = f[0].muteEnabled;
                if (kb)(1 < A.length && (kb = !1), K(), Q.on("timeupdate", function() {
                    if (0 != f[0].stopAt && Q.currentTime() >= f[0].stopAt || 0 == f[0].stopAt && Q.currentTime() >= Q.duration()) f[0].loop ? (Q.loop(!0), Q.currentTime(f[0].startAt), Q.play()) :
                        (Ja = !1, Q.pause())
                }), Q.play(), D.autoStart || Q.muteEnabled) ? r && !Q.muteEnabled && (c.trigger("STUnMuted"), Q.muted(!1), Q.volume(D.videoVolume)) : (c.trigger("STUnMuted"), Q.muted(!1), Q.volume(D.videoVolume));
                else Q.one("loadeddata", function() {
                    K();
                    Q.on("timeupdate", function() {
                        if (0 != f[0].stopAt && Q.currentTime() >= f[0].stopAt || 0 == f[0].stopAt && Q.currentTime() >= Q.duration()) f[0].loop ? (Q.loop(!0), Q.currentTime(f[0].startAt), Q.play()) : (Ja = !1, Q.pause())
                    });
                    Q.play();
                    D.autoStart || Q.muteEnabled ? r && !Q.muteEnabled && (c.trigger("STUnMuted"),
                        Q.muted(!1), Q.volume(D.videoVolume)) : (c.trigger("STUnMuted"), Q.muted(!1), Q.volume(D.videoVolume))
                })
            } else(Ja = !1, eb = !0, f = b.grep(L, function(b) {
                return b.sceneIndex == a
            }), f[0].videoURL == ta[0].opt.videoURL) ? (K(), sa.YTPSeekTo(f[0].startAt), tb.css("visibility", "visible"), sa.YTPPlay(), D.autoStart || f[0].muteEnabled) ? r && !f[0].muteEnabled && (c.trigger("STUnMuted"), sa.YTPUnmute(), ta.isMute = !1) : (c.trigger("STUnMuted"), sa.YTPUnmute(), ta.isMute = !1) : (f[0].autoPlay = !0, sa.changeMovie(f[0]), ta.one("YTPReady", function() {
                K();
                b(this).YTPSeekTo(f[0].startAt);
                tb.css("visibility", "visible");
                b(this).YTPPlay();
                D.autoStart || f[0].muteEnabled ? r && !f[0].muteEnabled && (c.trigger("STUnMuted"), sa.YTPUnmute(), ta.isMute = !1) : (c.trigger("STUnMuted"), sa.YTPUnmute(), ta.isMute = !1)
            }))
        }

        function K() {
            Za.css({
                opacity: "0",
                visibility: "hidden"
            })
        }

        function O() {
            oa = !0;
            b.isFunction(D.onTeaserStart) && D.onTeaserStart.call(c);
            wb.hide();
            D.freezeOnBlur && (ifvisible.on("blur", function() {
                aa.freezeTeaser()
            }), ifvisible.on("focus", function() {
                aa.continueTeaser()
            }));
            "undefined" !== typeof ha && ((!ua || ua && !D.autoStart) && xb && "paused" != Ha || "playing" === Ha ? (z(), r ? (ha.volume = D.standaloneAudioVolume, ha.paused = !1, c.trigger("STUnMuted"), Ha = "playing") : (ha.volume = D.standaloneAudioVolume, ha.paused = !0, c.trigger("STMuted"), Ha = "paused")) : (ha.volume = D.standaloneAudioVolume, ha.paused = !0, c.trigger("STMuted"), Ha = "paused"));
            "single-image" === S && Ma.paused() && Ma.resume();
            "video-bg" !== S || (q(rb), "youtube" === Qa && tb.css("visibility", "visible"), p(), Da) || ("undefined" == typeof Q || Ea ? "undefined" ==
                typeof ta || Ea || (D.autoStart ? ta.isMute ? c.trigger("STMuted") : c.trigger("STUnMuted") : (c.trigger("STUnMuted"), sa.YTPUnmute(), ta.isMute = !1)) : D.autoStart ? Q.muted() ? c.trigger("STMuted") : c.trigger("STUnMuted") : (c.trigger("STUnMuted"), Q.muted(!1), Q.volume(D.videoVolume)))
        }

        function E() {
            ba = !0;
            c.trigger("STEnd");
            "undefined" !== typeof ha && Va && V();
            ("video-bg" === S && Ka || "assorted" === S && D.stopTeaserOnEnd) && m();
            b.isFunction(D.onTeaserEnd) && D.onTeaserEnd.call(c)
        }

        function B() {
            Ma.pause()
        }

        function I(a) {
            "single-image" ===
            S && a.set(Ya, {
                autoAlpha: 0,
                onComplete: B,
                onCompleteParams: []
            });
            "video-bg" === S && a.set($a, {
                visibility: "hidden",
                onComplete: m,
                onCompleteParams: []
            })
        }

        function F(a, c, d, e, f) {
            var g = e.trans,
                h = e.transDur,
                k = a.attr("id"),
                l, m = !1;
            0 == c ? (d = b(".extinct"), l = "xmas-nothing") : l = d.attr("id");
            if ("no" == e.pursueImage) {
                var n = Ia.find("." + k + " img");
                l = Ia.find("." + l + " img, ." + ya + " img");
                da = n;
                ya = k
            } else n = da, l = b(".xmas-not-found");
            La && (e.sceneVideo || e.sceneImage && "no" === e.pursueVideo || "no" === e.pursueVideo) && (m = !0);
            f.addLabel(k + "-before");
            var p, q;
            p = a.find(".bt-container");
            if (0 < p.length) {
                var r = p.data().xStart ? p.data().xStart : "-100%",
                    t = p.data().fontMax ? parseInt(p.data().fontMax) : 728;
                p.wrapInner("<div class='bt-wrapper'></div>");
                q = p.find(".bt-wrapper");
                q.bigtext({
                    childSelector: "h1",
                    maxfontsize: t,
                    resize: !1
                });
                f.set(p, {
                    x: r
                })
            }
            h = "default" == h ? 1.4 : parseFloat(h);
            h /= 2;
            p = b.grep(xmasTransitions.vegas, function(a) {
                return a.name == g
            });
            0 != c && b.grep(xmasTransitions.vegas, function(a) {
                return a.name == d.data().trans
            });
            "fade-screen" == p[0].template ? (f.to(Bb,
                h, {
                    autoAlpha: 1,
                    ease: Linear.easeNone
                }), I(f), f.set(d, {
                display: "none"
            }), m && f.addLabel("hideP-" + c), 0 < n.length && f.set(n, {
                autoAlpha: 1
            })) : ("none" != g && I(f), f.set(d, {
                display: "none"
            }), m && f.addLabel("hideP-" + c));
            f.set(a, {
                visibility: "visible"
            });
            q = p[0].type ? p[0].type : "throughout";
            r = p[0].alphaDuration ? parseFloat(p[0].alphaDuration) : .95;
            p[0].in[0].to.ease || (p[0].in[0].to.ease = Linear.easeNone);
            p[0].out && !p[0].out[0].to.ease && (p[0].out[0].to.ease = Linear.easeNone);
            "prior" == q && (k += "-prior", f.addLabel(k + "-label"));
            P[k] =
                new TimelineMax;
            P[k + "-alpha"] = new TimelineMax;
            "no" == e.pursueImage && P[k + "-alpha"].to(n, r, {
                autoAlpha: 1
            }, 0);
            "fade-screen" == p[0].template && P[k + "-alpha"].to(Bb, h, {
                autoAlpha: 0
            }, 0);
            P[k].data = {};
            P[k].data.duration = p[0].in[0].duration ? p[0].in[0].duration : "full";
            P[k].fromTo(n, 1.08, p[0].in[0].from, p[0].in[0].to, 0);
            0 < l.length && P[k + "-alpha"].set(l, {
                autoAlpha: 0
            });
            "prior" == q && (h = p[0].in[0].duration ? p[0].in[0].duration : 1.5, f.add(P[k + "-alpha"], k + "-label"), f.add(P[k].duration(h), k + "-label"));
            m && f.set({}, {
                immediateRender: !1,
                onStart: R,
                onStartParams: []
            }, "hideP-" + c);
            La && e.sceneVideo && f.set({}, {
                immediateRender: !1,
                onComplete: T,
                onCompleteParams: [c, a, e.videoType]
            })
        }

        function R() {
            sa && (eb = !1, tb.css("visibility", "hidden"));
            nb && (Ja = !1, nb.css("visibility", "hidden"));
            m()
        }

        function H(a, c, d, e, f, g) {
            var h = W(a, d, e, f),
                k = pa(!1),
                l, m = 0,
                n = d.cinOrder ? d.cinOrder : "onebyone",
                p = d.cinDelay ? parseFloat(d.cinDelay) : .25,
                q = d.coutOrder ? d.coutOrder : n,
                r = d.coutDelay ? parseFloat(d.coutDelay) : p,
                t = d.coutPattern ? d.coutPattern : "reverse",
                u = sortArray(d.cinPattern ?
                    d.cinPattern : "sequential", f.get().slice(0));
            f = sortArray(t, f.get().slice(0));
            b.each(u, function(a, c) {
                if (0 < a) var d = "cont-in-" + m;
                var e = b(c).data("order");
                m = e;
                var f = "cont-in-" + e;
                k[f] = new TimelineMax;
                var g = C(b(c), e, h, "in");
                fa(b(c), e, h, g, M[N], k, k[f], "in");
                g.duration && k[f].duration(g.duration);
                g.timeScale && k[f].timeScale(g.timeScale);
                l = "onebyone" == n ? "+=0" : "sync" == n ? 0 : "delayed" == n ? a * p : 0 == a ? "+=0" : "-=" + (k[d].duration() - k[d].duration() * p);
                k["in"].add(k[f], l)
            });
            "none" != d.outDur && b.each(f, function(a, c) {
                if (0 < a) var d =
                    "cont-out-" + m;
                var e = b(c).data("order");
                m = e;
                var f = "cont-out-" + e;
                k[f] = new TimelineMax;
                var g = C(b(c), e, h, "out");
                fa(b(c), e, h, g, M[N], k, k[f], "out");
                g.duration && k[f].duration(g.duration);
                g.timeScale && k[f].timeScale(g.timeScale);
                l = "onebyone" == q ? "+=0" : "sync" == q ? 0 : "delayed" == q ? a * r : 0 == a ? "+=0" : "-=" + (k[d].duration() - k[d].duration() * r);
                k.out.add(k[f], l)
            });
            M[N].set(e, {
                visibility: "visible"
            });
            M[N].addLabel(h.marker);
            ka(a, k, c, d, h.marker, e, !1, g)
        }

        function W(a, c, d, e) {
            var f = {};
            f.marker = a.attr("id");
            var g = a.find(".centered"),
                h = g.css("max-width");
            0 <= h.indexOf("%") && (h = parseFloat(h) / 100, h = Math.ceil(Ba * h) + "px");
            a = a.children();
            var k;
            a.hasClass("halign-left") ? (k = "place-left", f.slideAlignment = "halign-left") : a.hasClass("halign-right") ? (k = "place-right", f.slideAlignment = "halign-right") : (k = "place-center", f.slideAlignment = "halign-center");
            a = qa(d);
            var l = 0;
            e.each(function(a, e) {
                b(this).data("order", a);
                f["content" + a] = b(this);
                var g = qa(b(this)),
                    m = b(this).data().align ? "place-" + b(this).data().align : k,
                    n = b(this).data().boxType ? b(this).data().boxType :
                    "contain",
                    p = b(this).data().delimiter ? b(this).data().delimiter : " ",
                    q, r, t = "nowrap" == b(this).css("white-space") ? !0 : !1;
                q = b(this).data().sin ? readCustomOptions(b(this).data().sin) : {
                    animation: "fade-in"
                };
                b(this).data().sout ? r = readCustomOptions(b(this).data().sout) : (c.outDur = "none", r = {
                    animation: "zero-dur"
                });
                var u = q.animation,
                    v = r.animation,
                    u = xmasAnimations[u] ? xmasAnimations[u] : xmasAnimations["fade-in"],
                    v = xmasAnimations[v] ? xmasAnimations[v] : xmasAnimations["fade-out"];
                f["inConfig" + a] = u;
                f["outConfig" + a] = v;
                u.inherit &&
                    (f["inConfig" + a] = b.extend(!0, {}, xmasAnimations[u.inherit], f["inConfig" + a]));
                v.inherit && (f["outConfig" + a] = b.extend(!0, {}, xmasAnimations[v.inherit], f["outConfig" + a]));
                var x;
                x = D.easeOuterGPU ? "" : "gpu-hack";
                b(this).wrap("<div class='content-wrapper " + x + " content-wrapper-" + a + "' style='position:relative;width:100%;'></div>");
                f["wrapper" + a] = d.find(".content-wrapper-" + a);
                "contain" === n && b(this).css("display", "inline-block");
                b(this).css({
                    display: "block",
                    position: "absolute",
                    width: h,
                    height: Math.ceil(b(this).outerHeight()) +
                        "px"
                }).addClass("place-left");
                n = [f["inConfig" + a].animateBy, f["outConfig" + a].animateBy];
                if ("whole" == q.animateBy && "whole" == r.animateBy || "whole" == u.animateBy && "whole" == v.animateBy || b(this).find("img, a").length || "glitch" == q.animation) {
                    var w;
                    t && (m += " tof-fix");
                    b(this).removeClass("place-left").addClass(m);
                    (isFirefox || isEdge || isIE) && TweenMax.set(b(this), {
                        rotationZ: "0.01deg"
                    });
                    f["wrapper" + a].css({
                        height: Math.ceil(b(this).outerHeight()) + "px"
                    });
                    w = Math.ceil(b(this).outerWidth());
                    w > l && (l = w)
                } else {
                    q = -1 < n.indexOf("chars") ?
                        "words,chars,lines" : "words,lines";
                    r = D.easeOuterGPU ? "" : "gpu-hack";
                    f["split" + a] = new SplitText(b(this), {
                        type: q,
                        wordsClass: "s-word " + r + " xmas-word-++",
                        charsClass: "s-char xmas-char-++",
                        linesClass: "s-line " + r + " xmas-line-++",
                        wordDelimiter: p,
                        position: "absolute"
                    });
                    gb && TweenMax.set(f["split" + a].chars, {
                        force3D: !0,
                        rotationZ: "0.01deg"
                    });
                    b(this).removeClass("place-left").addClass(m);
                    w = 0;
                    var y, ea, Wa = f["split" + a].lines.length;
                    b.each(f["split" + a].lines, function(a, c) {
                        var d = b(c).children().last();
                        y = parseInt(d.css("left")) +
                            parseInt(d.css("width"));
                        b(c).css({
                            width: y + "px",
                            right: g.padRight + "px"
                        }).addClass(m);
                        y > w && (w = y);
                        a == Wa - 1 && (ea = parseInt(b(this).css("top")) + parseInt(b(this).css("height")))
                    });
                    b(this).css({
                        width: w + g.horz + "px",
                        height: ea + g.padBottom + "px"
                    });
                    f["wrapper" + a].css({
                        height: ea + g.padBottom + g.marTop + g.marBottom + "px"
                    });
                    w > l && (l = w + g.horz)
                }
            });
            d.css({
                width: l + a.horz + "px"
            });
            g.css({
                "max-width": l + a.horz + "px"
            });
            return f
        }

        function C(a, c, d, e) {
            var f = {},
                g, h, k = d["split" + c];
            "in" == e ? (e = readCustomOptions(a.data().sin), g = d["inConfig" +
                c], h = "fade-in") : (e = readCustomOptions(a.data().sout), g = d["outConfig" + c], h = "fade-out");
            f.animTitle = e.animation ? e.animation : h;
            f.animTemplate = e.template ? e.template : g.template;
            "rotator" == f.animTemplate ? (g = b.extend({}, xmasDefaults.rotator, g), d["outConfig" + c] = b.extend({}, xmasDefaults.rotator, {
                template: "rotator"
            })) : g = b.extend({}, xmasDefaults.basic, g);
            f.pattern = e.pattern ? e.pattern : g.pattern;
            f.ease = e.ease ? parseEase(e.ease) : g.ease;
            f.staggerDelay = e.staggerDelay ? parseFloat(e.staggerDelay) : g.staggerDelay;
            f.staggerDur =
                e.staggerDur ? parseFloat(e.staggerDur) : g.staggerDur;
            f.splitType = e.animateBy ? e.animateBy : g.animateBy;
            f.duration = e.duration ? parseFloat(e.duration) : g.duration;
            f.timeScale = e.timeScale ? parseFloat(e.timeScale) : g.timeScale;
            f.wrapSplit = e.wrapSplit ? parseBool(e.wrapSplit) : g.wrapSplit;
            f.firstIn = e.firstIn ? parseBool(e.firstIn) : g.firstIn;
            f.lastOut = e.lastOut ? parseBool(e.lastOut) : g.lastOut;
            f.rotFreeze = e.rotFreeze ? parseFloat(e.rotFreeze) : g.rotFreeze;
            f.overlapTime = e.overlapTime ? parseFloat(e.overlapTime) : g.overlapTime;
            f.perspective = g.perspective ? g.perspective : "none";
            f.addTweens = g.addTweens ? g.addTweens : "none";
            a.find("img, a").length && (f.splitType = "whole");
            if (f.wrapSplit && "whole" != f.splitType) {
                var l = [],
                    m, n, p;
                b.each(k[f.splitType], function(a, c) {
                    m = "mod-sub el-sub-" + (a + 1);
                    b(c).find(".mod-sub").length || (b(c).css("overflow", "hidden"), n = b(c).outerWidth(), p = b(c).outerHeight(), b(c).wrapInner("<div class='" + m + "' style='width: " + n + "px; height: " + p + "px'></div>"), l.push(b(c).find(".el-sub-" + (a + 1))[0]))
                });
                k[f.splitType] = l
            }
            return f
        }

        function fa(a, b, c, d, e, f, g, h) {
            var k = d.animTemplate;
            switch (k) {
                case "basic":
                    Z(a, b, c, d, e, g, h);
                    break;
                case "misc":
                    "in" == h && ia(a, b, c, d, e, f, g, "in");
                    break;
                case "rotator":
                    "in" == h && na(a, b, c, d, e, g, "in");
                    break;
                default:
                    console.log('Please check your custom animation "' + k + '" have "template" mentioned in xmas-animations.js'), Z(a, b, c, d, e, g, h)
            }
        }

        function Z(a, c, d, e, f, g, h) {
            a = ca(c, e, d);
            h = ja(c, h, d, {}, {});
            var k = h.from,
                l = h.to,
                m = {},
                n = {};
            Y(e.addTweens, d["content" + c], f, a);
            if (is.obj(k.opacity) || is.obj(l.opacity)) m.opacity = is.obj(k.opacity) ?
                k.opacity.value : k.opacity, n.opacity = is.obj(l.opacity) ? l.opacity.value : l.opacity, k.opacity.ease && (m.ease = parseEase(k.opacity.ease)), l.opacity.ease && (n.ease = parseEase(l.opacity.ease));
            var p = "basic-" + c,
                q = a.length;
            b.each(a, function(a, c) {
                var d = la(a, c, q, e.staggerDelay, !0),
                    f = la(a, c, q, e.staggerDur, !1),
                    h = p + "+=" + d,
                    r = {},
                    t = {};
                b.each(k, function(b, d) {
                    y(a, c, q, b, d, r, m, g, h)
                });
                b.each(l, function(b, d) {
                    y(a, c, q, b, d, t, n, g, h)
                });
                b.isEmptyObject(m) || g.fromTo(b(c), f, m, n, h);
                g.fromTo(b(c), f, r, t, h)
            })
        }

        function na(a, c, d, e, f, g, h) {
            a =
                d["split" + c].lines;
            var k = a.length;
            h = d["wrapper" + c].outerHeight() / k;
            1 < k && (f.set([d["wrapper" + c], d["content" + c]], {
                height: h + "px"
            }), f.set(a, {
                top: "0px",
                perspective: e.perspective
            }));
            Y(e.addTweens, d["content" + c], f, a);
            var l = d["inConfig" + c].rotIn.addTweens,
                m = d["inConfig" + c].rotOut.addTweens,
                n = d["inConfig" + c].rotIn.staggerDelay,
                p = d["inConfig" + c].rotIn.staggerDur,
                q = d["inConfig" + c].rotOut.staggerDelay,
                r = d["inConfig" + c].rotOut.staggerDur,
                t = d["inConfig" + c].rotIn.from,
                u = d["inConfig" + c].rotIn.to,
                v = d["inConfig" + c].rotOut.from,
                w = d["inConfig" + c].rotOut.to,
                x = {},
                z = {};
            if (is.obj(t.opacity) || is.obj(u.opacity)) x.opacity = is.obj(t.opacity) ? t.opacity.value : t.opacity, z.opacity = is.obj(u.opacity) ? u.opacity.value : u.opacity, t.opacity.ease && (x.ease = parseEase(t.opacity.ease)), u.opacity.ease && (z.ease = parseEase(u.opacity.ease));
            b.each(a, function(a, c) {
                var d = k;
                if ("words" == e.splitType) var f = b(c).find(".s-word"),
                    d = f.length;
                else if ("chars" == e.splitType) f = b(c).find(".s-char"), d = f.length;
                else var f = b(c),
                    h = a;
                var Oa = "rotator-" + a,
                    ea = "rotator-" + (a +
                        1),
                    f = b.map(f, function(a, b) {
                        return [a]
                    }),
                    f = sortArray(e.pattern, f);
                (0 < a || 0 == a && e.firstIn) && b.each(f, function(a, c) {
                    h && (a = h);
                    var e = la(a, c, d, n, !0),
                        f = la(a, c, d, p, !1),
                        e = Oa + "+=" + e,
                        k = {},
                        m = {};
                    b.each(t, function(b, e) {
                        y(a, c, d, b, e, k, x)
                    });
                    b.each(u, function(b, e) {
                        y(a, c, d, b, e, m, x)
                    });
                    b.isEmptyObject(x) || g.fromTo(b(c), f, x, z, e);
                    g.fromTo(b(c), f, k, m, e);
                    ma(a, c, d, l, g, e)
                });
                if (a != k - 1 || e.lastOut && a == k - 1) {
                    var A = la(a, c, d, e.rotFreeze, !1);
                    g.set({}, {}, "+=" + A);
                    b.each(f, function(a, c) {
                        h && (a = h);
                        var e = la(a, c, d, q, !0),
                            f = la(a, c, d, r, !1),
                            e =
                            ea + "+=" + e,
                            k = {},
                            l = {};
                        b.each(v, function(b, e) {
                            y(a, c, d, b, e, k, {})
                        });
                        b.each(w, function(b, e) {
                            y(a, c, d, b, e, l, {})
                        });
                        g.fromTo(b(c), f, k, l, e);
                        ma(a, c, d, m, g, e)
                    })
                }
            })
        }

        function ia(a, c, d, e, f, g, h, k) {
            a = d["content" + c];
            c = d["wrapper" + c];
            if (100 > a.outerHeight()) {
                d = Math.ceil(a.outerHeight() - 1);
                var l = 1
            } else d = 99, l = Math.ceil(a.outerHeight() / 100);
            var m = a.outerWidth();
            for (e = 0; e < d; e++) c.append(a.clone());
            d = c.children();
            d.each(function(a, c) {
                f.set(b(c), {
                    position: "absolute",
                    left: 0,
                    top: 0,
                    x: 0,
                    opacity: 1,
                    clip: "rect(" + l * a + "px, " + m + "px, " +
                        l * (a + 1) + "px, 0px)"
                })
            });
            f.set(c, {
                autoAlpha: 0
            });
            g["in"].to(c, .75, {
                autoAlpha: 1
            }, 0);
            g.repeat = new TimelineMax;
            d.each(function(a, c) {
                g.repeat.to(b(this), .1, {
                    x: randomInt(-5, 5),
                    opacity: randomFloat(.8, 1),
                    ease: RoughEase.ease.config({
                        strength: 5,
                        points: 50,
                        template: SlowMo.ease,
                        clamp: !1,
                        taper: "out"
                    })
                }, 0)
            });
            g["in"].add(g.repeat, "+=0.2");
            G(g["in"], g.repeat, d, 1, !1, "+=0.1");
            G(g["in"], g.repeat, d, .5, !1, "+=0.4");
            G(g["in"], g.repeat, d, .5, !0, "+=3");
            G(g["in"], g.repeat, d, .5, !1, "+=0.4");
            G(g["in"], g.repeat, d, .5, !1, "+=2");
            g["in"].to(d,
                .25, {
                    x: 0,
                    opacity: 1,
                    ease: RoughEase.ease.config({
                        strength: 5,
                        points: 50,
                        template: SlowMo.ease,
                        clamp: !1,
                        taper: "out"
                    })
                });
            g["in"].set(d, {
                x: 0,
                opacity: 1
            })
        }

        function G(a, b, c, d, e, f) {
            a.to(c, .25, {
                x: 0,
                opacity: 1,
                ease: RoughEase.ease.config({
                    strength: 5,
                    points: 50,
                    template: SlowMo.ease,
                    clamp: !1,
                    taper: "out"
                })
            });
            a.add(b.tweenFromTo(0, b.duration()).timeScale(d), f)
        }

        function y(a, c, d, e, f, g, h, k, l) {
            if ("opacity" != e || b.isEmptyObject(h)) "addTweens" == e && is.fnc(f) ? f(a, c, d, k, l) : g[e] = is.fnc(f) ? f(a, c) : f
        }

        function la(a, b, c, d, e) {
            return e ?
                is.fnc(d) ? d(a, b, c) : is.arr(d) ? d[a] ? d[a] : d[0] : a * d : is.fnc(d) ? d(a, b, c) : is.arr(d) ? d[a] ? d[a] : d[0] : d
        }

        function ma(a, b, c, d, e, f) {
            is.fnc(d) && d(a, b, c, e, f)
        }

        function Y(a, b, c, d) {
            is.fnc(a) && a(b, c, d)
        }

        function ca(a, b, c) {
            a = "lines" == b.splitType ? c["split" + a].lines.slice(0) : "words" == b.splitType ? c["split" + a].words.slice(0) : "chars" == b.splitType ? c["split" + a].chars.slice(0) : c["content" + a];
            Array.isArray(a) && (a = sortArray(b.pattern, a));
            return a
        }

        function ja(a, c, d, e, f) {
            var g = {};
            "in" == c ? d["inConfig" + a].rotIn ? (g.from = b.extend({},
                e, d["inConfig" + a].rotIn.from), g.to = b.extend({}, f, d["inConfig" + a].rotIn.to)) : (g.from = b.extend({}, e, d["inConfig" + a].from), g.to = b.extend({}, f, d["inConfig" + a].to)) : d["outConfig" + a].rotOut ? (g.from = b.extend({}, e, d["outConfig" + a].rotOut.from), g.to = b.extend({}, f, d["outConfig" + a].rotOut.to)) : (g.from = b.extend({}, e, d["outConfig" + a].from), g.to = b.extend({}, f, d["outConfig" + a].to));
            return g
        }

        function qa(a) {
            var b = {};
            b.padTop = parseInt(a.css("padding-top"));
            b.padRight = parseInt(a.css("padding-right"));
            b.padBottom = parseInt(a.css("padding-bottom"));
            b.padLeft = parseInt(a.css("padding-left"));
            b.borTop = parseInt(a.css("border-top-width"));
            b.borRight = parseInt(a.css("border-right-width"));
            b.borBottom = parseInt(a.css("border-bottom-width"));
            b.borLeft = parseInt(a.css("border-left-width"));
            b.marTop = parseInt(a.css("margin-top"));
            b.marRight = parseInt(a.css("margin-right"));
            b.marBottom = parseInt(a.css("margin-bottom"));
            b.marLeft = parseInt(a.css("margin-left"));
            b.horz = b.padLeft + b.padRight + b.borLeft + b.borRight;
            b.vert = b.padTop + b.padBottom + b.borTop + b.borBottom;
            return b
        }

        function pa(a) {
            var b = {};
            b.in = new TimelineMax;
            b.out = new TimelineMax;
            b.full = new TimelineMax;
            a && (b.repeat = new TimelineMax);
            return b
        }

        function ka(a, d, e, f, g, h, k, l) {
            var m = "default" == f.freezeTime ? 1.5 : parseFloat(f.freezeTime),
                n = f.sceneDelay ? parseFloat(f.sceneDelay) : 0;
            d.full.addLabel(g + "-beforeIn");
            d.full.add(d["in"], "+=" + n);
            d.full.addLabel(g + "-beforeFreeze");
            d.full.addLabel(g + "-beforeOut", "+=" + m);
            "none" != f.outDur ? (d.full.add(d.out, g + "-beforeOut"), d.full.set(h, {
                visibility: "hidden"
            })) : d.full.set({}, {
                    immediateRender: !1
                },
                g + "-beforeOut");
            c.hasClass("animate-colors") && (h = e % D.colors.length, d.full.to(Cb, d.full.duration(), {
                backgroundColor: D.colors[h]
            }, 0));
            k && d.full.set({}, {
                immediateRender: !1,
                onComplete: function() {
                    d.repeat.resume()
                }
            });
            f.sceneDur && d.full.duration(parseFloat(f.sceneDur));
            var p = {};
            k = d.full.timeScale();
            p.in = d["in"].duration() / d["in"].timeScale() / k;
            p.out = d.out.duration() / d.out.timeScale() / k;
            p.full = d.full.duration() / k;
            p.freeze = m / k;
            D.showAnimationSummary && (m = "in: " + p.in.toFixed(1) + "s<br/> out: " + p.out.toFixed(1) +
                "s<br/> freeze: " + p.freeze.toFixed(1) + "s<br/> scene: " + p.full.toFixed(1) + "s", d.full.set(Gb, {
                    text: m
                }, .1));
            m = a.find(".bt-container");
            if (0 < m.length) {
                k = m.data().animate ? m.data().animate : "yes";
                h = m.data().xEnd ? m.data().xEnd : "0%";
                var n = m.data().dur ? parseFloat(m.data().dur) : d["in"].duration(),
                    q = m.data().ease ? parseEase(m.data().ease) : Power4.easeOut;
                "yes" === k ? l.to(m, n, {
                    x: h,
                    ease: q,
                    force3D: !0,
                    rotationZ: "0.01deg"
                }, g) : l.set(m, {
                    x: "0%"
                }, g)
            }
            l.add(d.full, g);
            Ua = "no" == f.pursueImage ? p.full : Ua + p.full;
            P[g] && (l.add(P[g +
                "-alpha"], g), "full" == P[g].data.duration ? l.add(P[g].duration(Ua), "-=" + Ua) : "in" == P[g].data.duration ? l.add(P[g].duration(p.in), g) : l.add(P[g].duration(P[g].data.duration), g), Ua = 0);
            l.set({}, {
                immediateRender: !1,
                onComplete: function() {
                    b.isFunction(D.onBeforeScene) && D.onBeforeScene.call(c, e, a, p, Sa)
                }
            }, g + "-before");
            d.full.set({}, {
                immediateRender: !1,
                onComplete: function() {
                    b.isFunction(D.onBeforeIn) && D.onBeforeIn.call(c, e, a, p, Sa)
                }
            }, g + "-beforeIn");
            d.full.set({}, {
                immediateRender: !1,
                onComplete: function() {
                    b.isFunction(D.onBeforeFreeze) &&
                        D.onBeforeFreeze.call(c, e, a, p, Sa)
                }
            }, g + "-beforeFreeze");
            "none" != f.outDur && d.full.set({}, {
                immediateRender: !1,
                onComplete: function() {
                    b.isFunction(D.onBeforeOut) && D.onBeforeOut.call(c, e, a, p, Sa)
                }
            }, g + "-beforeOut");
            l.set({}, {
                immediateRender: !1,
                onComplete: function() {
                    b.isFunction(D.onAfterScene) && D.onAfterScene.call(c, e, a, p, Sa)
                }
            }, g + "-after")
        }
        var aa = this,
            D = b.extend({}, {
                autoStart: !0,
                fullDuration: "default",
                globalFreeze: 0,
                letterBoxing: !0,
                triggerProgress: !1,
                queueDelay: .05,
                force3DOnDevices: !1,
                easeOuterGPU: !1,
                preloadScenes: !1,
                waitForLoad: !1,
                forceLoadOnClick: !1,
                forceFallback: !0,
                videoOnMobiles: !0,
                stopTeaserOnEnd: !0,
                videoVolume: 1,
                standaloneAudioVolume: 1,
                preloadMethod: "xhr",
                preloadFiles: [],
                fileTimeout: 8E3,
                audioTimeout: 8E3,
                videoTimeout: 8E3,
                initAfter: 80,
                colors: ["#E7464F", "#CDAA20", "#80993B", "#07BABA", "#9B2C9D"],
                showAnimationSummary: !1,
                freezeOnBlur: !0,
                videoPlaybackChange: !1,
                onTeaserReady: function() {},
                onTeaserStart: function() {},
                onTeaserEnd: function() {},
                onBeforeScene: function() {},
                onBeforeIn: function() {},
                onBeforeFreeze: function() {},
                onBeforeOut: function() {},
                onAfterScene: function() {}
            }, a),
            va = "playing",
            Ca = !0,
            Fa = !1,
            xa = !1,
            oa = !1,
            ba = !1,
            r = D.autoStart ? !1 : !0,
            v, w = [],
            A = [],
            L = [],
            S, M = {},
            P = {},
            N = c.attr("id"),
            Ga, ua = isMobile.any,
            La = ua && !D.videoOnMobiles ? !1 : !0,
            Ba = b(window).width(),
            Ta, x = 0,
            U = 0,
            Sa, da, ya = "xmas-default",
            Ua = 0,
            gb = !0,
            za = "",
            Da = c.attr("data-enable-sound") ? parseBool(c.attr("data-enable-sound")) : !1,
            ra = c.attr("data-sound-loop") ? parseBool(c.attr("data-sound-loop")) : !1,
            xb = c.attr("data-auto-play-sound") ? parseBool(c.attr("data-auto-play-sound")) :
            !0,
            Va = c.attr("data-auto-stop-sound") ? parseBool(c.attr("data-auto-stop-sound")) : !1,
            Ha, wa, mb, Ma, Aa = c.attr("data-static-image") ? parseBool(c.attr("data-static-image")) : !1,
            hb = c.attr("data-mobile-image") ? parseBool(c.attr("data-mobile-image")) : !1,
            ab = c.data().staticImagePos ? c.data().staticImagePos : "center center",
            jb = c.data().zoomOrigin ? c.data().zoomOrigin : "center center",
            bb = c.data().zoomType ? c.data().zoomType : "in",
            sb = c.data().zoomDur ? parseFloat(c.data().zoomDur) : "auto",
            db = c.data().zoomScale ? parseFloat(c.data().zoomScale) :
            !1,
            ob = c.attr("data-splash-image") ? parseBool(c.attr("data-splash-image")) : !1,
            pb = c.attr("data-placeholder-image") ? parseBool(c.attr("data-placeholder-image")) : "images/1x1.png",
            kb = !1,
            Na = !1,
            Ja = !1,
            eb = !1,
            qb = !1,
            Qa = c.data().videoType ? c.data().videoType : "html5",
            Ea = c.attr("data-video-mute") ? parseBool(c.attr("data-video-mute")) : !0,
            ib = !0,
            zb = c.data().videoQuality ? c.data().videoQuality : "highres",
            rb = c.data().videoStart ? parseInt(c.data().videoStart) : 0,
            fb = c.data().videoStop ? parseInt(c.data().videoStop) : 0,
            Xa = c.attr("data-video-loop") ?
            parseBool(c.attr("data-video-loop")) : !0,
            Ka = c.attr("data-auto-stop-video") ? parseBool(c.attr("data-auto-stop-video")) : !1,
            Ab = isMobile.apple.device && D.forceLoadOnClick || ua && D.autoStart,
            ub = "click";
        isMobile.apple.device && (ub = "touchstart");
        isMobile.any && D.forceFallback && (za = "vid-fallback");
        S = c.data().staticVideo && La ? "video-bg" : Aa || hb ? "single-image" : "assorted";
        wa = ra ? -1 : 0;
        ua && c.data().mobileSound && (Da = c.data().mobileSound);
        Ea = Da ? !0 : Ea;
        ua && !D.force3DOnDevices && (gb = !1);
        ua && hb && (Aa = hb);
        var Ra = "<div class='slideshow-wrapper abs-fs'><div class='slideshow-overlay abs-fs'></div></div>";
        "single-image" === S ? (ua && (ab = c.data().mobileImagePos ? c.data().mobileImagePos : "center center"), ab = ab.split(" "), w.push({
            id: "static-image",
            family: "static-image",
            alignX: ab[0],
            alignY: ab[1],
            src: Aa,
            loadTimeout: D.fileTimeout
        }), Ra = Ra + "<div class='single-wrapper abs-fs'><div class='single-overlay abs-fs'></div><div class='single-image abs-fs'><img src='" + pb + "' width='1' height='1' data-object-fit='cover' data-object-position='" + ab[0] + " " + ab[1] + "' alt=''/></div></div><div class='black-bg abs-fs'></div>") : ("video-bg" ===
            S && Aa && w.push({
                id: "preview-image",
                family: "preview-image",
                src: Aa,
                loadTimeout: D.fileTimeout
            }), Ra += "<div class='black-bg gpu-hack abs-fs'></div>");
        D.letterBoxing && (Ra += "<div class='lbox-top'></div><div class='lbox-bottom'></div>");
        Ra = Ra + "<div class='video-wrapper " + za + " abs-fs'><div class='preview-image abs-fs bg-cover'></div></div><div class='splash-wrapper abs-fs'><div class='splash-overlay abs-fs'></div><div class='splash-image abs-fs bg-cover'></div></div><div class='color-wrapper gpu-hack abs-fs'></div>";
        D.showAnimationSummary && (Ra += "<div id='summary-handle'><i class='fa fa-info'></i></div><div id='summary-container'><div class='details'><h3 class='animation-name'></h3><p class='scene-info'></p><h3 class='total-duration'></h3></div></div>");
        c.wrap("<div class='xmas-wrapper'></div>").after(Ra);
        var Pa = c.parent(),
            Ia = Pa.find(".slideshow-wrapper"),
            Ya = Pa.find(".single-image"),
            Bb = Pa.find(".black-bg"),
            Za = Pa.find(".preview-image"),
            $a = Pa.find(".video-wrapper"),
            Cb = Pa.find(".color-wrapper"),
            wb = Pa.find(".splash-wrapper"),
            Db = wb.find(".splash-image");
        D.autoStart && (ob = !1, wb.hide());
        c.hasClass("animate-colors") && Cb.css({
            "background-color": D.colors[0]
        });
        var Eb = Pa.find("#summary-handle");
        Pa.find("#summary-container .animation-name");
        var Gb = Pa.find("#summary-container .scene-info"),
            Hb = Pa.find("#summary-container .total-duration");
        ob && w.push({
            id: "splash-image",
            family: "splash-image",
            src: ob,
            loadTimeout: D.fileTimeout
        });
        0 < D.preloadFiles.length && b.each(D.preloadFiles, function(a, b) {
            w.push({
                src: b,
                family: "user-files",
                loadTimeout: D.fileTimeout
            })
        });
        c.find(".xmas-slide").each(function(a, c) {
            var d;
            if (b(this).data().sceneImage || b(this).data().mobileImage) {
                b(this).data().sceneImage && (d = b(this).data().sceneImage);
                ua && b(this).data().mobileImage && (d = b(this).data().mobileImage);
                if (d) {
                    var e;
                    e = ua ? b(this).data().mobileImagePos ? b(this).data().mobileImagePos : "center center" : b(this).data().sceneImagePos ? b(this).data().sceneImagePos : "center center";
                    e = e.split(" ");
                    w.push({
                        id: b(this)[0].id,
                        family: "scene-image",
                        src: d,
                        alignX: e[0],
                        alignY: e[1],
                        loadTimeout: D.fileTimeout
                    })
                }
                La &&
                    b(this).data().sceneVideo || (b(this).data().sceneImage || ua && b(this).data().mobileImage) && Ia.append("<div class='scene-image gpu-hack " + b(this)[0].id + " abs-fs'><img  data-object-fit='cover' src='" + pb + "' data-object-position='" + e[0] + " " + e[1] + "' width='1' height='1' alt=''/></div>")
            }
            if (La)
                if ("html5" == b(this).data().videoType) {
                    d = b(this).attr("data-video-mute") ? parseBool(b(this).attr("data-video-mute")) : !0;
                    d = Da ? !0 : d;
                    e = b(this).data().videoStart ? parseInt(b(this).data().videoStart) : 0;
                    var f = b(this).data().videoStop ?
                        parseInt(b(this).data().videoStop) : 0,
                        g = b(this).attr("data-video-loop") ? parseBool(b(this).attr("data-video-loop")) : !1;
                    e = {
                        videoURL: b(this).data().sceneVideo,
                        mute: !0,
                        muteEnabled: d,
                        startAt: e,
                        stopAt: f,
                        loop: g,
                        sceneIndex: a
                    };
                    A.push(e);
                    ib && !d && (ib = !1)
                } else if ("youtube" == b(this).data().videoType) {
                d = b(this).attr("data-video-mute") ? parseBool(b(this).attr("data-video-mute")) : !0;
                d = Da ? !0 : d;
                var h = b(this).data().videoQuality ? b(this).data().videoQuality : "highres";
                e = b(this).data().videoStart ? parseInt(b(this).data().videoStart) :
                    0;
                f = b(this).data().videoStop ? parseInt(b(this).data().videoStop) : 0;
                g = b(this).attr("data-video-loop") ? parseBool(b(this).attr("data-video-loop")) : !1;
                e = {
                    autoPlay: !1,
                    showYTLogo: !1,
                    stopMovieOnBlur: !1,
                    showControls: !1,
                    opacity: 1,
                    videoURL: b(this).data().sceneVideo,
                    containment: "." + $a[0].className.split(" ")[0],
                    quality: h,
                    mute: !0,
                    muteEnabled: d,
                    startAt: e,
                    stopAt: f,
                    loop: g,
                    sceneIndex: a
                };
                L.push(e);
                ib && !d && (ib = !1)
            }
        });
        if (La && (0 < A.length || 0 < L.length || "video-bg" === S)) {
            if ("video-bg" === S && "html5" === Qa || 0 < A.length) {
                var cb,
                    Q, nb;
                "video-bg" === S && "html5" === Qa ? (Za.css({
                    opacity: "1",
                    visibility: "visible"
                }), cb = d(Xa, c.data().staticVideo, !0), Q = cb.getPlayer(), Q.off("ended"), Q.currentTime(rb), Q.on("loadeddata", function() {
                    !r || Ea || oa || (Q.muted(!1), Q.volume(D.videoVolume));
                    nb.css("visibility", "visible");
                    TweenMax.to(Za, .5, {
                        autoAlpha: 0
                    });
                    Q.on("timeupdate", function() {
                        if (0 != fb && Q.currentTime() >= fb || 0 == fb && Q.currentTime() >= Q.duration()) Xa ? (Q.loop(!0), Q.currentTime(rb), Q.play()) : (Na = !0, Q.pause())
                    })
                })) : (cb = d(A[0].loop, A[0].videoURL, A[0].mute),
                    Q = cb.getPlayer(), Q.off("ended"), Q.currentTime(A[0].startAt), Q.one("loadeddata", function() {
                        kb = !0;
                        !r || A[0].muteEnabled || oa || (Q.muted(!1), Q.volume(D.videoVolume))
                    }));
                nb = $a.find("#big-video-wrap");
                nb.append("<div class='bv-overlay abs-fs'></div>")
            }
            if ("video-bg" === S && "youtube" === Qa || 0 < L.length) {
                "video-bg" === S && "youtube" === Qa ? (Za.css({
                    opacity: "1",
                    visibility: "visible"
                }), $a.append("<div id='bgndVideo' class='player' data-property='{showYTLogo: false, loop: " + Xa + ', stopMovieOnBlur: false, quality: "' + zb + '",showControls: false, videoURL: "' +
                    c.data().staticVideo + '", containment:".' + $a[0].className.split(" ")[0] + '", autoPlay: false, mute: true, startAt: ' + rb + ", stopAt: " + fb + ", opacity: 1}'>My video</div>")) : $a.append("<div id='bgndVideo' class='player' data-property=" + JSON.stringify(L[0]) + ">My video</div>");
                var sa = $a.find("#bgndVideo"),
                    tb, ta = sa.YTPlayer({
                        onError: function(a, b) {
                            ta.trigger("YTPError");
                            qb = !0
                        }
                    });
                ta.isMute = !0;
                var yb = 0;
                ta.on("YTPTime", function() {
                    0 == yb && (yb += 1, setTimeout(function() {
                        qb = !0;
                        ta.trigger("YTPError")
                    }, D.videoTimeout))
                });
                ta.on("YTPReady", function() {
                    tb = $a.find(".mbYTP_wrapper");
                    qb = !0;
                    r && !oa && ("video-bg" == S && !Ea || 0 < L.length && !L[0].muteEnabled) && (sa.YTPUnmute(), ta.isMute = !1)
                });
                ta.on("YTPEnd", function() {
                    "video-bg" === S ? Na = !0 : eb = !1
                })
            }
        }
        var Fb = Da,
            vb = "sound-" + N,
            ha;
        Da && Ab && (b(".sound-info").show(), window.addEventListener(ub, function Oa() {
            "tag" == D.preloadMethod && createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin]);
            createjs.Sound.alternateExtensions = ["ogg"];
            createjs.Sound.addEventListener("fileload", g);
            createjs.Sound.registerSound({
                id: vb,
                src: Fb
            });
            window.removeEventListener(ub, Oa, !1);
            b(".sound-info").remove()
        }, !1));
        D.autoStart ? (b(".sound-info").show(), window.addEventListener(ub, function() {
            r || (r = !0, oa ? (Da && (ha.volume = D.standaloneAudioVolume), b(c).xmasPlugin.toggleSound()) : "video-bg" != S || Ea || ("html5" === Qa ? (Q.muted(!1), Q.volume(D.videoVolume)) : (sa.YTPUnmute(), ta.isMute = !1)), b(".sound-info").hide(), b(".pl-sound").parent().removeClass("highlight"))
        }, {
            once: !0
        })) : b(".pl-sound").parent().removeClass("highlight");
        aa.init = function() {
            aa.start(c,
                "start", D.autoStart);
            if (D.showAnimationSummary) Eb.on("click", function(a) {
                Eb.toggleClass("active")
            });
            return aa
        };
        aa.start = function(a, c, d) {
            Ga = a.clone(!0);
            x += 1;
            b(".scene-image img").css({
                opacity: "0",
                visibility: "hidden"
            });
            M[N] = new TimelineMax({
                paused: !0,
                delay: .5,
                repeat: 0,
                onStart: O
            });
            if ("single-image" === S) {
                var e = M[N];
                Ma = new TimelineMax({
                    delay: 0
                });
                var g = e.totalDuration();
                mb = g + .75;
                db && (Ma.addLabel("imageZoomer"), e.add(Ma, g));
                e.to(Ya, .75, {
                    opacity: 1
                })
            }
            a = a.find(".xmas-slide");
            f(0, a, a.length, d, c);
            d = c = M[N].totalDuration();
            "default" != D.fullDuration && 0 < D.fullDuration && (d = D.fullDuration, M[N].totalDuration(d));
            D.showAnimationSummary && (a = "Teaser Duration: " + d.toFixed(1) + "s", Hb.html(a));
            Sa = M[N].timeScale();
            "single-image" === S && db && (a = new TimelineMax({
                delay: 0
            }), c = "auto" === sb || isNaN(sb) ? ((c - mb) / c * d).toFixed(1) : sb, "in" === bb ? a.fromTo(Ya, c, {
                scale: 1
            }, {
                scale: db,
                rotation: .01,
                transformOrigin: jb
            }) : "out" === bb ? a.fromTo(Ya, c, {
                scale: db
            }, {
                scale: 1,
                rotation: .01,
                transformOrigin: jb
            }) : (a.fromTo(Ya, c / 2, {
                    scale: 1
                }, {
                    scale: db,
                    rotation: .01,
                    transformOrigin: jb
                }),
                a.to(Ya, c / 2, {
                    scale: 1,
                    rotation: .01,
                    transformOrigin: jb
                })), Ma.add(a, "imageZoomer"));
            D.preloadScenes && M[N].set({}, {
                immediateRender: !1,
                onComplete: E
            })
        };
        aa.play = function(a) {
            "start" === a ? M[N].play() : (M[N].play(a), "undefined" !== typeof ha && ("paused" == Ha || xa || z()));
            c.trigger("STPlay")
        };
        aa.seek = function(a) {
            M[N].seek(a);
            c.trigger("STPause")
        };
        aa.restart = function() {
            M[N].restart()
        };
        aa.pause = function() {
            M[N].pause();
            c.trigger("STPause")
        };
        aa.continueTeaser = function() {
            M[N].paused() && "playing" == va ? (M[N].resume(), c.trigger("STPlay"),
                "video-bg" !== S || Na || p(), X(), "undefined" == typeof ha || "paused" === Ha || xa || z()) : 1 <= M[N].progress() && Ca && !D.stopTeaserOnEnd && (Ca = !1, "video-bg" !== S || Na || p(), X(), "paused" === Ha || xa || "undefined" === typeof ha || (ha.paused = !1, c.trigger("STUnMuted")))
        };
        aa.freezeTeaser = function() {
            M[N].paused() || "playing" != va || 1 <= M[N].progress() ? 1 <= M[N].progress() && (Ca = !0, "video-bg" !== S || Na || m(), t(), "undefined" === typeof ha || xa || (ha.paused = !0, c.trigger("STMuted"))) : (M[N].pause(), "video-bg" !== S || Na || m(), t(), c.trigger("STPause"), "undefined" ===
                typeof ha || xa || (ha.paused = !0, c.trigger("STMuted")))
        };
        aa.pauseTeaser = function() {
            M[N].pause();
            "video-bg" !== S || Na || m();
            t();
            c.trigger("STPause");
            "undefined" !== typeof ha && (ha.paused = !0, c.trigger("STMuted"));
            va = "paused"
        };
        aa.playTeaser = function() {
            M[N].resume();
            c.trigger("STPlay");
            "video-bg" !== S || Na || p();
            X();
            "undefined" != typeof ha && "paused" !== Ha && z();
            va = "playing"
        };
        b.fn.xmasPlugin.skipToLast = function() {
            return M[N].currentLabel() != Ta ? (M[N].seek(Ta, !1).play(), "undefined" !== typeof ha && ("paused" == Ha || xa || z()), !0) : !1
        };
        b.fn.xmasPlugin.togglePlay = function() {
            M[N].paused() ? aa.playTeaser() : 1 <= M[N].progress() ? ("video-bg" != S && R(), xa = eb = Ja = ba = Na = !1, M[N].restart(), c.trigger("STPlay"), va = "playing") : aa.pauseTeaser()
        };
        b.fn.xmasPlugin.playTeaser = function() {
            aa.playTeaser()
        };
        b.fn.xmasPlugin.pauseTeaser = function() {
            aa.pauseTeaser()
        };
        b.fn.xmasPlugin.toggleSound = function() {
            Da ? ha.paused ? (z(), Ha = "playing") : "playFinished" != ha.playState && (ha.paused = !0, c.trigger("STMuted"), Ha = "paused") : "video-bg" === S ? Ea || ("html5" === Qa ? Q.muted() ?
                (c.trigger("STUnMuted"), Q.muted(!1), Q.volume(D.videoVolume)) : (c.trigger("STMuted"), Q.muted(!0)) : ta.isMute ? (c.trigger("STUnMuted"), sa.YTPUnmute(), ta.isMute = !1) : (c.trigger("STMuted"), sa.YTPMute(), ta.isMute = !0)) : "undefined" == typeof Q || Q.muteEnabled ? "undefined" == typeof ta || ta[0].opt.muteEnabled || (ta.isMute ? (c.trigger("STUnMuted"), sa.YTPUnmute(), ta.isMute = !1) : (c.trigger("STMuted"), sa.YTPMute(), ta.isMute = !0)) : Q.muted() ? (c.trigger("STUnMuted"), Q.muted(!1), Q.volume(D.videoVolume)) : (c.trigger("STMuted"), Q.muted(!0))
        };
        b.fn.xmasPlugin.changeSpeed = function(a) {
            D.videoPlaybackChange && (cb && Q.playbackRate(a), sa && sa.YTPGetPlayer().setPlaybackRate(a));
            a *= Sa;
            M[N].timeScale(a)
        };
        Aa || Da || 0 < w.length ? D.waitForLoad ? b(window).load(function() {
            e()
        }) : e() : D.waitForLoad ? b(window).load(function() {
            J()
        }) : J();
        b(window).on("debouncedresize", function(a) {
            if (0 < x && !ba) {
                if (!ua || b(window).width() != Ba) {
                    Ba = b(window).width();
                    a = M[N].paused() ? !1 : !0;
                    var d = M[N].time();
                    M[N].kill();
                    TweenMax.killDelayedCallsTo(f);
                    c.remove();
                    c = Ga;
                    Pa.prepend(c);
                    D.preloadScenes ||
                        (b("html").addClass("stompresize"), d = "start", c.trigger("reinitialize"));
                    aa.start(c, d, a)
                }
            } else console.log("TEASER NOT YET INITIALIZED (or) ENDED")
        })
    };
    b.fn.xmasPlugin = function(c) {
        var a = this;
        return this.each(function() {
            if (void 0 == b(this).data("xmasPlugin")) {
                var d = new b.xmasPlugin(a, c);
                b(this).data("xmasPlugin", d)
            }
        })
    }
})(jQuery);

function sortArray(b, c) {
    switch (b) {
        case "sequential":
            return c;
        case "reverse":
            return c.reverse();
        case "random":
            return shuffleArray(c);
        case "median":
            return centerArray(c);
        case "reverse-median":
            return centerArray(c).reverse();
        default:
            return c
    }
}

function shuffleArray(b) {
    for (var c = b.length - 1; 0 < c; c--) {
        var a = Math.floor(Math.random() * (c + 1)),
            d = b[c];
        b[c] = b[a];
        b[a] = d
    }
    return b
}

function centerArray(b) {
    for (var c = [], a = Math.ceil(b.length / 2), d = a - 1; 0 <= d;) c.push(b[d--]), a < b.length && c.push(b[a++]);
    return c
}

function parseEase(b) {
    var c = b.split(".");
    if (2 === c.length) return window[c[0]][c[1]];
    b = b.match(/true|false|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig).map(JSON.parse);
    return window[c[0]][c[1]].config.apply(null, b)
}

function randomInt(b, c) {
    return Math.floor(Math.random() * (c - b + 1) + b)
}

function randomFloat(b, c) {
    return (Math.random() * (c - b) + b).toFixed(1)
}
var is = {
    arr: function(b) {
        return Array.isArray(b)
    },
    obj: function(b) {
        return -1 < Object.prototype.toString.call(b).indexOf("Object")
    },
    svg: function(b) {
        return b instanceof SVGElement
    },
    dom: function(b) {
        return b.nodeType || is.svg(b)
    },
    num: function(b) {
        return !isNaN(parseInt(b))
    },
    float: function(b) {
        return b === +b && b !== (b | 0)
    },
    str: function(b) {
        return "string" === typeof b
    },
    fnc: function(b) {
        return "function" === typeof b
    },
    und: function(b) {
        return "undefined" === typeof b
    },
    nul: function(b) {
        return "null" === typeof b
    },
    hex: function(b) {
        return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(b)
    },
    rgb: function(b) {
        return /^rgb/.test(b)
    },
    hsl: function(b) {
        return /^hsl/.test(b)
    },
    col: function(b) {
        return is.hex(b) || is.rgb(b) || is.hsl(b)
    }
};

function lineEq(b, c, a, d, f) {
    b = (b - c) / (a - d);
    return b * f + (c - b * d)
}

function readCustomOptions(b) {
    var c, a, d, f = {};
    d = (b || "").replace(/\s/g, "").split(";");
    b = 0;
    for (c = d.length - 1; b <= c; b++) a = d[b].split(":"), f[a[0]] = a[1];
    return f
};
