export const metadata = { title: 'Price Tracker', description: 'Ultimate price tracker starter' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: 'black', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}