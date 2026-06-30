import { HttpClient, type HttpClientOptions } from "./http";
import { AuthResource } from "./resources/auth";
import { CarsResource } from "./resources/cars";
import { CatalogResource } from "./resources/catalog";
import { GaragesResource } from "./resources/garages";
import { UsersResource } from "./resources/users";

export class BombermanClient {
  public readonly auth: AuthResource;
  public readonly users: UsersResource;
  public readonly garages: GaragesResource;
  public readonly cars: CarsResource;
  public readonly catalog: CatalogResource;

  constructor(options: HttpClientOptions) {
    const http = new HttpClient(options);
    this.auth = new AuthResource(http);
    this.users = new UsersResource(http);
    this.garages = new GaragesResource(http);
    this.cars = new CarsResource(http);
    this.catalog = new CatalogResource(http);
  }
}

export function createBombermanClient(options: HttpClientOptions): BombermanClient {
  return new BombermanClient(options);
}
