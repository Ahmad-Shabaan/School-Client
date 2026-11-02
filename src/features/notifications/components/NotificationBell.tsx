import { Bell } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import NotificationPanel, {
  type NotificationVariant,
} from "./NotificationPanel";
import NotificationForm from "./NotificationForm";
import { useUnreadNotificationsCount } from "../hooks/useNotifications";
import { MAX_BADGE_COUNT } from "../constants/notification.constants";

interface NotificationBellProps {
  /** Contextual theme: `admin` matches the admin navbar tokens, `student` keeps the teal design system. */
  variant?: NotificationVariant;
}

const BELL_STYLES: Record<
  NotificationVariant,
  { button: string; badge: string }
> = {
  student: {
    button:
      "group relative flex size-10 items-center justify-center rounded-[10px] border border-line bg-paper text-teal-dark transition-all duration-200 hover:border-gold hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
    badge:
      "absolute -top-1 -left-1 flex min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-gold px-1 text-[11px] font-bold leading-[16px] text-white",
  },
  admin: {
    // Matches the neighboring navbar action buttons (logout = h-9 w-9) and the
    // admin token system instead of the student teal/gold palette.
    button:
      "relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
    badge:
      "absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground ring-2 ring-background z-10",
  },
};

const PANEL_WIDTH = 360;
const PANEL_GAP = 8;
const PANEL_EDGE_MARGIN = 8;
const MOBILE_PANEL_TOP = 72;
const MOBILE_QUERY = "(max-width: 639px)";

type PanelPlacement =
  | { mode: "mobile" }
  | { mode: "desktop"; x: number; y: number };

/**
 * Measures the bell button at open time. The panel is a fixed-position
 * overlay, so its coordinates must come from the viewport-absolute
 * `getBoundingClientRect()`, clamped inside the viewport so it never
 * overflows on desktop.
 */
const computePanelPlacement = (bell: HTMLElement): PanelPlacement => {
  // jsdom (tests) has no matchMedia; fall back to the desktop anchor path.
  const isMobile = window.matchMedia?.(MOBILE_QUERY)?.matches ?? false;
  if (isMobile) return { mode: "mobile" };

  const rect = bell.getBoundingClientRect();
  const x = Math.max(
    PANEL_EDGE_MARGIN,
    Math.min(rect.left, window.innerWidth - PANEL_WIDTH - PANEL_EDGE_MARGIN),
  );
  return { mode: "desktop", x, y: rect.bottom + PANEL_GAP };
};

const getPanelStyle = (placement: PanelPlacement): CSSProperties =>
  placement.mode === "mobile"
    ? {
        left: PANEL_EDGE_MARGIN,
        right: PANEL_EDGE_MARGIN,
        top: MOBILE_PANEL_TOP,
      }
    : { left: placement.x, top: placement.y, width: PANEL_WIDTH };

const NotificationBell = ({
  variant = "student",
}: NotificationBellProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  // Owned here (not inside the panel) so the create-notification Sheet's
  // lifecycle is independent from the ephemeral panel: the panel's outside
  // press handler only knows about the bell wrapper and the panel portal,
  // and Radix portals the Sheet to <body> as a separate subtree.
  const [isFormOpen, setIsFormOpen] = useState(false);
  // Computed once per open, in the click handler — never inside an effect —
  // so there is no synchronous setState-in-effect render cascade.
  const [placement, setPlacement] = useState<PanelPlacement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { data } = useUnreadNotificationsCount(true);
  const unreadCount = data?.data ?? 0;

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
      return;
    }
    const bell = containerRef.current?.querySelector("button");
    setPlacement(
      bell
        ? computePanelPlacement(bell)
        : ({
            mode: "desktop",
            x: 0,
            y: MOBILE_PANEL_TOP,
          } satisfies PanelPlacement),
    );
    setIsOpen(true);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        close();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // When the create-notification Sheet is open, Escape belongs to it
      // (Radix handles its dismissal), so don't yank the panel as well.
      if (event.key === "Escape" && !isFormOpen) close();
    };

    // Resizing invalidates the captured coordinates, so closing (instead of
    // re-measuring) keeps the panel anchored without extra layout work.
    const handleResize = () => close();

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, isFormOpen, close]);

  const styles = BELL_STYLES[variant];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="الإشعارات"
        aria-expanded={isOpen}
        onClick={toggle}
        className={styles.button}
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className={styles.badge}>
            {unreadCount > MAX_BADGE_COUNT
              ? `${MAX_BADGE_COUNT}+`
              : unreadCount}
          </span>
        )}
      </button>

      {isOpen &&
        placement &&
        createPortal(
          <>
            {/* Full-screen click-catcher; invisible by design so it never
                tints the page — it only captures outside clicks. */}
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              className="fixed inset-0 z-[90] cursor-default"
              onClick={close}
            />
            {/* Portaled to <body> so the panel lives above every page
                section/navigation stacking context (navbar is sticky z-40;
                nested panels could be painted over by page content). */}
            <div
              ref={panelRef}
              style={getPanelStyle(placement)}
              className="fixed z-[100]"
            >
              <NotificationPanel
                onClose={close}
                variant={variant}
                onCreateClick={
                  variant === "admin" ? () => setIsFormOpen(true) : undefined
                }
              />
            </div>
          </>,
          document.body,
        )}

      {/* Mounted at bell level (outside the panel portal) so it survives
          the panel closing; hidden entirely for the student variant. */}
      {variant === "admin" && (
        <NotificationForm
          variant={variant}
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
        />
      )}
    </div>
  );
};

export default NotificationBell;
