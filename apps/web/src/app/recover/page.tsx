import Link from "next/link";

import { AuthLayout, RecoverForm } from "@/features/auth";

export default function RecoverPage(): JSX.Element {
  return (
    <AuthLayout
      title="Recuperar senha"
      subtitle="Digite seu e-mail e enviaremos um link para redefinir sua senha."
      footer={
        <span>
          Lembrou da senha?{" "}
          <Link href="/login" className="font-semibold text-fg-primary">
            Entrar
          </Link>
        </span>
      }
    >
      <RecoverForm />
    </AuthLayout>
  );
}
