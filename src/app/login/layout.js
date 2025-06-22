export default function LoginLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Login</title>
      </head>
      <body>
        <div className="login-layout">
          {children}
        </div>
      </body>
    </html>
  );
}