const formJSON = document.getElementById('json-form');
const nonFollowersArea = document.getElementById('non-followers');

const usersPrinter = (userList) => {
  const htmlText = document.createElement('h4');
  htmlText.innerHTML = `<strong>${userList.length}</strong> people are not following you back on <i>Instagram</i>`;
  nonFollowersArea.insertAdjacentElement('beforeend', htmlText);
  nonFollowersArea.classList.add('border-top', 'mt-3', 'pt-3');
  userList.forEach((user) => {
    const userItem = document.createElement('li');
    userItem.innerHTML = `${user} (<a href="https://instagram.com/${user}">https://instagram.com/${user}</a>)`;
    nonFollowersArea.insertAdjacentElement('beforeend', userItem);
  });
};

const parseJSONFile = async (file) => {
  return new Promise((resolve, _) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => resolve(JSON.parse(event.target.result));
    fileReader.readAsText(file);
  });
};

const userListBuilder = async (file) => {
  const json = await parseJSONFile(file);
  const list = json[Object.keys(json)[0]];
  return list.map((user) => user.string_list_data[0].value);
};

const fileValidator = (followingFile, followersFile) => {
  if (!followingFile) {
    return [false, 'Following input should include a file'];
  }
  if (!(followingFile.name === 'following.json')) {
    return [false, `-${followingFile.name}- should be "following.json"`];
  }
  if (!followersFile) {
    return [false, 'Followers input should include a file'];
  }
  if (!(followersFile.name === 'followers.json')) {
    return [false, `-${followersFile.name}- should be "followers.json"`];
  }
  return [true, 'File is valid'];
};

formJSON.addEventListener('submit', async (event) => {
  event.preventDefault();
  const followingFile = event.currentTarget.followingfile.files[0];
  const followersFile = event.currentTarget.followersfile.files[0];
  const [isFileValid, error] = fileValidator(followingFile, followersFile);
  if (!isFileValid) {
    alert(error);
    return;
  }
  const followingList = await userListBuilder(followingFile);
  const followersList = await userListBuilder(followersFile);
  const nonFollowersList = followingList.filter((user) => !followersList.includes(user));
  usersPrinter(nonFollowersList);
});
