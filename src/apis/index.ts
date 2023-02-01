import request from "./main";

export enum ResourceType {
  FONT = "1",
  IMAGE = "2",
  STRING = "3",
}

type TMetaData = "current_page" | "per_page" | "total";

export interface IResource {
  id: number;
  shop_id?: number;
  type: ResourceType;
  name: string;
  value: string;
}

interface IReturnGetData {
  code: number;
  data: {
    meta: Record<TMetaData, number>;
    resources: IResource[];
  };
  message: string;
}

interface IReturnPostData {
  code: number;
  data: IResource;
  message: string;
}

export function getSources(): Promise<IReturnGetData> {
  return request("/api/resources");
}

export function createSources(data: FormData): Promise<IReturnPostData> {
  return request("/api/resources", {
    method: "POST",
    requestType: "form",
    data,
  });
}