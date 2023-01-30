import { fabric } from "fabric";
import { TextBox } from "./TextBox";

const canvas = new fabric.Canvas("canvas", {
  width: 800,
  height: 800,
  backgroundColor: "#565656",
});

function addText() {
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

function changeText({ target }: any) {
  let activeObject = canvas.getActiveObject();
  if (activeObject instanceof TextBox) {
    activeObject.setText(target.value);
  }
  canvas.requestRenderAll();
}

//通过原生FontFace 对象加载字体
function changeTextFont({ target }: any) {
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

function changeTextAlign({ target }: any) {
  const position = target.value;
  const activeObject = canvas.getActiveObject();
  if (activeObject instanceof TextBox) {
    activeObject.setTextAlign(position);
  }

  canvas.requestRenderAll();
}

function changeColor({ target }: any) {
  const color = target.value;
  const activeObject = canvas.getActiveObject();
  if (activeObject instanceof TextBox) {
    activeObject.setFill(color);
  }

  canvas.requestRenderAll();
}

function remove() {
  let activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.remove(activeObject);
  }
}

let input = document.querySelector("#update") as HTMLInputElement;
let btn_add = document.querySelector("#text") as HTMLButtonElement;
let select = document.querySelector("#font_select") as HTMLSelectElement;
let align = document.querySelector("#align") as HTMLSelectElement;
let color = document.querySelector("#color") as HTMLSelectElement;
let btn_remove = document.querySelector("#remove") as HTMLSelectElement;

input?.addEventListener("input", changeText);
btn_add?.addEventListener("click", addText);
select?.addEventListener("change", changeTextFont);
align.addEventListener("change", changeTextAlign);
color.addEventListener("change", changeColor);
btn_remove.addEventListener("click", remove);

if (btn_add) {
  btn_add.click();
}
