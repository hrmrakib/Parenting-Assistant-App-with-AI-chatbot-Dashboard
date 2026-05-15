const baseImg_url = process.env.NEXT_PUBLIC_IMAGE_URL;

export const getImageUrl = (path: string | undefined | null) => {
  if (!path) return "/images/placeholder.png"; // Your default placeholder
  if (path.startsWith("http")) return path; // Already a full URL
  return `${baseImg_url}${path}`;
};
