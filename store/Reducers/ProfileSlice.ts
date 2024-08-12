
import {createSlice , createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"




export const Fetch = createAsyncThunk('url' , async ()=>{
    try {
        const response  = await axios.get("" , )
        return [response.data]

        
    } catch (err) {
        return err
        
    }
}) 



const ProfileSlice = createSlice({
    name :"profile" ,
    initialState  :{} ,
    reducers:{

    } ,
    extraReducers(builder) {
        builder.addCase(Fetch.pending , (state , action) => {
            state.status = 'loading'
            })
            .addCase(Fetch.fulfilled , (state , action)=>{
                state.status = 'succeeded'
                const LoadedProfile  = action.payload
                return LoadedProfile
            })
            .addCase(Fetch.rejected , (state , action) => {
                state.status = 'failed'
                state.error = action.error
                })


    },

})

export const selectProfile = (state)=>state.

