// ============================================================================
// KREZOEMA — Stage 13A & 13C: Centralized Ecommerce API Client
// Uses Axios. All ecommerce and customer auth API calls go through here.
// ============================================================================

import axios from "axios";
import type {
  ApiCategory,
  ApiProduct,
  PaginatedResponse,
  SingleResponse,
  ProductListParams,
  ApiCustomer,
  RegisterCustomerPayload,
  LoginCustomerPayload,
  UpdateCustomerProfilePayload,
  CustomerAuthResponse,
  ApiCustomerAddress,
  CustomerAddressPayload,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
export const TOKEN_STORAGE_KEY = "krezoema_customer_token";

const ecommerceClient = axios.create({
  baseURL: `${API_URL}/api/ecommerce`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

// Request interceptor to attach Bearer token if customer is authenticated
ecommerceClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

function cleanResponseData(data: any): any {
  if (typeof data !== "string") return data;
  const trimmed = data.trim();
  if (!trimmed) return data;

  // 1. Clean JSON directly
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      // Fall through to tag extraction below
    }
  }

  // 2. If preceded by PHP HTML notices/warnings, parse from after the last HTML tag
  const lastGt = trimmed.lastIndexOf(">");
  if (lastGt !== -1) {
    const candidate = trimmed.slice(lastGt + 1).trim();
    if (candidate) {
      try {
        return JSON.parse(candidate);
      } catch {
        // Fall through to brace extraction below
      }
    }
  }

  // 3. Fallback: Search for the first { or [ from the beginning
  const firstBrace = trimmed.indexOf("{");
  if (firstBrace !== -1) {
    try {
      return JSON.parse(trimmed.slice(firstBrace));
    } catch {
      // ignore
    }
  }

  const firstBracket = trimmed.indexOf("[");
  if (firstBracket !== -1) {
    try {
      return JSON.parse(trimmed.slice(firstBracket));
    } catch {
      // ignore
    }
  }

  return data;
}

// Response interceptor to gracefully clean up responses if PHP outputs deprecation/warning text
ecommerceClient.interceptors.response.use(
  (response) => {
    response.data = cleanResponseData(response.data);
    return response;
  },
  (error) => {
    if (error?.response?.data) {
      error.response.data = cleanResponseData(error.response.data);
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// Catalog Endpoints (Stage 13A)
// ============================================================================

// --- Categories ---

export async function getCategories(): Promise<ApiCategory[]> {
  const response = await ecommerceClient.get<{ data: ApiCategory[] }>("/categories");
  return response.data.data;
}

// --- Products (paginated listing) ---

export async function getProducts(
  params?: ProductListParams
): Promise<PaginatedResponse<ApiProduct>> {
  const response = await ecommerceClient.get<PaginatedResponse<ApiProduct>>("/products", {
    params,
  });
  return response.data;
}

// --- Single Product by Slug ---

export async function getProductBySlug(slug: string): Promise<ApiProduct> {
  const response = await ecommerceClient.get<SingleResponse<ApiProduct>>(
    `/products/${encodeURIComponent(slug)}`
  );
  return response.data.data;
}

// ============================================================================
// Customer Authentication Endpoints (Stage 13C)
// ============================================================================

/**
 * Register a new customer with Laravel backend.
 * Issues Sanctum Bearer token upon success.
 */
export async function registerCustomer(
  payload: RegisterCustomerPayload
): Promise<CustomerAuthResponse> {
  const response = await ecommerceClient.post<CustomerAuthResponse>(
    "/auth/register",
    payload
  );
  const data = response.data as any;
  if (!data || !data.token || (!data.data && !data.customer)) {
    const errorMsg = data?.message || "Gagal membuat akun.";
    const err = new Error(errorMsg) as any;
    err.response = response;
    throw err;
  }
  return response.data;
}

/**
 * Authenticate customer credentials against Laravel backend.
 * Issues Sanctum Bearer token upon success.
 */
export async function loginCustomer(
  payload: LoginCustomerPayload
): Promise<CustomerAuthResponse> {
  const response = await ecommerceClient.post<CustomerAuthResponse>(
    "/auth/login",
    payload
  );
  const data = response.data as any;
  if (!data || !data.token || (!data.data && !data.customer)) {
    const errorMsg = data?.message || "Email atau password salah.";
    const err = new Error(errorMsg) as any;
    err.response = response;
    throw err;
  }
  return response.data;
}

/**
 * Log out authenticated customer by revoking current Sanctum token on backend.
 */
export async function logoutCustomer(): Promise<{ message: string }> {
  const response = await ecommerceClient.post<{ message: string }>("/auth/logout");
  return response.data;
}

/**
 * Retrieve authenticated customer profile via Sanctum token.
 */
export async function getCurrentCustomer(): Promise<ApiCustomer> {
  const response = await ecommerceClient.get<{ data?: ApiCustomer; message?: string }>("/auth/me");
  const data = response.data?.data;
  if (!data || !data.id || response.data?.message === "Unauthenticated.") {
    const err = new Error("Unauthenticated.") as any;
    err.response = response;
    throw err;
  }
  return data;
}

/**
 * Update authenticated customer profile.
 */
export async function updateCustomerProfile(
  payload: UpdateCustomerProfilePayload
): Promise<ApiCustomer> {
  const response = await ecommerceClient.put<{ data?: ApiCustomer; message?: string; errors?: any }>(
    "/auth/profile",
    payload
  );
  const data = response.data?.data;
  if (!data || response.data?.errors) {
    const err = new Error(response.data?.message || "Gagal memperbarui profil.") as any;
    err.response = response;
    throw err;
  }
  return data;
}

// ============================================================================
// Customer Address Endpoints (Stage 13D)
// ============================================================================

export async function getCustomerAddresses(): Promise<ApiCustomerAddress[]> {
  const response = await ecommerceClient.get<{ data: ApiCustomerAddress[] }>("/addresses");
  return response.data.data || [];
}

export async function createCustomerAddress(
  payload: CustomerAddressPayload
): Promise<ApiCustomerAddress> {
  const response = await ecommerceClient.post<{ data: ApiCustomerAddress }>("/addresses", payload);
  return response.data.data;
}

export async function updateCustomerAddress(
  id: string | number,
  payload: Partial<CustomerAddressPayload>
): Promise<ApiCustomerAddress> {
  const response = await ecommerceClient.put<{ data: ApiCustomerAddress }>(
    `/addresses/${encodeURIComponent(String(id))}`,
    payload
  );
  return response.data.data;
}

export async function deleteCustomerAddress(id: string | number): Promise<void> {
  await ecommerceClient.delete(`/addresses/${encodeURIComponent(String(id))}`);
}

export async function setDefaultCustomerAddress(id: string | number): Promise<ApiCustomerAddress> {
  const response = await ecommerceClient.post<{ data: ApiCustomerAddress }>(
    `/addresses/${encodeURIComponent(String(id))}/default`
  );
  return response.data.data;
}

export default ecommerceClient;
