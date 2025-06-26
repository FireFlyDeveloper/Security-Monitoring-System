import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const cookie = await cookies();
    const session = cookie.get("session");

    const { searchParams } = new URL(request.url);
    const currentPage = searchParams.get("page") || "1";
    const currentFilter = searchParams.get("filter") || "all";
    const currentDate = searchParams.get("date") || new Date().toISOString().split("T")[0]; // default to today

    const response = await fetch(`http://${process.env.API_URL}:8080/api/alerts/${currentPage}/${currentFilter}/${currentDate}`, {
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