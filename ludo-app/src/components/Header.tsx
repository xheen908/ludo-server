// Header.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonPopover,
  IonModal,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonToggle,
} from '@ionic/react';
import { home, settings, helpCircle, colorPalette, musicalNotes, volumeHigh } from 'ionicons/icons';
import Logo from '../assets/menschärgeredichnicht.png';
import backgroundMusic from '../assets/sounds/background.mp3';
import buttonTab from '../assets/sounds/buttonTab.mp3';
import { AdMob, InterstitialAdEventType, InterstitialAdOptions } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

interface HeaderProps {
  title: string;
  pageTitle: string;
  collapse?: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  setMusicEnabled: (enabled: boolean) => void;
  playButtonSound: () => void;
}

const Header: React.FC<HeaderProps> = ({ pageTitle, title, collapse = false, playButtonSound }) => {
  const [showSettingsPopover, setShowSettingsPopover] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState<MouseEvent | undefined>();
  const [favoriteColor, setFavoriteColor] = useState<string>('red');
  const [sound, setSound] = useState<boolean>(true);
  const [music, setMusic] = useState<boolean>(false);
  const [threeRolls, setThreeRolls] = useState<boolean>(false);
  const [forceStrike, setForceStrike] = useState<boolean>(true);

  // Ref für Hintergrundmusik
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonSoundRef = useRef<HTMLAudioElement | null>(new Audio(buttonTab));

  // Initialisierung der Musik
  const toggleMusic = (enabled: boolean) => {
    if (!audioRef.current) {
      audioRef.current = new Audio(backgroundMusic); // Stelle sicher, dass der Pfad korrekt ist
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
      audioRef.current?.play().catch((err) => {
        console.warn('Autoplay blockiert:', err);
      });
    }

    if (enabled) {
      audioRef.current
        .play()
        .then(() => console.log('Musik wird abgespielt.'))
        .catch((err) => console.warn('Autoplay blockiert:', err));
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      console.log('Musik gestoppt.');
    }
    setMusic(enabled);
  };

  const handlePlaySound = () => {
    if (sound && buttonSoundRef.current) {
      buttonSoundRef.current.currentTime = 0;
      buttonSoundRef.current.play().catch(err => console.warn('Autoplay blockiert:', err));
    }
  };

  const openSettingsPopover = (e: MouseEvent) => {
    setPopoverEvent(e);
    setShowSettingsPopover(true);
  };

  const openHelpModal = () => {
    setShowHelpModal(true);
  };

  // AdMob-Integration
  useEffect(() => {
    if (Capacitor.isNative) {
      // Initialisiere AdMob nur auf nativen Plattformen
      AdMob.initialize({
        requestTrackingAuthorization: true,
        testingDevices: [], // Leere Liste für Produktion
        initializeForTesting: false, // Produktionsmodus
      });

      // Lade das Interstitial Ad beim Laden der Komponente
      loadInterstitial();
    }
  }, []);

  const loadInterstitial = async () => {
    try {
      await AdMob.prepareInterstitial({
        adId: 'ca-app-pub-5900319578250572/9818967110', // Deine Interstitial Ad Unit ID
        isTesting: false, // Setze auf false für Produktion
      });
      console.log('Interstitial Ad vorbereitet');
    } catch (error) {
      console.error('Fehler beim Vorbereiten des Interstitial Ads:', error);
    }
  };

  const showInterstitial = async () => {
    if (Capacitor.isNative) {
      try {
        await AdMob.showInterstitial();
        console.log('Interstitial Ad angezeigt');

        // Nach dem Anzeigen erneut laden
        loadInterstitial();
      } catch (error) {
        console.error('Fehler beim Anzeigen des Interstitial Ads:', error);
      }
    } else {
      console.log('Interstitial Ads funktionieren nur auf nativen Plattformen.');
    }
  };

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          {/* Linker Button */}
          <IonButtons slot="start">
            <IonButton
              onClick={async () => {
                playButtonSound();
                await showInterstitial(); // Zeige das Interstitial Ad
                window.location.href = '/ludo'; // Navigiere zur Ludo-Seite
              }}
            >
              <IonIcon icon={home} />
            </IonButton>
            <span style={{ color: 'white', fontSize: '0.9rem', marginLeft: '0.5rem' }}>
              {pageTitle}
            </span>
          </IonButtons>

          {/* Logo */}
          <IonTitle className="header-logo-container" style={{ textAlign: 'center' }}>
            <img src={Logo} alt="Slot Heaven Logo" style={{ maxHeight: '40px' }} />
          </IonTitle>

          {/* Rechter Button für Einstellungen und Hilfe */}
          <IonButtons slot="end">
            <IonButton onClick={openHelpModal}>
              <IonIcon icon={helpCircle} />
            </IonButton>
            <IonButton onClick={(e) => openSettingsPopover(e.nativeEvent)}>
              <IonIcon icon={settings} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {/* Optional: Kollabierender Header */}
      {collapse && (
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
      )}

      {/* Popover für Einstellungen */}
      <IonPopover
        isOpen={showSettingsPopover}
        event={popoverEvent}
        onDidDismiss={() => setShowSettingsPopover(false)}
        cssClass="custom-popover"
      >
        <IonContent>
          <IonList>
            {/* Lieblingsfarbe */}
            <IonItem>
              <IonIcon icon={colorPalette} slot="start" />
              <IonLabel>Lieblingsfarbe</IonLabel>
              <IonSelect
                value={favoriteColor}
                placeholder="Farbe auswählen"
                onIonChange={(e) => setFavoriteColor(e.detail.value)}
              >
                <IonSelectOption value="red">Rot</IonSelectOption>
                <IonSelectOption value="blue">Blau</IonSelectOption>
                <IonSelectOption value="green">Grün</IonSelectOption>
                <IonSelectOption value="yellow">Gelb</IonSelectOption>
              </IonSelect>
            </IonItem>

            {/* Musik */}
            <IonItem>
              <IonIcon icon={musicalNotes} slot="start" />
              <IonLabel>Musik</IonLabel>
              <IonToggle
                checked={music}
                onIonChange={(e) => toggleMusic(e.detail.checked)}
              />
            </IonItem>

            {/* Sound */}
            <IonItem>
              <IonIcon icon={volumeHigh} slot="start" />
              <IonLabel>Sounds</IonLabel>
              <IonToggle
                checked={sound}
                onIonChange={(e) => setSound(e.detail.checked)}
              />
            </IonItem>
          </IonList>
        </IonContent>
      </IonPopover>

      {/* Hilfe Modal */}
      <IonModal isOpen={showHelpModal} onDidDismiss={() => setShowHelpModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Hilfe & Informationen</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowHelpModal(false)}>Schließen</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem>
              <IonLabel>
                <h2>Über Ludo</h2>
                <p>Ludo ist ein klassisches Brettspiel, basierend auf "Mensch ärgere dich nicht".</p>
              </IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonModal>

      {/* CSS für kleinere Popover */}
      <style>
        {`
          .custom-popover {
            --width: 300px;
            --height: auto;
          }
        `}
      </style>
    </>
  );
};

export default Header;
