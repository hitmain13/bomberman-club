import Link from "next/link";

import { Button } from "@/components/atoms/Button";
import { StatePanel } from "@/components/organisms/StatePanel";

export default function NotFound(): JSX.Element {
  return (
    <StatePanel
      kind="empty"
      title="Página não encontrada"
      description="O endereço que você tentou abrir não existe."
      action={
        <Link href="/">
          <Button variant="secondary">Voltar ao início</Button>
        </Link>
      }
    />
  );
}
