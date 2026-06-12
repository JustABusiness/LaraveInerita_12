import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import CustomCard from '@/components/ui/custom-card';
import CustomPageHeading from '@/components/ui/customer-page-heading';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import api from '@/lib/api';
import { dashboard } from '@/routes/index';
import { type BreadcrumbItem, type PageConfig } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Loader2, Pencil, PlusCircle, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Danh sách quyền',
        href: '/permission',
    },
];

const pageHeading: PageConfig = {
    module: 'permission',
    heading: 'Danh sách quyền',
    cardHeading: 'Bảng quản lý danh sách quyền',
    cardDescription:
        'Quản lý thông tin danh sách quyền, sử dụng các chức năng để lọc dữ liệu',
};

interface Permission {
    id: number;
    name: string;
    canonical: string;
    description: string;
    publish: number;
    created_at: string;
}

export default function Dashboard() {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPermissions = async (searchQuery = '') => {
        try {
            setLoading(true);
            const response = await api.get(`/${pageHeading.module}`, {
                params: {
                    keyword: searchQuery || undefined,
                },
            });
            if (response.data.status === 'success') {
                setPermissions(response.data.data.data || []);
            }
        } catch (error) {
            toast.error('Không thể tải dữ liệu');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc chắn muốn xoá bản ghi này?')) return;

        try {
            const response = await api.delete(`/${pageHeading.module}/${id}`);
            if (response.data.status === 'success') {
                toast.success('Xoá bản ghi thành công');
                fetchPermissions(searchTerm);
            }
        } catch (error) {
            toast.error('Xoá bản ghi thất bại');
        }
    };

    const handleStatusChange = async (id: number, currentStatus: any) => {
        const normalizedStatus = Number(currentStatus);
        const newStatus = normalizedStatus === 1 ? 2 : 1;
        try {
            const response = await api.patch(`/${pageHeading.module}/${id}`, {
                publish: newStatus,
            });
            if (response.data.status === 'success') {
                toast.success('Cập nhật trạng thái thành công');
                setPermissions((prev) =>
                    prev.map((item) =>
                        item.id === id ? { ...item, publish: newStatus } : item,
                    ),
                );
            }
        } catch (error) {
            toast.error('Cập nhật trạng thái thất bại');
            console.error(error);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === permissions.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(permissions.map((item) => item.id));
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    };

    const handleBulkDelete = async () => {
        if (
            !confirm(
                `Bạn có chắc chắn muốn xoá ${selectedIds.length} bản ghi đã chọn?`,
            )
        )
            return;

        try {
            const response = await api.post(
                `/${pageHeading.module}/bulk-destroy`,
                {
                    ids: selectedIds,
                },
            );
            if (
                response.data.status === 'success' ||
                response.data.status === true
            ) {
                toast.success('Xoá các bản ghi thành công');
                setSelectedIds([]);
                fetchPermissions(searchTerm);
            }
        } catch (error) {
            toast.error('Xoá các bản ghi thất bại');
            console.error(error);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchPermissions(searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Quản lý quyền" />
            <div className="page-wrapper flex h-full flex-1 flex-col gap-4 overflow-x-auto bg-zinc-50/50">
                <CustomPageHeading heading="" breadcrumbs={breadcrumbs} />

                <div className="page-container px-6 pb-10">
                    <CustomCard
                        isShowHeader={true}
                        isShowFooter={false}
                        title={pageHeading.cardHeading}
                        description={pageHeading.cardDescription}
                        className="border-zinc-200 bg-white shadow-sm"
                    >
                        <div className="mb-[20px] flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="min-w-[120px] text-sm font-medium text-zinc-500">
                                    {loading
                                        ? 'Đang tải...'
                                        : `Tổng số: ${permissions.length} bản ghi`}
                                </div>
                                <div className="relative">
                                    <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-zinc-500" />
                                    <Input
                                        type="text"
                                        placeholder="Tìm kiếm theo tên, từ khoá..."
                                        className="w-[300px] pl-9 text-black"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {selectedIds.length > 0 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 rounded-[5px] border-rose-200 text-rose-600 hover:bg-rose-50"
                                        onClick={handleBulkDelete}
                                    >
                                        Xoá {selectedIds.length} mục đã chọn
                                    </Button>
                                )}
                                <Link href={`/${pageHeading.module}/create`}>
                                    <Button className="cursor-pointer rounded-[5px] border-none bg-[#ed5565] px-4 text-white shadow-sm hover:bg-[#ed5565]/90">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Thêm bản ghi mới
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
                            <table className="w-full text-sm">
                                <thead className="bg-zinc-50/80">
                                    <tr className="border-b border-zinc-200">
                                        <th className="h-12 px-4 text-center align-middle">
                                            <Checkbox
                                                checked={
                                                    permissions.length > 0 &&
                                                    selectedIds.length ===
                                                        permissions.length
                                                }
                                                onCheckedChange={
                                                    toggleSelectAll
                                                }
                                            />
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle text-[11px] font-bold tracking-wider text-zinc-900 uppercase">
                                            ID
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle text-[11px] font-bold tracking-wider text-zinc-900 uppercase">
                                            Tên quyền
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle text-[11px] font-bold tracking-wider text-zinc-900 uppercase">
                                            Từ khoá
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle text-[11px] font-bold tracking-wider text-zinc-900 uppercase">
                                            Mô tả
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle text-[11px] font-bold tracking-wider text-zinc-900 uppercase">
                                            Ngày tạo
                                        </th>
                                        <th className="h-12 px-4 text-center align-middle text-[11px] font-bold tracking-wider text-zinc-900 uppercase">
                                            Tình trạng
                                        </th>
                                        <th className="h-12 px-4 text-right align-middle text-[11px] font-bold tracking-wider text-zinc-900 uppercase">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="bg-white p-20 text-center"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                                                    <span className="text-sm text-zinc-400">
                                                        Đang tải dữ liệu...
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : permissions.length > 0 ? (
                                        permissions.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="border-b border-zinc-100 bg-white transition-colors hover:bg-zinc-50/50"
                                            >
                                                <td className="p-4 text-center align-middle">
                                                    <Checkbox
                                                        checked={selectedIds.includes(
                                                            item.id,
                                                        )}
                                                        onCheckedChange={() =>
                                                            toggleSelect(
                                                                item.id,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="p-4 align-middle font-medium text-zinc-900">
                                                    {item.id}
                                                </td>
                                                <td className="p-4 align-middle font-medium text-zinc-700">
                                                    {item.name}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <span className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-600 shadow-sm">
                                                        {item.canonical}
                                                    </span>
                                                </td>
                                                <td className="max-w-[200px] truncate p-4 align-middle text-zinc-500">
                                                    {item.description}
                                                </td>
                                                <td className="p-4 align-middle text-zinc-500">
                                                    {item.created_at}
                                                </td>
                                                <td className="p-4 text-center align-middle">
                                                    <button
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                item.id,
                                                                item.publish,
                                                            )
                                                        }
                                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:outline-none ${
                                                            Number(
                                                                item.publish,
                                                            ) === 1
                                                                ? 'bg-indigo-600'
                                                                : 'bg-zinc-200'
                                                        }`}
                                                    >
                                                        <span
                                                            aria-hidden="true"
                                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                                Number(
                                                                    item.publish,
                                                                ) === 1
                                                                    ? 'translate-x-5'
                                                                    : 'translate-x-0'
                                                            }`}
                                                        />
                                                    </button>
                                                </td>
                                                <td className="p-4 text-right align-middle">
                                                    <div className="flex justify-end gap-1">
                                                        <Link
                                                            href={`/${pageHeading.module}/${item.id}/edit`}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-9 w-9 rounded-full text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                                                            >
                                                                <Pencil className="h-4.5 w-4.5" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 rounded-full text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4.5 w-4.5" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="bg-white p-20 text-center text-zinc-400 italic"
                                            >
                                                Không có dữ liệu trong danh sách
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CustomCard>
                </div>
            </div>
        </AppLayout>
    );
}
