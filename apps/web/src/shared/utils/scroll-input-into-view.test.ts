import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { bindMobileInputFocusEnhancements, scrollInputIntoView } from "./scroll-input-into-view";

describe("scrollInputIntoView", () => {
  beforeEach(() => {
    vi.spyOn(window, "scrollBy").mockImplementation(() => undefined);
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("scrolls when input is below the visible viewport", () => {
    Object.defineProperty(window, "visualViewport", {
      configurable: true,
      value: {
        offsetTop: 0,
        height: 400,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    });

    const element = {
      getBoundingClientRect: () => ({
        top: 360,
        bottom: 420,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    } as HTMLElement;

    scrollInputIntoView(element);

    expect(window.scrollBy).toHaveBeenCalledWith(
      expect.objectContaining({ top: expect.any(Number), behavior: "smooth" }),
    );
  });
});

describe("bindMobileInputFocusEnhancements", () => {
  it("registers focus listeners and cleans up", () => {
    const addSpy = vi.spyOn(document, "addEventListener");
    const removeSpy = vi.spyOn(document, "removeEventListener");

    const cleanup = bindMobileInputFocusEnhancements();
    expect(addSpy).toHaveBeenCalledWith("focusin", expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith("focusout", expect.any(Function));

    cleanup();
    expect(removeSpy).toHaveBeenCalledWith("focusin", expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith("focusout", expect.any(Function));
  });
});
