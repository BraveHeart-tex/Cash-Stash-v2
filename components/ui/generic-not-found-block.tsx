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
          "inline-block scroll-m-20 text-2xl font-semibold tracking-tight text-primary lg:text-3xl",
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
