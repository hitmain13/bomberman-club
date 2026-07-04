const KEYBOARD_SAFE_PADDING = 16;

function isTextInput(
  element: EventTarget | null,
): element is HTMLInputElement | HTMLTextAreaElement {
  if (element instanceof HTMLTextAreaElement) {
    return true;
  }
  if (!(element instanceof HTMLInputElement)) {
    return false;
  }
  return !["button", "checkbox", "file", "hidden", "radio", "submit"].includes(element.type);
}

function scrollOnce(element: HTMLElement): void {
  const viewport = window.visualViewport;
  if (!viewport) {
    element.scrollIntoView({ block: "center", inline: "nearest" });
    return;
  }

  const rect = element.getBoundingClientRect();
  const visibleTop = viewport.offsetTop + KEYBOARD_SAFE_PADDING;
  const visibleBottom = viewport.offsetTop + viewport.height - KEYBOARD_SAFE_PADDING;

  if (rect.bottom > visibleBottom) {
    window.scrollBy({ top: rect.bottom - visibleBottom, behavior: "smooth" });
    return;
  }

  if (rect.top < visibleTop) {
    window.scrollBy({ top: rect.top - visibleTop, behavior: "smooth" });
  }
}

export function scrollInputIntoView(element: HTMLElement): void {
  scrollOnce(element);
  window.requestAnimationFrame(() => scrollOnce(element));
  window.setTimeout(() => scrollOnce(element), 120);
  window.setTimeout(() => scrollOnce(element), 320);
}

export function bindMobileInputFocusEnhancements(): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  let activeElement: HTMLElement | null = null;

  const handleFocusIn = (event: FocusEvent): void => {
    const target = event.target;
    if (!isTextInput(target)) {
      return;
    }
    activeElement = target;
    scrollInputIntoView(target);
  };

  const handleFocusOut = (): void => {
    activeElement = null;
  };

  const handleViewportChange = (): void => {
    if (activeElement) {
      scrollInputIntoView(activeElement);
    }
  };

  document.addEventListener("focusin", handleFocusIn);
  document.addEventListener("focusout", handleFocusOut);
  window.visualViewport?.addEventListener("resize", handleViewportChange);
  window.visualViewport?.addEventListener("scroll", handleViewportChange);

  return () => {
    document.removeEventListener("focusin", handleFocusIn);
    document.removeEventListener("focusout", handleFocusOut);
    window.visualViewport?.removeEventListener("resize", handleViewportChange);
    window.visualViewport?.removeEventListener("scroll", handleViewportChange);
  };
}
