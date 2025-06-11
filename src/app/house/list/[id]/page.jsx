import { Suspense } from "react";
import HouseDetailsContent from "./houseDetails";
import HouseDetailsSkeleton from "./houseSkeleton";

function HouseDetailsPage({ params }) {
  return (
    <Suspense fallback={<HouseDetailsSkeleton />}>
      <HouseDetailsContent id={params.id} />
    </Suspense>
  );
}

export default HouseDetailsPage;
