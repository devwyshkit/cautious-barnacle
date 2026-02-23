import { PartnerCard } from '@/components/ui/PartnerCard';
import { LayoutGrid } from '@/components/ui/LayoutGrid';

interface GridProps {
    data: any[];
}

export function Grid({ data }: GridProps) {
    if (!data || data.length === 0) return null;

    return (
        <LayoutGrid cols={2} gap="md" className="px-4 md:px-0">
            {data.map((item: any) => (
                <PartnerCard
                    key={item.id}
                    data={item}
                    className="bg-white"
                />
            ))}
        </LayoutGrid>
    );
}
