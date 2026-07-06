export interface LocationPickerProps {
  open: boolean;
  initialLatitude: number | null;
  initialLongitude: number | null;
  initialLabel?: string | null;
  onCancel: () => void;
  onConfirm: (latitude: number, longitude: number, label?: string | null) => void;
}
