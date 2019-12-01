const github = require('@actions/github')
const core = require('@actions/core')
const parseForksInput = require('./utils/parse-forks-input')
const git = require('./utils/git')

async function run () {
  const owner = github.context.payload.repository.owner.login
  const repo = github.context.payload.repository.name
  const sha = github.context.payload.after

  try {
    const octokit = new github.GitHub(core.getInput('GH_TOKEN'))
    const branchName = await git.createBranch(octokit, owner, repo, sha)

    parseForksInput(core.getInput('GH_FORKS')).forEach(async ({ owner, repo }) => {
      try {
        const pull = git.createPullRequest(octokit, sourceOwner, sourceRepo, owner, repo, branchName)
        core.info(`PR created for ${owner}/${repo}: ${pull.data.html_url}`)
      } catch (error) {
        core.warning(`Failed to create PR for ${owner}/${repo}: ${error.message}`)
      }
    })
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()