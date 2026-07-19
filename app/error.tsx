"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="page-shell empty-state" role="alert">
      <span className="empty-orbit" aria-hidden="true" />
      <p className="eyebrow">暂时迷失了方向</p>
      <h1>这片星轨暂时没有连上</h1>
      <p>你的本机选择不会因为这个页面消失。</p>
      <button className="button button-primary" type="button" onClick={reset}>再试一次</button>
    </div>
  );
}
