import { Options } from './types'
import { buildHtmlAsync } from './utilities/build-html-async/build-html-async'
import { copyImageFilesAsync } from './utilities/copy-image-files-async'
import { readMarkdownFilesAsync } from './utilities/read-markdown-files-async'
import { resolveNewImageFilePath } from './utilities/resolve-new-image-file-path'

const isUrl = require('is-url')

export async function buildAsync(
  globs: Array<string>,
  options: Options
): Promise<string> {
  const { files, images } = await readMarkdownFilesAsync(globs)
  if (
    options.socialMediaPreviewImage !== null &&
    isUrl(options.socialMediaPreviewImage) === false
  ) {
    const socialMediaPreviewImageFilePath = resolveNewImageFilePath(
      options.socialMediaPreviewImage,
      Object.values(images)
    )
    images[options.socialMediaPreviewImage] = socialMediaPreviewImageFilePath
    options.socialMediaPreviewImage = [
      options.baseUrl === null ? '' : options.baseUrl,
      socialMediaPreviewImageFilePath
    ]
      .join('/')
      .replace(/(?<!:)\/+/g, '/')
  }
  await copyImageFilesAsync(images, {
    outputDirectory: options.outputDirectory
  })
  const htmlFilePath = await buildHtmlAsync(files.join('\n\n'), options)
  return htmlFilePath
}
