/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
const AuthLayouts = ({children, title, type}) => {
    return (
      <div className="flex justify-center min-h-screen items-center gap-2 bg-gray-900"> 
        <div className="w-full max-w-xs rounded-md shadow-lg shadow-white/50 py-5 px-8 backdrop-blur-md bg-white">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="font-medium text-slate-600 mb-5">Welcome, please enter your detail</p>
          {children}
          <p className="text-sm text-center mt-5">
            {type == "login" ? "Dont have an account?" : "Already have an account?"}

            {type == "login" &&
              <Link className="font-bold text-gray-900 ml-1" to="/register">Register</Link>
            }
            {type == "register" &&
              <Link className="font-bold text-gray-900 ml-1" to="/login">Login</Link>
            }
          </p>
          
        </div>
      </div>
    )
}

export default AuthLayouts;