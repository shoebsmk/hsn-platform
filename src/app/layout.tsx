import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomTabBar from "@/components/layout/BottomTabBar";
import { createClient } from "@/lib/supabase/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Halal Success Network",
  description: "Connecting the Ummah with trusted halal opportunities for income, employment, business, learning, and community growth.",
  viewport: "width=device-width, initial-scale=1",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, is_admin')
      .eq('id', user.id)
      .single()
    profile = data
  }

  const navUser = user
    ? { email: user.email, full_name: profile?.full_name ?? undefined, is_admin: profile?.is_admin ?? false }
    : null

  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar user={navUser} />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
        <BottomTabBar user={navUser} />
      </body>
    </html>
  );
}
