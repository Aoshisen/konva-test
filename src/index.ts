import { fabric } from "fabric";
import processFontUrl from "./processFontUrl";

import FontFaceObserver from "fontfaceobserver";
const canvas = new fabric.Canvas("canvas");

import opentype from "opentype.js";
import Font from "./font";
window.canvas = canvas;

canvas.setDimensions({
  width: 800,
  height: 800,
});

canvas.setBackgroundColor("#565656", () => {
  canvas.renderAll();
});

export class TextBox extends fabric.Group {
  public textNode: fabric.Text;
  type = "TextBox";
  constructor(text: string, options?: fabric.IGroupOptions) {
    let textNode = new fabric.IText(text);
    super([textNode], options);
    this.textNode = textNode;

    //setWidth same with group with
    // this.textNode.set("width", this.width);
    //setPosition of textNode
    //left
    /* 
    const point = new fabric.Point(-(this.width || 0) / 2, 0);
    this.textNode.setPositionByOrigin(point, "left", "center");
 */
    //center
    /*     const point = new fabric.Point(0, 0);
    this.textNode.setPositionByOrigin(point, "center", "center"); */

    //right
    /* 
    const point = new fabric.Point( (this.width || 0) / 2,0);
    this.textNode.setPositionByOrigin(point, "right", "center");
 */
  }

  override _set(key: string, value: any) {
    console.log("override _set");
    switch (key) {
      case "text":
        this.setText(value);
        break;
      case "fontFamily":
        this.setFontFamily(value);
        break;
      case "charSpacing":
        this.setCharSpacing(value);
        break;
      case "fill":
        this.setFill(value);
        break;
      case "textAlign":
        this.setTextAlign(value);
        break;
      default:
        super._set(key, value);
    }
    return this;
  }

  //text content
  public setText(text: string) {
    this.textNode.set("text", text);
    const groupWidth = this.width;
    const textWidth = this.textNode.width;

    this.setTextAlign(this.textNode.textAlign as string)
    if (groupWidth && textWidth) {
      if (groupWidth < textWidth) {
        //
        console.log("group 小于 textWidth");
        this.textNode.scaleToWidth(groupWidth);
      }
    }
  }

  //fontFamily
  public setFontFamily(family: string) {
    this.textNode.set("fontFamily", family);
  }

  //letterSpacing
  public setCharSpacing(spacing: number) {
    this.textNode.set("charSpacing", spacing);
  }

  // color
  public setFill(color: any) {
    this.textNode.set("fill", color);
  }

  // textAlign
  public setTextAlign(position: "left" | "center" | "right"|string) {
    let point;
    switch (position) {
      case "left":
        point = new fabric.Point(-(this.width || 0) / 2, 0);
        this.textNode.setPositionByOrigin(point, "left", "center");
        break;

      case "center":
        point = new fabric.Point(0, 0);
        this.textNode.setPositionByOrigin(point, "center", "center");
        break;

      case "right":
        point = new fabric.Point((this.width || 0) / 2, 0);
        this.textNode.setPositionByOrigin(point, "right", "center");
        break;
      default:
        break;
    }
    this.textNode.set("textAlign", position);
  }
}

export function addText() {
  console.log("addText");
  const text = new TextBox("ass", {
    width: 200,
    height: 200,
    left: 200,
    top: 200,
  });
  canvas.setActiveObject(text);
  canvas.add(text);
  canvas.requestRenderAll();
}

export function update({ target }) {
  let activeObject = canvas.getActiveObject();
  if (activeObject instanceof TextBox) {
    activeObject.setText(target.value);
  }
  canvas.requestRenderAll();
}

//通过fontfaceobserver 加载字体
// export function changeTextFont({ target }: any) {
//   const fontFamily = target.value;
//   const activeObject = canvas.getActiveObject();

//   const styleEl = document.getElementById("custom-options-fonts");

//   if (styleEl) {
//     //已经有style 标签了
//     styleEl.innerHTML += processFontUrl(fontFamily);
//   } else {
//     //没有style 标签 新添加元素
//     const styleEl = document.createElement("style");
//     styleEl.id = "custom-options-fonts";
//     styleEl.innerHTML = processFontUrl(fontFamily);
//     document.head.appendChild(styleEl);
//   }

//   let fontObserver = new FontFaceObserver(fontFamily);

//   fontObserver.load().then((res) => {
//     if (activeObject instanceof TextBox) {
//       activeObject.setFontFamily(fontFamily);
//       canvas.requestRenderAll();
//     }
//   });
// }

//通过opentype.js 加载字体文件
// export function changeTextFont({ target }: any) {
//   const fontFamily = target.value;
//   const activeObject = canvas.getActiveObject();
//   opentype.load("../static/Pacifico.ttf", (error, font) => {
//     console.log("fontLoaded", font);
//     const objectText = activeObject.textNode;
//     const path = font?.getPath(
//       objectText.text || "",
//       0,
//       0,
//       objectText.fontSize || 0
//     );
//     const fabricPath = new fabric.Path(path?.toPathData(3), {});
//     console.log(fabricPath, fabricPath);
//     canvas.remove(activeObject);
//     canvas.insertAt(fabricPath, 0, false);
//     canvas.renderAll();
//   });
// }

//通过原生FontFace 对象加载字体
export function changeTextFont({ target }: any) {
  const fontFamily = target.value;
  const activeObject = canvas.getActiveObject();

  function changeActiveObjectFontFamily(fontFamily: string) {
    if (activeObject instanceof TextBox) {
      activeObject.textNode.set(
        "fontFamily",
        fontFamily === "Default" ? "Times New Roman" : fontFamily
      );
      document.fonts.ready.then(() => {
        canvas.requestRenderAll();
      });
    }
  }

  function alreadyHaveFontFamily(fontFamilyName: string) {
    let fonts = Array.from(document.fonts as any);

    for (const font of fonts) {
      if (font.family === fontFamilyName) {
        return true;
      }
    }
    return false;
  }

  if (alreadyHaveFontFamily(fontFamily)) {
    console.log("alreadyHave font", fontFamily);
    changeActiveObjectFontFamily(fontFamily);
  } else {
    const font = new FontFace(fontFamily, "url(../static/Pacifico.ttf)");
    console.log("newFont loading...", font);
    font.load();
    document.fonts.add(font);
    document.fonts.ready.then(() => {
      changeActiveObjectFontFamily(fontFamily);
    });
  }
}

export function changeTextAlign(position: "left" | "center" | "right") {
  const activeObject = canvas.getActiveObject();
  if (activeObject instanceof TextBox) {
    activeObject.setTextAlign(position)
  }

  canvas.requestRenderAll();
}

let input = document.querySelector("#update") as HTMLInputElement;
let btn_add = document.querySelector("#text") as HTMLButtonElement;
let select = document.querySelector("#font_select") as HTMLSelectElement;
let align = document.querySelector("#align") as HTMLButtonElement;

input?.addEventListener("input", update);
btn_add?.addEventListener("click", addText);
select?.addEventListener("change", changeTextFont);
align.addEventListener("click", () => changeTextAlign("right"));

if (btn_add) {
  btn_add.click();
}
