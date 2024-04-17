import { cn } from "@/lib/utils/stringUtils/cn";

type GenericNotFoundBlockProps = {
  heading: string;
  message: string;
  headingClassName?: string;
  messageClassName?: string;
};

const GenericNotFoundBlock = ({
  heading,
  message,
  headingClassName,
  messageClassName,
}: GenericNotFoundBlockProps) => {
  return (
    <div className="text-center">
      <h2
        className={cn(
          "inline-block text-2xl lg:text-3xl font-semibold text-primary scroll-m-20 tracking-tight",
          headingClassName
        )}
      >
        {heading}
      </h2>
      <p className={cn("mt-2 text-muted-foreground", messageClassName)}>
        {message}
      </p>
    </div>
  );
};
export default GenericNotFoundBlock;
