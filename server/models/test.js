(this.webpackJsonpscanner = this.webpackJsonpscanner || []).push([
    [0], {
        217: function(e, n, t) {
            e.exports = t(429)
        },
        222: function(e, n, t) {},
        287: function(e, n) {},
        427: function(e, n, t) {},
        429: function(e, n, t) {
            "use strict";
            t.r(n);
            var r = t(0),
                a = t.n(r),
                o = t(4),
                c = t.n(o),
                i = (t(222), t(35)),
                u = t(44),
                l = t(32),
                s = t.n(l),
                d = function(e) {
                    return {
                        inputStream: {
                            name: "Live",
                            type: "LiveStream",
                            target: e.target,
                            constraints: {
                                width: 640,
                                height: 480,
                                facingMode: "environment"
                            },
                            area: {
                                top: "10%",
                                right: "10%",
                                left: "10%",
                                bottom: "10%"
                            },
                            singleChannel: !1
                        },
                        decoder: {
                            readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader"],
                            debug: {
                                drawBoundingBox: !1,
                                showFrequency: !1,
                                drawScanline: !1,
                                showPattern: !1
                            }
                        },
                        locate: !0,
                        frequency: 10,
                        locator: {
                            halfSample: !0,
                            patchSize: "medium",
                            debug: {
                                showCanvas: !1,
                                showPatches: !1,
                                showFoundPatches: !1,
                                showSkeleton: !1,
                                showLabels: !1,
                                showPatchLabels: !1,
                                showRemainingPatchLabels: !1,
                                boxFromPatches: {
                                    showTransformed: !1,
                                    showTransformedBox: !1,
                                    showBB: !1
                                }
                            }
                        }
                    }
                },
                f = t(34),
                m = "PRODUCT_ADD",
                b = "PRODUCT_REPLACE_ALL",
                p = "PRODUCT_UPDATE",
                h = "PRODUCT_REQUESTED",
                v = "PRODUCT_EMIT",
                g = "SOCKET_ROOM_JOIN_REQUESTED",
                E = "SOCKET_ROOM_LEAVE_REQUESTED",
                O = "SOCKET_ROOM_CREATE_REQUESTED",
                w = "SOCKET_ROOM_JOINED",
                x = "SOCKET_ROOM_LEFT",
                y = "SOCKET_ROOM_CREATED",
                j = "SOCKET_ROOM_CREATED_ERROR",
                k = "SOCKET_ROOM_JOINED_ERROR",
                R = "SOCKET_ROOM_MEMBER_LIST";
            var C = function(e) {
                    var n = e.onStart,
                        t = void 0 === n ? function() {} : n,
                        a = e.onMatch,
                        o = void 0 === a ? function() {} : a,
                        c = Object(r.useState)({
                            match: !1,
                            processing: !1
                        }),
                        l = Object(u.a)(c, 2),
                        m = l[0],
                        b = l[1],
                        p = Object(f.c)((function(e) {
                            return e.products
                        })),
                        g = function() {
                            var e = Object(r.useState)(!1),
                                n = Object(u.a)(e, 2),
                                t = n[0],
                                a = n[1];
                            return [t, {
                                on: function() {
                                    return a(!0)
                                },
                                off: function() {
                                    return a(!1)
                                }
                            }]
                        }(),
                        E = Object(u.a)(g, 2),
                        O = E[0],
                        w = E[1],
                        x = Object(r.useRef)(),
                        y = Object(r.useRef)({}),
                        j = Object(r.useRef)(),
                        k = Object(f.b)(),
                        R = Object(f.c)((function(e) {
                            return e.rooms
                        }));
                    console.log(R), Object(r.useEffect)((function() {
                        j.current = !1;
                        return s.a.init(d({
                                target: x.current
                            }), (function(e) {
                                e ? console.log(e) : (s.a.start(), t && t(), s.a.onProcessed(T), s.a.onDetected(S))
                            })),
                            function() {
                                s.a.stop()
                            }
                    }), []);
                    var C = Object(r.useCallback)((function(e) {
                            k({
                                type: v,
                                payload: e.codeResult
                            })
                        }), []),
                        _ = Object(r.useCallback)((function(e) {
                            k({
                                type: h,
                                payload: e.codeResult
                            })
                        }), []),
                        S = Object(r.useCallback)((function(e) {
                            if (!j.current) {
                                if (y.current[e.codeResult.code] >= 3) {
                                    var n = s.a.canvas.ctx.overlay,
                                        t = s.a.canvas.dom.overlay;
                                    n.clearRect(0, 0, parseInt(t.getAttribute("width")), parseInt(t.getAttribute("height"))), C(e), _(e), b((function(n) {
                                        return Object(i.a)({}, n, {
                                            match: e.codeResult
                                        })
                                    })), y.current = {}, w.on(), j.current = !0
                                }
                                y.current[e.codeResult.code] || (y.current[e.codeResult.code] = 0), y.current[e.codeResult.code] += 1
                            }
                        }), [o, j]),
                        T = Object(r.useCallback)((function(e) {
                            if (!j.current) {
                                var n = s.a.canvas.ctx.overlay,
                                    t = s.a.canvas.dom.overlay;
                                e && (e.boxes && (n.clearRect(0, 0, parseInt(t.getAttribute("width")), parseInt(t.getAttribute("height"))), e.boxes.filter((function(n) {
                                    return n !== e.box
                                })).forEach((function(e) {}))), e.codeResult && e.codeResult.code && s.a.ImageDebug.drawPath(e.line, {
                                    x: "x",
                                    y: "y"
                                }, n, {
                                    color: "#FF4500",
                                    lineWidth: 3
                                }))
                            }
                        }), [j]),
                        P = Object(r.useCallback)((function() {
                            b({
                                match: !1,
                                processing: !1
                            }), j.current = !1, w.off()
                        }), []),
                        F = Object(r.useCallback)((function() {
                            return s.a.stop()
                        }), []);
                    return [{
                        ref: x
                    }, m, {
                        start: P,
                        stop: F,
                        isPaused: O,
                        list: p,
                        pauseCTL: w
                    }]
                },
                _ = t(135),
                S = t.n(_),
                T = t(136),
                P = t.n(T),
                F = t(20),
                A = t(16),
                D = t(37);

            function M() {
                var e = Object(F.a)(["\n\tdisplay: block;\n\twhite-space: nowrap;\n\toutline: none;\n\tbackground: ", ";\n    padding: 5px;\n    text-align: center;\n    border-radius: 2px;\n    color: #222;\n    text-transform: uppercase;\n    line-height: normal;\n    cursor: pointer;\n\tborder-bottom: 3px solid ", ";\n\t/* vertical-align: bottom; */\n\tmargin: 15px 0;\n\n\t&:hover {\n\t  color: #222;\n  \t}\n"]);
                return M = function() {
                    return e
                }, e
            }

            function I() {
                var e = Object(F.a)(["\n\tdisplay: block;\n\twhite-space: nowrap;\n\toutline: none;\n\tbackground: ", ";\n    padding: 5px;\n    text-align: center;\n    border-radius: 2px;\n    color: #222;\n    text-transform: uppercase;\n    line-height: normal;\n    cursor: pointer;\n\tborder-bottom: 3px solid ", ";\n\t/* vertical-align: bottom; */\n\tmargin: 15px 0;\n\n\t&:hover {\n\t  color: #222;\n  \t}\n"]);
                return I = function() {
                    return e
                }, e
            }

            function L() {
                var e = Object(F.a)(["\n  /* height: 60; */\n  width: 50px;\n  border-radius: 0; \n  outline: none;\n  text-align: center; \n  background-color: #ff4d4f; \n  vertical-align: middle; \n  display: flex;\n  justify-content: center; \n  align-items: center;\n  text-shadow: 0 -1px 0 rgba(0,0,0,0.12);\n  text-transform: capitalize;\n  font-size: 16;\n  border-radius: 1;\n  border-bottom: 3px solid #b71313!important;\n  box-shadow: 0 2px 0 rgba(0,0,0,0.045);\n  cursor: pointer;\n  position: absolute;\n  top: 0;\n  font-weight: 800;\n  padding: 10px;\n  color: #222;\n  border-bottom-left-radius: 10px;\n  transition: color 0.2s, background-color 0.2s, border 0.2s;\n\n  &:hover {\n\t  background-color: #ff7875;\n\t  color: #222;\n  }\n"]);
                return L = function() {
                    return e
                }, e
            }

            function K() {
                var e = Object(F.a)(["\n  padding: 10px 0;\n  z-index: 1000;\n  height: calc(100% - 80px);\n  margin: 10px 0;\n  overflow: scroll;\n  -webkit-overflow-scrolling: touch;\n\n  >ul {\n    padding: 0;\n    li {\n      h4 {\n        padding: 0;\n        margin: 0;\n        text-align: center;\n      }\n      color: white;\n      list-style-type: none;\n      padding: 0;\n    }\n  }\n\n"]);
                return K = function() {
                    return e
                }, e
            }

            function U() {
                var e = Object(F.a)(["\n\toverflow: hidden;\n\tborder-radius: 4px;\n"]);
                return U = function() {
                    return e
                }, e
            }

            function N() {
                var e = Object(F.a)(["\n  color: #7CFC00;\n\n  transition: opacity 0.2s ease-in, visibility 0.2s ease-in;\n  opacity: ", ";\n  visibility: ", ";\n\n  >h3 {\n    text-align: center;\n    margin: 5px;\n\tcolor: #7CFC00;\n    text-transform: capitalize;\n  }\n"]);
                return N = function() {
                    return e
                }, e
            }

            function B() {
                var e = Object(F.a)(["\n  height: 30%;\n  width: 30%;\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  background: none;\n  border-bottom: 1px solid ", ";\n  border-right: 1px solid ", ";\n\n"]);
                return B = function() {
                    return e
                }, e
            }

            function z() {
                var e = Object(F.a)(["\n  height: 30%;\n  width: 30%;\n  position: absolute;\n  bottom: 0;\n  background: none;\n  left: 0;\n  border-bottom: 1px solid ", ";\n  border-left: 1px solid ", ";\n\n"]);
                return z = function() {
                    return e
                }, e
            }

            function W() {
                var e = Object(F.a)(["\n  height: 30%;\n  width: 30%;\n  position: absolute;\n  top: 0;\n  right: 0;\n  background: none;\n  border-top: 1px solid ", ";\n  border-right: 1px solid ", ";\n\n"]);
                return W = function() {
                    return e
                }, e
            }

            function J() {
                var e = Object(F.a)(["\n  height: 30%;\n  width: 30%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  background: none;\n  border-top: 1px solid ", ";\n  border-left: 1px solid ", ";\n"]);
                return J = function() {
                    return e
                }, e
            }

            function Q() {
                var e = Object(F.a)(["\n  position: relative;\n  z-index: 10;  \n  width: 100%;\n  height: 100%;\n  transition: border 0.2s;\n  box-sizing: border-box;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  > * {\n    transition: all 0.2s ease-in;\n  }\n"]);
                return Q = function() {
                    return e
                }, e
            }

            function H() {
                var e = Object(F.a)(["\n\n  width: 100%;\n  height: calc(100% - 70%);\n  position: absolute;\n  bottom: 0;\n  background: linear-gradient(\n      rgba(0, 0, 0, 0.0) 0%,\n      rgba(0, 0, 0, 0.7) 50%,\n      rgba(0, 0, 0, 0.8) 70%,\n      rgba(0, 0, 0, 0.9) 80%,\n      rgba(0, 0, 0, 1) 90%,\n      rgba(0, 0, 0, 1) 95%,\n\n      rgba(0, 0, 0, 1.0) 100%\n    );\n\n\n"]);
                return H = function() {
                    return e
                }, e
            }

            function q() {
                var e = Object(F.a)(["\n  height: calc(15%);\n  width: 100%;\n  overflow: hidden;\n"]);
                return q = function() {
                    return e
                }, e
            }

            function V() {
                var e = Object(F.a)(["\n  width: 100%;\n  height: 100%;\n  background: rgba(0,0,0,0.7);\n  display: flex;\n  justify-content: center;\n  align-items: ", ";\n  color: white!important;\n  text-transform: capitalize;\n  position: relative;\n  overflow: hidden;\n  & > h4 {\n\tcolor: white!important;\n  }\n"]);
                return V = function() {
                    return e
                }, e
            }

            function Y() {
                var e = Object(F.a)(["\n  flex: 1;\n  background: rgba(0,0,0,0.7);\n"]);
                return Y = function() {
                    return e
                }, e
            }

            function $() {
                var e = Object(F.a)(["\n  flex: 5;\n  background: ", ";\n"]);
                return $ = function() {
                    return e
                }, e
            }

            function G() {
                var e = Object(F.a)(["\n  flex: 1;\n  background: rgba(0,0,0,0.7);\n"]);
                return G = function() {
                    return e
                }, e
            }

            function X() {
                var e = Object(F.a)(["\n  display: flex;\n  height: 70%;\n\n"]);
                return X = function() {
                    return e
                }, e
            }

            function Z() {
                var e = Object(F.a)(["\n  width: 100%;\n  height: 15%;\n\n"]);
                return Z = function() {
                    return e
                }, e
            }

            function ee() {
                var e = Object(F.a)(["\n  /* \n  width: 640px;\n  height: 480px; */\n  /* width: 100%;\n  height: 100%; */\n  position: relative;\n  overflow: hidden;\n\n"]);
                return ee = function() {
                    return e
                }, e
            }

            function ne() {
                var e = Object(F.a)(["\n  /* width: 100vw; */\n  /* height: 480px; */\n  position: absolute;\n  top: 0;\n  width: 100vw;\n  height: 100vh;\n\n  /* display:flex;\n  justify-content: center;\n  align-items: center;\n  overflow: hidden; */\n\n  position: absolute;\n  background: ", ";\n \n\n"]);
                return ne = function() {
                    return e
                }, e
            }

            function te() {
                var e = Object(F.a)(["\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  background: black;\n  position: fixed;\n  z-index: 1000;\n\n\n"]);
                return te = function() {
                    return e
                }, e
            }
            var re = A.a.div(te()),
                ae = A.a.div(ne(), (function(e) {
                    return e.isPaused ? "black" : "none"
                })),
                oe = A.a.div(ee()),
                ce = A.a.div(Z()),
                ie = Object(A.a)(ce)(X()),
                ue = A.a.div(G()),
                le = A.a.div($(), (function(e) {
                    return e.isPaused ? "black" : "none"
                })),
                se = A.a.div(Y()),
                de = A.a.div(V(), (function(e) {
                    return e.flexStart ? "flex-start" : (e.flexEnd, "flex-end")
                })),
                fe = Object(A.a)(ce)(q()),
                me = A.a.div(H()),
                be = A.a.div(Q()),
                pe = A.a.div(J(), (function(e) {
                    return e.match ? "#00FF00" : "white"
                }), (function(e) {
                    return e.match ? "#00FF00" : "white"
                })),
                he = A.a.div(W(), (function(e) {
                    return e.match ? "#00FF00" : "white"
                }), (function(e) {
                    return e.match ? "#00FF00" : "white"
                })),
                ve = A.a.div(z(), (function(e) {
                    return e.match ? "#00FF00" : "white"
                }), (function(e) {
                    return e.match ? "#00FF00" : "white"
                })),
                ge = A.a.div(B(), (function(e) {
                    return e.match ? "#00FF00" : "white"
                }), (function(e) {
                    return e.match ? "#00FF00" : "white"
                })),
                Ee = A.a.div(N(), (function(e) {
                    return e.isMatch ? 1 : 0
                }), (function(e) {
                    return e.isMatch ? "visible" : "hidden"
                })),
                Oe = A.a.svg(U()),
                we = (A.a.div(K()), Object(A.a)(D.c)(L())),
                xe = Object(A.a)(D.c)(I(), (function(e) {
                    return e.bg ? e.bg : "#fac742"
                }), (function(e) {
                    return e.bc ? e.bc : "#d29300"
                })),
                ye = A.a.div(M(), (function(e) {
                    return e.bg ? e.bg : "#fac742"
                }), (function(e) {
                    return e.bc ? e.bc : "#d29300"
                })),
                je = t(8),
                ke = function(e) {
                    return {
                        format: e.match.format.replace("_", "").toUpperCase(),
                        lineColor: "#000000",
                        background: "#ffffff",
                        width: 2,
                        height: 40,
                        displayValue: !0
                    }
                };
            var Re = function() {
                var e = C({}),
                    n = Object(u.a)(e, 3),
                    t = n[0],
                    o = n[1],
                    c = n[2],
                    i = Object(r.useRef)();
                return Object(r.useEffect)((function() {
                    o.match && S()(i.current, o.match.code, ke(o))
                }), [o.match]), a.a.createElement(re, null, a.a.createElement(oe, t), a.a.createElement(ae, {
                    isPaused: c.isPaused
                }, a.a.createElement(ce, null, a.a.createElement(de, {
                    flexEnd: !0
                }, a.a.createElement(we, {
                    to: "/",
                    style: {
                        position: "absolute",
                        top: 0,
                        right: 0
                    }
                }, a.a.createElement(je.a, {
                    type: "close"
                })), a.a.createElement("h4", {
                    style: {
                        display: o.match ? "none" : "block"
                    }
                }, "Scan Barcode"))), a.a.createElement(ie, null, a.a.createElement(se, null), a.a.createElement(le, {
                    isPaused: c.isPaused
                }, a.a.createElement(be, null, a.a.createElement(pe, {
                    className: "border",
                    match: o.match
                }), a.a.createElement(he, {
                    className: "border",
                    match: o.match
                }), a.a.createElement(Ee, {
                    isMatch: o.match
                }, a.a.createElement("h3", null, "Match hittad!"), a.a.createElement("div", {
                    onClick: function(e) {
                        return c.start()
                    }
                }, a.a.createElement(Oe, {
                    ref: i
                })), a.a.createElement(xe, {
                    bc: "#025190",
                    bg: "#017ad4",
                    to: "/barcodes"
                }, "List"), a.a.createElement(ye, {
                    onClick: function(e) {
                        return c.start()
                    }
                }, "Back")), a.a.createElement(ge, {
                    className: "border",
                    match: o.match
                }), a.a.createElement(ve, {
                    className: "border",
                    match: o.match
                }))), a.a.createElement(ue, null)), a.a.createElement(fe, null, a.a.createElement(de, {
                    flexStart: !0
                }), a.a.createElement(me, null))))
            };
            var Ce = t(433),
                _e = t(59),
                Se = t(51),
                Te = t(431),
                Pe = t(147),
                Fe = t(432),
                Ae = [{
                    title: "Name",
                    dataIndex: "name"
                }, {
                    title: "Cost",
                    className: "column-money",
                    dataIndex: "cost",
                    render: function(e) {
                        return a.a.createElement("a", null, e, "kr")
                    }
                }, {
                    title: "Code",
                    dataIndex: "code"
                }];

            function De() {
                var e = (Object(f.c)((function(e) {
                    return e.products
                })) || []).map((function(e, n) {
                    var t = {};
                    return e.product && (t.cost = e.product.price, t.name = e.product.title), Object(i.a)({
                        key: "" + n,
                        code: e.code
                    }, t)
                }));
                return a.a.createElement("div", null, a.a.createElement(Fe.a, {
                    columns: Ae,
                    dataSource: e,
                    bordered: !0,
                    title: function() {
                        return "List of scanned barcodes"
                    }
                }))
            }
            var Me = t(19),
                Ie = t.n(Me);

            function Le(e) {
                return Ie.a.async((function(n) {
                    for (;;) switch (n.prev = n.next) {
                        case 0:
                            return n.abrupt("return", fetch("https://develottment.com/products/" + e, {
                                mode: "cors"
                            }).then((function(e) {
                                return e.json()
                            })));
                        case 1:
                        case "end":
                            return n.stop()
                    }
                }))
            }
            var Ke = Te.a.Header,
                Ue = Te.a.Content,
                Ne = Te.a.Footer,
                Be = Te.a.Sider,
                ze = (Pe.a.SubMenu, function() {
                    var e = Object(r.useState)({
                            collapsed: !0,
                            room: "scanner",
                            selectedKey: "/"
                        }),
                        n = Object(u.a)(e, 2),
                        t = n[0],
                        o = n[1],
                        c = Object(f.c)((function(e) {
                            return e.rooms
                        })),
                        l = Object(f.b)(),
                        s = Object(Se.f)();
                    Object(r.useEffect)((function() {
                        console.log(s), o((function(e) {
                            return Object(i.a)({}, e, {
                                selectedKey: s.pathname
                            })
                        }))
                    }), [s.pathname]);
                    return a.a.createElement(Te.a, {
                        style: {
                            minHeight: "100vh"
                        }
                    }, a.a.createElement(Be, {
                        collapsed: t.collapsed,
                        onCollapse: function(e) {
                            o((function(n) {
                                return Object(i.a)({}, n, {
                                    collapsed: e
                                })
                            }))
                        }
                    }, a.a.createElement("div", {
                        className: "logo"
                    }), a.a.createElement(Pe.a, {
                        theme: "dark",
                        defaultSelectedKeys: [t.selectedKey],
                        selectedKeys: [t.selectedKey],
                        mode: "inline"
                    }, a.a.createElement(Pe.a.Item, {
                        key: "/"
                    }, a.a.createElement(D.b, {
                        to: "/"
                    }, a.a.createElement(je.a, {
                        type: "api"
                    }), a.a.createElement("span", null, "Rooms"))), a.a.createElement(Pe.a.Item, {
                        key: "/barcodes"
                    }, a.a.createElement(D.b, {
                        to: "/barcodes"
                    }, a.a.createElement(je.a, {
                        type: "barcode"
                    }), a.a.createElement("span", null, "Barcodes"))), a.a.createElement(Pe.a.Item, {
                        key: "/scanner"
                    }, a.a.createElement(D.b, {
                        to: "/scanner"
                    }, a.a.createElement(je.a, {
                        type: "scan"
                    }), a.a.createElement("span", null, "Scanner"))))), a.a.createElement(Te.a, null, a.a.createElement(Ke, {
                        style: {
                            background: "#fff",
                            padding: 0
                        }
                    }), a.a.createElement(Ue, {
                        style: {
                            margin: "0"
                        }
                    }, a.a.createElement("div", {
                        style: {
                            padding: 24,
                            background: "#fff",
                            minHeight: 360
                        }
                    }, a.a.createElement(Se.c, null, a.a.createElement(Se.a, {
                        path: "/barcodes",
                        render: function() {
                            return a.a.createElement(De, null)
                        }
                    }), a.a.createElement(Se.a, {
                        path: "/",
                        render: function() {
                            return a.a.createElement("div", null, a.a.createElement("h4", null, "You're in room: ", c.roomname), a.a.createElement("div", {
                                style: {
                                    margin: "10px 0"
                                }
                            }, a.a.createElement("ul", null, Object.entries(c.members).map((function(e) {
                                var n = Object(u.a)(e, 2),
                                    t = n[0],
                                    r = n[1];
                                return a.a.createElement("li", null, t, " -> active: ", r ? "YES" : "NO")
                            })))), a.a.createElement(Ce.a, {
                                value: t.room,
                                onChange: function(e) {
                                    return o((function(n) {
                                        return Object(i.a)({}, n, {
                                            room: e.target.value
                                        })
                                    }))
                                }
                            }), a.a.createElement(_e.a, {
                                onClick: function() {
                                    return l({
                                        type: O,
                                        payload: {
                                            roomname: t.room
                                        }
                                    })
                                }
                            }, "Create"), a.a.createElement(_e.a, {
                                onClick: function() {
                                    return l({
                                        type: g,
                                        payload: {
                                            roomname: t.room
                                        }
                                    })
                                }
                            }, "Join"), c.error && a.a.createElement("div", null, c.error.message))
                        }
                    })))), a.a.createElement(Ne, {
                        style: {
                            textAlign: "center"
                        }
                    })))
                });
            var We = function() {
                    return Object(r.useEffect)((function() {}), []), a.a.createElement("div", null, a.a.createElement(Se.a, {
                        path: "/scanner",
                        render: function() {
                            return a.a.createElement(Re, null)
                        }
                    }), a.a.createElement(Se.a, {
                        path: "/",
                        render: function() {
                            return a.a.createElement(ze, null)
                        }
                    }))
                },
                Je = Boolean("localhost" === window.location.hostname || "[::1]" === window.location.hostname || window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));

            function Qe(e, n) {
                navigator.serviceWorker.register(e).then((function(e) {
                    e.onupdatefound = function() {
                        var t = e.installing;
                        null != t && (t.onstatechange = function() {
                            "installed" === t.state && (navigator.serviceWorker.controller ? (console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."), n && n.onUpdate && n.onUpdate(e)) : (console.log("Content is cached for offline use."), n && n.onSuccess && n.onSuccess(e)))
                        })
                    }
                })).catch((function(e) {
                    console.error("Error during service worker registration:", e)
                }))
            }
            var He = t(40),
                qe = t(108),
                Ve = t(24),
                Ye = Ie.a.mark(Ge),
                $e = Ie.a.mark(Xe);

            function Ge(e) {
                var n;
                return Ie.a.wrap((function(t) {
                    for (;;) switch (t.prev = t.next) {
                        case 0:
                            return t.next = 2, Object(Ve.c)((r = e.payload, {
                                type: m,
                                payload: r
                            }));
                        case 2:
                            return t.next = 4, Object(Ve.a)(Le, e.payload.code);
                        case 4:
                            return n = t.sent, t.next = 7, Object(Ve.c)({
                                type: p,
                                payload: n
                            });
                        case 7:
                        case "end":
                            return t.stop()
                    }
                    var r
                }), Ye)
            }

            function Xe(e, n) {
                return Ie.a.wrap((function(t) {
                    for (;;) switch (t.prev = t.next) {
                        case 0:
                            e("/post/barcode", n.payload.code);
                        case 1:
                        case "end":
                            return t.stop()
                    }
                }), $e)
            }
            var Ze = Ie.a.mark(tn),
                en = Ie.a.mark(rn),
                nn = Ie.a.mark(an);

            function tn(e, n) {
                return Ie.a.wrap((function(t) {
                    for (;;) switch (t.prev = t.next) {
                        case 0:
                            e("/room/join", n.payload.roomname);
                        case 1:
                        case "end":
                            return t.stop()
                    }
                }), Ze)
            }

            function rn(e, n) {
                return Ie.a.wrap((function(t) {
                    for (;;) switch (t.prev = t.next) {
                        case 0:
                            e("/room/create", n.payload.roomname);
                        case 1:
                        case "end":
                            return t.stop()
                    }
                }), en)
            }

            function an(e, n) {
                return Ie.a.wrap((function(t) {
                    for (;;) switch (t.prev = t.next) {
                        case 0:
                            e("/room/leave", n.payload.roomname);
                        case 1:
                        case "end":
                            return t.stop()
                    }
                }), nn)
            }
            var on, cn = Ie.a.mark(mn),
                un = Ie.a.mark(bn),
                ln = Ie.a.mark(pn);

            function sn() {
                return on = P()("https://develottment.com", {
                    path: "/stream"
                }), new Promise((function(e) {
                    on.on("connect", (function() {
                        e(on)
                    }))
                }))
            }

            function dn(e) {
                return Object(qe.b)((function(n) {
                    return e.on("connect", (function(n) {
                            return console.log("Connected -> ", e.id)
                        })), e.on("/recieve/barcode", (function(e) {
                            n({
                                type: h,
                                payload: {
                                    code: e
                                }
                            })
                        })), e.on("/action", (function(e) {
                            n(e)
                        })),
                        function() {}
                }))
            }

            function fn(e) {
                return new Promise((function(n) {
                    n((function() {
                        e.emit.apply(e, arguments)
                    }))
                }))
            }

            function mn(e) {
                var n;
                return Ie.a.wrap((function(t) {
                    for (;;) switch (t.prev = t.next) {
                        case 0:
                            return t.next = 3, Object(Ve.d)(e);
                        case 3:
                            return n = t.sent, t.next = 6, Object(Ve.c)(n);
                        case 6:
                            t.next = 0;
                            break;
                        case 8:
                        case "end":
                            return t.stop()
                    }
                }), cn)
            }

            function bn() {
                var e, n, t, r, a = arguments;
                return Ie.a.wrap((function(o) {
                    for (;;) switch (o.prev = o.next) {
                        case 0:
                            for (e = a.length, n = new Array(e), t = 0; t < e; t++) n[t] = a[t];
                            return n[0], r = n[1], o.next = 4, Object(Ve.e)(h, Ge);
                        case 4:
                            return o.next = 6, Object(Ve.e)(v, Xe, r);
                        case 6:
                            return o.next = 8, Object(Ve.e)(g, tn, r);
                        case 8:
                            return o.next = 10, Object(Ve.e)(E, an, r);
                        case 10:
                            return o.next = 12, Object(Ve.e)(O, rn, r);
                        case 12:
                        case "end":
                            return o.stop()
                    }
                }), un)
            }

            function pn() {
                var e, n, t;
                return Ie.a.wrap((function(r) {
                    for (;;) switch (r.prev = r.next) {
                        case 0:
                            return r.next = 2, Object(Ve.a)(sn);
                        case 2:
                            return e = r.sent, r.next = 5, Object(Ve.a)(dn, e);
                        case 5:
                            return n = r.sent, r.next = 8, Object(Ve.a)(fn, e);
                        case 8:
                            return t = r.sent, r.next = 11, Object(Ve.b)(mn, n);
                        case 11:
                            return r.next = 13, Object(Ve.b)(bn, e, t);
                        case 13:
                        case "end":
                            return r.stop()
                    }
                }), ln)
            }
            var hn = pn,
                vn = t(212);
            var gn = function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
                    n = arguments.length > 1 ? arguments[1] : void 0;
                switch (n.type) {
                    case b:
                        return n.payload;
                    case m:
                        return [].concat(Object(vn.a)(e), [n.payload]);
                    case p:
                        return e.map((function(e) {
                            return n.payload.productid && e.code === n.payload.productid && (e.product = n.payload), e
                        }));
                    default:
                        return e
                }
            };
            var En = function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
                            roomname: "scanner",
                            result: null,
                            members: {}
                        },
                        n = arguments.length > 1 ? arguments[1] : void 0;
                    switch (console.log(n), n.type) {
                        case j:
                        case k:
                            return Object(i.a)({}, e, {
                                error: n.payload,
                                members: e.members
                            });
                        case y:
                            return {
                                roomname: n.payload.roomname, result: n.payload.result, members: e.members
                            };
                        case w:
                            return {
                                roomname: n.payload.roomname, members: e.members
                            };
                        case x:
                            return {
                                roomname: "", members: e.members
                            };
                        case R:
                            return {
                                roomname: e.roomname, members: n.payload.members
                            };
                        default:
                            return e
                    }
                },
                On = Object(He.c)({
                    products: gn,
                    rooms: En
                }),
                wn = Object(qe.a)(),
                xn = Object(He.e)(On, Object(He.a)(wn));
            wn.run(hn);
            var yn = xn;
            t(427), t(428);
            c.a.render(a.a.createElement((function() {
                    return a.a.createElement(f.a, {
                        store: yn
                    }, a.a.createElement(D.a, null, a.a.createElement(We, null)))
                }), null), document.getElementById("root")),
                function(e) {
                    if ("serviceWorker" in navigator) {
                        if (new URL("", window.location.href).origin !== window.location.origin) return;
                        window.addEventListener("load", (function() {
                            var n = "".concat("", "/service-worker.js");
                            Je ? (! function(e, n) {
                                fetch(e, {
                                    headers: {
                                        "Service-Worker": "script"
                                    }
                                }).then((function(t) {
                                    var r = t.headers.get("content-type");
                                    404 === t.status || null != r && -1 === r.indexOf("javascript") ? navigator.serviceWorker.ready.then((function(e) {
                                        e.unregister().then((function() {
                                            window.location.reload()
                                        }))
                                    })) : Qe(e, n)
                                })).catch((function() {
                                    console.log("No internet connection found. App is running in offline mode.")
                                }))
                            }(n, e), navigator.serviceWorker.ready.then((function() {
                                console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")
                            }))) : Qe(n, e)
                        }))
                    }
                }(), document.addEventListener("touchmove", (function(e) {
                    1 !== (e = e.originalEvent || e).scale && e.preventDefault()
                }), !1)
        }
    },
    [
        [217, 1, 2]
    ]
]);



