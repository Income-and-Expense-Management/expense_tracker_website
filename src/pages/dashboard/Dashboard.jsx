const Dashboard = () => {
  return (
    <div className="flex flex-col gap-6">
      
      {/* ============================================================== */}
      {/* HÀNG 1: Tổng quan, Danh mục chi tiêu, Danh sách ví (Chia 3 cột) */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CỘT 1: Tổng quan Thu/Chi */}
        <div className="bg-white border border-[#E0E4E8] rounded-[12px] p-6 flex flex-col justify-between">
          <h3 className="font-semibold text-gray-800 mb-4 text-base">Tổng quan Thu/Chi</h3>
          
          <div className="flex flex-col items-center justify-center py-4">
            {/* Vòng tròn biểu đồ đơn giản bằng Border */}
            {/* Màu Xanh lá cho tổng quát, Màu Vàng cho phần chi */}
            <div className="w-32 h-32 rounded-full border-[16px] border-green-500 border-t-yellow-400 border-l-yellow-400 flex items-center justify-center mb-6">
               <div className="flex flex-col items-center">
                 <span className="text-xl font-bold text-gray-800">55%</span>
               </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 mb-1">Tổng tiền đã chi</p>
              <p className="text-2xl font-bold text-gray-800">12,500,000 ₫</p>
            </div>
          </div>
          
          {/* Chú thích màu sắc */}
          <div className="flex justify-center gap-6 mt-2 pt-4 border-t border-[#E0E4E8]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-sm font-medium text-gray-600">Thu</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
              <span className="text-sm font-medium text-gray-600">Chi</span>
            </div>
          </div>
        </div>

        {/* CỘT 2: Chi tiêu theo danh mục (Top 4) */}
        <div className="bg-white border border-[#E0E4E8] rounded-[12px] p-6">
          <h3 className="font-semibold text-gray-800 mb-6 text-base">Chi tiêu theo danh mục</h3>
          <div className="space-y-5">
            {/* Item 1 */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Ăn uống</span>
                <span className="text-gray-500 font-medium">45%</span>
              </div>
              <div className="w-full h-2.5 bg-[#F4F6F8] rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 w-[45%]"></div>
              </div>
            </div>
            {/* Item 2 */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Mua sắm</span>
                <span className="text-gray-500 font-medium">25%</span>
              </div>
              <div className="w-full h-2.5 bg-[#F4F6F8] rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 w-[25%]"></div>
              </div>
            </div>
            {/* Item 3 */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Di chuyển</span>
                <span className="text-gray-500 font-medium">20%</span>
              </div>
              <div className="w-full h-2.5 bg-[#F4F6F8] rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 w-[20%]"></div>
              </div>
            </div>
            {/* Item 4 */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Khác</span>
                <span className="text-gray-500 font-medium">10%</span>
              </div>
              <div className="w-full h-2.5 bg-[#F4F6F8] rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 w-[10%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT 3: Danh sách Ví */}
        <div className="bg-white border border-[#E0E4E8] rounded-[12px] p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-semibold text-gray-800 text-base">Danh sách Ví</h3>
             <button className="text-sm font-medium text-green-600 hover:text-green-700">+ Thêm</button>
          </div>
          
          <div className="space-y-4 flex-1">
            {/* Thẻ Ví 1 */}
            <div className="border border-[#E0E4E8] rounded-[12px] p-4 bg-[#F4F6F8] hover:border-green-400 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold border border-green-200">
                  TM
                </div>
                <h4 className="font-medium text-gray-700">Tiền mặt</h4>
              </div>
              <p className="text-2xl font-bold text-gray-800 ml-11">5,500,000 ₫</p>
            </div>

            {/* Thẻ Ví 2 */}
            <div className="border border-[#E0E4E8] rounded-[12px] p-4 bg-[#F4F6F8] hover:border-green-400 transition-colors cursor-pointer">
               <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold border border-yellow-200">
                  CR
                </div>
                <h4 className="font-medium text-gray-700">Thẻ tín dụng</h4>
              </div>
              <p className="text-2xl font-bold text-gray-800 ml-11">- 2,000,000 ₫</p>
            </div>
          </div>
        </div>

      </div>


      {/* ============================================================== */}
      {/* HÀNG 2: Biểu đồ cột và Tiến độ ngân sách (Chia 2 cột theo tỷ lệ 2:1) */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CỘT 1 (Chiếm 2/3 không gian): Biểu đồ so sánh Thu/Chi */}
        <div className="lg:col-span-2 bg-white border border-[#E0E4E8] rounded-[12px] p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-semibold text-gray-800 text-base">So sánh Thu / Chi</h3>
            <div className="text-sm font-medium text-gray-600 border border-[#E0E4E8] bg-[#F4F6F8] px-3 py-1.5 rounded-[12px]">
              Tuần này
            </div>
          </div>
          
          {/* Biểu đồ cột trực quan dựa trên Grid layout */}
          <div className="flex-1 min-h-[220px] flex items-end justify-between gap-2 border-b border-[#E0E4E8] pb-1 relative mt-4">
             {/* Các đường gióng ngang (Guides) */}
             <div className="absolute inset-0 flex flex-col justify-between z-0 pointer-events-none">
               <div className="border-b border-[#E0E4E8] border-dashed w-full h-[25%] opacity-60"></div>
               <div className="border-b border-[#E0E4E8] border-dashed w-full h-[25%] opacity-60"></div>
               <div className="border-b border-[#E0E4E8] border-dashed w-full h-[25%] opacity-60"></div>
               <div className="border-b border-[#E0E4E8] border-dashed w-full h-[25%] opacity-60"></div>
             </div>

             {/* DATA BARS */}
             {[
               { day: 'Mon', in: '60%', out: '30%' },
               { day: 'Tue', in: '45%', out: '50%' },
               { day: 'Wed', in: '80%', out: '20%' },
               { day: 'Thu', in: '30%', out: '65%' },
               { day: 'Fri', in: '55%', out: '40%' },
               { day: 'Sat', in: '100%', out: '80%' },
               { day: 'Sun', in: '20%', out: '35%' }
             ].map((item, index) => (
                <div key={index} className="flex-1 flex justify-center gap-1.5 z-10 h-full items-end">
                  {/* Cột màu xanh (Thu nhập) */}
                  <div className="w-1/3 max-w-[20px] bg-green-500 rounded-t-[4px] hover:opacity-80 transition-opacity" style={{ height: item.in }}></div>
                  {/* Cột màu vàng (Chi tiêu) */}
                  <div className="w-1/3 max-w-[20px] bg-yellow-400 rounded-t-[4px] hover:opacity-80 transition-opacity" style={{ height: item.out }}></div>
                </div>
             ))}
          </div>

          {/* Nhãn trục X (Các ngày) */}
          <div className="flex justify-between mt-3 px-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="flex-1 text-center text-xs font-medium text-gray-500">{day}</div>
            ))}
          </div>
        </div>

        {/* CỘT 2 (Chiếm 1/3 không gian): Tiến độ Ngân sách */}
        <div className="bg-white border border-[#E0E4E8] rounded-[12px] p-6">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-semibold text-gray-800 text-base">Tiến độ Ngân sách</h3>
             <button className="text-sm font-medium text-green-600 hover:text-green-700">Tất cả</button>
          </div>

          <div className="space-y-6">
            
            {/* Ngân sách 1: Ăn uống */}
            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="font-medium text-gray-800">Ăn uống gia đình</span>
                <span className="text-sm font-semibold text-gray-700">8tr <span className="text-gray-400 font-normal">/ 10tr</span></span>
              </div>
              <div className="text-xs font-medium text-gray-400 mb-2">01/04 - 30/04</div>
              <div className="w-full h-3 bg-[#F4F6F8] border border-[#E0E4E8] rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[80%] rounded-r-full"></div>
              </div>
            </div>

            {/* Ngân sách 2: Trang phục */}
            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="font-medium text-gray-800">Trang phục</span>
                <span className="text-sm font-semibold text-yellow-600">2tr <span className="text-gray-400 font-normal">/ 2tr</span></span>
              </div>
              <div className="text-xs font-medium text-gray-400 mb-2">01/04 - 30/04</div>
              <div className="w-full h-3 bg-[#F4F6F8] border border-[#E0E4E8] rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 w-[100%] rounded-r-full"></div>
              </div>
            </div>

            {/* Ngân sách 3: Giải trí */}
            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="font-medium text-gray-800">Giải trí cuối tuần</span>
                <span className="text-sm font-semibold text-gray-700">1tr <span className="text-gray-400 font-normal">/ 3tr</span></span>
              </div>
              <div className="text-xs font-medium text-gray-400 mb-2">01/04 - 30/04</div>
              <div className="w-full h-3 bg-[#F4F6F8] border border-[#E0E4E8] rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[33%] rounded-r-full"></div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
