var Spasm;
(function(n) {
    "use strict";
    var t = {};
    typeof exports == "undefined" ? typeof define == "function" && typeof define.amd == "object" && define.amd ? (t.exports = {}, define(function() {
            return t.exports
        })) : t.exports = typeof window != "undefined" ? window : n : t.exports = exports,
        function(n) {
            var l, o, c, a, v, r, i, t, s, h, e, f, u;
            l || (l = 1e-6);
            o || (o = typeof Float32Array != "undefined" ? Float32Array : Array);
            c || (c = Math.random);
            a = {};
            a.setMatrixArrayType = function(n) {
                o = n
            };
            typeof n != "undefined" && (n.glMatrix = a);
            v = Math.PI / 180;
            a.toRadian = function(n) {
                return n * v
            };
            r = {};
            r.create = function() {
                var n = new o(2);
                return n[0] = 0, n[1] = 0, n
            };
            r.clone = function(n) {
                var t = new o(2);
                return t[0] = n[0], t[1] = n[1], t
            };
            r.fromValues = function(n, t) {
                var i = new o(2);
                return i[0] = n, i[1] = t, i
            };
            r.copy = function(n, t) {
                return n[0] = t[0], n[1] = t[1], n
            };
            r.set = function(n, t, i) {
                return n[0] = t, n[1] = i, n
            };
            r.add = function(n, t, i) {
                return n[0] = t[0] + i[0], n[1] = t[1] + i[1], n
            };
            r.subtract = function(n, t, i) {
                return n[0] = t[0] - i[0], n[1] = t[1] - i[1], n
            };
            r.sub = r.subtract;
            r.multiply = function(n, t, i) {
                return n[0] = t[0] * i[0], n[1] = t[1] * i[1], n
            };
            r.mul = r.multiply;
            r.divide = function(n, t, i) {
                return n[0] = t[0] / i[0], n[1] = t[1] / i[1], n
            };
            r.div = r.divide;
            r.min = function(n, t, i) {
                return n[0] = Math.min(t[0], i[0]), n[1] = Math.min(t[1], i[1]), n
            };
            r.max = function(n, t, i) {
                return n[0] = Math.max(t[0], i[0]), n[1] = Math.max(t[1], i[1]), n
            };
            r.scale = function(n, t, i) {
                return n[0] = t[0] * i, n[1] = t[1] * i, n
            };
            r.scaleAndAdd = function(n, t, i, r) {
                return n[0] = t[0] + i[0] * r, n[1] = t[1] + i[1] * r, n
            };
            r.distance = function(n, t) {
                var i = t[0] - n[0],
                    r = t[1] - n[1];
                return Math.sqrt(i * i + r * r)
            };
            r.dist = r.distance;
            r.squaredDistance = function(n, t) {
                var i = t[0] - n[0],
                    r = t[1] - n[1];
                return i * i + r * r
            };
            r.sqrDist = r.squaredDistance;
            r.length = function(n) {
                var t = n[0],
                    i = n[1];
                return Math.sqrt(t * t + i * i)
            };
            r.len = r.length;
            r.squaredLength = function(n) {
                var t = n[0],
                    i = n[1];
                return t * t + i * i
            };
            r.sqrLen = r.squaredLength;
            r.negate = function(n, t) {
                return n[0] = -t[0], n[1] = -t[1], n
            };
            r.normalize = function(n, t) {
                var r = t[0],
                    u = t[1],
                    i = r * r + u * u;
                return i > 0 && (i = 1 / Math.sqrt(i), n[0] = t[0] * i, n[1] = t[1] * i), n
            };
            r.dot = function(n, t) {
                return n[0] * t[0] + n[1] * t[1]
            };
            r.cross = function(n, t, i) {
                var r = t[0] * i[1] - t[1] * i[0];
                return n[0] = n[1] = 0, n[2] = r, n
            };
            r.lerp = function(n, t, i, r) {
                var u = t[0],
                    f = t[1];
                return n[0] = u + r * (i[0] - u), n[1] = f + r * (i[1] - f), n
            };
            r.random = function(n, t) {
                t = t || 1;
                var i = c() * 2 * Math.PI;
                return n[0] = Math.cos(i) * t, n[1] = Math.sin(i) * t, n
            };
            r.transformMat2 = function(n, t, i) {
                var r = t[0],
                    u = t[1];
                return n[0] = i[0] * r + i[2] * u, n[1] = i[1] * r + i[3] * u, n
            };
            r.transformMat2d = function(n, t, i) {
                var r = t[0],
                    u = t[1];
                return n[0] = i[0] * r + i[2] * u + i[4], n[1] = i[1] * r + i[3] * u + i[5], n
            };
            r.transformMat3 = function(n, t, i) {
                var r = t[0],
                    u = t[1];
                return n[0] = i[0] * r + i[3] * u + i[6], n[1] = i[1] * r + i[4] * u + i[7], n
            };
            r.transformMat4 = function(n, t, i) {
                var r = t[0],
                    u = t[1];
                return n[0] = i[0] * r + i[4] * u + i[12], n[1] = i[1] * r + i[5] * u + i[13], n
            };
            r.forEach = function() {
                var n = r.create();
                return function(t, i, r, u, f, e) {
                    var o, s;
                    for (i || (i = 2), r || (r = 0), s = u ? Math.min(u * i + r, t.length) : t.length, o = r; o < s; o += i) n[0] = t[o], n[1] = t[o + 1], f(n, n, e), t[o] = n[0], t[o + 1] = n[1];
                    return t
                }
            }();
            r.str = function(n) {
                return "vec2(" + n[0] + ", " + n[1] + ")"
            };
            typeof n != "undefined" && (n.vec2 = r);
            i = {};
            i.create = function() {
                var n = new o(3);
                return n[0] = 0, n[1] = 0, n[2] = 0, n
            };
            i.clone = function(n) {
                var t = new o(3);
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t
            };
            i.fromValues = function(n, t, i) {
                var r = new o(3);
                return r[0] = n, r[1] = t, r[2] = i, r
            };
            i.copy = function(n, t) {
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n
            };
            i.set = function(n, t, i, r) {
                return n[0] = t, n[1] = i, n[2] = r, n
            };
            i.add = function(n, t, i) {
                return n[0] = t[0] + i[0], n[1] = t[1] + i[1], n[2] = t[2] + i[2], n
            };
            i.subtract = function(n, t, i) {
                return n[0] = t[0] - i[0], n[1] = t[1] - i[1], n[2] = t[2] - i[2], n
            };
            i.sub = i.subtract;
            i.multiply = function(n, t, i) {
                return n[0] = t[0] * i[0], n[1] = t[1] * i[1], n[2] = t[2] * i[2], n
            };
            i.mul = i.multiply;
            i.divide = function(n, t, i) {
                return n[0] = t[0] / i[0], n[1] = t[1] / i[1], n[2] = t[2] / i[2], n
            };
            i.div = i.divide;
            i.min = function(n, t, i) {
                return n[0] = Math.min(t[0], i[0]), n[1] = Math.min(t[1], i[1]), n[2] = Math.min(t[2], i[2]), n
            };
            i.max = function(n, t, i) {
                return n[0] = Math.max(t[0], i[0]), n[1] = Math.max(t[1], i[1]), n[2] = Math.max(t[2], i[2]), n
            };
            i.scale = function(n, t, i) {
                return n[0] = t[0] * i, n[1] = t[1] * i, n[2] = t[2] * i, n
            };
            i.scaleAndAdd = function(n, t, i, r) {
                return n[0] = t[0] + i[0] * r, n[1] = t[1] + i[1] * r, n[2] = t[2] + i[2] * r, n
            };
            i.distance = function(n, t) {
                var i = t[0] - n[0],
                    r = t[1] - n[1],
                    u = t[2] - n[2];
                return Math.sqrt(i * i + r * r + u * u)
            };
            i.dist = i.distance;
            i.squaredDistance = function(n, t) {
                var i = t[0] - n[0],
                    r = t[1] - n[1],
                    u = t[2] - n[2];
                return i * i + r * r + u * u
            };
            i.sqrDist = i.squaredDistance;
            i.length = function(n) {
                var t = n[0],
                    i = n[1],
                    r = n[2];
                return Math.sqrt(t * t + i * i + r * r)
            };
            i.len = i.length;
            i.squaredLength = function(n) {
                var t = n[0],
                    i = n[1],
                    r = n[2];
                return t * t + i * i + r * r
            };
            i.sqrLen = i.squaredLength;
            i.negate = function(n, t) {
                return n[0] = -t[0], n[1] = -t[1], n[2] = -t[2], n
            };
            i.normalize = function(n, t) {
                var r = t[0],
                    u = t[1],
                    f = t[2],
                    i = r * r + u * u + f * f;
                return i > 0 && (i = 1 / Math.sqrt(i), n[0] = t[0] * i, n[1] = t[1] * i, n[2] = t[2] * i), n
            };
            i.dot = function(n, t) {
                return n[0] * t[0] + n[1] * t[1] + n[2] * t[2]
            };
            i.cross = function(n, t, i) {
                var r = t[0],
                    u = t[1],
                    f = t[2],
                    e = i[0],
                    o = i[1],
                    s = i[2];
                return n[0] = u * s - f * o, n[1] = f * e - r * s, n[2] = r * o - u * e, n
            };
            i.lerp = function(n, t, i, r) {
                var u = t[0],
                    f = t[1],
                    e = t[2];
                return n[0] = u + r * (i[0] - u), n[1] = f + r * (i[1] - f), n[2] = e + r * (i[2] - e), n
            };
            i.random = function(n, t) {
                t = t || 1;
                var r = c() * 2 * Math.PI,
                    i = c() * 2 - 1,
                    u = Math.sqrt(1 - i * i) * t;
                return n[0] = Math.cos(r) * u, n[1] = Math.sin(r) * u, n[2] = i * t, n
            };
            i.transformMat4 = function(n, t, i) {
                var r = t[0],
                    u = t[1],
                    f = t[2];
                return n[0] = i[0] * r + i[4] * u + i[8] * f + i[12], n[1] = i[1] * r + i[5] * u + i[9] * f + i[13], n[2] = i[2] * r + i[6] * u + i[10] * f + i[14], n
            };
            i.transformMat3 = function(n, t, i) {
                var r = t[0],
                    u = t[1],
                    f = t[2];
                return n[0] = r * i[0] + u * i[3] + f * i[6], n[1] = r * i[1] + u * i[4] + f * i[7], n[2] = r * i[2] + u * i[5] + f * i[8], n
            };
            i.transformQuat = function(n, t, i) {
                var o = t[0],
                    s = t[1],
                    h = t[2],
                    r = i[0],
                    u = i[1],
                    f = i[2],
                    e = i[3],
                    c = e * o + u * h - f * s,
                    l = e * s + f * o - r * h,
                    a = e * h + r * s - u * o,
                    v = -r * o - u * s - f * h;
                return n[0] = c * e + v * -r + l * -f - a * -u, n[1] = l * e + v * -u + a * -r - c * -f, n[2] = a * e + v * -f + c * -u - l * -r, n
            };
            i.forEach = function() {
                var n = i.create();
                return function(t, i, r, u, f, e) {
                    var o, s;
                    for (i || (i = 3), r || (r = 0), s = u ? Math.min(u * i + r, t.length) : t.length, o = r; o < s; o += i) n[0] = t[o], n[1] = t[o + 1], n[2] = t[o + 2], f(n, n, e), t[o] = n[0], t[o + 1] = n[1], t[o + 2] = n[2];
                    return t
                }
            }();
            i.str = function(n) {
                return "vec3(" + n[0] + ", " + n[1] + ", " + n[2] + ")"
            };
            typeof n != "undefined" && (n.vec3 = i);
            t = {};
            t.create = function() {
                var n = new o(4);
                return n[0] = 0, n[1] = 0, n[2] = 0, n[3] = 0, n
            };
            t.clone = function(n) {
                var t = new o(4);
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t
            };
            t.fromValues = function(n, t, i, r) {
                var u = new o(4);
                return u[0] = n, u[1] = t, u[2] = i, u[3] = r, u
            };
            t.copy = function(n, t) {
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n
            };
            t.set = function(n, t, i, r, u) {
                return n[0] = t, n[1] = i, n[2] = r, n[3] = u, n
            };
            t.add = function(n, t, i) {
                return n[0] = t[0] + i[0], n[1] = t[1] + i[1], n[2] = t[2] + i[2], n[3] = t[3] + i[3], n
            };
            t.subtract = function(n, t, i) {
                return n[0] = t[0] - i[0], n[1] = t[1] - i[1], n[2] = t[2] - i[2], n[3] = t[3] - i[3], n
            };
            t.sub = t.subtract;
            t.multiply = function(n, t, i) {
                return n[0] = t[0] * i[0], n[1] = t[1] * i[1], n[2] = t[2] * i[2], n[3] = t[3] * i[3], n
            };
            t.mul = t.multiply;
            t.divide = function(n, t, i) {
                return n[0] = t[0] / i[0], n[1] = t[1] / i[1], n[2] = t[2] / i[2], n[3] = t[3] / i[3], n
            };
            t.div = t.divide;
            t.min = function(n, t, i) {
                return n[0] = Math.min(t[0], i[0]), n[1] = Math.min(t[1], i[1]), n[2] = Math.min(t[2], i[2]), n[3] = Math.min(t[3], i[3]), n
            };
            t.max = function(n, t, i) {
                return n[0] = Math.max(t[0], i[0]), n[1] = Math.max(t[1], i[1]), n[2] = Math.max(t[2], i[2]), n[3] = Math.max(t[3], i[3]), n
            };
            t.scale = function(n, t, i) {
                return n[0] = t[0] * i, n[1] = t[1] * i, n[2] = t[2] * i, n[3] = t[3] * i, n
            };
            t.scaleAndAdd = function(n, t, i, r) {
                return n[0] = t[0] + i[0] * r, n[1] = t[1] + i[1] * r, n[2] = t[2] + i[2] * r, n[3] = t[3] + i[3] * r, n
            };
            t.distance = function(n, t) {
                var i = t[0] - n[0],
                    r = t[1] - n[1],
                    u = t[2] - n[2],
                    f = t[3] - n[3];
                return Math.sqrt(i * i + r * r + u * u + f * f)
            };
            t.dist = t.distance;
            t.squaredDistance = function(n, t) {
                var i = t[0] - n[0],
                    r = t[1] - n[1],
                    u = t[2] - n[2],
                    f = t[3] - n[3];
                return i * i + r * r + u * u + f * f
            };
            t.sqrDist = t.squaredDistance;
            t.length = function(n) {
                var t = n[0],
                    i = n[1],
                    r = n[2],
                    u = n[3];
                return Math.sqrt(t * t + i * i + r * r + u * u)
            };
            t.len = t.length;
            t.squaredLength = function(n) {
                var t = n[0],
                    i = n[1],
                    r = n[2],
                    u = n[3];
                return t * t + i * i + r * r + u * u
            };
            t.sqrLen = t.squaredLength;
            t.negate = function(n, t) {
                return n[0] = -t[0], n[1] = -t[1], n[2] = -t[2], n[3] = -t[3], n
            };
            t.normalize = function(n, t) {
                var r = t[0],
                    u = t[1],
                    f = t[2],
                    e = t[3],
                    i = r * r + u * u + f * f + e * e;
                return i > 0 && (i = 1 / Math.sqrt(i), n[0] = t[0] * i, n[1] = t[1] * i, n[2] = t[2] * i, n[3] = t[3] * i), n
            };
            t.dot = function(n, t) {
                return n[0] * t[0] + n[1] * t[1] + n[2] * t[2] + n[3] * t[3]
            };
            t.lerp = function(n, t, i, r) {
                var u = t[0],
                    f = t[1],
                    e = t[2],
                    o = t[3];
                return n[0] = u + r * (i[0] - u), n[1] = f + r * (i[1] - f), n[2] = e + r * (i[2] - e), n[3] = o + r * (i[3] - o), n
            };
            t.random = function(n, i) {
                return i = i || 1, n[0] = c(), n[1] = c(), n[2] = c(), n[3] = c(), t.normalize(n, n), t.scale(n, n, i), n
            };
            t.transformMat4 = function(n, t, i) {
                var r = t[0],
                    u = t[1],
                    f = t[2],
                    e = t[3];
                return n[0] = i[0] * r + i[4] * u + i[8] * f + i[12] * e, n[1] = i[1] * r + i[5] * u + i[9] * f + i[13] * e, n[2] = i[2] * r + i[6] * u + i[10] * f + i[14] * e, n[3] = i[3] * r + i[7] * u + i[11] * f + i[15] * e, n
            };
            t.transformQuat = function(n, t, i) {
                var o = t[0],
                    s = t[1],
                    h = t[2],
                    r = i[0],
                    u = i[1],
                    f = i[2],
                    e = i[3],
                    c = e * o + u * h - f * s,
                    l = e * s + f * o - r * h,
                    a = e * h + r * s - u * o,
                    v = -r * o - u * s - f * h;
                return n[0] = c * e + v * -r + l * -f - a * -u, n[1] = l * e + v * -u + a * -r - c * -f, n[2] = a * e + v * -f + c * -u - l * -r, n
            };
            t.forEach = function() {
                var n = t.create();
                return function(t, i, r, u, f, e) {
                    var o, s;
                    for (i || (i = 4), r || (r = 0), s = u ? Math.min(u * i + r, t.length) : t.length, o = r; o < s; o += i) n[0] = t[o], n[1] = t[o + 1], n[2] = t[o + 2], n[3] = t[o + 3], f(n, n, e), t[o] = n[0], t[o + 1] = n[1], t[o + 2] = n[2], t[o + 3] = n[3];
                    return t
                }
            }();
            t.str = function(n) {
                return "vec4(" + n[0] + ", " + n[1] + ", " + n[2] + ", " + n[3] + ")"
            };
            typeof n != "undefined" && (n.vec4 = t);
            s = {};
            s.create = function() {
                var n = new o(4);
                return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 1, n
            };
            s.clone = function(n) {
                var t = new o(4);
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t
            };
            s.copy = function(n, t) {
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n
            };
            s.identity = function(n) {
                return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 1, n
            };
            s.transpose = function(n, t) {
                if (n === t) {
                    var i = t[1];
                    n[1] = t[2];
                    n[2] = i
                } else n[0] = t[0], n[1] = t[2], n[2] = t[1], n[3] = t[3];
                return n
            };
            s.invert = function(n, t) {
                var r = t[0],
                    u = t[1],
                    f = t[2],
                    e = t[3],
                    i = r * e - f * u;
                return i ? (i = 1 / i, n[0] = e * i, n[1] = -u * i, n[2] = -f * i, n[3] = r * i, n) : null
            };
            s.adjoint = function(n, t) {
                var i = t[0];
                return n[0] = t[3], n[1] = -t[1], n[2] = -t[2], n[3] = i, n
            };
            s.determinant = function(n) {
                return n[0] * n[3] - n[2] * n[1]
            };
            s.multiply = function(n, t, i) {
                var r = t[0],
                    u = t[1],
                    f = t[2],
                    e = t[3],
                    o = i[0],
                    s = i[1],
                    h = i[2],
                    c = i[3];
                return n[0] = r * o + u * h, n[1] = r * s + u * c, n[2] = f * o + e * h, n[3] = f * s + e * c, n
            };
            s.mul = s.multiply;
            s.rotate = function(n, t, i) {
                var f = t[0],
                    e = t[1],
                    o = t[2],
                    s = t[3],
                    r = Math.sin(i),
                    u = Math.cos(i);
                return n[0] = f * u + e * r, n[1] = f * -r + e * u, n[2] = o * u + s * r, n[3] = o * -r + s * u, n
            };
            s.scale = function(n, t, i) {
                var f = t[0],
                    e = t[1],
                    o = t[2],
                    s = t[3],
                    r = i[0],
                    u = i[1];
                return n[0] = f * r, n[1] = e * u, n[2] = o * r, n[3] = s * u, n
            };
            s.str = function(n) {
                return "mat2(" + n[0] + ", " + n[1] + ", " + n[2] + ", " + n[3] + ")"
            };
            typeof n != "undefined" && (n.mat2 = s);
            h = {};
            h.create = function() {
                var n = new o(6);
                return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 1, n[4] = 0, n[5] = 0, n
            };
            h.clone = function(n) {
                var t = new o(6);
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t
            };
            h.copy = function(n, t) {
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n[4] = t[4], n[5] = t[5], n
            };
            h.identity = function(n) {
                return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 1, n[4] = 0, n[5] = 0, n
            };
            h.invert = function(n, t) {
                var r = t[0],
                    u = t[1],
                    f = t[2],
                    e = t[3],
                    o = t[4],
                    s = t[5],
                    i = r * e - u * f;
                return i ? (i = 1 / i, n[0] = e * i, n[1] = -u * i, n[2] = -f * i, n[3] = r * i, n[4] = (f * s - e * o) * i, n[5] = (u * o - r * s) * i, n) : null
            };
            h.determinant = function(n) {
                return n[0] * n[3] - n[1] * n[2]
            };
            h.multiply = function(n, t, i) {
                var o = t[0],
                    s = t[1],
                    h = t[2],
                    c = t[3],
                    l = t[4],
                    a = t[5],
                    r = i[0],
                    u = i[1],
                    f = i[2],
                    e = i[3],
                    v = i[4],
                    y = i[5];
                return n[0] = o * r + s * f, n[1] = o * u + s * e, n[2] = h * r + c * f, n[3] = h * u + c * e, n[4] = r * l + f * a + v, n[5] = u * l + e * a + y, n
            };
            h.mul = h.multiply;
            h.rotate = function(n, t, i) {
                var f = t[0],
                    e = t[1],
                    o = t[2],
                    s = t[3],
                    h = t[4],
                    c = t[5],
                    r = Math.sin(i),
                    u = Math.cos(i);
                return n[0] = f * u + e * r, n[1] = -f * r + e * u, n[2] = o * u + s * r, n[3] = -o * r + u * s, n[4] = u * h + r * c, n[5] = u * c - r * h, n
            };
            h.scale = function(n, t, i) {
                var r = i[0],
                    u = i[1];
                return n[0] = t[0] * r, n[1] = t[1] * u, n[2] = t[2] * r, n[3] = t[3] * u, n[4] = t[4] * r, n[5] = t[5] * u, n
            };
            h.translate = function(n, t, i) {
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n[4] = t[4] + i[0], n[5] = t[5] + i[1], n
            };
            h.str = function(n) {
                return "mat2d(" + n[0] + ", " + n[1] + ", " + n[2] + ", " + n[3] + ", " + n[4] + ", " + n[5] + ")"
            };
            typeof n != "undefined" && (n.mat2d = h);
            e = {};
            e.create = function() {
                var n = new o(9);
                return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 1, n[5] = 0, n[6] = 0, n[7] = 0, n[8] = 1, n
            };
            e.fromMat4 = function(n, t) {
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[4], n[4] = t[5], n[5] = t[6], n[6] = t[8], n[7] = t[9], n[8] = t[10], n
            };
            e.clone = function(n) {
                var t = new o(9);
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], t
            };
            e.copy = function(n, t) {
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n[4] = t[4], n[5] = t[5], n[6] = t[6], n[7] = t[7], n[8] = t[8], n
            };
            e.identity = function(n) {
                return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 1, n[5] = 0, n[6] = 0, n[7] = 0, n[8] = 1, n
            };
            e.transpose = function(n, t) {
                if (n === t) {
                    var i = t[1],
                        r = t[2],
                        u = t[5];
                    n[1] = t[3];
                    n[2] = t[6];
                    n[3] = i;
                    n[5] = t[7];
                    n[6] = r;
                    n[7] = u
                } else n[0] = t[0], n[1] = t[3], n[2] = t[6], n[3] = t[1], n[4] = t[4], n[5] = t[7], n[6] = t[2], n[7] = t[5], n[8] = t[8];
                return n
            };
            e.invert = function(n, t) {
                var r = t[0],
                    u = t[1],
                    f = t[2],
                    e = t[3],
                    o = t[4],
                    s = t[5],
                    h = t[6],
                    c = t[7],
                    l = t[8],
                    a = l * o - s * c,
                    v = -l * e + s * h,
                    y = c * e - o * h,
                    i = r * a + u * v + f * y;
                return i ? (i = 1 / i, n[0] = a * i, n[1] = (-l * u + f * c) * i, n[2] = (s * u - f * o) * i, n[3] = v * i, n[4] = (l * r - f * h) * i, n[5] = (-s * r + f * e) * i, n[6] = y * i, n[7] = (-c * r + u * h) * i, n[8] = (o * r - u * e) * i, n) : null
            };
            e.adjoint = function(n, t) {
                var i = t[0],
                    r = t[1],
                    u = t[2],
                    f = t[3],
                    e = t[4],
                    o = t[5],
                    s = t[6],
                    h = t[7],
                    c = t[8];
                return n[0] = e * c - o * h, n[1] = u * h - r * c, n[2] = r * o - u * e, n[3] = o * s - f * c, n[4] = i * c - u * s, n[5] = u * f - i * o, n[6] = f * h - e * s, n[7] = r * s - i * h, n[8] = i * e - r * f, n
            };
            e.determinant = function(n) {
                var o = n[0],
                    s = n[1],
                    h = n[2],
                    t = n[3],
                    i = n[4],
                    r = n[5],
                    u = n[6],
                    f = n[7],
                    e = n[8];
                return o * (e * i - r * f) + s * (-e * t + r * u) + h * (f * t - i * u)
            };
            e.multiply = function(n, t, i) {
                var r = t[0],
                    u = t[1],
                    f = t[2],
                    e = t[3],
                    o = t[4],
                    s = t[5],
                    h = t[6],
                    c = t[7],
                    l = t[8],
                    a = i[0],
                    v = i[1],
                    y = i[2],
                    p = i[3],
                    w = i[4],
                    b = i[5],
                    k = i[6],
                    d = i[7],
                    g = i[8];
                return n[0] = a * r + v * e + y * h, n[1] = a * u + v * o + y * c, n[2] = a * f + v * s + y * l, n[3] = p * r + w * e + b * h, n[4] = p * u + w * o + b * c, n[5] = p * f + w * s + b * l, n[6] = k * r + d * e + g * h, n[7] = k * u + d * o + g * c, n[8] = k * f + d * s + g * l, n
            };
            e.mul = e.multiply;
            e.translate = function(n, t, i) {
                var f = t[0],
                    e = t[1],
                    o = t[2],
                    s = t[3],
                    h = t[4],
                    c = t[5],
                    l = t[6],
                    a = t[7],
                    v = t[8],
                    r = i[0],
                    u = i[1];
                return n[0] = f, n[1] = e, n[2] = o, n[3] = s, n[4] = h, n[5] = c, n[6] = r * f + u * s + l, n[7] = r * e + u * h + a, n[8] = r * o + u * c + v, n
            };
            e.rotate = function(n, t, i) {
                var f = t[0],
                    e = t[1],
                    o = t[2],
                    s = t[3],
                    h = t[4],
                    c = t[5],
                    l = t[6],
                    a = t[7],
                    v = t[8],
                    r = Math.sin(i),
                    u = Math.cos(i);
                return n[0] = u * f + r * s, n[1] = u * e + r * h, n[2] = u * o + r * c, n[3] = u * s - r * f, n[4] = u * h - r * e, n[5] = u * c - r * o, n[6] = l, n[7] = a, n[8] = v, n
            };
            e.scale = function(n, t, i) {
                var r = i[0],
                    u = i[1];
                return n[0] = r * t[0], n[1] = r * t[1], n[2] = r * t[2], n[3] = u * t[3], n[4] = u * t[4], n[5] = u * t[5], n[6] = t[6], n[7] = t[7], n[8] = t[8], n
            };
            e.fromMat2d = function(n, t) {
                return n[0] = t[0], n[1] = t[1], n[2] = 0, n[3] = t[2], n[4] = t[3], n[5] = 0, n[6] = t[4], n[7] = t[5], n[8] = 1, n
            };
            e.fromQuat = function(n, t) {
                var f = t[0],
                    r = t[1],
                    i = t[2],
                    e = t[3],
                    u = f + f,
                    o = r + r,
                    s = i + i,
                    h = f * u,
                    c = r * u,
                    l = r * o,
                    a = i * u,
                    v = i * o,
                    y = i * s,
                    p = e * u,
                    w = e * o,
                    b = e * s;
                return n[0] = 1 - l - y, n[3] = c - b, n[6] = a + w, n[1] = c + b, n[4] = 1 - h - y, n[7] = v - p, n[2] = a - w, n[5] = v + p, n[8] = 1 - h - l, n
            };
            e.normalFromMat4 = function(n, t) {
                var e = t[0],
                    o = t[1],
                    s = t[2],
                    r = t[3],
                    h = t[4],
                    c = t[5],
                    l = t[6],
                    u = t[7],
                    k = t[8],
                    d = t[9],
                    g = t[10],
                    nt = t[11],
                    a = t[12],
                    v = t[13],
                    y = t[14],
                    f = t[15],
                    ot = e * c - o * h,
                    st = e * l - s * h,
                    tt = e * u - r * h,
                    ht = o * l - s * c,
                    it = o * u - r * c,
                    rt = s * u - r * l,
                    ut = k * v - d * a,
                    ft = k * y - g * a,
                    p = k * f - nt * a,
                    et = d * y - g * v,
                    w = d * f - nt * v,
                    b = g * f - nt * y,
                    i = ot * b - st * w + tt * et + ht * p - it * ft + rt * ut;
                return i ? (i = 1 / i, n[0] = (c * b - l * w + u * et) * i, n[1] = (l * p - h * b - u * ft) * i, n[2] = (h * w - c * p + u * ut) * i, n[3] = (s * w - o * b - r * et) * i, n[4] = (e * b - s * p + r * ft) * i, n[5] = (o * p - e * w - r * ut) * i, n[6] = (v * rt - y * it + f * ht) * i, n[7] = (y * tt - a * rt - f * st) * i, n[8] = (a * it - v * tt + f * ot) * i, n) : null
            };
            e.str = function(n) {
                return "mat3(" + n[0] + ", " + n[1] + ", " + n[2] + ", " + n[3] + ", " + n[4] + ", " + n[5] + ", " + n[6] + ", " + n[7] + ", " + n[8] + ")"
            };
            typeof n != "undefined" && (n.mat3 = e);
            f = {};
            f.create = function() {
                var n = new o(16);
                return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = 1, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = 1, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n
            };
            f.clone = function(n) {
                var t = new o(16);
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], t[9] = n[9], t[10] = n[10], t[11] = n[11], t[12] = n[12], t[13] = n[13], t[14] = n[14], t[15] = n[15], t
            };
            f.copy = function(n, t) {
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n[4] = t[4], n[5] = t[5], n[6] = t[6], n[7] = t[7], n[8] = t[8], n[9] = t[9], n[10] = t[10], n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n
            };
            f.identity = function(n) {
                return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = 1, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = 1, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n
            };
            f.transpose = function(n, t) {
                if (n === t) {
                    var i = t[1],
                        r = t[2],
                        u = t[3],
                        f = t[6],
                        e = t[7],
                        o = t[11];
                    n[1] = t[4];
                    n[2] = t[8];
                    n[3] = t[12];
                    n[4] = i;
                    n[6] = t[9];
                    n[7] = t[13];
                    n[8] = r;
                    n[9] = f;
                    n[11] = t[14];
                    n[12] = u;
                    n[13] = e;
                    n[14] = o
                } else n[0] = t[0], n[1] = t[4], n[2] = t[8], n[3] = t[12], n[4] = t[1], n[5] = t[5], n[6] = t[9], n[7] = t[13], n[8] = t[2], n[9] = t[6], n[10] = t[10], n[11] = t[14], n[12] = t[3], n[13] = t[7], n[14] = t[11], n[15] = t[15];
                return n
            };
            f.invert = function(n, t) {
                var r = t[0],
                    u = t[1],
                    f = t[2],
                    e = t[3],
                    o = t[4],
                    s = t[5],
                    h = t[6],
                    c = t[7],
                    l = t[8],
                    a = t[9],
                    v = t[10],
                    y = t[11],
                    p = t[12],
                    w = t[13],
                    b = t[14],
                    k = t[15],
                    d = r * s - u * o,
                    g = r * h - f * o,
                    nt = r * c - e * o,
                    tt = u * h - f * s,
                    it = u * c - e * s,
                    rt = f * c - e * h,
                    ut = l * w - a * p,
                    ft = l * b - v * p,
                    et = l * k - y * p,
                    ot = a * b - v * w,
                    st = a * k - y * w,
                    ht = v * k - y * b,
                    i = d * ht - g * st + nt * ot + tt * et - it * ft + rt * ut;
                return i ? (i = 1 / i, n[0] = (s * ht - h * st + c * ot) * i, n[1] = (f * st - u * ht - e * ot) * i, n[2] = (w * rt - b * it + k * tt) * i, n[3] = (v * it - a * rt - y * tt) * i, n[4] = (h * et - o * ht - c * ft) * i, n[5] = (r * ht - f * et + e * ft) * i, n[6] = (b * nt - p * rt - k * g) * i, n[7] = (l * rt - v * nt + y * g) * i, n[8] = (o * st - s * et + c * ut) * i, n[9] = (u * et - r * st - e * ut) * i, n[10] = (p * it - w * nt + k * d) * i, n[11] = (a * nt - l * it - y * d) * i, n[12] = (s * ft - o * ot - h * ut) * i, n[13] = (r * ot - u * ft + f * ut) * i, n[14] = (w * g - p * tt - b * d) * i, n[15] = (l * tt - a * g + v * d) * i, n) : null
            };
            f.adjoint = function(n, t) {
                var y = t[0],
                    c = t[1],
                    i = t[2],
                    r = t[3],
                    p = t[4],
                    l = t[5],
                    u = t[6],
                    f = t[7],
                    w = t[8],
                    a = t[9],
                    e = t[10],
                    o = t[11],
                    b = t[12],
                    v = t[13],
                    s = t[14],
                    h = t[15];
                return n[0] = l * (e * h - o * s) - a * (u * h - f * s) + v * (u * o - f * e), n[1] = -(c * (e * h - o * s) - a * (i * h - r * s) + v * (i * o - r * e)), n[2] = c * (u * h - f * s) - l * (i * h - r * s) + v * (i * f - r * u), n[3] = -(c * (u * o - f * e) - l * (i * o - r * e) + a * (i * f - r * u)), n[4] = -(p * (e * h - o * s) - w * (u * h - f * s) + b * (u * o - f * e)), n[5] = y * (e * h - o * s) - w * (i * h - r * s) + b * (i * o - r * e), n[6] = -(y * (u * h - f * s) - p * (i * h - r * s) + b * (i * f - r * u)), n[7] = y * (u * o - f * e) - p * (i * o - r * e) + w * (i * f - r * u), n[8] = p * (a * h - o * v) - w * (l * h - f * v) + b * (l * o - f * a), n[9] = -(y * (a * h - o * v) - w * (c * h - r * v) + b * (c * o - r * a)), n[10] = y * (l * h - f * v) - p * (c * h - r * v) + b * (c * f - r * l), n[11] = -(y * (l * o - f * a) - p * (c * o - r * a) + w * (c * f - r * l)), n[12] = -(p * (a * s - e * v) - w * (l * s - u * v) + b * (l * e - u * a)), n[13] = y * (a * s - e * v) - w * (c * s - i * v) + b * (c * e - i * a), n[14] = -(y * (l * s - u * v) - p * (c * s - i * v) + b * (c * u - i * l)), n[15] = y * (l * e - u * a) - p * (c * e - i * a) + w * (c * u - i * l), n
            };
            f.determinant = function(n) {
                var t = n[0],
                    i = n[1],
                    r = n[2],
                    u = n[3],
                    f = n[4],
                    e = n[5],
                    o = n[6],
                    s = n[7],
                    h = n[8],
                    c = n[9],
                    l = n[10],
                    a = n[11],
                    v = n[12],
                    y = n[13],
                    p = n[14],
                    w = n[15],
                    b = t * e - i * f,
                    k = t * o - r * f,
                    d = t * s - u * f,
                    g = i * o - r * e,
                    nt = i * s - u * e,
                    tt = r * s - u * o,
                    it = h * y - c * v,
                    rt = h * p - l * v,
                    ut = h * w - a * v,
                    ft = c * p - l * y,
                    et = c * w - a * y,
                    ot = l * w - a * p;
                return b * ot - k * et + d * ft + g * ut - nt * rt + tt * it
            };
            f.multiply = function(n, t, i) {
                var o = t[0],
                    s = t[1],
                    h = t[2],
                    c = t[3],
                    l = t[4],
                    a = t[5],
                    v = t[6],
                    y = t[7],
                    p = t[8],
                    w = t[9],
                    b = t[10],
                    k = t[11],
                    d = t[12],
                    g = t[13],
                    nt = t[14],
                    tt = t[15],
                    r = i[0],
                    u = i[1],
                    f = i[2],
                    e = i[3];
                return n[0] = r * o + u * l + f * p + e * d, n[1] = r * s + u * a + f * w + e * g, n[2] = r * h + u * v + f * b + e * nt, n[3] = r * c + u * y + f * k + e * tt, r = i[4], u = i[5], f = i[6], e = i[7], n[4] = r * o + u * l + f * p + e * d, n[5] = r * s + u * a + f * w + e * g, n[6] = r * h + u * v + f * b + e * nt, n[7] = r * c + u * y + f * k + e * tt, r = i[8], u = i[9], f = i[10], e = i[11], n[8] = r * o + u * l + f * p + e * d, n[9] = r * s + u * a + f * w + e * g, n[10] = r * h + u * v + f * b + e * nt, n[11] = r * c + u * y + f * k + e * tt, r = i[12], u = i[13], f = i[14], e = i[15], n[12] = r * o + u * l + f * p + e * d, n[13] = r * s + u * a + f * w + e * g, n[14] = r * h + u * v + f * b + e * nt, n[15] = r * c + u * y + f * k + e * tt, n
            };
            f.mul = f.multiply;
            f.translate = function(n, t, i) {
                var o = i[0],
                    s = i[1],
                    h = i[2],
                    c, l, a, r, v, y, p, u, w, b, k, f, d, g, nt, e;
                return c = t[0], l = t[1], a = t[2], r = t[3], v = t[4], y = t[5], p = t[6], u = t[7], w = t[8], b = t[9], k = t[10], f = t[11], d = t[12], g = t[13], nt = t[14], e = t[15], n[0] = c + r * o, n[1] = l + r * s, n[2] = a + r * h, n[3] = r, n[4] = v + u * o, n[5] = y + u * s, n[6] = p + u * h, n[7] = u, n[8] = w + f * o, n[9] = b + f * s, n[10] = k + f * h, n[11] = f, n[12] = d + e * o, n[13] = g + e * s, n[14] = nt + e * h, n[15] = e, n
            };
            f.scale = function(n, t, i) {
                var r = i[0],
                    u = i[1],
                    f = i[2];
                return n[0] = t[0] * r, n[1] = t[1] * r, n[2] = t[2] * r, n[3] = t[3] * r, n[4] = t[4] * u, n[5] = t[5] * u, n[6] = t[6] * u, n[7] = t[7] * u, n[8] = t[8] * f, n[9] = t[9] * f, n[10] = t[10] * f, n[11] = t[11] * f, n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n
            };
            f.rotate = function(n, t, i, r) {
                var u = r[0],
                    f = r[1],
                    e = r[2],
                    h = Math.sqrt(u * u + f * f + e * e),
                    s, c, o, nt, tt, it, rt, ut, ft, et, ot, st, ht, ct, lt, a, v, y, p, w, b, k, d, g;
                return Math.abs(h) < l ? null : (h = 1 / h, u *= h, f *= h, e *= h, s = Math.sin(i), c = Math.cos(i), o = 1 - c, nt = t[0], tt = t[1], it = t[2], rt = t[3], ut = t[4], ft = t[5], et = t[6], ot = t[7], st = t[8], ht = t[9], ct = t[10], lt = t[11], a = u * u * o + c, v = f * u * o + e * s, y = e * u * o - f * s, p = u * f * o - e * s, w = f * f * o + c, b = e * f * o + u * s, k = u * e * o + f * s, d = f * e * o - u * s, g = e * e * o + c, n[0] = nt * a + ut * v + st * y, n[1] = tt * a + ft * v + ht * y, n[2] = it * a + et * v + ct * y, n[3] = rt * a + ot * v + lt * y, n[4] = nt * p + ut * w + st * b, n[5] = tt * p + ft * w + ht * b, n[6] = it * p + et * w + ct * b, n[7] = rt * p + ot * w + lt * b, n[8] = nt * k + ut * d + st * g, n[9] = tt * k + ft * d + ht * g, n[10] = it * k + et * d + ct * g, n[11] = rt * k + ot * d + lt * g, t !== n && (n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15]), n)
            };
            f.rotateX = function(n, t, i) {
                var r = Math.sin(i),
                    u = Math.cos(i),
                    f = t[4],
                    e = t[5],
                    o = t[6],
                    s = t[7],
                    h = t[8],
                    c = t[9],
                    l = t[10],
                    a = t[11];
                return t !== n && (n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15]), n[4] = f * u + h * r, n[5] = e * u + c * r, n[6] = o * u + l * r, n[7] = s * u + a * r, n[8] = h * u - f * r, n[9] = c * u - e * r, n[10] = l * u - o * r, n[11] = a * u - s * r, n
            };
            f.rotateY = function(n, t, i) {
                var r = Math.sin(i),
                    u = Math.cos(i),
                    f = t[0],
                    e = t[1],
                    o = t[2],
                    s = t[3],
                    h = t[8],
                    c = t[9],
                    l = t[10],
                    a = t[11];
                return t !== n && (n[4] = t[4], n[5] = t[5], n[6] = t[6], n[7] = t[7], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15]), n[0] = f * u - h * r, n[1] = e * u - c * r, n[2] = o * u - l * r, n[3] = s * u - a * r, n[8] = f * r + h * u, n[9] = e * r + c * u, n[10] = o * r + l * u, n[11] = s * r + a * u, n
            };
            f.rotateZ = function(n, t, i) {
                var r = Math.sin(i),
                    u = Math.cos(i),
                    f = t[0],
                    e = t[1],
                    o = t[2],
                    s = t[3],
                    h = t[4],
                    c = t[5],
                    l = t[6],
                    a = t[7];
                return t !== n && (n[8] = t[8], n[9] = t[9], n[10] = t[10], n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15]), n[0] = f * u + h * r, n[1] = e * u + c * r, n[2] = o * u + l * r, n[3] = s * u + a * r, n[4] = h * u - f * r, n[5] = c * u - e * r, n[6] = l * u - o * r, n[7] = a * u - s * r, n
            };
            f.fromRotationTranslation = function(n, t, i) {
                var r = t[0],
                    u = t[1],
                    e = t[2],
                    o = t[3],
                    h = r + r,
                    s = u + u,
                    f = e + e,
                    c = r * h,
                    l = r * s,
                    a = r * f,
                    v = u * s,
                    y = u * f,
                    p = e * f,
                    w = o * h,
                    b = o * s,
                    k = o * f;
                return n[0] = 1 - (v + p), n[1] = l + k, n[2] = a - b, n[3] = 0, n[4] = l - k, n[5] = 1 - (c + p), n[6] = y + w, n[7] = 0, n[8] = a + b, n[9] = y - w, n[10] = 1 - (c + v), n[11] = 0, n[12] = i[0], n[13] = i[1], n[14] = i[2], n[15] = 1, n
            };
            f.fromQuat = function(n, t) {
                var f = t[0],
                    r = t[1],
                    i = t[2],
                    e = t[3],
                    u = f + f,
                    o = r + r,
                    s = i + i,
                    h = f * u,
                    c = r * u,
                    l = r * o,
                    a = i * u,
                    v = i * o,
                    y = i * s,
                    p = e * u,
                    w = e * o,
                    b = e * s;
                return n[0] = 1 - l - y, n[1] = c + b, n[2] = a - w, n[3] = 0, n[4] = c - b, n[5] = 1 - h - y, n[6] = v + p, n[7] = 0, n[8] = a + w, n[9] = v - p, n[10] = 1 - h - l, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n
            };
            f.frustum = function(n, t, i, r, u, f, e) {
                var o = 1 / (i - t),
                    s = 1 / (u - r),
                    h = 1 / (f - e);
                return n[0] = f * 2 * o, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = f * 2 * s, n[6] = 0, n[7] = 0, n[8] = (i + t) * o, n[9] = (u + r) * s, n[10] = (e + f) * h, n[11] = -1, n[12] = 0, n[13] = 0, n[14] = e * f * 2 * h, n[15] = 0, n
            };
            f.perspective = function(n, t, i, r, u) {
                var f = 1 / Math.tan(t / 2),
                    e = 1 / (r - u);
                return n[0] = f / i, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = f, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = (u + r) * e, n[11] = -1, n[12] = 0, n[13] = 0, n[14] = 2 * u * r * e, n[15] = 0, n
            };
            f.ortho = function(n, t, i, r, u, f, e) {
                var o = 1 / (t - i),
                    s = 1 / (r - u),
                    h = 1 / (f - e);
                return n[0] = -2 * o, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = -2 * s, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = 2 * h, n[11] = 0, n[12] = (t + i) * o, n[13] = (u + r) * s, n[14] = (e + f) * h, n[15] = 1, n
            };
            f.lookAt = function(n, t, i, r) {
                var h, c, a, v, y, p, e, o, s, u, w = t[0],
                    b = t[1],
                    k = t[2],
                    d = r[0],
                    g = r[1],
                    nt = r[2],
                    tt = i[0],
                    it = i[1],
                    rt = i[2];
                return Math.abs(w - tt) < l && Math.abs(b - it) < l && Math.abs(k - rt) < l ? f.identity(n) : (e = w - tt, o = b - it, s = k - rt, u = 1 / Math.sqrt(e * e + o * o + s * s), e *= u, o *= u, s *= u, h = g * s - nt * o, c = nt * e - d * s, a = d * o - g * e, u = Math.sqrt(h * h + c * c + a * a), u ? (u = 1 / u, h *= u, c *= u, a *= u) : (h = 0, c = 0, a = 0), v = o * a - s * c, y = s * h - e * a, p = e * c - o * h, u = Math.sqrt(v * v + y * y + p * p), u ? (u = 1 / u, v *= u, y *= u, p *= u) : (v = 0, y = 0, p = 0), n[0] = h, n[1] = v, n[2] = e, n[3] = 0, n[4] = c, n[5] = y, n[6] = o, n[7] = 0, n[8] = a, n[9] = p, n[10] = s, n[11] = 0, n[12] = -(h * w + c * b + a * k), n[13] = -(v * w + y * b + p * k), n[14] = -(e * w + o * b + s * k), n[15] = 1, n)
            };
            f.str = function(n) {
                return "mat4(" + n[0] + ", " + n[1] + ", " + n[2] + ", " + n[3] + ", " + n[4] + ", " + n[5] + ", " + n[6] + ", " + n[7] + ", " + n[8] + ", " + n[9] + ", " + n[10] + ", " + n[11] + ", " + n[12] + ", " + n[13] + ", " + n[14] + ", " + n[15] + ")"
            };
            typeof n != "undefined" && (n.mat4 = f);
            u = {};
            u.create = function() {
                var n = new o(4);
                return n[0] = 0, n[1] = 0, n[2] = 0, n[3] = 1, n
            };
            u.rotationTo = function() {
                var n = i.create(),
                    t = i.fromValues(1, 0, 0),
                    r = i.fromValues(0, 1, 0);
                return function(f, e, o) {
                    var s = i.dot(e, o);
                    return s < -.999999 ? (i.cross(n, t, e), i.length(n) < 1e-6 && i.cross(n, r, e), i.normalize(n, n), u.setAxisAngle(f, n, Math.PI), f) : s > .999999 ? (f[0] = 0, f[1] = 0, f[2] = 0, f[3] = 1, f) : (i.cross(n, e, o), f[0] = n[0], f[1] = n[1], f[2] = n[2], f[3] = 1 + s, u.normalize(f, f))
                }
            }();
            u.setAxes = function() {
                var n = e.create();
                return function(t, i, r, f) {
                    return n[0] = r[0], n[3] = r[1], n[6] = r[2], n[1] = f[0], n[4] = f[1], n[7] = f[2], n[2] = -i[0], n[5] = -i[1], n[8] = -i[2], u.normalize(t, u.fromMat3(t, n))
                }
            }();
            u.clone = t.clone;
            u.fromValues = t.fromValues;
            u.copy = t.copy;
            u.set = t.set;
            u.identity = function(n) {
                return n[0] = 0, n[1] = 0, n[2] = 0, n[3] = 1, n
            };
            u.setAxisAngle = function(n, t, i) {
                i = i * .5;
                var r = Math.sin(i);
                return n[0] = r * t[0], n[1] = r * t[1], n[2] = r * t[2], n[3] = Math.cos(i), n
            };
            u.add = t.add;
            u.multiply = function(n, t, i) {
                var r = t[0],
                    u = t[1],
                    f = t[2],
                    e = t[3],
                    o = i[0],
                    s = i[1],
                    h = i[2],
                    c = i[3];
                return n[0] = r * c + e * o + u * h - f * s, n[1] = u * c + e * s + f * o - r * h, n[2] = f * c + e * h + r * s - u * o, n[3] = e * c - r * o - u * s - f * h, n
            };
            u.mul = u.multiply;
            u.scale = t.scale;
            u.rotateX = function(n, t, i) {
                i *= .5;
                var f = t[0],
                    e = t[1],
                    o = t[2],
                    s = t[3],
                    r = Math.sin(i),
                    u = Math.cos(i);
                return n[0] = f * u + s * r, n[1] = e * u + o * r, n[2] = o * u - e * r, n[3] = s * u - f * r, n
            };
            u.rotateY = function(n, t, i) {
                i *= .5;
                var f = t[0],
                    e = t[1],
                    o = t[2],
                    s = t[3],
                    r = Math.sin(i),
                    u = Math.cos(i);
                return n[0] = f * u - o * r, n[1] = e * u + s * r, n[2] = o * u + f * r, n[3] = s * u - e * r, n
            };
            u.rotateZ = function(n, t, i) {
                i *= .5;
                var f = t[0],
                    e = t[1],
                    o = t[2],
                    s = t[3],
                    r = Math.sin(i),
                    u = Math.cos(i);
                return n[0] = f * u + e * r, n[1] = e * u - f * r, n[2] = o * u + s * r, n[3] = s * u - o * r, n
            };
            u.calculateW = function(n, t) {
                var i = t[0],
                    r = t[1],
                    u = t[2];
                return n[0] = i, n[1] = r, n[2] = u, n[3] = -Math.sqrt(Math.abs(1 - i * i - r * r - u * u)), n
            };
            u.dot = t.dot;
            u.lerp = t.lerp;
            u.slerp = function(n, t, i, r) {
                var v = t[0],
                    y = t[1],
                    p = t[2],
                    w = t[3],
                    o = i[0],
                    s = i[1],
                    h = i[2],
                    c = i[3],
                    l, u, a, f, e;
                return u = v * o + y * s + p * h + w * c, u < 0 && (u = -u, o = -o, s = -s, h = -h, c = -c), 1 - u > 1e-6 ? (l = Math.acos(u), a = Math.sin(l), f = Math.sin((1 - r) * l) / a, e = Math.sin(r * l) / a) : (f = 1 - r, e = r), n[0] = f * v + e * o, n[1] = f * y + e * s, n[2] = f * p + e * h, n[3] = f * w + e * c, n
            };
            u.invert = function(n, t) {
                var r = t[0],
                    u = t[1],
                    f = t[2],
                    e = t[3],
                    o = r * r + u * u + f * f + e * e,
                    i = o ? 1 / o : 0;
                return n[0] = -r * i, n[1] = -u * i, n[2] = -f * i, n[3] = e * i, n
            };
            u.conjugate = function(n, t) {
                return n[0] = -t[0], n[1] = -t[1], n[2] = -t[2], n[3] = t[3], n
            };
            u.length = t.length;
            u.len = u.length;
            u.squaredLength = t.squaredLength;
            u.sqrLen = u.squaredLength;
            u.normalize = t.normalize;
            u.fromMat3 = function(n, t) {
                var e = t[0] + t[4] + t[8],
                    i, r, u, f;
                return e > 0 ? (i = Math.sqrt(e + 1), n[3] = .5 * i, i = .5 / i, n[0] = (t[7] - t[5]) * i, n[1] = (t[2] - t[6]) * i, n[2] = (t[3] - t[1]) * i) : (r = 0, t[4] > t[0] && (r = 1), t[8] > t[r * 3 + r] && (r = 2), u = (r + 1) % 3, f = (r + 2) % 3, i = Math.sqrt(t[r * 3 + r] - t[u * 3 + u] - t[f * 3 + f] + 1), n[r] = .5 * i, i = .5 / i, n[3] = (t[f * 3 + u] - t[u * 3 + f]) * i, n[u] = (t[u * 3 + r] + t[r * 3 + u]) * i, n[f] = (t[f * 3 + r] + t[r * 3 + f]) * i), n
            };
            u.str = function(n) {
                return "quat(" + n[0] + ", " + n[1] + ", " + n[2] + ", " + n[3] + ")"
            };
            typeof n != "undefined" && (n.quat = u)
        }(t.exports)
})(this);
Spasm = Spasm || {};
Spasm.Deg2Rad = Math.PI / 180;
Spasm.Rad2Deg = 180 / Math.PI;
Spasm = Spasm || {};
Spasm.Animation = function(n, t) {
    Spasm.assertPath(n);
    Spasm.assertFunction(t);
    this.animationPath = n;
    this.callback = t;
    this.loadComplete = !1;
    this.loadSuccess = !1;
    var i = this,
        r = function(n) {
            i.onLoadAnimation(n)
        };
    this.animation = null;
    this.animationLoader = new Spasm.JSONLoader(n, r);
    this.frameCount = 0;
    this.nodeCount = 0;
    this.framesMatrices = null;
    this.animationMatrices = null;
    this.tempMatrix0 = mat4.create()
};
Spasm.Animation.prototype = {};
Spasm.Animation.prototype.frameFillTransformBuffer = function(n, t, i, r) {
    var c, u, a;
    Spasm.assertNumber(n);
    Spasm.assertInstance(t, Float32Array);
    Spasm.assertArrayInstances(i, Float32Array);
    n = Math.floor(n);
    var v = this.framesMatrices,
        h = this.animationMatrices,
        f = this.tempMatrix0,
        y = this.frameCount,
        e = this.nodeCount,
        p = i.length,
        w = t.length;
    for (Spasm.assert(n >= 0), Spasm.assert(n < y), Spasm.assert(w === e * 12), Spasm.assertEqual(e, p), c = v[n], u = 0; u < e; u++) {
        var l = c[u],
            o = h[u],
            b = i[u],
            s = r[u];
        s >= 0 ? (Spasm.assert(s < u), a = h[s], mat4.multiply(o, a, l)) : mat4.copy(o, l);
        mat4.multiply(f, o, b);
        mat4.transpose(f, f);
        t.set(f.subarray(0, 12), u * 12)
    }
};
Spasm.Animation.prototype.onLoadAnimationSuccess = function(n) {
    var a, f, t, tt, h, c, l, it;
    Spasm.assertArray(n);
    this.loadSuccess = !0;
    a = n.length;
    Spasm.assert(a > 0);
    var i = n[0],
        e = i.node_count,
        v = i.frame_count,
        r = i.static_bone_data,
        rt = r.scale_control_map,
        ut = r.rotation_control_map,
        ft = r.translation_control_map,
        o = r.transform_stream_header.streams.frames[0],
        et = o.scales,
        ot = o.rotations,
        st = o.translations,
        u = i.animated_bone_data,
        ht = u.scale_control_map,
        ct = u.rotation_control_map,
        lt = u.translation_control_map,
        at = u.transform_stream_header.streams.frames,
        y = [];
    for (f = 0; f < v; f++) {
        var p = [],
            s = at[f],
            vt = s.scales,
            yt = s.rotations,
            pt = s.translations;
        for (t = 0; t < e; t++) {
            var w = rt.indexOf(t),
                b = ut.indexOf(t),
                k = ft.indexOf(t),
                wt = ht.indexOf(t),
                bt = ct.indexOf(t),
                kt = lt.indexOf(t),
                d = w >= 0 ? et[w] : vt[wt],
                g = b >= 0 ? ot[b] : yt[bt],
                nt = k >= 0 ? st[k] : pt[kt];
            Spasm.assertValid(d);
            Spasm.assertValid(g);
            Spasm.assertValid(nt);
            tt = new Spasm.TransformSRT(d, g, nt);
            h = mat4.create();
            tt.setMatrix(h);
            p.push(h)
        }
        y.push(p)
    }
    for (this.nodeCount = e, this.frameCount = v, this.framesMatrices = y, c = [], l = 0; l < e; l++) it = mat4.create(), c.push(it);
    this.animationMatrices = c;
    this.callback && (this.callback(this, !0), this.callback = null)
};
Spasm.Animation.prototype.onLoadAnimationFailure = function() {
    this.loadSuccess = !1;
    this.callback && (this.callback(this, !1), this.callback = null)
};
Spasm.Animation.prototype.onLoadAnimation = function(n) {
    if (Spasm.assertInstance(n, Spasm.JSONLoader), this.loadComplete = !0, n.isCompleteAndOK()) {
        var t = n.parsedResponse;
        this.onLoadAnimationSuccess(t)
    } else this.onLoadAnimationFailure()
};
Spasm = Spasm || {};
Spasm.assert = function(n, t) {
    if (!n) throw t || "assertion failed";
};
Spasm.assertFalse = function(n, t) {
    Spasm.assert(!n, t)
};
Spasm.assertDefined = function(n, t) {
    Spasm.assert(typeof n != "undefined", t)
};
Spasm.assertNotNull = function(n, t) {
    Spasm.assert(n !== null, t)
};
Spasm.assertValid = function(n, t) {
    Spasm.assertDefined(n, t);
    Spasm.assertNotNull(n, t)
};
Spasm.assertEqual = function(n, t, i) {
    Spasm.assert(n === t, i)
};
Spasm.assertType = function(n, t, i) {
    Spasm.assert(typeof n === t, i)
};
Spasm.isArray = function(n) {
    return Object.prototype.toString.call(n) === "[object Array]"
};
Spasm.assertInstance = function(n, t, i) {
    Spasm.assertValid(n, i);
    Spasm.assert(n instanceof t, i)
};
Spasm.assertArray = function(n, t) {
    Spasm.assertValid(n, t);
    Spasm.assert(Spasm.isArray(n), t)
};
Spasm.assertArrayBuffer = function(n, t) {
    Spasm.assertInstance(n, ArrayBuffer, t)
};
Spasm.assertWebGLContext = function(n, t) {
    window.gli ? Spasm.assertValid(n, t) : Spasm.assertInstance(n, WebGLRenderingContext, t)
};
Spasm.assertCanvas = function(n, t) {
    Spasm.assertValid(n, t);
    Spasm.assert(n.tagName === "CANVAS")
};
Spasm.assertDOMEvent = function(n) {
    Spasm.assertValid(n)
};
Spasm.assertFunction = function(n, t) {
    Spasm.assertValid(n, t);
    Spasm.assertType(n, "function", t)
};
Spasm.assertNumber = function(n, t) {
    Spasm.assertValid(n, t);
    Spasm.assertType(n, "number", t)
};
Spasm.assertInteger = function(n, t) {
    Spasm.assertNumber(n, t);
    Spasm.assert(n % 1 == 0, t)
};
Spasm.assertBoolean = function(n, t) {
    Spasm.assertValid(n, t);
    Spasm.assertType(n, "boolean", t)
};
Spasm.assertString = function(n, t) {
    Spasm.assertValid(n, t);
    Spasm.assertType(n, "string", t)
};
Spasm.assertStringArray = function(n, t) {
    var r, i, u;
    for (Spasm.assertArray(n, t), r = n.length, i = 0; i < r; i++) u = n[i], Spasm.assertString(u, t)
};
Spasm.assertPath = function(n, t) {
    Spasm.assertString(n, t)
};
Spasm.assertImage = function(n, t) {
    Spasm.assertValid(n, t)
};
Spasm.assertShaderUniform = function(n, t) {
    Spasm.assertInstance(n, WebGLUniformLocation, t)
};
Spasm.assertArrayInstances = function(n, t, i) {
    var u, r, f;
    for (Spasm.assertArray(n, i), u = n.length, r = 0; r < u; r++) f = n[r], Spasm.assertInstance(f, t, i)
};
Spasm.assertCollectionInstances = function(n, t, i) {
    var r, u;
    Spasm.assertValid(n, i);
    for (r in n) u = n[r], Spasm.assertInstance(u, t, i)
};
Spasm.assert(!0);
Spasm.assertFalse(!1);
Spasm.assertValid({});
Spasm.assertString("");
Spasm.assertArray([]);
Spasm.assertEqual(2, 2);
Spasm.assertInteger(12345678901234567890);
Spasm.assertNumber(0, "zero is a number");
Spasm.assertBoolean(!1, "false is a boolean");
Spasm = Spasm || {};
Spasm.BoundingVolume = function(n, t, i) {
    Spasm.assertArray(n);
    Spasm.assertArray(t);
    Spasm.assertArray(i);
    this.minX = Math.min.apply(Math, n);
    this.minY = Math.min.apply(Math, t);
    this.minZ = Math.min.apply(Math, i);
    this.maxX = Math.max.apply(Math, n);
    this.maxY = Math.max.apply(Math, t);
    this.maxZ = Math.max.apply(Math, i)
};
Spasm.boundingVolumeFromRenderMetadata = function(n) {
    Spasm.assertValid(n);
    var t = n.min_x,
        i = n.min_y,
        r = n.min_z,
        u = n.max_x,
        f = n.max_y,
        e = n.max_z;
    return new Spasm.BoundingVolume([t, u], [i, f], [r, e])
};
Spasm.boundingVolumeFromBoundingVolumes = function(n) {
    var i, t;
    Spasm.assertArrayInstances(n, Spasm.BoundingVolume);
    var r = [],
        u = [],
        f = [],
        e = n.length;
    for (i = 0; i < e; i++) t = n[i], r.push(t.minX), r.push(t.maxX), u.push(t.minY), u.push(t.maxY), f.push(t.minZ), f.push(t.maxZ);
    return new Spasm.BoundingVolume(r, u, f)
};
Spasm.BoundingVolume.prototype = {};
Spasm.BoundingVolume.prototype.getMaxLength = function() {
    return Math.sqrt(Math.pow(this.maxX - this.minX, 2) + Math.pow(this.maxY - this.minY, 2) + Math.pow(this.maxZ - this.minZ, 2))
};
Spasm.BoundingVolume.prototype.getCenterPoint = function() {
    return [(this.minX + this.maxX) / 2, (this.minY + this.maxY) / 2, (this.minZ + this.maxZ) / 2]
};
Spasm = Spasm || {};
Spasm.Camera = function(n) {
    Spasm.assertCanvas(n);
    this.canvas = n;
    this.canvasSize = {
        width: n.width,
        height: n.height,
        aspectRatio: n.width / n.height
    };
    this.orientation = {
        modelTranslationHorizontal: 0,
        modelTranslationVertical: 1,
        modelTranslationDepth: 0,
        modelRotationHorizontal: 0,
        modelRotationVertical: 0,
        modelRotationZ: 0,
        viewDistance: 9,
        viewTranslationHorizontal: 0,
        viewTranslationVertical: 0
    };
    this.bounds = {
        viewTranslationMinHorizontal: -2,
        viewTranslationMinVertical: -2,
        viewTranslationMaxHorizontal: 2,
        viewTranslationMaxVertical: 2,
        modelRotationMinVertical: -85 * Spasm.Deg2Rad,
        modelRotationMaxVertical: 85 * Spasm.Deg2Rad,
        viewDistanceDefault: 9,
        viewDistanceMin: .5,
        viewDistanceMax: 20
    };
    this.dirtyFlags = {
        modelTranslation: !0,
        modelRotation: !0,
        view: !0,
        projection: !0
    };
    this.projection = {
        fieldOfView: 15 * Spasm.Deg2Rad,
        nearPlane: .1,
        farPlane: 10
    };
    this.vectors = {
        viewDirection: vec3.set(vec3.create(), 1, 0, 0),
        viewPosition: vec3.set(vec3.create(), 5, 0, 0),
        viewTarget: vec3.create(),
        viewUp: vec3.set(vec3.create(), 0, 0, 1),
        viewTranslation: vec3.create(),
        modelTranslation: vec3.create(),
        modelRotationAxis: vec3.set(vec3.create(), 1, 0, 0)
    };
    var t = Spasm.Shader.InputTypes,
        i = Spasm.Shader.ValueTypes;
    this.matrices = {
        identity: mat4.create(),
        identity34: mat4.create().subarray(0, 12),
        cameraRotation: mat4.create(),
        modelTranslation: mat4.create(),
        modelRotation: mat4.create(),
        model: mat4.create(),
        view: mat4.create(),
        projection: mat4.create()
    };
    this.uniforms = {
        modelMatrix: new Spasm.ShaderInput(t.uniform, i.mat4, "u_model_matrix"),
        viewMatrix: new Spasm.ShaderInput(t.uniform, i.mat4, "u_view_matrix"),
        projectionMatrix: new Spasm.ShaderInput(t.uniform, i.mat4, "u_projection_matrix")
    };
    this.uniformDatas = {
        modelMatrix: new Spasm.UniformData(this.uniforms.modelMatrix, this.matrices.model),
        viewMatrix: new Spasm.UniformData(this.uniforms.viewMatrix, this.matrices.view),
        projectionMatrix: new Spasm.UniformData(this.uniforms.projectionMatrix, this.matrices.projection)
    }
};
Spasm.Camera.prototype = {};
Spasm.Camera.prototype.updateCanvasSize = function() {
    var r = this.canvas,
        n = this.canvasSize,
        t = Math.abs(r.width),
        i = Math.abs(r.height);
    (t !== n.width || i !== n.height) && (n.width = t, n.height = i, n.aspectRatio = t / i, this.dirtyFlags.projection = !0)
};
Spasm.Camera.prototype.updateMatrices = function() {
    var f, r, c, l;
    this.updateCanvasSize();
    var t = this.orientation,
        i = this.dirtyFlags,
        o = this.projection,
        a = this.canvasSize,
        u = this.vectors,
        n = this.matrices;
    if (i.projection && (mat4.perspective(n.projection, o.fieldOfView, a.aspectRatio, o.nearPlane, o.farPlane), i.projection = !1), f = !1, i.modelTranslation && (vec3.set(u.modelTranslation, t.modelTranslationDepth, t.modelTranslationHorizontal, -t.modelTranslationVertical), mat4.translate(n.modelTranslation, n.identity, u.modelTranslation), f = !0, i.modelTranslation = !1), i.modelRotation && (r = n.modelRotation, mat4.identity(r), mat4.rotateY(r, r, t.modelRotationVertical), mat4.rotateZ(r, r, t.modelRotationHorizontal), mat4.rotateY(r, r, t.modelRotationZ), f = !0, i.modelRotation = !1), f && mat4.multiply(n.model, n.modelRotation, n.modelTranslation), i.view) {
        var v = u.viewDirection,
            e = u.viewPosition,
            s = u.viewTarget,
            y = u.viewUp,
            h = u.viewTranslation,
            p = t.viewDistance;
        vec3.scale(e, v, p);
        vec3.add(e, e, s);
        mat4.lookAt(n.view, e, s, y);
        c = t.viewTranslationHorizontal;
        l = t.viewTranslationVertical;
        vec3.set(h, c, -l, 0);
        mat4.translate(n.view, n.view, h);
        i.view = !1
    }
};
Spasm.Camera.prototype.updateForBoundingVolume = function(n, t, i) {
    var o, c, f, s, u;
    Spasm.assertInstance(n, Spasm.BoundingVolume);
    Spasm.assertBoolean(t);
    Spasm.assertBoolean(i);
    var l = n.getMaxLength(),
        e = n.getCenterPoint(),
        h = e[0],
        a = e[1],
        v = e[2],
        r = this.orientation;
    r.modelTranslationHorizontal = -a;
    r.modelTranslationVertical = v * .9;
    o = this.bound(l * 4.5, 4, 90);
    i ? (c = this.canvasSize.aspectRatio, r.viewDistance = o / c, r.viewTranslationHorizontal = 0, r.modelTranslationDepth = -h, r.modelRotationHorizontal = -60 * Spasm.Deg2Rad, r.modelRotationVertical = 15 * Spasm.Deg2Rad) : t ? (r.viewDistance = o, r.viewTranslationHorizontal = 0, r.modelTranslationDepth = -h, r.modelRotationHorizontal = -60 * Spasm.Deg2Rad, r.modelRotationVertical = 15 * Spasm.Deg2Rad) : (r.modelTranslationDepth = 0, r.viewTranslationVertical = 0, r.viewTranslationHorizontal = 0, r.modelRotationHorizontal = 10 * Spasm.Deg2Rad, r.modelRotationVertical = 0, r.viewDistance = 8.2);
    f = this.bounds;
    f.viewDistanceDefault = r.viewDistance;
    f.viewDistanceMin = r.viewDistance * .5;
    f.viewDistanceMax = r.viewDistance * 2;
    s = this.projection;
    s.farPlane = r.viewDistance * 3;
    s.nearPlane = r.viewDistance * .1;
    u = this.dirtyFlags;
    u.modelTranslation = !0;
    u.modelRotation = !0;
    u.view = !0;
    u.projection = !0
};
Spasm.Camera.prototype.bound = function(n, t, i) {
    Spasm.assertNumber(n);
    Spasm.assertNumber(t);
    Spasm.assertNumber(i);
    Spasm.assert(t <= i);
    return Math.max(Math.min(n, i), t)
};
Spasm.Camera.prototype.setRotationZDegrees = function(n) {
    Spasm.assertNumber(n, "Spasm.Camera.setRotationZDegrees: input is not a number" + n);
    var t = this.orientation;
    t.modelRotationZ = n * Spasm.Deg2Rad
};
Spasm.Camera.prototype.userRotate = function(n, t) {
    Spasm.assertNumber(n);
    Spasm.assertNumber(t);
    var i = this.orientation,
        r = this.bounds,
        u = this.dirtyFlags;
    i.modelRotationHorizontal += n * .01;
    i.modelRotationVertical += t * .01;
    i.modelRotationVertical = this.bound(i.modelRotationVertical, r.modelRotationMinVertical, r.modelRotationMaxVertical);
    u.modelRotation = !0
};
Spasm.Camera.prototype.userTranslate = function(n, t) {
    Spasm.assertNumber(n);
    Spasm.assertNumber(t);
    var i = this.orientation,
        r = this.bounds,
        u = this.dirtyFlags;
    i.viewTranslationHorizontal += n * .005;
    i.viewTranslationVertical += t * .005;
    i.viewTranslationHorizontal = this.bound(i.viewTranslationHorizontal, r.viewTranslationMinHorizontal, r.viewTranslationMaxHorizontal);
    i.viewTranslationVertical = this.bound(i.viewTranslationVertical, r.viewTranslationMinVertical, r.viewTranslationMaxVertical);
    u.modelTranslation = !0
};
Spasm.Camera.prototype.userZoom = function(n) {
    Spasm.assertNumber(n);
    var t = this.orientation,
        i = this.bounds,
        r = this.dirtyFlags;
    t.viewDistance += n * -.001;
    t.viewDistance = this.bound(t.viewDistance, i.viewDistanceMin, i.viewDistanceMax);
    r.view = !0
};
Spasm.Camera.prototype.isDirty = function() {
    for (var t = this.dirtyFlags, i = Object.keys(t), f = i.length, r = !1, u, n = 0; n < f; n++) u = i[n], t[u] && (r = !0);
    return r
};
Spasm.Camera.prototype.resetZoom = function() {
    var n = this.orientation,
        t = this.bounds,
        i = this.dirtyFlags;
    n.viewDistance = t.viewDistanceDefault;
    i.view = !0
};
Spasm = Spasm || {};
Spasm.CameraControls = function(n, t) {
    Spasm.assertValid(n, "invalid element");
    Spasm.assertInstance(t, Spasm.Camera);
    this.element = n;
    this.camera = t;
    this.allowRotationHorizontal = !0;
    this.allowRotationVertical = !1;
    this.allowTranslation = !1;
    this.allowZoom = !1;
    this.mouse = {
        tracking: !1,
        oldX: 0,
        oldY: 0
    };
    this.touch = {
        tracking: !1,
        count: 0,
        oldX: 0,
        oldY: 0
    };
    this.staticElementEventNames = ["mousedown", "touchstart", "mousewheel", "DOMMouseScroll"];
    this.staticWindowEventNames = ["mouseup", "touchend", "touchcancel"];
    var i = this;
    this.eventListenerFunctions = {
        mousedown: function(n) {
            i.onMouseDown(n)
        },
        mousemove: function(n) {
            i.onMouseMove(n)
        },
        mouseup: function(n) {
            i.onMouseUp(n)
        },
        mouseout: function(n) {
            i.onMouseOut(n)
        },
        mousewheel: function(n) {
            i.onScroll(n)
        },
        DOMMouseScroll: function(n) {
            i.onScroll(n)
        },
        touchstart: function(n) {
            i.onTouchStart(n)
        },
        touchmove: function(n) {
            i.onTouchMove(n)
        },
        touchend: function(n) {
            i.onTouchEnd(n)
        },
        touchenter: function(n) {
            i.onTouchEnter(n)
        },
        touchleave: function(n) {
            i.onTouchLeave(n)
        },
        touchcancel: function(n) {
            i.onTouchCancel(n)
        }
    };
    this.addStaticElementEventListeners();
    this.addStaticWindowEventListeners()
};
Spasm.CameraControls.prototype = {};
Spasm.CameraControls.prototype.addStaticElementEventListeners = function() {
    for (var u = this.element, f = this.eventListenerFunctions, i = this.staticElementEventNames, e = i.length, t, r, n = 0; n < e; n++) t = i[n], r = f[t], u.addEventListener(t, r, !1)
};
Spasm.CameraControls.prototype.addStaticWindowEventListeners = function() {
    for (var u = this.eventListenerFunctions, i = this.staticWindowEventNames, f = i.length, t, r, n = 0; n < f; n++) t = i[n], r = u[t], window.addEventListener(t, r, !1)
};
Spasm.CameraControls.prototype.onMouseDown = function(n) {
    Spasm.assertDOMEvent(n);
    var t = this.mouse;
    t.tracking = !0;
    t.oldX = n.clientX;
    t.oldY = n.clientY;
    n.preventDefault();
    window.addEventListener("mousemove", this.eventListenerFunctions.mousemove, !1)
};
Spasm.CameraControls.prototype.onMouseMove = function(n) {
    var t, i;
    if (Spasm.assertDOMEvent(n), t = this.mouse, i = this.camera, t.tracking) {
        var r = n.clientX,
            u = n.clientY,
            o = t.oldX,
            s = t.oldY,
            f = r - o,
            e = u - s;
        n.shiftKey && this.allowTranslation ? i.userTranslate(f, e) : this.rotate(f, e);
        t.oldX = r;
        t.oldY = u;
        n.preventDefault()
    }
};
Spasm.CameraControls.prototype.onMouseUp = function(n) {
    Spasm.assertDOMEvent(n);
    this.mouse.tracking = !1;
    window.removeEventListener("mousemove", this.eventListenerFunctions.mousemove, !1)
};
Spasm.CameraControls.prototype.onMouseOut = function(n) {
    Spasm.assertDOMEvent(n)
};
Spasm.CameraControls.prototype.onScroll = function(n) {
    var t, i;
    Spasm.assertDOMEvent(n);
    this.allowZoom && (t = 0, n.wheelDelta ? t = n.wheelDelta : n.detail && (t = n.detail * -40), i = this.camera, i.userZoom(t), n.preventDefault())
};
Spasm.CameraControls.prototype.onTouchStart = function(n) {
    var t;
    if (Spasm.assertDOMEvent(n), t = n.touches, t && t.length === 1) {
        var r = t[0],
            u = r.clientX,
            f = r.clientY,
            i = this.touch;
        i.tracking = !0;
        i.oldX = u;
        i.oldY = f;
        window.addEventListener("touchmove", this.eventListenerFunctions.touchmove, !1)
    }
};
Spasm.CameraControls.prototype.onTouchMove = function(n) {
    var t, i;
    if (Spasm.assertDOMEvent(n), t = this.touch, i = n.touches, t.tracking && i && i.length > 0) {
        var r = i[0],
            u = r.clientX,
            f = r.clientY,
            e = u - t.oldX,
            o = f - t.oldY;
        i.length === 1 && this.rotate(e, o);
        t.oldX = u;
        t.oldY = f;
        n.preventDefault()
    }
};
Spasm.CameraControls.prototype.onTouchEnd = function(n) {
    var t, i;
    Spasm.assertDOMEvent(n);
    t = n.touches;
    (!t || t.length <= 1) && (i = this.touch, i.tracking = !1, window.removeEventListener("touchmove", this.eventListenerFunctions.touchmove, !1))
};
Spasm.CameraControls.prototype.onTouchEnter = function(n) {
    Spasm.assertDOMEvent(n)
};
Spasm.CameraControls.prototype.onTouchLeave = function(n) {
    Spasm.assertDOMEvent(n)
};
Spasm.CameraControls.prototype.onTouchCancel = function(n) {
    var t, i;
    Spasm.assertDOMEvent(n);
    t = n.touches;
    (!t || t.length <= 1) && (i = this.touch, i.tracking = !1, window.removeEventListener("touchmove", this.eventListenerFunctions.touchmove, !1))
};
Spasm.CameraControls.prototype.rotate = function(n, t) {
    if (Spasm.assertNumber(n), Spasm.assertNumber(t), this.allowRotationHorizontal || this.allowRotationVertical) {
        var i = this.allowRotationHorizontal ? n : 0,
            r = this.allowRotationVertical ? t : 0;
        this.camera.userRotate(i, r)
    }
};
Spasm = Spasm || {};
Spasm.CameraPresets = function(n) {
    this.buckets = n;
    this.inventoryPresets = {}
};
Spasm.CameraPresets.prototype = {};
Spasm.CameraPresets.prototype.init = function() {
    this.setInventoryBuckets()
};
Spasm.CameraPresets.prototype.setInventoryBuckets = function() {
    var t, n, i;
    for (t in this.buckets)
        if (n = this.buckets[t], bucketDefinition = n.definition) {
            i = bucketDefinition.bucketIdentifier;
            switch (i) {
                case "BUCKET_PRIMARY_WEAPON":
                case "BUCKET_SPECIAL_WEAPON":
                case "BUCKET_HEAVY_WEAPON":
                case "BUCKET_HEAD":
                case "BUCKET_ARMS":
                case "BUCKET_CHEST":
                case "BUCKET_CLASS_ITEMS":
                case "BUCKET_LEGS":
                case "BUCKET_SHIP":
                    this.setInventoryPresets(n)
            }
        }
};
Spasm.CameraPresets.prototype.setInventoryPresets = function(n) {
    for (var r = n.items, f = r.length, i = 0; i < f; i++) {
        var e = r[i],
            u = e.itemDefinition,
            o = u.summary.itemTypeName.toLowerCase(),
            s = u.summary.referenceId,
            t = {};
        switch (o) {
            case "hand cannon":
                t = this.presetWeaponSmall();
                break;
            case "auto rifle":
            case "pulse rifle":
            case "scout rifle":
            case "fusion rifle":
            case "shotgun":
                t = this.presetWeaponMedium();
                break;
            case "machine gun":
            case "sniper rifle":
                t = this.presetWeaponLarge();
                break;
            case "rocket launcher":
                t = this.presetWeaponRocket();
                break;
            case "head armor":
                t = this.presetHeadArmor();
                break;
            case "leg armor":
                t = this.presetLegArmor();
                break;
            case "titan mark  ":
                t = this.presetCloth();
                break;
            case "hunter cloak":
                t = this.presetHunterCloth();
                break;
            case "ship":
                t = this.presetShip();
                break;
            case "warlock bond":
            default:
                t = this.presetDefault()
        }
        this.inventoryPresets[s] = t
    }
};
Spasm.CameraPresets.prototype.presetWeaponSmall = function() {
    var n = {};
    return n.modelVertical = .05, n.modelHorizontal = .2, n.cameraDistance = 1.5, n.cameraRotateHorizontal = -90 * Spasm.Deg2Rad, n
};
Spasm.CameraPresets.prototype.presetWeaponMedium = function() {
    var n = {};
    return n.modelVertical = .05, n.modelHorizontal = 0, n.cameraDistance = 2.4, n.cameraRotateVertical = 15 * Spasm.Deg2Rad, n.cameraRotateHorizontal = -90 * Spasm.Deg2Rad, n
};
Spasm.CameraPresets.prototype.presetWeaponLarge = function() {
    var n = {};
    return n.modelVertical = .05, n.modelHorizontal = .4, n.cameraDistance = 2.7, n.cameraRotateVertical = 15 * Spasm.Deg2Rad, n.cameraRotateHorizontal = -90 * Spasm.Deg2Rad, n
};
Spasm.CameraPresets.prototype.presetWeaponRocket = function() {
    var n = {};
    return n.modelVertical = .05, n.modelHorizontal = 0, n.cameraDistance = 3, n.cameraRotateVertical = 15 * Spasm.Deg2Rad, n
};
Spasm.CameraPresets.prototype.presetHeadArmor = function() {
    var n = this.presetDefault();
    return n.modelVertical = 1.7, n.modelHorizontal = 0, n.cameraDistance = 1.2, n
};
Spasm.CameraPresets.prototype.presetCloth = function() {
    var n = this.presetDefault();
    return n.modelVertical = 1, n.cameraDistance = 2.1, n
};
Spasm.CameraPresets.prototype.presetHunterCloth = function() {
    var n = this.presetDefault();
    return n.modelVertical = 1.2, n.cameraDistance = 4.8, n
};
Spasm.CameraPresets.prototype.presetLegArmor = function() {
    var n = this.presetDefault();
    return n.modelVertical = .52, n.modelHorizontal = 0, n.cameraDistance = 6, n
};
Spasm.CameraPresets.prototype.presetDefault = function() {
    var n = {};
    return n.modelVertical = 1.3, n.modelHorizontal = 0, n.cameraDistance = 3, n.cameraRotateHorizontal = -25 * Spasm.Deg2Rad, n.cameraRotateVertical = 1.5 * Spasm.Deg2Rad, n
};
Spasm.CameraPresets.prototype.presetShip = function() {
    var n = {};
    return n.modelVertical = 2.5, n.modelHorizontal = 0, n.cameraDistance = 35, n.cameraRotateHorizontal = -25 * Spasm.Deg2Rad, n.cameraRotateVertical = 20 * Spasm.Deg2Rad, n
};
Spasm = Spasm || {};
Spasm.Content = {};
Spasm.Content.setContentBaseURL = function(n) {
    Spasm.assertString(n);
    var i = n.split("?"),
        t = i[0],
        r = i.length > 1 ? i[1] : null;
    Spasm.Content.BaseURL = t;
    Spasm.Content.VersionQuery = r;
    Spasm.Content.RootPath = Spasm.Path.combine(t, "/common/destiny_content/geometry/");
    Spasm.Content.ContentPath = Spasm.Content.RootPath;
    Spasm.Content.StaticPath = t;
    Spasm.Content.AnimationsPath = Spasm.Path.combine(t, "/common/destiny_content/animations/");
    Spasm.Content.TablesPath = Spasm.Content.StaticPath;
    Spasm.Content.GearDirectory = "gear/";
    Spasm.Content.GearPath = Spasm.Path.combine(Spasm.Content.ContentPath, Spasm.Content.GearDirectory);
    Spasm.Content.PlatformDirectory = "platform/";
    Spasm.Content.PlatformPath = Spasm.Path.combine(Spasm.Content.ContentPath, Spasm.Content.PlatformDirectory);
    Spasm.Content.WebDirectory = "web/";
    Spasm.Content.WebPath = Spasm.Path.combine(Spasm.Content.PlatformPath, Spasm.Content.WebDirectory);
    Spasm.Content.GeometryDirectory = "geometry/";
    Spasm.Content.GeometryPath = Spasm.Path.combine(Spasm.Content.WebPath, Spasm.Content.GeometryDirectory);
    Spasm.Content.TexturesDirectory = "textures/";
    Spasm.Content.TexturesPath = Spasm.Path.combine(Spasm.Content.WebPath, Spasm.Content.TexturesDirectory);
    Spasm.Content.PlatedTexturesDirectory = "plated_textures/";
    Spasm.Content.PlatedTexturesPath = Spasm.Path.combine(Spasm.Content.WebPath, Spasm.Content.PlatedTexturesDirectory)
};
Spasm = Spasm || {};
Spasm.DropShadow = function(n) {
    var i, t, r, u;
    Spasm.assertWebGLContext(n);
    this.gl = n;
    this.vertices = [-1, -1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, 1, 1, 0, 1];
    this.boundingVolume = null;
    i = Spasm.Shader.InputTypes;
    t = Spasm.Shader.ValueTypes;
    this.uniforms = {
        projectionMatrix: new Spasm.ShaderInput(i.uniform, t.mat4, "u_projection_matrix"),
        modelMatrix: new Spasm.ShaderInput(i.uniform, t.mat4, "u_model_matrix"),
        viewMatrix: new Spasm.ShaderInput(i.uniform, t.mat4, "u_view_matrix"),
        scale: new Spasm.ShaderInput(i.uniform, t.vec4, "u_drop_shadow_scale"),
        translation: new Spasm.ShaderInput(i.uniform, t.vec4, "u_drop_shadow_translation"),
        shadowColor: new Spasm.ShaderInput(i.uniform, t.vec4, "u_shadow_color")
    };
    this.attributes = {
        position: new Spasm.ShaderInput(i.attribute, t.vec4, "a_position")
    };
    this.varyings = {
        position: new Spasm.ShaderInput(i.varying, t.vec4, "v_position")
    };
    this.vertexBufferAttribute = new Spasm.VertexBufferAttribute("position", 0, t.vec4, n.FLOAT, 4, !1, 16, 0);
    this.vertexBuffer = new Spasm.VertexBuffer(n, new Float32Array(this.vertices).buffer, this.vertices.length, 4, [this.vertexBufferAttribute]);
    this.dropShadowScale = new Float32Array([1, 1, 1, 1]);
    this.dropShadowScaleUniform = new Spasm.ShaderInput(i.uniform, t.vec4, "u_drop_shadow_scale");
    this.dropShadowScaleUnfiformData = new Spasm.UniformData(this.dropShadowScaleUniform, this.dropShadowScale);
    this.dropShadowTranslation = new Float32Array([0, 0, 0, 1]);
    this.dropShadowTranslationUniform = new Spasm.ShaderInput(i.uniform, t.vec4, "u_drop_shadow_translation");
    this.dropShadowTranslationUnfiformData = new Spasm.UniformData(this.dropShadowTranslationUniform, this.dropShadowTranslation);
    this.uniformDatas = {};
    r = this.getVertexShaderInputs();
    u = this.getFragmentShaderInputs();
    this.vertexShader = new Spasm.Shader(n, n.VERTEX_SHADER, this.getVertexShaderSourceLines(r), r);
    this.fragmentShader = new Spasm.Shader(n, n.FRAGMENT_SHADER, this.getFragmentShaderSourceLines(u), u);
    this.shaderProgram = new Spasm.ShaderProgram(n, this.vertexShader, this.fragmentShader)
};
Spasm.DropShadow.prototype = {};
Spasm.DropShadow.prototype.setUniformData = function(n) {
    Spasm.assertInstance(n, Spasm.UniformData);
    var t = n.shaderInput,
        i = t.name;
    this.uniformDatas[i] = n;
    this.shaderProgram.useProgram();
    this.shaderProgram.setUniformData(n)
};
Spasm.DropShadow.prototype.render = function() {
    this.setUniformData(this.dropShadowScaleUnfiformData);
    this.setUniformData(this.dropShadowTranslationUnfiformData);
    this.shaderProgram.useProgram();
    this.vertexBuffer.bindBuffer();
    this.shaderProgram.bindVertexAttributes([this.vertexBuffer]);
    var n = this.gl,
        t = n.isEnabled(n.BLEND),
        i = n.isEnabled(n.CULL_FACE);
    n.enable(n.BLEND);
    n.enable(n.CULL_FACE);
    n.drawArrays(n.TRIANGLE_STRIP, 0, 4);
    t || n.disable(n.BLEND);
    i || n.disable(n.CULL_FACE)
};
Spasm.DropShadow.prototype.getVertexShaderSourceLines = function(n) {
    var t, r, i, u;
    for (Spasm.assertArrayInstances(n, Spasm.ShaderInput), t = [], t.push("precision mediump float;"), t.push(""), r = n.length, i = 0; i < r; i++) u = n[i], t.push(u.declaration);
    return t.push(""), t.push("void main()"), t.push("{"), t.push("mat4 model_view_matrix = u_view_matrix * u_model_matrix;"), t.push("mat4 camera_matrix = u_projection_matrix * model_view_matrix;"), t.push("vec4 position_transformed = vec4((a_position.x * u_drop_shadow_scale.x) + u_drop_shadow_translation.x,(a_position.y * u_drop_shadow_scale.y) + u_drop_shadow_translation.y,(a_position.z * u_drop_shadow_scale.z) + u_drop_shadow_translation.z,1.0);"), t.push("gl_Position = camera_matrix * position_transformed;"), t.push("v_position = a_position;"), t.push("}"), t.push(""), t
};
Spasm.DropShadow.prototype.getFragmentShaderSourceLines = function(n) {
    var t, r, i, u;
    for (Spasm.assertArrayInstances(n, Spasm.ShaderInput), t = [], t.push("precision mediump float;"), t.push(""), r = n.length, i = 0; i < r; i++) u = n[i], t.push(u.declaration);
    return t.push(""), t.push("void main()"), t.push("{"), t.push("float distance = (v_position.x * v_position.x)+ (v_position.y * v_position.y);"), t.push("float intensity = 1.0 - (distance * (5.0/3.0));"), t.push("gl_FragColor = vec4(0.0, 0.0, 0.0, intensity - 0.3);"), t.push("}"), t.push(""), t
};
Spasm.DropShadow.prototype.getVertexShaderInputs = function() {
    var n = this.uniforms,
        t = this.attributes,
        i = this.varyings;
    return [n.projectionMatrix, n.modelMatrix, n.viewMatrix, n.scale, n.translation, t.position, i.position]
};
Spasm.DropShadow.prototype.getFragmentShaderInputs = function() {
    var n = this.varyings;
    return [n.position]
};
Spasm.DropShadow.prototype.setBoundingVolume = function(n) {
    Spasm.assertInstance(n, Spasm.BoundingVolume);
    this.boundingVolume = n;
    var t = n.getCenterPoint();
    this.dropShadowTranslation[0] = t[0];
    this.dropShadowTranslation[1] = t[1];
    this.dropShadowTranslation[2] = n.minZ - .005;
    this.dropShadowScale[0] = (n.maxX - n.minX) / 2 * 1.5;
    this.dropShadowScale[1] = (n.maxY - n.minY) / 2 * 1.5
};
Spasm = Spasm || {};
Spasm.Features = function(n) {
    var u, e, o, r, s;
    Spasm.assertCanvas(n);
    this.canvas = n;
    var t = null,
        f = null,
        i = null,
        h = Spasm.Features.supportsWebGL();
    if (h) try {
        u = {
            antialias: !0,
            preserveDrawingBuffer: !0
        };
        t = n.getContext("webgl", u) || n.getContext("experimental-webgl", u);
        i = t.getParameter(t.VIEWPORT)
    } catch (c) {
        f = c
    }
    if (this.gl = t, this.glException = f, this.viewport = i, this.requiredShaderValueCountSupported = !1, this.requiredExtensionsSupported = !1, this.requiredFunctionsSupported = !1, i)
        for (e = [], o = i.length, r = 0; r < o; r++) s = i[r], e.push(s);
    this.shaderSupport = {
        vertex: {
            uniformVectors: 0,
            attributes: 0
        },
        fragment: {
            uniformVectors: 0,
            varyingVectors: 0,
            textureCount: 0
        }
    };
    t && (this.requiredShaderValueCountSupported = this.checkMaxShaderValues(t), this.checkContextAttributes(t), this.requiredExtensionsSupported = this.checkExtensions(t), this.requiredFunctionsSupported = this.checkRequiredFunctions())
};
Spasm.Features.prototype = {};
Spasm.Features.prototype.floatingPointTextureExtensionName = "OES_texture_float";
Spasm.Features.prototype.requiredExtensions = [];
Spasm.Features.prototype.optionalExtensions = [Spasm.Features.prototype.floatingPointTextureExtensionName, "WEBGL_lose_context", "WEBKIT_WEBGL_lose_context", "MOZ_WEBGL_lose_context"];
Spasm.Features.prototype.requiredFunctions = ["ArrayBuffer.prototype.slice"];
Spasm.Features.prototype.checkRequiredFunctions = function() {
    var u = this.requiredFunctions,
        t, e, i, r, f;
    for (Spasm.assertStringArray(u), t = !0, e = u.length, i = 0; i < e; i++) {
        var s = u[i],
            o = s.split("."),
            h = o.length,
            n = window;
        for (r = 0; r < h; r++)
            if (f = o[r], n && n[f]) n = n[f];
            else break;
        t = t && typeof n == "function"
    }
    return t
};
Spasm.Features.supportsWebGL = function() {
    return !!window.WebGLRenderingContext
};
Spasm.Features.prototype.supportsFloatingPointTextures = function() {
    return this.floatingPointTextureExtensionStatus
};
Spasm.Features.prototype.canRender = function() {
    var n = this.gl;
    return Spasm.Features.supportsWebGL() && n && this.requiredShaderValueCountSupported && this.requiredExtensionsSupported && this.requiredFunctionsSupported && !n.isContextLost()
};
Spasm.Features.prototype.checkMaxShaderValues = function(n) {
    var u, f, h, c, l;
    Spasm.assertWebGLContext(n);
    var t = !0,
        i = n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),
        r = n.getParameter(n.MAX_VERTEX_ATTRIBS);
    this.shaderSupport.vertex.uniformVectors = i;
    this.shaderSupport.vertex.attributes = r;
    u = 250;
    i < u && (console.log("insufficient vertex shader uniform vector count (require " + u + ", have " + i + ")"), t = !1);
    f = 8;
    r < f && (console.log("insufficient vertex shader attribute count (require " + f + ", have " + r + ")"), t = !1);
    var e = n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),
        o = n.getParameter(n.MAX_VARYING_VECTORS),
        s = n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS);
    return this.shaderSupport.fragment.uniformVectors = e, this.shaderSupport.fragment.varyingVectors = o, this.shaderSupport.fragment.textureCount = s, h = 2, e < h && (console.log("insufficient fragment shader uniform vector count (require " + h + ", have " + e + ")"), t = !1), c = 5, o < c && (console.log("insufficient fragment shader varying vector count (require " + c + ", have " + o + ")"), t = !1), l = 6, s < l && (console.log("insufficient fragment shader texture count (require " + l + ", have " + s + ")"), t = !1), t
};
Spasm.Features.prototype.checkContextAttributes = function(n) {
    Spasm.assertWebGLContext(n);
    var t = n.getContextAttributes();
    Spasm.assertValid(t, "invalid context attributes")
};
Spasm.Features.prototype.checkExtensions = function(n) {
    Spasm.assertWebGLContext(n);
    var t = n.getSupportedExtensions(),
        i = this.requiredExtensions,
        r = this.optionalExtensions,
        u = this.extensionStatus(i, t);
    return this.optionalExtensionStatus = this.extensionStatus(r, t), this.floatingPointTextureExtensionStatus = t.indexOf(this.floatingPointTextureExtensionName), u
};
Spasm.Features.prototype.extensionStatus = function(n, t) {
    var r, f, i, u, e;
    for (Spasm.assertStringArray(n), Spasm.assertStringArray(t), r = {}, f = n.length, i = 0; i < f; i++) u = n[i], e = t.indexOf(u), r[u] = e >= 0;
    return r
};
Spasm = Spasm || {};
Spasm.GearDye = function(n, t) {
    Spasm.assertValid(n);
    Spasm.assertCollectionInstances(t, Spasm.Texture);
    this.dye = n;
    this.textures = t;
    this.identifier = n.identifier;
    this.blendMode = n.blend_mode;
    this.slotTypeIndex = n.slot_type_index;
    this.materialProperties = {
        primaryColor: n.material_properties.primary_color,
        secondaryColor: n.material_properties.secondary_color,
        detailTransform: n.material_properties.detail_transform,
        detailNormalContributionStrength: n.material_properties.detail_normal_contribution_strength,
        decalAlphaMapTransform: n.material_properties.decal_alpha_map_transform,
        decalBlendOption: n.material_properties.decal_blend_option,
        specularProperties: n.material_properties.specular_properties,
        subsurfaceScatteringStrength: n.material_properties.subsurface_scattering_strength
    };
    this.uniformDatas = this.getUniformDatas()
};
Spasm.GearDye.prototype = {};
Spasm.GearDye.prototype.bindTextures = function() {
    for (var t = this.textures, i = Object.keys(t), f = i.length, r, u, n = 0; n < f; n++) r = i[n], u = t[r], u.bindTexture()
};
Spasm.GearDye.prototype.getUniformDatas = function() {
    var n = Spasm.Shader.InputTypes,
        t = Spasm.Shader.ValueTypes,
        r = new Spasm.ShaderInput(n.uniform, t.int, "u_blend_mode"),
        i = new Spasm.ShaderInput(n.uniform, t.vec4, "u_change_color"),
        u = new Spasm.ShaderInput(n.uniform, t.vec4, "u_decal_alpha_map_transform"),
        f = new Spasm.ShaderInput(n.uniform, t.int, "u_decal_blend_option"),
        e = new Spasm.ShaderInput(n.uniform, t.vec4, "u_detail_normal_contribution_strength"),
        o = new Spasm.ShaderInput(n.uniform, t.vec4, "u_detail_transform"),
        s = new Spasm.ShaderInput(n.uniform, t.vec4, "u_specular_properties"),
        h = new Spasm.ShaderInput(n.uniform, t.vec4, "u_subsurface_scattering_strength"),
        c = new Spasm.UniformData(r, this.blendMode.value),
        l = new Spasm.UniformData(u, this.materialProperties.decalAlphaMapTransform),
        a = new Spasm.UniformData(f, this.materialProperties.decalBlendOption),
        v = new Spasm.UniformData(e, this.materialProperties.detailNormalContributionStrength),
        y = new Spasm.UniformData(o, this.materialProperties.detailTransform),
        p = new Spasm.UniformData(s, this.materialProperties.specularProperties),
        w = new Spasm.UniformData(h, this.materialProperties.subsurfaceScatteringStrength),
        b = new Spasm.ShaderInput(n.uniform, t.sampler2D, "u_texture_dye_diffuse"),
        k = new Spasm.ShaderInput(n.uniform, t.sampler2D, "u_texture_dye_normal"),
        d = new Spasm.ShaderInput(n.uniform, t.sampler2D, "u_texture_dye_decal"),
        g = new Spasm.UniformData(b, 3),
        nt = new Spasm.UniformData(k, 4),
        tt = new Spasm.UniformData(d, 5),
        it = [c, l, a, v, y, p, w, g, nt, tt];
    return this.primaryColorUniformData = new Spasm.UniformData(i, this.materialProperties.primaryColor), this.secondaryColorUniformData = new Spasm.UniformData(i, this.materialProperties.secondaryColor), it
};
Spasm = Spasm || {};
Spasm.ItemPreview = function(n, t) {
    var o, s, f, h;
    Spasm.assertCanvas(n);
    Spasm.assertString(t);
    this.canvas = n;
    this.contentBaseURL = t;
    Spasm.Content.setContentBaseURL(t);
    this.renderer = new Spasm.Renderer(n);
    this.gearShaders = this.renderer.canRender() ? new Spasm.GearShader(this.renderer.gl) : null;
    this.gearShaders !== null && (this.gearShaders.getShaderProgram(!1, !1, !1, !1), this.gearShaders.getShaderProgram(!0, !1, !1, !1), this.gearShaders.getShaderProgram(!0, !0, !1, !1));
    this.dropShadowEnabled = !1;
    this.renderer.canRender() && (this.dropShadow = new Spasm.DropShadow(this.renderer.gl));
    this.camera = new Spasm.Camera(n);
    this.cameraControls = new Spasm.CameraControls(n, this.camera);
    o = Math.abs(n.width);
    s = Math.abs(n.height);
    this.canvasSize = {
        width: o,
        height: s
    };
    this.shouldAnimate = !1;
    this.isAnimating = !1;
    this.limitToFrame = !1;
    this.isAnimationPaused = !1;
    this.assetLoaders = null;
    this.assetLoadersCount = 0;
    this.genderType = 1;
    this.classHash = 0;
    this.frameIndex = 0;
    this.callback = null;
    this.itemReferenceIds = [];
    this.mutedItemReferenceIds = [];
    this.gearRenderables = [];
    this.renderWithHelmet = !0;
    this.variantItemReferenceIds = {};
    this.renderWithHelmetVariantsByCount = {
        0: {},
        1: {
            0: ""
        },
        2: {
            0: "",
            1: ""
        },
        3: {
            0: "",
            2: ""
        }
    };
    this.renderWithoutHelmetVariantsByCount = {
        0: {},
        1: {
            0: ""
        },
        2: {
            0: ""
        },
        3: {
            1: "",
            2: ""
        }
    };
    this.gearRenderableCache = {};
    this.femaleGearRenderableCache = {};
    this.maleGearRenderableCache = {};
    this.boundingVolume = null;
    this.focusedItemReferenceId = null;
    this.centeredItemReferenceId = null;
    this.loadProgressPerItem = {};
    this.totalLoadProgress = {
        loading: -1,
        loaded: -1
    };
    this.loadProgressCallback = function() {};
    this.primaryWeaponItemDefinition = null;
    this.assetManifests = null;
    this.animations = {};
    this.skeletons = {};
    this.skeletonFilePath = Spasm.Path.combine(Spasm.Content.AnimationsPath, "destiny_player_skeleton.js");
    this.animationFilePath = Spasm.Path.combine(Spasm.Content.AnimationsPath, "destiny_player_animation.js");
    var r = Spasm.Shader.InputTypes,
        u = Spasm.Shader.ValueTypes,
        i = 72,
        e = 12;
    for (this.identityMatrices = new Float32Array(i * e), this.identityMatricesUniform = new Spasm.ShaderInput(r.uniform, u.vec4, "u_skinning_matrices", i), this.identityMatricesUniformData = new Spasm.UniformData(this.identityMatricesUniform, this.identityMatrices), f = 0; f < i; f++) this.identityMatrices.set(this.camera.matrices.identity34, f * e);
    this.skinningMatrices = new Float32Array(i * e);
    this.skinningMatricesUniform = new Spasm.ShaderInput(r.uniform, u.vec4, "u_skinning_matrices", i);
    this.skinningMatricesUniformData = new Spasm.UniformData(this.skinningMatricesUniform, this.skinningMatrices);
    this.lightPosition = new Float32Array([0, 10, 0]);
    this.lightPositionUniform = new Spasm.ShaderInput(r.uniform, u.vec3, "u_light_position");
    this.lightPositionUniformData = new Spasm.UniformData(this.lightPositionUniform, this.lightPosition);
    this.mutedColor = .3;
    this.mutedColorDiffuse = new Float32Array([this.mutedColor, this.mutedColor, this.mutedColor, 1]);
    this.mutedColorDiffuseUniform = new Spasm.ShaderInput(r.uniform, u.vec4, "u_muted_color_diffuse");
    this.mutedColorDiffuseUnfiformData = new Spasm.UniformData(this.mutedColorDiffuseUniform, this.mutedColorDiffuse);
    h = this;
    this.animationFrame = function() {
        h.animate()
    }
};
Spasm.ItemPreview.prototype = {};
Spasm.ItemPreview.prototype.setRenderWithHelmet = function(n) {
    Spasm.assertBoolean(n);
    this.renderWithHelmet = n
};
Spasm.ItemPreview.prototype.setVariantItemReferenceIds = function(n) {
    var i, r, t, u;
    for (Spasm.assertArray(n), i = {}, r = n.length, t = 0; t < r; t++) u = n[t], i[u] = "";
    this.variantItemReferenceIds = i
};
Spasm.ItemPreview.prototype.getGearRenderableCache = function() {
    return this.itemReferenceIds.length === 1 ? this.gearRenderableCache : this.isFemale() ? this.femaleGearRenderableCache : this.maleGearRenderableCache
};
Spasm.ItemPreview.prototype.onLoadAnimation = function(n, t) {
    Spasm.assertInstance(n, Spasm.Animation);
    Spasm.assertBoolean(t);
    n === this.animation && this.checkLoadComplete()
};
Spasm.ItemPreview.prototype.onLoadSkeleton = function(n, t) {
    Spasm.assertInstance(n, Spasm.Skeleton);
    Spasm.assertBoolean(t);
    this.checkLoadComplete()
};
Spasm.ItemPreview.prototype.checkLoadComplete = function() {
    this.assetLoadersCount === 0 && this.skeleton.loadComplete && this.animation.loadComplete && this.onLoadComplete()
};
Spasm.ItemPreview.prototype.onLoadFailure = function() {
    this.onFinishedLoading(!1)
};
Spasm.ItemPreview.prototype.setGenderType = function(n) {
    this.genderType = n
};
Spasm.ItemPreview.prototype.setClassHash = function(n) {
    this.classHash = n
};
Spasm.ItemPreview.prototype.setFocusedItemReferenceId = function(n) {
    n ? (this.focusedItemReferenceId = n, this.centeredItemReferenceId = null) : this.focusedItemReferenceId = null
};
Spasm.ItemPreview.prototype.setCenteredItemReferenceId = function(n) {
    n ? (this.centeredItemReferenceId = n, this.focusedItemReferenceId = null) : this.centeredItemReferenceId = null
};
Spasm.ItemPreview.prototype.setDropShadowEnabled = function(n) {
    Spasm.assertBoolean(n);
    this.dropShadowEnabled = n
};
Spasm.ItemPreview.prototype.setRotationZDegrees = function(n) {
    Spasm.assertNumber(n, "Spasm.ItemPreview.setRotationZDegrees: input is not a number" + n);
    this.camera.setRotationZDegrees(n)
};
Spasm.ItemPreview.prototype.genderTypeFemale = 1;
Spasm.ItemPreview.prototype.isFemale = function() {
    return this.genderType == this.genderTypeFemale
};
Spasm.ItemPreview.prototype.hasItemReferenceId = function(n) {
    var r = !1,
        i = this.itemReferenceIds,
        u, t, f;
    if (i)
        for (u = i.length, t = 0; t < u; t++)
            if (f = i[t], f == n) {
                r = !0;
                break
            }
    return r
};
Spasm.ItemPreview.prototype.loadItemAssetManifests = function() {
    var s = this.itemReferenceIds,
        n = this.assetManifests,
        r, u, f, h, t, e, c, l, i, o, a;
    for (n || (n = {}, this.assetManifests = n), r = this, u = "GearAsset", Spasm.assertValid(bungieNetPlatform, "missing bungie.net platform library"), Spasm.assertValid(bungieNetPlatform.platformSettings, "missing bungie.net platform settings"), f = bungieNetPlatform.platformSettings.contentVersion, h = s.length, t = 0; t < h; t++) e = s[t], c = e in n, c || (l = !1, bungieNetPlatform.destinyService.GetDestinySingleDefinition(u, e, l, f, function(n) {
        Spasm.assertValid(n);
        var t = n.data,
            i = t.gearAsset,
            u = t.requestedId;
        r.onLoadItemAssetManifest(u, i)
    }, function(n) {
        Spasm.assert(!1, "error loading equipment item definition: " + n)
    }));
    i = this.shaderItemReferenceId;
    o = this.shaderItemDefinition;
    i && (!o || o.itemHash != i) && (a = !1, bungieNetPlatform.destinyService.GetDestinySingleDefinition(u, i, a, f, function(n) {
        Spasm.assertValid(n);
        var t = n.data,
            i = t.gearAsset,
            u = t.requestedId;
        r.onLoadItemAssetManifest(u, i)
    }, function(n) {
        Spasm.assert(!1, "error loading equipment item definition: " + n)
    }));
    this.checkItemAssetManifestsLoadComplete()
};
Spasm.ItemPreview.prototype.addItemAssetManifest = function(n, t) {
    Spasm.assertValid(n);
    Spasm.assertValid(t);
    var i = this.assetManifests;
    i || (i = {}, this.assetManifests = i);
    i[n] = t
};
Spasm.ItemPreview.prototype.onLoadItemAssetManifest = function(n, t) {
    this.addItemAssetManifest(n, t);
    this.hasItemReferenceId(n) && this.checkItemAssetManifestsLoadComplete()
};
Spasm.ItemPreview.prototype.checkItemAssetManifestsLoadComplete = function() {
    var t = !1,
        i = this.assetManifests,
        n, f, e;
    if (i) {
        var r = !1,
            u = this.itemReferenceIds,
            o = u.length;
        for (n = 0; n < o; n++)
            if (f = u[n], e = f in i, !e) {
                r = !0;
                break
            }
        r || (this.loadItems(), t = !0)
    }
    return t
};
Spasm.ItemPreview.prototype.loadItems = function() {
    var k = this.gearShaders,
        o = this.itemReferenceIds,
        s = this.assetManifests,
        t = this,
        h = this.shaderItemDefinition,
        c = function(n, i) {
            if (i) {
                t.onLoadAssets(n);
                t.checkLoadComplete()
            } else t.onLoadFailure()
        },
        d = function(n, i) {
            t.loadProgressPerItem[i] = n.loadProgress;
            t.determineItemPreviewLoadProgress()
        },
        e, n, i, r, u, f, b;
    if (k && o && s) {
        this.assetLoaders = {};
        this.gearRenderables.length = 0;
        var l = this.isFemale(),
            a = this.classHash,
            v = this.getGearRenderableCache(),
            g = o.length;
        for (e = 0; e < g; e++) n = o[e], i = s[n], n in v ? this.gearRenderables.push(v[n]) : i ? i.content && i.content.length > 0 && (this.assetLoaders[n] = new Spasm.TGXAssetLoader(n, i, l, a, c, d), this.assetLoadersCount++) : console.log("ItemPreview: missing asset manifest for item id: " + n);
        if (h && (r = "" + h.itemHash, u = h.equippingBlock, r && u)) {
            var y = u.defaultDyes,
                p = u.customDyes,
                w = u.lockedDyes;
            (y && y.length > 0 || p && p.length > 0 || w && w.length > 0) && (f = s[r], f && f.content && f.content.length > 0 && (this.assetLoaders[r] = new Spasm.TGXAssetLoader(r, f, l, a, c), this.assetLoadersCount++))
        }
        b = Object.keys(this.assetLoaders);
        b.length === 0 && setTimeout(function() {
            t.checkLoadComplete()
        }, 0)
    }
};
Spasm.ItemPreview.prototype.loadAnimation = function(n) {
    var t = Spasm.Path.addVersionQuery(Spasm.Path.combine(Spasm.Content.StaticPath, n));
    t in this.animations || (this.animations[t] = new Spasm.Animation(t))
};
Spasm.ItemPreview.prototype.setAnimation = function() {
    var u = this,
        n = Spasm.Path.addVersionQuery(Spasm.Path.combine(Spasm.Content.StaticPath, this.animationFilePath)),
        t = Spasm.Path.addVersionQuery(Spasm.Path.combine(Spasm.Content.StaticPath, this.skeletonFilePath)),
        i = null,
        r = null;
    n in this.animations ? i = this.animations[n] : (i = new Spasm.Animation(n, function(n, t) {
        u.onLoadAnimation(n, t)
    }), this.animations[n] = i);
    t in this.skeletons ? r = this.skeletons[t] : (r = new Spasm.Skeleton(t, function(n, t) {
        u.onLoadSkeleton(n, t)
    }), this.skeletons[t] = r);
    this.animation = i;
    this.skeleton = r
};
Spasm.ItemPreview.prototype.setItemReferenceIds = function(n, t, i, r, u) {
    this.setItemReferenceIdsWithMutedItems(n, t, i, {}, r, u)
};
Spasm.ItemPreview.prototype.setItemReferenceIdsWithMutedItems = function(n, t, i, r, u, f) {
    this.setAnimation();
    Spasm.assertArray(n);
    Spasm.assertValid(r);
    Spasm.assertValid(u);
    Spasm.assertFunction(f);
    this.itemReferenceIds = n;
    this.assetManifests = t;
    this.shaderItemDefinition = i;
    this.mutedItemReferenceIds = r;
    this.assetManifests = u;
    this.callback = f;
    var e = this;
    this.renderer.canRender() ? this.loadItems() : setTimeout(function() {
        e.checkLoadComplete()
    }, 0)
};
Spasm.ItemPreview.prototype.loadItemReferenceIds = function(n, t, i) {
    this.loadItemReferenceIdsWithMutedItems(n, t, {}, i)
};
Spasm.ItemPreview.prototype.loadItemReferenceIdsWithMutedItems = function(n, t, i, r) {
    this.setAnimation();
    Spasm.assertArray(n);
    Spasm.assertValid(i);
    Spasm.assertFunction(r);
    this.itemReferenceIds = n;
    this.shaderItemReferenceId = t;
    this.mutedItemReferenceIds = i;
    this.callback = r;
    this.loadItemAssetManifests()
};
Spasm.ItemPreview.prototype.onLoadAssets = function(n) {
    var i, t, r;
    Spasm.assertInstance(n, Spasm.TGXAssetLoader);
    n.itemReferenceId in this.assetLoaders && (i = n.getGearDyes(this.renderer), t = n.getGearRenderable(this.renderer), t.setGearShaders(this.gearShaders), t.setGearDyes(i), r = this.getGearRenderableCache(), r[n.itemReferenceId] = t, this.gearRenderables.push(t), delete this.assetLoaders[n.itemReferenceId], this.assetLoadersCount--)
};
Spasm.ItemPreview.prototype.getTotalBoundingVolume = function() {
    for (var i = this.gearRenderables, r = [], e = i.length, t, f, n = 0; n < e; n++) {
        var o = i[n],
            u = o.getBoundingVolumes(),
            s = u.length;
        for (t = 0; t < s; t++) f = u[t], r.push(f)
    }
    return Spasm.boundingVolumeFromBoundingVolumes(r)
};
Spasm.ItemPreview.prototype.getBoundingVolumeForItemReferenceId = function(n) {
    var i = this.getGearRenderableCache(),
        t, r;
    return n && n in i ? (r = i[n], t = r.getBoundingVolume()) : t = null, t
};
Spasm.ItemPreview.prototype.onLoadComplete = function() {
    var h = this.gearRenderables,
        n = this.focusedItemReferenceId,
        t = this.centeredItemReferenceId,
        f = this.getGearRenderableCache(),
        b = [],
        c = null,
        l = this.shaderItemDefinition,
        a, e, v, r, o, s, y, u, p, i, w;
    for (l && (a = "" + l.itemHash, e = f[a], e && (c = e.gearDyes)), v = h.length, r = 0; r < v; r++)
        for (o = h[r], o.setShaderOverrideDyes(c), s = o.getBoundingVolumes(), y = s.length, u = 0; u < y; u++) p = s[u], b.push(p);
    i = null;
    t && t in f && (i = this.getBoundingVolumeForItemReferenceId(t));
    i = n && n in f ? this.getBoundingVolumeForItemReferenceId(n) : this.getTotalBoundingVolume();
    this.boundingVolume = i;
    this.camera.updateForBoundingVolume(i, !!n, !!t);
    n || t || (this.camera.orientation.modelTranslationVertical = 1);
    w = this.renderer.canRender() && this.skeleton.loadSuccess && this.animation.loadSuccess;
    this.onFinishedLoading(w)
};
Spasm.ItemPreview.prototype.onFinishedLoading = function(n) {
    var t = this.callback;
    t && (n || this.stopAnimating(!0), t(n), this.callback = null)
};
Spasm.ItemPreview.prototype.startAnimating = function() {
    this.shouldAnimate || (this.shouldAnimate = !0, this.canvas.style.display = "block", this.isAnimating || this.animate())
};
Spasm.ItemPreview.prototype.stopAnimating = function(n) {
    if (!this.shouldAnimate) return !1;
    this.shouldAnimate = !1;
    this.isAnimating = !1;
    var t = typeof n == "undefined" ? !0 : n;
    t && (this.canvas.style.display = "none")
};
Spasm.ItemPreview.prototype.animate = function() {
    var k, f, tt;
    if (this.isAnimating = !1, this.shouldAnimate && this.renderer.canRender()) this.isAnimating = !0, window.requestAnimationFrame(this.animationFrame);
    else {
        this.stopAnimating();
        return
    }
    var r = this.renderer.gl,
        it = this.skinningMatrices,
        rt = this.itemReferenceIds,
        n = this.gearShaders,
        v = this.gearRenderables,
        t = this.skeleton,
        e = this.animation,
        i, o;
    if (rt.length > 1)
        if (o = !0, t.loadComplete && e.loadComplete)
            if (t.loadSuccess && t.loadSuccess) {
                i = !0;
                var s = this.frameIndex,
                    h = e.frameCount,
                    c, y = t.inverseObjectSpaceTransformMatrices,
                    p = t.parentNodeIndices;
                h > 0 && y && p && (c = this.limitToFrame ? 0 : s >= h ? 0 : s < 0 ? h - 1 : s, e.frameFillTransformBuffer(c, it, y, p), this.isAnimationPaused || (this.frameIndex = c + .5))
            } else i = !1;
    else i = !1;
    else i = !0, o = !1;
    var w = this.canvas,
        u = this.canvasSize,
        l = Math.abs(w.width),
        a = Math.abs(w.height),
        b = l !== u.width || a !== u.height;
    if (b && (r.viewport(0, 0, l, a), u.width = l, u.height = a), (!this.limitToFrame || this.camera.isDirty() || b) && (this.camera.updateMatrices(), r.clear(r.COLOR_BUFFER_BIT | r.DEPTH_BUFFER_BIT), n && i && this.assetLoaders && Object.keys(this.assetLoaders).length === 0)) {
        for (n.setUniformData(this.lightPositionUniformData), n.setUniformData(this.mutedColorDiffuseUnfiformData), n.setUniformData(this.camera.uniformDatas.projectionMatrix), n.setUniformData(this.camera.uniformDatas.modelMatrix), n.setUniformData(this.camera.uniformDatas.viewMatrix), o ? n.setUniformData(this.skinningMatricesUniformData) : n.setUniformData(this.identityMatricesUniformData), k = v.length, f = 0; f < k; f++) {
            var d = v[f],
                g = d.itemId,
                ut = !!this.mutedItemReferenceIds && g in this.mutedItemReferenceIds,
                nt = null,
                ft = g in this.variantItemReferenceIds;
            ft && (tt = this.renderWithHelmet, nt = tt ? this.renderWithHelmetVariantsByCount : this.renderWithoutHelmetVariantsByCount);
            d.render(ut, nt)
        }
        this.dropShadowEnabled && this.boundingVolume && (this.dropShadow.setBoundingVolume(this.boundingVolume), this.itemReferenceIds.length > 1 && (this.dropShadow.dropShadowTranslation[0] -= .15), this.dropShadow.setUniformData(this.camera.uniformDatas.projectionMatrix), this.dropShadow.setUniformData(this.camera.uniformDatas.modelMatrix), this.dropShadow.setUniformData(this.camera.uniformDatas.viewMatrix), this.dropShadow.render())
    }
};
Spasm.ItemPreview.prototype.determineItemPreviewLoadProgress = function() {
    var n, t, r, i;
    this.totalLoadProgress = {
        loading: 0,
        loaded: 0
    };
    n = this.totalLoadProgress;
    t = this.loadProgressPerItem;
    for (r in t) i = t[r], n.loading += i.loading, n.loaded += i.loaded;
    this.loadProgressCallback()
};
Spasm.ItemPreview.prototype.pauseAnimation = function() {
    this.isAnimationPaused = !0
};
Spasm.ItemPreview.prototype.unPauseAnimation = function() {
    this.isAnimationPaused = !1
};
Spasm = Spasm || {};
Spasm.ReadyStateComplete = 4;
Spasm.HTTPStatusOK = 200;
Spasm.HTTPStatusNotModified = 304;
Spasm.Loader = function(n) {
    Spasm.assertPath(n, "invalid file path");
    this.filePath = n;
    var t = new XMLHttpRequest;
    this.request = t;
    t.onreadystatechange = this.stateChangeCallback();
    t.onprogress = this.progressCallback();
    t.open("GET", n);
    t.send()
};
Spasm.Loader.prototype = {
    constructor: Spasm.Loader,
    stateChangeCallback: function() {
        var n = this;
        return function() {
            n.onStateChange()
        }
    },
    progressCallback: function() {
        var n = this;
        return function() {
            n.onProgress()
        }
    },
    onStateChange: function() {},
    onProgress: function() {}
};
Spasm.Loader.prototype.isComplete = function() {
    var n = this.request;
    return n.readyState === Spasm.ReadyStateComplete
};
Spasm.Loader.prototype.isCompleteAndOK = function() {
    var n = this.request,
        t = n.status;
    return n.readyState === Spasm.ReadyStateComplete && (t >= 200 && t < 300 || n.status === Spasm.HTTPStatusNotModified)
};
Spasm.BufferLoader = function(n, t) {
    Spasm.Loader.call(this, n);
    this.callback = t;
    this.request.responseType = "arraybuffer"
};
Spasm.BufferLoader.prototype = Object.create(Spasm.Loader.prototype);
Spasm.BufferLoader.prototype.onStateChange = function() {
    this.isComplete() && this.callback(this)
};
Spasm.JSONLoader = function(n, t) {
    Spasm.Loader.call(this, n);
    this.callback = t;
    this.parsedResponse = null
};
Spasm.JSONLoader.prototype = Object.create(Spasm.Loader.prototype);
Spasm.JSONLoader.prototype.onStateChange = function() {
    if (this.isComplete()) {
        if (this.isCompleteAndOK()) {
            var n = this.request,
                t = n.responseText;
            try {
                this.parsedResponse = JSON.parse(t)
            } catch (i) {
                console.log("Spasm.JSONLoader parse error : " + i)
            }
        }
        this.callback(this)
    }
};
Spasm = Spasm || {};
Spasm.Path = {};
Spasm.Path.stripLeadingSlash = function(n) {
    Spasm.assertPath(n);
    var t = n.length;
    return t > 0 ? n[0] === "/" ? n.substring(1, n.length) : n : n
};
Spasm.Path.stripTrailingSlash = function(n) {
    Spasm.assertPath(n);
    var t = n.length;
    return t > 0 ? n[t - 1] === "/" ? n.substring(0, n.length - 1) : n : n
};
Spasm.Path.combine = function(n, t) {
    Spasm.assertPath(n);
    Spasm.assertPath(t);
    t = t.replace(Spasm.Content.BaseURL, ''); // Absolute URL fix
    return Spasm.Path.stripTrailingSlash(n) + "/" + Spasm.Path.stripLeadingSlash(t)
};
Spasm.Path.addVersionQuery = function(n) {
    return Spasm.Content.VersionQuery ? n + "?" + Spasm.Content.VersionQuery : n
};
Spasm.assertEqual(Spasm.Path.stripLeadingSlash("/a/"), "a/");
Spasm.assertEqual(Spasm.Path.stripTrailingSlash("/b/"), "/b");
Spasm.assertEqual(Spasm.Path.combine("/c/", "/d/"), "/c/d/");
Spasm = Spasm || {};
Spasm.RenderMesh = function(n) {
    var t, f, i, e, o, s, r, u, h;
    for (Spasm.assertValid(n), this.renderMesh = n, this.boundingVolume = Spasm.boundingVolumeFromRenderMetadata(n.bounding_volume), this.skinning = n.skinning, this.positionOffset = n.position_offset, this.positionScale = n.position_scale, t = n.texcoord0_scale_offset, this.textureScale = [t[0], t[1]], this.textureOffset = [t[2], t[3]], this.stageParts = [], f = n.stage_part_list.length, i = 0; i < f; i++) e = n.stage_part_list[i], o = new Spasm.RenderMeshStagePart(e), this.stageParts.push(o);
    for (this.stagePartOffsets = n.stage_part_offsets, this.stagePartVertexStreamLayoutLookup = n.stage_part_vertex_stream_layout_lookup, this.stagePartVertexStreamLayoutDefintions = n.stage_part_vertex_stream_layout_definitions, this.indexBufferMetadata = {
            fileName: n.index_buffer.file_name,
            byteSize: n.index_buffer.byte_size,
            valueByteSize: n.index_buffer.value_byte_size
        }, this.vertexBufferMetadatas = [], s = n.vertex_buffers.length, r = 0; r < s; r++) u = n.vertex_buffers[r], h = {
        fileName: u.file_name,
        byteSize: u.byte_size,
        strideByteSize: u.stride_byte_size
    }, this.vertexBufferMetadatas.push(h)
};
Spasm.RenderMesh.prototype = {};
Spasm.RenderMesh.prototype.setVertexBuffers = function(n) {
    Spasm.assertArrayInstances(n, Spasm.VertexBuffer);
    this.vertexBuffers = n
};
Spasm.RenderMesh.prototype.setIndexBuffer = function(n) {
    Spasm.assertInstance(n, Spasm.IndexBuffer);
    this.indexBuffer = n
};
Spasm.RenderMesh.prototype.getRenderable = function(n, t, i) {
    Spasm.assertWebGLContext(n);
    Spasm.assertValid(t);
    var r = this.getUniformDatas(t, i),
        u = this.vertexBuffers,
        f = this.indexBuffer,
        e = this.getRenderableParts(n),
        o = this.boundingVolume;
    return new Spasm.Renderable(n, u, f, r, i, e, o)
};
Spasm.RenderMesh.prototype.stagesToRender = [0];
Spasm.RenderMesh.prototype.getRenderableParts = function(n) {
    var r, u, h, c, i;
    Spasm.assertWebGLContext(n);
    var e = this.stageParts,
        f = this.stagePartOffsets,
        o = this.stagesToRender,
        a = e.length,
        v = f.length,
        y = o.length,
        s = [];
    for (r = 0; r < y; r++)
        for (u = o[r], Spasm.assert(u + 1 < v), h = f[u], c = f[u + 1], i = h; i < c; i++) {
            Spasm.assert(i < a);
            var t = e[i],
                p = t.externalIdentifier,
                w = t.primitiveType,
                l = w === 3 ? n.TRIANGLES : n.TRIANGLE_STRIP,
                b = l === n.TRIANGLES,
                k = t.lodCategory,
                d = k.name;
            if (d.indexOf("0") >= 0) {
                var g = t.startIndex,
                    nt = t.indexCount,
                    tt = t.gearDyeChangeColorIndex,
                    it = new Spasm.RenderablePart(g, nt, tt, l, p, b);
                s.push(it)
            }
        }
    return s
};
Spasm.RenderMesh.prototype.getAttributes = function(n) {
    var u, o, h, c, ht, ct, lt, f, at, vt, a, pt, wt;
    Spasm.assertWebGLContext(n);
    var k = this.vertexBufferMetadatas,
        d = k.length,
        g = this.stagePartVertexStreamLayoutDefintions,
        bt = g.length;
    Spasm.assertEqual(bt, 1);
    var kt = g[0],
        nt = kt.formats,
        dt = nt.length;
    Spasm.assertEqual(d, dt);
    var tt = [],
        it = [],
        gt = {};
    for (u = 0; u < d; u++) {
        var rt = [],
            ni = k[u],
            e = ni.strideByteSize,
            ut = nt[u],
            ti = ut.stride;
        Spasm.assertEqual(e, ti);
        var ft = ut.elements,
            ii = ft.length,
            et = ["ubyte", "byte", "ushort", "short", "uint", "int", "float"],
            v = {},
            y = 0;
        for (o = 0; o < ii; o++) {
            var s = ft[o],
                ot = s.semantic_index,
                ri = s.semantic,
                st = s.type,
                p = ri.replace("_tfx_vb_semantic_", ""),
                w = st.replace("_vertex_format_attribute_", ""),
                t = "",
                i = 0,
                r = 0,
                ui = et.length;
            for (h = 0; h < ui; h++)
                if (c = et[h], ht = w.indexOf(c), ht === 0) {
                    ct = w.length;
                    lt = w[ct - 1];
                    r = parseInt(lt);
                    Spasm.assertInteger(r);
                    switch (c) {
                        case "byte":
                            t = "BYTE";
                            i = 1;
                            break;
                        case "ubyte":
                            t = "UNSIGNED_BYTE";
                            i = 1;
                            break;
                        case "short":
                            t = "SHORT";
                            i = 2;
                            break;
                        case "ushort":
                            t = "UNSIGNED_SHORT";
                            i = 2;
                            break;
                        case "int":
                            t = "INT";
                            i = 4;
                            break;
                        case "uint":
                            t = "UNSIGNED_INT";
                            i = 4;
                            break;
                        case "float":
                            t = "FLOAT";
                            i = 4;
                            break;
                        default:
                            Spasm.assert(!1, "invalid elementValueSizeName: " + c)
                    }
                    break
                }
            var l = i * r,
                fi = n[t],
                ei = s.normalized;
            p.indexOf("position") >= 0 && t === "FLOAT" && (this.positionScale = [1, 1, 1], this.positionOffset = [0, 0, 0]);
            f = "" + p + "" + ot;
            f in it && console.log("oops - duplicate semantic identifier: " + f);
            it.push(f);
            v[f] = l;
            gt[f] = {
                vertexBufferIndex: u,
                byteOffset: y,
                elementSize: l,
                elementTypeName: st,
                vertexStride: e,
                elementValueSize: i,
                elementValueCount: r
            };
            at = r === 1 ? "float" : "vec" + r;
            vt = new Spasm.VertexBufferAttribute(p, ot, at, fi, r, ei, l, y);
            rt.push(vt);
            y += l
        }
        var b = 0,
            yt = Object.keys(v),
            oi = yt.length;
        for (a = 0; a < oi; a++) pt = yt[a], b += v[pt];
        wt = b - e;
        Spasm.assert(wt === 0, "non-zero stride difference: given - " + e + ", calculated - " + b);
        tt.push(rt)
    }
    return tt
};
Spasm.RenderMesh.prototype.getUniformDatas = function(n, t) {
    var h = this.positionScale,
        c = this.positionOffset,
        l = this.textureScale,
        a = this.textureOffset,
        i = Spasm.Shader.InputTypes,
        r = Spasm.Shader.ValueTypes,
        v = new Spasm.ShaderInput(i.uniform, r.vec3, "u_position_scale"),
        y = new Spasm.UniformData(v, new Float32Array(h)),
        p = new Spasm.ShaderInput(i.uniform, r.vec3, "u_position_offset"),
        w = new Spasm.UniformData(p, new Float32Array(c)),
        b = new Spasm.ShaderInput(i.uniform, r.vec2, "u_texcoord_scale"),
        k = new Spasm.UniformData(b, new Float32Array(l)),
        d = new Spasm.ShaderInput(i.uniform, r.vec2, "u_texcoord_offset"),
        g = new Spasm.UniformData(d, new Float32Array(a)),
        e = [y, w, k, g],
        u, f, o, s;
    for (u in t) f = t[u], f && (o = new Spasm.ShaderInput(i.uniform, r.sampler2D, "u_texture_" + u), s = new Spasm.UniformData(o, f.index), e.push(s));
    return e
};
Spasm = Spasm || {};
Spasm.RenderMeshStagePart = function(n) {
    Spasm.assertValid(n);
    this.stagePart = n;
    var i = n.shader,
        t = i ? i.static_textures : null,
        r = t && t.length ? t.length : 0;
    this.shader = i;
    this.staticTextures = t;
    this.staticTextureCount = r;
    this.startIndex = n.start_index;
    this.indexCount = n.index_count;
    this.indexMin = n.index_min;
    this.indexMax = n.index_max;
    this.flags = n.flags;
    this.gearDyeChangeColorIndex = n.gear_dye_change_color_index;
    this.externalIdentifier = n.external_identifier;
    this.primitiveType = n.primitive_type;
    this.lodCategory = n.lod_category;
    this.lodRun = n.lod_run
};
Spasm.RenderMeshStagePart.prototype = {};
Spasm = Spasm || {};
Spasm.Skeleton = function(n, t) {
    Spasm.assertPath(n);
    Spasm.assertFunction(t);
    this.skeletonPath = n;
    this.callback = t;
    this.loadComplete = !1;
    this.loadSuccess = !1;
    var i = this,
        r = function(n) {
            i.onLoadSkeleton(n)
        };
    this.skeleton = null;
    this.skeletonLoader = new Spasm.JSONLoader(n, r);
    this.inverseObjectSpaceTransformMatrices = null;
    this.parentNodeIndices = null;
    this.nodeCount = 0
};
Spasm.Skeleton.prototype = {};
Spasm.Skeleton.prototype.onLoadSkeletonSuccess = function(n) {
    var t, h, c;
    Spasm.assertValid(n);
    this.loadSuccess = !0;
    var r = n.definition,
        u = r.default_inverse_object_space_transforms,
        l = r.nodes,
        f = [],
        e = [],
        a = u.length;
    for (t = 0; t < a; t++) {
        var o = u[t],
            i = o.ts,
            v = i[3],
            y = o.r,
            p = [i[0], i[1], i[2]],
            w = new Spasm.TransformSRT(v, y, p),
            s = mat4.create();
        w.setMatrix(s);
        f.push(s);
        h = l[t];
        c = h.parent_node_index;
        e.push(c)
    }
    this.inverseObjectSpaceTransformMatrices = f;
    this.parentNodeIndices = e;
    this.callback && (this.callback(this, !0), this.callback = null)
};
Spasm.Skeleton.prototype.onLoadSkeletonFailure = function() {
    this.loadSuccess = !1;
    this.callback && (this.callback(this, !1), this.callback = null)
};
Spasm.Skeleton.prototype.onLoadSkeleton = function(n) {
    if (Spasm.assertInstance(n, Spasm.JSONLoader), this.loadComplete = !0, n.isCompleteAndOK()) {
        var t = n.parsedResponse;
        this.onLoadSkeletonSuccess(t)
    } else this.onLoadSkeletonFailure()
};
Spasm = Spasm || {};
Spasm.TextureLoader = function(n, t) {
    var i, r;
    Spasm.assertPath(n);
    Spasm.assertFunction(t);
    this.filePath = n;
    this.callback = t;
    this.loadComplete = !1;
    this.loadSuccess = !1;
    i = document.createElement("img");
    this.image = i;
    r = this;
    i.crossOrigin = "anonymous";
    i.onload = function() {
        r.onImageLoad()
    };
    i.onerror = function() {
        r.onImageError()
    };
    i.src = n
    //var request = new XMLHttpRequest();
    //request.open('GET', n, true);
    //request.addEventListener('load', function (event) {
    //    console.log(event);
    //}, false);
    //request.addEventListener( 'error', function ( event ) {
    //    Bnet.error(n, event);
    //}, false );
    //request.responseType = 'blob';
    //request.setRequestHeader("X-API-Key", bungieNetPlatform.apiKeyphotoId);
    ////request.withCredentials = true;
    //request.overrideMimeType = 'text/plain';
    //request.send( null );
};
Spasm.TextureLoader.prototype = {
    constructor: Spasm.TextureLoader,
    onImageLoad: function() {
        this.loadComplete = !0;
        this.loadSuccess = !0;
        this.callback(this)
    },
    onImageError: function() {
        this.loadComplete = !0;
        this.loadSuccess = !1;
        this.callback(this)
    },
    isComplete: function() {
        return this.loadComplete
    },
    isCompleteAndOK: function() {
        return this.loadComplete && this.loadSuccess
    }
};
Spasm = Spasm || {};
Spasm.TGXAssetLoader = function(n, t, i, r, u, f) {
    Spasm.assertString(n);
    Spasm.assertValid(t);
    Spasm.assertBoolean(i);
    Spasm.assertFunction(u);
    this.itemReferenceId = n;
    this.assetManifest = t;
    this.isFemale = i;
    this.classHash = r;
    this.callback = u;
    this.progressCallback = typeof f != "undefined" ? f : function() {};
    this.contentLoaders = {
        gear: {},
        geometry: {},
        textures: {},
        platedTextures: {}
    };
    this.contentLoaded = {
        gear: {},
        geometry: {},
        textures: {},
        platedTextures: {}
    };
    this.loadProgress = {
        loading: -1,
        loaded: -1
    };
    this.onLoadAssetManifest()
};
Spasm.TGXAssetLoader.prototype = {};
Spasm.TGXAssetLoader.prototype.onContentLoadComplete = function() {
    this.callback && (this.callback(this, !0), this.callback = null)
};
Spasm.TGXAssetLoader.prototype.onLoadFailure = function() {
    this.callback && (this.callback(this, !1), this.callback = null)
};
Spasm.TGXAssetLoader.prototype.getGearDyes = function(n) {
    var i, u, f, o, r, s, t, ut;
    Spasm.assertInstance(n, Spasm.Renderer);
    i = n.gl;
    Spasm.assertWebGLContext(i);
    var l = this.contentLoaded.gear,
        a = Object.keys(l),
        ft = a.length;
    Spasm.assert(ft >= 1);
    var v = this.contentLoaded.textures,
        y = Object.keys(v),
        et = y.length,
        ot = a[0],
        h = l[ot],
        p = {
            customDyes: h.custom_dyes || [],
            defaultDyes: h.default_dyes || [],
            lockedDyes: h.locked_dyes || []
        },
        w = {},
        b = Object.keys(p),
        st = b.length;
    for (u = 0; u < st; u++) {
        var k = b[u],
            d = p[k],
            ht = d.length,
            g = [];
        for (f = 0; f < ht; f++) {
            var nt = d[f],
                c = nt.textures,
                ct = c.diffuse,
                lt = c.normal,
                at = c.decal,
                tt = ct.reference_id,
                it = lt.reference_id,
                rt = at.reference_id,
                e = {};
            for (o = 0; o < et; o++) r = y[o], s = v[r], tt && r.indexOf(tt) >= 0 ? (t = n.getDiffuseDyeTextureIndex(), e.diffuse = new Spasm.Texture(i, t, s)) : it && r.indexOf(it) >= 0 ? (t = n.getNormalDyeTextureIndex(), e.normal = new Spasm.Texture(i, t, s)) : rt && r.indexOf(rt) >= 0 ? (t = n.getDecalDyeTextureIndex(), e.decal = new Spasm.Texture(i, t, s)) : t = null;
            ut = new Spasm.GearDye(nt, e);
            g.push(ut)
        }
        w[k] = g
    }
    return w
};
Spasm.TGXAssetLoader.prototype.getGearRenderable = function(n) {
    var t;
    Spasm.assertInstance(n, Spasm.Renderer);
    t = n.gl;
    Spasm.assertWebGLContext(t);
    var i = this.itemReferenceId,
        r = this.getGearRenderableModels(n);
    return new Spasm.GearRenderable(i, r)
};
Spasm.TGXAssetLoader.prototype.getGearRenderableModels = function(n) {
    var b, nt, l, it, t, r, a, u, f, ot, e, y, st, o, ht, ct, s, p, w, lt;
    Spasm.assertInstance(n, Spasm.Renderer);
    b = n.gl;
    Spasm.assertWebGLContext(b);
    var k = this.contentLoaded,
        at = k.geometry,
        d = [],
        i = [],
        g = k.gear;
    for (nt in g) {
        var tt = g[nt],
            h = tt.art_content,
            c = tt.art_content_sets;
        if (c && (l = c.length, l > 1)) {
            for (it = this.classHash, t = null, r = 0; r < l; r++) a = c[r], (t === null || a.classHash == it) && (t = a);
            t !== null && t.arrangement != null && (h = t.arrangement)
        }
        if (h) {
            var v = h.gear_set,
                rt = v.regions,
                ut = rt.length;
            if (ut > 0)
                for (u = 0; u < ut; u++) {
                    var vt = rt[u],
                        ft = vt.pattern_list,
                        yt = ft.length;
                    if (yt > 0) {
                        var pt = ft[0],
                            et = pt.geometry_hashes,
                            wt = et.length;
                        for (f = 0; f < wt; f++) ot = et[f], i.push(ot)
                    }
                } else if (e = null, e = this.isFemale ? v.female_override_art_arrangement : v.base_art_arrangement, e !== null)
                    for (y = e.geometry_hashes, st = y.length, o = 0; o < st; o++) ht = y[o], i.push(ht)
        }
    }
    for (ct = i.length, s = 0; s < ct; s++) p = i[s], w = at[p], w && (lt = this.getGearRenderableModel(n, p, w), d.push(lt));
    return d
};
Spasm.TGXAssetLoader.prototype.getGearRenderableModel = function(n, t, i) {
    var h, u, wt, bt, kt, tt, gt, l, ni, a, e, ti, v, f, y, o, ei, oi, si;
    Spasm.assertInstance(n, Spasm.Renderer);
    Spasm.assertString(t);
    Spasm.assertValid(i);
    var r = n.gl,
        ht = this.contentLoaded,
        hi = i["render_metadata.js"],
        ci = new Uint8Array(hi),
        w = Spasm.Utilities.jsonFromCharBuffer(ci);
    Spasm.assertValid(w);
    var li = w.render_model,
        b = li.render_meshes,
        ct = b.length,
        k = null,
        d = null,
        g = null,
        lt = n.getDiffusePlateTextureIndex(),
        at = n.getNormalPlateTextureIndex(),
        vt = n.getGearstackPlateTextureIndex(),
        yt = w.texture_plates,
        ai = yt.length;
    if (ai === 1) {
        var vi = yt[0],
            nt = vi.plate_set,
            yi = nt.diffuse,
            pi = nt.normal,
            wi = nt.gearstack,
            bi = yi.reference_id,
            ki = pi.reference_id,
            di = wi.reference_id,
            s = ht.platedTextures,
            pt = Object.keys(s),
            gi = pt.length;
        for (h = 0; h < gi; h++) u = pt[h], u.indexOf(bi) >= 0 ? (wt = s[u], k = new Spasm.Texture(r, lt, wt)) : u.indexOf(ki) >= 0 ? (bt = s[u], d = new Spasm.Texture(r, at, bt)) : u.indexOf(di) >= 0 && (kt = s[u], g = new Spasm.Texture(r, vt, kt))
    } else {
        var c = ht.textures,
            dt = Object.keys(c),
            nr = dt.length;
        if (ct > 0)
            for (tt = b[0], gt = tt.stage_part_list.length, l = 0; l < gt; l++)
                if (ni = tt.stage_part_list[l], a = ni.shader, a && a.static_textures && (e = a.static_textures, ti = e.length, ti >= 5)) {
                    var tr = e[0],
                        ir = e[2],
                        rr = e[4],
                        it = null,
                        rt = null,
                        ut = null;
                    for (v = 0; v < nr; v++) f = dt[v], f.indexOf(tr) >= 0 ? it = f : f.indexOf(ir) >= 0 ? rt = f : f.indexOf(rr) >= 0 && (ut = f);
                    if (it && rt && ut) {
                        var ur = c[it],
                            fr = c[rt],
                            er = c[ut];
                        k = new Spasm.Texture(r, lt, ur);
                        d = new Spasm.Texture(r, at, fr);
                        g = new Spasm.Texture(r, vt, er);
                        break
                    }
                }
    }
    var or = {
            diffuse: k,
            normal: d,
            gearstack: g
        },
        sr = [],
        ii = [];
    for (y = 0; y < ct; y++) {
        var ft = b[y],
            p = new Spasm.RenderMesh(ft),
            et = ft.index_buffer,
            hr = et.file_name,
            cr = et.byte_size,
            lr = et.value_byte_size,
            ar = cr / lr,
            vr = i[hr],
            yr = new Spasm.IndexBuffer(r, vr, ar, r.UNSIGNED_SHORT);
        p.setIndexBuffer(yr);
        var pr = p.getAttributes(r),
            ri = ft.vertex_buffers,
            wr = ri.length,
            ui = [];
        for (o = 0; o < wr; o++) {
            var ot = ri[o],
                st = ot.file_name,
                br = ot.byte_size,
                fi = ot.stride_byte_size,
                kr = br / fi;
            Spasm.Utilities.stringEndsWith(st, ".tgx") || (st += ".tgx");
            ei = i[st];
            oi = new Spasm.VertexBuffer(r, ei, fi, kr, pr[o]);
            ui.push(oi)
        }
        p.setVertexBuffers(ui);
        si = p.getRenderable(r, sr, or);
        ii.push(si)
    }
    return new Spasm.GearRenderableModel(t, ii)
};
Spasm.TGXAssetLoader.prototype.onLoadAssetManifest = function() {
    var y = this.assetManifest,
        p, n, r, b, st, u, k, ht, d, ct, f, t, g, e, nt, tt, o, it, rt, s, ut, c, ft, et, l, a, v;
    for (Spasm.assertValid(y), p = y.content, n = null, r = 0; r < p.length; r++)
        if (n = p[r], n.platform === "web") break;
    var i = [],
        ni = {
            "2": 2,
            "6": 6,
            "21": 21
        },
        ot = n.dye_index_set;
    ot && i.push(ot);
    var w = n.region_index_sets,
        ti = n.female_index_set,
        ii = n.male_index_set;
    if (w)
        for (b = Object.keys(w), st = b.length, u = 0; u < st; u++) k = b[u], ht = "" + k, ht in ni || (d = w[k], ct = d.length, ct > 0 && i.push(d[0]));
    else this.isFemale ? i.push(ti) : i.push(ii);
    var lt = y.gear,
        ri = n.geometry,
        ui = n.textures,
        fi = n.plate_regions,
        at = {},
        vt = {},
        yt = {},
        ei = i.length || 0;
    for (f = 0; f < ei; f++) {
        if (t = i[f] || {}, t.geometry)
            for (g = t.geometry, e = 0; e < g.length; e++) nt = g[e], at[nt] = nt;
        if (t.textures)
            for (tt = t.textures, o = 0; o < tt.length; o++) it = tt[o], vt[it] = it;
        if (t.plate_regions)
            for (rt = t.plate_regions, s = 0; s < rt.length; s++) ut = rt[s], yt[ut] = ut
    }
    var oi = this.contentLoaders.gear,
        si = this.contentLoaders.geometry,
        hi = this.contentLoaders.textures,
        ci = this.contentLoaders.platedTextures,
        h = this,
        li = function(n) {
            h.onLoadGearJSON(n)
        },
        ai = lt.length;
    for (c = 0; c < ai; c++) ft = lt[c], Spasm.assert(Spasm.Utilities.stringEndsWith(ft, ".js")), et = Spasm.Path.addVersionQuery(Spasm.Path.combine(Spasm.Content.GearPath, ft)), oi[et] = new Spasm.JSONLoader(et, li);
    var vi = function(n) {
            h.onLoadGeometryBuffer(n)
        },
        pt = Object.keys(at),
        yi = pt.length;
    for (l = 0; l < yi; l++) {
        var pi = pt[l],
            wi = ri[pi],
            wt = Spasm.Path.addVersionQuery(Spasm.Path.combine(Spasm.Content.GeometryPath, wi));
        si[wt] = new Spasm.TGXBinLoader(wt, vi)
    }
    var bi = function(n) {
            h.onLoadTexture(n)
        },
        bt = Object.keys(vt),
        ki = bt.length;
    for (a = 0; a < ki; a++) {
        var di = bt[a],
            gi = ui[di],
            kt = Spasm.Path.addVersionQuery(Spasm.Path.combine(Spasm.Content.TexturesPath, gi));
        hi[kt] = new Spasm.TextureLoader(kt, bi)
    }
    var nr = function(n) {
            h.onLoadPlatedTexture(n)
        },
        dt = Object.keys(yt),
        tr = dt.length;
    for (v = 0; v < tr; v++) {
        var ir = dt[v],
            rr = fi[ir],
            gt = Spasm.Path.addVersionQuery(Spasm.Path.combine(Spasm.Content.PlatedTexturesPath, rr));
        ci[gt] = new Spasm.TextureLoader(gt, nr)
    }
};
Spasm.TGXAssetLoader.prototype.checkContentLoadComplete = function() {
    var t = this.contentLoaders,
        n;
    this.determineLoadProgress();
    var i = 0,
        r = Object.keys(t),
        u = r.length;
    for (n = 0; n < u; n++) {
        var f = r[n],
            e = t[f],
            o = Object.keys(e);
        i += o.length
    }
    i === 0 && this.onContentLoadComplete()
};
Spasm.TGXAssetLoader.prototype.determineLoadProgress = function() {
    var n, t = this.contentLoaders,
        i = this.contentLoaded,
        r = 0,
        u = 0,
        f, e;
    for (n in t) f = t[n], r += Object.keys(f).length;
    for (n in i) e = i[n], u += Object.keys(e).length;
    this.loadProgress = {
        loading: r,
        loaded: u
    };
    this.progressCallback(this, this.itemReferenceId)
};
Spasm.TGXAssetLoader.prototype.onLoadGearJSON = function(n) {
    var t, r, i, u;
    Spasm.assertInstance(n, Spasm.JSONLoader);
    n.isCompleteAndOK() ? (t = n.filePath, Spasm.assertPath(t), r = n.parsedResponse, Spasm.assertValid(r), this.contentLoaded.gear[t] = r, i = this.contentLoaders.gear, Spasm.assert(t in i), u = i[t], Spasm.assertEqual(u, n), delete i[t], this.checkContentLoadComplete()) : this.onLoadFailure()
};
Spasm.TGXAssetLoader.prototype.onLoadGeometryBuffer = function(n) {
    var t, r, u, i, f;
    Spasm.assertInstance(n, Spasm.TGXBinLoader);
    n.isCompleteAndOK() ? (t = n.filePath, Spasm.assertPath(t), r = n.fileIdentifier, Spasm.assertString(r), u = n.getFileBuffers(), Spasm.assertValid(u), this.contentLoaded.geometry[r] = u, i = this.contentLoaders.geometry, Spasm.assert(t in i), f = i[t], Spasm.assertEqual(f, n), delete i[t], this.checkContentLoadComplete()) : this.onLoadFailure()
};
Spasm.TGXAssetLoader.prototype.onLoadTexture = function(n) {
    var t, i, r, u;
    Spasm.assertInstance(n, Spasm.TextureLoader);
    n.isCompleteAndOK() ? (t = n.filePath, Spasm.assertPath(t), i = n.image, Spasm.assertValid(i), this.contentLoaded.textures[t] = i, r = this.contentLoaders.textures, u = r[t], Spasm.assertEqual(u, n), delete r[t], this.checkContentLoadComplete()) : this.onLoadFailure()
};
Spasm.TGXAssetLoader.prototype.onLoadPlatedTexture = function(n) {
    var t, i, r, u;
    Spasm.assertInstance(n, Spasm.TextureLoader);
    n.isCompleteAndOK() ? (t = n.filePath, Spasm.assertPath(t), i = n.image, Spasm.assertValid(i, Image), this.contentLoaded.platedTextures[t] = i, r = this.contentLoaders.platedTextures, u = r[t], Spasm.assertEqual(u, n), delete r[t], this.checkContentLoadComplete()) : this.onLoadFailure()
};
Spasm = Spasm || {};
Spasm.TGXBinLoader = function(n, t) {
    Spasm.BufferLoader.call(this, n, t);
    this.filePositions = []
};
Spasm.TGXBinLoader.prototype = Object.create(Spasm.BufferLoader.prototype);
Spasm.TGXBinLoader.prototype.onStateChange = function() {
    var t = this.request,
        n;
    this.isComplete() && (this.isCompleteAndOK() && (n = t.response, this.parseFileIndex(n)), this.callback(this))
};
Spasm.TGXBinLoader.prototype.parseFileIndex = function(n) {
    var c, e, a, g, v, o, s, h, y;
    Spasm.assertArrayBuffer(n);
    this.buffer = n;
    var i = !0,
        r = new DataView(n),
        p = [r.getUint8(0), r.getUint8(1), r.getUint8(2), r.getUint8(3)],
        f = "TGXM",
        tt = [f.charCodeAt(0), f.charCodeAt(1), f.charCodeAt(2), f.charCodeAt(3)];
    for (c in p) Spasm.assertEqual(p[c], tt[c]);
    var w = 16,
        t = 128,
        l = 8,
        b = r.getInt32(4, i);
    if (b === 1) t = 128;
    else if (b === 2) {
        t = 256;
        var k = t,
            it = new DataView(n, 16, k),
            d = "";
        for (e = 0; e < k; e++) a = it.getUint8(e), a !== 0 && (d += String.fromCharCode(a));
        this.fileIdentifier = d;
        w += 256
    } else Spasm.assert(!1, "unknown TGX file pack version");
    for (g = r.getInt32(8, i), v = r.getInt32(12, i), Spasm.assert(v >= 0), o = t + l + 8, Spasm.assertEqual(g, o), s = 0; s < v; s++) {
        var rt = w + o * s,
            u = new DataView(n, rt, o),
            nt = "";
        for (h = 0; h < t; h++) y = u.getUint8(h), y !== 0 && (nt += String.fromCharCode(y));
        var ut = u.getUint32(t, i),
            ft = u.getUint32(t + 4, i),
            et = ut + Math.pow(2, 32) * ft,
            ot = u.getUint32(t + l, i),
            st = u.getUint32(t + l + 4, i),
            ht = ot + Math.pow(2, 32) * st;
        this.filePositions.push({
            fileName: nt,
            fileByteOffset: et,
            fileByteSize: ht
        })
    }
};
Spasm.TGXBinLoader.prototype.getFileBuffers = function() {
    var r = this.buffer,
        u = this.filePositions,
        t, f, n;
    for (Spasm.assertArrayBuffer(r), t = {}, f = u.length, n = 0; n < f; n++) {
        var i = u[n],
            h = i.fileName,
            e = i.fileByteOffset,
            o = i.fileByteSize,
            s = r.slice(e, o + e);
        t[h] = s;
        Spasm.assertEqual(s.byteLength, o)
    }
    return t
};
Spasm = Spasm || {};
Spasm.TransformSRT = function(n, t, i) {
    n = n || 1;
    t = t || [0, 0, 0, 1];
    i = i || [0, 0, 0];
    this.scale = n;
    this.rotation = quat.create();
    this.translation = vec3.create();
    quat.copy(this.rotation, t);
    vec3.copy(this.translation, i)
};
Spasm.TransformSRT.prototype = {};
Spasm.TransformSRT.prototype.copy = function(n) {
    Spasm.assertInstance(n, Spasm.TransformSRT);
    this.scale = n.scale;
    this.rotation.copy(n.rotation);
    this.translation.copy(n.translation)
};
Spasm.TransformSRT.prototype.multiply = function(n, t) {
    Spasm.assertInstance(n, Spasm.TransformSRT);
    Spasm.assertInstance(n, Spasm.TransformSRT);
    quat.multiply(this.rotation, n.rotation, t.rotation);
    this.scale = n.scale * t.scale;
    vec3.copy(this.translation, t.translation);
    vec3.transformQuat(this.translation, this.translation, n.rotation);
    vec3.scale(this.translation, this.translation, n.scale);
    vec3.add(this.translation, this.translation, n.translation)
};
Spasm.TransformSRT.prototype.setMatrix = function(n) {
    var t = this.scale,
        i = this.translation;
    return mat4.fromQuat(n, this.rotation), mat4.scale(n, n, [t, t, t]), n[12] = i[0], n[13] = i[1], n[14] = i[2], n
};
Spasm = Spasm || {};
Spasm.Utilities = {};
Spasm.Utilities.stringEndsWith = function(n, t) {
    Spasm.assertString(n);
    Spasm.assertString(t);
    return n.indexOf(t, n.length - t.length) !== -1
};
Spasm.Utilities.jsonFromCharBuffer = function(n) {
    var i = Spasm.Utilities.stringFromCharBuffer(n),
        t = null;
    try {
        t = JSON.parse(i)
    } catch (r) {
        console.log("error parsing json from char buffer: " + r)
    }
    return t
};
Spasm.Utilities.stringFromCharBuffer = function(n) {
    var r, i, t;
    for (Spasm.assertInstance(n, Uint8Array), r = n.byteLength, i = "", t = 0; t < r; t++) i += String.fromCharCode(n[t]);
    return i
};
Spasm = Spasm || {};
Spasm.Buffer = function(n, t, i) {
    Spasm.assertWebGLContext(n);
    Spasm.assertValid(t);
    Spasm.assertInteger(i);
    this.gl = n;
    this.arrayBuffer = t;
    this.bufferType = i;
    var r = n.createBuffer();
    this.bufferHandle = r;
    n.bindBuffer(i, r);
    n.bufferData(i, t, n.STATIC_DRAW)
};
Spasm.Buffer.prototype = {
    constructor: Spasm.Buffer
};
Spasm.Buffer.prototype.bindBuffer = function() {
    var n = this.gl,
        t = this.bufferType,
        i = this.bufferHandle;
    n.bindBuffer(t, i)
};
Spasm = Spasm || {};
Spasm.GearRenderable = function(n, t) {
    Spasm.assertString(n);
    Spasm.assertArrayInstances(t, Spasm.GearRenderableModel);
    this.itemId = n;
    this.renderableModels = t
};
Spasm.GearRenderable.prototype = {};
Spasm.GearRenderable.prototype.getBoundingVolume = function() {
    var n = this.getBoundingVolumes();
    return Spasm.boundingVolumeFromBoundingVolumes(n)
};
Spasm.GearRenderable.prototype.getBoundingVolumes = function() {
    for (var i = this.renderableModels, o = i.length, r = [], t, f, e, n = 0; n < o; n++) {
        var s = i[n],
            u = s.renderables,
            h = u.length;
        for (t = 0; t < h; t++) f = u[t], e = f.boundingVolume, r.push(e)
    }
    return r
};
Spasm.GearRenderable.prototype.setGearShaders = function(n) {
    var i, r, t, u;
    for (Spasm.assertInstance(n, Spasm.GearShader), this.gearShaders = n, i = this.renderableModels, r = i.length, t = 0; t < r; t++) u = i[t], u.setGearShaders(n)
};
Spasm.GearRenderable.prototype.getResolvedDyeList = function(n, t) {
    var r, o, s, v, u, h, y, f, c, e, b, k;
    Spasm.assertValid(n);
    var l = n.defaultDyes,
        a = n.lockedDyes,
        i = {},
        d = l.length;
    for (r = 0; r < d; r++) o = l[r], i[o.slotTypeIndex] = o;
    if (t)
        for (Spasm.assertValid(t), s = t.customDyes, v = s.length, u = 0; u < v; u++) h = s[u], i[h.slotTypeIndex] = h;
    for (y = a.length, f = 0; f < y; f++) c = a[f], i[c.slotTypeIndex] = c;
    var p = Object.keys(i),
        g = p.length,
        w = [];
    for (e = 0; e < g; e++) b = p[e], k = i[b], w.push(k);
    return w
};
Spasm.GearRenderable.prototype.setGearDyes = function(n) {
    var t, r;
    Spasm.assertValid(n);
    this.gearDyes = n;
    var u = this.getResolvedDyeList(n, null),
        i = this.renderableModels,
        f = i.length;
    for (t = 0; t < f; t++) r = i[t], r.setGearDyes(u)
};
Spasm.GearRenderable.prototype.setShaderOverrideDyes = function(n) {
    var t, r;
    if (n) {
        Spasm.assertValid(n);
        this.shaderOverrideDyes = n;
        var u = this.getResolvedDyeList(this.gearDyes, n),
            i = this.renderableModels,
            f = i.length;
        for (t = 0; t < f; t++) r = i[t], r.setGearDyes(u)
    } else this.setGearDyes(this.gearDyes)
};
Spasm.GearRenderable.prototype.render = function(n, t) {
    for (var r = this.renderableModels, f = r.length, u, i = 0; i < f; i++) u = r[i], u.render(n, t)
};
Spasm.GearRenderableModel = function(n, t) {
    var u, i, r, e;
    for (Spasm.assertString(n), Spasm.assertArrayInstances(t, Spasm.Renderable), this.renderModelId = n, this.renderables = t, this.partExternalIdentifiers = {}, u = t.length, i = 0; i < u; i++) {
        var o = t[i],
            s = o.partExternalIdentifiers,
            f = Object.keys(s),
            h = f.length;
        for (r = 0; r < h; r++) e = f[r], this.partExternalIdentifiers[e] = ""
    }
    this.partExternalIdentifierCount = Object.keys(this.partExternalIdentifiers).length
};
Spasm.GearRenderableModel.prototype = {};
Spasm.GearRenderableModel.prototype.setGearShaders = function(n) {
    var i, r, t, u;
    for (Spasm.assertInstance(n, Spasm.GearShader), this.gearShaders = n, i = this.renderables, r = i.length, t = 0; t < r; t++) u = i[t], u.setGearShaders(n)
};
Spasm.GearRenderableModel.prototype.setGearDyes = function(n) {
    var i, r, t, u;
    for (Spasm.assertArrayInstances(n, Spasm.GearDye), this.gearDyes = n, i = this.renderables, r = i.length, t = 0; t < r; t++) u = i[t], u.setGearDyes(n)
};
Spasm.GearRenderableModel.prototype.render = function(n, t) {
    var r = this.renderables,
        u = null,
        f, i, e;
    for (t && (u = t[this.partExternalIdentifierCount]), f = r.length, i = 0; i < f; i++) e = r[i], e.render(n, u)
};
Spasm = Spasm || {};
Spasm.GearShader = function(n) {
    Spasm.assertWebGLContext(n);
    this.gl = n;
    var t = Spasm.Shader.InputTypes,
        i = Spasm.Shader.ValueTypes;
    this.uniforms = {
        projectionMatrix: new Spasm.ShaderInput(t.uniform, i.mat4, "u_projection_matrix"),
        modelMatrix: new Spasm.ShaderInput(t.uniform, i.mat4, "u_model_matrix"),
        viewMatrix: new Spasm.ShaderInput(t.uniform, i.mat4, "u_view_matrix"),
        positionScale: new Spasm.ShaderInput(t.uniform, i.vec3, "u_position_scale"),
        positionOffset: new Spasm.ShaderInput(t.uniform, i.vec3, "u_position_offset"),
        texcoordScale: new Spasm.ShaderInput(t.uniform, i.vec2, "u_texcoord_scale"),
        texcoordOffset: new Spasm.ShaderInput(t.uniform, i.vec2, "u_texcoord_offset"),
        skinningMatrices: new Spasm.ShaderInput(t.uniform, i.vec4, "u_skinning_matrices", 216),
        textureDiffuse: new Spasm.ShaderInput(t.uniform, i.sampler2D, "u_texture_diffuse"),
        textureNormal: new Spasm.ShaderInput(t.uniform, i.sampler2D, "u_texture_normal"),
        textureGearstack: new Spasm.ShaderInput(t.uniform, i.sampler2D, "u_texture_gearstack"),
        textureDyeDiffuse: new Spasm.ShaderInput(t.uniform, i.sampler2D, "u_texture_dye_diffuse"),
        textureDyeNormal: new Spasm.ShaderInput(t.uniform, i.sampler2D, "u_texture_dye_normal"),
        blendModeUniform: new Spasm.ShaderInput(t.uniform, i.int, "u_blend_mode"),
        changeColor: new Spasm.ShaderInput(t.uniform, i.vec4, "u_change_color"),
        decalAlphaMapTransform: new Spasm.ShaderInput(t.uniform, i.vec4, "u_decal_alpha_map_transform"),
        decalBlendOption: new Spasm.ShaderInput(t.uniform, i.int, "u_decal_blend_option"),
        detailNormalContributionStrength: new Spasm.ShaderInput(t.uniform, i.vec4, "u_detail_normal_contribution_strength"),
        detailTransform: new Spasm.ShaderInput(t.uniform, i.vec4, "u_detail_transform"),
        specularProperties: new Spasm.ShaderInput(t.uniform, i.vec4, "u_specular_properties"),
        subsurfaceScatteringStrength: new Spasm.ShaderInput(t.uniform, i.vec4, "u_subsurface_scattering_strength"),
        cameraPosition: new Spasm.ShaderInput(t.uniform, i.vec3, "u_camera_position"),
        lightPosition: new Spasm.ShaderInput(t.uniform, i.vec3, "u_light_position"),
        mutedColorDiffuse: new Spasm.ShaderInput(t.uniform, i.vec4, "u_muted_color_diffuse")
    };
    this.attributes = {
        position: new Spasm.ShaderInput(t.attribute, i.vec4, "a_position"),
        normal: new Spasm.ShaderInput(t.attribute, i.vec4, "a_normal"),
        tangent: new Spasm.ShaderInput(t.attribute, i.vec4, "a_tangent"),
        texcoord: new Spasm.ShaderInput(t.attribute, i.vec2, "a_texcoord"),
        texcoord1: new Spasm.ShaderInput(t.attribute, i.vec2, "a_texcoord1"),
        texcoord2: new Spasm.ShaderInput(t.attribute, i.vec2, "a_texcoord2"),
        blendIndices: new Spasm.ShaderInput(t.attribute, i.vec4, "a_blendindices"),
        blendWeights: new Spasm.ShaderInput(t.attribute, i.vec4, "a_blendweight")
    };
    this.varyings = {
        position: new Spasm.ShaderInput(t.varying, i.vec3, "v_position"),
        normal: new Spasm.ShaderInput(t.varying, i.vec3, "v_normal"),
        binormal: new Spasm.ShaderInput(t.varying, i.vec3, "v_binormal"),
        tangent: new Spasm.ShaderInput(t.varying, i.vec3, "v_tangent"),
        texcoord: new Spasm.ShaderInput(t.varying, i.vec2, "v_texcoord"),
        texcoord2: new Spasm.ShaderInput(t.varying, i.vec2, "v_texcoord2")
    };
    this.vertexShaders = {};
    this.vertexShaderInputs = {};
    this.fragmentShaders = {};
    this.fragmentShaderInputs = {};
    this.shaderPrograms = {};
    this.uniformDatas = {}
};
Spasm.GearShader.prototype = {};
Spasm.GearShader.prototype.getVertexShaderSourceLines = function(n, t, i) {
    var f = this.getVertexShaderInput(n, t, i),
        r = [],
        e, u, o;
    for (r.push("precision mediump float;"), r.push(""), e = f.length, u = 0; u < e; u++) o = f[u], r.push(o.declaration);
    return r.push(""), r.push("mat4 transpose(mat4 inMatrix) {vec4 i0 = inMatrix[0];vec4 i1 = inMatrix[1];vec4 i2 = inMatrix[2];vec4 i3 = inMatrix[3];mat4 outMatrix = mat4(vec4(i0.x, i1.x, i2.x, i3.x),vec4(i0.y, i1.y, i2.y, i3.y),vec4(i0.z, i1.z, i2.z, i3.z),vec4(i0.w, i1.w, i2.w, i3.w));return outMatrix;}"), r.push("mat4 get_bone_transform(int bone_index)"), r.push("{"), r.push("int stride_bone_index = bone_index * 3;"), r.push("vec4 i0 = u_skinning_matrices[stride_bone_index + 0];vec4 i1 = u_skinning_matrices[stride_bone_index + 1];vec4 i2 = u_skinning_matrices[stride_bone_index + 2];vec4 i3 = vec4(0.0, 0.0, 0.0, 1.0);"), r.push("mat4 bone_transform = mat4(vec4(i0.x, i1.x, i2.x, i3.x),vec4(i0.y, i1.y, i2.y, i3.y),vec4(i0.z, i1.z, i2.z, i3.z),vec4(i0.w, i1.w, i2.w, i3.w));return bone_transform;"), r.push("}"), r.push(""), r.push("void main()"), r.push("{"), n ? (r.push("ivec4 blend_indices = ivec4(a_blendindices);"), t ? (r.push("mat4 skinning_transform = (get_bone_transform(blend_indices[0]) * a_blendweight[0]);"), r.push("skinning_transform += (get_bone_transform(blend_indices[1]) * a_blendweight[1]);"), r.push("skinning_transform += (get_bone_transform(blend_indices[2]) * a_blendweight[2]);"), r.push("skinning_transform += (get_bone_transform(blend_indices[3]) * a_blendweight[3]);")) : (r.push("vec2 blend_weight = vec2(a_blendindices.zw)/255.0;"), r.push("mat4 skinning_transform = get_bone_transform(blend_indices[0]) * blend_weight[0];"), r.push("skinning_transform += get_bone_transform(blend_indices[1]) * blend_weight[1];"))) : (r.push("int bone_index = int((a_position.w * 32767.0) + 0.01);"), r.push("mat4 skinning_transform = get_bone_transform(bone_index);")), r.push("mat4 model_view_matrix = u_view_matrix * u_model_matrix;"), r.push("mat4 camera_matrix = u_projection_matrix * model_view_matrix;"), r.push("vec4 position_transformed = vec4((a_position.x * u_position_scale.x) + u_position_offset.x,(a_position.y * u_position_scale.y) + u_position_offset.y,(a_position.z * u_position_scale.z) + u_position_offset.z,1.0);"), r.push("vec4 position_skinned = vec4((skinning_transform * position_transformed).xyz, 1.0);"), r.push("mat3 skinning_rotation_transform = mat3(skinning_transform);"), r.push("mat3 model_view_rotation_transform = mat3(model_view_matrix);"), r.push("vec3 object_space_normal = vec3(a_normal.xyz);"), r.push("vec3 object_space_tangent = vec3(a_tangent.xyz);"), r.push("vec3 object_space_binormal = vec3(cross(object_space_normal, object_space_tangent) * a_tangent.w);"), r.push("mat3 normal_transform = skinning_rotation_transform;"), r.push("v_normal = model_view_rotation_transform * (skinning_rotation_transform * object_space_normal);"), r.push("v_tangent = model_view_rotation_transform * (skinning_rotation_transform * object_space_tangent);"), r.push("v_binormal = model_view_rotation_transform * (skinning_rotation_transform * object_space_binormal);"), r.push("vec2 texcoord = vec2((a_texcoord.x * u_texcoord_scale.x) + u_texcoord_offset.x,(a_texcoord.y * u_texcoord_scale.y) + u_texcoord_offset.y);"), r.push("v_position = (model_view_matrix * position_skinned).xyz;"), r.push("v_texcoord = texcoord;"), r.push("v_texcoord2 = ((texcoord * a_texcoord2) * u_detail_transform.xy) + u_detail_transform.zw;"), r.push("gl_Position = camera_matrix * position_skinned;"), r.push("}"), r.push(""), r
};
Spasm.GearShader.prototype.getVertexShaderInput = function(n, t, i) {
    var o = this.getVertexShaderKey(n, t, i),
        s = this.vertexShaderInputs,
        r = s[o];
    if (!r) {
        var u = this.uniforms,
            f = this.attributes,
            e = this.varyings;
        r = [];
        r.push(u.projectionMatrix);
        r.push(u.modelMatrix);
        r.push(u.viewMatrix);
        r.push(u.skinningMatrices);
        r.push(u.positionScale);
        r.push(u.positionOffset);
        r.push(u.texcoordScale);
        r.push(u.texcoordOffset);
        r.push(f.position);
        r.push(f.normal);
        r.push(f.tangent);
        r.push(f.texcoord);
        r.push(u.detailTransform);
        r.push(f.texcoord2);
        n && (r.push(f.blendIndices), t && r.push(f.blendWeights));
        r.push(e.position);
        r.push(e.normal);
        r.push(e.binormal);
        r.push(e.tangent);
        r.push(e.texcoord);
        r.push(e.texcoord2);
        s[o] = r
    }
    return r
};
Spasm.GearShader.prototype.getFragmentShaderInput = function(n, t) {
    var f = this.getFragmentShaderKey(n, t),
        e = this.fragmentShaderInputs,
        i = e[f],
        r, u;
    return i || (r = this.uniforms, u = this.varyings, i = [], t && i.push(r.mutedColorDiffuse), i.push(r.textureDiffuse), i.push(r.textureNormal), i.push(r.textureGearstack), i.push(r.changeColor), i.push(r.cameraPosition), i.push(r.lightPosition), i.push(u.position), i.push(u.normal), i.push(u.binormal), i.push(u.tangent), i.push(u.texcoord), i.push(r.textureDyeDiffuse), i.push(r.textureDyeNormal), i.push(u.texcoord2), e[f] = i), i
};
Spasm.GearShader.prototype.getFragmentShaderSourceLines = function(n, t) {
    var u = this.getFragmentShaderInput(n, t),
        i = [],
        f, r, e;
    for (i.push("precision mediump float;"), i.push(""), f = u.length, r = 0; r < f; r++) e = u[r], i.push(e.declaration);
    return i.push(""), i.push("#define saturate(value) clamp(value, 0.0, 1.0)"), i.push("const float gamma_correction_power = 2.2;"), i.push("const float gamma_correction_power_inverse = 1.0/2.2;"), i.push("vec4 blend_overlay(vec4 back, vec4 front)"), i.push("{"), i.push("return front * saturate(back * 4.0) + saturate(back - 0.25);"), i.push("}"), i.push(""), i.push("void main()"), i.push("{"), i.push("vec4 color_diffuse = pow(texture2D(u_texture_diffuse, v_texcoord), vec4(gamma_correction_power));"), i.push("vec2 normal_sample_raw = texture2D(u_texture_normal, v_texcoord).xy;"), i.push("vec2 normal_sample = normal_sample_raw;"), i.push("vec3 tangent_world_space = normalize(v_tangent);"), i.push("vec3 binormal_world_space = normalize(v_binormal);"), i.push("vec3 normal_world_space = normalize(v_normal);"), i.push("normal_sample = normal_sample * 2.0 - 1.0;"), i.push("vec4 color_dye_diffuse_texture = texture2D(u_texture_dye_diffuse, v_texcoord2);"), i.push("float dye_alpha = color_dye_diffuse_texture.w;"), i.push("float dye_color_normalize = (1.0 - dye_alpha) * 0.5;"), i.push("vec4 color_dye_diffuse = pow(vec4(color_dye_diffuse_texture.x * dye_alpha + dye_color_normalize, color_dye_diffuse_texture.y * dye_alpha + dye_color_normalize, color_dye_diffuse_texture.z * dye_alpha + dye_color_normalize, 1.0), vec4(gamma_correction_power));"), i.push("color_diffuse = blend_overlay(color_dye_diffuse, color_diffuse);"), i.push("vec4 color_dye_normal = texture2D(u_texture_dye_normal, v_texcoord2);"), i.push("color_dye_normal = color_dye_normal * 2.0 - 1.0;"), i.push("normal_sample = normal_sample + color_dye_normal.xy;"), i.push("vec4 color_gearstack = texture2D(u_texture_gearstack, v_texcoord);"), t && (i.push("color_diffuse = u_muted_color_diffuse; // vec4(0.447, 0.498, 0.465, 1.0);"), i.push("color_gearstack.r = 0.0; // = vec4(0.3, 0.3, 0.3, 1.0);")), i.push("float z = sqrt(saturate(1.0 - dot(normal_sample, normal_sample)));"), i.push("vec3 normal_tangent_space = vec3(normal_sample.x, normal_sample.y, z);"), i.push("vec3 bumpy_normal = (tangent_world_space * normal_tangent_space.x) + (binormal_world_space * normal_tangent_space.y) + (normal_world_space * normal_tangent_space.z);"), i.push("vec3 camera_direction = normalize(u_camera_position - v_position);"), i.push("float nDotL = saturate(dot(camera_direction, bumpy_normal) * (-1.0 + 2.0 * float(gl_FrontFacing)));"), i.push("vec3 reflection = (bumpy_normal * (nDotL * 2.00)) - camera_direction;"), i.push("float rDotV = max(0.0, dot(reflection, camera_direction));"), i.push("vec3 specular = saturate(vec3(0.2,0.2,0.2) * pow(rDotV, color_gearstack.g * 255.0)) * color_gearstack.g;"), i.push("vec4 blend_color_uncorrected = mix(color_diffuse,blend_overlay(color_diffuse, u_change_color),color_gearstack.r);"), i.push("vec3 blend_color = pow(blend_color_uncorrected.xyz, vec3(gamma_correction_power_inverse));"), i.push("vec3 ambient_color = 0.60 * blend_color;"), i.push("vec3 diffuse_color = 0.40 * (nDotL * blend_color);"), i.push("gl_FragColor = vec4(ambient_color + diffuse_color + specular, 1.0);"), i.push("}"), i.push(""), i
};
Spasm.GearShader.prototype.getShaderProgramKey = function(n, t, i, r) {
    Spasm.assertBoolean(n);
    Spasm.assertBoolean(t);
    Spasm.assertBoolean(i);
    Spasm.assertBoolean(r);
    Spasm.assert(t ? n : !0);
    return JSON.stringify({
        vertexShader: this.getVertexShaderKey(n, t, i),
        fragmentShader: this.getFragmentShaderKey(i, r)
    })
};
Spasm.GearShader.prototype.getVertexShaderKey = function(n, t, i) {
    Spasm.assertBoolean(n);
    Spasm.assertBoolean(t);
    Spasm.assertBoolean(i);
    Spasm.assert(t ? n : !0);
    var r = {
        hasBlendWeights: t,
        hasBlendIndices: n
    };
    return JSON.stringify(r)
};
Spasm.GearShader.prototype.getFragmentShaderKey = function(n, t) {
    Spasm.assertBoolean(n);
    Spasm.assertBoolean(t);
    var i = {
        ignoresTextures: t
    };
    return JSON.stringify(i)
};
Spasm.GearShader.prototype.getVertexShader = function(n, t, i) {
    var u = this.getVertexShaderKey(n, t, i),
        r = this.vertexShaders[u];
    if (!r) {
        var f = this.gl,
            e = this.getVertexShaderSourceLines(n, t, i),
            o = this.getVertexShaderInput(n, t, i);
        r = new Spasm.Shader(f, f.VERTEX_SHADER, e, o);
        this.vertexShaders[u] = r
    }
    return r
};
Spasm.GearShader.prototype.getFragmentShader = function(n, t) {
    var r = this.getFragmentShaderKey(n, t),
        i = this.fragmentShaders[r];
    if (!i) {
        var u = this.gl,
            f = this.getFragmentShaderSourceLines(n, t),
            e = this.getFragmentShaderInput(n, t);
        i = new Spasm.Shader(u, u.FRAGMENT_SHADER, f, e);
        this.fragmentShaders[r] = i
    }
    return i
};
Spasm.GearShader.prototype.getShaderProgram = function(n, t, i, r) {
    var o, s, f, h, c, l;
    Spasm.assertBoolean(n);
    Spasm.assertBoolean(t);
    Spasm.assertBoolean(i);
    Spasm.assertBoolean(r);
    Spasm.assert(t ? n : !0, "cannot have blend weights without blend indices");
    var a = this.gl,
        e = this.getShaderProgramKey(n, t, i, r),
        u = this.shaderPrograms[e];
    if (!u) {
        if (o = this.getVertexShader(n, t, i), s = this.getFragmentShader(i, r), u = new Spasm.ShaderProgram(a, o, s), f = this.uniformDatas, h = Object.keys(f), h.length > 0) {
            u.useProgram();
            for (c in f) l = f[c], u.setUniformData(l)
        }
        this.shaderPrograms[e] = u
    }
    return u
};
Spasm.GearShader.prototype.setUniformData = function(n) {
    var r, u, t, f, i;
    Spasm.assertInstance(n, Spasm.UniformData);
    r = n.shaderInput;
    u = r.name;
    this.uniformDatas[u] = n;
    t = this.shaderPrograms;
    for (f in t) i = t[f], i.useProgram(), i.setUniformData(n)
};
Spasm = Spasm || {};
Spasm.IndexBuffer = function(n, t, i, r) {
    Spasm.Buffer.call(this, n, t, n.ELEMENT_ARRAY_BUFFER);
    Spasm.assertInteger(i);
    Spasm.assertInteger(r);
    this.indexCount = i;
    this.elementType = r
};
Spasm.IndexBuffer.prototype = Object.create(Spasm.Buffer.prototype);
Spasm = Spasm || {};
Spasm.Renderable = function(n, t, i, r, u, f, e) {
    var a, o, v, l, s, h, k, c;
    for (Spasm.assertWebGLContext(n), Spasm.assertArrayInstances(t, Spasm.VertexBuffer), Spasm.assertInstance(i, Spasm.IndexBuffer), Spasm.assertArrayInstances(r, Spasm.UniformData), Spasm.assertArrayInstances(f, Spasm.RenderablePart), Spasm.assertInstance(e, Spasm.BoundingVolume), this.gl = n, this.vertexBuffers = t, this.indexBuffer = i, this.uniformDatas = r, this.textures = u, this.parts = f, this.boundingVolume = e, this.partExternalIdentifiers = {}, a = f.length, o = 0; o < a; o++) v = f[o], l = v.externalIdentifier, l != null && (this.partExternalIdentifiers[l] = "");
    this.gearShaders = null;
    this.gearDyes = [];
    var y = !1,
        p = !1,
        w = !1,
        d = t.length;
    for (s = 0; s < d; s++) {
        var g = t[s],
            b = g.attributes,
            nt = b.length;
        for (h = 0; h < nt; h++) k = b[h], c = k.shaderValueName, c === "a_texcoord2" ? w = !0 : c === "a_blendindices" ? y = !0 : c === "a_blendweight" && (p = !0)
    }
    this.hasTexcoord2 = w;
    this.hasBlendIndices = y;
    this.hasBlendWeights = p;
    this.assertValidVertexBuffers();
    this.assertValidIndexBuffer();
    this.assertValidParts()
};
Spasm.Renderable.prototype = {};
Spasm.Renderable.prototype.bindBuffers = function() {
    var u = this.gl,
        f = this.vertexBuffers,
        e = this.indexBuffer,
        o = this.textures,
        s, n, h, i, c, t, l, r;
    for (e.bindBuffer(), s = f.length, n = 0; n < s; n++) h = f[n], h.bindBuffer(u);
    for (e.bindBuffer(u), i = Object.keys(o), c = i.length, t = 0; t < c; t++) l = i[t], r = o[l], r && r.bindTexture()
};
Spasm.Renderable.prototype.useShaderProgram = function(n) {
    var i, r, u, t, f;
    for (Spasm.assertInstance(n, Spasm.ShaderProgram), i = this.vertexBuffers, r = this.uniformDatas, Spasm.assertArrayInstances(i, Spasm.VertexBuffer), n.useProgram(), n.bindVertexAttributes(i), u = r.length, t = 0; t < u; t++) f = r[t], n.setUniformData(f)
};
Spasm.Renderable.prototype.render = function(n, t) {
    var h = this.gearShaders,
        c, u, f, i, v, y, p, w, e, r, s, b, o, k, d;
    Spasm.assertInstance(h, Spasm.GearShader);
    this.bindBuffers();
    c = !!n;
    u = h.getShaderProgram(this.hasBlendIndices, this.hasBlendWeights, this.hasTexcoord2, c);
    this.useShaderProgram(u);
    var g = this.gl,
        l = this.parts,
        nt = this.indexBuffer.elementType,
        a = this.gearDyes,
        tt = a.length,
        it = l.length;
    for (f = 0; f < it; f++)
        if (i = l[f], v = i.isCloth, !t || v || (y = i.externalIdentifier, y in t)) {
            for (p = i.gearDyeSlot, w = i.usePrimaryColor, e = 0; e < tt; e++)
                if (r = a[e], r.slotTypeIndex === p) {
                    for (r.bindTextures(), s = r.uniformDatas, b = s.length, o = 0; o < b; o++) k = s[o], u.setUniformData(k);
                    d = w ? r.primaryColorUniformData : r.secondaryColorUniformData;
                    u.setUniformData(d)
                }
            var rt = i.primitiveType,
                ut = i.indexStart,
                ft = i.indexCount,
                et = ut * 2;
            g.drawElements(rt, ft, nt, et)
        }
    u.resetVertexAttributes()
};
Spasm.Renderable.prototype.assertValidParts = function() {
    for (var r = this.indexBuffer, t = this.parts, u = r.indexCount, f = t.length, n = 0; n < f; n++) {
        var i = t[n],
            e = i.indexStart,
            o = i.indexCount,
            s = e + o;
        Spasm.assert(s <= u)
    }
};
Spasm.Renderable.prototype.setGearShaders = function(n) {
    Spasm.assertInstance(n, Spasm.GearShader);
    this.gearShaders = n
};
Spasm.Renderable.prototype.setGearDyes = function(n) {
    Spasm.assertArrayInstances(n, Spasm.GearDye);
    this.gearDyes = n
};
Spasm.Renderable.prototype.assertValidVertexBuffers = function() {
    var t = this.vertexBuffers,
        i = t.length,
        u = t[0].vertexCount,
        n, r;
    if (i > 1)
        for (n = 1; n < i; n++) r = t[n], Spasm.assertEqual(u, r.vertexCount)
};
Spasm.Renderable.prototype.assertValidIndexBuffer = function() {
    for (var t = this.indexBuffer, r = this.vertexBuffers, u = r[0].vertexCount, f = t.indexCount, e = new Uint16Array(t.arrayBuffer), i, n = 0; n < f; n++) i = e[n], Spasm.assert(i < u)
};
Spasm = Spasm || {};
Spasm.RenderablePart = function(n, t, i, r, u, f) {
    Spasm.assertInteger(n);
    Spasm.assertInteger(t);
    Spasm.assertInteger(i);
    Spasm.assertInteger(r);
    Spasm.assertInteger(u);
    Spasm.assertBoolean(f);
    this.indexStart = n;
    this.indexCount = t;
    this.changeColorIndex = i;
    this.primitiveType = r;
    this.externalIdentifier = u;
    this.isCloth = f;
    var e = 0,
        o = !0,
        s = !1;
    switch (i) {
        case 0:
            e = 0;
            break;
        case 1:
            e = 0;
            o = !1;
            break;
        case 2:
            e = 1;
            break;
        case 3:
            e = 1;
            o = !1;
            break;
        case 4:
            e = 2;
            break;
        case 5:
            e = 2;
            o = !1;
            break;
        case 6:
            e = 3;
            s = !0;
            break;
        case 7:
            e = 3;
            s = !0;
            break;
        default:
            Spasm.assert(!1, "unsupported change color index: " + i)
    }
    this.gearDyeSlot = e;
    this.usePrimaryColor = o;
    this.useInvestmentDecal = s
};
Spasm = Spasm || {};
Spasm.Renderer = function(n) {
    Spasm.assertCanvas(n);
    this.canvas = n;
    this.renderables = [];
    this.features = new Spasm.Features(n);
    this.canRender() ? (this.gl = this.features.gl, this.initWebGL()) : this.gl = null
};
Spasm.Renderer.prototype = {
    constructor: Spasm.Renderer
};
Spasm.Renderer.prototype.canRender = function() {
    return this.features.canRender()
};
Spasm.Renderer.prototype.initWebGL = function() {
    var n = this.gl,
        i, t, r;
    if (n)
        for (Spasm.assertWebGLContext(n), this.gl = n, n.enable(n.DEPTH_TEST), n.depthFunc(n.LESS), n.disable(n.BLEND), n.blendFunc(n.SRC_ALPHA, n.ONE_MINUS_SRC_ALPHA), n.disable(n.CULL_FACE), n.cullFace(n.BACK), n.clearColor(0, 0, 0, 0), this.clearFlags = n.COLOR_BUFFER_BIT | n.DEPTH_BUFFER_BIT, n.clear(this.clearFlags), this.glTextures = [], i = 32, t = 0; t < i; t++) r = n["TEXTURE" + t], this.glTextures.push(r)
};
Spasm.Renderer.prototype.render = function() {
    var n, i;
    if (this.canRender()) {
        var r = this.gl,
            t = this.renderables,
            u = t.length;
        for (n = 0; n < u; n++) i = t[n], i.render(r)
    }
};
Spasm.Renderer.prototype.animate = function() {
    if (this.canRender()) {
        var n = this;
        window.requestAnimationFrame(function() {
            n.animate()
        });
        this.render()
    }
};
Spasm.Renderer.prototype.addRenderable = function(n) {
    Spasm.assertInstance(n, Spasm.Renderable);
    this.renderables.push(n)
};
Spasm.Renderer.prototype.getDiffusePlateTextureIndex = function() {
    return 0
};
Spasm.Renderer.prototype.getNormalPlateTextureIndex = function() {
    return 1
};
Spasm.Renderer.prototype.getGearstackPlateTextureIndex = function() {
    return 2
};
Spasm.Renderer.prototype.getDiffuseDyeTextureIndex = function() {
    return 3
};
Spasm.Renderer.prototype.getNormalDyeTextureIndex = function() {
    return 4
};
Spasm.Renderer.prototype.getDecalDyeTextureIndex = function() {
    return 5
};
Spasm = Spasm || {};
Spasm.Shader = function(n, t, i, r) {
    var e, o, f, u;
    for (Spasm.assertWebGLContext(n), Spasm.assertNumber(t), Spasm.assertArray(i), Spasm.assertArrayInstances(r, Spasm.ShaderInput), e = i.join("\n"), this.gl = n, this.type = t, this.lines = i, this.source = e, this.inputs = r, this.assertInputs(), this.uniforms = [], this.attributes = [], this.varyings = [], o = r.length, f = 0; f < o; f++) {
        u = r[f];
        switch (u.inputType) {
            case Spasm.Shader.InputTypes.uniform:
                this.uniforms.push(u);
                break;
            case Spasm.Shader.InputTypes.attribute:
                this.attributes.push(u);
                break;
            case Spasm.Shader.InputTypes.varying:
                this.varyings.push(u);
                break;
            default:
                Spasm.assert(!1)
        }
    }
    this.shader = n.createShader(t);
    Spasm.assertInstance(this.shader, WebGLShader);
    this.compile()
};
Spasm.Shader.InputTypes = {
    uniform: "uniform",
    attribute: "attribute",
    varying: "varying"
};
Spasm.Shader.ValueTypes = {
    bool: "bool",
    int: "int",
    float: "float",
    vec2: "vec2",
    vec3: "vec3",
    vec4: "vec4",
    bvec2: "bvec2",
    bvec3: "bvec3",
    bvec4: "bvec4",
    ivec2: "ivec2",
    ivec3: "ivec3",
    ivec4: "ivec4",
    mat2: "mat2",
    mat3: "mat3",
    mat4: "mat4",
    sampler2D: "sampler2D",
    samplerCube: "samplerCube"
};
Spasm.Shader.prototype = {
    constructor: Spasm.Shader
};
Spasm.Shader.prototype.compile = function() {
    var n = this.gl,
        i = this.source,
        t = this.shader;
    n.shaderSource(t, i);
    n.compileShader(t);
    this.assertCompileStatus()
};
Spasm.Shader.prototype.assertCompileStatus = function() {
    var t = this.gl,
        i = this.shader,
        n;
    if (0) {
        n = t.getShaderInfoLog(i);
        throw n;
    }
};
Spasm.Shader.prototype.assertInputs = function() {
    for (var i = this.source, t = this.inputs, r = t.length, n = 0; n < r; n++) {
        var u = t[n],
            f = u.declaration,
            e = i.indexOf(f);
        Spasm.assert(e >= 0)
    }
};
Spasm = Spasm || {};
Spasm.ShaderInput = function(n, t, i, r) {
    r = r || 1;
    Spasm.assertString(n);
    Spasm.assertString(t);
    Spasm.assertString(i);
    Spasm.assertInteger(r);
    Spasm.assert(r >= 1);
    Spasm.assert(n in Spasm.Shader.InputTypes);
    Spasm.assert(t in Spasm.Shader.ValueTypes);
    this.inputType = n;
    this.name = i;
    this.valueType = t;
    this.count = r;
    this.isArray = this.count > 1;
    this.declaration = this.inputType + " " + this.valueType + " " + this.name + (this.isArray ? "[" + this.count + "]" : "") + ";"
};
Spasm.ShaderInput.prototype = {
    constructor: Spasm.ShaderInput
};
Spasm.ShaderInput.prototype.equals = function(n) {
    Spasm.assertInstance(n, Spasm.ShaderInput);
    var t = this.inputType === n.inputType && this.name === n.name && this.valueType === n.valueType && this.count === n.count;
    return Spasm.assertEqual(t, this.declaration === n.declaration), t
};
Spasm = Spasm || {};
Spasm.ShaderProgram = function(n, t, i) {
    Spasm.assertWebGLContext(n);
    Spasm.assertInstance(t, Spasm.Shader);
    Spasm.assertInstance(i, Spasm.Shader);
    this.gl = n;
    this.vertexShader = t;
    this.fragmentShader = i;
    this.assertMatchingVaryings();
    this.program = n.createProgram();
    Spasm.assertInstance(this.program, WebGLProgram);
    this.handles = {};
    this.hasHandles = !1;
    this.link()
	
	console.log('ShaderProgram', t, i);
};
Spasm.ShaderProgram.prototype = {
    constructor: Spasm.ShaderProgram
};
Spasm.ShaderProgram.prototype.link = function() {
    var n = this.gl,
        t = this.program,
        i = this.vertexShader,
        r = this.fragmentShader;
    n.attachShader(t, i.shader);
    n.attachShader(t, r.shader);
    n.linkProgram(t)
};
Spasm.ShaderProgram.prototype.assertLinkStatus = function() {
    var t = this.gl,
        i = this.program,
        n;
    if (0) {
        n = t.getProgramInfoLog(i);
        throw n;
    }
};
Spasm.ShaderProgram.prototype.assertValidateStatus = function() {
    var n = this.gl,
        t = this.program,
        i, r;
    if (n.validateProgram(t), i = !0, !i) {
        r = n.getProgramInfoLog(t);
        throw r;
    }
};
Spasm.ShaderProgram.prototype.assertMatchingVaryings = function() {
    var e = this.vertexShader,
        o = this.fragmentShader,
        t = e.varyings,
        i = o.varyings,
        r = t.length,
        s = i.length,
        n, u, f;
    for (Spasm.assertEqual(r, s), n = 0; n < r; n++) u = t[n], f = i[n], Spasm.assert(u.equals(f))
};
Spasm.ShaderProgram.prototype.getHandles = function() {
    for (var u = this.gl, f = this.program, e = this.handles, n = this.vertexShader, s = this.fragmentShader, w = n.uniforms.length, l, i, v, r, t = 0; t < w; t++) {
        var b = n.uniforms[t],
            h = b.name,
            c = u.getUniformLocation(f, h);
        c instanceof WebGLUniformLocation && (e[h] = c)
    }
    for (l = n.attributes.length, i = 0; i < l; i++) {
        var k = n.attributes[i],
            a = k.name,
            o = u.getAttribLocation(f, a);
        Spasm.assertInteger(o);
        o >= 0 && (e[a] = o)
    }
    for (v = s.uniforms.length, r = 0; r < v; r++) {
        var d = s.uniforms[r],
            y = d.name,
            p = u.getUniformLocation(f, y);
        p instanceof WebGLUniformLocation && (e[y] = p)
    }
    this.hasHandles = !0
};
Spasm.ShaderProgram.prototype.useProgram = function() {
    var n = this.gl,
        t = this.program;
    n.useProgram(t)
};
Spasm.ShaderProgram.prototype.bindVertexAttributes = function(n) {
    var l, a, i, v, y, r, u, t, f, p, e, s, h, c;
    for (Spasm.assertArrayInstances(n, Spasm.VertexBuffer), l = this.vertexShader, this.hasHandles || this.getHandles(), a = this.handles, i = l.attributes, Spasm.assertArrayInstances(i, Spasm.ShaderInput), v = i.length, y = n.length, r = 0; r < y; r++)
        for (u = n[r], u.bindBuffer(), t = u.attributes, Spasm.assertArrayInstances(t, Spasm.VertexBufferAttribute), f = t.slice(), p = t.length, e = 0; e < p; e++) {
            var o = t[e],
                w = o.shaderValueName,
                b = o.shaderValueType;
            for (s = 0; s < v; s++)
                if (h = i[s], h.name === w && h.valueType === b) {
                    f = f.splice(f.indexOf(o), 1);
                    c = a[h.name];
                    !c && c !== 0 || u.setAttributePointer(c, o);
                    break
                }
        }
};
Spasm.ShaderProgram.prototype.resetVertexAttributes = function() {
    for (var r = this.gl, u = this.vertexShader, f = this.handles, t = u.attributes, e = t.length, n = 0; n < e; n++) {
        var o = t[n],
            s = o.name,
            i = f[s];
        i >= 0 && r.disableVertexAttribArray(i)
    }
};
Spasm.ShaderProgram.prototype.setUniformData = function(n) {
    var i;
    Spasm.assert(n, Spasm.UniformData);
    this.hasHandles || this.getHandles();
    var f = this.handles,
        u = n.shaderInput,
        r = n.data,
        e = u.name,
        o = u.valueType,
        t = f[e];
    if (t) {
        i = this.gl;
        switch (o) {
            case "mat2":
                i.uniformMatrix2fv(t, !1, r);
                break;
            case "mat3":
                i.uniformMatrix3fv(t, !1, r);
                break;
            case "mat4":
                i.uniformMatrix4fv(t, !1, r);
                break;
            case "vec2":
                i.uniform2fv(t, r);
                break;
            case "vec3":
                i.uniform3fv(t, r);
                break;
            case "vec4":
                i.uniform4fv(t, r);
                break;
            case "float":
                i.uniform1f(t, r);
                break;
            case "sampler2D":
                i.uniform1i(t, r);
                break;
            default:
                Spasm.assert(!1, "invalid or missing uniform value type")
        }
    }
};
Spasm = Spasm || {};
Spasm.UniformData = function(n, t) {
    t = t || null;
    Spasm.assertInstance(n, Spasm.ShaderInput);
    this.shaderInput = n;
    this.data = t
};
Spasm.UniformData.prototype = {};
Spasm = Spasm || {};
Spasm.SkeletonShader = function(n) {
    Spasm.assertWebGLContext(n);
    this.gl = n;
    var t = Spasm.Shader.InputTypes,
        i = Spasm.Shader.ValueTypes;
    this.uniforms = {
        projectionMatrix: new Spasm.ShaderInput(t.uniform, i.mat4, "u_projection_matrix"),
        modelMatrix: new Spasm.ShaderInput(t.uniform, i.mat4, "u_model_matrix"),
        viewMatrix: new Spasm.ShaderInput(t.uniform, i.mat4, "u_view_matrix"),
        vertexColor: new Spasm.ShaderInput(t.uniform, i.vec4, "u_vertex_color"),
        pointSize: new Spasm.ShaderInput(t.uniform, i.float, "u_point_size")
    };
    this.attributes = {
        boneIndex: new Spasm.ShaderInput(t.attribute, i.float, "a_bone_index"),
        vertexColor: new Spasm.ShaderInput(t.attribute, i.vec4, "a_vertex_color")
    };
    this.varyings = {
        vertexColor: new Spasm.ShaderInput(t.varying, i.vec4, "v_vertex_color")
    };
    this.vertexShaders = {};
    this.vertexShaderInputs = {};
    this.vertexShaderSources = {};
    this.fragmentShaders = {};
    this.fragmentShaderInputs = {};
    this.fragmentShaderSources = {};
    this.shaderPrograms = {}
};
Spasm.SkeletonShader.prototype = {};
Spasm.SkeletonShader.prototype.maxBoneCount = 72;
Spasm.SkeletonShader.prototype.getBoneTransformsUniform = function(n) {
    Spasm.assertInteger(n);
    Spasm.assert(n > 0);
    Spasm.assert(n <= this.maxBoneCount);
    var t = Spasm.Shader.InputTypes,
        i = Spasm.Shader.ValueTypes;
    return new Spasm.ShaderInput(t.uniform, i.vec4, "u_bone_transforms", n * 3)
};
Spasm.SkeletonShader.prototype.getVertexShaderKey = function(n, t) {
    Spasm.assertInteger(n);
    Spasm.assertBoolean(t);
    return "" + n + t
};
Spasm.SkeletonShader.prototype.getFragmentShaderKey = function(n) {
    Spasm.assertBoolean(n);
    return "" + n
};
Spasm.SkeletonShader.prototype.getShaderProgramKey = function(n, t) {
    Spasm.assertInteger(n);
    Spasm.assertBoolean(t);
    return "" + n + t
};
Spasm.SkeletonShader.prototype.getVertexShaderInput = function(n, t) {
    var u, i, e;
    if (Spasm.assertInteger(n), Spasm.assertBoolean(t), u = this.getVertexShaderKey(n, t), i = this.vertexShaderInputs[u], !i) {
        var r = this.uniforms,
            f = this.attributes,
            o = this.varyings;
        i = [];
        i.push(r.projectionMatrix);
        i.push(r.modelMatrix);
        i.push(r.viewMatrix);
        i.push(r.pointSize);
        e = this.getBoneTransformsUniform(n);
        i.push(e);
        t ? (i.push(f.vertexColor), i.push(o.vertexColor)) : i.push(r.vertexColor);
        i.push(f.boneIndex);
        this.vertexShaderInputs[u] = i
    }
    return i
};
Spasm.SkeletonShader.prototype.getVertexShaderSource = function(n, t) {
    var u, r, i, e, o, f, s;
    if (Spasm.assertInteger(n), Spasm.assertBoolean(t), u = this.getVertexShaderKey(n, t), r = this.vertexShaderSources[u], !r) {
        for (i = [], i.push("// Spasm.SkeletonShader vertex shader"), i.push("// key = " + u), i.push(""), i.push("precision mediump float;"), i.push(""), i.push("// inputs"), e = this.getVertexShaderInput(n, t), o = e.length, f = 0; f < o; f++) s = e[f], i.push(s.declaration);
        i.push("");
        i.push("void main()");
        i.push("{");
        i.push("// bone transform");
        i.push("int bone_index = int(a_bone_index);");
        i.push("int stride_bone_index = 3 * bone_index;");
        i.push("mat4 bone_transform = mat4(u_bone_transforms[stride_bone_index + 0],u_bone_transforms[stride_bone_index + 1],u_bone_transforms[stride_bone_index + 2],vec4(0.0, 0.0, 0.0, 1.0));");
        i.push("vec4 bone_position = vec4(bone_transform[0][3],bone_transform[1][3],bone_transform[2][3],1.0);");
        i.push("");
        i.push("// position");
        i.push("vec4 position = (u_projection_matrix * u_view_matrix * u_model_matrix) * bone_position;");
        i.push("gl_Position = position;");
        i.push("");
        i.push("gl_PointSize = u_point_size;");
        t && (i.push("v_vertex_color = a_vertex_color;"), i.push(""));
        i.push("}");
        i.push("");
        r = i.join("\n");
        this.vertexShaderSources[u] = r
    }
    return r
};
Spasm.SkeletonShader.prototype.getFragmentShaderInput = function(n) {
    var i = this.getFragmentShaderKey(n),
        t = this.fragmentShaderInputs[i],
        r, u;
    return t || (r = this.uniforms, u = this.varyings, t = [], n ? t.push(u.vertexColor) : t.push(r.vertexColor), this.fragmentShaderInputs[i] = t), t
};
Spasm.SkeletonShader.prototype.getFragmentShaderSource = function(n) {
    var u = this.getFragmentShaderKey(n),
        i = this.fragmentShaderSources[u],
        t, f, e, r, o;
    if (!i) {
        for (t = [], t.push("// Spasm.SkeletonShader fragment shader"), t.push("// key = " + u), t.push(""), t.push("precision mediump float;"), t.push(""), t.push("// inputs"), f = this.getFragmentShaderInput(n), e = f.length, r = 0; r < e; r++) o = f[r], t.push(o.declaration);
        t.push("");
        t.push("void main()");
        t.push("{");
        n ? t.push("gl_FragColor = v_vertex_color;") : t.push("gl_FragColor = u_vertex_color;");
        t.push("}");
        t.push("");
        i = t.join("\n");
        this.fragmentShaderSources[u] = i
    }
    return i
};
Spasm.SkeletonShader.prototype.getFragmentShader = function(n) {
    var i = this.getFragmentShaderKey(n),
        t = this.fragmentShaders[i];
    if (!t) {
        var u = this.getFragmentShaderInput(n),
            f = this.getFragmentShaderSource(n),
            r = this.gl;
        t = new Spasm.Shader(r, r.FRAGMENT_SHADER, f, u);
        this.fragmentShaders[i] = t
    }
    return t
};
Spasm.SkeletonShader.prototype.getVertexShader = function(n, t) {
    var r, i;
    if (Spasm.assertInteger(n), Spasm.assertBoolean(t), r = this.getVertexShaderKey(n, t), i = this.vertexShaders[r], !i) {
        var f = this.getVertexShaderInput(n, t),
            e = this.getVertexShaderSource(n, t),
            u = this.gl;
        i = new Spasm.Shader(u, u.VERTEX_SHADER, e, f);
        this.vertexShaders[r] = i
    }
    return i
};
Spasm.SkeletonShader.prototype.getShaderProgram = function(n, t) {
    var r = this.getShaderProgramKey(n, t),
        i = this.shaderPrograms[r];
    if (!i) {
        var u = this.getVertexShader(n, t),
            f = this.getFragmentShader(t),
            e = this.gl;
        i = new Spasm.ShaderProgram(e, u, f);
        this.shaderPrograms[r] = i
    }
    return i
};
Spasm = Spasm || {};
Spasm.Texture = function(n, t, i) {
    Spasm.assertWebGLContext(n);
    Spasm.assertInteger(t);
    Spasm.assertImage(i);
    Spasm.assert(t >= 0, "texture index is less than 0: " + t);
    Spasm.assert(t < 32, "texture index is greater or equal to 32: " + t);
    this.gl = n;
    this.index = t;
    this.image = i;
    this.glTextureIndex = n["TEXTURE" + t];
    Spasm.assertInteger(this.glTextureIndex);
    this.textureHandle = n.createTexture();
    this.setTextureImage()
};
Spasm.Texture.prototype = {};
Spasm.Texture.prototype.bindTexture = function() {
    var n = this.gl;
    n.activeTexture(this.glTextureIndex);
    n.bindTexture(n.TEXTURE_2D, this.textureHandle)
};
Spasm.Texture.prototype.setTextureImage = function() {
    this.bindTexture();
    var n = this.gl,
        t = this.image;
    n.texImage2D(n.TEXTURE_2D, 0, n.RGBA, n.RGBA, n.UNSIGNED_BYTE, t);
    t.width === t.height ? (n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, n.LINEAR), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, n.LINEAR_MIPMAP_NEAREST), n.generateMipmap(n.TEXTURE_2D)) : (n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, n.LINEAR), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, n.LINEAR))
};
Spasm.Texture.prototype.setTextureUniform = function(n) {
    Spasm.assertShaderUniform(n);
    this.bindTexture();
    var t = this.gl,
        i = this.index;
    t.uniform1i(n, i)
};
Spasm = Spasm || {};
Spasm.VertexBuffer = function(n, t, i, r, u) {
    Spasm.Buffer.call(this, n, t, n.ARRAY_BUFFER);
    Spasm.assertInteger(i);
    Spasm.assertInteger(r);
    Spasm.assertArrayInstances(u, Spasm.VertexBufferAttribute);
    this.vertexStride = i;
    this.vertexCount = r;
    this.attributes = u;
    Spasm.VertexBuffer.debugAssertValidBuffer(t, r, i);
    this.debugAssertValidAttributes()
};
Spasm.VertexBuffer.prototype = Object.create(Spasm.Buffer.prototype);
Spasm.VertexBuffer.debugAssertValidBuffer = function(n, t, i) {
    Spasm.assertArrayBuffer(n);
    Spasm.assertInteger(i);
    Spasm.assertInteger(t);
    var r = t * i,
        u = n.byteLength;
    Spasm.assertEqual(r, u)
};
Spasm.VertexBuffer.prototype.debugAssertValidAttributes = function() {
    var t = this.attributes,
        n;
    Spasm.assertArrayInstances(t, Spasm.VertexBufferAttribute);
    var u = this.vertexStride,
        i = 0,
        f = t.length;
    for (n = 0; n < f; n++) {
        var r = t[n],
            e = r.byteCount,
            o = r.byteOffset;
        Spasm.assertEqual(i, o);
        i += e
    }
    Spasm.assertEqual(i, u)
};
Spasm.VertexBuffer.prototype.setAttributePointer = function(n, t) {
    Spasm.assertInteger(n);
    Spasm.assertInstance(t, Spasm.VertexBufferAttribute);
    var i = this.gl,
        r = this.vertexStride,
        u = t.valueCount,
        f = t.bufferValueType,
        e = t.normalized,
        o = t.byteOffset;
    i.enableVertexAttribArray(n);
    i.vertexAttribPointer(n, u, f, e, r, o)
};
Spasm = Spasm || {};
Spasm.VertexBufferAttribute = function(n, t, i, r, u, f, e, o) {
    Spasm.assertString(n);
    Spasm.assertInteger(t);
    Spasm.assertString(i);
    Spasm.assertInteger(r);
    Spasm.assertInteger(u);
    Spasm.assertBoolean(f);
    Spasm.assertInteger(e);
    Spasm.assertInteger(o);
    this.semantic = n;
    this.semanticIndex = t;
    this.shaderValueType = i;
    this.bufferValueType = r;
    this.valueCount = u;
    this.normalized = f;
    this.byteCount = e;
    this.byteOffset = o;
    this.assertValidAttribute();
    this.shaderValueName = "a_" + n + (t > 0 ? t : "");
    this.declaration = "attribute " + i + " " + this.shaderValueName + ";"
};
Spasm.VertexBufferAttribute.prototype = {};
Spasm.VertexBufferAttribute.prototype.assertValidAttribute = function() {
    var n = this.semanticIndex,
        t = this.shaderValueType,
        i = this.bufferValueType,
        r = this.valueCount,
        u = this.byteCount,
        f = this.byteOffset;
    Spasm.assert(n >= 0);
    Spasm.assert(t in Spasm.Shader.ValueTypes);
    Spasm.assert(i >= 0);
    Spasm.assert(r >= 1);
    Spasm.assert(u >= 1);
    Spasm.assert(f >= 0)
};
Spasm = Spasm || {};
Spasm.VertexBufferMetadata = function(n, t, i) {
    Spasm.assertInteger(n);
    Spasm.assertInteger(t);
    Spasm.assertArrayInstances(i, Spasm.VertexBufferAttribute);
    this.vertexCount = n;
    this.vertexStride = t;
    this.attributes = i;
    this.assertMatchingAttributes()
};
Spasm.VertexBufferMetadata.prototype = {};
Spasm.VertexBufferMetadata.prototype.assertMatchingAttributes = function() {
    for (var u = this.vertexStride, t = this.attributes, i = 0, f = t.length, r, n = 0; n < f; n++) r = t[n], i += r.size;
    Spasm.assertEqual(i, u)
}