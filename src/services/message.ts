import { getApiClient } from "../utils/apiClient";
import { MessageInterface } from "../interfaces/message";

export const getMessages = async () => {
  const client = getApiClient();
  const res = await client.get("messages/");
  return res;
};

export const postMessage = async (text: string) => {
  const client = getApiClient();
  const res = await client.post("messages/", { text });
  return res;
};

export const deleteMessage = async (id: string) => {
  const client = getApiClient();
  const res = await client.delete(`messages/${id}`);
  return res;
};

export const deleteAll = async (messages: Array<MessageInterface>) => {
  let promises = messages.map(async (message, index) =>
    deleteMessage(String(message.id))
  );
  const res = Promise.all(promises);
  return res;
};
