import { Suspense } from "react";
import { EditHouseSkeleton } from "./editPageSkeleton";
import EditHousePageDetails from "./editPageDetails";

function EditPage({ params }) {
  return (
    <Suspense fallback={<EditHouseSkeleton />}>
      <EditHousePageDetails houseId={params.id} />
    </Suspense>
  );
}

export default EditPage;
