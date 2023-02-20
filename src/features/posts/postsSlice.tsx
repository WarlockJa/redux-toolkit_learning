import { createSlice, nanoid } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { sub } from 'date-fns'

const initialState: PostType[] = [
    {
        id: '1',
        title: 'Learning Redux Toolkit',
        content: "I've heard good things.",
        userId: '2',
        postDate: sub(new Date(), { minutes: 10 }).toISOString(),
        reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
        }
    },
    {
        id: '2',
        title: 'Slices...',
        content: "The more I say slice, the more I want pizza.",
        userId: '2',
        postDate: sub(new Date(), { minutes: 5 }).toISOString(),
        reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
        }
    }
]

interface PreparePropsType {
    title: string;
    content: string;
    userId: string;
}

export interface PostType extends PreparePropsType {
    id: string;
    postDate: string;
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

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) {
                state.push(action.payload)
            },
            prepare({ title, content, userId }: PreparePropsType): PrepareReturnType {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        content,
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
            const { postId, reaction } = action.payload as { postId: string, reaction: string }
            const existingPost = state.find(post => post.id === postId)
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        }
    }
})

export const selectAllPosts = (state: RootState) => state.posts

export const { postAdded, reactionAdded } = postSlice.actions

export default postSlice.reducer