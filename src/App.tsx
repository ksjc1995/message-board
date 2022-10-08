import { useEffect, useState } from "react";
import PostMessage from "./components/PostMessage";
import AllMessages from "./components/AllMessages";
import {
  deleteAll,
  deleteMessage,
  getMessages,
  postMessage,
} from "./services/message";
import { MessageInterface } from "./interfaces/message";
import { cloneDeep } from "lodash";

interface Error {
  code?: string;
  message: string;
}

const App = () => {
  const [data, setData] = useState<Array<MessageInterface>>([]);
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
          (message: MessageInterface) => String(message.id) !== id
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
      <h1>Chatter</h1>
      <></>
      <PostMessage onPostClick={handlePostClick} />{" "}
      <button onClick={handleDeleteAllClick}>Delete All</button>
      {renderAllMessages()}
    </>
  );
};

export default App;
