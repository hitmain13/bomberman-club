import "react";

declare global {
  namespace JSX {
    type Element = import("react").ReactElement;
    type ElementType = import("react").ElementType;
    type IntrinsicElements = import("react").JSX.IntrinsicElements;
  }
}
