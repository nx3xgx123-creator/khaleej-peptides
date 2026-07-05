import ShopClient from "@/components/ShopClient";
import { Focus } from "@/lib/products";

const VALID: Focus[] = ["weightloss", "growth", "recovery", "antiaging", "wellness"];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ focus?: string }>;
}) {
  const { focus } = await searchParams;
  const initialFocus = focus && VALID.includes(focus as Focus) ? (focus as Focus) : undefined;
  return <ShopClient key={initialFocus ?? "all"} initialFocus={initialFocus} />;
}
