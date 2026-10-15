export const AUTH_L10N = {
  vi: {
    // Forgot Password
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

    // Reset Password
    resetPasswordTitle: 'Đặt lại mật khẩu',
    resetPasswordOtpSentTo: 'Mã OTP đã được gửi đến',
    resetPasswordSpamGuidance: 'Nếu không thấy email trong hộp thư đến, vui lòng kiểm tra thư mục Spam (Thư rác) hoặc Quảng cáo.',
    resetPasswordOtpLabel: 'Mã xác nhận (OTP)',
    resetPasswordOtpPlaceholder: 'Nhập mã 6 chữ số...',
    resetPasswordOtpRequired: 'Vui lòng nhập mã OTP',
    resetPasswordOtpInvalid: 'OTP phải gồm đúng 6 chữ số',
    resetPasswordNewPasswordLabel: 'Mật khẩu mới',
    resetPasswordNewPasswordPlaceholder: 'Nhập mật khẩu mới...',
    resetPasswordNewPasswordRequired: 'Mật khẩu mới là bắt buộc',
    resetPasswordNewPasswordMin: 'Mật khẩu phải ít nhất 6 ký tự',
    resetPasswordConfirmPasswordLabel: 'Xác nhận mật khẩu mới',
    resetPasswordConfirmPasswordPlaceholder: 'Nhập lại mật khẩu mới...',
    resetPasswordConfirmPasswordRequired: 'Vui lòng xác nhận mật khẩu',
    resetPasswordConfirmPasswordMismatch: 'Mật khẩu không khớp',
    resetPasswordSubmit: 'Đặt lại mật khẩu',
    resetPasswordSubmitting: 'Đang xử lý...',
    resetPasswordBackToEmail: '← Quay lại nhập email',

    // Password Visibility Labels
    showPasswordLabel: 'Hiện mật khẩu',
    hidePasswordLabel: 'Ẩn mật khẩu',
    showConfirmPasswordLabel: 'Hiện mật khẩu xác nhận',
    hideConfirmPasswordLabel: 'Ẩn mật khẩu xác nhận',
  },
  en: {
    // Forgot Password
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

    // Reset Password
    resetPasswordTitle: 'Reset Password',
    resetPasswordOtpSentTo: 'OTP code has been sent to',
    resetPasswordSpamGuidance: "If you don't see the email in your inbox, please check your Spam/Junk or Promotions folder.",
    resetPasswordOtpLabel: 'Verification Code (OTP)',
    resetPasswordOtpPlaceholder: 'Enter 6-digit code...',
    resetPasswordOtpRequired: 'Please enter OTP code',
    resetPasswordOtpInvalid: 'OTP must contain exactly 6 digits',
    resetPasswordNewPasswordLabel: 'New Password',
    resetPasswordNewPasswordPlaceholder: 'Enter new password...',
    resetPasswordNewPasswordRequired: 'New password is required',
    resetPasswordNewPasswordMin: 'Password must be at least 6 characters',
    resetPasswordConfirmPasswordLabel: 'Confirm New Password',
    resetPasswordConfirmPasswordPlaceholder: 'Re-enter new password...',
    resetPasswordConfirmPasswordRequired: 'Please confirm password',
    resetPasswordConfirmPasswordMismatch: 'Passwords do not match',
    resetPasswordSubmit: 'Reset Password',
    resetPasswordSubmitting: 'Processing...',
    resetPasswordBackToEmail: '← Back to enter email',

    // Password Visibility Labels
    showPasswordLabel: 'Show password',
    hidePasswordLabel: 'Hide password',
    showConfirmPasswordLabel: 'Show confirmation password',
    hideConfirmPasswordLabel: 'Hide confirmation password',
  },
};

export const tAuth = (key: keyof typeof AUTH_L10N.vi, locale: 'vi' | 'en' = 'vi'): string => {
  return AUTH_L10N[locale]?.[key] || AUTH_L10N.vi[key] || '';
};
