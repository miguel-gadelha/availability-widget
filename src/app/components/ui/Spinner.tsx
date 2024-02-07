import { Loader2 } from "lucide-react";

interface Props {
  className?: string;
  width?: number;
  height?: number;
}

const Spinner = ({ width = 18, height = 18, className }: Props) => {
  return (
    <Loader2
      className={`animate-spin ${className}`}
      width={width}
      height={height}
    ></Loader2>
  );
};

export default Spinner;
