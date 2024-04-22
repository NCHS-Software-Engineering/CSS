export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#000000" />
            <meta
            name="description"
            content="CSS Next.js version"
            />
            <title>CSS Admin</title>
        </head>
        <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root">{children}</div>
        </body>
        </html>
    )
  }