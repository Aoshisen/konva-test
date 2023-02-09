import { fabric } from "fabric";

interface IText {
  text: string;
  fontFamily: string;
  textAlign: "center" | "left" | "right";
  fontSize: number;
  color: any;
}
export class TextBox extends fabric.Group {
  public textNode: fabric.Text;
  type = "TextBox";
  public text: string | undefined;
  public fontSize: number | undefined;
  public charSpacing: number | undefined;
  public textAlign: string | undefined;
  public fill: any;

  constructor(text: string, options?: fabric.IGroupOptions & Partial<IText>) {
    const textNode = new fabric.IText(text);
    super([textNode], options);

    this.textNode = textNode;
    this.text = this.textNode.text;
    this.fontSize = this.textNode.fontSize;
    this.charSpacing = this.textNode.charSpacing;
    this.textAlign = this.textNode.textAlign;
    this.fill = this.textNode.fill;

    this.setTextAlign("center");
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

      case "fontSize":
        this.setTextFontSize(value);
        break;
      default:
        super._set(key, value);
    }
    return this;
  }

  setTextFontSize(value: any) {
    this.setTextAlign(this.textNode.textAlign as string);
    this.textNode.set("fontSize", value);
  }

  //text content
  public setText(text: string) {
    this.textNode.set("text", text);
    const groupWidth = this.width;
    const textWidth = this.textNode.width;

    this.setTextAlign(this.textNode.textAlign as string);
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
    this.setTextAlign(this.textNode.textAlign as string);
    this.textNode.set("charSpacing", spacing);
  }

  // color
  public setFill(color: any) {
    this.textNode.set("fill", color);
  }

  // textAlign
  public setTextAlign(position: "left" | "center" | "right" | string) {
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
    this.textAlign = position;
    this.textNode.set("textAlign", position);
  }
}
