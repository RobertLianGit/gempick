export function NonOfficialNotice({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={compact ? "notice notice-compact" : "notice"}>
      <span className="notice-star" aria-hidden="true">✦</span>
      <div>
        <strong>非官方粉丝项目｜与艺人本人及相关团队不存在隶属或授权关系</strong>
        {!compact && (
          <p>不代表艺人、工作室或唱片公司立场，不提供音频、歌词、封面或官方排名。</p>
        )}
      </div>
    </aside>
  );
}
