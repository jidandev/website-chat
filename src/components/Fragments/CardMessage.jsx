
const CardMessage = ({children}) => {
    return (
        <div className='mt-4 ' >
            {children}
        </div>
    )
};

const Image = () => {
    return (
        <img className='rounded-full bg-white w-8 h-8 float-left mt-0 mr-2 ' src='/vite.svg'></img>
    )
}

const Header = ({msgUser, username, admins = [],handleDelete, id}) => {
    return (
        <div className='flex mt-2'>
            <h1 className={` font-medium  ${msgUser == username ? "text-blue-600" : "text-slate-200"} text-md md:font-bold md:text-xl`}>{msgUser} {admins.includes(msgUser) ? <span className=' text-blue-600'><ion-icon name="checkmark-circle"></ion-icon></span>: ""}</h1>
            {msgUser == username && <h1 className='mt-1 cursor-pointer' onClick={() => handleDelete(id)}><ion-icon name="trash"></ion-icon></h1>}
                    
        </div>
    )
}

const Body = ({text, image}) => {
    return (
        <>
        <pre className='break-words -mt-1  text-slate-300 text-md md:text-xl text-left ml-10 whitespace-pre-wrap font-sans'>{text}</pre>
        {image && image !== "" && <img src={image} alt="uploaded" className="w-64 h-auto ml-10 mt-1 object-cover" />}
        </>
    )
}

CardMessage.Image = Image;
CardMessage.Header = Header;
CardMessage.Body = Body;

export default CardMessage;