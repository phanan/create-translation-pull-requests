const github = require('@actions/github')
const core = require('@actions/core')

const generateBranchName = () => `changes-${Date.now()}`

const parseForksInput = rawInput => rawInput.split(/\r?\n/).map(fullName => {
  [owner, repo] = fullName.trim().split('/')
  return { owner, repo }
})

async function run () {
  const octokit = new github.GitHub(core.getInput('GH_TOKEN'))

  const owner = github.context.payload.repository.owner.login
  const repo = github.context.payload.repository.name
  const branchName = generateBranchName()

  const refData = {
    owner,
    repo,
    ref: `refs/heads/${branchName}`,
    sha: github.context.payload.after
  }

  try {
    const branch = await octokit.git.createRef(refData)
    const head = `${owner}:${branchName}`
    const title = `Latest changes from ${owner}/${repo}`

    parseForksInput(core.getInput('FORKS')).each(async ({ owner, repo }) => {
      const pullData = {
        owner,
        repo,
        head,
        title,
        base: 'master',
        maintainer_can_modify: true
      }

      try {
        const pull = await octokit.pulls.create(pullData)
        console.info(`PR created for ${owner}/${repo}: ${pull.data.url}`)
      } catch (error) {
        console.error(`Failed to create PR for ${owner}/${repo}: ${error.message}`)
      }
    })
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()