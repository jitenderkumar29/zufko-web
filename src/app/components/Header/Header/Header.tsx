// components/Header/Header.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./Header.module.scss";
import { FaChevronDown } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactCountryFlag from "react-country-flag";

import AddressSelection, {
  AddressData,
} from "../../Address/AddressSelection/AddressSelection";
import SearchBarHeader from "../../SearchBar/SearchBarHeader/SearchBarHeader";
import { COUNTRY_FLAGS, Language, languages } from "./CountryFlag";

COUNTRY_FLAGS: COUNTRY_FLAGS



languages: languages

const Header = () => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
  languages.find(
    (language) =>
      language.code === "IN" &&
      language.countryCode === "IN"
  ) || languages[0]
);
  const [flagKey, setFlagKey] = useState(0);

  const [address, setAddress] = useState<AddressData>({
    country: "India",
    pincode: "",
    fullAddress: "Location missing",
  });

  const toggleLocationModal = () => {
    setShowLocationModal((prev) => !prev);
  };

  const handleAddressConfirm = (addressData: AddressData) => {
    const countryName = addressData.country || "India";

    setAddress({
      country: countryName,
      pincode: addressData.pincode,
      fullAddress:
        addressData.fullAddress ||
        `${addressData.pincode}, ${countryName}`,
      countryCode: addressData.countryCode,
      city: addressData.city,
      state: addressData.state,
      locality: addressData.locality,
      lat: addressData.lat,
      lng: addressData.lng,
    });

    setShowLocationModal(false);
  };

  const handleAddressClose = () => {
    setShowLocationModal(false);
  };

  const handleSearch = (value: string) => {
    console.log("Searching:", value);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push("/", { scroll: false });
    window.dispatchEvent(new CustomEvent("logoClick"));
  };

  const getDisplayAddress = () => {
    if (
      address.fullAddress &&
      address.fullAddress !== "Location missing"
    ) {
      const parts = address.fullAddress.split(",");

      if (parts.length > 3) {
        return `${parts[0]}, ${parts[1]}, ${parts[2]}`;
      }

      return address.fullAddress;
    }

    return "Location missing";
  };

  const isLocationSet =
    Boolean(address.fullAddress) &&
    address.fullAddress !== "Location missing" &&
    Boolean(address.country);

  const getCountryName = () => {
    if (isLocationSet && address.country) {
      return address.country;
    }

    return "India";
  };

  const getCountryFlag = (
    countryName: string = getCountryName()
  ) => {
    if (COUNTRY_FLAGS[countryName]) {
      return COUNTRY_FLAGS[countryName];
    }

    return COUNTRY_FLAGS["India"];
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
  };

  useEffect(() => {
    if (address.country) {
      setFlagKey((prev) => prev + 1);
    }
  }, [address.country]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.leftSection}>
          <Link
            href="/"
            onClick={handleLogoClick}
            scroll={false}
          >
            <Image
              src="/icons/logo.png"
              className={styles.logo}
              alt="Logo"
              width={1080}
              height={266}
              priority
            />
          </Link>

          <div
            className={`${styles.locationContainer} ${
              !isLocationSet ? styles.locationMissing : ""
            }`}
            onClick={toggleLocationModal}
          >
            <div className={styles.deliveryTime}>
              {isLocationSet
                ? `Welcome to ${getCountryName()}`
                : "Welcome to"}
            </div>

            <div className={styles.deliveryLocation}>
              <img
                key={flagKey}
                src={getCountryFlag()}
                alt={getCountryName()}
                className={styles.flagIcon}
                width={20}
                height={20}
                onError={(e) => {
                  e.currentTarget.src = COUNTRY_FLAGS["India"];
                }}
              />

              <span className={styles.locationText}>
                {getDisplayAddress()}
                <IoIosArrowDown
                  className={styles.dropdownIcon}
                />
              </span>
            </div>
          </div>
        </div>

        <div className={styles.searchContainer}>
          <SearchBarHeader
            placeholder="Search for Credit card..."
            onSearch={handleSearch}
          />
        </div>

        <div className={styles.rightSection}>
          <div className={styles.actionButtons}>
            <div
              className={styles.navItem}
              ref={dropdownRef}
            >
              <div
                className={styles.languageSelector}
                onClick={toggleDropdown}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" ||
                    e.key === " "
                  ) {
                    e.preventDefault();
                    toggleDropdown();
                  }
                }}
              >
                <ReactCountryFlag
                  countryCode={selectedLanguage.countryCode}
                  svg
                  className={styles.languageFlag}
                  title={selectedLanguage.code}
                />

                <span>{selectedLanguage.code}</span>

                <FaChevronDown
                  className={styles.languageArrow}
                />
              </div>

              {isOpen && (
                <div
                  className={styles.dropdownMenu}
                  role="menu"
                >
                  {languages.map((language) => (
                    <div
                      key={`${language.code}-${language.countryCode}`}
                      className={styles.dropdownItem}
                      role="menuitem"
                      tabIndex={0}
                      onClick={() =>
                        handleLanguageSelect(language)
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" ||
                          e.key === " "
                        ) {
                          e.preventDefault();
                          handleLanguageSelect(language);
                        }
                      }}
                    >
                      <ReactCountryFlag
                        countryCode={language.countryCode}
                        svg
                        className={styles.dropdownFlag}
                        title={language.code}
                      />

                      <div className={styles.languageInfo}>
                        <span
                          className={styles.languageName}
                        >
                          {language.name}
                        </span>

                        <span
                          className={styles.countryName}
                        >
                          {language.countryName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
          </div>
        </div>

        {showLocationModal && (
          <AddressSelection
            onConfirm={handleAddressConfirm}
            onClose={handleAddressClose}
            initialCountry={address.country || "India"}
            initialPincode={address.pincode}
          />
        )}
      </div>
    </header>
  );
};

export default Header;