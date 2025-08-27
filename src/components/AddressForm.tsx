'use client'
import { useState } from 'react'
import type { Address } from '@/lib/types'

const required = (s?: string) => !!(s && s.trim().length)

export default function AddressForm({ onSubmit, initial, onCancel }: { onSubmit: (a: Address) => void; initial?: Partial<Address>; onCancel?: () => void }) {
  const [a, setA] = useState<Omit<Address, 'id'>>({
    fullName: initial?.fullName || '',
    phone: initial?.phone || '',
    pincode: initial?.pincode || '',
    line1: initial?.line1 || '',
    line2: initial?.line2 || '',
    city: initial?.city || '',
    state: initial?.state || '',
    landmark: initial?.landmark || '',
    default: initial?.default ?? true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!required(a.fullName)) newErrors.fullName = "Full name is required.";
    if (!/^\d{10}$/.test(a.phone)) newErrors.phone = "Must be a 10-digit phone number.";
    if (!/^\d{6}$/.test(a.pincode)) newErrors.pincode = "Must be a 6-digit pincode.";
    if (!required(a.line1)) newErrors.line1 = "Address Line 1 is required.";
    if (!required(a.city)) newErrors.city = "City is required.";
    if (!required(a.state)) newErrors.state = "State is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handle = (k: keyof typeof a) => (e: React.ChangeEvent<HTMLInputElement>) => setA(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ ...initial, ...a });
    }
  }

  const InputField = ({ name, placeholder, value, onChange, error }: { name: keyof Address, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, error?: string }) => (
    <div>
      <input className={`w-full rounded-lg border px-3 py-2 text-sm ${error ? 'border-red-500' : 'border-gray-300'}`} placeholder={placeholder} value={value} onChange={onChange} />
      {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <InputField name="fullName" placeholder="Full Name*" value={a.fullName} onChange={handle('fullName')} error={errors.fullName} />
        <InputField name="phone" placeholder="Phone (10 digits)*" value={a.phone} onChange={handle('phone')} error={errors.phone} />
        <InputField name="pincode" placeholder="Pincode (6 digits)*" value={a.pincode} onChange={handle('pincode')} error={errors.pincode} />
        <InputField name="city" placeholder="City*" value={a.city} onChange={handle('city')} error={errors.city} />
        <div className="md:col-span-2">
          <InputField name="line1" placeholder="Address Line 1*" value={a.line1} onChange={handle('line1')} error={errors.line1} />
        </div>
        <div className="md:col-span-2">
          <InputField name="line2" placeholder="Address Line 2 (optional)" value={a.line2 || ''} onChange={handle('line2')} />
        </div>
        <InputField name="state" placeholder="State*" value={a.state} onChange={handle('state')} error={errors.state} />
        <InputField name="landmark" placeholder="Landmark (optional)" value={a.landmark || ''} onChange={handle('landmark')} />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" className="rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-50">Save Address</button>
        {onCancel && <button type="button" onClick={onCancel} className="rounded-xl border px-5 py-2 text-sm font-semibold">Cancel</button>}
      </div>
    </form>
  )
}
