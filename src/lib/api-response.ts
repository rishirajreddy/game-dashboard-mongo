export default class ApiResponse {
  statusCode: number;
  message?: string;
  data?: any;
  error?: any;
  success?: boolean;

  constructor(statusCode: number, message?: string, data?: any, error?: any) {
    this.message = message;
    this.data = data;
    this.error = error;
    this.statusCode = statusCode;
    this.success = statusCode < 400;
  }
}
