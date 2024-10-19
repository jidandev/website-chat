
const InputBar = ({setSelectedImage, imgUrl, setImgUrl, message, setMessage, sendMessage}) => {
    return(
    <div className='flex fixed bottom-0 items-center justify-center bg-gray-900 w-full h-16 z-10 '>
        <button className='mr-2 overflow-hidden relative rounded-full bg-blue-600 w-9 h-9 md:w-10 md:h-10 ml-2 text-white text-xl px-[0.5rem] md:px-[0.7rem] py-[0.4rem] md:py-2'>
            <ion-icon name="folder"></ion-icon>
            <input type="file" className='w-full h-full absolute left-0 top-0 opacity-0 cursor-pointer' onChange={(e) => setSelectedImage(e.target.files[0])}/>
        </button>
        <div className='w-64 h-10 md:h-12 sm:w-1/2 rounded-lg relative'>
            {imgUrl && (
            <div onClick={() => {setSelectedImage(null); setImgUrl(null);}} className='rounded group h-20 w-20 absolute left-0 -top-24 bg-black'>
                <img alt='uploaded' src={imgUrl} className='object-cover h-full w-full absolute left-0 top-0 opacity-100 group-hover:opacity-80'></img>
                <div className='text-white p-6 text-3xl opacity-0 group-hover:opacity-100 transition-all duration-200  w-full h-full'>
                <ion-icon name="trash"></ion-icon>
                </div>
            </div>
            )}
            <textarea
                type="text"
                value={message}
            
                onChange={(e) => setMessage(e.target.value)}
                className='bg-gray-700 border-0 w-full h-full rounded-lg text-white p-2 md:p-3'
                placeholder="Type your message..."
            />
        </div>
        <button onClick={() => {sendMessage(); }} className='rounded-full bg-blue-600 w-9 h-9 md:w-10 md:h-10 ml-2 text-white text-xl px-[0.6rem] md:px-[0.7rem] py-[0.4rem] md:py-2' src='/vite.svg'>
          <ion-icon name="send"></ion-icon>
        </button>
      </div>
    )
}

export default InputBar;