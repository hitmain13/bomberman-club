"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import {
  useAdminUploads,
  useAdminUsers,
  useBanUser,
  useDeleteUpload,
  useUnbanUser,
} from "@/features/admin/hooks/use-admin";
import { useAuth } from "@/shared/contexts/auth-context";
import { RequireAuth } from "@/shared/contexts/require-auth";

type Tab = "uploads" | "users";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadsTab(): JSX.Element {
  const { data, isLoading, error } = useAdminUploads();
  const deleteUpload = useDeleteUpload();

  if (isLoading) return <StatePanel kind="loading" />;
  if (error) return <StatePanel kind="error" description="Erro ao carregar uploads." />;
  if (!data?.data.length)
    return <StatePanel kind="empty" description="Nenhum upload encontrado." />;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-fg-muted">Total: {data.data.length} uploads</p>
      <div className="grid gap-4">
        {data.data.map((upload) => (
          <div
            key={upload.id}
            className="flex items-center gap-4 rounded-lg border border-border-subtle bg-bg-surface p-3"
          >
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-bg-elevated">
              {upload.mime.startsWith("image/") ? (
                <Image src={upload.url} alt="Preview" fill className="object-cover" sizes="64px" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Icon name="camera" size="sm" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-fg-primary truncate">
                {upload.owner.username}
              </p>
              <p className="text-xs text-fg-muted">{upload.owner.email}</p>
              <p className="text-xs text-fg-muted">
                {formatBytes(upload.size)} · {upload.mime} ·{" "}
                {new Date(upload.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              isLoading={deleteUpload.isPending}
              onClick={() => {
                if (window.confirm("Tem certeza que deseja remover este upload?")) {
                  deleteUpload.mutate(upload.id);
                }
              }}
            >
              Remover
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersTab(): JSX.Element {
  const { data, isLoading, error } = useAdminUsers();
  const banUser = useBanUser();
  const unbanUser = useUnbanUser();

  if (isLoading) return <StatePanel kind="loading" />;
  if (error) return <StatePanel kind="error" description="Erro ao carregar usuários." />;
  if (!data?.data.length)
    return <StatePanel kind="empty" description="Nenhum usuário encontrado." />;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-fg-muted">Total: {data.data.length} usuários</p>
      <div className="grid gap-4">
        {data.data.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between gap-4 rounded-lg border border-border-subtle bg-bg-surface p-3"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-fg-primary">@{user.username}</p>
                {user.role === "ADMIN" && (
                  <span className="rounded bg-accent-success/20 px-1.5 py-0.5 text-xs text-accent-success">
                    Admin
                  </span>
                )}
                {user.bannedAt && (
                  <span className="rounded bg-accent-danger/20 px-1.5 py-0.5 text-xs text-accent-danger">
                    Banido
                  </span>
                )}
              </div>
              <p className="text-xs text-fg-muted">{user.email}</p>
              <p className="text-xs text-fg-muted">
                Criado em {new Date(user.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {user.role !== "ADMIN" &&
                (user.bannedAt ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    isLoading={unbanUser.isPending}
                    onClick={() => unbanUser.mutate(user.id)}
                  >
                    Desbanir
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    size="sm"
                    isLoading={banUser.isPending}
                    onClick={() => {
                      if (window.confirm(`Banir @${user.username}?`)) {
                        banUser.mutate(user.id);
                      }
                    }}
                  >
                    Banir
                  </Button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminContent(): JSX.Element {
  const [tab, setTab] = useState<Tab>("uploads");
  const { user } = useAuth();
  const router = useRouter();

  if (user?.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <StatePanel
          kind="error"
          title="Acesso negado"
          description="Você não tem permissão para acessar esta página."
        />
        <Button onClick={() => router.push("/")}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-xl font-bold">Painel Administrativo</h1>
        <p className="text-sm text-fg-muted">Gerencie uploads e usuários</p>
      </header>

      <div className="flex gap-2 border-b border-border-subtle">
        <button
          type="button"
          onClick={() => setTab("uploads")}
          className={`px-4 py-2 text-sm font-medium ${
            tab === "uploads"
              ? "border-b-2 border-accent-primary text-fg-primary"
              : "text-fg-muted hover:text-fg-secondary"
          }`}
        >
          Uploads
        </button>
        <button
          type="button"
          onClick={() => setTab("users")}
          className={`px-4 py-2 text-sm font-medium ${
            tab === "users"
              ? "border-b-2 border-accent-primary text-fg-primary"
              : "text-fg-muted hover:text-fg-secondary"
          }`}
        >
          Usuários
        </button>
      </div>

      {tab === "uploads" ? <UploadsTab /> : <UsersTab />}
    </div>
  );
}

export default function AdminPage(): JSX.Element {
  return (
    <AppShell hideBottomNav>
      <RequireAuth>
        <AdminContent />
      </RequireAuth>
    </AppShell>
  );
}
