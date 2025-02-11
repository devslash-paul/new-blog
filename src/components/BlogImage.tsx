import Image from 'next/image'

interface BlogImageProps {
  src: string
  alt: string
}

export function BlogImage({ src, alt }: BlogImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  )
} 