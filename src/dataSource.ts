import { RESTDataSource } from "apollo-datasource-rest";

export interface Card {
  id: string;
  name: string;
}

export class StorageAPI extends RESTDataSource {
  getCards(): Promise<Card[]> {
    return Promise.resolve([{ name: "someName", id: "someId" }]);
  }
}
