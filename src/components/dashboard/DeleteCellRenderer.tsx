import { CustomCellRendererProps } from 'ag-grid-react';

type DeleteCellRendererProps = CustomCellRendererProps & {
    onDelete: (id: number) => void;
};

export function DeleteCellRenderer(params: DeleteCellRendererProps) {
    return (
        <button
            onClick={() => params.onDelete(params.data.id)}
            className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md transition-colors"
            style={{
                background: 'rgba(248, 113, 113, 0.12)',
                color: '#fca5a5',
                border: '1px solid rgba(248, 113, 113, 0.25)',
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                    'rgba(248, 113, 113, 0.25)';
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                    'rgba(248, 113, 113, 0.12)';
            }}
        >
            🗑 Delete
        </button>
    );
}
