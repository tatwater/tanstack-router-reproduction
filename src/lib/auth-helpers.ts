import type { Dispatch, SetStateAction } from 'react'
import type { User } from '@/types/user'

import api from '@/lib/api'

export async function getCurrentSessionUserInfo() {
  const response = await api.whoami()

  if (response.ok) {
    const body = await response.json()

    const user: User = {
      id: body.data.user.id,
      email: body.data.user.email,
      familyName: body.data.user.family_name,
      givenName: body.data.user.given_name,
      createdAt: body.data.user.created_at,
      updatedAt: body.data.user.updated_at,
    }

    return user
  }

  return null
}

export function isUserAuthenticated() {
  const user = loadUserFromStorage()

  return !!user
}

export function loadUserFromStorage() {
  const userStr = localStorage.getItem('user')

  if (userStr === null) {
    return null
  }

  const user = JSON.parse(userStr) as User

  return user
}

export async function refreshUserInStorage(setUserCallback: Dispatch<SetStateAction<User | null>>) {
  const user = await getCurrentSessionUserInfo()

  if (user) {
    localStorage.setItem('user', JSON.stringify(user))
  }

  setUserCallback(user)
}
