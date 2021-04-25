const { main } = require('./avoid-yandex-turbo.user');

describe('Avoid Yandex Turbo', () => {
  const defaultLocation = window.location;

  const prepareLocationWithURL = url => {
    delete top.location;
    const location = new URL(url);
    location.replace = jest.fn();
    top.location = location;
  };

  afterAll(() => {
    window.location = defaultLocation;
  });

  describe('Should redirect', () => {
    it('yandex with "/turbo/*/s/"', () => {
      const url = 'https://yandex.ru/turbo/target.com/s/path/to/smth';
      const target = '//target.com/path/to/smth';
      prepareLocationWithURL(url);

      main();

      expect(location.replace).toBeCalledWith(target);
    });

    it('yandex with "/turbo?text="', () => {
      const url = 'https://yandex.ru/turbo?text=https://target.com/path/to/smth';
      const target = 'https://target.com/path/to/smth';
      prepareLocationWithURL(url);

      main();

      expect(location.replace).toBeCalledWith(target);
    });

    it('turbopages.org with "/turbo/*/s/"', () => {
      const url = 'https://target-com.turbopages.org/turbo/target.com/s/path/to/smth';
      const target = '//target.com/path/to/smth';
      prepareLocationWithURL(url);

      main();

      expect(location.replace).toBeCalledWith(target);
    });

    it('turbopages.org with "/s/"', () => {
      const url = 'https://target-com.turbopages.org/target.com/s/path/to/smth?turbo_uid=uid';
      const target = '//target.com/path/to/smth';
      prepareLocationWithURL(url);

      main();

      expect(location.replace).toBeCalledWith(target);
    });
  });

  describe('Should not redirect', () => {
    it('yandex main page', () => {
      const url = 'https://yandex.ru';
      prepareLocationWithURL(url);

      main();

      expect(location.replace).not.toBeCalled();
    });

    it('yandex search page', () => {
      const url = 'https://yandex.ru/search/?text=search';
      prepareLocationWithURL(url);

      main();

      expect(location.replace).not.toBeCalled();
    });

    it('yandex search page with "turbo" search term', () => {
      const url = 'https://yandex.ru/search/?text=turbo';
      prepareLocationWithURL(url);

      main();

      expect(location.replace).not.toBeCalled();
    });

    it('yandex search page with "turbo/s" search term', () => {
      const url = 'https://yandex.ru/search/?text=turbo/s';
      prepareLocationWithURL(url);

      main();

      expect(location.replace).not.toBeCalled();
    });

    it('yandex video preview', () => {
      const url = 'https://yandex.ru/video/preview/?text=text';
      prepareLocationWithURL(url);

      main();

      expect(location.replace).not.toBeCalled();
    });

    it('yandex health', () => {
      const url = 'https://yandex.ru/health/turbo/articles?id=0';
      prepareLocationWithURL(url);

      main();

      expect(location.replace).not.toBeCalled();
    });
  });
});
