var __extends = this && this.__extends || function(n, t) {
        function r() {
            this.constructor = n
        }
        for (var i in t) t.hasOwnProperty(i) && (n[i] = t[i]);
        n.prototype = t === null ? Object.create(t) : (r.prototype = t.prototype, new r)
    },
    Bnet;
(function(n) {
    var t = function(n) {
        function t() {
            var t = n.apply(this, arguments) || this;
            return t.modalOpenHtmlClass = "gear-child-modal-open", t
        }
        return __extends(t, n), t
    }(n.Modal);
    n.GearChildModal = t
})(Bnet || (Bnet = {})),
function(n) {
    var t = function() {
        function t(n, t, i, r, u, f, e, o) {
            this.membershipType = n;
            this.membershipId = t;
            this.characterId = i;
            this.itemHash = r;
            this.itemInstanceId = u;
            this.vendorHash = f;
            this.vendorSaleItemIndex = e;
            this.isVault = o;
            this.onEquipSuccess = null;
            this.onEquipFail = null;
            this.isPublicMode = !1;
            this.onTransferMidSuccess = null;
            this.onTransferMidFail = null;
            this.onTransferSuccess = null;
            this.onTransferFail = null;
            this.onLockToggle = null
        }
        return t.prototype.initialize = function() {
            var t = this;
            this.setGearTransferManager();
            this.modal = new n.Modal("GearItemDetail", " ");
            this.modal.beforeOpenCallback = function() {
                t.$modalEl = t.modal.modalElement;
                t.load()
            };
            this.modal.open()
        }, t.prototype.setGearTransferManager = function() {
            this.isPublicMode || (this.gearTransferManager = new n.GearTransferManager(this.membershipType, this.characterId))
        }, t.prototype.addEventListeners = function() {
            var n = this;
            this.$modalEl.find(".node").on("click", function(t) {
                var i = $(t.currentTarget),
                    r = i.find(".detail-popup").html();
                n.showNodePopup(r)
            });
            this.$modalEl.find(".transfer-button").on("click", function() {
                n.showTransferPopup()
            });
            this.$modalEl.find(".lock-button").on("click", function(t) {
                var i = $(t.currentTarget).hasClass("locked");
                n.lockToggle(i)
            });
            this.$modalEl.find(".view-3d-button").on("click", function() {
                n.show3DPopup()
            });
            this.$modalEl.find(".equip-button").on("click", function() {
                n.equipItem()
            })
        }, t.prototype.buildUrl = function() {
            return "/" + Localizer.CurrentCultureName + "/Legend/GearItemDetail/" + this.membershipType + "/" + this.membershipId + "/" + this.characterId + "?instanceId=" + this.itemInstanceId + "&hash=" + this.itemHash + "&isV2=true&inVault=" + this.isVault
        }, t.prototype.load = function() {
            var t = this,
                i;
            this.showLoader();
            i = this.buildUrl();
            $.ajax({
                url: i,
                cache: n.Site.PageController.Instance.useCache,
                type: "GET",
                data: null,
                success: function(n) {
                    t.onLoadSuccess(n)
                },
                error: function(n, i, r) {
                    r !== "abort" && (n.status === 500 || n.status === 404) && (t.modal.populateContent("\n\t\t\t\t\t\t\t\t<div class='gear-item-detail-error'>\n\t\t\t\t\t\t\t\t\t" + Localizer.Legend.gearitemdetailfailure + "\n\t\t\t\t\t\t\t\t<\/div>\n\t\t\t\t\t\t\t"), t.hideLoader())
                }
            })
        }, t.prototype.onLoadSuccess = function(n) {
            this.processHtml(n);
            Modernizr.mobile || $(".modal-content").customScroll();
            this.hideLoader();
            $(".nodeDial").each(function(n, t) {
                $(t).knob({
                    width: 60,
                    height: 60,
                    displayInput: !1,
                    bgColor: "rgba(245,245,245,0.1)",
                    fgColor: "#5ea16a",
                    draw: function() {
                        this.i.addClass("active")
                    }
                })
            });
            this.addEventListeners()
        }, t.prototype.processHtml = function(t) {
            var u = $(t),
                i = u.find(".gear-item-detail"),
                r;
            i.length && (r = n.Utilities.HtmlElement.getOuterHtml(i), this.modal.populateContent(r))
        }, t.prototype.load3D = function() {
            var o = this.$modalEl.find(".gear-item-detail"),
                i = $(".container-3d"),
                r = i.find("#view-3d-gear-item")[0],
                e, u;
            r.setAttribute("width", i.width().toString());
            r.setAttribute("height", i.height().toString());
            var n = null,
                t = null,
                f = o.data("bucket");
            if (f in {
                    BUCKET_HEAD: 0,
                    BUCKET_ARMS: 0,
                    BUCKET_CHEST: 0,
                    BUCKET_LEGS: 0,
                    BUCKET_CLASS_ITEMS: 0
                } ? (t = new SpasmCharacter(this.membershipType, this.membershipId, this.characterId, r, null), t.replacementItemIds = [this.itemHash], t.setFocusedItemReferenceId(this.itemHash), t.renderWithHelmet = !0, t.init()) : f in {
                    BUCKET_PRIMARY_WEAPON: 0,
                    BUCKET_SPECIAL_WEAPON: 0,
                    BUCKET_HEAVY_WEAPON: 0
                } && (e = Utility.ContentVersioned("/"), n = new Spasm.ItemPreview(r, e), n.setCenteredItemReferenceId(this.itemHash), n.setGenderType(0), n.setClassHash(0), n.loadItemReferenceIds(["" + this.itemHash], null, function() {}), n.limitToFrame = !0, n.startAnimating()), u = (t != null ? t._itemPreview : null) || n, u) {
                i.on({
                    mousedown: function(n) {
                        u.cameraControls.onMouseDown(n.originalEvent)
                    },
                    mouseup: function(n) {
                        u.cameraControls.onMouseUp(n.originalEvent)
                    },
                    "mousewheel DOMMouseScroll": function(n) {
                        u.cameraControls.onScroll(n.originalEvent)
                    },
                    touchstart: function(n) {
                        u.cameraControls.onTouchStart(n.originalEvent)
                    }
                });
                $(window).resize(function() {
                    r.setAttribute("width", i.width().toString());
                    r.setAttribute("height", i.height().toString())
                })
            }
        }, t.prototype.showNodePopup = function(t) {
            var i = new n.GearChildModal("node", t);
            i.open()
        }, t.prototype.showTransferPopup = function() {
            var t = this,
                i = $("script.transfer-template"),
                r = i.html();
            this.transferModal = new n.GearChildModal("transfer", r);
            this.transferModal.afterOpenCallback = function() {
                var n = t.transferModal.modalElement;
                n.find(".gear-character-summary").on("click", function(i) {
                    var r = $(i.currentTarget).data("tocharacterid"),
                        u = n.find("input[type=range]").val();
                    t.transferItem(r.toString(), u)
                });
                n.find("input[type=range]").on("mousemove touchmove", function(t) {
                    var i = $(t.currentTarget);
                    n.find(".currentValue").text(i.val())
                })
            };
            this.transferModal.open()
        }, t.prototype.show3DPopup = function() {
            var t = $("script.view-3d-template"),
                i = t.html(),
                r = new n.GearChildModal("view-3d", i);
            r.open();
            this.load3D()
        }, t.prototype.showLoader = function() {
            this.$modalEl.destinyLoader({
                background: !1,
                startOnInit: !0
            })
        }, t.prototype.hideLoader = function() {
            this.$modalEl.destinyLoader("stop")
        }, t.prototype.transferItem = function(n, t) {
            var i = this,
                u, r;
            t === void 0 && (t = 1);
            u = this.gearTransferManager.createTransferDataObject(this.isVault ? "-1" : this.characterId, n, this.itemInstanceId, this.itemHash, t, !1, "");
            r = this.transferModal.modalElement;
            r.destinyLoader({
                startOnInit: !0,
                size: 30
            });
            this.gearTransferManager.transferItemGeneric(u, function(n) {
                if (i.onTransferMidSuccess) i.onTransferMidSuccess(n)
            }, function(n, t) {
                if (i.transferModal.close(), i.errorAlert(n.errorMessage), i.onTransferMidFail) i.onTransferMidFail(n, t);
                r.destinyLoader("stop")
            }, function(n) {
                if (i.onTransferSuccess) i.onTransferSuccess(n);
                i.modal.close();
                i.transferModal.close();
                r.destinyLoader("stop")
            }, function(n, t) {
                if (i.transferModal.close(), i.errorAlert(n.errorMessage), i.onTransferFail) i.onTransferFail(n, t);
                r.destinyLoader("stop")
            })
        }, t.prototype.equipItem = function() {
            var n = this,
                t = this.gearTransferManager.createTransferDataObject(this.characterId, this.characterId, this.itemInstanceId, this.itemHash, 1, !1, "");
            this.gearTransferManager.equipItem(t, function(t) {
                if (n.modal.close(), n.onEquipSuccess) n.onEquipSuccess(t)
            }, function(t, i) {
                if (n.errorAlert(t.errorMessage), n.onEquipFail) n.onEquipFail(t, i)
            })
        }, t.prototype.lockToggle = function(n) {
            var t = this,
                i = this.gearTransferManager.createTransferDataObject(this.characterId, this.characterId, this.itemInstanceId, this.itemHash, 1, !1, "");
            this.gearTransferManager.lockItem(i, !n, function(i) {
                var r = !n;
                if (t.onLockToggle) t.onLockToggle(i, r);
                t.$modalEl.find(".lock-button").toggleClass("hidden")
            }, function(n) {
                t.errorAlert(n.errorMessage)
            })
        }, t.prototype.errorAlert = function(t) {
            var i = new n.GearChildModal("error", t);
            i.open()
        }, t
    }();
    n.GearItemDetail = t
}(Bnet || (Bnet = {}));
__extends = this && this.__extends || function(n, t) {
        function r() {
            this.constructor = n
        }
        for (var i in t) t.hasOwnProperty(i) && (n[i] = t[i]);
        n.prototype = t === null ? Object.create(t) : (r.prototype = t.prototype, new r)
    },
    function(n) {
        var t = function(n) {
            function t() {
                return n.apply(this, arguments) || this
            }
            return __extends(t, n), t.prototype.buildUrl = function() {
                return "/" + Localizer.CurrentCultureName + "/Vendors/VendorItemDetail?membershipType=" + this.membershipType + "&membershipId=" + this.membershipId + "&characterId=" + this.characterId + "&vendorHash=" + this.vendorHash + "&vendorSaleItemIndex=" + this.vendorSaleItemIndex + "&isV2=true"
            }, t.prototype.setGearTransferManager = function() {}, t
        }(n.GearItemDetail);
        n.VendorItemDetail = t
    }(Bnet || (Bnet = {}))