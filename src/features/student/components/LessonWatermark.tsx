import { useEffect, useState } from "react";
import type { WatermarkDto } from "@/features/admin/types/lesson.types";

interface LessonWatermarkProps {
  watermark: WatermarkDto;
}

const WATERMARK_POSITIONS = [
  { top: "7%", right: "2.5%" },
  { top: "45%", left: "2.5%" },
  { bottom: "18%", left: "2.5%" },
  { bottom: "18%", right: "2.5%" },
] as const;

const WATERMARK_POSITION_INTERVAL_MS = 12_000;

const LessonWatermark = ({ watermark }: LessonWatermarkProps) => {
  const [positionIndex, setPositionIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPositionIndex((index) => (index + 1) % WATERMARK_POSITIONS.length);
    }, WATERMARK_POSITION_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  const position = WATERMARK_POSITIONS[positionIndex];

  return (
    <div
      dir="ltr"
      aria-hidden="true"
      className="pointer-events-none absolute z-10 select-none transition-all duration-1000 ease-in-out"
      style={position}
    >
      <div className="max-w-44 rounded-md bg-black/50 px-2.5 py-1.5 text-[10px] font-bold leading-relaxed text-white [text-shadow:0_0_3px_rgba(0,0,0,0.75)] shadow-[0_1px_4px_rgba(0,0,0,0.35)] backdrop-blur-[2px] sm:max-w-48 sm:px-3 sm:py-2 sm:text-[11px] md:text-xs">
        <p className="truncate">{watermark.displayName}</p>
        <p className="truncate">Student ID: {watermark.studentId}</p>
        <p className="break-all">{watermark.maskedEmail}</p>
      </div>
    </div>
  );
};

export default LessonWatermark;
