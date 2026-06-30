import { HttpClient, type HttpClientOptions } from "./http";
import { AuthResource } from "./resources/auth";
import { CarsResource } from "./resources/cars";
import { CatalogResource } from "./resources/catalog";
import { GaragesResource } from "./resources/garages";
import { SightingsResource } from "./resources/sightings";
import { SocialResource } from "./resources/social";
import { UploadsResource } from "./resources/uploads";
import { UsersResource } from "./resources/users";

export class BombermanClient {
  public readonly auth: AuthResource;
  public readonly users: UsersResource;
  public readonly garages: GaragesResource;
  public readonly cars: CarsResource;
  public readonly catalog: CatalogResource;
  public readonly uploads: UploadsResource;
  public readonly sightings: SightingsResource;
  public readonly social: SocialResource;

  constructor(options: HttpClientOptions) {
    const http = new HttpClient(options);
    this.auth = new AuthResource(http);
    this.users = new UsersResource(http);
    this.garages = new GaragesResource(http);
    this.cars = new CarsResource(http);
    this.catalog = new CatalogResource(http);
    this.uploads = new UploadsResource(http);
    this.sightings = new SightingsResource(http);
    this.social = new SocialResource(http);
  }
}

export function createBombermanClient(options: HttpClientOptions): BombermanClient {
  return new BombermanClient(options);
}
