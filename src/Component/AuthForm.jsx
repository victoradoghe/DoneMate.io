import { useState } from "react"
import { supabase } from "../supabaseClient"
import {IonCheckmarkDoneCircleOutline} from "./FaviconIcon"

export default function AuthForm() {
  const [Email, SetEmail] = useState("")
  const [Password, SetPassword] = useState("")
  const [IsLogin, SetIsLogin] = useState(true)
  const [Error, SetError] = useState(null)

  const HandleSubmit = async (e) => {
    e.preventDefault()
    SetError(null)

    if (IsLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email: Email,
        password: Password,
      })
      if (error) SetError(error.message)
    } else {
      const { error } = await supabase.auth.signUp({
        email: Email,
        password: Password,
      })
      if (error) SetError(error.message)
    }
  }

  return (
    <div className="auth-form">
        <IonCheckmarkDoneCircleOutline className="svgone" width={30} height={30}/>
      <h2>{IsLogin ? "Login" : "Sign-up"}</h2>
      <form onSubmit={HandleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={Email}
          onChange={(e) => SetEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={Password}
          onChange={(e) => SetPassword(e.target.value)}
        />
        <button type="submit">{IsLogin ? "Login" : "Sign-up"}</button>

        {Error && <p className="error">{Error}</p>}

        <p>
          {IsLogin ? "Don't have an account?" : "Already have an account?"}
        </p>
        <button type="button" onClick={() => SetIsLogin(!IsLogin)}>
          {IsLogin ? "Sign-up" : "Login"}
        </button>
      </form>
    </div>
  )
}
