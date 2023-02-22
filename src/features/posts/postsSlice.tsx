import { createSlice, nanoid, createAsyncThunk, AnyAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from 'axios'
import { sub } from "date-fns";

const POSTS_URL = 'http://jsonplaceholder.typicode.com/posts'

interface AsyncInitialState {
    posts: PostType[],
    status: 'idle' | 'loading' | 'succeded' | 'failed',
    error: string | undefined
}

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

export interface updatePostType extends PreparePropsType {
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
    payload?: {
        id: number
    }
}

const initialState: AsyncInitialState = 
{
    posts: [],
    status: 'idle',
    error: undefined
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await axios.get(POSTS_URL)
    return response.data
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost: { title: string, body: string, userId: number }) => {
    const response = await axios.post(POSTS_URL, initialPost)
    return response.data
})

export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost: updatePostType) => {
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
        postAdded: {
            reducer(state, action: PrepareReturnType) {
                state.posts.push(action.payload)
            },
            prepare({ title, body, userId }: PreparePropsType) {
                return {
                    payload: {
                        id: Number(nanoid()),
                        title,
                        body,
                        userId,
                        postDate: new Date().toISOString(),
                        reactions: {
                            thumbsUp: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0
                        }
                    }
                }
            }
        },
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload as { postId: number, reaction: string }
            const existingPost = state.posts.find(post => post.id === postId)
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
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
                state.posts = state.posts.concat(loadedPosts)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, (state, action: PrepareReturnType) => {
                const sortedPosts = state.posts.sort((a, b) => {
                    if (a.id > b.id) return 1
                    if (a.id < b.id) return -1
                    return 0
                })

                // fix for the API id mismatch
                action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1

                action.payload.userId = Number(action.payload.userId)
                action.payload.postDate = new Date().toISOString()
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }

                state.posts.push(action.payload)
            })
            .addCase(updatePost.fulfilled, (state, action: PrepareReturnType) => {
                if(!action.payload?.id) {
                    console.log('Update could not complete')
                    console.log(action.payload)
                    return
                }
                const { id } = action.payload
                action.payload.postDate = new Date().toISOString()
                // const posts = state.posts.filter(post => post.id === id)
                // state.posts = [...posts, action.payload]
                state.posts = state.posts.map(post => post.id === id ? action.payload : post)
            })
            .addCase(deletePost.fulfilled, (state, action: any) => { // TODO: figure out why DeleteActionType is not accepted
                if(!action.payload?.id) {
                    console.log('Cannot delete, post not found')
                    console.log(action.payload)
                    return
                }
                const { id } = action.payload
                state.posts = state.posts.filter(post => post.id !== id)
            })
    }
})

export const selectAllPosts = (state: RootState) => state.posts.posts
export const getPostsStatus = (state: RootState) => state.posts.status
export const getPostsError = (state: RootState) => state.posts.error

export const selectPostById = (state: RootState, postId: number) => state.posts.posts.find(post => post.id === postId)

export const { postAdded, reactionAdded } = postSlice.actions

export default postSlice.reducer