import { cloneDeep } from "lodash";
import { DateTime } from "luxon";
import { MessageInterface } from "../interfaces/message";

export const sortMessagesByDate = (
  arr: Array<MessageInterface>,
  sortOrder: string
) => {
  if (arr.length > 0) {
    const newData = cloneDeep(arr);
    newData.sort((a: any, b: any) => {
      if (sortOrder === "desc") {
        return (
          DateTime.fromISO(a.timestamp).toMillis() -
          DateTime.fromISO(b.timestamp).toMillis()
        );
      }
      return (
        DateTime.fromISO(b.timestamp).toMillis() -
        DateTime.fromISO(a.timestamp).toMillis()
      );
    });
    return newData;
  }
  return [];
};
