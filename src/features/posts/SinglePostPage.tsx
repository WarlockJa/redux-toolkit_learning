import { useSelector } from "react-redux";
import { PostType, selectPostById } from "./postsSlice";

import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { RootState } from "../../app/store";

import { Link, useParams } from "react-router-dom";

const SinglePostPage = () => {
    // retrieve postId
    const { postId } = useParams()

    if (!postId) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }

    const post: PostType | undefined = useSelector((state: RootState) => selectPostById(state, Number(postId)))

    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }

    return (
        <article>
            <h3>{post.title}</h3>
            <p>{post.body.substring(0,100)}</p>
            <p className="postCredit">
                <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.postDate} />
            </p>
            <ReactionButtons post={post} />
        </article>
    )
}

export default SinglePostPage