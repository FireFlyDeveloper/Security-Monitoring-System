import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookie = await cookies();
    const session = cookie.get("session");
    const response = await fetch("http://security.local:8080/api/devices", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": session ? `Bearer ${session.value}` : "",
        },
    });

    if (!response.ok) {
        return NextResponse.json({ error: "Failed to fetch devices" }, { status: response.status });
    }

    const devices = await response.json();

    return NextResponse.json({ devices }, { status: 200 });
  } catch (error) {
    console.error("Error checking authentication:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}