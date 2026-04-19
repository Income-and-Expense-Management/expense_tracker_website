import { message } from 'antd';

// Cấu hình chung cho toàn bộ ứng dụng (Vị trí trên cùng, thời gian hiển thị 3 giây)
message.config({
  top: 50,
  duration: 3,
  maxCount: 3,
});

export const useAppMessage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const notifySuccess = (content) => {
    messageApi.success({ content });
  };

  const notifyError = (content) => {
    messageApi.error({ content });
  };

  const notifyWarning = (content) => {
    messageApi.warning({ content });
  };

  const notifyInfo = (content) => {
    messageApi.info({ content });
  };

  return {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    // Trả về contextHolder để nhúng vào component gốc (giúp nhận các cấu hình Theme/Context của app nếu có)
    contextHolder,
  };
};