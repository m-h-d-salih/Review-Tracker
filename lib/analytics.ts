import { supabase } from './supabase';
import { Review, ReviewType } from '@/types';

export interface MonthlyTrend {
  month: string;
  review: number;
  session: number;
  group_session: number;
  group_project: number;
  total: number;
}

export interface AdvisorStat {
  advisor_name: string;
  total: number;
  review: number;
  session: number;
  group_session: number;
  group_project: number;
}

export interface InternStat {
  intern_name: string;
  count: number;
  lastDate: string;
}

export interface AnalyticsData {
  totalAllTime: number;
  totalThisMonth: number;
  totalToday: number;
   mostInADay: number;
   mostInADayDate:string,
  typeDistribution: { name: string; value: number; color: string }[];
  monthlyTrend: MonthlyTrend[];
  topAdvisors: AdvisorStat[];
  topInterns: InternStat[];
  recentActivity: Review[];
}

const TYPE_COLORS: Record<ReviewType, string> = {
  review:        '#00d4a4',
  session:       '#6366f1',
  group_session: '#f59e0b',
  group_project: '#ef4444',
};

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export async function fetchAnalytics(): Promise<AnalyticsData> {
  // Fetch last 6 months of data
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  const from = sixMonthsAgo.toISOString().split('T')[0];

const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .gte('review_date', from)
    .order('review_date', { ascending: false });

  const { data: allReviews } = await supabase
    .from('reviews')
    .select('*')
    .order('review_date', { ascending: false });

  const all = (reviews ?? []) as Review[];
  const allTime = (allReviews ?? []) as Review[];

  // All-time count
  const { count: totalAllTime } = await supabase
    .from('reviews')
    .select('id', { count: 'exact', head: true });

  const now = new Date();
  const thisMonthFrom = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-01`;
  const totalThisMonth = all.filter(r => r.review_date >= thisMonthFrom).length;
const today = new Date().toISOString().split('T')[0]; // e.g. "2026-03-10"
const totalToday = allTime.filter(r => r.review_date === today).length;

// Most reviews in a single day
// Most reviews in a single day
const dayMap: Record<string, number> = {};
allTime.forEach(r => { dayMap[r.review_date] = (dayMap[r.review_date] ?? 0) + 1; });
const mostInADay = Object.values(dayMap).length > 0 ? Math.max(...Object.values(dayMap)) : 0;
const mostInADayDate = Object.entries(dayMap).find(([, v]) => v === mostInADay)?.[0] ?? '';
  // Type distribution
 const typeCounts: Record<ReviewType, number> = { review: 0, session: 0, group_session: 0, group_project: 0 };
  allTime.forEach(r => { typeCounts[r.type] = (typeCounts[r.type] ?? 0) + 1; });
  const typeDistribution = [
    { name: 'Review',        value: typeCounts.review,        color: TYPE_COLORS.review },
    { name: 'Session',       value: typeCounts.session,       color: TYPE_COLORS.session },
    { name: 'Group Session', value: typeCounts.group_session, color: TYPE_COLORS.group_session },
    { name: 'Group Project', value: typeCounts.group_project, color: TYPE_COLORS.group_project },
  ].filter(t => t.value > 0);

  // Monthly trend (last 6 months)
  // Build monthly trend for ALL months we have data
  const allDates = allTime.map(r => r.review_date).sort();
  const earliest = allDates[0] ?? new Date().toISOString().split('T')[0];
  const earliestDate = new Date(earliest);
  const now2 = new Date();
  const totalMonths = (now2.getFullYear() - earliestDate.getFullYear()) * 12
    + (now2.getMonth() - earliestDate.getMonth());

  const monthlyTrend: MonthlyTrend[] = [];
  for (let i = totalMonths; i >= 0; i--) {
    const d = new Date();
     d.setDate(1); // ← fix: set to 1st before subtracting months
    d.setMonth(d.getMonth() - i);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const label = `${MONTH_NAMES[m-1]} ${y}`;
    const monthFrom = `${y}-${String(m).padStart(2,'0')}-01`;
    const monthTo   = `${y}-${String(m).padStart(2,'0')}-${new Date(y,m,0).getDate()}`;
    const monthReviews = allTime.filter(r => r.review_date >= monthFrom && r.review_date <= monthTo);
    monthlyTrend.push({
      month: label,
      review: monthReviews.filter(r=>r.type==='review').length,
      session: monthReviews.filter(r=>r.type==='session').length,
      group_session: monthReviews.filter(r=>r.type==='group_session').length,
      group_project: monthReviews.filter(r=>r.type==='group_project').length,
      total: monthReviews.length,
    });
  }

  // Top advisors
const advisorMap: Record<string, AdvisorStat> = {};
  allTime.forEach(r => {
    const key = r.advisor_name.toLowerCase().trim();
    if (!advisorMap[key]) {
      advisorMap[key] = { advisor_name: r.advisor_name|| 'Unknown', total:0, review:0, session:0, group_session:0, group_project:0 };
    }
    advisorMap[key].total++;
    advisorMap[key][r.type]++;
  });
  const topAdvisors = Object.values(advisorMap).sort((a,b)=>b.total-a.total).slice(0,5);

  // Top interns
const internMap: Record<string, InternStat> = {};
  allTime.forEach(r => {
    const key = r.intern_name.toLowerCase().trim();
    if (!internMap[key]) {
      internMap[key] = { intern_name: r.intern_name, count: 0, lastDate: r.review_date };
    }
    internMap[key].count++;
    if (r.review_date > internMap[key].lastDate) internMap[key].lastDate = r.review_date;
  });
  const topInterns = Object.values(internMap).sort((a,b)=>b.count-a.count).slice(0,5);

  // Recent activity (last 5)
  const recentActivity = all.slice(0, 5);

  return {
    totalAllTime: totalAllTime ?? 0,
    totalThisMonth,
    typeDistribution,
    monthlyTrend,
    topAdvisors,
    topInterns,
    recentActivity,
    totalToday,
    mostInADay,
    mostInADayDate
  };
}
