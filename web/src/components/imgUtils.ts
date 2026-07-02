import type { Media } from 'cms/src/payload-types'

export type ImageSize = keyof NonNullable<Media['sizes']> | 'original'
export type RawFileSize = NonNullable<Media['sizes']>[keyof NonNullable<Media['sizes']>]
export type ValidatedFileSize = {
  fileName: string
  url: string
  width: number | undefined
  height: number | undefined
}

/** Converts a raw file size from the CMS to a validate file size or returns undefined if the file size is not valid */
export function validateFileSize(size: RawFileSize): ValidatedFileSize | undefined {
  if (!size?.url || !size?.filename) {
    return undefined
  }

  return {
    fileName: size.filename,
    url: size.url,
    width: size.width ?? undefined,
    height: size.height ?? undefined,
  }
}

/** Returns the validated file size for the given image and size */
export function getFileSize(size: ImageSize, image: Media): ValidatedFileSize {
  // fall back to the original file size
  let fileSize: ValidatedFileSize | undefined = validateFileSize(image)

  // pick a specific file size
  if (size !== 'original') {
    fileSize = validateFileSize(image.sizes?.[size])

    if (!fileSize) {
      fileSize = validateFileSize(image)
    }
  }

  // if the file size is not valid, fall back to the original file size
  if (!fileSize) {
    throw new Error(
      `File size ${size} not found in image: {id: ${image.id}, filename: ${image.filename}}`,
    )
  }

  return fileSize
}
