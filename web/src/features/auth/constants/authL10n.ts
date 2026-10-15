export const AUTH_L10N = {
  vi: {
    forgotPasswordTitle: 'Quên mật khẩu',
    forgotPasswordSubtitle: 'Nhập email đã đăng ký để nhận mã xác nhận.',
    forgotPasswordGuidance: 'Vui lòng nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi mã xác nhận (OTP) gồm 6 chữ số đến email của bạn để tiến hành đặt lại mật khẩu.',
    forgotPasswordEmailLabel: 'Email',
    forgotPasswordEmailPlaceholder: 'Nhập địa chỉ email...',
    forgotPasswordSubmit: 'Gửi mã xác nhận',
    forgotPasswordSending: 'Đang gửi...',
    forgotPasswordResendAfter: 'Gửi lại sau',
    forgotPasswordRememberPassword: 'Đã nhớ mật khẩu?',
    forgotPasswordLoginNow: 'Đăng nhập ngay',
  },
  en: {
    forgotPasswordTitle: 'Forgot Password',
    forgotPasswordSubtitle: 'Enter your registered email to receive verification code.',
    forgotPasswordGuidance: 'Enter your registered email address. We will send a 6-digit verification code (OTP) to your email to continue resetting your password.',
    forgotPasswordEmailLabel: 'Email',
    forgotPasswordEmailPlaceholder: 'Enter your email address...',
    forgotPasswordSubmit: 'Send verification code',
    forgotPasswordSending: 'Sending...',
    forgotPasswordResendAfter: 'Resend after',
    forgotPasswordRememberPassword: 'Remember your password?',
    forgotPasswordLoginNow: 'Log in now',
  },
};

export const tAuth = (key: keyof typeof AUTH_L10N.vi, locale: 'vi' | 'en' = 'vi'): string => {
  return AUTH_L10N[locale]?.[key] || AUTH_L10N.vi[key] || '';
};
