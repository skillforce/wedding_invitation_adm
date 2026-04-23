import { defineStore } from 'pinia'
import { ref } from 'vue'
import { USERS_API, type UsersViewDto, type CreatePlainUserDto, type EmailLocale } from '@/api/users'
import type { UpdateProfileDto } from '@/api/profile'
import type { ProfileDto } from '@/api/auth'

export const useUsersStore = defineStore('users', () => {
  const users = ref<UsersViewDto[]>([])
  const isLoading = ref(false)

  async function fetchUsers() {
    isLoading.value = true
    try {
      users.value = await USERS_API.getAll()
    } finally {
      isLoading.value = false
    }
  }

  async function createUser(dto: CreatePlainUserDto): Promise<UsersViewDto> {
    const user = await USERS_API.create(dto)
    users.value.push(user)
    return user
  }

  async function deleteUser(id: number) {
    await USERS_API.delete(id)
    users.value = users.value.filter((u) => u.id !== id)
  }

  async function resendConfirmation(id: number, locale?: EmailLocale) {
    await USERS_API.resendConfirmation(id, locale)
  }

  async function updateUserProfile(id: number, dto: UpdateProfileDto): Promise<ProfileDto> {
    const profile = await USERS_API.updateProfile(id, dto)
    const user = users.value.find((u) => u.id === id)
    if (user) user.profile = profile
    return profile
  }

  async function uploadUserProfileImage(id: number, file: File): Promise<ProfileDto> {
    const profile = await USERS_API.uploadProfileImage(id, file)
    const user = users.value.find((u) => u.id === id)
    if (user) user.profile = profile
    return profile
  }

  function reset() {
    users.value = []
  }

  return {
    users,
    isLoading,
    fetchUsers,
    createUser,
    deleteUser,
    resendConfirmation,
    updateUserProfile,
    uploadUserProfileImage,
    reset,
  }
})