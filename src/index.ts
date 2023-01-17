import { fabric } from "fabric";

import FontFaceObserver from "fontfaceobserver";
const canvas = new fabric.Canvas("canvas");
window.canvas = canvas;

canvas.setDimensions({
  width: 800,
  height: 800,
});

canvas.setBackgroundColor("#565656", () => {
  canvas.renderAll();
});

export class TextBox extends fabric.Group {
  public _text: string;
  public textNode: fabric.Text;
  type = "TextBox";
  constructor(text: string, options?: fabric.IGroupOptions) {
    const textNode = new fabric.Text(text, {
      fill: "yellow",
      hasControls: false,
      hasBorders: false,
      lockMovementX: true,
      lockMovementY: true,
      selectable: false,
    });
    super([textNode], options);
    this._text = text;
    this.textNode = textNode;
    this.textNode.setPositionByOrigin(
      new fabric.Point(-(this.width || 0) / 2, 0),
      "left",
      "center"
    );
  }

  get text() {
    return this._text;
  }

  set text(text: string) {
    this._text = text;
    this.textNode.set("text", text);
  }

  override _set(key: string, value: any) {
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

  public setText(text: string) {
    this.textNode.set("text", text);
    const groupWidth = this.width;
    const textWidth = this.textNode.width;
    if (groupWidth && textWidth) {
      if (groupWidth < textWidth) {
        this.textNode.setPositionByOrigin(
          new fabric.Point(-groupWidth / 2, 0),
          "left",
          "center"
        );
        this.textNode.scaleToWidth(groupWidth);
      }
    }
  }

  public setFontFamily(family: string) {
    this.textNode.set("fontFamily", family);
  }

  public setCharSpacing(spacing: number) {
    this.textNode.set("charSpacing", spacing);
  }

  public setFill(color: any) {
    this.textNode.set("fill", color);
  }
  public setTextAlign(position: "left" | "center" | "right") {
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

  console.log("updateText", target);

  canvas.requestRenderAll();
}

export function changeTextFont({ target }: any) {
  const fontFamily=target.value
  const activeObject = canvas.getActiveObject();

  const styleEl = document.getElementById("custom-options-fonts");
  if (styleEl) {
    styleEl.innerHTML += `@import url("https://fonts.googleapis.com/css?family=Pacifico");`;
  } else {
    const styleEl = document.createElement("style");
    styleEl.id = "custom-options-fonts";
    styleEl.innerHTML = `@import url("https://fonts.googleapis.com/css?family=Pacifico");`;
    document.head.appendChild(styleEl);
  }

  let fontObserver = new FontFaceObserver(fontFamily);

  fontObserver.load().then((res) => {
    console.log("res", res);

    if (activeObject instanceof TextBox) {
      activeObject.setFontFamily(fontFamily);
      canvas.requestRenderAll();
    }
  });
}

let input = document.querySelector("#update") as HTMLInputElement;
let btn_add = document.querySelector("#text") as HTMLButtonElement;
let select = document.querySelector("#font_select") as HTMLSelectElement;

input?.addEventListener("input", update);
btn_add?.addEventListener("click", addText);
select?.addEventListener("change", changeTextFont);

if (btn_add) {
  btn_add.click();
}
