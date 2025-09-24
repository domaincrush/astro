import React, { useState, useEffect } from 'react';
import { apiRequest } from 'src/lib/queryClient';

interface VedicDetails {
  yog: string;
  karan: string;
  tithi: string;
  varna: string;
  tatva: string;
  nameSyllable: string;
  paya: string;
  gan: string;
  nadi: string;
  yoni: string;
  signLord: string;
  vaahya: string;
}

interface VedicDetailsDisplayProps {
  birthData: {
    name?: string;
    date: string;
    time: string;
    latitude: number;
    longitude: number;
    moonSign?: string;
    nakshatra?: string;
  };
}

export function VedicDetailsDisplay({ birthData }: VedicDetailsDisplayProps) {
  const [vedicDetails, setVedicDetails] = useState<VedicDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVedicDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/calculate-vedic-details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            birthDate: birthData.date,
            birthTime: birthData.time,
            latitude: birthData.latitude,
            longitude: birthData.longitude,
            moonSign: birthData.moonSign,
            nakshatra: birthData.nakshatra
          }),
        });

        const data = await response.json();

        if (data.success) {
          setVedicDetails(data.vedicDetails);
        } else {
          setError('Failed to calculate Vedic details');
        }
      } catch (err: any) {
        console.error('Error fetching Vedic details:', err);
        setError(err.message || 'Error calculating Vedic details');
      } finally {
        setLoading(false);
      }
    };

    if (birthData.date && birthData.time && birthData.latitude && birthData.longitude) {
      fetchVedicDetails();
    }
  }, [birthData]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-300 rounded-lg p-4 mt-4 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-orange-900 mb-3">Vedic Details</h3>
        <div className="text-center text-orange-800">Calculating authentic Vedic details...</div>
      </div>
    );
  }

  if (error || !vedicDetails) {
    return (
      <div className="bg-gradient-to-br from-red-100 to-pink-100 border border-red-300 rounded-lg p-4 mt-4 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-red-800 mb-3">Vedic Details</h3>
        <div className="text-center text-red-700">{error || 'Unable to calculate Vedic details'}</div>
      </div>
    );
  }

  const detailsData = [
    { label: 'Yog', value: vedicDetails.yog, description: 'Planetary combination for fortune' },
    { label: 'Karan', value: vedicDetails.karan, description: 'Half lunar day for auspicious timing' },
    { label: 'Tithi', value: vedicDetails.tithi, description: 'Lunar day for spiritual significance' },
    { label: 'Varna', value: vedicDetails.varna, description: 'Social classification in Vedic tradition' },
    { label: 'Tatva', value: vedicDetails.tatva, description: 'Elemental nature (Prithvi, Jal, Agni, Vayu)' },
    { label: 'Name Syllable', value: vedicDetails.nameSyllable, description: 'Auspicious starting sounds for naming' },
    { label: 'Paya', value: vedicDetails.paya, description: 'Material fortune association' },
    { label: 'Gan', value: vedicDetails.gan, description: 'Temperament category (Deva, Manushya, Rakshasa)' },
    { label: 'Nadi', value: vedicDetails.nadi, description: 'Constitutional pulse (Vata, Pitta, Kapha)' },
    { label: 'Yoni', value: vedicDetails.yoni, description: 'Animal nature for compatibility' },
    { label: 'Sign Lord', value: vedicDetails.signLord, description: 'Ruling planet of Moon sign' },
    { label: 'Vaahya', value: vedicDetails.vaahya, description: 'Animal vehicle for spiritual guidance' }
  ];

  return (
    <div className="bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-300 rounded-lg p-4 mt-4 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-orange-900 mb-4 text-center">
        Comprehensive Vedic Details
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {detailsData.map((detail, index) => (
          <div 
            key={index}
            className="bg-white/90 rounded-md border border-orange-200 p-3 hover:bg-orange-50 transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
            title={detail.description}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-orange-800">
                {detail.label}
              </span>
              <span className="text-sm font-semibold text-orange-900">
                {detail.value}
              </span>
            </div>
            <div className="text-xs text-orange-700 mt-1 leading-tight">
              {detail.description}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-center text-orange-800 border-t border-orange-300 pt-3">
        <span className="font-medium">Calculation Engine:</span> Authentic Vedic Astronomy with Traditional Panchang Methods
      </div>
    </div>
  );
}

export default VedicDetailsDisplay;