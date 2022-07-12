import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function RecoveryPassword(){

    const navigate = useNavigate()

    function validate(input) {
        let error = '';
    
        if (!input.mail){
            error = "An email is require"
        } else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(input.mail)){
            error = "The email is invalid";
        }else{
            error=''
        }  
    
        
        return error;
      }

    const [input, setInput] = useState({
        mail: ""
      });

    const [error, setError] = useState('')
    const [msg, setMsg] = useState('')

    function handleChange(e){
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });

        setError(
            validate({
              ...input,
              [e.target.name]: e.target.value,
            })
          );
    }

    async function onSubmit(e){
        e.preventDefault()
        if(error.length || !input.mail){
            setMsg(error)
        }else{
            
            let info = await axios.post(`/authentication/recovery_password`, input)
            // .then(data => {
            //     console.log(data)
            // })
            // .catch(err => console.log(err))
            setInput({
                mail: ""
            })
            if(info.data === 'No se encontro el usuario'){
                setMsg(info.data)
            }else{
                setMsg('')
                navigate(`/recoverPass/${info.data}`)
            }
        }
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <label>
                    Ingrese su correo electronico:
                </label>
                <input
                    name='mail'
                    value={input.mail}
                    onChange={handleChange}
                    placeholder="ejemplo@gmail.com"
                />

                <input type='submit' />
                {msg && msg}
            </form>
        </div>
    )
}