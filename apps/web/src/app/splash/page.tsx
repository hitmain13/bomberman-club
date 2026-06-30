import Link from "next/link";

import { Button } from "@/components/atoms/Button";
import { Logo } from "@/components/atoms/Logo";

export default function SplashPage(): JSX.Element {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-between px-6 py-16">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <Logo size="xl" withText />
        <p className="max-w-xs text-fg-secondary">
          Entre para o clube dos apaixonados por turbo, velocidade e setup bem feito.
        </p>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Link href="/login" className="w-full">
          <Button fullWidth size="lg">
            Entrar
          </Button>
        </Link>
        <Link href="/register" className="w-full">
          <Button variant="secondary" fullWidth size="lg">
            Criar conta
          </Button>
        </Link>
      </div>
    </div>
  );
}
