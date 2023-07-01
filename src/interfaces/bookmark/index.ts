import { BookInterface } from 'interfaces/book';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface BookmarkInterface {
  id?: string;
  page_number: number;
  book_id?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  book?: BookInterface;
  user?: UserInterface;
  _count?: {};
}

export interface BookmarkGetQueryInterface extends GetQueryInterface {
  id?: string;
  book_id?: string;
  user_id?: string;
}
