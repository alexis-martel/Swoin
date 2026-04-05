import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionCookieName, verifySessionToken } from "@/lib/session";
import { searchUsers } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(getSessionCookieName())?.value;
    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";
    if (q.length < 2) {
      return NextResponse.json({ users: [] });
    }

    const results = await searchUsers(q, session.userId);
    return NextResponse.json({ users: results });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
