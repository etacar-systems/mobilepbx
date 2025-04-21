import { ReactComponent as UpArrow } from "../../../../../Assets/Icon/up-arrow.svg";
import { ReactComponent as DownArrow } from "../../../../../Assets/Icon/down-arrow.svg";

interface ISortArrowsProps {
  direction?: "asc" | "desc";
}

export const SortArrows = ({ direction }: ISortArrowsProps) => {
  return (
    <div>
      <UpArrow
        width={10}
        height={20}
        style={{
          filter: direction === "desc" ? "opacity(0.5)" : "",
        }}
      />
      <DownArrow
        width={10}
        height={20}
        style={{
          filter: direction === "asc" ? "opacity(0.5)" : "",
          marginLeft: "-4px",
        }}
      />
    </div>
  );
};
