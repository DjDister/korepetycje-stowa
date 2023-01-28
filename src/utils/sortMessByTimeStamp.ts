import { Message } from "../types";

const sortMessByTimeStamp = (messages: Message[]) => {
  return messages.sort((a, b) => {
    if (a.createdAt === null || b.createdAt === null) return 0;
    return a.createdAt.seconds - b.createdAt.seconds;
  });
};

export default sortMessByTimeStamp;
