"use client";

import { useEffect } from "react";

import { Button } from "@/components/atoms/Button";
import { StatePanel } from "@/components/organisms/StatePanel";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps): JSX.Element {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
      window.console.error(error);
    }
  }, [error]);

  return (
    <StatePanel
      kind="error"
      description="Tente novamente em instantes."
      action={
        <Button variant="secondary" onClick={() => reset()}>
          Tentar de novo
        </Button>
      }
    />
  );
}
