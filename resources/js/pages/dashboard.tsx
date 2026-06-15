import AppLayout from '@/layouts/app-layout';
import ReadingCat from '@/components/reading-cat';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Activity,
    Award,
    BookOpen,
    Calendar,
    CheckCircle2,
    Clock,
    GraduationCap,
    Info,
    Search,
    Star,
    TrendingUp,
    Users,
} from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

// Mock Data depending on time ranges: 'today' | 'week' | 'month'
interface StatData {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    gradient: string;
}

const statsMock: Record<'today' | 'week' | 'month', StatData[]> = {
    today: [
        {
            title: 'Học Viên Mới Đăng Ký',
            value: '24',
            change: '+15%',
            isPositive: true,
            description: 'so với ngày hôm qua',
            icon: Users,
            color: 'text-indigo-600 dark:text-indigo-400',
            gradient: 'from-indigo-500/10 to-blue-500/10',
        },
        {
            title: 'Lớp Học Hoạt Động',
            value: '42 Lớp',
            change: '4 Lớp Mới',
            isPositive: true,
            description: 'đang giảng dạy hôm nay',
            icon: BookOpen,
            color: 'text-emerald-600 dark:text-emerald-400',
            gradient: 'from-emerald-500/10 to-teal-500/10',
        },
        {
            title: 'Số Ca Học Đã/Đang Chạy',
            value: '18 / 25',
            change: '72% Hoàn thành',
            isPositive: true,
            description: 'ca học trong ngày',
            icon: Calendar,
            color: 'text-amber-600 dark:text-amber-400',
            gradient: 'from-amber-500/10 to-orange-500/10',
        },
        {
            title: 'Giảng Viên Lên Lớp',
            value: '15 Thầy Cô',
            change: '100% On-time',
            isPositive: true,
            description: 'không có ca trống',
            icon: GraduationCap,
            color: 'text-rose-600 dark:text-rose-400',
            gradient: 'from-rose-500/10 to-pink-500/10',
        },
    ],
    week: [
        {
            title: 'Học Viên Mới Đăng Ký',
            value: '148',
            change: '+22%',
            isPositive: true,
            description: 'so với tuần trước',
            icon: Users,
            color: 'text-indigo-600 dark:text-indigo-400',
            gradient: 'from-indigo-500/10 to-blue-500/10',
        },
        {
            title: 'Lớp Học Hoạt Động',
            value: '45 Lớp',
            change: '+3 Lớp',
            isPositive: true,
            description: 'hoạt động trong tuần',
            icon: BookOpen,
            color: 'text-emerald-600 dark:text-emerald-400',
            gradient: 'from-emerald-500/10 to-teal-500/10',
        },
        {
            title: 'Số Ca Học Đã/Đang Chạy',
            value: '112 / 125',
            change: '89.6% Hoàn thành',
            isPositive: true,
            description: 'tổng ca học tuần này',
            icon: Calendar,
            color: 'text-amber-600 dark:text-amber-400',
            gradient: 'from-amber-500/10 to-orange-500/10',
        },
        {
            title: 'Giảng Viên Lên Lớp',
            value: '26 Thầy Cô',
            change: '4.8/5 Rating',
            isPositive: true,
            description: 'đánh giá tích cực',
            icon: GraduationCap,
            color: 'text-rose-600 dark:text-rose-400',
            gradient: 'from-rose-500/10 to-pink-500/10',
        },
    ],
    month: [
        {
            title: 'Học Viên Mới Đăng Ký',
            value: '624',
            change: '+18.5%',
            isPositive: true,
            description: 'so với tháng trước',
            icon: Users,
            color: 'text-indigo-600 dark:text-indigo-400',
            gradient: 'from-indigo-500/10 to-blue-500/10',
        },
        {
            title: 'Lớp Học Hoạt Động',
            value: '48 Lớp',
            change: '+8 Lớp',
            isPositive: true,
            description: 'hoạt động trong tháng',
            icon: BookOpen,
            color: 'text-emerald-600 dark:text-emerald-400',
            gradient: 'from-emerald-500/10 to-teal-500/10',
        },
        {
            title: 'Số Ca Học Đã/Đang Chạy',
            value: '480 / 512',
            change: '93.7% Hoàn thành',
            isPositive: true,
            description: 'tổng ca học tháng này',
            icon: Calendar,
            color: 'text-amber-600 dark:text-amber-400',
            gradient: 'from-amber-500/10 to-orange-500/10',
        },
        {
            title: 'Giảng Viên Lên Lớp',
            value: '28 Thầy Cô',
            change: '95% Active',
            isPositive: true,
            description: 'đang tham gia giảng dạy',
            icon: GraduationCap,
            color: 'text-rose-600 dark:text-rose-400',
            gradient: 'from-rose-500/10 to-pink-500/10',
        },
    ],
};

const chartDataMock = {
    today: {
        labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
        values: [2, 5, 3, 8, 12, 18, 24],
        maxVal: 30,
    },
    week: {
        labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
        values: [12, 18, 15, 22, 28, 32, 21],
        maxVal: 40,
    },
    month: {
        labels: [
            'Tháng 1',
            'Tháng 2',
            'Tháng 3',
            'Tháng 4',
            'Tháng 5',
            'Tháng 6',
        ],
        values: [85, 110, 95, 140, 168, 210],
        maxVal: 250,
    },
};

const bandDistribution = [
    {
        band: 'IELTS Target 5.5 - 6.0',
        percentage: 25,
        count: 312,
        color: 'bg-indigo-500',
    },
    {
        band: 'IELTS Target 6.5 - 7.0',
        percentage: 50,
        count: 624,
        color: 'bg-emerald-500',
    },
    {
        band: 'IELTS Target 7.5+',
        percentage: 25,
        count: 312,
        color: 'bg-amber-500',
    },
];

const timetableMock = [
    {
        id: 1,
        className: 'IELTS Academic Master (Luyện Viết & Nói)',
        startTime: '08:00',
        endTime: '10:00',
        period: 'morning',
        teacher: 'Mr. David Miller',
        credentials: 'IELTS 9.0',
        room: 'Phòng học 102',
        skill: 'Speaking & Writing',
        studentsCount: 18,
        maxStudents: 20,
    },
    {
        id: 2,
        className: 'IELTS General Intensive (Giải Đề Tổng Hợp)',
        startTime: '10:15',
        endTime: '12:15',
        period: 'morning',
        teacher: 'Ms. Sarah Jenkins',
        credentials: 'IELTS 8.5',
        room: 'Phòng Lab 2',
        skill: 'Reading & Listening',
        studentsCount: 15,
        maxStudents: 15,
    },
    {
        id: 3,
        className: 'IELTS Foundation 4.5+ (Học Thuật Cơ Bản)',
        startTime: '13:30',
        endTime: '15:30',
        period: 'afternoon',
        teacher: 'Thầy Nguyễn Văn Minh',
        credentials: 'IELTS 8.0',
        room: 'Phòng học 205',
        skill: 'Grammar & Vocabulary',
        studentsCount: 22,
        maxStudents: 25,
    },
    {
        id: 4,
        className: 'IELTS Advanced Writing Workshop (Chuyên Sâu Task 2)',
        startTime: '16:00',
        endTime: '18:00',
        period: 'afternoon',
        teacher: 'Mr. David Miller',
        credentials: 'IELTS 9.0',
        room: 'Hội trường B',
        skill: 'Writing Task 2',
        studentsCount: 28,
        maxStudents: 30,
    },
    {
        id: 5,
        className: 'IELTS Speaking Masterclass (Luyện Phát Âm & Phản Xạ)',
        startTime: '18:30',
        endTime: '20:30',
        period: 'evening',
        teacher: 'Ms. Emma Watson',
        credentials: 'IELTS 8.5',
        room: 'Phòng học 104',
        skill: 'Speaking Part 2 & 3',
        studentsCount: 12,
        maxStudents: 15,
    },
    {
        id: 6,
        className: 'IELTS Vocabulary Mastery & Grammar Boost',
        startTime: '20:45',
        endTime: '22:15',
        period: 'evening',
        teacher: 'Thầy Nguyễn Văn Minh',
        credentials: 'IELTS 8.0',
        room: 'Phòng học 102',
        skill: 'Vocabulary & Pronunciation',
        studentsCount: 16,
        maxStudents: 20,
    },
];

const teachersMock = [
    {
        name: 'Mr. David Miller',
        avatarColor: 'from-blue-500 to-indigo-600',
        role: 'Chuyên gia IELTS Speaking',
        credentials: 'IELTS 9.0 (Speaking 9.0)',
        activeClasses: 6,
        rating: 4.9,
        reviewsCount: 142,
        status: 'online',
    },
    {
        name: 'Ms. Sarah Jenkins',
        avatarColor: 'from-purple-500 to-pink-600',
        role: 'Chuyên gia Reading & Listening',
        credentials: 'IELTS 8.5 (Reading 9.0)',
        activeClasses: 5,
        rating: 4.8,
        reviewsCount: 96,
        status: 'online',
    },
    {
        name: 'Thầy Nguyễn Văn Minh',
        avatarColor: 'from-emerald-500 to-teal-600',
        role: 'Trưởng nhóm IELTS Academic Foundation',
        credentials: 'IELTS 8.0 (Writing 8.5)',
        activeClasses: 4,
        rating: 4.7,
        reviewsCount: 88,
        status: 'busy',
    },
    {
        name: 'Ms. Emma Watson',
        avatarColor: 'from-orange-500 to-amber-600',
        role: 'Giảng viên IELTS Speaking & Writing',
        credentials: 'IELTS 8.5 (Speaking 8.5)',
        activeClasses: 5,
        rating: 4.9,
        reviewsCount: 110,
        status: 'online',
    },
];

const recentActivities = [
    {
        id: 1,
        student: 'Trần Thị Thuỳ Trang',
        action: 'đã đăng ký lớp học',
        target: 'IELTS Intensive 6.5',
        time: '10 phút trước',
        icon: Users,
        iconBg: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400',
    },
    {
        id: 2,
        student: 'Mr. David Miller',
        action: 'đã phê duyệt bài chấm Writing Task 2 cho',
        target: 'Lê Hoàng Hải',
        time: '32 phút trước',
        icon: Award,
        iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    },
    {
        id: 3,
        student: 'Nguyễn Văn Minh',
        action: 'đã điểm danh lớp học',
        target: 'IELTS Foundation 4.5+ (Phòng 205)',
        time: '1 giờ trước',
        icon: CheckCircle2,
        iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
    },
    {
        id: 4,
        student: 'Phan Minh Tuấn',
        action: 'đã hoàn thành mock test IELTS Academic',
        target: 'Đạt Overall 7.0',
        time: '2 giờ trước',
        icon: Activity,
        iconBg: 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400',
    },
];

export default function Dashboard() {
    const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>(
        'month',
    );
    const [timetableFilter, setTimetableFilter] = useState<
        'all' | 'morning' | 'afternoon' | 'evening'
    >('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredChartIndex, setHoveredChartIndex] = useState<number | null>(
        null,
    );

    const [currentTime, setCurrentTime] = useState(new Date());
    const [simulationMode, setSimulationMode] = useState<
        'realtime' | 'morning_peak' | 'afternoon_peak' | 'evening_peak'
    >('realtime');

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const getActiveTime = () => {
        if (simulationMode === 'morning_peak') {
            const d = new Date();
            d.setHours(9, 30, 0);
            return d;
        }
        if (simulationMode === 'afternoon_peak') {
            const d = new Date();
            d.setHours(14, 30, 0);
            return d;
        }
        if (simulationMode === 'evening_peak') {
            const d = new Date();
            d.setHours(19, 30, 0);
            return d;
        }
        return currentTime;
    };

    const activeTime = getActiveTime();
    const currentHour = activeTime.getHours();
    const currentMinute = activeTime.getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinute;

    const dynamicTimetable = timetableMock.map((item) => {
        const [startH, startM] = item.startTime.split(':').map(Number);
        const [endH, endM] = item.endTime.split(':').map(Number);
        const startTotal = startH * 60 + startM;
        const endTotal = endH * 60 + endM;

        let status: 'completed' | 'ongoing' | 'upcoming' = 'upcoming';
        let statusText = 'Sắp diễn ra';
        let progress = 0;
        let timeInfo = '';

        if (currentTotalMinutes > endTotal) {
            status = 'completed';
            statusText = 'Đã kết thúc';
            timeInfo = `Kết thúc lúc ${item.endTime}`;
        } else if (
            currentTotalMinutes >= startTotal &&
            currentTotalMinutes <= endTotal
        ) {
            status = 'ongoing';
            statusText = 'Đang diễn ra';
            const duration = endTotal - startTotal;
            const elapsed = currentTotalMinutes - startTotal;
            progress =
                duration > 0 ? Math.round((elapsed / duration) * 100) : 100;
            timeInfo = `Còn lại ${endTotal - currentTotalMinutes} phút`;
        } else {
            status = 'upcoming';
            statusText = 'Sắp diễn ra';
            const waitTime = startTotal - currentTotalMinutes;
            if (waitTime < 60) {
                timeInfo = `Bắt đầu sau ${waitTime} phút`;
            } else {
                const waitH = Math.floor(waitTime / 60);
                const waitM = waitTime % 60;
                timeInfo = `Bắt đầu sau ${waitH}h${waitM > 0 ? ` ${waitM}m` : ''}`;
            }
        }

        return {
            ...item,
            status,
            statusText,
            progress,
            timeInfo,
        };
    });

    const updatedTeachers = teachersMock.map((teacher) => {
        const hasOngoingClass = dynamicTimetable.some(
            (cls) => cls.teacher === teacher.name && cls.status === 'ongoing',
        );
        return {
            ...teacher,
            status: hasOngoingClass ? 'busy' : 'online',
        };
    });

    const activeChartData = chartDataMock[timeRange];
    const chartHeight = 160;
    const chartWidth = 500;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const graphWidth = chartWidth - paddingLeft - paddingRight;
    const graphHeight = chartHeight - paddingTop - paddingBottom;

    const pointsCount = activeChartData.values.length;
    const getX = (index: number) => {
        return paddingLeft + (index / (pointsCount - 1)) * graphWidth;
    };

    const maxVal = activeChartData.maxVal;
    const getY = (val: number) => {
        return paddingTop + graphHeight - (val / maxVal) * graphHeight;
    };

    let linePathD = '';
    let areaPathD = '';
    if (pointsCount > 0) {
        linePathD = `M ${getX(0)} ${getY(activeChartData.values[0])}`;
        areaPathD = `M ${getX(0)} ${getY(activeChartData.values[0])}`;
        for (let i = 1; i < pointsCount; i++) {
            linePathD += ` L ${getX(i)} ${getY(activeChartData.values[i])}`;
            areaPathD += ` L ${getX(i)} ${getY(activeChartData.values[i])}`;
        }
        areaPathD += ` L ${getX(pointsCount - 1)} ${paddingTop + graphHeight} L ${getX(0)} ${paddingTop + graphHeight} Z`;
    }

    const filteredTimetable = dynamicTimetable.filter((item) => {
        const matchesPeriod =
            timetableFilter === 'all' || item.period === timetableFilter;
        const matchesSearch =
            item.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.room.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesPeriod && matchesSearch;
    });

    const activeStats = statsMock[timeRange];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="IELTS Learning Dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header Welcome & Quick Info */}
                <div className="relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm group lg:flex-row lg:items-center dark:border-neutral-800 dark:bg-neutral-900">
                    
                    {/* Left & Middle: Welcome Text and Reading Cat on the SAME ROW */}
                    <div className="relative z-10 flex flex-1 items-center gap-8">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                                Hệ Thống Quản Lý IELTS
                                <span className="animate-bounce">📖</span>
                            </h1>
                            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 max-w-md">
                                Chào mừng bạn trở lại! Hãy cùng chú mèo học tập chăm chỉ hôm nay nhé. Theo dõi thống kê và lịch học của trung tâm.
                            </p>
                        </div>
                        
                        {/* Reading Cat centered next to text */}
                        <div className="transform transition-transform duration-500 group-hover:scale-110 shrink-0">
                            <ReadingCat />
                        </div>
                    </div>

                    {/* Right: Time Filter controls */}
                    <div className="relative z-10 flex items-center justify-center lg:justify-end gap-1 shrink-0">
                        <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white/80 backdrop-blur-sm p-1 dark:border-neutral-800 dark:bg-neutral-900/80">
                            <button
                                onClick={() => setTimeRange('today')}
                                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                                    timeRange === 'today'
                                        ? 'bg-indigo-600 text-white shadow'
                                        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                                }`}
                            >
                                Hôm nay
                            </button>
                            <button
                                onClick={() => setTimeRange('week')}
                                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                                    timeRange === 'week'
                                        ? 'bg-indigo-600 text-white shadow'
                                        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                                }`}
                            >
                                Tuần này
                            </button>
                            <button
                                onClick={() => setTimeRange('month')}
                                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                                    timeRange === 'month'
                                        ? 'bg-indigo-600 text-white shadow'
                                        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                                }`}
                            >
                                Tháng này
                            </button>
                        </div>
                    </div>
                </div>

                {/* Top Statistics Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {activeStats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={idx}
                                className="group relative overflow-hidden rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                            >
                                <div
                                    className={`absolute -top-4 -right-4 size-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100`}
                                />

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                                        {stat.title}
                                    </span>
                                    <div
                                        className={`rounded-lg bg-neutral-50 p-2 dark:bg-neutral-800/50 ${stat.color}`}
                                    >
                                        <Icon className="size-5" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-baseline gap-2">
                                    <span className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
                                        {stat.value}
                                    </span>
                                    <span
                                        className={`flex items-center text-xs font-semibold ${
                                            stat.isPositive
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-rose-600'
                                        }`}
                                    >
                                        {stat.change}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                    {stat.description}
                                </p>

                                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </div>
                        );
                    })}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm lg:col-span-2 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
                            <div>
                                <h2 className="flex items-center gap-2 text-base font-bold text-neutral-900 dark:text-white">
                                    <TrendingUp className="size-4 text-indigo-500" />
                                    Tần Suất Học Viên Đăng Ký
                                </h2>
                                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                    Số liệu đăng ký ghi danh mới theo thời gian đã chọn
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                <span className="size-1.5 animate-pulse rounded-full bg-indigo-600 dark:bg-indigo-400" />
                                Live Analytics
                            </span>
                        </div>

                        <div className="relative mt-6 flex justify-center">
                            <svg
                                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                                className="h-auto w-full overflow-visible select-none"
                            >
                                <defs>
                                    <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                                    </linearGradient>
                                    <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="50%" stopColor="#a855f7" />
                                        <stop offset="100%" stopColor="#ec4899" />
                                    </linearGradient>
                                </defs>

                                {[0, 0.5, 1].map((ratio, i) => {
                                    const y = paddingTop + graphHeight - ratio * graphHeight;
                                    const val = Math.round(ratio * maxVal);
                                    return (
                                        <g key={i} className="opacity-40">
                                            <line
                                                x1={paddingLeft}
                                                y1={y}
                                                x2={chartWidth - paddingRight}
                                                y2={y}
                                                stroke="currentColor"
                                                strokeWidth="1"
                                                strokeDasharray="4 4"
                                                className="text-neutral-200 dark:text-neutral-800"
                                            />
                                            <text
                                                x={paddingLeft - 8}
                                                y={y + 4}
                                                textAnchor="end"
                                                fontSize="10"
                                                className="fill-neutral-400 font-medium dark:fill-neutral-500"
                                            >
                                                {val}
                                            </text>
                                        </g>
                                    );
                                })}

                                <path d={areaPathD} fill="url(#area-grad)" />
                                <path
                                    d={linePathD}
                                    stroke="url(#line-grad)"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    fill="none"
                                />

                                {activeChartData.values.map((val, idx) => {
                                    const x = getX(idx);
                                    const y = getY(val);
                                    const label = activeChartData.labels[idx];
                                    const isHovered = hoveredChartIndex === idx;

                                    return (
                                        <g key={idx} className="cursor-pointer">
                                            <text
                                                x={x}
                                                y={paddingTop + graphHeight + 18}
                                                textAnchor="middle"
                                                fontSize="10.5"
                                                className="fill-neutral-500 font-semibold dark:fill-neutral-400"
                                            >
                                                {label}
                                            </text>

                                            {isHovered && (
                                                <line
                                                    x1={x}
                                                    y1={paddingTop}
                                                    x2={x}
                                                    y2={paddingTop + graphHeight}
                                                    stroke="#6366f1"
                                                    strokeWidth="1.5"
                                                    strokeDasharray="2 2"
                                                    opacity="0.6"
                                                />
                                            )}

                                            <circle
                                                cx={x}
                                                cy={y}
                                                r={isHovered ? 7 : 4.5}
                                                className={`fill-white stroke-indigo-600 transition-all duration-200 dark:stroke-indigo-400`}
                                                strokeWidth={isHovered ? 3 : 2}
                                                onMouseEnter={() => setHoveredChartIndex(idx)}
                                                onMouseLeave={() => setHoveredChartIndex(null)}
                                            />
                                        </g>
                                    );
                                })}
                            </svg>

                            {hoveredChartIndex !== null && (
                                <div
                                    className="absolute rounded-lg border border-neutral-100 bg-neutral-950 px-3 py-1.5 shadow-xl transition-all dark:border-neutral-800"
                                    style={{
                                        left: `${(getX(hoveredChartIndex) / chartWidth) * 100}%`,
                                        top: `${(getY(activeChartData.values[hoveredChartIndex]) / chartHeight) * 100 - 32}%`,
                                        transform: 'translateX(-50%)',
                                    }}
                                >
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                                            {activeChartData.labels[hoveredChartIndex]}
                                        </p>
                                        <p className="text-xs font-extrabold text-white">
                                            {activeChartData.values[hoveredChartIndex]} đăng ký
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="border-b border-neutral-100 pb-4 dark:border-neutral-800">
                            <h2 className="flex items-center gap-2 text-base font-bold text-neutral-900 dark:text-white">
                                <Award className="size-4 text-emerald-500" />
                                Cơ Cấu Band Mục Tiêu
                            </h2>
                            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                Phân bổ học viên theo chỉ tiêu IELTS đầu ra mong muốn
                            </p>
                        </div>

                        <div className="mt-6 space-y-5">
                            {bandDistribution.map((item, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                                            {item.band}
                                        </span>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="font-extrabold text-neutral-900 dark:text-white">
                                                {item.count} HV
                                            </span>
                                            <span className="text-xs text-neutral-400">
                                                ({item.percentage}%)
                                            </span>
                                        </div>
                                    </div>

                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                        <div
                                            className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex gap-3 rounded-lg border border-indigo-100/50 bg-indigo-50/50 p-4 dark:border-indigo-900/30 dark:bg-indigo-950/20">
                            <Info className="size-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                            <div className="text-xs leading-relaxed text-indigo-900/80 dark:text-indigo-300/90">
                                <strong className="block font-bold text-indigo-950 dark:text-white">
                                    Mục tiêu 6.5 - 7.0 dẫn đầu
                                </strong>
                                Đa phần học viên tập trung thi lấy chứng chỉ xét tuyển đại học và du học. Tỷ lệ hoàn thành mục tiêu band cam kết quý trước đạt{' '}
                                <span className="font-bold">92.4%</span>.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm lg:col-span-2 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex flex-col gap-4 border-b border-neutral-100 pb-4 lg:flex-row lg:items-center lg:justify-between dark:border-neutral-800">
                            <div>
                                <h2 className="flex items-center gap-2 text-base font-bold text-neutral-900 dark:text-white">
                                    <Clock className="size-4 text-amber-500" />
                                    Thời Khóa Biểu Hôm Nay
                                </h2>
                                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                    Lịch lên lớp, phòng học và giảng viên IELTS trực ca
                                </p>
                                <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                    <span className="relative flex size-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                                        <span className="relative inline-flex size-2 rounded-full bg-indigo-500"></span>
                                    </span>
                                    <span>
                                        Giờ hiện tại: {activeTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                    {simulationMode !== 'realtime' && (
                                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
                                            Mô phỏng
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <select
                                    value={simulationMode}
                                    onChange={(e) => setSimulationMode(e.target.value as any)}
                                    className="rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-xs font-semibold text-neutral-700 focus:border-indigo-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
                                >
                                    <option value="realtime">⏱️ Giờ hệ thống thực</option>
                                    <option value="morning_peak">🌅 Ca Sáng (09:30)</option>
                                    <option value="afternoon_peak">☀️ Ca Chiều (14:30)</option>
                                    <option value="evening_peak">🌙 Ca Tối (19:30)</option>
                                </select>

                                <div className="relative w-full max-w-[200px]">
                                    <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-neutral-400" />
                                    <input
                                        type="text"
                                        placeholder="Tìm lớp, giáo viên..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded-lg border border-neutral-200 bg-white py-1.5 pr-3 pl-8 text-xs placeholder:text-neutral-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {[
                                { key: 'all', label: 'Tất cả ca' },
                                { key: 'morning', label: 'Ca Sáng (08:00-12:00)' },
                                { key: 'afternoon', label: 'Ca Chiều (13:00-18:00)' },
                                { key: 'evening', label: 'Ca Tối (18:00-22:15)' },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setTimetableFilter(tab.key as any)}
                                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                                        timetableFilter === tab.key
                                            ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                                            : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 space-y-4">
                            {filteredTimetable.length > 0 ? (
                                filteredTimetable.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`group flex flex-col gap-3.5 rounded-xl border p-4 transition-all duration-200 ${
                                            item.status === 'ongoing'
                                                ? 'border-indigo-200 bg-indigo-50/15 shadow-sm dark:border-indigo-900/50 dark:bg-indigo-950/10'
                                                : 'border-neutral-100 hover:border-indigo-100 hover:bg-indigo-50/5 dark:border-neutral-800/80 dark:hover:border-indigo-900/10'
                                        }`}
                                    >
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="space-y-1">
                                                <h3 className="text-sm font-bold text-neutral-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                                                    {item.className}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">GV: {item.teacher}</span>
                                                    <span className="size-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                                                    <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">{item.credentials}</span>
                                                    <span className="size-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                                                    <span className="font-medium">{item.room}</span>
                                                </div>
                                            </div>

                                            <span
                                                className={`flex items-center gap-1.5 self-start rounded-full px-2.5 py-0.5 text-xs font-bold sm:self-center ${
                                                    item.status === 'completed'
                                                        ? 'text-neutral-650 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400'
                                                        : item.status === 'ongoing'
                                                          ? 'dark:text-emerald-450 animate-pulse bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40'
                                                          : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400'
                                                }`}
                                            >
                                                {item.status === 'ongoing' && <span className="size-1.5 rounded-full bg-emerald-500" />}
                                                {item.statusText}
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                                                <span>Sĩ số lớp: <strong className="font-bold text-neutral-800 dark:text-neutral-200">{item.studentsCount}/{item.maxStudents}</strong></span>
                                                {item.studentsCount === item.maxStudents ? (
                                                    <span className="font-bold text-rose-600 dark:text-rose-400">Lớp đã đầy</span>
                                                ) : (
                                                    <span>Trống {item.maxStudents - item.studentsCount} chỗ</span>
                                                )}
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${
                                                        item.studentsCount === item.maxStudents ? 'bg-rose-500' : item.studentsCount > item.maxStudents * 0.8 ? 'bg-amber-500' : 'bg-emerald-500'
                                                    }`}
                                                    style={{ width: `${(item.studentsCount / item.maxStudents) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        {item.status === 'ongoing' && (
                                            <div className="space-y-1 border-t border-neutral-100 pt-3 dark:border-neutral-800/60">
                                                <div className="text-indigo-650 flex justify-between text-[10px] font-bold dark:text-indigo-400">
                                                    <span>Đã học được {item.progress}% thời gian ca</span>
                                                    <span>{item.timeInfo}</span>
                                                </div>
                                                <div className="h-1 w-full overflow-hidden rounded-full bg-indigo-100 dark:bg-indigo-950">
                                                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" style={{ width: `${item.progress}%` }} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 py-10 dark:border-neutral-800">
                                    <Calendar className="mb-2 size-8 text-neutral-300 dark:text-neutral-700" />
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Không tìm thấy lịch học nào khớp với bộ lọc</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="border-b border-neutral-100 pb-4 dark:border-neutral-800">
                            <h2 className="flex items-center gap-2 text-base font-bold text-neutral-900 dark:text-white">
                                <GraduationCap className="size-4 text-rose-500" />
                                Đội Ngũ Giảng Viên
                            </h2>
                        </div>

                        <div className="mt-6 divide-y divide-neutral-100 dark:divide-neutral-800">
                            {updatedTeachers.map((teacher, index) => (
                                <div key={index} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`relative flex size-10 items-center justify-center rounded-full bg-gradient-to-br ${teacher.avatarColor} text-sm font-extrabold text-white shadow-inner`}>
                                            {teacher.name.split(' ').pop()?.substring(0, 2).toUpperCase()}
                                            <span className={`absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-white dark:border-neutral-900 ${teacher.status === 'online' ? 'bg-emerald-500' : 'animate-pulse bg-amber-500'}`} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">{teacher.name}</h4>
                                            <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">{teacher.role}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Star className="size-3.5 fill-amber-400 stroke-amber-400" />
                                            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{teacher.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="border-b border-neutral-100 pb-4 dark:border-neutral-800">
                        <h2 className="flex items-center gap-2 text-base font-bold text-neutral-900 dark:text-white">
                            <Activity className="size-4 text-indigo-500" />
                            Hoạt Động Gần Đây
                        </h2>
                    </div>

                    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {recentActivities.map((act) => {
                            const ActIcon = act.icon;
                            return (
                                <div key={act.id} className="flex items-start gap-3 rounded-lg border border-neutral-100/50 bg-neutral-50/50 p-4 transition-all hover:bg-neutral-50 dark:bg-neutral-950/20 dark:hover:bg-neutral-950/40">
                                    <div className={`shrink-0 rounded-lg p-2 ${act.iconBg}`}>
                                        <ActIcon className="size-4" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs leading-normal text-neutral-600 dark:text-neutral-300">
                                            <strong className="font-bold text-neutral-900 dark:text-white">{act.student}</strong> {act.action} <span className="font-semibold text-indigo-600 dark:text-indigo-400">{act.target}</span>
                                        </p>
                                        <span className="block text-[10px] text-neutral-400">{act.time}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
