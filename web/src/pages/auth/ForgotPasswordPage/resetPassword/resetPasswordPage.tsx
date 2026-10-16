import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Info, Eye, EyeOff } from "lucide-react";
import { useResetPasswordController } from "./resetPassword.controller";
import { tAuth } from "../../../../features/auth/constants/authL10n";

function ResetPasswordPage() {
    const {
        register,
        handleSubmit,
        setValue,
        errors,
        isSubmitting,
        onResetPassword,
        currentPassword,
        email,
    } = useResetPasswordController();

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    if (!email) {
        return <Navigate to="/forgot-password" replace />;
    }

    const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Allow navigation, deletion, clipboard modifiers
        if (
            e.key === "Backspace" ||
            e.key === "Delete" ||
            e.key === "Tab" ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight" ||
            e.key === "Home" ||
            e.key === "End" ||
            e.key === "Enter" ||
            ((e.ctrlKey || e.metaKey) && ["a", "c", "v", "x"].includes(e.key.toLowerCase()))
        ) {
            return;
        }
        // Block anything that is not a numeric digit 0-9
        if (!/^[0-9]$/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text") || "";
        const sanitized = pastedData.replace(/\D/g, "").slice(0, 6);
        e.currentTarget.value = sanitized;
        setValue("otp", sanitized, { shouldValidate: true, shouldDirty: true });
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 md:p-8 bg-market-background text-[#1C1917] font-['Open_Sans',sans-serif] overflow-hidden">

            {/* Background decorations */}
            <svg className="absolute top-[-5%] left-[-5%] w-64 h-64 text-market-tertiary opacity-[0.04] -rotate-12 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 8C14.24 8 11.89 9.5 10.5 11.83C9.11 9.5 6.76 8 4 8C4 14.63 9 19.88 10.5 22C12 19.88 17 14.63 17 8Z" />
                <path d="M10.5 22V11.83" stroke="currentColor" strokeWidth="0.5" />
            </svg>
            <svg className="absolute bottom-[5%] right-[-2%] w-72 h-72 text-market-secondary opacity-[0.06] rotate-12 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8 2 5.5 5 5.5 9C5.5 14 3 18 3 22L21 22C21 18 18.5 14 18.5 9C18.5 5 16 2 12 2Z" />
            </svg>
            <svg className="absolute top-[15%] right-[10%] w-40 h-40 text-market-primary opacity-[0.03] rotate-45 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="12" cy="12" r="6" />
                <path d="M12 6V2 M12 22v-4 M6 12H2 M22 12h-4" />
                <path d="M15 15l4 4" />
            </svg>
            <svg className="absolute bottom-[10%] left-[10%] w-56 h-56 text-market-secondary opacity-[0.04] pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>

            {/* Frame */}
            <div className="relative w-full max-w-[1024px] min-h-[600px] z-10 flex">
                <div className="absolute inset-0 bg-market-surface border border-[#E7E5E4] rounded-[12px] rotate-2 scale-[0.98] transition-transform duration-500 hover:rotate-3"></div>
                <div className="absolute inset-0 bg-market-background border border-[#E7E5E4] rounded-[12px] -rotate-1 scale-[0.99] transition-transform duration-500 hover:-rotate-2"></div>

                <div className="relative w-full bg-white border-2 border-[#D6D3D1] rounded-[12px] flex flex-col md:flex-row overflow-hidden shadow-none">

                    {/* Left: Introduction */}
                    <div className="hidden md:flex w-1/2 flex-col justify-between p-12 bg-market-background border-r border-[#E7E5E4] relative overflow-hidden">
                        <div className="relative z-10">
                            <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
                                <h2 className="font-['Lora',serif] text-[26px] font-semibold text-[#1C1917] mb-2 tracking-[-0.24px]">
                                    MarketNest
                                </h2>
                            </Link>
                            <div className="w-[40px] h-[2px] bg-market-primary mb-8"></div>

                            <h1 className="font-['Lora',serif] text-[36px] font-semibold leading-tight tracking-[0.005em] text-[#1C1917] mb-6">
                                Tạo mật khẩu <br /> mới cho bạn.
                            </h1>
                            <p className="text-[18px] text-[#57534E] leading-[1.6]">
                                Nhập mã OTP đã được gửi đến email của bạn và tạo một mật khẩu mới để bảo vệ tài khoản.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 relative z-10 mt-12">
                            <div className="w-10 h-10 rounded-full bg-market-secondary flex items-center justify-center text-white font-['Lora',serif] italic shadow-none">
                                MN
                            </div>
                            <div>
                                <p className="text-[14px] font-semibold text-[#1C1917]">Cộng đồng Nghệ nhân</p>
                                <p className="text-[12px] text-[#57534E]">Tôn vinh giá trị thủ công</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-white relative">
                        <div className="w-full max-w-[380px] mx-auto relative z-10">

                            {/* Mobile Back to Home */}
                            <div className="block md:hidden mb-6 text-left">
                                <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
                                    <h2 className="font-['Lora',serif] text-[26px] font-semibold text-[#1C1917] mb-2 tracking-[-0.24px]">
                                        MarketNest
                                    </h2>
                                </Link>
                                <div className="w-10 h-0.5 bg-market-primary mb-8"></div>
                            </div>

                            <div className="mb-6 text-center md:text-left">
                                <h2 className="font-['Lora',serif] text-[36px] font-semibold text-[#1C1917] mb-2">
                                    {tAuth("resetPasswordTitle")}
                                </h2>
                                <p className="text-[14px] text-[#57534E]">
                                    {tAuth("resetPasswordOtpSentTo")}{" "}
                                    <span className="font-semibold text-[#1C1917]">{email}</span>
                                </p>
                            </div>

                            {/* Informational Guidance Block (Bug A) */}
                            <div
                                role="note"
                                aria-label={tAuth("resetPasswordSpamGuidance")}
                                className="flex items-start gap-2.5 rounded-[8px] border border-market-primary/20 bg-market-background p-3 mb-6 text-[13px] text-[#57534E] leading-relaxed shadow-none"
                            >
                                <Info className="w-4 h-4 text-market-primary shrink-0 mt-0.5" aria-hidden="true" />
                                <p>{tAuth("resetPasswordSpamGuidance")}</p>
                            </div>

                            <form onSubmit={handleSubmit(onResetPassword)}>

                                {/* OTP input (Bug B) */}
                                <div className="flex flex-col mb-4">
                                    <label className="text-[13px] font-semibold text-[#1C1917] mb-2">
                                        {tAuth("resetPasswordOtpLabel")}
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        placeholder={tAuth("resetPasswordOtpPlaceholder")}
                                        maxLength={6}
                                        onKeyDown={handleOtpKeyDown}
                                        onPaste={handleOtpPaste}
                                        className={`bg-white border-[1.5px] rounded-[4px] h-[42px] px-[14px] text-[16px] outline-none transition-all duration-200 focus:border-market-primary focus:ring-[3px] focus:ring-market-primary/15 placeholder:text-[#A8A29E] text-[#1C1917] tracking-widest ${errors.otp ? "border-market-error" : "border-[#D6D3D1]"}`}
                                        {...register("otp", {
                                            required: tAuth("resetPasswordOtpRequired"),
                                            pattern: {
                                                value: /^[0-9]{6}$/,
                                                message: tAuth("resetPasswordOtpInvalid"),
                                            },
                                            onChange: (e) => {
                                                const sanitized = e.target.value.replace(/\D/g, "").slice(0, 6);
                                                e.target.value = sanitized;
                                                setValue("otp", sanitized, { shouldValidate: true, shouldDirty: true });
                                            },
                                        })}
                                    />
                                    {errors.otp && (
                                        <p className="text-market-error text-[12px] mt-1.5">{errors.otp.message}</p>
                                    )}
                                </div>

                                {/* Root error */}
                                {errors.root && (
                                    <div className="bg-[#FEE2E2] text-[#991B1B] p-3 rounded-[4px] text-[14px] mb-6 text-center border border-market-error/20">
                                        {errors.root.message}
                                    </div>
                                )}

                                {/* New Password input (Bug C) */}
                                <div className="flex flex-col mb-4">
                                    <label className="text-[13px] font-semibold text-[#1C1917] mb-2">
                                        {tAuth("resetPasswordNewPasswordLabel")}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder={tAuth("resetPasswordNewPasswordPlaceholder")}
                                            className={`bg-white border-[1.5px] rounded-[4px] h-[42px] pl-[14px] pr-10 text-[16px] outline-none transition-all duration-200 focus:border-market-primary focus:ring-[3px] focus:ring-market-primary/15 placeholder:text-[#A8A29E] text-[#1C1917] w-full [&::-ms-reveal]:hidden [&::-ms-clear]:hidden ${errors.newPassword ? "border-market-error" : "border-[#D6D3D1]"}`}
                                            {...register("newPassword", {
                                                required: tAuth("resetPasswordNewPasswordRequired"),
                                                minLength: { value: 6, message: tAuth("resetPasswordNewPasswordMin") },
                                            })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword((prev) => !prev)}
                                            aria-label={showNewPassword ? tAuth("hidePasswordLabel") : tAuth("showPasswordLabel")}
                                            className="absolute right-0 top-0 h-[42px] px-3 flex items-center justify-center text-[#A8A29E] hover:text-[#57534E] focus:outline-none focus-visible:text-market-primary transition-colors cursor-pointer"
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="w-5 h-5" aria-hidden="true" />
                                            ) : (
                                                <Eye className="w-5 h-5" aria-hidden="true" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.newPassword && (
                                        <p className="text-market-error text-[12px] mt-1.5">{errors.newPassword.message}</p>
                                    )}
                                </div>

                                {/* Confirm Password input (Bug C) */}
                                <div className="flex flex-col mb-6">
                                    <label className="text-[13px] font-semibold text-[#1C1917] mb-2">
                                        {tAuth("resetPasswordConfirmPasswordLabel")}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder={tAuth("resetPasswordConfirmPasswordPlaceholder")}
                                            className={`bg-white border-[1.5px] rounded-[4px] h-[42px] pl-[14px] pr-10 text-[16px] outline-none transition-all duration-200 focus:border-market-primary focus:ring-[3px] focus:ring-market-primary/15 placeholder:text-[#A8A29E] text-[#1C1917] w-full [&::-ms-reveal]:hidden [&::-ms-clear]:hidden ${errors.confirmPassword ? "border-market-error" : "border-[#D6D3D1]"}`}
                                            {...register("confirmPassword", {
                                                required: tAuth("resetPasswordConfirmPasswordRequired"),
                                                validate: (value) => value === currentPassword || tAuth("resetPasswordConfirmPasswordMismatch"),
                                            })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            aria-label={showConfirmPassword ? tAuth("hideConfirmPasswordLabel") : tAuth("showConfirmPasswordLabel")}
                                            className="absolute right-0 top-0 h-[42px] px-3 flex items-center justify-center text-[#A8A29E] hover:text-[#57534E] focus:outline-none focus-visible:text-market-primary transition-colors cursor-pointer"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-5 h-5" aria-hidden="true" />
                                            ) : (
                                                <Eye className="w-5 h-5" aria-hidden="true" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-market-error text-[12px] mt-1.5">{errors.confirmPassword.message}</p>
                                    )}
                                </div>

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    id="btn-reset-password"
                                    className="w-full bg-market-primary text-white font-semibold text-[15px] h-[42px] rounded-[4px] border border-market-primary cursor-pointer transition-colors duration-200 hover:bg-[#9A3412] hover:border-[#9A3412] active:bg-[#7C2D12] disabled:opacity-40 disabled:cursor-not-allowed mb-6"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? tAuth("resetPasswordSubmitting") : tAuth("resetPasswordSubmit")}
                                </button>

                                {/* Back link */}
                                <div className="text-center text-[14px] text-[#57534E]">
                                    <Link to="/forgot-password" className="font-semibold text-market-primary hover:text-[#9A3412] transition-colors">
                                        {tAuth("resetPasswordBackToEmail")}
                                    </Link>
                                </div>

                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ResetPasswordPage;
