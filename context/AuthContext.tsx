"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  TOKEN_STORAGE_KEY,
  loginCustomer,
  registerCustomer,
  logoutCustomer,
  getCurrentCustomer,
  updateCustomerProfile,
  getCustomerAddresses,
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
  setDefaultCustomerAddress,
} from "@/lib/api/ecommerce";
import type { ApiCustomer, ApiCustomerAddress } from "@/lib/api/types";

export interface CustomerProfile {
  id: string;
  nama: string; // Alias for name (backward compatibility)
  name: string; // Backend user name
  email: string;
  whatsapp: string;
}

export interface CustomerAddress {
  id: string;
  label: string;
  nama: string;
  whatsapp: string;
  alamat: string;
  kecamatan: string;
  kotaKabupaten: string;
  provinsi: string;
  kodePos: string;
  isDefault: boolean;
}

export interface RegisterData {
  nama?: string;
  name?: string;
  whatsapp?: string;
  email: string;
  password: string;
  password_confirmation?: string;
  confirmPassword?: string;
}

interface AuthContextType {
  user: CustomerProfile | null;
  customer: CustomerProfile | null; // Backward compatibility alias for user
  isAuthenticated: boolean;
  isLoggedIn: boolean; // Backward compatibility alias for isAuthenticated
  isLoading: boolean;
  isHydrated: boolean; // Backward compatibility alias for !isLoading
  login: (
    identifierOrEmail: string,
    password?: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    data: RegisterData
  ) => Promise<{ success: boolean; error?: string; errors?: Record<string, string[]> }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (
    data: Partial<Omit<CustomerProfile, "id">>
  ) => Promise<{ success: boolean; error?: string }>;

  addresses: CustomerAddress[];
  isAddressesLoading: boolean;
  addressError: string | null;
  refreshAddresses: () => Promise<void>;
  addAddress: (address: Omit<CustomerAddress, "id">) => Promise<CustomerAddress>;
  updateAddress: (
    id: string,
    address: Partial<Omit<CustomerAddress, "id">>
  ) => Promise<CustomerAddress>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  defaultAddress: CustomerAddress | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LEGACY_ADDRESSES_STORAGE_KEY = "krezoema-addresses";

function mapApiAddress(address: ApiCustomerAddress): CustomerAddress {
  return {
    id: String(address.id),
    label: address.label,
    nama: address.recipient_name,
    whatsapp: address.whatsapp,
    alamat: address.address,
    kecamatan: address.district,
    kotaKabupaten: address.city,
    provinsi: address.province,
    kodePos: address.postal_code,
    isDefault: address.is_default,
  };
}

function mapAddressPayload(address: Omit<CustomerAddress, "id">) {
  return {
    label: address.label.trim(),
    recipient_name: address.nama.trim(),
    whatsapp: address.whatsapp.trim(),
    address: address.alamat.trim(),
    district: address.kecamatan.trim(),
    city: address.kotaKabupaten.trim(),
    province: address.provinsi.trim(),
    postal_code: address.kodePos.trim(),
    is_default: address.isDefault,
  };
}

function mapApiCustomerToProfile(
  apiCustomer: ApiCustomer,
  whatsappFallback: string = "081234567890"
): CustomerProfile {
  return {
    id: String(apiCustomer.id),
    name: apiCustomer.name,
    nama: apiCustomer.name,
    email: apiCustomer.email,
    whatsapp: whatsappFallback,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [isAddressesLoading, setIsAddressesLoading] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  const refreshAddresses = useCallback(async () => {
    setIsAddressesLoading(true);
    setAddressError(null);
    try {
      const fetched = await getCustomerAddresses();
      setAddresses(fetched.map(mapApiAddress));
    } catch (error: any) {
      setAddresses([]);
      if (error?.response?.status === 401) {
        if (typeof window !== "undefined") localStorage.removeItem(TOKEN_STORAGE_KEY);
        setUser(null);
        setAddressError("Sesi Anda telah berakhir. Silakan masuk kembali.");
      } else {
        setAddressError("Gagal memuat alamat. Silakan coba lagi.");
      }
      throw error;
    } finally {
      setIsAddressesLoading(false);
    }
  }, []);

  // 1. Session Restoration on App Start (from Laravel Sanctum via /me)
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      setIsLoading(true);

      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem(TOKEN_STORAGE_KEY)
            : null;

        if (token) {
          const customerData = await getCurrentCustomer();
          if (!cancelled) {
            setUser(mapApiCustomerToProfile(customerData));
            setIsAddressesLoading(true);
            try {
              const fetched = await getCustomerAddresses();
              if (!cancelled) setAddresses(fetched.map(mapApiAddress));
            } catch (error: any) {
              if (!cancelled) {
                if (error?.response?.status === 401) {
                  if (typeof window !== "undefined") localStorage.removeItem(TOKEN_STORAGE_KEY);
                  setUser(null);
                  setAddresses([]);
                  setAddressError("Sesi Anda telah berakhir. Silakan masuk kembali.");
                } else {
                  setAddressError("Gagal memuat alamat. Silakan coba lagi.");
                }
              }
            } finally {
              if (!cancelled) setIsAddressesLoading(false);
            }
          }
        } else {
          if (!cancelled) {
            setUser(null);
          }
        }
      } catch {
        // Token is invalid, expired, or backend unreachable
        if (!cancelled) {
          if (typeof window !== "undefined") {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
          }
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    // Address data is now owned by the API. Remove the old local mock cache.
    try { window.localStorage.removeItem(LEGACY_ADDRESSES_STORAGE_KEY); } catch { /* ignore */ }

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Real Login with Laravel backend.
   */
  const login = useCallback(
    async (
      identifierOrEmail: string,
      password?: string
    ): Promise<{ success: boolean; error?: string }> => {
      const email = identifierOrEmail.trim();
      const pwd = password || "";

      if (!email) {
        return { success: false, error: "Email wajib diisi." };
      }
      if (!pwd) {
        return { success: false, error: "Password wajib diisi." };
      }

      try {
        const res = await loginCustomer({ email, password: pwd });
        const customerObj = res.data || res.customer;
        if (!res.token || !customerObj) {
          return { success: false, error: "Email atau password salah." };
        }

        if (typeof window !== "undefined" && res.token) {
          localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
        }

        const profile = mapApiCustomerToProfile(customerObj);
        setUser(profile);
        void refreshAddresses().catch(() => undefined);
        return { success: true };
      } catch (err: any) {
        const status = err.response?.status;
        const data = err.response?.data;

        if (
          status === 401 ||
          data?.message === "Invalid email or password" ||
          err.message === "Invalid email or password" ||
          err.message === "Email atau password salah."
        ) {
          return {
            success: false,
            error: "Email atau password salah.",
          };
        }

        if (data?.errors) {
          const firstErrKey = Object.keys(data.errors)[0];
          const firstErrMsg = data.errors[firstErrKey]?.[0];
          return {
            success: false,
            error: firstErrMsg || "Data yang dimasukkan tidak valid.",
          };
        }

        return {
          success: false,
          error: "Email atau password salah.",
        };
      }
    },
    []
  );

  /**
   * Real Register with Laravel backend.
   */
  const register = useCallback(
    async (
      data: RegisterData
    ): Promise<{ success: boolean; error?: string; errors?: Record<string, string[]> }> => {
      const name = (data.name || data.nama || "").trim();
      const email = data.email.trim();
      const password = data.password;
      const password_confirmation =
        data.password_confirmation || data.confirmPassword || "";

      if (!name) {
        return { success: false, error: "Nama lengkap wajib diisi." };
      }
      if (!email) {
        return { success: false, error: "Email wajib diisi." };
      }
      if (!password || password.length < 8) {
        return { success: false, error: "Password minimal 8 karakter." };
      }
      if (password !== password_confirmation) {
        return { success: false, error: "Konfirmasi password tidak cocok." };
      }

      try {
        const res = await registerCustomer({
          name,
          email,
          password,
          password_confirmation,
        });

        const customerObj = res.data || res.customer;
        if (!res.token || !customerObj) {
          return { success: false, error: "Gagal membuat akun. Silakan coba lagi." };
        }

        if (typeof window !== "undefined" && res.token) {
          localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
        }

        const profile = mapApiCustomerToProfile(
          customerObj,
          data.whatsapp || "081234567890"
        );
        setUser(profile);
        void refreshAddresses().catch(() => undefined);
        return { success: true };
      } catch (err: any) {
        const status = err.response?.status;
        const responseData = err.response?.data;

        if (responseData?.errors) {
          const errors = responseData.errors;
          if (errors.email) {
            return {
              success: false,
              error: "Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.",
              errors,
            };
          }
          const firstKey = Object.keys(errors)[0];
          return {
            success: false,
            error: errors[firstKey]?.[0] || "Data pendaftaran tidak valid.",
            errors,
          };
        }

        return {
          success: false,
          error: "Terjadi kesalahan saat mendaftar. Silakan coba lagi.",
        };
      }
    },
    []
  );

  /**
   * Real Logout: revokes token on Laravel backend and clears local auth.
   */
  const logout = useCallback(async () => {
    try {
      await logoutCustomer();
    } catch {
      // Silently proceed so user is always logged out locally
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
      setUser(null);
      setAddresses([]);
      setAddressError(null);
    }
  }, []);

  /**
   * Refresh current user from Laravel backend.
   */
  const refreshUser = useCallback(async () => {
    try {
      const customerData = await getCurrentCustomer();
      setUser((prev) =>
        mapApiCustomerToProfile(customerData, prev?.whatsapp || "081234567890")
      );
    } catch {
      if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
      setUser(null);
      setAddresses([]);
    }
  }, []);

  /**
   * Real Update Profile with Laravel backend.
   */
  const updateProfile = useCallback(
    async (
      data: Partial<Omit<CustomerProfile, "id">>
    ): Promise<{ success: boolean; error?: string }> => {
      const payload: { name?: string; email?: string } = {};
      const newName = data.name || data.nama;
      if (newName) payload.name = newName.trim();
      if (data.email) payload.email = data.email.trim();

      try {
        const updated = await updateCustomerProfile(payload);
        const profile = mapApiCustomerToProfile(
          updated,
          data.whatsapp || user?.whatsapp || "081234567890"
        );
        setUser(profile);
        return { success: true };
      } catch (err: any) {
        const status = err.response?.status;
        const errData = err.response?.data;

        if (status === 422 && errData?.errors) {
          const firstKey = Object.keys(errData.errors)[0];
          return {
            success: false,
            error: errData.errors[firstKey]?.[0] || "Data tidak valid.",
          };
        }

        return {
          success: false,
          error: "Gagal memperbarui profil. Silakan coba lagi.",
        };
      }
    },
    [user?.whatsapp]
  );

  const addAddress = useCallback(
    async (newAddrData: Omit<CustomerAddress, "id">): Promise<CustomerAddress> => {
      const created = await createCustomerAddress(mapAddressPayload(newAddrData));
      await refreshAddresses();
      return mapApiAddress(created);
    },
    [refreshAddresses]
  );

  const updateAddress = useCallback(
    async (id: string, updatedFields: Partial<Omit<CustomerAddress, "id">>) => {
      const current = addresses.find((address) => address.id === id);
      if (!current) throw new Error("Alamat tidak ditemukan.");
      const updated = await updateCustomerAddress(id, mapAddressPayload({ ...current, ...updatedFields }));
      await refreshAddresses();
      return mapApiAddress(updated);
    },
    [addresses, refreshAddresses]
  );

  const deleteAddress = useCallback(async (id: string) => {
    await deleteCustomerAddress(id);
    await refreshAddresses();
  }, [refreshAddresses]);

  const setDefaultAddress = useCallback(async (id: string) => {
    await setDefaultCustomerAddress(id);
    await refreshAddresses();
  }, [refreshAddresses]);

  const defaultAddress = useMemo(() => {
    return addresses.find((a) => a.isDefault) || addresses[0] || null;
  }, [addresses]);

  const value = useMemo(
    () => ({
      user,
      customer: user,
      isAuthenticated: !!user,
      isLoggedIn: !!user,
      isLoading,
      isHydrated: !isLoading,
      login,
      register,
      logout,
      refreshUser,
      updateProfile,
      addresses,
      isAddressesLoading,
      addressError,
      refreshAddresses,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
      defaultAddress,
    }),
    [
      user,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
      updateProfile,
      addresses,
      isAddressesLoading,
      addressError,
      refreshAddresses,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
      defaultAddress,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
