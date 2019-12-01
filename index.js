const github = require('@actions/github')
const core = require('@actions/core')

const generateBranchName = () => `changes-${Date.now()}`

async function run () {
  const octokit = new github.GitHub(core.getInput('GH_TOKEN'))
  const forks = core.getInput('FORKS')
  console.log('forks: ', forks)

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
    // const branch = await octokit.git.createRef(refData)

    // const pullData = {
    //   owner: 'phanan-forks',
    //   repo: 'create-translation-pull-requests',
    //   title: 'Latest changes from upstream',
    //   head: `phanan:${branchName}`,
    //   base: 'master',
    //   body: 'Check and merge!',
    //   maintainer_can_modify: true
    // }

    // const pull = await octokit.pulls.create(pullData)
    // console.info(`Pull request created at ${pull.data.url}`)
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()