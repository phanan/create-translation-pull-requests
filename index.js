const github = require('@actions/github')
const core = require('@actions/core')

const createNewBranch = async (octokit, owner, repo) => {
  const branchName = `changes-${Date.now()}`

  await octokit.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branchName}`,
    sha: github.context.payload.after
  })

  return branchName
}

const parseForksInput = rawInput => rawInput.split(/\r?\n/).map(fullName => {
  [owner, repo] = fullName.trim().split('/')
  return { owner, repo }
})

const createPullRequests = async (octokit, sourceOwner, sourceRepo, branchName) => {
  parseForksInput(core.getInput('FORKS')).forEach(async ({ owner, repo }) => {
    try {
      const pull = await octokit.pulls.create({
        owner,
        repo,
        head: `${sourceOwner}:${branchName}`,
        title: `Latest changes from ${sourceOwner}/${sourceRepo}`,
        base: 'master',
        maintainer_can_modify: true
      })

      core.info(`PR created for ${owner}/${repo}: ${pull.data.html_url}`)
    } catch (error) {
      core.warning(`Failed to create PR for ${owner}/${repo}: ${error.message}`)
    }
  })
}

async function run () {
  const owner = github.context.payload.repository.owner.login
  const repo = github.context.payload.repository.name

  try {
    const octokit = new github.GitHub(core.getInput('GH_TOKEN'))
    const branchName = await createNewBranch(octokit, owner, repo)
    await createPullRequests(octokit, owner, repo, branchName)
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()