import { BASE_SERVER_URL } from "@/api/api"
import { useState } from "react"
import { ImageOff } from 'lucide-react'
import { cn } from "@/lib/utils"

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string
  alt?: string
}

const Image = ({ src, alt, ...props }: ImageProps) => {
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    setHasError(true) 
  }

  const imageClass = cn(
    "object-cover",
    "bg-black bg-opacity-10 rounded-md",
    props.className
  )

  if (hasError) {
    return <ImageOff className={imageClass} opacity={0.3} />
  }

  const completeSrc = `${BASE_SERVER_URL}/${src}`
  const encodedSrc = encodeURI(completeSrc)

  return (
    <img
      src={encodedSrc}
      alt={alt}
      {...props}
      onError={handleError}
      className={imageClass}
    />
  )
}

export default Image
