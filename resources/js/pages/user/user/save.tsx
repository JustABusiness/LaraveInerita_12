import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import CustomCard from '@/components/ui/custom-card';
import CustomNotice from '@/components/ui/custom-notice';
import CustomPageHeading from '@/components/ui/customer-page-heading';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import api from '@/lib/api';
import { dashboard } from '@/routes/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Calendar as CalendarIcon, Loader2, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Quản lý thành viên',
        href: '/user',
    },
];

interface UserSaveProps {
    id?: string;
}

export default function UserSave({ id }: UserSaveProps) {
    const isEdit = !!id;
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [userCatalogues, setUserCatalogues] = useState<any[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        user_catalogue_ids: [] as number[],
        publish: '1',
        address: '',
        birthday: '',
        description: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isEdit) {
                    const response = await api.get(`/user/${id}`);
                    if (response.data.status === 'success') {
                        const { user, user_catalogues } = response.data.data;
                        setUserCatalogues(user_catalogues || []);
                        setFormData({
                            name: user.name,
                            email: user.email,
                            password: '',
                            user_catalogue_ids:
                                user.user_catalogue?.map((c: any) => c.id) ||
                                [],
                            publish: user.publish?.toString() || '1',
                            address: user.address || '',
                            birthday: user.birthday || '',
                            description: user.description || '',
                        });
                    }
                } else {
                    const response = await api.get('/user', {
                        params: { type: 'all', get_catalogues: true },
                    });
                    if (response.data.status === 'success') {
                        setUserCatalogues(
                            response.data.data.user_catalogues || [],
                        );
                    }
                }
            } catch (error) {
                toast.error('Không thể tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isEdit]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleCatalogueToggle = (id: number) => {
        setFormData((prev) => {
            const currentIds = [...prev.user_catalogue_ids];
            const index = currentIds.indexOf(id);
            if (index > -1) {
                currentIds.splice(index, 1);
            } else {
                currentIds.push(id);
            }
            return { ...prev, user_catalogue_ids: currentIds };
        });

        if (errors.user_catalogue_ids) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.user_catalogue_ids;
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent, redirectAfter = false) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = isEdit
                ? await api.put(`/user/${id}`, formData)
                : await api.post('/user', formData);

            if (response.data.status === 'success') {
                toast.success(
                    isEdit ? 'Cập nhật thành công' : 'Thêm mới thành công',
                );
                if (redirectAfter) {
                    router.visit('/user');
                } else if (!isEdit) {
                    setFormData({
                        name: '',
                        email: '',
                        password: '',
                        user_catalogue_ids: [],
                        publish: '1',
                        address: '',
                        birthday: '',
                        description: '',
                    });
                }
            }
        } catch (error: any) {
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                const formattedErrors: Record<string, string> = {};
                Object.keys(validationErrors).forEach((key) => {
                    formattedErrors[key] = validationErrors[key][0];
                });
                setErrors(formattedErrors);
            } else {
                toast.error('Đã có lỗi xảy ra');
            }
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="flex h-full items-center justify-center p-20">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={isEdit ? `Sửa: ${formData.name}` : 'Thêm mới thành viên'}
            />
            <div className="page-wrapper flex h-full flex-1 flex-col gap-4 overflow-x-auto bg-zinc-50/50">
                <CustomPageHeading
                    heading={
                        isEdit ? 'Cập nhật thành viên' : 'Thêm mới thành viên'
                    }
                    breadcrumbs={breadcrumbs}
                />
                <div className="page-container px-6 pb-10">
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 lg:col-span-4">
                            <CustomNotice />

                            <CustomCard
                                isShowHeader={true}
                                title="Quyền nhóm thành viên"
                                description="Chọn các nhóm mà thành viên này thuộc về"
                                className="mt-6 border-zinc-200 bg-white shadow-sm"
                            >
                                <Label
                                    htmlFor="name"
                                    className="mb-[10px] text-[13px] font-semibold text-zinc-700"
                                >
                                    Cấp Quyền{' '}
                                    <span className="text-rose-500">*</span>
                                </Label>
                                <span className="text-rose-500"></span>
                                <div className="max-h-[400px] space-y-4 overflow-y-auto pr-2">
                                    {userCatalogues.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center space-x-3 rounded-md p-2 transition-colors hover:bg-zinc-50"
                                        >
                                            <Checkbox
                                                id={`cat-${item.id}`}
                                                checked={formData.user_catalogue_ids.includes(
                                                    item.id,
                                                )}
                                                onCheckedChange={() =>
                                                    handleCatalogueToggle(
                                                        item.id,
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor={`cat-${item.id}`}
                                                className="flex-1 cursor-pointer text-sm leading-none font-medium text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {item.name}
                                            </Label>
                                        </div>
                                    ))}
                                    {userCatalogues.length === 0 && (
                                        <div className="py-4 text-center text-sm text-zinc-400 italic">
                                            Chưa có nhóm thành viên nào
                                        </div>
                                    )}
                                </div>
                                <InputError
                                    message={errors.user_catalogue_ids}
                                    className="mt-4"
                                />
                            </CustomCard>
                        </div>
                        <div className="col-span-12 lg:col-span-8">
                            <form onSubmit={(e) => handleSubmit(e, false)}>
                                <CustomCard
                                    isShowHeader={true}
                                    title="Thông tin chung"
                                    description="Nhập đầy đủ các thông tin dưới đây để quản lý thành viên"
                                    className="border-zinc-200 bg-white shadow-sm"
                                >
                                    <div className="mb-[24px] grid grid-cols-2 gap-6">
                                        <div className="col-span-1">
                                            <Label
                                                htmlFor="name"
                                                className="mb-[10px] text-[13px] font-semibold text-zinc-700"
                                            >
                                                Tên thành viên{' '}
                                                <span className="text-rose-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                name="name"
                                                autoFocus
                                                autoComplete="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="mt-1 block w-full rounded-[5px] border-zinc-200 text-black focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="Nhập tên..."
                                            />
                                            <InputError
                                                message={errors.name}
                                                className="mt-[5px]"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Label
                                                htmlFor="email"
                                                className="mb-[10px] text-[13px] font-semibold text-zinc-700"
                                            >
                                                Email{' '}
                                                <span className="text-rose-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="mt-1 block w-full rounded-[5px] border-zinc-200 text-black focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="Nhập email..."
                                            />
                                            <InputError
                                                message={errors.email}
                                                className="mt-[5px]"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-[24px] grid grid-cols-2 gap-6">
                                        <div className="col-span-1">
                                            <Label
                                                htmlFor="birthday"
                                                className="mb-[10px] text-[13px] font-semibold text-zinc-700"
                                            >
                                                Ngày sinh
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="birthday"
                                                    type="date"
                                                    name="birthday"
                                                    value={formData.birthday}
                                                    onChange={handleChange}
                                                    onClick={(e) =>
                                                        (
                                                            e.target as any
                                                        ).showPicker?.()
                                                    }
                                                    className="mt-1 block w-full rounded-[5px] border-zinc-200 pr-10 text-black focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                                <CalendarIcon className="pointer-events-none absolute top-1/2 right-3 mt-0.5 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                            </div>
                                            <InputError
                                                message={errors.birthday}
                                                className="mt-[5px]"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Label
                                                htmlFor="address"
                                                className="mb-[10px] text-[13px] font-semibold text-zinc-700"
                                            >
                                                Địa chỉ
                                            </Label>
                                            <Input
                                                id="address"
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="mt-1 block w-full rounded-[5px] border-zinc-200 text-black focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="Nhập địa chỉ..."
                                            />
                                            <InputError
                                                message={errors.address}
                                                className="mt-[5px]"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-[24px] grid grid-cols-2 gap-6">
                                        <div className="col-span-1">
                                            <Label
                                                htmlFor="password"
                                                className="mb-[10px] text-[13px] font-semibold text-zinc-700"
                                            >
                                                Mật khẩu{' '}
                                                {!isEdit && (
                                                    <span className="text-rose-500">
                                                        *
                                                    </span>
                                                )}
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="mt-1 block w-full rounded-[5px] border-zinc-200 text-black focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder={
                                                    isEdit
                                                        ? 'Để trống nếu không muốn đổi mật khẩu'
                                                        : 'Nhập mật khẩu...'
                                                }
                                            />
                                            <InputError
                                                message={errors.password}
                                                className="mt-[5px]"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Label
                                                htmlFor="publish"
                                                className="mb-[10px] block text-[13px] font-semibold text-zinc-700"
                                            >
                                                Trạng thái hoạt động
                                            </Label>
                                            <div className="mt-1 flex h-10 items-center">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            publish:
                                                                prev.publish ===
                                                                '1'
                                                                    ? '2'
                                                                    : '1',
                                                        }))
                                                    }
                                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                        formData.publish === '1'
                                                            ? 'bg-indigo-600'
                                                            : 'bg-zinc-200'
                                                    }`}
                                                >
                                                    <span
                                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                            formData.publish ===
                                                            '1'
                                                                ? 'translate-x-5'
                                                                : 'translate-x-0'
                                                        }`}
                                                    />
                                                </button>
                                                <span className="ml-3 text-sm text-zinc-600">
                                                    {formData.publish === '1'
                                                        ? 'Đang hoạt động'
                                                        : 'Ngừng hoạt động'}
                                                </span>
                                            </div>
                                            <InputError
                                                message={errors.publish}
                                                className="mt-[5px]"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-[24px]">
                                        <Label
                                            htmlFor="description"
                                            className="mb-[10px] text-[13px] font-semibold text-zinc-700"
                                        >
                                            Ghi chú / Mô tả
                                        </Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-[5px] border-zinc-200 text-black text-zinc-600 focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Nhập ghi chú thêm..."
                                            rows={4}
                                        />
                                        <InputError
                                            message={errors.description}
                                            className="mt-[5px]"
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-3 border-t border-zinc-100 pt-4">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-10 min-w-[120px] cursor-pointer rounded-[5px] bg-zinc-900 font-medium text-white transition-all hover:bg-zinc-800"
                                        >
                                            {processing && !loading && (
                                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Lưu lại
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={(e) =>
                                                handleSubmit(e, true)
                                            }
                                            disabled={processing}
                                            className="h-10 min-w-[160px] cursor-pointer rounded-[5px] bg-indigo-600 font-medium text-white transition-all hover:bg-indigo-700"
                                        >
                                            {processing && (
                                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Lưu lại và đóng
                                        </Button>
                                    </div>
                                </CustomCard>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
