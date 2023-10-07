import CreateUserAccountOptions from "@/lib/CreateUserAccountOptions";
import { SerializedUserAccount } from "../redux/features/userAccountSlice";

interface IAccountCardProps {
  account: SerializedUserAccount;
}

const AccountCard = ({ account }: IAccountCardProps) => {
  const accountCategory = CreateUserAccountOptions[account.category];

  return (
    <div
      className="p-4 rounded-md shadow-lg border w-full cursor-pointer hover:shadow-xl transition duration-300 ease-in-out"
      key={account.name}
    >
      <p className="font-semibold mb-2">
        {account.name} <span>({accountCategory})</span>
      </p>
      <p className="text-md">Balance: {account.balance}₺</p>
    </div>
  );
};
export default AccountCard;
