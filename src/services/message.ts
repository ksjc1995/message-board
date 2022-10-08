import { getApiClient } from "../utils/apiClient";
import { Message } from "../App";

export const getMessages = async () => {
  const client = getApiClient();
  const res = await client.get("messages");
  return res;
};

export const postMessage = async (message: Message) => {
  const client = getApiClient();
  const res = await client.post("messages", message);
  return res;
};

export const deleteMessage = async (id: string) => {
  const client = getApiClient();
  const res = await client.delete(`messages/${id}`);
  return res;
};
