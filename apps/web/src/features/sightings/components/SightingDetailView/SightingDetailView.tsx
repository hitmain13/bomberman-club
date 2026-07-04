"use client";

import type { SightingResponse } from "@bomberman/types";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import { Icon } from "@/components/atoms/Icon";
import { StatePanel } from "@/components/organisms/StatePanel";
import { CommentsThread } from "@/features/social";
import { useAuth } from "@/shared/contexts/auth-context";

import { AuthorHeader } from "@/features/sightings/components/AuthorHeader/AuthorHeader";
import { ExpandableMap } from "@/features/sightings/components/ExpandableMap/ExpandableMap";
import { FloatingActionBar } from "@/features/sightings/components/FloatingActionBar/FloatingActionBar";
import { ShareButton } from "@/features/sightings/components/ShareButton/ShareButton";
import { SightingGallery } from "@/features/sightings/components/SightingGallery/SightingGallery";
import { useDeleteSighting } from "@/features/sightings/hooks/use-sighting-mutations";
import { useSighting } from "@/features/sightings/hooks/use-sightings";
import { canManageSighting } from "@/features/sightings/utils/can-manage-sighting";
import { formatDateTime } from "@/features/sightings/utils/format-date";
import { formatSightingLocation } from "@/features/sightings/utils/format-location";

export interface SightingDetailViewProps {
  id: string;
}

export function SightingDetailView({ id }: SightingDetailViewProps): JSX.Element {
  const router = useRouter();
  const commentsRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { data, isLoading, error } = useSighting(id);
  const remove = useDeleteSighting(id);

  if (isLoading) {
    return <StatePanel kind="loading" />;
  }
  if (error || !data) {
    return <StatePanel kind="error" description="Não foi possível carregar este flagrado." />;
  }

  return (
    <SightingDetailContent
      data={data}
      user={user}
      commentsRef={commentsRef}
      onEdit={() => router.push(`/sightings/${id}/edit`)}
      onDelete={() => {
        if (window.confirm("Remover este flagrado?")) {
          remove.mutate();
        }
      }}
      isDeleting={remove.isPending}
      shareUrl={
        typeof window !== "undefined"
          ? `${window.location.origin}/sightings/${id}`
          : `/sightings/${id}`
      }
    />
  );
}

interface SightingDetailContentProps {
  data: SightingResponse;
  user: ReturnType<typeof useAuth>["user"];
  commentsRef: React.RefObject<HTMLDivElement | null>;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  shareUrl: string;
}

function SightingDetailContent({
  data,
  user,
  commentsRef,
  onEdit,
  onDelete,
  isDeleting,
  shareUrl,
}: SightingDetailContentProps): JSX.Element {
  const canManage = canManageSighting(user, data.userId);
  const locationText = formatSightingLocation(data);
  const galleryImages = data.images.map((image, index) => ({
    url: image.url,
    alt: `${data.title} — foto ${index + 1}`,
  }));

  return (
    <article className="flex flex-col gap-4 pb-6">
      <AuthorHeader
        username={data.author.username}
        avatarUrl={data.author.avatarUrl}
        occurredAtLabel={formatDateTime(data.occurredAt)}
        canManage={canManage}
        onEdit={onEdit}
        onDelete={onDelete}
        isDeleting={isDeleting}
      />

      <SightingGallery
        images={galleryImages}
        overlay={
          <FloatingActionBar
            targetId={data.id}
            initialLiked={data.stats.liked}
            initialLikeCount={data.stats.likeCount}
            initialCommentCount={data.stats.commentCount}
            onCommentClick={() =>
              commentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          />
        }
      />

      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold tracking-tight">{data.title}</h1>
        <ShareButton url={shareUrl} title={data.title} />
      </div>

      {data.description ? <p className="text-sm text-fg-secondary">{data.description}</p> : null}

      <div className="flex flex-col gap-2">
        <p className="flex items-center gap-2 text-sm text-fg-secondary">
          <Icon name="map" size="sm" />
          {locationText}
        </p>
        <ExpandableMap latitude={data.latitude} longitude={data.longitude} />
      </div>

      <div ref={commentsRef}>
        <CommentsThread targetType="SIGHTING" targetId={data.id} currentUserId={user?.id ?? null} />
      </div>
    </article>
  );
}
