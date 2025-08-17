import { Button as MantineButton, ButtonProps } from '@mantine/core';
import { ReactNode } from 'react';

interface CustomButtonProps extends ButtonProps {
  children: ReactNode;
}

export function Button({ children, ...props }: CustomButtonProps) {
  return <MantineButton {...props}>{children}</MantineButton>;
}