import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ScanDetailLoading() {
  return (
    <div className="flex flex-col space-y-8 pb-10">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <Skeleton className="h-4 w-32 bg-[#222222] mb-3" />
          <Skeleton className="h-8 w-64 bg-[#222222]" />
          <div className="flex items-center space-x-4 mt-3">
            <Skeleton className="h-6 w-6 rounded-full bg-[#222222]" />
            <Skeleton className="h-4 w-24 bg-[#222222]" />
            <Skeleton className="h-4 w-4 rounded-full bg-[#222222]" />
            <Skeleton className="h-4 w-24 bg-[#222222]" />
          </div>
        </div>
        <Skeleton className="h-10 w-32 bg-[#222222] rounded-md" />
      </div>

      {/* Main Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#161616] border-[#222222] col-span-1 md:col-span-1 shadow-none">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24 bg-[#222222]" />
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Skeleton className="h-32 w-32 rounded-full bg-[#222222]" />
          </CardContent>
        </Card>
        
        <Card className="bg-[#161616] border-[#222222] col-span-1 md:col-span-3 shadow-none">
          <CardHeader>
            <Skeleton className="h-5 w-40 bg-[#222222]" />
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="flex flex-col space-y-2">
                   <Skeleton className="h-4 w-16 bg-[#222222]" />
                   <Skeleton className="h-8 w-12 bg-[#222222]" />
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Vuln Cards Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-6 w-48 bg-[#222222]" />
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-[#161616] border-[#222222] shadow-none">
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-5 w-1/3 bg-[#222222]" />
                <div className="flex space-x-2">
                  <Skeleton className="h-6 w-16 bg-[#222222] rounded-full" />
                  <Skeleton className="h-6 w-24 bg-[#222222] rounded-full" />
                </div>
              </div>
              <Skeleton className="h-4 w-64 bg-[#222222]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-20 w-full bg-[#222222]" />
                <Skeleton className="h-32 w-full bg-[#222222]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
