const get_token = async (request: any) => {
  const token = request.header("Authorization");
  return token;
};
export default get_token;
