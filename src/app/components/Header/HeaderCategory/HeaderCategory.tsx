'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt, faStar, faBriefcase, faTruck,
  faMapMarkedAlt, faBox, faTruckMoving,
  type IconDefinition,
  faHome,
} from '@fortawesome/free-solid-svg-icons';
import styles from './HeaderCategory.module.scss';
import VideoPlayerSimple from '../../VideoPlayers/VideoPlayerSimple/VideoPlayerSimple';
import DownloadApp from '../../HomePage/DownloadApp/DownloadApp';

// ─────────────────────────────────────────────
// Category page components (unchanged)
// ─────────────────────────────────────────────

const HomeRide: React.FC = () => (
  <div className={styles.categoryPage}>
    <VideoPlayerSimple
      src="/videos/Zufko_Home.mp4"
      height="100vh"
      maxHeight="100vh"
      fit="cover"
    />
    <DownloadApp />
  </div>
);

const InstantRide: React.FC = () => (
  <div className={styles.categoryPage}>
    <div className={styles.categoryPageTemp}>
      <h2>Instant Ride</h2>
      <p>Luxury cars for special occasions.</p>
    </div>
  </div>
);

const PremiumRide: React.FC = () => (
  <div className={styles.categoryPageTemp}>
    <h2>Premium Ride</h2>
    <p>Luxury cars for special occasions.</p>
  </div>
);

const CorporateRide: React.FC = () => (
  <div className={styles.categoryPageTemp}>
    <h2>Corporate Ride</h2>
    <p>Business travel for teams and clients.</p>
  </div>
);

const CommercialVehicle: React.FC = () => (
  <div className={styles.categoryPageTemp}>
    <h2>Commercial Vehicle</h2>
    <p>Trucks and vans for goods transport.</p>
  </div>
);

const TourPackages: React.FC = () => (
  <div className={styles.categoryPageTemp}>
    <h2>Tour Packages</h2>
    <p>Curated trips and sightseeing.</p>
  </div>
);

const ParcelDelivery: React.FC = () => (
  <div className={styles.categoryPageTemp}>
    <h2>Parcel Delivery</h2>
    <p>Send packages across the city.</p>
  </div>
);

const PackerMovers: React.FC = () => (
  <div className={styles.categoryPageTemp}>
    <h2>Packer &amp; Movers</h2>
    <p>Reliable home and office shifting.</p>
  </div>
);

// ─────────────────────────────────────────────
// Category config
// ─────────────────────────────────────────────

interface CategoryItem {
  id: string;
  name: string;
  icon: IconDefinition;
  Component: React.ComponentType;
  hidden?: boolean;
}

const DEFAULT_TAB = 'home-ride';

const categories: CategoryItem[] = [
  { id: 'home-ride',          name: 'Home Ride',        icon: faHome,         Component: HomeRide, hidden: true },
  { id: 'instant-ride',       name: 'Instant Ride',     icon: faBolt,         Component: InstantRide },
  { id: 'premium-ride',       name: 'Premium Ride',     icon: faStar,         Component: PremiumRide },
  { id: 'corporate-ride',     name: 'Corporate Ride',   icon: faBriefcase,    Component: CorporateRide },
  { id: 'commercial-vehicle', name: 'Commercial Vehicle', icon: faTruck,      Component: CommercialVehicle },
  { id: 'tour-packages',      name: 'Tour Packages',    icon: faMapMarkedAlt, Component: TourPackages },
  { id: 'parcel-delivery',    name: 'Parcel Delivery',  icon: faBox,          Component: ParcelDelivery },
  { id: 'packer-movers',      name: 'Packer & Movers',  icon: faTruckMoving,  Component: PackerMovers },
];

const visibleCategories = categories.filter((c) => !c.hidden);
const VALID_IDS = new Set(categories.map((c) => c.id));

// ─────────────────────────────────────────────
// Tab switcher
// ─────────────────────────────────────────────

const HeaderCategory: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read the current tab from the URL, fall back to the default
  const urlTab = searchParams.get('tab');
  const initialTab = urlTab && VALID_IDS.has(urlTab) ? urlTab : DEFAULT_TAB;

  const [activeTab, setActiveTab] = useState(initialTab);

  // Keep state in sync if the URL changes externally (back/forward buttons)
  useEffect(() => {
    const urlTab = searchParams.get('tab');
    const nextTab = urlTab && VALID_IDS.has(urlTab) ? urlTab : DEFAULT_TAB;
    setActiveTab(nextTab);
  }, [searchParams]);

  const handleTabClick = (id: string) => {
    setActiveTab(id);

    // Build the new URL, preserving other query params if any
    const params = new URLSearchParams(searchParams.toString());
    if (id === DEFAULT_TAB) {
      params.delete('tab');           // clean URL for the default view
    } else {
      params.set('tab', id);
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const activeCategory = categories.find((c) => c.id === activeTab);
  const ActiveComponent = activeCategory?.Component;

  return (
    <>
      <div className={styles.headerCategory}>
        <div className={styles.container}>
          <div className={styles.categoryTabs}>
            {visibleCategories.map(({ id, name, icon }) => (
              <button
                key={id}
                className={`${styles.categoryTab} ${
                  activeTab === id ? styles.active : ''
                }`}
                onClick={() => handleTabClick(id)}
              >
                <FontAwesomeIcon icon={icon} className={styles.icon} />
                <span>{name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.tabContainer}>
        {ActiveComponent ? <ActiveComponent /> : null}
      </div>
    </>
  );
};

export default HeaderCategory;