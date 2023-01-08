const formJSON = document.getElementById('json-form');
const nonFollowersArea = document.getElementById('non-followers');

const usersPrinter = (userList) => {
  userList.forEach((user) => {
    const htmlText = document.createElement('li');
    htmlText.innerHTML = `${user} (<a href="https://instagram.com/${user}">https://instagram.com/${user}</a>)`
    nonFollowersArea.insertAdjacentElement('beforeend', htmlText);
  });
}

const parseJSONFile = async (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = event => resolve(JSON.parse(event.target.result))
    fileReader.onerror = error => reject(error)
    fileReader.readAsText(file)
  });
};

formJSON.addEventListener('submit', async (event) => {
  event.preventDefault();
  const followingFile = event.currentTarget.followingfile.files[0];
  const followersFile = event.currentTarget.followersfile.files[0];
  const followingJSON = await parseJSONFile(followingFile);
  const followersJSON = await parseJSONFile(followersFile);
  const following = followingJSON.relationships_following.map((user) => user.string_list_data[0].value)
  const followers = followersJSON.relationships_followers.map((user) => user.string_list_data[0].value)
  const nonFollowersList = following.filter(user => !followers.includes(user));
  usersPrinter(nonFollowersList);
});
