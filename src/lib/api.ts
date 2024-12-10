const API_URL = 'http://localhost:15000/api';

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

async function handleResponse(response: Response): Promise<ApiResponse> {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }
  
  return {
    success: true,
    data
  };
}

export async function signIn(email: string, password: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred during sign in'
    };
  }
}

export async function signUp(name: string, email: string, password: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred during sign up'
    };
  }
}

export async function createProfile(profileData: any, token: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while creating profile'
    };
  }
}

export async function getProfile(token: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      credentials: 'include',
    });
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while fetching profile'
    };
  }
}

export async function getRecipes(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/recipes`, {
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'include',
    });
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while fetching recipes'
    };
  }
}

export async function saveRecipe(recipeId: string, token: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/recipes/${recipeId}/save`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
    });
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while saving recipe'
    };
  }
}

export async function getSavedRecipes(token: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/recipes/saved`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      credentials: 'include',
    });
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while fetching saved recipes'
    };
  }
}