import { NotFoundContent } from "@/components/NotFoundContent";

export const metadata = { title: "404 | ATD", robots: { index: false, follow: true } };
export default function MissingPage() { return <NotFoundContent />; }
