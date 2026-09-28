// components/Address/AddressSelection/AddressSelection.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, ChevronDown, X, Search, Check, Globe, Home, Loader2, Navigation } from 'lucide-react';
import styles from './AddressSelection.module.scss';
import { createPortal } from 'react-dom';

interface Country {
    code: string;
    name: string;
    flag: string;
    dialCode?: string;
}

export interface AddressData {
    country: string;
    pincode: string;
    fullAddress?: string;
    locality?: string;
    city?: string;
    state?: string;
    countryCode?: string;
    lat?: number;
    lng?: number;
}

interface AddressSuggestion {
    id: string;
    pincode: string;
    locality: string;
    city: string;
    state: string;
    country: string;
    countryCode: string;
    fullAddress: string;
    lat?: number;
    lng?: number;
    displayName?: string;
}

interface AddressSelectionProps {
    onConfirm?: (address: AddressData) => void;
    onClose?: () => void;
    initialCountry?: string;
    initialPincode?: string;
    className?: string;
}

// Country codes mapping for Nominatim API
const COUNTRY_CODES: Record<string, string> = {
    'IN': 'in',
    'US': 'us',
    'CA': 'ca',
    'AU': 'au',
    'GB': 'gb',
    'DE': 'de',
    'FR': 'fr',
    'IT': 'it',
    'ES': 'es',
    'BR': 'br',
    'MX': 'mx',
    'JP': 'jp',
    'KR': 'kr',
    'CN': 'cn',
    'RU': 'ru',
    'ZA': 'za',
    'EG': 'eg',
    'NG': 'ng',
    'KE': 'ke',
    'AE': 'ae',
    'SA': 'sa',
    'TR': 'tr',
    'PK': 'pk',
    'BD': 'bd',
    'LK': 'lk',
    'NP': 'np',
    'MY': 'my',
    'SG': 'sg',
    'ID': 'id',
    'PH': 'ph',
    'NZ': 'nz',
    'NL': 'nl',
    'BE': 'be',
    'CH': 'ch',
    'SE': 'se',
    'NO': 'no',
    'DK': 'dk',
    'FI': 'fi',
    'PL': 'pl',
    'PT': 'pt',
    'GR': 'gr',
    'IE': 'ie',
    'AT': 'at',
    'CZ': 'cz',
    'HU': 'hu',
    'RO': 'ro',
    'UA': 'ua',
    'IL': 'il',
    'TH': 'th',
    'VN': 'vn',
    'AR': 'ar',
    'CL': 'cl',
    'CO': 'co',
};

// Reverse mapping for country name to code
const COUNTRY_NAME_TO_CODE: Record<string, string> = {
    'India': 'IN',
    'USA': 'US',
    'Canada': 'CA',
    'Australia': 'AU',
    'United Kingdom': 'GB',
    'Germany': 'DE',
    'France': 'FR',
    'Italy': 'IT',
    'Spain': 'ES',
    'Brazil': 'BR',
    'Mexico': 'MX',
    'Japan': 'JP',
    'South Korea': 'KR',
    'China': 'CN',
    'Russia': 'RU',
    'South Africa': 'ZA',
    'Egypt': 'EG',
    'Nigeria': 'NG',
    'Kenya': 'KE',
    'UAE': 'AE',
    'Saudi Arabia': 'SA',
    'Turkey': 'TR',
    'Pakistan': 'PK',
    'Bangladesh': 'BD',
    'Sri Lanka': 'LK',
    'Nepal': 'NP',
    'Malaysia': 'MY',
    'Singapore': 'SG',
    'Indonesia': 'ID',
    'Philippines': 'PH',
    'New Zealand': 'NZ',
    'Netherlands': 'NL',
    'Belgium': 'BE',
    'Switzerland': 'CH',
    'Sweden': 'SE',
    'Norway': 'NO',
    'Denmark': 'DK',
    'Finland': 'FI',
    'Poland': 'PL',
    'Portugal': 'PT',
    'Greece': 'GR',
    'Ireland': 'IE',
    'Austria': 'AT',
    'Czech Republic': 'CZ',
    'Hungary': 'HU',
    'Romania': 'RO',
    'Ukraine': 'UA',
    'Israel': 'IL',
    'Thailand': 'TH',
    'Vietnam': 'VN',
    'Argentina': 'AR',
    'Chile': 'CL',
    'Colombia': 'CO',
};

// 50+ Countries with flags and dial codes
const countries: Country[] = [
    { code: 'IN', name: 'India', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/india.svg', dialCode: '+91' },
    { code: 'US', name: 'USA', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/usa.svg', dialCode: '+1' },
    { code: 'CA', name: 'Canada', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/canada.svg', dialCode: '+1' },
    { code: 'AU', name: 'Australia', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/australia.svg', dialCode: '+61' },
    { code: 'GB', name: 'United Kingdom', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/uk.svg', dialCode: '+44' },
    { code: 'DE', name: 'Germany', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/germany.svg', dialCode: '+49' },
    { code: 'FR', name: 'France', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/france.svg', dialCode: '+33' },
    { code: 'IT', name: 'Italy', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/italy.svg', dialCode: '+39' },
    { code: 'ES', name: 'Spain', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/spain.svg', dialCode: '+34' },
    { code: 'BR', name: 'Brazil', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/brazil.svg', dialCode: '+55' },
    { code: 'MX', name: 'Mexico', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/mexico.svg', dialCode: '+52' },
    { code: 'JP', name: 'Japan', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/japan.svg', dialCode: '+81' },
    { code: 'KR', name: 'South Korea', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/south-korea.svg', dialCode: '+82' },
    { code: 'CN', name: 'China', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/china.svg', dialCode: '+86' },
    { code: 'RU', name: 'Russia', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/russia.svg', dialCode: '+7' },
    { code: 'ZA', name: 'South Africa', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/south-africa.svg', dialCode: '+27' },
    { code: 'EG', name: 'Egypt', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/egypt.svg', dialCode: '+20' },
    { code: 'NG', name: 'Nigeria', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/nigeria.svg', dialCode: '+234' },
    { code: 'KE', name: 'Kenya', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/kenya.svg', dialCode: '+254' },
    { code: 'AE', name: 'UAE', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/uae.svg', dialCode: '+971' },
    { code: 'SA', name: 'Saudi Arabia', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/saudi-arabia.svg', dialCode: '+966' },
    { code: 'TR', name: 'Turkey', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/turkey.svg', dialCode: '+90' },
    { code: 'PK', name: 'Pakistan', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/pakistan.svg', dialCode: '+92' },
    { code: 'BD', name: 'Bangladesh', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/bangladesh.svg', dialCode: '+880' },
    { code: 'LK', name: 'Sri Lanka', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/sri-lanka.svg', dialCode: '+94' },
    { code: 'NP', name: 'Nepal', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/nepal.svg', dialCode: '+977' },
    { code: 'MY', name: 'Malaysia', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/malaysia.svg', dialCode: '+60' },
    { code: 'SG', name: 'Singapore', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/singapore.svg', dialCode: '+65' },
    { code: 'ID', name: 'Indonesia', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/indonesia.svg', dialCode: '+62' },
    { code: 'PH', name: 'Philippines', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/philippines.svg', dialCode: '+63' },
    { code: 'NZ', name: 'New Zealand', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/new-zealand.svg', dialCode: '+64' },
    { code: 'NL', name: 'Netherlands', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/netherlands.svg', dialCode: '+31' },
    { code: 'BE', name: 'Belgium', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/belgium.svg', dialCode: '+32' },
    { code: 'CH', name: 'Switzerland', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/switzerland.svg', dialCode: '+41' },
    { code: 'SE', name: 'Sweden', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/sweden.svg', dialCode: '+46' },
    { code: 'NO', name: 'Norway', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/norway.svg', dialCode: '+47' },
    { code: 'DK', name: 'Denmark', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/denmark.svg', dialCode: '+45' },
    { code: 'FI', name: 'Finland', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/finland.svg', dialCode: '+358' },
    { code: 'PL', name: 'Poland', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/poland.svg', dialCode: '+48' },
    { code: 'PT', name: 'Portugal', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/portugal.svg', dialCode: '+351' },
    { code: 'GR', name: 'Greece', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/greece.svg', dialCode: '+30' },
    { code: 'IE', name: 'Ireland', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/ireland.svg', dialCode: '+353' },
    { code: 'AT', name: 'Austria', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/austria.svg', dialCode: '+43' },
    { code: 'CZ', name: 'Czech Republic', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/czech-republic.svg', dialCode: '+420' },
    { code: 'HU', name: 'Hungary', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/hungary.svg', dialCode: '+36' },
    { code: 'RO', name: 'Romania', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/romania.svg', dialCode: '+40' },
    { code: 'UA', name: 'Ukraine', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/ukraine.svg', dialCode: '+380' },
    { code: 'IL', name: 'Israel', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/israel.svg', dialCode: '+972' },
    { code: 'TH', name: 'Thailand', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/thailand.svg', dialCode: '+66' },
    { code: 'VN', name: 'Vietnam', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/vietnam.svg', dialCode: '+84' },
    { code: 'AR', name: 'Argentina', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/argentina.svg', dialCode: '+54' },
    { code: 'CL', name: 'Chile', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/chile.svg', dialCode: '+56' },
    { code: 'CO', name: 'Colombia', flag: 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/colombia.svg', dialCode: '+57' },
];

// Storage keys
const STORAGE_KEYS = {
    SELECTED_COUNTRY: 'address_selection_country',
    SELECTED_CITY: 'address_selection_city',
    SELECTED_STATE: 'address_selection_state',
    SELECTED_LOCALITY: 'address_selection_locality',
    SELECTED_PINCODE: 'address_selection_pincode',
    SELECTED_FULL_ADDRESS: 'address_selection_full_address',
};

// Custom event name for address changes
const ADDRESS_CHANGE_EVENT = 'addressSelectionChanged';

// Helper functions for localStorage
const saveToStorage = (key: string, value: string) => {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

const getFromStorage = (key: string): string | null => {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
};

const clearAddressStorage = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    });
};

// Helper function to dispatch address change event
const dispatchAddressChangeEvent = () => {
    try {
        window.dispatchEvent(new CustomEvent(ADDRESS_CHANGE_EVENT));
        console.log('Address change event dispatched');
    } catch (error) {
        console.error('Error dispatching address change event:', error);
    }
};

const AddressSelection: React.FC<AddressSelectionProps> = ({
    onConfirm,
    onClose,
    initialCountry = 'India',
    initialPincode = '',
    className = '',
}) => {
    // Load initial country from localStorage if available
    const getInitialCountry = (): Country => {
        const savedCountryName = getFromStorage(STORAGE_KEYS.SELECTED_COUNTRY);
        if (savedCountryName) {
            const found = countries.find(c => c.name === savedCountryName);
            if (found) return found;
        }
        return countries.find(c => c.name === initialCountry) || countries[0];
    };

    const [isOpen, setIsOpen] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState<Country>(getInitialCountry);
    const [pincode, setPincode] = useState(() => {
        const savedPincode = getFromStorage(STORAGE_KEYS.SELECTED_PINCODE);
        return savedPincode || initialPincode;
    });
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDetecting, setIsDetecting] = useState(false);
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState<AddressSuggestion | null>(() => {
        // Try to restore selected suggestion from localStorage
        const savedFullAddress = getFromStorage(STORAGE_KEYS.SELECTED_FULL_ADDRESS);
        const savedCity = getFromStorage(STORAGE_KEYS.SELECTED_CITY);
        const savedState = getFromStorage(STORAGE_KEYS.SELECTED_STATE);
        const savedLocality = getFromStorage(STORAGE_KEYS.SELECTED_LOCALITY);
        const savedPincode = getFromStorage(STORAGE_KEYS.SELECTED_PINCODE);
        const savedCountry = getFromStorage(STORAGE_KEYS.SELECTED_COUNTRY);
        const savedCountryCode = getFromStorage('address_selection_country_code');

        if (savedFullAddress && savedCity && savedState && savedCountry) {
            return {
                id: 'restored-1',
                pincode: savedPincode || '',
                locality: savedLocality || savedCity,
                city: savedCity,
                state: savedState,
                country: savedCountry,
                countryCode: savedCountryCode || '',
                fullAddress: savedFullAddress,
            };
        }
        return null;
    });
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [detectError, setDetectError] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Fetch address data from Nominatim (OpenStreetMap) API
    const fetchAddressFromNominatim = useCallback(async (query: string, countryCode: string) => {
        try {
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=${countryCode.toLowerCase()}&format=json&addressdetails=1&limit=10&accept-language=en`;

            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'AddressSelectionApp/1.0'
                }
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.length > 0) {
                return data.map((item: any, index: number) => {
                    const address = item.address || {};
                    const postalCode = address.postcode || '';
                    const city = address.city || address.town || address.village || address.municipality || '';
                    const state = address.state || address.region || '';
                    const country = address.country || selectedCountry.name;
                    const countryCodeFromAddress = address.country_code?.toUpperCase() || countryCode;

                    const addressParts = [
                        item.display_name?.split(',')[0] || '',
                        city,
                        state,
                        country,
                        postalCode
                    ].filter(Boolean);

                    return {
                        id: `nominatim-${index}`,
                        pincode: postalCode || query,
                        locality: item.display_name?.split(',')[0] || 'Unknown',
                        city: city || 'Unknown',
                        state: state || 'Unknown',
                        country: country || selectedCountry.name,
                        countryCode: countryCodeFromAddress,
                        fullAddress: addressParts.join(', '),
                        lat: parseFloat(item.lat),
                        lng: parseFloat(item.lon),
                        displayName: item.display_name,
                    };
                });
            }
            return [];
        } catch (error) {
            console.error('Error fetching from Nominatim:', error);
            return [];
        }
    }, [selectedCountry.name]);

    // Get country code for API
    const getCountryCode = useCallback(() => {
        return COUNTRY_CODES[selectedCountry.code] || selectedCountry.code.toLowerCase();
    }, [selectedCountry.code]);

    const handlePincodeChange = (value: string) => {
        setPincode(value);
        setSelectedSuggestion(null);
        setDetectError(null);

        // Save pincode to localStorage
        saveToStorage(STORAGE_KEYS.SELECTED_PINCODE, value);

        // Clear previous timeout
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        const trimmedValue = value.trim();

        if (trimmedValue.length >= 2) {
            setIsLoading(true);

            debounceTimerRef.current = setTimeout(async () => {
                const countryCode = getCountryCode();
                const results = await fetchAddressFromNominatim(trimmedValue, countryCode);

                let finalResults = results;
                if (results.length === 0) {
                    const contextualQuery = `${trimmedValue} ${selectedCountry.name}`;
                    const contextualResults = await fetchAddressFromNominatim(contextualQuery, countryCode);
                    finalResults = contextualResults;
                }

                if (finalResults.length > 0) {
                    setSuggestions(finalResults);
                    setShowSuggestions(true);
                } else {
                    setSuggestions([]);
                    setShowSuggestions(false);
                }
                setIsLoading(false);
            }, 500);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
            setIsLoading(false);
        }
    };

    const handleCountryChange = (country: Country) => {
        setSelectedCountry(country);
        setIsCountryDropdownOpen(false);
        setSearchTerm('');
        setDetectError(null);

        // Save selected country to localStorage
        saveToStorage(STORAGE_KEYS.SELECTED_COUNTRY, country.name);

        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedSuggestion(null);

        // Clear city/state from localStorage when country changes
        localStorage.removeItem(STORAGE_KEYS.SELECTED_CITY);
        localStorage.removeItem(STORAGE_KEYS.SELECTED_STATE);
        localStorage.removeItem(STORAGE_KEYS.SELECTED_LOCALITY);
        localStorage.removeItem(STORAGE_KEYS.SELECTED_FULL_ADDRESS);
        localStorage.removeItem('address_selection_country_code');

        // Dispatch event to notify other components
        dispatchAddressChangeEvent();

        // Refetch suggestions for new country if pincode exists
        const trimmedPincode = pincode.trim();
        if (trimmedPincode.length >= 2) {
            setIsLoading(true);
            const countryCode = COUNTRY_CODES[country.code] || country.code.toLowerCase();

            setTimeout(async () => {
                const results = await fetchAddressFromNominatim(trimmedPincode, countryCode);
                if (results.length > 0) {
                    setSuggestions(results);
                    setShowSuggestions(true);
                } else {
                    setSuggestions([]);
                    setShowSuggestions(false);
                }
                setIsLoading(false);
            }, 300);
        }
    };

    const handleSuggestionSelect = (suggestion: AddressSuggestion) => {
        setSelectedSuggestion(suggestion);
        setPincode(suggestion.fullAddress);
        setShowSuggestions(false);
        setDetectError(null);

        // Save full address details to localStorage
        saveToStorage(STORAGE_KEYS.SELECTED_FULL_ADDRESS, suggestion.fullAddress);
        saveToStorage(STORAGE_KEYS.SELECTED_CITY, suggestion.city);
        saveToStorage(STORAGE_KEYS.SELECTED_STATE, suggestion.state);
        saveToStorage(STORAGE_KEYS.SELECTED_LOCALITY, suggestion.locality);
        saveToStorage(STORAGE_KEYS.SELECTED_PINCODE, suggestion.pincode);
        saveToStorage(STORAGE_KEYS.SELECTED_COUNTRY, suggestion.country);
        saveToStorage('address_selection_country_code', suggestion.countryCode);

        // Update country if different
        const country = countries.find(c => c.code === suggestion.countryCode);
        if (country) {
            setSelectedCountry(country);
            saveToStorage(STORAGE_KEYS.SELECTED_COUNTRY, country.name);
        }

        // Dispatch event to notify other components
        dispatchAddressChangeEvent();
    };

    const handleConfirm = () => {
        if (selectedSuggestion) {
            const addressData: AddressData = {
                country: selectedSuggestion.country,
                pincode: selectedSuggestion.pincode,
                fullAddress: selectedSuggestion.fullAddress,
                locality: selectedSuggestion.locality,
                city: selectedSuggestion.city,
                state: selectedSuggestion.state,
                countryCode: selectedSuggestion.countryCode,
                lat: selectedSuggestion.lat,
                lng: selectedSuggestion.lng,
            };
            // Save all address data to localStorage on confirm
            saveToStorage(STORAGE_KEYS.SELECTED_COUNTRY, selectedSuggestion.country);
            saveToStorage(STORAGE_KEYS.SELECTED_CITY, selectedSuggestion.city);
            saveToStorage(STORAGE_KEYS.SELECTED_STATE, selectedSuggestion.state);
            saveToStorage(STORAGE_KEYS.SELECTED_LOCALITY, selectedSuggestion.locality);
            saveToStorage(STORAGE_KEYS.SELECTED_PINCODE, selectedSuggestion.pincode);
            saveToStorage(STORAGE_KEYS.SELECTED_FULL_ADDRESS, selectedSuggestion.fullAddress);
            saveToStorage('address_selection_country_code', selectedSuggestion.countryCode);

            // Dispatch event to notify other components
            dispatchAddressChangeEvent();

            onConfirm?.(addressData);
            setIsOpen(false);
            onClose?.();
        } else if (pincode.trim()) {
            const addressData: AddressData = {
                country: selectedCountry.name,
                pincode: pincode.trim(),
                fullAddress: `${pincode.trim()}, ${selectedCountry.name}`,
                countryCode: selectedCountry.code,
            };
            // Save basic address to localStorage
            saveToStorage(STORAGE_KEYS.SELECTED_COUNTRY, selectedCountry.name);
            saveToStorage(STORAGE_KEYS.SELECTED_PINCODE, pincode.trim());
            saveToStorage(STORAGE_KEYS.SELECTED_FULL_ADDRESS, `${pincode.trim()}, ${selectedCountry.name}`);
            saveToStorage('address_selection_country_code', selectedCountry.code);

            // Dispatch event to notify other components
            dispatchAddressChangeEvent();

            onConfirm?.(addressData);
            setIsOpen(false);
            onClose?.();
        }
    };

    const handleDetectLocation = () => {
        setIsDetecting(true);
        setDetectError(null);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;

                        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&accept-language=en`;

                        const response = await fetch(url, {
                            headers: {
                                'User-Agent': 'AddressSelectionApp/1.0'
                            }
                        });

                        if (!response.ok) {
                            throw new Error(`API error: ${response.status}`);
                        }

                        const data = await response.json();

                        if (data && data.address) {
                            const address = data.address;
                            const postalCode = address.postcode || '';
                            const city = address.city || address.town || address.village || address.municipality || '';
                            const state = address.state || address.region || '';
                            const countryName = address.country || '';
                            const countryCode = address.country_code?.toUpperCase() || '';

                            const country = countries.find(c =>
                                c.code === countryCode ||
                                c.name.toLowerCase() === countryName.toLowerCase()
                            ) || countries[0];

                            setSelectedCountry(country);
                            saveToStorage(STORAGE_KEYS.SELECTED_COUNTRY, country.name);

                            const addressParts = [
                                data.display_name?.split(',')[0] || '',
                                city,
                                state,
                                countryName,
                                postalCode
                            ].filter(Boolean);

                            const suggestion: AddressSuggestion = {
                                id: 'detected-1',
                                pincode: postalCode || '',
                                locality: data.display_name?.split(',')[0] || 'Unknown',
                                city: city || 'Unknown',
                                state: state || 'Unknown',
                                country: countryName || country.name,
                                countryCode: countryCode || country.code,
                                fullAddress: addressParts.join(', '),
                                lat: latitude,
                                lng: longitude,
                                displayName: data.display_name,
                            };

                            setSelectedSuggestion(suggestion);
                            setPincode(suggestion.fullAddress);
                            setSuggestions([]);
                            setShowSuggestions(false);

                            // Save detected location to localStorage
                            saveToStorage(STORAGE_KEYS.SELECTED_FULL_ADDRESS, suggestion.fullAddress);
                            saveToStorage(STORAGE_KEYS.SELECTED_CITY, suggestion.city);
                            saveToStorage(STORAGE_KEYS.SELECTED_STATE, suggestion.state);
                            saveToStorage(STORAGE_KEYS.SELECTED_LOCALITY, suggestion.locality);
                            saveToStorage(STORAGE_KEYS.SELECTED_PINCODE, suggestion.pincode);
                            saveToStorage('address_selection_country_code', suggestion.countryCode);

                            // Dispatch event to notify other components
                            dispatchAddressChangeEvent();
                        } else {
                            setDetectError('Could not find location details. Please enter manually.');
                        }

                        setIsDetecting(false);
                    } catch (error) {
                        console.error('Error detecting location:', error);
                        setDetectError('Failed to detect location. Please enter manually.');
                        setIsDetecting(false);
                    }
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setIsDetecting(false);

                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            setDetectError('Location permission denied. Please enter manually.');
                            break;
                        case error.POSITION_UNAVAILABLE:
                            setDetectError('Location unavailable. Please enter manually.');
                            break;
                        case error.TIMEOUT:
                            setDetectError('Location request timed out. Please enter manually.');
                            break;
                        default:
                            setDetectError('Unable to detect location. Please enter manually.');
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        } else {
            setIsDetecting(false);
            setDetectError('Geolocation is not supported by your browser. Please enter manually.');
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        onClose?.();
    };

    useEffect(() => {
        setMounted(true);
        return () => {
            setMounted(false);
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsCountryDropdownOpen(false);
            }
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isCountryDropdownOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isCountryDropdownOpen]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className={`${styles.overlay} ${className}`} onClick={handleClose}>
            <div
                className={styles.popover}
                role="tooltip"
                data-testid="popover"
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.popoverContent}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.headerLeft}>
                            <MapPin size={24} className={styles.locationIcon} />
                            <p className={styles.title}>Let's Personalize Your Experience!</p>
                        </div>
                        <button
                            aria-label="Close"
                            className={styles.closeButton}
                            onClick={handleClose}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Description */}
                    <div className={styles.description}>
                        <p>Enjoy your premium shopping for your ultra luxury lifestyle -It's like magic</p>
                    </div>

                    {/* Country Dropdown */}
                    <div className={styles.countrySection}>
                        <div className={styles.dropdownWrapper} ref={dropdownRef}>
                            <button
                                className={styles.countryDropdown}
                                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                id="search-country-button"
                            >
                                <div className={styles.flagWrapper}>
                                    <img
                                        src={selectedCountry.flag}
                                        alt={selectedCountry.name}
                                        width={24}
                                        height={24}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/24x24?text=🌍';
                                        }}
                                    />
                                </div>
                                <div className={styles.countryDropdownText}>
                                    <span>{selectedCountry.name}</span>
                                    <ChevronDown size={20} className={styles.chevronIcon} />
                                </div>
                            </button>

                            {isCountryDropdownOpen && (
                                <div className={styles.dropdownMenu}>
                                    <div className={styles.searchWrapper}>
                                        <Search size={18} className={styles.searchIcon} />
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            placeholder="Search country"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className={styles.searchInput}
                                        />
                                        {searchTerm && (
                                            <button
                                                className={styles.clearSearch}
                                                onClick={() => setSearchTerm('')}
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <ul className={styles.countryList}>
                                        {filteredCountries.length > 0 ? (
                                            filteredCountries.map((country) => (
                                                <li
                                                    key={country.code}
                                                    className={`${styles.countryItem} ${selectedCountry.code === country.code ? styles.active : ''
                                                        }`}
                                                    onClick={() => handleCountryChange(country)}
                                                >
                                                    <img
                                                        src={country.flag}
                                                        alt={country.name}
                                                        width={24}
                                                        height={24}
                                                        className={styles.countryFlag}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/24x24?text=🌍';
                                                        }}
                                                    />
                                                    <span>{country.name}</span>
                                                    <span className={styles.dialCode}>{country.dialCode}</span>
                                                    {selectedCountry.code === country.code && (
                                                        <Check size={18} className={styles.checkIcon} />
                                                    )}
                                                </li>
                                            ))
                                        ) : (
                                            <li className={styles.noResults}>
                                                <span>No countries found</span>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pincode Input with Suggestions */}
                    <div className={styles.pincodeSection}>
                        <div className={styles.inputWrapper} ref={suggestionsRef}>
                            <input
                                type="text"
                                placeholder={isDetecting ? "Detecting location..." : `Enter City for ${selectedCountry.name}`}
                                value={pincode}
                                onChange={(e) => handlePincodeChange(e.target.value)}
                                className={`${styles.pincodeInput} ${suggestions.length > 0 && showSuggestions ? styles.hasSuggestions : ''}`}
                                id="pincode-location-input"
                                disabled={isDetecting}
                                autoFocus
                            />
                            {isLoading && (
                                <div className={styles.loadingIndicator}>
                                    <Loader2 size={18} className={styles.spinning} />
                                </div>
                            )}

                            {/* Address Suggestions Dropdown */}
                            {showSuggestions && suggestions.length > 0 && !selectedSuggestion && (
                                <div className={styles.suggestionsDropdown}>
                                    <div className={styles.suggestionsHeader}>
                                        <Home size={16} />
                                        <span>Select your address in {selectedCountry.name}</span>
                                    </div>
                                    <ul className={styles.suggestionsList}>
                                        {suggestions.map((suggestion) => (
                                            <li
                                                key={suggestion.id}
                                                className={styles.suggestionItem}
                                                onClick={() => handleSuggestionSelect(suggestion)}
                                            >
                                                <div className={styles.suggestionMain}>
                                                    <span className={styles.suggestionLocality}>{suggestion.locality}</span>
                                                    <span className={styles.suggestionPincode}>{suggestion.pincode}</span>
                                                </div>
                                                <div className={styles.suggestionDetail}>
                                                    {suggestion.city}, {suggestion.state}, {suggestion.country}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* No results message */}
                            {showSuggestions && suggestions.length === 0 && pincode.trim().length >= 2 && !isLoading && (
                                <div className={styles.noSuggestions}>
                                    <span>No addresses found for this pincode in {selectedCountry.name}. Please enter manually.</span>
                                </div>
                            )}
                        </div>

                        <div className={styles.divider}>
                            <span>OR</span>
                        </div>

                        <button
                            className={styles.detectLocationButton}
                            // onClick={handleDetectLocation}
                            disabled={isDetecting}
                        >
                            {isDetecting ? (
                                <>
                                    <Loader2 size={18} className={styles.spinning} />
                                    <span>Detecting your location...</span>
                                </>
                            ) : (
                                <>
                                    <Navigation size={18} />
                                    <span>Detect Current Location</span>
                                </>
                            )}
                        </button>

                        {detectError && (
                            <div className={styles.detectError}>
                                <span>{detectError}</span>
                            </div>
                        )}

                        {/* Selected address preview */}
                        {/* {selectedSuggestion && (
                            <div className={styles.selectedAddressPreview}>
                                <div className={styles.addressPreviewContent}>
                                    <MapPin size={16} className={styles.previewIcon} />
                                    <span className={styles.addressText}>{selectedSuggestion.fullAddress}</span>
                                </div>
                                <button
                                    className={styles.changeAddressBtn}
                                    onClick={() => {
                                        setSelectedSuggestion(null);
                                        setPincode(selectedSuggestion.pincode);
                                        setShowSuggestions(true);
                                        // Clear saved address details when changing
                                        localStorage.removeItem(STORAGE_KEYS.SELECTED_FULL_ADDRESS);
                                        localStorage.removeItem(STORAGE_KEYS.SELECTED_CITY);
                                        localStorage.removeItem(STORAGE_KEYS.SELECTED_STATE);
                                        localStorage.removeItem(STORAGE_KEYS.SELECTED_LOCALITY);
                                        
                                        // Dispatch event to notify other components
                                        dispatchAddressChangeEvent();
                                    }}
                                >
                                    Change
                                </button>
                            </div>
                        )} */}
                    </div>

                    {/* Confirm Button */}
                    <div className={styles.confirmSection}>
                        <button
                            className={styles.confirmButton}
                            onClick={handleConfirm}
                            id="location-lock-continue-button"
                            disabled={!pincode.trim() || isDetecting}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AddressSelection;