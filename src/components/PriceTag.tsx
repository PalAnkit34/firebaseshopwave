export default function PriceTag({ original, discounted, currency = '₹' }: { original: number; discounted?: number; currency?: string }) {
  const price = discounted ?? original
  const off = discounted ? Math.round(((original - discounted) / original) * 100) : 0
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-lg font-semibold">{currency}{price.toLocaleString('en-IN')}</span>
      {discounted && (
        <>
          <span className="text-sm text-gray-400 line-through">{currency}{original.toLocaleString('en-IN')}</span>
          <span className="text-xs font-medium text-green-600">{off}% off</span>
        </>
      )}
    </div>
  )
}
