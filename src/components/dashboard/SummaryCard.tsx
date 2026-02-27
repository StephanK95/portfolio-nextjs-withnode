interface SummaryCardProps {
    label: string;
    value: string;
    color: string;
}

export function SummaryCard({ label, value, color }: SummaryCardProps) {
    return (
        <div
            className="rounded-xl p-6"
            style={{
                background: 'rgba(20, 15, 45, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.12)',
                boxShadow: '0 0 0 1px rgba(179,152,255,0.06)',
            }}
        >
            <h3
                className="text-sm font-medium mb-1"
                style={{ color: 'rgba(148, 163, 184, 0.7)' }}
            >
                {label}
            </h3>
            <p className="text-3xl font-bold" style={{ color }}>
                {value}
            </p>
        </div>
    );
}
