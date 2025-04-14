export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return  (
        <div className="flex items-center justify-center h-screen"> 
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-lg text-gray-500">Loading...</p>
        </div>
    );
  }