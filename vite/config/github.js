// GitHub configuration
export const githubConfig = {
  // GitHub username or organization that owns the dispatch repository
  // In Vite, environment variables must be prefixed with VITE_ and accessed via import.meta.env
  dispatchOwner: import.meta.env.VITE_GITHUB_DISPATCH_OWNER,
  
  // Repository name that contains the GitHub Actions workflow
  dispatchRepo: import.meta.env.VITE_GITHUB_DISPATCH_REPO,
  
  // GitHub personal access token requirements
  tokenScopes: ['repo', 'workflow', 'read:org'],
  
  // Helper text for users
  getTokenUrl: 'https://github.com/settings/tokens/new',
  getTokenHelp: 'Create a token with "repo" and "workflow" scopes'
}; 