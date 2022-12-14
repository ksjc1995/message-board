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
  Pagination,
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
  const [checkedMessages, setCheckedMessages] = useState<Array<Number>>([]);
  const [paginatedData, setPaginatedData] = useState<Array<MessageInterface>>(
    []
  );
  const [pageSize, setPageSize] = useState<number>(3);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const paginatedData = data.slice(
      currentPage * pageSize - pageSize,
      currentPage * pageSize
    );
    setPaginatedData(paginatedData);
  }, [currentPage, data]);

  const handleCheckboxChange = (e: any, id: number) => {
    const newCheckedMessages = [...checkedMessages];
    newCheckedMessages.push(id);
    setCheckedMessages(newCheckedMessages);
  };

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
    // console.log(e);
  };

  const handleDeleteCheckedMessages = async () => {
    if (checkedMessages.length > 0) {
      setLoading(true);
      let promises = checkedMessages.map((id: Number) => {
        return deleteMessage(String(id));
      });

      try {
        const res = await Promise.all(promises);

        // remove deleted messages from data
        const newData = data.filter((message: MessageInterface) => {
          if (checkedMessages.includes(message?.id)) {
            return false;
          }
          return true;
        });
        setData(newData);
        setLoading(false);
      } catch (e: any) {
        setLoading(false);
        setError({ message: e?.message });
        console.log(error);
      }
    }
  };

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
        setPaginatedData(res.data.slice(0, pageSize));
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
          <AllMessages
            onDelete={handleDeleteClick}
            handleCheckboxChange={handleCheckboxChange}
            messages={paginatedData}
          />
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
      <Space />
      <Button danger onClick={handleDeleteCheckedMessages}>
        Delete selected
      </Button>
      <br />
      <br />
      {renderAllMessages()}
      <Pagination
        onChange={handlePageChange}
        defaultCurrent={1}
        defaultPageSize={3}
        total={data.length}
      />
    </div>
  );
};

export default App;
