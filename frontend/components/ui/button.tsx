import React from "react";
import { Button as TamaguiButton, GetProps, styled } from "tamagui";

const StyledButton = styled(TamaguiButton, {
  name: "UIButton",
  borderRadius: "$6",
  borderWidth: 1,
  borderColor: "transparent",
  fontWeight: "600",
  justifyContent: "center",
  alignItems: "center",
  minHeight: 44,
  gap: "$2",
  paddingHorizontal: "$4",
  pressStyle: {
    scale: 0.97,
  },
  variants: {
    variant: {
      default: {
        backgroundColor: "$primary",
        color: "$primaryForeground",
        borderColor: "$primary",
        hoverStyle: { backgroundColor: "$primaryHover" },
        pressStyle: { backgroundColor: "$primaryPressed", scale: 0.96 },
      },
      secondary: {
        backgroundColor: "$secondary",
        color: "$secondaryForeground",
        borderColor: "$secondary",
        hoverStyle: { backgroundColor: "$secondaryHover" },
        pressStyle: { backgroundColor: "$secondaryPressed", scale: 0.96 },
      },
      accent: {
        backgroundColor: "$accent",
        color: "$accentForeground",
        borderColor: "$accent",
        hoverStyle: { backgroundColor: "$highlight" },
        pressStyle: { backgroundColor: "$secondaryHover", scale: 0.96 },
      },
      outline: {
        backgroundColor: "transparent",
        color: "$color",
        borderColor: "$border",
        hoverStyle: {
          backgroundColor: "$backgroundHover",
          borderColor: "$divider",
        },
        pressStyle: {
          backgroundColor: "$backgroundPressed",
          scale: 0.96,
        },
      },
      ghost: {
        backgroundColor: "transparent",
        color: "$color",
        borderColor: "transparent",
        hoverStyle: { backgroundColor: "$backgroundHover" },
        pressStyle: { backgroundColor: "$backgroundPressed", scale: 0.96 },
      },
      destructive: {
        backgroundColor: "$destructive",
        color: "$destructiveForeground",
        borderColor: "$destructive",
        hoverStyle: { backgroundColor: "$destructiveHover" },
        pressStyle: { backgroundColor: "$destructiveHover", scale: 0.96 },
      },
      success: {
        backgroundColor: "$success",
        color: "$successForeground",
        borderColor: "$success",
        hoverStyle: { backgroundColor: "$success" },
        pressStyle: { backgroundColor: "$success", scale: 0.96 },
      },
      subtle: {
        backgroundColor: "$muted",
        color: "$mutedForeground",
        borderColor: "$muted",
        hoverStyle: { backgroundColor: "$secondaryHover" },
        pressStyle: { backgroundColor: "$secondaryPressed", scale: 0.96 },
      },
    },
    size: {
      sm: {
        minHeight: 36,
        paddingHorizontal: "$3",
        paddingVertical: "$2",
      },
      md: {
        minHeight: 44,
        paddingVertical: "$3",
      },
      lg: {
        minHeight: 52,
        paddingVertical: "$4",
      },
    },
    block: {
      true: {
        width: "100%",
      },
    },
    circular: {
      true: {
        width: 44,
        height: 44,
        paddingHorizontal: 0,
      },
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export type ButtonProps = GetProps<typeof StyledButton>;

export const Button = React.forwardRef<
  React.ElementRef<typeof StyledButton>,
  ButtonProps
>(({ variant = "default", size = "md", ...props }, ref) => {
  return <StyledButton ref={ref} variant={variant} size={size} {...props} />;
});

Button.displayName = "Button";

export type IconButtonProps = ButtonProps & { active?: boolean };

export const IconButton = React.forwardRef<
  React.ElementRef<typeof StyledButton>,
  IconButtonProps
>(
  (
    {
      active,
      variant = active ? "secondary" : "ghost",
      circular = true,
      ...props
    },
    ref
  ) => {
    return (
      <StyledButton
        ref={ref}
        variant={variant}
        circular={circular}
        {...props}
      />
    );
  }
);

IconButton.displayName = "IconButton";

export type ToggleButtonProps = ButtonProps & {
  isActive?: boolean;
};

export const ToggleButton = React.forwardRef<
  React.ElementRef<typeof StyledButton>,
  ToggleButtonProps
>(({ isActive, variant, ...props }, ref) => {
  const resolvedVariant = variant ?? (isActive ? "secondary" : "outline");

  return (
    <StyledButton
      ref={ref}
      variant={resolvedVariant}
      aria-pressed={isActive}
      {...props}
    />
  );
});

ToggleButton.displayName = "ToggleButton";
