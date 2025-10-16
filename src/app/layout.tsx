import type { Metadata } from "next";
import "@/app/globals.css";
import Sidebar from "@/components/Sidebar";
import styles from "@/styles/layout.module.css";

export const metadata: Metadata = {
  title: "eun-blog",
  description: "개인 프로필"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className={styles.container}>
          <Sidebar />
          <main className={styles.main}>{children}</main>
        </div>
      </body>
    </html>
  );
}