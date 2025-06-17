

export interface MessageWithReplies {
  id: number;
  content: string;
  topic: string;
  createdAt: string;
  userId: number | null;
  author: {
    id: number;
    username: string;
    school: string;
    PoliticalView: any;
    philosophies: any[];
  };
  Replies: (any & {
    author: any;
    children: (any & {
      author: any;
    })[];
  })[];
}