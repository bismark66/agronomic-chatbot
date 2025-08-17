import { Text, TextProps, Title, TitleProps } from '@mantine/core';
import { ReactNode } from 'react';

interface TypographyProps extends TextProps {
  children: ReactNode;
}

interface HeadingProps extends TitleProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Typography({ children, ...props }: TypographyProps) {
  return <Text {...props}>{children}</Text>;
}

export function Heading({ children, level = 1, ...props }: HeadingProps) {
  return (
    <Title order={level} {...props}>
      {children}
    </Title>
  );
}