import { main } from './avoid-yandex-turbo';

describe('Avoid Yandex Turbo', () => {
  const defaultLocation = window.location;

  const prepareLocationWithURL = (url: string): void => {
    // Using Object.defineProperty to safely mock window.location and top.location
    const mockLocation = new URL(url) as unknown as Location;
    mockLocation.replace = jest.fn();

    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
      configurable: true,
    });
  };

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      value: defaultLocation,
      writable: true,
      configurable: true,
    });
  });

  describe('Should redirect', () => {
    describe('Yandex', () => {
      it('yandex with "/turbo/*/s/"', () => {
        const url = 'https://yandex.ru/turbo/target.com/s/path/to/smth';
        const target = '//target.com/path/to/smth';
        prepareLocationWithURL(url);

        main();

        expect(window.location.replace).toHaveBeenCalledWith(target);
      });

      it('yandex with "/turbo?text="', () => {
        const url = 'https://yandex.ru/turbo?text=https://target.com/path/to/smth';
        const target = 'https://target.com/path/to/smth';
        prepareLocationWithURL(url);

        main();

        expect(window.location.replace).toHaveBeenCalledWith(target);
      });
    });

    describe('Turbopages', () => {
      it('turbopages.org with "/turbo/*/s/"', () => {
        const url = 'https://target-com.turbopages.org/turbo/target.com/s/path/to/smth';
        const target = '//target.com/path/to/smth';
        prepareLocationWithURL(url);

        main();

        expect(window.location.replace).toHaveBeenCalledWith(target);
      });

      it('turbopages.org with "/s/"', () => {
        const url = 'https://target-com.turbopages.org/target.com/s/path/to/smth?turbo_uid=uid';
        const target = '//target.com/path/to/smth';
        prepareLocationWithURL(url);

        main();

        expect(window.location.replace).toHaveBeenCalledWith(target);
      });
    });
  });

  describe('Should not redirect', () => {
    it('yandex main page', () => {
      const url = 'https://yandex.ru';
      prepareLocationWithURL(url);

      main();

      expect(window.location.replace).not.toHaveBeenCalled();
    });

    it('yandex search page', () => {
      const url = 'https://yandex.ru/search/?text=search';
      prepareLocationWithURL(url);

      main();

      expect(window.location.replace).not.toHaveBeenCalled();
    });

    it('yandex search page with "turbo" search term', () => {
      const url = 'https://yandex.ru/search/?text=turbo';
      prepareLocationWithURL(url);

      main();

      expect(window.location.replace).not.toHaveBeenCalled();
    });

    it('yandex search page with "turbo/s" search term', () => {
      const url = 'https://yandex.ru/search/?text=turbo/s';
      prepareLocationWithURL(url);

      main();

      expect(window.location.replace).not.toHaveBeenCalled();
    });

    it('yandex video preview', () => {
      const url = 'https://yandex.ru/video/preview/?text=text';
      prepareLocationWithURL(url);

      main();

      expect(window.location.replace).not.toHaveBeenCalled();
    });

    it('yandex health', () => {
      const url = 'https://yandex.ru/health/turbo/articles?id=0';
      prepareLocationWithURL(url);

      main();

      expect(window.location.replace).not.toHaveBeenCalled();
    });

    it('yandex health turbo inline', () => {
      const url =
        'https://yandex.ru/turbo?text=https%3A%2F%2Fhealth.yandex.ru%2Fdiseases%2Fdisease';
      prepareLocationWithURL(url);

      main();

      expect(window.location.replace).not.toHaveBeenCalled();
    });
  });
});
