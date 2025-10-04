import { UserTypes } from '@/lib/types/user/UserTypes';
import React from 'react'

interface CorporateStatisticsProps {
  user: UserTypes;
}

function CorporateStatistics({ user }: CorporateStatisticsProps) {
  return (
    <div>{user.name} İstatistikleri</div>
  )
}

export default CorporateStatistics