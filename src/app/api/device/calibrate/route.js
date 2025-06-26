import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { mac } = await request.json();
    const cookie = await cookies();
    const session = cookie.get("session");
    const response = await fetch(`http://security.local:8080/api/position/update/${encodeURIComponent(mac)}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": session ? `Bearer ${session.value}` : "",
        }
    });

    if (!response.ok) {
        return NextResponse.json({ error: "Failed to calibrate device" }, { status: response.status });
    }

    return NextResponse.json({ message: "Devices removed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error checking authentication:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}