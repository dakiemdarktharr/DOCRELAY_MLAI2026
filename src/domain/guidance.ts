import type { Assistance, CanonicalRequest } from "./contracts";
import { guidanceRules, type GuidanceTopic } from "./policy-source";

export const assistanceOptions = [
  "A. Tôi đã làm được",
  "B. Vẫn còn lỗi",
  "C. Tôi không hiểu bước này",
  "D. Chuyển yêu cầu cho admin",
];
const steps: Record<GuidanceTopic, string[]> = {
  restart: [
    "Lưu tài liệu đang làm và đóng các ứng dụng sau khi lưu.",
    "Mở menu nguồn của hệ điều hành; chọn Shut down để tắt máy hoặc Restart để khởi động lại theo nhu cầu.",
    "Nếu đang cập nhật hệ thống, chờ cập nhật hoàn tất; không ngắt nguồn giữa chừng.",
  ],
  device: [
    "Chờ một lúc để máy hoàn tất tác vụ và kiểm tra đèn nguồn, cáp nguồn hoặc pin.",
    "Nếu máy còn phản hồi, lưu công việc đang mở và ghi lại tên ứng dụng gặp lỗi.",
    "Nếu vẫn treo hoặc có cảnh báo phần cứng, dừng thao tác và chuyển IT Helpdesk; không tháo máy hay factory reset.",
  ],
  vpn: [
    "Kiểm tra Internet bằng một trang nội bộ hoặc trang công khai tin cậy mà bạn thường dùng.",
    "Mở ứng dụng VPN chính thức đã được IT cung cấp và kiểm tra tên profile công ty.",
    "Ghi lại mã lỗi, thời điểm và hệ điều hành; không gửi mật khẩu, token hoặc mã MFA.",
    "Thử kết nối lại một lần; giữ nguyên MFA, firewall và các kiểm soát bảo mật.",
  ],
  wifi: [
    "Kiểm tra Wi-Fi đang bật và chọn đúng mạng được công ty cho phép.",
    "Kiểm tra thiết bị khác trên cùng mạng có gặp lỗi tương tự không.",
    "Ghi lại thông báo lỗi và chuyển IT nếu vẫn lỗi; không đổi proxy, DNS hoặc firewall.",
  ],
  software: [
    "Mở ứng dụng từ catalog chính thức đã được công ty phê duyệt.",
    "Kiểm tra hướng dẫn sử dụng và thông báo lỗi trong ứng dụng.",
    "Ghi lại phiên bản và hệ điều hành; không tải bản crack, plugin unsigned hoặc tự bỏ kiểm soát bảo mật.",
  ],
  account: [
    "Mở cổng đăng nhập hoặc self-service chính thức của công ty từ bookmark đã xác minh.",
    "Dùng chức năng quên mật khẩu hoặc hỗ trợ tài khoản của cổng chính thức; chỉ nhập dữ liệu trên cổng đó.",
    "Nếu xác minh danh tính hoặc MFA thất bại, chuyển IT; không gửi mật khẩu hay mã xác minh trong ticket.",
  ],
  peripherals: [
    "Kiểm tra nguồn và kết nối ngoài của thiết bị, không tháo vỏ hoặc chạm linh kiện bên trong.",
    "Kiểm tra đúng thiết bị đầu ra/đầu vào trong cài đặt người dùng.",
    "Ghi lại hiện tượng và liên hệ IT nếu vẫn lỗi; không tự cài driver không rõ nguồn.",
  ],
  general: [
    "Xác định ứng dụng và mục tiêu bạn muốn đạt được, không gửi thông tin xác thực.",
    "Tham khảo phần Help hoặc tài liệu đã được tổ chức phê duyệt.",
    "Nếu cần quyền mới, thao tác xóa dữ liệu hoặc thay đổi hệ thống, chuyển admin trước khi thực hiện.",
  ],
};

export function guidanceTemplate(
  request: CanonicalRequest,
): Omit<Assistance, "source" | "timestamp"> {
  const rule = guidanceRules.find((item) =>
    item.labels.some((label) => label === request.intentLabel),
  );
  const topic = rule?.topic ?? "general";
  return {
    summary: "Hướng dẫn an toàn cho yêu cầu của bạn",
    stepByStepInstructions: [...steps[topic]],
    options: [...assistanceOptions],
    expectedResult:
      "Kiểm tra xem vấn đề đã được giải quyết; nếu chưa, chọn bước hỗ trợ tiếp theo.",
    warning:
      "Không cung cấp secret, không factory reset hoặc thay đổi cấu hình bảo mật. Mọi thao tác hạ tầng trong demo đều là mô phỏng.",
    nextQuestion: "Sau các bước này, vấn đề còn xảy ra không?",
    canPassToAdmin: true,
  };
}
