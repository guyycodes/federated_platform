import { useState, useEffect, useCallback } from 'react';

export function useGitHub() {
  const [githubRepos, setGithubRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentRepo, setCurrentRepo] = useState(null);

  // Parse GitHub URL to extract owner and repo name
  const parseGitHubUrl = useCallback((url) => {
    if (!url) return null;
    
    // Handle different GitHub URL formats
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+)/,  // https://github.com/owner/repo
      /^([^\/]+)\/([^\/]+)$/              // owner/repo
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2].replace(/\.git$/, '') // Remove .git suffix if present
        };
      }
    }
    
    return null;
  }, []);

  // Fetch all repos for a user
  const fetchUserRepos = useCallback(async (username) => {
    if (!username) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      // call github directly
      const apiUrl = `https://api.github.com/users/${username}/repos`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch repositories: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching user repos:', err);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch a specific repository
  const fetchSpecificRepo = useCallback(async (repoUrl) => {
    if (!repoUrl) return null;
    
    setIsLoading(true);
    setError(null);
    setCurrentRepo(null);
    
    try {
      const parsed = parseGitHubUrl(repoUrl);
      if (!parsed) {
        throw new Error('Invalid GitHub repository URL format');
      }
      
      const { owner, repo } = parsed;
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Repository not found. If the repository exists but is set to private, it cannot be accessed without authentication. Please ensure the repository is public or provide a public repository URL.');
        }
        throw new Error(`Failed to fetch repository: ${response.statusText}`);
      }
      
      const data = await response.json();
      setCurrentRepo(data);
      return data;
    } catch (err) {
      console.error('Error fetching specific repo:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [parseGitHubUrl]);

  // Validate repository accessibility
  const validateRepository = useCallback(async (repoUrl) => {
    try {
      const repo = await fetchSpecificRepo(repoUrl);
      if (!repo) return { isValid: false, error: 'Repository not found' };
      
      return {
        isValid: true,
        repo: {
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          language: repo.language,
          isPrivate: repo.private,
          cloneUrl: repo.clone_url,
          htmlUrl: repo.html_url,
          defaultBranch: repo.default_branch,
          topics: repo.topics || [],
          license: repo.license?.name,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          openIssues: repo.open_issues_count,
          createdAt: repo.created_at,
          updatedAt: repo.updated_at
        }
      };
    } catch (err) {
      return { isValid: false, error: err.message };
    }
  }, [fetchSpecificRepo]);


  // Clear current error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Trigger GitHub Actions workflow via repository dispatch
  const triggerPluginCreation = useCallback(async ({
    githubToken,
    gitEmail,
    pluginConfig,
    dispatchOwner,
    dispatchRepo,
    enableCallback = false
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate callback ID if enabled
      const callbackId = enableCallback ? `cb_${Date.now()}_${Math.random().toString(36).substring(7)}` : null;
      
      const response = await fetch('/api/github/dispatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          githubToken,
          gitEmail,
          pluginConfig,
          dispatchOwner,
          dispatchRepo,
          ...(callbackId && { callbackId })
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to trigger workflow: ${response.statusText}`);
      }
      
      return data;
    } catch (err) {
      console.error('Error triggering plugin creation:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
////////////////////////////////////////////////////////////
// DELETE
////////////////////////////////////////////////////////////
  // Trigger GitHub Actions workflow via repository dispatch
  const triggerPluginDeletion = useCallback(async ({
    githubToken,
    pluginConfig,
    dispatchOwner,
    dispatchRepo,
    enableCallback = false
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate callback ID if enabled
      const callbackId = enableCallback ? `cb_${Date.now()}_${Math.random().toString(36).substring(7)}` : null;
      
      const response = await fetch('/api/github/dispatch', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          githubToken,
          pluginConfig,
          dispatchOwner,
          dispatchRepo,
          ...(callbackId && { callbackId })
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to trigger workflow: ${response.statusText}`);
      }
      
      return data;
    } catch (err) {
      console.error('Error triggering plugin creation:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Trigger GitHub Actions workflow via repository dispatch
  const triggerPluginPush = useCallback(async ({
    githubToken,
    pluginConfig,
    dispatchOwner,
    dispatchRepo,
    enableCallback = false,
    commitSHA,
    currentDeploymentStatus = "NEW",
    branch="main",
    envVars
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate callback ID if enabled
      const callbackId = enableCallback ? `cb_${Date.now()}_${Math.random().toString(36).substring(7)}` : null;
      
      const response = await fetch('/api/github/dispatch', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          githubToken,
          pluginConfig,
          dispatchOwner,
          dispatchRepo,
          commitSHA,
          currentDeploymentStatus,
          branch,
          ...(callbackId && { callbackId }),
          ...(envVars && { envVars }),
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to trigger workflow: ${response.statusText}`);
      }
      
      return data;
    } catch (err) {
      console.error('Error triggering plugin creation:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Check callback status
  const checkCallbackStatus = useCallback(async (callbackId) => {
    try {
      const response = await fetch(`/api/github/dispatch/callback/${callbackId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // No callback received yet
        }
        throw new Error(`Failed to check callback: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error checking callback:', err);
      throw err;
    }
  }, []);


  // Removed automatic fetch on mount - fetchGithubRepos should be called explicitly if needed

  return {
    // State
    githubRepos,
    currentRepo,
    isLoading,
    error,

    // Repository fetching
    fetchUserRepos,
    fetchSpecificRepo,
    
    // Workflow dispatch
    triggerPluginCreation,
    triggerPluginDeletion,
    triggerPluginPush,
    checkCallbackStatus,
    
    // Utilities
    parseGitHubUrl,
    validateRepository,
    clearError,
  };
} 