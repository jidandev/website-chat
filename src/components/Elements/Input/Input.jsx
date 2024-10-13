const Input = ({type, placeholder, name}) => {
    return (
        <input className="text-sm border rounded 2-full py-2 px-3 text-slate-600 w-full" type={type} name={name} id={name} placeholder={placeholder}/>
    )
}

export default Input;