import { cn } from "@/lib/utils/stringUtils/cn";
import { MdCheck, MdClear, MdPassword } from "react-icons/md";

const PasswordRequirements = ({ password = "" }: { password: string }) => {
  const validations = [
    {
      label: "8 characters",
      isValid: password.length >= 8,
    },
    {
      label: "1 lowercase letter",
      isValid: password.match(/[a-z]/),
    },
    {
      label: "1 uppercase letter",
      isValid: password.match(/[A-Z]/),
    },
    {
      label: "1 number",
      isValid: password.match(/[0-9]/),
    },
  ];

  return (
    <div className="mt-4 rounded-md border p-2">
      <h2 className="mb-2 flex items-center gap-1 text-lg font-semibold text-foreground">
        <MdPassword className="text-xl" />
        Password requirements:
      </h2>
      <ul>
        {validations.map((validation, index) => (
          <li
            key={index}
            className={cn(
              "flex items-center gap-1 font-semibold text-destructive",
              validation.isValid && "text-success"
            )}
          >
            {validation.isValid ? (
              <MdCheck className="text-xl" />
            ) : (
              <MdClear className="text-xl" />
            )}
            {validation.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordRequirements;
