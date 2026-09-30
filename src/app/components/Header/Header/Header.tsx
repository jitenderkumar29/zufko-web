// components/Header/Header.tsx
import React, { useEffect, useState } from 'react';
import styles from './Header.module.scss';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AddressSelection, { AddressData } from '../../Address/AddressSelection/AddressSelection';
import SearchBarHeader from '../../SearchBar/SearchBarHeader/SearchBarHeader';

// Country flag mapping (using FNP's CDN)
const COUNTRY_FLAGS: Record<string, string> = {
  'India': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/india.svg',
  'USA': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/usa.svg',
  'Canada': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/canada.svg',
  'Australia': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/australia.svg',
  'United Kingdom': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/uk.svg',
  'Germany': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/germany.svg',
  'France': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/france.svg',
  'Italy': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/italy.svg',
  'Spain': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/spain.svg',
  'Brazil': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/brazil.svg',
  'Mexico': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/mexico.svg',
  'Japan': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/japan.svg',
  'South Korea': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/south-korea.svg',
  'China': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/china.svg',
  'Russia': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/russia.svg',
  'South Africa': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/south-africa.svg',
  'Egypt': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/egypt.svg',
  'Nigeria': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/nigeria.svg',
  'Kenya': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/kenya.svg',
  'UAE': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/uae.svg',
  'Saudi Arabia': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/saudi-arabia.svg',
  'Turkey': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/turkey.svg',
  'Pakistan': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/pakistan.svg',
  'Bangladesh': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/bangladesh.svg',
  'Sri Lanka': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/sri-lanka.svg',
  'Nepal': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/nepal.svg',
  'Malaysia': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/malaysia.svg',
  'Singapore': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/singapore.svg',
  'Indonesia': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/indonesia.svg',
  'Philippines': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/philippines.svg',
  'New Zealand': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/new-zealand.svg',
  'Netherlands': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/netherlands.svg',
  'Belgium': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/belgium.svg',
  'Switzerland': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/switzerland.svg',
  'Sweden': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/sweden.svg',
  'Norway': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/norway.svg',
  'Denmark': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/denmark.svg',
  'Finland': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/finland.svg',
  'Poland': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/poland.svg',
  'Portugal': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/portugal.svg',
  'Greece': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/greece.svg',
  'Ireland': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/ireland.svg',
  'Austria': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/austria.svg',
  'Czech Republic': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/czech-republic.svg',
  'Hungary': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/hungary.svg',
  'Romania': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/romania.svg',
  'Ukraine': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/ukraine.svg',
  'Israel': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/israel.svg',
  'Thailand': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/thailand.svg',
  'Vietnam': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/vietnam.svg',
  'Argentina': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/argentina.svg',
  'Chile': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/chile.svg',
  'Colombia': 'https://static-assets-prod.fnp.com/assets/images/custom/country-flags/colombia.svg',
};

const Header = () => {
  const router = useRouter();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems] = useState(3);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  // State for address display - using "Location missing" as placeholder
  const [address, setAddress] = useState<AddressData>({
    country: 'India',
    pincode: '',
    fullAddress: 'Location missing'
  });

  const toggleLocationModal = () => {
    setShowLocationModal(!showLocationModal);
  };

  const handleAddressConfirm = (addressData: AddressData) => {
    // Get the country name from the address data
    const countryName = addressData.country || 'India';

    // Find the country flag URL based on the country name
    const flagUrl = getCountryFlag(countryName);

    setAddress({
      country: countryName,
      pincode: addressData.pincode,
      fullAddress: addressData.fullAddress || `${addressData.pincode}, ${countryName}`,
      countryCode: addressData.countryCode,
      city: addressData.city,
      state: addressData.state,
      locality: addressData.locality,
      lat: addressData.lat,
      lng: addressData.lng,
    });
    setShowLocationModal(false);
    console.log('Address confirmed:', addressData);
  };

  const handleAddressClose = () => {
    setShowLocationModal(false);
  };

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log('Searching for:', searchQuery);
  // };

   const handleSearch = (value: string) => {
    console.log("Searching:", value);
  };

  const placeholders = [
    "Instant Ride",
    "Premium Ride",
    "Corporate Ride",
    "Commercial Vehicle",
    "Tour Packages",
    "Parcel Delivery",
    "Packer & Movers"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        setAnimate(false);
      }, 300);
    }, 2000);

    return () => clearInterval(interval);
  }, [placeholders.length]);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/', { scroll: false });
    window.dispatchEvent(new CustomEvent('logoClick'));
  };

  // Format address display
  const getDisplayAddress = () => {
    if (address.fullAddress && address.fullAddress !== 'Location missing') {
      const parts = address.fullAddress.split(',');
      if (parts.length > 3) {
        return `${parts[0]}, ${parts[1]}, ${parts[2]}`;
      }
      return address.fullAddress;
    }
    return 'Location missing';
  };

  // Check if location is set
  const isLocationSet = address.fullAddress && address.fullAddress !== 'Location missing' && address.country;

  // Get country name for display
  const getCountryName = () => {
    if (isLocationSet && address.country) {
      return address.country;
    }
    return 'India';
  };

  // Get country flag URL - updated to accept country name parameter
  const getCountryFlag = (countryName: string = getCountryName()) => {
    // Try to find exact match first
    if (COUNTRY_FLAGS[countryName]) {
      return COUNTRY_FLAGS[countryName];
    }

    // Try to find by country code if available
    if (address.countryCode) {
      const countryCodeMatch = Object.keys(COUNTRY_FLAGS).find(key =>
        key.toLowerCase().includes(address.countryCode?.toLowerCase() || '')
      );
      if (countryCodeMatch && COUNTRY_FLAGS[countryCodeMatch]) {
        return COUNTRY_FLAGS[countryCodeMatch];
      }
    }

    // Try partial match
    const match = Object.keys(COUNTRY_FLAGS).find(key =>
      key.toLowerCase().includes(countryName.toLowerCase()) ||
      countryName.toLowerCase().includes(key.toLowerCase())
    );
    if (match) {
      return COUNTRY_FLAGS[match];
    }

    // Default to India flag
    return COUNTRY_FLAGS['India'];
  };

  // Force re-render when country changes
  const [flagKey, setFlagKey] = useState(0);

  // Update flagKey when country changes to force image reload
  useEffect(() => {
    if (address.country) {
      setFlagKey(prev => prev + 1);
    }
  }, [address.country]);

  

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.leftSection}>
          <Link href="/" onClick={handleLogoClick} scroll={false}>
            <Image
              src={"/icons/logo.png"}
              className={styles.logo}
              alt='Logo'
              width={1080}
              height={266}
              priority
            />
          </Link>
          <div
            className={`${styles.locationContainer} ${!isLocationSet ? styles.locationMissing : ''}`}
            onClick={toggleLocationModal}
          >
            {/* Updated delivery time text */}
            <div className={styles.deliveryTime}>
              {isLocationSet ? `Welcome to ${getCountryName()}` : 'Welcome to'}
            </div>
            <div className={styles.deliveryLocation}>
              {/* Use flag icon with key to force re-render on country change */}
              <img
                key={flagKey}
                src={getCountryFlag()}
                alt={getCountryName()}
                className={styles.flagIcon}
                width={20}
                height={20}
                onError={(e) => {
                  // Fallback to India flag if image fails to load
                  (e.target as HTMLImageElement).src = COUNTRY_FLAGS['India'];
                }}
              />
              <span className={styles.locationText}>
                {getDisplayAddress()}
                <IoIosArrowDown className={styles.dropdownIcon} />
              </span>
            </div>
          </div>
        </div>

        <div className={styles.searchContainer}>
          <SearchBarHeader
            placeholder="Search for Credit card..."
            onSearch={handleSearch}
          />
          {/* <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {!searchQuery && (
                <>
                  <span className={styles.animatedPlaceholderFix}>Search for </span>
                  <span className={`${styles.animatedPlaceholder} ${animate ? styles.fadeOut : styles.fadeIn}`}>
                    &quot;{placeholders[placeholderIndex]}&quot;
                  </span>
                </>
              )}
            </div>
            <button type="submit" className={styles.searchButton}>
              <FaSearch className={styles.searchIcon} />
            </button>
          </form> */}
        </div>

        <div className={styles.rightSection}>
          <div className={styles.actionButtons}>
            <button className={styles.actionButton}>
              <span>Company</span>
            </button>
            <button className={styles.actionButton}>
              <span>Business</span>
            </button>
            <button className={styles.actionButton}>
              <span>Help</span>
            </button>
            <button className={styles.loginButton}>
              <span>Login</span>
            </button>
            {/* <button className={styles.cartButton}>
              <ShoppingCart className={styles.cartIcon} />
              <div className={styles.cartDetails}>
                <span className={styles.cartItems}>{cartItems} items</span>
                <span className={styles.cartPrice}>₹90</span>
              </div>
            </button> */}
          </div>
        </div>

        {showLocationModal && (
          <AddressSelection
            onConfirm={handleAddressConfirm}
            onClose={handleAddressClose}
            initialCountry={address.country || 'India'}
            initialPincode={address.pincode}
          />
        )}
      </div>
    </header>
  );
};

export default Header;