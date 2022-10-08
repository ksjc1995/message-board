import { useEffect } from "react";
import { getApiClient } from "./apiClient";

const App = () => {
  const apiClient = getApiClient();

  useEffect(() => {
    apiClient.get("messages").then((res) => console.log(res));
  }, []);

  return <>Message Board</>;
};

export default App;
