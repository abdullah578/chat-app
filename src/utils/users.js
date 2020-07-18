const users = [];

const addUsers = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: "Username and room are required",
    };
  }

  const existingUser = users.find(
    (user) => user.username === username && user.room === room
  );
  if (existingUser) return { error: "Username is in use" };

  const user = { username, id, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
};

const getUsers = (id) => {
  return users.find((user) => user.id === id);
};
const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room.trim().toLowerCase());
};

module.exports = {
  addUsers,
  removeUser,
  getUsers,
  getUsersInRoom,
};
