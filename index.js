const github = require('@actions/github')
const core = require('@actions/core')

const generateBranchName = () => `refs/heads/changes-${Date.now()}`

async function run () {
  console.log('x-t', core.getInput('GH_TOKEN')).length
  console.log('x-f', core.getInput('FORKS'))
  const octokit = new github.GitHub(core.getInput('GH_TOKEN'))
  const forks = core.getInput('FORKS')

  console.log(JSON.stringify(github.context.payload, undefined, 2))
  console.log(forks)

  const refData = {
    owner: github.context.payload.repository.owner.login,
    repo: github.context.payload.repository.name,
    ref: generateBranchName(),
    sha: github.context.payload.after
  }

  console.log(refData)

  try {
    const branch = await octokit.git.createRef(refData)
    console.log(JSON.stringify(branch, undefined, 2))
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()