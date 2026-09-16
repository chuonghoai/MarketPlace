import { Link } from "react-router-dom";
import { useLoginController } from "./login.controller";

function LoginPage() {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onLogin
  } = useLoginController();

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 md:p-8 bg-market-background text-[#1C1917] font-['Open_Sans',sans-serif] overflow-hidden">

      {/* Background decorations*/}
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


      {/* Frame login input */}
      <div className="relative w-full max-w-[1024px] min-h-[600px] z-10 flex">
        <div className="absolute inset-0 bg-market-surface border border-[#E7E5E4] rounded-[12px] rotate-2 scale-[0.98] transition-transform duration-500 hover:rotate-3"></div>
        <div className="absolute inset-0 bg-market-background border border-[#E7E5E4] rounded-[12px] -rotate-1 scale-[0.99] transition-transform duration-500 hover:-rotate-2"></div>
        <div className="relative w-full bg-white border-2 border-[#D6D3D1] rounded-[12px] flex flex-col md:flex-row overflow-hidden shadow-none">

          {/* Left: Website introduction */}
          <div className="hidden md:flex w-1/2 flex-col justify-between p-12 bg-market-background border-r border-[#E7E5E4] relative overflow-hidden">
            <div className="relative z-10">
              <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
                <h2 className="font-['Lora',serif] text-[26px] font-semibold text-[#1C1917] mb-2 tracking-[-0.24px]">
                  MarketNest
                </h2>
              </Link>
              <div className="w-[40px] h-[2px] bg-market-primary mb-8"></div>

              <h1 className="font-['Lora',serif] text-[36px] font-semibold leading-tight tracking-[0.005em] text-[#1C1917] mb-6">
                Nơi mỗi sản phẩm <br /> kể một câu chuyện.
              </h1>
              <p className="text-[18px] text-[#57534E] leading-[1.6]">
                Khám phá những món đồ thủ công độc bản, mang đậm dấu ấn cá nhân từ các nghệ nhân trên toàn thế giới. Trải nghiệm không gian mua sắm đậm chất nghệ thuật và sự chân thật.
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


          {/* Right: Login form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
            <div className="w-full max-w-[360px] mx-auto relative z-10">

              {/* Mobile Back to Home */}
              <div className="block md:hidden mb-6 text-left">
                <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
                  <h2 className="font-['Lora',serif] text-[26px] font-semibold text-[#1C1917] mb-2 tracking-[-0.24px]">
                    MarketNest
                  </h2>
                </Link>
                <div className="w-10 h-0.5 bg-market-primary mb-8"></div>
              </div>

              <div className="mb-8 text-center md:text-left">
                <h2 className="font-['Lora',serif] text-[36px] font-semibold text-[#1C1917] mb-2">
                  Đăng nhập
                </h2>
                <p className="text-[14px] text-[#57534E]">
                  Chào mừng bạn quay trở lại với MarketNest.
                </p>
              </div>

              <form onSubmit={handleSubmit(onLogin)}>

                {/* Email input */}
                <div className="flex flex-col mb-4">
                  <label className="text-[13px] font-semibold text-[#1C1917] mb-2">Email hoặc Tên tài khoản</label>
                  <input
                    type="text"
                    placeholder="Nhập địa chỉ email..."
                    className={`bg-white border-[1.5px] rounded-[4px] h-[42px] px-[14px] text-[16px] outline-none transition-all duration-200 focus:border-market-primary focus:ring-[3px] focus:ring-market-primary/15 placeholder:text-[#A8A29E] text-[#1C1917] ${errors.email ? 'border-market-error' : 'border-[#D6D3D1]'
                      }`}
                    {...register("email", { required: "Email là bắt buộc" })}
                  />
                  {errors.email && (
                    <p className="text-market-error text-[12px] mt-1.5">{errors.email.message}</p>
                  )}
                </div>

                {/* Password input */}
                <div className="flex flex-col mb-2">
                  <label className="text-[13px] font-semibold text-[#1C1917] mb-2">Mật khẩu</label>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu..."
                    className={`bg-white border-[1.5px] rounded-[4px] h-[42px] px-[14px] text-[16px] outline-none transition-all duration-200 focus:border-market-primary focus:ring-[3px] focus:ring-market-primary/15 placeholder:text-[#A8A29E] text-[#1C1917] ${errors.password ? 'border-market-error' : 'border-[#D6D3D1]'
                      }`}
                    {...register("password", {
                      required: "Mật khẩu là bắt buộc",
                      minLength: { value: 3, message: "Mật khẩu phải ít nhất 3 ký tự" }
                    })}
                  />
                  {errors.password && (
                    <p className="text-market-error text-[12px] mt-1.5">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex justify-end mb-6">
                  <Link to="/forgot-password" className="text-[13px] font-semibold text-market-primary hover:text-[#9A3412] transition-colors">
                    Quên mật khẩu?
                  </Link>
                </div>

                {/* Root error */}
                {errors.root && (
                  <div className="bg-[#FEE2E2] text-[#991B1B] p-3 rounded-[4px] text-[14px] mb-6 text-center border border-market-error/20">
                    {errors.root.message}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-market-primary text-white font-semibold text-[15px] h-[42px] rounded-[4px] border border-market-primary cursor-pointer transition-colors duration-200 hover:bg-[#9A3412] hover:border-[#9A3412] active:bg-[#7C2D12] disabled:opacity-40 disabled:cursor-not-allowed mb-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
                </button>

                <div className="relative flex items-center justify-center mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E7E5E4]"></div>
                  </div>
                  <div className="relative bg-white px-4 text-[12px] font-medium text-[#A8A29E] uppercase tracking-[0.09em]">
                    Hoặc
                  </div>
                </div>

                {/* Login by google Google */}
                <button
                  type="button"
                  className="w-full bg-transparent text-[#57534E] border-[1.5px] border-[#D6D3D1] font-semibold text-[15px] h-[42px] rounded-[4px] flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200 hover:bg-market-background hover:border-market-primary hover:text-market-primary"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Đăng nhập bằng Google
                </button>

                {/* Register button */}
                <div className="mt-8 text-center text-[14px] text-[#57534E]">
                  Chưa có tài khoản?{' '}
                  <Link to="/register" className="font-semibold text-market-primary hover:text-[#9A3412] transition-colors">
                    Đăng ký ngay
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

export default LoginPage;