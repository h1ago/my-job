export interface Fetcher<U extends any[] = any[], O = unknown> {
  _buildUrl(...args: U): string;
  _presentOutput(raw: unknown): O;
}
