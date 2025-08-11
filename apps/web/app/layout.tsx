import "./globals.css";

export const metadata = { title: 'Price Tracker', description: 'Ultimate price tracker starter' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}