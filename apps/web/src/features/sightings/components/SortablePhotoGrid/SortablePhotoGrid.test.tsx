import { describe, expect, it } from "vitest";

import { reorderPhotos } from "./SortablePhotoGrid.logic";

describe("reorderPhotos", () => {
  it("moves item to new position", () => {
    expect(reorderPhotos(["a", "b", "c"], 0, 2)).toEqual(["b", "c", "a"]);
    expect(reorderPhotos(["a", "b", "c"], 2, 0)).toEqual(["c", "a", "b"]);
  });
});
