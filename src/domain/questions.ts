import { labelForField } from "./catalog";
const hints: Record<string, [string, string]> = {
  resetType: [
    "Bạn muốn khởi động lại (không xóa file) hay khôi phục cài đặt gốc (có thể mất dữ liệu)?",
    "Để chọn cách xử lý không làm mất dữ liệu.",
  ],
  system: [
    "Bạn cần hỗ trợ hệ thống nào? Ví dụ: PostgreSQL hoặc tên ứng dụng.",
    "Để hướng dẫn đúng hệ thống.",
  ],
  targetSystem: [
    "Bạn cần dùng ứng dụng hoặc hệ thống nào?",
    "Để xác định nơi cấp quyền.",
  ],
  resourceScope: [
    "Bạn cần dùng cơ sở dữ liệu, bảng hoặc tài nguyên nào?",
    "Để giới hạn đúng phạm vi.",
  ],
  environment: [
    "Đây là hệ thống thử nghiệm hay đang vận hành thật? Nếu chưa rõ, chọn Tôi không biết.",
    "Môi trường quyết định mức độ rủi ro.",
  ],
  duration: [
    "Bạn cần dùng trong bao lâu? Ví dụ: 2 giờ.",
    "Để giới hạn thời gian sử dụng.",
  ],
  reason: [
    "Bạn cần thực hiện công việc gì?",
    "Để chọn quyền tối thiểu cần thiết.",
  ],
  permission: [
    "Bạn cần chỉ xem hay chỉnh sửa dữ liệu?",
    "Quyền chỉnh sửa cần được kiểm tra kỹ hơn.",
  ],
  verifiedApproval: [
    "Bạn có mã phê duyệt cho yêu cầu này không?",
    "Hệ thống cần xác minh mã; lời xác nhận đã duyệt chưa đủ.",
  ],
  symptom: [
    "Bạn gặp lỗi gì? Có thông báo nào trên màn hình?",
    "Để khoanh vùng sự cố. Không gửi mật khẩu.",
  ],
};
export function questionFor(field: string) {
  return (
    hints[field]?.[0] ??
    `Bạn cho biết ${labelForField(field).toLowerCase()} được không?`
  );
}
export function hintFor(field: string) {
  return (
    hints[field]?.[1] ??
    "Điền nếu bạn biết; thông tin này giúp xác định phạm vi xử lý."
  );
}
