import { MessageInterface } from "../interfaces/message";

interface MessageProps {
  message: MessageInterface;
  onDelete: (id: string) => void;
}

const Message = ({ message, onDelete }: MessageProps) => {
  return (
    <div style={{ margin: "8px" }}>
      <div>
        <span>
          <strong>~{message?.source}</strong>
        </span>
        <span> - </span>
        <span>{message?.timestamp}</span>
        <button onClick={() => onDelete(String(message.id))}>Delete</button>
      </div>
      <div>
        <p>{message?.text}</p>
      </div>
    </div>
  );
};

export default Message;
