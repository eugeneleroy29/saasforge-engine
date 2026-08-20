import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SaaSForge Engine — Multi-Tenant AI SaaS & Token Metering Starter',
  description: 'Production-ready AI SaaS monetization dashboard with token quotas, role switcher, tier paywalls, and developer API key management.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}