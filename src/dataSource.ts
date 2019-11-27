import { RESTDataSource } from "apollo-datasource-rest";

export interface Card {
  id: string;
  title: string;
  description: string
}

export class StorageAPI extends RESTDataSource {
  getCards(): Promise<Card[]> {
    return Promise.resolve([{ id: "someId", title: "cardTitle", description: "titleDescription" }]);
  }
}
