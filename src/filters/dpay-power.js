export default ($rootScope) => {
  const fn = (input) => {
    if (!input) {
      return '';
    }

    return (Number(input.split(" ")[0]) / 1e6 * $rootScope.dpayPerMVests).toFixed(3);
  };

  fn.$stateful = true;
  return fn;
}
