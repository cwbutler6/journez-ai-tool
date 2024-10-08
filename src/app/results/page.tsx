import ShowResults from "@/components/ShowResults";

export default function SearchResults({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { categories='', location, numberOfLocations } = searchParams;
  const categoriesArray = categories ? (categories as string).split(',') : [];
  return (
    <div className="flex flex-row p-[20px] grow">
      <ShowResults categories={categoriesArray} location={location as string} numberOfLocations={Number(numberOfLocations)} />
    </div>
  );
}
