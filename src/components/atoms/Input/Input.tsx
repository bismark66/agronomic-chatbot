import { TextInput, TextInputProps, Textarea, TextareaProps } from '@mantine/core';

export function Input(props: TextInputProps) {
  return <TextInput {...props} />;
}

export function TextArea(props: TextareaProps) {
  return <Textarea {...props} />;
}