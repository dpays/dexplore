export default () => {
  return (scope, element, attrs) => {
    attrs.$observe('author', (value) => {
      if (value === '') {
        return;
      }
      let size = attrs.size || 'medium';

      element.css({
        'background-image': 'url(https://dsiteimages.com/u/' + value + '/avatar/' + size + ')'
      });
    });
  };
}
