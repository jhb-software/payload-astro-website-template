const germanCharacterReplacements: Record<string, string> = {
  ä: 'ae',
  ö: 'oe',
  ü: 'ue',
  ß: 'ss',
}

const slugify = (str: string) => {
  return String(str)
    .toLowerCase() // convert to lowercase
    .replace(/[äöüß]/g, (char) => germanCharacterReplacements[char]) // replace german characters
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // remove consecutive hyphens
}

const slugifyId = (title: string) => {
  if (!title) return ''

  // TODO: try using CSS.escape() instead
  // remove leading digits to ensure that using document.querySelector works
  return slugify(title.replace(/^\d+/, ''))
}

export default slugifyId
