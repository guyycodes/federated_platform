import { NextResponse } from 'next/server';
import prisma from '../../../../../vite/lib/prisma';

////////////////////////////////////////////////////////////
// POST
////////////////////////////////////////////////////////////
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      githubToken, 
      gitEmail, 
      pluginConfig,
      dispatchRepo, // Default repo name
      dispatchOwner // Repository owner
    } = body;

    // Validate required fields
    if (!githubToken || !gitEmail || !pluginConfig || !dispatchOwner) {
      return NextResponse.json(
        { error: 'Missing required fields: githubToken, gitEmail, pluginConfig, and dispatchOwner are required' },
        { status: 400 }
      );
    }

    // Generate a callback URL if a callback ID is provided
    const callbackId = body.callbackId || null;
    console.log('[GitHub Dispatch] Callback ID:', callbackId);
    
    const callbackUrl = callbackId 
      ? `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/github/dispatch/callback/${callbackId}`
      : null;

    // Create callback record in database if callback is enabled
    if (callbackId) {
      console.log('[GitHub Dispatch] Creating callback record for:', callbackId);
      try {
        const callbackRecord = await prisma.githubCallback.create({
          data: {
            callbackId: callbackId,
            data: {
              status: 'pending',
              pluginConfig: pluginConfig,
              createdAt: new Date().toISOString()
            }
          }
        });
        console.log('[GitHub Dispatch] Callback record created successfully:', callbackRecord.id);
      } catch (dbError) {
        console.error('[GitHub Dispatch] Failed to create callback record:', dbError);
        console.error('[GitHub Dispatch] Error details:', dbError.message);
        // Continue anyway - the workflow will create it via upsert
      }
    } else {
      console.log('[GitHub Dispatch] No callback ID provided, skipping callback creation');
    }

    // Prepare the dispatch payload according to the workflow requirements
    const dispatchPayload = {
      event_type: 'create-plugin',
      client_payload: {
        github_token: githubToken,
        git_email: gitEmail,
        plugin_config: {
          name: pluginConfig.name,
          description: pluginConfig.description,
          category: pluginConfig.category,
          pricing: pluginConfig.pricing,
          oneTimePrice: pluginConfig.oneTimePrice,
          subscriptionTier: pluginConfig.subscriptionTier,
          usagePrice: pluginConfig.usagePrice,
          whiteLabel: pluginConfig.whiteLabel,
          template: pluginConfig.template || {
            Frontend: 'typescript',
            Backend: 'python'
          },
          templateId: pluginConfig.templateId, // Add the selected template ID
          repo_choice: pluginConfig.repo_choice || 'create',
          // Handle different repo configurations
          ...(pluginConfig.repo_choice === 'create' 
            ? { repo_name: pluginConfig.repo_name }
            : { existing_repo: pluginConfig.existing_repo }
          )
        },
        // Add callback URL if provided
        ...(callbackUrl && { callback_url: callbackUrl })
      }
    };

    // Use the users github_token to trigger the dispatch-repo CI (since the dispatch-repo is private)
    // The user's token is passed in the payload for the workflow to use & we grab the GITHUB_DISOATCH_REPO_SERVICE_PAT
    // This is a service token that is used to accessthe dispatch-repo
    const serviceToken = process.env.GITHUB_DISPATCH_REPO_SERVICE_PAT;

    console.log('serviceToken', serviceToken);
    
    if (!serviceToken) {
      console.error('GITHUB_SERVICE_PAT not configured');
      return NextResponse.json(
        { error: 'Server configuration error: Service token not configured' },
        { status: 500 }
      );
    }

    // Make the request to GitHub's repository dispatch API
    const response = await fetch(
      `https://api.github.com/repos/${dispatchOwner}/${dispatchRepo}/dispatches`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${serviceToken}`, // Use service token for auth
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dispatchPayload)
      }
    );

    // GitHub returns 204 No Content on success
    if (response.status === 204) {
      return NextResponse.json({
        success: true,
        message: 'Plugin creation workflow triggered successfully',
        workflowUrl: `https://github.com/${dispatchOwner}/${dispatchRepo}/actions`,
        ...(callbackId && { callbackId, callbackUrl })
      });
    }

    // Handle errors
    const errorText = await response.text();
    console.error('GitHub dispatch error:', errorText);
    
    if (response.status === 404) {
      return NextResponse.json(
        { error: 'Dispatch repository not found or service token does not have access.' },
        { status: 404 }
      );
    }

    if (response.status === 401) {
      return NextResponse.json(
        { error: 'Invalid service token or insufficient permissions for dispatch repository.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: `GitHub API error: ${errorText}` },
      { status: response.status }
    );

  } catch (error) {
    console.error('Error triggering plugin creation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to trigger plugin creation workflow' },
      { status: 500 }
    );
  }
}
////////////////////////////////////////////////////////////
// DELETE
////////////////////////////////////////////////////////////
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { 
      githubToken, 
      pluginConfig,
      dispatchRepo, // Default repo name
      dispatchOwner // Repository owner
    } = body;

    if (!githubToken || !pluginConfig || !dispatchOwner) {
      return NextResponse.json(
        { error: 'Missing required fields: githubToken, pluginConfig, and dispatchOwner are required' },
        { status: 400 }
      );
    }

    // Generate a callback URL if a callback ID is provided
    const callbackId = body.callbackId || null;
    console.log('[GitHub Dispatch DELETE] Callback ID:', callbackId);
    
    const callbackUrl = callbackId 
      ? `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/github/dispatch/callback/${callbackId}`
      : null;

    // Create callback record in database if callback is enabled
    if (callbackId) {
      console.log('[GitHub Dispatch DELETE] Creating callback record for:', callbackId);
      try {
        const callbackRecord = await prisma.githubCallback.create({
          data: {
            callbackId: callbackId,
            data: {
              status: 'pending',
              pluginConfig: pluginConfig,
              action: 'delete',
              createdAt: new Date().toISOString()
            }
          }
        });
        console.log('[GitHub Dispatch DELETE] Callback record created successfully:', callbackRecord.id);
      } catch (dbError) {
        console.error('[GitHub Dispatch DELETE] Failed to create callback record:', dbError);
        console.error('[GitHub Dispatch DELETE] Error details:', dbError.message);
        // Continue anyway - the workflow will create it via upsert
      }
    } else {
      console.log('[GitHub Dispatch DELETE] No callback ID provided, skipping callback creation');
    }

    // Prepare the dispatch payload for deletion
    const dispatchPayload = {
      event_type: 'delete-plugin',
      client_payload: {
        github_token: githubToken,
        plugin_config: {
          repo_name: pluginConfig.repo_name || pluginConfig.existing_repo,
        },
        // Add callback URL if provided
        ...(callbackUrl && { callback_url: callbackUrl })
      }
    };

    // Use the service token to trigger the dispatch
    const serviceToken = process.env.GITHUB_DISPATCH_REPO_SERVICE_PAT;

    console.log('serviceToken', serviceToken);
    
    if (!serviceToken) {
      console.error('GITHUB_SERVICE_PAT not configured');
      return NextResponse.json(
        { error: 'Server configuration error: Service token not configured' },
        { status: 500 }
      );
    }

    // Make the request to GitHub's repository dispatch API
    const response = await fetch(
      `https://api.github.com/repos/${dispatchOwner}/${dispatchRepo}/dispatches`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${serviceToken}`, // Use service token for auth
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dispatchPayload)
      }
    );

    // GitHub returns 204 No Content on success
    if (response.status === 204) {
      return NextResponse.json({
        success: true,
        message: 'Plugin deletion workflow triggered successfully',
        workflowUrl: `https://github.com/${dispatchOwner}/${dispatchRepo}/actions`,
        ...(callbackId && { callbackId, callbackUrl })
      });
    }

    // Handle errors
    const errorText = await response.text();
    console.error('GitHub dispatch DELETE error:', errorText);
    
    if (response.status === 404) {
      return NextResponse.json(
        { error: 'Dispatch repository not found or service token does not have access.' },
        { status: 404 }
      );
    }

    if (response.status === 401) {
      return NextResponse.json(
        { error: 'Invalid service token or insufficient permissions for dispatch repository.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: `GitHub API error: ${errorText}` },
      { status: response.status }
    );

  } catch (error) {
    console.error('Error triggering plugin deletion:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to trigger plugin deletion workflow' },
      { status: 500 }
    );
  }
}
////////////////////////////////////////////////////////////
// PUT - Deploy/Push Plugin to Different Stages
// 
// Repository Format Info for CI:
// - repo_name: Just the repository name without .git (e.g., "my-plugin")
// - repo_owner: GitHub username or org (e.g., "octocat")
// - full_repo: "owner/repo" format without .git (e.g., "octocat/my-plugin")
// 
// CI can clone using: https://github.com/${full_repo}.git
////////////////////////////////////////////////////////////
export async function PUT(request) {
  try {
    const body = await request.json();
    const { 
      githubToken, // users PAT
      pluginConfig,
      dispatchRepo, // Default repo name
      dispatchOwner, // Repository owner
      commitSHA,
      currentDeploymentStatus,
      branch,
      envVars
    } = body;

    // Validate required fields
    if (!githubToken || !pluginConfig || !dispatchOwner) {
      return NextResponse.json(
        { error: 'Missing required fields: githubToken, pluginConfig, and dispatchOwner are required' },
        { status: 400 }
      );
    }

    // Generate a callback URL if a callback ID is provided
    const callbackId = body.callbackId || null;
    console.log('[GitHub Dispatch PUT] Callback ID:', callbackId);
    
    const callbackUrl = callbackId 
      ? `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/github/dispatch/callback/${callbackId}`
      : null;

    // Create callback record in database if callback is enabled
    if (callbackId) {
      console.log('[GitHub Dispatch PUT] Creating callback record for:', callbackId);
      try {
        const callbackRecord = await prisma.githubCallback.create({
          data: {
            callbackId: callbackId,
            data: {
              status: 'pending',
              pluginConfig: pluginConfig,
              action: 'push',
              commitSHA: commitSHA,
              branch: branch,
              currentDeploymentStatus: currentDeploymentStatus,
              createdAt: new Date().toISOString()
            }
          }
        });
        console.log('[GitHub Dispatch PUT] Callback record created successfully:', callbackRecord.id);
      } catch (dbError) {
        console.error('[GitHub Dispatch PUT] Failed to create callback record:', dbError);
        console.error('[GitHub Dispatch PUT] Error details:', dbError.message);
        // Continue anyway - the workflow will create it via upsert
      }
    } else {
      console.log('[GitHub Dispatch PUT] No callback ID provided, skipping callback creation');
    }

    // Prepare the dispatch payload for push/deployment
    const dispatchPayload = {
      event_type: 'push-plugin-dev',
      client_payload: {
        github_token: githubToken,
        plugin_config: {
          name: pluginConfig.name,
          repo_name: pluginConfig.repo_name || pluginConfig.existing_repo,  // Just repo name (e.g., "my-plugin")
          repo_owner: pluginConfig.repo_owner,  // GitHub username/org (e.g., "octocat")
          full_repo: pluginConfig.full_repo,  // Format: "owner/repo" (e.g., "octocat/my-plugin") - NO .git extension
          // Include deployment-specific data
          plugin_id: pluginConfig.id,
          deployment_status: pluginConfig.deploymentStatus
        },
        // Push-specific data
        commit_sha: commitSHA || 'HEAD',
        branch: branch,
        current_deployment_status: currentDeploymentStatus,
        // Add callback URL if provided
        ...(callbackUrl && { callback_url: callbackUrl }),
        // Add environment variables if provided
        // Structure: { OPENAI_API_KEY: "sk-...", TAVILY_API_KEY: "tvly-...", LANGCHAIN_API_KEY: "ls__..." }
        ...(envVars && { env_vars: envVars })
      }
    };

    // Use the service token to trigger the dispatch
    const serviceToken = process.env.GITHUB_DISPATCH_REPO_SERVICE_PAT;

    console.log('serviceToken', serviceToken);
    
    if (!serviceToken) {
      console.error('GITHUB_SERVICE_PAT not configured');
      return NextResponse.json(
        { error: 'Server configuration error: Service token not configured' },
        { status: 500 }
      );
    }

    // Make the request to GitHub's repository dispatch API
    const response = await fetch(
      `https://api.github.com/repos/${dispatchOwner}/${dispatchRepo}/dispatches`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${serviceToken}`, // Use service token for auth
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dispatchPayload)
      }
    );

    // GitHub returns 204 No Content on success
    if (response.status === 204) {
      return NextResponse.json({
        success: true,
        message: 'Plugin push/deployment workflow triggered successfully',
        workflowUrl: `https://github.com/${dispatchOwner}/${dispatchRepo}/actions`,
        ...(callbackId && { callbackId, callbackUrl })
      });
    }

    // Handle errors
    const errorText = await response.text();
    console.error('GitHub dispatch PUT error:', errorText);
    
    if (response.status === 404) {
      return NextResponse.json(
        { error: 'Dispatch repository not found or service token does not have access.' },
        { status: 404 }
      );
    }

    if (response.status === 401) {
      return NextResponse.json(
        { error: 'Invalid service token or insufficient permissions for dispatch repository.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: `GitHub API error: ${errorText}` },
      { status: response.status }
    );

  } catch (error) {
    console.error('Error triggering plugin push:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to trigger plugin push workflow' },
      { status: 500 }
    );
  }
} 