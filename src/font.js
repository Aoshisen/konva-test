const Font = {
  clearCache: function () {
    o = {};
  },
  resolve: function (font) {
    if (
      ((font = font.replace(/"/g, "")),
      (font = font.replace(/'/g, "")),
      (font = font.toLowerCase()),
      o[font])
    )
      return o[font];
    for (var t in o) if (o.hasOwnProperty(t) && t.startsWith(font)) return o[t];
    console.error('Font "' + font + '" was not cached with loadAsync()');
  },
  loadAsync: function (e, t) {
    return new Promise(function (i, r) {
      (e = e.replace(/"/g, "")),
        (e = e.replace(/'/g, "")),
        (e = e.toLowerCase()),
        Object(n["a"])(t, function (n, a) {
          if (n) r(n);
          else if (a) {
            o[e] = a;
            a.numGlyphs;
            var s,
              l,
              c = -99999999,
              d = 99999999,
              u = "x",
              h = null;
            for (s in a.glyphs.glyphs)
              if (
                a.glyphs.glyphs.hasOwnProperty(s) &&
                ((l = a.glyphs.glyphs[s]), l.name == u)
              ) {
                h = l;
                break;
              }
            if (!h)
              for (s in ((u = u.toUpperCase()), a.glyphs.glyphs))
                if (
                  a.glyphs.glyphs.hasOwnProperty(s) &&
                  ((l = a.glyphs.glyphs[s]), l.name == u)
                ) {
                  h = l;
                  break;
                }
            if (h) {
              var p = h.getMetrics();
              for (s in a.glyphs.glyphs)
                if (a.glyphs.glyphs.hasOwnProperty(s)) {
                  l = a.glyphs.glyphs[s];
                  var m = l.getMetrics();
                  "undefined" !== typeof m.yMin
                    ? ((l.descent = Math.abs(m.yMin)),
                      (l.ascent = Math.abs(p.yMax - m.yMax)))
                    : ((l.ascent = 0), (l.descent = 0));
                }
            } else
              for (s in (console.warn(
                "Couldn't find pattern Glyph for font: " + e
              ),
              a.glyphs.glyphs))
                a.glyphs.glyphs.hasOwnProperty(s) &&
                  ((l = a.glyphs.glyphs[s]), (l.descent = 0));
            for (s in a.glyphs.glyphs)
              if (a.glyphs.glyphs.hasOwnProperty(s)) {
                l = a.glyphs.glyphs[s];
                var g = l.getMetrics();
                "undefined" !== typeof g.yMin &&
                  ((c = Math.max(g.yMax, c)), (d = Math.min(g.yMin, d)));
              }
            (a.totalDescender = d),
              (a.totalAscender = c),
              (a.fontHeight = Math.abs(c - d)),
              i();
          } else r(new Error("Couldn't load font from " + t));
        });
    });
  },
  hasFont: function (e) {
    return (e = e.replace(/"/g, "")), (e = e.toLowerCase()), !!o[e];
  },
};


export default Font;