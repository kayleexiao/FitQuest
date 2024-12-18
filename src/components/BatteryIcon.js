import React, { useEffect, useState } from 'react';
import { IoBatteryFullOutline, IoBatteryHalfOutline, IoBatteryChargingOutline } from "react-icons/io5";
import { ReactComponent as IoBattery90Outline } from "./battery/IoBattery90.svg";
import { ReactComponent as IoBattery80Outline } from "./battery/IoBattery80.svg";
import { ReactComponent as IoBattery70Outline } from "./battery/IoBattery70.svg";
import { ReactComponent as IoBattery60Outline } from "./battery/IoBattery60.svg";
import { ReactComponent as IoBattery40Outline } from "./battery/IoBattery40.svg";
import { ReactComponent as IoBattery30Outline } from "./battery/IoBattery30.svg";
import { ReactComponent as IoBattery20Outline } from "./battery/IoBattery20.svg";
import { ReactComponent as IoBattery10Outline } from "./battery/IoBattery10.svg";

const BatteryIcon = () => {
  const [batteryLevel, setBatteryLevel] = useState(1); // Default to fully charged
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    // Check if the Battery API is available
    if (navigator.getBattery) {
      navigator.getBattery().then(battery => {
        // Set initial battery level and charging state
        setBatteryLevel(battery.level);
        setIsCharging(battery.charging);

        // Update the state when battery level changes
        const handleLevelChange = () => setBatteryLevel(battery.level);
        const handleChargingChange = () => setIsCharging(battery.charging);

        battery.addEventListener('levelchange', handleLevelChange);
        battery.addEventListener('chargingchange', handleChargingChange);

        // Cleanup event listeners on component unmount
        return () => {
          battery.removeEventListener('levelchange', handleLevelChange);
          battery.removeEventListener('chargingchange', handleChargingChange);
        };
      });
    }
  }, []);

  // Select the appropriate icon based on battery level and charging state
  const getBatteryIcon = () => {
    if (isCharging) {
      return <IoBatteryChargingOutline size={'2.15vh'} />;
    } else if (batteryLevel > 0.9) {
      return <IoBatteryFullOutline size={'2.15vh'} />;
    } else if (batteryLevel > 0.8) {
        return <IoBattery90Outline style={{width: '2.15vh', height: '2.15vh'}} />;
    } else if (batteryLevel > 0.7) {
        return <IoBattery80Outline style={{width: '2.15vh', height: '2.15vh'}} />;
    } else if (batteryLevel > 0.6) {
        return <IoBattery70Outline style={{width: '2.15vh', height: '2.15vh'}} />;
    }  else if (batteryLevel > 0.5) {
        return <IoBattery60Outline style={{width: '2.15vh', height: '2.15vh'}} />;
    }  else if (batteryLevel > 0.4) {
        return <IoBatteryHalfOutline size={20} />;
    }  else if (batteryLevel > 0.3) {
        return <IoBattery40Outline style={{width: '2.15vh', height: '2.15vh'}} />;
    }  else if (batteryLevel > 0.2) {
        return <IoBattery30Outline style={{width: '2.15vh', height: '2.15vh'}} />;
    } else if (batteryLevel > 0.1) {
        return <IoBattery20Outline style={{width: '2.15vh', height: '2.15vh'}} />;
    } else {
        return <IoBattery10Outline style={{width: '2.15vh', height: '2.15vh'}} />;
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {getBatteryIcon()}
      <span style={{ marginLeft: 'min(5px,1.16vw)', fontSize: '1.61vh', fontWeight: 'bold'}}>{Math.round(batteryLevel * 100)}%</span>
    </div>
  );
};

export default BatteryIcon;