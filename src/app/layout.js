import { AuthProvider } from "../utils/auth";

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <head>
          <title>Security Monitoring System</title>
        </head>
        <body>
          <div>
            {children}
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
