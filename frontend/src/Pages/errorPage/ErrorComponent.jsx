import errorImage from '../../../public/errorImage.png'

export function ErrorComponent(){

    return (
        <div className="h-screen flex flex-col justify-center items-center bg-gray-50">
            <img src={errorImage} />
            <h1 className="text-3xl">Error 404: Page not found</h1> 
            <h2 className="text-2xl text-gray-700"> The page You are looking from does not exist or other error occured</h2>
        </div>
    )
}