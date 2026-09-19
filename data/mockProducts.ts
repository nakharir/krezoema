export interface Product {
  id: string;
  slug: string;
  name: string;
  category: "manik-kaca" | "akrilik" | "mutiara" | "tali-kawat" | "alat-crafting";
  categoryLabel: string;
  price: number;
  formattedPrice: string;
  image?: string;
  shortDescription: string;
  badge?: string;
  materialDetails?: string;
  variants?: {
    type: "warna" | "ukuran" | "bentuk";
    options: string[];
  }[];
}

export const mockProducts: Product[] = [
  {
    id: "p-01",
    slug: "manik-kaca-aurora-iridescent",
    name: "Manik Kaca Aurora Iridescent",
    category: "manik-kaca",
    categoryLabel: "Manik Kaca",
    price: 24000,
    formattedPrice: "Rp 24.000",
    shortDescription: "Manik kaca kilau aurora dengan pendaran spektrum warna lembut saat terkena pantulan cahaya.",
    materialDetails: "Kaca kristal borosilikat 8mm • Isi 25 butir",
    badge: "Koleksi Favorit",
    variants: [
      { type: "warna", options: ["Violet Pendar", "Aqua Mist", "Sunset Peach"] },
      { type: "ukuran", options: ["6mm", "8mm", "10mm"] }
    ]
  },
  {
    id: "p-02",
    slug: "manik-akrilik-pastel-matte",
    name: "Manik Akrilik Pastel Matte",
    category: "akrilik",
    categoryLabel: "Akrilik",
    price: 18000,
    formattedPrice: "Rp 18.000",
    shortDescription: "Butiran akrilik ringan bernuansa pastel matte dengan tekstur lembut untuk strap dan gelang.",
    materialDetails: "Akrilik matte premium • Isi 50 butir",
    variants: [
      { type: "warna", options: ["Lilac Fog", "Soft Sage", "Buttercup", "Blush"] },
      { type: "bentuk", options: ["Bulat", "Bunga", "Bintang"] }
    ]
  },
  {
    id: "p-03",
    slug: "mutiara-sintetis-classic-ivory",
    name: "Mutiara Sintetis Classic Ivory",
    category: "mutiara",
    categoryLabel: "Mutiara",
    price: 28000,
    formattedPrice: "Rp 28.000",
    shortDescription: "Mutiara sintetis berbobot mantap dengan lapisan kilau satin klasik untuk kalung dan anting berkelas.",
    materialDetails: "Inti kaca dilapisi pearlescent satin • 1 untai 40cm",
    badge: "Paling Diminati",
    variants: [
      { type: "warna", options: ["Classic Ivory", "Champagne", "Soft Rose"] },
      { type: "ukuran", options: ["4mm", "6mm", "8mm"] }
    ]
  },
  {
    id: "p-04",
    slug: "tali-nylon-craft-braided",
    name: "Tali Nylon Craft Braided 0.8mm",
    category: "tali-kawat",
    categoryLabel: "Tali & Kawat",
    price: 15000,
    formattedPrice: "Rp 15.000",
    shortDescription: "Tali anyaman nilon kuat, tahan air, dan tidak mudah berserabut. Ideal untuk macrame dan anyaman manik.",
    materialDetails: "Nilon mikro 0.8mm • Panjang 10 meter",
    variants: [
      { type: "warna", options: ["Earthy Terracotta", "Charcoal Slate", "Warm Sand", "Lavender"] }
    ]
  },
  {
    id: "p-05",
    slug: "tang-round-nose-mini-crafting",
    name: "Tang Round Nose Mini Precision",
    category: "alat-crafting",
    categoryLabel: "Alat Crafting",
    price: 45000,
    formattedPrice: "Rp 45.000",
    shortDescription: "Tang presisi berujung bulat halus untuk membuat loop kawat rapi tanpa meninggalkan goresan pada material.",
    materialDetails: "Stainless steel dengan gagang ergonomis soft-grip",
    badge: "Esensial Craft",
    variants: [
      { type: "warna", options: ["Gagang Lilac", "Gagang Coral"] }
    ]
  },
  {
    id: "p-06",
    slug: "kawat-tembaga-craft-non-tarnish",
    name: "Kawat Tembaga Non-Tarnish 0.5mm",
    category: "tali-kawat",
    categoryLabel: "Tali & Kawat",
    price: 32000,
    formattedPrice: "Rp 32.000",
    shortDescription: "Kawat lilit lentur berlapis anti-karat untuk wire-wrapping liontin dan rangka aksesoris handmade.",
    materialDetails: "Tembaga murni dilapisi proteksi ganda • Roll 5 meter",
    variants: [
      { type: "warna", options: ["Warm Gold", "Silver Gleam", "Rose Copper"] },
      { type: "ukuran", options: ["0.3mm", "0.5mm", "0.8mm"] }
    ]
  },
  {
    id: "p-07",
    slug: "manik-kaca-lampwork-bunga-mekar",
    name: "Manik Kaca Lampwork Bunga Mekar",
    category: "manik-kaca",
    categoryLabel: "Manik Kaca",
    price: 35000,
    formattedPrice: "Rp 35.000",
    shortDescription: "Setiap butir dibentuk manual satu per satu di atas api obor dengan motif flora organik yang unik.",
    materialDetails: "Artisan Lampwork Glass • Set 4 butir",
    badge: "Artisan Handcrafted",
    variants: [
      { type: "warna", options: ["Wild Violet", "Sunbeam Yellow", "Cherry Blossom"] }
    ]
  },
  {
    id: "p-08",
    slug: "mutiara-air-tawar-baroque-natural",
    name: "Mutiara Air Tawar Baroque Asimetris",
    category: "mutiara",
    categoryLabel: "Mutiara",
    price: 52000,
    formattedPrice: "Rp 52.000",
    shortDescription: "Bentuk alami asimetris dari alam, memberi sentuhan otentik dan tekstur personal pada perhiasan buatan tangan.",
    materialDetails: "Mutiara air tawar asli bentuk baroque • 1 string 35cm",
    badge: "Natural Material",
    variants: [
      { type: "warna", options: ["Natural White", "Iridescent Peach"] }
    ]
  }
];

export interface CraftCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  itemCount: string;
  accentColor: string;
  bgTint: string;
  borderColor: string;
  paletteDot: string;
  highlightText: string;
}

export const craftCategories: CraftCategory[] = [
  {
    id: "cat-1",
    name: "Manik Kaca",
    slug: "manik-kaca",
    description: "Kilau pendaran cahaya, efek aurora transparan, dan teknik lampwork artisan dengan detail warna organik.",
    itemCount: "40+ Pilihan",
    accentColor: "text-brand-purple",
    bgTint: "bg-[#F7F2FD]",
    borderColor: "border-[#E8DCFB]",
    paletteDot: "bg-brand-purple",
    highlightText: "Transparansi & Refleksi",
  },
  {
    id: "cat-2",
    name: "Akrilik",
    slug: "akrilik",
    description: "Material ringan warna pastel matte, bentuk geometris ceria, dan tekstur kontemporer yang playful.",
    itemCount: "35+ Pilihan",
    accentColor: "text-brand-magenta",
    bgTint: "bg-[#FDF2F7]",
    borderColor: "border-[#F8D7E8]",
    paletteDot: "bg-brand-magenta",
    highlightText: "Warna Pop & Ringan",
  },
  {
    id: "cat-3",
    name: "Mutiara",
    slug: "mutiara",
    description: "Mutiara sintetis satin klasik hingga mutiara air tawar baroque bertekstur alami yang elegan.",
    itemCount: "25+ Pilihan",
    accentColor: "text-brand-yellow",
    bgTint: "bg-[#FEFCE8]",
    borderColor: "border-[#F8EFA6]",
    paletteDot: "bg-brand-yellow",
    highlightText: "Satin Kilau Klasik",
  },
  {
    id: "cat-4",
    name: "Tali & Kawat",
    slug: "tali-kawat",
    description: "Benang nilon anyam kuat, benang elastis lentur, hingga kawat tembaga non-tarnish untuk struktur tahan lama.",
    itemCount: "30+ Pilihan",
    accentColor: "text-brand-orange",
    bgTint: "bg-[#FFF4ED]",
    borderColor: "border-[#FED7BC]",
    paletteDot: "bg-brand-orange",
    highlightText: "Kekuatan & Fleksibilitas",
  },
  {
    id: "cat-5",
    name: "Alat Crafting",
    slug: "alat-crafting",
    description: "Tang presisi berujung halus, gunting mikro, bead mat, dan jarum perangkai untuk kenyamanan berkarya.",
    itemCount: "20+ Alat Esensial",
    accentColor: "text-foreground",
    bgTint: "bg-[#F3EFEA]",
    borderColor: "border-[#E2D9CD]",
    paletteDot: "bg-foreground",
    highlightText: "Presisi & Ergonomi",
  },
];
