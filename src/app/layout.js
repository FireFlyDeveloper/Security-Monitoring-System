export default function RootLayout({ children }) {
  return (
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
  );
}
