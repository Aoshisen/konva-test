import request from "./main";

//获取配置
export async function getSources() {
  return request("/api/resources");
}
export enum resourceType {
  font = "1",
  image = "2",
  string = "3",

}
// 当为string类型的时候需要传递进去name属性
export async function createSources(data:FormData) {
  return request("/api/resources", {
    method: "POST",
    requestType: "form",
    data,
  });
}
