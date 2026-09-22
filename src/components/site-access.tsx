"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { QrCode } from "lucide-react";

export function SiteAccess() {
  const dialog = useRef<HTMLDialogElement>(null);
  const urlField = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    const modal = dialog.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal?.showModal();
    return () => {
      modal?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Đã sao chép liên kết.");
    } catch {
      urlField.current?.focus();
      urlField.current?.select();
      setMessage("Hãy sao chép liên kết đã được chọn trong ô URL.");
    }
  }

  return <>
    <button className="site-access-button" aria-haspopup="dialog" onClick={() => {
      // Always share the role picker, never a request ID, query or fragment.
      setUrl(new URL("/", window.location.origin).href);
      setMessage("");
      setOpen(true);
    }}><QrCode size={20} aria-hidden="true" /> URL / QR</button>
    <dialog ref={dialog} className="site-access-modal" aria-labelledby="site-access-title" onCancel={(event) => {
      event.preventDefault(); setOpen(false);
    }} onKeyDown={(event) => {
      if (event.key !== "Tab") return;
      const controls = event.currentTarget.querySelectorAll<HTMLElement>("button, input, a[href]");
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }}>
      <h2 id="site-access-title">Mở website trên điện thoại</h2>
      <p>Mở Camera hoặc ứng dụng quét QR, hướng vào mã bên dưới rồi chạm liên kết. Bạn sẽ đến màn hình chọn <strong>người gửi yêu cầu</strong> hoặc <strong>human reviewer</strong>.</p>
      {url && <div className="site-qr" role="img" aria-label="Mã QR mở màn hình chọn vai trò">
        <QRCodeCanvas value={url} size={256} level="M" marginSize={4} />
      </div>}
      <label className="field">URL website<input ref={urlField} value={url} readOnly onFocus={(event) => event.target.select()} /></label>
      {url && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(new URL(url).hostname) && <p className="notice">Đây là địa chỉ trên máy hiện tại. Để quét từ điện thoại, mở website bằng đường dẫn đã triển khai hoặc địa chỉ mạng mà điện thoại truy cập được.</p>}
      <div className="site-access-actions">
        <button className="button primary" onClick={copyUrl}>Sao chép URL</button>
        <a className="button secondary" href={url || "/"}>Mở màn hình chọn vai trò</a>
        <button className="button secondary" onClick={() => setOpen(false)}>Đóng</button>
      </div>
      <p role="status" className="site-access-status">{message}</p>
    </dialog>
  </>;
}
