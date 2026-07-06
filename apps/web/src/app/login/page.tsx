import Link from "next/link";
import { Suspense } from "react";

import { AuthLayout, LoginForm, SocialButtons } from "@/features/auth";

export default function LoginPage(): JSX.Element {
  return (
    <AuthLayout
      title="Bomberman Club"
      subtitle="Comunidade para entusiastas de carros duvidosos."
      footer={
        <span>
          Não tem uma conta?{" "}
          <Link href="/register" className="font-semibold text-fg-primary">
            Cadastre-se
          </Link>
        </span>
      }
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
      <SocialButtons />
    </AuthLayout>
  );
}
