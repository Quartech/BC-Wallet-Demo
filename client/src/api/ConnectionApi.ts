import type { AxiosResponse } from 'axios'

import { apiCall } from './BaseUrl'

export const createInvitation = (agentName?: string, agentImageUrl?: string): Promise<AxiosResponse> => {
  return apiCall.post('/connections/createInvite', {
    label: agentName,
    imageUrl: agentImageUrl,
  })
}

export const getConnectionById = (connectionId: string): Promise<AxiosResponse> => {
  return apiCall.get(`/connections/getConnectionStatus/${connectionId}`)
}
