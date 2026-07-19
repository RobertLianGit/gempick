import Link from "next/link";

export const metadata = { title: "关于这个非官方发起的粉丝项目" };

export default function LegalPage() {
  return (
    <div className="page-shell prose-page legal-page">
      <header className="flow-header"><p className="eyebrow">说明与边界</p><h1>关于这个非官方发起的粉丝项目</h1><p>尊重作品，也尊重你的隐私。更新日期：2026 年 7 月 19 日</p></header>
      <div className="legal-sections">
        <section><h2>非官方声明</h2><p>本站为非官方、非商业粉丝项目，与邓紫棋本人、工作室、唱片公司、经纪公司及音乐平台均无隶属、授权或代言关系。Pick 结果只表达单个使用者当下的个人偏好，不构成官方排名或公众投票。</p></section>
        <section><h2>素材与版权</h2><p>第一版仅展示歌曲名、发行名称、年份等必要事实，以及自行整理的简短主题摘要。本站不托管或播放音乐、MV、歌词，不使用艺人照片、专辑封面、官方 Logo 或签名。外部链接仅用于前往公开来源或正规平台，并不表示获得素材授权。</p></section>
        <section><h2>本机数据</h2><p>候选歌曲、旅程编号、相遇顺序、Pick 进度和听歌平台偏好保存在当前设备的浏览器存储中。本站不建立账号，不读取音乐平台账号，也不主动收集姓名、邮箱、手机号、精确位置或公开排行榜数据。清除浏览器站点数据会同时清除 Pick 记录与平台偏好。</p></section>
        <section><h2>更正与删除请求</h2><p>发现内容问题？请通过版权联系邮箱联系我们。正式发布前仍需在此补充真实联系邮箱；收到有效通知后，将记录相关页面、通知时间与处理结果，并及时更正或移除内容。</p></section>
        <section><h2>来源说明</h2><p>数据文件为每张发行保留来源链接，主要包括艺人官方网站、Apple Music 公开发行页以及用于交叉核对的公开目录。来源链接用于事实核验，不等同于任何商业授权。</p></section>
      </div>
      <div className="legal-home-link"><Link href="/" className="button button-secondary">返回首页</Link></div>
    </div>
  );
}
