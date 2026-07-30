import { useRef } from "react";
import SkeletonCard from "./SkeletonCard";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import BookCard from "@/shared/components/common/BookCard";
import { useCardsAnimation } from "@/shared/animations/cards.animation";
import EmptyState from "./EmptyState";
import type { Book } from "@/features/books/types/book";
import type { WishlistBook } from "@/features/wishlist/types/wishlist";

interface GridProps {
  books: Book[] | WishlistBook[];
  isLoading?: boolean;
  skeletonCount?: number;
  parentType: "Main" | "Wishlist";
}
const Grid = ({
  books,
  isLoading = false,
  skeletonCount = 12,
  parentType = "Main",
}: GridProps) => {
  const navigate = useNavigate();
  const wishedIds = useAppSelector((state) => state.wishlist.wishlistBooks);
  const gridRef = useRef<HTMLDivElement>(null);
  useCardsAnimation({ sectionRef: gridRef, dependencies: [isLoading] });

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading)
    return (
      <div
        aria-busy="true"
        aria-label="Loading books"
        className={`grid place-content-center
      ${
        parentType === "Main"
          ? "grid-cols-[repeat(auto-fill,minmax(300px,1fr))]"
          : "grid-cols-[repeat(auto-fill,minmax(165px,1fr))]"
      }
      gap-x-4 gap-y-6
      sm:grid-cols-[repeat(auto-fill,minmax(170px,1fr))]
      `}
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} parentType={parentType} />
        ))}
      </div>
    );

  // ── Empty state ───────────────────────────────────────────────────────────
  if (books.length === 0)
    return parentType === "Main" ? (
      <EmptyState
        message="Oops! No books found for this filter."
        subMessage="Try changing your selection or explore other categories."
      />
    ) : (
      <EmptyState />
    );

  return (
    <div
      ref={gridRef}
      role="list"
      aria-label="Books"
      className={`grid place-content-center
      ${
        parentType === "Main"
          ? "grid-cols-[repeat(auto-fill,minmax(300px,1fr))]"
          : "grid-cols-[repeat(auto-fill,minmax(165px,1fr))]"
      }
      gap-x-4 gap-y-6
      sm:grid-cols-[repeat(auto-fill,minmax(170px,1fr))]
      `}
      // lg:grid-cols-[repeat(auto-fill,minmax(170px,1fr))]
      // xl:grid-cols-[repeat(auto-fill,minmax(170px,1fr))]
      // 2xl:grid-cols-4
    >
      {books.map((book) => (
        <div
          onClick={() => navigate(`/library/books/${book.id}`)}
          key={book.id}
        >
          <BookCard
            book={book as Book}
            parentType={parentType}
            isWished={
              wishedIds.findIndex((el: number) => el === book.id) === -1
                ? false
                : true
            }
          />
        </div>
      ))}
    </div>
  );
};

export default Grid;
