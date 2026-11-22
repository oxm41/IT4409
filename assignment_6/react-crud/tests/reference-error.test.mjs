import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';

test('page-6 reference onClick setter runs during render and causes Too many re-renders', () => {
  function ReferenceBug() {
    const [adding, setAdding] = React.useState(false);
    return React.createElement('button', { onClick: setAdding(false) }, String(adding));
  }
  assert.throws(() => renderToString(React.createElement(ReferenceBug)), /Too many re-renders/);
});
