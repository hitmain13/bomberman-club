import { redirect } from "next/navigation";

export default function HomePage(): never {
  redirect("/splash");
}

export const dynamic = "force-static";
