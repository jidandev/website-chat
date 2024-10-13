/* eslint-disable react/prop-types */
const Label = ({name, children}) => {
    return (
        <label htmlFor={name} className="block font-bold text-slate-600 mb-2 text-sm">{children}</label>
    )
}

export default Label;