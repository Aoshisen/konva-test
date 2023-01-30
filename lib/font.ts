let fontsObjects = {};
const Font = {
  clearCache: function () {
    fontsObjects = {};
  },
  resolve: function (font) {
    if (
      ((font = font.replace(/"/g, "")),
      (font = font.replace(/'/g, "")),
      (font = font.toLowerCase()),
      fontsObjects[font])
    ) {
      return fontsObjects[font];
    }
    for (var _font in fontsObjects)
      if (fontsObjects.hasOwnProperty(_font) && _font.startsWith(font))
        return fontsObjects[_font];
    console.error('Font "' + font + '" was not cached with loadAsync()');
  },
  loadAsync: function (fontName, fontUrl) {
    console.log("fontName",fontName);
    
    return new Promise(function (i, r) {
      (fontName = fontName.replace(/"/g, "")),
        (fontName = fontName.replace(/'/g, "")),
        (fontName = fontName.toLowerCase()),
        Object(n["a"])(fontUrl, function (n, a) {
          if (n) {
            return r(n);
          } else if (a) {
            fontsObjects[fontName] = a;
            a.numGlyphs;
            var glyph,
              fontFace,
              c = -99999999,
              d = 99999999,
              u = "x",
              fontFace = null;
            for (glyph in a.glyphs.glyphs)
              if (
                a.glyphs.glyphs.hasOwnProperty(glyph) &&
                ((fontFace = a.glyphs.glyphs[glyph]), fontFace.name == u)
              ) {
                fontFace = fontFace;
                break;
              }
            if (!fontFace)
              for (glyph in ((u = u.toUpperCase()), a.glyphs.glyphs))
                if (
                  a.glyphs.glyphs.hasOwnProperty(glyph) &&
                  ((fontFace = a.glyphs.glyphs[glyph]), fontFace.name == u)
                ) {
                  fontFace = fontFace;
                  break;
                }
            if (fontFace) {
              var p = fontFace.getMetrics();
              for (glyph in a.glyphs.glyphs)
                if (a.glyphs.glyphs.hasOwnProperty(glyph)) {
                  fontFace = a.glyphs.glyphs[glyph];
                  var metrics = fontFace.getMetrics();
                  "undefined" !== typeof metrics.yMin
                    ? ((fontFace.descent = Math.abs(metrics.yMin)),
                      (fontFace.ascent = Math.abs(p.yMax - metrics.yMax)))
                    : ((fontFace.ascent = 0), (fontFace.descent = 0));
                }
            } else
              for (glyph in (console.warn(
                "Couldn't find pattern Glyph for font: " + fontName
              ),
              a.glyphs.glyphs))
                a.glyphs.glyphs.hasOwnProperty(glyph) &&
                  ((fontFace = a.glyphs.glyphs[glyph]), (fontFace.descent = 0));
            for (glyph in a.glyphs.glyphs)
              if (a.glyphs.glyphs.hasOwnProperty(glyph)) {
                fontFace = a.glyphs.glyphs[glyph];
                var g = fontFace.getMetrics();
                "undefined" !== typeof g.yMin &&
                  ((c = Math.max(g.yMax, c)), (d = Math.min(g.yMin, d)));
              }
            (a.totalDescender = d),
              (a.totalAscender = c),
              (a.fontHeight = Math.abs(c - d)),
              i();
          } else {
            return r(new Error("Couldn't load font from " + fontUrl));
          }
        });
    });
  },
  hasFont: function (e) {
    return (e = e.replace(/"/g, "")), (e = e.toLowerCase()), !!fontsObjects[e];
  },
};

export default Font;
