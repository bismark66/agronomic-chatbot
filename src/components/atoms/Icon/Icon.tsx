import { ThemeIcon, ThemeIconProps } from '@mantine/core';
import { ReactNode } from 'react';

interface IconProps extends Omit<ThemeIconProps, 'children'> {
  children: ReactNode;
}

export function Icon({ children, size = 'md', ...props }: IconProps) {
  return (
    <ThemeIcon size={size} {...props}>
      {children}
    </ThemeIcon>
  );
}