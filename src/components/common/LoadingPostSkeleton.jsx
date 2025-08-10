export default function LoadingPostSkeleton() {
  return (
    <div className="border border-gray-200 rounded-md p-4 animate-pulse space-y-4 max-w-[600px] mx-auto">
      <div className="flex space-x-3 items-center">
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
        <div className="flex-1 h-4 bg-gray-300 rounded" />
      </div>
      <div className="w-full h-[300px] bg-gray-300 rounded" />
      <div className="h-4 w-1/2 bg-gray-300 rounded" />
      <div className="h-4 w-3/4 bg-gray-300 rounded" />
    </div>
  );
}
