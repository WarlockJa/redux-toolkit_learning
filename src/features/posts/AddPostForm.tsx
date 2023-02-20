import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { addNewPost } from "./postsSlice"
import { selectAllUsers } from "../users/usersSlice"
import { AppDispatch } from "../../app/store"

const AddPostForm = () => {
    const dispatch = useDispatch<AppDispatch>()

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [userId, setUserId] = useState('')
    const [addRequestStatus, setAddRequestStatus] = useState('idle')

    const users = useSelector(selectAllUsers)
    
    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
    const onContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)
    const onAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => setUserId(e.target.value)

    const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle'

    const onSavePostClicked = () => {
        if (canSave) {
            try {
                setAddRequestStatus('pending')
                dispatch(addNewPost({ title, body: content, userId })).unwrap()

                setTitle('')
                setContent('')
                setUserId('')
            } catch (error) {
                if (error instanceof Error) console.error(error.message)
            } finally {
                setAddRequestStatus('idle')
            }
        }
    }

    const usersOptions = users.map((user) => 
        <option key={user.id} value={user.id}>{user.name}</option>
    )

    return (
        <section>
            <h2>Add a new post</h2>
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
            </form>
        </section>
    )
}

export default AddPostForm