import { Group, Text, rem, Button } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';

interface UploadButtonProps {
  onFileSelect: (files: FileWithPath[]) => void;
  loading?: boolean;
}

export function UploadButton({ onFileSelect, loading }: UploadButtonProps) {
  return (
    <Dropzone
      onDrop={onFileSelect}
      onReject={(files) => console.log('rejected files', files)}
      maxSize={5 * 1024 ** 2} // 5MB
      accept={['image/*']}
      loading={loading}
      styles={{
        root: {
          border: '2px dashed var(--mantine-color-gray-4)',
          borderRadius: 'var(--mantine-radius-md)',
          padding: rem(8),
          cursor: 'pointer',
          transition: 'border-color 150ms ease',
          '&:hover': {
            borderColor: 'var(--mantine-color-green-5)',
          },
        },
      }}
    >
      <Group justify="center" gap="xs" mih={60} style={{ pointerEvents: 'none' }}>
        <Dropzone.Accept>
          <IconUpload
            style={{ width: rem(24), height: rem(24) }}
            color="var(--mantine-color-green-6)"
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            style={{ width: rem(24), height: rem(24) }}
            color="var(--mantine-color-red-6)"
            stroke={1.5}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto
            style={{ width: rem(24), height: rem(24) }}
            color="var(--mantine-color-dimmed)"
            stroke={1.5}
          />
        </Dropzone.Idle>

        <div>
          <Text size="sm" inline ta="center">
            Drop crop images here or click to upload
          </Text>
          <Text size="xs" c="dimmed" inline mt={4} ta="center">
            Support JPG, PNG up to 5MB
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}