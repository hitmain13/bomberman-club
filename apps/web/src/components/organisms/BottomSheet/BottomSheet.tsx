import { sheetClassName, styles } from "./BottomSheet.styles";
import type { BottomSheetProps } from "./BottomSheet.types";

export function BottomSheet({
  open,
  title,
  onClose,
  children,
  footer,
  closeLabel = "Cancelar",
  constrained = false,
}: BottomSheetProps): JSX.Element | null {
  if (!open) {
    return null;
  }

  return (
    <>
      <div
        className={styles.overlay}
        onClick={onClose}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            onClose();
          }
        }}
        role="presentation"
      />
      <dialog open className={sheetClassName(constrained)} aria-modal="true" aria-label={title}>
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button type="button" className={styles.close} onClick={onClose}>
            {closeLabel}
          </button>
        </header>
        <div className={styles.body}>{children}</div>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </dialog>
    </>
  );
}
