'use client';

import * as React from 'react';
import {
    Bar,
    BarChart as RechartsBarChart,
    Line,
    LineChart as RechartsLineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
    Area,
    AreaChart as RechartsAreaChart,
    Pie,
    PieChart as RechartsPieChart,
    Cell,
} from 'recharts';

import { cn } from '@/lib/utils';

// ================================
// CHART WRAPPER
// ================================

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function ChartContainer({
    children,
    className,
    ...props
}: ChartContainerProps) {
    return (
        <div className={cn('w-full', className)} {...props}>
            <ResponsiveContainer width="100%" height="100%">
                {children}
            </ResponsiveContainer>
        </div>
    );
}

// ================================
// BAR CHART
// ================================

interface BarChartProps {
    data: Array<Record<string, unknown>>;
    xAxisKey: string;
    bars: Array<{
        dataKey: string;
        fill?: string;
        name?: string;
    }>;
    height?: number;
    className?: string;
}

export function BarChart({
    data,
    xAxisKey,
    bars,
    height = 300,
    className,
}: BarChartProps) {
    const defaultColors = [
        'hsl(var(--primary))',
        'hsl(var(--secondary))',
        'hsl(var(--accent))',
        'hsl(var(--muted))',
    ];

    return (
        <div className={cn('w-full', className)} style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                        dataKey={xAxisKey}
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                        className="fill-muted-foreground"
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                        className="fill-muted-foreground"
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px',
                            fontSize: '12px',
                        }}
                    />
                    <Legend />
                    {bars.map((bar, index) => (
                        <Bar
                            key={bar.dataKey}
                            dataKey={bar.dataKey}
                            fill={bar.fill || defaultColors[index % defaultColors.length]}
                            name={bar.name || bar.dataKey}
                            radius={[4, 4, 0, 0]}
                        />
                    ))}
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
}

// ================================
// LINE CHART
// ================================

interface LineChartProps {
    data: Array<Record<string, unknown>>;
    xAxisKey: string;
    lines: Array<{
        dataKey: string;
        stroke?: string;
        name?: string;
    }>;
    height?: number;
    className?: string;
}

export function LineChart({
    data,
    xAxisKey,
    lines,
    height = 300,
    className,
}: LineChartProps) {
    const defaultColors = [
        'hsl(var(--primary))',
        'hsl(var(--secondary))',
        'hsl(var(--accent))',
    ];

    return (
        <div className={cn('w-full', className)} style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                        dataKey={xAxisKey}
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                        className="fill-muted-foreground"
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                        className="fill-muted-foreground"
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px',
                            fontSize: '12px',
                        }}
                    />
                    <Legend />
                    {lines.map((line, index) => (
                        <Line
                            key={line.dataKey}
                            type="monotone"
                            dataKey={line.dataKey}
                            stroke={line.stroke || defaultColors[index % defaultColors.length]}
                            name={line.name || line.dataKey}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    ))}
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    );
}

// ================================
// AREA CHART
// ================================

interface AreaChartProps {
    data: Array<Record<string, unknown>>;
    xAxisKey: string;
    areas: Array<{
        dataKey: string;
        fill?: string;
        stroke?: string;
        name?: string;
    }>;
    height?: number;
    className?: string;
}

export function AreaChart({
    data,
    xAxisKey,
    areas,
    height = 300,
    className,
}: AreaChartProps) {
    const defaultColors = [
        { fill: 'hsl(var(--primary) / 0.2)', stroke: 'hsl(var(--primary))' },
        { fill: 'hsl(var(--secondary) / 0.2)', stroke: 'hsl(var(--secondary))' },
    ];

    return (
        <div className={cn('w-full', className)} style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <RechartsAreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                        dataKey={xAxisKey}
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                        className="fill-muted-foreground"
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                        className="fill-muted-foreground"
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px',
                            fontSize: '12px',
                        }}
                    />
                    <Legend />
                    {areas.map((area, index) => (
                        <Area
                            key={area.dataKey}
                            type="monotone"
                            dataKey={area.dataKey}
                            fill={area.fill || defaultColors[index % defaultColors.length].fill}
                            stroke={area.stroke || defaultColors[index % defaultColors.length].stroke}
                            name={area.name || area.dataKey}
                            strokeWidth={2}
                        />
                    ))}
                </RechartsAreaChart>
            </ResponsiveContainer>
        </div>
    );
}

// ================================
// PIE CHART
// ================================

interface PieChartProps {
    data: Array<{
        name: string;
        value: number;
        fill?: string;
    }>;
    height?: number;
    className?: string;
    showLabel?: boolean;
}

const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(142 76% 36%)', // green
    'hsl(38 92% 50%)', // amber
    'hsl(280 65% 60%)', // purple
    'hsl(199 89% 48%)', // blue
];

const renderPieLabel = (entry: { name?: string; percent?: number }) => {
    const name = entry.name ?? '';
    const percent = entry.percent ?? 0;
    return `${name} ${(percent * 100).toFixed(0)}%`;
};

export function PieChartComponent({
    data,
    height = 300,
    className,
    showLabel = true,
}: PieChartProps) {
    return (
        <div className={cn('w-full', className)} style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={showLabel ? renderPieLabel : undefined}
                        labelLine={showLabel}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.fill || COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px',
                            fontSize: '12px',
                        }}
                    />
                    <Legend />
                </RechartsPieChart>
            </ResponsiveContainer>
        </div>
    );
}

export { ResponsiveContainer };
