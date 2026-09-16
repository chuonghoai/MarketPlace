export const Footer = () => {
  return (
    <footer className="bg-market-background border-t border-[#E7E5E4] pt-16 pb-8 text-[#57534E] font-['Open_Sans',sans-serif]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

        <div className="col-span-1 md:col-span-2">
          <h3 className="font-['Lora',serif] text-[22px] font-semibold text-[#1C1917] mb-4">MarketNest</h3>
          <p className="text-[15px] leading-relaxed max-w-[400px]">
            Tôn vinh giá trị thủ công và những câu chuyện đằng sau mỗi tác phẩm. Nơi kết nối những tâm hồn yêu nghệ thuật và những bàn tay tài hoa trên toàn thế giới.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-[#1C1917] mb-4 text-[13px] uppercase tracking-[0.09em]">Khám phá</h4>
          <ul className="flex flex-col gap-3 text-[14px]">
            <li><a href="#" className="hover:text-market-primary transition-colors">Tác phẩm mới</a></li>
            <li><a href="#" className="hover:text-market-primary transition-colors">Gốm sứ & Điêu khắc</a></li>
            <li><a href="#" className="hover:text-market-primary transition-colors">Đồ da thủ công</a></li>
            <li><a href="#" className="hover:text-market-primary transition-colors">Nghệ nhân nổi bật</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[#1C1917] mb-4 text-[13px] uppercase tracking-[0.09em]">Hỗ trợ</h4>
          <ul className="flex flex-col gap-3 text-[14px]">
            <li><a href="#" className="hover:text-market-primary transition-colors">Trung tâm trợ giúp</a></li>
            <li><a href="#" className="hover:text-market-primary transition-colors">Vận chuyển & Trả hàng</a></li>
            <li><a href="#" className="hover:text-market-primary transition-colors">Trở thành người bán</a></li>
            <li><a href="#" className="hover:text-market-primary transition-colors">Chính sách bảo mật</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 pt-8 border-t border-[#D6D3D1] flex flex-col md:flex-row items-center justify-between text-[13px]">
        <p>© 2026 MarketNest. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0 font-medium">
          <span>Sáng tạo</span>
          <span>•</span>
          <span>Bền vững</span>
          <span>•</span>
          <span>Cộng đồng</span>
        </div>
      </div>
    </footer>
  );
};