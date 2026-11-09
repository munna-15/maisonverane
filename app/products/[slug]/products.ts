/* Shared product types and demo catalogue.
   This file is server-safe: it contains no React hooks or browser APIs. */

export type Category = "Dresses" | "Tops" | "Co-ord Sets" | "Bottoms";
export type Size = "XS" | "S" | "M" | "L" | "XL";
export type Rating = 1 | 2 | 3 | 4 | 5;

export interface ProductImage {
  readonly src: string;
  readonly alt: string;
  readonly objectPosition?: string;
}

export interface ColorVariant {
  readonly id: string;
  readonly name: string;
  /** Hex colour for the swatch */
  readonly swatch: string;
  /** Colour-specific gallery; falls back to the product gallery when omitted */
  readonly images?: readonly ProductImage[];
  /** Units in stock per size. Sizes that are not listed are not offered. */
  readonly stock: Readonly<Partial<Record<Size, number>>>;
}

export interface Review {
  readonly id: string;
  readonly author: string;
  readonly rating: Rating;
  readonly title: string;
  readonly body: string;
  /** ISO date */
  readonly date: string;
}

export interface Product {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly category: Category;
  /** Price in whole BDT */
  readonly price: number;
  readonly compareAtPrice?: number;
  readonly shortDescription: string;
  readonly description: readonly string[];
  readonly details: readonly string[];
  readonly materials: string;
  readonly care: readonly string[];
  readonly images: readonly ProductImage[];
  readonly colors: readonly [ColorVariant, ...ColorVariant[]];
  readonly reviews: readonly Review[];
}

export const SIZES: readonly Size[] = ["XS", "S", "M", "L", "XL"];

const photoSrc = (n: number): string =>
  `/images/products/product-${String(n).padStart(2, "0")}.avif`;

function views(label: string, numbers: readonly number[]): ProductImage[] {
  return numbers.map((n, i) => ({
    src: photoSrc(n),
    alt: `${label}, view ${i + 1}`,
    objectPosition: "50% 20%",
  }));
}

const CARE_DELICATE: readonly string[] = [
  "Hand wash cold or machine wash on a delicate cycle",
  "Do not bleach or tumble dry",
  "Cool iron on the reverse if needed",
  "Dry flat, away from direct sun",
];
const CARE_KNIT: readonly string[] = [
  "Hand wash cold with a gentle detergent",
  "Reshape and dry flat; do not wring",
  "Do not tumble dry",
  "Store folded to keep the shape",
];
const CARE_TAILORED: readonly string[] = [
  "Dry clean only",
  "Steam lightly to refresh; do not wring",
  "Store on a wide, shaped hanger",
];
const CARE_LINEN: readonly string[] = [
  "Machine wash cool on a gentle cycle",
  "Iron while slightly damp for a crisp finish",
  "Do not bleach",
  "Line dry",
];

export const PRODUCTS: readonly Product[] = [
  {
    id: "satin-slip-dress",
    slug: "satin-slip-dress",
    name: "Satin Slip Dress",
    category: "Dresses",
    price: 2450,
    shortDescription:
      "A bias-cut slip in fluid satin that skims the body and moves with you from afternoon to evening.",
    description: [
      "Cut on the bias, this slip dress falls in a long, graceful line with a softly cowled neckline and fine adjustable straps.",
      "Wear it alone for evenings, or layer it under a tailored blazer or fine knit for daytime.",
    ],
    details: [
      "Bias-cut, midi length",
      "Cowl neckline with adjustable straps",
      "Concealed side zip",
      "Partially lined",
    ],
    materials: "Main fabric: 100% polyester satin. Lining: 100% viscose.",
    care: CARE_DELICATE,
    images: views("Satin Slip Dress", [1, 2, 3]),
    colors: [
      {
        id: "champagne",
        name: "Champagne",
        swatch: "#C5A88A",
        stock: { XS: 3, S: 5, M: 2, L: 0, XL: 4 },
      },
      {
        id: "wine",
        name: "Wine",
        swatch: "#713849",
        images: views("Satin Slip Dress in Wine", [4, 5, 6]),
        stock: { XS: 0, S: 2, M: 4, L: 3, XL: 0 },
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Nusrat A.",
        rating: 5,
        title: "Beautiful drape",
        body: "The satin falls beautifully and the fit through the waist is just right. I wore it to a wedding and received so many compliments.",
        date: "2026-11-04",
      },
      {
        id: "r2",
        author: "Farzana R.",
        rating: 5,
        title: "Worth every taka",
        body: "Feels far more expensive than it is. The straps adjust easily and the fabric does not cling.",
        date: "2026-11-02",
      },
      {
        id: "r3",
        author: "Tasnim K.",
        rating: 4,
        title: "Lovely, slightly long",
        body: "Gorgeous colour and quality. It runs a little long on me at 5'2\", so I will have it hemmed.",
        date: "2026-10-31",
      },
      {
        id: "r4",
        author: "Mehnaz H.",
        rating: 5,
        title: "My new favourite",
        body: "Dressed up with heels or down with a blazer. It has already become the piece I reach for first.",
        date: "2026-10-30",
      },
      {
        id: "r5",
        author: "Sadia I.",
        rating: 4,
        title: "Elegant and easy",
        body: "Very comfortable for a long evening. I would suggest sizing up if you are between sizes.",
        date: "2026-10-29",
      },
    ],
  },
  {
    id: "tailored-wool-blazer",
    slug: "tailored-wool-blazer",
    name: "Tailored Wool Blazer",
    category: "Tops",
    price: 3200,
    shortDescription:
      "A softly structured blazer with a clean shoulder and a relaxed, easy line.",
    description: [
      "Tailored from a wool-rich blend with a single-breasted front and a defined shoulder. The cut is relaxed through the body, so it layers easily over knits and dresses.",
      "Fully lined, with two front pockets and a back vent for ease of movement.",
    ],
    details: [
      "Single-breasted, two-button front",
      "Relaxed fit",
      "Two front pockets",
      "Fully lined",
    ],
    materials: "Shell: 70% wool, 30% polyester. Lining: 100% viscose.",
    care: CARE_TAILORED,
    images: views("Tailored Wool Blazer", [2, 3, 4]),
    colors: [
      {
        id: "ink",
        name: "Ink",
        swatch: "#292426",
        stock: { S: 2, M: 4, L: 3, XL: 1 },
      },
      {
        id: "camel",
        name: "Camel",
        swatch: "#A88B6B",
        stock: { S: 0, M: 2, L: 2, XL: 0 },
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Ishrat J.",
        rating: 5,
        title: "Perfect shoulder",
        body: "The structure is exactly right: sharp but not stiff. It works over everything in my wardrobe.",
        date: "2026-11-03",
      },
      {
        id: "r2",
        author: "Lamia S.",
        rating: 4,
        title: "Great quality",
        body: "Beautifully finished and well lined. The sleeves are a touch long, which suits the relaxed look.",
        date: "2026-10-27",
      },
      {
        id: "r3",
        author: "Nabila T.",
        rating: 5,
        title: "A real investment",
        body: "I wear it to work and out in the evening. The wool blend feels substantial without being heavy.",
        date: "2026-10-25",
      },
    ],
  },
  {
    id: "fine-knit-cardigan",
    slug: "fine-knit-cardigan",
    name: "Fine Knit Cardigan",
    category: "Tops",
    price: 1850,
    compareAtPrice: 2250,
    shortDescription:
      "A fine-gauge cardigan in a soft, lightweight knit for easy layering.",
    description: [
      "A lightweight cardigan knitted in a fine gauge with a soft handle and a subtle sheen. It sits relaxed through the body with neat ribbed trims.",
      "Button it up as a top, or wear it open over a slip dress or tailoring.",
    ],
    details: ["Fine-gauge knit", "Button front", "Relaxed fit", "Ribbed trims"],
    materials: "Knit: 55% viscose, 45% cotton.",
    care: CARE_KNIT,
    images: views("Fine Knit Cardigan", [3, 4, 5]),
    colors: [
      {
        id: "oat",
        name: "Oat",
        swatch: "#D8CBB8",
        stock: { XS: 4, S: 6, M: 5, L: 3, XL: 2 },
      },
      {
        id: "wine",
        name: "Wine",
        swatch: "#713849",
        stock: { XS: 1, S: 2, M: 0, L: 3, XL: 2 },
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Rumana P.",
        rating: 4,
        title: "Soft and light",
        body: "Lovely against the skin and light enough for air-conditioned rooms. The buttons are neat and sturdy.",
        date: "2026-10-20",
      },
      {
        id: "r2",
        author: "Afsana M.",
        rating: 5,
        title: "Goes with everything",
        body: "I bought it in oat and it works with every colour I own. Washed well on a gentle cycle too.",
        date: "2026-10-14",
      },
    ],
  },
  {
    id: "pleated-midi-skirt",
    slug: "pleated-midi-skirt",
    name: "Pleated Midi Skirt",
    category: "Bottoms",
    price: 1650,
    shortDescription:
      "A fluid pleated midi with a flattering high waist and beautiful movement.",
    description: [
      "Permanent knife pleats give this midi skirt a fluid, graceful swing. The high waist sits neatly and the length is made for flats, boots and heels alike.",
      "Pair it with a fine knit for daytime or a satin top for evening.",
    ],
    details: [
      "High waist with hidden zip",
      "Permanent knife pleats",
      "Midi length",
      "Lightly lined",
    ],
    materials: "Main fabric: 100% polyester. Lining: 100% polyester.",
    care: CARE_DELICATE,
    images: views("Pleated Midi Skirt", [4, 5, 6]),
    colors: [
      {
        id: "burgundy",
        name: "Burgundy",
        swatch: "#421C2A",
        stock: { XS: 2, S: 4, M: 4, L: 2, XL: 1 },
      },
      {
        id: "stone",
        name: "Stone",
        swatch: "#CFC4B5",
        stock: { XS: 0, S: 3, M: 3, L: 0, XL: 2 },
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Tahmina B.",
        rating: 5,
        title: "Wonderful movement",
        body: "The pleats hold their shape and the skirt moves beautifully when you walk. The waist fits true to size.",
        date: "2026-10-10",
      },
    ],
  },
  {
    id: "linen-blend-shirt",
    slug: "linen-blend-shirt",
    name: "Linen Blend Shirt",
    category: "Tops",
    price: 1950,
    shortDescription:
      "A relaxed shirt in a breathable linen blend with an easy, lived-in drape.",
    description: [
      "Cut in a breathable linen and cotton blend, this shirt has a relaxed shape, a classic collar and a soft, lived-in drape that improves with every wash.",
      "Wear it buttoned up, open over a knit top, or tucked into wide trousers.",
    ],
    details: [
      "Relaxed fit",
      "Classic collar",
      "Horn-effect buttons",
      "Slightly longer back hem",
    ],
    materials: "55% linen, 45% cotton.",
    care: CARE_LINEN,
    images: views("Linen Blend Shirt", [5, 6, 7]),
    colors: [
      {
        id: "ivory",
        name: "Ivory",
        swatch: "#EFE6D8",
        stock: { S: 0, M: 0, L: 0, XL: 0 },
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Samira Q.",
        rating: 4,
        title: "Breathable and crisp",
        body: "Perfect for hot days. It creases a little, as linen does, but it looks effortless.",
        date: "2026-09-02",
      },
      {
        id: "r2",
        author: "Jannat E.",
        rating: 4,
        title: "Easy everyday shirt",
        body: "The relaxed cut is flattering and the fabric softens beautifully after washing.",
        date: "2026-08-28",
      },
    ],
  },
  {
    id: "classic-midi-dress",
    slug: "classic-midi-dress",
    name: "Classic Midi Dress",
    category: "Dresses",
    price: 2850,
    shortDescription:
      "A considered midi dress with a defined waist and a graceful, easy skirt.",
    description: [
      "A fitted bodice and defined waist lead into a softly flared skirt that ends at the mid-calf. It is a quietly polished dress for the office, dinners and every occasion between.",
      "Finished with side pockets and a concealed back zip.",
    ],
    details: [
      "Fitted bodice with defined waist",
      "A-line skirt, midi length",
      "Side pockets",
      "Concealed back zip",
    ],
    materials:
      "Main fabric: 95% polyester, 5% elastane. Lining: 100% polyester.",
    care: CARE_DELICATE,
    images: views("Classic Midi Dress", [6, 7, 8]),
    colors: [
      {
        id: "burgundy",
        name: "Burgundy",
        swatch: "#421C2A",
        stock: { XS: 2, S: 3, M: 3, L: 1, XL: 0 },
      },
      {
        id: "ink",
        name: "Ink",
        swatch: "#292426",
        images: views("Classic Midi Dress in Ink", [8, 1, 2]),
        stock: { XS: 0, S: 4, M: 2, L: 2, XL: 2 },
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Maliha D.",
        rating: 5,
        title: "Instant classic",
        body: "The waist is beautifully defined and the pockets are a lovely surprise. I have already worn it three times.",
        date: "2026-11-06",
      },
      {
        id: "r2",
        author: "Shirin N.",
        rating: 5,
        title: "Flattering fit",
        body: "The skirt has just the right amount of flare. The fabric feels weighty and does not crease easily.",
        date: "2026-11-05",
      },
      {
        id: "r3",
        author: "Ayesha F.",
        rating: 4,
        title: "Lovely, true to size",
        body: "Fits as expected. I would love a petite length, but the midi hits well on me with heels.",
        date: "2026-11-03",
      },
      {
        id: "r4",
        author: "Rafia C.",
        rating: 5,
        title: "Polished and comfortable",
        body: "Perfect for long days at the office. It looks refined without feeling restrictive.",
        date: "2026-11-01",
      },
    ],
  },
  {
    id: "everyday-knit-top",
    slug: "everyday-knit-top",
    name: "Everyday Knit Top",
    category: "Tops",
    price: 1450,
    shortDescription:
      "A close-fitting fine knit that layers beautifully and wears every day.",
    description: [
      "A lightweight, close-fitting knit with a clean crew neckline and ribbed hem and cuffs. It is soft against the skin and sits neatly under jackets and cardigans.",
      "A true wardrobe foundation, made to be worn on repeat.",
    ],
    details: [
      "Close fit",
      "Crew neckline",
      "Ribbed hem and cuffs",
      "Lightweight knit",
    ],
    materials: "Knit: 50% viscose, 28% polyester, 22% nylon.",
    care: CARE_KNIT,
    images: views("Everyday Knit Top", [7, 8, 1]),
    colors: [
      {
        id: "ivory",
        name: "Ivory",
        swatch: "#EFE6D8",
        stock: { XS: 5, S: 6, M: 6, L: 4, XL: 3 },
      },
      {
        id: "champagne",
        name: "Champagne",
        swatch: "#C5A88A",
        stock: { XS: 2, S: 3, M: 1, L: 0, XL: 2 },
      },
      {
        id: "ink",
        name: "Ink",
        swatch: "#292426",
        stock: { XS: 4, S: 5, M: 5, L: 3, XL: 0 },
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Priya S.",
        rating: 4,
        title: "Great basic",
        body: "Soft, neat and easy to layer. The fit is close, so size up if you like a looser feel.",
        date: "2026-10-18",
      },
      {
        id: "r2",
        author: "Zara L.",
        rating: 3,
        title: "Good, but thin",
        body: "Nice colour and a clean neckline, though the knit is lighter than I expected. Best as a layering piece.",
        date: "2026-10-09",
      },
    ],
  },
  {
    id: "relaxed-wide-trousers",
    slug: "relaxed-wide-trousers",
    name: "Relaxed Wide Trousers",
    category: "Bottoms",
    price: 2250,
    shortDescription:
      "High-waisted trousers with a wide, fluid leg and an easy, relaxed drape.",
    description: [
      "A high waist and a wide, fluid leg create a long, elegant line. The fabric has a weighted drape that moves well and resists creasing.",
      "Style them with a fine knit and flats, or a tailored blazer and heels.",
    ],
    details: [
      "High waist with side zip",
      "Wide leg",
      "Two side pockets",
      "Ankle length",
    ],
    materials: "Main fabric: 65% polyester, 35% viscose.",
    care: CARE_DELICATE,
    images: views("Relaxed Wide Trousers", [8, 1, 2]),
    colors: [
      {
        id: "ink",
        name: "Ink",
        swatch: "#292426",
        stock: { XS: 3, S: 4, M: 5, L: 3, XL: 2 },
      },
      {
        id: "stone",
        name: "Stone",
        swatch: "#CFC4B5",
        stock: { XS: 1, S: 2, M: 3, L: 2, XL: 0 },
      },
    ],
    reviews: [],
  },

  {
    id: "linen-co-ord-set",
    slug: "linen-co-ord-set",
    name: "Linen Co-ord Set",
    category: "Co-ord Sets",
    price: 3450,
    shortDescription:
      "A relaxed two-piece linen blend set designed for effortless everyday elegance.",
    description: [
      "A thoughtfully coordinated two-piece set featuring a relaxed button-front shirt and matching wide-leg trousers. Crafted for an easy silhouette with a naturally refined feel.",
      "Wear the pieces together for a complete look or style them separately to create versatile everyday outfits.",
    ],
    details: [
      "Two-piece matching set",
      "Relaxed button-front shirt",
      "Wide-leg trousers",
      "Elasticated back waistband",
      "Relaxed silhouette",
    ],
    materials: "55% linen, 45% cotton.",
    care: CARE_LINEN,
    images: views("Linen Co-ord Set", [1, 5, 7]),
    colors: [
      {
        id: "ivory",
        name: "Ivory",
        swatch: "#EFE6D8",
        stock: { XS: 2, S: 4, M: 5, L: 3, XL: 2 },
      },
      {
        id: "stone",
        name: "Stone",
        swatch: "#CFC4B5",
        stock: { XS: 1, S: 3, M: 4, L: 2, XL: 1 },
      },
    ],
    reviews: [],
  },
  {
    id: "tailored-co-ord-set",
    slug: "tailored-co-ord-set",
    name: "Tailored Co-ord Set",
    category: "Co-ord Sets",
    price: 4250,
    shortDescription:
      "A softly structured matching set with refined tailoring and a modern feminine silhouette.",
    description: [
      "A coordinated tailored set featuring a beautifully structured blazer and matching straight-leg trousers. Clean lines and considered proportions create a polished, contemporary look.",
      "Designed to transition effortlessly from professional settings to evening occasions.",
    ],
    details: [
      "Two-piece tailored set",
      "Structured single-breasted blazer",
      "Matching straight-leg trousers",
      "Clean tailored finish",
      "Fully lined blazer",
    ],
    materials: "Shell: 70% polyester, 30% viscose. Lining: 100% polyester.",
    care: CARE_TAILORED,
    images: views("Tailored Co-ord Set", [2, 4, 6]),
    colors: [
      {
        id: "burgundy",
        name: "Burgundy",
        swatch: "#421C2A",
        stock: { XS: 2, S: 3, M: 4, L: 2, XL: 1 },
      },
      {
        id: "ink",
        name: "Ink",
        swatch: "#292426",
        stock: { XS: 1, S: 3, M: 3, L: 2, XL: 1 },
      },
    ],
    reviews: [],
  },
  {
    id: "satin-co-ord-set",
    slug: "satin-co-ord-set",
    name: "Satin Co-ord Set",
    category: "Co-ord Sets",
    price: 3850,
    shortDescription:
      "A fluid satin two-piece set with a graceful drape and understated evening appeal.",
    description: [
      "A beautifully coordinated satin set featuring a relaxed flowing shirt and matching wide-leg trousers. The fluid fabric catches the light subtly and moves with effortless grace.",
      "Wear together for an elevated evening look or pair each piece with wardrobe essentials.",
    ],
    details: [
      "Two-piece matching set",
      "Relaxed satin shirt",
      "Wide-leg matching trousers",
      "Soft fluid drape",
      "Concealed trouser fastening",
    ],
    materials: "100% polyester satin.",
    care: CARE_DELICATE,
    images: views("Satin Co-ord Set", [3, 6, 8]),
    colors: [
      {
        id: "champagne",
        name: "Champagne",
        swatch: "#C5A88A",
        stock: { XS: 2, S: 4, M: 3, L: 2, XL: 1 },
      },
      {
        id: "wine",
        name: "Wine",
        swatch: "#713849",
        stock: { XS: 1, S: 2, M: 3, L: 2, XL: 1 },
      },
    ],
    reviews: [],
  },
  {
    id: "knit-co-ord-set",
    slug: "knit-co-ord-set",
    name: "Knit Co-ord Set",
    category: "Co-ord Sets",
    price: 2950,
    shortDescription:
      "A soft matching knit set designed for relaxed days and effortless sophistication.",
    description: [
      "A coordinated fine-knit set featuring a softly fitted top and a matching flowing skirt. The lightweight texture and relaxed proportions make it an easy choice for comfortable, considered dressing.",
      "Style with minimal accessories for a quiet, refined everyday look.",
    ],
    details: [
      "Two-piece matching knit set",
      "Soft fine-gauge knit top",
      "Matching midi skirt",
      "Comfortable stretch finish",
      "Ribbed detailing",
    ],
    materials: "55% viscose, 45% cotton.",
    care: CARE_KNIT,
    images: views("Knit Co-ord Set", [4, 7, 2]),
    colors: [
      {
        id: "taupe",
        name: "Taupe",
        swatch: "#A49A89",
        stock: { XS: 2, S: 4, M: 4, L: 3, XL: 1 },
      },
      {
        id: "ivory",
        name: "Ivory",
        swatch: "#EFE6D8",
        stock: { XS: 1, S: 3, M: 4, L: 2, XL: 1 },
      },
    ],
    reviews: [],
  },
];

export const PRODUCT_BY_SLUG: ReadonlyMap<string, Product> = new Map(
  PRODUCTS.map((product) => [product.slug, product]),
);
