import { BASE_SERVER_URL } from "@/api/api";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
}

const fallbackImage = 'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp'

const Image = ({ src, alt, ...props }: ImageProps) => {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackImage
  }

  const completeSrc = `${BASE_SERVER_URL}/media/${src}`
  const encodedSrc = encodeURI(completeSrc)

  return (
    <img
      src={encodedSrc}
      alt={alt}
      {...props}
      onError={handleError}
    />
  )
}

export default Image