import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, mac } = await request.json();
    const cookie = await cookies();
    const session = cookie.get("session");
    const response = await fetch(`http://${process.env.API_URL}:8080/api/devices/update-devices`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": session ? `Bearer ${session.value}` : "",
        },
        body: JSON.stringify({
            devices: [
                {
                    name,
                    mac,
                }
            ]
        })
    });

    if (!response.ok) {
        return NextResponse.json({ error: "Failed to add device" }, { status: response.status });
    }

    const device = await response.json();

    return NextResponse.json({ device }, { status: 200 });
  } catch (error) {
    console.error("Error checking authentication:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}