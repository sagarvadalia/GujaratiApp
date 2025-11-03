import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { SizableText, XStack, useTheme } from "tamagui";

import { ToggleButton, ToggleButtonProps } from "./button";

export type ToggleOption<T extends string> = {
  value: T;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export type ToggleGroupProps<T extends string> = {
  value: T;
  onChange?: (value: T) => void;
  options: ToggleOption<T>[];
  size?: ToggleButtonProps["size"];
  stretch?: boolean;
};

export function ToggleGroup<T extends string>({
  value,
  onChange,
  options,
  size = "md",
  stretch,
}: ToggleGroupProps<T>) {
  const theme = useTheme();

  return (
    <XStack
      gap="$2"
      backgroundColor="$muted"
      borderRadius="$7"
      padding="$1"
      borderWidth={1}
      borderColor="$divider"
      width={stretch ? "100%" : "auto"}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        const iconColor = isActive ? theme.primaryForeground.val : theme.color.val;

        return (
          <ToggleButton
            key={option.value}
            size={size}
            isActive={isActive}
            block={stretch}
            onPress={() => {
              if (!isActive) {
                onChange?.(option.value);
              }
            }}
          >
            <XStack gap="$2" alignItems="center">
              {option.icon ? (
                <Ionicons name={option.icon} size={size === "sm" ? 16 : 18} color={iconColor} />
              ) : null}
              <SizableText
                size={size === "sm" ? "$3" : "$4"}
                color={isActive ? "$secondaryForeground" : "$color"}
                fontWeight={isActive ? "700" : "500"}
              >
                {option.label}
              </SizableText>
            </XStack>
          </ToggleButton>
        );
      })}
    </XStack>
  );
}

