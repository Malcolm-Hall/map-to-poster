import { Input } from "@/components/ui/input";
import type { NumberInput } from "@/models/generation";

export default function NumericInput({
  minValue,
  maxValue,
  value,
  setValue,
  isFreeType,
  ...props
}: Omit<
  React.ComponentProps<typeof Input>,
  "onChange" | "onBlur" | "value" | "type"
> & {
  value: NumberInput;
  setValue: (value: NumberInput) => void;
  maxValue?: number;
  minValue?: number;
  isFreeType?: boolean;
}) {
  const minInput =
    isFreeType && (!minValue || minValue > 0)
      ? 0
      : (minValue ?? Number.MIN_SAFE_INTEGER);
  return (
    <Input
      value={value}
      type="text"
      onChange={(e) => {
        if (!e.target.value) {
          setValue("");
          return;
        }
        if (e.target.value === "-") {
          setValue("-");
          return;
        }
        if (e.target.value.includes(".")) {
          return;
        }
        const val = Number(e.target.value);
        if (Number.isNaN(val)) return;
        const clamped = Math.min(
          Math.max(val, minInput),
          maxValue ?? Number.MAX_SAFE_INTEGER,
        );
        setValue(clamped);
      }}
      onBlur={() => {
        if (minValue && (value === "" || value === "-" || value < minValue)) {
          setValue(minValue);
        } else if (
          maxValue &&
          (value === "" || value === "-" || value > maxValue)
        ) {
          setValue(maxValue);
        } else if (value === "" || value === "-") {
          setValue(0);
        }
      }}
      {...props}
    />
  );
}
