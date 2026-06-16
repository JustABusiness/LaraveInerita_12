import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import CustomCard from '@/components/ui/custom-card';
import CustomNotice from '@/components/ui/custom-notice';
import CustomPageHeading from '@/components/ui/customer-page-heading';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import api from '@/lib/api';
import { dashboard } from '@/routes/index';
import { IDateTime, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Loader2, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Quản lý ngôn ngữ',
        href: '/language',
    },
];

export interface Language extends IDateTime {
    id: number;
    name: string;
    canonical: string;
    description: string;
}

interface LanguageSaveProps {
    id?: string;
}

export default function LanguageSave({ id }: LanguageSaveProps) {
    const isEdit = !!id;
    const [loading, setLoading] = useState(isEdit);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        name: '',
        canonical: '',
        description: '',
    });

    useEffect(() => {
        if (isEdit) {
            const fetchData = async () => {
                try {
                    const response = await api.get(`/language/${id}`);
                    if (response.data.status === 'success') {
                        const { name, canonical, description } =
                            response.data.data;
                        setFormData({ name, canonical, description });
                    }
                } catch (error) {
                    toast.error('Không thể tải thông tin bản ghi');
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
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

    const handleSubmit = async (e: React.FormEvent, redirectAfter = false) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = isEdit
                ? await api.put(`/language/${id}`, formData)
                : await api.post('/language', formData);

            if (response.data.status === 'success') {
                toast.success(
                    isEdit ? 'Cập nhật thành công' : 'Thêm mới thành công',
                );
                if (redirectAfter) {
                    router.visit('/language');
                } else if (!isEdit) {
                    setFormData({ name: '', canonical: '', description: '' });
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
            <Head title={isEdit ? `Sửa: ${formData.name}` : 'Thêm mới ngôn ngữ'} />
            <div className="page-wrapper flex h-full flex-1 flex-col gap-4 overflow-x-auto bg-zinc-50/50">
                <CustomPageHeading
                    heading={isEdit ? 'Cập nhật ngôn ngữ' : 'Thêm mới ngôn ngữ'}
                    breadcrumbs={breadcrumbs}
                />
                <div className="page-container px-6 pb-10">
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 lg:col-span-4">
                            <CustomNotice />
                        </div>
                        <div className="col-span-12 lg:col-span-8">
                            <form onSubmit={(e) => handleSubmit(e, false)}>
                                <CustomCard
                                    isShowHeader={true}
                                    title="Thông tin chung"
                                    description="Nhập đầy đủ các thông tin dưới đây để quản lý ngôn ngữ"
                                    className="border-zinc-200 bg-white shadow-sm"
                                >
                                    <div className="mb-[24px] grid grid-cols-2 gap-6">
                                        <div className="col-span-1">
                                            <Label
                                                htmlFor="name"
                                                className="mb-[10px] text-[13px] font-semibold text-zinc-700"
                                            >
                                                Tên ngôn ngữ{' '}
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
                                                placeholder="Nhập tên ngôn ngữ..."
                                            />
                                            <InputError
                                                message={errors.name}
                                                className="mt-[5px]"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Label
                                                htmlFor="canonical"
                                                className="mb-[10px] text-[13px] font-semibold text-zinc-700"
                                            >
                                                Từ khoá{' '}
                                                <span className="text-rose-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="canonical"
                                                type="text"
                                                name="canonical"
                                                value={formData.canonical}
                                                onChange={handleChange}
                                                className="mt-1 block w-full rounded-[5px] border-zinc-200 text-black focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="Nhập từ khoá (ví dụ: vn, en)..."
                                            />
                                            <InputError
                                                message={errors.canonical}
                                                className="mt-[5px]"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-[24px]">
                                        <Label
                                            htmlFor="description"
                                            className="mb-[10px] text-[13px] font-semibold text-zinc-700"
                                        >
                                            Mô tả chi tiết
                                        </Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            className="min-h-[120px] rounded-[5px] border-zinc-200 text-black focus:border-indigo-500 focus:ring-indigo-500"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Nhập mô tả cho ngôn ngữ này..."
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
