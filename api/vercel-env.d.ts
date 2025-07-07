declare module '@vercel/node' {
  export interface VercelRequest {
    method?: string;
    query: { [key: string]: string | string[] | undefined };
    body?: any;
    headers: Record<string, string | string[] | undefined>;
  }
  export interface VercelResponse {
    status(statusCode: number): this;
    json(obj: any): void;
    send(body: any): void;
  }
}
