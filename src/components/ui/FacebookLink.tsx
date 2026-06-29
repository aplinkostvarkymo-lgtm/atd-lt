import { cn } from "@/lib/utils";

export const FACEBOOK_URL = "https://www.facebook.com/RoberasATD.LT";

export function FacebookLink({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <a
      href={FACEBOOK_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Facebook"
      className={cn("inline-flex items-center transition-colors", className)}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className={cn("w-5 h-5", iconClassName)}>
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54v-2.891h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.476h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.891h-2.33V21.88C18.343 21.128 22 16.991 22 12z" />
      </svg>
    </a>
  );
}
