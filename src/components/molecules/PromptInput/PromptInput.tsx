import { Stack, Group, ActionIcon, Tooltip, Paper, Loader } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconSend, IconPhoto } from '@tabler/icons-react';
import { useState } from 'react';
import { TextArea } from '../../atoms/Input/Input';
import { FileWithPath } from '@mantine/dropzone';
import { UploadButton } from '../UploadButton/UploadButton';

interface PromptInputProps {
  onSubmit: (message: string, files?: FileWithPath[]) => void;
  loading?: boolean;
}

export function PromptInput({ onSubmit, loading }: PromptInputProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPath[]>([]);

  const form = useForm({
    initialValues: {
      question: "",
    },
    validate: {
      question: (value) =>
        value.trim().length === 0 ? "question is required" : null,
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    if (values.question.trim()) {
      onSubmit(
        values.question.trim(),
        selectedFiles.length > 0 ? selectedFiles : undefined
      );
      form.reset();
      setSelectedFiles([]);
      setShowUpload(false);
    }
  });

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Paper withBorder p="md" radius="md">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          {showUpload && (
            <UploadButton onFileSelect={setSelectedFiles} loading={loading} />
          )}

          {selectedFiles.length > 0 && (
            <Group gap="xs">
              {selectedFiles.map((file, index) => (
                <Paper key={index} p="xs" bg="green.0" radius="sm">
                  <Group gap="xs">
                    <IconPhoto size={16} />
                    <span style={{ fontSize: "0.75rem" }}>{file.name}</span>
                  </Group>
                </Paper>
              ))}
            </Group>
          )}

          <Group align="flex-end" gap="md">
            <TextArea
              {...form.getInputProps("question")}
              placeholder="Ask about crop management, soil health, pest control..."
              autosize
              minRows={1}
              maxRows={6}
              style={{ flex: 1 }}
              onKeyDown={handleKeyPress}
              disabled={loading}
            />

            <Group gap="xs">
              <Tooltip label="Upload crop image">
                <ActionIcon
                  variant={showUpload ? "filled" : "light"}
                  color="green"
                  size="lg"
                  onClick={() => setShowUpload(!showUpload)}
                  disabled={loading}
                >
                  <IconPhoto size={16} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label="Send question">
                <ActionIcon
                  type="submit"
                  variant="filled"
                  color="green"
                  size="lg"
                  loading={loading}
                  disabled={!form.values.question.trim()}
                >
                  {loading ? <Loader size={16} /> : <IconSend size={16} />}
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}