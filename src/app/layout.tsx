import type { Metadata } from "next";
import "@fontsource-variable/noto-sans-kr";
import "./globals.css";
import { AppProvider } from "@/lib/state";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: {
    default: "행복한 완벽주의",
    template: "%s | 행복한 완벽주의",
  },
  description:
    "나를 이해하는 것부터, 나에게 맞는 하루를 만드는 것까지.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <AppProvider>
          <Shell>{children}</Shell>
        </AppProvider>
      </body>
    </html>
  );
}
