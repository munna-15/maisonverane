export interface EditorialCollection {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly productSlugs: readonly string[];
  readonly featured?: boolean;
}

export const EDITORIAL_COLLECTIONS: readonly EditorialCollection[] = [
  {
    id: "the-dress-edit",
    slug: "the-dress-edit",
    title: "The Dress Edit",
    subtitle: "Made for the moments that matter",
    description:
      "Discover graceful silhouettes, fluid fabrics and timeless dresses designed to make every occasion feel special.",
    image: "/images/collections/collection-01.jpg",
    imageAlt: "The Dress Edit fashion campaign",
    productSlugs: ["satin-slip-dress", "classic-midi-dress"],
    featured: true,
  },
  {
    id: "everyday-essentials",
    slug: "everyday-essentials",
    title: "Everyday Essentials",
    subtitle: "The art of everyday dressing",
    description:
      "Thoughtful wardrobe foundations and versatile pieces designed to become part of your everyday rhythm.",
    image: "/images/collections/collection-02.jpg",
    imageAlt: "Everyday Essentials fashion campaign",
    productSlugs: [
      "fine-knit-cardigan",
      "everyday-knit-top",
      "linen-blend-shirt",
    ],
  },
  {
    id: "modern-tailoring",
    slug: "modern-tailoring",
    title: "Modern Tailoring",
    subtitle: "A new perspective on structure",
    description:
      "Clean lines, relaxed proportions and timeless structure come together in a collection made for modern sophistication.",
    image: "/images/collections/collection-08.avif",
    imageAlt: "Modern Tailoring fashion campaign",
    productSlugs: [
      "tailored-wool-blazer",
      "relaxed-wide-trousers",
      "pleated-midi-skirt",
    ],
  },
  {
    id: "occasion-dressing",
    slug: "occasion-dressing",
    title: "Occasion Dressing",
    subtitle: "An invitation to feel exceptional",
    description:
      "Elegant pieces for celebrations, evenings and the moments worth dressing up for.",
    image: "/images/collections/collection-04.avif",
    imageAlt: "Occasion Dressing fashion campaign",
    productSlugs: ["satin-slip-dress", "classic-midi-dress"],
  },
  {
    id: "soft-layers",
    slug: "soft-layers",
    title: "Soft Layers",
    subtitle: "Comfort in considered form",
    description:
      "Lightweight knits and effortless layers bring softness and versatility to a considered wardrobe.",
    image: "/images/collections/collection-05.avif",
    imageAlt: "Soft Layers fashion campaign",
    productSlugs: ["fine-knit-cardigan", "everyday-knit-top"],
  },
  {
    id: "refined-separates",
    slug: "refined-separates",
    title: "Refined Separates",
    subtitle: "Pieces that work beautifully together",
    description:
      "Build a wardrobe of beautifully balanced separates, from fluid skirts to relaxed everyday tailoring.",
    image: "/images/collections/collection-06.avif",
    imageAlt: "Refined Separates fashion campaign",
    productSlugs: [
      "pleated-midi-skirt",
      "relaxed-wide-trousers",
      "linen-blend-shirt",
    ],
  },
  {
    id: "wardrobe-foundations",
    slug: "wardrobe-foundations",
    title: "Wardrobe Foundations",
    subtitle: "The pieces you return to",
    description:
      "Versatile essentials with thoughtful details, made to bring ease and intention to everyday dressing.",
    image: "/images/collections/collection-07.avif",
    imageAlt: "Wardrobe Foundations fashion campaign",
    productSlugs: [
      "everyday-knit-top",
      "fine-knit-cardigan",
      "relaxed-wide-trousers",
    ],
  },
  {
    id: "statement-pieces",
    slug: "statement-pieces",
    title: "Statement Pieces",
    subtitle: "Quietly confident, unmistakably individual",
    description:
      "Distinctive silhouettes and considered designs that bring personality to a modern wardrobe.",
    image: "/images/collections/collection-03.jpg",
    imageAlt: "Statement Pieces fashion campaign",
    productSlugs: [
      "satin-slip-dress",
      "tailored-wool-blazer",
      "pleated-midi-skirt",
    ],
  },
];

export const COLLECTION_BY_SLUG = new Map(
  EDITORIAL_COLLECTIONS.map((collection) => [collection.slug, collection]),
);
