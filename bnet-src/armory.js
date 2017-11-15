var Armory, ArmoryDetail, PerkSuggestions;
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
})(jQuery);
Armory = function() {
	this.Initialize()
};
Armory.prototype.Initialize = function() {
	this.controller = new Armory.Controller;
	this.view = new Armory.View;
	this.view.Initialize()
};
Armory.Controller = function() {};
Armory.Controller.prototype.AjaxLoadResults = function(n, t) {
	var u = window.location,
		i = $("#destinyItems"),
		r = $("#page_armory");
	i.children("*").css("opacity", "0");
	i.destinyLoader({
		startOnInit: !0,
		background: !1
	});
	$.get(n, function(n) {
		typeof t != "undefined" && t !== "" && history.pushState(t, null, t);
		r.html(n);
		ArmoryPage.view.Initialize();
		i.destinyLoader("stop")
	}).fail(function() {
		r.find("#destinyItems").html('<p class="noResults">' + Localizer.Format(Localizer.Armory.errorloadingresults, {
				prevLink: u
			}) + "<\/p>");
		ArmoryPage.view.Initialize();
		i.destinyLoader("stop")
	})
};
Armory.Controller.prototype.UpdateResults = function(n) {
	clearTimeout(ArmoryPage.view.timeout_searchArmory);
	var i = $(n),
		t = "",
		r = "";
	i.attr("data-href") ? t = i.attr("data-href") : (i.attr("data-href", ArmoryPage.defaultAjaxUrl), t = ArmoryPage.defaultAjaxUrl);
	t = t.replace(/&amp;/gi, "&") + (t.indexOf("?") > -1 ? "&" : "?") + "name=" + n.value;
	r = t.replace(/itemlist/gi, "Category");
	this.AjaxLoadResults(t, r, !0)
};
Armory.View = function() {
	this.isSmallWindowMode = !1
};
Armory.View.prototype.Initialize = function() {
	var n = this;
	$(document).ready(function() {
		n.$table = $("#table_destinyItems");
		n.$movingHeader = $("#movingHeader");
		n.timeout_searchArmory = !1;
		$("#tabSwitch_col").length && (n.tabSwitchHeight = $("#tabSwitch_col").outerHeight());
		n.scrollBackground = new ScrollElementBackground($(".bg_separate"));
		n.Dimensions();
		n.MakeJSChanges();
		n.AddEventListeners()
	})
};
Armory.View.prototype.Dimensions = function() {
	var n = this,
		i = this.$table.find(".movingHeader"),
		t = i.filter(":visible"),
		r, u;
	this.$table.find("th.overflow.stat").is(":visible") && (r = this.$table.find(".movingHeader [title=" + this.$table.find("th.overflow.stat").find(":selected").val() + "]").eq(0).closest(".movingHeader"), t = t.add(r));
	u = [];
	this.$movingHeader.html("");
	t.each(function() {
		var t = $(this),
			f = i.index(this),
			u = t.width(),
			r;
		n.$table.find("th.overflow.stat").is(":visible") && t.hasClass("stat") && (u = $(".overflow.stat").eq(0).width() - 24);
		r = t.clone(!0);
		n.$movingHeader.append(r.width(u).attr("data-index", f));
		r.has("a").on("click", function(i) {
			i.preventDefault();
			t.click();
			n.$movingHeader.removeClass("fixed")
		});
		r.find("select").on("change", function() {
			n.ChangeOutOverflowColumn($(this).val())
		})
	})
};
Armory.View.prototype.MakeJSChanges = function() {
	var a = this,
		u = this.$table.find("th"),
		n = this.$table.find("tr[data-hash]"),
		f, t, i, e, s, h, r;
	if (typeof localStorage.armoryCategoryScrollTop != "undefined" && setTimeout(function() {
			window.scrollTo(0, localStorage.getItem("armoryCategoryScrollTop"));
			localStorage.setItem("armoryCategoryScrollTop", 0)
		}, 100), Modernizr.mq("only screen and (max-width: 1515px)") && this.$table.find(".overflow").length && (this.$table.find("td.overflow").hide(), this.$table.find("[data-col=" + $(".overflow select option").eq(0).val().replace(/ /gi, "") + "]").show()), f = u.find(".desc, .asc").parent("th"), t = u.index(f), t > -1 && (n.not(":nth-child(2)").find(".hover").removeClass("hover"), n.find("td:nth-child(" + (t + 2) + ")").filter(".general").addClass("hoverPermanent"), n.find("th:nth-child(" + (t + 1) + ")").filter(".general").addClass("hoverPermanent")), i = $("#destinyItems").find(".sectionHeader span"), e = parseInt(i.text(), 10), $("#afterCurrentPage").find("a").length === 0 && $("#currentPostPage").attr("data-page") == 0 && n.length > 0 && n.length !== e && i.text(n.length), s = new PerkSuggestions($("#text_searchPerk"), $("#searchPerksPreview")), this.$table.find(".image > a").each(function() {
			var n = $(this),
				t = new ExtraInfoTip(n, n.find(".destinyTooltip"), {
					onScreen: !0,
					fadeIn: 1e3,
					delayTime: 250
				})
		}), this.$table.find(".screenshot").length && this.$table.find(".screenshot").each(function() {
			var n = $(this);
			n.find("a").on("click", function(n) {
				n.preventDefault();
				Utility.showMediaLightBox("<img src=" + this.href + " />")
			})
		}), h = !1, r = this.$table.find("th .movingHeader"), r.length) {
		var c = r.eq(0).next().offset().top,
			v = $("header").height(),
			l = 0,
			o = $("#movingHeader");
		$(window).off("scroll.tableHeaders");
		$(window).on("scroll.tableHeaders", function() {
			var n = $(window).scrollTop();
			l = n;
			n > c ? o.addClass("fixed") : o.removeClass("fixed")
		})
	}
	Modernizr.ie && n.each(function() {
		var n = $(this);
		n.find("th").length === 0 && n.find(".overlay_link").height(n.find("td").eq(0).height())
	})
};
Armory.View.prototype.ChangeOutOverflowColumn = function(n) {
	this.$table.find("td.overflow, td.stat").hide();
	this.$table.find("[data-col='" + n + "']").show();
	$("option:contains(" + n + ")").prop("selected", "selected")
};
Armory.View.prototype.SelectText = function(n) {
	var u = document,
		r = n,
		t, i;
	u.body.createTextRange ? (t = document.body.createTextRange(), t.moveToElementText(r), t.select()) : window.getSelection && (i = window.getSelection(), t = document.createRange(), t.selectNodeContents(r), i.removeAllRanges(), i.addRange(t))
};
Armory.View.prototype.AddTableEventListeners = function() {
	var n = this,
		i = this.$table.find("td, th"),
		u = this.$table.find("tr"),
		r = this.$table.find(".overflow select"),
		t;
	r.off(".colChange");
	r.on("change.colChange", function() {
		var t = $(this);
		n.ChangeOutOverflowColumn(t.val());
		$(window).off(".colChange");
		$(window).on("resize.colChange", function() {
			Modernizr.mq("only screen and (min-width: 1200px)") && (t.find("option").eq(0).prop("selected", !0), n.$table.find("td.stat").css("display", ""))
		})
	});
	i.off(".dragSelect");
	i.on({
		"drag.dragSelect": function() {
			var t = $(this);
			t.hasClass("dragging") || (t.addClass("dragging"), n.SelectText(this))
		},
		"dragend.dragSelect": function() {
			var n = $(this);
			n.hasClass("dragging") && n.removeClass("dragging")
		}
	});
	t = u.not(":first-child").find("a");
	t.off("click.loadItem");
	t.on("click.loadItem", function() {
		Modernizr.localstorage && localStorage.setItem("armoryCategoryScrollTop", $(window).scrollTop())
	})
};
Armory.View.prototype.AddWindowEventListeners = function() {
	var n = this;
	$(window).off("scroll.scrollBG");
	$(window).on("scroll.scrollBG", function() {
		n.scrollBackground.onScroll()
	});
	window.onpopstate = {};
	window.onpopstate = function() {
		var n = $("#destinyItems"),
			t = $("#page_armory");
		n.children("*").css("opacity", "0");
		n.destinyLoader({
			startOnInit: !0,
			background: !1
		});
		history.state !== null && typeof history.state != "undefined" ? ArmoryPage.controller.AjaxLoadResults(history.state.replace(/category/gi, "ItemList")) : ArmoryPage.controller.AjaxLoadResults(PageUrls.armory.toString().replace(/category/gi, "ItemList"))
	};
	$(window).off("resize.armory");
	$(window).on("resize.armory", function() {
		Modernizr.mq("only screen and (max-width: 1200px)") && n.$table.find(".overflow").length && (n.$table.find("td.overflow").hide(), n.$table.find("[data-col=" + $(".overflow select option").eq(0).val().replace(/ /gi, "") + "]").show());
		n.Dimensions()
	})
};
Armory.View.prototype.AddSidebarEventListeners = function() {
	var i = this,
		t = $(".filter h3 a"),
		n;
	t.off("click.openFilter");
	t.on("click.openFilter", function(n) {
		n.preventDefault();
		var i = $(this),
			t = i.closest(".block_sidebar");
		t.hasClass("open") ? t.removeClass("open") : t.addClass("open")
	});
	$(".sidebar_armory select").off("change.armoryPerk");
	$(".sidebar_armory select").on("change.armoryPerk", function() {
		var t = $(this),
			n = t.find(":selected").attr("data-href"),
			i = n.replace(/itemlist/i, "category");
		ArmoryPage.controller.AjaxLoadResults(n, i)
	});
	n = $("#form_searchPerk");
	n.off("submit.searchPerkName");
	n.on("submit.searchPerkName", function(n) {
		n.preventDefault();
		var i = $(this),
			t = i.prop("action"),
			r = t.replace(/itemlist/i, "category");
		ArmoryPage.controller.AjaxLoadResults(t, r)
	});
	$("#btn_clearSearchPerk").off("click.clearPerk");
	$("#btn_clearSearchPerk").on("click.clearPerk", function(n) {
		n.preventDefault();
		$("#text_searchPerk").val("");
		var t = $(this).attr("data-href"),
			i = t.replace(/itemlist/i, "category");
		ArmoryPage.controller.AjaxLoadResults(t, i)
	})
};
Armory.View.prototype.AddSearchFormEventListeners = function() {
	var n = this,
		i = $("#text_searchArmory input"),
		t;
	i.off(".armory");
	i.on("keyup.armory", function(t) {
		var i = this;
		t.which === 13 ? $("#container_item").length && (clearTimeout(n.timeout_searchArmory), window.location = Armory.armoryUrl + "?name=" + this.value) : $("#container_items").length && (clearTimeout(n.timeout_searchArmory), n.timeout_searchArmory = setTimeout(function() {
			ArmoryPage.controller.UpdateResults(i)
		}, 500))
	});
	t = $("#form_searchArmory");
	t.off(".armory");
	t.on("submit.armory", function(n) {
		n.preventDefault();
		ArmoryPage.controller.UpdateResults($("#text_searchArmory input")[0])
	})
};
Armory.View.prototype.AddEventListeners = function() {
	var i = this,
		n, t;
	this.AddTableEventListeners();
	this.AddWindowEventListeners();
	this.AddSidebarEventListeners();
	this.AddSearchFormEventListeners();
	$("#toggle_stats").on("click", function(n) {
		n.preventDefault();
		var t = $(this);
		t.hasClass("on") ? (t.removeClass("on"), $("#table_destinyItems").removeClass("nostats")) : (t.addClass("on"), $("#table_destinyItems").addClass("nostats"));
		i.Dimensions()
	});
	n = $("#tabSwitch_col a");
	n.off("click.tabSwitch");
	n.on("click.tabSwitch", function() {
		var n = $(this),
			i, t;
		n.hasClass("on") || (n.addClass("on").siblings("[data-col].on").removeClass("on"), i = n.attr("data-col"), t = $(".mainCol[data-col='" + i + "']"), t.siblings(".on").removeClass("on"), t.addClass("on"))
	});
	$(document).off("click.updateArmoryList");
	$(document).on("click.updateArmoryList", ".update_itemList", function(n) {
		var r, t;
		$("#categoriesPage").length && ($("#destinyItems").destinyLoader({
			startOnInit: !0,
			background: !1
		}), $("#categoriesPage").css("opacity", "0"));
		r = this;
		t = $(this);
		n.preventDefault();
		$collapsible = null;
		var i = !1,
			f = !1,
			u = !1;
		Modernizr.mq("only screen and (max-width: 1200px)") && t.closest(".sidebar_armory").length && t.closest(".sidebar_armory").removeClass("on").siblings("[data-col]").addClass("on");
		t.closest(".collapsible").length && ($collapsible = t.closest(".collapsible"), t.parent("h3").length ? i = !0 : t.closest("ul").siblings("h3").length ? f = !0 : t.closest("ul").siblings("a").length && (u = !0));
		(t.hasClass("on") || t.parent("h3").closest(".category").hasClass("open")) && this.id !== "btn_filterRandom" ? (n.preventDefault(), $collapsible != null && (t.hasClass("on") && t.removeClass("on"), (i || $collapsible.hasClass("subcategory") && !u) && $collapsible.removeClass("open"), i && ($(".collapsible.disabled").removeClass("disabled"), $(".collapsible.subcategory.open").removeClass("open"))), ArmoryPage.controller.AjaxLoadResults(t.attr("data-off").replace(/category/gi, "ItemList"), $(r).attr("data-off"))) : ($collapsible != null && (i ? ($collapsible.removeClass("disabled").addClass("open").siblings(".collapsible.category").removeClass("open").addClass("disabled"), $(".collapsible.subcategory.open").removeClass("open")) : ($collapsible.addClass("open"), (f || u) && ($siblingSubcategories = t.closest("ul").find(".update_itemList").not(t), $siblingSubcategories.removeClass("on"), t.addClass("on"), $collapsible.siblings().removeClass("open").find(".on").removeClass("on")))), ArmoryPage.controller.AjaxLoadResults(this.href.replace(/category/gi, "ItemList"), r.href))
	});
	t = $(".pager_prevnext");
	t.off("click.stopDisabled");
	t.on("click.stopDisabled", ".disabled", function(n) {
		n.preventDefault()
	})
};
ArmoryDetail = function() {
	this.model = new ArmoryDetail.Model;
	this.controller = new ArmoryDetail.Controller;
	this.view = new ArmoryDetail.View
};
ArmoryDetail.prototype.Initialize = function() {
	var n = this;
	this.model.Initialize();
	$(document).ready(function() {
		n.controller.Initialize();
		n.view.Initialize()
	})
};
ArmoryDetail.Model = function() {};
ArmoryDetail.Model.prototype.Initialize = function() {
	this.PopulateJSVar()
};
ArmoryDetail.Controller = function() {};
ArmoryDetail.Controller.prototype.Initialize = function() {
	Modernizr.localstorage && this.GetAndSetPreviouslyViewedLocalStorage({
		id: ArmoryDetailPage.model.itemId,
		date: (new Date).getTime()
	});
	this.AddSearchFormEventListeners()
};
ArmoryDetail.Controller.prototype.AddSearchFormEventListeners = function() {
	var t = this,
		n = $("#form_searchArmory");
	n.off(".armory");
	n.on("submit", function(n) {
		return $("#container_item").length && (clearTimeout(t.timeout_searchArmory), window.location = ArmoryDetailPage.armoryUrl + "?name=" + $("input", this).val()), n.preventDefault(), !1
	})
};
ArmoryDetail.Controller.prototype.GetAndSetPreviouslyViewedLocalStorage = function(n) {
	var r = n.id,
		t = {},
		i, e, f, u, n;
	if (typeof localStorage.prevViewed != "undefined") {
		t = JSON.parse(localStorage.prevViewed);
		typeof t[n.id] == "undefined" ? t[r] = n : (delete t[r], t[r] = n);
		i = [];
		for (e in t) i.push(t[e]);
		for (i.sort(function(n, t) {
			return n.date > t.date ? -1 : n.date < t.date ? 1 : 0
		}), i.length > 5 && (i = i.slice(0, 5)), t = {}, f = [], u = 0; u < i.length; u++) n = i[u], t[n.id] = i[u], f.push(n.id);
		ArmoryDetailPage.view.AddRecentlyViewedIntoDom(f);
		localStorage.setItem("prevViewed", JSON.stringify(t))
	} else t[r] = n, ArmoryDetailPage.view.AddRecentlyViewedIntoDom([r]), localStorage.setItem("prevViewed", JSON.stringify(t))
};
ArmoryDetail.View = function() {};
ArmoryDetail.View.prototype.Initialize = function() {
	var n = this;
	this.resizeTimeout;
	this.canvasTimeout;
	typeof Spasm != "undefined" && this.ReadyCanvas();
	this.MakeJSChanges();
	this.scrollBackground = new ScrollElementBackground($(".bg_separate"));
	this.AddEventListeners()
};
ArmoryDetail.View.prototype.AddRecentlyViewedIntoDom = function(n) {
	var t = this;
	$("#list_prevViewed").empty();
	$(".prevViewed").destinyLoader({
		startOnInit: !0,
		background: !1
	});
	$.get(ArmoryDetailPage.model.recentlyViewedLink + "?items=" + n.join(",") + "&item=" + ArmoryDetailPage.model.itemId, function(n) {
		$(".prevViewed").html(n);
		$("#destinyItems").destinyLoader("stop");
		$("#list_prevViewed li").each(function() {
			t.AddDestinyItemToolTip($(this))
		})
	})
};
ArmoryDetail.View.prototype.MakeJSChanges = function() {
	var n = this;
	$("#list_related li, #stats_item li").each(function() {
		n.AddDestinyItemToolTip($(this))
	});
	$("#model_item").length && this.AddDimensionsToCanvas(!0, !1, !1)
};
ArmoryDetail.View.prototype.AddDestinyItemToolTip = function(n) {
	var t = new ExtraInfoTip(n, n.find(".destinyTooltip"), {
		onScreen: !0,
		fadeIn: 1e3,
		delayTime: 250
	})
};
ArmoryDetail.View.prototype.AddDimensionsToCanvas = function(n, t, i) {
	var u = $("#model_item"),
		r = u.children("canvas");
	u.destinyLoader("exists") || n || u.destinyLoader({
		startOnInit: !0,
		background: !1
	});
	clearTimeout(this.canvasTimeout);
	this.canvasTimeout = setTimeout(function() {
		if (r.css("transform") !== "none") {
			var f = parseFloat($("#model_item").children("canvas").css("transform").split(",")[0].replace("matrix(", ""), 10).toFixed(2);
			r.attr("width", r.attr("data-width") * f);
			r.attr("height", r.attr("data-height") * f)
		} else n && (r.attr("data-originalWidth", r.width()), r.attr("data-originalHeight", r.height()), r.attr("data-width", r.width()), r.attr("data-height", r.height())), i ? (r.attr("width", r.attr("data-originalWidth") + "px"), r.attr("height", r.attr("data-originalHeight") + "px")) : (t && (r.attr("data-width", r.width()), r.attr("data-height", r.height())), r.attr("width", r.css("width")), r.attr("height", r.css("height")));
		u.destinyLoader("stop");
		clearTimeout(this.canvasTimeout);
		clearTimeout(this.resizeTimeout)
	}, 100)
};
ArmoryDetail.View.prototype.ReadyCanvas = function() {
	if (this.armorHashes = [], this.contentBaseURL = Utility.ContentVersioned("/"), $("#weapon_canvas").length) this.canvas = document.getElementById("weapon_canvas"), this.preview3D = new Spasm.ItemPreview(this.canvas, this.contentBaseURL), this.centeredItemId = ArmoryDetailPage.model.itemId, ArmoryDetailPage.model.itemSubType === Globals.DestinyItemSubType.Sword && this.preview3D.setRotationZDegrees(90);
	else if ($("#ship_canvas").length) this.canvas = document.getElementById("ship_canvas"), this.preview3D = new Spasm.ItemPreview(this.canvas, this.contentBaseURL), this.centeredItemId = ArmoryDetailPage.model.itemId;
	else if ($("#character_canvas").length) {
		for (var n = 0; n < ArmoryDetailPage.model.defaultArmor[ArmoryDetailPage.model.classType].length; n++) this.armorHashes.push(ArmoryDetailPage.model.defaultArmor[ArmoryDetailPage.model.classType][n].toString());
		this.canvas = document.getElementById("character_canvas");
		this.preview3D = new Spasm.ItemPreview(this.canvas, this.contentBaseURL);
		this.preview3D.setGenderType(Globals.DestinyGender.Female);
		this.preview3D.setClassHash(0);
		this.preview3D.limitToFrame = !0;
		this.centeredItemId = null
	} else return;
	this.Load3D()
};
ArmoryDetail.View.prototype.ZoomCanvas = function(n, t, i, r) {
	n.css({
		transform: "matrix(" + t + ", 0, 0, " + t + ", " + i + ", " + r + ")"
	})
};
ArmoryDetail.View.prototype.ResetZoomEvents = function() {
	$(document).off(".zoom")
};
ArmoryDetail.View.prototype.Load3D = function() {
	var u = this,
		f = this.canvas,
		n = this.preview3D,
		r = this.centeredItemId,
		t = $(".guardianDialWrapper"),
		i = $(".guardianDial");
	t.show();
	i.knob({
		width: 183,
		height: 183,
		thickness: .13,
		displayInput: !0,
		bgColor: "rgba(0,0,0,0)",
		fgColor: "#f5f5f5",
		draw: function() {
			$(this.i).val(this.cv + "%")
		}
	});
	n.setItemReferenceIdsWithMutedItems(ArmoryDetailPage.model.gearAndDefaultArmor, null, ArmoryDetailPage.model.shaderDefinition, ArmoryDetailPage.model.mutedItems, ArmoryDetailPage.model.gearAssets, function(n) {
		n ? $("#model_item").removeClass("invisible") : $("#destinyItem").addClass("noCanvas");
		t.fadeOut(250)
	});
	typeof ArmoryDetailPage.model.hunterCloakId != "undefined" && n.setVariantItemReferenceIds([ArmoryDetailPage.model.hunterCloakId]);
	n.loadProgressCallback = function() {
		var r = n.totalLoadProgress,
			f = r.loaded + r.loading,
			u = r.loaded / f * 100;
		i.val(u).trigger("change");
		u >= 99 && (t.fadeOut(250), i.val(0), $(".canvas_back").removeClass("hidden"), $("#switch_sex").removeClass("hidden"))
	};
	n.setCenteredItemReferenceId(r);
	n.cameraControls.allowRotationVertical = !0;
	n.startAnimating()
};
ArmoryDetail.View.prototype.SetUpFullScreenMode = function() {
	var u = this;
	$("body").addClass("fullscreen3D");
	this.AddDimensionsToCanvas(!1, !0, !1);
	var f = $("#model_item"),
		t = f.children("canvas"),
		n = 1,
		s, i = 0,
		r = 0,
		e = t.width() / 2,
		o = t.height() / 2,
		h = 2,
		c = .5;
	f.off("mousewheel.zoomstart wheel.zoomstart");
	f.on("mousewheel.zoomstart wheel.zoomstart", function(f) {
		f.preventDefault();
		var e = f.originalEvent.deltaY || -1 / 40 * f.originalEvent.wheelDelta;
		n = e > 0 ? n + .1 : n - .1;
		n > h && (n = h);
		n < c && (n = c);
		u.ZoomCanvas(t, n, i, r);
		clearTimeout(s);
		s = setTimeout(function() {
			u.AddDimensionsToCanvas(!1, !1, !1)
		}, 200)
	});
	f.off("mousedown.zoomstart");
	f.on("mousedown.zoomstart", function(f) {
		var s, a, v;
		if (f.shiftKey) {
			f.stopImmediatePropagation();
			var y = $(this),
				h = t.css("transform"),
				c = 0,
				l = 0;
			h !== "none" && (s = h.split(","), c = parseInt(s[4], 10), l = parseInt(s[5], 10));
			a = f.pageX;
			v = f.pageY;
			$(document).on("mousemove.zoom", function(f) {
				f.stopImmediatePropagation();
				var s = f.pageX - a + c,
					h = f.pageY - v + l;
				i = s;
				r = h;
				i > e ? i = e : i < -e && (i = -e);
				r > o ? r = o : r < -o && (r = -o);
				u.ZoomCanvas(t, n, i, r)
			});
			$(document).on("mouseup.zoom", function() {
				u.ResetZoomEvents(t)
			});
			$(document).on("keyup", function(n) {
				n.which === 16 && u.ResetZoomEvents(t)
			})
		}
	});
	$("#btn_exitFullScreen").off("click.zoom");
	$("#btn_exitFullScreen").on("click.zoom", function(n) {
		n.preventDefault();
		$("body").removeClass("fullscreen3D");
		f.off(".zoomstart");
		t.css("transform", "none");
		u.AddDimensionsToCanvas(!1, !1, !0)
	})
};
ArmoryDetail.View.prototype.AddEventListeners = function() {
	var n = this,
		i, t;
	$(window).off("scroll.scrollBG");
	$(window).on("scroll.scrollBG", function() {
		n.scrollBackground.onScroll()
	});
	$(".breadcrumb a").off("click.resetCategoryPosition");
	$(".breadcrumb a").on("click.resetCategoryPosition", function() {
		localStorage.setItem("armoryCategoryScrollTop", 0)
	});
	$("#switch_sex").off("click.sexSwitch");
	$("#switch_sex").on("click.sexSwitch", "a", function() {
		var i = $(this);
		if (!i.hasClass("on")) {
			i.addClass("on").siblings("a").removeClass("on");
			var r = $("#model_item"),
				u = r.attr("data-sex"),
				t = "";
			t = u == "Female" ? "Male" : "Female";
			r.attr("data-sex", t);
			n.preview3D.setGenderType(Globals.DestinyGender[t]);
			n.preview3D.setClassHash(0);
			n.Load3D()
		}
	});
	$("#btn_fullscreen").off("click.zoom");
	$("#btn_fullscreen").on("click.zoom", function(t) {
		t.preventDefault();
		n.SetUpFullScreenMode()
	});
	$(".pause-option").off("click.3dcanvas");
	$(".pause-option").on("click.3dcanvas", function() {
		var t = $(this);
		t.find(".fa-pause").hasClass("on") ? n.preview3D.limitToFrame = !0 : (n.preview3D.limitToFrame = !1, n.preview3D.camera.dirtyFlags.view = !0);
		t.find(".on").removeClass("on").siblings("i").addClass("on")
	});
	$(window).off("resize.canvas");
	$(window).on("resize.canvas", function() {
		clearTimeout(n.resizeTimeout);
		n.resizeTimeout = setTimeout(function() {
			n.AddDimensionsToCanvas(!1, !1, !1)
		}, 500)
	});
	$(window).off("unload.3dcanvas");
	$(window).on("unload.3dcanvas", function() {
		typeof n != "undefined" && typeof n.preview3D != "undefined" && (n.preview3D.stopAnimating(), delete n.preview3D)
	});
	i = $(".random.step");
	t = i.find(".icon, .standardTitle, .standardDesc");
	t.off("click.randomPerks");
	t.on("click.randomPerks", function() {
		var t = $(this),
			n = t.closest(".random.step");
		n.hasClass("open") ? n.removeClass("open") : n.addClass("open")
	});
	$(".btn_expandRandomPerks").on("click", function(n) {
		n.preventDefault();
		var t = $(this);
		t.hasClass("on") ? (t.removeClass("on"), t.siblings(".random.step").removeClass("open")) : (t.addClass("on"), t.siblings(".random.step").addClass("open"))
	})
};
PerkSuggestions = function(n, t) {
	n.length < 1 || t.length < 1 || (this.$el = n, this.$suggestionPanel = t, this.perkSuggestTimeout = !1, this.addEventListeners())
};
PerkSuggestions.prototype.setSearchPerksPreviewTimeout = function() {
	var n = this;
	this.perkSuggestTimeout = setTimeout(function() {
		n.searchForPerks(n.$el);
		n.clearSearchPerksTimeout()
	}, 500)
};
PerkSuggestions.prototype.clearSearchPerksTimeout = function() {
	clearTimeout(this.perkSuggestTimeout);
	this.perkSuggestTimeout = !1
};
PerkSuggestions.prototype.resetSearchPerksPreview = function() {
	this.$suggestionPanel.find("li").remove()
};
PerkSuggestions.prototype.closePerksPreview = function() {
	this.resetSearchPerksPreview();
	this.$suggestionPanel.removeClass("opened")
};
PerkSuggestions.prototype.addEventListeners = function() {
	var n = this;
	this.$el.on("keydown.perkSuggest", function(n) {
		n.which === 13 && n.preventDefault();
		$("#searchPerksPreview").find("li").filter(function() {
			return $(this).text().toLowerCase() == $("#text_searchPerk").val().toLowerCase()
		}).click()
	});
	this.$el.on("keyup.perkSuggest", function() {
		var t = $(this);
		if (t.val().length < 3) {
			n.closePerksPreview();
			return
		}
		n.perkSuggestTimeout !== !1 ? (n.clearSearchPerksTimeout(), n.setSearchPerksPreviewTimeout(t)) : n.setSearchPerksPreviewTimeout(t)
	});
	this.$suggestionPanel.on("click", "li", function() {
		var h = $(this),
			e = h.text(),
			i, f;
		n.$el.val("");
		var t = n.$el.val(),
			r = [],
			u = [],
			o = 0,
			s = 0;
		if (t.indexOf(" ") > -1) {
			for (r = t.split(" "), u = Utility.getIndicesOf(" ", t, !1), o = Utility.getCaret(n.$el.get(0)), i = 0; i < u.length; i++) u[i] < o && s++;
			r[s] = e;
			t = r.join(" ")
		} else t = e;
		n.$el.val(t);
		f = n.$el.closest("form");
		f.prop("action", f.prop("action") + "&perkName=" + t);
		n.closePerksPreview();
		n.$el.closest("form").submit()
	});
	this.$el.on("blur.tagSuggest", function() {
		setTimeout(function() {
			n.$el.is(":focus") || n.closePerksPreview()
		}, 500)
	})
};
PerkSuggestions.prototype.searchForPerks = function(n) {
	var t = this,
		r;
	if (n.val().length > 2) {
		var i = n.val(),
			f = [],
			u = [],
			e = 0,
			o = 0;
		if (i.trim().indexOf(" ") > -1) {
			for (f = i.split(" "), u = Utility.getIndicesOf(" ", i, !1), e = Utility.getCaret(this.$el.get(0)), r = 0; r < u.length; r++) u[r] < e && o++;
			i = f[o]
		}
		bungieNetPlatform.destinyService.GetDestinyExplorerTalentNodeSteps(0, 10, i, 0, 0, 0, 0, 0, 0, !0, function(n) {
			var i;
			if (n.data.totalResults > 0)
				for (t.resetSearchPerksPreview(), i = 0; i < n.data.stepHashes.length; i++) {
					t.$suggestionPanel.is(":visible") || t.$suggestionPanel.addClass("opened");
					var u = n.data.stepHashes[i],
						r = n.definitions.nodeSteps[u],
						f = '<li id="' + r.nodeStepHash + '">' + r.nodeStepName + "<\/li>";
					t.$suggestionPanel.append(f)
				} else t.resetSearchPerksPreview()
		}, function() {
			t.resetSearchPerksPreview()
		})
	} else this.resetSearchPerksPreview()
}