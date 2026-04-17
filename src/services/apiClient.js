import axios from 'axios';
import { API_BASE_URL, AUTH_TOKEN_KEY } from '../constants/constants';

// Khởi tạo instance axios chung
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// -----------------------------
// Request Interceptor
// -----------------------------
apiClient.interceptors.request.use(
  (config) => {
    // Tự động đính kèm Token chuẩn chuỗi 'Bearer <token>'
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// -----------------------------
// Response Interceptor
// -----------------------------
apiClient.interceptors.response.use(
  (response) => {
    // 1. Xử lý xóa thành công - 204 No Content (Trái lại có thể gây lỗi undefined nếu parse)
    if (response.status === 204) {
      return { success: true, data: null, message: 'Thành công (204)' };
    }

    // 2. Trả về đúng format chuẩn hóa của Backend: { success, message, data, pagination }
    return response.data;
  },
  (error) => {
    // Khi có phản hồi lỗi từ server
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          // Xử lý Bad Request: Trả về lỗi Validation để UI/Form có thể bắt được.
          console.warn('Validation Errors:', data.errors);
          break;

        case 401:
          // Xử lý Unauthorized: JWT hết hạn/lỗi -> xóa token hiện tại, bắt buộc đăng nhập lại
          localStorage.removeItem(AUTH_TOKEN_KEY);
          // Điều hướng về /login (Ghi đè để hard reset, có thể thay thế bằng logic React Router trong App Component sau này)
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;

        case 403:
          // Xử lý Forbidden: Người dùng không có quyền truy cập
          console.warn('Forbidden:', data.message);
          break;

        case 404:
          // Xử lý Not Found: Tài nguyên không tìm thấy
          console.warn('Not Found:', data.message);
          break;

        case 500:
          // Xử lý Server Error
          console.error('Server Internal Error:', data.message);
          break;

        default:
          console.error('Unknown Error:', status);
      }

      // Trả lại gói lỗi gốc nguyên bản từ Server để các hàm bắt .catch() ở File Services lấy được info gốc
      return Promise.reject(data);
    } else {
      // Khi mất CORS/Mạng sập (Network Error)
      console.error('Network Error / Server is down');
      return Promise.reject(error);
    }
  }
);

export default apiClient;
