export interface Game {
  id: number
  match_link: string
  match_it_id: number
  hot_it_id: number
  party_id: number
  state: 'lobby' | 'starting' | 'started' | 'ended'
  name: string
}
