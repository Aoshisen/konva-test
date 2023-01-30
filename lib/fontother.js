fabric.OpentypeIText = fabric.util.createClass(fabric.Object, {
      type: "opentype-itext",
      _dimensionAffectingProps: l,
      cacheProperties: fabric.Object.prototype.cacheProperties.concat(
        l,
        "opentypeStroke",
        "fillPattern"
      ),
      width: 1,
      height: 1,
      maxWidth: 1,
      maxHeight: 1,
      minFontSize: 1,
      maxFontSize: 1,
      text: "",
      fontFamily: "Arial",
      fontSize: 1,
      multiline: !1,
      tracking: 0,
      lineSpacing: 1,
      ligatures: !0,
      _ligaturesNotSupported: !1,
      flatCharHeightCache: {},
      lineHeight: 1.16,
      _fontSizeMult: 1,
      _fontSizeFraction: 0,
      _textData: null,
      _fillPatternNeedsUpdate: !0,
      __fillPatternImage: null,
      __fillPattern: null,
      _lastDrawnData: {},
      opentypeStrokeWidth: 0,
      opentypeStroke: "#000000",
      strokeRenderingCanvas: null,
      CACHE_FONT_SIZE: 200,
      initialize: function (e, t) {
        this.callSuper("initialize", t),
          (this.text = e),
          (t.version = t.version || fabric.BoundedText.prototype.version),
          (this.strokeRenderingCanvas = fabric.util.createCanvasElement()),
          this._setWidthHeight();
      },
      _measureTextOpenType: function (e, t, i, n, o) {
        try {
          return {
            metric: window._measureTextOpentype.call(e, t, i, n, o),
            disableLigatures: !1,
          };
        } catch (error) {
          if (
            !this._ligaturesNotSupported &&
            error &&
            error.message.indexOf("is not yet supported") > -1
          )
            return (
              (this._ligaturesNotSupported = !0),
              console.warn("Disabling ligatures for font " + this.fontFamily),
              (e.ligatures = !1),
              {
                metric: window._measureTextOpentype.call(e, t, i, n, o),
                disableLigatures: !0,
              }
            );
          throw error;
        }
      },
      _splitTextIntoLines: function (e, t, i, n) {
        const o = e.split(" "),
          r = [];
        let a = o[0];
        for (let s = 1; s < o.length; s++) {
          const e = o[s],
            l = this._getTextMetrics(a + " " + e, t),
            c = n / this.CACHE_FONT_SIZE;
          l.textWidth * c < i ? (a += " " + e) : (r.push(a), (a = e));
        }
        return r.push(a), r.join("\n");
      },
      _getCtxCacheKey: function (e, t, i) {
        return `${e.font}:${e.lineSpacing}:${
          e.opentypeStrokeWidth
        }:${t}:${!!i}`;
      },
      _joinWordsMetrics: function (e, t, i, o, r) {
        const a = {
          width: 0,
          totalWidth: 0,
          height: fabric.util.array.max(t, "height") + r,
          heightNoStroke: fabric.util.array.max(t, "heightNoStroke"),
          minY: fabric.util.array.min(t, "minY"),
          maxY: fabric.util.array.max(t, "maxY"),
          totalWidthNoJustify: 0,
          fontHeight: t[0].fontHeight,
          fontAscender: t[0].fontAscender,
          fontDescender: t[0].fontDescender,
          descent: fabric.util.array.max(t, "descent"),
          ascent: fabric.util.array.max(t, "ascent"),
          leftSideBearing: t[0].leftSideBearing,
          rightSideBearing: t[t.length - 1].rightSideBearing,
          leftStrokeWidth: n(e[0]) ? 0 : r / 2,
          rightStrokeWidth: n(e[e.length - 1]) ? 0 : r / 2,
        };
        for (let s = 0; s < e.length; s++) {
          const r = e[s],
            l = t[s];
          if (((a.width += l.width), (a.totalWidth += l.totalWidth), n(r))) {
            const r = t[s - 1],
              l = t[s + 1],
              c = e[s - 1];
            let d = (r ? r.rightSideBearing : 0) + (l ? l.leftSideBearing : 0);
            (d += (0 === s || n(c) ? 1 : 2) * (i / 1e3) * o),
              (a.totalWidth += d),
              (a.width += d);
          }
        }
        return (a.totalWidthNoJustify = a.totalWidth), a;
      },
      _getTextMetrics: function (e, t) {
        const i = e.replace(/\r\n/g, "\n").split("\n"),
          n = this.getMeasuringContext();
        n.opentypeStrokeWidth = 0;
        const r = this._getCtxCacheKey(n, t, n.ligatures);
        c[r] || (c[r] = {}),
          d[r] && ((n.ligatures = !1), (this._ligaturesNotSupported = !0));
        const a = [];
        for (const p of i) {
          const e = o(p),
            i = [];
          for (const o of e)
            if (c[r][o]) i.push(c[r][o]);
            else {
              const { metric: e, disableLigatures: a } =
                this._measureTextOpenType(n, o, !0, null, t);
              (d[r] = a),
                a && (n.ligatures = !1),
                e && e.isOpenTypeMetrics && (c[r][o] = e),
                i.push(e);
            }
          const s = this._joinWordsMetrics(
            e,
            i,
            t,
            this.CACHE_FONT_SIZE,
            this.opentypeStrokeWidth
          );
          a.push(s);
        }
        let s = 0;
        for (const o of a) s += o.fontHeight;
        let l = fabric.util.array.max(a, "totalWidth"),
          u = a.some((e) => e.leftStrokeWidth > 0)
            ? this.opentypeStrokeWidth / 2
            : 0,
          h = a.some((e) => e.rightStrokeWidth > 0)
            ? this.opentypeStrokeWidth / 2
            : 0;
        return {
          lineMetrics: a,
          textLines: i,
          textWidth: l,
          textHeight: s,
          leftStrokeWidth: u,
          rightStrokeWidth: h,
        };
      },
      _getBoundedTextMetrics: function (e, t, i, n) {
        let {
          lineMetrics: o,
          textLines: r,
          textWidth: a,
          textHeight: s,
          leftStrokeWidth: l,
          rightStrokeWidth: c,
        } = this._getTextMetrics(e, t);
        const d = (i - l - c) / a,
          u = n / s;
        let h = Math.min(d, u),
          p = h * this.CACHE_FONT_SIZE;
        if (p > this.maxFontSize)
          (h *= this.maxFontSize / p), (p = this.maxFontSize);
        else if (p < this.minFontSize) {
          let d = e,
            u = 0,
            m = 0,
            g = 0;
          do {
            let f = !0;
            if (this.multiline && 1 === u) {
              let o = this._splitTextIntoLines(
                  e,
                  t,
                  i - this.opentypeStrokeWidth,
                  this.minFontSize
                ),
                r = "",
                a = 1,
                s = 1;
              do {
                const e = o.lastIndexOf("\n");
                if (!(e > -1)) break;
                (r = o.slice(e + 1)), (o = o.slice(0, e));
                const l = this._getTextMetrics(o, t);
                (s =
                  (i - l.leftStrokeWidth - l.rightStrokeWidth) / l.textWidth),
                  (a = n / l.textHeight);
              } while (
                Math.min(a, s) * this.CACHE_FONT_SIZE < this.minFontSize &&
                o
              );
              (e = o), r ? (e += "\n" + r) : (f = !1);
            }
            u > 0 && f && (e = e.slice(0, e.length - 1)),
              this.multiline
                ? ((p = this.minFontSize),
                  (d = this._splitTextIntoLines(
                    e,
                    t,
                    i - this.opentypeStrokeWidth,
                    p
                  )))
                : (d = e);
            const v = this._getTextMetrics(d, t);
            (o = v.lineMetrics),
              (r = v.textLines),
              (a = v.textWidth),
              (s = v.textHeight),
              (l = v.leftStrokeWidth),
              (c = v.rightStrokeWidth),
              (g = (i - l - c) / a),
              (m = n / s),
              (h = Math.min(m, g)),
              (p = h * this.CACHE_FONT_SIZE),
              ++u;
          } while (p < this.minFontSize && e.length);
          p > this.maxFontSize &&
            ((h = this.maxFontSize / this.CACHE_FONT_SIZE),
            (p = h * this.CACHE_FONT_SIZE));
        }
        for (const m of o)
          for (const e in m)
            "leftStrokeWidth" !== e &&
              "rightStrokeWidth" !== e &&
              (m[e] = m[e] * h);
        for (const m of o)
          (m.totalWidth += m.leftStrokeWidth + m.rightStrokeWidth),
            (m.totalWidthNoJustify += m.leftStrokeWidth + m.rightStrokeWidth);
        return {
          fontSize: p,
          textLines: r,
          metrics: o,
          textWidth: a * h + l + c,
          textHeight: s * h + this.opentypeStrokeWidth,
        };
      },
      getMeasuringContext: function () {
        fabric._measuringContext ||
          (fabric._measuringContext =
            (this.canvas && this.canvas.contextCache) ||
            fabric.util.createCanvasElement().getContext("2d"));
        const e = fabric._measuringContext;
        return (
          (e.lineSpacing = this.lineSpacing),
          (e.ligatures = !this._ligaturesNotSupported && this.ligatures),
          (e.font = fabric.Text.prototype._getFontDeclaration.call(
            this,
            {
              fontFamily: this.fontFamily,
              fontSize: this.CACHE_FONT_SIZE,
              fontWeight: this.fontWeight,
              fontStyle: this.fontStyle,
            },
            !0
          )),
          (e.trueFontSize = this.CACHE_FONT_SIZE),
          (e.strokeRenderingCanvas = this.strokeRenderingCanvas),
          e
        );
      },
      _setWidthHeight: function () {
        (this._textData = this._getBoundedTextMetrics(
          this.text,
          this.tracking,
          this.maxWidth,
          this.maxHeight
        )),
          (this.width =
            "justify" === this.textAlign
              ? this.maxWidth
              : this._textData.textWidth),
          (this.height = this._textData.textHeight),
          (this.fontSize = this._textData.fontSize);
      },
      _set: function (e, t) {
        return (
          "fontFamily" === e
            ? ((this.flatCharHeightCache = {}),
              (this._ligaturesNotSupported = !1))
            : "fillPattern" === e && (this._fillPatternNeedsUpdate = !0),
          this.callSuper("_set", e, t),
          this._dimensionAffectingProps.indexOf(e) > -1 &&
            this._setWidthHeight(),
          this
        );
      },
      getTextPaths: function (e = !1) {
        const t = (e, t = 0, i = 0) => {
            for (var n = 0; n < e.length; ++n)
              for (
                var o = e[n], r = o.offsetX + t, a = o.offsetY + i, s = 0;
                s < o.commands.length;
                s += 1
              ) {
                var l = o.commands[s];
                "M" === l.type || "L" === l.type
                  ? ((l.x += r), (l.y += a))
                  : "C" === l.type
                  ? ((l.x += r),
                    (l.y += a),
                    (l.x1 += r),
                    (l.y1 += a),
                    (l.x2 += r),
                    (l.y2 += a))
                  : "Q" === l.type &&
                    ((l.x += r), (l.y += a), (l.x1 += r), (l.y1 += a));
              }
            return e;
          },
          i = this.maxWidth,
          n = this.maxHeight,
          o = [];
        if (this._lastDrawnData && Object.keys(this._lastDrawnData).length) {
          const r = Object.keys(this._lastDrawnData);
          for (let a = 0; a < r.length; a++) {
            const s = r[a],
              l = this._lastDrawnData[s];
            let c = -l.x + (i - this.width) / 2 - (-l.x - this.width / 2);
            "left" === this.textAlign
              ? (c -= (i - this.width) / 2)
              : "right" === this.textAlign && (c += (i - this.width) / 2);
            const d = l.y + (n - this.height) / 2 - (l.y - this.height / 2),
              u = t(l.paths, c, d);
            for (let t = 0; t < u.length; t++) {
              const i = u[t];
              o.push(e ? i.toSVG(8) : i.toPathData(8));
            }
          }
          return {
            paths: o,
            strokeWidth: this._lastDrawnData[0].strokeWidth,
            width: i,
            height: n,
          };
        }
        return null;
      },
      _renderBackground: function (e) {
        let t = { x: e.canvas.width, y: e.canvas.height };
        e.clearRect(-t.x / 2, -t.y / 2, t.x, t.y),
          this.backgroundColor &&
            ((t = this._getNonTransformedDimensions()),
            (e.fillStyle = this.backgroundColor),
            e.fillRect(-t.x / 2, -t.y / 2, t.x, t.y),
            this._removeShadow(e));
      },
      _render: function (e) {
        if (
          ((e.strokeRenderingCanvas = this.strokeRenderingCanvas),
          this._fillPatternNeedsUpdate && this.fillPattern)
        ) {
          (this._fillPatternNeedsUpdate = !1),
            (this._fillPatternImage = this.fillPattern);
          const e = this.getMeasuringContext();
          if (
            ((this._fillPattern = e.createPattern(
              this.fillPattern.source,
              this.fillPattern.repeat || "repeat"
            )),
            !this._fillPattern)
          ) {
            console.warn("Pattern was null, recreating");
            let t = 0;
            const i = setInterval(() => {
              (this._fillPattern = e.createPattern(
                this.fillPattern.source,
                this.fillPattern.repeat || "repeat"
              )),
                this._fillPattern
                  ? clearInterval(i)
                  : ++t > 10 &&
                    (clearInterval(i),
                    console.error("Failed to create pattern"));
            }, 50);
          }
        }
        this._renderTextCommon(e);
      },
      getFlatCharacterHeight: function () {
        const e = "x",
          t = this.getMeasuringContext(),
          i = this.fontSize / this.CACHE_FONT_SIZE;
        let n = 0;
        if (
          this.flatCharHeightCache[e] &&
          this.flatCharHeightCache[e].font === t.font &&
          this.flatCharHeightCache[e].strokeWidth === t.opentypeStrokeWidth &&
          this.textAlign === this.flatCharHeightCache[e].textAlign
        )
          n = this.flatCharHeightCache[e].height;
        else {
          const { metric: i } = this._measureTextOpenType(
            t,
            e,
            !0,
            null,
            this.tracking
          );
          (this.flatCharHeightCache[e] = {}),
            (this.flatCharHeightCache[e].font = t.font),
            (this.flatCharHeightCache[e].strokeWidth = t.opentypeStrokeWidth),
            (this.flatCharHeightCache[e].textAlign = this.textAlign),
            (this.flatCharHeightCache[e].height = i.heightNoStroke),
            (n = i.heightNoStroke);
        }
        return (n *= i), n;
      },
      _renderTextCommon: function (e) {
        let t;
        this._lastDrawnData = {};
        const { textLines: i, metrics: n, textHeight: o } = this._textData;
        (e.opentypeStroke = this.opentypeStroke),
          (e.opentypeStrokeWidth = this.opentypeStrokeWidth),
          (e.lineSpacing = this.lineSpacing),
          (e.ligatures = !this._ligaturesNotSupported && this.ligatures),
          (e.font = fabric.Text.prototype._getFontDeclaration.call(
            this,
            {
              fontFamily: this.fontFamily,
              fontSize: this.fontSize,
              fontWeight: this.fontWeight,
              fontStyle: this.fontStyle,
            },
            !1
          )),
          (e.trueFontSize = this.fontSize),
          (e._fillPattern = this._fillPattern),
          (e._fillPatternImage = this._fillPatternImage);
        let r = 0,
          a = 0,
          s = [];
        1 === i.length && "justify" !== this.textAlign
          ? ((t = n[0]), (a = -this.width / 2))
          : (a = -this.width / 2);
        const l = o,
          c =
            1 === n.length
              ? this.getFlatCharacterHeight()
              : n[0].maxY + n[0].fontHeight * (n.length - 1),
          d = (l - c) / 2,
          u = l / 2 - d - n[0].fontHeight * (n.length - 1);
        for (let h = 0, p = i.length; h < p; h++) {
          let o = 0;
          (1 === i.length && "justify" !== this.textAlign) || (t = n[h]),
            "center" === this.textAlign &&
              (o = (this.width - t.totalWidth) / 2),
            "right" === this.textAlign && (o = this.width - t.totalWidth),
            (o += t.leftStrokeWidth);
          const l = t.fontHeight;
          (s[h] = l),
            h > 0 && (r += s[h - 1]),
            this._renderTextLine(
              e,
              i[h],
              "justify" === this.textAlign,
              a + o - t.leftSideBearing,
              r + u - this.opentypeStrokeWidth / 2,
              h,
              t
            );
        }
      },
      _renderTextLine: function (e, t, i, n, o, r, a) {
        return (
          e.save(),
          (e.lineMetrics = a),
          (info = window._fillTextOpentype.call(
            e,
            t,
            n,
            o,
            i ? this.maxWidth : null,
            this.tracking
          )),
          (this._lastDrawnData[r] = Object.assign({}, e.lastDrawnData, {
            width: this.width,
            height: this.height,
          })),
          (e.lineMetrics = null),
          e.restore(),
          info
        );
      },
    });
  }