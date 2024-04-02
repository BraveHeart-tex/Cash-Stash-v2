import { formatMoney } from "../numberUtils/formatMoney";

export default function getCurrencyAmblem(currency: string) {
  return formatMoney(0, currency).replace(/[0.]/g, "");
}
