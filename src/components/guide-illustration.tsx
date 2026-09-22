import { useId } from "react";

const panels = {
  sender: {
    title: "Người gửi yêu cầu",
    rows: ["① Mô tả vấn đề  ·  Chọn theo danh mục", "② Nhóm hỗ trợ: Tôi chưa biết nhóm nào", "③ VPN không kết nối, tôi nên kiểm tra gì?"],
    button: "Gửi",
    caption: "Nhập tình huống → bấm Gửi → kiểm tra và xác nhận",
  },
  feedback: {
    title: "Đọc phản hồi và thử các bước an toàn",
    rows: ["Chẩn đoán khả dĩ và các bước hỗ trợ", "A. Tôi đã làm được     B. Vẫn còn lỗi", "C. Giải thích bước này     D. Chuyển nhân viên"],
    button: "Gửi câu hỏi",
    caption: "Chọn phản hồi phù hợp hoặc nhập câu hỏi tiếp theo",
  },
  reviewer: {
    title: "Dành cho nhân viên · Human reviewer",
    rows: ["① Mở một yêu cầu trong danh sách", "② Đọc nội dung, bằng chứng và rủi ro", "③ Nhập lý do cho quyết định của bạn"],
    button: "Hỏi thêm thông tin",
    caption: "Chọn thao tác được phép → xem lịch sử xử lý",
  },
};

export function GuideIllustration({ kind }: { kind: keyof typeof panels }) {
  const id = useId();
  const panel = panels[kind];
  return (
    <figure className="guide-figure">
      <svg viewBox="0 0 560 255" role="img" aria-labelledby={`${id}-title`}>
        <title id={`${id}-title`}>{`${panel.title}. Mũi tên đỏ chỉ nút ${panel.button}.`}</title>
        <defs>
          <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626" />
          </marker>
        </defs>
        <rect x="2" y="2" width="556" height="250" rx="20" fill="#fff8f3" stroke="#f7c5ad" />
        <rect x="20" y="18" width="520" height="218" rx="13" fill="white" stroke="#e3e5e8" />
        <circle cx="39" cy="36" r="5" fill="#f05a22" />
        <text x="53" y="41" fill="#202124" fontSize="16" fontWeight="800">{panel.title}</text>
        {panel.rows.map((row, index) => (
          <g key={row}>
            <rect x="35" y={56 + index * 39} width="490" height="32" rx="7" fill={index === 2 ? "#fff7ed" : "#f5f5f4"} />
            <text x="46" y={77 + index * 39} fill="#404040" fontSize="14">{row}</text>
          </g>
        ))}
        <rect x="35" y="182" width="190" height="37" rx="10" fill="#f05a22" />
        <text x="130" y="206" textAnchor="middle" fill="white" fontSize="15" fontWeight="800">{panel.button}</text>
        <path d="M 401 184 Q 325 227 236 202" fill="none" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" markerEnd={`url(#${id}-arrow)`} />
        <text x="404" y="181" fill="#b91c1c" fontSize="14" fontWeight="800">Bấm ở đây</text>
      </svg>
      <figcaption>{panel.caption}</figcaption>
    </figure>
  );
}
