import Image from 'next/image';

interface CustomImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function CustomImage({ src, alt, className, width = 400, height = 300 }: CustomImageProps) {
  if (src.startsWith('data:')) {
    // For base64 images, use regular img tag
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}