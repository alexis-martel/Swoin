import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionCookieName, verifySessionToken } from "@/lib/session";
import { getUserById, transferBalance } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(getSessionCookieName())?.value;
    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { recipientId, amount } = (await request.json()) as {
      recipientId?: number;
      amount?: number;
    };

    if (!recipientId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid transfer" }, { status: 400 });
    }

    if (recipientId === session.userId) {
      return NextResponse.json({ error: "Cannot send to yourself" }, { status: 400 });
    }

    const recipient = await getUserById(recipientId);
    if (!recipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    const result = await transferBalance(session.userId, recipientId, amount);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Transfer failed" }, { status: 500 });
  }
}
