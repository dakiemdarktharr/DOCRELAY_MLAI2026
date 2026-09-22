import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Headphones, ClipboardList } from "lucide-react";
export default function Home() {
  return (
    <main className="welcome" aria-label="Chọn vai trò">
      <section className="welcome-copy">
        <h1>
          Bạn cần hỗ trợ
          <br />
          gì hôm nay?
        </h1>
        <div className="entry-links">
          <Link
            aria-label="Tôi cần hỗ trợ"
            className="entry-card entry-primary"
            href="/send-help"
          >
            <Headphones size={25} />
            <span>
              <strong>Tôi cần hỗ trợ</strong>
              <small>Gửi vấn đề và nhận hướng dẫn</small>
            </span>
            <ArrowRight size={22} />
          </Link>
          <Link
            aria-label="Dành cho nhân viên"
            className="entry-card"
            href="/review"
          >
            <ClipboardList size={24} />
            <span>
              <strong>Dành cho nhân viên</strong>
              <small>Tiếp nhận và xử lý yêu cầu hỗ trợ</small>
            </span>
            <ArrowRight size={22} />
          </Link>
        </div>
      </section>
      <div className="welcome-art">
        <span className="hello-note" aria-hidden="true">
          Xin chào!
        </span>
        <Image
          src="/illustrations/vng-support-mascot.png"
          width={1024}
          height={1024}
          priority
          alt="Nhân vật màu cam thân thiện đang vẫy tay chào"
        />
      </div>
    </main>
  );
}
