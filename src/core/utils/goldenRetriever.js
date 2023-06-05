let retrieverWord;

const LIST_RETRIEVERS = [
  'https://avatars.mds.yandex.net/i?id=29757a0d6dd85a3a06ea309a35f4dd61470feaa3-7760813-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=add425be989968c9ed90484c38fdd251d5f84d96-5238639-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=4ad0ab2d7810b9fe6684f6010513f4c5b1457f52-4553435-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=951a27bdbc5badd29a1bdff1dcc4da816b37e439-8209530-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=a889cd02c0fca486364cb77e36b7f9f11d012771-8312257-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=94cf2c071204f38b69f4585983136b63ef62edce-4613040-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=d8ab314f4a74e94f4cb8e35006f4116f-4078141-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=f89a09c5db5fd31ae004ae7c17e6acd6-5101651-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=39f6bcfb10107e52e3e01a5ebe3049751453d4d7-5252657-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=a578e70e62ed43eb3a56f4a9e32751345e9e9ca8-8491894-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=c150eb4a252279ec285f29907ea6566ae394f1b5-8769591-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=0800cd5d4b998600d2c2d34a16c3c022bd3a3ebb-8497136-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=ef692a28351dfe0699b69013f7d26d54aac3b2ec-5235413-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=6d007fbfd8659a04c67379f5785174f58dcba596-8181332-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=e7d1e6bffa53aa5695d03439eabe898fd99787ea-8371311-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=a889cd02c0fca486364cb77e36b7f9f11d012771-8312257-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=66958fed0fa923f698317008abfe959b6ad17982-8494072-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=be8e2ed0e6f984570d703b4f29a90cba0e129830-9065879-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=6e6884718f940258971f03b10fada3b3c630ed9d-7761683-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=cc05f3ee544095c0ab1ba86dd5cb744304892a80-9211743-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=6b146f80327f04405653b6320b6cddc4-4297303-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=d6c2dcc1c724cb2140f7df80b7ce5dad-5231671-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=592d07eaa324a25dd68e160a81241074c5546881-8496994-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=d9aa63bcbcfb0274b7ba9efae32e29ba-4457909-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=35770cef50bed8cd91f94f2baf63096e-5502450-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=7b5ad3dfc73cd5f69696caa2d789d92e75bad0f0-9222726-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=2efaec6cd35db54b4c939113fb869967ad494de2-8498056-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=7b7150c11e077c26112672167d5313fa1cd4d5d4-7753970-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=f4a414ec05e5b5ebadc21b2ca8eea5b92ac76623-4101447-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=7b5ad3dfc73cd5f69696caa2d789d92e75bad0f0-9222726-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=e4e2d733918529f80ab4ff15b02b3ae9e909794e-9042386-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=ed4bf6e50bfbb3ed3adcc66826b4752a630939c2-7094423-images-thumbs&n=13',
];

function randomNum(min, max) {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

console.log(randomNum(1, 3));

function getInputRetriever() {
  return `
  <form class="menu__retriever">
  <label class="menu__retriever" for="menu__retriever">
  Введите кодовое слово:
  </label>
  <input class="menu__retriever__input" type="text" id="menu__retriever" name="retriever" oninput="getRetriever(event)"
</form>
  `;
}

function getRetriever(event) {
  const { target } = event;
  retrieverWord = target.value.trim();
}

function startRetrieverTheme() {
  if (retrieverWord === 'Elena Vuster') {
    localStorageService.set(retrieverTheme, true);
  } else if (retrieverWord === 'Cancel') {
    localStorageService.remove(retrieverTheme);
  }
  location.reload();
}
