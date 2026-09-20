import { NextResponse } from "next/server";

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

function noStore(init?: ResponseInit): ResponseInit {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-store");
  return { ...init, headers };
}

export function successResponse<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiSuccess<T>>(
    { success: true, data },
    noStore(init),
  );
}

export function errorResponse(
  code: string,
  message: string,
  status = 400,
  details?: unknown,
) {
  return NextResponse.json<ApiFailure>(
    {
      success: false,
      error: { code, message, ...(details ? { details } : {}) },
    },
    noStore({ status }),
  );
}
