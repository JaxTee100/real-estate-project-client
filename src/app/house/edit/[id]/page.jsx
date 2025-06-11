import { Suspense } from "react";
import EditHouseDetailsSkeleton from "./editPageSkeleton";
import EditHousePageDetails from "./editPageDetails";

function EditPage({ params }) {
  return (
    <Suspense fallback={<EditHouseDetailsSkeleton />}>
      <EditHousePageDetails houseId={params.id} />
    </Suspense>
  );
}

export default EditPage;
