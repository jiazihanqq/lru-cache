export const requset = (url: string) => {
  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const { status, statusText, response } = xhr;
        if ((status >= 200 && status < 300) || status === 304) {
          const result = { response, status, statusText };
          resolve(result);
        } else {
          reject({ status, statusText, response });
        }
      }
    };

    xhr.onerror = (e) => {
      reject(e);
    };

    xhr.open("GET", url, true);
    xhr.send();
  });
};

export default requset;
