const CustomNotice = () => {
    return (
        <div className="space-y-4">
            <h2 className="text-[18px] font-bold tracking-tight text-zinc-900 uppercase">
                Chú Ý
            </h2>
            <div className="space-y-2 text-sm font-medium text-zinc-500">
                <p>
                    Nhập đầy đủ các thông tin chi tiết để quản lý dữ liệu thành
                    viên một cách chính xác nhất.
                </p>
                <p>
                    Lưu ý: các trường đánh dấu{' '}
                    <span className="font-bold text-rose-500">(*)</span> là bắt
                    buộc.
                </p>
            </div>
        </div>
    );
};

export default CustomNotice;
