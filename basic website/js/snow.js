$(function() {
    var snowCount = 150;
    var mobileDetected = isMobile.phone;
    if (mobileDetected) {
        snowCount = 25;
    }

    (function() {
        var a, b, c, d, e, f, g, i, j, k, l, m;
        c = snowCount, 
        a = [
            [245, 246, 250],
            [235, 234, 242],
            [211, 215, 226],
            [255, 255, 255],
            [132, 129, 123]
            ], 
        d = 2 * Math.PI, 
        e = document.getElementById("world"),
        g = e.getContext("2d"), 
        window.w = 0, 
        window.h = 0, 
        l = function() 
        {
            return window.w = e.width = window.innerWidth,
                window.h = e.height = window.innerHeight
        }
        , window.addEventListener("resize", l, !1), 
            window.onload = function() {
            return setTimeout(l, 0)
        }, 
            k = function(a, b) {
            return (b - a) * Math.random() + a
        }, i = function(a, b, c, e) {
            return g.beginPath(), g.arc(a, b, c, 0, d, !1), g.fillStyle = e, g.fill()
        }, m = .5, window.requestAnimationFrame = function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(a) {
                return window.setTimeout(a, 1e3 / 60)
            }
        }(), b = function() {
            function b() {
                this.style = a[~~k(0, 5)], this.rgb = "rgba(" + this.style[0] + "," + this.style[1] + "," + this.style[2], this.r = ~~k(2, 6), this.r2 = 2 * this.r, this.replace()
            }
            return b.prototype.replace = function() {
                return this.opacity = 0, this.dop = .03 * k(1, 4), this.x = k(-this.r2, w - this.r2), this.y = k(-20, h - this.r2), this.xmax = w - this.r, this.ymax = h - this.r, this.vx = k(0, 2) + 8 * m - 5, this.vy = .7 * this.r + k(-1, 1)
            }, b.prototype.draw = function() {
                var a;
                return this.x += this.vx, this.y += this.vy, this.opacity += this.dop, this.opacity > 1 && (this.opacity = 1, this.dop *= -1), (this.opacity < 0 || this.y > this.ymax) && this.replace(), 0 < (a = this.x) && a < this.xmax || (this.x = (this.x + this.xmax) % this.xmax), i(~~this.x, ~~this.y, this.r, this.rgb + "," + this.opacity + ")")
            }, b
        }(), f = function() {
            var a, d, e;
            for (e = [], j = a = 1, d = c; 1 <= d ? a <= d : a >= d; j = 1 <= d ? ++a : --a) e.push(new b);
            return e
        }(), window.step = function() {
            var a, b, c, d;
            for (requestAnimationFrame(step), g.clearRect(0, 0, w, h), d = [], b = 0, c = f.length; b < c; b++) a = f[b], d.push(a.draw());
            return d
        }, step()
    }).call(this);
});