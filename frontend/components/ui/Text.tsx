import { Text as RNText, TextProps } from 'react-native';

export function Text({ className, ...props }: TextProps) {
  return (
    <RNText
      // Apply your default font and color here
      className={`font-sans text-foreground ${className}`}
      {...props}
    />
  );
}
