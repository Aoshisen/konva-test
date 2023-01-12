fabric.BoundedText = fabric.util.createClass(fabric.Group, {
      cacheProperties: fabric.Group.prototype.cacheProperties.concat(
        "textVerticalAlign",
        "textAlign",
        "caps",
        "outlineWidth",
        "fontFamily",
        "fillPattern",
        "version",
        "lineSpacing",
        "ligatures",
        "tracking",
        "fontSize",
        "multiline",
        "minSizePx",
        "maxSizePx",
        "prefix",
        "suffix",
        "referenceId",
        "_textWithoutPrefixSuffix"
      ),
      async: !0,
      type: "bounded-text",
      lockUniScalingWithSkew: !1,
      caps: !1,
      debug: !1,
      version: "2.0.0",
      Itext: !1,
      textVerticalAlign: "center",
      lineSpacing: 1,
      _textWithoutPrefixSuffix: "",
      initialize: function (e) {
        e.fontFamily && (e.fontFamily = this._sanitizeFontFamily(e.fontFamily)),
          (e.version = e.version || fabric.BoundedText.prototype.version),
          (e.width = e.width || 300),
          (e.height = e.height || 300);
        const t = {
            width: e.width,
            height: e.height,
            fontSize: e.fontSize || 200,
            originX: "center",
            originY: "center",
            textAlign: e.textAlign || "center",
            centeredRotation: !0,
            color: e.color || "black",
            fontFamily: e.fontFamily || "Arial",
            backgroundColor: this.debug ? "#f7dacf" : "rgba(0,0,0,0)",
            tracking: e.tracking || 0,
            version: e.version,
          },
          i = new fabric.OpentypeIText("", t);
        i.set("maxWidth", e.width), i.set("maxHeight", e.height);
        const n = new fabric.Rect({
          strokeDashArray: e.strokeDashArray,
          originX: "center",
          originY: "center",
          stroke: "#000000",
          strokeWidth: 3,
          width: e.width,
          height: e.height,
          fill: "rgba(0, 0, 0, 0)",
        });
        this.callSuper("initialize", [i, n], e),
          this.setTextAlign(e.textAlign || "center"),
          this.setText(e.Itext ? "ם" : "A"),
          this.on({
            scaling: function (e) {
              if (this.lockUniScalingWithSkew) {
                let t = 1;
                (t =
                  "scaleX" === e.transform.action ? this.scaleX : this.scaleY),
                  (this.scaleX = t),
                  (this.scaleY = t);
              }
            },
            scaled: function () {
              this.setScale(this.width, this.height, !1);
            },
            added: function () {
              (this.cornerSize = 0.025 * this.canvas.width),
                (this.transparentCorners = !1);
            },
          });
      },
      _getCacheCanvasDimensions: function () {
        const e = this.callSuper("_getCacheCanvasDimensions");
        return (e.height = 2 * this.height * e.zoomY), e;
      },
      updateFromGroupScaling: function () {
        this.setScale(this.width, this.height, !0);
      },
      setScale: function (e, t, i) {
        const n = e * this.scaleX,
          o = t * this.scaleY;
        (this.scaleX = 1),
          (this.scaleY = 1),
          this.setWidth(n),
          this.setHeight(o),
          i && this.setTextAlign(this.getTextAlign());
      },
      _set: function (e, t) {
        "minSizePx" === e
          ? this.setMinSizePx(t)
          : "maxSizePx" === e
          ? this.setMaxSizePx(t)
          : "textAlign" === e
          ? this.setTextAlign(t)
          : "caps" === e
          ? this.setCaps(t)
          : "text" === e
          ? this.setText(t)
          : "outlineWidth" === e
          ? this.setOutlineWidth(t)
          : "fontFamily" === e
          ? this.setFontFamily(t)
          : "fill" === e && t.constructor === fabric.Pattern
          ? this.item(0).set("fillPattern", t)
          : "version" === e
          ? this.item(0).set("version", t)
          : "lineSpacing" === e
          ? this.item(0).set("lineSpacing", t)
          : "ligatures" === e
          ? this.item(0).set("ligatures", t)
          : "multiline" === e && this.setMultiline(t),
          this.callSuper("_set", e, t),
          ("prefix" !== e && "suffix" !== e) || this.setText(this.getText());
      },
      getTextPaths: function (e = !1) {
        return this.item(0).getTextPaths(e);
      },
      setTextAlign: function (e) {
        "opentype-itext" == this.item(0).type &&
          this.item(0).set("textAlign", e);
      },
      setTrackingAmount: function (e) {
        this.item(0).set("tracking", e || 0);
      },
      getTrackingAmount: function () {
        return this.item(0).tracking || 0;
      },
      getOutlineWidth: function () {
        return this.item(0).opentypeStrokeWidth || 0;
      },
      setOutlineWidth: function (e) {
        this.item(0).set("opentypeStrokeWidth", e || 0);
      },
      getOutlineColor: function () {
        return this.item(0).opentypeStroke || "#000000";
      },
      setOutlineColor: function (e) {
        this.item(0).set("opentypeStroke", e || "#000000");
      },
      getTextAlign: function () {
        return this.item(0).textAlign;
      },
      setCursorColor: function (e) {
        this.item(0).cursorColor = e;
      },
      setStroke: function (e) {
        this.item(1).set("stroke", e);
      },
      setStrokeWidth: function (e) {
        this.item(1).set("strokeWidth", e);
      },
      getStroke: function () {
        return this.item(1).stroke;
      },
      setColor: function (e) {
        this.item(0).setColor(e);
      },
      getColor: function () {
        return this.item(0).fill;
      },
      getText: function () {
        return this._textWithoutPrefixSuffix;
      },
      getTextWithLines: function () {
        return this.item(0).getText();
      },
      setText: function (e) {
        return (
          e || (e = ""),
          this.set("_textWithoutPrefixSuffix", e),
          this.caps && (e = e.toUpperCase()),
          (e = (this.prefix || "") + e + (this.suffix || "")),
          this.item(0).set("text", this.Itext ? n.reverse(e) : e),
          e
        );
      },
      forceFontSize: function (e) {
        e
          ? (this.item(0).set("maxFontSize", e),
            this.item(0).set("minFontSize", e))
          : (this.item(0).set("maxFontSize", this.maxSizePx),
            this.item(0).set("minFontSize", this.minSizePx));
      },
      setFontSize: function (e) {
        this.item(0).fontSize = e;
      },
      getFontSize: function () {
        return this.item(0).fontSize;
      },
      _sanitizeFontFamily: function (e) {
        return e.indexOf("'") < 0 && (e = "'" + e + "'"), e;
      },
      setFontFamily: function (e) {
        (e = this._sanitizeFontFamily(e)), this.item(0).set("fontFamily", e);
      },
      getFontFamily: function () {
        return this.item(0).fontFamily;
      },
      setWidth: function (e) {
        e || (e = 0),
          this.set("width", e),
          this.item(1).set("width", e),
          this.item(0).set("maxWidth", e);
      },
      getWidth: function () {
        return this.width * this.scaleX;
      },
      setHeight: function (e) {
        e || (e = 0),
          this.set("height", e),
          this.item(1).set("height", e),
          this.item(0).set("maxHeight", e);
      },
      getHeight: function () {
        return this.height * this.scaleY;
      },
      setMinSizePx: function (e) {
        (this.minSizePx = e), this.item(0).set("minFontSize", e);
      },
      setMaxSizePx: function (e) {
        (this.maxSizePx = e), this.item(0).set("maxFontSize", e);
      },
      setMultiline: function (e) {
        (this.multiline = e), this.item(0).set("multiline", e);
      },
      setCaps: function (e) {
        (this.caps = e), e && this.setText(this.getText().toUpperCase());
      },
      getTextPosition: function (e, t) {
        const i = { top: 0, left: 0 };
        switch (t) {
          case "center":
            i.top = 0;
            break;
          case "top":
            i.top = (this.getHeight() - this.item(0).height) / -2;
            break;
          case "bottom":
            i.top = (this.getHeight() - this.item(0).height) / 2;
            break;
        }
        switch (e) {
          case "justify":
          case "center":
            i.left = 0;
            break;
          case "left":
            i.left = (this.getWidth() - this.item(0).width) / -2;
            break;
          case "right":
            i.left = (this.getWidth() - this.item(0).width) / 2;
            break;
        }
        return i;
      },
      drawObject: function (e) {
        const t = this.getTextPosition(this.textAlign, this.textVerticalAlign);
        this.item(0).set({ top: t.top, left: t.left }),
          this.callSuper("drawObject", e);
      },
      clone: function (e) {
        const t = new fabric.BoundedText({
          width: this.getWidth(),
          height: this.getHeight(),
          originX: "center",
          originY: "center",
          left: this.left,
          top: this.top,
          skewX: this.skewX,
          skewY: this.skewY,
          strokeDashArray: this.item(1).strokeDashArray,
          angle: this.angle,
          centeredRotation: (!0).centeredRotation,
          Itext: this.Itext,
          lockSkewingX: this.lockSkewingX,
          lockSkewingY: this.lockSkewingY,
          lockScalingFlip: !0,
          fontPath: this.fontPath,
          fontName: this.firstFontName || this.fontName,
          fontColorsMap: new Map(this.fontColorsMap),
          fontsMap: new Map(this.fontsMap),
          outlineColor: this.outlineColor,
          id: this.id,
          uuid: this.uuid,
          evented: this.evented,
          selectable: this.selectable,
          locked: this.locked,
          visible: this.visible,
          name: this.name,
          fontColorOption: this.fontColorOption,
          fontOption: this.fontOption,
          prefix: this.prefix,
          suffix: this.suffix,
          ligatures: this.ligatures,
          referenceId: this.referenceId,
          lineSpacing: this.lineSpacing,
          groupId: this.groupId,
        });
        t.setMultiline(this.multiline),
          t.setMinSizePx(this.minSizePx),
          t.setMaxSizePx(this.maxSizePx),
          t.setFontFamily(this.getFontFamily()),
          t.setFontSize(this.item(0).fontSize),
          t.setColor(this.getColor()),
          t.setStroke(this.item(1).stroke),
          t.setStrokeWidth(this.item(1).strokeWidth),
          t.setCursorColor(this.item(0).cursorColor),
          t.setTextAlign(this.item(0).textAlign),
          t.setOutlineColor(this.getOutlineColor()),
          t.setOutlineWidth(this.getOutlineWidth()),
          t.setTrackingAmount(this.getTrackingAmount()),
          t.set("caps", this.caps),
          t.set("fontLibraryId", this.fontLibraryId),
          t.set("colorLibraryId", this.colorLibraryId),
          t.set("zIndex", this.zIndex),
          t.set("version", this.version),
          t.item(0).set("version", this.version),
          t.set("prefix", this.prefix),
          t.set("suffix", this.suffix),
          t.setText(this.getText()),
          e && e(t);
      },
    });
  },