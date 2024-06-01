//Imports
import React, { useState } from 'react';


//Componentes
function Contador(){
    let [cont, setCont] = useState(0)

    function decrementar(){
        setCont(cont-1)
        console.log(cont)
    }

    function incrementar(){
        setCont(cont+1)
        console.log(cont)
    }
    return(
        <>
        <div>
            <p>Valor: {cont}</p>
            <button onClick={decrementar}>-</button>
            <button onClick={incrementar}>+</button>
        </div>

        </>
    )
}


//Exports
export default Contador