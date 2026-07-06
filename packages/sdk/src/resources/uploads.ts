import { type UploadResponse, uploadResponseSchema } from "@bomberman/types";

import type { HttpClient } from "../http";

export class UploadsResource {
  constructor(private readonly http: HttpClient) {}

  async upload(file: Blob, filename: string): Promise<UploadResponse> {
    const form = new FormData();
    form.append("file", file, filename);
    return this.http.uploadRequest({
      path: "/uploads",
      body: form,
      responseSchema: uploadResponseSchema,
    });
  }
}
