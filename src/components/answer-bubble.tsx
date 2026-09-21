import type { ReactNode } from "react";
import type { Assistance } from "@/domain/contracts";
export function AnswerBubble({
  item,
  children,
}: {
  item: Assistance;
  children?: ReactNode;
}) {
  return (
    <div className="assistant-reveal" aria-live="polite">
      <article className="assistant-bubble" aria-label="Câu trả lời của trợ lý">
        <p className="assistant-byline">
          ✦{" "}
          {item.source === "openai"
            ? "DOCRELAY · AI trả lời"
            : item.source === "mock"
              ? "DOCRELAY · Câu trả lời mẫu"
              : "DOCRELAY · Hướng dẫn đã kiểm duyệt"}
        </p>
        {item.answer ? (
          <>
            <div className="assistant-text">{item.answer.text}</div>
            {item.answer.fallbackReason && (
              <p className="assistant-note">
                AI đang tạm không sẵn sàng. Đây là hướng dẫn có sẵn; câu hỏi
                chưa được chuyển cho nhân viên.
              </p>
            )}
            {item.answer.webSearch === "unavailable" && (
              <p className="assistant-note">
                Chưa tra cứu được web mới nhất; nguồn có sẵn được ghi ngày kiểm
                tra bên dưới.
              </p>
            )}
            {item.answer.sources.length > 0 && (
              <details className="assistant-sources">
                <summary>
                  Nguồn tham khảo ({item.answer.sources.length})
                </summary>
                <ul>
                  {item.answer.sources.map((source) => (
                    <li key={source.url}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {source.title}
                      </a>
                      <span>
                        {" "}
                        ·{" "}
                        {source.scope === "public"
                          ? "Nguồn công khai"
                          : "Tài liệu dự án"}{" "}
                        · kiểm tra {source.checkedAt.slice(0, 10)}
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </>
        ) : (
          children
        )}
      </article>
    </div>
  );
}
