import { Button, Space, Typography, Popconfirm } from "antd";
import { MessageInterface } from "../interfaces/message";
import { DateTime } from "luxon";

interface MessageProps {
  message: MessageInterface;
  onDelete: (id: string) => void;
}

const Message = ({ message, onDelete }: MessageProps) => {
  const { Text } = Typography;

  const time = DateTime.fromISO(message?.timestamp).toFormat("HH:mm:ss a");
  return (
    <div style={{ margin: "8px" }}>
      <div>
        <span>
          <strong>~{message?.source}</strong>
        </span>
        <span> - </span>
        <span>{time}</span>
        <Space />
        <Popconfirm
          title="Are you sure you want to delete this message?"
          onConfirm={() => onDelete(String(message?.id))}
        >
          <Button type="link" danger>
            <u> Delete</u>
          </Button>
        </Popconfirm>
      </div>
      <div>
        <Text type="secondary">{message?.text}</Text>
      </div>
    </div>
  );
};

export default Message;
