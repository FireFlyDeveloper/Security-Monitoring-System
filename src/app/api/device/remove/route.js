import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { ids } = await request.json();
    const cookie = await cookies();
    const session = cookie.get("session");
    const response = await fetch("http://localhost:8080/api/devices/delete-devices", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": session ? `Bearer ${session.value}` : "",
        },
        body: JSON.stringify({
            ids: [ ...ids ]
        })
    });

    if (!response.ok) {
        return NextResponse.json({ error: "Failed to add remove" }, { status: response.status });
    }

    return NextResponse.json({ message: "Devices removed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error checking authentication:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}