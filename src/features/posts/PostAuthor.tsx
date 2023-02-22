import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectAllUsers } from "../users/usersSlice";

const PostAuthor = ({ userId }: { userId: number }) => {
    const users = useSelector(selectAllUsers)
    const author = users.find(user => user.id === userId)

    // return <span>&nbsp; by {author ? author.name : 'Unknown author'}</span>
    return <Link to={`/user/${userId}`}><span>&nbsp; by {author ? author.name : 'Unknown author'}</span></Link>
}

export default PostAuthor