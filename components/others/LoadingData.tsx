import React, { useMemo } from "react";

interface ILoadingDataProps {
  count?: number;
}

function LoadingData({ count }: ILoadingDataProps) {
  const elementsToRender = useMemo(() => {
    const maxCount = count ? Math.min(count, 5) : 1;
    return Array.from({ length: maxCount }, (_, index) => ({
      id: index,
      width: ["100%", "60%", "80%", "40%", "50%"][index] || "50%"
    }));
  }, [count]);

  return (
    <div className="flex flex-col gap-4 justify-between w-full h-full max-h-full overflow-hidden">
      {elementsToRender.map(({ id, width }) => (
        <div
          key={id}
          className="relative rounded-full h-5 bg-gray-200 overflow-hidden animate-pulse"
          style={{ width }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 opacity-50 animate-shine"></div>
        </div>
      ))}
    </div>
  );
}

export default React.memo(LoadingData);
