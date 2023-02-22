import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { getCount, increaseCount } from "../features/posts/postsSlice"

const Header = () => {
    const dispatch = useDispatch()
    const count = useSelector(getCount)

    return (
        <header className="header">
            <h1>Redux blog</h1>
            <nav>
                <ul>
                    <li><Link to={'/'}>Home</Link></li>
                    <li><Link to={'/user'}>Users</Link></li>
                    <li><Link to={'post'}>Post</Link></li>
                    <button onClick={() => dispatch(increaseCount())}>{count}</button>
                </ul>
            </nav>
        </header>
    )
}

export default Header