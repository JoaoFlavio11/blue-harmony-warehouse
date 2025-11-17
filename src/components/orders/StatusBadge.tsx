import { Badge } from "@/components/ui/badge";

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500 text-black",
  picking: "bg-purple-500 text-white",
  completed: "bg-green-500 text-white",
  cancelled: "bg-red-500 text-white",
};

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const style = statusStyles[normalized] || "bg-gray-500 text-white";

  return <Badge className={style}>{status}</Badge>;
}
