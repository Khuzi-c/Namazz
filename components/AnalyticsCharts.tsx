'use client'

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts'

type ChartProps = {
    data: { date: string; count: number }[]
}

export function WeeklyProgressChart({ data }: ChartProps) {
    return (
        <div className="h-64 w-full bg-white p-4 rounded-xl shadow-sm border border-emerald-50">
            <h3 className="text-emerald-800 font-semibold mb-4">Weekly Progress</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="date"
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        domain={[0, 5]}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export function ConsistencyBarChart({ data }: ChartProps) {
    return (
        <div className="h-64 w-full bg-white p-4 rounded-xl shadow-sm border border-emerald-50">
            <h3 className="text-emerald-800 font-semibold mb-4">Monthly Consistency</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} />
                    <YAxis hide />
                    <Tooltip cursor={{ fill: '#ecfdf5' }} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
