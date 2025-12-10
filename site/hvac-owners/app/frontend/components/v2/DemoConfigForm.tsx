'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { inferRegionFromPhone, getClimateDescription } from '@/utils/areaCodeMapping';

export default function DemoConfigForm({ onConfigured }: { onConfigured: (data: any) => void }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        businessName: 'Diamond Cooling',
        ownerName: 'Bob',
        ownerPhone: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Infer region from phone number area code
        const { region } = inferRegionFromPhone(formData.ownerPhone);

        // Save session to Supabase
        const { data, error } = await supabase
            .from('demo_sessions')
            .insert([{
                business_name: formData.businessName,
                region: region,
                owner_name: formData.ownerName,
                owner_phone: formData.ownerPhone
            }])
            .select()
            .single();

        if (error) {
            console.error('Error saving config:', error);
            alert('Failed to save configuration');
            setLoading(false);
            return;
        }

        onConfigured(data);
        setLoading(false);
    };

    return (
        <div className="w-full max-w-md mx-auto bg-gray-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Configure Demo
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Business Name</label>
                    <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Owner Name</label>
                    <input
                        type="text"
                        value={formData.ownerName}
                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Owner Phone</label>
                    <input
                        type="tel"
                        value={formData.ownerPhone}
                        onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                        placeholder="+1 305-555-0100"
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        required
                    />
                    {formData.ownerPhone && (
                        <p className="text-xs text-gray-400 mt-1">{getClimateDescription(formData.ownerPhone)}</p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                >
                    {loading ? 'Configuring...' : 'Start Demo'}
                </button>
            </form>
        </div>
    );
}
