import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CardComponent from './CardComponent'
import Image from 'next/image'

interface User {
    id: number
    name: string
    email: string
}

interface UserInsterfaceProps {
    backendName: string
}

const UserInsterface: React.FC<UserInsterfaceProps> = ({ backendName }) => {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
    const [users, setUsers] = useState<User[]>([])
    const [newUser, setNewUser] = useState({ name: "", email: "" })
    const [updateUser, setUpdateUser] = useState({ id: '', name: "", email: "" })

    const backgroundColors: { [key: string]: string } = {
        flask: 'bg-blue-500',
    }

    const buttonColors: { [key: string]: string } = {
        flask: 'bg-blue-700 hover:bg-blue-600',
    }

    const bgColor = backgroundColors[backendName as keyof typeof backgroundColors] || 'bg-gray-500'
    const btnColor = buttonColors[backendName as keyof typeof buttonColors] || 'bg-gray-700 hover:bg-gray-600'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/${backendName}/users`)
                setUsers(response.data.reverse())
            }
            catch (error) {
                console.error(error)
            }
        }

        fetchData()
    }, [backendName, apiUrl])

    const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${apiUrl}/api/${backendName}/users`, newUser)
            setUsers([response.data, ...users])
            setNewUser({ name: "", email: "" })
        } catch (error) {
            console.error(error)
        }
    }

    const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            await axios.put(`${apiUrl}/api/${backendName}/users/${updateUser.id}`, { name: updateUser.name, email: updateUser.email })
            setUpdateUser({ id: '', name: '', email: '' })
            setUsers(
                users.map((user) => {
                    if (user.id === parseInt(updateUser.id)) {
                        return { ...user, name: updateUser.name, email: updateUser.email };
                    }
                    return user;
                })
            );
        } catch (error) {
            console.error(error)
        }
    }

    const deleteUser = async (id: number) => {
        try {
            await axios.delete(`${apiUrl}/api/${backendName}/users/${id}`)
            setUsers(users.filter((user) => user.id !== id))
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className={`user-interface ${bgColor} ${backendName} w-full max-w-md p-6 mx-auto p-4 my-4 rounded shadow`}>
            <Image src={`/${backendName}.svg`} alt={`${backendName} logo`} className='w-20 h-20 mb-6 mx-auto' />
            <h2 className='text-xl font-bold text-center text-white mb-6'>{`${backendName.charAt(0).toUpperCase()}${backendName.slice(1)}`}</h2>

            {/* Create new user */}
            <form onSubmit={createUser} className='mb-6 p-4 bg-blue-100 rounded shadow'>
                <input
                    placeholder='Name'
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className='mb-2 w-full p-2 border border-gray-300 rounded'
                />
                <input
                    placeholder='Email'
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className='mb-2 w-full p-2 border border-gray-300 rounded'
                />
                <button
                    type='submit' className='w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600'
                >Add User</button>
            </form>


            {/* Update user */}
            <form onSubmit={handleUpdateUser} className='mb-6 p-4 bg-blue-100 rounded shadow'>
                <input
                    placeholder='User Id'
                    value={updateUser.id}
                    onChange={(e) => setUpdateUser({ ...updateUser, id: e.target.value })}
                    className='mb-2 w-full p-2 border border-gray-300 rounded'
                />
                <input
                    placeholder='Name'
                    value={updateUser.name}
                    onChange={(e) => setUpdateUser({ ...updateUser, name: e.target.value })}
                    className='mb-2 w-full p-2 border border-gray-300 rounded'
                />
                <input
                    placeholder='Email'
                    value={updateUser.email}
                    onChange={(e) => setUpdateUser({ ...updateUser, email: e.target.value })}
                    className='mb-2 w-full p-2 border border-gray-300 rounded'
                />
                <button
                    type='submit' className='w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600'
                >Update User</button>
            </form>


            {/* Display users */}
            <div className='space-y-4'>
                {
                    users.map((user) => (
                        <div key={user.id} className='flex items-center justify-between bg-white rounded-lg p-4'>
                            <CardComponent card={user} />
                            <button
                                onClick={() => deleteUser(user.id)}
                                className={`${btnColor} rounded px-4 py-2 mt-2 text-white`}
                            >Delete User</button>
                        </div>
                    ))
                }
            </div>



        </div>


    )

}

export default UserInsterface;