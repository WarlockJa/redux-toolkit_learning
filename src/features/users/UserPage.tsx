import { useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom"
import { RootState } from "../../app/store"
import { postsByUser } from "../posts/postsSlice"
import { selectUserById } from "./usersSlice"

const UserPage = () => {
    const { userId } = useParams()

    const user = useSelector((state: RootState) => selectUserById(state, Number(userId)))

    if (!user) {
        return (
            <section>
                <h2>User not found!</h2>
            </section>
        )
    }

    const postsForUser = useSelector((state: RootState) => postsByUser(state, Number(userId)))

    if (!postsForUser) {
        return (
            <section>
                <h2>No posts found</h2>
            </section>
        )
    }

    const postTitles = postsForUser.map(post => (
        <li key={post.id}>
            <Link to={`/post/${post.id}`}>{post.title}</Link>
        </li>
    ))

    return (
        <section>
            <h2>{user.name}</h2>
            <ol>{postTitles}</ol>
        </section>
    )
}

export default UserPage