// Test the URL fix logic
function testUrlConstruction() {
  const baseUrl = 'https://movies4u.ps/';
  
  const testCases = [
    { filter: '/category/bollywood/', page: 1 },
    { filter: '/category/hollywood/', page: 1 },
    { filter: '', page: 1 },
  ];
  
  testCases.forEach(({ filter, page }) => {
    let url;
    
    if (filter) {
      url = filter.startsWith("/")
        ? `${baseUrl}${filter.replace(/\/$/, "")}${
            page > 1 ? `/page/${page}` : ""
          }`
        : `${baseUrl}/${filter}${page > 1 ? `/page/${page}` : ""}`;
    } else {
      url = `${baseUrl}${page > 1 ? `/page/${page}/` : ""}`;
    }
    
    // Fix double slashes
    url = url.replace(/([^:]\/)\/+/g, '$1');
    
    console.log(`Filter: "${filter}" -> URL: ${url}`);
  });
}

testUrlConstruction();
