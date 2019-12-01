export default {
  createBranch: async (octokit, owner, repo, sha) => {
    const branchName = `changes-${new Date().toJSON().slice(0, 10)}-${Date.now()}`

    await octokit.git.createRef({
      owner,
      repo,
      sha,
      ref: `refs/heads/${branchName}`
    })

    return branchName
  },

  createPullRequest: async (octokit, sourceOwner, sourceRepo, forkOwner, forkRepo, branchName) => {
    return await octokit.pulls.create({
      owner: forkOwner,
      repo: forkRepo,
      head: `${sourceOwner}:${branchName}`,
      title: `Latest changes from ${sourceOwner}/${sourceRepo}`,
      base: 'master',
      maintainer_can_modify: true
    })
  }
}