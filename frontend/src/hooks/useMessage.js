import { useState } from "react";

const messageDefault = {ok: false, text: "", header: ""}

export function useMessage() {
    const [message, setMessage] = useState(messageDefault)

    const messageStyles = (message.ok 
        ? {color: 'hsl(113, 100%, 50%)', textAlign: 'center'}
        : {color: 'hsl(9, 100%, 69%)', textAlign: 'center'}
    )
    
    const resetMessage = _ => setMessage(messageDefault)
    return { message, setMessage, messageStyles, resetMessage }
}