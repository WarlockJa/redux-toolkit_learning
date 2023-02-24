import { IPost, selectPostById } from './postsSlice'
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

interface IPostExcerpt {
    ({ postId }: { postId: number }): JSX.Element
}

const PostsExcerpt: IPostExcerpt = ({ postId }) => {
    const post = useSelector<RootState>(state => selectPostById(state, postId)) as IPost

    return (
        <article>
            <h2>{post.title}</h2>
            <p className='excerpt'>{post.body.substring(0,75)}...</p>
            <p className="postCredit">
                <Link to={`post/${post.id}`}>View Post</Link>
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.postDate} />
            </p>
            <ReactionButtons post={post} />
        </article>
    )
}

export default PostsExcerpt