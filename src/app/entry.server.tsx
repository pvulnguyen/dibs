import {createReadableStreamFromReadable} from '@remix-run/node';
import {RemixServer} from '@remix-run/react';
import {createInstance} from 'i18next';
import Backend from 'i18next-http-backend';
import {isbot} from 'isbot';
import {resolve} from 'node:path';
import {PassThrough} from 'node:stream';
import {renderToPipeableStream} from 'react-dom/server';
import {I18nextProvider, initReactI18next} from 'react-i18next';
import {getI18nConfig} from '~/i18n/configuration';
import {i18next} from '~/i18n/server';

import type {EntryContext} from '@remix-run/node';
import type {InitOptions} from 'i18next';

const ABORT_DELAY = 5_000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const callbackName = isbot(request.headers.get('user-agent')) ? 'onAllReady' : 'onShellReady';

  const lng = await i18next.getLocale(request);
  const ns = i18next.getRouteNamespaces(remixContext);

  const instance = createInstance();
  await instance
    .use(initReactI18next)
    .use(Backend)
    .init({
      ...getI18nConfig(),
      lng,
      ns,
      backend: {loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json')},
    } satisfies InitOptions);

  return new Promise((resolve, reject) => {
    let didError = false;

    const {pipe, abort} = renderToPipeableStream(
      <I18nextProvider i18n={instance}>
        <RemixServer context={remixContext} url={request.url} />
      </I18nextProvider>,
      {
        [callbackName]: () => {
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set('Content-Type', 'text/html');

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError: (error: unknown) => {
          reject(error);
        },
        onError: (error: unknown) => {
          didError = true;
          console.error(error);
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
