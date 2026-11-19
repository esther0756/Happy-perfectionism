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
  description: "조금 더 나다운, 조금 더 편안한",
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
