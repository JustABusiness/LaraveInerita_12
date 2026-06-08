import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import CustomCard from '@/components/ui/custom-card';
import CustomPageHeading from '@/components/ui/customer-page-heading';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/index';
import { type BreadcrumbItem, type PageConfig } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { PlusCircle, Pencil, Trash2, Loader2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Danh sách thành viên',
        href: '/user',
    },
];

const pageHeading: PageConfig = {
    module: 'user',
    heading: 'Danh sách thành viên',
    cardHeading: 'Bảng quản lý danh sách thành viên',
    cardDescription:
        'Quản lý thông tin danh sách thành viên, sử dụng các chức năng để lọc dữ liệu',
};

interface User {
    id: number;
    name: string;
    email: string;
    publish?: number;
    birthday?: string;
    created_at: string;
}

export default function UserIndex() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async (searchQuery = '') => {
        try {
            setLoading(true);
            const response = await api.get('/user', {
                params: {
                    keyword: searchQuery || undefined
                }
            });
            if (response.data.status === 'success') {
                setUsers(response.data.data.data || []);
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
            const response = await api.delete(`/user/${id}`);
            if (response.data.status === 'success') {
                toast.success('Xoá bản ghi thành công');
                fetchUsers(searchTerm);
            }
        } catch (error) {
            toast.error('Xoá bản ghi thất bại');
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === users.length && users.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(users.map(item => item.id));
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Bạn có chắc chắn muốn xoá ${selectedIds.length} bản ghi đã chọn?`)) return;

        try {
            const response = await api.post(`/user/bulk-destroy`, {
                ids: selectedIds,
            });
            if (response.data.status === 'success' || response.data.status === true) {
                toast.success('Xoá các bản ghi thành công');
                setSelectedIds([]);
                fetchUsers(searchTerm);
            }
        } catch (error) {
            toast.error('Xoá các bản ghi thất bại');
            console.error(error);
        }
    };

    const handleStatusChange = async (id: number, currentValue: number) => {
        const newValue = currentValue === 1 ? 2 : 1;
        try {
            const response = await api.post('/user/change-status', {
                id: id,
                value: newValue,
                field: 'publish'
            });
            if (response.data.status === 'success') {
                toast.success('Cập nhật trạng thái thành công');
                setUsers(prev => prev.map(user => 
                    user.id === id ? { ...user, publish: newValue } : user
                ));
            }
        } catch (error) {
            toast.error('Cập nhật trạng thái thất bại');
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchUsers(searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Quản lý thành viên" />
            <div className="page-wrapper flex h-full flex-1 flex-col gap-4 overflow-x-auto bg-zinc-50/50">
                <CustomPageHeading heading="" breadcrumbs={breadcrumbs} />

                <div className="page-container px-6 pb-10">
                    <CustomCard
                        isShowHeader={true}
                        isShowFooter={false}
                        title={pageHeading.cardHeading}
                        description={pageHeading.cardDescription}
                        className="bg-white border-zinc-200 shadow-sm"
                    >
                        <div className="mb-[20px] flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-sm font-medium text-zinc-500 min-w-[120px]"> 
                                    {loading ? 'Đang tải...' : `Tổng số: ${users.length} bản ghi`}
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                                    <Input
                                        type="text"
                                        placeholder="Tìm kiếm theo tên, email..."
                                        className="w-[300px] pl-9 text-black"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {selectedIds.length > 0 && (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-9 rounded-[5px] text-rose-600 border-rose-200 hover:bg-rose-50"
                                        onClick={handleBulkDelete}
                                    >
                                        Xoá {selectedIds.length} mục đã chọn
                                    </Button>
                                )}
                                <Link
                                    href={`/${pageHeading.module}/create`}
                                >
                                    <Button className="cursor-pointer rounded-[5px] bg-[#ed5565] text-white shadow-sm hover:bg-[#ed5565]/90 border-none px-4">
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
                                        <th className="h-12 px-4 text-center align-middle w-12">
                                            <Checkbox 
                                                checked={users.length > 0 && selectedIds.length === users.length}
                                                onCheckedChange={toggleSelectAll}
                                            />
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-bold text-zinc-900 uppercase tracking-wider text-[11px] w-16">ID</th>
                                        <th className="h-12 px-4 text-left align-middle font-bold text-zinc-900 uppercase tracking-wider text-[11px]">Tên thành viên</th>
                                        <th className="h-12 px-4 text-left align-middle font-bold text-zinc-900 uppercase tracking-wider text-[11px]">Email</th>
                                        <th className="h-12 px-4 text-left align-middle font-bold text-zinc-900 uppercase tracking-wider text-[11px]">Ngày sinh</th>
                                        <th className="h-12 px-4 text-left align-middle font-bold text-zinc-900 uppercase tracking-wider text-[11px]">Trạng thái</th>
                                        <th className="h-12 px-4 text-left align-middle font-bold text-zinc-900 uppercase tracking-wider text-[11px]">Ngày tạo</th>
                                        <th className="h-12 px-4 text-right align-middle font-bold text-zinc-900 uppercase tracking-wider text-[11px] w-24">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="p-20 text-center bg-white">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                                                    <span className="text-zinc-400 text-sm">Đang tải dữ liệu...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : users.length > 0 ? (
                                        users.map((item) => (
                                            <tr key={item.id} className="border-b border-zinc-100 transition-colors hover:bg-zinc-50/50 bg-white">
                                                <td className="p-4 text-center align-middle">
                                                    <Checkbox 
                                                        checked={selectedIds.includes(item.id)}
                                                        onCheckedChange={() => toggleSelect(item.id)}
                                                    />
                                                </td>
                                                <td className="p-4 align-middle font-medium text-zinc-900">{item.id}</td>
                                                <td className="p-4 align-middle text-zinc-700 font-medium">{item.name}</td>
                                                <td className="p-4 align-middle text-zinc-600">{item.email}</td>
                                                <td className="p-4 align-middle text-zinc-600">{item.birthday || '---'}</td>
                                                <td className="p-4 align-middle text-zinc-600">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusChange(item.id, item.publish || 2)}
                                                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                            item.publish === 1 ? 'bg-indigo-600' : 'bg-zinc-200'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                                item.publish === 1 ? 'translate-x-4' : 'translate-x-0'
                                                            }`}
                                                        />
                                                    </button>
                                                </td>
                                                <td className="p-4 align-middle text-zinc-500">{item.created_at}</td>
                                                <td className="p-4 align-middle text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Link href={`/${pageHeading.module}/${item.id}/edit`}>
                                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-full transition-colors">
                                                                <Pencil className="h-4.5 w-4.5" />
                                                            </Button>
                                                        </Link>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-9 w-9 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full transition-colors"
                                                            onClick={() => handleDelete(item.id)}
                                                        >
                                                            <Trash2 className="h-4.5 w-4.5" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="p-20 text-center text-zinc-400 bg-white italic">
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
