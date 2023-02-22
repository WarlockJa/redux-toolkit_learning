import { useSelector } from "react-redux";
import { selectAllPosts, getPostsStatus, getPostsError, fetchPosts } from "./postsSlice";
import PostsExcerpt from "./PostsExcerpt";

const PostsList = () => {
    const posts = useSelector(selectAllPosts)
    const postsStatus = useSelector(getPostsStatus)
    const postsError = useSelector(getPostsError)
    
    let content: JSX.Element | JSX.Element[] = <p></p>
    if (postsStatus === 'loading') {
        content = <p>Loading...</p>
    } else if (postsStatus === 'succeded') {
        const orderedPosts = posts.slice().sort((a,b) => b.postDate.localeCompare(a.postDate))
        content = orderedPosts.map(post => <PostsExcerpt key={post.id} post={post} />)
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