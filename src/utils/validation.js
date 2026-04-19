export const validateEmail = (email) => {
  // Định dạng chuẩn xác hơn cho email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return email && emailRegex.test(email);
};

export const validateFullName = (name) => {
  if (!name || name.trim().length < 2) {
    return "Họ tên phải có ít nhất 2 ký tự.";
  }
  // Dùng regular expression với Unicode property escapes (\p{L}) để cho phép tiếng Việt và ký tự chữ
  if (!/^[\p{L}\s]+$/u.test(name)) {
    return "Họ tên không được chứa số hoặc ký tự đặc biệt.";
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return "Mật khẩu phải có ít nhất 8 ký tự.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa.";
  }
  if (!/[a-z]/.test(password)) {
    return "Mật khẩu phải chứa ít nhất 1 chữ cái viết thường.";
  }
  if (!/\d/.test(password)) {
    return "Mật khẩu phải chứa ít nhất 1 chữ số.";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt.";
  }
  return null;
};

export const validateLoginForm = (data) => {
  const errors = {};
  
  if (!validateEmail(data.email)) {
    errors.email = "Vui lòng nhập định dạng email hợp lệ.";
  }
  
  const pwdError = validatePassword(data.password);
  if (pwdError) {
    errors.password = pwdError;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRegisterForm = (data) => {
  const errors = {};
  
  const nameError = validateFullName(data.full_name);
  if (nameError) {
    errors.full_name = nameError;
  }
  
  if (!validateEmail(data.email)) {
    errors.email = "Vui lòng nhập định dạng email hợp lệ.";
  }
  
  const pwdError = validatePassword(data.password);
  if (pwdError) {
    errors.password = pwdError;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};