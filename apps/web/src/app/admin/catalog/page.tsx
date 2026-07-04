"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { FormField } from "@/components/molecules/FormField";
import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import {
  useAdminCatalogCategories,
  useAdminCatalogMutations,
  useAdminCatalogParts,
  useAdminCatalogSpecs,
} from "@/features/admin/hooks/use-admin-catalog";
import { ProfileStatsSkeleton } from "@/features/profile";
import { useAuth } from "@/shared/contexts/auth-context";
import { RequireAuth } from "@/shared/contexts/require-auth";

function CategoriesSection(): JSX.Element {
  const categories = useAdminCatalogCategories();
  const mutations = useAdminCatalogMutations();
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const parts = useAdminCatalogParts(selectedCategoryId);
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [partName, setPartName] = useState("");

  if (categories.isPending && !categories.data) {
    return <ProfileStatsSkeleton count={3} />;
  }
  if (categories.isError) {
    return <StatePanel kind="error" description="Erro ao carregar categorias." />;
  }

  const categoryList = categories.data ?? [];

  return (
    <div className="flex flex-col gap-4">
      {categoryList.length === 0 ? (
        <StatePanel kind="empty" description="Nenhuma categoria cadastrada." />
      ) : (
        <ul className="flex flex-col gap-2">
          {categoryList.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-bg-surface p-3"
            >
              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                onClick={() => setSelectedCategoryId(category.id)}
              >
                <p className="font-medium text-fg-primary">{category.name}</p>
                <p className="text-xs text-fg-muted">{category.slug}</p>
              </button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  if (window.confirm(`Excluir categoria "${category.name}"?`)) {
                    mutations.deleteCategory.mutate(category.id);
                  }
                }}
              >
                Excluir
              </Button>
            </li>
          ))}
        </ul>
      )}

      <form
        className="flex flex-col gap-2 rounded-lg border border-border-subtle p-3"
        onSubmit={(event) => {
          event.preventDefault();
          mutations.createCategory.mutate(
            { slug, name },
            {
              onSuccess: () => {
                setSlug("");
                setName("");
              },
            },
          );
        }}
      >
        <p className="text-sm font-medium">Nova categoria</p>
        <FormField label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <FormField label="Nome" value={name} onChange={(e) => setName(e.target.value)} />
        <Button type="submit" size="sm" isLoading={mutations.createCategory.isPending}>
          Adicionar categoria
        </Button>
      </form>

      {selectedCategoryId ? (
        <div className="flex flex-col gap-3 rounded-lg border border-border-subtle p-3">
          <p className="text-sm font-medium">Peças da categoria selecionada</p>
          {parts.isPending && !parts.data ? (
            <ProfileStatsSkeleton count={2} />
          ) : parts.isError ? (
            <StatePanel kind="error" description="Erro ao carregar peças." />
          ) : (
            <ul className="flex flex-col gap-2">
              {(parts.data ?? []).map((part) => (
                <li
                  key={part.id}
                  className="flex items-center justify-between gap-3 rounded-md bg-bg-elevated px-3 py-2 text-sm"
                >
                  <span className="truncate">
                    {part.manufacturer} · {part.name}
                  </span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => mutations.deletePart.mutate(part.id)}
                  >
                    Excluir
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <form
            className="flex flex-col gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              mutations.createPart.mutate(
                { categoryId: selectedCategoryId, manufacturer, name: partName },
                {
                  onSuccess: () => {
                    setManufacturer("");
                    setPartName("");
                  },
                },
              );
            }}
          >
            <FormField
              label="Fabricante"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
            />
            <FormField
              label="Nome"
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
            />
            <Button type="submit" size="sm" isLoading={mutations.createPart.isPending}>
              Adicionar peça
            </Button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function SpecsSection(): JSX.Element {
  const specs = useAdminCatalogSpecs();
  const mutations = useAdminCatalogMutations();
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("STRING");

  if (specs.isPending && !specs.data) {
    return <ProfileStatsSkeleton count={3} />;
  }
  if (specs.isError) {
    return <StatePanel kind="error" description="Erro ao carregar especificações." />;
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-2">
        {(specs.data ?? []).map((spec) => (
          <li
            key={spec.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-bg-surface p-3"
          >
            <div className="min-w-0">
              <p className="font-medium text-fg-primary">{spec.name}</p>
              <p className="text-xs text-fg-muted">
                {spec.key} · {spec.type}
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (window.confirm(`Excluir especificação "${spec.name}"?`)) {
                  mutations.deleteSpec.mutate(spec.id);
                }
              }}
            >
              Excluir
            </Button>
          </li>
        ))}
      </ul>
      <form
        className="flex flex-col gap-2 rounded-lg border border-border-subtle p-3"
        onSubmit={(event) => {
          event.preventDefault();
          mutations.createSpec.mutate(
            { key, name, type },
            {
              onSuccess: () => {
                setKey("");
                setName("");
              },
            },
          );
        }}
      >
        <p className="text-sm font-medium">Nova especificação</p>
        <FormField label="Chave" value={key} onChange={(e) => setKey(e.target.value)} />
        <FormField label="Nome" value={name} onChange={(e) => setName(e.target.value)} />
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-fg-muted">Tipo</span>
          <select
            className="rounded-md border border-border-default bg-bg-elevated px-3 py-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="STRING">Texto</option>
            <option value="NUMBER">Número</option>
            <option value="BOOLEAN">Sim/Não</option>
            <option value="ENUM">Lista</option>
          </select>
        </label>
        <Button type="submit" size="sm" isLoading={mutations.createSpec.isPending}>
          Adicionar especificação
        </Button>
      </form>
    </div>
  );
}

function AdminCatalogContent(): JSX.Element {
  const { user } = useAuth();
  const [tab, setTab] = useState<"parts" | "specs">("parts");

  if (user?.role !== "ADMIN") {
    return (
      <StatePanel
        kind="error"
        title="Acesso negado"
        description="Você não tem permissão para acessar esta página."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <Link href="/admin">
          <Button variant="ghost" size="sm" leadingIcon={<Icon name="arrow-left" />}>
            Voltar ao admin
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold">Catálogo</h1>
          <p className="text-sm text-fg-muted">Gerencie peças e especificações</p>
        </div>
      </header>
      <div className="flex gap-2 border-b border-border-subtle">
        <button
          type="button"
          onClick={() => setTab("parts")}
          className={`px-4 py-2 text-sm font-medium ${
            tab === "parts"
              ? "border-b-2 border-accent-primary text-fg-primary"
              : "text-fg-muted hover:text-fg-secondary"
          }`}
        >
          Peças
        </button>
        <button
          type="button"
          onClick={() => setTab("specs")}
          className={`px-4 py-2 text-sm font-medium ${
            tab === "specs"
              ? "border-b-2 border-accent-primary text-fg-primary"
              : "text-fg-muted hover:text-fg-secondary"
          }`}
        >
          Especificações
        </button>
      </div>
      {tab === "parts" ? <CategoriesSection /> : <SpecsSection />}
    </div>
  );
}

export default function AdminCatalogPage(): JSX.Element {
  return (
    <AppShell hideBottomNav>
      <RequireAuth>
        <AdminCatalogContent />
      </RequireAuth>
    </AppShell>
  );
}
