import { fabric } from "fabric";
import { ITextboxOptions } from "fabric/fabric-impl";

const canvas = new fabric.Canvas("canvas");

window.text = null;

canvas.setDimensions({
  width: 800,
  height: 800,
});

canvas.setBackgroundColor("#565656", () => {
  canvas.renderAll();
});

export function addText() {
  const text = new fabric.Text("ownTextdfffffffffffffff", {
    fill: "yellow",
    hasControls: false,
    hasBorders: false,
    lockMovementX: true,
    lockMovementY: true,
  });
  canvas.add(text);
  const group = new fabric.Group([text], {
    width: 200,
    height: 200,
    left: 200,
    top: 200,
  });
  canvas.add(group);
  canvas.setActiveObject(group);
  window.text = group;
  canvas.renderAll();
}

export function move() {
  console.log("move");
  (canvas.getActiveObject() as TextBox).setPosition(100, 200);
}

export function change() {
  console.log("change");
  (canvas.getActiveObject() as TextBox).setFontFamily("ass");
}

let btn_add = document.querySelector("#text");
let btn_move = document.querySelector("#move");
let btn_change = document.querySelector("#change");

btn_add?.addEventListener("click", addText);
btn_move?.addEventListener("click", move);
btn_change?.addEventListener("click", change);
