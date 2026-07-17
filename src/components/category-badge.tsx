import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

const CATEGORY_CLASSES: Record<Category, string> = {
  KMX: "bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-400/10 dark:text-violet-300",
  KM: "bg-teal-50 text-teal-700 ring-teal-600/20 dark:bg-teal-400/10 dark:text-teal-300",
};

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        CATEGORY_CLASSES[category]
      )}
    >
      {category}
    </span>
  );
}
