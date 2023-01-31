import { fabric } from "fabric";
import { TextBox } from "./TextBox";

import { getSources, createSources, ResourceType } from "./apis";

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
      if ((font as any).family === fontFamilyName) {
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

async function getData() {
  let res = await getSources();
  console.log("getData", res);
}

async function createData(data) {
  let res = await createSources(data);
  console.log("getData", res);
}

let input = document.querySelector("#update") as HTMLInputElement;
let btn_add = document.querySelector("#text") as HTMLButtonElement;
let select = document.querySelector("#font_select") as HTMLSelectElement;
let align = document.querySelector("#align") as HTMLSelectElement;
let color = document.querySelector("#color") as HTMLSelectElement;
let btn_remove = document.querySelector("#remove") as HTMLSelectElement;
let btn_getData = document.querySelector("#getData") as HTMLSelectElement;
let btn_createData = document.querySelector("#createData") as HTMLSelectElement;
let input_file = document.querySelector("#input_file") as HTMLInputElement;

input?.addEventListener("input", changeText);
btn_add?.addEventListener("click", addText);
select?.addEventListener("change", changeTextFont);
align.addEventListener("change", changeTextAlign);
color.addEventListener("change", changeColor);
btn_remove.addEventListener("click", remove);

btn_getData.addEventListener("click", getData);

btn_createData.addEventListener("click", () => {
  if (input_file.files?.length) {
    let file = input_file.files[0];
    let formData = new FormData();

    //formData 类型的数据不能解构，解构了传递给接口请求的时候哦就不行了，所以我们需要从头构造 一个formData 类型的数据
    //至于其他的接口需要的参数，就通过formData.append 到formData 对象上就行了
    //类似下面的这种写法，我的接口要求我传递一个 resource 字段，里面带的是上传的文件，然后需要一个type类型，里面标识的是我们的资源的类型，然后如果是一个字符串类型的资源的话还需要传一个name字段，其他不需要传这个name

    formData.append("resource", file);
    formData.append("type", ResourceType.FONT);
    formData.append("name", file.name);

    createData(formData);
  }
});

if (btn_add) {
  btn_add.click();
}
