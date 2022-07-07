import { isMaxLengthValid } from './util.js';

const HASHTAG_MAX_COUNT = 5;
const COMMENT_MAX_LENGTH = 140;

// Список возможных ошибок валидации
const ErrorMessage = {
  HASHTAG_FORMAT: 'Хэштеги не соответствуют формату',
  HASHTAG_COUNT: `Вы не можете указать больше ${HASHTAG_MAX_COUNT} хэштегов`,
  HASHTAG_DUPLICATION: 'Один и тот же хэш-тег не может быть использован дважды',
  COMMENT_LENGTH: `Длина комментария не может составлять больше ${COMMENT_MAX_LENGTH} символов`,
};

const formElement = document.querySelector('#upload-select-image');
const hashtagsFieldElement = formElement.querySelector('[name="hashtags"]');
const commentFieldElement = formElement.querySelector('[name="description"]');

// Получить массив хэштегов из строки
const getHashtagsFromField = (string) => {
  string = string.trim();

  if (string.length === 0) {
    return [];
  }

  return string.split(' ');
};

const hashtagRegExp = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;
// Проверяет, является ли один хэштег валидным
const isValidHashtag = (value) => hashtagRegExp.test(value);

// Проверяет, являются ли все хэштеги в строке валидными
const isValidHashtags = (value) => {
  const hashtags = getHashtagsFromField(value);

  return hashtags.every((hashtag) => isValidHashtag(hashtag));
};

// Проверяет, является ли количество хэштегов валидным
const isValidHashtagsCount = (value) => {
  const hashtags = getHashtagsFromField(value);

  return (hashtags.length <= HASHTAG_MAX_COUNT);
};

// Проверяет, дублируются ли хэштеги
const isHashtagsUnique = (value) => {
  const hashtags = getHashtagsFromField(value);
  const lowercaseHashtags = hashtags.map((hashtag) => hashtag.toLowerCase());
  const set = new Set(lowercaseHashtags);

  return (set.size === lowercaseHashtags.length);
};

// Инициализация Pristine
const pristine = new Pristine(formElement, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'has-danger',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'form-text-error' ,
}, false);

// Проверка на валидность формата хэштега
pristine.addValidator(
  hashtagsFieldElement,
  isValidHashtags,
  ErrorMessage.HASHTAG_FORMAT
);

// Проверка на валидность кол-ва хэштегов
pristine.addValidator(
  hashtagsFieldElement,
  isValidHashtagsCount,
  ErrorMessage.HASHTAG_COUNT
);

// Проверка на дублирование хэштегов
pristine.addValidator(
  hashtagsFieldElement,
  isHashtagsUnique,
  ErrorMessage.HASHTAG_DUPLICATION
);

// Проверка на валидность максимальной длины комментария
pristine.addValidator(
  commentFieldElement,
  (value) => isMaxLengthValid(value, COMMENT_MAX_LENGTH),
  ErrorMessage.COMMENT_LENGTH
);

// Обработчик события отправки формы
formElement.addEventListener('submit', (event) => {
  event.preventDefault();

  const isValid = pristine.validate();

  if (isValid) {
    formElement.submit();
  }
});

// Сбросить результаты валидации формы
const resetValidator = () => {
  pristine.reset();
};

export { resetValidator };
