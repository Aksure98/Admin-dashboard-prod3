interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

interface SignInData {
  admin: UserData;
  token: string;
  refresh_token: string;
}

interface ErrorResponse {
  message?: string;
}
