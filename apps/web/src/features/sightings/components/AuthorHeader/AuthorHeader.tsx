"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";

export interface AuthorHeaderProps {
  username: string;
  avatarUrl: string | null;
  occurredAtLabel: string;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function AuthorHeader({
  username,
  avatarUrl,
  occurredAtLabel,
  canManage,
  onEdit,
  onDelete,
  isDeleting = false,
}: AuthorHeaderProps): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const handleClick = (event: MouseEvent): void => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <header className="flex items-center justify-between gap-3">
      <Link href={`/u/${username}`} className="flex min-w-0 items-center gap-3">
        <Avatar src={avatarUrl} alt={username} size="md" />
        <div className="min-w-0 flex flex-col text-sm">
          <span className="truncate font-semibold text-fg-primary">@{username}</span>
          <span className="text-xs text-fg-muted">{occurredAtLabel}</span>
        </div>
      </Link>
      {canManage ? (
        <div className="relative" ref={menuRef}>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Ações do flagrado"
            leadingIcon={<Icon name="more-vertical" />}
            onClick={() => setMenuOpen((value) => !value)}
          />
          {menuOpen ? (
            <div className="absolute right-0 top-full z-20 mt-1 min-w-36 overflow-hidden rounded-lg border border-border-default bg-bg-elevated shadow-lg">
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-bg-muted"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit();
                }}
              >
                <Icon name="edit" size="sm" />
                Editar
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger hover:bg-bg-muted"
                disabled={isDeleting}
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
              >
                <Icon name="trash" size="sm" />
                Apagar
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
