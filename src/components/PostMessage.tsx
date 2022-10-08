import { useState } from "react";

interface PostMessageProps {
  onPostClick: (text: string) => void;
}

const PostMessage = ({ onPostClick }: PostMessageProps) => {
  const [text, setText] = useState<string>("");
  return (
    <span>
      <input
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

export default PostMessage;
