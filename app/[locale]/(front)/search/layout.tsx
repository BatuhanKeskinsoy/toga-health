export default async function ListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="container mx-auto px-4 lg:flex lg:gap-8 gap-4 mb-4 mt-12">
        <div className="w-full lg:max-w-1/4 mt-6 lg:mt-0">
          <aside className="w-full rounded-md transition-all duration-300">
            <div className="flex items-center justify-center bg-white h-80">
              Filter
            </div>
          </aside>
        </div>
        <div className="w-full lg:max-w-3/4">
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
