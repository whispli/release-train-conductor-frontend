import { User } from '@/types'

export interface RootState {
  user: User
}

export interface ResetMixin<T> {
  reset: (currentState: T) => void;
}
