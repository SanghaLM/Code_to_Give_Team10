// Minimal API client for the REACH backend
const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function request(path, options = {}, token) {
  const headers = options.headers || {};
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  try {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) throw { status: res.status, ...data };
    return data;
  } catch (err) {
    // If parse failed and status not ok, throw generic
    if (!res.ok) throw { status: res.status, message: text || err.message };
    throw err;
  }
}

export async function teacherLogin(email, password) {
  return request('/teachers/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function parentLogin(username, password) {
  return request('/parents/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function getParentChildren(token) {
  return request('/parents/children', { method: 'GET' }, token);
}

export async function getChildrenHomeworks(childId, token) {
  return request(`/parents/children/${childId}/homeworks`, { method: 'GET' }, token);
}

export async function startHomework(homeworkId, token) {
  return request(`/parents/homework/${homeworkId}/start`, { method: 'GET' }, token);
}

export async function uploadWordRecording(homeworkId, wordId, formData, token) {
  return request(`/parents/homework/${homeworkId}/word/${wordId}/upload`, {
    method: 'POST',
    body: formData,
  }, token);
}

export async function submitHomework(homeworkId, studentId, timeTakenSeconds, token) {
  return request(`/parents/homework/${homeworkId}/submit`, {
    method: 'POST',
    body: JSON.stringify({ homeworkId, studentId, timeTakenSeconds }),
  }, token);
}

export async function resetHomework(homeworkId, studentId, token) {
  return request(`/parents/homework/${homeworkId}/reset`, {
    method: 'POST',
    body: JSON.stringify({ studentId }),
  }, token);
}

export async function getTeacherHomeworkMetrics(homeworkId, token) {
  return request(`/teachers/homework/${homeworkId}/metrics`, { method: 'GET' }, token);
}

export async function deletePublicPost(postId, token) {
  return request(`/public/posts/${postId}`, { method: 'DELETE' }, token);
}

export async function listPublicPosts() {
  return request(`/public/posts`, { method: 'GET' });
}

export async function createPublicPost(author, text, image, token, category = 'forfun') {
  return request(`/public/posts`, {
    method: 'POST',
    body: JSON.stringify({ author, text, image, category }),
  }, token);
}

export async function listPublicPostsByCategory(category = 'forfun') {
  return request(`/public/posts?category=${encodeURIComponent(category)}`, { method: 'GET' });
}

export async function reactPublicPost(postId, token) {
  return request(`/public/posts/${postId}/react`, { method: 'POST' }, token);
}

export async function commentPublicPost(postId, username, text, token) {
  return request(`/public/posts/${postId}/comment`, {
    method: 'POST',
    body: JSON.stringify({ username, text }),
  }, token);
}

export async function reportPublicPost(postId, token) {
  return request(`/public/posts/${postId}/report`, { method: 'POST' }, token);
}

export async function getLeaderboard() {
  return request(`/public/leaderboard`, { method: 'GET' });
}

export default { request };
