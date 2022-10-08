import { useState } from "react";
import { Button, Input, Row, Col } from "antd";

interface PostMessageProps {
  onPostClick: (text: string) => void;
}

const PostMessage = ({ onPostClick }: PostMessageProps) => {
  const [text, setText] = useState<string>("");
  return (
    <Row gutter={12}>
      <Col>
        <Input
          value={text}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setText(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setText("");
              onPostClick(text);
            }
          }}
        />
      </Col>
      <Col>
        <Button
          type="primary"
          onClick={() => {
            setText("");
            onPostClick(text);
          }}
        >
          Post
        </Button>
      </Col>
    </Row>
  );
};

export default PostMessage;
