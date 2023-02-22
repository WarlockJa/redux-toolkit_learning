import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { selectAllUsers } from "./usersSlice"

const UsersList = () => {
    const users = useSelector(selectAllUsers)

    const usersOptions = users.map((user) =>
        <li key={user.id}>
            <Link to={`/user/${user.id}`}>{user.name}</Link>
        </li>
    )

    return (
        <section>
            <h2>Users List</h2>
            {usersOptions}
        </section>
    )
}

export default UsersList