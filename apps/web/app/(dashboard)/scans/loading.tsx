import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ScansLoading() {
  return (
    <div className="flex flex-col space-y-6">
      <div>
        <Skeleton className="h-8 w-48 bg-[#222222]" />
        <Skeleton className="h-4 w-72 bg-[#222222] mt-2" />
      </div>
      <Card className="bg-[#161616] border-[#222222] shadow-none">
        <CardHeader>
           <Skeleton className="h-5 w-40 bg-[#222222]" />
        </CardHeader>
        <CardContent>
           <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full bg-[#222222] rounded-md" />
            ))}
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
