export default function processFontUrl(fontName: string, url?: string) {
  return `
/* cyrillic-ext */
@font-face {
  font-family: ${fontName};
  font-style: normal;
  font-weight: 400;
  src: url("../static/Pacifico.ttf");
}
 `;
}
