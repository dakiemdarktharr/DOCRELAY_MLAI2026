import Link from "next/link";
import { Card } from "@/components/ui";
export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="max-w-3xl space-y-5 pt-6">
        <p className="text-sm font-bold uppercase tracking-widest text-accent">
          VNG Tech Support Escalation Referee
        </p>
        <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
          Hỗ trợ đúng bước.
          <br />
          Chuyển đúng người.
        </h1>
        <p className="text-lg leading-8 text-slate-600">
          Hỏi cách sử dụng, xử lý sự cố hoặc gửi yêu cầu kỹ thuật. Hệ thống
          hướng dẫn các bước an toàn và chuyển người phụ trách khi cần quyền
          quyết định.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            className="rounded-xl bg-accent px-6 py-3 font-bold text-white"
            href="/workspace"
          >
            I need help
          </Link>
          <Link
            className="rounded-xl border border-line bg-white px-6 py-3 font-bold"
            href="/review"
          >
            Admin
          </Link>
        </div>
        <p className="text-sm text-slate-500">
          Demo công khai • Không cần đăng nhập • Chỉ dùng dữ liệu giả lập • Mọi
          thao tác cấp quyền và hạ tầng đều là mô phỏng.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          [
            "Hướng dẫn an toàn",
            "Shutdown, restart và chẩn đoán cơ bản được hỗ trợ ngay. Bạn có thể chuyển admin bất cứ lúc nào.",
          ],
          [
            "Quyết định có bằng chứng",
            "Policy xác định quyền xử lý; model chỉ trích xuất và hỗ trợ. Risk, rule và thông tin còn thiếu đều xem được.",
          ],
          [
            "Kiểm thử trực tiếp",
            "Verify gọi API thật của ứng dụng. Nhập câu hỏi mới và xem expected, actual cùng audit theo mã yêu cầu.",
          ],
        ].map(([title, body]) => (
          <Card key={title}>
            <h2 className="mb-3 font-bold">{title}</h2>
            <p className="text-sm leading-6 text-slate-600">{body}</p>
          </Card>
        ))}
      </section>
      <div className="flex flex-wrap gap-6 text-accent underline">
        <Link href="/verify">Chạy Verify</Link>
        <Link href="/audit">Xem audit</Link>
        <Link href="/legacy/workspace">Generic echo (compatibility)</Link>
      </div>
    </div>
  );
}
