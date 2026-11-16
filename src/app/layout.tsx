import type { Metadata } from "next";
import "@fontsource-variable/noto-sans-kr";
import "./globals.css";
import { AppProvider } from "@/lib/state";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: {
    default: "행복한 완벽주의를 향하여 — 서울대생을 위한 완벽주의 유형 분석",
    template: "%s | 행복한 완벽주의",
  },
  description:
    "서울대생을 위한 완벽주의 유형 탐색과 자기이해. 나의 속도로 알아가고, 작은 실천을 기록해요.",
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
