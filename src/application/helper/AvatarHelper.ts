export function getAvatarUrl(avatar: string | null): string | null {
  const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN
  const objectNamePrefix = process.env.OBJECT_NAME_PREFIX
  if (cloudfrontDomain === undefined || objectNamePrefix === undefined) {
    return null
  }

  return avatar !== null
    ? `https://${cloudfrontDomain}/${objectNamePrefix}/${avatar}`
    : null
}
