"use client";

import { useState } from "react";

import { Avatar } from "@/components/atoms/Avatar";
import { Icon } from "@/components/atoms/Icon";
import { StatePanel } from "@/components/organisms/StatePanel";
import { formatRelative } from "@/features/sightings";
import { cn } from "@/shared/utils/cn";

import { useComments, useCreateComment, useDeleteComment } from "../../hooks/use-comments";

import { styles } from "./CommentsThread.styles";
import type { CommentsThreadProps } from "./CommentsThread.types";

export function CommentsThread({
  targetType,
  targetId,
  currentUserId,
  className,
}: CommentsThreadProps): JSX.Element {
  const list = useComments(targetType, targetId);
  const create = useCreateComment(targetType, targetId);
  const remove = useDeleteComment(targetType, targetId);
  const [draft, setDraft] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (trimmed.length === 0) {
      return;
    }
    create.mutate(trimmed, {
      onSuccess: () => setDraft(""),
    });
  };

  return (
    <section className={cn(styles.root, className)} aria-label="Comentários">
      {list.isLoading ? (
        <StatePanel kind="loading" />
      ) : list.error ? (
        <StatePanel kind="error" />
      ) : !list.data || list.data.length === 0 ? (
        <StatePanel kind="empty" title="Seja o primeiro a comentar." />
      ) : (
        <ul className={styles.list}>
          {list.data.map((comment) => {
            const canDelete = comment.authorId === currentUserId;
            return (
              <li key={comment.id} className={styles.item}>
                <Avatar src={comment.authorAvatarUrl} alt={comment.authorUsername} size="sm" />
                <div className={styles.body}>
                  <header className={styles.header}>
                    <span className={styles.username}>@{comment.authorUsername}</span>
                    <span className={styles.date}>{formatRelative(comment.createdAt)}</span>
                  </header>
                  <p className={styles.content}>{comment.content}</p>
                  {canDelete ? (
                    <button
                      type="button"
                      className={styles.remove}
                      onClick={() => remove.mutate(comment.id)}
                    >
                      Remover
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          aria-label="Novo comentário"
          className={styles.input}
          placeholder="Escreva um comentário…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button
          type="submit"
          aria-label="Enviar comentário"
          className={styles.send}
          disabled={draft.trim().length === 0 || create.isPending}
        >
          <Icon name="chevron-right" />
        </button>
      </form>
    </section>
  );
}
