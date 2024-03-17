import { cn } from "@/lib/utils/stringUtils/cn";

interface IDataLabelProps {
  label: string;
  value: any;
  classNames?: {
    container?: string;
    label?: string;
    value?: string;
  };
}

const DataLabel = ({ label, value, classNames }: IDataLabelProps) => {
  return (
    <div className={cn("flex items-center gap-1", classNames?.container)}>
      <p className={cn("font-semibold", classNames?.label)}>{label}: </p>
      <p className={classNames?.value}>{value}</p>
    </div>
  );
};
export default DataLabel;
