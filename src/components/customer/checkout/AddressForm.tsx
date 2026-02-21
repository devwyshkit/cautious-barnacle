'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, MapPin, Building2, Briefcase, User, Phone, Save, Navigation, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { createAddress } from '@/lib/actions/user/addresses';
import { getAddressFromCoords } from '@/lib/actions/discovery/location';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { AddressAutocomplete, type PlaceAddress } from './AddressAutocomplete';

// WYSHKIT 2026: Swiggy pattern - minimal fields. Place fills city/state/pincode.
// Manual entry: area, city, state, pincode (fallback when Google API unavailable)
const addressSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
    flatBuilding: z.string().min(3, 'Flat/Building is required'),
    landmark: z.string().optional(),
    type: z.enum(['home', 'work', 'other']),
    is_default: z.boolean(),
    manualArea: z.string().optional(),
    manualCity: z.string().optional(),
    manualState: z.string().optional(),
    manualPincode: z.string().optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

// Hidden fields set by Place/geolocation
type PlaceData = {
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
};

interface AddressFormProps {
    onSuccess: (address: any) => void;
    onCancel: () => void;
    initialValues?: Partial<AddressFormValues & PlaceData>;
}

export function AddressForm({ onSuccess, onCancel, initialValues }: AddressFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [placeData, setPlaceData] = useState<PlaceData | null>(null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [entryMode, setEntryMode] = useState<'search' | 'manual'>('search');

    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            type: 'home',
            is_default: true,
            manualArea: '',
            manualCity: '',
            manualState: '',
            manualPincode: '',
            ...initialValues,
        } as any,
    });

    const handlePlaceSelect = useCallback((place: PlaceAddress) => {
        setPlaceData({
            address_line1: place.address_line1,
            address_line2: place.address_line2,
            city: place.city,
            state: place.state,
            pincode: place.pincode,
            latitude: place.latitude,
            longitude: place.longitude,
        });
    }, []);

    const handleUseCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported');
            return;
        }
        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    const result = await getAddressFromCoords(lat, lng);
                    if (result.error) {
                        toast.error(result.error);
                        return;
                    }
                    setPlaceData({
                        address_line1: result.formattedAddress || result.city || 'Current location',
                        city: result.city || '',
                        state: result.state || '',
                        pincode: result.pincode || '',
                        latitude: lat,
                        longitude: lng,
                    });
                    toast.success('Location set');
                } finally {
                    setIsGettingLocation(false);
                }
            },
            () => {
                toast.error('Could not get location');
                setIsGettingLocation(false);
            },
            { enableHighAccuracy: true }
        );
    }, []);

    const onSubmit = async (data: AddressFormValues) => {
        let resolvedPlace: PlaceData;
        if (entryMode === 'manual') {
            const area = (data.manualArea || '').trim();
            const pincode = (data.manualPincode || '').trim();
            if (area.length < 3) {
                toast.error('Please enter area/locality (min 3 characters)');
                return;
            }
            if (!/^\d{6}$/.test(pincode)) {
                toast.error('Please enter a valid 6-digit pincode');
                return;
            }
            resolvedPlace = {
                address_line1: area,
                city: (data.manualCity || '').trim(),
                state: (data.manualState || '').trim(),
                pincode,
                latitude: 0,
                longitude: 0,
            };
        } else {
            if (!placeData) {
                toast.error('Select an address or use current location first');
                return;
            }
            resolvedPlace = placeData;
        }

        setIsSubmitting(true);
        try {
            // Combine user flat + place area for full address (Swiggy pattern)
            const address_line1 = `${data.flatBuilding}, ${resolvedPlace.address_line1}`.trim();
            const payload = {
                ...data,
                address_line1,
                address_line2: data.landmark || resolvedPlace.address_line2 || null,
                city: resolvedPlace.city || '',
                state: resolvedPlace.state || '',
                pincode: resolvedPlace.pincode,
                latitude: resolvedPlace.latitude || null,
                longitude: resolvedPlace.longitude || null,
                country: 'India',
            };

            const result = await createAddress({
                type: payload.type,
                name: payload.name,
                phone: payload.phone,
                address_line1: payload.address_line1,
                address_line2: payload.address_line2,
                city: payload.city,
                state: payload.state,
                pincode: payload.pincode,
                country: payload.country,
                latitude: payload.latitude,
                longitude: payload.longitude,
                is_default: payload.is_default,
            });

            if (result.error) {
                toast.error(result.error);
                return;
            }

            toast.success('Address saved');
            onSuccess(result.address);
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-6 md:max-w-md">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Contact</Label>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                            <User className="absolute left-3 top-3 size-4 text-zinc-400" />
                            <Input placeholder="Full Name" {...form.register('name')} className="pl-9 bg-zinc-50/50 border-zinc-200 focus:bg-white transition-all" />
                        </div>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 size-4 text-zinc-400" />
                            <Input placeholder="Phone" {...form.register('phone')} className="pl-9 bg-zinc-50/50 border-zinc-200 focus:bg-white transition-all" maxLength={10} />
                        </div>
                    </div>
                    {(form.formState.errors.name || form.formState.errors.phone) && (
                        <p className="text-[10px] font-bold text-rose-500 ml-1">
                            {form.formState.errors.name?.message || form.formState.errors.phone?.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Address Type</Label>
                    <RadioGroup
                        value={form.watch('type')}
                        onValueChange={(val) => form.setValue('type', val as any)}
                        className="grid grid-cols-3 gap-3"
                    >
                        {[
                            { value: 'home', icon: MapPin, label: 'Home' },
                            { value: 'work', icon: Briefcase, label: 'Work' },
                            { value: 'other', icon: Building2, label: 'Other' },
                        ].map((type) => (
                            <div key={type.value}>
                                <RadioGroupItem value={type.value} id={`type-${type.value}`} className="peer sr-only" />
                                <Label
                                    htmlFor={`type-${type.value}`}
                                    className="flex flex-col items-center justify-between rounded-xl border-2 border-zinc-100 bg-white p-3 hover:bg-zinc-50 cursor-pointer transition-all peer-data-[state=checked]:border-zinc-900 peer-data-[state=checked]:[&_svg]:text-zinc-900"
                                >
                                    <type.icon className="mb-2 size-5 text-zinc-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">{type.label}</span>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Location</Label>
                    {entryMode === 'search' ? (
                        <>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <AddressAutocomplete
                                        onPlaceSelect={handlePlaceSelect}
                                        placeholder="Search area or address"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={handleUseCurrentLocation}
                                    disabled={isGettingLocation}
                                    className="shrink-0 rounded-xl h-10 w-10"
                                    aria-label="Use current location"
                                >
                                    {isGettingLocation ? <Loader2 className="size-4 animate-spin" /> : <Navigation className="size-4" />}
                                </Button>
                            </div>
                            {placeData && (
                                <p className="text-[10px] text-emerald-600 font-medium">
                                    {placeData.city} {placeData.pincode}
                                </p>
                            )}
                            <button
                                type="button"
                                onClick={() => setEntryMode('manual')}
                                className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-700 underline decoration-zinc-200"
                            >
                                Can&apos;t find your address? Enter manually
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="grid gap-3">
                                <Input
                                    placeholder="Area, street, locality"
                                    {...form.register('manualArea')}
                                    className="bg-zinc-50/50 border-zinc-200 focus:bg-white"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        placeholder="City"
                                        {...form.register('manualCity')}
                                        className="bg-zinc-50/50 border-zinc-200 focus:bg-white"
                                    />
                                    <Input
                                        placeholder="State"
                                        {...form.register('manualState')}
                                        className="bg-zinc-50/50 border-zinc-200 focus:bg-white"
                                    />
                                </div>
                                <Input
                                    placeholder="Pincode (6 digits)"
                                    {...form.register('manualPincode')}
                                    className="bg-zinc-50/50 border-zinc-200 focus:bg-white"
                                    maxLength={6}
                                    inputMode="numeric"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setEntryMode('search')}
                                className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-700 underline decoration-zinc-200 flex items-center gap-1"
                            >
                                <Edit3 className="size-3" />
                                Use search or current location instead
                            </button>
                        </>
                    )}
                </div>

                <div className="space-y-2">
                    <Input
                        placeholder="Flat, Building, Floor (e.g. 101, Tower A)"
                        {...form.register('flatBuilding')}
                        className="bg-zinc-50/50 border-zinc-200 focus:bg-white transition-all"
                    />
                    {form.formState.errors.flatBuilding && (
                        <p className="text-[10px] font-bold text-rose-500 ml-1">{form.formState.errors.flatBuilding.message}</p>
                    )}
                </div>

                <div>
                    <Input
                        placeholder="Landmark (optional)"
                        {...form.register('landmark')}
                        className="bg-zinc-50/50 border-zinc-200 focus:bg-white transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-xl h-12 font-bold border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="flex-[2] rounded-xl h-12 font-bold bg-zinc-900 text-white hover:bg-zinc-800"
                    disabled={
                        isSubmitting ||
                        (entryMode === 'search' ? !placeData : false) ||
                        (entryMode === 'manual'
                            ? !((form.watch('manualArea')?.trim()?.length ?? 0) >= 3 && /^\d{6}$/.test(form.watch('manualPincode') || ''))
                            : false)
                    }
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 size-4" />
                            Save Address
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
