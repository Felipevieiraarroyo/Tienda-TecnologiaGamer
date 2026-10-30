// TODO [D]: misma forma que CardProducto pero con <Skeleton />
import { Skeleton } from "./Skeleton";

export function SkeletonCardProducto() {
  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      {/* Imagem do produto */}
      <Skeleton className="h-40 w-full rounded-none" />

      <div className="space-y-2 p-4">
        {/* Categoria */}
        <Skeleton className="h-3 w-24" />

        {/* Nome e preço */}
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>

        {/* Descrição */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />

        {/* Estoque */}
        <Skeleton className="h-3 w-16" />
      </div>
    </article>
  );
}
