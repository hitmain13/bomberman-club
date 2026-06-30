export interface LocationPickerProps {
  open: boolean;
  initialLatitude: number | null;
  initialLongitude: number | null;
  onCancel: () => void;
  onConfirm: (latitude: number, longitude: number) => void;
}
