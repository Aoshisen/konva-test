import request from "umi-request";

// response拦截器, 处理response
request.interceptors.response.use(async (response, operation) => {
  const res: Response = response.clone();
  const data: { code: number; message: string; data: any } =
    await (operation.responseType === "blob" ? res.blob() : res.json());
  if (
    data.code === 401 ||
    data.code === 403 ||
    data.code === 403 ||
    data.code === 405 ||
    data.code === 422
  ) {
    console.error(data.message);
  }
  return response;
});

// request拦截器, 改变url 或 options.
request.interceptors.request.use((url, options) => {
  const dataUrl = new URLSearchParams(location.search);
  const timestamp = dataUrl.get("timestamp");
  const shop = dataUrl.get("shop");
  const hmac = dataUrl.get("hmac");
  const dataArray = `${url}?shop=${shop}&hmac=${hmac}&timestamp=${timestamp}`;
  return {
    url: dataArray,
    options: { ...options, interceptors: true },
  };
});

export default request;
