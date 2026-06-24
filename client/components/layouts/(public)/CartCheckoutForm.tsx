"use client";

interface CartCheckoutFormProps {
  shippingName: string;
  setShippingName: (val: string) => void;
  shippingPhone: string;
  setShippingPhone: (val: string) => void;
  shippingAddress: string;
  setShippingAddress: (val: string) => void;
  paymentMethod: string;
  setPaymentMethod: (val: string) => void;
  cartTotal: number;
  isSubmitting: boolean;
  checkoutError: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onBackToCart: () => void;
}

export default function CartCheckoutForm({
  shippingName,
  setShippingName,
  shippingPhone,
  setShippingPhone,
  shippingAddress,
  setShippingAddress,
  paymentMethod,
  setPaymentMethod,
  cartTotal,
  isSubmitting,
  checkoutError,
  onSubmit,
  onBackToCart,
}: CartCheckoutFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-5 flex flex-col justify-between">
      <div className="flex flex-col gap-5">
        {checkoutError && (
          <div className="p-3 bg-[#D12052]/10 border-2 border-[#D12052] text-[#D12052] text-xs font-bold rounded-xl">
            ⚠️ {checkoutError}
          </div>
        )}

        {/* Delivery Details */}
        <div className="flex flex-col gap-3.5">
          <h5 className="text-[10px] font-black uppercase tracking-wider text-[#111111]">Thông Tin Nhận Hàng</h5>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">
              Họ và tên người nhận
            </label>
            <input
              type="text"
              required
              value={shippingName}
              onChange={(e) => setShippingName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">Số điện thoại</label>
            <input
              type="tel"
              required
              value={shippingPhone}
              onChange={(e) => setShippingPhone(e.target.value)}
              placeholder="09XXXXXXXX"
              className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">Địa chỉ nhận hàng</label>
            <textarea
              required
              rows={2}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
              className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa] resize-none"
            />
          </div>
        </div>

        {/* Payment selection */}
        <div className="flex flex-col gap-2">
          <h5 className="text-[10px] font-black uppercase tracking-wider text-[#111111]">Thanh Toán</h5>
          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => setPaymentMethod("COD")}
              className={`border-2 rounded-xl p-2.5 flex items-center gap-2 cursor-pointer transition-all ${
                paymentMethod === "COD" ? "border-[#03AED2] bg-[#03AED2]/5 font-bold" : "border-[#111111] hover:bg-neutral-50"
              }`}
            >
              <input type="radio" checked={paymentMethod === "COD"} readOnly className="accent-[#03AED2]" />
              <span className="text-[10px] uppercase tracking-wider">COD</span>
            </div>
            <div
              onClick={() => setPaymentMethod("MOMO")}
              className={`border-2 rounded-xl p-2.5 flex items-center gap-2 cursor-pointer transition-all ${
                paymentMethod === "MOMO" ? "border-[#03AED2] bg-[#03AED2]/5 font-bold" : "border-[#111111] hover:bg-neutral-50"
              }`}
            >
              <input type="radio" checked={paymentMethod === "MOMO"} readOnly className="accent-[#03AED2]" />
              <span className="text-[10px] uppercase tracking-wider">MoMo</span>
            </div>
          </div>
        </div>

        {/* Bill Details */}
        <div className="border-t border-[#111111]/10 pt-4 flex flex-col gap-2">
          <div className="flex justify-between text-xs font-bold text-gray-500">
            <span>Tiền sản phẩm:</span>
            <span>{cartTotal.toLocaleString("vi-VN")}đ</span>
          </div>
          <div className="flex justify-between text-xs font-bold text-gray-500">
            <span>Phí vận chuyển:</span>
            <span>30.000đ</span>
          </div>
          <div className="flex justify-between text-sm font-extrabold text-[#111111] border-t border-[#111111] pt-2">
            <span>TỔNG THANH TOÁN:</span>
            <span>{(cartTotal + 30000).toLocaleString("vi-VN")}đ</span>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onBackToCart}
          className="flex-1 py-3 border-2 border-[#111111] text-[#111111] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-50 cursor-pointer text-center"
        >
          Quay lại giỏ
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 bg-[#D12052] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            "Đặt Hàng"
          )}
        </button>
      </div>
    </form>
  );
}
