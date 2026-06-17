import CustomPageHeading from '@/components/ui/customer-page-heading';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/index';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BookOpen, Calendar, Clock, PlayCircle, Users, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Đề thi mẫu (Mock)',
        href: '/ielts/mock-tests',
    },
];

const mockTests = [
    {
        id: 1,
        title: 'IELTS Mock Test June 2024',
        type: 'Academic',
        duration: '2h 45m',
        participants: 1540,
        rating: 4.8,
        difficulty: 'Hard',
        isPremium: true,
        color: 'indigo'
    },
    {
        id: 2,
        title: 'Cambridge IELTS 19 - Test 1',
        type: 'Academic',
        duration: '2h 45m',
        participants: 3200,
        rating: 4.9,
        difficulty: 'Medium',
        isPremium: false,
        color: 'emerald'
    },
    {
        id: 3,
        title: 'Speaking Simulation - Topic 2024',
        type: 'Speaking Only',
        duration: '15m',
        participants: 850,
        rating: 4.7,
        difficulty: 'Medium',
        isPremium: true,
        color: 'rose'
    },
    {
        id: 4,
        title: 'Writing Task 1 & 2 Correction',
        type: 'General Training',
        duration: '1h',
        participants: 1200,
        rating: 4.6,
        difficulty: 'Easy',
        isPremium: false,
        color: 'amber'
    },
    {
        id: 5,
        title: 'Listening Intensive Mock 05',
        type: 'Academic',
        duration: '40m',
        participants: 2100,
        rating: 4.5,
        difficulty: 'Hard',
        isPremium: false,
        color: 'blue'
    },
    {
        id: 6,
        title: 'Reading Speed Boost Test',
        type: 'Academic',
        duration: '1h',
        participants: 1800,
        rating: 4.7,
        difficulty: 'Hard',
        isPremium: true,
        color: 'purple'
    },
];

export default function IeltsMockTests() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Đề thi mẫu IELTS" />
            <div className="page-wrapper flex h-full flex-1 flex-col gap-4 overflow-x-auto bg-zinc-50/50">
                <CustomPageHeading heading="Hệ thống thi thử Mock Test" breadcrumbs={breadcrumbs} />

                <div className="page-container px-6 pb-10">
                    <div className="mb-10 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-xl">
                        <div className="max-w-2xl">
                            <h2 className="mb-4 text-3xl font-bold">Nâng cao band điểm với Mock Test thực tế</h2>
                            <p className="mb-6 text-indigo-100 opacity-90">
                                Trải nghiệm môi trường thi IELTS thực tế với đầy đủ các kỹ năng. Nhận kết quả và phân tích chi tiết ngay sau khi hoàn thành bài thi.
                            </p>
                            <Button className="h-11 rounded-full bg-white px-6 text-indigo-600 font-bold hover:bg-zinc-100">
                                Khám phá lộ trình học
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-zinc-900">Danh sách đề thi mới nhất</h3>
                        <div className="flex gap-2">
                            <Badge variant="outline" className="text-black cursor-pointer hover:bg-zinc-100">Tất cả</Badge>
                            <Badge variant="outline" className="text-black cursor-pointer hover:bg-zinc-100">Academic</Badge>
                            <Badge variant="outline" className="text-black cursor-pointer hover:bg-zinc-100">General Training</Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {mockTests.map((test) => (
                            <div key={test.id} className="group relative flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:shadow-2xl hover:border-indigo-100">
                                <div className="mb-4 flex items-center justify-between">
                                    <Badge className={`bg-${test.color}-100 text-${test.color}-700 border-none px-3 py-1`}>
                                        {test.type}
                                    </Badge>
                                    {test.isPremium && (
                                        <span className="flex items-center text-[10px] font-bold uppercase tracking-wider text-amber-500">
                                            <Star className="mr-1 h-3 w-3 fill-current" />
                                            Premium
                                        </span>
                                    )}
                                </div>
                                
                                <h4 className="mb-4 text-lg font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                                    {test.title}
                                </h4>

                                <div className="mb-6 grid grid-cols-2 gap-4">
                                    <div className="flex items-center text-sm text-zinc-500">
                                        <Clock className="mr-2 h-4 w-4" />
                                        {test.duration}
                                    </div>
                                    <div className="flex items-center text-sm text-zinc-500">
                                        <Users className="mr-2 h-4 w-4" />
                                        {test.participants}
                                    </div>
                                    <div className="flex items-center text-sm text-zinc-500">
                                        <Star className="mr-2 h-4 w-4 text-amber-400" />
                                        {test.rating} Rating
                                    </div>
                                    <div className="flex items-center text-sm text-zinc-500">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        2024
                                    </div>
                                </div>

                                <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-4">
                                    <span className={`text-sm font-semibold ${
                                        test.difficulty === 'Hard' ? 'text-rose-500' : 
                                        test.difficulty === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                                    }`}>
                                        Difficulty: {test.difficulty}
                                    </span>
                                    <Button className="rounded-lg bg-indigo-600 hover:bg-indigo-700">
                                        <PlayCircle className="mr-2 h-4 w-4" />
                                        Làm bài ngay
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
