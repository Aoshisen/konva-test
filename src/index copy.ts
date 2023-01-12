import { fabric } from "fabric";

import FontFaceObserver from "fontfaceobserver";

function addContainer() {
  const app = document.createElement("div");
  app.id = "app";
  app.innerHTML = `<canvas id="c"></canvas>`;
  document.body.appendChild(app);
}

addContainer();

const canvas = new fabric.Canvas("c");
//设置宽度
canvas.setDimensions({
  width: window.innerWidth * 0.7,
  height: window.innerHeight * 0.7,
});

//设置背景颜色
canvas.setBackgroundColor("#565656", canvas.renderAll.bind(canvas));

export function addText() {
  const font = new FontFaceObserver("Pacifico");
  const text = new fabric.Text("sample text", {
    left: canvas.width ? canvas.width / 2 : 0,
    top: canvas.height ? canvas.height / 2 : 0,
    fill: "#e0f7fa",
    hasrotatingpoint: false,
    originx: "center",
    originy: "center",
    lockuniscaling: true,
    charSpacing: 2000,
  });
  canvas.add(text);
  // .load()
  // .then((font) => {
  //   console.log("字体加载", font);

  //   text.set("fontFamily", "Pacifico");

  // })
  // .catch((e) => {
  //   console.log("字体加载失败");
  // });
}
export function addRectangle() {
  const rectangle = new fabric.Rect({
    left: canvas.width / 2,
    top: canvas.height / 2,
    fill: "#ffa726",
    width: 100,
    height: 100,
    originX: "center",
    originY: "center",
    strokeWidth: 0,
  });
  canvas.add(rectangle);
}
export function addCircle() {
  const circle = new fabric.Circle({
    left: canvas.width / 2,
    top: canvas.height / 2,
    fill: "#26a69a",
    radius: 50,
    originX: "center",
    originY: "center",
    strokeWidth: 0,
  });
  canvas.add(circle);
}
export function addTriangle() {
  const triangle = new fabric.Triangle({
    left: canvas.width / 2,
    top: canvas.height / 2,
    fill: "#78909c",
    width: 100,
    height: 100,
    originX: "center",
    originY: "center",
    strokeWidth: 0,
  });
  canvas.add(triangle);
}
export function addImage() {
  const image=new fabric.Image("")
}

export function Remove() {
  let activeObjects = canvas.getActiveObjects();
  canvas.discardActiveObject();
  if (activeObjects.length) {
    canvas.remove.apply(canvas, activeObjects);
  }
}

export function addTextBox() {
  const font = new FontFaceObserver("Pacifico");

  font
    .load()
    .then((font) => {
      const textBox = new fabric.Textbox("sample text", {
        left: 50,
        top: 50,
        width: 150,
        fontSize: 20,
        charSpacing: 20,
      });
      textBox.set("fontFamily", "Pacifico");
      textBox.set("charSpacing", 100);
      console.log();

      textBox.toJSON();
      canvas.add(textBox);
    })
    .catch((e) => {
      console.log("字体加载失败");
    });
}

const btn_add_text = document.querySelector("#text") as HTMLButtonElement;

btn_add_text.addEventListener("click", () => {
  console.log("addBtn");
  addText();
});

const btn_add_circle = document.querySelector("#circle") as HTMLButtonElement;
const btn_add_rectangle = document.querySelector(
  "#rectangle"
) as HTMLButtonElement;
const btn_add_triangle = document.querySelector(
  "#triangle"
) as HTMLButtonElement;
const btn_add_image = document.querySelector("#image") as HTMLButtonElement;
const btn_remove = document.querySelector("#remove") as HTMLButtonElement;

const btn_add_textBox = document.querySelector("#textBox") as HTMLButtonElement;
btn_add_image.addEventListener("click", addImage);
btn_add_triangle.addEventListener("click", addTriangle);
btn_add_circle.addEventListener("click", addCircle);
btn_add_rectangle.addEventListener("click", addRectangle);
btn_remove.addEventListener("click", Remove);
btn_add_textBox.addEventListener("click", addTextBox);
