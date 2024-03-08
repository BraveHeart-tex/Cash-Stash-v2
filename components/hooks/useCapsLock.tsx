import { useEffect, useState } from "react";

const useCapsLock = () => {
  const [capsLockActive, setCapsLockActive] = useState(false);

  useEffect(() => {
    const wasCapsLockActived = (event: KeyboardEvent) => {
      if (
        event.getModifierState &&
        event.getModifierState("CapsLock") &&
        !capsLockActive
      ) {
        setCapsLockActive(true);
      }
    };

    const wasCapsLockDeactived = (event: KeyboardEvent) => {
      if (
        event.getModifierState &&
        !event.getModifierState("CapsLock") &&
        capsLockActive
      ) {
        setCapsLockActive(false);
      }
    };

    document.addEventListener("keydown", wasCapsLockActived);
    document.addEventListener("keyup", wasCapsLockDeactived);

    return () => {
      document.removeEventListener("keydown", wasCapsLockActived);
      document.removeEventListener("keyup", wasCapsLockDeactived);
    };
  }, [capsLockActive]);

  return capsLockActive;
};

export default useCapsLock;
