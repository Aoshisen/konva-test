import Konva from "konva";
import "./index.css";

function addContainer() {
  document.body.innerHTML = `<div id="app"></div>`;
}

addContainer();

class SketchText {
  public stage: any;
  public layer: any;
  public textNode: any;
  public transformer: any;
  public containerNode;
  constructor(containerNode: any) {
    this.containerNode = containerNode;

    this.init();
  }
  initStage() {
    this.stage = new Konva.Stage({
      container: this.containerNode,
      height: 500,
      width:600
    });
  }

  initTextNode() {
    this.textNode = new Konva.Text({
      text: "this is some text in here",
      fontSize: 20,
      x: 0,
      y: 0,
      draggable: true,
    });
  }

  initTransformer() {
    this.transformer = new Konva.Transformer({
      node: this.textNode as any,
      enabledAnchors: [
        "middle-left",
        "middle-right",
        "top-center",
        "bottom-center",
      ],
      boundBoxFunc: function (oldBox, newBox) {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      },
    });
  }

  initLayer() {
    this.layer = new Konva.Layer();
  }

  init() {
    this.initStage();
    this.initLayer();
    this.initTextNode();
    this.initTransformer();
    this.changeCursor();
    this.layer.add(this.textNode);
    this.layer.add(this.transformer);
    this.stage.add(this.layer);
    this.stage.draw();
  }

  changeCursor() {
    this.textNode.on("mouseenter", () => {
      this.stage.container().style.cursor = "move";
    });
    this.textNode.on("mouseleave", () => {
      this.stage.container().style.cursor = "default";
    });
  }
}

const sketchInstance = new SketchText("app");

export { sketchInstance };
