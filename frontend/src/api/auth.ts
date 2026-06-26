import request from './request'

export const getMe = () => 
     request.get('/users/profile')
