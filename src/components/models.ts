export interface UserResponse {
  results: [
    {
      name: {
        first: string
        last: string
      }
      picture: {
        medium: string
      }
    }
  ]
}

export interface User {
  id: string
  name: string
  avatar: string
  color: string
  me: boolean
  typing: boolean
}

export interface Quote {
  content: string
  author: string
}

export interface Message {
  id: string
  user: User
  date: Date
  text: string[]
}
