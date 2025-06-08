import { useState, useMemo, useEffect, useCallback } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { GetUsers, DeleteUser, RoleChange } from "@/api/userApi"
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { Spinner } from '../ui/Spinner'

export function ManageUsers() {
    const [users, setUsers] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('All')
    const [sortBy, setSortBy] = useState('name')
    const [sortOrder, setSortOrder] = useState('asc')
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, userId: '', newRole: '' })
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, userId: '' })
    const [loading, setLoading] = useState(true)

    const handleDeleteUser = async (userId) => {
        try {
            await DeleteUser(userId)
            const updatedUsers = users.filter((user) => user.id !== userId)
            setUsers(updatedUsers)
            toast.success('User deleted successfully')
        } catch (err) {
            console.error('Error in deleting the user', err)
            toast.error('Failed to delete user. Please try again.')
        } finally {
            setDeleteDialog({ isOpen: false, userId: '' })
        }
    }

    useEffect(() => {
        setLoading(true)
        GetUsers().then((data) => {
            if (data) {
                setUsers(data.users)
            } else {
                setUsers([])
            }
            setLoading(false)
        }).catch((err) => {
            console.log("Failed to load users: ", err);
            setLoading(false)
        })
    }, [])

    const handleRoleChange = useCallback((userId, newRole) => {
        setConfirmDialog({ isOpen: true, userId, newRole })
    }, [])

    const confirmRoleChange = async () => {
        const { userId, newRole } = confirmDialog
        try {
            await RoleChange(userId, newRole);
            setUsers(prevUsers => prevUsers.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            ))
            toast.success('User role updated successfully')
        } catch (error) {
            console.error('Failed to update user role:', error)
            toast.error('Failed to update user role. Please try again.')
        } finally {
            setConfirmDialog({ isOpen: false, userId: '', newRole: '' })
        }
    }

    const filteredAndSortedUsers = useMemo(() => {
        return [...users]
            .filter(user =>
                (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (roleFilter === 'All' || user.role.toLowerCase() === roleFilter.toLowerCase())
            )
            .sort((a, b) => {
                if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1
                if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1
                return 0
            })
    }, [users, searchTerm, roleFilter, sortBy, sortOrder])

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Manage Users</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-4 mb-6">
                    <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="sm:w-[300px] grow"
                    />
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-[180px] grow">
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Roles</SelectItem>
                            <SelectItem value="User">User</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Organiser">Organiser</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                        <SelectTrigger className="w-[180px] grow">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="problemsSolved">Problems Solved</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                        {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    </Button>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center">
                                        <Spinner />
                                    </TableCell>
                                </TableRow>
                            ) :
                                (filteredAndSortedUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell className='flex flex-row gap-2 items-center'>
                                            <Select
                                                defaultValue={user.role}
                                                onValueChange={(value) => handleRoleChange(user.id, value)}
                                            >
                                                <SelectTrigger className="w-[80px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="User">User&nbsp;</SelectItem>
                                                    <SelectItem value="Admin">Admin&nbsp;</SelectItem>
                                                    <SelectItem value="Organiser">Organiser&nbsp;</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button className='hover:text-red-500' variant="outline" size='icon'>
                                                <Trash2
                                                    className="h-4 w-4"
                                                    onClick={() => setDeleteDialog({ isOpen: true, userId: user.id })}
                                                />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
            <AlertDialog open={confirmDialog.isOpen} onOpenChange={(isOpen) => setConfirmDialog({ ...confirmDialog, isOpen })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to change this user's role to {confirmDialog.newRole}?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmRoleChange}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialog.isOpen} onOpenChange={(isOpen) => setDeleteDialog({ ...deleteDialog, isOpen })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this user? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteUser(deleteDialog.userId)}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    )
}
