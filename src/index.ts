import { fabric } from "fabric";

const canvas = new fabric.Canvas("canvas");

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

  public setTextOptions(options) {
    this.textNode.setOptions(options);
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
  canvas.getActiveObject()?.setText(target.value);
  canvas.requestRenderAll();
}

let input = document.querySelector("#update");
let btn_add = document.querySelector("#text");

input?.addEventListener("input", update);
btn_add?.addEventListener("click", addText);

if (btn_add) {
  btn_add.click();
}
