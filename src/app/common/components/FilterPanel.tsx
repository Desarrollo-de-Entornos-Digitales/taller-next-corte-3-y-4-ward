'use client';

import PrimaryButton from './PrimaryButton';
import FilterBox from './FilterBox';

type FilterPanelProps = {
    types: string[];
    brands: string[];
    colors: string[];
    selectedType: string | null;
    selectedBrand: string | null;
    selectedColor: string | null;
    pendingType: string | null;
    pendingBrand: string | null;
    pendingColor: string | null;
    onPendingTypeChange: (value: string) => void;
    onPendingBrandChange: (value: string) => void;
    onPendingColorChange: (value: string) => void;
    onApply: () => void;
    onClear: () => void;
};

export default function FilterPanel({
    types,
    brands,
    colors,
    selectedType,
    selectedBrand,
    selectedColor,
    pendingType,
    pendingBrand,
    pendingColor,
    onPendingTypeChange,
    onPendingBrandChange,
    onPendingColorChange,
    onApply,
    onClear,
}: FilterPanelProps) {
    return (
        <section className="mb-10 rounded-[32px] border border-gray-600/40 bg-slate-950/40 px-8 py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="text-white text-sm font-medium">Filtro</div>

                <div className="flex flex-wrap items-center gap-4">
                    <FilterBox
                        label="Prendas"
                        value={pendingType ?? 'All types'}
                        options={['All types', ...types]}
                        onChange={onPendingTypeChange}
                    />
                    <FilterBox
                        label="Marca"
                        value={pendingBrand ?? 'All brands'}
                        options={['All brands', ...brands]}
                        onChange={onPendingBrandChange}
                    />
                    <FilterBox
                        label="Colores"
                        value={pendingColor ?? 'All colors'}
                        options={['All colors', ...colors]}
                        onChange={onPendingColorChange}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onClear}
                        className="rounded-full border border-slate-600/70 bg-slate-900/60 px-5 py-2 text-sm text-white/80 hover:text-white transition"
                    >
                        Limpiar
                    </button>
                    <PrimaryButton label="Aplicar" onClick={onApply} fullWidth={false} />
                </div>
            </div>
        </section>
    );
}
