export default function SkeletonLoader() {
  return (
    <div className="w-full space-y-4">
      {Array(3)
        .fill('')
        .map((_, index) => (
          <div
            key={index}
            className="h-24 bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
    </div>
  );
}
