import { useEffect, useState } from "react";
import { getApiClient } from "./utils/apiClient";
import { getMessages } from "./services/message";
import { messages } from "./utils/dummy";

export interface Message {
  id: Number;
  text: string;
  source: string;
  timestamp: string;
}

interface MessageProps {
  message: Message;
}

interface AllMessagesProps {
  messages: Array<Message>;
}

interface Error {
  code?: string;
  message: string;
}

const AllMessages = ({ messages }: AllMessagesProps) => {
  return (
    <div>
      {messages.map((message: Message) => {
        const key = "MSG-" + message.id;
        return <Message key={key} message={message} />;
      })}
    </div>
  );
};

const Message = ({ message }: MessageProps) => {
  return (
    <div style={{ margin: "8px" }}>
      <div>
        <span>
          <strong>~{message?.source}</strong>
        </span>
        <span> - </span>
        <span>{message?.timestamp}</span>
      </div>
      <div>
        <p>{message?.text}</p>
      </div>
    </div>
  );
};

const App = () => {
  const [data, setData] = useState<Array<Message>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMessages = async () => {
    try {
      const res: any = await getMessages();
      setLoading(false);
      if (res.ok) {
        setData(res.data);
      } else {
        setError({ code: res?.status, message: res?.data?.detail });
      }
    } catch (error: any) {
      setLoading(false);
      setError({ message: error?.message });
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const renderAllMessages = () => {
    if (error) return <div>{error?.message}</div>;
    if (loading) return "loading...";

    return <AllMessages messages={data} />;
  };

  return (
    <>
      Message Board
      {renderAllMessages()}
    </>
  );
};

export default App;
