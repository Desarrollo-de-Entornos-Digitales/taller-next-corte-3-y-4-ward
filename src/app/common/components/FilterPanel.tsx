'use client';

import PrimaryButton from './PrimaryButton';
import FilterBox from './FilterBox';

type FilterPanelProps = {
    types: string[];
    selectedType: string | null;
    pendingType: string | null;
    onPendingTypeChange: (value: string) => void;
    onApply: () => void;
    onClear: () => void;
};

export default function FilterPanel({
    types,
    selectedType,
    pendingType,
    onPendingTypeChange,
    onApply,
    onClear,
}: FilterPanelProps) {
    return (
        <section className="mb-10 rounded-[32px] border border-gray-600/40 bg-slate-950/40 px-8 py-4">
            <div className="flex items-center justify-between gap-6">
                <div className="text-white text-sm font-medium">Filtro</div>

                <div className="flex items-center gap-4">
                    <FilterBox
                        label="Prendas"
                        value={pendingType || 'All types'}
                        options={['All types', ...types]}
                        onChange={onPendingTypeChange}
                    />
                    <FilterBox label="Marca" value="Marca" options={['Marca']} onChange={() => {}} disabled={true} />
                    <FilterBox
                        label="Colores"
                        value="Colores"
                        options={['Colores']}
                        onChange={() => {}}
                        disabled={true}
                    />
                </div>

                <PrimaryButton label="Aplicar" onClick={onApply} fullWidth={false} />
            </div>
        </section>
    );
}
