import { useEffect, useState } from "react";
import {
  deleteAll,
  deleteMessage,
  getMessages,
  postMessage,
} from "./services/message";
import { messages } from "./utils/dummy";
import { cloneDeep } from "lodash";

export interface Message {
  id: Number;
  text: string;
  source: string;
  timestamp: string;
}

interface MessageProps {
  message: Message;
  onDelete: (id: string) => void;
}

interface AllMessagesProps {
  messages: Array<Message>;
  onDelete: (id: string) => void;
}

interface Error {
  code?: string;
  message: string;
}

const AllMessages = ({ messages, onDelete }: AllMessagesProps) => {
  return (
    <div>
      {messages.map((message: Message) => {
        const key = "MSG-" + message.id;
        return <Message onDelete={onDelete} key={key} message={message} />;
      })}
    </div>
  );
};

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

const PostMessage = ({
  onPostClick,
}: {
  onPostClick: (text: string) => void;
}) => {
  const [text, setText] = useState<string>("");
  return (
    <span>
      <input
        value={text}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setText(e.target.value)
        }
      />
      <button
        onClick={() => {
          setText("");
          onPostClick(text);
        }}
      >
        Post
      </button>
    </span>
  );
};

const App = () => {
  const [data, setData] = useState<Array<Message>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const handlePostClick = async (text: string) => {
    try {
      const res: any = await postMessage(text);
      if (res.ok) {
        let newMessages = cloneDeep(data);
        newMessages.push(res.data);
        console.log(res, newMessages);
        setData(newMessages);
      } else {
        console.log(res);
        setError({ code: res?.status, message: res?.data?.text[0] });
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError({ message: error?.message });
    }
  };

  const handleDeleteClick = async (id: string) => {
    try {
      const res: any = await deleteMessage(id);
      if (res.ok) {
        let messagesClone = cloneDeep(data);
        const updatedMessages = messagesClone.filter(
          (message: Message) => String(message.id) !== id
        );
        setData(updatedMessages);
      } else {
        console.log(res);
        setError({ code: res?.status, message: res?.data?.text[0] });
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError({ message: error?.message });
    }
  };

  const handleDeleteAllClick = async () => {
    try {
      const res: any = await deleteAll(data);
      console.log(res);
      setLoading(false);
      if (res) {
        setData([]);
      } else {
        setError({ code: res?.status, message: res?.data?.detail });
      }
    } catch (error: any) {
      setLoading(false);
      setError({ message: error?.message });
    }
  };

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
    if (loading) return <div>loading...</div>;
    return <AllMessages onDelete={handleDeleteClick} messages={data} />;
  };

  return (
    <>
      Message Board
      <PostMessage onPostClick={handlePostClick} />{" "}
      <button onClick={handleDeleteAllClick}>Delete All</button>
      {renderAllMessages()}
    </>
  );
};

export default App;
