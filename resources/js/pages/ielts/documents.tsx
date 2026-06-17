import CustomCard from '@/components/ui/custom-card';
import CustomPageHeading from '@/components/ui/customer-page-heading';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/index';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BookOpen, Download, FileText, Headphones, MessageSquare, PenTool, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Tài liệu IELTS',
        href: '/ielts/documents',
    },
];

const categories = [
    { id: 'all', title: 'Tất cả', icon: FileText },
    { id: 'listening', title: 'Listening', icon: Headphones },
    { id: 'reading', title: 'Reading', icon: BookOpen },
    { id: 'writing', title: 'Writing', icon: PenTool },
    { id: 'speaking', title: 'Speaking', icon: MessageSquare },
];

const rawDocuments = [
    {
        id: 1,
        title: 'IELTS Cambridge 19 - PDF & Audio',
        category: 'reading',
        type: 'PDF',
        size: '15.5 MB',
        downloads: 1250,
        image: 'https://placehold.co/400x500/6366f1/white?text=Cambridge+19',
    },
    {
        id: 2,
        title: 'Target Band 7+ Speaking Topics',
        category: 'speaking',
        type: 'DOCX',
        size: '2.1 MB',
        downloads: 850,
        image: 'https://placehold.co/400x500/ec4899/white?text=Speaking+7+',
    },
    {
        id: 3,
        title: 'Vocabulary for IELTS Advanced',
        category: 'reading',
        type: 'PDF',
        size: '8.4 MB',
        downloads: 3200,
        image: 'https://placehold.co/400x500/10b981/white?text=Vocabulary',
    },
    {
        id: 4,
        title: 'Mastering IELTS Writing Task 2',
        category: 'writing',
        type: 'PDF',
        size: '5.2 MB',
        downloads: 1100,
        image: 'https://placehold.co/400x500/f59e0b/white?text=Writing+Task+2',
    },
    {
        id: 5,
        title: 'Listening Practice Test Set 2024',
        category: 'listening',
        type: 'MP3/PDF',
        size: '45.0 MB',
        downloads: 2100,
        image: 'https://placehold.co/400x500/3b82f6/white?text=Listening+2024',
    },
    {
        id: 6,
        title: 'Common Grammar Mistakes in IELTS',
        category: 'writing',
        type: 'PDF',
        size: '3.7 MB',
        downloads: 1500,
        image: 'https://placehold.co/400x500/8b5cf6/white?text=Grammar',
    },
];

export default function IeltsDocuments() {
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDocs = rawDocuments.filter(doc => {
        const matchesTab = activeTab === 'all' || doc.category === activeTab;
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tài liệu IELTS" />
            <div className="page-wrapper flex h-full flex-1 flex-col gap-4 overflow-x-auto bg-zinc-50/50">
                <CustomPageHeading heading="Kho tài liệu IELTS" breadcrumbs={breadcrumbs} />

                <div className="page-container px-6 pb-10">
                    <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <Button
                                    key={cat.id}
                                    variant={activeTab === cat.id ? 'default' : 'outline'}
                                    className={`h-10 rounded-full px-5 transition-all ${
                                        activeTab === cat.id 
                                            ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md' 
                                            : 'border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                                    }`}
                                    onClick={() => setActiveTab(cat.id)}
                                >
                                    <cat.icon className="mr-2 h-4 w-4" />
                                    {cat.title}
                                </Button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-[300px]">
                            <Search className="absolute top-3 left-3 h-4 w-4 text-zinc-400" />
                            <Input
                                placeholder="Tìm kiếm tài liệu..."
                                className="h-10 pl-10 border-zinc-200 focus:ring-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredDocs.map((doc) => (
                            <div key={doc.id} className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:shadow-xl hover:-translate-y-1">
                                <div className="aspect-[3/4] w-full overflow-hidden bg-zinc-100">
                                    <img 
                                        src={doc.image} 
                                        alt={doc.title} 
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md uppercase">
                                        {doc.type}
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col p-4">
                                    <h3 className="mb-2 line-clamp-2 text-sm font-bold text-zinc-900 group-hover:text-indigo-600">
                                        {doc.title}
                                    </h3>
                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="text-[11px] text-zinc-500">
                                            <span className="font-medium">{doc.size}</span>
                                            <span className="mx-2">•</span>
                                            <span>{doc.downloads} lượt tải</span>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredDocs.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                            <FileText className="mb-4 h-12 w-12 opacity-20" />
                            <p className="text-lg italic">Không tìm thấy tài liệu phù hợp</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
