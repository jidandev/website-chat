/* eslint-disable react/prop-types */
// const Button = ({classname = "bg-black", children = "...", onclick = () => {}, type = "button", someProp = "" }) => {
//     return (
//       <button onClick={() => onclick(someProp)} className={`h-10 px-6 font-semibold rounded-md ${classname} text-white`} type={type}>
//         {children}</button>
//     )
// }

function Button({ classname = "bg-black", onClick = () => {}, children = "...", type = "button"}) {
  return (
    <button onClick={onClick} className={`h-10 px-6 font-semibold rounded-md ${classname} text-white`} type={type}>
      {children}
    </button>
  );
}

export default Button