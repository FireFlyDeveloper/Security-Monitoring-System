import Link from "next/link";
import "./globals.css";

export default function Home() {
  return (
    <div>
      <h1>Security Monitoring System</h1>
      <p>Welcome to the Security Monitoring System. Please log in to continue. <a href="/login">Login</a></p>
    </div>
  )
}
