import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Avatar } from '@nextui-org/avatar'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Modal, ModalBody, ModalContent } from '@nextui-org/modal'
import { Spinner } from '@nextui-org/spinner'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table'
import { FaEye } from 'react-icons/fa'
import { API_URL } from '@/config/constants'
import { userClassEndpoint } from '@/config/endpoints'
import { updateSeachParams } from '@/helper/logics'
import useDebounce from '@/hooks/useDebounce'
import { useGet } from '@/hooks/useGet'
import { IClass, IUser } from '@/types'

const cols: { key: string; label: string }[] = [
  {
    key: 'no',
    label: 'No',
  },
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'code',
    label: 'Code',
  },
  {
    key: 'class',
    label: 'Class',
  },
  {
    key: 'action',
    label: '',
  },
]

export default function ListStudent() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const search = searchParams.get('search') || ''
  const [selectedStudent, setSelectedStudent] = useState<null | IUser>(null)
  const [inputSearch, setInputSearch] = useState(search)
  const searchDebounce = useDebounce(inputSearch)
  const router = useRouter()

  const { response, pending } = useGet<{ count: number; results: { user: IUser; class_instance: IClass }[] }>(
    {
      url: userClassEndpoint.BASE,
      config: {
        params: {
          search,
          class_id: id,
        },
      },
    },
    {
      deps: [search, id],
    },
  )

  useEffect(() => {
    router.replace(updateSeachParams({ search: searchDebounce }))
  }, [searchDebounce])

  return (
    <div className="mt-10">
      <div className="grid grid-cols-4 gap-5">
        <Input
          color="primary"
          label="Search"
          placeholder="Name/Email"
          size="sm"
          variant="bordered"
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
        />
      </div>
      <Table isStriped aria-label="Student-list" selectionMode="multiple" className="mt-4">
        <TableHeader columns={cols}>
          {(col) => (
            <TableColumn key={col.key} align="center">
              {col.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody loadingContent={<Spinner />} loadingState="idle" isLoading={pending}>
          {(response?.results || []).map((student, index) => (
            <TableRow key={student.user.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{student.user.full_name}</TableCell>
              <TableCell>{student.user.email}</TableCell>
              <TableCell>{student.user.code}</TableCell>
              <TableCell>{student.class_instance.name}</TableCell>
              <TableCell>
                <div className="flex justify-center gap-1">
                  <Button isIconOnly color="primary" variant="flat" onClick={() => setSelectedStudent(student.user)}>
                    <FaEye className="text-lg" />
                  </Button>
                  {/* <Button isIconOnly color="danger" variant="flat">
                    <MdOutlineDeleteForever className="text-lg" />
                  </Button> */}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        isOpen={!!selectedStudent}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedStudent(null)
        }}
      >
        <ModalContent>
          <ModalBody>
            <Avatar
              src={`${API_URL}/${selectedStudent?.avatar}`}
              name={selectedStudent?.full_name}
              className="mx-auto w-40 aspect-square h-40 text-4xl"
              showFallback
            />

            <div className="mt-4">
              <p className="text-4xl font-semibold text-center">{selectedStudent?.full_name}</p>
              <p className="mt-2">Email: {selectedStudent?.email}</p>
              <p className="mt-2">Student code: {selectedStudent?.code}</p>
              <p className="mt-1">Phone: {selectedStudent?.phone_number}</p>
              <p className="mt-1">Gender: {selectedStudent?.gender}</p>
              <p className="mt-1">Address: {selectedStudent?.address}</p>
              <p className="mt-1">DOB: {selectedStudent?.date_of_birth}</p>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}
