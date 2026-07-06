"use client";

import { StatePanel } from "@/components/organisms/StatePanel";
import { useMyCars } from "@/features/garage";
import { useAuth } from "@/shared/contexts/auth-context";

interface CarOwnerGuardProps {
  carId: string;
  children: React.ReactNode;
}

export function CarOwnerGuard({ carId, children }: CarOwnerGuardProps): JSX.Element {
  const { user } = useAuth();
  const myCars = useMyCars();

  if (myCars.isLoading) {
    return <StatePanel kind="loading" />;
  }
  if (!user || !myCars.data?.some((car) => car.id === carId)) {
    return (
      <StatePanel kind="error" description="Você não tem permissão para modificar este carro." />
    );
  }

  return <>{children}</>;
}
