import {
  Paper,
  Group,
  Avatar,
  Text,
  Badge,
  Alert,
  Table,
  Image,
  Stack,
} from "@mantine/core";
import {
  IconUser,
  IconRobot,
  IconInfoCircle,
  IconAlertTriangle,
  IconX,
  IconCheck,
} from "@tabler/icons-react";
import { Message } from "../../../types";
import { format } from "date-fns";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";

  const getAlertColor = (level: string) => {
    switch (level) {
      case "error":
        return "red";
      case "warning":
        return "yellow";
      case "success":
        return "green";
      default:
        return "blue";
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case "error":
        return <IconX size={16} />;
      case "warning":
        return <IconAlertTriangle size={16} />;
      case "success":
        return <IconCheck size={16} />;
      default:
        return <IconInfoCircle size={16} />;
    }
  };

  return (
    <Group align="flex-start" gap="md" mb="lg">
      <Avatar color={isUser ? "blue" : "green"} radius="xl" size="md">
        {isUser ? <IconUser size={16} /> : <IconRobot size={16} />}
      </Avatar>

      <Stack style={{ flex: 1, maxWidth: "calc(100% - 60px)" }}>
        <Group justify="space-between" align="center" gap="xs">
          <Badge variant="light" color={isUser ? "blue" : "green"} size="sm">
            {isUser ? "You" : "AI Advisor"}
          </Badge>
          <Text size="xs" c="dimmed">
            {format(message.timestamp, "HH:mm")}
          </Text>
        </Group>

        <Paper
          p="md"
          radius="md"
          bg={isUser ? "blue.0" : "gray.0"}
          style={{
            borderTopLeftRadius: isUser ? undefined : "4px",
            borderTopRightRadius: isUser ? "4px" : undefined,
          }}
        >
          <Stack gap="md">
            <Text
              c={"#000"}
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {message.content}
            </Text>

            {message.metadata?.imageUrl && (
              <Image
                src={message.metadata.imageUrl}
                alt="Uploaded crop image"
                radius="md"
                style={{ maxWidth: "300px" }}
              />
            )}

            {message.metadata?.tableData && (
              <Stack gap="xs">
                <Text fw={500} size="sm">
                  Agricultural Data:
                </Text>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      {message.metadata.tableData.headers.map(
                        (header, index) => (
                          <Table.Th key={index}>{header}</Table.Th>
                        )
                      )}
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {message.metadata.tableData.rows.map((row, rowIndex) => (
                      <Table.Tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <Table.Td key={cellIndex}>{cell}</Table.Td>
                        ))}
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
                {message.metadata.tableData.caption && (
                  <Text size="sm" c="dimmed" ta="center">
                    {message.metadata.tableData.caption}
                  </Text>
                )}
              </Stack>
            )}

            {message.metadata?.alertLevel && (
              <Alert
                icon={getAlertIcon(message.metadata.alertLevel)}
                color={getAlertColor(message.metadata.alertLevel)}
                radius="md"
              >
                <Text size="sm">
                  This recommendation requires{" "}
                  {message.metadata.alertLevel === "error"
                    ? "immediate"
                    : "careful"}{" "}
                  attention.
                </Text>
              </Alert>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Group>
  );
}
