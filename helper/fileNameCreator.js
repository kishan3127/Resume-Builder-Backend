const formatDate = () => {
  const date = new Date();
  return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
};
function createLogFile(name) {
  return formatDate() + "_"+ name+".log";
}

module.exports = { createLogFile };