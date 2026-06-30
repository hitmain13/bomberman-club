import type { Fuel, Prisma } from "@prisma/client";

interface CarBuilderState {
  garageId: string;
  nickname: string;
  brand: string;
  model: string;
  generation: string | null;
  year: number;
  fuel: Fuel;
  engine: string;
  weightKg: number;
  horsepowerHp: number;
  torqueNm: number;
  currentKm: number;
  plate: string | null;
  coverUploadId: string | null;
}

export class CarBuilder {
  private state: Partial<CarBuilderState> = {};

  forGarage(garageId: string): this {
    this.state.garageId = garageId;
    return this;
  }

  named(nickname: string): this {
    this.state.nickname = nickname;
    return this;
  }

  ofModel(brand: string, model: string, generation: string | null): this {
    this.state.brand = brand;
    this.state.model = model;
    this.state.generation = generation;
    return this;
  }

  ofYear(year: number): this {
    this.state.year = year;
    return this;
  }

  withFuel(fuel: Fuel): this {
    this.state.fuel = fuel;
    return this;
  }

  withEngine(engine: string): this {
    this.state.engine = engine;
    return this;
  }

  withWeight(weightKg: number): this {
    this.state.weightKg = weightKg;
    return this;
  }

  withPower(horsepowerHp: number, torqueNm: number): this {
    this.state.horsepowerHp = horsepowerHp;
    this.state.torqueNm = torqueNm;
    return this;
  }

  withKm(currentKm: number): this {
    this.state.currentKm = currentKm;
    return this;
  }

  withPlate(plate: string | null): this {
    this.state.plate = plate;
    return this;
  }

  withCover(uploadId: string | null): this {
    this.state.coverUploadId = uploadId;
    return this;
  }

  build(): Prisma.CarUncheckedCreateInput {
    const required: Array<keyof CarBuilderState> = [
      "garageId",
      "nickname",
      "brand",
      "model",
      "year",
      "fuel",
      "engine",
      "weightKg",
      "horsepowerHp",
      "torqueNm",
      "currentKm",
    ];
    for (const key of required) {
      if (this.state[key] === undefined) {
        throw new Error(`CarBuilder is missing required field: ${key}`);
      }
    }
    return {
      garageId: this.state.garageId as string,
      nickname: this.state.nickname as string,
      brand: this.state.brand as string,
      model: this.state.model as string,
      generation: this.state.generation ?? null,
      year: this.state.year as number,
      fuel: this.state.fuel as Fuel,
      engine: this.state.engine as string,
      weightKg: this.state.weightKg as number,
      horsepowerHp: this.state.horsepowerHp as number,
      torqueNm: this.state.torqueNm as number,
      currentKm: this.state.currentKm as number,
      plate: this.state.plate ?? null,
      coverUploadId: this.state.coverUploadId ?? null,
    };
  }
}
