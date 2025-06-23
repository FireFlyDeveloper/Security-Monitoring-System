export default function DashboardLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <title>Dashboard</title>
            </head>
            <body>
                <div>
                    {children}
                </div>
            </body>
        </html>
    );
}