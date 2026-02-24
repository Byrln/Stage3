import {NextResponse} from "next/server";
import {processEmailQueue} from "@/lib/email/queue";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET || "";
  const header = request.headers.get("authorization") ?? "";

  const expectedHeader = `Bearer ${secret}`;

  if (!secret || header !== expectedHeader) {
    return new NextResponse("Unauthorized", {status: 401});
  }

  const result = await processEmailQueue();

  return NextResponse.json({
    processed: result.processed,
  });
}

