import { User } from './User';
import { Party } from './Party';

export interface GroupUser {
  id: number
  createdAt: string
  updatedAt: string
  user_id: number
  party_id: number
  party?: Party
  user?: User
  is_host: boolean
}
