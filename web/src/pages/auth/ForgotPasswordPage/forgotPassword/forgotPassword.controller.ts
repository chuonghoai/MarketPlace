import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../../../features/auth/services/auth.service";
import { useToast } from "../../../../components/toast/toast";
import type { SendOtpForgotPasswordRequest } from "../../../../features/auth/dto/forgotPassword.type";

const authService = new AuthService();

export const useForgotPasswordController = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<SendOtpForgotPasswordRequest>({
        defaultValues: { email: "" },
    });

    const [otpCountdown, setOtpCountdown] = useState(0);
    const [isSendingOtp, setIsSendingOtp] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (otpCountdown > 0) {
            timer = setTimeout(() => setOtpCountdown((prev) => prev - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [otpCountdown]);

    const onSubmit = async (data: SendOtpForgotPasswordRequest) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(data.email)) {
            setError("email", { type: "manual", message: "Email không hợp lệ." });
            return;
        }
        clearErrors("email");
        setIsSendingOtp(true);

        try {
            setOtpCountdown(30);
            const result = await authService.sendOtpForgotPassword(data.email);
            if (result.success) {
                toast(`Mã OTP đã được gửi đến email: ${data.email}`, "success");
                navigate("/reset-password", { state: { email: data.email } });
            } else {
                toast(result.message, "error");
                setOtpCountdown(0);
                setError("email", { type: "manual", message: result.message });
            }
        } catch (error: unknown) {
            setOtpCountdown(0);
            setError("root", {
                type: "server",
                message: error instanceof Error ? error.message : "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.",
            });
        } finally {
            setIsSendingOtp(false);
        }
    };

    return {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        onSubmit,
        otpCountdown,
        isSendingOtp,
    };
};

