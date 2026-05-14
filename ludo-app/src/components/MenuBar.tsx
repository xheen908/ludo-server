import React from "react";
import { IonButton, IonInput } from "@ionic/react";
import "../pages/Frutmana.css";

interface MenuBarProps {
  balanceSpielkonto: number;
  balanceEinzahlkonto: number;
  currentBet: number;
  depositAmount: number;
  onDepositChange: (value: number) => void;
  onDeposit: () => void;
  onTransferToSpielkonto: () => void;
  onTransferToEinzahlkonto: () => void;
  onIncreaseBet: () => void;
  onDecreaseBet: () => void;
  onStart: () => void;
  onToggleAutoplay: () => void;
  autoplayEnabled: boolean;
}

const MenuBar: React.FC<MenuBarProps> = ({
  balanceSpielkonto,
  balanceEinzahlkonto,
  currentBet,
  depositAmount,
  onDepositChange,
  onDeposit,
  onTransferToSpielkonto,
  onTransferToEinzahlkonto,
  onIncreaseBet,
  onDecreaseBet,
  onStart,
  onToggleAutoplay,
  autoplayEnabled,
}) => {
  return (
    <div id="menu-container">
      {/* Einzahlen */}

      <div className="lcd-display">{balanceEinzahlkonto.toFixed(2)}€</div>
      {/* Transfers */}
           {/* LCD-Anzeigen */}
      <div className="lcd-display">{balanceSpielkonto.toFixed(2)}Cr</div>
      

      {/* Einsatzsteuerung */}
      <div className="bet-controls">
      <div className="lcd-display">{currentBet.toFixed(2)}Cr</div>
        <IonButton onClick={onDecreaseBet}>▼</IonButton>
        <IonButton onClick={onIncreaseBet}>▲</IonButton>
      </div>

    </div>
  );
};

export default MenuBar;
