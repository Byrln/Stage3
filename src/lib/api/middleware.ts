import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import {auth} from "../../../auth";
import type {Role} from "@prisma/client";

type ApiHandlerContext = {
  request: NextRequest;
  tenantId: string;
  userId: string;
};

type ApiHandler = (context: ApiHandlerContext) => Promise<Response>;

export function withAuth(handler: ApiHandler, requiredRoles?: Role[]) {
  return async function handle(request: NextRequest) {
    const session = await auth();
    const user = session?.user as any;

    if (!user?.id || !user.tenantId) {
      return new NextResponse("Unauthorized", {status: 401});
    }

    if (requiredRoles && !requiredRoles.includes(user.role as Role)) {
      return new NextResponse("Forbidden", {status: 403});
    }

    return handler({
      request,
      tenantId: user.tenantId as string,
      userId: user.id as string,
    });
  };
}
