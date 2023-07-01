import { BookmarkInterface } from 'interfaces/bookmark';
import { HighlightInterface } from 'interfaces/highlight';
import { OrganizationInterface } from 'interfaces/organization';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface BookInterface {
  id?: string;
  title: string;
  author: string;
  organization_id?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  bookmark?: BookmarkInterface[];
  highlight?: HighlightInterface[];
  organization?: OrganizationInterface;
  user?: UserInterface;
  _count?: {
    bookmark?: number;
    highlight?: number;
  };
}

export interface BookGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  author?: string;
  organization_id?: string;
  user_id?: string;
}
