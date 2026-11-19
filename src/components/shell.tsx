"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Heart,
  Home,
  LayoutGrid,
  Menu,
  NotebookPen,
  Sprout,
  Sun,
  X,
} from "lucide-react";
import { BrandMark } from "./illustrations";
import { RestTimer } from "./rest-timer";
import { SaveStatus } from "./ui";

const navigation = [
  { href: "/", label: "나의 작은 출발", icon: Home },
  { href: "/test", label: "나의 완벽주의 테스트", icon: LayoutGrid },
  { href: "/types", label: "네 가지 완벽주의", icon: BookOpen },
  { href: "/practice", label: "안정형으로 한 걸음", icon: Sprout },
  { href: "/about-me", label: "나를 알아가는 시간", icon: Heart },
  { href: "/journal", label: "기록하며 실천하기", icon: NotebookPen },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const recordPage = ["/journal", "/practice", "/about-me", "/privacy"].some(
    (path) => pathname.startsWith(path),
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const sidebar = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const returnFocus = menuButton.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() =>
      sidebar.current?.querySelector<HTMLAnchorElement>("a")?.focus(),
    );
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && !document.querySelector("dialog[open]"))
        setMenuOpen(false);
    };
    document.addEventListener("keydown", escape);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", escape);
      document.body.style.overflow = previousOverflow;
      returnFocus?.focus();
    };
  }, [menuOpen]);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 721px)");
    const closeOnDesktop = () => {
      if (query.matches) setMenuOpen(false);
    };
    query.addEventListener("change", closeOnDesktop);
    return () => query.removeEventListener("change", closeOnDesktop);
  }, []);
  const menuKeys = (event: KeyboardEvent<HTMLElement>) => {
    if (!menuOpen) return;
    if (event.key !== "Tab") return;
    const items = sidebar.current?.querySelectorAll<HTMLElement>(
      "a[href], button:not(:disabled)",
    );
    if (!items?.length) return;
    const first = items[0],
      last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    }
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  const active = navigation.find((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  );
  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        본문으로 건너뛰기
      </a>
      {menuOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="메뉴 닫기"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside
        ref={sidebar}
        className={`sidebar ${menuOpen ? "open" : ""}`}
        role={menuOpen ? "dialog" : undefined}
        aria-modal={menuOpen || undefined}
        aria-label="사이트 메뉴"
        onKeyDown={menuKeys}
      >
        <Link href="/" className="brand" onClick={() => setMenuOpen(false)}>
          <BrandMark />
          <span>
            행복한 완벽주의<small>조금 더 나다운, 조금 더 편안한</small>
          </span>
        </Link>
        <button
          className="mobile-menu-close icon-button"
          aria-label="메뉴 닫기"
          onClick={() => setMenuOpen(false)}
        >
          <X />
        </button>
        <div className="nav-caption">나를 위한 작은 여정</div>
        <nav aria-label="주요 메뉴">
          {navigation.map(({ href, label, icon: Icon }) => {
            const selected =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`nav-link ${selected ? "active" : ""} ${href === "/journal" ? "journal-link" : ""}`}
                aria-current={selected ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={19} strokeWidth={1.7} />
                <span>{label}</span>
                {href === "/journal" && <span className="nav-dot" />}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <RestTimer />
          <div className="sidebar-note">
            <span className="little-line" />
            완벽하지 않아도,
            <br />
            충분히 괜찮은 우리.
          </div>
          <Link
            href="/privacy"
            className="privacy-link"
            onClick={() => setMenuOpen(false)}
          >
            저장·백업 및 개인정보 <ArrowUpRight size={13} />
          </Link>
        </div>
      </aside>
      <div className="main-shell" inert={menuOpen}>
        <header className="topbar">
          <div className="breadcrumb">
            <button
              ref={menuButton}
              className="mobile-menu-button icon-button"
              aria-label="메뉴 열기"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={22} />
            </button>
            <span className="breadcrumb-home">나를 위한 공간</span>
            <ChevronRight size={13} />
            <span>{active?.label ?? "기록과 개인정보"}</span>
          </div>
          <div className="topbar-message">
            {recordPage ? (
              <SaveStatus />
            ) : (
              <>
                <Sun size={17} />
                오늘도, 나의 속도로
              </>
            )}
          </div>
        </header>
        <main id="main" className="main-content" tabIndex={-1}>
          {children}
        </main>
        <footer className="footer">
          <span>행복한 완벽주의를 향하여</span>
          <p>
            대학생들을 위한 자기이해•성장 프로젝트. 서울대학교 사범대학 과목{" "}
            &lt;협력과 성장&gt;에서 제작한 사이트입니다
          </p>
          <Link href="/privacy">개인정보 안내</Link>
        </footer>
      </div>
    </div>
  );
}
