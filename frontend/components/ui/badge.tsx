import React from "react";
import { GetProps, SizableText, XStack, styled } from "tamagui";

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
});

type BadgeProps = GetProps<typeof StyledBadge> & {
  tone?: "default" | "primary" | "muted" | "outline" | "destructive" | "success";
  size?: "sm" | "md" | "lg";
  label?: string;
};

export const Badge: React.FC<BadgeProps> = ({ label, tone = "default", children, ...props }) => {
  const textColor =
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
    <StyledBadge tone={tone} {...props}>
      <SizableText
        size={props.size === "lg" ? "$4" : "$3"}
        fontWeight="600"
        color={textColor as any}
      >
        {children ?? label}
      </SizableText>
    </StyledBadge>
  );
};

Badge.displayName = "Badge";
