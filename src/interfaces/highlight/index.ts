import { BookInterface } from 'interfaces/book';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface HighlightInterface {
  id?: string;
  page_number: number;
  text: string;
  book_id?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  book?: BookInterface;
  user?: UserInterface;
  _count?: {};
}

export interface HighlightGetQueryInterface extends GetQueryInterface {
  id?: string;
  text?: string;
  book_id?: string;
  user_id?: string;
}
