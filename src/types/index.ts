export type TryonMode =
  | "image_id"
  | "video_id"
  | "direct"
  | "layered"
  | "video_generate";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user?: AuthUser;
  is_admin?: boolean;
}

export interface AdminOverviewUser {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  stores: number;
  storeNames: string[];
  products: number;
  usage: number;
}

export interface AdminOverviewResponse {
  totals: {
    users: number;
    stores: number;
    usage: number;
    products: number;
  };
  users: AdminOverviewUser[];
}

export interface Store {
  store_id: string;
  store_name: string;
  domain: string;
  created_at: string;
  active_key_prefix: string;
  product_count: number;
}

export interface Product {
  vizzle_product_id: string;
  product_id: string;
  name: string;
  brand: string;
  cost: number;
  image_url: string;
  category: string | null;
  size_chart_url: string | null;
  custom_fields: Record<string, unknown> | null;
  created_at: string;
}

export interface ByProductMetric {
  vizzle_product_id: string;
  product_id: string | null;
  name: string | null;
  tryon_count: number;
}

export interface AnalyticsData {
  store_id: string;
  from: string;
  to: string;
  tryons: number;
  users: number;
  video_tryons: number;
  direct_mode_calls: number;
  error_rate: number;
  avg_latency_ms: number;
  by_product: ByProductMetric[];
}

export interface ApiErrorBody {
  error: string;
  details?: unknown;
  retryAfter?: number;
}

export interface TryonSuccessResponse {
  prediction_id: string;
  output_url: string;
  model_used: string;
}

export interface GenerateVideoResponse {
  prediction_id: string;
  video_url: string;
  model_used: string;
}

export type UploadMode = "file" | "url" | "bulk";
