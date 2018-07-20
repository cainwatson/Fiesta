import { User } from './User';

export interface GroupUser {
  id: number
  createdAt: string
  updatedAt: string
  user_id: number
  party_id: number
  user: User
  is_host: boolean
}
