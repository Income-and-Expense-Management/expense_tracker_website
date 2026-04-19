import { message } from 'antd';
import { useCallback } from 'react';

// Cấu hình chung cho toàn bộ ứng dụng (Vị trí trên cùng, thời gian hiển thị 3 giây)
message.config({
  top: 50,
  duration: 3,
  maxCount: 3,
});

export const useAppMessage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const notifySuccess = useCallback((content) => {
    messageApi.success({ content });
  }, [messageApi]);

  const notifyError = useCallback((content) => {
    messageApi.error({ content });
  }, [messageApi]);

  const notifyWarning = useCallback((content) => {
    messageApi.warning({ content });
  }, [messageApi]);

  const notifyInfo = useCallback((content) => {
    messageApi.info({ content });
  }, [messageApi]);

  return {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    // Trả về contextHolder để nhúng vào component gốc (giúp nhận các cấu hình Theme/Context của app nếu có)
    contextHolder,
  };
};