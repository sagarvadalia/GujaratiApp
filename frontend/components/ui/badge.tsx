import React from "react";
import { type GetProps, SizableText, styled,XStack } from "tamagui";

const StyledBadge = styled(XStack, {
  name: "UIBadge",
  alignItems: "center",
  justifyContent: "center",
  gap: "$2",
  paddingHorizontal: "$3",
  paddingVertical: "$1",
  borderRadius: "$5",
  backgroundColor: "$secondary",
  borderWidth: 1,
  borderColor: "$secondary",
  variants: {
    tone: {
      default: {
        backgroundColor: "$secondary",
        borderColor: "$secondary",
      },
      primary: {
        backgroundColor: "$primary",
        borderColor: "$primary",
      },
      muted: {
        backgroundColor: "$muted",
        borderColor: "$divider",
      },
      outline: {
        backgroundColor: "transparent",
        borderColor: "$divider",
      },
      destructive: {
        backgroundColor: "$destructive",
        borderColor: "$destructive",
      },
      success: {
        backgroundColor: "$success",
        borderColor: "$success",
      },
    },
    size: {
      sm: {
        paddingVertical: 4,
        paddingHorizontal: "$2",
      },
      md: {},
      lg: {
        paddingVertical: "$2",
        paddingHorizontal: "$4",
      },
    },
  },
  defaultVariants: {
    tone: "default",
    size: "md",
  },
} as const);

type StyledBadgeProps = GetProps<typeof StyledBadge>;
type SizableTextProps = React.ComponentProps<typeof SizableText>;

export type BadgeTone = NonNullable<StyledBadgeProps["tone"]>;
export type BadgeSize = NonNullable<StyledBadgeProps["size"]>;

type BadgeProps = Omit<StyledBadgeProps, "tone" | "size"> & {
  tone?: BadgeTone;
  size?: BadgeSize;
  label?: string;
};

export const Badge: React.FC<BadgeProps> = ({ label, tone = "default", size = "md", children, ...props }) => {
  const textColor: SizableTextProps["color"] =
    tone === "primary"
      ? "$primaryForeground"
      : tone === "destructive"
      ? "$destructiveForeground"
      : tone === "success"
      ? "$successForeground"
      : tone === "muted" || tone === "outline"
      ? "$mutedForeground"
      : "$secondaryForeground";

  return (
    <StyledBadge tone={tone} size={size} {...props}>
      <SizableText size={size === "lg" ? "$4" : "$3"} fontWeight="600" color={textColor}>
        {children ?? label}
      </SizableText>
    </StyledBadge>
  );
};

Badge.displayName = "Badge";
