import type { ReactNode } from "react";
import styles from "./PageLayout.module.css";

interface PageLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  sidebarFirstOnMobile?: boolean;
}

export function PageLayout({
  children,
  sidebar,
  sidebarFirstOnMobile = false,
}: PageLayoutProps) {
  return (
    <div
      className={`${styles.layout} ${
        sidebarFirstOnMobile ? styles.sidebarFirstMobile : ""
      }`}
    >
      <div className={styles.content}>{children}</div>

      {sidebar && <aside className={styles.sidebar}>{sidebar}</aside>}
    </div>
  );
}
