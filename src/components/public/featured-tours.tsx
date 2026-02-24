import {getCurrentTenant} from "@/lib/auth/tenant";
import {getTours} from "@/lib/db/queries/tours";
import {FeaturedToursClient} from "./featured-tours-client";

export async function FeaturedTours() {
  const tenant = await getCurrentTenant();

  if (!tenant) {
    return null;
  }

  const tours = await getTours(tenant.id);

  return <FeaturedToursClient tours={tours} />;
}
