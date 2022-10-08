import Message from "./Message";
import { MessageInterface } from "../interfaces/message";

interface AllMessagesProps {
  messages: Array<MessageInterface>;
  onDelete: (id: string) => void;
}

const AllMessages = ({ messages, onDelete }: AllMessagesProps) => {
  return (
    <div>
      {messages.map((message: MessageInterface) => {
        const key = "MSG-" + message.id;
        return <Message onDelete={onDelete} key={key} message={message} />;
      })}
    </div>
  );
};

export default AllMessages;
