'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { FaPlus } from 'react-icons/fa'

import { Role } from '@/helper/enums'
import { RootState } from '@/redux'
import useDebounce from '@/hooks/useDebounce'
import { updateSeachParams } from '@/helper/logics'

export default function TopBar() {
  const { user } = useSelector((state: RootState) => state.auth)
  const router = useRouter()
  const seachParams = useSearchParams()
  const searchQuery = seachParams.get('search') || ''
  const [search, setSearch] = useState(searchQuery)
  const searchDebounced = useDebounce(search)

  useEffect(() => {
    if (searchDebounced !== searchQuery)
      router.replace(
        updateSeachParams({
          search: searchDebounced,
        }),
      )
  }, [searchDebounced])

  return (
    <div className="grid grid-cols-4 gap-5">
      <Input
        color="primary"
        label="Search"
        placeholder="Name/Email"
        size="sm"
        value={search}
        variant="bordered"
        onChange={(e) => setSearch(e.target.value)}
      />
      {user?.role === Role.ADMIN && (
        <Button color="primary" endContent={<FaPlus />} size="lg" onClick={() => router.push('/teacher/create')}>
          Create
        </Button>
      )}
    </div>
  )
}
