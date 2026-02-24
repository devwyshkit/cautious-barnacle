import { VendorCard } from '@/components/ui/VendorCard';
import { LayoutGrid } from '@/components/ui/LayoutGrid';

interface GridProps {
    data: any[];
}

export function Grid({ data }: GridProps) {
    if (!data || data.length === 0) return null;

    return (
        <LayoutGrid cols={2} gap="md" className="px-4 md:px-0">
            {data.map((product: any) => (
                <VendorCard
                    key={product.id}
                    data={product}
                    className="bg-white"
                />
            ))}
        </LayoutGrid>
    );
}
