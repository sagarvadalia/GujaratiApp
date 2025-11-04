import React from "react";
import { type GetProps, Input as TamaguiInput, styled } from "tamagui";

const StyledInput = styled(TamaguiInput, {
  name: "UIInput",
  backgroundColor: "$background",
  color: "$color",
  borderColor: "$border",
  borderWidth: 1,
  borderRadius: "$6",
  paddingHorizontal: "$4",
  height: 44,
  fontSize: "$4",
  placeholderTextColor: "$colorMuted",
  focusStyle: {
    borderColor: "$ring",
    shadowColor: "$ring",
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  variants: {
    size: {
      sm: {
        height: 36,
        fontSize: "$3",
        paddingHorizontal: "$3",
      },
      md: {},
      lg: {
        height: 52,
        fontSize: "$5",
        paddingHorizontal: "$5",
      },
    },
    tone: {
      default: {},
      muted: {
        backgroundColor: "$muted",
        borderColor: "$divider",
      },
      invalid: {
        borderColor: "$destructive",
        focusStyle: {
          borderColor: "$destructive",
          shadowColor: "$destructive",
          shadowOpacity: 0.25,
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
    tone: "default",
  },
} as const);

type StyledInputProps = GetProps<typeof StyledInput>;

export type InputSize = NonNullable<StyledInputProps["size"]>;
export type InputTone = NonNullable<StyledInputProps["tone"]>;

export type InputProps = Omit<StyledInputProps, "size" | "tone"> & {
  size?: InputSize;
  tone?: InputTone;
};

export const Input = React.forwardRef<React.ElementRef<typeof StyledInput>, InputProps>(
  ({ size = "md", tone = "default", ...props }, ref) => {
    return (
      <StyledInput
        ref={ref}
        size={size}
        tone={tone}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

