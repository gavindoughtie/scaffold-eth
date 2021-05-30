import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Buckets, PrivateKey } from '@textile/hub';
import React from 'react';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import ReactDOM from 'react-dom';
import App from './App';
import { generateKeyText } from './helpers';
import './index.css';

const getIdentity = async () => {
  // : Promise<PrivateKey>
  /** Restore any cached user identity first */
  const cached = localStorage.getItem('user-private-identity');
  if (cached !== null) {
    /** Convert the cached identity string to a PrivateKey and return */
    return PrivateKey.fromString(cached);
  }
  /** No cached identity existed, so create a new one */
  const identity = await PrivateKey.fromRandom();
  /** Add the string copy to the cache */
  localStorage.setItem('user-private-identity', identity.toString());
  /** Return the random identity */
  return identity;
};

const setup = async (key, identity) => {
  // Use the insecure key to set up the buckets client
  const buckets = await Buckets.withKeyInfo(key);
  // Authorize the user and your insecure keys with getToken
  await buckets.getToken(identity);

  const result = await buckets.open('io.textile.dropzone');
  if (!result.root) {
    throw new Error('Failed to open bucket');
  }
  return {
    buckets: buckets,
    bucketKey: result.root.key,
  };
};

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`,
};

const prevTheme = window.localStorage.getItem('theme');

const subgraphUri = 'http://localhost:8000/subgraphs/name/scaffold-eth/your-contract';

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

async function init() {
  const identity = await getIdentity();
  const textileKey = 'bbaareigmdhkj3shaald5ju7h2e7te5n4z2fhjpu6gehisvokh65m6v4idm'; // ??
  await setup(textileKey, identity);
  const keytext = await generateKeyText();
  ReactDOM.render(
    <ApolloProvider client={client}>
      <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme || 'light'}>
        <App subgraphUri={subgraphUri} keytext={keytext} />
      </ThemeSwitcherProvider>
    </ApolloProvider>,
    document.getElementById('root')
  );
}

init();
