import React from "react";
import { Card as TamaguiCard, type GetProps, styled } from "tamagui";

const StyledCard = styled(TamaguiCard, {
  name: "UICard",
  backgroundColor: "$card",
  borderRadius: "$6",
  borderWidth: 1,
  borderColor: "$divider",
  padding: "$4",
  gap: "$3",
  hoverStyle: {
    backgroundColor: "$backgroundHover",
  },
  variants: {
    elevated: {
      true: {
        shadowColor: "$shadowColor",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 4,
        borderColor: "transparent",
      },
    },
    interactive: {
      true: {
        pressStyle: { scale: 0.98 },
        hoverStyle: { backgroundColor: "$backgroundHover", y: -2 },
      },
    },
    tone: {
      default: {},
      subtle: {
        backgroundColor: "$muted",
        borderColor: "$muted",
      },
      primary: {
        backgroundColor: "$highlight",
        borderColor: "$primary",
      },
    },
  },
  defaultVariants: {
    tone: "default",
  },
} as const);

type StyledCardProps = GetProps<typeof StyledCard>;

export type CardTone = NonNullable<StyledCardProps["tone"]>;

export type CardProps = Omit<StyledCardProps, "tone"> & {
  tone?: CardTone;
};

export const Card = React.forwardRef<React.ElementRef<typeof StyledCard>, CardProps>(
  ({ tone = "default", ...props }, ref) => {
    return (
      <StyledCard
        ref={ref}
        tone={tone}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";
