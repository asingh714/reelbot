export const createTokenUser = (user) => {
  const { id, username, email } = user;

  return { id, username, email };
};
