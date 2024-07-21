import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createRoot } from 'react-dom/client';
import { App } from '../ui/App';

Meteor.startup(() => {
  Meteor.subscribe('communities');
  Meteor.subscribe('people');

  const root = createRoot(document.getElementById('app'));
  root.render(<App />);
});
