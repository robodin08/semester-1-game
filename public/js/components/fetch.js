async function fetchUrl({
  url,
  method = 'POST',
  headers = {},
  body = null,
} = {}) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error: data || response.statusText,
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Network error:', error.message);
    return { success: false, error: error.message };
  }
}
