import Message from "./Message";
import { MessageInterface } from "../interfaces/message";

interface AllMessagesProps {
  messages: Array<MessageInterface>;
  onDelete: (id: string) => void;
  handleCheckboxChange: any;
}

const AllMessages = ({
  messages,
  onDelete,
  handleCheckboxChange,
}: AllMessagesProps) => {
  return (
    <div>
      {messages.map((message: MessageInterface) => {
        const key = "MSG-" + message.id;
        return (
          <Message
            onCheckboxChange={handleCheckboxChange}
            onDelete={onDelete}
            key={key}
            message={message}
          />
        );
      })}
    </div>
  );
};

export default AllMessages;
