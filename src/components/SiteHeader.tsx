import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="心跳之间首页">
        <span className="brand-mark" aria-hidden="true" />
        心跳之间
      </Link>
      <nav className="site-nav" aria-label="主导航">
        <Link href="/select">预选阶段</Link>
        <Link href="/about">玩法</Link>
        <Link href="/legal">说明</Link>
      </nav>
    </header>
  );
}
