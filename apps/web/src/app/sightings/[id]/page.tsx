"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";

import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { StatePanel } from "@/components/organisms/StatePanel";
import { AppShell } from "@/components/templates/AppShell";
import { formatDateTime, useDeleteSighting, useSighting } from "@/features/sightings";
import { formatSightingLocation } from "@/features/sightings/utils/format-location";
import { CommentsThread, LikeButton } from "@/features/social";
import { useAuth } from "@/shared/contexts/auth-context";
import { RequireAuth } from "@/shared/contexts/require-auth";

const SightingMiniMap = dynamic(
  () =>
    import("@/features/sightings/components/SightingMiniMap/SightingMiniMap").then((module) => ({
      default: module.SightingMiniMap,
    })),
  { ssr: false, loading: () => <div className="h-40 animate-pulse rounded-lg bg-bg-elevated" /> },
);

interface PageProps {
  params: Promise<{ id: string }>;
}

function Content({ id }: { id: string }): JSX.Element {
  const { user } = useAuth();
  const { data, isLoading, error } = useSighting(id);
  const remove = useDeleteSighting(id);

  if (isLoading) {
    return <StatePanel kind="loading" />;
  }
  if (error || !data) {
    return <StatePanel kind="error" description="Não foi possível carregar este flagrado." />;
  }

  const isOwner = user?.id === data.userId;
  const locationText = formatSightingLocation(data);

  return (
    <article className="flex flex-col gap-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-bg-elevated">
        <Image src={data.imageUrl} alt={data.title} fill sizes="100vw" />
      </div>
      <header className="flex items-center gap-3">
        <Link href={`/u/${data.author.username}`} className="flex items-center gap-3">
          <Avatar src={data.author.avatarUrl} alt={data.author.username} size="md" />
          <div className="flex flex-col text-sm">
            <span className="font-semibold text-fg-primary">@{data.author.username}</span>
            <span className="text-xs text-fg-muted">{formatDateTime(data.occurredAt)}</span>
          </div>
        </Link>
      </header>
      <h1 className="text-xl font-bold tracking-tight">{data.title}</h1>
      {data.description ? <p className="text-sm text-fg-secondary">{data.description}</p> : null}
      <div className="flex flex-col gap-2">
        <p className="flex items-center gap-2 text-sm text-fg-secondary">
          <Icon name="map" size="sm" />
          {locationText}
        </p>
        <SightingMiniMap latitude={data.latitude} longitude={data.longitude} />
      </div>
      <div className="flex items-center gap-3">
        <LikeButton targetType="SIGHTING" targetId={data.id} />
      </div>
      <CommentsThread targetType="SIGHTING" targetId={data.id} currentUserId={user?.id ?? null} />
      {isOwner ? (
        <Button
          variant="danger"
          fullWidth
          isLoading={remove.isPending}
          onClick={() => {
            if (window.confirm("Remover este flagrado?")) {
              remove.mutate();
            }
          }}
        >
          Excluir flagrado
        </Button>
      ) : null}
    </article>
  );
}

export default function SightingDetailPage({ params }: PageProps): JSX.Element {
  const resolved = use(params);
  return (
    <AppShell>
      <RequireAuth>
        <header className="flex items-center justify-between pb-4">
          <Link href="/sightings">
            <Button variant="ghost" size="sm" leadingIcon={<Icon name="arrow-left" />}>
              Voltar
            </Button>
          </Link>
          <h1 className="sr-only">Flagrado</h1>
          <span aria-hidden="true" className="w-12" />
        </header>
        <Content id={resolved.id} />
      </RequireAuth>
    </AppShell>
  );
}
