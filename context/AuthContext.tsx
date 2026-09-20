"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

export interface CustomerProfile {
  id: string;
  nama: string;
  whatsapp: string;
  email: string;
}

export interface CustomerAddress {
  id: string;
  label: string; // e.g., "Rumah", "Kantor", "Kos"
  nama: string;
  whatsapp: string;
  alamat: string;
  kecamatan: string;
  kotaKabupaten: string;
  provinsi: string;
  kodePos: string;
  isDefault: boolean;
}

interface RegisterData {
  nama: string;
  whatsapp: string;
  email: string;
  password?: string;
}

interface AuthContextType {
  customer: CustomerProfile | null;
  addresses: CustomerAddress[];
  isLoggedIn: boolean;
  isHydrated: boolean;
  login: (
    identifier: string,
    password?: string
  ) => { success: boolean; error?: string };
  register: (data: RegisterData) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<Omit<CustomerProfile, "id">>) => void;
  addAddress: (
    address: Omit<CustomerAddress, "id">
  ) => CustomerAddress;
  updateAddress: (
    id: string,
    address: Partial<Omit<CustomerAddress, "id">>
  ) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  defaultAddress: CustomerAddress | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CUSTOMER_STORAGE_KEY = "krezoema-customer";
const ADDRESSES_STORAGE_KEY = "krezoema-addresses";

// Seed sample addresses for realistic customer experience
const INITIAL_MOCK_ADDRESSES: CustomerAddress[] = [
  {
    id: "addr-1",
    label: "Rumah",
    nama: "Amrizal",
    whatsapp: "081234567890",
    alamat: "Jl. Mawar No. 14, RT 02 / RW 03",
    kecamatan: "Taman",
    kotaKabupaten: "Kota Madiun",
    provinsi: "Jawa Timur",
    kodePos: "63131",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Studio Craft",
    nama: "Amrizal (Studio)",
    whatsapp: "081234567890",
    alamat: "Jl. Pahlawan Kreatif No. 8B",
    kecamatan: "Kartoharjo",
    kotaKabupaten: "Kota Madiun",
    provinsi: "Jawa Timur",
    kodePos: "63115",
    isDefault: false,
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Hydrate customer & addresses from localStorage on mount
  useEffect(() => {
    try {
      const storedCustomer = window.localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if (storedCustomer) {
        const parsedCustomer = JSON.parse(storedCustomer);
        if (parsedCustomer && parsedCustomer.nama) {
          setCustomer(parsedCustomer);
        }
      }

      const storedAddresses = window.localStorage.getItem(ADDRESSES_STORAGE_KEY);
      if (storedAddresses) {
        const parsedAddresses = JSON.parse(storedAddresses);
        if (Array.isArray(parsedAddresses)) {
          setAddresses(parsedAddresses);
        }
      }
    } catch (err) {
      console.error("Gagal membaca auth dari localStorage:", err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist customer to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      if (customer) {
        window.localStorage.setItem(
          CUSTOMER_STORAGE_KEY,
          JSON.stringify(customer)
        );
      } else {
        window.localStorage.removeItem(CUSTOMER_STORAGE_KEY);
      }
    } catch (err) {
      console.error("Gagal menyimpan customer ke localStorage:", err);
    }
  }, [customer, isHydrated]);

  // Persist addresses to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(
        ADDRESSES_STORAGE_KEY,
        JSON.stringify(addresses)
      );
    } catch (err) {
      console.error("Gagal menyimpan addresses ke localStorage:", err);
    }
  }, [addresses, isHydrated]);

  /**
   * Mock login function: accepts email or WhatsApp number
   */
  const login = useCallback(
    (identifier: string, _password?: string) => {
      const trimmed = identifier.trim();
      if (!trimmed) {
        return {
          success: false,
          error: "Nomor WhatsApp atau email wajib diisi.",
        };
      }

      // Check if we already have saved customer matching identifier
      let profile: CustomerProfile;
      const isEmail = trimmed.includes("@");

      if (
        customer &&
        (customer.email.toLowerCase() === trimmed.toLowerCase() ||
          customer.whatsapp === trimmed)
      ) {
        profile = customer;
      } else {
        // Create mock logged-in customer based on the identifier
        const defaultName = isEmail
          ? trimmed.split("@")[0].replace(/[._-]/g, " ")
          : "Amrizal";
        const formattedName =
          defaultName.charAt(0).toUpperCase() + defaultName.slice(1);

        profile = {
          id: `cust-${Date.now()}`,
          nama: formattedName,
          whatsapp: isEmail ? "081234567890" : trimmed,
          email: isEmail ? trimmed : `${trimmed}@example.com`,
        };
      }

      setCustomer(profile);

      // If addresses list is currently empty, seed with initial mock addresses
      setAddresses((prev) => {
        if (prev.length === 0) {
          const seeded = INITIAL_MOCK_ADDRESSES.map((addr, idx) => ({
            ...addr,
            nama: profile.nama,
            whatsapp: profile.whatsapp,
            isDefault: idx === 0,
          }));
          return seeded;
        }
        return prev;
      });

      return { success: true };
    },
    [customer]
  );

  /**
   * Mock register function
   */
  const register = useCallback(
    (data: RegisterData) => {
      if (!data.nama.trim()) {
        return { success: false, error: "Nama lengkap wajib diisi." };
      }
      if (!data.whatsapp.trim()) {
        return { success: false, error: "Nomor WhatsApp wajib diisi." };
      }
      if (!data.email.trim()) {
        return { success: false, error: "Email wajib diisi." };
      }

      const newCustomer: CustomerProfile = {
        id: `cust-${Date.now()}`,
        nama: data.nama.trim(),
        whatsapp: data.whatsapp.trim(),
        email: data.email.trim(),
      };

      setCustomer(newCustomer);

      // If no addresses yet, seed an initial default address with the customer's info
      setAddresses((prev) => {
        if (prev.length === 0) {
          return [
            {
              id: `addr-${Date.now()}`,
              label: "Rumah",
              nama: newCustomer.nama,
              whatsapp: newCustomer.whatsapp,
              alamat: "Jl. Mawar No. 14, RT 02 / RW 03",
              kecamatan: "Taman",
              kotaKabupaten: "Kota Madiun",
              provinsi: "Jawa Timur",
              kodePos: "63131",
              isDefault: true,
            },
          ];
        }
        return prev;
      });

      return { success: true };
    },
    []
  );

  /**
   * Logout function
   */
  const logout = useCallback(() => {
    setCustomer(null);
  }, []);

  /**
   * Update customer profile
   */
  const updateProfile = useCallback(
    (data: Partial<Omit<CustomerProfile, "id">>) => {
      setCustomer((prev) => (prev ? { ...prev, ...data } : null));
    },
    []
  );

  /**
   * Add a new shipping address
   */
  const addAddress = useCallback(
    (newAddrData: Omit<CustomerAddress, "id">): CustomerAddress => {
      const newId = `addr-${Date.now()}`;
      let createdAddress: CustomerAddress;

      setAddresses((prev) => {
        const willBeDefault = newAddrData.isDefault || prev.length === 0;

        createdAddress = {
          ...newAddrData,
          id: newId,
          isDefault: willBeDefault,
        };

        if (willBeDefault) {
          return [
            createdAddress,
            ...prev.map((a) => ({ ...a, isDefault: false })),
          ];
        }

        return [...prev, createdAddress];
      });

      return {
        ...newAddrData,
        id: newId,
        isDefault: newAddrData.isDefault || addresses.length === 0,
      };
    },
    [addresses.length]
  );

  /**
   * Update an existing address
   */
  const updateAddress = useCallback(
    (id: string, updatedFields: Partial<Omit<CustomerAddress, "id">>) => {
      setAddresses((prev) => {
        const isSettingDefault = updatedFields.isDefault === true;

        return prev.map((addr) => {
          if (addr.id === id) {
            return {
              ...addr,
              ...updatedFields,
              isDefault: isSettingDefault ? true : addr.isDefault,
            };
          }
          if (isSettingDefault) {
            return { ...addr, isDefault: false };
          }
          return addr;
        });
      });
    },
    []
  );

  /**
   * Delete an address
   */
  const deleteAddress = useCallback((id: string) => {
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      // If the deleted address was the default and there are remaining addresses,
      // make the first remaining address the default
      const wasDefault = prev.find((a) => a.id === id)?.isDefault;
      if (wasDefault && filtered.length > 0) {
        filtered[0] = { ...filtered[0], isDefault: true };
      }
      return filtered;
    });
  }, []);

  /**
   * Set an address as default
   */
  const setDefaultAddress = useCallback((id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  }, []);

  const defaultAddress = useMemo(() => {
    return addresses.find((a) => a.isDefault) || addresses[0] || null;
  }, [addresses]);

  const value = useMemo(
    () => ({
      customer,
      addresses,
      isLoggedIn: !!customer,
      isHydrated,
      login,
      register,
      logout,
      updateProfile,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
      defaultAddress,
    }),
    [
      customer,
      addresses,
      isHydrated,
      login,
      register,
      logout,
      updateProfile,
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
