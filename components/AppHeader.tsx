"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AppHeader.module.css";

export default function AppHeader() {
  const pathname = usePathname();
  return (
    <header className={styles.header}>
      <span className={styles.logo}>Dalton Lab</span>
      <nav className={styles.nav}>
        <Link
          href="/"
          className={`${styles.navLink} ${pathname === "/" ? styles.active : ""}`}
        >
          Leads
        </Link>
        <Link
          href="/growth"
          className={`${styles.navLink} ${pathname === "/growth" ? styles.active : ""}`}
        >
          Growth Pack
        </Link>
      </nav>
    </header>
  );
}
