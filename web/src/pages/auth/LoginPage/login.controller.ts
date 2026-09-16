import { useForm } from "react-hook-form";
import { authService } from "../../../features/auth/services/auth.service";
import type { LoginRequest } from "../../../features/auth/dto/login.type";
import { useToast } from "../../../components/toast/toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { getDefaultRouteByRole } from "../../../utils/route.util";

export const useLoginController = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const reason = searchParams.get("reason");

    if (reason === "expired") {
      toast("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại", "error");
    } else if (reason === "unauthorized") {
      toast("Cần đăng nhập để thực hiện chức năng này", "warning");
    }

    if (reason) {
      searchParams.delete("reason");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, toast]);

  const onLogin = async (data: LoginRequest) => {
    try {
      const result = await authService.login(data);
      if (result.success) {
        toast("Đăng nhập thành công!", "success");
        const nextRoute = getDefaultRouteByRole(result.data.user.role);
        navigate(nextRoute);
      }
    } catch (error: any) {
      const apiErrorMsg = error.response?.data?.error?.message
        || error.response?.data?.message
        || "Tài khoản hoặc mật khẩu không đúng";
      toast(apiErrorMsg, "error");
      setError("root", {
        type: "server",
        message: apiErrorMsg,
      });
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onLogin,
  };
};