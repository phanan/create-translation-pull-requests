import parseForksInput from './utils/parse-forks-input'
import git from './utils/git'

const github = require('@actions/github')
const core = require('@actions/core')

async function run () {
  const sourceOwner = github.context.payload.repository.owner.login
  const sourceRepo = github.context.payload.repository.name
  const commitSHA = github.context.payload.after

  try {
    const octokit = new github.GitHub(core.getInput('GH_TOKEN'))
    const branchName = await git.createBranch(octokit, sourceOwner, sourceRepo, commitSHA)
    const createdPRs = []

    parseForksInput(core.getInput('FORKS')).forEach(async ({ owner, repo }) => {
      try {
        core.info(`Creting PR for ${owner}/${repo}`)
        const pull = await git.createPullRequest(octokit, sourceOwner, sourceRepo, owner, repo, branchName)
        createdPRs.push(pull.data.html_url)
      } catch (error) {
        core.warning(`Failed to create PR for ${owner}/${repo}: ${error.message}`)
      }
    })

    core.setOutput('prs', createdPRs.join("\n"))
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()