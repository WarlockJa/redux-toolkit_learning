import { createSlice, createAsyncThunk, createSelector, createEntityAdapter, AnyAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from 'axios'
import { sub } from "date-fns";

const POSTS_URL = 'http://jsonplaceholder.typicode.com/posts'

interface PreparePropsType {
    title: string;
    body: string;
    userId: number;
}

export interface PostType extends PreparePropsType {
    id: number;
    postDate: string;
    reactions: {
        [thumbsUp: string]: number;
        wow: number;
        heart: number;
        rocket: number;
        coffee: number;
    }
}

export interface UpdatePostType extends PreparePropsType {
    id: number;
    reactions: {
        [thumbsUp: string]: number;
        wow: number;
        heart: number;
        rocket: number;
        coffee: number;
    }
}

type PrepareReturnType = {
    payload: PostType
}

type FetchPayloadType = {
    payload: PostType[]
}

type DeleteActionType = {
    payload: {
        id: number
    }
}

const postsAdapter = createEntityAdapter<PostType>({
    sortComparer: (a, b) => b.postDate.localeCompare(a.postDate)
})

const initialState = postsAdapter.getInitialState(
{
    status: 'idle',
    error: '',
    count: 0
})

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await axios.get(POSTS_URL)
    return response.data
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost: { title: string, body: string, userId: number }) => {
    const response = await axios.post(POSTS_URL, initialPost)
    return response.data
})

export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost: UpdatePostType) => {
    const { id } = initialPost
    try {
        const response = await axios.put(`${POSTS_URL}/${id}`, initialPost)
        return response.data
    } catch (error) {
        return initialPost // only for testing Redux
    }
})

export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost: { id: number }) => {
    const { id } = initialPost
    const response = await axios.delete(`${POSTS_URL}/${id}`)
    return response?.status === 200 ? initialPost : `${response?.status} ${response?.statusText}`
})

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reactionAdded(state, action: { payload: { postId: number, reaction: string }}) {
            const { postId, reaction } = action.payload
            const existingPost = state.entities[postId]
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
        increaseCount(state) {
            state.count++
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action: FetchPayloadType) => {
                state.status = 'succeded'
                // adding date and reactions
                let min = 1
                const loadedPosts = action.payload.map(post => {
                    post.postDate = sub(new Date(), { minutes: min++ }).toISOString()
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post
                })
                // add fetched posts to the array
                postsAdapter.upsertMany(state, loadedPosts)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                if(action.error.message) state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, (state, action: PrepareReturnType) => {
                action.payload.userId = Number(action.payload.userId)
                action.payload.postDate = new Date().toISOString()
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }

                postsAdapter.addOne(state, action.payload)
            })
            .addCase(updatePost.fulfilled, (state, action: PrepareReturnType) => {
                if(!action.payload?.id) {
                    console.log('Update could not complete')
                    console.log(action.payload)
                    return
                }
                action.payload.postDate = new Date().toISOString()
                postsAdapter.upsertOne(state, action.payload)
            })
            .addCase(deletePost.fulfilled, (state, action: AnyAction) => { // TODO: figure out why DeleteActionType is not accepted
                if(!action.payload?.id) {
                    console.log('Cannot delete, post not found')
                    console.log(action.payload)
                    return
                }
                const { id } = action.payload

                postsAdapter.removeOne(state, id)
            })
    }
})

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
} = postsAdapter.getSelectors<RootState>(state => state.posts)

export const getPostsStatus = (state: RootState) => state.posts.status
export const getPostsError = (state: RootState) => state.posts.error
export const getCount = (state: RootState) => state.posts.count

export const postsByUser = createSelector([selectAllPosts, (state: RootState, userId: number) => userId], (posts, userId) => posts.filter(post => post.userId === userId))

export const { reactionAdded, increaseCount } = postSlice.actions

export default postSlice.reducer