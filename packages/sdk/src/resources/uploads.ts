import { type UploadResponse, uploadResponseSchema } from "@bomberman/types";

import type { HttpClient } from "../http";

export class UploadsResource {
  constructor(private readonly http: HttpClient) {}

  async upload(file: Blob, filename: string): Promise<UploadResponse> {
    const form = new FormData();
    form.append("file", file, filename);
    const response = await this.http.fetch(`${this.http.baseUrl}/uploads`, {
      method: "POST",
      credentials: "include",
      headers: this.http.authHeader(),
      body: form,
    });
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }
    const data = (await response.json()) as unknown;
    return uploadResponseSchema.parse(data);
  }
}
