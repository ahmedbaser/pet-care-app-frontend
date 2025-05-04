import { ProfileData } from "../redux/slices/authSlice";
import { UpdatePostPayload } from "../redux/slices/postSlice";
import type { UserInfo, Pet } from '../AIModel/PetAdoptionMatch'; // adjust relative path as needed
import { PetHealthData } from "../AIModel/PetHealthPrediction ";






// Base API URL
// const API_URL = 'https://pet-care-tips-stories-backend.vercel.app/api'; 
const API_URL = 'http://localhost:5000/api'; 




// Interface for creating a new post
interface Post {
  title: string;
  content: string;
  category?: string; 
  isPremium?: boolean;
}


export interface PutData {
  [key: string]: string | number | boolean;
}

interface PaymentStatusResponse {
  data: {
    status: string;
  }
  paymentIntentId: string;
  amount: number;
  currency: string;
}






// Register a new user
const registerUser = async (userData:{email: string, password: string, name: string, phone: string, address: string}) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error('Failed to register');
  }
  return response.json();
};



// Login user and return token & user data
const loginUser = async (email: string, password: string) => { 
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to login');
  }
  
  const result = await response.json(); 
  console.log(result)
  return { token: result.token, user: result.user };
};




// Reset user password using token
const resetPassword = async (token: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
     
    },
    body: JSON.stringify({ newPassword: password }),
  });
  if (!response.ok) {
    throw new Error('Failed to reset password');
  }
  return response.json();
};




// Password Reset API
const sendPasswordResetEmail = async (email: string) => {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    throw new Error('Failed to send password reset email');
  }
  return response.json();
};


// Update user profile
const updateProfile = async (endpoint: string, data: ProfileData, token: string) => {
  const response = await fetch(`${API_URL}/auth/update-profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update data at ${endpoint}`);
  }

  const result = await response.json();
  console.log("this is UpdateProfile API data:", result.user); 
  
  
  return result.user;
};


// create user profile
const createPost = async (post: Post, token:string) => {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
    body: JSON.stringify(post),
  });
  if (!response.ok) {
    throw new Error('Failed to create post');
  }
  const data = response.json();
  return data;
};


// fetch all posts
  const fetchPosts = async () => {
  const response = await fetch(`${API_URL}/posts`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
   const data = await response.json();
   console.log('this is fetchPosts:', data);
   return data;
};

// fetch posts by a specific author's ID
  const fetchPostByAuthorId = async(authorId: string) => {
    const response = await fetch(`${API_URL}/posts/author/${authorId}`);
    if(!response.ok) {
      throw new Error('Failed to fetch post');
    }
    return response.json();
  }


// fetch a single post by its ID
 const fetchPostById = async (id: string) => {
  const response = await fetch(`${API_URL}/posts/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }
  return response.json();
};


// Admin API
const getPosts = async () => {
  const response = await fetch(`${API_URL}/posts`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
};



// delete a post by its ID
const deletePost = async (id: string, token: string) => {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`, 
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to delete post with id ${id}`);
  }
};



// update a post by its ID
const updatePost = async (id: string, postData: UpdatePostPayload, token: string) => {
  console.log("Updating Post with Data:", postData); 
  console.log("Sent Data in Update Request:", postData);

  // Log token and headers
  console.log("Token Sent in Headers:", token);
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
  console.log("Headers:", headers);

  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Update Request Failed:", response.status, errorText);
    throw new Error(`Failed to update post with id ${id}. Error: ${errorText}`);
  }

  const data = await response.json();
  console.log('Updated Post in Update API:', data);
  return data;
};



// Fetch users for admin
const getUsers = async (token: string) => {
  console.log("Token sent for fetching users:", token); 
  const response = await fetch(`${API_URL}/admin/users`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
  });

  const data = await response.json(); 
  console.log("Response:", data); 
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch users');
  }
  return data;
};


// toggle the publish status of a post (admin action)
const updatePostStatus = async (postId: string, token:string) => {
  const response = await fetch(`${API_URL}/admin/posts/${postId}/publish`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to toggle post publish status');
  }
  const result = await response.json();
  console.log('this is data of togglePublishStatus:', result);
  return result;
};



// delete a post as an admin
const deletePostAdmin = async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/admin/posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Failed to delete post with id ${id}`);
  }
  return await response.json(); 
};


// Delete a user by ID (admin route)
const deleteUser = async (id: string, token: string) => {
  console.log("Token sent for deleting user:", token); 
  const response = await fetch(`${API_URL}/admin/users/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`, 
    },
    method: 'DELETE',
  });

  const data = await response.json();
  console.log("Response:", data); 

  if (!response.ok) {
    throw new Error(data.message || `Failed to delete user with id ${id}`);
  }
};


// generate a pet nutrition PDF based on age and weight
const generatePetNutritionPDF = async (age: number, weight: number, token:string) => {
  const response = await fetch(`${API_URL}/nutrition/generate-pdf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 

    },
    body: JSON.stringify({ age, weight }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate nutrition PDF');
  }

 // Handle the PDF download by creating a Blob
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pet-nutrition-chart_${Date.now()}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export { generatePetNutritionPDF,};


//  upvote a post by its ID
const upvotePost = async (id: string, token: string) => {
  const response = await fetch(`${API_URL}/posts/${id}/upvote`, {
    
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to upvote post with id ${id}`);
  }
  return response.json();
};


// downvote a post by its ID
const downvotePost = async (id: string, token: string) => {
  const response = await fetch(`${API_URL}/posts/${id}/downvote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to downvote post with id ${id}`);
  }
  return response.json();
};

// follow a user by their ID
const followUser = async (userId: string, token:string) => {
  const response = await fetch(`${API_URL}/users/follow/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`
    }, 
  });

  
  const result = await response.json();
  console.log('Follow successful API:', result);
  return result;
};



// unfollow a user by their ID
  const unfollowUser = async (userId: string, token: string) => {
  console.log("Starting unfollowUser with:", { userId, token });

  try {
    const response = await fetch(`${API_URL}/users/${userId}/unfollow`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    console.log('this is Response of UnfollowUsers:', response)
    if (!response.ok) {
      console.error("Unfollow request failed:", response.status, response.statusText); 
      throw new Error('Failed to unfollow user');
    }

    const result = await response.json();
    console.log('this is unfollowUser in api.ts section:', result); 
    return result;
  } catch (error) {
    console.error("Error in unfollowUser:", error); 
    throw error; 
  }
};




// get a list of users the authenticated user is following
const getFollowingList = async(token: string) => {
  const response = await fetch(`${API_URL}/users/profile/following`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
  if(!response.ok) {
    throw new Error('Failed to fetch following users')
  }
  const data = await response.json();
  console.log('this is getFollowingList', data)
  return data;
}


// get a list of users who are following the authenticated user
const getFollowedUsers = async(token: string) => {
   const response = await fetch(`${API_URL}/users/followed`, {
    method: 'GET',
    headers: {
       'Authorization': `Bearer ${token}`
    },
    
   });
   if (!response.ok) {
    throw new Error('Failed to fetch follow user');
  }
  const data = await response.json();
  console.log("this is getFollowUserAPI response:", data);
  return data;
}


// fetch a list of discoverable users
const getDiscoverableUsers = async (token: string) => {
  const response = await fetch(`${API_URL}/users/discover`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch discoverable users');
  }

  const data = await response.json();
  console.log("Discoverable Users:", data.users);
  return data.users;
};



// create a comment on a post
const createComment = async (postId: string, comment: string, token: string) => {
  const response = await fetch(`${API_URL}/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ comment }),
  });
  if (!response.ok) {
    throw new Error('Failed to create comment');
  }
  return response.json();
};


// Edit Comment
const editComment = async (commentId: string, updatedComment: string, token:string) => {
  const response = await fetch(`${API_URL}/comments/${commentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ content: updatedComment }),

  });
  console.log("this is API updatedComment:", updatedComment)
  console.log("this is API updatedComment parameter:",)
  if (!response.ok) {
    throw new Error(`Failed to edit comment with id ${commentId}`);
  }
  return response.json();
};


// Delete Comment
const deleteComment = async (commentId: string, token: string) => {
  const response = await fetch(`${API_URL}/comments/${commentId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to delete comment with id ${commentId}`);
  }
  return response.json();
};




// Reply to a Comment
const replyToComment = async (commentId: string, reply: string,) => {
  console.log("Replying to comment with data:", { commentId, reply}); 

  const response = await fetch(`${API_URL}/comments/${commentId}/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reply, }), 
  });
  if (!response.ok) {
    throw new Error(`Failed to reply to comment with id ${commentId}`);
  }
  return response.json();
};


// Fetch comments by post ID using fetch
 const fetchCommentsByPostId = async (postId: string) => {
  try {
    const response = await fetch(`${API_URL}/${postId}/comments`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Error fetching comments: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};


// initiate a payment for a post by a user
const makePayment = async (postId: string, userId:string) => {
  console.log('this is userId in makePayment:', userId);
  console.log('this is postId in makePayment:', postId);
  const response = await fetch(`${API_URL}/payments/create-payment-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({postId, userId}),
    
  });
  if (!response.ok) {
    throw new Error('Failed to process payment');
  }
  return response.json();
};



// check the payment status using the payment intent ID
const checkPaymentStatus = async (paymentIntentId: string):Promise<PaymentStatusResponse> => {
    const response = await fetch(`${API_URL}/payments/status/${paymentIntentId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
   if(!response.ok) {
    throw new Error('Failed to check payment status');
   }    
   const result = await response.json();
   return result;    
}




// fetch payment history (for admin) with an optional postId filter
 const fetchPaymentHistoryAPI = async (
  token: string,
  postId: string | null
) => {
  const url = new URL(`${API_URL}/admin/payments`);
  if (postId) {
    url.searchParams.append('postId', postId);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch payment history: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('this is data:', data)
  return data;
};





// Content Categorization - Get all categories
const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};


// Fetch premium content
const getPremiumContent = async () => {
  const response = await fetch(`${API_URL}/premium-content`);
  if (!response.ok) {
    throw new Error('Failed to fetch premium content');
  }
  return response.json();
};


// Mark a post as premium
const markPostAsPremium = async (postId: string) => {
  const response = await fetch(`${API_URL}/posts/${postId}/mark-premium`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to mark post ${postId} as premium`);
  }
  return response.json();
};


// Image Attachments - Upload an image
const uploadImage = async (formData: FormData) => {
  const response = await fetch(`${API_URL}/upload/image`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }
  return response.json();
};




// Dynamic Content & Infinite Scroll - Fetch posts with pagination
const fetchPaginatedPosts = async (page: number, limit: number) => {
  const response = await fetch(`${API_URL}/posts?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch paginated posts');
  }
  return response.json(); 
};


// Search Posts by Keyword
const searchPosts = async (keyword: string) => {
  const response = await fetch(`${API_URL}/posts/search?query=${encodeURIComponent(keyword)}`);
  if (!response.ok) {
    throw new Error(`Failed to search posts with keyword "${keyword}"`);
  }
  return response.json();
};


// Filter Posts by Category
const filterPostsByCategory = async (categoryId: string) => {
  const response = await fetch(`${API_URL}/posts/category/${categoryId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch posts for category ${categoryId}`);
  }
  return response.json();
};

// AI Features API
const sendMessageToChatbot = async(message: string) => {
  const response = await fetch(`${API_URL}/chatbot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({message}),
  });

  if(!response.ok) {
    throw new Error('Failed to get response from chatbot');
  }
  return response.json();
}

const generatePetStory = async (petType: string, petName: string) => {
  const response = await fetch(`${API_URL}/generate-story`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({petType, petName}),
  });

  if(!response.ok) {
    throw new Error('Failed to generate story');
  }
  return response.json();
}

type Activity = {
  date: string,
  activityType: string,
  details: string,
}


const PetActivityAnalytics = async (activities: Activity[], token: string) => {
   const response = await fetch(`${API_URL}/pet-analytics`, {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
   },
   body: JSON.stringify({activities}),
   });
   if(!response.ok) {
    throw new Error('Failed to generate story')
   }
   
   return response.json();
   
}



const PetAdoptionMatch = async(user: UserInfo, pets: Pet[], token:string) => {
   const response = await fetch(`${API_URL}/pet-adoption-match`, {
     method: 'POST',
     headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
     },
     body: JSON.stringify({user, pets})
   });
   if(!response.ok) {
    throw new Error('Failed to generate pet adoption match')
   }
   console.log('this is response PetAdoptionMatch:', response)
   return response.json();
}


const PetHealthPrediction  = async (petDate: PetHealthData, token: string) => {
     const response = await fetch(`${API_URL}/predictive-health-trends`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(petDate)
     });

     if(!response.ok) {
      throw new Error('Failed to generate pet adoption match')
     }
     console.log('this is response PetAdoption Match', response);
     return response.json();
}

















export default {
  registerUser,
  loginUser,
  fetchPosts,
  fetchPostById,
  createPost,
  getFollowingList,
  sendPasswordResetEmail,
  resetPassword,
  getPosts, 
  checkPaymentStatus,
  followUser,
  unfollowUser,
  getFollowedUsers ,
  getDiscoverableUsers,
  createComment,
  makePayment,
  updatePostStatus,
  upvotePost,
  downvotePost,
  updateProfile,
  updatePost,
  deletePostAdmin,
  delete:deletePost,
  fetchPaginatedPosts,
  deleteComment,
  replyToComment,
  fetchCommentsByPostId,
  markPostAsPremium,
  getPremiumContent,
  uploadImage,
  editComment,
  searchPosts,
  getCategories,
  filterPostsByCategory,
  getUsers,
  deleteUser,
  fetchPaymentHistoryAPI,
  fetchPostByAuthorId,
  sendMessageToChatbot, 
  generatePetStory,
  PetActivityAnalytics,
  PetAdoptionMatch,
  PetHealthPrediction  
};




















