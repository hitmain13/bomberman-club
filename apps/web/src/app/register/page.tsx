import Link from "next/link";

import { AuthLayout, RegisterForm } from "@/features/auth";

export default function RegisterPage(): JSX.Element {
  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Junte-se ao Bomberman Club e conecte-se com outros entusiastas."
      footer={
        <span>
          Já tem uma conta?{" "}
          <Link href="/login" className="font-semibold text-fg-primary">
            Entrar
          </Link>
        </span>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
