export async function browserApi<T>(path: string, body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: body === undefined ? "GET" : "POST",
      cache: "no-store",
      headers:
        body === undefined ? undefined : { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error(
      "Mất kết nối. Kiểm tra mạng và thử lại; nội dung bạn nhập vẫn được giữ lại.",
    );
  }
  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error("Máy chủ chưa phản hồi đúng. Vui lòng thử lại.");
  }
  if (!response.ok || result.success !== true)
    throw new Error(result.error?.message || "Không thể hoàn tất yêu cầu.");
  return result.data as T;
}
