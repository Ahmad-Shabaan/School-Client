import { toast } from "sonner";
import { forwardRef, useRef, useState } from "react";
import gsap from "gsap";
import { Heart } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import {
  useGetBasket,
  useUpdateBasket,
} from "@/features/basket/hooks/useBasket";
import type { BasketItem } from "@/features/basket/types";
import { useHandleToggleWishlist } from "@/features/wishlist/hooks/useWishlist";
import type { Book } from "@/features/books/types/book";
import useUser from "@/features/auth/hooks/useUser";

// ── forwardRef lets BookGrid's GSAP stagger target each card DOM node ──────
const BookCard = forwardRef<
  HTMLElement,
  {
    book: Book;
    isWished: boolean;
    parentType: "Main" | "Wishlist";
  }
>(({ book, isWished, parentType }, ref) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const toggleWishlist = useHandleToggleWishlist();
  const { updateOrRemoveBasketItem } = useUpdateBasket();
  const { user: me } = useUser();

  const { data: basket, isLoading } = useGetBasket(me?.id);

  // ── Wishlist button: quick GSAP scale punch on toggle ────────────────────
  const handleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({ bookId: book.id, isWished, page: parentType });
    if (btnRef.current) {
      gsap.fromTo(
        btnRef.current,
        { scale: 0.5 },
        { scale: 1, duration: 0.3, ease: "expo.inOut" },
      );
    }
  };

  const onAddToCart = async (
    bookId: number,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!me?.id || !basket) return;
    // let basket: BasketResponse | undefined;
    // try {
    //   basket = queryClient.getQueryData(BASKET_QUERY_KEYS);
    //   if (!basket) {
    //     setIsLoading(true);
    //     basket = await getBasket(basketId);
    //     setIsLoading(false);
    //   }
    let basketItem: BasketItem | undefined = basket.items?.find(
      (i: BasketItem) => i.id === bookId,
    );
    if (!basketItem) {
      basketItem = {
        id: bookId,
        title: book.title,
        price: book.price,
        quantity: 1,
        pictureUrl: book.imageUrl,
        author: book.author,
        publisher: book.publisher,
      };
      updateOrRemoveBasketItem({ basketItem, basketId: me.id });
    } else {
      toast.info(
        "You've already added this book to your basket. View your basket.",
      );
    }
    // } catch {
    //   setIsLoading(false);
    //   toast.error("Oops! We couldn’t update your cart. Please try again.");
    //   return;
    // }
  };

  return (
    <article
      ref={ref as React.Ref<HTMLElement>}
      className={`
        flex 
        ${parentType === "Main" ? "flex-row sm:flex-col" : "flex-col"}
        group cursor-pointer overflow-hidden rounded-none 
        bg-surface-container-low
        transition-all duration-400
        shadow-soft
        hover:-translate-y-2 
        hover:shadow-soft-dim
         `}
    >
      {/* ── Cover ─────────────────────────────────────── */}
      <div className="flex items-center w-full">
        <div className="relative w-full max-h-full aspect-auto sm:aspect-2/3  overflow-hidden">
          <img
            src={book.imageUrl}
            onLoad={() => setLoaded(true)}
            alt={`Cover of ${book.title}`}
            loading="lazy"
            className={`h-full w-full object-cover ${loaded ? "opacity-100" : "opacity-0"}`}
          />
          {!loaded && (
            <img
              src={"/book-wise.svg"}
              alt={`Cover of book`}
              className="abs-center size-14 animate-pulse duration-300  object-cover"
            />
          )}

          {/* Gradient overlay — always present for readability */}
          <div
            className="
          pointer-events-none absolute inset-0
          bg-linear-to-t from-black/60 via-transparent to-transparent
          group-hover:from-black/0
        "
          />
          {/* Wishlist overlay */}
          <div
            className="
          pointer-events-none absolute inset-0
          flex items-end justify-center p-4
          sm:opacity-0 transition-opacity duration-300
          group-hover:opacity-100
        "
          >
            <button
              ref={btnRef}
              onClick={(e) => handleWishlist(e)}
              aria-label={
                isWished
                  ? `Remove ${book.title} from wishlist`
                  : `Add ${book.title} to wishlist`
              }
              aria-pressed={isWished}
              className={`
              absolute z-10
              pointer-events-auto p-1.5 rounded-full
              border-2 
              transition-colors duration-200
              flex items-center justify-center
              ${isWished ? "border-error" : "border-on-surface"}
              ${isWished ? "bg-surface" : "bg-surface-bright/50 "}
              `}
            >
              <Heart
                // size={26}
                fill={`${isWished ? "#ff6e84" : "none"}`}
                className={` ${isWished ? "text-error" : "text-on-surface"} size-4 sm:size-5`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ── Info ──────────────────────────────────────── */}
      <div className="p-2 sm:p-1 relative space-y-1 w-full">
        <h3
          className="line-clamp-1
            flex-1 text-base sm:text-lg font-bold leading-snug
            text-on-surface
            transition-colors duration-200
            group-hover:text-primary
          "
        >
          {book.title}
        </h3>

        <p className="text-xs sm:text-sm text-on-surface-variant">
          by {book.author}
        </p>

        <p className="text-sm">⭐⭐⭐⭐⭐</p>
        <p className="total-price-span text-on-surface group-hover:text-primary text-xl">
          {formatCurrency(book.price)}{" "}
          <span className="currency-span text-[10px] sm:text-xs">EGP</span>
        </p>
        {parentType === "Main" && (
          <>
            <p className="sm:hidden text-xs sm:text-sm text-on-surface tracking-wide font-medium">
              {book.genre}
            </p>

            <p className="sm:hidden text-xs text-on-surface-variant line-clamp-6">
              {book.description}
            </p>
            <hr className="sm:hidden" />
            <p className="sm:hidden text-xs sm:text-sm text-on-surface-variant tracking-wide font-medium">
              Copies in library: {book.totalCopies}
            </p>
            <p className="sm:hidden text-xs sm:text-sm text-on-surface-variant tracking-wide font-medium">
              Available today: {book.availableCopies}
            </p>
            <div className="sm:hidden flex justify-center">
              <button
                onClick={(e) => onAddToCart(book.id, e)}
                className="btn-primary py-1.5 text-xs group mt-2 shadow-soft font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <img
                    src="/icons/add-to-cart.webp"
                    alt="add-to-cart"
                    className="w-6 h-6  animate-[shift-x_2s_ease-in-out_infinite]"
                  />
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </article>
  );
});

export default BookCard;
