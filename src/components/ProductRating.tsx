import { ratingForProduct } from "@/lib/reviews";
import { StarIcon } from "./icons";

export default function ProductRating({ productId }: { productId: string }) {
  const rating = ratingForProduct(productId);
  if (!rating) return null;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5 text-rosegold-deep">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} width={13} height={13} className={i < Math.round(rating.average) ? "" : "text-line"} />
        ))}
      </div>
      <span className="text-[0.7rem] text-ink-soft">
        {rating.average.toFixed(1)}
      </span>
    </div>
  );
}
