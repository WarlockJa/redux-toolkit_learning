import { useDispatch, useSelector } from "react-redux";
import { deletePost, PostType, selectPostById, updatePost } from "./postsSlice";

import { AppDispatch, RootState } from "../../app/store";

import { useNavigate, useParams } from "react-router-dom";
import { selectAllUsers } from "../users/usersSlice";
import { useState } from "react";

const EditPostForm = () => {
    const { postId } = useParams()
    const navigate = useNavigate()

    const post = useSelector<RootState>((state) => selectPostById(state, Number(postId))) as PostType | undefined
    const users = useSelector(selectAllUsers)
    
    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }

    const [title, setTitle] = useState(post.title)
    const [content, setContent] = useState(post.body)
    const [userId, setUserId] = useState(post.userId)
    const [requestStatus, setRequestStatus] = useState('idle')
    
    const dispatch = useDispatch<AppDispatch>()

    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
    const onContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)
    const onAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => setUserId(Number(e.target.value))

    const canSave = [title, content, userId].every(Boolean) && requestStatus === 'idle'

    const onSavePostClicked = () => {
        if (canSave) {
            try {
                setRequestStatus('pending')
                dispatch(updatePost({ id: post.id, title, body: content, userId, reactions: post.reactions })).unwrap()

                setTitle('')
                setContent('')
                setUserId(0)
                navigate(`/post/${post.id}`)
            } catch (error) {
                if (error instanceof Error) console.error('Failed to save the post: ',error.message)
            } finally {
                setRequestStatus('idle')
            }
        }
    }

    const onDeletePostClicked = () => {
        if(canSave) {
            try {
                setRequestStatus('pending')
                dispatch(deletePost({ id: post.id })).unwrap()

                setTitle('')
                setContent('')
                setUserId(0)
                navigate('/')
            } catch (error) {
                if(error instanceof Error) console.log(error.message)
            } finally {
                setRequestStatus('idle')
            }
        }
    }

    const usersOptions = users.map((user) => 
        <option key={user.id} value={user.id}>{user.name}</option>
    )

    return (
        <section>
            <h2>Edit Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChange}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChange}>
                    <>
                        <option value=""></option>
                        {usersOptions}
                    </>
                </select>
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChange}
                />
                <button
                    type="button"
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >Save Post</button>
                <button
                    className="deleteButton"
                    type="button"
                    onClick={onDeletePostClicked}
                    disabled={!canSave}
                >Delete Post</button>
            </form>
        </section>
    )
}

export default EditPostForm