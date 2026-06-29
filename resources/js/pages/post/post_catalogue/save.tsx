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
import { ImagePlus, Loader2, LoaderCircle, X, UploadCloud } from 'lucide-react';
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
    description: string;
    meta_title: string;
    meta_keyword: string;
    meta_description: string;
    album: (string | File)[];
}

interface PostCatalogueSaveProps {
    id?: string;
}

class Base64UploadAdapter {
    loader: any;
    constructor(loader: any) {
        this.loader = loader;
    }
    upload() {
        return this.loader.file.then(
            (file: File) =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        resolve({ default: reader.result });
                    };
                    reader.onerror = (error) => reject(error);
                    reader.readAsDataURL(file);
                })
        );
    }
    abort() {}
}

function CustomUploadAdapterPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
        return new Base64UploadAdapter(loader);
    };
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
        meta_title: string;
        meta_keyword: string;
        meta_description: string;
        album: (string | File)[];
    }>({
        name: '',
        canonical: '',
        description: '',
        meta_title: '',
        meta_keyword: '',
        meta_description: '',
        album: [],
    });
    const [albumPreviews, setAlbumPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEdit) {
            const fetchData = async () => {
                try {
                    const response = await api.get(`/post_catalogue/${id}`);
                    if (response.data.status === 'success') {
                        const { name, canonical, description, meta_title, meta_keyword, meta_description, album } =
                            response.data.data;
                        const parsedAlbum = typeof album === 'string' ? JSON.parse(album) : (album || []);
                        setFormData({ name, canonical, description, meta_title: meta_title || '', meta_keyword: meta_keyword || '', meta_description: meta_description || '', album: parsedAlbum });
                        setAlbumPreviews(parsedAlbum);
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

    const handleAlbumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setFormData((prev) => ({ ...prev, album: [...prev.album, ...files] }));
            
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setAlbumPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeAlbumImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            album: prev.album.filter((_, i) => i !== index)
        }));
        setAlbumPreviews(prev => {
            const newPreviews = [...prev];
            if (newPreviews[index] && newPreviews[index].startsWith('blob:')) {
                URL.revokeObjectURL(newPreviews[index]);
            }
            newPreviews.splice(index, 1);
            return newPreviews;
        });
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
        data.append('meta_title', formData.meta_title);
        data.append('meta_keyword', formData.meta_keyword);
        data.append('meta_description', formData.meta_description);

        formData.album.forEach((file, index) => {
            if (file instanceof File) {
                data.append(`album[${index}]`, file);
            } else {
                data.append(`album[${index}]`, file);
            }
        });

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
                    setFormData({ name: '', canonical: '', description: '', meta_title: '', meta_keyword: '', meta_description: '', album: [] });
                    setAlbumPreviews([]);
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
                    <form onSubmit={(e) => handleSubmit(e, false)}>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12 lg:col-span-8">
                                <CustomNotice />
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
                                            <style>{`
                                                .ck-editor__editable_inline {
                                                    min-height: 300px;
                                                }
                                            `}</style>
                                            <CKEditor
                                                editor={ClassicEditor}
                                                config={{
                                                    extraPlugins: [CustomUploadAdapterPlugin],
                                                }}
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

                                </CustomCard>

                                <CustomCard
                                    isShowHeader={true}
                                    title="Cấu hình SEO"
                                    description="Bạn chưa có tiêu đề SEO cho trang này"
                                    className="border-zinc-200 bg-white shadow-sm mb-[24px] mt-6"
                                >
                                    <div className="mb-[24px] rounded-[5px] border border-zinc-200 bg-zinc-50 p-4">
                                        <div className="mb-1 text-[13px] text-zinc-500">
                                            http://yourdomain.com/{formData.canonical || 'duong-dan-cua-ban'}
                                        </div>
                                        <div className="cursor-pointer truncate text-[18px] text-blue-600 hover:underline">
                                            {formData.meta_title || formData.name || 'Tiêu đề trang SEO sẽ hiển thị ở đây'}
                                        </div>
                                        <div className="mt-1 line-clamp-2 text-[13px] text-zinc-600">
                                            {formData.meta_description || formData.description?.replace(/<[^>]*>?/gm, '') || 'Cung cấp một thẻ mô tả bằng cách sửa đổi đoạn trích dẫn bên dưới. Nếu bạn không có thẻ mô tả, Google sẽ thử tìm một phần thích hợp trong bài viết của bạn để hiển thị cho kết quả tìm kiếm.'}
                                        </div>
                                    </div>

                                    <div className="mb-[24px]">
                                        <Label
                                            htmlFor="meta_title"
                                            className="mb-[10px] text-[13px] font-semibold text-zinc-700"
                                        >
                                            Tiêu đề SEO
                                        </Label>
                                        <Input
                                            id="meta_title"
                                            type="text"
                                            name="meta_title"
                                            value={formData.meta_title}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-[5px] border-zinc-200 text-black focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Nhập tiêu đề SEO..."
                                        />
                                        <div className="mt-1 flex justify-end text-[12px] text-zinc-500">
                                            {formData.meta_title.length} trên 70 ký tự
                                        </div>
                                        <InputError message={errors.meta_title} className="mt-[5px]" />
                                    </div>

                                    <div className="mb-[24px]">
                                        <Label
                                            htmlFor="meta_keyword"
                                            className="mb-[10px] text-[13px] font-semibold text-zinc-700"
                                        >
                                            Từ khóa SEO
                                        </Label>
                                        <Input
                                            id="meta_keyword"
                                            type="text"
                                            name="meta_keyword"
                                            value={formData.meta_keyword}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-[5px] border-zinc-200 text-black focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Nhập từ khóa SEO (ngăn cách bằng dấu phẩy)..."
                                        />
                                        <InputError message={errors.meta_keyword} className="mt-[5px]" />
                                    </div>

                                    <div className="mb-[24px]">
                                        <Label
                                            htmlFor="meta_description"
                                            className="mb-[10px] text-[13px] font-semibold text-zinc-700"
                                        >
                                            Mô tả SEO
                                        </Label>
                                        <textarea
                                            id="meta_description"
                                            name="meta_description"
                                            value={formData.meta_description}
                                            onChange={handleChange}
                                            className="min-h-[100px] w-full rounded-[5px] border border-zinc-200 p-3 text-[14px] text-black focus:border-indigo-500 focus:ring-indigo-500 outline-none"
                                            placeholder="Nhập mô tả SEO..."
                                        />
                                        <div className="mt-1 flex justify-end text-[12px] text-zinc-500">
                                            {formData.meta_description.length} trên 320 ký tự
                                        </div>
                                        <InputError message={errors.meta_description} className="mt-[5px]" />
                                    </div>
                                    
                                    <div className="mt-6 flex justify-end space-x-3 border-t border-zinc-100 pt-4">
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
                            </div>

                            <div className="col-span-12 lg:col-span-4">
                                <CustomCard
                                    isShowHeader={true}
                                    title="Album hình ảnh"
                                    description="Tải lên thư viện ảnh cho nhóm bài viết"
                                    className="border-zinc-200 bg-white shadow-sm"
                                >
                                    <div className="flex flex-col items-center justify-center">
                                        <div 
                                            className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 p-6 transition-colors hover:bg-zinc-100"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <div className="flex flex-col items-center text-center">
                                                <UploadCloud className="mb-2 h-8 w-8 text-zinc-400" />
                                                <span className="text-sm font-medium text-zinc-600">Click để tải ảnh lên</span>
                                                <span className="mt-1 text-xs text-zinc-500">Hỗ trợ JPG, PNG, WEBP</span>
                                            </div>
                                            <input 
                                                type="file" 
                                                ref={fileInputRef}
                                                onChange={handleAlbumChange}
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                            />
                                        </div>
                                        <InputError message={errors.album} className="mt-2" />
                                    </div>
                                    
                                    {albumPreviews.length > 0 && (
                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            {albumPreviews.map((preview, index) => (
                                                <div key={index} className="group relative aspect-square overflow-hidden rounded-md border border-zinc-200">
                                                    <img 
                                                        src={preview} 
                                                        alt={`Album ${index}`} 
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAlbumImage(index)}
                                                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-rose-600"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CustomCard>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
