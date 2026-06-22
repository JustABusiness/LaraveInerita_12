import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import CustomCard from '@/components/ui/custom-card';
import CustomNotice from '@/components/ui/custom-notice';
import CustomPageHeading from '@/components/ui/customer-page-heading';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import AppLayout from '@/layouts/app-layout';
import api from '@/lib/api';
import { dashboard } from '@/routes/index';
import { IDateTime, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ImagePlus, Loader2, LoaderCircle, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Nhóm Bài Viết',
        href: '/post_catalogue',
    },
];

export interface PostCatalogue extends IDateTime {
    id: number;
    name: string;
    canonical: string;
    image: string;
    description: string;
}

interface PostCatalogueSaveProps {
    id?: string;
}

export default function PostCatalogueSave({ id }: PostCatalogueSaveProps) {
    const isEdit = !!id;
    const [loading, setLoading] = useState(isEdit);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<{
        name: string;
        canonical: string;
        description: string;
        image: string | File | null;
    }>({
        name: '',
        canonical: '',
        description: '',
        image: null,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEdit) {
            const fetchData = async () => {
                try {
                    const response = await api.get(`/post_catalogue/${id}`);
                    if (response.data.status === 'success') {
                        const { name, canonical, description, image } =
                            response.data.data;
                        setFormData({ name, canonical, description, image });
                        if (image) {
                            setImagePreview(image);
                        }
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData((prev) => ({ ...prev, image: null }));
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent, redirectAfter = false) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const data = new FormData();
        data.append('name', formData.name);
        data.append('canonical', formData.canonical);
        data.append('description', formData.description);
        if (formData.image instanceof File) {
            data.append('image', formData.image);
        }

        // For PUT requests with files in Laravel, we often need to use POST with _method=PUT
        if (isEdit) {
            data.append('_method', 'PUT');
        }

        try {
            const response = isEdit
                ? await api.post(`/post_catalogue/${id}`, data, {
                      headers: { 'Content-Type': 'multipart/form-data' },
                  })
                : await api.post('/post_catalogue', data, {
                      headers: { 'Content-Type': 'multipart/form-data' },
                  });

            if (response.data.status === 'success') {
                toast.success(
                    isEdit ? 'Cập nhật thành công' : 'Thêm mới thành công',
                );
                if (redirectAfter) {
                    router.visit('/post_catalogue');
                } else if (!isEdit) {
                    setFormData({ name: '', canonical: '', description: '', image: null });
                    setImagePreview(null);
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
            <Head title={isEdit ? `Sửa: ${formData.name}` : 'Thêm mới nhóm bài viết'} />
            <div className="page-wrapper flex h-full flex-1 flex-col gap-4 overflow-x-auto bg-zinc-50/50">
                <CustomPageHeading
                    heading={isEdit ? 'Cập nhật nhóm bài viết' : 'Thêm mới nhóm bài viết'}
                    breadcrumbs={breadcrumbs}
                />
                <div className="page-container px-6 pb-10">
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 lg:col-span-4">
                            <CustomNotice />
                            
                            <CustomCard
                                isShowHeader={true}
                                title="Ảnh đại diện"
                                description="Tải lên ảnh đại diện của nhóm bài viết"
                                className="mt-6 border-zinc-200 bg-white shadow-sm"
                            >
                                <div className="flex flex-col items-center justify-center">
                                    <div 
                                        className="relative flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 transition-colors hover:bg-zinc-100"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {imagePreview ? (
                                            <>
                                                <img 
                                                    src={imagePreview} 
                                                    alt="Preview" 
                                                    className="h-full w-full object-contain p-2"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeImage();
                                                    }}
                                                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-md hover:bg-rose-600"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <ImagePlus className="mb-2 h-10 w-10 text-zinc-400" />
                                                <span className="text-sm text-zinc-500">Click để tải ảnh lên</span>
                                            </div>
                                        )}
                                    </div>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <InputError message={errors.image} className="mt-2" />
                                </div>
                            </CustomCard>
                        </div>
                        <div className="col-span-12 lg:col-span-8">
                            <form onSubmit={(e) => handleSubmit(e, false)}>
                                <CustomCard
                                    isShowHeader={true}
                                    title="Thông tin chung"
                                    description="Nhập đầy đủ các thông tin dưới đây để quản lý nhóm bài viết"
                                    className="border-zinc-200 bg-white shadow-sm"
                                >
                                    <div className="mb-[24px] grid grid-cols-2 gap-6">
                                        <div className="col-span-1">
                                            <Label
                                                htmlFor="name"
                                                className="mb-[10px] text-[13px] font-semibold text-zinc-700"
                                            >
                                                Tên nhóm{' '}
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
                                                placeholder="Nhập tên nhóm bài viết..."
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
                                                Đường dẫn (Slug){' '}
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
                                                placeholder="Nhập đường dẫn tĩnh..."
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
                                        <div className="prose prose-sm max-w-none rounded-[5px] border border-zinc-200 text-black">
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={formData.description}
                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    setFormData((prev) => ({ ...prev, description: data }));
                                                    if (errors.description) {
                                                        setErrors((prev) => {
                                                            const newErrors = { ...prev };
                                                            delete newErrors.description;
                                                            return newErrors;
                                                        });
                                                    }
                                                }}
                                            />
                                        </div>
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
