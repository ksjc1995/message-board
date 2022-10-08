import { useEffect, useState } from "react";
import PostMessage from "./components/PostMessage";
import AllMessages from "./components/AllMessages";
import {
  Button,
  Row,
  Col,
  Alert,
  Spin,
  Typography,
  message,
  Space,
  Popconfirm,
  Empty,
} from "antd";
import {
  deleteAll,
  deleteMessage,
  getMessages,
  postMessage,
} from "./services/message";
import { MessageInterface } from "./interfaces/message";
import { cloneDeep } from "lodash";
import { sortMessagesByDate } from "./utils";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

interface Error {
  code?: string;
  message: string;
}

const App = () => {
  const { Title } = Typography;
  const [data, setData] = useState<Array<MessageInterface>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handlePostClick = async (text: string) => {
    setError(null);
    try {
      const res: any = await postMessage(text);
      if (res.ok) {
        let newMessages = cloneDeep(data);
        newMessages.push(res.data);
        setData(newMessages);
        message.success("Successfully created message!");
      } else {
        setError({ code: res?.status, message: res?.data?.text[0] });
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError({ message: error?.message });
    }
  };

  const handleDeleteClick = async (id: string) => {
    setError(null);
    try {
      const res: any = await deleteMessage(id);
      if (res.ok) {
        let messagesClone = cloneDeep(data);
        const updatedMessages = messagesClone.filter(
          (message: MessageInterface) => String(message.id) !== id
        );
        setData(updatedMessages);
        message.success(`Successfully deleted message ${id}!`);
      } else {
        setError({ code: res?.status, message: res?.problem });
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError({ message: error?.message });
    }
  };

  const handleDeleteAllClick = async () => {
    if (data.length > 0) {
      try {
        const res: any = await deleteAll(data);
        setLoading(false);
        if (res) {
          setData([]);
          message.success(`Successfully deleted all message!`);
        } else {
          setError({ code: res?.status, message: res?.problem });
        }
      } catch (error: any) {
        setLoading(false);
        setError({ message: error?.message });
      }
    } else {
      message.info("Nothing to delete!");
    }
  };

  const fetchMessages = async () => {
    try {
      const res: any = await getMessages();
      setLoading(false);
      if (res.ok) {
        setData(res.data);
      } else {
        setError({ code: res?.status, message: res?.problem });
      }
    } catch (error: any) {
      setLoading(false);
      setError({ message: error?.message });
    }
  };

  const handleSortClick = () => {
    if (sortOrder === "asc") {
      setSortOrder("desc");
    } else {
      setSortOrder("asc");
    }
    setData(sortMessagesByDate(data, sortOrder));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const renderAllMessages = () => {
    return (
      <>
        {loading ? (
          <div>
            <Spin />
          </div>
        ) : Array.isArray(data) && data.length > 0 ? (
          <AllMessages onDelete={handleDeleteClick} messages={data} />
        ) : (
          <Empty />
        )}
      </>
    );
  };

  return (
    <div style={{ padding: "32px" }}>
      {error ? <Alert closable message={error?.message} type="error" /> : ""}
      <br />
      <Title>Chatter</Title>
      <Title level={4} type="secondary">
        Type something in the box below, then hit "Enter" or click "Post"
      </Title>
      <br />
      <Row gutter={12}>
        <Col>
          <PostMessage onPostClick={handlePostClick} />{" "}
        </Col>
        <Col>
          <Popconfirm
            title="Are you sure you want to delete all messages?"
            onConfirm={handleDeleteAllClick}
          >
            <Button type="primary" danger>
              Delete All
            </Button>
          </Popconfirm>
        </Col>
      </Row>
      <br />
      <Button onClick={handleSortClick}>
        Sort by date <Space />{" "}
        {sortOrder === "desc" ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
      </Button>
      <br />
      <br />
      {renderAllMessages()}
    </div>
  );
};

export default App;
