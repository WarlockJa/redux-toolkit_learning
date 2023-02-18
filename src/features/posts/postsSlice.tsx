import { createSlice, nanoid } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

const initialState = [
    // {
    //     id: '1',
    //     title: 'Learning Redux Toolkit',
    //     content: "I've heard good things.",
    //     date: sub(new Date(), { minutes: 10 }).toISOString(),
    //     reactions: {
    //         thumbsUp: 0,
    //         wow: 0,
    //         heart: 0,
    //         rocket: 0,
    //         coffee: 0
    //     }
    // },
    // {
    //     id: '2',
    //     title: 'Slices...',
    //     content: "The more I say slice, the more I want pizza.",
    //     date: sub(new Date(), { minutes: 5 }).toISOString(),
    //     reactions: {
    //         thumbsUp: 0,
    //         wow: 0,
    //         heart: 0,
    //         rocket: 0,
    //         coffee: 0
    //     }
    // }
    {
        id: '1',
        title: 'Learning Redux Toolkit',
        content: "I've heard good things.",
    },
    {
        id: '2',
        title: 'Slices...',
        content: "The more I say slice, the more I want pizza.",
    }
    
]

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) {
                state.push(action.payload)
            },
            prepare(title: string, content: string) {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        content
                    }
                }
            }
        }
    }
})

export const selectAllPosts = (state: RootState) => state.posts

export const { postAdded } = postSlice.actions

export default postSlice.reducer