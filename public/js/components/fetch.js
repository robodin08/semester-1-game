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

    return {
      success: response.ok,
      status: response.status,
      data: data || response.statusText,
    };
  } catch (error) {
    console.error('Network error:', error.message);
    return { success: false, error: error.message };
  }
}
