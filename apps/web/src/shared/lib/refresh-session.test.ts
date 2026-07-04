import { beforeEach, describe, expect, it, vi } from "vitest";

const refreshMock = vi.fn();

vi.mock("@/shared/lib/api-client", () => ({
  apiClient: {
    auth: {
      refresh: () => refreshMock(),
    },
  },
}));

describe("refreshSession", () => {
  beforeEach(() => {
    refreshMock.mockReset();
    vi.resetModules();
  });

  it("deduplicates concurrent refresh calls", async () => {
    let resolveRefresh: ((value: unknown) => void) | undefined;
    refreshMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRefresh = resolve;
        }),
    );

    const { refreshSession } = await import("./refresh-session");
    const first = refreshSession();
    const second = refreshSession();

    expect(refreshMock).toHaveBeenCalledTimes(1);

    resolveRefresh?.({
      user: { id: "1", username: "test", email: "t@t.com", role: "USER" },
      accessToken: "token",
      expiresIn: 900,
    });

    const [a, b] = await Promise.all([first, second]);
    expect(a?.accessToken).toBe("token");
    expect(b?.accessToken).toBe("token");
  });
});
