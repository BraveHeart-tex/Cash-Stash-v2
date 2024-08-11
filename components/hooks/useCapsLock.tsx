import { useEffect, useState } from "react";

const useCapsLock = () => {
  const [capsLockActive, setCapsLockActive] = useState(false);

  useEffect(() => {
    const wasCapsLockActivated = (event: KeyboardEvent) => {
      if (event.getModifierState?.("CapsLock") && !capsLockActive) {
        setCapsLockActive(true);
      }
    };

    const wasCapsLockDeactivated = (event: KeyboardEvent) => {
      if (
        event.getModifierState &&
        !event.getModifierState("CapsLock") &&
        capsLockActive
      ) {
        setCapsLockActive(false);
      }
    };

    document.addEventListener("keydown", wasCapsLockActivated);
    document.addEventListener("keyup", wasCapsLockDeactivated);

    return () => {
      document.removeEventListener("keydown", wasCapsLockActivated);
      document.removeEventListener("keyup", wasCapsLockDeactivated);
    };
  }, [capsLockActive]);

  return capsLockActive;
};

export default useCapsLock;
