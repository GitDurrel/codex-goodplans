/**
 * Helper simple pour optimiser les images Supabase
 */

export function optimizeImage(
  imageUrl: string | undefined | null,
  width: number = 400,
  quality: number = 80
): string {
  if (!imageUrl) {
    return "https://placehold.co/600x400?text=Annonce";
  }

  if (!imageUrl.includes('supabase.co/storage')) {
    return imageUrl;
  }

  try {
    const url = new URL(imageUrl);
    url.searchParams.set('width', width.toString());
    url.searchParams.set('quality', quality.toString());
    url.searchParams.set('format', 'webp');
    return url.toString();
  } catch (error) {
    console.warn('Erreur optimisation image:', error);
    return imageUrl;
  }
}

export function getOptimizedListingImage(listing: { images?: string[] }): string {
  const firstImage = listing.images?.[0];
  return optimizeImage(firstImage, 400, 80);
}