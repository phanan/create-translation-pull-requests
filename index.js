const github = require('@actions/github')
const core = require('@actions/core')

const generateBranchName = () => `refs/heads/changes-${Date.now()}`

async function run () {
  const octokit = new github.GitHub(core.getInput('GH_TOKEN'))
  const forks = core.getInput('FORKS')

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

    const pullData = {
      owner: 'phanan',
      repo: 'translation-sample',
      title: 'Updates on the way!',
      head: `${owner}:${branchName}`,
      base: 'master',
      body: 'Check and merge!',
      maintainer_can_modify: true
    }

    const pull = await octokit.pulls.create(pullData)
    console.log(pull)
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()