const generateUID = () => {
  const charset = "0123456789";
  let uid = "";

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    uid += charset.charAt(randomIndex);
  }

  return uid;
};

export default generateUID;
