import { Heart } from "lucide-react";
import { useState } from "react";

interface FavoriteButtonProps {
  isFavorite?: boolean;
  onToggle?: () => Promise<void> | void;
  className?: string;
}

export function FavoriteButton({ isFavorite = false, onToggle, className }: FavoriteButtonProps) {
  const [isBusy, setIsBusy] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBusy) return;
    setIsBusy(true);
    try {
      await onToggle?.();
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isBusy}
      aria-label="Ajouter aux favoris"
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/80 text-rose-500 shadow-sm backdrop-blur transition hover:bg-white ${
        isFavorite ? "bg-white" : ""
      } ${className ?? ""}`}
    >
      <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
    </button>
  );
}
