var Bnet;
(function(n) {
    "use strict";
    var t = {},
        i = Math.max,
        r = Math.min;
    t.c = {};
    t.c.d = n(document);
    t.c.t = function(n) {
        return n.originalEvent.touches.length - 1
    };
    t.o = function() {
        var i = this;
        this.o = null;
        this.$ = null;
        this.i = null;
        this.g = null;
        this.v = null;
        this.cv = null;
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.$c = null;
        this.c = null;
        this.t = 0;
        this.isInit = !1;
        this.fgColor = null;
        this.pColor = null;
        this.dH = null;
        this.cH = null;
        this.eH = null;
        this.rH = null;
        this.scale = 1;
        this.relative = !1;
        this.relativeWidth = !1;
        this.relativeHeight = !1;
        this.$div = null;
        this.run = function() {
            var t = function(n, t) {
                var r;
                for (r in t) i.o[r] = t[r];
                i._carve().init();
                i._configure()._draw()
            };
            if (!this.$.data("kontroled")) {
                if (this.$.data("kontroled", !0), this.extend(), this.o = n.extend({
                        min: this.$.data("min") !== undefined ? this.$.data("min") : 0,
                        max: this.$.data("max") !== undefined ? this.$.data("max") : 100,
                        stopper: !0,
                        readOnly: this.$.data("readonly") || this.$.attr("readonly") === "readonly",
                        cursor: this.$.data("cursor") === !0 && 30 || this.$.data("cursor") || 0,
                        thickness: this.$.data("thickness") && Math.max(Math.min(this.$.data("thickness"), 1), .01) || .35,
                        lineCap: this.$.data("linecap") || "butt",
                        width: this.$.data("width") || 200,
                        height: this.$.data("height") || 200,
                        displayInput: this.$.data("displayinput") == null || this.$.data("displayinput"),
                        displayPrevious: this.$.data("displayprevious"),
                        fgColor: this.$.data("fgcolor") || "#87CEEB",
                        inputColor: this.$.data("inputcolor"),
                        font: this.$.data("font") || "Arial",
                        fontWeight: this.$.data("font-weight") || "bold",
                        inline: !1,
                        step: this.$.data("step") || 1,
                        rotation: this.$.data("rotation"),
                        draw: null,
                        change: null,
                        cancel: null,
                        release: null,
                        format: function(n) {
                            return n
                        },
                        parse: function(n) {
                            return parseFloat(n)
                        }
                    }, this.o), this.o.flip = this.o.rotation === "anticlockwise" || this.o.rotation === "acw", this.o.inputColor || (this.o.inputColor = this.o.fgColor), this.$.is("fieldset") ? (this.v = {}, this.i = this.$.find("input"), this.i.each(function(t) {
                        var r = n(this);
                        i.i[t] = r;
                        i.v[t] = i.o.parse(r.val());
                        r.bind("change blur", function() {
                            var n = {};
                            n[t] = r.val();
                            i.val(n)
                        })
                    }), this.$.find("legend").remove()) : (this.i = this.$, this.v = this.o.parse(this.$.val()), this.v === "" && (this.v = this.o.min), this.$.bind("change blur", function() {
                        i.val(i._validate(i.o.parse(i.$.val())))
                    })), this.o.displayInput || this.$.hide(), this.$c = n(document.createElement("canvas")).attr({
                        width: this.o.width,
                        height: this.o.height
                    }), this.$div = n('<div style="' + (this.o.inline ? "display:inline;" : "") + "width:" + this.o.width + "px;height:" + this.o.height + 'px;"><\/div>'), this.$.wrap(this.$div).before(this.$c), this.$div = this.$.parent(), typeof G_vmlCanvasManager != "undefined" && G_vmlCanvasManager.initElement(this.$c[0]), this.c = this.$c[0].getContext ? this.$c[0].getContext("2d") : null, !this.c) throw {
                    name: "CanvasNotSupportedException",
                    message: "Canvas not supported. Please use excanvas on IE8.0.",
                    toString: function() {
                        return this.name + ": " + this.message
                    }
                };
                return this.scale = (window.devicePixelRatio || 1) / (this.c.webkitBackingStorePixelRatio || this.c.mozBackingStorePixelRatio || this.c.msBackingStorePixelRatio || this.c.oBackingStorePixelRatio || this.c.backingStorePixelRatio || 1), this.relativeWidth = this.o.width % 1 != 0 && this.o.width.indexOf("%"), this.relativeHeight = this.o.height % 1 != 0 && this.o.height.indexOf("%"), this.relative = this.relativeWidth || this.relativeHeight, this._carve(), this.v instanceof Object ? (this.cv = {}, this.copy(this.v, this.cv)) : this.cv = this.v, this.$.bind("configure", t).parent().bind("configure", t), this._listen()._configure()._xy().init(), this.isInit = !0, this.$.val(this.o.format(this.v)), this._draw(), this
            }
        };
        this._carve = function() {
            if (this.relative) {
                var n = this.relativeWidth ? this.$div.parent().width() * parseInt(this.o.width) / 100 : this.$div.parent().width(),
                    t = this.relativeHeight ? this.$div.parent().height() * parseInt(this.o.height) / 100 : this.$div.parent().height();
                this.w = this.h = Math.min(n, t)
            } else this.w = this.o.width, this.h = this.o.height;
            return this.$div.css({
                width: this.w + "px",
                height: this.h + "px"
            }), this.$c.attr({
                width: this.w,
                height: this.h
            }), this.scale !== 1 && (this.$c[0].width = this.$c[0].width * this.scale, this.$c[0].height = this.$c[0].height * this.scale, this.$c.width(this.w), this.$c.height(this.h)), this
        };
        this._draw = function() {
            var n = !0;
            i.g = i.c;
            i.clear();
            i.dH && (n = i.dH());
            n !== !1 && i.draw()
        };
        this._touch = function(n) {
            var r = function(n) {
                var t = i.xy2val(n.originalEvent.touches[i.t].pageX, n.originalEvent.touches[i.t].pageY);
                t != i.cv && (i.cH && i.cH(t) === !1 || (i.change(i._validate(t)), i._draw()))
            };
            return this.t = t.c.t(n), r(n), t.c.d.bind("touchmove.k", r).bind("touchend.k", function() {
                t.c.d.unbind("touchmove.k touchend.k");
                i.val(i.cv)
            }), this
        };
        this._mouse = function(n) {
            var r = function(n) {
                var t = i.xy2val(n.pageX, n.pageY);
                t != i.cv && (i.cH && i.cH(t) === !1 || (i.change(i._validate(t)), i._draw()))
            };
            return r(n), t.c.d.bind("mousemove.k", r).bind("keyup.k", function(n) {
                if (n.keyCode === 27) {
                    if (t.c.d.unbind("mouseup.k mousemove.k keyup.k"), i.eH && i.eH() === !1) return;
                    i.cancel()
                }
            }).bind("mouseup.k", function() {
                t.c.d.unbind("mousemove.k mouseup.k keyup.k");
                i.val(i.cv)
            }), this
        };
        this._xy = function() {
            var n = this.$c.offset();
            return this.x = n.left, this.y = n.top, this
        };
        this._listen = function() {
            return this.o.readOnly ? this.$.attr("readonly", "readonly") : (this.$c.bind("mousedown", function(n) {
                n.preventDefault();
                i._xy()._mouse(n)
            }).bind("touchstart", function(n) {
                n.preventDefault();
                i._xy()._touch(n)
            }), this.listen()), this.relative && n(window).resize(function() {
                i._carve().init();
                i._draw()
            }), this
        };
        this._configure = function() {
            return this.o.draw && (this.dH = this.o.draw), this.o.change && (this.cH = this.o.change), this.o.cancel && (this.eH = this.o.cancel), this.o.release && (this.rH = this.o.release), this.o.displayPrevious ? (this.pColor = this.h2rgba(this.o.fgColor, "0.4"), this.fgColor = this.h2rgba(this.o.fgColor, "0.6")) : this.fgColor = this.o.fgColor, this
        };
        this._clear = function() {
            this.$c[0].width = this.$c[0].width
        };
        this._validate = function(n) {
            return ~~((n < 0 ? -.5 : .5) + n / this.o.step) * this.o.step
        };
        this.listen = function() {};
        this.extend = function() {};
        this.init = function() {};
        this.change = function() {};
        this.val = function() {};
        this.xy2val = function() {};
        this.draw = function() {};
        this.clear = function() {
            this._clear()
        };
        this.h2rgba = function(n, t) {
            var i;
            return n = n.substring(1, 7), i = [parseInt(n.substring(0, 2), 16), parseInt(n.substring(2, 4), 16), parseInt(n.substring(4, 6), 16)], "rgba(" + i[0] + "," + i[1] + "," + i[2] + "," + t + ")"
        };
        this.copy = function(n, t) {
            for (var i in n) t[i] = n[i]
        }
    };
    t.Dial = function() {
        t.o.call(this);
        this.startAngle = null;
        this.xy = null;
        this.radius = null;
        this.lineWidth = null;
        this.cursorExt = null;
        this.w2 = null;
        this.PI2 = 2 * Math.PI;
        this.extend = function() {
            this.o = n.extend({
                bgColor: this.$.data("bgcolor") || "#EEEEEE",
                angleOffset: this.$.data("angleoffset") || 0,
                angleArc: this.$.data("anglearc") || 360,
                inline: !0
            }, this.o)
        };
        this.val = function(n, t) {
            if (null != n) {
                if (n = this.o.parse(n), t !== !1 && n != this.v && this.rH && this.rH(n) === !1) return;
                this.cv = this.o.stopper ? i(r(n, this.o.max), this.o.min) : n;
                this.v = this.cv;
                this.$.val(this.o.format(this.v));
                this._draw()
            } else return this.v
        };
        this.xy2val = function(n, t) {
            var u, f;
            return u = Math.atan2(n - (this.x + this.w2), -(t - this.y - this.w2)) - this.angleOffset, this.o.flip && (u = this.angleArc - u - this.PI2), this.angleArc != this.PI2 && u < 0 && u > -.5 ? u = 0 : u < 0 && (u += this.PI2), f = ~~(.5 + u * (this.o.max - this.o.min) / this.angleArc) + this.o.min, this.o.stopper && (f = i(r(f, this.o.max), this.o.min)), f
        };
        this.listen = function() {
            var t = this,
                u, e, h = function(n) {
                    n.preventDefault();
                    var o = n.originalEvent,
                        s = o.detail || o.wheelDeltaX,
                        h = o.detail || o.wheelDeltaY,
                        f = t._validate(t.o.parse(t.$.val())) + (s > 0 || h > 0 ? t.o.step : s < 0 || h < 0 ? -t.o.step : 0);
                    f = i(r(f, t.o.max), t.o.min);
                    t.val(f, !1);
                    t.rH && (clearTimeout(u), u = setTimeout(function() {
                        t.rH(f);
                        u = null
                    }, 100), e || (e = setTimeout(function() {
                        u && t.rH(f);
                        e = null
                    }, 200)))
                },
                o, f, s = 1,
                c = {
                    37: -t.o.step,
                    38: t.o.step,
                    39: t.o.step,
                    40: -t.o.step
                };
            this.$.bind("keydown", function(u) {
                var e = u.keyCode,
                    h;
                e >= 96 && e <= 105 && (e = u.keyCode = e - 48);
                o = parseInt(String.fromCharCode(e));
                isNaN(o) && (e !== 13 && e !== 8 && e !== 9 && e !== 189 && (e !== 190 || t.$.val().match(/\./)) && u.preventDefault(), n.inArray(e, [37, 38, 39, 40]) > -1 && (u.preventDefault(), h = t.o.parse(t.$.val()) + c[e] * s, t.o.stopper && (h = i(r(h, t.o.max), t.o.min)), t.change(h), t._draw(), f = window.setTimeout(function() {
                    s *= 2
                }, 30)))
            }).bind("keyup", function() {
                isNaN(o) ? f && (window.clearTimeout(f), f = null, s = 1, t.val(t.$.val())) : t.$.val() > t.o.max && t.$.val(t.o.max) || t.$.val() < t.o.min && t.$.val(t.o.min)
            });
            this.$c.bind("mousewheel DOMMouseScroll", h);
            this.$.bind("mousewheel DOMMouseScroll", h)
        };
        this.init = function() {
            (this.v < this.o.min || this.v > this.o.max) && (this.v = this.o.min);
            this.$.val(this.v);
            this.w2 = this.w / 2;
            this.cursorExt = this.o.cursor / 100;
            this.xy = this.w2 * this.scale;
            this.lineWidth = this.xy * this.o.thickness;
            this.lineCap = this.o.lineCap;
            this.radius = this.xy - this.lineWidth / 2;
            this.o.angleOffset && (this.o.angleOffset = isNaN(this.o.angleOffset) ? 0 : this.o.angleOffset);
            this.o.angleArc && (this.o.angleArc = isNaN(this.o.angleArc) ? this.PI2 : this.o.angleArc);
            this.angleOffset = this.o.angleOffset * Math.PI / 180;
            this.angleArc = this.o.angleArc * Math.PI / 180;
            this.startAngle = 1.5 * Math.PI + this.angleOffset;
            this.endAngle = 1.5 * Math.PI + this.angleOffset + this.angleArc;
            var n = i(String(Math.abs(this.o.max)).length, String(Math.abs(this.o.min)).length, 2) + 2;
            this.o.displayInput && this.i.css({
                width: (this.w / 2 + 4 >> 0) + "px",
                height: (this.w / 3 >> 0) + "px",
                position: "absolute",
                "vertical-align": "middle",
                "margin-top": (this.w / 3 >> 0) + "px",
                "margin-left": "-" + (this.w * 3 / 4 + 2 >> 0) + "px",
                border: 0,
                background: "none",
                font: this.o.fontWeight + " " + (this.w / n >> 0) + "px " + this.o.font,
                "text-align": "center",
                color: this.o.inputColor || this.o.fgColor,
                padding: "0px",
                "-webkit-appearance": "none"
            }) || this.i.css({
                width: "0px",
                visibility: "hidden"
            })
        };
        this.change = function(n) {
            this.cv = n;
            this.$.val(this.o.format(n))
        };
        this.angle = function(n) {
            return (n - this.o.min) * this.angleArc / (this.o.max - this.o.min)
        };
        this.arc = function(n) {
            var t, i;
            return n = this.angle(n), this.o.flip ? (t = this.endAngle + 1e-5, i = t - n - 1e-5) : (t = this.startAngle - 1e-5, i = t + n + 1e-5), this.o.cursor && (t = i - this.cursorExt) && (i = i + this.cursorExt), {
                s: t,
                e: i,
                d: this.o.flip && !this.o.cursor
            }
        };
        this.draw = function() {
            var n = this.g,
                i = this.arc(this.cv),
                t, r = 1;
            n.lineWidth = this.lineWidth;
            n.lineCap = this.lineCap;
            n.beginPath();
            n.strokeStyle = this.o.bgColor;
            n.arc(this.xy, this.xy, this.radius, this.endAngle - 1e-5, this.startAngle + 1e-5, !0);
            n.stroke();
            this.o.displayPrevious && (t = this.arc(this.v), n.beginPath(), n.strokeStyle = this.pColor, n.arc(this.xy, this.xy, this.radius, t.s, t.e, t.d), n.stroke(), r = this.cv == this.v);
            n.beginPath();
            n.strokeStyle = r ? this.o.fgColor : this.fgColor;
            n.arc(this.xy, this.xy, this.radius, i.s, i.e, i.d);
            n.stroke()
        };
        this.cancel = function() {
            this.val(this.v)
        }
    };
    n.fn.dial = n.fn.knob = function(i) {
        return this.each(function() {
            var r = new t.Dial;
            r.o = i;
            r.$ = n(this);
            r.run()
        }).parent()
    }
})(jQuery),
function() {
    var n = function(n, t, i, r, u) {
        this.onAnimate = function() {};
        this.isMuted = !1;
        this.$loadDial = null;
        this.replacementItemIds = [];
        this.focusedItemReferenceId = null;
        this.centeredItemReferenceId = null;
        this.renderWithHelmet = !0;
        this._destinyAccount = null;
        this._membershipType = n;
        this._membershipId = t;
        this._characterId = i;
        this._isHunter = !1;
        this._classItemReferenceId = null;
        this._canvas = r;
        this._animation = u;
        this._itemPreview = null
    };
    n.prototype.init = function() {
        this.loadAccount()
    };
    n.prototype.loadAccount = function() {
        var n = this,
            t;
        (this._itemPreview = new Spasm.ItemPreview(this._canvas, "/"), this._animation && (this._itemPreview.animationFilePath = this._animation), this._itemPreview.setAnimation(), t = this._itemPreview.renderer.canRender(), t) && bungieNetPlatform.destinyService.GetAccountSummary(this._membershipType, this._membershipId, !0, function(t) {
            t && (n.destinyAccount = t, n.loadReplacementItems(function() {
                n.loadCharacter()
            }))
        }, function(n) {
            Bnet.error("error loading destiny account");
            Bnet.error(n.errorMessage)
        })
    };
    n.prototype.setFocusedItemReferenceId = function(n) {
        this.focusedItemReferenceId = n
    };
    n.prototype.setCenteredItemReferenceId = function(n) {
        this.centeredItemReferenceId = n
    };
    n.prototype.loadReplacementItems = function(n) {
        var u = this,
            f = this.replacementItemIds.length,
            t, i, r;
        if (f > 0)
            for (t = 0, i = this.replacementItemIds.length; t < i; t++) r = this.replacementItemIds[t], bungieNetPlatform.destinyService.GetDestinySingleDefinition("InventoryItem", r, !1, bungieNetPlatform.platformSettings.contentVersion, function(t) {
                var i = t.data.inventoryItem;
                u.destinyAccount.definitions.items[i.itemHash] = i;
                n()
            }, function() {
                Bnet.error("error loading replacement item definition")
            });
        else n()
    };
    n.prototype.loadCharacter = function() {
        for (var s = this, rt = s.destinyAccount.data, r = s.destinyAccount.definitions, w = rt.characters, b = [], h = [], c = {}, k = null, l = null, a, e, d, i, nt, tt, o, vt, u = 0; u < w.length; u++) a = w[u], a.characterBase.characterId === this._characterId && (l = a);
        if (l != null) {
            var f = l.characterBase,
                ut = f.peerView,
                t = ut.equipment,
                v = t.length;
            for (this._isHunter = f.classType === Globals.DestinyClass.Hunter, this._itemPreview.setGenderType(f.genderType), this._itemPreview.setClassHash(f.classHash), this.focusedItemReferenceId && this._itemPreview.setFocusedItemReferenceId(this.focusedItemReferenceId), this.centeredItemReferenceId && this._itemPreview.setCenteredItemReferenceId(this.centeredItemReferenceId), e = 0, d = this.replacementItemIds.length; e < d; e++) {
                var g = this.replacementItemIds[e],
                    ft = r.items[g],
                    et = ft.bucketTypeHash;
                for (i = 0; i < v; i++) {
                    var ot = t[i],
                        st = r.items[ot.itemHash],
                        ht = st.bucketTypeHash;
                    et === ht && t.splice(i, 1, {
                        itemHash: g
                    })
                }
            }
            for (v = t.length, nt = {
                    BUCKET_HEAD: !0,
                    BUCKET_ARMS: !0,
                    BUCKET_CHEST: !0,
                    BUCKET_LEGS: !0,
                    BUCKET_CLASS_ITEMS: !0
                }, tt = "BUCKET_SHADER", o = 0; o < v; o++) {
                var ct = t[o],
                    n = ct.itemHash,
                    it = r.items[n],
                    lt = it.bucketTypeHash,
                    at = r.buckets[lt],
                    y = !1,
                    p = at.bucketIdentifier;
                p === "BUCKET_CLASS_ITEMS" && (this._classItemReferenceId = "" + n);
                p in nt ? (b.push("" + n), h.push("" + n), y = !0) : p == tt && (h.push("" + n), k = it, y = !0);
                y && (vt = !1, bungieNetPlatform.destinyService.GetDestinySingleDefinition("GearAsset", n, !1, bungieNetPlatform.platformSettings.contentVersion, function(n) {
                    var i, r;
                    if (n) {
                        var t = n.data,
                            u = t.gearAsset,
                            f = t.requestedId;
                        c["" + f] = u;
                        i = Object.keys(c);
                        r = i.length;
                        r === h.length && s.showCharacter(b, c, k)
                    } else Bnet.error("no response for item definition")
                }, function(n) {
                    Bnet.error("error loading equipment item definition");
                    Bnet.error(n.errorMessage)
                }))
            }
        }
    };
    n.prototype.showCharacter = function(n, t, i) {
        var r = this,
            f, u, e;
        if (this._isHunter && this._classItemReferenceId !== null && (this._itemPreview.setVariantItemReferenceIds([this._classItemReferenceId]), this._itemPreview.setRenderWithHelmet(this.renderWithHelmet)), this.$loadDial && (this.$loadDial.knob({
                width: 183,
                height: 183,
                thickness: .13,
                displayInput: !0,
                bgColor: "rgba(0,0,0,0)",
                fgColor: "#f5f5f5",
                draw: function() {
                    $(".guardianDialWrapper").addClass("active");
                    this.i.addClass("active");
                    $(this.i).val(this.cv + "%")
                }
            }), this._itemPreview.loadProgressCallback = function() {
                var n = r._itemPreview.totalLoadProgress,
                    i = n.loaded + n.loading,
                    t = n.loaded / i * 100;
                r.$loadDial.val(t).trigger("change");
                t >= 98 && r.$loadDial.parent().fadeOut(250)
            }), this.isMuted) {
            for (f = {}, u = 0, e = n.length; u < e; u++) f[n[u]] = "";
            this._itemPreview.setItemReferenceIdsWithMutedItems(n, null, null, f, t, function(n) {
                n ? (r._itemPreview.startAnimating(), r.onAnimate()) : Bnet.error("error loading item preview")
            })
        } else this._itemPreview.setItemReferenceIds(n, null, i, t, function(n) {
            n ? (r._itemPreview.startAnimating(), r.onAnimate()) : Bnet.error("error loading item preview")
        })
    };
    window.SpasmCharacter = n
}(),
function(n) {
    var t = function() {
        function n(n, t, i) {
            this.canvas = n;
            this.percentage = t;
            this.context = this.canvas.getContext("2d");
            var r = {
                x: 0,
                y: 0,
                width: this.canvas.width,
                height: this.canvas.height,
                backgroundColor: "rgba(255,255,255,0.1)",
                fillColor: "rgba(255,255,255,1)",
                borderColor: "rgba(255,255,255,1)",
                centerInner: !0,
                duration: 1e3
            };
            this.options = $.extend({}, r, i)
        }
        return Object.defineProperty(n.prototype, "innerWidth", {
            get: function() {
                return Math.floor(this.options.width * .8)
            },
            enumerable: !0,
            configurable: !0
        }), Object.defineProperty(n.prototype, "innerHeight", {
            get: function() {
                return Math.floor(this.options.height * .8)
            },
            enumerable: !0,
            configurable: !0
        }), Object.defineProperty(n.prototype, "innerX", {
            get: function() {
                var n = this.options.centerInner ? this.options.x : 0;
                return (this.options.width - this.innerWidth) / 2 + n
            },
            enumerable: !0,
            configurable: !0
        }), Object.defineProperty(n.prototype, "innerY", {
            get: function() {
                var n = this.options.centerInner ? this.options.y : 0;
                return (this.options.height - this.innerHeight) / 2 + n
            },
            enumerable: !0,
            configurable: !0
        }), n.prototype.ease = function(n) {
            return n < .5 ? 4 * n * n * n : (n - 1) * (2 * n - 2) * (2 * n - 2) + 1
        }, n.prototype.drawStatic = function() {
            this.reset();
            this.drawToPct(this.percentage)
        }, n.prototype.drawAnimate = function() {
            this.reset();
            this.animate()
        }, n.prototype.getTime = function() {
            return window.performance != undefined ? window.performance.now() : Date.now()
        }, n.prototype.reset = function() {
            this.setCornerCoords();
            this.drawReset();
            this.animationStartTime = this.getTime()
        }, n.prototype.animate = function() {
            var i = this,
                r = window.performance != undefined ? window.performance.now() : Date.now(),
                u = r - this.animationStartTime,
                n = this.ease(u / this.options.duration),
                t;
            if (n >= 1) {
                this.drawToPct(this.percentage);
                return
            }
            t = n * this.percentage;
            this.drawToPct(t);
            requestAnimationFrame(function() {
                i.animate()
            })
        }, n.prototype.getOuterPointFromPct = function(n) {
            for (var t = this.options.width, u = this.options.height, c = this.options.x, l = this.options.y, s = (t + u) * 2, f = s * n, e = [t, t + u, t * 2 + u, s], h = -1, o = 0, i, r; f > h && o < 4;) h = e[o], o++;
            i = -1;
            r = -1;
            switch (o) {
                case 1:
                    i = f;
                    r = 0;
                    break;
                case 2:
                    i = t;
                    r = f - e[0];
                    break;
                case 3:
                    i = t - (f - e[1]);
                    r = u;
                    break;
                case 4:
                    i = 0;
                    r = u - (f - e[2])
            }
            return {
                x: c + i,
                y: l + r
            }
        }, n.prototype.limitPtToInner = function(n) {
            var u = this.innerWidth,
                f = this.innerHeight,
                i = this.innerX,
                r = this.innerY,
                t = {
                    x: n.x,
                    y: n.y
                };
            return n.x <= i ? t.x = i : n.x >= i + u && (t.x = i + u), n.y <= r ? t.y = r : n.y >= r + f && (t.y = r + f), t
        }, n.prototype.setCornerCoords = function() {
            var n = this.options.x,
                t = this.options.y,
                u = this.options.width,
                f = this.options.height,
                i = this.innerX,
                r = this.innerY,
                e = this.innerWidth,
                o = this.innerHeight;
            this.cornersOuter = {
                corner0: {
                    x: n,
                    y: t
                },
                corner1: {
                    x: u + n,
                    y: t
                },
                corner2: {
                    x: u + n,
                    y: f + t
                },
                corner3: {
                    x: n,
                    y: f + t
                }
            };
            this.cornersInner = {
                corner0: {
                    x: i,
                    y: r
                },
                corner1: {
                    x: e + i,
                    y: r
                },
                corner2: {
                    x: e + i,
                    y: o + r
                },
                corner3: {
                    x: i,
                    y: o + r
                }
            }
        }, n.prototype.getCoordsForSide = function(n) {
            var t = this.cornersOuter,
                i = this.cornersInner,
                r = [];
            switch (n) {
                case 1:
                    r = [i.corner0, t.corner0, t.corner1, i.corner1];
                    break;
                case 2:
                    r = [i.corner1, t.corner1, t.corner2, i.corner2];
                    break;
                case 3:
                    r = [i.corner2, t.corner2, t.corner3, i.corner3];
                    break;
                case 4:
                    r = [i.corner3, t.corner3, t.corner0, i.corner0]
            }
            return r
        }, n.prototype.drawSide = function(n, t) {
            var i = this.context;
            typeof n != "undefined" && (i.lineWidth = 1, i.beginPath(), i.moveTo(n[0].x, n[0].y), i.lineTo(n[1].x, n[1].y), i.lineTo(n[2].x, n[2].y), i.lineTo(n[3].x, n[3].y), i.closePath(), i.strokeStyle = this.options.borderColor, i.stroke(), i.fillStyle = t, i.fill())
        }, n.prototype.drawPartialSide = function(n) {
            if (!(n <= 0)) {
                var u = Math.ceil(n * 4),
                    t = this.getCoordsForSide(u),
                    i = this.getOuterPointFromPct(n),
                    r = this.limitPtToInner(i);
                typeof t != "undefined" && (t[2] = {
                    x: i.x,
                    y: i.y
                }, t[3] = {
                    x: r.x,
                    y: r.y
                });
                this.drawSide(t, this.options.fillColor)
            }
        }, n.prototype.drawToPct = function(n) {
            for (var t = Math.ceil(n * 4) - 1, i, r; t > 0;) i = t--, r = this.getCoordsForSide(i), this.drawSide(r, this.options.fillColor);
            this.drawPartialSide(n)
        }, n.prototype.drawReset = function() {
            var n = this.context,
                i = this.canvas,
                t, r;
            for (n.clearRect(0, 0, i.width, i.height), n.lineWidth = 1, n.rect(this.options.x, this.options.y, this.options.width, this.options.height), n.rect(this.innerX, this.innerY, this.innerWidth, this.innerHeight), n.strokeStyle = this.options.borderColor, n.stroke(), t = 1; t < 5; t++) r = this.getCoordsForSide(t), this.drawSide(r, this.options.backgroundColor)
        }, n
    }();
    n.SquareProgress = t
}(Bnet || (Bnet = {})),
function(n) {
    var t;
    (function(t) {
        $(document).on("ready newPageCreated", function() {
            var i;
            $(window).unbind(".vendors");
            $(document).unbind(".vendors");
            $("*").unbind(".vendors");
            n.Site.PageController.Instance.allowSamePathname = !0;
            $("body.Featured").length || (n.Site.PageController.Instance.startLoading = t.Common.startLoading, n.Site.PageController.Instance.stopLoading = t.Common.stopLoading, n.Site.PageController.Instance.scrollToTopOnAjaxLoad = !1);
            var r = n.Site.OnPageMembership.destinyMembershipType,
                u = n.Site.OnPageMembership.destinyMembershipId,
                f = n.Site.OnPageMembership.characterId,
                e = window.ONPAGE_MEMBERSHIP_INFO ? window.ONPAGE_MEMBERSHIP_INFO.vendorHash : 0,
                o = new t.Common(r, u, f, e);
            o.initialize();
            i = new n.Site.PageInitialization;
            i.add("body.FeaturedItem", function() {
                return new t.ItemDetail(r, u, f, e)
            });
            i.add("body:not(.FeaturedItem)", function() {
                return new t.Category(r, u, f, e)
            });
            i.add("body.Eververse", function() {
                return new t.Eververse
            });
            i.initializePages()
        })
    })(t = n.Vendors || (n.Vendors = {}))
}(Bnet || (Bnet = {})),
function(n) {
    var t;
    (function(t) {
        var i = function() {
            function i(n, t, i, r) {
                this.membershipType = n;
                this.membershipId = t;
                this.characterId = i;
                this.vendorHash = r
            }
            return i.prototype.initialize = function() {
                window.REQUESTED_ITEM_INDEX != undefined && window.REQUESTED_ITEM_INDEX !== 0 && this.openRequestedItem();
                var n = new t.VendorList;
                n.initialize()
            }, i.prototype.addListeners = function() {}, i.prototype.openRequestedItem = function() {
                var n, t = n;
                this.openVendorItem(t)
            }, i.prototype.openVendorItem = function(t) {
                var i = new n.VendorItemDetail(this.membershipType, this.membershipId, this.characterId, null, "0", this.vendorHash, t);
                i.initialize()
            }, i
        }();
        t.Category = i
    })(t = n.Vendors || (n.Vendors = {}))
}(Bnet || (Bnet = {})),
function(n) {
    var t;
    (function(t) {
        var i = function() {
            function i(n, t, i, r) {
                this.membershipType = n;
                this.membershipId = t;
                this.characterId = i;
                this.vendorHash = r;
                this.scrollBackgroundOnScroll = !0;
                this.scrollElementBackground = null
            }
            return i.prototype.initialize = function() {
                var n, i;
                $(document).unbind("vendors");
                $("*").unbind("vendors");
                this.scrollTop();
                this.showRep();
                this.addListeners();
                n = new t.Tooltips;
                n.initialize();
                i = new t.FilterBar;
                i.initialize()
            }, i.prototype.addListeners = function() {
                var n = this;
                $(window).on("load resize", function() {
                    n.fixVendorsMainHeight()
                });
                $(".vendor-sale-item").not("[data-vendorsaleitemindex='-1'], .no-modal").on("click", function(t) {
                    var i = $(t.currentTarget).data("vendorsaleitemindex"),
                        r = $(t.currentTarget).data("itemhash");
                    n.openVendorItem(i, r)
                })
            }, i.prototype.scrollTop = function() {
                $(window).scrollTop(0)
            }, i.prototype.fixVendorsMainHeight = function() {
                var n = $(".vendor-sidebar").height();
                $("#vendor-container").css("min-height", n)
            }, i.prototype.openVendorItem = function(t, i) {
                var r = new n.VendorItemDetail(this.membershipType, this.membershipId, this.characterId, i, "0", this.vendorHash, t);
                r.initialize()
            }, i.prototype.showRep = function() {
                var t = $(".vendor-progress"),
                    i, r;
                t.length && (i = t.data("value") / t.data("max"), r = new n.SquareProgress(t[0], i, {
                    borderColor: "rgba(0,0,0,0)"
                }), r.drawAnimate())
            }, i.startLoading = function() {
                $("#vendor-container-wrapper").addClass("loading").destinyLoader({
                    startOnInit: !0,
                    fadeSpeed: 250,
                    delayBeforeAppear: 100,
                    top: 100,
                    background: !1
                })
            }, i.stopLoading = function() {
                $("#vendor-container-wrapper").removeClass("loading").destinyLoader("stop")
            }, i
        }();
        t.Common = i
    })(t = n.Vendors || (n.Vendors = {}))
}(Bnet || (Bnet = {})),
function(n) {
    var t;
    (function(n) {
        var t = function() {
            function n() {}
            return n.prototype.initialize = function() {
                this.addListeners()
            }, n.prototype.addListeners = function() {
                var n = this;
                if ($("body.Eververse").length !== 0) {
                    $(".vendor-fiction").on("click", function() {
                        n.showEververseCards();
                        $(document).on("click.everversecards", "#eververse-card-container .card", function(n) {
                            $(n.currentTarget).toggleClass("flip")
                        });
                        $(document).on("click.everversecards", "#eververse-card-container .card-prev", function() {
                            n.nextPrevEververseCard(-1)
                        });
                        $(document).on("click.everversecards", "#eververse-card-container .card-next", function() {
                            n.nextPrevEververseCard(1)
                        })
                    });
                    $(".sign-in-3d").on("click", function() {
                        SignIn.showSignInAlert(Localizer.Vendors.signintopreview)
                    });
                    $("[data-identifier='ITEM_SILVER']").on("click", function(n) {
                        if (!$(n.currentTarget).parents("a").length) {
                            var t = $(".silver-help").attr("href");
                            t !== "" && window.open(t, "_blank")
                        }
                    });
                    $("[data-identifier='ITEM_SILVER'] a").on("click", function(n) {
                        n.preventDefault()
                    })
                }
            }, n.prototype.showEververseCards = function() {
                var t = $("#eververse-cards-html").html(),
                    i = $(t),
                    n = new SimpleDialog(i);
                n.includeCloseButton = !1;
                n.destroyOnClose = !0;
                n.forceAutoWidth = !0;
                n.forceAutoHeight = !0;
                n.onClose = function() {
                    $(document).unbind(".everversecards")
                };
                n.Init()
            }, n.prototype.nextPrevEververseCard = function(n) {
                var r, t, i;
                n = n || 1;
                $("#eververse-card-container").addClass("swapping");
                setTimeout(function() {
                    $("#eververse-card-container").removeClass("swapping")
                }, 500);
                setTimeout(function() {
                    $("#eververse-card-container .card").removeClass("start")
                }, 500);
                r = $("#eververse-card-container .card.on");
                t = r.next(".card");
                t = t.length ? t : $("#eververse-card-container .card:first");
                i = r.prev(".card");
                i = i.length ? i : $("#eververse-card-container .card:last");
                switch (n) {
                    case -1:
                        i.addClass("on").siblings().removeClass("on");
                        setTimeout(function() {
                            var n = parseInt(r.css("z-index")) || 1;
                            i.css("z-index", n + 1)
                        }, 100);
                        break;
                    case 1:
                    default:
                        t.addClass("on").siblings().removeClass("on");
                        setTimeout(function() {
                            var n = parseInt(r.css("z-index")) || 1;
                            t.css("z-index", n + 1)
                        }, 100)
                }
                $(".sign-in-3d").css("z-index", parseInt($(".sign-in-3d").css("z-index")) + 1)
            }, n
        }();
        n.Eververse = t
    })(t = n.Vendors || (n.Vendors = {}))
}(Bnet || (Bnet = {})),
function(n) {
    var t;
    (function(n) {
        var t = function() {
            function n() {}
            return n.prototype.initialize = function() {
                this.addEventListeners()
            }, n.prototype.addEventListeners = function() {
                var n = this;
                $(".character-switcher .character-item").on("click", function(t) {
                    n.selectCharacterItem($(t.currentTarget))
                })
            }, n.prototype.selectCharacterItem = function(n) {
                $(".character-switcher").prepend(n)
            }, n
        }();
        n.FilterBar = t
    })(t = n.Vendors || (n.Vendors = {}))
}(Bnet || (Bnet = {})),
function(n) {
    var t;
    (function(n) {
        var t = function() {
            function n(n, t, i, r) {
                this.membershipType = n;
                this.membershipId = t;
                this.characterId = i;
                this.vendorHash = r
            }
            return n.prototype.initialize = function() {
                this.show3DFeaturedItemCharacter();
                this.activateSlideIndex(0)
            }, n.prototype.addListeners = function() {
                var n = this;
                $(window).on("resize", function() {
                    $("body.FeaturedItem").length && n.resize3DCharacterCanvas()
                });
                if (Modernizr.mobile) $(".FeaturedItem .slideshow .slide.active video.autoplay").attr("controls", "true").on("play", function(n) {
                    $(n.currentTarget).attr("controls", "false")
                });
                $(".slideshow-controls > .control").on("click", function(t) {
                    var i = $(t.currentTarget)[0],
                        r = $(".slideshow-controls > .control").index(i);
                    n.activateSlideIndex(r)
                });
                $(".charactersList a").on("click", function(t) {
                    return t.preventDefault(), n.switch3DCharacter($(t.currentTarget)), !1
                });
                $(".multi-cost-select").on("change", function() {
                    var n = $(".multi-cost-select option:selected").data("index"),
                        t = $(this).siblings(".cost[data-index='" + n + "']");
                    t.addClass("active").siblings(".cost").removeClass("active")
                })
            }, n.prototype.selectCharacterItem = function(n) {
                $(".character-switcher").prepend(n)
            }, n.prototype.show3DFeaturedItemCharacter = function(n) {
                var t;
                if (n === void 0 && (n = null), $(".character-3d-model").length) {
                    n = n || this.characterId;
                    var i = this.membershipId,
                        r = this.membershipType,
                        u = window.PUBLIC_MODE || !1;
                    this.resize3DCharacterCanvas();
                    t = new SpasmCharacter(r, i, n, $("canvas")[0], ANIMATION_PATH);
                    t.$loadDial = $(".guardian-dial");
                    REQUESTED_ITEM_HASH && (t.replacementItemIds = [REQUESTED_ITEM_HASH]);
                    t.onAnimate = function() {
                        $(".character-3d-model").destinyLoader("stop")
                    };
                    t.isMuted = u;
                    t.renderWithHelmet = !1;
                    t.init()
                }
            }, n.prototype.resize3DCharacterCanvas = function() {
                if ($(".character-3d-model").length) {
                    var n = $("canvas"),
                        t = n[0];
                    t.height = n.parent().height() * n.data("heightratio");
                    t.width = n.parent().width() * n.data("widthratio")
                }
            }, n.prototype.activateSlideIndex = function(n) {
                var t = $(".FeaturedItem .slideshow .slide").eq(n),
                    i;
                t.addClass("active").siblings().removeClass("active");
                t.hasClass("video") && t.find("video.autoplay").length && (i = t.find("video.autoplay")[0], i.play());
                $(".slideshow-controls .control").eq(n).addClass("active").siblings().removeClass("active")
            }, n.prototype.switch3DCharacter = function(n) {
                var t = n.data("characterid");
                this.show3DFeaturedItemCharacter(t);
                $(".charactersList").prepend(n);
                $(".character-3d-model").destinyLoader({
                    startOnInit: !0,
                    destroyOnStop: !0,
                    background: !1
                })
            }, n
        }();
        n.ItemDetail = t
    })(t = n.Vendors || (n.Vendors = {}))
}(Bnet || (Bnet = {})),
function(n) {
    var t;
    (function(n) {
        var t = function() {
            function n() {}
            return n.prototype.initialize = function() {
                this.addEventListeners()
            }, n.prototype.addEventListeners = function() {
                var n = this;
                $(".vendor-list-item:not(.on)").on("click.vendors", function(t) {
                    n.onVendorListItemClick(t)
                });
                $("#vendor-search").on("keyup", function(t) {
                    n.onVendorSearchKeyUp(t)
                })
            }, n.prototype.onVendorListItemClick = function(n) {
                n.which === 1 && this.vendorSelect($(n.currentTarget))
            }, n.prototype.onVendorSearchKeyUp = function(n) {
                var t = $.trim($(n.currentTarget).val().toLowerCase());
                this.searchVendors(t)
            }, n.prototype.searchVendors = function(n) {
                $("#vendor-list .sectionHeader").toggleClass("hidden", n.length > 0);
                $("#vendor-list .vendor-list-item").each(function(t, i) {
                    var r = $(".standardTitle", i).text().toLowerCase();
                    $(i).toggleClass("hidden", !r.match(n))
                });
                var t = $("#vendor-list .vendor-list-item:not(.hidden)").length > 0;
                $(".vendor-sidebar .none-found").toggleClass("hidden", t)
            }, n.prototype.vendorSelect = function(n) {
                n.addClass("on").siblings().removeClass("on")
            }, n
        }();
        n.VendorList = t
    })(t = n.Vendors || (n.Vendors = {}))
}(Bnet || (Bnet = {})),
function(n) {
    var t;
    (function(n) {
        var t = function() {
            function n() {}
            return n.prototype.initialize = function() {
                $(".FeaturedItem .destinyTooltip").each(function(n, t) {
                    if (!$(t).parents(".vendor-sale-block").length) {
                        var i = new DestinyTooltip($(t));
                        i.init()
                    }
                });
                $(".filterBar .destinyTooltip").each(function(n, t) {
                    var i = new DestinyTooltip($(t));
                    i.init()
                });
                $(".sectionBanner .destinyTooltip").each(function(n, t) {
                    var i = new DestinyTooltip($(t));
                    i.tooltipHorizontalOffset = 250;
                    i.init()
                });
                $("body:not(.Eververse) #vendor-container .destinyTooltip").each(function(n, t) {
                    var i = new DestinyTooltip($(t));
                    i.$wrapper = $("#vendor-container");
                    i.init()
                })
            }, n
        }();
        n.Tooltips = t
    })(t = n.Vendors || (n.Vendors = {}))
}(Bnet || (Bnet = {}))