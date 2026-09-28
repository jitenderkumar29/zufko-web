import React from 'react';
import Image from 'next/image';
import styles from './DownloadApp.module.scss';

const DownloadApp: React.FC = () => {
  return (
    <section className={styles['download-app']}>
      <div className={styles['download-app__container']}>
        <div className={styles['download-app__card']}>
          <div className={styles['download-app__card-inner']}>
            {/* Content */}
            <div className={styles['download-app__content']}>
              {/* Left Section */}
              <div className={styles['download-app__left']}>
                <h2 className={styles['download-app__title']}>
                  Download the app now!
                </h2>
                <p className={styles['download-app__subtitle']}>
                  Book flights, manage trips, and check in <br /> only on the Zufko app
                </p>

                {/* Store Buttons */}
                <div className={styles['download-app__buttons']}>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles['download-app__store-link']}
                    aria-label="Download on Google Play"
                  >
                    <Image
                      src="/icons/play_store.png"
                      alt="Google Play"
                      width={180}
                      height={56}
                      className={styles['download-app__store-img']}
                    />
                  </a>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles['download-app__store-link']}
                    aria-label="Download on App Store"
                  >
                    <Image
                      src="/icons/app_store.png"
                      alt="App Store"
                      width={180}
                      height={56}
                      className={styles['download-app__store-img']}
                    />
                  </a>
                </div>
              </div>

              {/* Right Section - Phone with QR */}
              <div className={styles['download-app__right']}>
                <div className={styles['download-app__phone-wrapper']}>
                  <Image
                    src="/icons/phone_wrapper.png"
                    alt="App preview"
                    width={400}
                    height={400}
                    className={styles['download-app__phone-image']}
                  />

                  {/* QR Code Overlay */}
                  <div className={styles['download-app__qr-overlay']}>
                    <p className={styles['download-app__qr-text']}>
                      Scan the QR code to download the app
                    </p>
                    <div className={styles['download-app__qr-code']}>
                      <Image
                        src="/icons/download_app__qr_code.png"
                        alt="QR Code"
                        width={120}
                        height={120}
                        className={styles['download-app__qr-image']}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Rings */}
            <div className={styles['download-app__rings']}>
              <div className={styles['download-app__ring']}>
                <div className={styles['download-app__ring--2']}>
                  <div className={styles['download-app__ring--3']}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;