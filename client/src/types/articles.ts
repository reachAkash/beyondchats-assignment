export interface Article {
  _id: string;
  title: string;
  status: string;
  content: string;
  updatedContent?: string;
  references?: string[];
}
