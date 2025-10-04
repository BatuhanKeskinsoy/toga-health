import { UserTypes } from '@/lib/types/user/UserTypes';
import React from 'react'

interface DoctorStatisticsProps {
  user: UserTypes;
}

function DoctorStatistics({ user }: DoctorStatisticsProps) {
  return (
    <div>{user.name} İstatistikleri</div>
  )
}

export default DoctorStatistics