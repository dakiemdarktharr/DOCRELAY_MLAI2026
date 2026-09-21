import { intentName } from "./presentation";
import type { Assistance, CanonicalRequest } from "./contracts";
import { guidanceRules, type GuidanceTopic } from "./policy-source";

export const assistanceOptions = [
  "A. Tôi đã làm được",
  "B. Vẫn còn lỗi",
  "C. Giải thích bước này",
  "D. Chuyển cho nhân viên hỗ trợ",
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

const specificSteps: Record<string, string[]> = {
  DEVICE_SHUTDOWN_GUIDANCE: [
    steps.restart[0],
    "Mở menu nguồn của hệ điều hành; chọn Shut down (Tắt máy). Chờ màn hình và đèn hoạt động tắt trước khi cất máy.",
    steps.restart[2],
  ],
  DEVICE_RESTART_GUIDANCE: [
    steps.restart[0],
    "Mở menu nguồn của hệ điều hành; chọn Restart (Khởi động lại), không chọn Reset. Máy sẽ khởi động lại; các tệp đã lưu không bị xóa.",
    steps.restart[2],
  ],
  ACCOUNT_LOGIN: [
    "Kiểm tra địa chỉ trang đăng nhập từ dấu trang công ty đã xác minh, tên tài khoản và trạng thái Caps Lock.",
    "Chỉ thử đăng nhập lại một lần trên cổng chính thức. Nếu báo tài khoản bị khóa hoặc xác minh thất bại, dừng thử để tránh khóa thêm.",
    "Ghi lại thông báo lỗi và chọn chuyển cho nhân viên hỗ trợ. Không gửi mật khẩu hoặc mã xác minh.",
  ],
  MFA_FAILURE: [
    "Kiểm tra giờ trên điện thoại có đúng không và ứng dụng xác thực có đang mở đúng tài khoản không.",
    "Thử xác minh lại một lần trên cổng công ty đã xác minh; không chấp thuận thông báo đăng nhập do người khác khởi tạo.",
    "Nếu mất thiết bị hoặc vẫn không xác minh được, chuyển cho nhân viên để xác nhận danh tính; không tắt xác thực hai bước.",
  ],
  DEVICE_PRINTER: [
    "Kiểm tra máy in đã bật nguồn, có giấy và không báo kẹt giấy. Không mở phần máy có cảnh báo điện hoặc nhiệt.",
    "Trong hộp thoại In, kiểm tra tên máy in và xem trước tài liệu; chỉ thử in một trang không chứa dữ liệu nhạy cảm.",
    "Nếu vẫn không in được, ghi lại tên máy in và thông báo lỗi, rồi chuyển cho nhân viên hỗ trợ.",
  ],
  DEVICE_AUDIO: [
    "Kiểm tra âm lượng và biểu tượng tắt tiếng trong ứng dụng đang dùng.",
    "Trong cài đặt âm thanh của người dùng, chọn đúng loa hoặc tai nghe đang kết nối; thử bằng âm thanh không chứa dữ liệu công việc.",
    "Nếu vẫn không nghe được, ghi lại ứng dụng và thiết bị đang dùng. Không tự cài trình điều khiển từ nguồn lạ.",
  ],
  DEVICE_DISPLAY: [
    "Kiểm tra màn hình đã bật và cáp bên ngoài đã cắm chắc; không tháo vỏ thiết bị.",
    "Kiểm tra màn hình đang chọn đúng nguồn vào theo dây kết nối. Nếu máy còn hiển thị, lưu công việc trước khi thử bước khác.",
    "Nếu màn hình vẫn đen hoặc có dấu hiệu hỏng, dừng thao tác và chuyển cho nhân viên hỗ trợ.",
  ],
  DATABASE_QUERY_HELP: [
    "Nêu kết quả muốn xem và tên bảng/cột giả lập; không gửi dữ liệu khách hàng hay thông tin đăng nhập.",
    "Xem tài liệu cú pháp truy vấn của hệ thống đang dùng. Có thể học với câu SELECT 1 trên môi trường học tập đã được phép, không chạy trên hệ thống thật.",
    "Nếu cần truy cập dữ liệu, sửa bảng hoặc thay dữ liệu, gửi yêu cầu riêng để xác minh phạm vi và quyền trước.",
  ],
};
const expected: Partial<Record<GuidanceTopic, string>> = {
  restart:
    "Máy tắt hoặc khởi động lại bình thường; các tệp đã lưu được giữ nguyên.",
  vpn: "VPN kết nối được, hoặc bạn có mã lỗi và thời điểm để nhân viên tiếp tục kiểm tra.",
  wifi: "Thiết bị truy cập được mạng được phép, hoặc xác định lỗi chỉ ở một máy hay nhiều máy.",
  account:
    "Đăng nhập hoặc tự khôi phục được tài khoản; nếu không, nhân viên tiếp nhận lỗi mà không cần mật khẩu.",
  peripherals:
    "Thiết bị hoạt động trở lại hoặc bạn có thông báo lỗi cụ thể để gửi hỗ trợ.",
};
export function guidanceTemplate(
  request: CanonicalRequest,
  round = 0,
): Omit<Assistance, "source" | "timestamp"> {
  const rule = guidanceRules.find((item) =>
    item.labels.some((label) => label === request.intentLabel),
  );
  const topic = rule?.topic ?? "general";
  return {
    summary: intentName(request.intentLabel),
    stepByStepInstructions:
      round > 0
        ? [
            "Dừng lặp lại bước vừa thử nếu kết quả không thay đổi; giữ nguyên cài đặt bảo mật và công việc đang mở.",
            "Ghi lại bước đã thử, thông báo lỗi và thời điểm xảy ra; loại bỏ mật khẩu và mã xác minh.",
            "Nếu không rõ thông báo hoặc không thể tiếp tục an toàn, chọn chuyển cho nhân viên hỗ trợ cùng lịch sử này.",
          ]
        : [...(specificSteps[request.intentLabel] ?? steps[topic])],
    options: [...assistanceOptions],
    expectedResult:
      expected[topic] ??
      "Có thể xác định bước tiếp theo phù hợp với nhu cầu; nếu chưa, chuyển cho nhân viên hỗ trợ.",
    warning:
      "Không gửi mật khẩu hoặc mã xác minh. Dừng lại nếu thấy yêu cầu xóa dữ liệu hoặc tắt bảo vệ thiết bị.",
    nextQuestion: "Sau các bước này, vấn đề còn xảy ra không?",
    canPassToAdmin: true,
  };
}

export function explainStep(step: string): string {
  if (/menu nguồn/.test(step))
    return "Sau khi lưu công việc, trên Windows mở Start → Power, trên macOS mở menu Apple. Chọn Restart để khởi động lại hoặc Shut down để tắt máy; không chọn Reset/Erase. Máy sẽ tắt hoặc khởi động lại; nếu đang cập nhật hãy chờ.";
  if (/Lưu tài liệu|lưu công việc/.test(step))
    return "Mở từng tài liệu đang làm, chọn Tệp → Lưu và chờ lưu xong. Nếu ứng dụng đang treo hoặc bạn không chắc tài liệu đã được lưu, dừng tại đây và nhờ nhân viên hỗ trợ.";
  if (/Kiểm tra Internet/.test(step))
    return "Mở trình duyệt và truy cập trang bạn thường dùng. Nếu trang cũng không mở, vấn đề có thể ở kết nối mạng. Chỉ ghi lại hiện tượng; chưa thay cấu hình mạng.";
  if (/ứng dụng VPN/.test(step))
    return "Mở ứng dụng VPN công ty đã cài trên máy. Xem tên kết nối đang chọn có đúng tên công ty không. Nếu không thấy hoặc không biết tên đúng, đừng tạo kết nối mới; chọn chuyển cho nhân viên hỗ trợ.";
  if (/Ghi lại|Ghi lại|ghi lại/.test(step))
    return "Chép phần thông báo lỗi và thời điểm xảy ra vào phần bổ sung. Bỏ mật khẩu, mã xác minh và thông tin khách hàng. Thông báo này giúp nhân viên xác định bước xử lý tiếp theo.";
  if (/kết nối lại/.test(step))
    return "Trong ứng dụng VPN, bấm kết nối thêm một lần. Nếu vẫn lỗi, ghi lại thông báo và chọn chuyển cho nhân viên. Không tắt xác thực hai bước hoặc tường lửa để thử.";
  return `Chỉ thực hiện bước sau khi bạn nhận ra đúng nút hoặc thiết bị: ${step} Nếu không thấy đúng mục hoặc chưa hiểu, dừng lại và chọn chuyển cho nhân viên hỗ trợ.`;
}
