const parseForksInput = rawInput => rawInput.split(/\r?\n/).map(fullName => {
  const [owner, repo] = fullName.trim().split('/')
  return { owner, repo }
})

export default parseForksInput