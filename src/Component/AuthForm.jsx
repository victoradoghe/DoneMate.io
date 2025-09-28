import { useState } from "react"
import { supabase } from "../supabaseClient"
import { IonCheckmarkDoneCircleOutline } from "./FaviconIcon"
import { MaterialIconThemeGoogle } from "./Googleicon"
import { CarbonView } from "./Viewicon"
import { CarbonViewOff } from "./Hideicon"

function AuthForm() {
  const [Email, SetEmail] = useState("")
  const [Password, SetPassword] = useState("")
  const [IsLogin, SetIsLogin] = useState(true)
  const [Error, SetError] = useState(null)
  const [Message, setMessage] = useState(null)
  const [ShowPassword, SetShowPassword] = useState(false)
  const [FirstName, SetFirstName] = useState("")
  const [SureName, SetSureName] = useState("")

  const HandleSubmit = async (e) => {
    e.preventDefault()
    SetError(null)
    setMessage(null)

    if (IsLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email: Email,
        password: Password,
      })
      if (error) {
        SetError(error.message)
      } else {
        setMessage("Login successful 🎉")
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email: Email,
        password: Password,
        options: {
          data: {
            firstName: FirstName,
            surname: SureName,
          },
        },
      })
      if (error) {
        SetError(error.message)
      } else {
        setMessage("Sign-up successful! Please check your email to confirm ✅")
      }
    }
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: {
      redirectTo: window.location.origin,
    },
   })
    if (error) {
      SetError(error.message)
    } else {
      setMessage("Redirecting to Google...")
    }
  }

  const toggleShowPassword = () => SetShowPassword((s) => !s)

  return (
    <div className="auth-container">
      <div className="auth-card">
        <IonCheckmarkDoneCircleOutline className="auth-icon" width={40} height={40} />
        <h2 className="auth-title">{IsLogin ? "Login" : "Sign Up"}</h2>

        <form onSubmit={HandleSubmit} className="auth-form" noValidate>
          {!IsLogin && (
            <>
             <input type="text" className="auth-input" placeholder="Enter your first name" value={FirstName} onChange={(e) => SetFirstName(e.target.value)} required/>
             <input type="text" className="auth-input" placeholder="Enter your sure name" value={SureName} onChange={(e) => SetSureName(e.target.value)} required/>
            </>
          )}
          
          <input
            type="email"
            placeholder="Enter your email"
            value={Email}
            onChange={(e) => SetEmail(e.target.value)}
            className="auth-input"
            aria-label="Email"
            required
          />

          {/* password + icon wrapper */}
          <div className="auth-password-wrapper" style={{ width: "100%" }}>
            <input
              type={ShowPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={Password}
              onChange={(e) => SetPassword(e.target.value)}
              className="auth-input auth-input-password"
              aria-label="Password"
              required
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={toggleShowPassword}
              aria-label={ShowPassword ? "Hide password" : "Show password"}
              aria-pressed={ShowPassword}
            >
              {ShowPassword ? <CarbonViewOff /> : <CarbonView />}
            </button>
          </div>

          <button type="submit" className="auth-btn primary">
            {IsLogin ? "Login" : "Sign Up"}
          </button>

          {Error && <p className="auth-error">{Error}</p>}
          {Message && <p className="auth-success">{Message}</p>}
        </form>

        <p className="auth-toggle-text">
          {IsLogin ? "Don’t have an account?" : "Already have an account?"}
        </p>
        <button type="button" onClick={() => SetIsLogin(!IsLogin)} className="auth-btn secondary">
          {IsLogin ? "Sign Up" : "Login"}
        </button>

        <div className="auth-divider">or</div>

        <button type="button" onClick={handleGoogleLogin} className="auth-btn google">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <MaterialIconThemeGoogle className="google-btn" /> Continue with Google
          </span>
        </button>
      </div>
    </div>
  )
}

export default AuthForm
