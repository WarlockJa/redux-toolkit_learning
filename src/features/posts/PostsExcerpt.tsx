import { PostType } from './postsSlice'
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";

const PostsExcerpt = ({ post }: { post: PostType }) => {
    return (
        <article>
            <h3>{post.title}</h3>
            <p>{post.body.substring(0,100)}</p>
            <p className="postCredit">
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.postDate} />
                <ReactionButtons post={post} />
            </p>
        </article>
    )
}

export default PostsExcerpt