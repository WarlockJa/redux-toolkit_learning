import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../../app/store"
import { increment, decrement, reset, incrementByAmount } from "./counterSlice"

export const Counter = () => {
    const count = useSelector((state: RootState) => state.counter.count)
    const [amountToAdd, setAmountToAdd] = useState(0)
    const dispatch = useDispatch()
    return (
        <section>
            <p>{count}</p>
            <div>
                <button onClick={() => dispatch(decrement())}>-</button>
                <button onClick={() => dispatch(increment())}>+</button>
            </div>
            <button onClick={() => dispatch(reset())}>Reset</button>
            <div>
                <input type="number" value={amountToAdd} onChange={(e) => setAmountToAdd(Number(e.target.value))} />
                <button onClick={() => dispatch(incrementByAmount(amountToAdd))}>Add {amountToAdd}</button>
            </div>
        </section>
    )
}

export default Counter