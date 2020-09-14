const requestForLogin = () =>
  fetch('/reqLogin').then(res => (document.location = res.url));
