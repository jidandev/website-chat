/* eslint-disable react/prop-types */
import Label from "./Label";
import Input from "./Input";

const InputForm = ({type, name, label, placeholder}) => {
    return (
        <div className="mb-6">
            <Label type={type} name={name}>{label}</Label>
            <Input type={type} name={name} placeholder={placeholder} />
        </div>
    )
}

export default InputForm;