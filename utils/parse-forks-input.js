const parseForksInput = rawInput => rawInput.split(/\r?\n/).map(fullName => {
  [owner, repo] = fullName.trim().split('/')
  return { owner, repo }
})

export default parseForksInput