import { useSelector } from "react-redux";
import { getPostsStatus, getPostsError, selectPostIds } from "./postsSlice";
import PostsExcerpt from "./PostsExcerpt";

const PostsList = () => {
    const orderedPostIds = useSelector(selectPostIds) as number[]
    const postsStatus = useSelector(getPostsStatus)
    const postsError = useSelector(getPostsError)
    
    let content: JSX.Element | JSX.Element[] = <p></p>
    if (postsStatus === 'loading') {
        content = <p>Loading...</p>
    } else if (postsStatus === 'succeded') {
        content = orderedPostIds.map(postId => <PostsExcerpt key={postId} postId={postId} />)
    } else if (postsStatus === 'failed') {
        content = <p>{postsError}</p>
    }

    return (
        <section>
            {content}
        </section>
    )
}

export default PostsList