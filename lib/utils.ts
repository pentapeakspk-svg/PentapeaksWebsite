type ClassValue = string | number | boolean | undefined | null | ClassValue[]

function clsx(...inputs: ClassValue[]): string {
  return inputs
    .flat()
    .filter((x) => typeof x === "string" && x.trim() !== "")
    .join(" ")
}

export function cn(...inputs: ClassValue[]) {
  return clsx(...inputs)
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDateShort(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-")
}

export function generateRollNo(batchNo: string, studentCount: number): string {
  const num = (studentCount + 1).toString().padStart(3, "0")
  return `${batchNo}-${num}`
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + "..."
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const categories = [
  { slug: "rice", name: "Rice", icon: "Wheat" },
  { slug: "fresh-fruits-and-vegetables", name: "Fresh Fruits and Vegetables", icon: "Carrot" },
  { slug: "meat", name: "Meat & Poultry", icon: "Beef" },
  { slug: "grains", name: "Grains & Corn", icon: "Grain" },
  { slug: "animal-feed", name: "Animal Feed", icon: "Leaf" },
  { slug: "seeds", name: "Spices & Seeds", icon: "Sprout" },
  { slug: "fruits", name: "Fruits", icon: "Apple" },
  { slug: "vegetables", name: "Vegetables", icon: "Carrot" },
  { slug: "supplements", name: "Shilajit", icon: "Leaf" },
  { slug: "gloves", name: "Gloves", icon: "Package" },
  { slug: "salt-lamps", name: "Salt Lamps", icon: "Package" },
  { slug: "sports-goods-and-apparel", name: "Sports Goods And Apparel", icon: "Package" },
] as const

export type CategorySlug = (typeof categories)[number]["slug"]

export const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]
