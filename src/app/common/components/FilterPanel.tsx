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
        <section className="mb-10 rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.25)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <FilterBox
                        label="Tipo"
                        value={pendingType || 'All types'}
                        options={['All types', ...types]}
                        onChange={onPendingTypeChange}
                    />
                    <FilterBox
                        label="Ordenar"
                        value="Más recientes"
                        options={['Más recientes', 'Más usados', 'Favoritos']}
                        onChange={() => {
                            /* No-op placeholder: mantener la UI del filtro */
                        }}
                    />
                    <FilterBox
                        label="Ver"
                        value={selectedType ? `Filtrando ${selectedType}` : 'Todos los items'}
                        options={['Todos los items', 'Sólo favoritos', 'Sin filtros']}
                        onChange={() => {
                            /* No-op placeholder: mantener la UI del filtro */
                        }}
                    />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <button
                        type="button"
                        onClick={onClear}
                        className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                    >
                        Limpiar
                    </button>
                    <PrimaryButton label="Aplicar filtro" onClick={onApply} fullWidth={false} />
                </div>
            </div>
        </section>
    );
}
