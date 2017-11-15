var Spasm;
(function(n) {
    "use strict";
    var t = {};
    typeof exports == "undefined" ? typeof define == "function" && typeof define.amd == "object" && define.amd ? (t.exports = {}, define(function() {
            return t.exports
        })) : t.exports = typeof window != "undefined" ? window : n : t.exports = exports,
        function(n) {
            var n1e6, floatArray, random, a, radian, vec2, vec3, vec4, mat2, mat2d, mat3, mat4, quat;
            n1e6 || (n1e6 = 1e-6);
            floatArray || (floatArray = typeof Float32Array != "undefined" ? Float32Array : Array);
            random || (random = Math.random);
            a = {};
            a.setMatrixArrayType = function(n) {
                floatArray = n
            };
            typeof n != "undefined" && (n.glMatrix = a);
            radian = Math.PI / 180;
            a.toRadian = function(n) {
                return n * radian
            };
            vec2 = {};
            vec2.create = function() {
                var array = new floatArray(2);
                return array[0] = 0, array[1] = 0, array
            };
            vec2.clone = function(source) {
                var array = new floatArray(2);
                return array[0] = source[0], array[1] = source[1], array
            };
            vec2.fromValues = function(x, y) {
                var array = new floatArray(2);
                return array[0] = x,
                    array[1] = y,
                    array
            };
            vec2.copy = function(target, source) {
                return target[0] = source[0],
                        target[1] = source[1],
                        target
            };
            vec2.set = function(target, t, i) {
                return target[0] = t, target[1] = i, target
            };
            vec2.add = function(target, a, b) {
                return target[0] = a[0] + b[0],
                    target[1] = a[1] + b[1],
                    target
            };
            vec2.subtract = function(target, t, i) {
                return target[0] = t[0] - i[0],
                    target[1] = t[1] - i[1],
                    target
            };
            vec2.sub = vec2.subtract;
            vec2.multiply = function(target, t, i) {
                return target[0] = t[0] * i[0],
                    target[1] = t[1] * i[1],
                    target
            };
            vec2.mul = vec2.multiply;
            vec2.divide = function(target, t, i) {
                return target[0] = t[0] / i[0],
                    target[1] = t[1] / i[1],
                    target
            };
            vec2.div = vec2.divide;
            vec2.min = function(target, t, i) {
                return target[0] = Math.min(t[0], i[0]),
                    target[1] = Math.min(t[1], i[1]),
                    target
            };
            vec2.max = function(target, t, i) {
                return target[0] = Math.max(t[0], i[0]),
                    target[1] = Math.max(t[1], i[1]),
                    target
            };
            vec2.scale = function(target, t, i) {
                return target[0] = t[0] * i,
                    target[1] = t[1] * i,
                    target
            };
            vec2.scaleAndAdd = function(target, t, i, r) {
                return target[0] = t[0] + i[0] * r,
                    target[1] = t[1] + i[1] * r,
                    target
            };
            vec2.distance = function(array, t) {
                var i = t[0] - array[0],
                    r = t[1] - array[1];
                return Math.sqrt(i * i + r * r)
            };
            vec2.dist = vec2.distance;
            vec2.squaredDistance = function(n, t) {
                var i = t[0] - n[0],
                    r = t[1] - n[1];
                return i * i + r * r
            };
            vec2.sqrDist = vec2.squaredDistance;
            vec2.length = function(n) {
                var t = n[0],
                    i = n[1];
                return Math.sqrt(t * t + i * i)
            };
            vec2.len = vec2.length;
            vec2.squaredLength = function(n) {
                var t = n[0],
                    i = n[1];
                return t * t + i * i
            };
            vec2.sqrLen = vec2.squaredLength;
            vec2.negate = function(n, t) {
                return n[0] = -t[0], n[1] = -t[1], n
            };
            vec2.normalize = function(n, t) {
                var r = t[0],
                    u = t[1],
                    i = r * r + u * u;
                return i > 0 && (i = 1 / Math.sqrt(i), n[0] = t[0] * i, n[1] = t[1] * i), n
            };
            vec2.dot = function(n, t) {
                return n[0] * t[0] + n[1] * t[1]
            };
            vec2.cross = function(n, t, i) {
                var r = t[0] * i[1] - t[1] * i[0];
                return n[0] = n[1] = 0, n[2] = r, n
            };
            vec2.lerp = function(n, t, i, r) {
                var u = t[0],
                    f = t[1];
                return n[0] = u + r * (i[0] - u), n[1] = f + r * (i[1] - f), n
            };
            vec2.random = function(n, t) {
                t = t || 1;
                var i = random() * 2 * Math.PI;
                return n[0] = Math.cos(i) * t, n[1] = Math.sin(i) * t, n
            };
            vec2.transformMat2 = function(n, t, i) {
                var r = t[0],
                    u = t[1];
                return n[0] = i[0] * r + i[2] * u, n[1] = i[1] * r + i[3] * u, n
            };
            vec2.transformMat2d = function(n, t, i) {
                var r = t[0],
                    u = t[1];
                return n[0] = i[0] * r + i[2] * u + i[4], n[1] = i[1] * r + i[3] * u + i[5], n
            };
            vec2.transformMat3 = function(n, t, i) {
                var r = t[0],
                    u = t[1];
                return n[0] = i[0] * r + i[3] * u + i[6], n[1] = i[1] * r + i[4] * u + i[7], n
            };
            vec2.transformMat4 = function(n, t, i) {
                var r = t[0],
                    u = t[1];
                return n[0] = i[0] * r + i[4] * u + i[12], n[1] = i[1] * r + i[5] * u + i[13], n
            };
            vec2.forEach = function() {
                var n = vec2.create();
                return function(t, i, r, u, f, e) {
                    var o, s;
                    for (i || (i = 2), r || (r = 0), s = u ? Math.min(u * i + r, t.length) : t.length, o = r; o < s; o += i) n[0] = t[o], n[1] = t[o + 1], f(n, n, e), t[o] = n[0], t[o + 1] = n[1];
                    return t
                }
            }();
            vec2.str = function(n) {
                return "vec2(" + n[0] + ", " + n[1] + ")"
            };
            typeof n != "undefined" && (n.vec2 = vec2);
            vec3 = {};
            vec3.create = function() {
                var n = new floatArray(3);
                return n[0] = 0, n[1] = 0, n[2] = 0, n
            };
            vec3.clone = function(n) {
                var t = new floatArray(3);
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t
            };
            vec3.fromValues = function(n, t, i) {
                var r = new floatArray(3);
                return r[0] = n, r[1] = t, r[2] = i, r
            };
            vec3.copy = function(n, t) {
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n
            };
            vec3.set = function(n, t, i, r) {
                return n[0] = t, n[1] = i, n[2] = r, n
            };
            vec3.add = function(n, t, i) {
                return n[0] = t[0] + i[0], n[1] = t[1] + i[1], n[2] = t[2] + i[2], n
            };
            vec3.subtract = function(n, t, i) {
                return n[0] = t[0] - i[0], n[1] = t[1] - i[1], n[2] = t[2] - i[2], n
            };
            vec3.sub = vec3.subtract;
            vec3.multiply = function(n, t, i) {
                return n[0] = t[0] * i[0], n[1] = t[1] * i[1], n[2] = t[2] * i[2], n
            };
            vec3.mul = vec3.multiply;
            vec3.divide = function(n, t, i) {
                return n[0] = t[0] / i[0], n[1] = t[1] / i[1], n[2] = t[2] / i[2], n
            };
            vec3.div = vec3.divide;
            vec3.min = function(n, t, i) {
                return n[0] = Math.min(t[0], i[0]), n[1] = Math.min(t[1], i[1]), n[2] = Math.min(t[2], i[2]), n
            };
            vec3.max = function(n, t, i) {
                return n[0] = Math.max(t[0], i[0]), n[1] = Math.max(t[1], i[1]), n[2] = Math.max(t[2], i[2]), n
            };
            vec3.scale = function(n, t, i) {
                return n[0] = t[0] * i, n[1] = t[1] * i, n[2] = t[2] * i, n
            };
            vec3.scaleAndAdd = function(n, t, i, r) {
                return n[0] = t[0] + i[0] * r, n[1] = t[1] + i[1] * r, n[2] = t[2] + i[2] * r, n
            };
            vec3.distance = function(n, t) {
                var i = t[0] - n[0],
                    r = t[1] - n[1],
                    u = t[2] - n[2];
                return Math.sqrt(i * i + r * r + u * u)
            };
            vec3.dist = vec3.distance;
            vec3.squaredDistance = function(n, t) {
                var i = t[0] - n[0],
                    r = t[1] - n[1],
                    u = t[2] - n[2];
                return i * i + r * r + u * u
            };
            vec3.sqrDist = vec3.squaredDistance;
            vec3.length = function(n) {
                var t = n[0],
                    i = n[1],
                    r = n[2];
                return Math.sqrt(t * t + i * i + r * r)
            };
            vec3.len = vec3.length;
            vec3.squaredLength = function(n) {
                var t = n[0],
                    i = n[1],
                    r = n[2];
                return t * t + i * i + r * r
            };
            vec3.sqrLen = vec3.squaredLength;
            vec3.negate = function(n, t) {
                return n[0] = -t[0], n[1] = -t[1], n[2] = -t[2], n
            };
            vec3.normalize = function(n, t) {
                var r = t[0],
                    u = t[1],
                    f = t[2],
                    i = r * r + u * u + f * f;
                return i > 0 && (i = 1 / Math.sqrt(i), n[0] = t[0] * i, n[1] = t[1] * i, n[2] = t[2] * i), n
            };
            vec3.dot = function(n, t) {
                return n[0] * t[0] + n[1] * t[1] + n[2] * t[2]
            };
            vec3.cross = function(n, t, i) {
                var r = t[0],
                    u = t[1],
                    f = t[2],
                    e = i[0],
                    o = i[1],
                    s = i[2];
                return n[0] = u * s - f * o, n[1] = f * e - r * s, n[2] = r * o - u * e, n
            };
            vec3.lerp = function(n, t, i, r) {
                var u = t[0],
                    f = t[1],
                    e = t[2];
                return n[0] = u + r * (i[0] - u), n[1] = f + r * (i[1] - f), n[2] = e + r * (i[2] - e), n
            };
            vec3.random = function(n, t) {
                t = t || 1;
                var r = random() * 2 * Math.PI,
                    i = random() * 2 - 1,
                    u = Math.sqrt(1 - i * i) * t;
                return n[0] = Math.cos(r) * u, n[1] = Math.sin(r) * u, n[2] = i * t, n
            };
            vec3.transformMat4 = function(n, t, i) {
                var r = t[0],
                    u = t[1],
                    f = t[2];
                return n[0] = i[0] * r + i[4] * u + i[8] * f + i[12], n[1] = i[1] * r + i[5] * u + i[9] * f + i[13], n[2] = i[2] * r + i[6] * u + i[10] * f + i[14], n
            };
            vec3.transformMat3 = function(n, t, i) {
                var r = t[0],
                    u = t[1],
                    f = t[2];
                return n[0] = r * i[0] + u * i[3] + f * i[6], n[1] = r * i[1] + u * i[4] + f * i[7], n[2] = r * i[2] + u * i[5] + f * i[8], n
            };
            vec3.transformQuat = function(n, t, i) {
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
            vec3.forEach = function() {
                var n = vec3.create();
                return function(t, i, r, u, f, e) {
                    var o, s;
                    for (i || (i = 3), r || (r = 0), s = u ? Math.min(u * i + r, t.length) : t.length, o = r; o < s; o += i) n[0] = t[o], n[1] = t[o + 1], n[2] = t[o + 2], f(n, n, e), t[o] = n[0], t[o + 1] = n[1], t[o + 2] = n[2];
                    return t
                }
            }();
            vec3.str = function(n) {
                return "vec3(" + n[0] + ", " + n[1] + ", " + n[2] + ")"
            };
            typeof n != "undefined" && (n.vec3 = vec3);
            vec4 = {};
            vec4.create = function() {
                var n = new floatArray(4);
                return n[0] = 0, n[1] = 0, n[2] = 0, n[3] = 0, n
            };
            vec4.clone = function(n) {
                var t = new floatArray(4);
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t
            };
            vec4.fromValues = function(n, t, i, r) {
                var u = new floatArray(4);
                return u[0] = n, u[1] = t, u[2] = i, u[3] = r, u
            };
            vec4.copy = function(n, t) {
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n
            };
            vec4.set = function(n, t, i, r, u) {
                return n[0] = t, n[1] = i, n[2] = r, n[3] = u, n
            };
            vec4.add = function(n, t, i) {
                return n[0] = t[0] + i[0], n[1] = t[1] + i[1], n[2] = t[2] + i[2], n[3] = t[3] + i[3], n
            };
            vec4.subtract = function(n, t, i) {
                return n[0] = t[0] - i[0], n[1] = t[1] - i[1], n[2] = t[2] - i[2], n[3] = t[3] - i[3], n
            };
            vec4.sub = vec4.subtract;
            vec4.multiply = function(n, t, i) {
                return n[0] = t[0] * i[0], n[1] = t[1] * i[1], n[2] = t[2] * i[2], n[3] = t[3] * i[3], n
            };
            vec4.mul = vec4.multiply;
            vec4.divide = function(n, t, i) {
                return n[0] = t[0] / i[0], n[1] = t[1] / i[1], n[2] = t[2] / i[2], n[3] = t[3] / i[3], n
            };
            vec4.div = vec4.divide;
            vec4.min = function(n, t, i) {
                return n[0] = Math.min(t[0], i[0]), n[1] = Math.min(t[1], i[1]), n[2] = Math.min(t[2], i[2]), n[3] = Math.min(t[3], i[3]), n
            };
            vec4.max = function(n, t, i) {
                return n[0] = Math.max(t[0], i[0]), n[1] = Math.max(t[1], i[1]), n[2] = Math.max(t[2], i[2]), n[3] = Math.max(t[3], i[3]), n
            };
            vec4.scale = function(n, t, i) {
                return n[0] = t[0] * i, n[1] = t[1] * i, n[2] = t[2] * i, n[3] = t[3] * i, n
            };
            vec4.scaleAndAdd = function(n, t, i, r) {
                return n[0] = t[0] + i[0] * r, n[1] = t[1] + i[1] * r, n[2] = t[2] + i[2] * r, n[3] = t[3] + i[3] * r, n
            };
            vec4.distance = function(n, t) {
                var i = t[0] - n[0],
                    r = t[1] - n[1],
                    u = t[2] - n[2],
                    f = t[3] - n[3];
                return Math.sqrt(i * i + r * r + u * u + f * f)
            };
            vec4.dist = vec4.distance;
            vec4.squaredDistance = function(n, t) {
                var i = t[0] - n[0],
                    r = t[1] - n[1],
                    u = t[2] - n[2],
                    f = t[3] - n[3];
                return i * i + r * r + u * u + f * f
            };
            vec4.sqrDist = vec4.squaredDistance;
            vec4.length = function(n) {
                var t = n[0],
                    i = n[1],
                    r = n[2],
                    u = n[3];
                return Math.sqrt(t * t + i * i + r * r + u * u)
            };
            vec4.len = vec4.length;
            vec4.squaredLength = function(n) {
                var t = n[0],
                    i = n[1],
                    r = n[2],
                    u = n[3];
                return t * t + i * i + r * r + u * u
            };
            vec4.sqrLen = vec4.squaredLength;
            vec4.negate = function(n, t) {
                return n[0] = -t[0], n[1] = -t[1], n[2] = -t[2], n[3] = -t[3], n
            };
            vec4.normalize = function(n, t) {
                var r = t[0],
                    u = t[1],
                    f = t[2],
                    e = t[3],
                    i = r * r + u * u + f * f + e * e;
                return i > 0 && (i = 1 / Math.sqrt(i), n[0] = t[0] * i, n[1] = t[1] * i, n[2] = t[2] * i, n[3] = t[3] * i), n
            };
            vec4.dot = function(n, t) {
                return n[0] * t[0] + n[1] * t[1] + n[2] * t[2] + n[3] * t[3]
            };
            vec4.lerp = function(n, t, i, r) {
                var u = t[0],
                    f = t[1],
                    e = t[2],
                    o = t[3];
                return n[0] = u + r * (i[0] - u), n[1] = f + r * (i[1] - f), n[2] = e + r * (i[2] - e), n[3] = o + r * (i[3] - o), n
            };
            vec4.random = function(n, i) {
                return i = i || 1, n[0] = random(), n[1] = random(), n[2] = random(), n[3] = random(), vec4.normalize(n, n), vec4.scale(n, n, i), n
            };
            vec4.transformMat4 = function(n, t, i) {
                var r = t[0],
                    u = t[1],
                    f = t[2],
                    e = t[3];
                return n[0] = i[0] * r + i[4] * u + i[8] * f + i[12] * e, n[1] = i[1] * r + i[5] * u + i[9] * f + i[13] * e, n[2] = i[2] * r + i[6] * u + i[10] * f + i[14] * e, n[3] = i[3] * r + i[7] * u + i[11] * f + i[15] * e, n
            };
            vec4.transformQuat = function(n, t, i) {
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
            vec4.forEach = function() {
                var n = vec4.create();
                return function(t, i, r, u, f, e) {
                    var o, s;
                    for (i || (i = 4), r || (r = 0), s = u ? Math.min(u * i + r, t.length) : t.length, o = r; o < s; o += i) n[0] = t[o], n[1] = t[o + 1], n[2] = t[o + 2], n[3] = t[o + 3], f(n, n, e), t[o] = n[0], t[o + 1] = n[1], t[o + 2] = n[2], t[o + 3] = n[3];
                    return t
                }
            }();
            vec4.str = function(n) {
                return "vec4(" + n[0] + ", " + n[1] + ", " + n[2] + ", " + n[3] + ")"
            };
            typeof n != "undefined" && (n.vec4 = vec4);
            mat2 = {};
            mat2.create = function() {
                var n = new floatArray(4);
                return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 1, n
            };
            mat2.clone = function(n) {
                var t = new floatArray(4);
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t
            };
            mat2.copy = function(n, t) {
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n
            };
            mat2.identity = function(n) {
                return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 1, n
            };
            mat2.transpose = function(n, t) {
                if (n === t) {
                    var i = t[1];
                    n[1] = t[2];
                    n[2] = i
                } else n[0] = t[0], n[1] = t[2], n[2] = t[1], n[3] = t[3];
                return n
            };
            mat2.invert = function(n, t) {
                var r = t[0],
                    u = t[1],
                    f = t[2],
                    e = t[3],
                    i = r * e - f * u;
                return i ? (i = 1 / i, n[0] = e * i, n[1] = -u * i, n[2] = -f * i, n[3] = r * i, n) : null
            };
            mat2.adjoint = function(n, t) {
                var i = t[0];
                return n[0] = t[3], n[1] = -t[1], n[2] = -t[2], n[3] = i, n
            };
            mat2.determinant = function(n) {
                return n[0] * n[3] - n[2] * n[1]
            };
            mat2.multiply = function(n, t, i) {
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
            mat2.mul = mat2.multiply;
            mat2.rotate = function(n, t, i) {
                var f = t[0],
                    e = t[1],
                    o = t[2],
                    s = t[3],
                    r = Math.sin(i),
                    u = Math.cos(i);
                return n[0] = f * u + e * r, n[1] = f * -r + e * u, n[2] = o * u + s * r, n[3] = o * -r + s * u, n
            };
            mat2.scale = function(n, t, i) {
                var f = t[0],
                    e = t[1],
                    o = t[2],
                    s = t[3],
                    r = i[0],
                    u = i[1];
                return n[0] = f * r, n[1] = e * u, n[2] = o * r, n[3] = s * u, n
            };
            mat2.str = function(n) {
                return "mat2(" + n[0] + ", " + n[1] + ", " + n[2] + ", " + n[3] + ")"
            };
            typeof n != "undefined" && (n.mat2 = mat2);
            mat2d = {};
            mat2d.create = function() {
                var n = new floatArray(6);
                return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 1, n[4] = 0, n[5] = 0, n
            };
            mat2d.clone = function(n) {
                var t = new floatArray(6);
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t
            };
            mat2d.copy = function(n, t) {
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n[4] = t[4], n[5] = t[5], n
            };
            mat2d.identity = function(n) {
                return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 1, n[4] = 0, n[5] = 0, n
            };
            mat2d.invert = function(n, t) {
                var r = t[0],
                    u = t[1],
                    f = t[2],
                    e = t[3],
                    o = t[4],
                    s = t[5],
                    i = r * e - u * f;
                return i ? (i = 1 / i, n[0] = e * i, n[1] = -u * i, n[2] = -f * i, n[3] = r * i, n[4] = (f * s - e * o) * i, n[5] = (u * o - r * s) * i, n) : null
            };
            mat2d.determinant = function(n) {
                return n[0] * n[3] - n[1] * n[2]
            };
            mat2d.multiply = function(n, t, i) {
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
            mat2d.mul = mat2d.multiply;
            mat2d.rotate = function(n, t, i) {
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
            mat2d.scale = function(n, t, i) {
                var r = i[0],
                    u = i[1];
                return n[0] = t[0] * r, n[1] = t[1] * u, n[2] = t[2] * r, n[3] = t[3] * u, n[4] = t[4] * r, n[5] = t[5] * u, n
            };
            mat2d.translate = function(n, t, i) {
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n[4] = t[4] + i[0], n[5] = t[5] + i[1], n
            };
            mat2d.str = function(n) {
                return "mat2d(" + n[0] + ", " + n[1] + ", " + n[2] + ", " + n[3] + ", " + n[4] + ", " + n[5] + ")"
            };
            typeof n != "undefined" && (n.mat2d = mat2d);
            mat3 = {};
            mat3.create = function() {
                var n = new floatArray(9);
                return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 1, n[5] = 0, n[6] = 0, n[7] = 0, n[8] = 1, n
            };
            mat3.fromMat4 = function(n, t) {
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[4], n[4] = t[5], n[5] = t[6], n[6] = t[8], n[7] = t[9], n[8] = t[10], n
            };
            mat3.clone = function(n) {
                var t = new floatArray(9);
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], t
            };
            mat3.copy = function(n, t) {
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n[4] = t[4], n[5] = t[5], n[6] = t[6], n[7] = t[7], n[8] = t[8], n
            };
            mat3.identity = function(n) {
                return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 1, n[5] = 0, n[6] = 0, n[7] = 0, n[8] = 1, n
            };
            mat3.transpose = function(n, t) {
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
            mat3.invert = function(n, t) {
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
            mat3.adjoint = function(n, t) {
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
            mat3.determinant = function(n) {
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
            mat3.multiply = function(n, t, i) {
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
            mat3.mul = mat3.multiply;
            mat3.translate = function(n, t, i) {
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
            mat3.rotate = function(n, t, i) {
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
            mat3.scale = function(n, t, i) {
                var r = i[0],
                    u = i[1];
                return n[0] = r * t[0], n[1] = r * t[1], n[2] = r * t[2], n[3] = u * t[3], n[4] = u * t[4], n[5] = u * t[5], n[6] = t[6], n[7] = t[7], n[8] = t[8], n
            };
            mat3.fromMat2d = function(n, t) {
                return n[0] = t[0], n[1] = t[1], n[2] = 0, n[3] = t[2], n[4] = t[3], n[5] = 0, n[6] = t[4], n[7] = t[5], n[8] = 1, n
            };
            mat3.fromQuat = function(n, t) {
                var x = t[0],
                    y = t[1],
                    z = t[2],
                    w = t[3],
                    xx = x + x,
                    yy = y + y,
                    zz = z + z,
                    x2x = x * xx,
                    y2x = y * xx,
                    y2y = y * yy,
                    z2x = z * xx,
                    z2y = z * yy,
                    z2z = z * zz,
                    w2x = w * xx,
                    w2y = w * yy,
                    w2z = w2y * zz;
                return n[0] = 1 - y2y - z2z,
                        n[3] = y2x - w2z,
                        n[6] = z2x + w2y,
                        n[1] = y2x + w2z,
                        n[4] = 1 - x2x - z2z,
                        n[7] = z2y - w2x,
                        n[2] = z2x - w2y,
                        n[5] = z2y + w2x,
                        n[8] = 1 - x2x - y2y,
                        n
            };
            mat3.normalFromMat4 = function(n, t) {
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
            mat3.str = function(n) {
                return "mat3(" + n[0] + ", " + n[1] + ", " + n[2] + ", " + n[3] + ", " + n[4] + ", " + n[5] + ", " + n[6] + ", " + n[7] + ", " + n[8] + ")"
            };
            typeof n != "undefined" && (n.mat3 = mat3);
            mat4 = {};
            mat4.create = function() {
                var n = new floatArray(16);
                return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = 1, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = 1, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n
            };
            mat4.clone = function(n) {
                var t = new floatArray(16);
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], t[9] = n[9], t[10] = n[10], t[11] = n[11], t[12] = n[12], t[13] = n[13], t[14] = n[14], t[15] = n[15], t
            };
            mat4.copy = function(n, t) {
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n[4] = t[4], n[5] = t[5], n[6] = t[6], n[7] = t[7], n[8] = t[8], n[9] = t[9], n[10] = t[10], n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n
            };
            mat4.identity = function(n) {
                return n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = 1, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = 1, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n
            };
            mat4.transpose = function(n, t) {
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
            mat4.invert = function(n, t) {
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
            mat4.adjoint = function(n, t) {
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
            mat4.determinant = function(n) {
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
            mat4.multiply = function(n, t, i) {
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
            mat4.mul = mat4.multiply;
            mat4.translate = function(n, t, i) {
                var o = i[0],
                    s = i[1],
                    h = i[2],
                    c, l, a, r, v, y, p, u, w, b, k, f, d, g, nt, e;
                return c = t[0], l = t[1], a = t[2], r = t[3], v = t[4], y = t[5], p = t[6], u = t[7], w = t[8], b = t[9], k = t[10], f = t[11], d = t[12], g = t[13], nt = t[14], e = t[15], n[0] = c + r * o, n[1] = l + r * s, n[2] = a + r * h, n[3] = r, n[4] = v + u * o, n[5] = y + u * s, n[6] = p + u * h, n[7] = u, n[8] = w + f * o, n[9] = b + f * s, n[10] = k + f * h, n[11] = f, n[12] = d + e * o, n[13] = g + e * s, n[14] = nt + e * h, n[15] = e, n
            };
            mat4.scale = function(n, t, i) {
                var r = i[0],
                    u = i[1],
                    f = i[2];
                return n[0] = t[0] * r, n[1] = t[1] * r, n[2] = t[2] * r, n[3] = t[3] * r, n[4] = t[4] * u, n[5] = t[5] * u, n[6] = t[6] * u, n[7] = t[7] * u, n[8] = t[8] * f, n[9] = t[9] * f, n[10] = t[10] * f, n[11] = t[11] * f, n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n
            };
            mat4.rotate = function(n, t, i, r) {
                var u = r[0],
                    f = r[1],
                    e = r[2],
                    h = Math.sqrt(u * u + f * f + e * e),
                    s, c, o, nt, tt, it, rt, ut, ft, et, ot, st, ht, ct, lt, a, v, y, p, w, b, k, d, g;
                return Math.abs(h) < n1e6 ? null : (h = 1 / h, u *= h, f *= h, e *= h, s = Math.sin(i), c = Math.cos(i), o = 1 - c, nt = t[0], tt = t[1], it = t[2], rt = t[3], ut = t[4], ft = t[5], et = t[6], ot = t[7], st = t[8], ht = t[9], ct = t[10], lt = t[11], a = u * u * o + c, v = f * u * o + e * s, y = e * u * o - f * s, p = u * f * o - e * s, w = f * f * o + c, b = e * f * o + u * s, k = u * e * o + f * s, d = f * e * o - u * s, g = e * e * o + c, n[0] = nt * a + ut * v + st * y, n[1] = tt * a + ft * v + ht * y, n[2] = it * a + et * v + ct * y, n[3] = rt * a + ot * v + lt * y, n[4] = nt * p + ut * w + st * b, n[5] = tt * p + ft * w + ht * b, n[6] = it * p + et * w + ct * b, n[7] = rt * p + ot * w + lt * b, n[8] = nt * k + ut * d + st * g, n[9] = tt * k + ft * d + ht * g, n[10] = it * k + et * d + ct * g, n[11] = rt * k + ot * d + lt * g, t !== n && (n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15]), n)
            };
            mat4.rotateX = function(n, t, i) {
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
            mat4.rotateY = function(n, t, i) {
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
            mat4.rotateZ = function(n, t, i) {
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
            mat4.fromRotationTranslation = function(n, t, i) {
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
            mat4.fromQuat = function(n, quat) {
                var x = quat[0],
                    y = quat[1],
                    z = quat[2],
                    w = quat[3],
                    xx = x + x,
                    yy = y + y,
                    zz = z + z,
                    x2x = x * xx,
                    y2x = y * xx,
                    y2y = y * yy,
                    z2x = z * xx,
                    z2y = z * yy,
                    z2z = z * zz,
                    w2x = w * xx,
                    w2y = w * yy,
                    w2z = w * zz;
                return n[0] = 1 - y2y - z2z, n[1] = y2x + w2z, n[2] = z2x - w2y, n[3] = 0,
                        n[4] = y2x - w2z, n[5] = 1 - x2x - z2z, n[6] = z2y + w2x, n[7] = 0,
                        n[8] = z2x + w2y, n[9] = z2y - w2x, n[10] = 1 - x2x - y2y, n[11] = 0,
                        n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1,
                        n
            };
            mat4.frustum = function(n, t, i, r, u, f, e) {
                var o = 1 / (i - t),
                    s = 1 / (u - r),
                    h = 1 / (f - e);
                return n[0] = f * 2 * o, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = f * 2 * s, n[6] = 0, n[7] = 0, n[8] = (i + t) * o, n[9] = (u + r) * s, n[10] = (e + f) * h, n[11] = -1, n[12] = 0, n[13] = 0, n[14] = e * f * 2 * h, n[15] = 0, n
            };
            mat4.perspective = function(n, t, i, r, u) {
                var f = 1 / Math.tan(t / 2),
                    e = 1 / (r - u);
                return n[0] = f / i, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = f, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = (u + r) * e, n[11] = -1, n[12] = 0, n[13] = 0, n[14] = 2 * u * r * e, n[15] = 0, n
            };
            mat4.ortho = function(n, t, i, r, u, f, e) {
                var o = 1 / (t - i),
                    s = 1 / (r - u),
                    h = 1 / (f - e);
                return n[0] = -2 * o, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = -2 * s, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = 2 * h, n[11] = 0, n[12] = (t + i) * o, n[13] = (u + r) * s, n[14] = (e + f) * h, n[15] = 1, n
            };
            mat4.lookAt = function(n, t, i, r) {
                var h, c, a, v, y, p, e, o, s, u, w = t[0],
                    b = t[1],
                    k = t[2],
                    d = r[0],
                    g = r[1],
                    nt = r[2],
                    tt = i[0],
                    it = i[1],
                    rt = i[2];
                return Math.abs(w - tt) < n1e6 && Math.abs(b - it) < n1e6 && Math.abs(k - rt) < n1e6 ? mat4.identity(n) : (e = w - tt, o = b - it, s = k - rt, u = 1 / Math.sqrt(e * e + o * o + s * s), e *= u, o *= u, s *= u, h = g * s - nt * o, c = nt * e - d * s, a = d * o - g * e, u = Math.sqrt(h * h + c * c + a * a), u ? (u = 1 / u, h *= u, c *= u, a *= u) : (h = 0, c = 0, a = 0), v = o * a - s * c, y = s * h - e * a, p = e * c - o * h, u = Math.sqrt(v * v + y * y + p * p), u ? (u = 1 / u, v *= u, y *= u, p *= u) : (v = 0, y = 0, p = 0), n[0] = h, n[1] = v, n[2] = e, n[3] = 0, n[4] = c, n[5] = y, n[6] = o, n[7] = 0, n[8] = a, n[9] = p, n[10] = s, n[11] = 0, n[12] = -(h * w + c * b + a * k), n[13] = -(v * w + y * b + p * k), n[14] = -(e * w + o * b + s * k), n[15] = 1, n)
            };
            mat4.str = function(n) {
                return "mat4(" + n[0] + ", " + n[1] + ", " + n[2] + ", " + n[3] + ", " + n[4] + ", " + n[5] + ", " + n[6] + ", " + n[7] + ", " + n[8] + ", " + n[9] + ", " + n[10] + ", " + n[11] + ", " + n[12] + ", " + n[13] + ", " + n[14] + ", " + n[15] + ")"
            };
            typeof n != "undefined" && (n.mat4 = mat4);

            quat = {};
            quat.create = function() {
                var n = new floatArray(4);
                return n[0] = 0, n[1] = 0, n[2] = 0, n[3] = 1, n
            };
            quat.rotationTo = function() {
                var n = vec3.create(),
                    t = vec3.fromValues(1, 0, 0),
                    r = vec3.fromValues(0, 1, 0);
                return function(f, e, o) {
                    var s = vec3.dot(e, o);
                    return s < -.999999 ? (vec3.cross(n, t, e), vec3.length(n) < 1e-6 && vec3.cross(n, r, e), vec3.normalize(n, n), quat.setAxisAngle(f, n, Math.PI), f) : s > .999999 ? (f[0] = 0, f[1] = 0, f[2] = 0, f[3] = 1, f) : (vec3.cross(n, e, o), f[0] = n[0], f[1] = n[1], f[2] = n[2], f[3] = 1 + s, quat.normalize(f, f))
                }
            }();
            quat.setAxes = function() {
                var n = mat3.create();
                return function(t, i, r, f) {
                    return n[0] = r[0], n[3] = r[1], n[6] = r[2], n[1] = f[0], n[4] = f[1], n[7] = f[2], n[2] = -i[0], n[5] = -i[1], n[8] = -i[2], quat.normalize(t, quat.fromMat3(t, n))
                }
            }();
            quat.clone = vec4.clone;
            quat.fromValues = vec4.fromValues;
            quat.copy = vec4.copy;
            quat.set = vec4.set;
            quat.identity = function(n) {
                return n[0] = 0, n[1] = 0, n[2] = 0, n[3] = 1, n
            };
            quat.setAxisAngle = function(n, t, i) {
                i = i * .5;
                var r = Math.sin(i);
                return n[0] = r * t[0], n[1] = r * t[1], n[2] = r * t[2], n[3] = Math.cos(i), n
            };
            quat.add = vec4.add;
            quat.multiply = function(n, t, i) {
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
            quat.mul = quat.multiply;
            quat.scale = vec4.scale;
            quat.rotateX = function(n, t, i) {
                i *= .5;
                var f = t[0],
                    e = t[1],
                    o = t[2],
                    s = t[3],
                    r = Math.sin(i),
                    u = Math.cos(i);
                return n[0] = f * u + s * r, n[1] = e * u + o * r, n[2] = o * u - e * r, n[3] = s * u - f * r, n
            };
            quat.rotateY = function(n, t, i) {
                i *= .5;
                var f = t[0],
                    e = t[1],
                    o = t[2],
                    s = t[3],
                    r = Math.sin(i),
                    u = Math.cos(i);
                return n[0] = f * u - o * r, n[1] = e * u + s * r, n[2] = o * u + f * r, n[3] = s * u - e * r, n
            };
            quat.rotateZ = function(n, t, i) {
                i *= .5;
                var f = t[0],
                    e = t[1],
                    o = t[2],
                    s = t[3],
                    r = Math.sin(i),
                    u = Math.cos(i);
                return n[0] = f * u + e * r, n[1] = e * u - f * r, n[2] = o * u + s * r, n[3] = s * u - o * r, n
            };
            quat.calculateW = function(n, t) {
                var i = t[0],
                    r = t[1],
                    u = t[2];
                return n[0] = i, n[1] = r, n[2] = u, n[3] = -Math.sqrt(Math.abs(1 - i * i - r * r - u * u)), n
            };
            quat.dot = vec4.dot;
            quat.lerp = vec4.lerp;
            quat.slerp = function(n, t, i, r) {
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
            quat.invert = function(n, t) {
                var r = t[0],
                    u = t[1],
                    f = t[2],
                    e = t[3],
                    o = r * r + u * u + f * f + e * e,
                    i = o ? 1 / o : 0;
                return n[0] = -r * i, n[1] = -u * i, n[2] = -f * i, n[3] = e * i, n
            };
            quat.conjugate = function(n, t) {
                return n[0] = -t[0], n[1] = -t[1], n[2] = -t[2], n[3] = t[3], n
            };
            quat.length = vec4.length;
            quat.len = quat.length;
            quat.squaredLength = vec4.squaredLength;
            quat.sqrLen = quat.squaredLength;
            quat.normalize = vec4.normalize;
            quat.fromMat3 = function(n, t) {
                var e = t[0] + t[4] + t[8],
                    i, r, u, f;
                return e > 0 ? (i = Math.sqrt(e + 1), n[3] = .5 * i, i = .5 / i, n[0] = (t[7] - t[5]) * i, n[1] = (t[2] - t[6]) * i, n[2] = (t[3] - t[1]) * i) : (r = 0, t[4] > t[0] && (r = 1), t[8] > t[r * 3 + r] && (r = 2), u = (r + 1) % 3, f = (r + 2) % 3, i = Math.sqrt(t[r * 3 + r] - t[u * 3 + u] - t[f * 3 + f] + 1), n[r] = .5 * i, i = .5 / i, n[3] = (t[f * 3 + u] - t[u * 3 + f]) * i, n[u] = (t[u * 3 + r] + t[r * 3 + u]) * i, n[f] = (t[f * 3 + r] + t[r * 3 + f]) * i), n
            };
            quat.str = function(n) {
                return "quat(" + n[0] + ", " + n[1] + ", " + n[2] + ", " + n[3] + ")"
            };
            typeof n != "undefined" && (n.quat = quat)
        }(t.exports)
})(this);